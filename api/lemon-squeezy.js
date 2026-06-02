import crypto from 'crypto';

// Disabilita il body parser predefinito di Vercel per poter leggere il raw body
// e validare correttamente la firma di Lemon Squeezy.
export const config = {
  api: {
    bodyParser: false,
  },
};

async function getRawBody(req) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

export default async function handler(req, res) {
  // Questo è un webhook server-to-server di Lemon Squeezy, validato via firma HMAC:
  // i CORS del browser non servono. Manteniamo solo la gestione del metodo.
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const webhookSecret = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error('LEMON_SQUEEZY_WEBHOOK_SECRET is not configured on Vercel.');
    return res.status(500).json({ error: 'Webhook secret not configured on server.' });
  }

  const supabaseUrl = process.env.SUPABASE_URL || 'https://eygjcollweybbgyasnsa.supabase.co';
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseKey) {
    console.error('SUPABASE_SERVICE_ROLE_KEY is not configured on Vercel.');
    return res.status(500).json({ error: 'Database service key not configured on server.' });
  }

  try {
    // 1. Leggi il raw body per la validazione crittografica della firma
    const rawBody = await getRawBody(req);
    const signature = req.headers['x-signature'];

    if (!signature) {
      return res.status(401).json({ error: 'Missing x-signature header.' });
    }

    // Verifica la firma HMAC SHA256 di Lemon Squeezy
    const hmac = crypto.createHmac('sha256', webhookSecret);
    const digest = hmac.update(rawBody).digest('hex');

    // Hardening: una firma di lunghezza errata farebbe lanciare timingSafeEqual (500).
    // Confrontiamo prima la lunghezza e restituiamo 401 in modo controllato.
    const digestBuf = Buffer.from(digest, 'hex');
    let signatureBuf;
    try {
      signatureBuf = Buffer.from(String(signature), 'hex');
    } catch {
      return res.status(401).json({ error: 'Malformed signature.' });
    }
    if (digestBuf.length !== signatureBuf.length || !crypto.timingSafeEqual(digestBuf, signatureBuf)) {
      console.warn('Webhook signature verification failed.');
      return res.status(401).json({ error: 'Invalid signature.' });
    }

    // 2. Parsifica il corpo della richiesta
    const body = JSON.parse(rawBody.toString('utf8'));
    const eventName = req.headers['x-event-name'] || body.meta?.event_name;
    
    console.log(`[Lemon Squeezy] Ricevuto evento: ${eventName}`);

    const attributes = body.data?.attributes;
    if (!attributes) {
      return res.status(400).json({ error: 'Missing payload data attributes.' });
    }

    // Estrai email dell'utente, ID cliente e ID sottoscrizione
    const email = (attributes.user_email || attributes.customer_email || '').toLowerCase().trim();
    const customerId = String(attributes.customer_id || '');
    const customerPortalUrl = attributes.urls?.customer_portal || '';
    // user_id passato come custom data nel checkout (checkout[custom][user_id]) — match affidabile pagamento→account
    const customUserId = body.meta?.custom_data?.user_id || null;

    if (!email) {
      console.warn('Skipping event: no customer email found in attributes.');
      return res.status(200).json({ success: true, message: 'Skipped: email is empty.' });
    }

    // Aggiorniamo esclusivamente l'email reale dell'ordine (nessuna duplicazione su email di test).
    const emailsToUpdate = [email];

    let isSubscribed = false;
    let tier = 'monthly';
    let subscriptionId = '';

    const productName = (attributes.product_name || '').toLowerCase();
    
    // Determina il tier dell'abbonamento in base al nome del prodotto
    if (productName.includes('annual') || productName.includes('annuale') || productName.includes('yearly')) {
      tier = 'yearly';
    } else if (productName.includes('lifetime') || productName.includes('vita') || productName.includes('sempre')) {
      tier = 'lifetime';
    }

    // 3. Gestisci i diversi eventi
    if (eventName.startsWith('subscription_')) {
      subscriptionId = String(body.data.id || '');
      const status = attributes.status; // 'active','on_trial','past_due','cancelled','expired','unpaid','paused'
      const endsAt = attributes.ends_at;

      // Attivo se status active/on_trial/past_due (past_due = retry pagamento, grace period),
      // oppure se cancelled ma non ancora scaduto (endsAt futuro: l'utente ha pagato fino a fine periodo).
      const isActiveStatus = ['active', 'on_trial', 'past_due'].includes(status);
      const isCancelledButActive = status === 'cancelled' && endsAt && (new Date(endsAt) > new Date());

      isSubscribed = isActiveStatus || isCancelledButActive;

      // Un rimborso del pagamento dell'abbonamento revoca immediatamente l'accesso.
      if (eventName === 'subscription_payment_refunded') {
        isSubscribed = false;
      }

      console.log(`[Lemon Squeezy Webhook] Sub: ${subscriptionId} | Status: ${status} | Active: ${isSubscribed}`);

    } else if (eventName === 'order_created') {
      subscriptionId = String(body.data.id || '');
      const status = attributes.status; // 'paid', 'pending', 'failed', 'refunded'

      // IMPORTANTE: NON dedurre "lifetime" dallo status "paid".
      // Anche gli abbonamenti (monthly/yearly) generano un order_created: quegli ordini sono gestiti
      // ESCLUSIVAMENTE dagli eventi subscription_*. Qui attiviamo SOLO i veri acquisti one-time (Lifetime),
      // riconosciuti dal product_name (tier === 'lifetime'). Così un abbonato mensile non diventa "lifetime".
      if (status === 'paid' && tier === 'lifetime') {
        isSubscribed = true;
      } else {
        return res.status(200).json({
          success: true,
          message: `Order non-lifetime (tier=${tier}, status=${status}): gestito dagli eventi subscription_*.`
        });
      }

      console.log(`[Lemon Squeezy Webhook] Order Lifetime: ${subscriptionId} | Status: ${status} | Active: ${isSubscribed}`);

    } else if (eventName === 'order_refunded') {
      // Rimborso di un acquisto one-time (es. Lifetime): revoca l'accesso (anti-frode acquisto+rimborso).
      subscriptionId = String(body.data.id || '');
      isSubscribed = false;
      console.log(`[Lemon Squeezy Webhook] Order Refunded: ${subscriptionId} -> accesso revocato`);

    } else {
      // Ignora altri eventi irrilevanti per lo sblocco dell'accesso
      return res.status(200).json({ success: true, message: `Ignored unhandled event: ${eventName}` });
    }

    // 4. Esegui l'upsert del record di sottoscrizione su Supabase per tutte le email collegate (es. gestione inversioni test)
    for (const targetEmail of emailsToUpdate) {
      const checkRes = await fetch(`${supabaseUrl}/rest/v1/subscriptions?email=eq.${encodeURIComponent(targetEmail)}`, {
        method: 'GET',
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`
        }
      });

      if (!checkRes.ok) {
        const errorText = await checkRes.text();
        console.error(`[Supabase Error] Fallita verifica dell'esistenza per ${targetEmail}: ${errorText}`);
        continue;
      }

      const existingRecords = await checkRes.json();
      const recordExists = existingRecords && existingRecords.length > 0;

      let response;
      if (recordExists) {
        console.log(`[Supabase Sync] Record trovato per ${targetEmail}. Eseguo l'UPDATE (PATCH)...`);
        response = await fetch(`${supabaseUrl}/rest/v1/subscriptions?email=eq.${encodeURIComponent(targetEmail)}`, {
          method: 'PATCH',
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            is_subscribed: isSubscribed,
            subscription_tier: tier,
            subscription_id: subscriptionId,
            customer_id: customerId,
            customer_portal_url: customerPortalUrl,
            // Collega l'account solo se l'user_id è arrivato dal checkout (non sovrascrivere con null)
            ...(customUserId ? { user_id: customUserId } : {}),
            updated_at: new Date().toISOString()
          })
        });
      } else {
        // Se non stiamo sbloccando (es. rimborso/revoca) e non esiste alcun record, non creiamo righe inutili
        if (!isSubscribed) {
          continue;
        }
        console.log(`[Supabase Sync] Nessun record trovato per ${targetEmail}. Eseguo l'INSERT (POST)...`);
        response = await fetch(`${supabaseUrl}/rest/v1/subscriptions`, {
          method: 'POST',
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: targetEmail,
            is_subscribed: isSubscribed,
            subscription_tier: tier,
            subscription_id: subscriptionId,
            customer_id: customerId,
            customer_portal_url: customerPortalUrl,
            ...(customUserId ? { user_id: customUserId } : {}),
            updated_at: new Date().toISOString()
          })
        });
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`[Supabase Error] Fallito upsert della sottoscrizione per ${targetEmail}: ${errorText}`);
      } else {
        console.log(`[Supabase Sync] Sottoscrizione salvata con successo per ${targetEmail} (Tier: ${tier}, Attivo: ${isSubscribed})`);
      }
    }

    return res.status(200).json({ success: true, email, tier, isSubscribed });

  } catch (error) {
    console.error('Unhandled webhook error:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}

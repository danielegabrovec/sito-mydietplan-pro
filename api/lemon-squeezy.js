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
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-signature');

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

    if (!crypto.timingSafeEqual(Buffer.from(digest, 'hex'), Buffer.from(signature, 'hex'))) {
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
    
    if (!email) {
      console.warn('Skipping event: no customer email found in attributes.');
      return res.status(200).json({ success: true, message: 'Skipped: email is empty.' });
    }

    // Gestione speciale inversioni e-mail di test (gabrovec.daniele@ vs daniele.gabrovec@)
    const emailsToUpdate = [email];
    if (email === 'daniele.gabrovec@gmail.com') {
      emailsToUpdate.push('gabrovec.daniele@gmail.com');
    } else if (email === 'gabrovec.daniele@gmail.com') {
      emailsToUpdate.push('daniele.gabrovec@gmail.com');
    }

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
      const status = attributes.status; // 'active', 'on_trial', 'cancelled', 'expired', 'unpaid', 'paused'
      const endsAt = attributes.ends_at;

      // Un abbonamento è attivo se lo status è active/on_trial, 
      // oppure se è cancelled ma non è ancora giunto alla data di scadenza (endsAt)
      const isActiveStatus = ['active', 'on_trial'].includes(status);
      const isCancelledButActive = status === 'cancelled' && endsAt && (new Date(endsAt) > new Date());
      
      isSubscribed = isActiveStatus || isCancelledButActive;
      
      console.log(`[Lemon Squeezy Webhook] Sub: ${subscriptionId} | Status: ${status} | Active: ${isSubscribed}`);
      
    } else if (eventName === 'order_created') {
      subscriptionId = String(body.data.id || '');
      const status = attributes.status; // 'paid', 'pending', 'failed', 'refunded'
      
      // Gli ordini una-tantum (come il piano Lifetime) determinano l'attivazione immediata se pagati
      if (status === 'paid') {
        isSubscribed = true;
        tier = 'lifetime';
      }
      
      console.log(`[Lemon Squeezy Webhook] Order: ${subscriptionId} | Status: ${status} | Active: ${isSubscribed}`);
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
            updated_at: new Date().toISOString()
          })
        });
      } else {
        // Se non esiste il record per l'email invertita secondaria, lo creiamo solo se stiamo sbloccando
        if (targetEmail !== email && !isSubscribed) {
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

export default async function handler(req, res) {
  // CORS ristretti: l'app autentica via Bearer token (non cookie), quindi niente credenziali.
  const defaultOrigins = [
    'https://mydietplan-green.vercel.app',
    'https://midietplan-pro.vercel.app',
    'http://localhost:3000',
    'http://localhost:3001'
  ];
  const allowedOrigins = (process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',').map(s => s.trim())
    : defaultOrigins);
  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const supabaseUrl = process.env.SUPABASE_URL || 'https://eygjcollweybbgyasnsa.supabase.co';
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const lemonSqueezyApiKey = process.env.LEMON_SQUEEZY_API_KEY;

  if (!supabaseKey) {
    console.error('SUPABASE_SERVICE_ROLE_KEY is not configured on Vercel.');
    return res.status(500).json({ error: 'Database service key not configured on server.' });
  }

  // 1. Leggi i parametri del body
  let email;
  try {
    // Gestione del body (può arrivare come stringa o già come oggetto)
    let bodyObj = req.body;
    if (typeof bodyObj === 'string') {
      bodyObj = JSON.parse(bodyObj);
    }
    email = (bodyObj.email || '').toLowerCase().trim();
  } catch (err) {
    return res.status(400).json({ error: 'Invalid request body JSON.' });
  }

  if (!email) {
    return res.status(400).json({ error: 'Email is required.' });
  }

  // 2. Verifica l'autenticazione tramite Supabase Auth JWT
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Missing Authorization header.' });
  }

  try {
    const authResponse = await fetch(`${supabaseUrl}/auth/v1/user`, {
      headers: {
        'Authorization': authHeader,
        'apikey': supabaseKey
      }
    });

    if (!authResponse.ok) {
      return res.status(401).json({ error: 'Invalid or expired authentication token.' });
    }

    const userData = await authResponse.json();
    const authenticatedEmail = (userData.email || '').toLowerCase().trim();

    if (authenticatedEmail !== email) {
      return res.status(403).json({ error: 'You are not authorized to cancel a subscription for this email.' });
    }

    // 3. Recupera la sottoscrizione attiva dal database Supabase
    const dbResponse = await fetch(`${supabaseUrl}/rest/v1/subscriptions?email=eq.${encodeURIComponent(email)}`, {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      }
    });

    if (!dbResponse.ok) {
      const errorText = await dbResponse.text();
      console.error(`[Supabase Error] Fallito recupero sottoscrizione: ${errorText}`);
      return res.status(500).json({ error: 'Failed to query active subscription from database.' });
    }

    const subscriptions = await dbResponse.json();
    if (!subscriptions || subscriptions.length === 0) {
      return res.status(200).json({ success: true, cancelled: false, nothingToCancel: true, message: 'No subscription record found in database.' });
    }

    const subscription = subscriptions[0];
    const subscriptionId = subscription.subscription_id;
    const isSubscribed = subscription.is_subscribed;
    const tier = subscription.subscription_tier;

    // 'lifetime' e 'tester' non hanno fatturazione ricorrente: non c'è nulla da disdire.
    if (!isSubscribed || !subscriptionId || tier === 'tester' || tier === 'lifetime') {
      return res.status(200).json({
        success: true,
        cancelled: false,
        nothingToCancel: true,
        message: 'No active recurring paid subscription to cancel.'
      });
    }

    // 4. Annulla l'abbonamento su Lemon Squeezy tramite API
    if (!lemonSqueezyApiKey) {
      // Errore esplicito (NON un finto successo): il client deve sapere che la disdetta NON è avvenuta.
      console.error('[Lemon Squeezy] LEMON_SQUEEZY_API_KEY non configurata: impossibile annullare automaticamente.');
      return res.status(503).json({
        error: 'Servizio di cancellazione non configurato (API key mancante). Abbonamento NON annullato. Contatta il supporto o usa il portale di fatturazione.',
        cancelled: false,
        subscriptionId
      });
    }

    console.log(`[Lemon Squeezy] Tentativo di cancellazione per sub ID: ${subscriptionId} (${email})`);

    const lsResponse = await fetch(`https://api.lemonsqueezy.com/v1/subscriptions/${subscriptionId}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/vnd.api+json',
        'Authorization': `Bearer ${lemonSqueezyApiKey}`
      }
    });

    if (!lsResponse.ok) {
      const lsError = await lsResponse.text();
      console.error(`[Lemon Squeezy Error] Cancellazione fallita: ${lsError}`);
      return res.status(502).json({
        error: 'Failed to cancel subscription on Lemon Squeezy.',
        cancelled: false,
        details: lsError
      });
    }

    console.log(`[Lemon Squeezy] Abbonamento ${subscriptionId} cancellato con successo su Lemon Squeezy.`);

    // 5. Revoca immediata lato DB: imposta is_subscribed=false su Supabase.
    // Importante per il flusso "elimina account": se la riga ha user_id=null non verrebbe
    // eliminata a cascata, quindi resterebbe un record "attivo" orfano. Qui la revochiamo.
    try {
      const updateRes = await fetch(`${supabaseUrl}/rest/v1/subscriptions?email=eq.${encodeURIComponent(email)}`, {
        method: 'PATCH',
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ is_subscribed: false, updated_at: new Date().toISOString() })
      });
      if (!updateRes.ok) {
        console.error(`[Supabase] Impossibile aggiornare is_subscribed=false: ${await updateRes.text()}`);
      }
    } catch (dbErr) {
      console.error('[Supabase] Errore aggiornamento post-cancellazione:', dbErr);
    }

    return res.status(200).json({
      success: true,
      cancelled: true,
      message: 'Subscription successfully cancelled on Lemon Squeezy.'
    });

  } catch (error) {
    console.error('Unhandled cancel-subscription error:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}

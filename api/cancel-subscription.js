export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
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
      return res.status(200).json({ success: true, message: 'No subscription record found in database.' });
    }

    const subscription = subscriptions[0];
    const subscriptionId = subscription.subscription_id;
    const isSubscribed = subscription.is_subscribed;
    const tier = subscription.subscription_tier;

    if (!isSubscribed || !subscriptionId || tier === 'tester') {
      return res.status(200).json({ success: true, message: 'No active recurring paid subscription to cancel.' });
    }

    // 4. Annulla l'abbonamento su Lemon Squeezy tramite API
    if (!lemonSqueezyApiKey) {
      console.warn('[Lemon Squeezy] LEMON_SQUEEZY_API_KEY non configurata. Salto la cancellazione automatica su Lemon Squeezy.');
      return res.status(200).json({ 
        success: true, 
        warning: 'Subscription could not be cancelled automatically because API key is missing. Please manage manually.',
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
      return res.status(500).json({ 
        error: 'Failed to cancel subscription on Lemon Squeezy.',
        details: lsError 
      });
    }

    console.log(`[Lemon Squeezy] Abbonamento ${subscriptionId} cancellato con successo su Lemon Squeezy.`);
    return res.status(200).json({ 
      success: true, 
      message: 'Subscription successfully cancelled on Lemon Squeezy.' 
    });

  } catch (error) {
    console.error('Unhandled cancel-subscription error:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}

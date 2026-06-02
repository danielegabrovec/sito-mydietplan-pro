export default async function handler(req, res) {
  // CORS ristretti agli origin noti (sito + web-app + dev locale).
  const defaultOrigins = [
    'https://midietplan-pro.vercel.app',
    'https://mydietplan-green.vercel.app',
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
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ 
      error: 'RESEND_API_KEY is not configured. Please add it to your Vercel Environment Variables.' 
    });
  }

  // Dynamic destination email (defaults to your Resend account owner email)
  const destinationEmail = process.env.TO_EMAIL || 'daniele.gabrovec@gmail.com';
  // Mittente configurabile: usa un dominio verificato in produzione per non finire in SPAM.
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'MyDietPlan Pro <onboarding@resend.dev>';
  const { subject, html, text } = req.body || {};

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        from: fromEmail,
        to: destinationEmail,
        subject: subject || 'Nuovo Messaggio dal Sito MyDietPlan Pro',
        html: html || `<p>Messaggio vuoto</p>`,
        text: text || 'Messaggio vuoto'
      })
    });

    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({ error: data });
    }

    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}

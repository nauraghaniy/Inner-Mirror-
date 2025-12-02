// Simple Vercel Serverless function that proxies a prompt to your GenAI endpoint.
// Save as /api/generate.js

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { prompt, options } = req.body || {};
    if (!prompt) return res.status(400).json({ error: 'Missing "prompt" in body' });

    const GENAI_URL = process.env.GENAI_API_URL; // set this in Vercel
    const GENAI_KEY = process.env.GENAI_API_KEY; // set this in Vercel

    if (!GENAI_URL || !GENAI_KEY) {
      return res.status(500).json({ error: 'GenAI config not set on server' });
    }

    // Example generic POST to your GenAI endpoint. Adjust body to match the API you call.
    const response = await fetch(GENAI_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Many Google APIs use "Authorization: Bearer <token>" for OAuth tokens. If you have an API key,
        // some endpoints accept ?key=YOUR_KEY instead of Authorization header. Use whichever the API expects.
        'Authorization': `Bearer ${GENAI_KEY}`
      },
      body: JSON.stringify({
        // adapt this payload to the exact Gemini / GenAI REST body shape
        prompt,
        ...options
      })
    });

    const data = await response.json();
    return res.status(response.ok ? 200 : 500).json(data);
  } catch (err) {
    console.error('GenAI proxy error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

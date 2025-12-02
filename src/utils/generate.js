// Simple client helper to call /api/generate
export async function generateFromServer(prompt, options) {
  const res = await fetch('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, options })
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'GenAI request failed');
  }
  return res.json();
}

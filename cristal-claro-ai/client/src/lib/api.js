/**
 * API base: set VITE_API_URL in production (e.g. https://api.yourapp.com).
 * In dev, Vite proxies /api → http://localhost:4000 (see vite.config.js).
 */
export function apiUrl(path) {
  const p = path.startsWith('/') ? path : `/${path}`;
  const base = import.meta.env.VITE_API_URL?.replace(/\/$/, '');
  if (base) return `${base}${p}`;
  return `/api${p}`;
}

export async function postChat(messages) {
  const res = await fetch(apiUrl('/chat'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages }),
  });
  if (!res.ok) throw new Error('Chat request failed');
  return res.json();
}

export async function postLead(body) {
  const res = await fetch(apiUrl('/lead'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Lead failed');
  }
  return res.json();
}

export async function postBooking(body) {
  const res = await fetch(apiUrl('/booking'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Booking failed');
  }
  return res.json();
}

const cfg = window.__CONFIG__ || {};

export function saveToken(token) {
  localStorage.setItem('rr_token', token);
}

export function getToken() {
  return localStorage.getItem('rr_token');
}

export function clearToken() {
  localStorage.removeItem('rr_token');
}

export function authHeaders() {
  const t = getToken();
  return t ? { Authorization: `Bearer ${t}` } : {};
}

export async function login(username, password) {
  const res = await fetch(`${cfg.AUTH_BASE}/auth/login`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  if (!res.ok) throw new Error('Login failed');
  return res.json();
}

export function parseTokenRole() {
  const t = getToken();
  if (!t) return null;
  const parts = t.split('.');
  if (parts.length < 2) return null;
  try {
    const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
    return payload.role || payload.roles || null;
  } catch (e) { return null; }
}

export function requireRole(role) {
  const r = parseTokenRole();
  if (!r) return false;
  if (Array.isArray(r)) return r.includes(role);
  return r === role;
}

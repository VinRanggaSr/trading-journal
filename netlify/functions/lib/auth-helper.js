/**
 * Helper auth untuk semua Netlify Functions.
 * Bukan endpoint sendiri (nggak ada exports.handler) — cuma dipakai
 * oleh auth.js, sheets.js, price.js.
 */

const crypto = require('crypto');

function sign(value, secret) {
  return crypto.createHmac('sha256', secret).update(value).digest('hex');
}

// Bikin token session: "<expiry_timestamp>.<signature>"
function createSessionToken(secret, ttlMs) {
  const expiry = Date.now() + ttlMs;
  const sig = sign(String(expiry), secret);
  return `${expiry}.${sig}`;
}

// Cek token valid (signature cocok & belum expired)
function verifySessionToken(token, secret) {
  if (!token || !secret) return false;
  const parts = token.split('.');
  if (parts.length !== 2) return false;
  const [expiryStr, sig] = parts;
  const expected = sign(expiryStr, secret);
  if (sig !== expected) return false;
  return Date.now() < Number(expiryStr);
}

function parseCookies(cookieHeader) {
  const out = {};
  if (!cookieHeader) return out;
  cookieHeader.split(';').forEach((pair) => {
    const idx = pair.indexOf('=');
    if (idx === -1) return;
    const key = pair.slice(0, idx).trim();
    const value = pair.slice(idx + 1).trim();
    out[key] = decodeURIComponent(value);
  });
  return out;
}

// netlify dev jalan di http://localhost, jadi flag "Secure" harus dimatikan
// pas lokal (browser nolak simpan cookie Secure di koneksi non-https).
function isLocalDev() {
  return process.env.NETLIFY_DEV === 'true';
}

function buildSessionCookie(token, maxAgeSeconds) {
  const parts = [
    `tj_session=${token}`,
    'HttpOnly',
    'Path=/',
    'SameSite=Strict',
    `Max-Age=${maxAgeSeconds}`
  ];
  if (!isLocalDev()) parts.push('Secure');
  return parts.join('; ');
}

function clearSessionCookie() {
  const parts = ['tj_session=', 'HttpOnly', 'Path=/', 'SameSite=Strict', 'Max-Age=0'];
  if (!isLocalDev()) parts.push('Secure');
  return parts.join('; ');
}

function isAuthenticated(event) {
  const cookieHeader = event.headers.cookie || event.headers.Cookie;
  const cookies = parseCookies(cookieHeader);
  return verifySessionToken(cookies.tj_session, process.env.SESSION_SECRET);
}

module.exports = {
  createSessionToken,
  verifySessionToken,
  parseCookies,
  buildSessionCookie,
  clearSessionCookie,
  isAuthenticated
};

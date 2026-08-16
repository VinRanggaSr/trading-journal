/**
 * Endpoint: /api/sheets
 *
 * Proxy ke Google Apps Script Web App (Google Sheets backend).
 * Semua request harus sudah login (cek cookie session) - kalau belum,
 * ditolak 401 sebelum sempat manggil Apps Script.
 *
 * APPS_SCRIPT_SECRET diambil dari env var di sini (server-side),
 * jadi frontend/browser TIDAK PERNAH tahu secret ini sama sekali -
 * cuma tahu endpoint /api/sheets miliknya sendiri.
 *
 * GET  /api/sheets?action=getJournals           -> forward sebagai GET
 * POST /api/sheets  { action, payload }          -> forward sebagai POST
 */

const { isAuthenticated } = require('./lib/auth-helper');

exports.handler = async (event) => {
  const headers = { 'Content-Type': 'application/json' };

  if (!isAuthenticated(event)) {
    return { statusCode: 401, headers, body: JSON.stringify({ error: 'Unauthorized - silakan login dulu' }) };
  }

  const baseUrl = process.env.APPS_SCRIPT_URL;
  const secret = process.env.APPS_SCRIPT_SECRET;

  if (!baseUrl || !secret) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'APPS_SCRIPT_URL / APPS_SCRIPT_SECRET belum diset' }) };
  }

  try {
    if (event.httpMethod === 'GET') {
      const params = new URLSearchParams(event.queryStringParameters || {});
      params.set('secret', secret);

      const res = await fetch(`${baseUrl}?${params.toString()}`);
      const text = await res.text();

      return { statusCode: 200, headers, body: text };
    }

    if (event.httpMethod === 'POST') {
      let parsed;
      try {
        parsed = JSON.parse(event.body || '{}');
      } catch (e) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: 'Body harus JSON valid' }) };
      }

      parsed.secret = secret;

      const res = await fetch(baseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed)
      });
      const text = await res.text();

      return { statusCode: 200, headers, body: text };
    }

    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  } catch (err) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};

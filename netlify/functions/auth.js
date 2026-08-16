/**
 * Endpoint: /api/auth
 *
 * GET    -> cek status login saat ini ({ authenticated: true/false })
 * POST   -> login, body: { "password": "..." }
 * DELETE -> logout
 *
 * Password dibandingkan ke env var APP_PASSWORD (server-side saja,
 * tidak pernah dikirim ke browser). Kalau cocok, dikasih cookie
 * httpOnly berisi session token yang berlaku 7 hari.
 */

const {
  createSessionToken,
  buildSessionCookie,
  clearSessionCookie,
  isAuthenticated
} = require('./lib/auth-helper');

const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 hari

exports.handler = async (event) => {
  const headers = { 'Content-Type': 'application/json' };

  if (event.httpMethod === 'GET') {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ authenticated: isAuthenticated(event) })
    };
  }

  if (event.httpMethod === 'POST') {
    let body;
    try {
      body = JSON.parse(event.body || '{}');
    } catch (e) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Body harus JSON valid' }) };
    }

    if (!process.env.APP_PASSWORD) {
      return { statusCode: 500, headers, body: JSON.stringify({ error: 'APP_PASSWORD belum diset di environment variable' }) };
    }

    if (body.password !== process.env.APP_PASSWORD) {
      return { statusCode: 401, headers, body: JSON.stringify({ error: 'Password salah' }) };
    }

    const token = createSessionToken(process.env.SESSION_SECRET, SESSION_TTL_SECONDS * 1000);

    return {
      statusCode: 200,
      headers: { ...headers, 'Set-Cookie': buildSessionCookie(token, SESSION_TTL_SECONDS) },
      body: JSON.stringify({ success: true })
    };
  }

  if (event.httpMethod === 'DELETE') {
    return {
      statusCode: 200,
      headers: { ...headers, 'Set-Cookie': clearSessionCookie() },
      body: JSON.stringify({ success: true })
    };
  }

  return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
};

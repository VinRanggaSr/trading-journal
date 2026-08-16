/**
 * Endpoint: /api/price?ticker=BBCA
 *
 * Fetch harga saham dari Yahoo Finance (unofficial endpoint, gratis,
 * cocok untuk saham .JK / Indonesia). Hasilnya juga di-cache ke sheet
 * PriceCache lewat Apps Script (best-effort - kalau cache gagal,
 * harga tetap dikembalikan ke frontend).
 *
 * Ticker boleh ditulis dengan atau tanpa suffix .JK, contoh:
 * /api/price?ticker=BBCA        -> otomatis jadi BBCA.JK
 * /api/price?ticker=BBCA.JK     -> dipakai apa adanya
 */

const { isAuthenticated } = require('./lib/auth-helper');

exports.handler = async (event) => {
  const headers = { 'Content-Type': 'application/json' };

  if (!isAuthenticated(event)) {
    return { statusCode: 401, headers, body: JSON.stringify({ error: 'Unauthorized - silakan login dulu' }) };
  }

  const rawTicker = event.queryStringParameters && event.queryStringParameters.ticker;
  if (!rawTicker) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Parameter ticker wajib diisi' }) };
  }

  const symbol = rawTicker.toUpperCase().endsWith('.JK') ? rawTicker.toUpperCase() : `${rawTicker.toUpperCase()}.JK`;

  try {
    const yahooUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`;
    const res = await fetch(yahooUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; TradingJournalBot/1.0)' }
    });

    if (!res.ok) {
      return {
        statusCode: 502,
        headers,
        body: JSON.stringify({ error: 'Gagal fetch dari Yahoo Finance', status: res.status })
      };
    }

    const data = await res.json();
    const result = data && data.chart && data.chart.result && data.chart.result[0];

    if (!result || !result.meta) {
      return { statusCode: 404, headers, body: JSON.stringify({ error: 'Ticker tidak ditemukan', symbol }) };
    }

    const price = result.meta.regularMarketPrice;

    // Cache ke PriceCache sheet - best effort, jangan sampai gagal cache
    // bikin seluruh request price ini dianggap gagal.
    if (process.env.APPS_SCRIPT_URL && process.env.APPS_SCRIPT_SECRET) {
      try {
        await fetch(process.env.APPS_SCRIPT_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'updatePrice',
            secret: process.env.APPS_SCRIPT_SECRET,
            payload: { ticker: symbol, price }
          })
        });
      } catch (cacheErr) {
        // silent - tidak mempengaruhi response utama
      }
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        symbol,
        price,
        currency: result.meta.currency,
        marketTime: result.meta.regularMarketTime
      })
    };
  } catch (err) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};

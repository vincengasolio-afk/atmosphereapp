// netlify/functions/minimax-proxy.js
// Proxy serverless per le chiamate all'API MiniMax (Hailuo AI)
// Risolve i problemi CORS senza dipendere da proxy pubblici

exports.handler = async function(event) {
  // Accetta solo POST e GET
  if (event.httpMethod !== 'POST' && event.httpMethod !== 'GET') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  // Il path da chiamare su MiniMax viene passato come query param ?path=
  const params = event.queryStringParameters || {};
  const apiPath = params.path || '/v1/video_generation';
  const targetUrl = 'https://api.minimax.io' + apiPath;

  // Estrai l'Authorization header dalla richiesta
  const authHeader = event.headers['authorization'] || event.headers['Authorization'] || '';

  try {
    const fetchOptions = {
      method: event.httpMethod,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
    };

    if (event.httpMethod === 'POST' && event.body) {
      fetchOptions.body = event.body;
    }

    const response = await fetch(targetUrl, fetchOptions);
    const data = await response.text();

    return {
      statusCode: response.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: data,
    };
  } catch (err) {
    return {
      statusCode: 502,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: err.message }),
    };
  }
};

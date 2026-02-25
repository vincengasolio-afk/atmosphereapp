export default {
  async fetch(request) {
    // Permetti richieste dal tuo dominio
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    const url = new URL(request.url);
    // Rimuovi il prefisso /proxy/ e chiama MiniMax
    const minimaxPath = url.pathname.replace('/proxy', '');
    const minimaxUrl = 'https://api.minimax.io' + minimaxPath + url.search;

    const init = {
      method: request.method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': request.headers.get('Authorization') || '',
      },
    };

    if (request.method === 'POST') {
      init.body = await request.text();
    }

    const response = await fetch(minimaxUrl, init);
    const data = await response.text();

    return new Response(data, {
      status: response.status,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
    });
  }
};

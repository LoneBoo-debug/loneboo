
export default async function handler(req, res) {
  // Header per CORS e caching
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { task, playlistId, query } = req.query;
  
  // Utilizzo delle variabili d'ambiente configurate su Vercel
  const apiKey = process.env.YOUTUBE_API_KEY || process.env.VITE_YOUTUBE_API_KEY || process.env.API_KEY;
  const channelId = process.env.YOUTUBE_CHANNEL_ID || process.env.VITE_YOUTUBE_CHANNEL_ID || 'UC54EfsufATyB7s2XcRkt1Eg';
  
  // Se l'utente visita l'URL senza parametri, diamo un feedback di test
  if (!task) {
    return res.status(200).json({ 
      status: "OK", 
      message: "Proxy Lone Boo attivo!",
      api_key_configured: !!apiKey,
      instructions: "Usa ?task=latest per testare il caricamento dei video."
    });
  }

  if (!apiKey) {
    return res.status(500).json({ 
      error: 'Configurazione Server Incompleta', 
      details: 'La chiave API deve essere configurata nel pannello Vercel come YOUTUBE_API_KEY' 
    });
  }

  const BASE_URL = 'https://www.googleapis.com/youtube/v3';

  try {
    let url = '';

    switch (task) {
      case 'playlists':
        url = `${BASE_URL}/playlists?part=snippet&channelId=${channelId}&maxResults=20&key=${apiKey}`;
        break;
      case 'playlistItems':
        url = `${BASE_URL}/playlistItems?part=snippet,contentDetails&playlistId=${playlistId}&maxResults=50&key=${apiKey}`;
        break;
      case 'latest':
        url = `${BASE_URL}/search?part=snippet&channelId=${channelId}&order=date&type=video&maxResults=50&key=${apiKey}`;
        break;
      case 'search':
        url = `${BASE_URL}/search?part=snippet&channelId=${channelId}&q=${encodeURIComponent(query)}&type=video&maxResults=25&key=${apiKey}`;
        break;
      case 'statistics':
        url = `${BASE_URL}/channels?part=statistics&id=${channelId}&key=${apiKey}`;
        break;
      default:
        return res.status(400).json({ error: 'Operazione non valida' });
    }

    const response = await fetch(url);
    const data = await response.json();

    if (data.error) {
      return res.status(response.status || 500).json(data);
    }

    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

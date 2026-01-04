
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { task, playlistId, query } = req.query;
  const apiKey = process.env.YOUTUBE_API_KEY || process.env.VITE_YOUTUBE_API_KEY;
  const channelId = process.env.YOUTUBE_CHANNEL_ID || process.env.VITE_YOUTUBE_CHANNEL_ID || 'UC54EfsufATyB7s2XcRkt1Eg';
  
  if (!apiKey) {
    return res.status(500).json({ error: 'Configurazione mancante: API KEY non trovata nel server' });
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
        return res.status(400).json({ error: 'Task non valido' });
    }

    const response = await fetch(url);
    const data = await response.json();
    
    if (!response.ok) {
        return res.status(response.status).json({ 
            error: 'Errore da YouTube API', 
            details: data.error || data 
        });
    }

    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: 'Errore interno del proxy', message: err.message });
  }
}

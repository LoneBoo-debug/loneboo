
export default async function handler(req, res) {
  // 1. Header per CORS e caching
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { task, playlistId, query } = req.query;
  
  // Utilizziamo la chiave fornita se le env vars mancano
  const apiKey = process.env.VITE_YOUTUBE_API_KEY || process.env.API_KEY || 'AIzaSyA4zdWLB-Jo6fuahlwYma_Bu9Zc1TqHtT8';
  const channelId = process.env.VITE_YOUTUBE_CHANNEL_ID || 'UC54EfsufATyB7s2XcRkt1Eg';
  
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

    if (data.error) {
      console.error("YouTube API Error:", data.error);
      return res.status(response.status || 500).json(data);
    }

    return res.status(200).json(data);
  } catch (err) {
    console.error("Fetch failure:", err);
    return res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
}

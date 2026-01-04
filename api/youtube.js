
export default async function handler(req, res) {
  const { task, playlistId, query } = req.query;
  const apiKey = process.env.VITE_YOUTUBE_API_KEY || process.env.API_KEY;
  const channelId = process.env.VITE_YOUTUBE_CHANNEL_ID || 'UC54EfsufATyB7s2XcRkt1Eg';
  
  if (!apiKey) {
    return res.status(500).json({ error: 'YouTube API Key missing in environment' });
  }

  const BASE_URL = 'https://www.googleapis.com/youtube/v3';

  try {
    let url = '';

    switch (task) {
      case 'playlists':
        url = `${BASE_URL}/playlists?part=snippet&channelId=${channelId}&maxResults=20&key=${apiKey}`;
        break;
      case 'playlistItems':
        url = `${BASE_URL}/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=20&key=${apiKey}`;
        break;
      case 'latest':
        url = `${BASE_URL}/search?part=snippet&channelId=${channelId}&order=date&type=video&maxResults=20&key=${apiKey}`;
        break;
      case 'search':
        url = `${BASE_URL}/search?part=snippet&channelId=${channelId}&q=${encodeURIComponent(query)}&type=video&maxResults=20&key=${apiKey}`;
        break;
      case 'statistics':
        url = `${BASE_URL}/channels?part=statistics&id=${channelId}&key=${apiKey}`;
        break;
      default:
        return res.status(400).json({ error: 'Invalid task' });
    }

    const response = await fetch(url);
    const data = await response.json();

    if (data.error) {
      console.error("YouTube API Error:", data.error);
      return res.status(response.status).json(data);
    }

    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

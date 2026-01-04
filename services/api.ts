
import { VIDEOS } from '../constants';
import { YouTubePlaylist, Video } from '../types';

// Usiamo il percorso relativo per le API di Vercel
const PROXY_URL = '/api/youtube';

export const getChannelPlaylists = async (): Promise<YouTubePlaylist[]> => {
  try {
    const response = await fetch(`${PROXY_URL}?task=playlists`);
    if (!response.ok) return [];
    const data = await response.json();
    if (data.error || !data.items) return [];
    return data.items.map((item: any) => ({
      id: item.id,
      title: item.snippet?.title || 'Playlist senza titolo',
    }));
  } catch (error) { 
    return []; 
  }
};

export const getPlaylistVideos = async (playlistId: string): Promise<Video[]> => {
  try {
    const response = await fetch(`${PROXY_URL}?task=playlistItems&playlistId=${playlistId}`);
    if (!response.ok) return VIDEOS;
    const data = await response.json();
    if (data.error || !data.items) return VIDEOS;
    return data.items
      .filter((item: any) => item.snippet && item.snippet.title !== 'Private video' && item.snippet.resourceId)
      .map((item: any) => ({
        id: item.snippet.resourceId.videoId,
        title: item.snippet.title || 'Video senza titolo',
        thumbnail: item.snippet.thumbnails?.maxres?.url || item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.default?.url || '',
        category: 'In Evidenza', 
        description: item.snippet.description || '',
        url: `https://www.youtube.com/watch?v=${item.snippet.resourceId.videoId}`,
        publishedAt: item.snippet.publishedAt
      }));
  } catch (error) { 
    return VIDEOS; 
  }
};

export const getLatestVideos = async (): Promise<Video[]> => {
    try {
        const response = await fetch(`${PROXY_URL}?task=latest`);
        if (!response.ok) return VIDEOS;
        const data = await response.json();
        if (data.error || !data.items) return VIDEOS;
        return data.items
            .filter((item: any) => {
                if (!item.snippet) return false;
                const title = (item.snippet.title || '').toLowerCase();
                return !title.includes('#shorts') && !title.includes('#short');
            })
            .map((item: any) => ({
                id: item.id?.videoId || 'unknown',
                title: item.snippet?.title || 'Video',
                thumbnail: item.snippet?.thumbnails?.high?.url || item.snippet?.thumbnails?.default?.url || '',
                category: 'Novità',
                description: item.snippet?.description || '',
                url: `https://www.youtube.com/watch?v=${item.id?.videoId}`,
                publishedAt: item.snippet?.publishedAt
            }));
    } catch (error) { 
        return VIDEOS; 
    }
}

export const searchChannelVideos = async (query: string): Promise<Video[]> => {
    try {
        const response = await fetch(`${PROXY_URL}?task=search&query=${encodeURIComponent(query)}`);
        if (!response.ok) return [];
        const data = await response.json();
        if (data.error || !data.items) return [];
        return data.items.map((item: any) => ({
            id: item.id?.videoId || 'unknown',
            title: item.snippet?.title || 'Risultato',
            thumbnail: item.snippet?.thumbnails?.high?.url || item.snippet?.thumbnails?.default?.url || '',
            category: 'Ricerca', 
            description: item.snippet?.description || '',
            url: `https://www.youtube.com/watch?v=${item.id?.videoId}`,
            publishedAt: item.snippet?.publishedAt
        }));
    } catch (error) { 
        return VIDEOS.filter(v => v.title.toLowerCase().includes(query.toLowerCase())); 
    }
}

export const getFeaturedVideo = async (): Promise<Video | null> => {
    try {
        const playlists = await getChannelPlaylists();
        const featuredPlaylist = playlists.find(p => p.title.trim().toLowerCase().includes('evidenza'));
        
        if (featuredPlaylist) {
            const videos = await getPlaylistVideos(featuredPlaylist.id);
            if (videos.length > 0) return { ...videos[0], category: 'In Primo Piano' };
        }
        
        const latest = await getLatestVideos();
        if (latest.length > 0) return { ...latest[0], category: 'Novità' };
        
        return VIDEOS[0] || null;
    } catch (error) { 
        return VIDEOS[0] || null; 
    }
};

export const getChannelStatistics = async (): Promise<{ subscriberCount: string; videoCount: string } | null> => {
    try {
        const response = await fetch(`${PROXY_URL}?task=statistics`);
        if (!response.ok) return null;
        const data = await response.json();
        if (data.items && data.items.length > 0) {
            const stats = data.items[0].statistics;
            const fmt = new Intl.NumberFormat('it-IT');
            return {
                subscriberCount: fmt.format(parseInt(stats.subscriberCount)),
                videoCount: fmt.format(parseInt(stats.videoCount))
            };
        }
        return null;
    } catch (error) { return null; }
}

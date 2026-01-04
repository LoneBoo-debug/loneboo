
import { VIDEOS } from '../constants';
import { YouTubePlaylist, Video } from '../types';

const PROXY_URL = '/api/youtube';

/**
 * Fetches the playlists from the configured YouTube Channel via proxy.
 */
export const getChannelPlaylists = async (): Promise<YouTubePlaylist[]> => {
  try {
    // FIX: Switched to proxy to resolve "Property 'API_KEY' does not exist" and hide API_KEY from client
    const response = await fetch(`${PROXY_URL}?task=playlists`);
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

/**
 * Fetches videos from a specific playlist via proxy.
 */
export const getPlaylistVideos = async (playlistId: string): Promise<Video[]> => {
  try {
    // FIX: Using proxy to fetch playlist items safely
    const response = await fetch(`${PROXY_URL}?task=playlistItems&playlistId=${playlistId}`);
    const data = await response.json();

    if (data.error || !data.items) return VIDEOS;

    return data.items
      .filter((item: any) => item.snippet && item.snippet.title !== 'Private video' && item.snippet.resourceId)
      .map((item: any) => ({
        id: item.snippet.resourceId.videoId,
        title: item.snippet.title || 'Video senza titolo',
        thumbnail: item.snippet.thumbnails?.maxres?.url || item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.default?.url || '',
        category: 'Playlist', 
        description: item.snippet.description || '',
        url: `https://www.youtube.com/watch?v=${item.snippet.resourceId.videoId}`,
        publishedAt: item.snippet.publishedAt
      }));
  } catch (error) {
    return VIDEOS;
  }
};

/**
 * Fetches latest uploads via proxy.
 */
export const getLatestVideos = async (): Promise<Video[]> => {
    try {
        // FIX: Using proxy to fetch latest videos safely
        const response = await fetch(`${PROXY_URL}?task=latest`);
        const data = await response.json();

        if (data.error || !data.items) return VIDEOS;

        return data.items
            .filter((item: any) => {
                if (!item.snippet) return false;
                const title = (item.snippet.title || '').toLowerCase();
                const desc = (item.snippet.description || '').toLowerCase();
                // Basic Shorts filter
                return !title.includes('#shorts') && !title.includes('#short') && !desc.includes('#shorts');
            })
            .slice(0, 16) 
            .map((item: any) => ({
                id: item.id?.videoId || 'unknown',
                title: item.snippet?.title || 'Video',
                thumbnail: item.snippet?.thumbnails?.high?.url || item.snippet?.thumbnails?.default?.url || '',
                category: 'Ultimi',
                description: item.snippet?.description || '',
                url: `https://www.youtube.com/watch?v=${item.id?.videoId}`,
                publishedAt: item.snippet?.publishedAt
            }));
    } catch (error) {
        return VIDEOS;
    }
}

/**
 * SEARCH ACROSS THE ENTIRE CHANNEL via proxy
 */
export const searchChannelVideos = async (query: string): Promise<Video[]> => {
    try {
        // FIX: Using proxy for channel search
        const response = await fetch(`${PROXY_URL}?task=search&query=${encodeURIComponent(query)}`);
        const data = await response.json();

        if (data.error || !data.items) return [];

        return data.items.map((item: any) => ({
            id: item.id?.videoId || 'unknown',
            title: item.snippet?.title || 'Risultato',
            thumbnail: item.snippet?.thumbnails?.high?.url || item.snippet?.thumbnails?.default?.url || '',
            category: 'Risultato Ricerca', 
            description: item.snippet?.description || '',
            url: `https://www.youtube.com/watch?v=${item.id?.videoId}`,
            publishedAt: item.snippet?.publishedAt
        }));
    } catch (error) {
        // Fallback to local filtering
        return VIDEOS.filter(v => v.title.toLowerCase().includes(query.toLowerCase()));
    }
}

/**
 * SPECIAL FEATURE: GET FEATURED VIDEO via proxy
 */
export const getFeaturedVideo = async (): Promise<Video | null> => {
    try {
        const playlists = await getChannelPlaylists();
        const featuredPlaylist = playlists.find(p => p.title.trim().toLowerCase().includes('evidenza'));

        if (!featuredPlaylist) return null;

        const videos = await getPlaylistVideos(featuredPlaylist.id);
        
        if (videos.length > 0) {
            return { ...videos[0], category: 'In Primo Piano' };
        }
        
        return null;
    } catch (error) {
        return null;
    }
};

/**
 * CHANNEL STATISTICS via proxy
 */
export const getChannelStatistics = async (): Promise<{ subscriberCount: string; videoCount: string } | null> => {
    try {
        // FIX: Using proxy for channel statistics
        const response = await fetch(`${PROXY_URL}?task=statistics`);
        const data = await response.json();

        if (data.items && data.items.length > 0) {
            const stats = data.items[0].statistics;
            const fmt = new Intl.NumberFormat('it-IT');
            const subCount = fmt.format(parseInt(stats.subscriberCount));
            const vidCount = fmt.format(parseInt(stats.videoCount));

            return {
                subscriberCount: subCount,
                videoCount: vidCount
            };
        }
        return null;
    } catch (error) {
        return null;
    }
}

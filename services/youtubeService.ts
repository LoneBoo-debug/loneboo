
import { YOUTUBE_CONFIG, VIDEOS } from '../constants';
import { YouTubePlaylist, Video } from '../types';

const BASE_URL = 'https://www.googleapis.com/youtube/v3';

/**
 * Fetches the playlists from the configured YouTube Channel.
 */
export const getChannelPlaylists = async (): Promise<YouTubePlaylist[]> => {
  if (!YOUTUBE_CONFIG.API_KEY || !YOUTUBE_CONFIG.CHANNEL_ID) {
    return [];
  }

  try {
    const response = await fetch(
      `${BASE_URL}/playlists?part=snippet&channelId=${YOUTUBE_CONFIG.CHANNEL_ID}&maxResults=20&key=${YOUTUBE_CONFIG.API_KEY}`
    );
    const data = await response.json();
    
    if (data.error) return []; // Silent fail
    if (!data.items) return [];

    return data.items.map((item: any) => ({
      id: item.id,
      title: item.snippet?.title || 'Playlist senza titolo',
    }));
  } catch (error) {
    return [];
  }
};

/**
 * Fetches videos from a specific playlist.
 */
export const getPlaylistVideos = async (playlistId: string): Promise<Video[]> => {
  if (!YOUTUBE_CONFIG.API_KEY) return VIDEOS; // Fallback to static

  try {
    const response = await fetch(
      `${BASE_URL}/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=18&key=${YOUTUBE_CONFIG.API_KEY}`
    );
    const data = await response.json();

    if (data.error) return VIDEOS; // Fallback
    if (!data.items) return VIDEOS; // Fallback

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
 * Fetches latest uploads.
 */
export const getLatestVideos = async (): Promise<Video[]> => {
    if (!YOUTUBE_CONFIG.API_KEY || !YOUTUBE_CONFIG.CHANNEL_ID) return VIDEOS;

    try {
        const response = await fetch(
            `${BASE_URL}/search?part=snippet&channelId=${YOUTUBE_CONFIG.CHANNEL_ID}&order=date&type=video&maxResults=30&key=${YOUTUBE_CONFIG.API_KEY}`
        );
        const data = await response.json();

        if (data.error) return VIDEOS;
        if (!data.items) return VIDEOS;

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
 * SEARCH ACROSS THE ENTIRE CHANNEL
 */
export const searchChannelVideos = async (query: string): Promise<Video[]> => {
    if (!YOUTUBE_CONFIG.API_KEY || !YOUTUBE_CONFIG.CHANNEL_ID) {
        // Basic static search simulation
        return VIDEOS.filter(v => v.title.toLowerCase().includes(query.toLowerCase()));
    }

    try {
        const response = await fetch(
            `${BASE_URL}/search?part=snippet&channelId=${YOUTUBE_CONFIG.CHANNEL_ID}&q=${encodeURIComponent(query)}&type=video&maxResults=16&key=${YOUTUBE_CONFIG.API_KEY}`
        );
        const data = await response.json();

        if (data.error) return [];
        if (!data.items) return [];

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
 * SPECIAL FEATURE: GET FEATURED VIDEO
 */
export const getFeaturedVideo = async (): Promise<Video | null> => {
    if (!YOUTUBE_CONFIG.API_KEY || !YOUTUBE_CONFIG.CHANNEL_ID) return null;

    try {
        const playlists = await getChannelPlaylists();
        const featuredPlaylist = playlists.find(p => p.title.trim().toLowerCase() === 'in evidenza');

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
 * CHANNEL STATISTICS
 */
export const getChannelStatistics = async (): Promise<{ subscriberCount: string; videoCount: string } | null> => {
    if (!YOUTUBE_CONFIG.API_KEY || !YOUTUBE_CONFIG.CHANNEL_ID) {
        return null;
    }

    try {
        const response = await fetch(
            `${BASE_URL}/channels?part=statistics&id=${YOUTUBE_CONFIG.CHANNEL_ID}&key=${YOUTUBE_CONFIG.API_KEY}`
        );
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

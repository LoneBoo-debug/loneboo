
import { VIDEOS } from '../constants';
import { YouTubePlaylist, Video } from '../types';

const PROXY_URL = '/api/youtube';

/**
 * Helper per eseguire fetch sicuri con debug testuale
 */
const safeFetch = async (task: string, params: string = "") => {
    try {
        const response = await fetch(`${PROXY_URL}?task=${task}${params}`);
        const text = await response.text();
        
        try {
            const data = JSON.parse(text);
            if (data.error) {
                console.error(`YouTube API Error [${task}]:`, data.error);
                return null;
            }
            return data;
        } catch (e) {
            console.error(`Malformed JSON Response [${task}]:`, text.substring(0, 100));
            return null;
        }
    } catch (err) {
        console.error(`Fetch failure [${task}]:`, err);
        return null;
    }
};

export const getChannelPlaylists = async (): Promise<YouTubePlaylist[]> => {
  const data = await safeFetch('playlists');
  if (!data || !data.items) return [];
  
  return data.items.map((item: any) => ({
    id: item.id,
    title: item.snippet?.title || 'Playlist',
    thumbnail: item.snippet?.thumbnails?.high?.url || '',
    description: item.snippet?.description || '',
    playlistId: item.id
  }));
};

export const getPlaylistVideos = async (playlistId: string): Promise<Video[]> => {
  const data = await safeFetch('playlistItems', `&playlistId=${playlistId}`);
  if (!data || !data.items) return VIDEOS;

  return data.items
    .filter((item: any) => item.snippet?.resourceId?.videoId)
    .map((item: any) => ({
      id: item.snippet.resourceId.videoId,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails?.maxres?.url || item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.default?.url || '',
      category: 'Playlist',
      description: item.snippet.description || '',
      url: `https://www.youtube.com/watch?v=${item.snippet.resourceId.videoId}`
    }));
};

export const getLatestVideos = async (): Promise<Video[]> => {
    const data = await safeFetch('latest');
    if (!data || !data.items || data.items.length === 0) return VIDEOS;

    return data.items
        .filter((item: any) => item.id?.videoId)
        .map((item: any) => ({
            id: item.id.videoId,
            title: item.snippet?.title || 'Video Lone Boo',
            thumbnail: item.snippet?.thumbnails?.high?.url || item.snippet?.thumbnails?.medium?.url || '',
            category: 'Novità',
            description: item.snippet?.description || '',
            url: `https://www.youtube.com/watch?v=${item.id.videoId}`
        }));
};

export const searchChannelVideos = async (query: string): Promise<Video[]> => {
    const data = await safeFetch('search', `&query=${encodeURIComponent(query)}`);
    if (!data || !data.items) return [];
    
    return data.items
        .filter((item: any) => item.id?.videoId)
        .map((item: any) => ({
            id: item.id.videoId,
            title: item.snippet?.title,
            thumbnail: item.snippet?.thumbnails?.high?.url || '',
            category: 'Ricerca',
            description: item.snippet?.description || '',
            url: `https://www.youtube.com/watch?v=${item.id.videoId}`
        }));
};

export const getFeaturedVideo = async (): Promise<Video | null> => {
    const latest = await getLatestVideos();
    return (latest && latest.length > 0) ? { ...latest[0], category: 'In Primo Piano' } : VIDEOS[0];
};

export const getChannelStatistics = async () => {
    const data = await safeFetch('statistics');
    if (data && data.items?.length > 0) {
        const stats = data.items[0].statistics;
        return {
            subscriberCount: new Intl.NumberFormat('it-IT').format(parseInt(stats.subscriberCount)),
            videoCount: new Intl.NumberFormat('it-IT').format(parseInt(stats.videoCount))
        };
    }
    return null;
};

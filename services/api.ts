
import { VIDEOS } from '../constants';
import { YouTubePlaylist, Video } from '../types';

// Percorso univoco per il proxy Vercel
const PROXY_URL = '/api/youtube';

/**
 * Recupera le playlist del canale
 */
export const getChannelPlaylists = async (): Promise<YouTubePlaylist[]> => {
  try {
    const response = await fetch(`${PROXY_URL}?task=playlists`);
    const data = await response.json();
    if (!data || !data.items) return [];
    
    return data.items.map((item: any) => ({
      id: item.id,
      title: item.snippet?.title || 'Playlist',
    }));
  } catch (error) {
    console.error("Errore fetch playlists:", error);
    return [];
  }
};

/**
 * Recupera i video di una playlist specifica
 */
export const getPlaylistVideos = async (playlistId: string): Promise<Video[]> => {
  try {
    const response = await fetch(`${PROXY_URL}?task=playlistItems&playlistId=${playlistId}`);
    const data = await response.json();
    if (!data || !data.items) return VIDEOS;

    return data.items
      .filter((item: any) => item.snippet?.resourceId?.videoId)
      .map((item: any) => ({
        id: item.snippet.resourceId.videoId,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.default?.url || '',
        category: 'Playlist',
        description: item.snippet.description || '',
        url: `https://www.youtube.com/watch?v=${item.snippet.resourceId.videoId}`
      }));
  } catch (error) {
    return VIDEOS;
  }
};

/**
 * Recupera gli ultimi caricamenti (usa il task 'latest' del proxy)
 */
export const getLatestVideos = async (): Promise<Video[]> => {
    try {
        const response = await fetch(`${PROXY_URL}?task=latest`);
        const data = await response.json();
        
        if (!data || !data.items || data.items.length === 0) {
            console.warn("Nessun video trovato da YouTube, uso fallback statico.");
            return VIDEOS;
        }

        return data.items
            .filter((item: any) => item.id?.videoId) // Fondamentale per i risultati di ricerca
            .map((item: any) => ({
                id: item.id.videoId,
                title: item.snippet?.title || 'Video Lone Boo',
                thumbnail: item.snippet?.thumbnails?.high?.url || item.snippet?.thumbnails?.medium?.url || '',
                category: 'Novità',
                description: item.snippet?.description || '',
                url: `https://www.youtube.com/watch?v=${item.id.videoId}`
            }));
    } catch (error) {
        console.error("Errore fetch ultimi video:", error);
        return VIDEOS;
    }
};

/**
 * Ricerca video nel canale
 */
export const searchChannelVideos = async (query: string): Promise<Video[]> => {
    try {
        const response = await fetch(`${PROXY_URL}?task=search&query=${encodeURIComponent(query)}`);
        const data = await response.json();
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
    } catch (error) {
        return [];
    }
};

/**
 * Determina il video in primo piano
 */
export const getFeaturedVideo = async (): Promise<Video | null> => {
    try {
        const latest = await getLatestVideos();
        // Se abbiamo video da YouTube, il primo è il featured, altrimenti usa la sigla dai constants
        return latest.length > 0 ? { ...latest[0], category: 'In Primo Piano' } : VIDEOS[0];
    } catch (error) {
        return VIDEOS[0] || null;
    }
};

/**
 * Statistiche canale
 */
export const getChannelStatistics = async () => {
    try {
        const response = await fetch(`${PROXY_URL}?task=statistics`);
        const data = await response.json();
        if (data.items?.length > 0) {
            const stats = data.items[0].statistics;
            return {
                subscriberCount: new Intl.NumberFormat('it-IT').format(parseInt(stats.subscriberCount)),
                videoCount: new Intl.NumberFormat('it-IT').format(parseInt(stats.videoCount))
            };
        }
    } catch (e) {}
    return null;
};

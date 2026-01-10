
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { VIDEOS } from '../constants';
import { Video, AppView } from '../types';
import { getChannelPlaylists, getPlaylistVideos, searchChannelVideos, getFeaturedVideo } from '../services/api';
import { Search, CirclePlay, Loader2, X } from 'lucide-react';

const CLOSE_BTN_IMG = 'https://i.postimg.cc/0NdtYdcJ/tasto-chiudi-(1)-(1).png';
const YT_CHANNEL_URL = 'https://www.youtube.com/@ILoneBoo';
const OFFICIAL_CHANNEL_BTN_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/vaicanasezcinemoff.webp';
const RETURN_CITY_BTN_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/torncitdcinesez.webp';
const CINEMA_BG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/sfcinemaxxsad.webp';

const MOCK_VIDEOS: Video[] = Array.from({ length: 12 }).map((_, i) => ({
    id: `mock-${i}`,
    title: `Video Test ${i + 1}`,
    thumbnail: 'https://i.postimg.cc/d1vqZVzN/Hailuo-Image-fffdi-questo-fantasmino-creami-du-4549ddd4646ddd7164590080.png',
    category: 'Test',
    url: 'https://www.youtube.com/watch?v=S7Q1CgO6ZQA',
    description: 'Video segnaposto temporaneo per test layout.'
}));

interface VideoGalleryProps {
    setView: (view: AppView) => void;
}

const VideoGallery: React.FC<VideoGalleryProps> = ({ setView }) => {
  const [videos, setVideos] = useState<Video[]>(MOCK_VIDEOS);
  const [featuredVideo, setFeaturedVideo] = useState<Video | null>(MOCK_VIDEOS[0]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  
  const [calib] = useState({ top: 9.3, left: 18.5, width: 62.4, height: 20.1 });
  const isMounted = useRef(false);

  const initGallery = useCallback(async () => {
    if (!isMounted.current) return;
    setLoading(true);
    try {
        const fv = await getFeaturedVideo();
        if (fv && isMounted.current) setFeaturedVideo(fv);
        const playlists = await getChannelPlaylists();
        const targetPlaylist = playlists.find(p => p.title.toLowerCase().includes('kids songs') || p.title.toLowerCase().includes('canzoni per bambini'));
        let fetchedVideos: Video[] = [];
        if (targetPlaylist) { fetchedVideos = await getPlaylistVideos(targetPlaylist.id); }
        else { const { getLatestVideos } = await import('../services/api'); fetchedVideos = await getLatestVideos(); }
        if (isMounted.current && fetchedVideos.length > 0) { setVideos(fetchedVideos.filter(v => v.id !== (fv?.id || '')).slice(0, 15)); }
    } catch (err) { if (isMounted.current) setVideos(MOCK_VIDEOS); }
    finally { if (isMounted.current) setLoading(false); }
  }, []);

  useEffect(() => {
    isMounted.current = true;
    initGallery();
    return () => { isMounted.current = false; };
  }, [initGallery]);

  // Gestione rotazione immersiva: Solo quando un video è aperto
  useEffect(() => {
    if (selectedVideo) {
        document.body.classList.add('allow-landscape');
    } else {
        document.body.classList.remove('allow-landscape');
    }
    
    // Cleanup quando si esce dalla gallery o si smonta il componente
    return () => {
        document.body.classList.remove('allow-landscape');
    };
  }, [selectedVideo]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
        if (searchTerm.trim().length > 2) {
            setLoading(true);
            const results = await searchChannelVideos(searchTerm);
            if (isMounted.current) { setVideos(results.length > 0 ? results.slice(0, 12) : MOCK_VIDEOS); setLoading(false); }
        } else if (searchTerm.trim().length === 0 && isMounted.current && !loading) { initGallery(); }
    }, 800);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, initGallery]);

  const handleExternalClick = (e: React.MouseEvent, url: string) => {
      const linksDisabled = localStorage.getItem('disable_external_links') === 'true';
      if (linksDisabled) {
          e.preventDefault();
          alert("Navigazione esterna bloccata dai genitori! 🔒");
          return;
      }
      window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-0 bg-slate-900 overflow-hidden">
      <style>{`
        .custom-scroll::-webkit-scrollbar { height: 8px; }
        .custom-scroll::-webkit-scrollbar-track { background: rgba(0,0,0,0.3); border-radius: 10px; }
        .custom-scroll::-webkit-scrollbar-thumb { background: #FBBF24; border-radius: 10px; border: 2px solid #1e293b; }
        @media (orientation: landscape) {
          .video-modal-overlay { padding: 0 !important; background: black !important; position: fixed; inset: 0; width: 100vw; height: 100dvh; }
          .video-modal-container { width: 100vw !important; height: 100dvh !important; max-width: none !important; max-height: none !important; border-radius: 0 !important; border: none !important; margin: 0 !important; }
          .video-modal-header, .video-modal-footer { display: none !important; }
          .video-modal-close { top: 20px !important; right: 20px !important; width: 50px !important; height: 50px !important; opacity: 0.5; background: rgba(0,0,0,0.3); border-radius: 50%; padding: 5px; }
          .iframe-container { border-radius: 0 !important; width: 100%; height: 100dvh; }
        }
      `}</style>
      <img src={CINEMA_BG} alt="" className="absolute inset-0 w-full h-full object-fill pointer-events-none select-none z-0" draggable={false} />
      <div className="relative z-10 h-full flex flex-col pt-[80px] md:pt-[106px] pb-6 px-3">
        {featuredVideo && (
          <div className="absolute z-50 animate-in fade-in duration-700 pointer-events-auto" style={{ top: `${calib.top}%`, left: `${calib.left}%`, width: `${calib.width}%`, height: `${calib.height}%` }}>
            <div className="group relative w-full h-full cursor-pointer bg-black rounded-lg md:rounded-xl shadow-2xl overflow-hidden border-2 border-white/10" onClick={(e) => { e.stopPropagation(); setSelectedVideo(featuredVideo); }}>
                <img src={featuredVideo.thumbnail.replace('hqdefault', 'maxresdefault')} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white/20 backdrop-blur-sm p-3 rounded-full border-4 border-white/40 group-hover:scale-110 transition-transform"><CirclePlay className="text-white w-10 h-10 md:w-16 md:h-16 drop-shadow-2xl" strokeWidth={1.5} /></div>
                </div>
            </div>
          </div>
        )}
        <div className="flex-1 flex flex-col justify-center min-h-0 relative z-30 pt-20">
          <div className="w-full max-w-7xl mx-auto">
            <div className="flex items-center gap-3 mb-2 px-4">
                <div className="h-1 flex-1 bg-gradient-to-r from-transparent to-white/20"></div>
                <span className="text-white/40 font-black text-[10px] uppercase tracking-[0.3em]">Programmazione Cinema</span>
                <div className="h-1 flex-1 bg-gradient-to-l from-transparent to-white/20"></div>
            </div>
            <div className="flex overflow-x-auto gap-4 md:gap-8 px-4 py-4 custom-scroll snap-x scroll-smooth no-scrollbar">
                {videos.map((video) => (
                    <div key={video.id} onClick={() => setSelectedVideo(video)} className="flex-shrink-0 w-[200px] md:w-[320px] snap-center group cursor-pointer">
                        <div className={`relative aspect-video rounded-2xl md:rounded-[35px] border-4 border-black overflow-hidden shadow-2xl transition-all duration-300 group-hover:scale-105 group-hover:-rotate-1 ${video.id.startsWith('mock') ? 'bg-gradient-to-br from-indigo-900 to-purple-800' : 'bg-gray-900'}`}>
                            <img src={video.thumbnail} alt="" className={`w-full h-full object-cover transition-opacity duration-500 ${video.id.startsWith('mock') ? 'opacity-40 grayscale group-hover:opacity-60 group-hover:grayscale-0' : 'opacity-85'}`} loading="lazy" />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                                <div className="bg-white/20 backdrop-blur-sm p-3 rounded-full border-2 border-white/30 transform scale-0 group-hover:scale-100 transition-transform"><CirclePlay className="text-white w-8 h-8 md:w-12 md:h-12" /></div>
                            </div>
                            <div className="absolute bottom-0 inset-x-0 bg-black/80 backdrop-blur-md px-3 py-2 border-t border-white/10">
                                <h3 className="font-black text-white text-[10px] md:text-sm line-clamp-1 leading-tight uppercase text-center tracking-tight">{video.title}</h3>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
          </div>
        </div>
        <div className="w-full max-w-4xl mx-auto flex flex-col items-center gap-6 mt-auto pb-6 relative z-10">
            <div className="relative w-full max-w-xl">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input type="text" placeholder="Cerca nel canale" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-12 pr-10 py-3 rounded-2xl border-4 border-black font-black text-base text-black focus:outline-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-white/95 backdrop-blur-sm" />
            </div>
            <div className="flex justify-center gap-4 md:gap-8">
                <button onClick={() => setView(AppView.CITY_MAP)} className="hover:scale-105 active:scale-95 transition-transform outline-none">
                    <img src={RETURN_CITY_BTN_IMG} alt="Torna in Città" className="w-32 md:w-52 h-auto drop-shadow-xl" />
                </button>
                <button onClick={(e) => handleExternalClick(e, YT_CHANNEL_URL)} className="hover:scale-105 active:scale-95 transition-transform outline-none">
                    <img src={OFFICIAL_CHANNEL_BTN_IMG} alt="Vedi tutti su YouTube" className="w-32 md:w-52 h-auto drop-shadow-xl" />
                </button>
            </div>
        </div>
        {selectedVideo && (
          <div className="video-modal-overlay fixed inset-0 z-[200] flex items-center justify-center bg-black/95 p-0 md:p-4 animate-in fade-in" onClick={() => setSelectedVideo(null)}>
             <div className="video-modal-container relative w-full max-w-5xl bg-white rounded-[30px] md:rounded-[40px] border-[6px] md:border-[8px] border-red-600 shadow-2xl overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
                <button onClick={() => setSelectedVideo(null)} className="video-modal-close absolute top-4 right-4 z-[210] hover:scale-110 transition-transform">
                   <img src={CLOSE_BTN_IMG} alt="Chiudi" className="w-10 h-10 md:w-20 md:h-20" />
                </button>
                <div className="iframe-container flex-1 w-full aspect-video bg-black">
                    <iframe src={`https://www.youtube.com/embed/${selectedVideo.id.startsWith('mock') ? 'S7Q1CgO6ZQA' : selectedVideo.id}?autoplay=1&rel=0&modestbranding=1&iv_load_policy=3`} className="w-full h-full border-0" allowFullScreen allow="autoplay; fullscreen" />
                </div>
                <div className="video-modal-footer p-4 text-center bg-white shrink-0 border-t border-gray-100">
                    <h3 className="text-gray-800 text-lg md:text-xl font-black uppercase truncate px-8">{selectedVideo.title}</h3>
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoGallery;

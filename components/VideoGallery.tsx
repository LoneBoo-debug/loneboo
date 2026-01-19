import React, { useState, useEffect, useRef, useCallback } from 'react';
import { VIDEOS } from '../constants';
import { Video, AppView } from '../types';
import { getChannelPlaylists, getPlaylistVideos, searchChannelVideos, getFeaturedVideo } from '../services/api';
import { CirclePlay, Loader2, X, Ticket } from 'lucide-react';

const CLOSE_BTN_IMG = 'https://i.postimg.cc/0NdtYdcJ/tasto-chiudi-(1)-(1).png';
const YT_CHANNEL_URL = 'https://www.youtube.com/@ILoneBoo';
const OFFICIAL_CHANNEL_BTN_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/vaicanasezcinemoff.webp';
const RETURN_CITY_BTN_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/torncitdcinesez.webp';
const CINEMA_BG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/sfcinemaxxsad.webp';
const ZUCCOTTO_POPCORN = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/zuccottocinemafhe443.webp';

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

  useEffect(() => {
    if (selectedVideo) {
        document.body.classList.add('allow-landscape');
    } else {
        document.body.classList.remove('allow-landscape');
    }
    return () => {
        document.body.classList.remove('allow-landscape');
    };
  }, [selectedVideo]);

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
    <div className="fixed inset-0 z-0 bg-slate-900 overflow-hidden touch-none overscroll-none select-none flex flex-col h-screen">
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        
        .film-strip {
          position: relative;
          padding: 30px 0;
          background: #111;
          border-top: 10px dashed #333;
          border-bottom: 10px dashed #333;
          box-shadow: 0 0 30px rgba(0,0,0,0.5);
        }
        .film-strip::before, .film-strip::after {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          height: 15px;
          background-image: radial-gradient(circle, #222 30%, transparent 35%);
          background-size: 30px 100%;
          background-repeat: repeat-x;
        }
        .film-strip::before { top: 5px; }
        .film-strip::after { bottom: 5px; }

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
      
      <div className="relative z-10 h-full flex flex-col pt-[80px] md:pt-[106px] pb-4 px-3 overflow-hidden">
        
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

        <div className="flex-1 flex flex-col justify-end min-h-0 relative z-30 pb-12 md:pb-20">
          
          {/* ZUCCOTTO - ALZATO LEGGERMENTE */}
          <div className="absolute right-[-20px] bottom-[14%] md:bottom-[18%] w-48 md:w-[32rem] z-20 pointer-events-none animate-in slide-in-from-right duration-1000">
             <div className="relative">
                <img src={ZUCCOTTO_POPCORN} alt="" className="w-full h-auto drop-shadow-2xl brightness-110" />
             </div>
          </div>

          <div className="w-full max-w-7xl mx-auto mb-6">
            <div className="flex items-center gap-3 mb-4 px-4">
                <Ticket className="text-yellow-400 animate-pulse" size={24} />
                <span className="text-white font-black text-[12px] md:text-lg uppercase tracking-[0.2em] drop-shadow-md">Novità dal Canale</span>
                <div className="h-1 flex-1 bg-gradient-to-r from-yellow-400/30 to-transparent rounded-full"></div>
            </div>

            <div className="film-strip">
                <div className="flex overflow-x-auto gap-4 md:gap-8 px-8 py-2 custom-scroll snap-x scroll-smooth no-scrollbar">
                    {videos.map((video) => (
                        <div key={video.id} onClick={() => setSelectedVideo(video)} className="flex-shrink-0 w-[180px] md:w-[280px] snap-center group cursor-pointer">
                            <div className="relative aspect-video rounded-lg overflow-hidden border-2 border-white/20 shadow-2xl transition-all duration-300 group-hover:scale-105 group-hover:border-yellow-400">
                                <img src={video.thumbnail} alt="" className="w-full h-full object-cover opacity-90 group-hover:opacity-100" loading="lazy" />
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors flex items-center justify-center">
                                    <CirclePlay className="text-white w-10 h-10 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                                <div className="absolute bottom-0 inset-x-0 bg-black/80 backdrop-blur-md px-2 py-1.5">
                                    <h3 className="font-black text-white text-[9px] md:text-xs line-clamp-1 uppercase text-center">{video.title}</h3>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
          </div>

          {/* AREA TASTI NAVIGAZIONE */}
          <div className="w-full max-w-7xl mx-auto flex flex-col items-start gap-4 md:gap-6 relative z-30 px-6">
              <div className="flex justify-start gap-4 md:gap-8 w-full">
                  <button onClick={() => setView(AppView.CITY_MAP)} className="hover:scale-105 active:scale-95 transition-transform outline-none group flex-1 max-w-[85px] md:max-w-[110px]">
                      <img src={RETURN_CITY_BTN_IMG} alt="Torna in Città" className="w-full h-auto drop-shadow-xl" />
                  </button>
                  <button onClick={(e) => handleExternalClick(e, YT_CHANNEL_URL)} className="hover:scale-105 active:scale-95 transition-transform outline-none group flex-1 max-w-[85px] md:max-w-[110px]">
                      <img src={OFFICIAL_CHANNEL_BTN_IMG} alt="YouTube" className="w-full h-auto drop-shadow-xl" />
                  </button>
              </div>
          </div>
        </div>

        {selectedVideo && (
          <div className="video-modal-overlay fixed inset-0 z-[200] flex items-center justify-center bg-black/95 p-0 md:p-4 animate-in fade-in" onClick={() => setSelectedVideo(null)}>
             <div className="video-modal-container relative w-full max-w-5xl bg-white rounded-[30px] md:rounded-[40px] border-[6px] md:border-[8px] border-red-600 shadow-2xl overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
                <button onClick={() => setSelectedVideo(null)} className="video-modal-close absolute top-4 right-4 z-[210] hover:scale-110 transition-transform">
                   <img src={CLOSE_BTN_IMG} alt="Chiudi" className="w-10 h-10 md:w-20 md:h-20" />
                </button>
                <div className="iframe-container flex-1 w-full aspect-video bg-black">
                    <iframe 
                      src={`https://www.youtube.com/embed/${selectedVideo.id.startsWith('mock') ? 'S7Q1CgO6ZQA' : selectedVideo.id}?autoplay=1&rel=0&modestbranding=1&iv_load_policy=3&showinfo=0`} 
                      className="w-full h-full border-0" 
                      allowFullScreen 
                      allow="autoplay; fullscreen" 
                    />
                </div>
                <div className="video-modal-footer p-4 text-center bg-white shrink-0 border-t border-gray-100 flex items-center justify-center gap-3">
                    <div className="bg-red-600 p-2 rounded-full text-white"><CirclePlay size={20} /></div>
                    <h3 className="text-gray-800 text-lg md:text-2xl font-black uppercase truncate px-2">{selectedVideo.title}</h3>
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoGallery;
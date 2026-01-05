
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { VIDEOS } from '../constants';
import { Video } from '../types';
import { getChannelPlaylists, getPlaylistVideos, searchChannelVideos, getFeaturedVideo } from '../services/api';
import { Search, CirclePlay, Loader2 } from 'lucide-react';

const CLOSE_BTN_IMG = 'https://i.postimg.cc/0NdtYdcJ/tasto-chiudi-(1)-(1).png';
const YT_CHANNEL_URL = 'https://www.youtube.com/@ILoneBoo';
const OFFICIAL_CHANNEL_BTN_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/official+channelds.webp';

const VideoGallery: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [featuredVideo, setFeaturedVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  
  const isMounted = useRef(false);

  const initGallery = useCallback(async () => {
    if (!isMounted.current) return;
    setLoading(true);
    
    try {
        const fv = await getFeaturedVideo();
        if (fv && isMounted.current) setFeaturedVideo(fv);

        const playlists = await getChannelPlaylists();
        const targetPlaylist = playlists.find(p => 
            p.title.toLowerCase().includes('kids songs') || 
            p.title.toLowerCase().includes('canzoni per bambini')
        );

        let fetchedVideos: Video[] = [];
        if (targetPlaylist) {
            fetchedVideos = await getPlaylistVideos(targetPlaylist.id);
        } else {
            const { getLatestVideos } = await import('../services/api');
            fetchedVideos = await getLatestVideos();
        }

        if (isMounted.current) {
            setVideos(fetchedVideos.filter(v => v.id !== fv?.id).slice(0, 12));
        }

    } catch (err) {
        console.error("Gallery UI Error:", err);
        setVideos(VIDEOS);
    } finally {
        if (isMounted.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    isMounted.current = true;
    initGallery();
    return () => { isMounted.current = false; };
  }, [initGallery]);

  // Gestione classe allow-landscape per sbloccare la rotazione
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

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
        if (searchTerm.trim().length > 2) {
            setLoading(true);
            const results = await searchChannelVideos(searchTerm);
            if (isMounted.current) {
                setVideos(results.slice(0, 12));
                setLoading(false);
            }
        } else if (searchTerm.trim().length === 0 && isMounted.current && !loading) {
            initGallery();
        }
    }, 800);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, initGallery]);

  return (
    <div className="bg-white min-h-screen">
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        
        /* FULLSCREEN LANDSCAPE OPTIMIZATION */
        @media (orientation: landscape) {
          .video-modal-overlay {
            padding: 0 !important;
            background: black !important;
          }
          .video-modal-container {
            width: 100vw !important;
            height: 100dvh !important;
            max-width: none !important;
            max-height: none !important;
            border-radius: 0 !important;
            border: none !important;
            margin: 0 !important;
          }
          .video-modal-header, .video-modal-footer {
            display: none !important;
          }
          .video-modal-close {
            top: 20px !important;
            right: 20px !important;
            width: 50px !important;
            height: 50px !important;
            opacity: 0.5;
            background: rgba(0,0,0,0.3);
            border-radius: 50%;
            padding: 5px;
          }
          .video-modal-close:hover {
            opacity: 1;
          }
          .iframe-container {
            border-radius: 0 !important;
          }
        }
      `}</style>

      <div className="no-scrollbar overflow-y-auto h-screen px-3 md:px-6 pt-[80px] md:pt-[120px] pb-24 max-w-6xl mx-auto animate-fade-in flex flex-col">
        
        {/* VIDEO IN EVIDENZA */}
        {featuredVideo && !searchTerm && (
          <div className="mb-10 group cursor-pointer" onClick={() => setSelectedVideo(featuredVideo)}>
              <div className="relative bg-gradient-to-br from-yellow-300 to-orange-400 p-1 rounded-[40px] shadow-2xl border-4 border-black overflow-hidden">
                  <div className="bg-black rounded-[35px] overflow-hidden aspect-video relative">
                      <img 
                          src={featuredVideo.thumbnail.replace('hqdefault', 'maxresdefault')} 
                          alt="" 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90" 
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                          <div className="bg-white/20 backdrop-blur-sm p-4 rounded-full border-4 border-white/40 group-hover:scale-110 transition-transform">
                              <CirclePlay className="text-white w-16 h-16 md:w-24 md:h-24 drop-shadow-2xl" strokeWidth={1.5} />
                          </div>
                      </div>
                  </div>
              </div>
              <div className="mt-4 px-4 text-center">
                  <h2 className="text-gray-900 text-2xl md:text-5xl font-black uppercase tracking-tighter drop-shadow-sm">
                      {featuredVideo.title}
                  </h2>
              </div>
          </div>
        )}

        {/* BARRA DI RICERCA */}
        <div className="relative mb-10 max-w-2xl mx-auto w-full sticky top-0 z-40">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={24} />
            <input 
              type="text" 
              placeholder="Cerca in tutto il canale..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
              className="w-full pl-14 pr-12 py-4 rounded-2xl border-4 border-black font-black text-lg focus:outline-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-white" 
            />
        </div>

        {loading ? (
            <div className="flex flex-col items-center justify-center py-20 flex-1">
                <Loader2 size={64} className="animate-spin text-boo-purple" />
                <p className="text-boo-purple font-black mt-4 uppercase tracking-widest">Caricamento Cinema...</p>
            </div>
        ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
                {videos.map((video) => (
                  <div key={video.id} onClick={() => setSelectedVideo(video)} className="flex flex-col group cursor-pointer">
                      <div className="relative aspect-video rounded-[30px] border-4 border-black overflow-hidden shadow-lg bg-gray-200 mb-3">
                          <img src={video.thumbnail} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                          <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <CirclePlay className="text-white w-12 h-12" />
                          </div>
                      </div>
                      <div className="px-1">
                          <h3 className="font-black text-gray-800 text-sm md:text-xl line-clamp-2 leading-tight uppercase tracking-tight group-hover:text-boo-purple transition-colors">
                              {video.title}
                          </h3>
                      </div>
                  </div>
                ))}
            </div>
        )}

        {/* LINK AL CANALE UFFICIALE (IMMAGINE) */}
        {!loading && (
            <div className="mt-16 mb-10 flex justify-center">
                <a 
                  href={YT_CHANNEL_URL} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:scale-105 active:scale-95 transition-transform outline-none"
                >
                    <img 
                      src={OFFICIAL_CHANNEL_BTN_IMG} 
                      alt="Vedi tutti su YouTube" 
                      className="w-48 md:w-64 h-auto drop-shadow-xl" 
                    />
                </a>
            </div>
        )}

        {/* PLAYER MODALE */}
        {selectedVideo && (
          <div className="video-modal-overlay fixed inset-0 z-[200] flex items-center justify-center bg-black/95 p-0 md:p-4 animate-in fade-in" onClick={() => setSelectedVideo(null)}>
             <div className="video-modal-container relative w-full max-w-5xl bg-white rounded-[40px] border-[8px] border-red-600 shadow-2xl overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
                <button onClick={() => setSelectedVideo(null)} className="video-modal-close absolute top-4 right-4 z-[210] hover:scale-110 transition-transform">
                   <img src={CLOSE_BTN_IMG} alt="Chiudi" className="w-12 h-12 md:w-20 md:h-20" />
                </button>
                <div className="iframe-container flex-1 w-full aspect-video bg-black">
                    <iframe 
                      src={`https://www.youtube.com/embed/${selectedVideo.id}?autoplay=1&rel=0`} 
                      className="w-full h-full border-0" 
                      allowFullScreen 
                      allow="autoplay" 
                    />
                </div>
                <div className="video-modal-footer p-6 text-center bg-white shrink-0">
                    <h3 className="text-gray-800 text-xl md:text-2xl font-black uppercase truncate px-8">{selectedVideo.title}</h3>
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoGallery;


import React, { useState, useEffect, useRef, useCallback } from 'react';
import { VIDEOS, CATEGORIES } from '../constants';
import { Video } from '../types';
import { getChannelPlaylists, getPlaylistVideos, getLatestVideos, searchChannelVideos, getFeaturedVideo } from '../services/api';
import { Search, CirclePlay, Loader2, List, X, ChevronUp, ChevronDown, Star } from 'lucide-react';

const CLOSE_BTN_IMG = 'https://i.postimg.cc/0NdtYdcJ/tasto-chiudi-(1)-(1).png';

const VideoGallery: React.FC = () => {
  // Data state
  const [activeCategory, setActiveCategory] = useState('Tutti'); 
  const [categories, setCategories] = useState<string[]>(CATEGORIES);
  const [playlistsMap, setPlaylistsMap] = useState<Record<string, string>>({}); 
  const [videos, setVideos] = useState<Video[]>(VIDEOS);
  const [featuredVideo, setFeaturedVideo] = useState<Video | null>(null);

  // UI state
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isMounted = useRef(false);

  const loadDefaultView = useCallback(async () => {
    if (!isMounted.current) return;
    setLoading(true);
    
    try {
        // Carica video in evidenza o l'ultimo caricato come fallback
        const fv = await getFeaturedVideo();
        if (fv && isMounted.current) setFeaturedVideo(fv);

        const playlists = await getChannelPlaylists();
        if (isMounted.current) {
            if (playlists.length > 0) {
                const newCats = ['Tutti', ...playlists.map(p => p.title)];
                setCategories(newCats);
                const map: Record<string, string> = {};
                playlists.forEach(p => map[p.title] = p.id);
                setPlaylistsMap(map);
                
                // Cerca una playlist di default (es. Canzoni)
                const defaultPlaylist = playlists.find(p => 
                    p.title.toLowerCase().includes('canzoni') || 
                    p.title.toLowerCase().includes('video')
                );

                if (defaultPlaylist) {
                    setActiveCategory(defaultPlaylist.title);
                    const pVideos = await getPlaylistVideos(defaultPlaylist.id);
                    setVideos(pVideos);
                } else {
                    const latest = await getLatestVideos();
                    setVideos(latest);
                }
            } else {
                // Se non ci sono playlist, carica gli ultimi video
                const latest = await getLatestVideos();
                setVideos(latest);
            }
        }
    } catch (err) {
        console.error("Failed to load YouTube data:", err);
        // Fallback totale sui video statici in caso di errore API
        if (isMounted.current) setVideos(VIDEOS);
    } finally {
        if (isMounted.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    isMounted.current = true;
    loadDefaultView();
    return () => { isMounted.current = false; };
  }, [loadDefaultView]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (selectedVideo) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [selectedVideo]);

  // Gestione Ricerca
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
        if (searchTerm.trim().length > 2) {
            setLoading(true);
            setActiveCategory('Ricerca');
            const results = await searchChannelVideos(searchTerm);
            if (isMounted.current) setVideos(results);
            setLoading(false);
        } else if (searchTerm.trim().length === 0 && activeCategory === 'Ricerca') {
            loadDefaultView();
        }
    }, 800);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, loadDefaultView]);

  const handleCategoryChange = async (cat: string) => {
    setSearchTerm('');
    setActiveCategory(cat);
    setIsDropdownOpen(false);
    setLoading(true);
    
    try {
        const pid = playlistsMap[cat];
        const fetched = pid ? await getPlaylistVideos(pid) : await getLatestVideos();
        if (isMounted.current) setVideos(fetched);
    } catch (e) {
        if (isMounted.current) setVideos(VIDEOS);
    } finally {
        if (isMounted.current) setLoading(false);
    }
  };

  const filteredVideos = videos.filter(v => v.id !== featuredVideo?.id);

  return (
    <div className="px-3 md:px-6 pt-[70px] md:pt-[110px] pb-24 max-w-6xl mx-auto animate-fade-in min-h-screen">
      
      {/* 1. VIDEO IN PRIMO PIANO */}
      {featuredVideo && !searchTerm && (
        <div className="mb-8 animate-in slide-in-from-top duration-700">
            <div className="relative w-full bg-gradient-to-br from-yellow-300 to-orange-400 p-1.5 rounded-[40px] shadow-[0_15px_35px_rgba(0,0,0,0.2)]">
                <div className="bg-white rounded-[32px] overflow-hidden border-4 border-black group cursor-pointer" onClick={() => setSelectedVideo(featuredVideo)}>
                    <div className="relative w-full aspect-video bg-black overflow-hidden border-b-4 border-black">
                         <div className="absolute top-4 left-4 z-20 bg-boo-yellow text-black px-4 py-2 rounded-xl border-2 border-black shadow-lg flex items-center gap-2 rotate-[-2deg]">
                              <Star fill="black" size={18} />
                              <span className="font-black text-sm md:text-lg uppercase">{featuredVideo.category}</span>
                         </div>
                         <img src={featuredVideo.thumbnail.replace('hqdefault', 'maxresdefault')} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                         <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                              <CirclePlay className="text-white w-20 h-20 drop-shadow-2xl group-hover:scale-110 transition-transform" strokeWidth={1.5} />
                         </div>
                    </div>
                    <div className="p-4 md:p-8 text-left bg-white">
                         <h2 className="text-2xl md:text-4xl font-black text-gray-800 leading-tight mb-2">{featuredVideo.title}</h2>
                         <p className="text-gray-500 text-sm md:text-xl font-bold line-clamp-2">{featuredVideo.description}</p>
                    </div>
                </div>
            </div>
        </div>
      )}

      {/* 2. CONTROLLI */}
      <div className="flex flex-col md:flex-row gap-4 mb-10 bg-white/80 backdrop-blur-md p-4 rounded-[35px] border-4 border-black shadow-xl sticky top-20 md:top-28 z-40">
        <div className="relative w-full md:w-1/2" ref={dropdownRef}>
            <button onClick={() => !loading && setIsDropdownOpen(!isDropdownOpen)} className="w-full h-full flex items-center justify-between px-4 py-3 rounded-2xl border-4 border-black bg-white shadow-[4px_4px_0px_0px_#8B5CF6] active:translate-y-1 active:shadow-none transition-all">
                <div className="flex items-center gap-3 overflow-hidden">
                    {loading ? <Loader2 size={24} className="animate-spin text-boo-purple" /> : <List size={24} className="text-boo-purple" strokeWidth={3} />}
                    <div className="text-left truncate">
                         <span className="block text-[10px] font-black text-gray-400 uppercase leading-none mb-1">Playlist</span>
                         <span className="text-lg font-black text-gray-800 truncate">{activeCategory}</span>
                    </div>
                </div>
                <div className="bg-gray-100 p-1 rounded-full border-2 border-gray-300">
                    {isDropdownOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
            </button>
            {isDropdownOpen && (
                <div className="absolute top-full left-0 w-full mt-2 bg-white border-4 border-black rounded-2xl shadow-2xl z-50 max-h-64 overflow-y-auto animate-in fade-in slide-in-from-top-2">
                    {categories.map((cat) => (
                        <button key={cat} onClick={() => handleCategoryChange(cat)} className={`w-full text-left px-5 py-4 font-black text-sm border-b border-gray-100 last:border-b-0 hover:bg-purple-50 ${activeCategory === cat ? 'bg-purple-100 text-boo-purple' : 'text-gray-700'}`}>{cat}</button>
                    ))}
                </div>
            )}
        </div>

        <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={24} />
            <input type="text" placeholder="Cerca un video..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full h-full pl-12 pr-10 py-4 rounded-2xl border-4 border-black font-black text-gray-700 focus:outline-none focus:border-boo-purple bg-gray-50 shadow-inner" />
            {searchTerm && <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 bg-gray-200 p-1 rounded-full"><X size={16} /></button>}
        </div>
      </div>

      {/* 3. GRIGLIA VIDEO */}
      {loading && videos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
              <Loader2 size={64} className="animate-spin text-boo-purple mb-4" />
              <p className="text-white font-black text-xl drop-shadow-md">Entro nel cinema...</p>
          </div>
      ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8">
              {filteredVideos.map((video) => (
                <div key={video.id} onClick={() => setSelectedVideo(video)} className="bg-white rounded-[25px] md:rounded-[35px] border-4 border-black overflow-hidden shadow-lg hover:shadow-[0_10px_0_0_#8B5CF6] hover:-translate-y-2 transition-all cursor-pointer group flex flex-col">
                    <div className="relative aspect-video overflow-hidden border-b-4 border-gray-100">
                        <img src={video.thumbnail} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                             <div className="bg-white/90 p-2 md:p-3 rounded-full shadow-lg">
                                 <CirclePlay className="text-boo-purple w-8 h-8" strokeWidth={2} />
                             </div>
                        </div>
                    </div>
                    <div className="p-3 md:p-5 flex-1 flex flex-col justify-between">
                        <h3 className="font-black text-gray-800 text-[11px] md:text-lg leading-tight line-clamp-2 mb-2 group-hover:text-boo-purple transition-colors">{video.title}</h3>
                        <div className="bg-gray-100 self-start px-2 py-0.5 rounded-lg border border-gray-200">
                             <span className="text-[8px] md:text-[10px] font-black text-gray-500 uppercase">{video.category || 'Video'}</span>
                        </div>
                    </div>
                </div>
              ))}
          </div>
      )}

      {/* PLAYER MODAL */}
      {selectedVideo && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 p-4 animate-in fade-in" onClick={() => setSelectedVideo(null)}>
           <div className="relative w-full max-w-5xl bg-white rounded-[40px] border-[8px] border-red-600 shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
              <button onClick={() => setSelectedVideo(null)} className="absolute top-4 right-4 z-[210] hover:scale-110 transition-transform">
                 <img src={CLOSE_BTN_IMG} alt="Chiudi" className="w-12 h-12 md:w-20 md:h-20 drop-shadow-xl" />
              </button>
              <div className="w-full aspect-video bg-black">
                  <iframe src={`https://www.youtube.com/embed/${selectedVideo.id}?autoplay=1&rel=0`} className="w-full h-full border-0" allowFullScreen allow="autoplay" />
              </div>
              <div className="p-6 text-center bg-white">
                  <h3 className="text-gray-800 text-xl md:text-3xl font-black mb-2">{selectedVideo.title}</h3>
                  <p className="text-gray-500 font-bold text-sm md:text-lg line-clamp-3">{selectedVideo.description}</p>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default VideoGallery;

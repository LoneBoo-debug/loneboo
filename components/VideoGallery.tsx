
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { VIDEOS, CATEGORIES, SOCIALS, YOUTUBE_CONFIG, OFFICIAL_LOGO } from '../constants';
import { Video } from '../types';
import { getChannelPlaylists, getPlaylistVideos, getLatestVideos, searchChannelVideos, getFeaturedVideo } from '../services/api';
import { Search, CirclePlay, Loader2, List, Sparkles, X, ChevronUp, ChevronDown, ExternalLink, Tag, Star } from 'lucide-react';

const CLOSE_BTN_IMG = 'https://i.postimg.cc/0NdtYdcJ/tasto-chiudi-(1)-(1).png';

const VideoGallery: React.FC = () => {
  // Config state
  const isApiConnected = !!(YOUTUBE_CONFIG.API_KEY && YOUTUBE_CONFIG.CHANNEL_ID);

  // Data state
  const [activeCategory, setActiveCategory] = useState('Tutti'); 
  const [activePlaylistId, setActivePlaylistId] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>(CATEGORIES);
  const [playlistsMap, setPlaylistsMap] = useState<Record<string, string>>({}); // Name -> ID
  const [videos, setVideos] = useState<Video[]>(VIDEOS);
  
  // Featured Video State
  const [featuredVideo, setFeaturedVideo] = useState<Video | null>(null);

  // UI state
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  
  // Dropdown state
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Mount tracking
  const isMounted = useRef(false);

  useEffect(() => {
      isMounted.current = true;
      return () => { isMounted.current = false; };
  }, []);

  // Helper to setup mock data for layout preview
  const setupMockData = useCallback(() => {
      if (!isMounted.current) return;
      
      const demoFeatured: Video = {
          id: 'S7Q1CgO6ZQA', 
          title: '✨ ANTEPRIMA LAYOUT: La Magia di Lone Boo ✨',
          description: 'Ruota il dispositivo in orizzontale per vedere i video laterali!',
          thumbnail: 'https://img.youtube.com/vi/S7Q1CgO6ZQA/maxresdefault.jpg',
          category: 'In Primo Piano',
          url: 'https://www.youtube.com/watch?v=S7Q1CgO6ZQA',
          publishedAt: new Date().toISOString()
      };
      
      setFeaturedVideo(demoFeatured);
      const fillerVideos = [...VIDEOS, ...VIDEOS, ...VIDEOS].map((v, i) => ({ ...v, id: `${v.id}-dup-${i}` })); 
      setVideos(fillerVideos);
      setActiveCategory('Tutti (Anteprima)');
  }, []);

  // --- REUSABLE FUNCTION: LOAD DEFAULT VIEW ---
  const loadDefaultView = useCallback(async () => {
      if (!isApiConnected) {
          setupMockData();
          return;
      }

      try {
          if (isMounted.current) {
              setLoading(true);
              setError(null);
          }
          
          try {
              const fv = await getFeaturedVideo();
              if (!isMounted.current) return;

              if (fv) {
                  setFeaturedVideo(fv);
              }

              const playlists = await getChannelPlaylists();
              if (!isMounted.current) return;

              if (playlists.length > 0) {
                  const newCategories = ['Tutti', ...playlists.map(p => p.title)];
                  setCategories(newCategories);
                  
                  const map: Record<string, string> = {};
                  playlists.forEach(p => map[p.title] = p.id);
                  setPlaylistsMap(map);
                  
                  const kidsPlaylist = playlists.find(p => {
                      const title = (p.title || '').toLowerCase();
                      return title.includes('kids songs') || title.includes('canzoni per bambini');
                  });

                  if (kidsPlaylist) {
                      setActiveCategory(kidsPlaylist.title);
                      setActivePlaylistId(kidsPlaylist.id);
                      const kidsVideos = await getPlaylistVideos(kidsPlaylist.id);
                      if (isMounted.current) setVideos(kidsVideos);
                  } else {
                      setActiveCategory('Ultimi Caricamenti');
                      setActivePlaylistId(null);
                      const latest = await getLatestVideos();
                      if (isMounted.current) setVideos(latest);
                  }
              } else {
                  setActiveCategory('Ultimi Caricamenti');
                  const latest = await getLatestVideos();
                  if (isMounted.current) setVideos(latest.length > 0 ? latest : VIDEOS);
              }
          } catch (err) {
              console.error("API Error during load:", err);
              if (isMounted.current) setupMockData();
          }
      } catch (mainError) {
          console.error("Critical error loading video gallery:", mainError);
          if (isMounted.current) setupMockData();
      } finally {
          if (isMounted.current) setLoading(false);
      }
  }, [isApiConnected, setupMockData]);


  // --- INITIALIZATION ---
  useEffect(() => {
    loadDefaultView();
  }, [loadDefaultView]);

  // --- LISTENER FOR EXTERNAL RESET (LOGO CLICK) ---
  useEffect(() => {
    const handleResetEvent = () => {
        setSearchTerm('');
        loadDefaultView();
    };
    window.addEventListener('resetVideoGallery', handleResetEvent);
    return () => window.removeEventListener('resetVideoGallery', handleResetEvent);
  }, [loadDefaultView]);


  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Prevent background scrolling when video modal is open
  useEffect(() => {
    if (selectedVideo) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [selectedVideo]);

  // --- GLOBAL SEARCH LOGIC ---
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
        if (searchTerm.trim().length > 0) {
            if (isMounted.current) {
                setLoading(true);
                setActiveCategory('Risultati Ricerca');
                setFeaturedVideo(null);
            }
            
            if (isApiConnected) {
                const results = await searchChannelVideos(searchTerm);
                if (isMounted.current) setVideos(results);
            } else {
                const results = VIDEOS.filter(v => 
                    v.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                    v.category.toLowerCase().includes(searchTerm.toLowerCase())
                );
                if (isMounted.current) setVideos(results);
            }
            if (isMounted.current) setLoading(false);
        }
    }, 800);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, isApiConnected]);


  // --- HANDLE CATEGORY/PLAYLIST CHANGE ---
  const handleCategoryChange = async (cat: string) => {
    setSearchTerm('');
    setActiveCategory(cat);
    setIsDropdownOpen(false); 
    setError(null);
    setFeaturedVideo(null);

    if (isApiConnected) {
        setLoading(true);
        let fetchedVideos: Video[] = [];

        if (cat === 'Tutti' || cat === 'Ultimi Caricamenti') {
            setActivePlaylistId(null);
            fetchedVideos = await getLatestVideos();
            getFeaturedVideo().then(fv => { if(fv && isMounted.current) setFeaturedVideo(fv); });
        } else {
            const pid = playlistsMap[cat];
            setActivePlaylistId(pid);
            if (pid) {
                fetchedVideos = await getPlaylistVideos(pid);
            }
        }
        
        if (!isMounted.current) return;
        setVideos(fetchedVideos.length === 0 && cat === 'Tutti' ? VIDEOS : fetchedVideos);
        setLoading(false);
    } else {
        if (cat.includes('Tutti')) {
            setupMockData();
        } else {
            setVideos(VIDEOS.filter(v => v.category === cat));
        }
    }
  };

  const handleClearSearch = () => {
      setSearchTerm('');
      loadDefaultView();
  };

  const filteredVideos = Array.isArray(videos) ? videos.filter(v => v.id !== featuredVideo?.id) : [];
  const sideVideos = featuredVideo ? filteredVideos.slice(0, 2) : [];
  const bottomVideos = featuredVideo ? filteredVideos.slice(2, 14) : filteredVideos.slice(0, 12);

  return (
    <div className="px-3 md:px-6 pt-2 pb-6 max-w-7xl mx-auto animate-fade-in min-h-[600px]">
      
      {/* --- INTERNAL VIDEO PLAYER MODAL --- */}
      {selectedVideo && (
        <div className="fixed inset-0 z-[110] flex flex-col items-center justify-center bg-white/10 animate-in fade-in duration-300 backdrop-blur-sm p-4">
           <div className="relative w-full max-w-5xl bg-white rounded-[32px] md:rounded-[48px] border-[6px] md:border-[12px] border-red-600 shadow-2xl overflow-visible">
              
              {/* Custom Image Close Button */}
              <button 
                onClick={() => setSelectedVideo(null)} 
                className="absolute -top-6 -right-4 md:-top-10 md:-right-10 z-[120] hover:scale-110 active:scale-95 transition-all outline-none"
              >
                 <img 
                   src={CLOSE_BTN_IMG} 
                   alt="Chiudi" 
                   className="w-16 h-16 md:w-24 md:h-24 drop-shadow-xl" 
                 />
              </button>

              {/* VIDEO PLAYER CONTAINER */}
              <div className="w-full aspect-video bg-black rounded-[24px] md:rounded-[36px] overflow-hidden relative">
                  <iframe
                      src={`https://www.youtube.com/embed/${selectedVideo.id}?autoplay=1&rel=0&modestbranding=1`}
                      className="absolute inset-0 w-full h-full border-0"
                      title={selectedVideo.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      loading="lazy"
                  />
              </div>

              {/* Metadata displayed inside popup below video */}
              <div className="p-4 md:p-6 text-center bg-white rounded-b-[24px] md:rounded-b-[36px]">
                  <h3 className="text-gray-800 text-lg md:text-2xl font-black mb-1 leading-tight line-clamp-1">{selectedVideo.title}</h3>
                  <a 
                    href={selectedVideo.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-boo-purple text-xs md:text-sm font-black uppercase hover:underline flex items-center justify-center gap-1 transition-colors"
                  >
                      <ExternalLink size={14} />
                      Apri su YouTube
                  </a>
              </div>
           </div>
        </div>
      )}

      {/* --- FEATURED HERO SECTION --- */}
      {featuredVideo && !searchTerm && (
          <div className="mb-4 animate-fade-in-up grid grid-cols-1 lg:grid-cols-3 landscape:grid-cols-3 gap-4 md:gap-6">
              <div className="lg:col-span-2 landscape:col-span-2 relative w-full h-full bg-gradient-to-br from-yellow-300 to-orange-400 p-1 rounded-[35px] shadow-[8px_8px_0px_0px_rgba(0,0,0,0.3)]">
                  <div className="bg-white rounded-[32px] overflow-hidden border-4 border-black group cursor-pointer h-full flex flex-col" onClick={() => setSelectedVideo(featuredVideo)}>
                      <div className="relative w-full aspect-video bg-black overflow-hidden border-b-4 border-black">
                           <div className="absolute top-4 left-4 z-20 bg-boo-yellow text-black px-3 py-1.5 rounded-lg border-2 border-black shadow-[2px_2px_0_rgba(0,0,0,0.8)] flex items-center gap-2 rotate-[-2deg] origin-top-left pointer-events-none">
                                <Star fill="black" className="text-black" size={14} />
                                <span className="font-black text-xs md:text-sm uppercase tracking-wide">In Primo Piano</span>
                           </div>
                           <img 
                                src={featuredVideo.thumbnail.replace('hqdefault', 'maxresdefault')} 
                                alt={featuredVideo.title} 
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                           />
                           <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                                <CirclePlay className="text-white w-20 h-20 drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)] group-hover:scale-110 transition-transform" strokeWidth={1.5} />
                           </div>
                      </div>
                      <div className="p-4 md:p-6 text-left bg-white flex-1 flex flex-col justify-center">
                           <h2 className="text-xl md:text-3xl font-black text-gray-800 leading-tight mb-2 line-clamp-2">
                                {featuredVideo.title}
                           </h2>
                           <p className="text-gray-600 text-sm md:text-base font-bold line-clamp-2">
                                {featuredVideo.description}
                           </p>
                      </div>
                  </div>
              </div>

              <div className="hidden lg:flex landscape:flex flex-col gap-4 h-full">
                  {sideVideos.map((video) => (
                      <div key={video.id} className="bg-white rounded-3xl overflow-hidden border-4 border-black shadow-[4px_4px_0px_0px_rgba(139,92,246,1)] hover:translate-y-[-2px] transition-all cursor-pointer flex flex-col flex-1" onClick={() => setSelectedVideo(video)}>
                          <div className="relative w-full aspect-video bg-black overflow-hidden border-b-4 border-black shrink-0">
                              <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-black/10 flex items-center justify-center group-hover:bg-black/20 transition-colors">
                                  <CirclePlay className="text-white w-10 h-10 drop-shadow-md opacity-90" strokeWidth={1.5} />
                              </div>
                          </div>
                          <div className="p-2 bg-white flex-1 flex flex-col justify-center min-h-0">
                              <h3 className="text-xs lg:text-sm font-black text-gray-800 leading-tight line-clamp-2 mb-1">
                                  {video.title}
                              </h3>
                              <p className="text-[10px] font-bold text-boo-purple uppercase truncate">{video.category}</p>
                          </div>
                      </div>
                  ))}
                  {sideVideos.length < 2 && (
                      <div className="h-full flex items-center justify-center bg-gray-50 rounded-3xl border-4 border-dashed border-gray-300">
                          <p className="text-gray-400 font-bold text-sm text-center px-4">Altri video in arrivo...</p>
                      </div>
                  )}
              </div>
          </div>
      )}

      {/* --- CONTROLS SECTION --- */}
      <div className="flex flex-col md:flex-row gap-4 mb-8 bg-white p-4 rounded-3xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)] relative z-30">
        <div className="relative w-full md:w-5/12" ref={dropdownRef}>
            <button 
                onClick={() => !loading && setIsDropdownOpen(!isDropdownOpen)}
                className={`
                    w-full flex items-center justify-between px-3 py-2 md:px-4 md:py-3 rounded-2xl border-4 border-black 
                    bg-white transition-all shadow-[4px_4px_0px_0px_#8B5CF6] 
                    hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_#8B5CF6] active:translate-y-0 active:shadow-[2px_2px_0px_0px_#8B5CF6]
                    ${loading ? 'cursor-wait opacity-70' : 'cursor-pointer'}
                `}
            >
                <div className="flex items-center gap-3 overflow-hidden">
                    {loading ? (
                        <Loader2 size={24} className="animate-spin text-boo-purple flex-shrink-0" />
                    ) : (
                         <div className="bg-boo-purple text-white p-2 rounded-xl border-2 border-black rotate-[-3deg] shadow-sm flex-shrink-0">
                            <List size={22} strokeWidth={3} />
                        </div>
                    )}
                    <div className="flex flex-col text-left overflow-hidden">
                         <span className="text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Seleziona</span>
                         <div className="flex flex-col md:flex-row md:items-baseline gap-0 md:gap-2 leading-none">
                             <span className="text-lg md:text-xl font-black text-boo-purple tracking-tight">PLAYLIST</span>
                             <span className="text-sm font-bold text-gray-800 truncate md:border-l-2 md:border-gray-300 md:pl-2">
                                {activeCategory}
                             </span>
                         </div>
                    </div>
                </div>
                <div className="bg-gray-100 p-1.5 rounded-full border-2 border-gray-300">
                    {isDropdownOpen ? <ChevronUp size={20} className="text-gray-600"/> : <ChevronDown size={20} className="text-gray-600"/>}
                </div>
            </button>

            {isDropdownOpen && (
                <div className="absolute top-full left-0 w-full mt-2 bg-white border-4 border-black rounded-2xl shadow-2xl z-50 max-h-60 overflow-y-auto animate-in fade-in slide-in-from-top-2">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => handleCategoryChange(cat)}
                            className={`
                                w-full text-left px-5 py-4 font-bold text-sm md:text-base border-b border-gray-100 last:border-b-0 hover:bg-purple-50 transition-colors
                                ${activeCategory === cat ? 'bg-purple-100 text-boo-purple' : 'text-gray-700'}
                            `}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            )}
        </div>

        <div className="relative flex-1">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                <Search size={24} />
            </div>
            <input 
                type="text" 
                placeholder="Cerca un video..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-full pl-12 pr-10 py-3 rounded-2xl border-4 border-black font-bold text-gray-700 placeholder-gray-400 focus:outline-none focus:border-boo-purple transition-all shadow-inner bg-gray-50"
            />
            {searchTerm && (
                <button 
                    onClick={handleClearSearch}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-gray-200 text-gray-500 p-1 rounded-full hover:bg-red-500 hover:text-white transition-colors"
                >
                    <X size={16} strokeWidth={3} />
                </button>
            )}
        </div>
      </div>

      {/* --- VIDEO GRID --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20">
          {bottomVideos.length > 0 ? (
              bottomVideos.map((video) => (
                <div 
                    key={video.id} 
                    onClick={() => setSelectedVideo(video)}
                    className="bg-white rounded-[24px] border-4 border-black overflow-hidden shadow-[6px_6px_0px_0px_rgba(0,0,0,0.1)] hover:shadow-[8px_8px_0px_0px_rgba(139,92,246,1)] hover:border-boo-purple hover:scale-[1.02] transition-all cursor-pointer group flex flex-col"
                >
                    <div className="relative aspect-video overflow-hidden border-b-4 border-gray-100 group-hover:border-boo-purple/30 transition-colors">
                        <img 
                            src={video.thumbnail} 
                            alt={video.title} 
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            loading="lazy"
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                             <div className="bg-white/90 p-3 rounded-full shadow-lg transform scale-0 group-hover:scale-100 transition-transform">
                                 <CirclePlay className="text-boo-purple w-10 h-10" strokeWidth={1.5} />
                             </div>
                        </div>
                    </div>
                    <div className="p-4 flex-1 flex flex-col justify-between bg-white">
                        <div>
                            <h3 className="font-black text-gray-800 text-sm md:text-base leading-tight mb-2 line-clamp-2 group-hover:text-boo-purple transition-colors">
                                {video.title}
                            </h3>
                            <p className="text-gray-500 text-xs font-medium line-clamp-2 leading-relaxed">
                                {video.description}
                            </p>
                        </div>
                        <div className="mt-4 flex items-center gap-2">
                             <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-wide border border-gray-200">
                                 {video.category || 'Video'}
                             </span>
                        </div>
                    </div>
                </div>
              ))
          ) : (
              <div className="col-span-full py-16 text-center animate-in fade-in">
                  <div className="inline-block p-6 rounded-full bg-gray-100 mb-4 border-4 border-gray-200">
                      <Sparkles size={48} className="text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-black text-gray-400 mb-2">Nessun video trovato</h3>
                  <button onClick={handleClearSearch} className="mt-6 text-boo-purple font-black underline hover:text-purple-700">Torna a tutti i video</button>
              </div>
          )}
      </div>
    </div>
  );
};

export default VideoGallery;

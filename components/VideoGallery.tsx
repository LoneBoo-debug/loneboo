
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { VIDEOS, CATEGORIES, SOCIALS, YOUTUBE_CONFIG } from '../constants';
import { Video } from '../types';
import { getChannelPlaylists, getPlaylistVideos, getLatestVideos, searchChannelVideos, getFeaturedVideo } from '../services/api';
import { Search, CirclePlay, Loader2, List, Sparkles, X, ChevronUp, ChevronDown, ExternalLink, Tag, Star } from 'lucide-react';

// =================================================================================================
// 🎞️ CORNICE PLAYER VIDEO
// =================================================================================================
const VIDEO_PLAYER_FRAME = 'https://i.postimg.cc/vTy5Gzgb/playervideo.jpg';

// --- CONFIGURAZIONE 1: VISTA DESKTOP ---
const PLAYER_CONFIG_DESKTOP = {
    top: '5.9%',
    left: '19.9%',
    width: '60.4%',
    height: '74.8%'
};

// --- CONFIGURAZIONE 2: VISTA MOBILE ---
const PLAYER_CONFIG_MOBILE = {
    top: '5.3%',
    left: '5.9%',
    width: '89%',
    height: '74.8%'
};

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
  
  // Config State (Auto-switch on resize)
  const [playerConfig, setPlayerConfig] = useState(window.innerWidth < 768 ? PLAYER_CONFIG_MOBILE : PLAYER_CONFIG_DESKTOP);

  // Dropdown state
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Mount tracking
  const isMounted = useRef(false);

  // Monitor Resize to switch configs
  useEffect(() => {
      isMounted.current = true;
      
      const handleResize = () => {
          const mobile = window.innerWidth < 768;
          setPlayerConfig(mobile ? PLAYER_CONFIG_MOBILE : PLAYER_CONFIG_DESKTOP);
      };

      window.addEventListener('resize', handleResize);
      return () => { 
          isMounted.current = false; 
          window.removeEventListener('resize', handleResize);
      };
  }, []);

  const youtubeLink = SOCIALS.find(s => s.platform === 'YouTube')?.url || 'https://www.youtube.com/@ILoneBoo';

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
              // 1. Fetch featured video
              const fv = await getFeaturedVideo();
              
              if (!isMounted.current) return;

              if (fv) {
                  setFeaturedVideo(fv);
              } else {
                  setupMockData();
                  setLoading(false);
                  return; 
              }

              // 2. Fetch Playlists
              const playlists = await getChannelPlaylists();
              
              if (!isMounted.current) return;

              if (playlists.length > 0) {
                  const newCategories = ['Tutti', ...playlists.map(p => p.title)];
                  setCategories(newCategories);
                  
                  const map: Record<string, string> = {};
                  playlists.forEach(p => map[p.title] = p.id);
                  setPlaylistsMap(map);
                  
                  // Priority: Kids Songs
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
                      // Fallback: Latest
                      setActiveCategory('Ultimi Caricamenti');
                      setActivePlaylistId(null);
                      const latest = await getLatestVideos();
                      if (isMounted.current) setVideos(latest);
                  }
              } else {
                  // Fallback if no playlists found via API
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
    window.dispatchEvent(new Event('resetVideoGallery'));
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
            // SEARCH MODE: Search ALL videos
            if (isMounted.current) {
                setLoading(true);
                setActiveCategory('Risultati Ricerca'); // Update visual label
                setFeaturedVideo(null); // Hide featured video during search
            }
            
            if (isApiConnected) {
                // Use API Search
                const results = await searchChannelVideos(searchTerm);
                if (isMounted.current) setVideos(results);
            } else {
                // Use Mock Data Search
                const results = VIDEOS.filter(v => 
                    v.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                    v.category.toLowerCase().includes(searchTerm.toLowerCase())
                );
                if (isMounted.current) setVideos(results);
            }
            if (isMounted.current) setLoading(false);
        }
    }, 800); // 800ms debounce

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, isApiConnected]);


  // --- HANDLE CATEGORY/PLAYLIST CHANGE ---
  const handleCategoryChange = async (cat: string) => {
    setSearchTerm(''); // Clear search when picking a category manually
    setActiveCategory(cat);
    setIsDropdownOpen(false); 
    setError(null);
    setFeaturedVideo(null); // Hide featured video when changing category to avoid clutter

    if (isApiConnected) {
        setLoading(true);
        let fetchedVideos: Video[] = [];

        if (cat === 'Tutti' || cat === 'Ultimi Caricamenti') {
            setActivePlaylistId(null);
            fetchedVideos = await getLatestVideos();
            // Try to re-fetch featured video if going back to main view
            getFeaturedVideo().then(fv => { if(fv && isMounted.current) setFeaturedVideo(fv); });
        } else {
            const pid = playlistsMap[cat];
            setActivePlaylistId(pid);
            if (pid) {
                fetchedVideos = await getPlaylistVideos(pid);
            }
        }
        
        if (!isMounted.current) return;

        // Safety Fallback for API calls
        if (fetchedVideos.length === 0 && cat === 'Tutti') {
             setVideos(VIDEOS);
        } else {
             setVideos(fetchedVideos);
        }
        
        setLoading(false);
    } else {
        // Manual Mode Handling
        if (cat.includes('Tutti')) {
            setupMockData(); // Restore featured layout on "Tutti"
        } else {
            setVideos(VIDEOS.filter(v => v.category === cat));
        }
    }
  };

  const handleClearSearch = () => {
      setSearchTerm('');
      loadDefaultView();
  };

  // --- LOGIC FOR SPLITTING VIDEOS (Desktop/Landscape Layout) ---
  const filteredVideos = videos.filter(v => v.id !== featuredVideo?.id);
  const sideVideos = featuredVideo ? filteredVideos.slice(0, 2) : [];
  const bottomVideos = featuredVideo ? filteredVideos.slice(2, 14) : videos.slice(0, 12);

  return (
    <div className="px-3 md:px-6 pt-2 pb-6 max-w-7xl mx-auto animate-fade-in min-h-[600px]">
      
      {/* --- INTERNAL VIDEO PLAYER MODAL --- */}
      {selectedVideo && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 animate-in fade-in duration-300 backdrop-blur-md">
           <div className="relative w-full max-w-6xl flex flex-col items-center">
              
              {/* Header Controls */}
              <div className="absolute -top-14 right-0 flex gap-3 z-50">
                  <button 
                    onClick={() => setSelectedVideo(null)} 
                    className="bg-red-600 text-white p-2 rounded-full border-2 border-white hover:scale-110 hover:bg-red-500 transition-all shadow-lg"
                  >
                     <X size={28} strokeWidth={3} />
                  </button>
              </div>

              {/* VIDEO FRAME CONTAINER */}
              <div className="relative w-full aspect-[16/9] max-h-[85vh]">
                  {/* Custom Frame Image */}
                  <img 
                      src={VIDEO_PLAYER_FRAME} 
                      alt="Cornice Player" 
                      className="w-full h-full object-contain drop-shadow-2xl select-none"
                  />

                  {/* YouTube Iframe positioned inside frame */}
                  <div 
                      className="absolute bg-black overflow-hidden rounded-lg shadow-inner"
                      style={{
                          top: playerConfig.top,
                          left: playerConfig.left,
                          width: playerConfig.width,
                          height: playerConfig.height
                      }}
                  >
                        <iframe
                            src={`https://www.youtube.com/embed/${selectedVideo.id}?autoplay=1&rel=0&modestbranding=1`}
                            className="w-full h-full"
                            title={selectedVideo.title}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            loading="lazy"
                        />
                  </div>
              </div>

              {/* Fallback Link */}
              <div className="mt-4 flex flex-col items-center text-center">
                  <a 
                    href={selectedVideo.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-white/60 text-xs font-bold uppercase hover:text-white flex items-center gap-1 underline"
                  >
                      <ExternalLink size={12} />
                      Apri su YouTube
                  </a>
              </div>

           </div>
        </div>
      )}

      {/* --- FEATURED HERO SECTION (Responsive Split) --- */}
      {/* Logic: 1 Column in Portrait, 3 Columns in Landscape/Desktop */}
      {featuredVideo && !searchTerm && (
          <div className="mb-4 animate-fade-in-up grid grid-cols-1 lg:grid-cols-3 landscape:grid-cols-3 gap-4 md:gap-6">
              
              {/* MAIN FEATURED VIDEO (Takes 2 columns on Landscape, full on Portrait) */}
              <div className="lg:col-span-2 landscape:col-span-2 relative w-full h-full bg-gradient-to-br from-yellow-300 to-orange-400 p-1 rounded-[35px] shadow-[8px_8px_0px_0px_rgba(0,0,0,0.3)]">
                  <div className="bg-white rounded-[32px] overflow-hidden border-4 border-black group cursor-pointer h-full flex flex-col" onClick={() => setSelectedVideo(featuredVideo)}>
                      {/* Thumbnail */}
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
                      {/* Text */}
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

              {/* SIDE VIDEOS (HIDDEN IN PORTRAIT, VISIBLE IN LANDSCAPE/DESKTOP) */}
              {/* This is the key: hidden by default, visible if lg (desktop) OR landscape (mobile rotated) */}
              <div className="hidden lg:flex landscape:flex flex-col gap-4 h-full">
                  {sideVideos.map((video) => (
                      <div key={video.id} className="bg-white rounded-3xl overflow-hidden border-4 border-black shadow-[4px_4px_0px_0px_rgba(139,92,246,1)] hover:translate-y-[-2px] transition-all cursor-pointer flex flex-col flex-1" onClick={() => setSelectedVideo(video)}>
                          {/* Image is Aspect Video to avoid cropping */}
                          <div className="relative w-full aspect-video bg-black overflow-hidden border-b-4 border-black shrink-0">
                              <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-black/10 flex items-center justify-center group-hover:bg-black/20 transition-colors">
                                  <CirclePlay className="text-white w-10 h-10 drop-shadow-md opacity-90" strokeWidth={1.5} />
                              </div>
                          </div>
                          {/* Reduced padding */}
                          <div className="p-2 bg-white flex-1 flex flex-col justify-center min-h-0">
                              <h3 className="text-xs lg:text-sm font-black text-gray-800 leading-tight line-clamp-2 mb-1">
                                  {video.title}
                              </h3>
                              <p className="text-[10px] font-bold text-boo-purple uppercase truncate">{video.category}</p>
                          </div>
                      </div>
                  ))}
                  {/* Empty state filler if less than 2 side videos */}
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
        
        {/* Custom Dropdown for Categories */}
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
                             <span className="text-lg md:text-xl font-black text-boo-purple tracking-tight" style={{ textShadow: "1px 1px 0px rgba(0,0,0,0.1)" }}>PLAYLIST</span>
                             <span className="text-sm font-bold text-gray-800 truncate md:border-l-2 md:border-gray-300 md:pl-2">
                                {activeCategory}
                             </span>
                         </div>
                    </div>
                </div>
                <div className="bg-gray-100 p-1 rounded-full border-2 border-gray-200 flex-shrink-0">
                    {isDropdownOpen ? <ChevronUp size={20} className="text-gray-600" /> : <ChevronDown size={20} className="text-gray-600" />}
                </div>
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-3 bg-white border-4 border-black rounded-2xl shadow-xl max-h-80 overflow-y-auto overflow-x-hidden z-50 animate-in fade-in zoom-in-95 duration-100">
                     <div className="sticky top-0 bg-gray-50 border-b-2 border-gray-100 px-4 py-2 font-bold text-xs text-gray-500 uppercase tracking-widest">
                        Tutte le Categorie
                    </div>
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => handleCategoryChange(cat)}
                            className={`
                                w-full text-left px-4 py-3 font-bold border-b border-gray-100 hover:bg-boo-purple/10 transition-colors flex items-center justify-between group
                                ${activeCategory === cat ? 'bg-boo-purple/10 text-boo-purple' : 'text-gray-600'}
                            `}
                        >
                            <span className="truncate group-hover:translate-x-1 transition-transform">{cat}</span>
                            {activeCategory === cat && <Sparkles size={16} className="text-boo-purple animate-pulse" />}
                        </button>
                    ))}
                </div>
            )}
        </div>
        
        {/* Search Input */}
        <div className="relative w-full md:w-7/12 group">
          <input
            type="text"
            placeholder="Cerca in tutto il canale..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-14 pr-12 py-4 md:py-3 h-full rounded-2xl border-4 border-gray-200 focus:border-black focus:outline-none focus:ring-0 bg-gray-50 text-boo-purple text-lg font-bold placeholder-gray-400 transition-colors"
          />
          <Search 
            className="absolute left-4 top-1/2 -translate-y-1/2 text-boo-orange drop-shadow-sm rotate-[-10deg] group-hover:scale-110 transition-transform" 
            size={30} 
            strokeWidth={3.5}
          />
          
          {/* Clear Search Button (Cartoon X) */}
          {searchTerm.length > 0 && (
              <button 
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-red-500 text-white p-1 rounded-full border-2 border-black hover:scale-105 transition-transform shadow-[2px_2px_0px_black] active:shadow-none active:translate-y-[1px]"
                aria-label="Cancella ricerca"
              >
                  <X size={20} strokeWidth={4} />
              </button>
          )}
        </div>
      </div>

      {/* Error State */}
      {error && isApiConnected && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-8 rounded-r relative z-10">
              <p className="font-bold">Errore Connessione YouTube</p>
              <p>{error}</p>
              <p className="text-xs mt-2">Mostro i video salvati in modalità demo.</p>
          </div>
      )}

      {/* Loading State for Grid */}
      {loading ? (
          <div className="flex flex-col items-center justify-center h-64 relative z-10">
              <Loader2 size={48} className="animate-spin text-white mb-4" />
              <p className="font-bold text-white text-xl">Sto cercando i video...</p>
          </div>
      ) : (
        <>
            {/* MAIN GRID - Renders remaining videos (Max 12) */}
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6 mb-12 relative z-10">
                {bottomVideos.map((video) => (
                <div key={video.id} className="group relative bg-white rounded-3xl overflow-hidden border-4 border-black shadow-[4px_4px_0px_0px_rgba(139,92,246,1)] md:shadow-[8px_8px_0px_0px_rgba(139,92,246,1)] hover:translate-y-[-4px] transition-all duration-300 flex flex-col h-full">
                    
                    {/* Thumbnail Area - STRICT 16:9 Aspect Ratio - NO CROPPING */}
                    <div 
                        className="relative w-full aspect-video bg-black cursor-pointer overflow-hidden border-b-4 border-black flex-shrink-0"
                        onClick={() => setSelectedVideo(video)}
                    >
                        <img 
                            src={video.thumbnail} 
                            alt={video.title} 
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                            <CirclePlay className="text-white opacity-90 group-hover:scale-110 transition-transform drop-shadow-lg w-10 h-10 md:w-16 md:h-16" fill="rgba(0,0,0,0.5)" />
                        </div>
                    </div>

                    <div className="p-2 flex flex-col flex-grow">
                        {/* Title - Reduced padding/spacing */}
                        <h3 
                            className="text-xs md:text-sm font-black text-gray-800 leading-tight mb-1 line-clamp-2 cursor-pointer hover:text-boo-purple transition-colors"
                            style={{ textShadow: "1px 1px 0px rgba(0,0,0,0.05)" }}
                            onClick={() => setSelectedVideo(video)}
                        >
                            {video.title}
                        </h3>
                        
                        {/* Playlist/Category Badge */}
                        <div className="mt-auto pt-1 flex items-center gap-1 opacity-80">
                             <Tag size={12} className="text-boo-purple fill-boo-purple/20 shrink-0" />
                             <p className="text-[10px] font-bold text-boo-purple uppercase tracking-wide truncate">
                                {video.category}
                             </p>
                        </div>
                    </div>
                </div>
                ))}
            </div>
            
            {/* Empty State */}
            {bottomVideos.length === 0 && !loading && (
                <div className="text-center py-20 bg-white/10 rounded-3xl border-4 border-dashed border-white/30 relative z-10">
                <p className="text-2xl font-bold text-white">Nessun video trovato 👻</p>
                <button 
                    onClick={handleClearSearch}
                    className="mt-4 text-boo-yellow font-bold underline text-lg"
                >
                    Torna a tutti i video
                </button>
                </div>
            )}
        </>
      )}

      {/* Pagination & External Channel Link */}
      <div className="flex flex-col items-center gap-6 mt-8 relative z-10">
        
        {/* Link to Full YouTube Channel */}
        <div className="flex flex-col items-center mt-12 mb-8 animate-fade-in-up">
            <p className="text-white font-cartoon text-xl md:text-2xl mb-4 tracking-wide drop-shadow-md text-center max-w-lg leading-relaxed">
                {isApiConnected ? "Vuoi esplorare tutto l'archivio?" : "Non hai trovato quello che cercavi?"}
            </p>
            
            <a 
              href={`${youtubeLink}?sub_confirmation=1`}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col md:flex-row items-center gap-4 active:scale-95 transition-transform"
            >
              {/* Custom Cartoon YouTube Logo */}
              <div className="relative w-24 h-16 bg-red-600 rounded-2xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center rotate-[-3deg] transition-all duration-300">
                  <div className="absolute top-1 left-2 w-12 h-4 bg-white/20 rounded-full rotate-[-5deg]"></div>
                  <div className="w-0 h-0 border-t-[12px] border-t-transparent border-l-[22px] border-l-white border-b-[12px] border-b-transparent ml-2 filter drop-shadow-sm"></div>
              </div>

              {/* Text */}
              <span className="font-cartoon text-2xl md:text-4xl text-boo-yellow transition-colors text-center md:text-left" style={{ textShadow: "3px 3px 0px black", WebkitTextStroke: "2px black" }}>
                VAI AL CANALE UFFICIALE
              </span>
            </a>
        </div>
      </div>
    </div>
  );
};

export default VideoGallery;
    
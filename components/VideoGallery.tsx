
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { VIDEOS } from '../constants';
import { Video } from '../types';
import { getChannelPlaylists, getPlaylistVideos, getLatestVideos, searchChannelVideos, getFeaturedVideo } from '../services/api';
import { Search, CirclePlay, Loader2, List, X, ChevronUp, ChevronDown, Star } from 'lucide-react';

const CLOSE_BTN_IMG = 'https://i.postimg.cc/0NdtYdcJ/tasto-chiudi-(1)-(1).png';

const VideoGallery: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('Tutti'); 
  const [categories, setCategories] = useState<string[]>(['Tutti']);
  const [playlistsMap, setPlaylistsMap] = useState<Record<string, string>>({}); 
  const [videos, setVideos] = useState<Video[]>([]);
  const [featuredVideo, setFeaturedVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isMounted = useRef(false);

  const initGallery = useCallback(async () => {
    if (!isMounted.current) return;
    setLoading(true);
    
    try {
        // Carichiamo tutto in parallelo per non aspettare
        const [fv, pls, lts] = await Promise.all([
            getFeaturedVideo(),
            getChannelPlaylists(),
            getLatestVideos()
        ]);

        if (!isMounted.current) return;

        if (fv) setFeaturedVideo(fv);
        
        if (pls && pls.length > 0) {
            setCategories(['Tutti', ...pls.map(p => p.title)]);
            const map: Record<string, string> = {};
            pls.forEach(p => map[p.title] = p.id);
            setPlaylistsMap(map);
        }

        setVideos(lts && lts.length > 0 ? lts : VIDEOS);

    } catch (err) {
        console.error("Gallery Error:", err);
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
    const delayDebounceFn = setTimeout(async () => {
        if (searchTerm.trim().length > 2) {
            setLoading(true);
            const results = await searchChannelVideos(searchTerm);
            if (isMounted.current) {
                setVideos(results);
                setActiveCategory('Risultati');
                setLoading(false);
            }
        } else if (searchTerm.trim().length === 0 && activeCategory === 'Risultati') {
            initGallery();
        }
    }, 800);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, initGallery]);

  const handleCategoryChange = async (cat: string) => {
    if (cat === activeCategory) { setIsDropdownOpen(false); return; }
    setSearchTerm('');
    setActiveCategory(cat);
    setIsDropdownOpen(false);
    setLoading(true);
    
    try {
        let fetched: Video[] = [];
        if (cat === 'Tutti') {
            fetched = await getLatestVideos();
        } else {
            const pid = playlistsMap[cat];
            fetched = pid ? await getPlaylistVideos(pid) : await getLatestVideos();
        }
        if (isMounted.current) setVideos(fetched.length > 0 ? fetched : VIDEOS);
    } catch (e) {
        setVideos(VIDEOS);
    } finally {
        if (isMounted.current) setLoading(false);
    }
  };

  const displayVideos = videos.filter(v => v.id !== featuredVideo?.id);

  return (
    <div className="px-3 md:px-6 pt-[70px] md:pt-[110px] pb-24 max-w-6xl mx-auto animate-fade-in min-h-screen">
      
      {/* 1. FEATURED */}
      {featuredVideo && !searchTerm && (
        <div className="mb-8 cursor-pointer" onClick={() => setSelectedVideo(featuredVideo)}>
            <div className="relative bg-gradient-to-br from-yellow-300 to-orange-400 p-1.5 rounded-[40px] shadow-2xl border-4 border-black">
                <div className="bg-black rounded-[32px] overflow-hidden aspect-video relative group">
                    <div className="absolute top-4 left-4 z-20 bg-boo-yellow text-black px-4 py-2 rounded-xl border-2 border-black font-black uppercase text-sm">
                        ⭐ IN EVIDENZA
                    </div>
                    <img src={featuredVideo.thumbnail.replace('hqdefault', 'maxresdefault')} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <CirclePlay className="text-white w-20 h-20 drop-shadow-2xl" strokeWidth={1.5} />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black to-transparent">
                        <h2 className="text-white text-2xl md:text-4xl font-black">{featuredVideo.title}</h2>
                    </div>
                </div>
            </div>
        </div>
      )}

      {/* 2. CONTROLS */}
      <div className="flex flex-col md:flex-row gap-4 mb-10 sticky top-20 md:top-28 z-40">
        <div className="relative flex-1" ref={dropdownRef}>
            <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="w-full flex items-center justify-between px-6 py-4 rounded-2xl border-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none transition-all">
                <div className="flex items-center gap-3">
                    <List size={24} className="text-boo-purple" />
                    <span className="font-black text-lg uppercase">{activeCategory}</span>
                </div>
                <ChevronDown size={24} />
            </button>
            {isDropdownOpen && (
                <div className="absolute top-full left-0 w-full mt-2 bg-white border-4 border-black rounded-2xl shadow-2xl z-50 max-h-64 overflow-y-auto">
                    {categories.map((cat) => (
                        <button key={cat} onClick={() => handleCategoryChange(cat)} className="w-full text-left px-6 py-4 font-black hover:bg-purple-50 border-b-2 border-gray-100 last:border-0">{cat}</button>
                    ))}
                </div>
            )}
        </div>

        <div className="relative flex-[1.5]">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={24} />
            <input type="text" placeholder="Cerca un video..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-14 pr-12 py-4 rounded-2xl border-4 border-black font-black text-lg focus:outline-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" />
        </div>
      </div>

      {/* 3. GRID */}
      {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
              <Loader2 size={64} className="animate-spin text-white" />
              <p className="text-white font-black mt-4 uppercase">Caricamento Cinema...</p>
          </div>
      ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {displayVideos.map((video) => (
                <div key={video.id} onClick={() => setSelectedVideo(video)} className="bg-white rounded-[30px] border-4 border-black overflow-hidden shadow-lg hover:-translate-y-2 transition-all cursor-pointer group">
                    <div className="relative aspect-video bg-gray-200">
                        <img src={video.thumbnail} alt="" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <CirclePlay className="text-white w-12 h-12" />
                        </div>
                    </div>
                    <div className="p-4">
                        <h3 className="font-black text-gray-800 text-sm md:text-base line-clamp-2 leading-tight">{video.title}</h3>
                    </div>
                </div>
              ))}
          </div>
      )}

      {/* MODAL */}
      {selectedVideo && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 p-4 animate-in fade-in" onClick={() => setSelectedVideo(null)}>
           <div className="relative w-full max-w-5xl bg-white rounded-[40px] border-[8px] border-red-600 shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
              <button onClick={() => setSelectedVideo(null)} className="absolute top-4 right-4 z-[210] hover:scale-110 transition-transform">
                 <img src={CLOSE_BTN_IMG} alt="Chiudi" className="w-12 h-12 md:w-20 md:h-20" />
              </button>
              <div className="w-full aspect-video bg-black">
                  <iframe src={`https://www.youtube.com/embed/${selectedVideo.id}?autoplay=1&rel=0`} className="w-full h-full border-0" allowFullScreen allow="autoplay" />
              </div>
              <div className="p-6 text-center">
                  <h3 className="text-gray-800 text-xl md:text-2xl font-black">{selectedVideo.title}</h3>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default VideoGallery;

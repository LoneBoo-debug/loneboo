
import React, { useState, useEffect, useRef } from 'react';
import { AppNotification, AppView, CommunityPost } from '../types';
import { fetchAppNotifications, markNotificationsAsRead } from '../services/notificationService';
import { getLatestVideos } from '../services/api';
import { getCommunityPosts } from '../services/data';
import { OFFICIAL_LOGO } from '../constants';
import { Bell, ExternalLink, PlayCircle } from 'lucide-react';

const PIAZZA_BG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/newplaceplazavoboo8us.webp';
const FACEBOOK_GROUP_URL = 'https://www.facebook.com/groups/2648776785470151/';
const NOTIF_HEADER_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/notif-piazza.webp';
const NEWS_HEADER_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/news-piazza.webp';
const BTN_CLOSE_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/btn-close.webp';
const NOTIF_ICON_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/icon-notif.webp';

// Asset Audio e Video
const PIAZZA_VOICE_URL = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/placespeechboo44rf.mp3';
const BOO_TALK_VIDEO = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/tmpzpu5rw91.mp4';

type Point = { x: number; y: number };

// --- COORDINATE DEFINITIVE CALIBRATE ---
const INITIAL_ZONES: Record<string, Point[]> = {
  "museo": [
    { "x": 81.82, "y": 61 },
    { "x": 77.56, "y": 75.84 },
    { "x": 93.55, "y": 77.79 },
    { "x": 97.28, "y": 62.05 }
  ],
  "facebook": [
    { "x": 75.69, "y": 44.21 },
    { "x": 72.76, "y": 59.2 },
    { "x": 94.62, "y": 58.45 },
    { "x": 91.95, "y": 45.26 }
  ],
  "notizie": [
    { "x": 50.11, "y": 11.24 },
    { "x": 49.84, "y": 17.54 },
    { "x": 70.1, "y": 18.29 },
    { "x": 70.36, "y": 12.44 }
  ],
  "avvisi": [
    { "x": 40.51, "y": 24.13 },
    { "x": 30.65, "y": 43.17 },
    { "x": 56.24, "y": 45.86 },
    { "x": 76.23, "y": 34.32 },
    { "x": 73.03, "y": 25.63 }
  ],
  "scuola": [
    { "x": 4, "y": 48.26 },
    { "x": 4, "y": 53.81 },
    { "x": 25.32, "y": 56.5 },
    { "x": 25.32, "y": 50.81 }
  ],
  "accademia": [
    { "x": 4, "y": 56.5 },
    { "x": 4, "y": 62.2 },
    { "x": 25.32, "y": 65.8 },
    { "x": 25.85, "y": 59.2 }
  ],
  "libreria": [
    { "x": 31.72, "y": 52.01 },
    { "x": 31.72, "y": 57.4 },
    { "x": 54.1, "y": 60.55 },
    { "x": 54.1, "y": 54.71 }
  ],
  "emozioni": [
    { "x": 31.72, "y": 60.55 },
    { "x": 31.98, "y": 66.25 },
    { "x": 53.84, "y": 69.84 },
    { "x": 54.37, "y": 63.85 }
  ],
  "cinema": [
    { "x": 31.72, "y": 69.54 },
    { "x": 31.72, "y": 74.94 },
    { "x": 53.57, "y": 78.99 },
    { "x": 53.57, "y": 73.29 }
  ]
};

const CommunityFeed: React.FC<{ setView?: (view: AppView) => void }> = ({ setView }) => {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [bgLoaded, setBgLoaded] = useState(false);
  const [isFullFeedOpen, setIsFullFeedOpen] = useState(false);
  const [isNotifModalOpen, setIsNotifModalOpen] = useState(false);
  
  // Gestione Audio Ambientale
  const [isAudioOn, setIsAudioOn] = useState(() => localStorage.getItem('loneboo_music_enabled') === 'true');
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const img = new Image();
    img.src = PIAZZA_BG;
    img.onload = () => setBgLoaded(true);
    
    // Inizializza Audio
    if (!audioRef.current) {
        audioRef.current = new Audio(PIAZZA_VOICE_URL);
        audioRef.current.loop = false;
        audioRef.current.volume = 0.5;
        audioRef.current.addEventListener('play', () => setIsPlaying(true));
        audioRef.current.addEventListener('pause', () => setIsPlaying(false));
        audioRef.current.addEventListener('ended', () => {
            setIsPlaying(false);
            if (audioRef.current) audioRef.current.currentTime = 0;
        });
    }

    if (isAudioOn) audioRef.current.play().catch(e => console.log("Autoplay blocked", e));

    const handleGlobalAudioChange = () => {
        const enabled = localStorage.getItem('loneboo_music_enabled') === 'true';
        setIsAudioOn(enabled);
        if (enabled) audioRef.current?.play().catch(() => {});
        else {
            audioRef.current?.pause();
            if (audioRef.current) audioRef.current.currentTime = 0;
        }
    };
    window.addEventListener('loneboo_audio_changed', handleGlobalAudioChange);

    const loadData = async () => {
      try {
          const [dynamicPosts, latestVideos, allNotifs] = await Promise.all([
              getCommunityPosts(),
              getLatestVideos(),
              fetchAppNotifications()
          ]);
          
          const mappedVideos: CommunityPost[] = latestVideos.map(v => ({
              id: v.id, type: 'IMAGE', content: v.title, image: v.thumbnail,
              date: v.publishedAt ? new Date(v.publishedAt).toLocaleDateString('it-IT') : "Novità",
              likes: 0
          }));
          setPosts([...dynamicPosts, ...mappedVideos]);
          setNotifications(allNotifs);
      } catch (err) { console.error(err); }
    };
    loadData();
    window.scrollTo(0, 0);

    return () => {
        window.removeEventListener('loneboo_audio_changed', handleGlobalAudioChange);
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
    };
  }, []);

  const handleExternalClick = (e: React.MouseEvent, url: string) => {
    const linksDisabled = localStorage.getItem('disable_external_links') === 'true';
    if (linksDisabled) {
        e.preventDefault();
        alert("Navigazione esterna bloccata dai genitori! 🔒");
        return;
    }
    window.open(url, '_blank');
  };

  const handleBooClick = async () => {
    setIsNotifModalOpen(true);
    await markNotificationsAsRead();
  };

  const handleZoneInteraction = (zoneKey: string) => {
    if (!setView) return;

    switch(zoneKey) {
        case 'museo': setView(AppView.FANART); break;
        case 'facebook': window.open(FACEBOOK_GROUP_URL, '_blank'); break;
        case 'notizie': setIsFullFeedOpen(true); break;
        case 'avvisi': handleBooClick(); break;
        case 'scuola': setView(AppView.SCHOOL); break;
        case 'accademia': setView(AppView.COLORING); break;
        case 'libreria': setView(AppView.BOOKS_LIST); break;
        case 'emozioni': setView(AppView.EMOTIONAL_GARDEN); break;
        case 'cinema': setView(AppView.VIDEOS); break;
    }
  };

  const getClipPath = (pts: Point[]) => {
    if (!pts || pts.length < 3) return 'none';
    return `polygon(${pts.map(p => `${p.x}% ${p.y}%`).join(', ')})`;
  };

  const renderNotificationsModal = () => (
      <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center p-4 animate-in fade-in">
          <div className="relative w-full max-w-lg bg-white rounded-[30px] border-4 border-purple-500 shadow-[0_0_40px_rgba(168,85,247,0.5)] overflow-hidden h-[75vh] flex flex-col animate-in zoom-in duration-300">
              <div className="bg-purple-600 p-2 md:p-3 flex items-center justify-between border-b-4 border-purple-800 shrink-0">
                  <div className="flex-1 flex justify-start pl-2 md:pl-4"><img src={NOTIF_HEADER_IMG} alt="Avvisi" className="h-12 md:h-18 w-auto object-contain drop-shadow-lg" /></div>
                  <button onClick={() => setIsNotifModalOpen(false)} className="hover:scale-110 active:scale-95 transition-all outline-none"><img src={BTN_CLOSE_IMG} alt="Chiudi" className="w-14 h-14 md:w-16 md:h-16 object-contain drop-shadow-md" /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 bg-purple-50 custom-scrollbar">
                  {notifications.length > 0 ? (
                      notifications.map((notif) => (
                          <div key={notif.id} className="bg-white p-4 rounded-3xl shadow-md border-2 border-purple-100 mb-4 flex flex-col gap-3">
                              <div className="flex items-start gap-3">
                                  <img src={NOTIF_ICON_IMG} alt="" className="w-10 h-10 md:w-12 md:h-12 object-contain shrink-0 drop-shadow-sm" />
                                  <div className="flex-1"><p className="text-gray-800 font-black text-base md:text-xl leading-snug">{notif.message}</p></div>
                              </div>
                              {notif.image && (
                                  <div className="relative w-full aspect-video rounded-2xl overflow-hidden border-4 border-purple-200 shadow-inner group">
                                      <img src={notif.image} alt="Preview" className="w-full h-full object-cover" />
                                      {notif.link?.includes('youtube.com') || notif.link?.includes('youtu.be') ? (
                                          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                              <PlayCircle size={60} className="text-white drop-shadow-lg opacity-80 group-hover:scale-110 transition-transform" />
                                          </div>
                                      ) : null}
                                  </div>
                              )}
                              {notif.link && (
                                  <button onClick={(e) => handleExternalClick(e, notif.link!)} className="bg-blue-500 text-white font-black py-4 px-6 rounded-2xl border-b-6 border-blue-700 active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-2 text-lg md:text-xl shadow-lg uppercase tracking-wider outline-none">
                                    {notif.linkText || "VAI"} <ExternalLink size={20} />
                                  </button>
                              )}
                          </div>
                      ))
                  ) : (
                      <div className="flex flex-col items-center justify-center h-full text-gray-400 p-8 text-center"><Bell size={48} className="mb-2 opacity-50" /><p className="font-bold">Nessun avviso al momento.</p></div>
                  )}
              </div>
          </div>
      </div>
  );

  return (
    <div className="fixed inset-0 top-0 left-0 w-full h-[100dvh] z-0 bg-[#0f172a] overflow-hidden touch-none overscroll-none select-none">
        <style>{`
            .no-scrollbar::-webkit-scrollbar { display: none; }
            .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        `}</style>

        {isNotifModalOpen && renderNotificationsModal()}
        
        {isFullFeedOpen && (
            <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center p-4 animate-in fade-in">
                <div className="relative w-full max-w-2xl bg-white rounded-[30px] border-4 border-yellow-400 shadow-2xl overflow-hidden h-[75vh] flex flex-col animate-in zoom-in duration-300">
                    <div className="bg-yellow-400 p-2 md:p-3 flex items-center justify-between border-b-4 border-yellow-500 shrink-0">
                        <div className="flex-1 flex justify-start pl-2 md:pl-4"><img src={NEWS_HEADER_IMG} alt="News" className="h-12 md:h-18 w-auto object-contain drop-shadow-lg" /></div>
                        <button onClick={() => setIsFullFeedOpen(false)} className="hover:scale-110 active:scale-95 transition-all outline-none"><img src={BTN_CLOSE_IMG} alt="Chiudi" className="w-14 h-14 md:w-16 md:h-16 object-contain drop-shadow-md" /></button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 bg-gray-100 custom-scrollbar space-y-6">
                        {posts.map((post) => (
                            <div key={post.id} className="bg-[#fdfbf7] p-5 rounded-sm shadow-[2px_2px_10px_rgba(0,0,0,0.1)] border-t border-gray-200 border-l-4 border-gray-300 relative overflow-hidden group">
                                <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/pinstriped-suit.png')]"></div>
                                <div className="flex items-center gap-3 mb-4 pb-3 border-b-2 border-gray-200/50 relative z-10">
                                    <img src={OFFICIAL_LOGO} alt="Lone Boo" className="w-12 h-12 rounded-full border-2 border-gray-300 object-contain bg-white p-0.5" />
                                    <div className="flex flex-col">
                                        <span className="font-black text-gray-800 text-lg uppercase tracking-tight">Lone Boo News</span>
                                        <span className="text-[10px] md:text-xs text-gray-500 font-black uppercase tracking-widest">{post.date}</span>
                                    </div>
                                </div>
                                <p className="text-gray-800 font-bold text-base md:text-xl mb-4 leading-relaxed relative z-10 font-sans">{post.content}</p>
                                {post.type === 'IMAGE' && post.image && (
                                    <div className="mb-2 rounded-lg overflow-hidden aspect-video bg-gray-200 border-2 border-gray-300 relative z-10">
                                        <img src={post.image} alt="Post" className="w-full h-full object-cover" />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )}

        {/* Mini TV di Boo - Posizionato a SINISTRA */}
        {bgLoaded && isAudioOn && isPlaying && (
            <div className="absolute top-20 md:top-28 left-4 z-50 animate-in zoom-in duration-500">
                <div className="relative bg-black/40 backdrop-blur-sm p-0 rounded-[2.5rem] border-4 md:border-8 border-yellow-400 shadow-2xl overflow-hidden flex items-center justify-center w-28 h-28 md:w-52 md:h-52">
                    <video src={BOO_TALK_VIDEO} autoPlay loop muted playsInline className="w-full h-full object-cover" style={{ mixBlendMode: 'screen', filter: 'contrast(1.1) brightness(1.1)' }} />
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none"></div>
                </div>
            </div>
        )}

        {/* MAIN INTERACTIVE CONTAINER */}
        <div className="absolute inset-0 z-0">
            <img 
                src={PIAZZA_BG} 
                alt="Piazza" 
                className={`w-full h-full object-fill transition-opacity duration-1000 ${bgLoaded ? 'opacity-100' : 'opacity-0'}`} 
                draggable={false} 
            />

            {/* AREAS VISUALIZER */}
            {bgLoaded && Object.entries(INITIAL_ZONES).map(([key, pts]) => (
                <div 
                    key={key} 
                    onClick={() => handleZoneInteraction(key)}
                    className="absolute inset-0 z-10 cursor-pointer pointer-events-auto active:bg-white/10"
                    style={{ clipPath: getClipPath(pts) }}
                />
            ))}
        </div>
    </div>
  );
};

export default CommunityFeed;

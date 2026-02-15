
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { AppNotification, AppView, CommunityPost } from '../types';
import { fetchAppNotifications, markNotificationsAsRead } from '../services/notificationService';
import { getLatestVideos } from '../services/api';
import { getCommunityPosts } from '../services/data';
import { OFFICIAL_LOGO } from '../constants';
import { Bell, ExternalLink, PlayCircle, X } from 'lucide-react';
import { getWeatherForDate, isNightTime } from '../services/weatherService';
import { monthNames } from '../services/calendarDatabase';
import DailyRewardsModal from './DailyRewardsModal';

const PIAZZA_BG_SUN = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/newplaceplazavoboo8us.webp';
const PIAZZA_BG_SNOW = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/piazzaneveeso.webp';
const PIAZZA_BG_RAIN = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/piazzapioggiaeso.webp';
const PIAZZA_BG_WIND = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/piazzaventoeso.webp';

const NIGHT_SUN = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/piazzanottesolexxs%C3%B9.webp';
const NIGHT_RAIN = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/piazzanottepioggiaxza.webp';
const NIGHT_WIND = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/piazzanotteventoxsa.webp';
const NIGHT_SNOW = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/piazzanttenevexsa.webp';

const FACEBOOK_GROUP_URL = 'https://www.facebook.com/groups/2648776785470151/';
const NOTIF_HEADER_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/notif-piazza.webp';
const NEWS_HEADER_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/news-piazza.webp';
const BTN_CLOSE_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/btn-close.webp';
const NOTIF_ICON_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/icon-notif.webp';
const CLOCK_SCREEN_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/schermosvegliatuagiornuere.webp';

const PIAZZA_VOICE_URL = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/placespeechboo44rf.mp3';
const BOO_TALK_VIDEO = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/tmpzpu5rw91.mp4';

type Point = { x: number; y: number };

const INITIAL_ZONES: Record<string, Point[]> = {
  "museo": [
    { "x": 81.82, "y": 61 }, { "x": 77.56, "y": 75.84 }, { "x": 93.55, "y": 77.79 }, { "x": 97.28, "y": 62.05 }
  ],
  "facebook": [
    { "x": 75.69, "y": 44.21 }, { "x": 72.76, "y": 59.2 }, { "x": 94.62, "y": 58.45 }, { "x": 91.95, "y": 45.26 }
  ],
  "notizie": [
    { "x": 50.11, "y": 11.24 }, { "x": 49.84, "y": 17.54 }, { "x": 70.1, "y": 18.29 }, { "x": 70.36, "y": 12.44 }
  ],
  "avvisi": [
    { "x": 40.51, "y": 24.13 }, { "x": 30.65, "y": 43.17 }, { "x": 56.24, "y": 45.86 }, { "x": 76.23, "y": 34.32 }, { "x": 73.03, "y": 25.63 }
  ],
  "scuola": [
    { "x": 4, "y": 48.26 }, { "x": 4, "y": 53.81 }, { "x": 25.32, "y": 56.5 }, { "x": 25.32, "y": 50.81 }
  ],
  "accademia": [
    { "x": 4, "y": 56.5 }, { "x": 4, "y": 62.2 }, { "x": 25.32, "y": 65.8 }, { "x": 25.85, "y": 59.2 }
  ],
  "libreria": [
    { "x": 31.72, "y": 52.01 }, { "x": 31.72, "y": 57.4 }, { "x": 54.1, "y": 60.55 }, { "x": 54.1, "y": 54.71 }
  ],
  "emozioni": [
    { "x": 31.72, "y": 60.55 }, { "x": 31.98, "y": 66.25 }, { "x": 53.84, "y": 69.84 }, { "x": 54.37, "y": 63.85 }
  ],
  "cinema": [
    { "x": 31.72, "y": 69.54 }, { "x": 31.72, "y": 74.94 }, { "x": 53.57, "y": 78.99 }, { "x": 53.57, "y": 73.29 }
  ]
};

const CLOCK_STYLE = {
    top: 56,
    right: 4,
    iconSize: 82,
    timeSize: 23,
    dateSize: 13,
    paddingTop: 0,
    iconScaleY: 0.74
};

const CommunityFeed: React.FC<{ setView?: (view: AppView) => void }> = ({ setView }) => {
  const [now, setNow] = useState(new Date());
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isFullFeedOpen, setIsFullFeedOpen] = useState(false);
  const [isNotifModalOpen, setIsNotifModalOpen] = useState(false);
  const [showDailyModal, setShowDailyModal] = useState(false);
  
  const [isAudioOn, setIsAudioOn] = useState(() => localStorage.getItem('loneboo_music_enabled') === 'true');
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const todayWeather = useMemo(() => getWeatherForDate(now), [now]);

  const dayNamesShort = ["DOM", "LUN", "MAR", "MER", "GIO", "VEN", "SAB"];
  const currentTimeStr = now.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
  const currentDateStr = `${dayNamesShort[now.getDay()]} ${now.getDate()} ${monthNames[now.getMonth()].slice(0, 3).toUpperCase()}`;

  const currentBg = useMemo(() => {
    const isNight = isNightTime(now);
    if (isNight) {
        switch (todayWeather) {
            case 'SNOW': return NIGHT_SNOW;
            case 'RAIN': return NIGHT_RAIN;
            case 'WIND': return NIGHT_WIND;
            default: return NIGHT_SUN;
        }
    } else {
        switch (todayWeather) {
            case 'SNOW': return PIAZZA_BG_SNOW;
            case 'RAIN': return PIAZZA_BG_RAIN;
            case 'WIND': return PIAZZA_BG_WIND;
            default: return PIAZZA_BG_SUN;
        }
    }
  }, [now, todayWeather]);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    
    const img = new Image();
    img.src = currentBg;
    img.onload = () => setIsLoaded(true);

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

    if (isAudioOn) audioRef.current.play().catch(() => {});

    const handleGlobalAudioChange = () => {
        const enabled = localStorage.getItem('loneboo_music_enabled') === 'true';
        setIsAudioOn(enabled);
        if (enabled) audioRef.current?.play().catch(() => {});
        else audioRef.current?.pause();
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

    return () => {
        clearInterval(timer);
        window.removeEventListener('loneboo_audio_changed', handleGlobalAudioChange);
        if (audioRef.current) audioRef.current.pause();
    };
  }, [currentBg]);

  const handleZoneInteraction = (zoneKey: string) => {
    if (!setView) return;
    switch(zoneKey) {
        case 'museo': setView(AppView.FANART); break;
        case 'facebook': window.open(FACEBOOK_GROUP_URL, '_blank'); break;
        case 'notizie': setIsFullFeedOpen(true); break;
        case 'avvisi': setIsNotifModalOpen(true); markNotificationsAsRead(); break;
        case 'scuola': setView(AppView.SCHOOL); break;
        case 'accademia': setView(AppView.COLORING); break;
        case 'libreria': setView(AppView.BOOKS_LIST); break;
        case 'emozioni': setView(AppView.EMOTIONAL_GARDEN); break;
        case 'cinema': setView(AppView.VIDEOS); break;
    }
  };

  const getClipPath = (pts: Point[]) => `polygon(${pts.map(p => `${p.x}% ${p.y}%`).join(', ')})`;

  return (
    <div className="fixed inset-0 z-0 bg-[#0f172a] overflow-hidden touch-none overscroll-none select-none">
        {!isLoaded && (
            <div className="fixed inset-0 z-[150] flex flex-col items-center justify-center bg-indigo-950">
                <img src={OFFICIAL_LOGO} alt="Loading" className="w-32 h-32 animate-spin-horizontal mb-4" />
                <span className="text-white font-black text-lg tracking-widest animate-pulse uppercase">Entro in Piazza...</span>
            </div>
        )}

        {isLoaded && isAudioOn && isPlaying && (
            <div className="absolute top-20 md:top-28 left-4 z-50 animate-in zoom-in duration-500">
                <div className="relative bg-black/40 backdrop-blur-sm p-0 rounded-[2.5rem] border-4 md:border-8 border-yellow-400 shadow-2xl overflow-hidden flex items-center justify-center w-28 h-28 md:w-52 md:h-52">
                    <video src={BOO_TALK_VIDEO} autoPlay loop muted playsInline className="w-full h-full object-cover" style={{ mixBlendMode: 'screen' }} />
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none"></div>
                </div>
            </div>
        )}

        {/* SVEGLIA - LA TUA GIORNATA */}
        {isLoaded && (
            <button 
                onClick={(e) => { e.stopPropagation(); setShowDailyModal(true); }}
                className="absolute z-[70] transition-transform outline-none group hover:scale-105 active:scale-95"
                style={{ top: `${CLOCK_STYLE.top}px`, right: `${CLOCK_STYLE.right}px` }}
            >
                <div className="relative flex items-center justify-center" style={{ width: `${CLOCK_STYLE.iconSize}px`, height: `${CLOCK_STYLE.iconSize}px` }}>
                    <img src={CLOCK_SCREEN_IMG} alt="Sveglia" className="w-full h-full object-contain drop-shadow-2xl" style={{ transform: `scaleY(${CLOCK_STYLE.iconScaleY})` }} />
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="font-luckiest text-orange-500 leading-none" style={{ WebkitTextStroke: '0.5px #431407', fontSize: `${CLOCK_STYLE.timeSize}px` }}>{currentTimeStr}</span>
                        <span className="font-luckiest text-orange-500 uppercase tracking-tighter leading-none mt-0.5" style={{ WebkitTextStroke: '0.3px #431407', fontSize: `${CLOCK_STYLE.dateSize}px` }}>{currentDateStr}</span>
                    </div>
                </div>
            </button>
        )}

        <div className="absolute inset-0 z-0">
            <img src={currentBg} alt="Piazza" className={`w-full h-full object-fill transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`} />
            {isLoaded && Object.entries(INITIAL_ZONES).map(([key, pts]) => (
                <div key={key} onClick={() => handleZoneInteraction(key)} className="absolute inset-0 z-10 cursor-pointer active:bg-white/10" style={{ clipPath: getClipPath(pts) }} />
            ))}
        </div>

        {/* MODALE NEWS */}
        {isFullFeedOpen && (
            <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
                <div className="bg-white rounded-[30px] border-4 border-yellow-400 w-full max-w-2xl h-[75vh] flex flex-col overflow-hidden animate-in zoom-in">
                    <div className="bg-yellow-400 p-3 flex justify-between items-center border-b-4 border-yellow-500">
                        <img src={NEWS_HEADER_IMG} alt="News" className="h-10 md:h-14 object-contain" />
                        <button onClick={() => setIsFullFeedOpen(false)}><img src={BTN_CLOSE_IMG} alt="X" className="w-12 h-12" /></button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 bg-gray-100 space-y-4">
                        {posts.map(post => (
                            <div key={post.id} className="bg-white p-4 rounded-2xl shadow-md border-l-4 border-yellow-400">
                                <div className="flex items-center gap-2 mb-2">
                                    <img src={OFFICIAL_LOGO} className="w-8 h-8 rounded-full" alt="" />
                                    <span className="font-black text-sm text-gray-800 uppercase">{post.date}</span>
                                </div>
                                <p className="font-bold text-gray-700 leading-tight">{post.content}</p>
                                {post.image && <img src={post.image} className="mt-2 rounded-lg w-full aspect-video object-cover" alt="" />}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )}

        {/* MODALE AVVISI */}
        {isNotifModalOpen && (
            <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
                <div className="bg-white rounded-[30px] border-4 border-purple-500 w-full max-w-lg h-[75vh] flex flex-col overflow-hidden animate-in zoom-in">
                    <div className="bg-purple-600 p-3 flex justify-between items-center border-b-4 border-purple-800">
                        <img src={NOTIF_HEADER_IMG} alt="Avvisi" className="h-10 md:h-14 object-contain" />
                        <button onClick={() => setIsNotifModalOpen(false)}><img src={BTN_CLOSE_IMG} alt="X" className="w-12 h-12" /></button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 bg-purple-50 space-y-4">
                        {notifications.length > 0 ? notifications.map(notif => (
                            <div key={notif.id} className="bg-white p-4 rounded-2xl shadow-md border-2 border-purple-100">
                                <div className="flex gap-3 items-start">
                                    <img src={NOTIF_ICON_IMG} className="w-10 h-10 object-contain" alt="" />
                                    <p className="font-black text-gray-800 leading-tight">{notif.message}</p>
                                </div>
                                {notif.link && (
                                    <button onClick={() => window.open(notif.link, '_blank')} className="mt-3 w-full bg-blue-500 text-white font-black py-2 rounded-xl border-b-4 border-blue-700 uppercase">VAI <ExternalLink size={14} className="inline ml-1" /></button>
                                )}
                            </div>
                        )) : <p className="text-center text-gray-400 font-bold py-10">Nessun avviso.</p>}
                    </div>
                </div>
            </div>
        )}

        {showDailyModal && <DailyRewardsModal onClose={() => setShowDailyModal(false)} setView={setView || (() => {})} currentView={AppView.COMMUNITY} />}
    </div>
  );
};

export default CommunityFeed;

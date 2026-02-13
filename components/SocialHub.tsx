
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { AppView } from '../types';
import { getChannelStatistics } from '../services/api';
import { getSocialStatsFromCSV } from '../services/data';
import { SOCIALS, SUPPORT_LINKS, OFFICIAL_LOGO } from '../constants';
import { getWeatherForDate, isNightTime } from '../services/weatherService';

// --- ASSET DINAMICI STAZIONE ---
// Diurni
const STATION_DAY_SUN = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/stazionegiornosole+(1).webp';
const STATION_DAY_RAIN = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/stazionegiornopioggia.webp';
const STATION_DAY_WIND = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/stazionegiornovento.webp';
const STATION_DAY_SNOW = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/stazionegiornoneve.webp';

// Notturni
const STATION_NIGHT_SUN = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/stazionenottesole.webp';
const STATION_NIGHT_RAIN = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/stazionenottepioggia.webp';
const STATION_NIGHT_WIND = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/stazionenottevento.webp';
const STATION_NIGHT_SNOW = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/stazionenotteneve.webp';

const BTN_BACK_CITY_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/cityfrfwfed+(1).webp';
const BTN_PARTI_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/paymentfwe5f5c5er+(1).webp';

// Loghi Social
const LOGO_FB = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/tgtgfr.webp';
const LOGO_IG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/fbdredredre.webp';
const LOGO_YT = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/ytgfrdetu+(1).webp';
const LOGO_TK = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/Hailuo_Image_creami+in+stila+cartoon+non+tr_47773941384jj8jh178690.webp';

// Asset Audio e Video
const STATION_VOICE_URL = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/30dd817e-ad8c-4ae6-a5b3-d491075b6725.mp3';
const BOO_TALK_VIDEO = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/tmpzpu5rw91.mp4';

interface ItemConfig {
  x: number;
  y: number;
  scale: number;
  rotate: number;
}

const FIXED_COORDINATES: Record<string, ItemConfig> = {
  "logo_fb": { "x": 80, "y": 22.5, "scale": 0.45, "rotate": -3 },
  "logo_yt": { "x": 55, "y": 17, "scale": 0.45, "rotate": -4 },
  "logo_tk": { "x": 55, "y": 23, "scale": 0.5, "rotate": -3 },
  "logo_ig": { "x": 79, "y": 16, "scale": 0.4, "rotate": -3 },
  "stat_yt": { "x": 62.5, "y": 16.5, "scale": 1, "rotate": -4 },
  "stat_ig": { "x": 63, "y": 23, "scale": 1, "rotate": -4 },
  "stat_tk": { "x": 86.5, "y": 22, "scale": 1, "rotate": -2 },
  "stat_fb": { "x": 88.5, "y": 16, "scale": 1, "rotate": -3 }
};

const SocialHub: React.FC<{ setView?: (view: AppView) => void }> = ({ setView }) => {
  const [now, setNow] = useState(new Date());
  const [bgLoaded, setBgLoaded] = useState(false);
  const [stats, setStats] = useState({ youtube: '...', instagram: '...', tiktok: '...', facebook: '...' });
  const [isAudioOn, setIsAudioOn] = useState(() => localStorage.getItem('loneboo_music_enabled') === 'true');
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const todayWeather = useMemo(() => getWeatherForDate(now), [now]);

  const currentBg = useMemo(() => {
    const isNight = isNightTime(now);
    if (isNight) {
      switch (todayWeather) {
        case 'WIND': return STATION_NIGHT_WIND;
        case 'RAIN': return STATION_NIGHT_RAIN;
        case 'SNOW': return STATION_NIGHT_SNOW;
        default: return STATION_NIGHT_SUN;
      }
    } else {
      switch (todayWeather) {
        case 'WIND': return STATION_DAY_WIND;
        case 'RAIN': return STATION_DAY_RAIN;
        case 'SNOW': return STATION_DAY_SNOW;
        default: return STATION_DAY_SUN;
      }
    }
  }, [now, todayWeather]);

  // Gestione caricamento sfondo e ticker orario
  useEffect(() => {
    const timeTimer = setInterval(() => setNow(new Date()), 60000);
    
    // Al cambio di currentBg, mostriamo il caricamento finché la nuova immagine non è pronta
    setBgLoaded(false);
    const img = new Image();
    img.src = currentBg;
    img.onload = () => setBgLoaded(true);
    // Fallback di sicurezza per il caricamento
    const safetyTimeout = setTimeout(() => setBgLoaded(true), 3000);

    return () => {
        clearInterval(timeTimer);
        clearTimeout(safetyTimeout);
    };
  }, [currentBg]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [ytData, csvStats] = await Promise.all([
          getChannelStatistics(),
          getSocialStatsFromCSV()
        ]);
        setStats({
          youtube: ytData?.subscriberCount || '0',
          instagram: csvStats?.instagram || '0',
          tiktok: csvStats?.tiktok || '0',
          facebook: csvStats?.facebook || '0'
        });
      } catch (e) { console.error("Stats fetch error", e); }
    };
    fetchStats();

    if (!audioRef.current) {
      audioRef.current = new Audio(STATION_VOICE_URL);
      audioRef.current.loop = false;
      audioRef.current.volume = 0.5;
      audioRef.current.addEventListener('play', () => setIsPlaying(true));
      audioRef.current.addEventListener('pause', () => setIsPlaying(false));
      audioRef.current.addEventListener('ended', () => {
        setIsPlaying(false);
        if (audioRef.current) audioRef.current.currentTime = 0;
      });
    }

    if (isAudioOn) audioRef.current.play().catch(() => { });

    const handleGlobalAudioChange = () => {
      const enabled = localStorage.getItem('loneboo_music_enabled') === 'true';
      setIsAudioOn(enabled);
      if (enabled) audioRef.current?.play().catch(() => { });
      else audioRef.current?.pause();
    };
    window.addEventListener('loneboo_audio_changed', handleGlobalAudioChange);

    return () => {
      window.removeEventListener('loneboo_audio_changed', handleGlobalAudioChange);
      if (audioRef.current) audioRef.current.pause();
    };
  }, []);

  const handleExternalClick = (platform: string) => {
    if (localStorage.getItem('disable_external_links') === 'true') {
      alert("Link bloccati dai genitori! 🔒");
      return;
    }
    let social = SOCIALS.find(s => s.platform.toLowerCase() === platform.toLowerCase());
    if (!social) social = SUPPORT_LINKS.find(s => s.platform.toLowerCase() === platform.toLowerCase());
    if (social) window.open(social.url, '_blank');
  };

  const renderFixedItem = (id: string, content: React.ReactNode, onClick?: () => void) => {
    const config = FIXED_COORDINATES[id];
    if (!config) return null;
    return (
      <div
        key={id}
        onClick={onClick}
        className={`absolute z-30 transition-all duration-300 ${onClick ? 'cursor-pointer hover:scale-[1.05] active:scale-95' : 'pointer-events-none'}`}
        style={{
          left: `${config.x}%`,
          top: `${config.y}%`,
          transform: `translate(-50%, -50%) scale(${config.scale}) rotate(${config.rotate}deg)`
        }}
      >
        {content}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 top-0 left-0 w-full h-[100dvh] z-10 bg-[#0f172a] overflow-hidden touch-none overscroll-none select-none">
      {/* Schermata di caricamento solida per gestire il cambio sfondo */}
      {!bgLoaded && (
        <div className="fixed inset-0 z-[110] flex flex-col items-center justify-center bg-indigo-950 backdrop-blur-md">
          <img src={OFFICIAL_LOGO} alt="Loading" className="w-32 h-32 animate-spin-horizontal mb-4" />
          <span className="text-white font-black text-lg tracking-widest animate-pulse uppercase">Arrivo in Stazione...</span>
        </div>
      )}

      <div className="relative w-full h-full overflow-hidden">
        {/* BACKGROUND DINAMICO */}
        <img src={currentBg} alt="" className={`w-full h-full object-fill transition-opacity duration-700 ${bgLoaded ? 'opacity-100' : 'opacity-0'}`} />

        {/* LOGHI SOCIAL CLICCABILI */}
        {bgLoaded && (
          <>
            {renderFixedItem("logo_yt", <img src={LOGO_YT} className="w-20 md:w-32 h-auto drop-shadow-xl" alt="YT" />, () => handleExternalClick("youtube"))}
            {renderFixedItem("logo_ig", <img src={LOGO_IG} className="w-20 md:w-32 h-auto drop-shadow-xl" alt="IG" />, () => handleExternalClick("instagram"))}
            {renderFixedItem("logo_tk", <img src={LOGO_TK} className="w-20 md:w-32 h-auto drop-shadow-xl" alt="TK" />, () => handleExternalClick("tiktok"))}
            {renderFixedItem("logo_fb", <img src={LOGO_FB} className="w-20 md:w-32 h-auto drop-shadow-xl" alt="FB" />, () => handleExternalClick("facebook"))}

            {/* STATISTICHE STATICHE */}
            {renderFixedItem("stat_yt", <span className="font-mono font-black text-yellow-500 text-sm md:text-2xl drop-shadow-[0_0_8px_rgba(0,0,0,0.8)]">{stats.youtube}</span>)}
            {renderFixedItem("stat_ig", <span className="font-mono font-black text-yellow-500 text-sm md:text-2xl drop-shadow-[0_0_8px_rgba(0,0,0,0.8)]">{stats.instagram}</span>)}
            {renderFixedItem("stat_tk", <span className="font-mono font-black text-yellow-500 text-sm md:text-2xl drop-shadow-[0_0_8px_rgba(0,0,0,0.8)]">{stats.tiktok}</span>)}
            {renderFixedItem("stat_fb", <span className="font-mono font-black text-yellow-500 text-sm md:text-2xl drop-shadow-[0_0_8px_rgba(0,0,0,0.8)]">{stats.facebook}</span>)}
          </>
        )}

        {/* MINI TV BOO */}
        {isAudioOn && isPlaying && (
          <div className="absolute top-20 md:top-28 left-4 z-110 animate-in zoom-in duration-500">
            <div className="relative bg-black/40 backdrop-blur-sm p-0 rounded-[2.5rem] border-4 md:border-8 border-yellow-400 shadow-2xl overflow-hidden flex items-center justify-center w-28 h-28 md:w-52 md:h-52">
              <video src={BOO_TALK_VIDEO} autoPlay loop muted playsInline className="w-full h-full object-cover" style={{ mixBlendMode: 'screen' }} />
            </div>
          </div>
        )}

        {bgLoaded && (
          <div className="absolute bottom-1 left-4 right-12 flex justify-between items-end z-50 pointer-events-none">
            <button onClick={() => setView?.(AppView.CITY_MAP)} className="pointer-events-auto hover:scale-110 active:scale-95 transition-all outline-none">
              <img src={BTN_BACK_CITY_IMG} alt="Torna" className="w-28 md:w-48 h-auto drop-shadow-xl" />
            </button>
            <button onClick={() => { sessionStorage.setItem('train_journey_origin', AppView.SOCIALS); setView?.(AppView.TRAIN_JOURNEY); }} className="pointer-events-auto hover:scale-110 active:scale-95 transition-all outline-none">
              <img src={BTN_PARTI_IMG} alt="Parti" className="w-32 md:w-56 h-auto drop-shadow-xl" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SocialHub;

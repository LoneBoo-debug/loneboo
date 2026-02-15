
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Bell, X, ExternalLink, Plus, Accessibility, Wand2, Shield, Lock, LifeBuoy, ChevronDown, TrainFront, Volume2, VolumeX } from 'lucide-react';
import { AppView, AppNotification } from '../types';
import { CHANNEL_LOGO, OFFICIAL_LOGO } from '../constants';
import { fetchAppNotifications, markNotificationsAsRead, checkHasNewNotifications } from '../services/notificationService';
import AccessibilityMenu from './AccessibilityMenu';
import ParentalGate from './ParentalGate';
import ParentalArea from './ParentalArea';

// Immagini pure stringhe
const CITY_BTN_IMAGE = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/icocitycytyrye.webp';
const BOO_HOUSE_BTN_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/icocasasasa.webp';
const HEADER_TITLE_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/header-title.webp';
const BTN_CLOSE_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/btn-close.webp';
const HOME_HEADER_LOGO = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/logo-main2211.webp';
const HOME_HEADER_TITLE = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/headlogheadrilo.webp';

// Asset Menu Pulsante
const BTN_PLUS_MENU = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/plusiconsa.webp';
const BTN_MINUS_MENU = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/minoriconsa.webp';

// Loghi Stagionali
const LOGO_CHRISTMAS = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/logonatalexxx.webp';
const LOGO_NEWYEAR = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/logocapodannoeee.webp';
const LOGO_HALLOWEEN = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/logohalloweenn.webp';
const LOGO_VALENTINE = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/lofosvalentinodd.webp';
const LOGO_BACKTOSCHOOL = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/logobacktoscholl99.webp';
const LOGO_EASTER = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/logopasquasaa.webp';
const LOGO_CARNIVAL = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/logocarnevaleddd.webp';

const ICON_NOTIF = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/icon-notif.webp';
const ICON_INFO = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/icon-info.webp';
const ICON_MAGIC = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/icon-magic.webp';
const ICON_PARENTS = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/icon-parents.webp';

// Asset Audio
const BTN_AUDIO_ON = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/musicatiicaggdg3edcde+(1).webp';
const BTN_AUDIO_OFF = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/musicadisattivusns6hsg2+(1).webp';

// Nuovi pulsanti per le città esterne
const BTN_RETURN_TO_COLOR_CITY = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/trnsymgnfhd74h43wjs.webp';
const BTN_EXPLORE_CITY = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/exploretrre009xszza88.webp';

interface HeaderProps {
    currentView: AppView;
    setView: (view: AppView) => void;
}

const STATION_DESTINATIONS = [
    { id: AppView.SOCIALS, name: "Città Colorata", cost: 0, isHome: true },
    { id: AppView.GRAY_CITY, name: "Città Grigia", cost: 0 },
    { id: AppView.LAKE_CITY, name: "Città dei Laghi", cost: 0 },
    { id: AppView.MOUNTAIN_CITY, name: "Città delle Montagne", cost: 0 },
    { id: AppView.RAINBOW_CITY, name: "Città degli Arcobaleni", cost: 0 }
];

const Header: React.FC<HeaderProps> = ({ currentView, setView }) => {
    const [notifications, setNotifications] = useState<AppNotification[]>([]);
    const [hasNew, setHasNew] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false); 
    const [isStationMenuOpen, setIsStationMenuOpen] = useState(false);
    const [showNotificationsModal, setShowNotificationsModal] = useState(false); 
    const [showAccessibilityModal, setShowAccessibilityModal] = useState(false); 
    const [showParentalGate, setShowParentalGate] = useState(false);
    const [showParentalArea, setShowParentalArea] = useState(false);
    const [isAudioOn, setIsAudioOn] = useState(() => localStorage.getItem('loneboo_music_enabled') === 'true');
    
    const [logoClicks, setLogoClicks] = useState(0);
    const logoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const menuRef = useRef<HTMLDivElement>(null);
    const stationMenuRef = useRef<HTMLDivElement>(null);

    const isHome = currentView === AppView.HOME;
    const isCityMap = currentView === AppView.CITY_MAP;
    const isBooGarden = currentView === AppView.BOO_GARDEN;
    const isJourney = currentView === AppView.TRAIN_JOURNEY;

    const isExternalCity = [
        AppView.RAINBOW_CITY, 
        AppView.GRAY_CITY, 
        AppView.MOUNTAIN_CITY, 
        AppView.LAKE_CITY
    ].includes(currentView);
    
    const titleImage = useMemo(() => {
        const now = new Date();
        const md = (now.getMonth() + 1) * 100 + now.getDate();
        if (md >= 1229 || md <= 102) return LOGO_NEWYEAR;
        if (md >= 1201 && md <= 1228) return LOGO_CHRISTMAS;
        if (md >= 1010 && md <= 1101) return LOGO_HALLOWEEN;
        if (md >= 207 && md <= 214) return LOGO_VALENTINE;
        if (md >= 215 && md <= 228) return LOGO_CARNIVAL;
        if (md >= 320 && md <= 415) return LOGO_EASTER;
        if (md >= 830 && md <= 915) return LOGO_BACKTOSCHOOL;
        return HOME_HEADER_TITLE;
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) setIsMenuOpen(false);
            if (stationMenuRef.current && !stationMenuRef.current.contains(event.target as Node)) setIsStationMenuOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const loadNotifs = async () => {
            const data = await fetchAppNotifications();
            setNotifications(data);
            const isNew = await checkHasNewNotifications();
            setHasNew(isNew);
        };
        loadNotifs();

        const handleTriggerGate = () => {
            setIsMenuOpen(false);
            setShowParentalGate(true);
        };
        window.addEventListener('triggerParentalGate', handleTriggerGate);
        return () => window.removeEventListener('triggerParentalGate', handleTriggerGate);
    }, []);

    useEffect(() => {
        const handleSyncAudio = () => {
            const enabled = localStorage.getItem('loneboo_music_enabled') === 'true';
            setIsAudioOn(enabled);
        };
        window.addEventListener('loneboo_audio_changed', handleSyncAudio);
        return () => window.removeEventListener('loneboo_audio_changed', handleSyncAudio);
    }, []);

    const toggleAudio = () => {
        const nextState = !isAudioOn;
        setIsAudioOn(nextState);
        localStorage.setItem('loneboo_music_enabled', String(nextState));
        window.dispatchEvent(new Event('loneboo_audio_changed'));
    };

    const handleOpenNotifications = async () => {
        setIsMenuOpen(false);
        setShowNotificationsModal(true);
        await markNotificationsAsRead();
    };

    const handleOpenAccessibility = () => { setIsMenuOpen(false); setShowAccessibilityModal(true); };
    const handleOpenParental = () => { setIsMenuOpen(false); setShowParentalGate(true); };
    const handleParentalSuccess = () => { setShowParentalGate(false); setShowParentalArea(true); };
    
    const handleOpenInfo = () => { 
        setIsMenuOpen(false); 
        sessionStorage.setItem('info_menu_origin', currentView);
        setView(AppView.INFO_MENU); 
    };

    const handleCityClick = () => setView(AppView.CITY_MAP);

    const handleLogoClick = () => {
        if (currentView !== AppView.HOME && currentView !== AppView.BOO_GARDEN) return;
        if (logoTimerRef.current) clearTimeout(logoTimerRef.current);
        const nextClicks = logoClicks + 1;
        if (nextClicks >= 5) {
            setLogoClicks(0);
            setView(AppView.TTS_STUDIO);
        } else {
            setLogoClicks(nextClicks);
            logoTimerRef.current = setTimeout(() => setLogoClicks(0), 3000);
        }
    };

    const handleTravelTo = (target: AppView, isHomeReturn: boolean) => {
        setIsStationMenuOpen(false);
        sessionStorage.setItem('train_journey_origin', currentView);
        if (isHomeReturn) {
            sessionStorage.setItem('train_journey_return', 'true');
            sessionStorage.setItem('train_journey_source_city', currentView);
        } else {
            sessionStorage.setItem('train_target_city', target);
        }
        setView(AppView.TRAIN_JOURNEY);
    };

    const handleExploreCity = () => window.dispatchEvent(new CustomEvent('toggleCityExploration'));

    return (
        <>
            <AccessibilityMenu isOpen={showAccessibilityModal} onClose={() => setShowAccessibilityModal(false)} />
            {showParentalGate && <ParentalGate onClose={() => setShowParentalGate(false)} onSuccess={handleParentalSuccess} />}
            {showParentalArea && <ParentalArea onClose={() => setShowParentalArea(false)} setView={setView} />}

            <header className="fixed top-0 left-0 right-0 z-[100] h-[64px] md:h-[96px] pointer-events-none select-none bg-transparent">
                <div className="relative w-full h-full max-w-7xl mx-auto flex items-center pointer-events-none">
                    
                    {!isHome && !isExternalCity && !isJourney && (
                        <div className="absolute left-[2%] md:left-[3%] top-1/2 -translate-y-1/2 z-40 flex items-center pointer-events-auto" ref={menuRef}>
                            <div className="relative">
                                <button 
                                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                                    className="relative active:scale-95 transition-all w-[11.5vw] h-[11.5vw] md:w-[6vw] md:h-[6vw] lg:w-[5.5vw] lg:h-[5.5vw] flex items-center justify-center z-50 bg-transparent"
                                >
                                    {hasNew && !isMenuOpen && (
                                        <span className="absolute top-[10%] right-[10%] w-4 h-4 bg-red-600 rounded-full border-2 border-white animate-pulse z-20"></span>
                                    )}
                                    <img src={isMenuOpen ? BTN_MINUS_MENU : BTN_PLUS_MENU} alt="Menu" className="w-full h-full object-contain drop-shadow-lg" />
                                </button>

                                {isMenuOpen && (
                                    <div className="absolute top-[110%] left-0 bg-sky-200/30 backdrop-blur-xl border border-white/40 rounded-2xl shadow-2xl p-2 flex flex-col gap-2 w-60 animate-in slide-in-from-top-2 fade-in z-40">
                                        <button onClick={handleOpenNotifications} className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/40 transition-colors w-full text-left group">
                                            <div className="relative w-9 h-9 shrink-0 group-hover:scale-110 transition-transform flex items-center justify-center">
                                                <img src={ICON_NOTIF} alt="Notifiche" className="w-8 h-8 object-contain drop-shadow-sm pointer-events-auto" />
                                                {hasNew && <span className="absolute -top-1 -right-1 w-3 i-3 bg-red-500 rounded-full border border-white animate-pulse"></span>}
                                            </div>
                                            <span className="block font-black text-sm uppercase text-gray-900 drop-shadow-sm">Notifiche</span>
                                        </button>
                                        <button onClick={handleOpenInfo} className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/40 transition-colors w-full text-left group">
                                            <div className="w-9 h-9 shrink-0 group-hover:scale-110 transition-transform flex items-center justify-center"><img src={ICON_INFO} alt="Info" className="w-8 h-8 object-contain drop-shadow-sm pointer-events-auto" /></div>
                                            <span className="block font-black text-sm uppercase text-gray-900 drop-shadow-sm">Info & Aiuto</span>
                                        </button>
                                        <button onClick={handleOpenAccessibility} className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/40 transition-colors w-full text-left group">
                                            <div className="w-9 h-9 shrink-0 group-hover:scale-110 transition-transform flex items-center justify-center"><img src={ICON_MAGIC} alt="Magia" className="w-8 h-8 object-contain drop-shadow-sm pointer-events-auto" /></div>
                                            <span className="block font-black text-sm uppercase text-gray-900 drop-shadow-sm">Magia</span>
                                        </button>
                                        <button onClick={handleOpenParental} className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/40 transition-colors w-full text-left group">
                                            <div className="w-9 h-9 shrink-0 group-hover:scale-110 transition-transform flex items-center justify-center"><img src={ICON_PARENTS} alt="Genitori" className="w-8 h-8 object-contain drop-shadow-sm pointer-events-auto" /></div>
                                            <span className="block font-black text-sm uppercase text-gray-900 drop-shadow-sm">Genitori</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {!isHome && (
                        <div className="absolute left-[14.5%] md:left-[11%] w-[45%] md:w-[30%] h-full flex items-center pointer-events-auto py-2 z-[110] cursor-pointer" onClick={handleLogoClick}>
                            <div className="relative h-full flex items-center">
                                <img src={titleImage} alt="Lone Boo" className="h-[65%] md:h-[85%] w-auto object-contain drop-shadow-[0_0_8px_rgba(255,255,255,0.9)]" />
                            </div>
                        </div>
                    )}

                    {!isHome && (
                        <div className="absolute right-[2%] md:right-[3%] top-1/2 -translate-y-1/2 z-50 flex items-center gap-[1.5vw] md:gap-[1vw] pointer-events-auto" ref={stationMenuRef}>
                            {isJourney ? (
                                <div className="flex flex-col items-center group cursor-pointer hover:scale-105 active:scale-95 transition-transform" onClick={toggleAudio}>
                                    <div className={`relative w-[10.5vw] h-[10.5vw] md:w-[5.5vw] md:h-[5.5vw] lg:w-[5.2vw] lg:h-[5.2vw] rounded-full bg-white flex items-center justify-center overflow-hidden border-[0.8vw] md:border-4 ${isAudioOn ? 'border-green-500' : 'border-red-500'}`}>
                                        <img src={isAudioOn ? BTN_AUDIO_ON : BTN_AUDIO_OFF} alt="Audio" className="w-full h-full object-cover pointer-events-auto" />
                                    </div>
                                    <span className={`text-[2.2vw] md:text-[10px] lg:text-xs font-black uppercase mt-1 ${isAudioOn ? 'text-green-500' : 'text-red-500'}`}>AUDIO</span>
                                </div>
                            ) : isExternalCity ? (
                                <>
                                    <div className="flex flex-col items-center group cursor-pointer" onClick={handleExploreCity}>
                                        <div className="relative w-[10.5vw] h-[10.5vw] md:w-[5.5vw] md:h-[5.5vw] lg:w-[5.2vw] lg:h-[5.2vw] rounded-full bg-white flex items-center justify-center overflow-hidden border-[0.8vw] md:border-4 border-yellow-400">
                                            <img src={BTN_EXPLORE_CITY} alt="Esplora" className="w-full h-full object-cover pointer-events-auto" />
                                        </div>
                                        <span className="text-[2.2vw] md:text-[10px] lg:text-xs font-black text-yellow-500 uppercase mt-1">ESPLORA</span>
                                    </div>
                                    <div className="relative flex flex-col items-center group cursor-pointer" onClick={() => setIsStationMenuOpen(!isStationMenuOpen)}>
                                        <div className={`relative w-[10.5vw] h-[10.5vw] md:w-[5.5vw] md:h-[5.5vw] lg:w-[5.2vw] lg:h-[5.2vw] rounded-full bg-white flex items-center justify-center overflow-hidden border-[0.8vw] md:border-4 ${isStationMenuOpen ? 'border-yellow-400 rotate-180' : 'border-red-500'}`}>
                                            {isStationMenuOpen ? <ChevronDown size={32} className="text-yellow-500" strokeWidth={4} /> : <img src={BTN_RETURN_TO_COLOR_CITY} alt="Stazione" className="w-full h-full object-cover pointer-events-auto scale-[1.3]" />}
                                        </div>
                                        <span className={`text-[2.2vw] md:text-[10px] lg:text-xs font-black uppercase mt-1 ${isStationMenuOpen ? 'text-yellow-500' : 'text-red-500'}`}>STAZIONE</span>

                                        {isStationMenuOpen && (
                                            <div className="absolute top-[120%] right-0 bg-white/30 backdrop-blur-xl border-4 border-red-500 rounded-[2rem] shadow-2xl p-3 flex flex-col gap-2 w-64 animate-in slide-in-from-top-4 duration-300 overflow-hidden">
                                                <div className="flex items-center gap-3 px-3 py-2 border-b border-red-500/20 mb-1">
                                                    <img src={BTN_RETURN_TO_COLOR_CITY} alt="" className="w-12 h-12 object-contain" />
                                                    <span className="text-red-600 font-black text-xs uppercase tracking-widest">DESTINAZIONI</span>
                                                </div>
                                                {STATION_DESTINATIONS.filter(dest => dest.id !== currentView).map(dest => (
                                                    <button key={dest.id} onClick={() => handleTravelTo(dest.id, dest.isHome || false)} className={`flex items-center justify-between p-3 rounded-xl transition-all active:scale-95 border-b-4 ${dest.isHome ? 'bg-blue-600 border-blue-800 text-white shadow-lg' : 'bg-white/40 border-black/5 text-slate-900 hover:bg-white/60'}`}>
                                                        <div className="flex flex-col items-start text-left">
                                                            <span className="font-black text-xs uppercase leading-tight">{dest.name}</span>
                                                            <span className={`text-[10px] font-bold uppercase ${dest.isHome ? 'text-white/70' : 'text-slate-500'}`}>{dest.isHome ? 'Ritorno a casa' : 'Viaggio diretto'}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1 bg-black/10 px-2 py-1 rounded-lg">
                                                            <span className="font-black text-xs">{dest.cost}</span>
                                                            <span className="text-xs">🪙</span>
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex flex-col items-center group cursor-pointer" onClick={toggleAudio}>
                                        <div className={`relative w-[10.5vw] h-[10.5vw] md:w-[5.5vw] md:h-[5.5vw] lg:w-[5.2vw] lg:h-[5.2vw] rounded-full bg-white flex items-center justify-center overflow-hidden border-[0.8vw] md:border-4 ${isAudioOn ? 'border-green-500' : 'border-red-500'}`}>
                                            <img src={isAudioOn ? BTN_AUDIO_ON : BTN_AUDIO_OFF} alt="Audio" className="w-full h-full object-cover pointer-events-auto" />
                                        </div>
                                        <span className={`text-[2.2vw] md:text-[10px] lg:text-xs font-black uppercase mt-1 ${isAudioOn ? 'text-green-500' : 'text-red-500'}`}>AUDIO</span>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className={`flex flex-col items-center transition-transform ${isBooGarden ? 'cursor-default opacity-50' : 'cursor-pointer hover:scale-105 active:scale-95'}`} onClick={isBooGarden ? undefined : () => setView(AppView.BOO_GARDEN)}>
                                        <div className="relative w-[10.5vw] h-[10.5vw] md:w-[5.5vw] md:h-[5.5vw] lg:w-[5.2vw] lg:h-[5.2vw] rounded-full bg-white flex items-center justify-center overflow-hidden border-[0.8vw] md:border-4 border-[#F97316]">
                                            <img src={BOO_HOUSE_BTN_IMG} alt="Casa" className="w-full h-full object-cover pointer-events-auto" />
                                        </div>
                                        <span className="text-[2.2vw] md:text-[10px] lg:text-xs font-black text-[#F97316] uppercase mt-1">CASA</span>
                                    </div>

                                    <div className={`flex flex-col items-center ${isCityMap ? 'cursor-default opacity-50' : 'cursor-pointer group hover:scale-105 active:scale-95'} transition-transform`} onClick={isCityMap ? undefined : handleCityClick}>
                                        <div className={`relative w-[10.5vw] h-[10.5vw] md:w-[5.5vw] md:h-[5.5vw] lg:w-[5.2vw] lg:h-[5.2vw] rounded-full bg-white flex items-center justify-center overflow-hidden border-[0.8vw] md:border-4 border-[#60A5FA]`}>
                                            <img src={CITY_BTN_IMAGE} alt="Città" className="w-full h-full object-cover pointer-events-auto" />
                                        </div>
                                        <span className="text-[2.2vw] md:text-[10px] lg:text-xs font-black text-[#60A5FA] uppercase mt-1">CITTÀ</span>
                                    </div>

                                    <div className="flex flex-col items-center group cursor-pointer hover:scale-105 active:scale-95 transition-transform" onClick={toggleAudio}>
                                        <div className={`relative w-[10.5vw] h-[10.5vw] md:w-[5.5vw] md:h-[5.5vw] lg:w-[5.2vw] lg:h-[5.2vw] rounded-full bg-white flex items-center justify-center overflow-hidden border-[0.8vw] md:border-4 ${isAudioOn ? 'border-green-500' : 'border-red-500'}`}>
                                            <img src={isAudioOn ? BTN_AUDIO_ON : BTN_AUDIO_OFF} alt="Audio" className="w-full h-full object-cover pointer-events-auto" />
                                        </div>
                                        <span className={`text-[2.2vw] md:text-[10px] lg:text-xs font-black uppercase mt-1 ${isAudioOn ? 'text-green-500' : 'text-red-500'}`}>AUDIO</span>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </header>

            {showNotificationsModal && (
                <div className="fixed inset-0 z-[200] bg-black/50 backdrop-blur-sm flex items-start justify-start p-4 pt-24" onClick={() => setShowNotificationsModal(false)}>
                    <div className="bg-white rounded-[2rem] shadow-2xl border-4 border-yellow-400 w-full max-md overflow-hidden animate-in fade-in slide-in-from-top-4" onClick={e => e.stopPropagation()}>
                        <div className="bg-yellow-400 p-4 flex justify-between items-center border-b-4 border-yellow-500">
                            <h3 className="font-black text-black text-xl uppercase flex items-center gap-2"><img src={ICON_NOTIF} alt="" className="w-12 h-12 object-contain" />Notifiche</h3>
                            <button onClick={() => setShowNotificationsModal(false)} className="hover:scale-110 active:scale-95 transition-all outline-none"><img src={BTN_CLOSE_IMG} alt="Chiudi" className="w-14 h-14 md:w-18 md:h-18 object-contain drop-shadow-sm pointer-events-auto" /></button>
                        </div>
                        <div className="max-h-[65vh] overflow-y-auto p-2 bg-yellow-50">
                            {notifications.length === 0 ? (
                                <p className="text-center text-gray-500 py-8 font-bold">Nessuna novità.</p>
                            ) : (
                                notifications.map(n => (
                                    <div key={n.id} className="bg-white p-4 mb-3 rounded-2xl shadow-sm">
                                        <p className="font-bold text-gray-800 leading-snug mb-3">{n.message}</p>
                                        {n.link && (
                                            <a href={n.link} target="_blank" rel="noopener noreferrer" className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-black uppercase inline-flex items-center gap-2">VAI <ExternalLink size={16}/></a>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Header;

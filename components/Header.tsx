
import React, { useState, useEffect } from 'react';
import { Bell, X, ExternalLink } from 'lucide-react';
import { AppView, AppNotification } from '../types';
import { CHANNEL_LOGO } from '../constants';
import { getAllNotifications } from '../services/data';

// Images for main buttons
const CITY_BTN_IMAGE = 'https://i.postimg.cc/P5NtznBj/Immagine-2025-12-05-dd090957.png';
const BOO_HOUSE_BTN_IMG = 'https://i.postimg.cc/nV79BBqS/Immagine-2025-12-05-0dd90736.png';

interface HeaderProps {
    currentView: AppView;
    setView: (view: AppView) => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, setView }) => {
    const [notifications, setNotifications] = useState<AppNotification[]>([]);
    const [showNotifications, setShowNotifications] = useState(false);

    // Determine current location context
    const isHome = currentView === AppView.HOME;
    const isCityMap = currentView === AppView.CITY_MAP;
    const isBooHouseMain = currentView === AppView.BOO_HOUSE;

    // Logic for main right logo: City Button if not home, otherwise Channel Logo
    const logoImage = isHome ? CHANNEL_LOGO : CITY_BTN_IMAGE;

    const hasUnread = notifications.length > 0;

    // --- NOTIFICATION LOGIC ---
    useEffect(() => {
        // 1. Request Permission on Mount
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }

        const checkNotifications = async () => {
            const data = await getAllNotifications();
            setNotifications(data);

            // Check for NEW notification to trigger System Alert
            if (data.length > 0) {
                const latest = data[0]; // Assuming API returns newest first or we sort it
                const lastSeenId = localStorage.getItem('last_system_notif_id');

                // If ID is different AND user hasn't seen it yet
                if (latest.id !== lastSeenId && latest.active) {
                    
                    // Trigger System Notification
                    if (Notification.permission === 'granted') {
                        navigator.serviceWorker.ready.then(registration => {
                            registration.showNotification("Lone Boo", {
                                body: latest.message,
                                icon: CHANNEL_LOGO,
                                badge: CHANNEL_LOGO,
                                tag: latest.id, // Prevents duplicate showing on some systems
                                vibrate: [200, 100, 200]
                            } as any);
                        });
                    }

                    // Save as seen to prevent looping
                    localStorage.setItem('last_system_notif_id', latest.id);
                }
            }
        };

        // Initial Check
        checkNotifications();

        // Polling every 60 seconds
        const interval = setInterval(checkNotifications, 60000);

        return () => clearInterval(interval);
    }, []);

    const handleBellClick = () => {
        setShowNotifications(!showNotifications);
    };

    const handleHouseClick = () => {
        setView(AppView.BOO_HOUSE);
    };

    const handleCityClick = () => {
        setView(AppView.CITY_MAP);
    };

    return (
        <>
            <header className="fixed top-0 left-0 right-0 z-50 h-[64px] md:h-[96px] pointer-events-none select-none">
                {/* Background Gradient - Only clickable parts should have pointer-events-auto */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/80 to-transparent pointer-events-none"></div>

                <div className="relative w-full h-full max-w-7xl mx-auto px-4 flex items-center justify-between pointer-events-auto">
                    
                    {/* LEFT GROUP: NOTIFICATIONS ONLY */}
                    <div className="absolute left-2 md:left-4 md:top-2 z-40 flex items-end gap-2 md:gap-3">
                        
                        {/* NOTIFICATION BELL */}
                        <div className="flex flex-col items-center group">
                            <button 
                                onClick={handleBellClick}
                                className="relative bg-yellow-400 hover:bg-yellow-300 active:scale-95 transition-all w-10 h-10 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-full border-4 border-black shadow-[2px_2px_0_rgba(0,0,0,0.4)] flex items-center justify-center flex-shrink-0"
                                aria-label="Notifiche"
                            >
                                {hasUnread && (
                                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 rounded-full border-2 border-white animate-pulse z-10"></span>
                                )}
                                
                                <Bell 
                                    className={`text-black drop-shadow-sm w-5 h-5 md:w-8 md:h-8 lg:w-10 lg:h-10 ${hasUnread ? 'animate-wiggle' : ''}`} 
                                    fill={hasUnread ? "black" : "none"}
                                    strokeWidth={2.5} 
                                />
                            </button>
                            {/* INVISIBLE SPACER TO ALIGN VERTICALLY WITH RIGHT SIDE TEXT LABELS */}
                            <div className="mt-1 border-2 border-transparent px-2 py-0.5 opacity-0 pointer-events-none">
                                <span className="text-[9px] md:text-[10px] lg:text-xs font-black uppercase tracking-wide leading-none block">.</span>
                            </div>
                        </div>
                    </div>

                    {/* TITLE CONTAINER - ALIGNED LEFT (with padding to clear left buttons) */}
                    <div className="flex-grow flex items-center justify-start pl-[60px] md:pl-[100px] h-full py-1">
                        <h1 
                            className="flex flex-row items-center gap-1 md:gap-3 whitespace-nowrap"
                            style={{ textShadow: "3px 3px 0px black" }}
                        >
                            <span 
                                className="font-luckiest text-2xl sm:text-5xl md:text-6xl lg:text-7xl text-[#60A5FA] tracking-wide leading-relaxed pb-1" 
                                style={{ WebkitTextStroke: '2px black', paintOrder: 'stroke fill' }}
                            >
                                Lone
                            </span>
                            <span 
                                className="font-luckiest text-2xl sm:text-5xl md:text-6xl lg:text-7xl text-[#FDBA74] tracking-wide leading-relaxed pb-1" 
                                style={{ WebkitTextStroke: '2px black', paintOrder: 'stroke fill' }}
                            >
                                Boo
                            </span>
                        </h1>
                    </div>

                    {/* RIGHT GROUP: HOME (INIZIO), HOUSE (CASA), CITY (CITTÀ) */}
                    <div className="absolute right-2 md:right-4 md:top-2 z-40 flex items-end gap-2 md:gap-3">
                        
                        {/* HOME BUTTON (INIZIO) - Only visible if not home */}
                        {!isHome && (
                            <div
                                className="flex flex-col items-center group cursor-pointer hover:scale-105 active:scale-95 transition-transform"
                                onClick={() => {
                                    setView(AppView.HOME);
                                    window.scrollTo(0, 0);
                                }}
                                aria-label="Torna all'Inizio"
                            >
                                <div className="relative w-10 h-10 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-full bg-white flex items-center justify-center overflow-hidden shadow-md border-4 border-[#86EFAC]">
                                    <img 
                                        src={CHANNEL_LOGO} 
                                        alt="Inizio" 
                                        className="w-[125%] h-[125%] -mt-2 ml-1 max-w-none object-cover" 
                                    />
                                </div>
                                <div className="mt-1 bg-white border-2 border-[#86EFAC] px-2 py-0.5 rounded-full shadow-sm">
                                    <span className="text-[8px] md:text-[10px] lg:text-xs font-black text-green-500 uppercase tracking-wide leading-none block">
                                        INIZIO
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* HOUSE BUTTON (Only if !isHome) */}
                        {!isHome && (
                            <div
                                className={`flex flex-col items-center group transition-transform ${isBooHouseMain ? 'cursor-default opacity-50' : 'cursor-pointer hover:scale-105 active:scale-95'}`}
                                onClick={isBooHouseMain ? undefined : handleHouseClick}
                                aria-label="Vai a Casa Boo"
                            >
                                <div className="relative w-10 h-10 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-full bg-white flex items-center justify-center overflow-hidden shadow-md border-4 border-[#F97316]">
                                    <img 
                                        src={BOO_HOUSE_BTN_IMG} 
                                        alt="Casa" 
                                        className="w-full h-full object-cover" 
                                    />
                                </div>
                                <div className="mt-1 bg-white border-2 border-[#F97316] px-2 py-0.5 rounded-full shadow-sm">
                                    <span className="text-[8px] md:text-[10px] lg:text-xs font-black text-[#F97316] uppercase tracking-wide leading-none block">
                                        CASA
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* CITY BUTTON / MAIN LOGO */}
                        <div 
                            className={`
                                flex flex-col items-center
                                ${isHome ? 'cursor-default' : (isCityMap ? 'cursor-default opacity-50' : 'cursor-pointer group hover:scale-105 active:scale-95')} 
                                transition-transform
                            `}
                            onClick={isHome ? undefined : (isCityMap ? undefined : handleCityClick)}
                            aria-label={isHome ? "Logo" : "Vai alla Mappa"}
                        >
                            <div className={`relative w-10 h-10 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-full bg-white flex items-center justify-center overflow-hidden shadow-md border-4 ${!isHome ? 'border-[#60A5FA]' : 'border-[#86EFAC]'}`}>
                                <img 
                                    src={logoImage} 
                                    alt="Logo" 
                                    className={`max-w-none object-cover ${isHome ? 'w-[125%] h-[125%] -mt-2 ml-1' : 'w-[110%] h-[110%]'}`} 
                                />
                            </div>
                            
                            {/* LABEL "Città" ONLY ON NON-HOME PAGES */}
                            {!isHome && (
                                <div className="mt-1 bg-white border-2 border-[#60A5FA] px-2 py-0.5 rounded-full shadow-sm">
                                    <span className="text-[8px] md:text-[10px] lg:text-xs font-black text-[#60A5FA] uppercase tracking-wide leading-none block">
                                        CITTÀ
                                    </span>
                                </div>
                            )}
                            {/* INVISIBLE SPACER FOR HOME PAGE ALIGNMENT */}
                            {isHome && (
                                <div className="mt-1 border-2 border-transparent px-2 py-0.5 opacity-0 pointer-events-none">
                                    <span className="text-[9px] md:text-[10px] lg:text-xs font-black uppercase tracking-wide leading-none block">.</span>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </header>

            {/* Notification Modal */}
            {showNotifications && (
                <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-start justify-start p-4 pt-24" onClick={() => setShowNotifications(false)}>
                    {/* Increased width to max-w-md and changed style for bigger content */}
                    <div className="bg-white rounded-[2rem] shadow-2xl border-4 border-yellow-400 w-full max-w-md overflow-hidden animate-in fade-in slide-in-from-top-4" onClick={e => e.stopPropagation()}>
                        <div className="bg-yellow-400 p-4 flex justify-between items-center border-b-4 border-yellow-500">
                            <h3 className="font-black text-black text-xl uppercase flex items-center gap-2"><Bell size={24}/> Notifiche</h3>
                            <button onClick={() => setShowNotifications(false)} className="bg-white/20 p-1 rounded-full hover:bg-white/40 transition-colors"><X size={28}/></button>
                        </div>
                        <div className="max-h-[65vh] overflow-y-auto p-2 bg-yellow-50">
                            {notifications.length === 0 ? (
                                <p className="text-center text-gray-500 py-8 font-bold text-lg">Nessuna novità.</p>
                            ) : (
                                notifications.map(n => (
                                    <div key={n.id} className="bg-white p-4 mb-3 rounded-2xl border-b-4 border-gray-200 last:mb-0 hover:border-yellow-300 transition-all shadow-sm">
                                        <div className="flex gap-4 items-start">
                                            {n.image && (
                                                // Significantly increased image size to w-24 h-24 (96px)
                                                <img src={n.image} alt="" className="w-24 h-24 rounded-xl object-cover border-2 border-gray-200 shrink-0 bg-gray-100" />
                                            )}
                                            <div className="flex-1 flex flex-col h-full justify-between py-1">
                                                <p className="font-bold text-gray-800 text-base leading-snug mb-3">{n.message}</p>
                                                {n.link && (
                                                    <a href={n.link} target="_blank" rel="noopener noreferrer" className="self-start bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-black uppercase flex items-center gap-2 hover:bg-blue-600 transition-colors shadow-[2px_2px_0_black] active:translate-y-[1px] active:shadow-none border-2 border-black">
                                                        {n.linkText || "Vedi"} <ExternalLink size={16}/>
                                                    </a>
                                                )}
                                            </div>
                                        </div>
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
    
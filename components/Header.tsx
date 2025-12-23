import React, { useState, useEffect, useRef } from 'react';
import { Bell, X, ExternalLink, Plus, Accessibility, Wand2, Shield, Lock, LifeBuoy } from 'lucide-react';
import { AppView, AppNotification } from '../types';
import { CHANNEL_LOGO, OFFICIAL_LOGO } from '../constants';
import { getAllNotifications } from '../services/data';
import { LOCAL_ASSET_MAP } from '../services/LocalAssets';
import AccessibilityMenu from './AccessibilityMenu';
import ParentalGate from './ParentalGate';
import ParentalArea from './ParentalArea';

// Images for main buttons
const CITY_BTN_IMAGE = 'https://i.postimg.cc/P5NtznBj/Immagine-2025-12-05-dd090957.png';
const BOO_HOUSE_BTN_IMG = 'https://i.postimg.cc/nV79BBqS/Immagine-2025-12-05-0dd90736.png';
const HEADER_TITLE_IMG = 'https://i.postimg.cc/nLZKXG2T/headee.png';
const BTN_CLOSE_IMG = 'https://i.postimg.cc/0NdtYdcJ/tasto-chiudi-(1)-(1).png';

// --- CUSTOM ICONS (UPDATED) ---
const ICON_NOTIF = 'https://i.postimg.cc/NFY3kzkS/notifir-(1).png';
const ICON_INFO = 'https://i.postimg.cc/CxyjrpqF/salvagegeg-(1).png';
const ICON_MAGIC = 'https://i.postimg.cc/nLF3F9GS/accessdre-(1).png';
const ICON_PARENTS = 'https://i.postimg.cc/Y2YYPq1C/area-genitori-(1).png';

interface HeaderProps {
    currentView: AppView;
    setView: (view: AppView) => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, setView }) => {
    const [notifications, setNotifications] = useState<AppNotification[]>([]);
    
    // UI States
    const [isMenuOpen, setIsMenuOpen] = useState(false); 
    const [showNotificationsModal, setShowNotificationsModal] = useState(false); 
    const [showAccessibilityModal, setShowAccessibilityModal] = useState(false); 
    
    // Parental States
    const [showParentalGate, setShowParentalGate] = useState(false);
    const [showParentalArea, setShowParentalArea] = useState(false);

    const menuRef = useRef<HTMLDivElement>(null);

    // Determine current location context
    const isHome = currentView === AppView.HOME;
    const isCityMap = currentView === AppView.CITY_MAP;
    const isBooHouseMain = currentView === AppView.BOO_HOUSE;

    const logoImage = isHome ? OFFICIAL_LOGO : CITY_BTN_IMAGE;
    const hasUnread = notifications.length > 0;

    // Fallback Handler
    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        const target = e.currentTarget;
        const currentSrc = target.getAttribute('src') || '';
        const originalUrl = Object.keys(LOCAL_ASSET_MAP).find(key => LOCAL_ASSET_MAP[key] === currentSrc || (currentSrc.startsWith(window.location.origin) && currentSrc.endsWith(LOCAL_ASSET_MAP[key])));
        
        if (originalUrl && currentSrc !== originalUrl) {
            target.src = originalUrl;
        }
    };

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // --- NOTIFICATION LOGIC ---
    useEffect(() => {
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }

        const checkNotifications = async () => {
            const data = await getAllNotifications();
            setNotifications(data);

            if (data.length > 0) {
                const latest = data[0];
                const lastSeenId = localStorage.getItem('last_system_notif_id');

                if (latest.id !== lastSeenId && latest.active) {
                    if (Notification.permission === 'granted') {
                        navigator.serviceWorker.ready.then(registration => {
                            registration.showNotification("Lone Boo", {
                                body: latest.message,
                                icon: CHANNEL_LOGO,
                                badge: CHANNEL_LOGO,
                                tag: latest.id,
                                vibrate: [200, 100, 200]
                            } as any);
                        });
                    }
                    localStorage.setItem('last_system_notif_id', latest.id);
                }
            }
        };

        checkNotifications();
        const interval = setInterval(checkNotifications, 60000);
        return () => clearInterval(interval);
    }, []);

    // Global Listener for Game Locks
    useEffect(() => {
        const triggerGate = () => setShowParentalGate(true);
        window.addEventListener('triggerParentalGate', triggerGate);
        return () => window.removeEventListener('triggerParentalGate', triggerGate);
    }, []);

    const handlePlusClick = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleOpenNotifications = () => {
        setIsMenuOpen(false);
        setShowNotificationsModal(true);
    };

    const handleOpenAccessibility = () => {
        setIsMenuOpen(false);
        setShowAccessibilityModal(true);
    };

    const handleOpenParental = () => {
        setIsMenuOpen(false);
        setShowParentalGate(true);
    };

    const handleParentalSuccess = () => {
        setShowParentalGate(false);
        setShowParentalArea(true);
    };

    const handleOpenInfo = () => {
        setIsMenuOpen(false);
        setView(AppView.INFO_MENU);
    };

    return (
        <>
            {/* MODALS */}
            <AccessibilityMenu isOpen={showAccessibilityModal} onClose={() => setShowAccessibilityModal(false)} />
            {showParentalGate && <ParentalGate onClose={() => setShowParentalGate(false)} onSuccess={handleParentalSuccess} />}
            {showParentalArea && <ParentalArea onClose={() => setShowParentalArea(false)} setView={setView} />}

            <header className="fixed top-0 left-0 right-0 z-[100] h-[64px] md:h-[96px] pointer-events-none select-none">
                <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/80 to-transparent pointer-events-none"></div>

                <div className="relative w-full h-full max-w-7xl mx-auto px-4 flex items-center justify-between pointer-events-auto">
                    
                    {/* LEFT GROUP: PLUS MENU */}
                    <div className="absolute left-2 md:left-4 md:top-2 z-40 flex items-end gap-2" ref={menuRef}>
                        <div className="relative">
                            
                            {/* PLUS BUTTON */}
                            <button 
                                onClick={handlePlusClick}
                                className={`
                                    relative bg-yellow-400 hover:bg-yellow-300 active:scale-95 transition-all 
                                    w-10 h-10 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-full 
                                    border-4 border-black shadow-[2px_2px_0_rgba(0,0,0,0.4)] 
                                    flex items-center justify-center flex-shrink-0 z-50
                                    ${isMenuOpen ? 'rotate-45 bg-red-400 border-red-800' : ''}
                                `}
                                aria-label="Menu Opzioni"
                            >
                                {hasUnread && !isMenuOpen && (
                                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 rounded-full border-2 border-white animate-pulse z-20"></span>
                                )}
                                
                                <Plus 
                                    className="text-black drop-shadow-sm w-6 h-6 md:w-10 md:h-10 transition-transform duration-300" 
                                    strokeWidth={3} 
                                />
                            </button>

                            {/* DROPDOWN MENU - BLUE GLASS EFFECT */}
                            {isMenuOpen && (
                                <div className="absolute top-[110%] left-0 bg-sky-200/30 backdrop-blur-xl border border-white/40 rounded-2xl shadow-2xl p-2 flex flex-col gap-2 w-60 animate-in slide-in-from-top-2 fade-in z-40">
                                    
                                    {/* Notifications Item */}
                                    <button 
                                        onClick={handleOpenNotifications}
                                        className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/40 transition-colors w-full text-left group"
                                    >
                                        <div className="relative w-9 h-9 shrink-0 group-hover:scale-110 transition-transform flex items-center justify-center">
                                            <img src={ICON_NOTIF} alt="Notifiche" className="w-8 h-8 object-contain drop-shadow-sm" />
                                            {hasUnread && <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border border-white animate-pulse"></span>}
                                        </div>
                                        <div>
                                            <span className="block font-black text-sm uppercase text-gray-900 drop-shadow-sm">Notifiche</span>
                                            {hasUnread && <span className="text-[10px] text-red-600 font-bold bg-white/80 px-1 rounded">Nuovi messaggi!</span>}
                                        </div>
                                    </button>

                                    <div className="h-px bg-white/30 w-full rounded-full"></div>

                                    {/* Info & Help Item */}
                                    <button 
                                        onClick={handleOpenInfo}
                                        className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/40 transition-colors w-full text-left group"
                                    >
                                        <div className="w-9 h-9 shrink-0 group-hover:scale-110 transition-transform flex items-center justify-center">
                                            <img src={ICON_INFO} alt="Info" className="w-8 h-8 object-contain drop-shadow-sm" />
                                        </div>
                                        <div>
                                            <span className="block font-black text-sm uppercase text-gray-900 drop-shadow-sm">Info & Aiuto</span>
                                            <span className="text-[10px] text-gray-700 font-bold">Chi siamo, Contatti...</span>
                                        </div>
                                    </button>

                                    <div className="h-px bg-white/30 w-full rounded-full"></div>

                                    {/* Accessibility Item */}
                                    <button 
                                        onClick={handleOpenAccessibility}
                                        className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/40 transition-colors w-full text-left group"
                                    >
                                        <div className="w-9 h-9 shrink-0 group-hover:scale-110 transition-transform flex items-center justify-center">
                                            <img src={ICON_MAGIC} alt="Accessibilità" className="w-8 h-8 object-contain drop-shadow-sm" />
                                        </div>
                                        <div>
                                            <span className="block font-black text-sm uppercase text-gray-900 drop-shadow-sm">Magia</span>
                                            <span className="text-[10px] text-gray-700 font-bold">Accessibilità</span>
                                        </div>
                                    </button>

                                    <div className="h-px bg-white/30 w-full rounded-full"></div>

                                    {/* Parental Area Item */}
                                    <button 
                                        onClick={handleOpenParental}
                                        className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/40 transition-colors w-full text-left group"
                                    >
                                        <div className="w-9 h-9 shrink-0 group-hover:scale-110 transition-transform flex items-center justify-center">
                                            <img src={ICON_PARENTS} alt="Genitori" className="w-8 h-8 object-contain drop-shadow-sm" />
                                        </div>
                                        <div>
                                            <span className="block font-black text-sm uppercase text-gray-900 drop-shadow-sm">Genitori</span>
                                            <span className="text-[10px] text-gray-700 font-bold">Timer & Sicurezza</span>
                                        </div>
                                    </button>

                                </div>
                            )}

                        </div>
                    </div>

                    {/* TITLE CONTAINER */}
                    <div className="flex-grow flex items-center justify-start pl-[45px] md:pl-[85px] h-full py-2">
                        <img 
                            src={HEADER_TITLE_IMG} 
                            alt="Lone Boo" 
                            className="h-[65%] md:h-full w-auto object-contain drop-shadow-md"
                            onError={handleImageError}
                        />
                    </div>

                    {/* RIGHT GROUP */}
                    <div className="absolute right-2 md:right-4 md:top-2 z-40 flex items-end gap-2 md:gap-3">
                        {!isHome && (
                            <div className="flex flex-col items-center group cursor-pointer hover:scale-105 active:scale-95 transition-transform" onClick={() => { setView(AppView.HOME); window.scrollTo(0, 0); }}>
                                <div className="relative w-10 h-10 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-full bg-white flex items-center justify-center overflow-hidden shadow-md">
                                    <img src={OFFICIAL_LOGO} alt="Inizio" className="w-full h-full object-cover" onError={handleImageError} />
                                </div>
                                <div className="mt-1 bg-white border-2 border-[#86EFAC] px-2 py-0.5 rounded-full shadow-sm">
                                    <span className="text-[8px] md:text-[10px] lg:text-xs font-black text-green-500 uppercase tracking-wide leading-none block">INIZIO</span>
                                </div>
                            </div>
                        )}

                        {!isHome && (
                            <div className={`flex flex-col items-center group transition-transform ${isBooHouseMain ? 'cursor-default opacity-50' : 'cursor-pointer hover:scale-105 active:scale-95'}`} onClick={isBooHouseMain ? undefined : () => setView(AppView.BOO_HOUSE)}>
                                <div className="relative w-10 h-10 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-full bg-white flex items-center justify-center overflow-hidden shadow-md border-4 border-[#F97316]">
                                    <img src={BOO_HOUSE_BTN_IMG} alt="Casa" className="w-full h-full object-cover" onError={handleImageError} />
                                </div>
                                <div className="mt-1 bg-white border-2 border-[#F97316] px-2 py-0.5 rounded-full shadow-sm">
                                    <span className="text-[8px] md:text-[10px] lg:text-xs font-black text-[#F97316] uppercase tracking-wide leading-none block">CASA</span>
                                </div>
                            </div>
                        )}

                        <div className={`flex flex-col items-center ${isHome ? 'cursor-default' : (isCityMap ? 'cursor-default opacity-50' : 'cursor-pointer group hover:scale-105 active:scale-95')} transition-transform`} onClick={isHome ? undefined : (isCityMap ? undefined : () => setView(AppView.CITY_MAP))}>
                            <div className={`relative w-10 h-10 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-full bg-white flex items-center justify-center overflow-hidden shadow-md ${!isHome ? 'border-4 border-[#60A5FA]' : ''}`}>
                                <img src={logoImage} alt="Logo" className={`object-cover ${isHome ? 'w-full h-full' : 'w-[110%] h-[110%] max-w-none'}`} onError={handleImageError} />
                            </div>
                            {!isHome && (
                                <div className="mt-1 bg-white border-2 border-[#60A5FA] px-2 py-0.5 rounded-full shadow-sm">
                                    <span className="text-[8px] md:text-[10px] lg:text-xs font-black text-[#60A5FA] uppercase tracking-wide leading-none block">CITTÀ</span>
                                </div>
                            )}
                            {isHome && <div className="mt-1 border-2 border-transparent px-2 py-0.5 opacity-0 pointer-events-none"><span className="text-[9px] md:text-[10px] lg:text-xs font-black uppercase tracking-wide leading-none block">.</span></div>}
                        </div>
                    </div>

                </div>
            </header>

            {/* Notification Modal (Big Center) */}
            {showNotificationsModal && (
                <div className="fixed inset-0 z-[200] bg-black/50 backdrop-blur-sm flex items-start justify-start p-4 pt-24" onClick={() => setShowNotificationsModal(false)}>
                    <div className="bg-white rounded-[2rem] shadow-2xl border-4 border-yellow-400 w-full max-w-md overflow-hidden animate-in fade-in slide-in-from-top-4" onClick={e => e.stopPropagation()}>
                        <div className="bg-yellow-400 p-4 flex justify-between items-center border-b-4 border-yellow-500">
                            <h3 className="font-black text-black text-xl uppercase flex items-center gap-2">
                                <img src={ICON_NOTIF} alt="" className="w-12 h-12 object-contain drop-shadow-sm" />
                                Notifiche
                            </h3>
                            <button 
                                onClick={() => setShowNotificationsModal(false)} 
                                className="hover:scale-110 active:scale-95 transition-all outline-none"
                            >
                                <img src={BTN_CLOSE_IMG} alt="Chiudi" className="w-14 h-14 md:w-18 md:h-18 object-contain drop-shadow-md" />
                            </button>
                        </div>
                        <div className="max-h-[65vh] overflow-y-auto p-2 bg-yellow-50">
                            {notifications.length === 0 ? (
                                <p className="text-center text-gray-500 py-8 font-bold text-lg">Nessuna novità.</p>
                            ) : (
                                notifications.map(n => (
                                    <div key={n.id} className="bg-white p-4 mb-3 rounded-2xl border-b-4 border-gray-200 last:mb-0 hover:border-yellow-300 transition-all shadow-sm">
                                        <div className="flex gap-4 items-start">
                                            {n.image && (
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
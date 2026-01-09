
import React, { useState, useEffect, useRef } from 'react';
import { Bell, X, ExternalLink, Plus, Accessibility, Wand2, Shield, Lock, LifeBuoy } from 'lucide-react';
import { AppView, AppNotification } from '../types';
import { CHANNEL_LOGO, OFFICIAL_LOGO } from '../constants';
import { fetchAppNotifications, markNotificationsAsRead, checkHasNewNotifications } from '../services/notificationService';
import AccessibilityMenu from './AccessibilityMenu';
import ParentalGate from './ParentalGate';
import ParentalArea from './ParentalArea';

// Immagini pure stringhe
const CITY_BTN_IMAGE = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/btn-city.webp';
const BOO_HOUSE_BTN_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/btn-house.webp';
const HEADER_TITLE_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/header-title.webp';
const BTN_CLOSE_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/btn-close.webp';
const INIZIO_BTN_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/inizioseddfeawq.webp';
const HOME_HEADER_LOGO = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/logo-main2211.webp';

const ICON_NOTIF = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/icon-notif.webp';
const ICON_INFO = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/icon-info.webp';
const ICON_MAGIC = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/icon-magic.webp';
const ICON_PARENTS = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/icon-parents.webp';

interface HeaderProps {
    currentView: AppView;
    setView: (view: AppView) => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, setView }) => {
    const [notifications, setNotifications] = useState<AppNotification[]>([]);
    const [hasNew, setHasNew] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false); 
    const [showNotificationsModal, setShowNotificationsModal] = useState(false); 
    const [showAccessibilityModal, setShowAccessibilityModal] = useState(false); 
    const [showParentalGate, setShowParentalGate] = useState(false);
    const [showParentalArea, setShowParentalArea] = useState(false);

    const menuRef = useRef<HTMLDivElement>(null);

    const isHome = currentView === AppView.HOME;
    const isCityMap = currentView === AppView.CITY_MAP;
    const isBooHouseMain = currentView === AppView.BOO_HOUSE;
    
    // Se siamo in Home usiamo il nuovo logo, altrimenti usiamo il tasto Città
    const logoImage = isHome ? HOME_HEADER_LOGO : CITY_BTN_IMAGE;

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) setIsMenuOpen(false);
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
    }, []);

    const handlePlusClick = () => setIsMenuOpen(!isMenuOpen);

    const handleOpenNotifications = async () => {
        setIsMenuOpen(false);
        setShowNotificationsModal(true);
        await markNotificationsAsRead();
    };

    const handleOpenAccessibility = () => { setIsMenuOpen(false); setShowAccessibilityModal(true); };
    const handleOpenParental = () => { setIsMenuOpen(false); setShowParentalGate(true); };
    const handleParentalSuccess = () => { setShowParentalGate(false); setShowParentalArea(true); };
    const handleOpenInfo = () => { setIsMenuOpen(false); setView(AppView.INFO_MENU); };
    const handleCityClick = () => setView(AppView.CITY_MAP);

    return (
        <>
            <AccessibilityMenu isOpen={showAccessibilityModal} onClose={() => setShowAccessibilityModal(false)} />
            {showParentalGate && <ParentalGate onClose={() => setShowParentalGate(false)} onSuccess={handleParentalSuccess} />}
            {showParentalArea && <ParentalArea onClose={() => setShowParentalArea(false)} setView={setView} />}

            <header className="fixed top-0 left-0 right-0 z-[100] h-[64px] md:h-[96px] pointer-events-none select-none bg-transparent">
                <div className="relative w-full h-full max-w-7xl mx-auto flex items-center pointer-events-none">
                    
                    {/* Menu Plus */}
                    <div className="absolute left-[2%] md:left-[3%] top-1/2 -translate-y-1/2 z-40 flex items-center pointer-events-auto" ref={menuRef}>
                        <div className="relative">
                            <button 
                                onClick={handlePlusClick}
                                className={`relative bg-yellow-400 hover:bg-yellow-300 active:scale-95 transition-all w-[11.5vw] h-[11.5vw] md:w-[6vw] md:h-[6vw] lg:w-[5.5vw] lg:h-[5.5vw] rounded-full border-[0.8vw] md:border-4 border-black shadow-[0.6vw_0.6vw_0_rgba(0,0,0,0.6)] md:shadow-[3px_3px_0_rgba(0,0,0,0.6)] flex items-center justify-center z-50 ${isMenuOpen ? 'rotate-45 bg-red-400 border-red-800' : ''}`}
                            >
                                {hasNew && !isMenuOpen && (
                                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 rounded-full border-2 border-white animate-pulse z-20"></span>
                                )}
                                <Plus className="text-black w-[7vw] h-[7vw] md:w-[3.5vw] md:h-[3.5vw]" strokeWidth={3} />
                            </button>

                            {isMenuOpen && (
                                <div className="absolute top-[110%] left-0 bg-sky-200/30 backdrop-blur-xl border border-white/40 rounded-2xl shadow-2xl p-2 flex flex-col gap-2 w-60 animate-in slide-in-from-top-2 fade-in z-40">
                                    <button onClick={handleOpenNotifications} className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/40 transition-colors w-full text-left group">
                                        <div className="relative w-9 h-9 shrink-0 group-hover:scale-110 transition-transform flex items-center justify-center">
                                            <img src={ICON_NOTIF} alt="Notifiche" className="w-8 h-8 object-contain drop-shadow-sm pointer-events-auto" />
                                            {hasNew && <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border border-white animate-pulse"></span>}
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

                    {/* Logo Intestazione Centrale */}
                    <div className="absolute left-[14.5%] md:left-[11%] w-[45%] md:w-[30%] h-full flex items-center pointer-events-auto py-2">
                        <img 
                            src={HEADER_TITLE_IMG} 
                            alt="Lone Boo" 
                            className="h-[65%] md:h-[85%] w-auto object-contain drop-shadow-[0_0_8px_rgba(255,255,255,0.9)] pointer-events-auto opacity-100" 
                        />
                    </div>

                    {/* Gruppo Icone Destra */}
                    <div className="absolute right-[2%] md:right-[3%] top-1/2 -translate-y-1/2 z-50 flex items-center gap-[1.5vw] md:gap-[1vw] pointer-events-auto">
                        {!isHome && (
                            <div className="flex flex-col items-center group cursor-pointer hover:scale-105 active:scale-95 transition-transform" onClick={() => setView(AppView.HOME)}>
                                <div className="relative w-[10.5vw] h-[10.5vw] md:w-[5.5vw] md:h-[5.5vw] lg:w-[5.2vw] lg:h-[5.2vw] rounded-full bg-white flex items-center justify-center overflow-hidden shadow-md border-2 border-black/5">
                                    <img src={INIZIO_BTN_IMG} alt="Inizio" className="w-full h-full object-cover pointer-events-auto" />
                                </div>
                                <span className="text-[2.2vw] md:text-[10px] lg:text-xs font-black text-green-500 uppercase mt-1">INIZIO</span>
                            </div>
                        )}
                        {!isHome && (
                            <div className={`flex flex-col items-center transition-transform ${isBooHouseMain ? 'cursor-default opacity-50' : 'cursor-pointer hover:scale-105 active:scale-95'}`} onClick={isBooHouseMain ? undefined : () => setView(AppView.BOO_HOUSE)}>
                                <div className="relative w-[10.5vw] h-[10.5vw] md:w-[5.5vw] md:h-[5.5vw] lg:w-[5.2vw] lg:h-[5.2vw] rounded-full bg-white flex items-center justify-center overflow-hidden border-[0.8vw] md:border-4 border-[#F97316]">
                                    <img src={BOO_HOUSE_BTN_IMG} alt="Casa" className="w-full h-full object-cover pointer-events-auto" />
                                </div>
                                <span className="text-[2.2vw] md:text-[10px] lg:text-xs font-black text-[#F97316] uppercase mt-1">CASA</span>
                            </div>
                        )}
                        <div className={`flex flex-col items-center ${isHome ? 'cursor-default' : (isCityMap ? 'cursor-default opacity-50' : 'cursor-pointer group hover:scale-105 active:scale-95')} transition-transform`}>
                            <div className={`relative w-[10.5vw] h-[10.5vw] md:w-[5.5vw] md:h-[5.5vw] lg:w-[5.2vw] lg:h-[5.2vw] rounded-full bg-white flex items-center justify-center overflow-hidden z-50 ${!isHome ? 'border-[0.8vw] md:border-4 border-[#60A5FA]' : ''}`} onClick={isHome ? undefined : handleCityClick}>
                                <img src={logoImage} alt="Logo" className="w-full h-full object-cover pointer-events-auto" />
                            </div>
                            {!isHome && <span className="text-[2.2vw] md:text-[10px] lg:text-xs font-black text-[#60A5FA] uppercase mt-1">CITTÀ</span>}
                        </div>
                    </div>
                </div>
            </header>

            {showNotificationsModal && (
                <div className="fixed inset-0 z-[200] bg-black/50 backdrop-blur-sm flex items-start justify-start p-4 pt-24" onClick={() => setShowNotificationsModal(false)}>
                    <div className="bg-white rounded-[2rem] shadow-2xl border-4 border-yellow-400 w-full max-w-md overflow-hidden animate-in fade-in slide-in-from-top-4" onClick={e => e.stopPropagation()}>
                        <div className="bg-yellow-400 p-4 flex justify-between items-center border-b-4 border-yellow-500">
                            <h3 className="font-black text-black text-xl uppercase flex items-center gap-2"><img src={ICON_NOTIF} alt="" className="w-12 h-12 object-contain" />Notifiche</h3>
                            <button onClick={() => setShowNotificationsModal(false)} className="hover:scale-110 active:scale-95 transition-all outline-none"><img src={BTN_CLOSE_IMG} alt="Chiudi" className="w-14 h-14 md:w-18 md:h-18 object-contain pointer-events-auto" /></button>
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


import React, { useState, useEffect } from 'react';
import { Moon, Unlock } from 'lucide-react';
import ParentalGate from './ParentalGate';

const BedtimeOverlay: React.FC = () => {
    const [isActive, setIsActive] = useState(false);
    const [showGate, setShowGate] = useState(false);

    useEffect(() => {
        const checkTimer = () => {
            const end = localStorage.getItem('bedtime_timer_end');
            if (end) {
                const endTime = parseInt(end);
                if (Date.now() >= endTime) {
                    setIsActive(true);
                } else {
                    setIsActive(false);
                }
            } else {
                setIsActive(false);
            }
        };

        // Check immediately
        checkTimer();

        // Check every 10 seconds (or listen to event)
        const interval = setInterval(checkTimer, 10000);
        
        const handleUpdate = () => checkTimer();
        window.addEventListener('timerUpdated', handleUpdate);

        return () => {
            clearInterval(interval);
            window.removeEventListener('timerUpdated', handleUpdate);
        };
    }, []);

    const handleUnlock = () => {
        localStorage.removeItem('bedtime_timer_end');
        setIsActive(false);
        setShowGate(false);
        window.dispatchEvent(new Event('timerUpdated'));
    };

    if (!isActive) return null;

    return (
        <div className="fixed inset-0 z-[9999] bg-[#0f172a] flex flex-col items-center justify-center p-6 text-white animate-in fade-in duration-1000">
            {showGate && <ParentalGate onClose={() => setShowGate(false)} onSuccess={handleUnlock} />}
            
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
                 {/* Simple Star CSS */}
                 <div className="absolute top-10 left-20 text-yellow-200 animate-pulse">✨</div>
                 <div className="absolute bottom-40 right-10 text-yellow-200 animate-pulse delay-700">✨</div>
                 <div className="absolute top-1/2 left-10 text-yellow-200 animate-pulse delay-300">✨</div>
            </div>

            <div className="relative z-10 flex flex-col items-center text-center max-w-md">
                <div className="bg-indigo-900/50 p-8 rounded-full border-4 border-indigo-500/30 mb-8 shadow-[0_0_50px_rgba(99,102,241,0.3)] animate-pulse">
                    <Moon size={80} className="text-yellow-300 fill-yellow-300" />
                </div>

                <h1 className="text-4xl md:text-6xl font-black text-indigo-100 mb-4 tracking-wide font-cartoon">
                    Shhh...
                </h1>
                
                <p className="text-xl md:text-2xl font-bold text-indigo-300 mb-12 leading-relaxed">
                    È ora di fare la nanna.<br/>
                    Lone Boo sta dormendo! 💤
                </p>

                <button 
                    onClick={() => setShowGate(true)}
                    className="flex items-center gap-2 text-indigo-400/50 hover:text-white font-bold border border-indigo-400/30 hover:border-white px-4 py-2 rounded-full transition-all text-xs uppercase tracking-widest"
                >
                    <Unlock size={14} /> Sblocca Genitore
                </button>
            </div>
        </div>
    );
};

export default BedtimeOverlay;

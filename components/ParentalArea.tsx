import React, { useState, useEffect } from 'react';
import { X, Trash2, Shield, ExternalLink, Clock, Moon, AlertTriangle, CheckCircle, ShieldAlert, ChevronDown, ChevronUp, FileText, ArrowRight, Minus, Plus, Gamepad2, ToggleLeft, ToggleRight } from 'lucide-react';
import { AppView } from '../types';

const ICON_PARENTS = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/icon-parents.webp';
const BTN_CLOSE_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/btn-close.webp';

interface ParentalAreaProps {
    onClose: () => void;
    setView: (view: AppView) => void;
}

const ParentalArea: React.FC<ParentalAreaProps> = ({ onClose, setView }) => {
    // State
    const [linksDisabled, setLinksDisabled] = useState(false);
    const [gamesEnabled, setGamesEnabled] = useState(false);
    const [timerMinutes, setTimerMinutes] = useState<number | null>(null);
    const [confirmReset, setConfirmReset] = useState(false);
    
    // Manual Timer State
    const [showManualTimer, setShowManualTimer] = useState(false);
    const [customHours, setCustomHours] = useState(0);
    const [customMinutes, setCustomMinutes] = useState(0);

    useEffect(() => {
        // Load settings
        const linksSetting = localStorage.getItem('disable_external_links') === 'true';
        setLinksDisabled(linksSetting);

        const gamesSetting = localStorage.getItem('authorized_games_enabled') === 'true';
        setGamesEnabled(gamesSetting);

        // Check active timer
        const timerEnd = localStorage.getItem('bedtime_timer_end');
        if (timerEnd) {
            const left = Math.ceil((parseInt(timerEnd) - Date.now()) / 60000);
            if (left > 0) setTimerMinutes(left);
            else localStorage.removeItem('bedtime_timer_end');
        }
    }, []);

    // --- HANDLERS ---

    const toggleLinks = () => {
        const newVal = !linksDisabled;
        setLinksDisabled(newVal);
        localStorage.setItem('disable_external_links', String(newVal));
        window.dispatchEvent(new Event('settingsChanged'));
    };

    const toggleGames = () => {
        const newVal = !gamesEnabled;
        setGamesEnabled(newVal);
        localStorage.setItem('authorized_games_enabled', String(newVal));
        window.dispatchEvent(new Event('settingsChanged'));
    };

    const setTimer = (minutes: number) => {
        if (minutes <= 0) {
            localStorage.removeItem('bedtime_timer_end');
            setTimerMinutes(null);
        } else {
            const end = Date.now() + (minutes * 60 * 1000);
            localStorage.setItem('bedtime_timer_end', String(end));
            setTimerMinutes(minutes);
        }
        window.dispatchEvent(new Event('timerUpdated'));
    };

    const handleManualTimerStart = () => {
        const totalMinutes = (customHours * 60) + customMinutes;
        if (totalMinutes > 0) {
            setTimer(totalMinutes);
            setShowManualTimer(false);
        }
    };

    const handleReset = () => {
        if (!confirmReset) {
            setConfirmReset(true);
            return;
        }
        localStorage.clear();
        window.location.reload();
    };

    const goToDisclaimer = () => {
        setView(AppView.DISCLAIMER);
        onClose();
    };

    // Helper for counters
    const adjustTime = (type: 'H' | 'M', delta: number) => {
        if (type === 'H') {
            setCustomHours(prev => Math.max(0, Math.min(12, prev + delta)));
        } else {
            setCustomMinutes(prev => {
                let newMin = prev + delta;
                if (newMin >= 60) { newMin = 0; setCustomHours(h => h + 1); }
                if (newMin < 0) { 
                    if (customHours > 0) { setCustomHours(h => h - 1); newMin = 55; } 
                    else newMin = 0; 
                }
                return newMin;
            });
        }
    };

    return (
        <div className="fixed inset-0 z-[250] bg-slate-900 flex flex-col items-center justify-center p-4 animate-in fade-in">
            <div className="bg-white w-full max-w-2xl h-[90vh] rounded-[40px] border-4 md:border-8 border-slate-700 shadow-2xl flex flex-col overflow-hidden relative">
                
                {/* Header */}
                <div className="bg-slate-800 p-4 flex justify-between items-center shrink-0 border-b-4 border-slate-900">
                    <div className="flex items-center gap-3">
                        <img src={ICON_PARENTS} alt="Area Genitori" className="w-12 h-12 object-contain drop-shadow-md" />
                        <h2 className="text-2xl font-black text-white uppercase tracking-wider">Area Genitori</h2>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="hover:scale-110 active:scale-95 transition-all outline-none"
                    >
                        <img src={BTN_CLOSE_IMG} alt="Chiudi" className="w-16 h-16 md:w-20 md:h-20 object-contain drop-shadow-md" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 bg-slate-50 space-y-6">

                    {/* 1. GESTIONE GIOCHI (NUOVO) */}
                    <section className="bg-white p-5 rounded-3xl border-2 border-slate-200 shadow-sm">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="bg-orange-100 p-2 rounded-xl text-orange-600"><Gamepad2 size={24} /></div>
                            <h3 className="text-lg font-black text-slate-800">Gestione Giochi</h3>
                        </div>
                        <p className="text-sm text-slate-500 font-medium mb-4 leading-relaxed">
                            Abilita i giochi che richiedono la supervisione di un adulto.
                        </p>
                        
                        <button 
                            onClick={toggleGames}
                            className={`w-full py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-3 transition-all border-b-4 active:border-b-0 active:translate-y-1 ${gamesEnabled ? 'bg-green-500 text-white border-green-700' : 'bg-red-500 text-white border-red-700'}`}
                        >
                            {gamesEnabled ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
                            {gamesEnabled ? 'TUTTI I GIOCHI ABILITATI' : 'GIOCHI SPECIALI DISATTIVATI'}
                        </button>

                        <div className="mt-4 p-3 bg-gray-50 rounded-xl border border-gray-200">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Giochi controllati:</span>
                            <div className="flex flex-wrap gap-2">
                                <span className="px-3 py-1 bg-white border border-gray-300 rounded-full text-xs font-bold text-gray-600">✨ Gratta e Vinci</span>
                                <span className="px-3 py-1 bg-white border border-gray-300 rounded-full text-xs font-bold text-gray-600">🏹 Tiro alla Fionda</span>
                            </div>
                        </div>
                    </section>

                    {/* 2. TIMER BUONANOTTE */}
                    <section className="bg-white p-5 rounded-3xl border-2 border-slate-200 shadow-sm">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="bg-indigo-100 p-2 rounded-xl text-indigo-600"><Moon size={24} /></div>
                            <h3 className="text-lg font-black text-slate-800">Timer Buonanotte</h3>
                        </div>
                        <p className="text-sm text-slate-500 font-medium mb-4 leading-relaxed">
                            Imposta un limite di tempo. Allo scadere, l'app mostrerà una schermata di "nanna" bloccante.
                        </p>
                        
                        {/* Presets */}
                        <div className="grid grid-cols-3 gap-3 mb-4">
                            {[15, 30, 60].map(m => (
                                <button 
                                    key={m}
                                    onClick={() => setTimer(m)}
                                    className={`py-3 rounded-xl font-bold border-2 transition-all ${timerMinutes && timerMinutes <= m && timerMinutes > (m === 60 ? 30 : (m === 30 ? 15 : 0)) ? 'bg-indigo-600 text-white border-indigo-800' : 'bg-white text-slate-600 border-slate-300 hover:border-indigo-400'}`}
                                >
                                    {m} min
                                </button>
                            ))}
                        </div>

                        {/* Manual Toggle */}
                        <div className="border-t border-slate-100 pt-4">
                            <button 
                                onClick={() => setShowManualTimer(!showManualTimer)}
                                className="w-full flex items-center justify-between text-slate-500 font-bold text-sm hover:text-indigo-600 transition-colors"
                            >
                                <span>Imposta durata personalizzata</span>
                                {showManualTimer ? <ChevronUp size={20}/> : <ChevronDown size={20}/>}
                            </button>

                            {showManualTimer && (
                                <div className="mt-4 bg-slate-50 p-4 rounded-2xl border border-slate-200 animate-in slide-in-from-top-2">
                                    <div className="flex justify-center gap-6 mb-4">
                                        {/* Hours */}
                                        <div className="flex flex-col items-center gap-2">
                                            <span className="text-xs font-black text-slate-400 uppercase">ORE</span>
                                            <div className="flex items-center gap-2">
                                                <button onClick={() => adjustTime('H', -1)} className="p-2 bg-indigo-100 text-indigo-700 rounded-lg shadow-sm active:scale-95 hover:bg-indigo-200 transition-colors"><Minus size={20} strokeWidth={3}/></button>
                                                <span className="text-3xl font-black text-slate-800 w-12 text-center">{customHours}</span>
                                                <button onClick={() => adjustTime('H', 1)} className="p-2 bg-indigo-100 text-indigo-700 rounded-lg shadow-sm active:scale-95 hover:bg-indigo-200 transition-colors"><Plus size={20} strokeWidth={3}/></button>
                                            </div>
                                        </div>
                                        {/* Minutes */}
                                        <div className="flex flex-col items-center gap-2">
                                            <span className="text-xs font-black text-slate-400 uppercase">MINUTI</span>
                                            <div className="flex items-center gap-2">
                                                <button onClick={() => adjustTime('M', -5)} className="p-2 bg-indigo-100 text-indigo-700 rounded-lg shadow-sm active:scale-95 hover:bg-indigo-200 transition-colors"><Minus size={20} strokeWidth={3}/></button>
                                                <span className="text-3xl font-black text-slate-800 w-12 text-center">{String(customMinutes).padStart(2, '0')}</span>
                                                <button onClick={() => adjustTime('M', 5)} className="p-2 bg-indigo-100 text-indigo-700 rounded-lg shadow-sm active:scale-95 hover:bg-indigo-200 transition-colors"><Plus size={20} strokeWidth={3}/></button>
                                            </div>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={handleManualTimerStart}
                                        className="w-full bg-indigo-500 text-white font-bold py-3 rounded-xl border-b-4 border-indigo-700 active:border-b-0 active:translate-y-1 transition-all"
                                    >
                                        AVVIA TIMER
                                    </button>
                                </div>
                            )}
                        </div>

                        {timerMinutes && (
                            <div className="mt-4 flex items-center justify-between bg-indigo-50 p-3 rounded-xl border border-indigo-100">
                                <span className="text-indigo-800 font-bold text-sm flex items-center gap-2"><Clock size={16}/> Attivo: spegnimento tra ~{timerMinutes} min</span>
                                <button onClick={() => setTimer(0)} className="text-red-500 font-black text-xs underline uppercase">Annulla</button>
                            </div>
                        )}
                    </section>

                    {/* 3. GESTIONE LINK */}
                    <section className="bg-white p-5 rounded-3xl border-2 border-slate-200 shadow-sm">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="bg-blue-100 p-2 rounded-xl text-blue-600"><ExternalLink size={24} /></div>
                            <h3 className="text-lg font-black text-slate-800">Blocco Link Esterni</h3>
                        </div>
                        <p className="text-sm text-slate-500 font-medium mb-4 leading-relaxed">
                            Se attivo, i pulsanti che portano fuori dall'app (YouTube, Social) verranno disabilitati per la sicurezza del bambino.
                        </p>
                        <button 
                            onClick={toggleLinks}
                            className={`w-full py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-3 transition-all border-b-4 active:border-b-0 active:translate-y-1 ${linksDisabled ? 'bg-green-500 text-white border-green-700' : 'bg-slate-200 text-slate-500 border-slate-300'}`}
                        >
                            {linksDisabled ? <CheckCircle /> : <X />}
                            {linksDisabled ? 'LINK ESTERNI BLOCCATI' : 'LINK ESTERNI ATTIVI'}
                        </button>
                    </section>

                    {/* 4. INFO PRIVACY & DISCLAIMER */}
                    <section className="bg-white p-5 rounded-3xl border-2 border-slate-200 shadow-sm">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="bg-green-100 p-2 rounded-xl text-green-600"><ShieldAlert size={24} /></div>
                            <h3 className="text-lg font-black text-slate-800">Privacy & Dati</h3>
                        </div>
                        <p className="text-sm text-slate-500 font-medium mb-3 leading-relaxed">
                            Lone Boo adotta una politica <strong>Zero-Data</strong>. Nessun dato personale viene inviato ai server. Foto e progressi restano sul dispositivo.
                        </p>
                        
                        <button 
                            onClick={goToDisclaimer}
                            className="w-full flex items-center justify-between bg-green-50 hover:bg-green-100 text-green-700 font-bold py-3 px-4 rounded-xl border border-green-200 transition-colors group"
                        >
                            <span className="flex items-center gap-2"><FileText size={18}/> LEGGI INFORMATIVA COMPLETA</span>
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </section>

                    {/* 5. RESET DATI */}
                    <section className="bg-red-50 p-5 rounded-3xl border-2 border-red-100 shadow-sm">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="bg-red-100 p-2 rounded-xl text-red-600"><Trash2 size={24} /></div>
                            <h3 className="text-lg font-black text-red-700">Zona Pericolo</h3>
                        </div>
                        <p className="text-sm text-red-800/70 font-medium mb-4 leading-relaxed">
                            Questa azione cancellerà <strong>tutto</strong>: gettoni, album figurine, disegni salvati e avatar. Non si può annullare.
                        </p>
                        
                        {!confirmReset ? (
                            <button 
                                onClick={() => setConfirmReset(true)}
                                className="w-full bg-white text-red-600 font-black py-3 rounded-xl border-2 border-red-200 hover:bg-red-50 transition-colors"
                            >
                                RESETTA I DATI DELL'APP
                            </button>
                        ) : (
                            <div className="flex gap-2">
                                <button 
                                    onClick={() => setConfirmReset(false)}
                                    className="flex-1 bg-gray-200 text-gray-700 font-bold py-3 rounded-xl"
                                >
                                    ANNULLA
                                </button>
                                <button 
                                    onClick={handleReset}
                                    className="flex-1 bg-red-600 text-white font-black py-3 rounded-xl border-b-4 border-red-800 active:border-b-0 active:translate-y-1"
                                >
                                    CONFERMO
                                </button>
                            </div>
                        )}
                    </section>

                </div>
            </div>
        </div>
    );
};

export default ParentalArea;

import React, { useEffect } from 'react';
import { AppView } from '../types';
import { Star, Crown, CheckCircle2, ShieldCheck } from 'lucide-react';
import { OFFICIAL_LOGO } from '../constants';

const BG_URL = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/scuola+rpimopiano.webp';
const BTN_CLOSE_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/btn-close.webp';

interface PremiumInfoPageProps {
    setView: (view: AppView) => void;
    returnView: AppView;
}

const PremiumInfoPage: React.FC<PremiumInfoPageProps> = ({ setView, returnView }) => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const textOutlineStyle = {
        WebkitTextStroke: '1px black',
        textShadow: '3px 3px 0px rgba(0,0,0,0.5)'
    };

    return (
        <div className="fixed inset-0 z-0 bg-white flex flex-col overflow-hidden pt-[64px] md:pt-[96px] animate-in fade-in duration-500">
            {/* Background Layer */}
            <img src={BG_URL} alt="" className="absolute inset-0 w-full h-full object-fill z-0 opacity-100" />
            
            {/* Strato Overlay più scuro per far risaltare il testo senza box */}
            <div className="absolute inset-0 bg-white/30 backdrop-blur-[1px] z-[1]"></div>

            {/* Header Pagina */}
            <div className="relative z-10 w-full pt-8 md:pt-12 px-6 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-4">
                    <div className="bg-yellow-400 p-3 rounded-2xl border-4 border-black shadow-lg rotate-[-3deg] animate-bounce">
                        <Crown size={32} className="text-black" />
                    </div>
                    <h2 className="text-3xl md:text-6xl font-black text-blue-900 uppercase tracking-tighter leading-none" style={{ textShadow: '4px 4px 0px rgba(255,255,255,0.8)' }}>
                        Lone Boo Premium
                    </h2>
                </div>
                <button 
                    onClick={() => setView(returnView)} 
                    className="hover:scale-110 active:scale-95 transition-all outline-none"
                >
                    <img src={BTN_CLOSE_IMG} alt="Chiudi" className="w-16 h-16 md:w-24 md:h-24 drop-shadow-xl" />
                </button>
            </div>

            {/* Contenuto Principale direttamente sullo sfondo */}
            <div className="relative z-10 flex-1 overflow-y-auto p-6 md:p-12 flex flex-col items-center">
                
                <div className="w-24 h-24 md:w-32 md:h-32 bg-yellow-400 rounded-full flex items-center justify-center mb-8 border-4 border-black shadow-xl animate-pulse">
                    <Star size={64} className="text-white fill-white" />
                </div>

                <div className="max-w-4xl space-y-8 md:space-y-12 text-center">
                    <p 
                        className="text-2xl md:text-5xl font-black text-blue-700 leading-tight uppercase tracking-tight px-4"
                        style={textOutlineStyle}
                    >
                        Con l'abbonamento Premium di Lone Boo World potrai accedere a tutte le lezioni di ogni classe e materia! 📚✨
                    </p>
                    
                    <p 
                        className="text-2xl md:text-5xl font-black text-pink-500 leading-tight uppercase tracking-tight px-4"
                        style={textOutlineStyle}
                    >
                        Inoltre avrai giochi, video e premi magici esclusivi riservati solo a te per imparare divertendoti senza limiti! 🎮👑
                    </p>
                </div>

                <div className="mt-16 w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6 px-4">
                    <div className="flex items-center gap-4 bg-white/60 backdrop-blur-md p-5 rounded-3xl border-4 border-blue-500 shadow-xl">
                        <div className="bg-blue-500 p-2 rounded-xl text-white">
                            <CheckCircle2 size={32} />
                        </div>
                        <span className="font-black text-blue-900 text-lg md:text-2xl uppercase tracking-tighter leading-none">Accesso a 5 Classi Didattiche</span>
                    </div>
                    
                    <div className="flex items-center gap-4 bg-white/60 backdrop-blur-md p-5 rounded-3xl border-4 border-green-500 shadow-xl">
                        <div className="bg-green-500 p-2 rounded-xl text-white">
                            <ShieldCheck size={32} />
                        </div>
                        <span className="font-black text-green-900 text-lg md:text-2xl uppercase tracking-tighter leading-none">Ambiente Sicuro e Senza Pubblicità</span>
                    </div>
                </div>

                <button 
                    onClick={() => setView(returnView)}
                    className="mt-16 bg-blue-600 text-white font-black px-16 py-6 rounded-full border-4 border-black shadow-[6px_6px_0_black] hover:scale-105 active:translate-y-1 active:shadow-none transition-all text-2xl md:text-4xl uppercase tracking-widest"
                >
                    OK, TORNA INDIETRO!
                </button>

                <div className="mt-20 mb-10 flex flex-col items-center opacity-80">
                    <img src={OFFICIAL_LOGO} alt="" className="w-20 h-20 mb-4 drop-shadow-lg" />
                    <p className="text-blue-900 font-black uppercase tracking-[0.3em] text-xs md:text-base" style={{ textShadow: '1px 1px 0px white' }}>
                        Lone Boo World • 2025
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PremiumInfoPage;

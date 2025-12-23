
import React, { useEffect } from 'react';
import { Info, Mail, ShieldAlert, Cpu, Tag, HelpCircle, Map, X } from 'lucide-react';
import { AppView } from '../types';
import { APP_VERSION } from '../constants';

const INFO_BG = 'https://i.postimg.cc/brjgmCV4/sfondoinfo.jpg';
const ICON_INFO = 'https://i.postimg.cc/CxyjrpqF/salvagegeg-(1).png';
const BTN_CLOSE_IMG = 'https://i.postimg.cc/0NdtYdcJ/tasto-chiudi-(1)-(1).png';
const ICON_ABOUT = 'https://i.postimg.cc/63yjTby9/chisiamo-(1).png';
const ICON_GUIDE = 'https://i.postimg.cc/CMJ5wvb6/comefunziona-(1).png';
const ICON_CONTACT = 'https://i.postimg.cc/c4Np5ZvM/contattti-(1).png';
const ICON_FAQ = 'https://i.postimg.cc/hvFt5wmp/faqw-(1).png';
const ICON_PRIVACY = 'https://i.postimg.cc/7hLmjsyy/prvcuccu-(1).png';
const ICON_TECH = 'https://i.postimg.cc/nLH7dsJW/terdfe-(1).png';

interface InfoMenuProps {
    setView: (view: AppView) => void;
}

const InfoMenu: React.FC<InfoMenuProps> = ({ setView }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div 
        className="min-h-screen bg-cover bg-center bg-fixed pb-12"
        style={{ backgroundImage: `url(${INFO_BG})` }}
    >
      
      {/* FIXED EXIT BUTTON - Slightly reduced size */}
      <button 
          onClick={() => setView(AppView.HOME)}
          className="fixed top-20 right-4 z-50 hover:scale-110 active:scale-95 transition-all outline-none"
          aria-label="Chiudi"
      >
          <img 
            src={BTN_CLOSE_IMG} 
            alt="Chiudi" 
            className="w-16 h-16 md:w-20 md:h-20 object-contain drop-shadow-2xl" 
          />
      </button>

      <div className="max-w-5xl mx-auto p-4 md:p-8 pt-20 md:pt-24 animate-fade-in">
        
        {/* Header - Titan One, White with Red Stroke */}
        <div className="text-center mb-10">
          <div className="flex flex-row items-center justify-center gap-4 md:gap-6 mb-6">
            <img 
                src={ICON_INFO} 
                alt="" 
                className="w-16 h-16 md:w-28 md:h-28 object-contain drop-shadow-lg" 
            />
            <h2 
                className="text-4xl md:text-7xl font-cartoon text-white tracking-tight leading-none"
                style={{ WebkitTextStroke: '2px #ef4444', textShadow: '4px 4px 0px rgba(0,0,0,0.2)' }}
            >
               Centro Info
            </h2>
          </div>
          <div className="inline-block bg-white/70 backdrop-blur-md px-6 py-2 rounded-full border-2 border-black/20 shadow-md">
              <p className="text-lg font-black text-gray-800">
                  Tutto quello che c'è da sapere sul mondo di Lone Boo!
              </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-12">
            
            {/* 1. GUIDA APP - Translucent Box */}
            <button 
              onClick={() => setView(AppView.GUIDE)}
              className="group bg-white/70 backdrop-blur-md p-6 rounded-[24px] border-2 border-white/40 shadow-lg hover:shadow-2xl transition-all text-left flex items-start gap-5 active:scale-[0.99]"
            >
                <img 
                    src={ICON_GUIDE} 
                    alt="Come Funziona" 
                    className="w-16 h-16 md:w-20 md:h-20 object-contain group-hover:scale-110 transition-transform drop-shadow-md" 
                />
                <div>
                    <h3 className="text-2xl font-black text-green-800 mb-1 group-hover:text-green-600 transition-colors tracking-tight">Come Funziona</h3>
                    <p className="text-sm font-bold text-gray-600 leading-relaxed">
                        Guida all'avventura! Scopri come esplorare la Città, la Casa e i Giochi.
                    </p>
                </div>
            </button>

            {/* 2. FAQ - Translucent Box */}
            <button 
              onClick={() => setView(AppView.FAQ)}
              className="group bg-white/70 backdrop-blur-md p-6 rounded-[24px] border-2 border-white/40 shadow-lg hover:shadow-2xl transition-all text-left flex items-start gap-5 active:scale-[0.99]"
            >
                <img 
                    src={ICON_FAQ} 
                    alt="FAQ" 
                    className="w-16 h-16 md:w-20 md:h-20 object-contain group-hover:scale-110 transition-transform drop-shadow-md" 
                />
                <div>
                    <h3 className="text-2xl font-black text-cyan-800 mb-1 group-hover:text-cyan-600 transition-colors tracking-tight">Domande (FAQ)</h3>
                    <p className="text-sm font-bold text-gray-600 leading-relaxed">
                        Risposte alle domande più frequenti su Lone Boo e i contenuti.
                    </p>
                </div>
            </button>

            {/* 3. CHI SIAMO - Translucent Box */}
            <button 
              onClick={() => setView(AppView.ABOUT)}
              className="group bg-white/70 backdrop-blur-md p-6 rounded-[24px] border-2 border-white/40 shadow-lg hover:shadow-2xl transition-all text-left flex items-start gap-5 active:scale-[0.99]"
            >
                <img 
                    src={ICON_ABOUT} 
                    alt="Chi Siamo" 
                    className="w-16 h-16 md:w-20 md:h-20 object-contain group-hover:scale-110 transition-transform drop-shadow-md" 
                />
                <div>
                    <h3 className="text-2xl font-black text-yellow-700 mb-1 group-hover:text-yellow-600 transition-colors tracking-tight">Chi Siamo</h3>
                    <p className="text-sm font-bold text-gray-600 leading-relaxed">
                        La storia del progetto, la missione educativa e il mondo di Città Colorata.
                    </p>
                </div>
            </button>

            {/* 4. CONTATTI - Translucent Box */}
            <button 
              onClick={() => setView(AppView.CONTACT)}
              className="group bg-white/70 backdrop-blur-md p-6 rounded-[24px] border-2 border-white/40 shadow-lg hover:shadow-2xl transition-all text-left flex items-start gap-5 active:scale-[0.99]"
            >
                <img 
                    src={ICON_CONTACT} 
                    alt="Contatti" 
                    className="w-16 h-16 md:w-20 md:h-20 object-contain group-hover:scale-110 transition-transform drop-shadow-md" 
                />
                <div>
                    <h3 className="text-2xl font-black text-blue-800 mb-1 group-hover:text-blue-600 transition-colors tracking-tight">Contatti</h3>
                    <p className="text-sm font-bold text-gray-600 leading-relaxed">
                        Hai bisogno di aiuto o vuoi collaborare? Scrivici!
                    </p>
                </div>
            </button>

            {/* 5. DISCLAIMER - Translucent Box */}
            <button 
              onClick={() => setView(AppView.DISCLAIMER)}
              className="group bg-white/70 backdrop-blur-md p-6 rounded-[24px] border-2 border-white/40 shadow-lg hover:shadow-2xl transition-all text-left flex items-start gap-5 active:scale-[0.99]"
            >
                <img 
                    src={ICON_PRIVACY} 
                    alt="Privacy" 
                    className="w-16 h-16 md:w-20 md:h-20 object-contain group-hover:scale-110 transition-transform drop-shadow-md" 
                />
                <div>
                    <h3 className="text-2xl font-black text-red-800 mb-1 group-hover:text-red-600 transition-colors tracking-tight">Disclaimer & Privacy</h3>
                    <p className="text-sm font-bold text-gray-600 leading-relaxed">
                        Informazioni legali, privacy policy e termini di utilizzo dell'app.
                    </p>
                </div>
            </button>

            {/* 6. INFO TECNICHE - Translucent Box */}
            <button 
              onClick={() => setView(AppView.TECH_INFO)}
              className="group bg-white/70 backdrop-blur-md p-6 rounded-[24px] border-2 border-white/40 shadow-lg hover:shadow-2xl transition-all text-left flex items-start gap-5 active:scale-[0.99]"
            >
                <img 
                    src={ICON_TECH} 
                    alt="Tecnologia" 
                    className="w-16 h-16 md:w-20 md:h-20 object-contain group-hover:scale-110 transition-transform drop-shadow-md" 
                />
                <div>
                    <h3 className="text-2xl font-black text-purple-800 mb-1 group-hover:text-purple-600 transition-colors tracking-tight">Tecnologia</h3>
                    <p className="text-sm font-bold text-gray-600 leading-relaxed">
                        Come è stata costruita l'app? Dettagli tecnici per i più curiosi.
                    </p>
                </div>
            </button>

        </div>

        {/* VERSION BADGE & COPYRIGHT */}
        <div className="flex flex-col items-center justify-center gap-2">
            <div className="bg-black/60 backdrop-blur-md px-4 py-1 rounded-full border border-white/20 flex items-center gap-2 text-xs font-mono text-white shadow-lg">
                <Tag size={12} />
                <span>v.{APP_VERSION}</span>
            </div>
            <p className="text-white text-[10px] font-black text-center drop-shadow-md bg-black/40 px-3 py-1 rounded-full">
                © 2025 LoneBoo.online. Fatto con ❤️ e 👻
            </p>
        </div>

      </div>
    </div>
  );
};

export default InfoMenu;

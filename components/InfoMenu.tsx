import React, { useEffect } from 'react';
import { Tag } from 'lucide-react';
import { AppView } from '../types';
import { APP_VERSION } from '../constants';

const ICON_INFO = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/icon-info.webp';
const BTN_CLOSE_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/btn-close.webp';
const ICON_ABOUT = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/chisiamdhe44fr44rf.webp';
const ICON_GUIDE = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/igliglg1454.webp';
const ICON_CONTACT = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/contattir775hxd3ws.webp';
const ICON_FAQ = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/domanfaqsw33w2.webp';
const ICON_PRIVACY = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/prvoce7xbd3dwj.webp';
const ICON_TECH = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/tencifje5433i3kxow.webp';

interface InfoMenuProps {
    setView: (view: AppView) => void;
}

const InfoMenu: React.FC<InfoMenuProps> = ({ setView }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="fixed inset-0 z-0 overflow-y-auto no-scrollbar">
      {/* SFONDO AZZURRO INTENSO E FISSO */}
      <div className="fixed inset-0 bg-[#bae6fd] z-0"></div>
      
      {/* STRATO EFFETTO SPECCHIO/VETRO */}
      <div className="fixed inset-0 bg-white/20 backdrop-blur-[45px] z-[1] pointer-events-none border-t-8 border-white/30"></div>
      
      {/* FIXED EXIT BUTTON */}
      <button 
          onClick={() => setView(AppView.HOME)}
          className="fixed top-20 right-4 z-[100] hover:scale-110 active:scale-95 transition-all outline-none"
          aria-label="Chiudi"
      >
          <img 
            src={BTN_CLOSE_IMG} 
            alt="Chiudi" 
            className="w-16 h-16 md:w-20 md:h-20 object-contain drop-shadow-2xl" 
          />
      </button>

      {/* CONTENUTO - Scrollabile grazie al genitore fixed overflow-y-auto */}
      <div className="relative z-10 max-w-5xl mx-auto p-4 md:p-8 pt-24 md:pt-32 pb-32">
        
        {/* Header - Stile Rosso/Bianco */}
        <div className="text-center mb-12">
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 mb-6">
            <img 
                src={ICON_INFO} 
                alt="" 
                className="w-24 h-24 md:w-36 md:h-36 object-contain drop-shadow-2xl" 
            />
            <h2 
                className="text-5xl md:text-8xl font-cartoon text-[#ef4444] tracking-tight leading-none"
                style={{ 
                    WebkitTextStroke: '2px white', 
                    textShadow: '8px 8px 0px rgba(0,0,0,0.1)',
                }}
            >
               Centro Info
            </h2>
          </div>
          <div className="inline-block bg-white/80 border-4 border-white px-8 py-3 rounded-full shadow-[0_10px_20px_rgba(0,0,0,0.05)] transform -rotate-1">
              <p className="text-lg md:text-xl font-black text-slate-600 uppercase tracking-tighter">
                  Benvenuti nel quartier generale di Lone Boo! 👻
              </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-16">
            <button 
              onClick={() => setView(AppView.GUIDE)}
              className="group bg-white/50 backdrop-blur-md p-6 md:p-8 rounded-[40px] border-4 border-white shadow-xl hover:bg-white/70 transition-all text-left flex items-start gap-6 active:scale-[0.98]"
            >
                <img src={ICON_GUIDE} alt="Guida" className="w-20 h-20 md:w-24 md:h-24 object-contain group-hover:scale-110 transition-transform drop-shadow-lg" />
                <div>
                    <h3 className="text-2xl md:text-3xl font-black text-slate-800 mb-2 group-hover:text-blue-600 transition-colors tracking-tight">Come Funziona</h3>
                    <p className="text-sm md:text-base font-bold text-slate-500 leading-tight">Guida all'avventura! Scopri come esplorare la Città, la Casa e i Giochi.</p>
                </div>
            </button>

            <button 
              onClick={() => setView(AppView.FAQ)}
              className="group bg-white/50 backdrop-blur-md p-6 md:p-8 rounded-[40px] border-4 border-white shadow-xl hover:bg-white/70 transition-all text-left flex items-start gap-6 active:scale-[0.98]"
            >
                <img src={ICON_FAQ} alt="FAQ" className="w-20 h-20 md:w-24 md:h-24 object-contain group-hover:scale-110 transition-transform drop-shadow-lg" />
                <div>
                    <h3 className="text-2xl md:text-3xl font-black text-slate-800 mb-2 group-hover:text-cyan-600 transition-colors tracking-tight">Domande (FAQ)</h3>
                    <p className="text-sm md:text-base font-bold text-slate-500 leading-tight">Risposte alle domande più frequenti su Lone Boo e i contenuti.</p>
                </div>
            </button>

            <button 
              onClick={() => setView(AppView.ABOUT)}
              className="group bg-white/50 backdrop-blur-md p-6 md:p-8 rounded-[40px] border-4 border-white shadow-xl hover:bg-white/70 transition-all text-left flex items-start gap-6 active:scale-[0.98]"
            >
                <img src={ICON_ABOUT} alt="About" className="w-20 h-20 md:w-24 md:h-24 object-contain group-hover:scale-110 transition-transform drop-shadow-lg" />
                <div>
                    <h3 className="text-2xl md:text-3xl font-black text-slate-800 mb-2 group-hover:text-yellow-600 transition-colors tracking-tight">Chi Siamo</h3>
                    <p className="text-sm md:text-base font-bold text-slate-500 leading-tight">La storia del progetto, la missione educativa e il mondo di Città Colorata.</p>
                </div>
            </button>

            <button 
              onClick={() => setView(AppView.CONTACT)}
              className="group bg-white/50 backdrop-blur-md p-6 md:p-8 rounded-[40px] border-4 border-white shadow-xl hover:bg-white/70 transition-all text-left flex items-start gap-6 active:scale-[0.98]"
            >
                <img src={ICON_CONTACT} alt="Contatti" className="w-20 h-20 md:w-24 md:h-24 object-contain group-hover:scale-110 transition-transform drop-shadow-lg" />
                <div>
                    <h3 className="text-2xl md:text-3xl font-black text-slate-800 mb-2 group-hover:text-blue-500 transition-colors tracking-tight">Contatti</h3>
                    <p className="text-sm md:text-base font-bold text-slate-500 leading-tight">Hai bisogno di aiuto o vuoi collaborare? Scrivici subito!</p>
                </div>
            </button>

            <button 
              onClick={() => setView(AppView.DISCLAIMER)}
              className="group bg-white/50 backdrop-blur-md p-6 md:p-8 rounded-[40px] border-4 border-white shadow-xl hover:bg-white/70 transition-all text-left flex items-start gap-6 active:scale-[0.98]"
            >
                <img src={ICON_PRIVACY} alt="Privacy" className="w-20 h-20 md:w-24 md:h-24 object-contain group-hover:scale-110 transition-transform drop-shadow-lg" />
                <div>
                    <h3 className="text-2xl md:text-3xl font-black text-slate-800 mb-2 group-hover:text-red-500 transition-colors tracking-tight">Privacy Policy</h3>
                    <p className="text-sm md:text-base font-bold text-slate-500 leading-tight">Informazioni legali, privacy policy e termini di utilizzo dell'app.</p>
                </div>
            </button>

            <button 
              onClick={() => setView(AppView.TECH_INFO)}
              className="group bg-white/50 backdrop-blur-md p-6 md:p-8 rounded-[40px] border-4 border-white shadow-xl hover:bg-white/70 transition-all text-left flex items-start gap-6 active:scale-[0.98]"
            >
                <img src={ICON_TECH} alt="Tech" className="w-20 h-20 md:w-24 md:h-24 object-contain group-hover:scale-110 transition-transform drop-shadow-lg" />
                <div>
                    <h3 className="text-2xl md:text-3xl font-black text-slate-800 mb-2 group-hover:text-purple-600 transition-colors tracking-tight">Tecnologia</h3>
                    <p className="text-sm md:text-base font-bold text-slate-500 leading-tight">Come è stata costruita l'app? Dettagli tecnici per i più curiosi.</p>
                </div>
            </button>
        </div>

        <div className="flex flex-col items-center justify-center gap-4 mt-8 pb-12">
            <div className="bg-slate-800 px-6 py-2 rounded-full border-2 border-slate-600 flex items-center gap-3 text-sm font-mono text-white shadow-xl">
                <Tag size={16} className="text-yellow-400" />
                <span className="font-black">VERSIONE {APP_VERSION}</span>
            </div>
            <p className="text-slate-500 font-black text-center uppercase tracking-widest text-[10px]">
                © 2025 LoneBoo.online • IL TUO MONDO MAGICO 👻
            </p>
        </div>
      </div>
    </div>
  );
};

export default InfoMenu;
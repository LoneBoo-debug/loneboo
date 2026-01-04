
import React, { useEffect } from 'react';
import { 
  Globe, Code, BrainCircuit, Server, Gamepad2, 
  X, Zap, ShieldCheck, Cpu, Database, 
  QrCode, Layers, Monitor, Heart
} from 'lucide-react';
import { AppView } from '../types';

const BTN_CLOSE_IMG = 'https://i.postimg.cc/0NdtYdcJ/tasto-chiudi-(1)-(1).png';
const ICON_TECH = 'https://i.postimg.cc/nLH7dsJW/terdfe-(1).png';

interface TechInfoPageProps {
    setView: (view: AppView) => void;
}

const TechInfoPage: React.FC<TechInfoPageProps> = ({ setView }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      
      {/* SFONDO AZZURRO INTENSO E FISSO */}
      <div className="fixed inset-0 bg-[#bae6fd] z-0"></div>
      
      {/* STRATO EFFETTO SPECCHIO/VETRO */}
      <div className="fixed inset-0 bg-white/20 backdrop-blur-[45px] z-[1] pointer-events-none border-t-8 border-white/30"></div>
      
      {/* TASTO CHIUDI FISSO */}
      <button 
          onClick={() => setView(AppView.INFO_MENU)}
          className="fixed top-20 right-4 z-[100] hover:scale-110 active:scale-95 transition-all outline-none"
          aria-label="Chiudi"
      >
          <img src={BTN_CLOSE_IMG} alt="Chiudi" className="w-16 h-16 md:w-20 md:h-20 object-contain drop-shadow-2xl" />
      </button>

      {/* CONTENUTO SCROLLABILE */}
      <div className="relative z-10 max-w-6xl mx-auto p-4 md:p-6 pt-32 md:pt-40 animate-fade-in pb-24">
        
        {/* Intestazione Principale Compatta */}
        <div className="text-center mb-10">
            <h2 
                className="text-4xl md:text-6xl font-cartoon text-[#ef4444] tracking-tight leading-none"
                style={{ 
                    WebkitTextStroke: '1.5px white', 
                    textShadow: '6px 6px 0px rgba(0,0,0,0.1)',
                }}
            >
               Tecnologia
            </h2>
            <div className="inline-block bg-white/80 border-4 border-white px-6 py-1 rounded-full shadow-md mt-3">
                <p className="text-xs md:text-sm font-black text-blue-600 uppercase tracking-tighter flex items-center gap-2">
                    <Cpu size={16} /> Architettura & Ingegneria
                </p>
            </div>
        </div>

        {/* GRIGLIA COMPATTA BENTO-STYLE */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            
            {/* 1. PWA & SPA */}
            <div className="bg-white/50 backdrop-blur-md p-5 rounded-[30px] border-4 border-white shadow-lg flex flex-col">
                <div className="flex items-center gap-3 mb-3 border-b-2 border-white/50 pb-2">
                    <Globe className="text-blue-500" size={24} />
                    <h3 className="text-lg font-black text-slate-800 uppercase leading-none">PWA & SPA</h3>
                </div>
                <p className="text-sm font-bold text-slate-700 leading-relaxed">
                    Lone Boo è una <strong>Single Page Application (SPA)</strong> sviluppata con React 19. Carica dinamicamente i contenuti garantendo fluidità assoluta. 
                    <br/><br/>
                    Come <strong>PWA (Progressive Web App)</strong>, utilizza Service Workers per il caching aggressivo delle immagini, permettendo tempi di caricamento quasi istantanei.
                </p>
            </div>

            {/* 2. REACT 19 & TYPESCRIPT */}
            <div className="bg-white/50 backdrop-blur-md p-5 rounded-[30px] border-4 border-white shadow-lg flex flex-col md:col-span-1 lg:col-span-2">
                <div className="flex items-center gap-3 mb-3 border-b-2 border-white/50 pb-2">
                    <Code className="text-purple-600" size={24} />
                    <h3 className="text-lg font-black text-slate-800 uppercase leading-none">React 19 & TypeScript 5</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <span className="flex items-center gap-2 font-black text-purple-700 text-xs mb-1 uppercase tracking-tighter">Performance</span>
                        <p className="text-[11px] font-bold text-slate-600 leading-tight">Sfruttiamo il lazy loading dei componenti per ridurre il peso del bundle. Vite garantisce una compilazione ottimizzata.</p>
                    </div>
                    <div>
                        <span className="flex items-center gap-2 font-black text-purple-700 text-xs mb-1 uppercase tracking-tighter">Sicurezza del Codice</span>
                        <p className="text-[11px] font-bold text-slate-600 leading-tight">Scritto interamente in TypeScript per validare rigidamente ogni dato (progressi, coordinate) e prevenire crash.</p>
                    </div>
                </div>
            </div>

            {/* 3. GEMINI AI & SPEECH */}
            <div className="bg-white/50 backdrop-blur-md p-5 rounded-[30px] border-4 border-white shadow-lg flex flex-col md:col-span-2">
                <div className="flex items-center gap-3 mb-3 border-b-2 border-white/50 pb-2">
                    <BrainCircuit className="text-pink-600" size={24} />
                    <h3 className="text-lg font-black text-slate-800 uppercase leading-none">Gemini AI & Speech Synthesis</h3>
                </div>
                <div className="space-y-4">
                    <div className="flex gap-4">
                        <div className="bg-pink-100 p-2 rounded-xl shrink-0 h-10 w-10 flex items-center justify-center text-pink-600"><Zap size={20}/></div>
                        <div>
                            <span className="font-black text-slate-800 text-xs uppercase block">Web Speech API</span>
                            <p className="text-[11px] font-bold text-slate-600">Sintesi vocale nativa per la chat interattiva: Boo parla in tempo reale senza latenza e gratuitamente.</p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div className="bg-pink-100 p-2 rounded-xl shrink-0 h-10 w-10 flex items-center justify-center text-pink-600"><ShieldCheck size={20}/></div>
                        <div>
                            <span className="font-black text-slate-800 text-xs uppercase block">Vision Intelligence</span>
                            <p className="text-[11px] font-bold text-slate-600">La Caccia al Tesoro usa Google Gemini Flash 2.5 per analizzare le foto in totale privacy (elaborazione stateless).</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* 4. INTEGRAZIONI SERVERLESS */}
            <div className="bg-white/50 backdrop-blur-md p-5 rounded-[30px] border-4 border-white shadow-lg">
                <div className="flex items-center gap-3 mb-3 border-b-2 border-white/50 pb-2">
                    <Server className="text-orange-600" size={24} />
                    <h3 className="text-lg font-black text-slate-800 uppercase leading-none">Serverless</h3>
                </div>
                <div className="space-y-3">
                    <div>
                        <span className="font-black text-orange-700 text-[10px] uppercase block mb-0.5">Resend API</span>
                        <p className="text-[11px] font-bold text-slate-600">Le Fan Art sono inviate tramite Edge Functions criptate: massima sicurezza, zero server SMTP.</p>
                    </div>
                    <div>
                        <span className="font-black text-orange-700 text-[10px] uppercase block mb-0.5">Static DBs</span>
                        <p className="text-[11px] font-bold text-slate-600">Fiabe, dadi e figurine in database JSON locali: velocissimo anche con connessioni lente.</p>
                    </div>
                </div>
            </div>

            {/* 5. GAME ENGINE & INTERACTIVE CANVAS */}
            <div className="bg-white/50 backdrop-blur-md p-5 rounded-[30px] border-4 border-white shadow-lg md:col-span-3">
                <div className="flex items-center gap-3 mb-4 border-b-2 border-white/50 pb-2">
                    <Gamepad2 className="text-green-600" size={24} />
                    <h3 className="text-lg font-black text-slate-800 uppercase leading-none">Game Engine & Interactive Canvas</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex gap-3">
                        <div className="bg-green-100 p-2 rounded-xl shrink-0 h-10 w-10 flex items-center justify-center text-green-600"><Layers size={20}/></div>
                        <div>
                            <span className="font-black text-slate-800 text-xs uppercase block">Polygon Mapping</span>
                            <p className="text-[11px] font-bold text-slate-600">Stanze e città utilizzano mappature vettoriali percentuali per restare interattive su ogni risoluzione.</p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <div className="bg-green-100 p-2 rounded-xl shrink-0 h-10 w-10 flex items-center justify-center text-green-600"><Monitor size={20}/></div>
                        <div>
                            <span className="font-black text-slate-800 text-xs uppercase block">Arcade Sandboxing</span>
                            <p className="text-[11px] font-bold text-slate-600">Giochi esterni in iframe protetti con politiche di sandbox: ambiente sicuro al 100% per i bambini.</p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <div className="bg-green-100 p-2 rounded-xl shrink-0 h-10 w-10 flex items-center justify-center text-green-600"><QrCode size={20}/></div>
                        <div>
                            <span className="font-black text-slate-800 text-xs uppercase block">QR Data Transfer</span>
                            <p className="text-[11px] font-bold text-slate-600">Algoritmo jsQR per trasferire progressi (gettoni/figurine) tramite scansione immagine, senza bisogno di account.</p>
                        </div>
                    </div>
                </div>
            </div>

        </div>

        <div className="flex flex-col items-center pb-12 mt-8 opacity-70">
            <Heart size={32} className="text-red-500 fill-red-500 mb-2 animate-pulse" />
            <p className="text-lg font-black text-slate-600 uppercase tracking-tighter text-center">Tecnologia al servizio del sorriso! 👻</p>
        </div>

      </div>
    </div>
  );
};

export default TechInfoPage;

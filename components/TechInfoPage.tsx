import React, { useEffect } from 'react';
import { Cpu, ScanFace, Code, Database, Globe, Lock, QrCode, BrainCircuit, Accessibility, X, Layers, Smartphone, Server, ServerOff, Mail, Volume2, Gamepad2 } from 'lucide-react';
import { AppView } from '../types';
import { APP_VERSION } from '../constants';

const INFO_BG = 'https://i.postimg.cc/brjgmCV4/sfondoinfo.jpg';
const BTN_CLOSE_IMG = 'https://i.postimg.cc/0NdtYdcJ/tasto-chiudi-(1)-(1).png';
const ICON_TECH = 'https://i.postimg.cc/nLH7dsJW/terdfe-(1).png';

interface TechInfoPageProps {
    setView: (view: AppView) => void;
}

const TechInfoPage: React.FC<TechInfoPageProps> = ({ setView }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleExit = () => setView(AppView.INFO_MENU);

  return (
    <div 
        className="min-h-screen bg-cover bg-center bg-fixed pb-24"
        style={{ backgroundImage: `url(${INFO_BG})` }}
    >
      
      {/* FIXED EXIT BUTTON */}
      <button 
          onClick={handleExit}
          className="fixed top-20 right-4 z-50 hover:scale-110 active:scale-95 transition-all outline-none"
          aria-label="Indietro"
      >
          <img 
            src={BTN_CLOSE_IMG} 
            alt="Chiudi" 
            className="w-16 h-16 md:w-20 md:h-20 object-contain drop-shadow-2xl" 
          />
      </button>

      <div className="max-w-5xl mx-auto p-4 md:p-8 pt-32 animate-fade-in">

          {/* Header - Unified Style */}
          <div className="text-center mb-12">
            <h2 
                className="text-4xl md:text-7xl font-cartoon text-white tracking-tight leading-none mb-3"
                style={{ WebkitTextStroke: '2px #ef4444', textShadow: '4px 4px 0px rgba(0,0,0,0.2)' }}
            >
               Tecnologia
            </h2>
            <div className="inline-flex items-center gap-2 bg-purple-600/80 text-white px-6 py-2 rounded-full text-sm font-bold backdrop-blur-md border border-white/20 shadow-lg">
                 <img src={ICON_TECH} alt="" className="w-8 h-8 object-contain" />
                 <span>Architettura & Ingegneria</span>
            </div>
          </div>

          <div className="space-y-8">

            {/* 1. OVERVIEW */}
            <div className="bg-white/70 backdrop-blur-md rounded-[30px] border-l-[8px] border-purple-600 p-6 md:p-8 shadow-xl border-y border-r border-white/30">
               <h3 className="text-2xl font-black text-purple-900 mb-4 flex items-center gap-3">
                   <Globe className="text-purple-600" size={32} /> 
                   PWA & Single Page Application
               </h3>
               <p className="text-gray-700 font-bold text-base leading-relaxed mb-4">
                   Lone Boo è una <strong>Single Page Application (SPA)</strong> sviluppata con React 19. Carica dinamicamente i contenuti garantendo fluidità assoluta.
               </p>
               <p className="text-gray-700 font-bold text-base leading-relaxed">
                   Come <strong>PWA (Progressive Web App)</strong>, può essere installata sulla home del dispositivo e utilizza i Service Workers per il caching aggressivo delle immagini, permettendo tempi di caricamento quasi istantanei.
               </p>
            </div>

            {/* 2. CORE STACK */}
            <div className="bg-white/70 backdrop-blur-md rounded-[30px] border-l-[8px] border-blue-500 p-6 md:p-8 shadow-xl border-y border-r border-white/30">
                <h3 className="text-2xl font-black text-blue-900 mb-4 flex items-center gap-3">
                    <Code className="text-blue-600" size={32} />
                    React 19 & TypeScript 5
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <h4 className="text-lg font-black text-blue-700 mb-2">Performance</h4>
                        <p className="text-gray-600 text-sm font-black leading-relaxed">
                            Sfruttiamo <strong>React 19</strong> e il lazy loading dei componenti per ridurre il peso del bundle iniziale. L'uso di <strong>Vite</strong> garantisce una compilazione ottimizzata per il web moderno.
                        </p>
                    </div>
                    <div>
                        <h4 className="text-lg font-black text-blue-700 mb-2">Sicurezza del Codice</h4>
                        <p className="text-gray-600 text-sm font-black leading-relaxed">
                            L'intero progetto è scritto in <strong>TypeScript</strong>. Questo assicura che ogni dato (come i progressi dell'album o le coordinate dei dadi) sia validato rigidamente, prevenendo crash imprevisti.
                        </p>
                    </div>
                </div>
            </div>

            {/* 3. AI & AUDIO */}
            <div className="bg-white/70 backdrop-blur-md rounded-[30px] border-l-[8px] border-orange-500 p-6 md:p-8 shadow-xl border-y border-r border-white/30">
                <h3 className="text-2xl font-black text-orange-900 mb-4 flex items-center gap-3">
                    <BrainCircuit className="text-orange-600" size={32} />
                    Gemini AI & Speech Synthesis
                </h3>
                <p className="text-gray-700 font-bold text-sm leading-relaxed mb-4">
                    L'app integra i modelli <strong>Google Gemini Flash 2.5</strong> per la narrazione e la visione.
                </p>
                <ul className="space-y-3">
                    <li className="flex gap-3">
                        <div className="bg-orange-100 p-2 rounded-lg h-min text-orange-600"><Volume2 size={20} /></div>
                        <div>
                            <span className="block font-black text-gray-800 text-sm">Web Speech API</span>
                            <span className="text-gray-600 text-xs font-black">Utilizziamo la sintesi vocale nativa del browser per la chat interattiva. Questo permette a Boo di parlare in tempo reale senza latenza e in modo completamente gratuito per l'utente.</span>
                        </div>
                    </li>
                    <li className="flex gap-3">
                        <div className="bg-orange-100 p-2 rounded-lg h-min text-orange-600"><ScanFace size={20} /></div>
                        <div>
                            <span className="block font-black text-gray-800 text-sm">Vision Intelligence</span>
                            <span className="text-gray-600 text-xs font-black">La Caccia al Tesoro utilizza le capacità multimodali di Gemini per analizzare le foto scattate dai bambini in totale privacy (elaborazione stateless).</span>
                        </div>
                    </li>
                </ul>
            </div>

            {/* 4. SERVERLESS & DATA */}
            <div className="bg-white/70 backdrop-blur-md rounded-[30px] border-l-[8px] border-green-500 p-6 md:p-8 shadow-xl border-y border-r border-white/30">
                <h3 className="text-2xl font-black text-green-900 mb-4 flex items-center gap-3">
                    <Server className="text-green-600" size={32} />
                    Integrazioni Serverless
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-green-100/50 p-4 rounded-2xl border border-green-300">
                        <h4 className="font-black text-green-800 mb-1 flex items-center gap-2"><Mail size={16}/> Resend API</h4>
                        <p className="text-xs text-gray-800 font-black">
                            L'invio delle Fan Art avviene tramite una <strong>Edge Function</strong> che comunica con Resend. Questo garantisce sicurezza massima: l'app non gestisce server SMTP e le email sono criptate.
                        </p>
                    </div>
                    <div className="bg-green-100/50 p-4 rounded-2xl border border-green-300">
                        <h4 className="font-black text-green-800 mb-1 flex items-center gap-2"><Database size={16}/> Static DBs</h4>
                        <p className="text-xs text-gray-800 font-black">
                            Dati come le fiabe, i dadi e le figurine sono strutturati in database statici JSON locali. Questo elimina le query al server, rendendo l'app veloce anche con connessioni lente.
                        </p>
                    </div>
                </div>
            </div>

            {/* 5. GIOCHI & CANVAS */}
            <div className="bg-white/70 backdrop-blur-md rounded-[30px] border-l-[8px] border-cyan-500 p-6 md:p-8 shadow-xl border-y border-r border-white/30">
                <h3 className="text-2xl font-black text-cyan-900 mb-4 flex items-center gap-3">
                    <Gamepad2 className="text-cyan-600" size={32} />
                    Game Engine & Interactive Canvas
                </h3>
                <ul className="list-disc pl-5 text-gray-700 text-sm space-y-2 font-black">
                    <li>
                        <strong>Polygon Mapping:</strong> Le stanze della casa e la città utilizzano mappature vettoriali percentuali per rendere interattiva ogni area su ogni risoluzione.
                    </li>
                    <li>
                        <strong>Arcade Sandboxing:</strong> I giochi esterni sono integrati tramite iframe protetti con politiche di sandboxing per garantire che il bambino non esca mai dall'ambiente sicuro.
                    </li>
                    <li>
                        <strong>QR Data Transfer:</strong> Usiamo l'algoritmo jsQR per permettere agli utenti di trasferire i progressi (gettoni e figurine) tramite una semplice scansione d'immagine, senza bisogno di account.
                    </li>
                </ul>
            </div>

          </div>

          <div className="mt-12 text-center opacity-70">
              <p className="text-white text-xs font-mono">
                  Build: {new Date().getFullYear()}.{APP_VERSION} | Environment: Vercel Production
              </p>
          </div>

      </div>
    </div>
  );
};

export default TechInfoPage;
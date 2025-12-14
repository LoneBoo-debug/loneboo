
import React, { useEffect } from 'react';
import { Mail, ArrowLeft, Cpu, Layers, ScanFace, Code, Database, Globe, Lock, QrCode, BrainCircuit, ShieldCheck } from 'lucide-react';
import { AppView } from '../types';

interface TechInfoPageProps {
    setView: (view: AppView) => void;
}

const TechInfoPage: React.FC<TechInfoPageProps> = ({ setView }) => {
  // Ensure the page starts at the top when opened
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 animate-fade-in pb-24">
      
      {/* Header */}
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-5xl font-black text-boo-orange mb-2" style={{ textShadow: "3px 3px 0px black" }}>
           Relazione Tecnica
        </h2>
        <div className="inline-flex items-center gap-2 bg-black/20 text-white px-4 py-1 rounded-full text-sm font-bold backdrop-blur-sm">
             <Cpu size={16} />
             <span>Architecture & Engineering</span>
        </div>
      </div>

      {/* Content Card */}
      <div className="bg-white rounded-[30px] border-4 border-black p-6 md:p-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)] text-gray-800 leading-relaxed font-sans">
        
        <div className="mb-8 pb-4 border-b-2 border-gray-100">
             <h3 className="text-xl font-black text-boo-purple mb-2">🚀 OVERVIEW DEL PROGETTO</h3>
             <p className="text-gray-600 font-medium">
                 Lone Boo è una <strong>Single Page Application (SPA)</strong> ad alte prestazioni. L'architettura è stata progettata su misura per garantire fluidità, sicurezza e scalabilità, integrando tecnologie di frontiera (GenAI, Computer Vision) in un'interfaccia a misura di bambino.
             </p>
        </div>

        {/* --- 1. INTEGRAZIONE AI (GEMINI) --- */}
        <section className="mb-10 bg-purple-50 p-6 rounded-2xl border-l-8 border-purple-500">
            <h4 className="text-xl font-black text-purple-800 mb-4 flex items-center gap-2">
                <BrainCircuit size={24} /> 1. Cuore AI: Google Gemini & Integrazione Proprietaria
            </h4>
            <p className="text-gray-600 mb-3 text-sm">
                L'intelligenza dell'app non è una semplice "chat", ma un sistema ingegnerizzato basato sui modelli <strong>Google Gemini Flash 2.5</strong>, ottimizzati per bassa latenza e sicurezza.
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-3 font-medium text-sm">
                <li>
                    <strong>Integrazione Proprietaria "Safety First":</strong> Non utilizziamo le API standard in modo diretto. Abbiamo costruito un <em>layer intermedio proprietario</em> di "System Prompts" (istruzioni di sistema) che agisce come un filtro invalicabile. Questo layer istruisce l'AI a comportarsi esclusivamente come il personaggio "Lone Boo", bloccando output non adatti ai bambini prima ancora che vengano generati.
                </li>
                <li>
                    <strong>Multimodalità Nativa:</strong> Nella "Torre Magica", l'AI non "legge" solo il testo, ma "vede" attraverso la fotocamera (Vision Capabilities). Il sistema analizza le immagini inviate dai bambini (es. nella Caccia al Tesoro) e le interpreta in tempo reale senza mai salvarle su server remoti.
                </li>
                <li>
                    <strong>Neural Text-to-Speech (TTS):</strong> Utilizziamo modelli neurali avanzati per generare la voce di Boo in tempo reale, garantendo un'intonazione empatica e naturale, lontana dalle voci robotiche standard.
                </li>
            </ul>
        </section>

        {/* --- 2. PERSISTENZA & CRITTOGRAFIA --- */}
        <section className="mb-10 bg-green-50 p-6 rounded-2xl border-l-8 border-green-500">
            <h4 className="text-xl font-black text-green-800 mb-4 flex items-center gap-2">
                <QrCode size={24} /> 2. Persistenza "Zero-Server" & Passaporto Digitale
            </h4>
            <p className="text-gray-600 mb-3 text-sm">
                Abbiamo implementato un sistema di salvataggio radicale che elimina la necessità di database remoti per la gestione dei progressi utente, massimizzando la privacy.
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-3 font-medium text-sm">
                <li>
                    <strong>Codifica Binaria Proprietaria:</strong> Lo stato del giocatore (token, figurine sbloccate, configurazione avatar) viene compresso in un payload binario (Bitmasking) direttamente sul dispositivo.
                </li>
                <li>
                    <strong>Algoritmo "8-Word Key":</strong> Il payload binario viene mappato su un dizionario sicuro di 256 parole italiane. Questo genera una "frase mnemonica" di 8 parole che funge da chiave crittografata di recupero.
                </li>
                <li>
                    <strong>Generazione QR Client-Side:</strong> La chiave viene trasformata istantaneamente in un QR Code all'interno del browser, incorporato in una "Tessera" (immagine JPG) generata tramite Canvas API.
                </li>
                <li>
                    <strong>Ripristino via Computer Vision:</strong> Il sistema integra un lettore ottico basato su <code>jsQR</code> che permette di scansionare la tessera tramite la webcam o caricando l'immagine, decodificando i progressi in tempo reale.
                </li>
            </ul>
        </section>

        {/* --- 3. INTERACTIVE CANVAS --- */}
        <section className="mb-10">
            <h4 className="text-xl font-black text-blue-800 mb-4 flex items-center gap-2">
                <ScanFace size={24} /> 3. Tecnologia "Responsive Interactive Canvas"
            </h4>
            <p className="text-gray-600 mb-4 text-sm">
                Per rendere interattivi gli scenari disegnati a mano su migliaia di dispositivi differenti:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-4 font-medium text-sm">
                <li>
                    <strong>Mappatura Vettoriale Relativa:</strong> Le coordinate di interazione sono calcolate in percentuale rispetto al viewport, adattandosi fluidamente a qualsiasi zoom.
                </li>
                <li>
                    <strong>Poligoni CSS Complessi:</strong> Utilizzo di <code>clip-path</code> poligonale per sagomare le aree attive esattamente attorno alle forme irregolari delle illustrazioni.
                </li>
            </ul>
        </section>

        {/* --- 4. STACK --- */}
        <section className="mb-8">
            <h4 className="text-xl font-black text-black mb-4 flex items-center gap-2">
                <Code size={24} className="text-boo-orange"/> 4. Stack Tecnologico
            </h4>
            <div className="grid md:grid-cols-2 gap-4">
                <div className="border-2 border-gray-100 p-4 rounded-xl">
                    <p className="font-bold text-gray-800 mb-2">Core & PWA</p>
                    <p className="text-sm text-gray-600">
                        Sviluppata in <strong>React 19</strong> con <strong>TypeScript</strong>. L'app è una <strong>PWA (Progressive Web App)</strong> installabile, con Service Workers per il caching aggressivo delle risorse e funzionamento offline.
                    </p>
                </div>
                <div className="border-2 border-gray-100 p-4 rounded-xl">
                    <p className="font-bold text-gray-800 mb-2">Data Layer</p>
                    <p className="text-sm text-gray-600">
                        Architettura dati <strong>"Decoupled"</strong>. Contenuti dinamici iniettati via stream remoti (CSV/JSON), parser proprietari per trasformazione in UI nativa senza backend complesso.
                    </p>
                </div>
            </div>
        </section>

        {/* --- PRIVACY HIGHLIGHT --- */}
        <div className="bg-gray-50 p-4 rounded-xl border-t-4 border-gray-300 mt-8">
            <h5 className="font-black text-gray-700 uppercase tracking-widest text-xs mb-2 flex items-center gap-2">
                <Lock size={14} /> Security by Design
            </h5>
            <p className="text-xs text-gray-500 leading-relaxed">
                L'infrastruttura opera secondo il principio di "Statelessness" lato server. Non avviene persistenza di dati sensibili sui nostri server. Tutto (salvataggi, foto, audio) viene elaborato localmente sul dispositivo dell'utente.
            </p>
        </div>

        <div className="flex justify-center mt-12">
            <button 
                onClick={() => { setView(AppView.HOME); window.scrollTo(0, 0); }}
                className="bg-red-500 text-white font-black py-3 px-8 rounded-full border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:scale-105 active:shadow-none active:translate-y-1 transition-all flex items-center gap-2"
            >
                <ArrowLeft size={24} strokeWidth={3} /> TORNA ALLA HOME
            </button>
        </div>

      </div>
    </div>
  );
};

export default TechInfoPage;


import React, { useEffect } from 'react';
import { 
  ShieldCheck, ShieldAlert, Scale, Fingerprint, 
  FileText, Globe, Cpu, Info, Mail, Cloud, 
  UserMinus, Heart, Lock, Calendar
} from 'lucide-react';
import { AppView } from '../types';

const BTN_CLOSE_IMG = 'https://i.postimg.cc/0NdtYdcJ/tasto-chiudi-(1)-(1).png';
const ICON_PRIVACY = 'https://i.postimg.cc/7hLmjsyy/prvcuccu-(1).png';

interface DisclaimerPageProps {
    setView: (view: AppView) => void;
}

const DisclaimerPage: React.FC<DisclaimerPageProps> = ({ setView }) => {
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
            <div className="flex flex-col items-center gap-2">
                <h2 
                    className="text-4xl md:text-6xl font-cartoon text-[#ef4444] tracking-tight leading-none"
                    style={{ 
                        WebkitTextStroke: '1.5px white', 
                        textShadow: '6px 6px 0px rgba(0,0,0,0.1)',
                    }}
                >
                   Note Legali
                </h2>
                <div className="inline-block bg-white/80 border-4 border-white px-6 py-1 rounded-full shadow-md mt-3">
                    <p className="text-xs md:text-sm font-black text-blue-600 uppercase tracking-tighter flex items-center gap-2">
                        <ShieldCheck size={16} /> Privacy Policy & Termini
                    </p>
                </div>
            </div>
        </div>

        {/* GRIGLIA COMPATTA BENTO-STYLE */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            
            {/* 1. ARCHITETTURA ZERO-DATA */}
            <div className="bg-white/50 backdrop-blur-md p-5 rounded-[30px] border-4 border-white shadow-lg flex flex-col md:col-span-2 lg:col-span-2">
                <div className="flex items-center gap-3 mb-3 border-b-2 border-white/50 pb-2">
                    <UserMinus className="text-green-600" size={24} />
                    <h3 className="text-lg font-black text-slate-800 uppercase leading-none">Architettura "Zero-Data"</h3>
                </div>
                <p className="text-sm font-bold text-slate-700 leading-relaxed">
                    Lone Boo opera secondo il principio di Minimizzazione dei Dati. Non possediamo un database utenti. L'app non richiede registrazione (email, telefono, password). Tutti i dati generati (progressi di gioco, disegni, avatar) vengono salvati esclusivamente nella memoria locale (LocalStorage) del dispositivo dell'utente.
                </p>
            </div>

            {/* 2. CONFORMITÀ GDPR & COPPA */}
            <div className="bg-white/50 backdrop-blur-md p-5 rounded-[30px] border-4 border-white shadow-lg flex flex-col row-span-2">
                <div className="flex items-center gap-3 mb-3 border-b-2 border-white/50 pb-2">
                    <Globe className="text-blue-600" size={24} />
                    <h3 className="text-lg font-black text-slate-800 uppercase leading-none">Conformità GDPR & COPPA</h3>
                </div>
                <div className="space-y-4">
                    <div className="bg-blue-50/50 p-3 rounded-2xl border border-blue-100">
                        <span className="font-black text-blue-700 text-[10px] uppercase block mb-1">GDPR (UE)</span>
                        <p className="text-[11px] font-bold text-slate-600 leading-tight">Nessun dato personale identificativo viene raccolto o processato sui nostri server senza consenso esplicito.</p>
                    </div>
                    <div className="bg-orange-50/50 p-3 rounded-2xl border border-orange-100">
                        <span className="font-black text-orange-700 text-[10px] uppercase block mb-1">COPPA (USA)</span>
                        <p className="text-[11px] font-bold text-slate-600 leading-tight">Non raccogliamo dati comportamentali per scopi pubblicitari verso minori di 13 anni.</p>
                    </div>
                    <div className="bg-purple-50/50 p-3 rounded-2xl border border-purple-100">
                        <span className="font-black text-purple-700 text-[10px] uppercase block mb-1">Cookie Policy</span>
                        <p className="text-[11px] font-bold text-slate-600 leading-tight">Usiamo solo storage tecnico essenziale per il funzionamento del gioco. No profilazione.</p>
                    </div>
                </div>
            </div>

            {/* 3. DATI AI & VOCE */}
            <div className="bg-white/50 backdrop-blur-md p-5 rounded-[30px] border-4 border-white shadow-lg flex flex-col md:col-span-2 lg:col-span-2">
                <div className="flex items-center gap-3 mb-3 border-b-2 border-white/50 pb-2">
                    <Cpu className="text-purple-600" size={24} />
                    <h3 className="text-lg font-black text-slate-800 uppercase leading-none">Dati AI & Voce</h3>
                </div>
                <p className="text-sm font-bold text-slate-700 leading-relaxed">
                    Le interazioni con l'assistente "Lone Boo" (chat e voce) sono Stateless (senza memoria a lungo termine lato server). I messaggi vengono inviati alle API di Google Gemini per la generazione della risposta e immediatamente scartati. Non vengono utilizzati per addestrare modelli pubblici che potrebbero riesporre dati personali.
                </p>
            </div>

            {/* 4. TERMINI DI UTILIZZO */}
            <div className="bg-white/50 backdrop-blur-md p-5 rounded-[30px] border-4 border-white shadow-lg flex flex-col md:col-span-3 lg:col-span-3">
                <div className="flex items-center gap-3 mb-4 border-b-2 border-white/50 pb-2">
                    <Scale className="text-red-600" size={24} />
                    <h3 className="text-lg font-black text-slate-800 uppercase leading-none">Termini di Utilizzo</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-3 bg-white/40 rounded-2xl border border-white">
                        <span className="font-black text-red-600 text-[10px] uppercase block mb-1">Finalità Educativa</span>
                        <p className="text-[11px] font-bold text-slate-600 leading-tight">Lone Boo è intrattenimento. Non sostituisce l'istruzione formale o il parere di professionisti dell'età evolutiva.</p>
                    </div>
                    <div className="p-3 bg-white/40 rounded-2xl border border-white">
                        <span className="font-black text-red-600 text-[10px] uppercase block mb-1">Contenuti Terzi</span>
                        <p className="text-[11px] font-bold text-slate-600 leading-tight">I video YouTube sono soggetti ai loro Termini di Servizio. Filtriamo i contenuti ma non controlliamo la piattaforma.</p>
                    </div>
                    <div className="p-3 bg-white/40 rounded-2xl border border-white">
                        <span className="font-black text-red-600 text-[10px] uppercase block mb-1">Proprietà Intellettuale</span>
                        <p className="text-[11px] font-bold text-slate-600 leading-tight">Grafiche, loghi e storie originali sono protetti. Vietato l'uso commerciale non autorizzato degli asset.</p>
                    </div>
                </div>
            </div>

            {/* 5. INFORMAZIONI LEGALI (FOOTER BENTO) */}
            <div className="bg-slate-800 text-white p-5 rounded-[30px] border-4 border-slate-900 shadow-2xl flex flex-col md:col-span-3 lg:col-span-3 mt-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-center">
                    <div className="flex flex-col gap-1">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Proprietario</span>
                        <span className="text-xs font-bold text-slate-100">Progetto Lone Boo</span>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Contatto Legale</span>
                        <span className="text-xs font-bold text-blue-400 underline decoration-blue-400/30 break-all">privacy@loneboo.online</span>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Infrastruttura</span>
                        <span className="text-xs font-bold text-slate-100 flex items-center gap-1"><Cloud size={10} /> Vercel Inc.</span>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Aggiornamento</span>
                        <span className="text-xs font-bold text-slate-100 flex items-center gap-1"><Calendar size={10} /> 01 Gennaio 2025</span>
                    </div>
                </div>
            </div>

        </div>

        <div className="flex flex-col items-center pb-12 mt-8 opacity-70">
            <Heart size={32} className="text-red-500 fill-red-500 mb-2 animate-pulse" />
            <p className="text-lg font-black text-slate-600 uppercase tracking-tighter text-center">Naviga in sicurezza con Lone Boo! 👻</p>
        </div>

      </div>
    </div>
  );
};

export default DisclaimerPage;

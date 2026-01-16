import React, { useEffect } from 'react';
import { 
  HelpCircle, Users, Youtube, ShieldCheck, Calendar, 
  School, ShoppingBag, Handshake, Lightbulb, Heart,
  X, Baby, GraduationCap, Zap, ChevronRight
} from 'lucide-react';
import { AppView } from '../types';

const BTN_CLOSE_IMG = 'https://i.postimg.cc/0NdtYdcJ/tasto-chiudi-(1)-(1).png';

interface FAQPageProps {
    setView: (view: AppView) => void;
}

const FAQPage: React.FC<FAQPageProps> = ({ setView }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="fixed inset-0 z-0 overflow-y-auto no-scrollbar">
      
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
      <div className="relative z-10 max-w-6xl mx-auto p-4 md:p-6 pt-32 md:pt-40 pb-32">
        
        {/* Intestazione Principale Compatta */}
        <div className="text-center mb-10">
            <h2 
                className="text-4xl md:text-6xl font-cartoon text-[#ef4444] tracking-tight leading-none"
                style={{ 
                    WebkitTextStroke: '1.5px white', 
                    textShadow: '6px 6px 0px rgba(0,0,0,0.1)',
                }}
            >
               Domande (FAQ)
            </h2>
            <div className="inline-block bg-white/80 border-4 border-white px-6 py-1 rounded-full shadow-md mt-3">
                <p className="text-xs md:text-sm font-black text-blue-600 uppercase tracking-tighter">
                    Tutto quello che vuoi sapere su Lone Boo 👻
                </p>
            </div>
        </div>

        {/* GRIGLIA COMPATTA BENTO-STYLE */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            
            {/* 1. COS'È LONE BOO */}
            <div className="bg-white/50 backdrop-blur-md p-5 rounded-[30px] border-4 border-white shadow-lg flex flex-col">
                <div className="flex items-center gap-3 mb-3 border-b-2 border-white/50 pb-2">
                    <HelpCircle className="text-blue-500" size={24} />
                    <h3 className="text-lg font-black text-slate-800 uppercase leading-none">1. Cos’è Lone Boo?</h3>
                </div>
                <p className="text-sm font-bold text-slate-700 leading-relaxed">
                    Lone Boo è un progetto creativo dedicato ai bambini e ragazzi dai 3 ai 13 anni. Produciamo video, storie animate, canzoni originali e contenuti educativi pensati per stimolare immaginazione, apprendimento e creatività.
                </p>
            </div>

            {/* 2. ETÀ (COMPATTA CON ETICHETTE) */}
            <div className="bg-white/50 backdrop-blur-md p-5 rounded-[30px] border-4 border-white shadow-lg flex flex-col md:col-span-2">
                <div className="flex items-center gap-3 mb-3 border-b-2 border-white/50 pb-2">
                    <Users className="text-purple-500" size={24} />
                    <h3 className="text-lg font-black text-slate-800 uppercase leading-none">2. Età e Contenuti</h3>
                </div>
                <p className="text-sm font-bold text-slate-700 mb-4">Progettati per una fascia ampia: dalla scuola dell’infanzia fino alla scuola media.</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    <div className="bg-blue-100/50 p-3 rounded-2xl border-2 border-blue-200">
                        <span className="flex items-center gap-2 font-black text-blue-700 text-xs mb-1"><Baby size={14}/> 3–6 ANNI</span>
                        <p className="text-[11px] font-bold text-slate-600">Storie semplici, canzoni, filastrocche e video educativi dolci.</p>
                    </div>
                    <div className="bg-green-100/50 p-3 rounded-2xl border-2 border-green-200">
                        <span className="flex items-center gap-2 font-black text-green-700 text-xs mb-1"><GraduationCap size={14}/> 7–10 ANNI</span>
                        <p className="text-[11px] font-bold text-slate-600">Mini avventure, curiosità e prime sfide creative.</p>
                    </div>
                    <div className="bg-orange-100/50 p-3 rounded-2xl border-2 border-orange-200">
                        <span className="flex items-center gap-2 font-black text-orange-700 text-xs mb-1"><Zap size={14}/> 11–13 ANNI</span>
                        <p className="text-[11px] font-bold text-slate-600">Contenuti dinamici, storytelling evoluto e attività stimolanti.</p>
                    </div>
                </div>
            </div>

            {/* 3. DOVE GUARDARE */}
            <div className="bg-white/50 backdrop-blur-md p-5 rounded-[30px] border-4 border-white shadow-lg">
                <div className="flex items-center gap-3 mb-3 border-b-2 border-white/50 pb-2">
                    <Youtube className="text-red-600" size={24} />
                    <h3 className="text-lg font-black text-slate-800 uppercase leading-none">3. Dove guardare?</h3>
                </div>
                <p className="text-sm font-bold text-slate-700 leading-relaxed">
                    I video sono disponibili sul canale YouTube ufficiale Lone Boo, aggiornato regolarmente con nuove storie, canzoni e contenuti speciali.
                </p>
            </div>

            {/* 4. SICUREZZA */}
            <div className="bg-white/50 backdrop-blur-md p-5 rounded-[30px] border-4 border-white shadow-lg">
                <div className="flex items-center gap-3 mb-3 border-b-2 border-white/50 pb-2">
                    <ShieldCheck className="text-green-600" size={24} />
                    <h3 className="text-lg font-black text-slate-800 uppercase leading-none">4. È sicuro?</h3>
                </div>
                <p className="text-sm font-bold text-slate-700 leading-relaxed">
                    Sì. Tutti i contenuti sono sicuri, positivi e adatti ai minori, senza temi violenti. Musiche e storie rispettano la sensibilità di ogni fascia d’età.
                </p>
            </div>

            {/* 5. AGGIORNAMENTI */}
            <div className="bg-white/50 backdrop-blur-md p-5 rounded-[30px] border-4 border-white shadow-lg">
                <div className="flex items-center gap-3 mb-3 border-b-2 border-white/50 pb-2">
                    <Calendar className="text-orange-500" size={24} />
                    <h3 className="text-lg font-black text-slate-800 uppercase leading-none">5. Nuovi episodi?</h3>
                </div>
                <p className="text-sm font-bold text-slate-700 leading-relaxed">
                    Il canale viene aggiornato regolarmente con nuove storie, filastrocche, serie animate, contenuti creativi e video speciali.
                </p>
            </div>

            {/* 6. SCUOLE ED EVENTI */}
            <div className="bg-white/50 backdrop-blur-md p-5 rounded-[30px] border-4 border-white shadow-lg">
                <div className="flex items-center gap-3 mb-3 border-b-2 border-white/50 pb-2">
                    <School className="text-cyan-600" size={24} />
                    <h3 className="text-lg font-black text-slate-800 uppercase leading-none">6. Uso nelle scuole?</h3>
                </div>
                <p className="text-sm font-bold text-slate-700 leading-relaxed">
                    Sì, i contenuti possono essere mostrati liberamente in scuole e laboratori per utilizzi non commerciali. Contattaci per altri usi.
                </p>
            </div>

            {/* 7. MERCHANDISING */}
            <div className="bg-white/50 backdrop-blur-md p-5 rounded-[30px] border-4 border-white shadow-lg">
                <div className="flex items-center gap-3 mb-3 border-b-2 border-white/50 pb-2">
                    <ShoppingBag className="text-pink-500" size={24} />
                    <h3 className="text-lg font-black text-slate-800 uppercase leading-none">7. Prodotti ufficiali?</h3>
                </div>
                <p className="text-sm font-bold text-slate-700 leading-relaxed">
                    Stiamo sviluppando prodotti dedicati (mini-peluche e gadget). Tutte le novità saranno annunciate sul sito e sui social ufficiali.
                </p>
            </div>

            {/* 8. COLLABORAZIONI */}
            <div className="bg-white/50 backdrop-blur-md p-5 rounded-[30px] border-4 border-white shadow-lg">
                <div className="flex items-center gap-3 mb-3 border-b-2 border-white/50 pb-2">
                    <Handshake className="text-indigo-600" size={24} />
                    <h3 className="text-lg font-black text-slate-800 uppercase leading-none">8. Collaborare?</h3>
                </div>
                <p className="text-sm font-bold text-slate-700 leading-relaxed">
                    Per collaborazioni creative, animazione, doppiaggio o educazione è possibile inviare una richiesta tramite la pagina Contatti.
                </p>
            </div>

            {/* 9. PROPOSTE */}
            <div className="bg-white/50 backdrop-blur-md p-5 rounded-[30px] border-4 border-white shadow-lg">
                <div className="flex items-center gap-3 mb-3 border-b-2 border-white/50 pb-2">
                    <Lightbulb className="text-yellow-600" size={24} />
                    <h3 className="text-lg font-black text-slate-800 uppercase leading-none">9. Posso proporre idee?</h3>
                </div>
                <p className="text-sm font-bold text-slate-700 leading-relaxed">
                    Certo! Accettiamo suggerimenti da tutti gli appassionati. Invia le tue proposte tramite la sezione contatti del sito.
                </p>
            </div>

            {/* 10. SOSTEGNO */}
            <div className="bg-white/50 backdrop-blur-md p-5 rounded-[30px] border-4 border-white shadow-lg md:col-span-2 lg:col-span-1">
                <div className="flex items-center gap-3 mb-3 border-b-2 border-white/50 pb-2">
                    <Heart className="text-red-500 fill-red-500" size={24} />
                    <h3 className="text-lg font-black text-slate-800 uppercase leading-none">10. Sostenere Lone Boo</h3>
                </div>
                <p className="text-sm font-bold text-slate-700 leading-relaxed">
                    Iscriviti al canale YouTube, condividi i video e seguici sui social. A breve sarà disponibile anche lo shop ufficiale!
                </p>
            </div>

        </div>

        <div className="flex flex-col items-center pb-12 mt-8 opacity-70">
            <Heart size={32} className="text-red-500 fill-red-500 mb-2 animate-pulse" />
            <p className="text-lg font-black text-slate-600 uppercase tracking-tighter text-center">Hai altre domande? Scrivici! 👻</p>
        </div>

      </div>
    </div>
  );
};

export default FAQPage;
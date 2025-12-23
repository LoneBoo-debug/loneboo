
import React, { useEffect } from 'react';
import { Mail, MessageSquare, Handshake, Info, X, ExternalLink } from 'lucide-react';
import { AppView } from '../types';

const INFO_BG = 'https://i.postimg.cc/brjgmCV4/sfondoinfo.jpg';
const BTN_CLOSE_IMG = 'https://i.postimg.cc/0NdtYdcJ/tasto-chiudi-(1)-(1).png';
const ICON_CONTACT = 'https://i.postimg.cc/c4Np5ZvM/contattti-(1).png';

interface ContactPageProps {
    setView: (view: AppView) => void;
}

const ContactPage: React.FC<ContactPageProps> = ({ setView }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleExit = () => setView(AppView.INFO_MENU);

  return (
    <div 
        className="min-h-screen bg-cover bg-center bg-fixed pb-24"
        style={{ backgroundImage: `url(${INFO_BG})` }}
    >
      
      {/* FIXED EXIT BUTTON - Slightly reduced size */}
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

      <div className="max-w-4xl mx-auto p-4 md:p-8 pt-32 animate-fade-in">
        
        {/* Header - Unified Style */}
        <div className="text-center mb-12">
            <h2 
                className="text-4xl md:text-7xl font-cartoon text-white tracking-tight leading-none mb-3"
                style={{ WebkitTextStroke: '2px #ef4444', textShadow: '4px 4px 0px rgba(0,0,0,0.2)' }}
            >
               Contattaci
            </h2>
            <div className="inline-flex items-center gap-2 bg-blue-500/80 text-white px-6 py-2 rounded-full text-lg font-bold backdrop-blur-md border border-white/20 shadow-lg">
                 <img src={ICON_CONTACT} alt="" className="w-8 h-8 object-contain" />
                 <span>Siamo qui per te!</span>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* 1. SUPPORTO GENERALE - Translucent */}
            <a 
                href="mailto:support@loneboo.online"
                className="bg-white/70 backdrop-blur-md rounded-[30px] border-l-[8px] border-blue-500 p-6 shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-all group border-y border-r border-white/30"
            >
                <div className="flex items-center gap-4 mb-3">
                    <div className="bg-blue-100 p-3 rounded-xl text-blue-600 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                        <MessageSquare size={28} />
                    </div>
                    <h3 className="text-2xl font-black text-gray-800 group-hover:text-blue-600">Supporto</h3>
                </div>
                <p className="text-gray-600 font-bold mb-4 leading-relaxed text-sm">
                    Problemi con l'app? Bug? O semplicemente vuoi salutarci? Scrivici qui!
                </p>
                <div className="bg-blue-50/50 text-blue-700 font-mono font-bold py-2 px-4 rounded-lg inline-flex items-center gap-2 border border-blue-200">
                    <Mail size={16} /> support@loneboo.online
                </div>
            </a>

            {/* 2. COLLABORAZIONI - Translucent */}
            <a 
                href="mailto:collaborazioni@loneboo.online"
                className="bg-white/70 backdrop-blur-md rounded-[30px] border-l-[8px] border-purple-500 p-6 shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-all group border-y border-r border-white/30"
            >
                <div className="flex items-center gap-4 mb-3">
                    <div className="bg-purple-100 p-3 rounded-xl text-purple-600 group-hover:bg-purple-500 group-hover:text-white transition-colors">
                        <Handshake size={28} />
                    </div>
                    <h3 className="text-2xl font-black text-gray-800 group-hover:text-purple-600">Business</h3>
                </div>
                <p className="text-gray-600 font-bold mb-4 leading-relaxed text-sm">
                    Sei un'azienda, una scuola o un creatore? Parliamo di progetti insieme.
                </p>
                <div className="bg-purple-50/50 text-purple-700 font-mono font-bold py-2 px-4 rounded-lg inline-flex items-center gap-2 border border-purple-200">
                    <Mail size={16} /> loneboo@libero.it
                </div>
            </a>

            {/* 3. INFO & PRIVACY - Translucent */}
            <a 
                href="mailto:privacy@loneboo.online"
                className="bg-white/70 backdrop-blur-md rounded-[30px] border-l-[8px] border-green-500 p-6 shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-all group border-y border-r border-white/30"
            >
                <div className="flex items-center gap-4 mb-3">
                    <div className="bg-green-100 p-3 rounded-xl text-green-600 group-hover:bg-green-500 group-hover:text-white transition-colors">
                        <Info size={28} />
                    </div>
                    <h3 className="text-2xl font-black text-gray-800 group-hover:text-green-600">Privacy & Info</h3>
                </div>
                <p className="text-gray-600 font-bold mb-4 leading-relaxed text-sm">
                    Domande sui dati, richieste legali o informazioni generali sul progetto.
                </p>
                <div className="bg-green-50/50 text-green-700 font-mono font-bold py-2 px-4 rounded-lg inline-flex items-center gap-2 border border-green-200">
                    <Mail size={16} /> loneboo@libero.it
                </div>
            </a>

            {/* 4. SOCIAL - Special Banner */}
            <div className="bg-yellow-400 rounded-[30px] border-4 border-black p-6 shadow-lg flex flex-col items-center justify-center text-center">
                <h3 className="text-2xl font-black text-black mb-2">SEGUICI SUI SOCIAL</h3>
                <p className="text-black/70 font-bold text-sm mb-4">
                    Per aggiornamenti veloci, scrivici su Instagram o Facebook!
                </p>
                <button 
                    onClick={() => setView(AppView.SOCIALS)}
                    className="bg-white text-black font-black py-3 px-6 rounded-full border-2 border-black hover:scale-105 transition-transform flex items-center gap-2 shadow-md"
                >
                    VAI AI SOCIAL <ExternalLink size={20} />
                </button>
            </div>

        </div>
        
        <div className="mt-12 text-center">
            <p className="text-white/80 font-bold text-sm">
                Rispondiamo solitamente entro 24-48 ore lavorative. 👻
            </p>
        </div>

      </div>
    </div>
  );
};

export default ContactPage;

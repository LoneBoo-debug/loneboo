import React, { useEffect } from 'react';
import { Mail, MessageSquare, Handshake, Info, X, ExternalLink } from 'lucide-react';
import { AppView } from '../types';

const BTN_CLOSE_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/btn-close.webp';
const ICON_CONTACT = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/icon-info.webp';

interface ContactPageProps {
    setView: (view: AppView) => void;
}

const ContactPage: React.FC<ContactPageProps> = ({ setView }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      <div className="fixed inset-0 bg-[#bae6fd] z-0"></div>
      <div className="fixed inset-0 bg-white/20 backdrop-blur-[45px] z-[1] pointer-events-none border-t-8 border-white/30"></div>
      
      <button 
          onClick={() => setView(AppView.INFO_MENU)}
          className="fixed top-20 right-4 z-[100] hover:scale-110 active:scale-95 transition-all outline-none"
      >
          <img src={BTN_CLOSE_IMG} alt="Chiudi" className="w-16 h-16 md:w-20 md:h-20 object-contain drop-shadow-2xl" />
      </button>

      <div className="relative z-10 max-w-5xl mx-auto p-4 md:p-8 pt-24 md:pt-32 animate-fade-in pb-24">
        <div className="text-center mb-12">
            <h2 
                className="text-4xl md:text-7xl font-cartoon text-[#ef4444] tracking-tight leading-none mb-3"
                style={{ WebkitTextStroke: '2px white', textShadow: '4px 4px 0px rgba(0,0,0,0.1)' }}
            >
               Contatti
            </h2>
            <div className="inline-flex items-center gap-2 bg-blue-500 text-white px-6 py-2 rounded-full text-lg font-black border-2 border-black shadow-lg">
                 <img src={ICON_CONTACT} alt="" className="w-8 h-8 object-contain" />
                 <span>Siamo qui per te!</span>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <a href="mailto:support@loneboo.online" className="bg-white/50 backdrop-blur-md rounded-[30px] border-4 border-white p-6 shadow-xl hover:bg-white/70 transition-all group">
                <div className="flex items-center gap-4 mb-3">
                    <div className="bg-blue-100 p-3 rounded-xl text-blue-600"><MessageSquare size={28} /></div>
                    <h3 className="text-2xl font-black text-gray-800 group-hover:text-blue-600">Supporto Tecnico</h3>
                </div>
                <p className="text-gray-600 font-bold mb-4 leading-relaxed text-sm">Problemi con l'app, bug o suggerimenti per nuove funzioni? Scrivici subito!</p>
                <div className="bg-blue-50 text-blue-700 font-mono font-bold py-2 px-4 rounded-lg inline-flex items-center gap-2 border border-blue-200">
                    <Mail size={16} /> support@loneboo.online
                </div>
            </a>

            <div className="bg-white/50 backdrop-blur-md rounded-[30px] border-4 border-white p-6 shadow-xl">
                <div className="flex items-center gap-4 mb-3">
                    <div className="bg-purple-100 p-3 rounded-xl text-purple-600"><Handshake size={28} /></div>
                    <h3 className="text-2xl font-black text-gray-800">Partnership</h3>
                </div>
                <p className="text-gray-600 font-bold mb-4 leading-relaxed text-sm">Sei un creatore o un'azienda e vuoi collaborare con il mondo di Lone Boo?</p>
                <div className="bg-purple-50 text-purple-700 font-mono font-bold py-2 px-4 rounded-lg inline-flex items-center gap-2 border border-purple-200">
                    <Mail size={16} /> business@loneboo.online
                </div>
            </div>

            <div className="bg-white/50 backdrop-blur-md rounded-[30px] border-4 border-white p-6 shadow-xl md:col-span-2">
                <div className="flex items-center gap-4 mb-3">
                    <div className="bg-red-100 p-3 rounded-xl text-red-600"><ExternalLink size={28} /></div>
                    <h3 className="text-2xl font-black text-gray-800">Fan Art</h3>
                </div>
                <p className="text-gray-600 font-bold mb-4 leading-relaxed text-sm">Vuoi inviarci un disegno da pubblicare nel Museo? Usa la funzione "Invia Disegno" direttamente nel Museo Fan Art dell'app!</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
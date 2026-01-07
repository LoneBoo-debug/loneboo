import React, { useEffect } from 'react';
import { 
  Info, Instagram, Facebook, Youtube, X, Music, 
  Heart, Send, ExternalLink, Globe, Cloud, 
  ShieldCheck, Sparkles, BookOpen, CheckCircle2,
  Tv, Gamepad2, Package, Star, Lock
} from 'lucide-react';
import { AppView } from '../types';

const BTN_CLOSE_IMG = 'https://i.postimg.cc/0NdtYdcJ/tasto-chiudi-(1)-(1).png';
const ICON_ABOUT = 'https://i.postimg.cc/63yjTby9/chisiamo-(1).png';

const SOCIAL_LINKS = [
    { name: 'YouTube', url: 'https://www.youtube.com/@ILoneBoo', icon: Youtube, color: 'text-red-600' },
    { name: 'Instagram', url: 'https://www.instagram.com/loneboo_official', icon: Instagram, color: 'text-pink-600' },
    { name: 'TikTok', url: 'https://www.tiktok.com/@lone_._boo', icon: Music, color: 'text-slate-900' },
    { name: 'Facebook', url: 'https://www.facebook.com/LoneBooFanPage', icon: Facebook, color: 'text-blue-600' },
    { name: 'Spotify', url: 'https://open.spotify.com/intl-it/artist/3RVol8TV5OleEGTcP5tdau', icon: Music, color: 'text-green-600' },
    { name: 'Telegram', url: 'https://t.me/loneboo_official', icon: Send, color: 'text-sky-500' },
];

interface AboutPageProps {
    setView: (view: AppView) => void;
}

const AboutPage: React.FC<AboutPageProps> = ({ setView }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleExternalClick = (e: React.MouseEvent, url: string) => {
      const linksDisabled = localStorage.getItem('disable_external_links') === 'true';
      if (linksDisabled) {
          e.preventDefault();
          alert("Navigazione esterna bloccata dai genitori! 🔒");
          return;
      }
      window.open(url, '_blank');
  };

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
      >
          <img src={BTN_CLOSE_IMG} alt="Chiudi" className="w-16 h-16 md:w-20 md:h-20 object-contain drop-shadow-2xl" />
      </button>

      {/* CONTENUTO SCROLLABILE */}
      <div className="relative z-10 max-w-6xl mx-auto p-4 md:p-6 pt-32 md:pt-40 animate-fade-in pb-24">
        
        {/* Intestazione Principale Compatta */}
        <div className="text-center mb-8">
            <h2 
                className="text-4xl md:text-6xl font-cartoon text-[#ef4444] tracking-tight leading-none"
                style={{ 
                    WebkitTextStroke: '1.5px white', 
                    textShadow: '6px 6px 0px rgba(0,0,0,0.1)',
                }}
            >
               Benvenuti da Lone Boo!
            </h2>
            <div className="inline-block bg-white/80 border-4 border-white px-6 py-1 rounded-full shadow-md mt-3">
                <p className="text-xs md:text-sm font-black text-blue-600 uppercase tracking-tighter">
                    Il Protagonista del Divertimento 👻
                </p>
            </div>
        </div>

        {/* GRIGLIA COMPATTA BENTO-STYLE */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
            
            {/* 1. LONE BOO: IL PROTAGONISTA */}
            <div className="bg-white/50 backdrop-blur-md p-5 rounded-[30px] border-4 border-white shadow-lg flex flex-col md:col-span-2">
                <div className="flex items-center gap-3 mb-3 border-b-2 border-white/50 pb-2">
                    <Star className="text-yellow-500 fill-yellow-500" size={28} />
                    <h3 className="text-lg font-black text-slate-800 uppercase leading-none">Lone Boo: Il Protagonista Assoluto</h3>
                </div>
                <p className="text-sm md:text-lg font-bold text-slate-700 leading-relaxed">
                    Lone Boo non è solo un personaggio, è la **guida ufficiale** di tutto questo universo! È il fantasmino pasticcione che accompagna i bambini alla scoperta delle emozioni, del gioco e dell'apprendimento. Insieme ai suoi amici di Città Colorata (come Gaia, Zuccotto e Grufo), Lone Boo rende ogni momento un'occasione per imparare sorridendo.
                </p>
            </div>

            {/* 2. IL CANALE YOUTUBE: IL CUORE DEL PROGETTO */}
            <div className="bg-red-50/80 backdrop-blur-md p-5 rounded-[30px] border-4 border-red-500 shadow-lg flex flex-col md:col-span-2">
                <div className="flex items-center gap-3 mb-3 border-b-2 border-red-200 pb-2">
                    <Youtube className="text-red-600" size={32} />
                    <h3 className="text-xl font-black text-red-700 uppercase leading-none">Il Canale YouTube Ufficiale</h3>
                </div>
                <p className="text-sm md:text-lg font-bold text-red-900 leading-relaxed mb-4">
                    Il vero motore di Lone Boo World è il nostro **Canale YouTube**. Con migliaia di visualizzazioni, è qui che prendono vita le hit musicali, i balletti originali e i cartoni animati che i bambini adorano guardare e ballare!
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white/40 p-3 rounded-2xl border border-red-200">
                        <span className="font-black text-red-600 text-xs uppercase block mb-1">Video & Cartoni</span>
                        <p className="text-[11px] font-bold text-red-800">Serie animate originali prodotte con amore per intrattenere i più piccoli.</p>
                    </div>
                    <div className="bg-white/40 p-3 rounded-2xl border border-red-200">
                        <span className="font-black text-red-600 text-xs uppercase block mb-1">Canzoni & Ballo</span>
                        <p className="text-[11px] font-bold text-red-800">Musica per stimolare il coordinamento motorio attraverso coreografie semplici.</p>
                    </div>
                </div>
                <button 
                  onClick={(e) => handleExternalClick(e, 'https://www.youtube.com/@ILoneBoo')}
                  className="mt-4 bg-red-600 text-white font-black py-3 rounded-full flex items-center justify-center gap-2 shadow-lg hover:bg-red-700 transition-all uppercase tracking-widest text-sm"
                >
                    ISCRIVITI AL CANALE <ExternalLink size={16} />
                </button>
            </div>

            {/* 3. L'APP E IL GIOCO */}
            <div className="bg-white/50 backdrop-blur-md p-5 rounded-[30px] border-4 border-white shadow-lg flex flex-col">
                <div className="flex items-center gap-3 mb-3 border-b-2 border-white/50 pb-2">
                    <Gamepad2 className="text-purple-600" size={24} />
                    <h3 className="text-lg font-black text-slate-800 uppercase leading-none">L'App Interattiva</h3>
                </div>
                <p className="text-[11px] font-bold text-slate-700 leading-relaxed">
                    Questa applicazione è l'estensione interattiva dei video. Qui Lone Boo sfida i bambini a superare prove di logica, memoria e riflessi, premiandoli con gettoni e figurine per completare l'album ufficiale.
                </p>
            </div>

            {/* 4. LIBRI E PRODOTTI */}
            <div className="bg-white/50 backdrop-blur-md p-5 rounded-[30px] border-4 border-white shadow-lg flex flex-col">
                <div className="flex items-center gap-3 mb-3 border-b-2 border-white/50 pb-2">
                    <BookOpen className="text-blue-500" size={24} />
                    <h3 className="text-lg font-black text-slate-800 uppercase leading-none">Libri su Amazon</h3>
                </div>
                <p className="text-[11px] font-bold text-slate-700 leading-relaxed">
                    La magia di Lone Boo arriva anche sulla carta! Abbiamo una collezione di libri illustrati e di enigmi disponibili su Amazon per stimolare la lettura e la creatività lontano dagli schermi.
                </p>
            </div>

            {/* 5. NETWORK SOCIAL (LAYOUT ICONA + TESTO) */}
            <div className="md:col-span-2 bg-white/40 p-4 rounded-[30px] border-2 border-white/50">
                <div className="flex flex-wrap justify-center gap-4 md:gap-8">
                    {SOCIAL_LINKS.map((link) => (
                        <button 
                            key={link.name} 
                            onClick={(e) => handleExternalClick(e, link.url)} 
                            className="flex items-center gap-2 group transition-transform hover:scale-105 active:scale-95 outline-none"
                        >
                            <div className="p-2 bg-white rounded-full shadow-sm border border-gray-100 group-hover:shadow-md transition-shadow">
                                <link.icon size={18} className={link.color} />
                            </div>
                            <span className="font-black text-xs md:text-sm text-slate-700 uppercase tracking-tight group-hover:text-blue-600 transition-colors">
                                {link.name}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

        </div>

        <div className="flex flex-col items-center pb-12 mt-6 opacity-70">
            <Heart size={32} className="text-red-500 fill-red-500 mb-2 animate-pulse" />
            <p className="text-lg font-black text-slate-600 uppercase tracking-tighter text-center">Grazie per far parte del mondo di Lone Boo! 👻</p>
        </div>

      </div>
    </div>
  );
};

export default AboutPage;
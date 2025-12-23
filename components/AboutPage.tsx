
import React, { useEffect } from 'react';
/* Added CheckCircle to imports from lucide-react */
import { Info, Instagram, Facebook, Youtube, X, Music, Heart, Send, ExternalLink, Globe, Cloud, ShieldCheck, Sparkles, BookOpen, CheckCircle } from 'lucide-react';
import { AppView } from '../types';

const INFO_BG = 'https://i.postimg.cc/brjgmCV4/sfondoinfo.jpg';
const BTN_CLOSE_IMG = 'https://i.postimg.cc/0NdtYdcJ/tasto-chiudi-(1)-(1).png';
const ICON_ABOUT = 'https://i.postimg.cc/63yjTby9/chisiamo-(1).png';

interface AboutPageProps {
    setView: (view: AppView) => void;
}

const SOCIAL_LINKS = [
    { name: 'YouTube', url: 'https://www.youtube.com/@ILoneBoo', icon: Youtube, color: 'bg-red-600' },
    { name: 'Instagram', url: 'https://www.instagram.com/loneboo_official', icon: Instagram, color: 'bg-pink-600' },
    { name: 'TikTok', url: 'https://www.tiktok.com/@lone_._boo', icon: Music, color: 'bg-black' },
    { name: 'Facebook', url: 'https://www.facebook.com/LoneBooFanPage', icon: Facebook, color: 'bg-blue-600' },
    { name: 'X (Twitter)', url: 'https://x.com/IloneBoo', icon: X, color: 'bg-black' },
    { name: 'Spotify', url: 'https://open.spotify.com/intl-it/artist/3RVol8TV5OleEGTcP5tdau', icon: Music, color: 'bg-green-600' },
    { name: 'Amazon Music', url: 'https://music.amazon.it/artists/B0FY6VS1XC/lone-boo', icon: Music, color: 'bg-cyan-600' },
    { name: 'SoundCloud', url: 'https://soundcloud.com/lone-boo', icon: Cloud, color: 'bg-orange-600' },
    { name: 'Telegram', url: 'https://t.me/loneboo_official', icon: Send, color: 'bg-sky-500' },
    { name: 'Patreon', url: 'https://www.patreon.com/cw/LoneBoo', icon: Heart, color: 'bg-red-500' },
    { name: 'Sito Ufficiale', url: 'https://loneboo.online', icon: Globe, color: 'bg-indigo-600' },
];

const AboutPage: React.FC<AboutPageProps> = ({ setView }) => {
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
               Chi Siamo
            </h2>
            <div className="inline-flex items-center gap-2 bg-yellow-500/80 text-white px-6 py-2 rounded-full text-lg font-bold backdrop-blur-md border border-white/20 shadow-lg">
                 <Info size={24} />
                 <span>Il Mondo di Lone Boo</span>
            </div>
        </div>

        <div className="space-y-8">
            {/* 1. INTRODUZIONE */}
            <div className="border-l-[8px] border-boo-purple bg-white/70 backdrop-blur-md pl-6 py-6 pr-6 rounded-r-3xl shadow-xl border-y border-r border-white/30">
                <h3 className="text-3xl font-black text-boo-purple mb-4 tracking-tight flex items-center gap-3">
                    <img src={ICON_ABOUT} alt="" className="w-12 h-12 md:w-16 md:h-16 object-contain" />
                    Il mondo di Lone Boo
                </h3>
                <p className="text-lg md:text-xl font-bold text-gray-700 mb-4 leading-relaxed">
                    Lone Boo è un progetto musicale, educativo e narrativo pensato per i bambini dai <strong>3 ai 13 anni (ma anche per ragazzi più grandi!)</strong>, creato per offrire un ambiente digitale <strong>sicuro, positivo e ricco di stimoli</strong>.
                </p>
                <p className="text-lg md:text-xl font-bold text-gray-700 leading-relaxed">
                    Attraverso canzoni originali, coreografie semplici, favole animate, giochi interattivi e illustrazioni colorate, Lone Boo accompagna i più piccoli nella crescita, incoraggiando movimento, creatività e immaginazione.
                </p>
            </div>

            {/* 2. CITTA COLORATA */}
            <div className="border-l-[8px] border-blue-500 bg-white/70 backdrop-blur-md pl-6 py-6 pr-6 rounded-r-3xl shadow-xl border-y border-r border-white/30">
                <h3 className="text-2xl font-black text-blue-800 mb-4 flex items-center gap-2 tracking-tight">
                    🌈 Un universo chiamato “Città Colorata”
                </h3>
                <p className="text-lg font-bold text-gray-700 leading-relaxed mb-4">
                    Tutte le avventure di Boo prendono vita in <strong>Città Colorata</strong>, un luogo magico dove musica, amicizia e fantasia aiutano i bambini a esplorare emozioni, imparare nuove parole e sviluppare abilità motorie e cognitive.
                </p>
                <p className="text-lg font-bold text-gray-700 leading-relaxed">
                    Ogni personaggio, canzone e storia è progettato con cura per trasmettere valori positivi, coinvolgere i più piccoli e regalare un’esperienza sicura sia per loro che per i genitori.
                </p>
            </div>

            {/* 3. INTRATTENIMENTO EDUCATIVO */}
            <div className="border-l-[8px] border-green-500 bg-white/70 backdrop-blur-md pl-6 py-6 pr-6 rounded-r-3xl shadow-xl border-y border-r border-white/30">
                <h3 className="text-2xl font-black text-green-800 mb-4 flex items-center gap-2 tracking-tight">
                    🎵 Intrattenimento educativo
                </h3>
                <p className="text-gray-700 font-bold mb-4">Il progetto nasce per offrire:</p>
                <ul className="space-y-3 font-bold text-gray-600">
                    <li className="flex gap-3 items-start"><span className="text-green-500 text-xl leading-none">●</span> <span>Musica per bambini divertente e facilmente imitabile.</span></li>
                    <li className="flex gap-3 items-start"><span className="text-green-500 text-xl leading-none">●</span> <span>Coreografie educative per favorire coordinazione e movimento.</span></li>
                    <li className="flex gap-3 items-start"><span className="text-green-500 text-xl leading-none">●</span> <span>Cartoni animati educativi con storie brevi e intuitive.</span></li>
                    <li className="flex gap-3 items-start"><span className="text-green-500 text-xl leading-none">●</span> <span>Favole interattive che stimolano ascolto e partecipazione.</span></li>
                    <li className="flex gap-3 items-start"><span className="text-green-500 text-xl leading-none">●</span> <span>Giochi digitali semplici e senza pubblicità invadente.</span></li>
                    <li className="flex gap-3 items-start"><span className="text-green-500 text-xl leading-none">●</span> <span>Un ambiente digitale sicuro, controllato e adatto all’età.</span></li>
                </ul>
                <p className="mt-4 text-green-700 font-black italic">Tutti i contenuti includono temi come collaborazione, amicizia, emozioni e fantasia.</p>
            </div>

            {/* 4. NETWORK */}
            <div className="border-l-[8px] border-orange-500 bg-white/70 backdrop-blur-md pl-6 py-6 pr-6 rounded-r-3xl shadow-xl border-y border-r border-white/30">
                <h3 className="text-2xl font-black text-orange-800 mb-4 flex items-center gap-2 tracking-tight">
                    📚 Un network multimediale in crescita
                </h3>
                <p className="text-gray-700 font-bold mb-4">Lone Boo è un ecosistema che comprende:</p>
                <ul className="space-y-3 font-bold text-gray-600">
                    <li className="flex gap-3 items-start"><span className="text-orange-500 text-xl leading-none">★</span> <span>Il canale YouTube ufficiale (canzoni, balli e storie).</span></li>
                    <li className="flex gap-3 items-start"><span className="text-orange-500 text-xl leading-none">★</span> <span>Pagine Instagram e TikTok per genitori e dietro le quinte.</span></li>
                    <li className="flex gap-3 items-start"><span className="text-orange-500 text-xl leading-none">★</span> <span>Libri narrativi e illustrati sullo store Amazon.</span></li>
                    <li className="flex gap-3 items-start"><span className="text-orange-500 text-xl leading-none">★</span> <span>Un’app dedicata con giochi educativi e favole.</span></li>
                    <li className="flex gap-3 items-start"><span className="text-orange-500 text-xl leading-none">★</span> <span>Pupazzi e peluche ufficiali dei personaggi.</span></li>
                </ul>
                <p className="mt-4 text-gray-700 font-bold">L’obiettivo è costruire una piattaforma educativa completa dove tornare giorno dopo giorno.</p>
            </div>

            {/* 5. SICUREZZA */}
            <div className="border-l-[8px] border-cyan-500 bg-white/70 backdrop-blur-md pl-6 py-6 pr-6 rounded-r-3xl shadow-xl border-y border-r border-white/30">
                <h3 className="text-2xl font-black text-cyan-800 mb-4 flex items-center gap-2 tracking-tight">
                    🔐 Sicurezza e Affidabilità
                </h3>
                <p className="text-gray-700 font-bold mb-4">Il progetto segue linee guida chiare per garantire:</p>
                <ul className="space-y-3 font-bold text-gray-600">
                    <li className="flex gap-3 items-start text-green-700"><CheckCircle size={20} className="shrink-0" /> <span>Contenuti privi di pubblicità invasiva</span></li>
                    <li className="flex gap-3 items-start text-green-700"><CheckCircle size={20} className="shrink-0" /> <span>Linguaggio semplice e adatto</span></li>
                    <li className="flex gap-3 items-start text-green-700"><CheckCircle size={20} className="shrink-0" /> <span>Assenza di temi violenti</span></li>
                    <li className="flex gap-3 items-start text-green-700"><CheckCircle size={20} className="shrink-0" /> <span>Musica per pubblico 3-15 anni</span></li>
                    <li className="flex gap-3 items-start text-green-700"><CheckCircle size={20} className="shrink-0" /> <span>Rispetto delle normative sulla privacy</span></li>
                </ul>
            </div>
        </div>

        {/* SECTION: LINK UTILI */}
        <div className="text-center mt-12 mb-8">
            <h3 className="text-3xl font-black text-white mb-6 drop-shadow-[0_2px_0_black]">🔗 I Nostri Canali</h3>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                {SOCIAL_LINKS.map((link) => (
                    <a 
                        key={link.name}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`
                            flex items-center gap-2 md:gap-3 px-3 md:px-4 py-3 md:py-4 rounded-xl text-white font-bold transition-all hover:scale-105 active:scale-95 shadow-md hover:shadow-lg
                            ${link.color} border-2 border-white/20
                        `}
                    >
                        <link.icon size={20} className="md:w-6 md:h-6 shrink-0" />
                        <span className="truncate flex-1 text-left text-xs md:text-sm">{link.name}</span>
                        <ExternalLink size={14} className="opacity-70 hidden md:block" />
                    </a>
                ))}
            </div>
        </div>

      </div>
    </div>
  );
};

export default AboutPage;

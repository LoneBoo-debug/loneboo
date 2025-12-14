
import React, { useEffect } from 'react';
import { ArrowLeft, Info, Instagram, Facebook, Youtube, X, Music, Heart, ShoppingCart, Send, ExternalLink, Globe, Cloud } from 'lucide-react';
import { AppView } from '../types';

interface AboutPageProps {
    setView: (view: AppView) => void;
}

// Updated Social Links based on user request
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
  // Ensure the page starts at the top when opened
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 animate-fade-in pb-24">
      
      {/* Header */}
      <div className="text-center mb-10">
        <h2 className="text-4xl md:text-6xl font-black text-boo-orange mb-3" style={{ textShadow: "3px 3px 0px black" }}>
           Chi Siamo
        </h2>
        <div className="inline-flex items-center gap-2 bg-black/20 text-white px-5 py-2 rounded-full text-base font-bold backdrop-blur-sm shadow-sm">
             <Info size={20} />
             <h1>Il Mondo di Lone Boo</h1>
        </div>
      </div>

      {/* Content Card */}
      <div className="bg-white rounded-[40px] border-4 border-black p-6 md:p-10 shadow-[10px_10px_0px_0px_rgba(0,0,0,0.2)] text-gray-800 leading-relaxed font-sans">
        
        {/* INTRO: IL MONDO DI LONE BOO */}
        <section className="mb-10 text-center md:text-left">
            <h3 className="text-2xl md:text-3xl font-black text-boo-purple mb-4">
                👻 Il mondo di Lone Boo
            </h3>
            <p className="text-lg md:text-xl font-medium text-gray-600 mb-4 leading-relaxed">
                <strong>Lone Boo</strong> è un progetto musicale, educativo e narrativo pensato per i bambini dai <strong>3 ai 13 anni</strong> (ma anche per ragazzi più grandi!), creato per offrire un ambiente digitale <strong>sicuro, positivo e ricco di stimoli</strong>.
            </p>
            <p className="text-lg md:text-xl font-medium text-gray-600 leading-relaxed">
                Attraverso <strong>canzoni originali</strong>, coreografie semplici, <strong>favole animate</strong>, giochi interattivi e illustrazioni colorate, Lone Boo accompagna i più piccoli nella crescita, incoraggiando movimento, creatività e immaginazione.
            </p>
        </section>

        {/* SECTION: CITTA COLORATA */}
        <section className="mb-10 bg-gradient-to-r from-blue-50 to-purple-50 p-6 md:p-8 rounded-[30px] border-l-8 border-boo-blue shadow-sm">
            <h3 className="text-2xl font-black text-boo-blue mb-4 flex items-center gap-2">
                🌈 Un universo chiamato “Città Colorata”
            </h3>
            <p className="text-lg font-medium text-gray-700 leading-relaxed">
                Tutte le avventure di Boo prendono vita in <strong>Città Colorata</strong>, un luogo magico dove musica, amicizia e fantasia aiutano i bambini a esplorare emozioni, imparare nuove parole e sviluppare abilità motorie e cognitive.
            </p>
            <p className="text-lg font-medium text-gray-700 leading-relaxed mt-3">
                Ogni personaggio, canzone e storia è progettato con cura per trasmettere <strong>valori positivi</strong>, coinvolgere i più piccoli e regalare un’esperienza sicura sia per loro che per i genitori.
            </p>
        </section>

        {/* GRID: INTRATTENIMENTO & NETWORK */}
        <div className="grid md:grid-cols-2 gap-8 mb-10">
            
            {/* INTRATTENIMENTO EDUCATIVO */}
            <div className="bg-orange-50 p-6 rounded-[30px] border-2 border-orange-100">
                <h3 className="text-xl font-black text-orange-600 mb-4 flex items-center gap-2">
                    🎵 Intrattenimento educativo
                </h3>
                <p className="font-bold text-gray-500 mb-3 text-sm uppercase tracking-wide">Il progetto nasce per offrire:</p>
                <ul className="space-y-3 text-gray-700 font-bold text-base md:text-lg">
                    <li className="flex items-start gap-2"><span className="text-orange-500 mt-1">●</span> Musica per bambini divertente e facilmente imitabile.</li>
                    <li className="flex items-start gap-2"><span className="text-orange-500 mt-1">●</span> Coreografie educative per favorire coordinazione e movimento.</li>
                    <li className="flex items-start gap-2"><span className="text-orange-500 mt-1">●</span> Cartoni animati educativi con storie brevi e intuitive.</li>
                    <li className="flex items-start gap-2"><span className="text-orange-500 mt-1">●</span> Favole interattive che stimolano ascolto e partecipazione.</li>
                    <li className="flex items-start gap-2"><span className="text-orange-500 mt-1">●</span> Giochi digitali semplici e senza pubblicità invadente.</li>
                    <li className="flex items-start gap-2"><span className="text-orange-500 mt-1">●</span> Un ambiente digitale sicuro, controllato e adatto all’età.</li>
                </ul>
                <div className="mt-4 p-3 bg-white rounded-xl border border-orange-200 text-sm text-gray-500 italic">
                    Tutti i contenuti includono temi come collaborazione, amicizia, emozioni e fantasia.
                </div>
            </div>

            {/* NETWORK MULTIMEDIALE */}
            <div className="bg-yellow-50 p-6 rounded-[30px] border-2 border-yellow-100">
                <h3 className="text-xl font-black text-yellow-600 mb-4 flex items-center gap-2">
                    📚 Un network multimediale in crescita
                </h3>
                <p className="font-bold text-gray-500 mb-3 text-sm uppercase tracking-wide">Lone Boo è un ecosistema che comprende:</p>
                <ul className="space-y-3 text-gray-700 font-bold text-base md:text-lg">
                    <li className="flex items-start gap-2"><span className="text-yellow-500 mt-1">★</span> Il canale YouTube ufficiale (canzoni, balli e storie).</li>
                    <li className="flex items-start gap-2"><span className="text-yellow-500 mt-1">★</span> Pagine Instagram e TikTok per genitori e dietro le quinte.</li>
                    <li className="flex items-start gap-2"><span className="text-yellow-500 mt-1">★</span> Libri narrativi e illustrati sullo store Amazon.</li>
                    <li className="flex items-start gap-2"><span className="text-yellow-500 mt-1">★</span> Un’app dedicata con giochi educativi e favole.</li>
                    <li className="flex items-start gap-2"><span className="text-yellow-500 mt-1">★</span> Pupazzi e peluche ufficiali dei personaggi.</li>
                </ul>
                <div className="mt-4 p-3 bg-white rounded-xl border border-yellow-200 text-sm text-gray-600 font-bold">
                    L’obiettivo è costruire una piattaforma educativa completa dove tornare giorno dopo giorno.
                </div>
            </div>
        </div>

        {/* SECTION: SICUREZZA */}
        <section className="mb-12 bg-green-50 p-6 md:p-8 rounded-[30px] border-l-8 border-green-500 shadow-sm">
            <h3 className="text-2xl font-black text-green-600 mb-4 flex items-center gap-2">
                🔐 Sicurezza e Affidabilità
            </h3>
            <p className="text-lg font-medium text-gray-700 mb-4">Il progetto segue linee guida chiare per garantire:</p>
            <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-2 bg-white px-4 py-3 rounded-xl border border-green-200 shadow-sm">
                    <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-black">✓</div>
                    <span className="font-bold text-gray-700">Contenuti privi di pubblicità invasiva</span>
                </div>
                <div className="flex items-center gap-2 bg-white px-4 py-3 rounded-xl border border-green-200 shadow-sm">
                    <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-black">✓</div>
                    <span className="font-bold text-gray-700">Linguaggio semplice e adatto</span>
                </div>
                <div className="flex items-center gap-2 bg-white px-4 py-3 rounded-xl border border-green-200 shadow-sm">
                    <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-black">✓</div>
                    <span className="font-bold text-gray-700">Assenza di temi violenti</span>
                </div>
                <div className="flex items-center gap-2 bg-white px-4 py-3 rounded-xl border border-green-200 shadow-sm">
                    <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-black">✓</div>
                    <span className="font-bold text-gray-700">Musica per pubblico 3-15 anni</span>
                </div>
                <div className="flex items-center gap-2 bg-white px-4 py-3 rounded-xl border border-green-200 shadow-sm sm:col-span-2">
                    <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-black">✓</div>
                    <span className="font-bold text-gray-700">Rispetto delle normative sulla privacy</span>
                </div>
            </div>
        </section>

        {/* SECTION: LINK UTILI */}
        <section className="mb-8">
            <div className="text-center mb-8">
                <h3 className="text-3xl font-black text-gray-800 mb-2">🔗 I Nostri Canali</h3>
                <p className="text-gray-600 text-lg">Segui le avventure di Boo, ascolta la musica e unisciti alla community!</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {SOCIAL_LINKS.map((link) => (
                    <a 
                        key={link.name}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`
                            flex items-center gap-3 px-4 py-4 rounded-xl text-white font-bold transition-all hover:scale-105 active:scale-95 shadow-md hover:shadow-lg
                            ${link.color}
                        `}
                    >
                        <link.icon size={24} />
                        <span className="truncate flex-1 text-left">{link.name}</span>
                        <ExternalLink size={16} className="opacity-70" />
                    </a>
                ))}
            </div>
        </section>

        {/* FOOTER BUTTON */}
        <div className="flex justify-center mt-12">
            <button 
                onClick={() => { setView(AppView.HOME); window.scrollTo(0, 0); }}
                className="bg-red-500 text-white font-black py-4 px-10 rounded-full border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:scale-105 active:shadow-none active:translate-y-1 transition-all flex items-center gap-2 text-xl"
            >
                <ArrowLeft size={28} strokeWidth={3} /> TORNA ALLA HOME
            </button>
        </div>

      </div>
    </div>
  );
};

export default AboutPage;

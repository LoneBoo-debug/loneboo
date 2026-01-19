import React, { useEffect } from 'react';
import { 
  Info, Instagram, Facebook, Youtube, X, Music, 
  Heart, Send, ExternalLink, Globe, 
  ShieldCheck, Sparkles, BookOpen, CheckCircle2,
  Tv, Gamepad2, Star, School, Library, GraduationCap, Palette, MessageCircle, Book
} from 'lucide-react';
import { AppView } from '../types';
import { OFFICIAL_LOGO } from '../constants';

const BTN_CLOSE_IMG = 'https://i.postimg.cc/0NdtYdcJ/tasto-chiudi-(1)-(1).png';

const SOCIAL_LINKS = [
    { name: 'YouTube', url: 'https://www.youtube.com/@ILoneBoo', icon: Youtube, color: 'text-red-600' },
    { name: 'Instagram', url: 'https://www.instagram.com/loneboo_official', icon: Instagram, color: 'text-pink-600' },
    { name: 'TikTok', url: 'https://www.tiktok.com/@lone_._boo', icon: Music, color: 'text-slate-900' },
    { name: 'Facebook', url: 'https://www.facebook.com/LoneBooOfficialPage/', icon: Facebook, color: 'text-blue-600' },
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
    <div className="fixed inset-0 z-0 overflow-y-auto no-scrollbar">
      
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
      <div className="relative z-10 max-w-6xl mx-auto p-4 md:p-6 pt-32 md:pt-40 pb-32">
        
        {/* Intestazione Principale */}
        <div className="text-center mb-8">
            <h2 
                className="text-4xl md:text-6xl font-cartoon text-[#ef4444] tracking-tight leading-none"
                style={{ 
                    WebkitTextStroke: '1.5px white', 
                    textShadow: '6px 6px 0px rgba(0,0,0,0.1)',
                }}
            >
               Chi Siamo
            </h2>
            <div className="inline-block bg-white/80 border-4 border-white px-6 py-1 rounded-full shadow-md mt-3">
                <p className="text-xs md:text-sm font-black text-blue-600 uppercase tracking-tighter">
                    Il Progetto Educativo Lone Boo World 👻
                </p>
            </div>
        </div>

        {/* GRIGLIA COMPATTA BENTO-STYLE */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
            
            {/* 1. INTRODUZIONE */}
            <div className="bg-white/50 backdrop-blur-md p-5 rounded-[30px] border-4 border-white shadow-lg flex flex-col md:col-span-2">
                <div className="flex items-center gap-3 mb-3 border-b-2 border-white/50 pb-2">
                    <Star className="text-yellow-500 fill-yellow-500" size={28} />
                    <h3 className="text-lg font-black text-slate-800 uppercase leading-none">Il Protagonista: Lone Boo</h3>
                </div>
                <div className="text-sm md:text-lg font-bold text-slate-700 leading-relaxed space-y-4">
                    <p>
                        Lone Boo è un progetto educativo e multimediale italiano dedicato ai bambini, nato dall’incontro tra creatività, narrazione, musica ed educazione. Al centro dell’universo c’è Lone Boo, un simpatico fantasmino curioso e gentile, che accompagna i bambini in un percorso fatto di storie, canzoni, giochi e apprendimento.
                    </p>
                    <p>
                        Il progetto nasce come esperienza artistica e musicale, ma nel tempo si è evoluto fino a diventare un ecosistema digitale completo, pensato per supportare la crescita cognitiva, emotiva e scolastica dei più piccoli.
                    </p>
                </div>
            </div>

            {/* 2. UNIVERSO NARRATIVO */}
            <div className="bg-white/50 backdrop-blur-md p-5 rounded-[30px] border-4 border-white shadow-lg flex flex-col">
                <div className="flex items-center gap-3 mb-3 border-b-2 border-white/50 pb-2">
                    <Sparkles className="text-pink-500" size={24} />
                    <h3 className="text-lg font-black text-slate-800 uppercase leading-none">Universo Narrativo</h3>
                </div>
                <p className="text-[13px] font-bold text-slate-700 leading-relaxed mb-3">
                    Lone Boo vive in un mondo colorato e accogliente che stimola:
                </p>
                <div className="grid grid-cols-2 gap-2">
                    {['FANTASIA', 'CURIOSITÀ', 'EMPATIA', 'STUDIO'].map(t => (
                        <div key={t} className="bg-pink-100/50 p-2 rounded-xl text-center font-black text-[10px] text-pink-700 border border-pink-200">{t}</div>
                    ))}
                </div>
            </div>

            {/* 3. MUSICA EDUCATIVA */}
            <div className="bg-white/50 backdrop-blur-md p-5 rounded-[30px] border-4 border-white shadow-lg flex flex-col">
                <div className="flex items-center gap-3 mb-3 border-b-2 border-white/50 pb-2">
                    <Music className="text-green-600" size={24} />
                    <h3 className="text-lg font-black text-slate-800 uppercase leading-none">Musica & Canzoni</h3>
                </div>
                <p className="text-[13px] font-bold text-slate-700 leading-relaxed">
                    La musica è il punto di partenza. Attraverso brani originali affrontiamo temi come le emozioni, l'amicizia e le buone abitudini. Disponibili su Spotify, Apple Music e Amazon Music.
                </p>
            </div>

            {/* 4. YOUTUBE VIDEO */}
            <div className="bg-red-50/80 backdrop-blur-md p-5 rounded-[30px] border-4 border-red-500 shadow-lg flex flex-col md:col-span-2">
                <div className="flex items-center gap-3 mb-3 border-b-2 border-red-200 pb-2">
                    <Tv className="text-red-600" size={28} />
                    <h3 className="text-lg font-black text-red-700 uppercase leading-none">Video e Contenuti Visivi</h3>
                </div>
                <p className="text-sm md:text-base font-bold text-red-900 leading-relaxed mb-4">
                    Il canale YouTube Lone Boo ospita serie animate prodotte con amore per intrattenere i più piccoli, con balletti e hit musicali per stimolare il coordinamento motorio attraverso coreografie semplici.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white/40 p-3 rounded-2xl border border-red-200">
                        <span className="font-black text-red-600 text-xs uppercase block mb-1">Animazione</span>
                        <p className="text-[11px] font-bold text-red-800">Serie animate e cartoni musicali per il coinvolgimento attivo.</p>
                    </div>
                    <div className="bg-white/40 p-3 rounded-2xl border border-red-200">
                        <span className="font-black text-red-600 text-xs uppercase block mb-1">Storytelling</span>
                        <p className="text-[11px] font-bold text-red-800">Contenuti narrativi e momenti di scoperta del mondo.</p>
                    </div>
                </div>
            </div>

            {/* 5. SCUOLA ARCOBALENO */}
            <div className="bg-blue-600 text-white p-6 rounded-[35px] border-4 border-black shadow-xl flex flex-col md:col-span-2">
                <div className="flex items-center gap-3 mb-4 border-b-2 border-white/20 pb-2">
                    <GraduationCap size={32} />
                    <h3 className="text-xl md:text-2xl font-black uppercase leading-none">Scuola Arcobaleno – L’educazione al centro</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <p className="text-sm md:text-base font-bold leading-relaxed">
                            Sezione educativa dedicata alla scuola primaria (1ª-5ª elementare). Uno spazio strutturato, chiaro e rassicurante basato sui **programmi ministeriali del Ministero dell’Istruzione italiano**.
                        </p>
                        <ul className="space-y-1">
                            {['Italiano', 'Matematica', 'Storia', 'Geografia', 'Scienze'].map(m => (
                                <li key={m} className="flex items-center gap-2 text-xs font-black"><CheckCircle2 size={14} /> {m.toUpperCase()}</li>
                            ))}
                        </ul>
                    </div>
                    <div className="bg-white/10 p-4 rounded-2xl border border-white/20">
                        <div className="flex items-center gap-2 mb-2">
                            <MessageCircle size={18} className="text-yellow-400" />
                            <span className="font-black text-sm uppercase text-yellow-400">AI Magica</span>
                        </div>
                        <p className="text-[11px] font-bold leading-tight italic">
                            Integrata con l'intelligenza artificiale della Maestra Ornella, pronta a rispondere a ogni domanda didattica dei bambini in tempo reale.
                        </p>
                    </div>
                </div>
            </div>

            {/* 6. RUOLO INSEGNANTE */}
            <div className="bg-white/50 backdrop-blur-md p-5 rounded-[30px] border-4 border-white shadow-lg flex flex-col">
                <div className="flex items-center gap-3 mb-3 border-b-2 border-white/50 pb-2">
                    <School className="text-blue-600" size={24} />
                    <h3 className="text-lg font-black text-slate-800 uppercase leading-none">Il ruolo del docente</h3>
                </div>
                <p className="text-[11px] font-bold text-slate-700 leading-relaxed">
                    La competenza e l’autorevolezza del docente sono insostituibili. Scuola Arcobaleno nasce come supporto per affiancare lo studio a casa e rinforzare gli apprendimenti in modo sereno.
                </p>
            </div>

            {/* 7. LIBRI AMAZON */}
            <div className="bg-white/50 backdrop-blur-md p-5 rounded-[30px] border-4 border-white shadow-lg flex flex-col">
                <div className="flex items-center gap-3 mb-3 border-b-2 border-white/50 pb-2">
                    <BookOpen className="text-orange-600" size={24} />
                    <h3 className="text-lg font-black text-slate-800 uppercase leading-none">Libri e Pubblicazioni</h3>
                </div>
                <p className="text-[11px] font-bold text-slate-700 leading-relaxed">
                    L'esperienza continua fuori dallo schermo con i libri disponibili su Amazon, favorendo il contatto con la carta, la lettura condivisa e l'immaginazione.
                </p>
            </div>

            {/* 8. SEZIONI LUDICHE */}
            <div className="bg-white/50 backdrop-blur-md p-5 rounded-[30px] border-4 border-white shadow-lg flex flex-col md:col-span-2">
                <div className="flex items-center gap-3 mb-4 border-b-2 border-white/50 pb-2">
                    <Gamepad2 className="text-purple-600" size={28} />
                    <h3 className="text-lg font-black text-slate-800 uppercase leading-none">Le sezioni ludiche e creative</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {[
                        { icon: Gamepad2, label: "Giochi", desc: "Logica e memoria" },
                        { icon: Library, label: "Fiabe", desc: "Audiofiabe magiche" },
                        { icon: Music, label: "Dischi", desc: "Attività sonore" },
                        { icon: Star, label: "Magia", desc: "Cacce al tesoro" },
                        { icon: Palette, label: "Fan Art", desc: "Condividi i disegni" },
                        { icon: Book, label: "Accademia", desc: "PDF da stampare" }
                    ].map((sec, i) => (
                        <div key={i} className="p-2 bg-white/40 rounded-xl border border-white/50 flex flex-col items-center text-center">
                            <sec.icon className="text-purple-600 mb-1" size={16} />
                            <span className="font-black text-[10px] text-slate-800 uppercase leading-none">{sec.label}</span>
                            <span className="text-[8px] font-bold text-slate-500 uppercase">{sec.desc}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* 9. MISSIONE E FUTURO */}
            <div className="bg-yellow-400 p-6 rounded-[35px] border-4 border-black shadow-lg flex flex-col md:col-span-2">
                <div className="flex items-center gap-3 mb-2">
                    <ShieldCheck className="text-black" size={24} />
                    <h3 className="text-lg font-black text-black uppercase leading-none">La missione di Lone Boo</h3>
                </div>
                <p className="text-sm md:text-lg font-bold text-slate-800 leading-relaxed italic">
                    "Unire intrattenimento di qualità ed educazione, creando un mondo dove i bambini possano giocare, ascoltare, leggere e imparare accompagnati da un personaggio amico."
                </p>
            </div>

            {/* 10. SOCIAL LINKS (FOOTER) */}
            <div className="md:col-span-2 bg-white/40 p-4 rounded-[30px] border-2 border-white/50 mt-4">
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
            <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] text-center">Lone Boo World • 2025</p>
        </div>

      </div>
    </div>
  );
};

export default AboutPage;
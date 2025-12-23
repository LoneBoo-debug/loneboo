
import React, { useEffect } from 'react';
import { Map, Home, Gamepad2, BookOpen, Save, QrCode, MessageCircle, Palette, Sparkles, Star, X, Utensils, Bath, Bed, Tv, Wand2, Ticket, Repeat, CheckCircle2, Package, Target, Coins, AlertCircle } from 'lucide-react';
import { AppView } from '../types';

const INFO_BG = 'https://i.postimg.cc/brjgmCV4/sfondoinfo.jpg';
const BTN_CLOSE_IMG = 'https://i.postimg.cc/0NdtYdcJ/tasto-chiudi-(1)-(1).png';

interface GuidePageProps {
    setView: (view: AppView) => void;
}

const GuidePage: React.FC<GuidePageProps> = ({ setView }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleExit = () => setView(AppView.INFO_MENU);

  const gameList = [
    { name: "Quiz Spettrale", color: "text-purple-500" },
    { name: "Memory di Boo", color: "text-blue-500" },
    { name: "Tris Magico", color: "text-green-500" },
    { name: "Acchiappa Boo", color: "text-red-500" },
    { name: "Simon Boo", color: "text-yellow-500" },
    { name: "Morra Mostruosa", color: "text-orange-500" },
    { name: "Indovina Chi (Arcade)", color: "text-pink-500" },
    { name: "Scacchi Reali", color: "text-indigo-500" },
    { name: "Dama Classica", color: "text-teal-500" },
    { name: "Matematica Magica", color: "text-cyan-500" },
    { name: "Parola Misteriosa", color: "text-purple-600" },
    { name: "Indovina Numero", color: "text-blue-600" },
    { name: "Trova l'Intruso", color: "text-green-600" },
    { name: "Forza 4", color: "text-teal-600" }
  ];

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
               Guida App
            </h2>
            <div className="inline-flex items-center gap-2 bg-yellow-400 text-black px-6 py-2 rounded-full text-lg font-black border-4 border-black shadow-lg uppercase tracking-wide transform -rotate-1">
                 <BookOpen size={24} />
                 <span>Manuale Utente</span>
            </div>
        </div>

        <div className="space-y-10">

            {/* 1. CITTA COLORATA */}
            <div className="border-l-[8px] border-blue-500 bg-white/70 backdrop-blur-md pl-6 py-6 pr-6 rounded-r-3xl shadow-xl border-y border-r border-white/30">
                <h3 className="text-2xl font-black text-blue-800 mb-4 flex items-center gap-3 tracking-tight">
                    <Map className="text-blue-500" size={32} />
                    1. Città Colorata (La Mappa)
                </h3>
                <p className="text-gray-700 font-bold mb-4 leading-relaxed">
                    Questa è la schermata principale per esplorare il mondo esterno. Clicca sui vari edifici per entrare nelle sezioni:
                </p>
                <ul className="grid md:grid-cols-2 gap-3 text-sm font-bold text-gray-800">
                    <li className="bg-blue-100/50 p-3 rounded-xl border border-blue-200"><strong>Torre Magica:</strong> Giochi con l'IA (Dadi, Caccia al Tesoro).</li>
                    <li className="bg-blue-100/50 p-3 rounded-xl border border-blue-200"><strong>Cinema:</strong> Guarda tutti i video e cartoni di Lone Boo.</li>
                    <li className="bg-blue-100/50 p-3 rounded-xl border border-blue-200"><strong>Parco Giochi:</strong> Minigiochi per guadagnare gettoni!</li>
                    <li className="bg-blue-100/50 p-3 rounded-xl border border-blue-200"><strong>Discoteca:</strong> Suona strumenti e crea ritmi.</li>
                    <li className="bg-blue-100/50 p-3 rounded-xl border border-blue-200"><strong>Accademia:</strong> Scarica e stampa disegni da colorare.</li>
                    <li className="bg-blue-100/50 p-3 rounded-xl border border-blue-200"><strong>Museo:</strong> Guarda i disegni inviati dagli altri bambini.</li>
                    <li className="bg-blue-100/50 p-3 rounded-xl border border-blue-200"><strong>Info Point:</strong> Chatta con Lone Boo!</li>
                </ul>
            </div>

            {/* 2. PARCO GIOCHI & EDICOLA */}
            <div className="border-l-[8px] border-green-500 bg-white/70 backdrop-blur-md pl-6 py-6 pr-6 rounded-r-3xl shadow-xl border-y border-r border-white/30">
                <h3 className="text-2xl font-black text-green-800 mb-4 flex items-center gap-3 tracking-tight">
                    <Gamepad2 className="text-green-500" size={32} />
                    2. Parco Giochi & Edicola
                </h3>
                <p className="text-gray-700 font-bold mb-4 leading-relaxed text-lg">
                    Il Parco Giochi è il cuore pulsante dell'app! Qui trovi una collezione incredibile di minigiochi originali per allenare la mente e i riflessi. Giocando vincerai i <strong>Gettoni d'Oro 🪙</strong> necessari per l'Edicola.
                </p>
                
                <div className="bg-white/50 rounded-2xl p-6 border-2 border-green-200 mb-6 shadow-inner">
                    <p className="text-green-800 font-black uppercase text-sm mb-4 flex items-center gap-2">
                        <Sparkles size={18} className="animate-pulse" /> Alcuni dei giochi che troverai:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                        {gameList.map((game, idx) => (
                            <div key={idx} className="flex items-center gap-3">
                                <CheckCircle2 size={16} className={game.color} strokeWidth={3} />
                                <span className="font-black text-gray-700 text-sm md:text-base">{game.name}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-green-100/50 p-5 rounded-2xl border-2 border-green-200">
                    <p className="text-sm font-black uppercase text-green-900 mb-3">Cosa fare all'Edicola:</p>
                    <ul className="list-disc pl-5 space-y-2 text-sm text-gray-800 font-bold">
                        <li>Compra <strong>Pacchetti di Figurine</strong> con i tuoi gettoni.</li>
                        <li>Completa l'<strong>Album Volume 1</strong> per sbloccare il <strong>Volume 2 (Gold Edition)</strong>!</li>
                        <li>Se trovi <strong>5 doppioni</strong>, puoi scambiarli per un pacchetto gratis cliccando su "SCAMBIA".</li>
                        <li>Sblocca i <strong>Livelli Difficili</strong> dei giochi completando l'album o usando i gettoni.</li>
                    </ul>
                </div>
            </div>

            {/* 3. COME SALVARE */}
            <div className="border-l-[8px] border-purple-500 bg-white/70 backdrop-blur-md pl-6 py-6 pr-6 rounded-r-3xl shadow-xl border-y border-r border-white/30">
                <h3 className="text-2xl font-black text-purple-800 mb-4 flex items-center gap-3 tracking-tight">
                    <Save className="text-purple-500" size={32} />
                    3. Come Salvare (La Tessera)
                </h3>
                <p className="text-red-600 font-black mb-4 text-base bg-red-50 p-3 rounded-xl border-2 border-red-100">
                    ATTENZIONE: I tuoi progressi sono salvati solo sul tuo telefono. Se cambi dispositivo o cancelli la cronologia, rischi di perderli!
                </p>
                <div className="bg-purple-100/50 p-5 rounded-2xl border-2 border-purple-200">
                    <p className="text-sm font-black text-purple-900 mb-3 uppercase flex items-center gap-2">
                        <QrCode size={18}/> Come mettere i dati al sicuro:
                    </p>
                    <ol className="list-decimal pl-5 space-y-2 text-sm text-gray-800 font-bold">
                        <li>Vai all'<strong>Edicola</strong> e tocca <strong>TESSERA</strong>.</li>
                        <li>Personalizza il tuo <strong>Avatar</strong> con il tasto matita.</li>
                        <li>Tocca <strong>SCARICA TESSERA</strong> per salvare l'immagine col tuo QR Code segreto nel telefono.</li>
                        <li>Se cambi telefono, usa <strong>SCANSIONA</strong> o <strong>CARICA</strong> per recuperare tutto all'istante!</li>
                    </ol>
                </div>
            </div>

            {/* 4. LA CASA DI BOO */}
            <div className="border-l-[8px] border-orange-500 bg-white/70 backdrop-blur-md pl-6 py-6 pr-6 rounded-r-3xl shadow-xl border-y border-r border-white/30">
                <h3 className="text-2xl font-black text-orange-800 mb-4 flex items-center gap-3 tracking-tight">
                    <Home className="text-orange-500" size={32} />
                    4. La Casa di Boo
                </h3>
                <p className="text-gray-700 font-bold mb-6">
                    Entra nella casa per esplorare le stanze. Molti oggetti nascondono segreti:
                </p>
                
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-orange-50 p-4 rounded-2xl border border-orange-200">
                        <h4 className="font-black text-orange-700 flex items-center gap-2 mb-2"><Tv size={18}/> Salotto & Amici 🛋️</h4>
                        <p className="text-xs font-bold text-gray-600">Incontra gli abitanti della città e scopri chi è Lone Boo.</p>
                    </div>
                    
                    <div className="bg-orange-50 p-4 rounded-2xl border border-orange-200 flex flex-col gap-3">
                        <div>
                            <h4 className="font-black text-orange-700 flex items-center gap-2 mb-2"><Bed size={18}/> Cameretta & Cielo 🛌</h4>
                            <p className="text-xs font-bold text-gray-600">Usa il <strong>Telescopio</strong> per vedere le stelle o apri il <strong>Baule dei Segreti</strong>.</p>
                        </div>
                        
                        {/* INFO BAULE INTEGRATA SOTTO LA CAMERETTA */}
                        <div className="mt-2 pt-3 border-t border-orange-200/50">
                            <div className="flex items-center gap-2 mb-3">
                                <Package className="text-orange-500" size={16} />
                                <span className="text-xs font-black text-orange-800 uppercase tracking-tight">I Segreti del Baule</span>
                            </div>
                            <div className="grid grid-cols-1 gap-2">
                                <div className="flex items-center gap-2 bg-white/40 p-2 rounded-xl border border-orange-100">
                                    <Coins className="text-yellow-500 shrink-0" size={16} />
                                    <span className="text-[10px] font-bold text-gray-600"><strong>Gratta e Vinci:</strong> Gettoni istantanei! 🪙</span>
                                </div>
                                <div className="flex items-center gap-2 bg-white/40 p-2 rounded-xl border border-orange-100">
                                    <Target className="text-red-500 shrink-0" size={16} />
                                    <span className="text-[10px] font-bold text-gray-600"><strong>Tiro alla Fionda:</strong> Abbatti i barattoli! 🏹</span>
                                </div>
                                <div className="flex items-center gap-2 bg-white/20 p-2 rounded-xl border border-orange-50 border-dashed">
                                    <Repeat className="text-blue-400 shrink-0" size={16} />
                                    <span className="text-[10px] font-black text-blue-400">GIOCO DELL'OCA (IN ARRIVO!)</span>
                                </div>
                            </div>
                            <div className="mt-3 flex items-center gap-2 opacity-70">
                                <AlertCircle className="text-orange-600 shrink-0" size={12} />
                                <p className="text-[9px] text-orange-900 font-bold italic">Richiedono autorizzazione genitori ⚙️</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-orange-50 p-4 rounded-2xl border border-orange-200">
                        <h4 className="font-black text-orange-700 flex items-center gap-2 mb-2"><Utensils size={18}/> Cucina & Gnam 🍳</h4>
                        <p className="text-xs font-bold text-gray-600">Impara il <strong>Riciclo</strong> e gioca a <strong>Caccia alla Frutta</strong>.</p>
                    </div>
                    
                    <div className="bg-orange-50 p-4 rounded-2xl border border-orange-200">
                        <h4 className="font-black text-orange-700 flex items-center gap-2 mb-2"><Bath size={18}/> Bagno & Igiene 🛁</h4>
                        <p className="text-xs font-bold text-gray-600">Lavati i denti o scoppia le <strong>Bolle di Sapone</strong>!</p>
                    </div>
                </div>
            </div>

            {/* 5. MAGIA E ACCESSIBILITA */}
            <div className="border-l-[8px] border-cyan-500 bg-white/70 backdrop-blur-md pl-6 py-6 pr-6 rounded-r-3xl shadow-xl border-y border-r border-white/30">
                <h3 className="text-2xl font-black text-cyan-800 mb-4 flex items-center gap-3 tracking-tight">
                    <Wand2 className="text-cyan-500" size={32} />
                    5. Magia per Tutti
                </h3>
                <p className="text-gray-700 font-bold mb-4">
                    Lone Boo vuole bene a tutti i bambini! Clicca sul tasto <strong>"+"</strong> in alto e seleziona <strong>"Magia"</strong> per attivare:
                </p>
                <ul className="space-y-2 text-sm font-bold text-gray-800">
                    <li className="flex gap-2">✨ <strong>Font Leggibile:</strong> Un carattere speciale per chi ha difficoltà a leggere (Dislessia).</li>
                    <li className="flex gap-2">✨ <strong>Super Colori:</strong> Aumenta il contrasto per vedere meglio ogni dettaglio.</li>
                    <li className="flex gap-2">✨ <strong>Modo Calmo:</strong> Ferma le animazioni se preferisci un'esperienza più tranquilla.</li>
                </ul>
            </div>

        </div>
      </div>
    </div>
  );
};

export default GuidePage;

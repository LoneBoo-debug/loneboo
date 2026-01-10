
import React, { useEffect } from 'react';
import { 
  Map, Home, Gamepad2, BookOpen, Save, QrCode, 
  MessageCircle, Palette, Sparkles, Star, X, 
  Utensils, Bath, Bed, Tv, Wand2, Ticket, 
  Repeat, CheckCircle2, Package, Target, 
  Coins, AlertCircle, Eye, ZapOff, Type, Heart, 
  Store, Camera, Info, Search, Lock
} from 'lucide-react';
import { AppView } from '../types';

const BTN_CLOSE_IMG = 'https://i.postimg.cc/0NdtYdcJ/tasto-chiudi-(1)-(1).png';

interface GuidePageProps {
    setView: (view: AppView) => void;
}

const GuidePage: React.FC<GuidePageProps> = ({ setView }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      
      {/* SFONDO AZZURRO INTENSO E FISSO */}
      <div className="fixed inset-0 bg-[#bae6fd] z-0"></div>
      
      {/* STRATO EFFETTO SPECCHIO/VETRO */}
      <div className="fixed inset-0 bg-white/20 backdrop-blur-[45px] z-[1] pointer-events-none border-t-8 border-white/30"></div>
      
      {/* TASTO CHIUDI FISSO - MODIFICATO PER TORNARE IN HOME */}
      <button 
          onClick={() => setView(AppView.HOME)}
          className="fixed top-20 right-4 z-[100] hover:scale-110 active:scale-95 transition-all outline-none"
          aria-label="Chiudi"
      >
          <img src={BTN_CLOSE_IMG} alt="Chiudi" className="w-16 h-16 md:w-20 md:h-20 object-contain drop-shadow-2xl" />
      </button>

      {/* CONTENUTO SCROLLABILE - Aumentato pt per abbassare il contenuto */}
      <div className="relative z-10 max-w-5xl mx-auto p-4 md:p-6 pt-32 md:pt-40 animate-fade-in pb-24">
        
        {/* Intestazione Principale - Ridotte dimensioni text-4xl/6xl */}
        <div className="text-center mb-8">
            <h2 
                className="text-4xl md:text-6xl font-cartoon text-[#ef4444] tracking-tight leading-none"
                style={{ 
                    WebkitTextStroke: '1.5px white', 
                    textShadow: '6px 6px 0px rgba(0,0,0,0.1)',
                }}
            >
               Come Funziona
            </h2>
            <div className="inline-block bg-white/80 border-4 border-white px-6 py-1 rounded-full shadow-md mt-3">
                <p className="text-xs md:text-sm font-black text-blue-600 uppercase tracking-tighter">
                    Manuale Magico di Lone Boo 👻
                </p>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            
            {/* 1. CITTÀ COLORATA */}
            <section className="bg-white/50 backdrop-blur-md p-5 rounded-[35px] border-4 border-white shadow-lg flex flex-col">
                <div className="flex items-center gap-3 mb-4 border-b-2 border-white/50 pb-2">
                    <Map className="text-blue-500" size={28} />
                    <h3 className="text-xl md:text-2xl font-black text-slate-800 uppercase tracking-tight leading-none">1. Città Colorata</h3>
                </div>
                <p className="text-sm font-bold text-slate-700 mb-4">Questa è la schermata principale per esplorare il mondo esterno. Clicca sui vari edifici per entrare nelle sezioni:</p>
                <div className="grid grid-cols-1 gap-2">
                    {[
                        { icon: Wand2, label: "Torre Magica", desc: "Giochi con l'IA (Dadi, Caccia al Tesoro)." },
                        { icon: Tv, label: "Cinema", desc: "Guarda tutti i video e cartoni di Lone Boo." },
                        { icon: Gamepad2, label: "Parco Giochi", desc: "Minigiochi per guadagnare gettoni!" },
                        { icon: Star, label: "Discoteca", desc: "Suona strumenti e crea ritmi." },
                        { icon: Palette, label: "Accademia", desc: "Scarica e stampa disegni da colorare." },
                        { icon: Info, label: "Museo", desc: "Guarda i disegni inviati dagli altri bambini." },
                        { icon: MessageCircle, label: "Info Point", desc: "Chatta con Lone Boo!" }
                    ].map((item, i) => (
                        <div key={i} className="flex items-center gap-3 p-2 bg-white/40 rounded-xl border border-white/50">
                            <item.icon className="text-blue-600 shrink-0" size={16} />
                            <p className="text-xs font-bold text-slate-700"><span className="font-black uppercase text-blue-800">{item.label}:</span> {item.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* 2. PARCO GIOCHI & EDICOLA */}
            <section className="bg-white/50 backdrop-blur-md p-5 rounded-[35px] border-4 border-white shadow-lg flex flex-col">
                <div className="flex items-center gap-3 mb-4 border-b-2 border-white/50 pb-2">
                    <Gamepad2 className="text-green-600" size={28} />
                    <h3 className="text-xl md:text-2xl font-black text-slate-800 uppercase tracking-tight leading-none">2. Parco & Edicola</h3>
                </div>
                <p className="text-sm font-bold text-slate-700 mb-3">Il Parco Giochi è il cuore pulsante dell'app! Qui trovi una collezione incredibile di minigiochi originali per allenare la mente e i riflessi. Giocando vincerai i <strong>Gettoni d'Oro 🪙</strong> necessari per l'Edicola.</p>
                
                <div className="flex flex-wrap gap-1 mb-4">
                    {["Quiz Spettrale", "Memory di Boo", "Tris Magico", "Acchiappa Boo", "Simon Boo", "Morra Mostruosa", "Indovina Chi (Arcade)", "Scacchi Reali", "Dama Classica", "Matematica Magica", "Parola Misteriosa", "Indovina Numero", "Trova l'Intruso", "Forza 4"].map((game, i) => (
                        <span key={i} className="px-2 py-0.5 bg-green-100/50 border border-green-200 rounded-full text-[10px] font-black text-green-700 uppercase">{game}</span>
                    ))}
                </div>

                <div className="bg-blue-600/10 p-4 rounded-2xl border-2 border-dashed border-blue-400 mt-auto">
                    <h4 className="text-sm font-black text-blue-800 mb-2 uppercase flex items-center gap-2"><Store size={16}/> Cosa fare all'Edicola:</h4>
                    <ul className="space-y-1 text-[11px] font-bold text-slate-700">
                        <li className="flex items-start gap-2"><CheckCircle2 className="text-blue-500 shrink-0" size={14} /> Compra Pacchetti di Figurine con i tuoi gettoni.</li>
                        <li className="flex items-start gap-2"><CheckCircle2 className="text-blue-500 shrink-0" size={14} /> Completa l'Album Volume 1 per sbloccare il Volume 2 (Gold Edition)!</li>
                        <li className="flex items-start gap-2"><CheckCircle2 className="text-blue-500 shrink-0" size={14} /> Se trovi 5 doppioni, puoi scambiarli per un pacchetto gratis cliccando su "SCAMBIA".</li>
                        <li className="flex items-start gap-2"><CheckCircle2 className="text-blue-500 shrink-0" size={14} /> Sblocca i Livelli Difficili dei giochi completando l'album o usando i gettoni.</li>
                    </ul>
                </div>
            </section>

            {/* 3. COME SALVARE */}
            <section className="bg-white/50 backdrop-blur-md p-5 rounded-[35px] border-4 border-white shadow-lg md:col-span-2">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-4 border-b-2 border-white/50 pb-2">
                            <Save className="text-orange-500" size={28} />
                            <h3 className="text-xl md:text-2xl font-black text-slate-800 uppercase tracking-tight leading-none">3. Come Salvare (La Tessera)</h3>
                        </div>
                        <div className="bg-red-50 p-3 rounded-xl border-2 border-red-200 mb-4 flex gap-3 items-center">
                            <AlertCircle className="text-red-500 shrink-0" size={24} />
                            <p className="text-red-800 font-black text-xs leading-tight">ATTENZIONE: I tuoi progressi sono salvati solo sul tuo telefono. Se cambi dispositivo o cancelli la cronologia, rischi di perderli!</p>
                        </div>
                    </div>
                    <div className="flex-1 grid grid-cols-2 gap-2">
                        {[
                            { icon: Store, text: "Vai all'Edicola e tocca TESSERA." },
                            { icon: Palette, text: "Personalizza il tuo Avatar con il tasto matita." },
                            { icon: QrCode, text: "Tocca SCARICA TESSERA per salvare il QR Code." },
                            { icon: Camera, text: "Usa SCANSIONA per recuperare tutto all'istante!" }
                        ].map((step, i) => (
                            <div key={i} className="flex items-center gap-2 p-2 bg-white/40 rounded-xl border border-white">
                                <div className="w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center font-black shrink-0 text-[10px]">{i+1}</div>
                                <p className="text-[10px] font-bold text-slate-700 leading-tight">{step.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 4. LA CASA DI BOO */}
            <section className="bg-white/50 backdrop-blur-md p-5 rounded-[35px] border-4 border-white shadow-lg md:col-span-2">
                <div className="flex items-center gap-3 mb-4 border-b-2 border-white/50 pb-2">
                    <Home className="text-purple-600" size={28} />
                    <h3 className="text-xl md:text-2xl font-black text-slate-800 uppercase tracking-tight leading-none">4. La Casa di Boo</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <div className="p-3 bg-orange-50 rounded-2xl border border-orange-200">
                            <span className="font-black text-orange-600 block text-[11px] uppercase mb-1">Salotto & Amici 🛋️</span>
                            <p className="text-[10px] font-bold text-slate-600 leading-tight">Incontra gli abitanti della città e scopri chi è Lone Boo.</p>
                        </div>
                        <div className="p-3 bg-purple-50 rounded-2xl border border-purple-200">
                            <span className="font-black text-purple-600 block text-[11px] uppercase mb-1">Cameretta & Cielo 🛌</span>
                            <p className="text-[10px] font-bold text-slate-600 leading-tight">Usa il Telescopio per vedere le stelle o apri il Baule dei Segreti.</p>
                        </div>
                    </div>
                    <div className="p-4 bg-slate-800 text-white rounded-2xl border-2 border-slate-900 shadow-inner flex flex-col justify-center">
                        <h4 className="text-xs font-black mb-3 uppercase text-yellow-400 flex items-center gap-2"><Package size={14} /> I Segreti del Baule</h4>
                        <ul className="space-y-2 font-bold text-[11px]">
                            <li className="flex items-center gap-2"><Ticket className="text-yellow-400" size={12}/> Gratta e Vinci: Gettoni! 🪙</li>
                            <li className="flex items-center gap-2"><Target className="text-red-400" size={12}/> Tiro alla Fionda! 🏹</li>
                            <li className="flex items-center gap-2 opacity-50"><Repeat className="text-blue-400" size={12}/> GIOCO DELL'OCA (IN ARRIVO)</li>
                        </ul>
                        <p className="mt-3 text-[9px] font-black text-gray-400 uppercase flex items-center gap-1 pt-2 border-t border-white/10"><Lock size={10} /> Autorizzazione genitori ⚙️</p>
                    </div>
                    <div className="space-y-2">
                        <div className="p-3 bg-yellow-50 rounded-2xl border border-yellow-200">
                            <span className="font-black text-yellow-700 block text-[11px] uppercase mb-1">Cucina & Gnam 🍳</span>
                            <p className="text-[10px] font-bold text-slate-600 leading-tight">Impara il Riciclo e gioca a Caccia alla Frutta.</p>
                        </div>
                        <div className="p-3 bg-cyan-50 rounded-2xl border border-cyan-200">
                            <span className="font-black text-cyan-700 block text-[11px] uppercase mb-1">Bagno & Igiene 🛁</span>
                            <p className="text-[10px] font-bold text-slate-600 leading-tight">Lavati i denti o scoppia le Bolle di Sapone!</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. MAGIA PER TUTTI */}
            <section className="bg-white/50 backdrop-blur-md p-5 rounded-[35px] border-4 border-white shadow-lg md:col-span-2">
                <div className="flex items-center gap-3 mb-4 border-b-2 border-white/50 pb-2">
                    <Sparkles className="text-pink-500" size={28} />
                    <h3 className="text-xl md:text-2xl font-black text-slate-800 uppercase tracking-tight leading-none">5. Magia per Tutti</h3>
                </div>
                <p className="text-sm font-bold text-slate-700 mb-4">Lone Boo vuole bene a tutti i bambini! Clicca sul tasto <strong>"+"</strong> in alto e seleziona <strong>"Magia"</strong> per attivare:</p>
                <div className="grid grid-cols-3 gap-3">
                    {[
                        { icon: Type, title: "Font Leggibile", desc: "Per chi ha difficoltà a leggere (Dislessia)." },
                        { icon: Eye, title: "Super Colori", desc: "Aumenta il contrasto per vedere meglio." },
                        { icon: ZapOff, title: "Modo Calmo", desc: "Ferma le animazioni se preferisci la tranquillità." }
                    ].map((feat, i) => (
                        <div key={i} className="bg-white/60 p-3 rounded-2xl border border-pink-100 flex flex-col items-center text-center">
                            <div className="bg-pink-100 p-2 rounded-full text-pink-600 mb-2">
                                <feat.icon size={20} />
                            </div>
                            <span className="font-black text-slate-800 uppercase text-[10px] mb-1">{feat.title}</span>
                            <p className="text-[9px] font-bold text-slate-500 leading-tight">{feat.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

        </div>

        <div className="flex flex-col items-center pb-12 mt-4 opacity-70">
            <Heart size={32} className="text-red-500 fill-red-500 mb-2 animate-pulse" />
            <p className="text-lg font-black text-slate-600 uppercase tracking-tighter text-center">Divertiti con Lone Boo! 👻</p>
        </div>

      </div>
    </div>
  );
};

export default GuidePage;

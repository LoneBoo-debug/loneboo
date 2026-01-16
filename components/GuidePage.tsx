import React, { useEffect } from 'react';
import { 
  Map, Home, Gamepad2, BookOpen, Save, QrCode, 
  MessageCircle, Palette, Sparkles, Star, X, 
  Utensils, Bath, Bed, Tv, Wand2, Ticket, 
  Repeat, CheckCircle2, Package, Target, 
  Coins, AlertCircle, Eye, ZapOff, Type, Heart, 
  Store, Camera, Info, Search, Lock, School, TrainFront, Book, Library, GraduationCap, Accessibility, Shield
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
    <div className="fixed inset-0 z-0 overflow-y-auto no-scrollbar">
      
      {/* SFONDO AZZURRO INTENSO E FISSO */}
      <div className="fixed inset-0 bg-[#bae6fd] z-0"></div>
      
      {/* STRATO EFFETTO SPECCHIO/VETRO */}
      <div className="fixed inset-0 bg-white/20 backdrop-blur-[45px] z-[1] pointer-events-none border-t-8 border-white/30"></div>
      
      {/* TASTO CHIUDI FISSO */}
      <button 
          onClick={() => setView(AppView.HOME)}
          className="fixed top-20 right-4 z-[100] hover:scale-110 active:scale-95 transition-all outline-none"
          aria-label="Chiudi"
      >
          <img src={BTN_CLOSE_IMG} alt="Chiudi" className="w-16 h-16 md:w-20 md:h-20 object-contain drop-shadow-2xl" />
      </button>

      {/* CONTENUTO SCROLLABILE */}
      <div className="relative z-10 max-w-5xl mx-auto p-4 md:p-6 pt-32 md:pt-40 pb-32">
        
        {/* Intestazione Principale */}
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
                        { icon: School, label: "Scuola", desc: "Il cuore didattico con il programma di 5 anni." },
                        { icon: MessageCircle, label: "Info Point", desc: "Chatta e chiedi informazioni a Maragno il ragno." },
                        { icon: Library, label: "Libreria", desc: "Area lettura e fantastici giochi di carte." },
                        { icon: BookOpen, label: "Biblioteca", desc: "Tutti i libri cartacei di Lone Boo su Amazon." },
                        { icon: TrainFront, label: "Stazione", desc: "Social e presto viaggi verso nuove città!" },
                        { icon: Tv, label: "Cinema", desc: "Guarda tutti i video e cartoni di Lone Boo." },
                        { icon: Gamepad2, label: "Parco Giochi", desc: "Minigiochi per guadagnare gettoni!" },
                        { icon: Wand2, label: "Torre Magica", desc: "Dadi, Caccia al Tesoro e AI Magic." },
                        { icon: Palette, label: "Accademia", desc: "Scarica e stampa disegni da colorare." },
                        { icon: Info, label: "Museo", desc: "Guarda i disegni degli altri bambini." },
                    ].map((item, i) => (
                        <div key={i} className="flex items-center gap-3 p-2 bg-white/40 rounded-xl border border-white/50">
                            <item.icon className="text-blue-600 shrink-0" size={16} />
                            <p className="text-xs font-bold text-slate-700"><span className="font-black uppercase text-blue-800">{item.label}:</span> {item.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* 2. LA SCUOLA DI LONE BOO */}
            <section className="bg-white/50 backdrop-blur-md p-5 rounded-[35px] border-4 border-white shadow-lg flex flex-col">
                <div className="flex items-center gap-3 mb-4 border-b-2 border-white/50 pb-2">
                    <GraduationCap className="text-purple-600" size={28} />
                    <h3 className="text-xl md:text-2xl font-black text-slate-800 uppercase tracking-tight leading-none">2. La Scuola</h3>
                </div>
                <p className="text-sm font-bold text-slate-700 mb-3">Abbiamo riprodotto un vero **percorso didattico di 5 anni**, ispirato al programma delle scuole elementari italiane.</p>
                
                <div className="space-y-2 mb-4">
                    <div className="p-3 bg-purple-50 rounded-2xl border border-purple-100">
                        <p className="text-xs font-bold text-purple-900 leading-tight">
                            Ogni classe (dalla 1ª alla 5ª) offre lezioni interattive di **Italiano, Matematica, Storia, Geografia e Scienze**, complete di audio-lettura e quiz di verifica.
                        </p>
                    </div>
                </div>

                <div className="bg-red-50 p-4 rounded-2xl border-2 border-red-200 mt-auto">
                    <h4 className="text-xs font-black text-red-700 mb-1 uppercase flex items-center gap-2"><AlertCircle size={14}/> Nota per i Genitori:</h4>
                    <p className="text-[10px] font-bold text-red-900 leading-tight italic">
                        Il programma didattico utilizzato, pur prendendo spunto da quello di stato della scuola italiana, non è da ritenersi sostitutivo di quello ufficiale ministeriale. È un supporto ludico-educativo.
                    </p>
                </div>
            </section>

            {/* 3. PARCO GIOCHI & TOMBOLA */}
            <section className="bg-white/50 backdrop-blur-md p-5 rounded-[35px] border-4 border-white shadow-lg flex flex-col">
                <div className="flex items-center gap-3 mb-4 border-b-2 border-white/50 pb-2">
                    <Gamepad2 className="text-green-600" size={28} />
                    <h3 className="text-xl md:text-2xl font-black text-slate-800 uppercase tracking-tight leading-none">3. Il Parco Giochi</h3>
                </div>
                <p className="text-sm font-bold text-slate-700 mb-3">Vinci i **Gettoni d'Oro 🪙** sfidando i tuoi amici in tantissimi giochi!</p>
                
                <div className="flex flex-wrap gap-1 mb-4">
                    {["Quiz", "Memory", "Tris", "Acchiappa Boo", "Simon", "Morra", "Tombola 🆕", "Scacchi", "Dama", "Matematica", "Parola Misteriosa", "Indovina Numero", "Intruso", "Forza 4"].map((game, i) => (
                        <span key={i} className="px-2 py-0.5 bg-green-100/50 border border-green-200 rounded-full text-[10px] font-black text-green-700 uppercase">{game}</span>
                    ))}
                </div>

                <div className="bg-blue-600/10 p-4 rounded-2xl border-2 border-dashed border-blue-400">
                    <h4 className="text-sm font-black text-blue-800 mb-2 uppercase flex items-center gap-2"><Store size={16}/> L'Edicola delle Figurine:</h4>
                    <p className="text-[11px] font-bold text-slate-700 leading-tight">
                        Usa i gettoni per comprare i pacchetti! Completa l'Album Volume 1 per sbloccare il rarissimo **Volume 2 (Gold Edition)**.
                    </p>
                </div>
            </section>

            {/* 4. LA CASA DI BOO & LIBRERIA */}
            <section className="bg-white/50 backdrop-blur-md p-5 rounded-[35px] border-4 border-white shadow-lg flex flex-col">
                <div className="flex items-center gap-3 mb-4 border-b-2 border-white/50 pb-2">
                    <Home className="text-orange-600" size={28} />
                    <h3 className="text-xl md:text-2xl font-black text-slate-800 uppercase tracking-tight leading-none">4. Casa & Libreria</h3>
                </div>
                <div className="grid grid-cols-1 gap-3">
                    <div className="p-3 bg-yellow-50 rounded-2xl border border-yellow-200">
                        <span className="font-black text-yellow-700 block text-[11px] uppercase mb-1 flex items-center gap-2"><Utensils size={14}/> Cucina</span>
                        <p className="text-[10px] font-bold text-slate-600 leading-tight">Impara il Riciclo, gioca a Caccia alla Frutta o sfida i record al **Frigo-Tetris 🧊**.</p>
                    </div>
                    <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200">
                        <span className="font-black text-amber-700 block text-[11px] uppercase mb-1 flex items-center gap-2"><Library size={14}/> Libreria delle Carte</span>
                        <p className="text-[10px] font-bold text-slate-600 leading-tight">Siediti al tavolo per una partita a **Scopa, Uno o Solitario**, oppure leggi i grandi classici nell'Area Lettura 📖.</p>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-2xl border border-purple-200">
                        <span className="font-black text-purple-600 block text-[11px] uppercase mb-1 flex items-center gap-2"><Bed size={14}/> Cameretta</span>
                        <p className="text-[10px] font-bold text-slate-600 leading-tight">Usa il Telescopio per vedere le stelle o apri il Baule dei Segreti (Gratta e Vinci, Fionda).</p>
                    </div>
                </div>
            </section>

            {/* 5. COME SALVARE */}
            <section className="bg-white/50 backdrop-blur-md p-5 rounded-[35px] border-4 border-white shadow-lg">
                <div className="flex flex-col h-full">
                    <div className="flex items-center gap-3 mb-4 border-b-2 border-white/50 pb-2">
                        <Save className="text-orange-500" size={28} />
                        <h3 className="text-xl md:text-2xl font-black text-slate-800 uppercase tracking-tight leading-none">5. Come Salvare (La Tessera)</h3>
                    </div>
                    <p className="text-slate-700 font-bold text-sm mb-4">L'app non richiede account. Per non perdere i tuoi gettoni e le figurine, scarica la **Tessera Ufficiale** (QR Code) dall'Edicola. Potrai scansionarla in futuro per riavere tutto!</p>
                    <div className="grid grid-cols-2 gap-2 mt-auto">
                        {[
                            { icon: QrCode, text: "Scarica il QR Code dalla sezione Tessera." },
                            { icon: Camera, text: "Usa SCANSIONA per recuperare tutto!" }
                        ].map((step, i) => (
                            <div key={i} className="flex items-center gap-2 p-3 bg-white/40 rounded-xl border border-white">
                                <step.icon className="text-orange-500 shrink-0" size={20} />
                                <p className="text-[10px] font-bold text-slate-700 leading-tight">{step.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 6. AREA GENITORI */}
            <section className="bg-white/50 backdrop-blur-md p-5 rounded-[35px] border-4 border-white shadow-lg flex flex-col">
                <div className="flex items-center gap-3 mb-4 border-b-2 border-white/50 pb-2">
                    <Shield className="text-slate-700" size={28} />
                    <h3 className="text-xl md:text-2xl font-black text-slate-800 uppercase tracking-tight leading-none">6. Area Genitori</h3>
                </div>
                <p className="text-sm font-bold text-slate-700 mb-3">Uno spazio sicuro per gestire l'esperienza del bambino. Accessibile tramite il tasto "+" risolvendo un calcolo matematico!</p>
                <div className="space-y-2">
                    <div className="p-3 bg-slate-100 rounded-2xl border border-slate-200">
                        <p className="text-xs font-bold text-slate-700"><span className="font-black text-red-600">BLOCCO LINK:</span> Disattiva tutti i collegamenti esterni verso YouTube e Social per una navigazione protetta.</p>
                    </div>
                    <div className="p-3 bg-slate-100 rounded-2xl border border-slate-200">
                        <p className="text-xs font-bold text-slate-700"><span className="font-black text-orange-600">GIOCHI SPECIALI:</span> Abilita o disabilita giochi che richiedono supervisione (es. Tiro alla Fionda o Gratta e Vinci).</p>
                    </div>
                </div>
            </section>

            {/* 7. MAGIA PER TUTTI (ACCESSIBILITÀ) */}
            <section className="bg-white/50 backdrop-blur-md p-5 rounded-[35px] border-4 border-white shadow-lg md:col-span-2">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-4 border-b-2 border-white/50 pb-2">
                            <Accessibility className="text-pink-500" size={28} />
                            <h3 className="text-xl md:text-2xl font-black text-slate-800 uppercase tracking-tight leading-none">7. Magia per Tutti</h3>
                        </div>
                        <p className="text-slate-700 font-bold text-sm mb-4">Crediamo che il divertimento debba essere per tutti! Nella sezione "Magia" (tasto "+") i bambini con esigenze speciali possono attivare funzioni dedicate:</p>
                    </div>
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <div className="bg-blue-100/50 p-3 rounded-2xl border-2 border-blue-200 text-center">
                            <Type className="mx-auto mb-2 text-blue-600" />
                            <span className="block font-black text-[10px] uppercase text-blue-800">Font Leggibile</span>
                            <p className="text-[9px] font-bold text-blue-900 leading-tight">Ottimizzato per la dislessia.</p>
                        </div>
                        <div className="bg-yellow-100/50 p-3 rounded-2xl border-2 border-yellow-200 text-center">
                            <Eye className="mx-auto mb-2 text-yellow-600" />
                            <span className="block font-black text-[10px] uppercase text-yellow-800">Super Colori</span>
                            <p className="text-[9px] font-bold text-yellow-900 leading-tight">Contrasto elevato per ipovisione.</p>
                        </div>
                        <div className="bg-green-100/50 p-3 rounded-2xl border-2 border-green-200 text-center">
                            <ZapOff className="mx-auto mb-2 text-green-600" />
                            <span className="block font-black text-[10px] uppercase text-green-800">Modo Calmo</span>
                            <p className="text-[9px] font-bold text-green-900 leading-tight">Stop alle animazioni per ridurre lo stress.</p>
                        </div>
                    </div>
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
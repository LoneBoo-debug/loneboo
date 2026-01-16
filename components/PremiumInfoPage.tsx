import React, { useEffect } from 'react';
import { AppView } from '../types';
import { BookOpen, GraduationCap, CheckCircle2, PlayCircle, Info, CreditCard, ShieldCheck, Heart } from 'lucide-react';
import { OFFICIAL_LOGO } from '../constants';

const BG_URL = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/bgroundloneboopremiumlogoassex22.webp';
const BTN_CLOSE_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/btn-close.webp';

// FIX: Define SectionTitle outside to ensure proper component inference and type children explicitly
const SectionTitle: React.FC<{ icon: any; children: React.ReactNode }> = ({ children, icon: Icon }) => (
    <div className="flex items-center gap-3 mb-4 mt-8 border-b-4 border-blue-500/20 pb-2">
        <Icon className="text-blue-600" size={28} />
        <h3 className="text-2xl md:text-3xl font-black text-blue-900 uppercase tracking-tight">{children}</h3>
    </div>
);

interface PremiumInfoPageProps {
    setView: (view: AppView) => void;
    returnView: AppView;
}

const PremiumInfoPage: React.FC<PremiumInfoPageProps> = ({ setView, returnView }) => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="fixed inset-0 z-0 bg-white flex flex-col overflow-hidden pt-[64px] md:pt-[96px]">
            {/* Background Layer */}
            <img src={BG_URL} alt="" className="absolute inset-0 w-full h-full object-fill z-0 opacity-100" />
            
            {/* Strato Overlay per leggibilità */}
            <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-[1]"></div>

            {/* Header Pagina - Solo Tasto Chiudi */}
            <div className="relative z-10 w-full pt-4 md:pt-8 px-6 flex justify-end items-center shrink-0">
                <button 
                    onClick={() => setView(returnView)} 
                    className="hover:scale-110 active:scale-95 transition-all outline-none"
                >
                    <img src={BTN_CLOSE_IMG} alt="Chiudi" className="w-14 h-14 md:w-20 md:h-20 drop-shadow-xl" />
                </button>
            </div>

            {/* Contenuto Principale */}
            <div className="relative z-10 flex-1 overflow-y-auto p-6 md:p-12 custom-scrollbar">
                <div className="max-w-4xl mx-auto space-y-6">
                    
                    {/* Intro */}
                    <div className="text-center mb-12">
                        <p className="text-xl md:text-2xl font-bold text-slate-700 leading-relaxed">
                            <span className="text-blue-600 font-black">Scuola Elementare Arcobaleno in Lone Boo World</span>, nasce con un obiettivo chiaro: accompagnare bambini e famiglie nel percorso della scuola primaria in modo <span className="text-blue-600 font-black">serio, completo e coinvolgente.</span><br/>
                            L’abbonamento Lone Boo Premium è pensato per chi desidera offrire ai propri figli uno strumento educativo affidabile, sempre aggiornato e costruito con competenza.
                        </p>
                    </div>

                    {/* Percorso Didattico */}
                    <section>
                        <SectionTitle icon={GraduationCap}>Percorso Didattico Completo</SectionTitle>
                        <p className="text-lg md:text-xl text-slate-700 font-bold leading-relaxed mb-4">
                            Con l’abbonamento Premium si sbloccano tutte le lezioni di tutte le materie per tutte le classi della scuola primaria, dalla prima alla quinta.
                        </p>
                        <div className="flex flex-wrap gap-2 mb-6">
                            {['Italiano', 'Matematica', 'Storia', 'Geografia', 'Scienze'].map(s => (
                                <span key={s} className="bg-blue-100 text-blue-700 px-4 py-1 rounded-full font-black text-xs md:text-sm uppercase">{s}</span>
                            ))}
                        </div>
                        <p className="text-lg md:text-xl text-slate-700 font-bold leading-relaxed">
                            Le discipline vengono presentate seguendo un percorso progressivo, ordinato e coerente, che accompagna il bambino nella crescita scolastica anno dopo anno.
                        </p>
                    </section>

                    {/* Aderenza Programmi */}
                    <section>
                        <SectionTitle icon={BookOpen}>Aderenza ai programmi ministeriali</SectionTitle>
                        <p className="text-lg md:text-xl text-slate-700 font-bold leading-relaxed mb-6">
                            Per Lone Boo, l’autorevolezza e la competenza di un docente sono insostituibili. Tutti i contenuti didattici dell’app sono strutturati nel pieno rispetto delle <span className="text-blue-800">Indicazioni Nazionali del Ministero dell’Istruzione italiano</span>.
                        </p>
                        <div className="bg-white/80 border-l-8 border-blue-500 p-6 rounded-2xl shadow-md italic">
                            <p className="text-lg md:text-xl text-blue-900 font-bold">
                                "📘 Ogni argomento è pensato come farebbe un insegnante, adattato all’età del bambino e sviluppato con attenzione pedagogica."
                            </p>
                        </div>
                    </section>

                    {/* Approccio Moderno */}
                    <section>
                        <SectionTitle icon={PlayCircle}>Un approccio moderno, ma educativo</SectionTitle>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                                "Testi chiari e adatti all’età",
                                "Audio-letture per favorire l'ascolto",
                                "Contenuti visivi e video di supporto",
                                "Giochi didattici e attività interattive",
                                "Quiz di verifica per consolidare"
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-3 bg-white/40 p-3 rounded-xl border border-white/50">
                                    <CheckCircle2 className="text-green-500 shrink-0" size={20} />
                                    <span className="text-sm md:text-lg font-black text-slate-700 uppercase tracking-tight">{item}</span>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* BOX COSTO E GESTIONE (BENTO STYLE) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
                        
                        {/* Costo */}
                        <div className="bg-yellow-400 rounded-[2.5rem] border-4 border-black p-8 shadow-xl flex flex-col items-center text-center">
                            <CreditCard size={40} className="mb-4 text-black" />
                            <h3 className="text-2xl font-black text-black uppercase mb-4">Costo Accessibile</h3>
                            <div className="space-y-2 mb-6">
                                <p className="text-3xl font-black text-blue-900">2,99 € <span className="text-sm uppercase opacity-60">/ mese</span></p>
                                <div className="h-px bg-black/10 w-24 mx-auto"></div>
                                <p className="text-3xl font-black text-blue-900">29,99 € <span className="text-sm uppercase opacity-60">/ anno</span></p>
                            </div>
                            <p className="text-xs font-bold text-black/70 leading-tight">
                                👉 L’abbonamento può essere disdetto in qualsiasi momento, senza obbligo di rinnovo e senza penali.
                            </p>
                        </div>

                        {/* Attivazione */}
                        <div className="bg-blue-600 rounded-[2.5rem] border-4 border-black p-8 shadow-xl text-white">
                            <div className="flex items-center gap-3 mb-6">
                                <ShieldCheck size={32} />
                                <h3 className="text-xl font-black uppercase">Attivazione Sicura</h3>
                            </div>
                            <ul className="space-y-4 text-sm font-bold opacity-90">
                                <li className="flex gap-3">
                                    <span className="bg-white/20 w-6 h-6 rounded-full flex items-center justify-center shrink-0">1</span>
                                    <span>Seleziona l'offerta nell'app</span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="bg-white/20 w-6 h-6 rounded-full flex items-center justify-center shrink-0">2</span>
                                    <span>Conferma tramite Google Play</span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="bg-white/20 w-6 h-6 rounded-full flex items-center justify-center shrink-0">3</span>
                                    <span>Accedi subito ai contenuti</span>
                                </li>
                            </ul>
                            <div className="mt-6 pt-4 border-t border-white/20">
                                <p className="text-[10px] uppercase font-black tracking-widest text-blue-200">Gestito tramite Google Play Store</p>
                            </div>
                        </div>

                    </div>

                    {/* Chiusura */}
                    <div className="py-12 text-center border-t-4 border-blue-500/10 mt-8">
                        <p className="text-xl md:text-2xl font-black text-blue-900 uppercase mb-4 tracking-tighter">
                            Lone Boo Premium è un investimento nell’apprendimento,<br/> 
                            nella serenità delle famiglie e nella crescita consapevole dei bambini.
                        </p>
                        <div className="flex flex-col items-center gap-2 opacity-60">
                            <Heart size={32} className="text-pink-500 fill-pink-500 animate-pulse" />
                            <p className="text-sm font-bold text-slate-500 italic">Un supporto educativo completo, pensato con competenza e passione.</p>
                        </div>
                    </div>

                    {/* Footer Social / Logo */}
                    <div className="pb-16 flex flex-col items-center opacity-40">
                        <img src={OFFICIAL_LOGO} alt="" className="w-16 h-16 mb-2 grayscale" />
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-900">Lone Boo World • 2025</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PremiumInfoPage;
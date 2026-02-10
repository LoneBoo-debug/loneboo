import React, { useState, useEffect, useMemo, useRef } from 'react';
import { AppView } from '../types';
import { X, Search, Mic, MicOff, Loader2, ArrowLeft, Send, AlertTriangle } from 'lucide-react';
import { OFFICIAL_LOGO, DICTIONARY_DATA_CSV_URL } from '../constants';

interface DictionaryEntry {
    word: string;
    synonyms: string;
    antonyms: string;
}

const DICTIONARY_BG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/archivioarchivista5543.webp';
const BTN_CLOSE_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/btn-close.webp';
const ALPHABET = "ABCDEFGHILMNOPQRSTUVZ".split("");

const parseCSV = (text: string): DictionaryEntry[] => {
    const results: DictionaryEntry[] = [];
    const cleanText = text.replace(/^\uFEFF/, ''); 
    
    let i = 0;
    let inQuotes = false;
    let currentCell = '';
    let currentRow: string[] = [];
    
    const separator = cleanText.includes(';') && !cleanText.includes(',') ? ';' : ',';

    const processRow = (row: string[]) => {
        if (row.length >= 3) {
            const word = (row[0] || '').trim();
            // Evitiamo l'intestazione
            if (word.toLowerCase() === 'parola' || !word) return;

            results.push({
                word: word,
                synonyms: (row[1] || '').trim(),
                antonyms: (row[2] || '').trim()
            });
        }
    };

    while (i < cleanText.length) {
        const char = cleanText[i];
        const nextChar = cleanText[i + 1];
        if (inQuotes) {
            if (char === '"') {
                if (nextChar === '"') { currentCell += '"'; i++; } 
                else { inQuotes = false; }
            } else { currentCell += char; }
        } else {
            if (char === '"') { inQuotes = true; } 
            else if (char === separator) { currentRow.push(currentCell); currentCell = ''; } 
            else if (char === '\n' || char === '\r') {
                if (char === '\r' && nextChar === '\n') i++;
                currentRow.push(currentCell);
                processRow(currentRow);
                currentRow = []; currentCell = '';
            } else { currentCell += char; }
        }
        i++;
    }
    if (currentCell !== '' || currentRow.length > 0) {
        currentRow.push(currentCell);
        processRow(currentRow);
    }
    return results;
};

const DictionaryView: React.FC<{ setView: (v: AppView) => void }> = ({ setView }) => {
    const [allEntries, setAllEntries] = useState<DictionaryEntry[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);
    const [selectedLetter, setSelectedLetter] = useState<string>('A');
    const [searchQuery, setSearchQuery] = useState('');
    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef<any>(null);

    const loadDictionary = async () => {
        setIsLoading(true);
        setError(false);
        try {
            const separator = DICTIONARY_DATA_CSV_URL.includes('?') ? '&' : '?';
            const fetchUrl = `${DICTIONARY_DATA_CSV_URL}${separator}t=${Date.now()}`;
            const res = await fetch(fetchUrl);
            
            if (res.ok) {
                const text = await res.text();
                // Controllo se è un HTML (errore Google) o un CSV vero
                if (text.trim().toLowerCase().startsWith('<!doctype')) {
                    throw new Error("Invalid CSV format");
                }
                const data = parseCSV(text);
                setAllEntries(data);
            } else {
                throw new Error("Fetch failed");
            }
        } catch (e) {
            console.error("Errore caricamento dizionario:", e);
            setError(true);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadDictionary();

        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (SpeechRecognition) {
            const recognition = new SpeechRecognition();
            recognition.continuous = false;
            recognition.lang = 'it-IT';
            recognition.onstart = () => setIsListening(true);
            recognition.onresult = (event: any) => {
                const transcript = event.results[0][0].transcript.toLowerCase().replace(/\./g, '');
                setSearchQuery(transcript);
                setIsListening(false);
            };
            recognition.onerror = () => setIsListening(false);
            recognition.onend = () => setIsListening(false);
            recognitionRef.current = recognition;
        }
    }, []);

    const filteredResults = useMemo(() => {
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            return allEntries.filter(e => 
                e.word.toLowerCase().includes(q) || 
                e.synonyms.toLowerCase().includes(q) || 
                e.antonyms.toLowerCase().includes(q)
            );
        }
        return allEntries.filter(e => e.word.toUpperCase().startsWith(selectedLetter));
    }, [allEntries, selectedLetter, searchQuery]);

    const startListening = () => {
        if (recognitionRef.current && !isListening) recognitionRef.current.start();
        else if (!recognitionRef.current) alert("Il tuo browser non supporta la ricerca vocale.");
    };

    return (
        <div className="fixed inset-0 z-[100] bg-slate-900 flex flex-col animate-in fade-in overflow-hidden pt-[64px] md:pt-[96px]">
            <style>{`
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .text-stroke-lucky { -webkit-text-stroke: 1.5px black; text-shadow: 2px 2px 0px rgba(0,0,0,0.5); }
                .text-stroke-lucky-small { -webkit-text-stroke: 1.2px black; text-shadow: 2px 2px 0px rgba(0,0,0,0.5); }
            `}</style>

            <img src={DICTIONARY_BG} alt="" className="absolute inset-0 w-full h-full object-fill opacity-40 z-0" />

            {/* HEADER */}
            <div className="relative z-20 w-full p-4 md:p-6 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-3">
                    <button onClick={() => setView(AppView.SCHOOL_ARCHIVE)} className="bg-white/20 text-white p-2 rounded-full border-2 border-white/20 hover:bg-white/40 transition-all mr-2">
                        <ArrowLeft size={24} />
                    </button>
                    <div className="bg-white/10 backdrop-blur-xl px-4 md:px-6 py-2 rounded-full border-2 border-white/20 shadow-xl">
                        <h2 className="text-white font-luckiest text-lg md:text-4xl lg:text-5xl uppercase tracking-tighter md:tracking-widest leading-none text-stroke-lucky-small">
                            Dizionario <span className="text-yellow-400">Sinonimi/Contrari</span>
                        </h2>
                    </div>
                </div>
                <button onClick={() => setView(AppView.SCHOOL_ARCHIVE)} className="hover:scale-110 active:scale-95 transition-all outline-none">
                    <img src={BTN_CLOSE_IMG} alt="Esci" className="w-12 h-12 md:w-20 h-auto drop-shadow-2xl" />
                </button>
            </div>

            {/* ALPHABET TABS */}
            <div className="relative z-20 px-4 mb-4 shrink-0">
                <div className="flex overflow-x-auto gap-2 py-2 no-scrollbar scroll-smooth">
                    {ALPHABET.map(l => (
                        <button
                            key={l}
                            onClick={() => { setSelectedLetter(l); setSearchQuery(''); }}
                            className={`
                                w-10 h-10 md:w-14 md:h-14 shrink-0 rounded-xl border-b-4 font-luckiest text-xl md:text-3xl transition-all active:translate-y-1 active:border-b-0
                                ${selectedLetter === l && !searchQuery ? 'bg-yellow-400 border-yellow-600 text-blue-900 scale-110 shadow-lg' : 'bg-white/10 border-white/20 text-white hover:bg-white/20'}
                            `}
                        >
                            {l}
                        </button>
                    ))}
                </div>
            </div>

            {/* SEARCH BOX */}
            <div className="relative z-20 px-4 mb-6 shrink-0">
                <div className="max-w-2xl mx-auto flex gap-2 items-center bg-white/20 backdrop-blur-xl p-2 rounded-2xl border-2 border-white/20 shadow-xl">
                    <button 
                        onClick={startListening}
                        className={`p-3 rounded-xl transition-all ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-white/10 text-white hover:bg-white/20'}`}
                    >
                        {isListening ? <MicOff size={24} /> : <Mic size={24} />}
                    </button>
                    <input 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Cerca una parola..."
                        className="flex-1 bg-white/80 rounded-xl px-4 py-3 font-bold text-blue-900 outline-none placeholder-blue-300"
                    />
                    {searchQuery && (
                        <button onClick={() => setSearchQuery('')} className="bg-red-500 text-white p-1.5 rounded-full mr-2 shadow-sm"><X size={16} /></button>
                    )}
                </div>
            </div>

            {/* WORD LIST */}
            <div className="relative z-10 flex-1 overflow-y-auto no-scrollbar p-4 md:p-8">
                <div className="max-w-4xl mx-auto flex flex-col gap-2.5 pb-32">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <Loader2 className="animate-spin text-white mb-4" size={48} />
                            <span className="text-white font-black uppercase">Sfogliando il dizionario...</span>
                        </div>
                    ) : error ? (
                        <div className="bg-red-500/20 backdrop-blur-md p-8 rounded-[3rem] border-4 border-red-500 text-center animate-in zoom-in shadow-2xl">
                            <AlertTriangle className="text-white mx-auto mb-4" size={60} />
                            <h3 className="text-white font-black text-xl md:text-3xl uppercase">Errore Connessione</h3>
                            <p className="text-white font-bold mb-6">Non sono riuscito a caricare le parole. Controlla il link del foglio Google o la tua connessione.</p>
                            {/* FIX: corrected loadDictionary prop to onClick */}
                            <button onClick={loadDictionary} className="bg-white text-red-600 px-8 py-3 rounded-full font-black uppercase shadow-lg active:scale-95 transition-all">RIPROVA ORA</button>
                        </div>
                    ) : filteredResults.length > 0 ? (
                        filteredResults.map((entry, idx) => (
                            <div 
                                key={idx} 
                                className="bg-white/10 backdrop-blur-md p-3 md:p-4 rounded-[1.5rem] md:rounded-[2rem] border border-white/20 shadow-lg animate-in slide-in-from-bottom-4 transition-colors hover:bg-white/15"
                                style={{ animationDelay: `${idx * 50}ms` }}
                            >
                                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
                                    <div className="shrink-0 py-1">
                                        <h3 className="text-yellow-400 font-luckiest text-xl md:text-4xl uppercase tracking-wider text-stroke-lucky-small leading-none">
                                            {entry.word}
                                        </h3>
                                    </div>
                                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-6">
                                        <div className="space-y-0.5">
                                            <span className="text-[9px] md:text-[10px] font-black text-blue-300 uppercase tracking-widest block opacity-70">Sinonimi</span>
                                            <p className="text-white font-bold text-sm md:text-lg leading-tight">{entry.synonyms || '---'}</p>
                                        </div>
                                        <div className="space-y-0.5 border-t border-white/5 md:border-t-0 md:border-l md:pl-6 md:border-white/10 pt-1.5 md:pt-0">
                                            <span className="text-[9px] md:text-[10px] font-black text-red-300 uppercase tracking-widest block opacity-70">Contrari</span>
                                            <p className="text-white font-bold text-sm md:text-lg leading-tight">{entry.antonyms || '---'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-center animate-in zoom-in">
                            <div className="text-6xl mb-4">🤔</div>
                            <h3 className="text-white font-black text-xl md:text-3xl uppercase opacity-50">Nessun risultato trovato</h3>
                            <p className="text-white/40 font-bold mt-2">Prova a cercare un'altra parola o seleziona una lettera!</p>
                        </div>
                    )}
                </div>
            </div>

            {/* FOOTER */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 opacity-20 pointer-events-none z-0">
                <img src={OFFICIAL_LOGO} alt="" className="w-12 h-12 grayscale" />
            </div>
        </div>
    );
};

export default DictionaryView;

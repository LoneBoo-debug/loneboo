import { GoogleGenAI, Modality } from "@google/genai";
import { ArrowLeft, Download, Loader2, Mic, Play, Sliders, Sparkles, Square, Star, Trash2 } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { AppView } from '../types';

// --- AI VOICE CONFIGURATION ---
const AI_VOICES = [
    { id: 'Puck', name: 'Lone Boo (Voce Originale) - AI ✨', gender: 'neutral', age: 'child' },
    { id: 'Kore', name: 'Sami (Maestra Simpatica) - AI ✨', gender: 'female', age: '30' },
    { id: 'Charon', name: 'Nereo (Nonno Saggio) - AI ✨', gender: 'male', age: 'old' },
    { id: 'Fenrir', name: 'BatBeat (DJ Pazzo) - AI ✨', gender: 'male', age: 'young' },
    { id: 'Zephyr', name: 'Marlo (Capostazione Vispo) - AI ✨', gender: 'male', age: 'young' }
];

// --- AUDIO STREAMING UTILS ---
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

const TTSStudio: React.FC<{ setView: (v: AppView) => void }> = ({ setView }) => {
    const [text, setText] = useState('');
    const [localVoices, setLocalVoices] = useState<SpeechSynthesisVoice[]>([]);
    const [selectedVoiceId, setSelectedVoiceId] = useState<string>('');
    const [pitch, setPitch] = useState(1);
    const [rate, setRate] = useState(1);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    
    // Audio Context Refs
    const audioContextRef = useRef<AudioContext | null>(null);
    const nextStartTimeRef = useRef<number>(0);
    const activeSourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

    useEffect(() => {
        const loadVoices = () => {
            const availableVoices = window.speechSynthesis.getVoices();
            const italianVoices = availableVoices.filter(v => v.lang.startsWith('it'));
            setLocalVoices(italianVoices);
            
            if (italianVoices.length > 0 && !selectedVoiceId) {
                setSelectedVoiceId(AI_VOICES[0].id);
            }
        };

        loadVoices();
        window.speechSynthesis.onvoiceschanged = loadVoices;
        
        return () => {
            stopPlayback();
            if (audioContextRef.current) {
                audioContextRef.current.close();
            }
        };
    }, []);

    const stopPlayback = () => {
        window.speechSynthesis.cancel();
        activeSourcesRef.current.forEach(source => {
            try { source.stop(); } catch(e) {}
        });
        activeSourcesRef.current.clear();
        nextStartTimeRef.current = 0;
        setIsSpeaking(false);
    };

    const handleSpeak = async () => {
        if (!text.trim()) return;
        stopPlayback();

        const isAiVoice = AI_VOICES.some(v => v.id === selectedVoiceId);
        if (isAiVoice) {
            await handleAiStreamSpeak();
        } else {
            handleLocalSpeak();
        }
    };

    const handleLocalSpeak = () => {
        const utterance = new SpeechSynthesisUtterance(text);
        const voice = localVoices.find(v => v.name === selectedVoiceId);
        if (voice) utterance.voice = voice;
        utterance.pitch = pitch;
        utterance.rate = rate;
        
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);
        
        window.speechSynthesis.speak(utterance);
    };

    const handleAiStreamSpeak = async () => {
        setIsGenerating(true);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            
            if (!audioContextRef.current) {
                audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
            }
            const ctx = audioContextRef.current;
            if (ctx.state === 'suspended') await ctx.resume();

            let styleInstruction = "";
            if (selectedVoiceId === 'Puck') {
                styleInstruction = `Sei Lone Boo, un fantasmino di 7 anni, energico, vivace e molto scattante.
                   REGOLE DI RECITAZIONE MANDATORIE:
                   1. PERSONALITÀ: Parla con entusiasmo e grinta. La voce deve essere squillante e piena di brio.
                   2. TONO: Usa un registro vocale ALTO e BRILLANTE, tipico di un bambino felice.
                   3. RITMO COSTANTE (CRITICO): Mantieni una velocità di lettura STABILE e MODERATA dall'inizio alla fine. NON devi accelerare durante la narrazione.
                   Leggi questo testo con la tua voce grintosa originale:`;
            } else if (selectedVoiceId === 'Kore') {
                styleInstruction = `Sei Sami, una maestra di scuola primaria molto esperta, calda e rassicurante. 
                   REGOLE DI RECITAZIONE DIDATTICA:
                   1. PERSONALITÀ: Parla con un tono accogliente e limpido.
                   2. ESPRESSIVITÀ DINAMICA: Non essere monotona. Varia leggermente l'altezza tonale per enfatizzare i concetti chiave.
                   3. RITMO RIGOROSO: Mantieni una velocità di lettura media e COSTANTE.
                   4. RESPIRAZIONE: Fai una pausa netta ad ogni punto fermo (.).
                   Leggi questo testo con cura magistrale e ritmo stabile:`;
            } else if (selectedVoiceId === 'Charon') {
                styleInstruction = `Sei Nereo, un saggio nonno che racconta memorie antiche con passione ed energia. 
                   Leggi con voce profonda ma espressiva e un po' più vispa. 
                   Fai pause naturali ai punti (.) e usa un'intonazione coinvolgente. 
                   Mantieni un ritmo moderato e costante.`;
            } else if (selectedVoiceId === 'Fenrir') {
                styleInstruction = `Sei BatBeat, il pipistrello DJ di Lone Boo World! Sei super energico, un po' matto e ami il ritmo.
                   REGOLE DI RECITAZIONE DJ STYLE:
                   1. PERSONALITÀ: Parla con un'energia travolgente, come se fossi in diretta radiofonica o su un palco!
                   2. STILE: Ogni tanto inserisci esclamazioni come "Yo!", "Wow!", "Let's go!", "Check this out!" in modo naturale tra le frasi.
                   3. RITMO INCALZANTE (MA COSTANTE): La tua parlantina deve essere veloce e ritmata, ma non deve accelerare durante il discorso. Mantieni un "groove" vocale costante dall'inizio alla fine.
                   4. VOCE: Usa un tono vispo, grintoso e un pizzico "pazzo".
                   Leggi questo testo con tutto il tuo stile da DJ:`;
            } else if (selectedVoiceId === 'Zephyr') {
                styleInstruction = `Sei Marlo, l'autorevole Capostazione di Lone Boo World. 
                   REGOLE DI RECITAZIONE MANDATORIE:
                   1. PERSONALITÀ: Sei fiero, scattante e molto sicuro di te. Hai l'autorità di chi comanda i binari magici.
                   2. TONO: Usa un registro MASCHILE BEN DEFINITO, PROFONDO e VIRILe. La voce deve essere ferma e risonante, non infantile.
                   3. RITMO: Parla in modo vispo e ritmato, con la chiarezza di un annuncio importante in stazione.
                   4. CARATTERIZZAZIONE: Inserisci un "Piii-piii!" o un "Tutti in carrozza!" solo se il testo lo permette per dare grinta.
                   Leggi questo testo con la tua voce marcatamente maschile e autorevole da capostazione:`;
            }

            const responseStream = await ai.models.generateContentStream({
                model: "gemini-2.5-flash-preview-tts",
                contents: [{ parts: [{ text: `${styleInstruction}\n\n${text}` }] }],
                config: {
                    responseModalities: [Modality.AUDIO],
                    speechConfig: {
                        voiceConfig: {
                            prebuiltVoiceConfig: { voiceName: selectedVoiceId },
                        },
                    },
                },
            });

            setIsGenerating(false);
            setIsSpeaking(true);
            nextStartTimeRef.current = ctx.currentTime + 0.1;

            for await (const chunk of responseStream) {
                const base64Audio = chunk.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
                if (base64Audio) {
                    const audioData = decode(base64Audio);
                    const audioBuffer = await decodeAudioData(audioData, ctx, 24000, 1);
                    
                    const source = ctx.createBufferSource();
                    source.buffer = audioBuffer;
                    source.connect(ctx.destination);
                    
                    const startTime = Math.max(nextStartTimeRef.current, ctx.currentTime);
                    source.start(startTime);
                    
                    nextStartTimeRef.current = startTime + audioBuffer.duration;
                    
                    activeSourcesRef.current.add(source);
                    source.onended = () => {
                        activeSourcesRef.current.delete(source);
                        if (activeSourcesRef.current.size === 0) {
                            setIsSpeaking(false);
                        }
                    };
                }
            }
        } catch (error) {
            console.error("AI Streaming TTS Error:", error);
            alert("Errore nella generazione. Riprova con un testo più breve.");
            setIsSpeaking(false);
        } finally {
            setIsGenerating(false);
        }
    };

    const downloadAudio = () => {
        alert("Nota: Usa uno strumento di registrazione sistema per salvare l'audio in alta fedeltà. 🎤");
    };

    return (
        <div className="fixed inset-0 z-[200] bg-slate-900 flex flex-col pt-[64px] md:pt-[96px] overflow-hidden select-none">
            <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
            
            <div className="relative z-10 bg-slate-800 p-4 md:p-6 flex justify-between items-center border-b-4 border-black shadow-lg">
                <div className="flex items-center gap-4">
                    <button onClick={() => setView(AppView.HOME)} className="bg-red-500 text-white p-2 rounded-full border-2 border-black active:scale-90 transition-transform">
                        <ArrowLeft size={24} strokeWidth={3} />
                    </button>
                    <div>
                        <h2 className="text-white font-black text-xl md:text-3xl uppercase tracking-tighter leading-none">Audio Studio Pro</h2>
                        <p className="text-blue-400 font-bold text-[10px] md:text-xs uppercase tracking-widest">Voce Narrante Didattica</p>
                    </div>
                </div>
                <div className="hidden md:flex items-center gap-2 bg-green-500 text-white font-black text-[10px] px-3 py-1 rounded-full border-2 border-black animate-pulse">
                    <Star size={14} fill="currentColor" /> HI-FI NARRATION
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 md:p-8 flex flex-col items-center gap-6 custom-scrollbar">
                <div className="w-full max-w-4xl bg-white rounded-[2rem] border-4 border-black shadow-[8px_8px_0_0_rgba(0,0,0,1)] p-6">
                    <label className="block text-slate-400 font-black text-xs uppercase mb-2 tracking-widest">Testo da narrare:</label>
                    <textarea 
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Incolla qui la tua lezione... Seleziona la voce originale di Lone Boo o lo stile del Capostazione Marlo!"
                        className="w-full h-40 md:h-60 bg-slate-50 rounded-xl p-4 font-bold text-slate-800 text-lg md:text-2xl outline-none focus:ring-4 ring-blue-500/20 transition-all resize-none border-2 border-slate-200"
                    />
                    <div className="flex justify-between items-center mt-4">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">{text.length} caratteri | Ritmo Controllato</span>
                        <button onClick={() => setText('')} className="text-red-500 font-black text-xs uppercase flex items-center gap-1 hover:underline">
                            <Trash2 size={14} /> Pulisci
                        </button>
                    </div>
                </div>

                <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-800 p-5 rounded-[2rem] border-4 border-black shadow-xl">
                        <div className="flex items-center gap-2 mb-4 text-blue-400 font-black text-xs uppercase">
                            <Mic size={18} /> Selezione Voce
                        </div>
                        <select 
                            value={selectedVoiceId}
                            onChange={(e) => setSelectedVoiceId(e.target.value)}
                            className="w-full bg-slate-950 text-white font-bold p-4 rounded-xl border-2 border-slate-700 outline-none focus:border-blue-500 text-sm md:text-base appearance-none cursor-pointer"
                        >
                            <optgroup label="Voci Ottimizzate (Mastering)">
                                {AI_VOICES.map(v => (
                                    <option key={v.id} value={v.id}>{v.name}</option>
                                ))}
                            </optgroup>
                            <optgroup label="Sintesi Locale">
                                {localVoices.map(v => (
                                    <option key={v.name} value={v.name}>{v.name}</option>
                                ))}
                            </optgroup>
                        </select>
                        <p className="text-[9px] text-slate-500 font-bold mt-2 uppercase text-center">
                            {selectedVoiceId === 'Puck' ? 'Voce originale, energica e vivace' : 
                             selectedVoiceId === 'Fenrir' ? 'Stile radiofonico travolgente e ritmato' :
                             selectedVoiceId === 'Zephyr' ? 'Voce maschile decisa, scattante e autorevole' :
                             'Voce calda e professionale'}
                        </p>
                    </div>

                    <div className={`bg-slate-800 p-5 rounded-[2rem] border-4 border-black shadow-xl transition-opacity ${AI_VOICES.some(v => v.id === selectedVoiceId) ? 'opacity-30 pointer-events-none' : 'opacity-100'}`}>
                        <div className="flex items-center gap-2 mb-4 text-yellow-400 font-black text-xs uppercase">
                            <Sliders size={18} /> Modulatori Locali
                        </div>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-[10px] text-white/50 font-black uppercase mb-1">
                                    <span>Velocità</span>
                                    <span>{rate}x</span>
                                </div>
                                <input type="range" min="0.5" max="2" step="0.1" value={rate} onChange={(e) => setRate(parseFloat(e.target.value))} className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500" />
                            </div>
                            <div>
                                <div className="flex justify-between text-[10px] text-white/50 font-black uppercase mb-1">
                                    <span>Pitch</span>
                                    <span>{pitch}x</span>
                                </div>
                                <input type="range" min="0.5" max="2" step="0.1" value={pitch} onChange={(e) => setPitch(parseFloat(e.target.value))} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-yellow-500" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-4 w-full max-w-4xl pb-10">
                    {!isSpeaking ? (
                        <button 
                            onClick={handleSpeak}
                            disabled={!text.trim() || isGenerating}
                            className={`flex-1 flex items-center justify-center gap-3 py-6 rounded-[2rem] font-black text-xl md:text-3xl border-b-8 border-black shadow-xl transition-all active:translate-y-1 active:border-b-0 hover:brightness-110 disabled:opacity-50 disabled:grayscale ${selectedVoiceId === 'Puck' ? 'bg-yellow-400 text-black' : (selectedVoiceId === 'Fenrir' ? 'bg-pink-500 text-white' : (selectedVoiceId === 'Zephyr' ? 'bg-cyan-500 text-white' : (AI_VOICES.some(v => v.id === selectedVoiceId) ? 'bg-purple-600 text-white' : 'bg-blue-500 text-white')))}`}
                        >
                            {isGenerating ? <Loader2 className="animate-spin" /> : <Play fill="currentColor" />} 
                            {isGenerating ? 'PREPARAZIONE...' : 'AVVIA NARRAZIONE'}
                        </button>
                    ) : (
                        <button 
                            onClick={stopPlayback}
                            className="flex-1 flex items-center justify-center gap-3 py-6 rounded-[2rem] font-black text-xl md:text-3xl bg-red-500 text-white border-b-8 border-black shadow-xl transition-all active:translate-y-1 active:border-b-0 hover:bg-red-400"
                        >
                            <Square fill="currentColor" /> INTERROMPI
                        </button>
                    )}

                    <button 
                        onClick={downloadAudio}
                        className="bg-green-500 text-white px-10 py-6 rounded-[2rem] font-black text-xl md:text-2xl border-b-8 border-black shadow-xl hover:bg-green-400 active:translate-y-1 active:border-b-0 transition-all flex items-center justify-center gap-3"
                    >
                        <Download size={28} strokeWidth={3} /> SALVA
                    </button>
                </div>
            </div>

            <div className="bg-slate-800 p-4 border-t-2 border-black flex justify-center items-center opacity-40">
                <span className="text-white font-black text-[10px] tracking-[0.4em] uppercase">Teacher Persona mastered Engine</span>
            </div>
        </div>
    );
};

export default TTSStudio;
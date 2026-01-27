
import React, { useState, useEffect, useRef } from 'react';
import { AppView } from '../types';
import { Play, Download, Trash2, ArrowLeft, Volume2, Mic, Settings, Sliders, Check, Loader2, Square, Sparkles } from 'lucide-react';
import { GoogleGenAI, Modality } from "@google/genai";

// --- AI VOICE CONFIGURATION ---
const AI_VOICES = [
    { id: 'Kore', name: 'Sami (Maestra Simpatica) - AI ✨', gender: 'female', age: '30' },
    { id: 'Charon', name: 'Nereo (Nonno Saggio) - AI ✨', gender: 'male', age: 'old' }
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

            // ISTRUZIONI DI STILE RICALIBRATE PER STABILITÀ E SIMPATIA
            const styleInstruction = selectedVoiceId === 'Kore' 
                ? "Sei Sami, una simpatica maestra di 30 anni. Leggi questo testo per i tuoi piccoli alunni con una voce chiara, dolce e rassicurante. Mantieni un ritmo calmo e rigorosamente costante, scandendo bene ogni parola. Non accelerare, sii serena e amichevole:"
                : "Sei Nereo, un saggio e calmo nonno. Leggi questo testo con una voce profonda, rassicurante e pacata. Mantieni un ritmo di lettura lento e costante dall'inizio alla fine, senza fretta:";

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
                        <p className="text-blue-400 font-bold text-[10px] md:text-xs uppercase tracking-widest">Voce Narrante per Bambini</p>
                    </div>
                </div>
                <div className="hidden md:flex items-center gap-2 bg-green-500 text-white font-black text-[10px] px-3 py-1 rounded-full border-2 border-black animate-pulse">
                    <Sparkles size={14} /> HI-FI STREAMING
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 md:p-8 flex flex-col items-center gap-6 custom-scrollbar">
                <div className="w-full max-w-4xl bg-white rounded-[2rem] border-4 border-black shadow-[8px_8px_0_0_rgba(0,0,0,1)] p-6">
                    <label className="block text-slate-400 font-black text-xs uppercase mb-2 tracking-widest">Testo da narrare:</label>
                    <textarea 
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Incolla qui la tua storia... Sami leggerà con il tono di una simpatica maestra!"
                        className="w-full h-40 md:h-60 bg-slate-50 rounded-xl p-4 font-bold text-slate-800 text-lg md:text-2xl outline-none focus:ring-4 ring-blue-500/20 transition-all resize-none border-2 border-slate-200"
                    />
                    <div className="flex justify-between items-center mt-4">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">{text.length} caratteri | Ritmo costante garantito</span>
                        <button onClick={() => setText('')} className="text-red-500 font-black text-xs uppercase flex items-center gap-1 hover:underline">
                            <Trash2 size={14} /> Pulisci
                        </button>
                    </div>
                </div>

                <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-800 p-5 rounded-[2rem] border-4 border-black shadow-xl">
                        <div className="flex items-center gap-2 mb-4 text-blue-400 font-black text-xs uppercase">
                            <Mic size={18} /> Selezione Narratore
                        </div>
                        <select 
                            value={selectedVoiceId}
                            onChange={(e) => setSelectedVoiceId(e.target.value)}
                            className="w-full bg-slate-950 text-white font-bold p-4 rounded-xl border-2 border-slate-700 outline-none focus:border-blue-500 text-sm md:text-base appearance-none cursor-pointer"
                        >
                            <optgroup label="Voci Ottimizzate (Streaming)">
                                {AI_VOICES.map(v => (
                                    <option key={v.id} value={v.id}>{v.name}</option>
                                ))}
                            </optgroup>
                            <optgroup label="Sintesi di Sistema">
                                {localVoices.map(v => (
                                    <option key={v.name} value={v.name}>{v.name}</option>
                                ))}
                            </optgroup>
                        </select>
                        <p className="text-[9px] text-slate-500 font-bold mt-2 uppercase text-center">
                            Sami e Nereo sono ideali per storie lunghe e didattiche
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
                                <input type="range" min="0.5" max="2" step="0.1" value={rate} onChange={(e) => setRate(parseFloat(e.target.value))} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500" />
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
                            className={`flex-1 flex items-center justify-center gap-3 py-6 rounded-[2rem] font-black text-xl md:text-3xl border-b-8 border-black shadow-xl transition-all active:translate-y-1 active:border-b-0 hover:brightness-110 disabled:opacity-50 disabled:grayscale ${AI_VOICES.some(v => v.id === selectedVoiceId) ? 'bg-purple-600 text-white' : 'bg-blue-500 text-white'}`}
                        >
                            {isGenerating ? <Loader2 className="animate-spin" /> : <Play fill="currentColor" />} 
                            {isGenerating ? 'GENERAZIONE...' : 'AVVIA LETTURA'}
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
                <span className="text-white font-black text-[10px] tracking-[0.4em] uppercase">Constant Rate Streaming Engine</span>
            </div>
        </div>
    );
};

export default TTSStudio;

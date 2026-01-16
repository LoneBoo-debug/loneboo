
import React, { useState, useRef, useEffect } from 'react';
import { AppView } from '../types';
import { Loader2 } from 'lucide-react';

const BTN_CLOSE_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/btn-close.webp';
const BG_VOCAL_FX = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/sfvocalfx44fx33.webp';
const BTN_REC_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/recfdredfd3434sx.webp';

type VoiceEffect = 'NORMAL' | 'ALIEN' | 'BABY' | 'OLD' | 'DUFFY' | 'ECHO' | 'REVERSE' | 'AMPLIFY';

const EFFECT_LIST: { id: VoiceEffect; label: string; img: string }[] = [
    { id: 'REVERSE', label: 'Inverso', img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/rev33sw21qaz+(1).webp' },
    { id: 'ALIEN', label: 'Alieno', img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/jh554gff55.webp' },
    { id: 'BABY', label: 'Bimbo', img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/oioi8989kj.webp' },
    { id: 'OLD', label: 'Nonno', img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/grad4e34.webp' },
    { id: 'AMPLIFY', label: 'Amplifica', img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/ampliok9990+(1).webp' },
    { id: 'DUFFY', label: 'Papera', img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/duffy6t5r.webp' },
    { id: 'ECHO', label: 'Eco', img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/eco8u7y6t+(1).webp' },
    { id: 'NORMAL', label: 'Normale', img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/yggv6655gv.webp' }
];

const VocalFxPage: React.FC<{ setView: (v: AppView) => void }> = ({ setView }) => {
    const [isRecording, setIsRecording] = useState(false);
    const [recordedBuffer, setRecordedBuffer] = useState<AudioBuffer | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);

    const audioCtxRef = useRef<AudioContext | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);
    
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const animationFrameRef = useRef<number | null>(null);
    const ledRef = useRef<HTMLDivElement>(null);
    const onAirRef = useRef<HTMLDivElement>(null);

    const getCtx = () => {
        if (!audioCtxRef.current) {
            audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 44100 });
        }
        if (audioCtxRef.current.state === 'suspended') audioCtxRef.current.resume();
        return audioCtxRef.current;
    };

    const drawVisualizer = () => {
        if (!canvasRef.current || !analyserRef.current) return;
        
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const analyser = analyserRef.current;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const render = () => {
            animationFrameRef.current = requestAnimationFrame(render);
            analyser.getByteFrequencyData(dataArray);

            let sum = 0;
            for (let i = 0; i < bufferLength; i++) sum += dataArray[i];
            const average = sum / bufferLength;
            const hasAudio = average > 5;

            if (ledRef.current) {
                ledRef.current.style.backgroundColor = hasAudio ? '#ef4444' : '#22c55e';
                ledRef.current.style.boxShadow = hasAudio ? '0 0 15px #ef4444, 0 0 30px #ef4444' : '0 0 10px #22c55e';
            }
            if (onAirRef.current) {
                onAirRef.current.style.opacity = hasAudio ? '1' : '0.15';
                onAirRef.current.style.filter = hasAudio ? 'drop-shadow(0 0 10px #ef4444)' : 'none';
            }

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const numBars = 16;
            const barWidth = (canvas.width / numBars) - 2;
            let x = 0;

            for (let i = 0; i < numBars; i++) {
                const dataIdx = Math.floor(i * (bufferLength / numBars));
                const barHeight = (dataArray[dataIdx] / 255) * canvas.height;

                let gradient = ctx.createLinearGradient(0, canvas.height, 0, 0);
                gradient.addColorStop(0, '#3b82f6');
                gradient.addColorStop(0.5, '#a855f7');
                gradient.addColorStop(1, '#f43f5e');

                ctx.fillStyle = gradient;
                ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
                
                x += barWidth + 2;
            }
        };

        render();
    };

    const startRecording = async () => {
        try {
            const ctx = getCtx();
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            
            const source = ctx.createMediaStreamSource(stream);
            const analyser = ctx.createAnalyser();
            analyser.fftSize = 128; 
            source.connect(analyser);
            analyserRef.current = analyser;
            drawVisualizer();

            const mimeType = MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/ogg';
            const recorder = new MediaRecorder(stream, { mimeType });
            
            mediaRecorderRef.current = recorder;
            chunksRef.current = [];

            recorder.ondataavailable = (e) => {
                if (e.data.size > 0) chunksRef.current.push(e.data);
            };

            recorder.onstop = async () => {
                setIsProcessing(true);
                if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
                
                const blob = new Blob(chunksRef.current, { type: mimeType });
                const arrayBuffer = await blob.arrayBuffer();
                
                try {
                    const buffer = await ctx.decodeAudioData(arrayBuffer);
                    setRecordedBuffer(buffer);
                } catch (e) {
                    console.error("Errore decoding audio:", e);
                }
                setIsProcessing(false);
                stream.getTracks().forEach(t => t.stop());
                
                if (ledRef.current) { ledRef.current.style.backgroundColor = '#22c55e'; ledRef.current.style.boxShadow = 'none'; }
                if (onAirRef.current) onAirRef.current.style.opacity = '0.15';
                const cvs = canvasRef.current;
                if (cvs) { const c = cvs.getContext('2d'); c?.clearRect(0, 0, cvs.width, cvs.height); }
            };

            recorder.start();
            setIsRecording(true);
            setRecordedBuffer(null);
        } catch (err) {
            console.error("Microphone access error:", err);
            alert("Per giocare ho bisogno del microfono!");
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    const playWithEffect = (effect: VoiceEffect) => {
        if (!recordedBuffer) return;
        const ctx = getCtx();
        if (sourceNodeRef.current) { try { sourceNodeRef.current.stop(); } catch(e) {} }

        const source = ctx.createBufferSource();
        let finalBuffer = recordedBuffer;

        if (effect === 'REVERSE') {
            const clone = ctx.createBuffer(recordedBuffer.numberOfChannels, recordedBuffer.length, recordedBuffer.sampleRate);
            for (let channel = 0; channel < recordedBuffer.numberOfChannels; channel++) {
                const data = recordedBuffer.getChannelData(channel);
                const reversedData = clone.getChannelData(channel);
                for (let i = 0; i < data.length; i++) {
                    reversedData[i] = data[data.length - 1 - i];
                }
            }
            finalBuffer = clone;
        }

        source.buffer = finalBuffer;
        
        if (effect === 'BABY') source.playbackRate.value = 1.6;
        if (effect === 'OLD') source.playbackRate.value = 0.75;
        if (effect === 'DUFFY') source.playbackRate.value = 2.1;
        if (effect === 'ALIEN') source.playbackRate.value = 1.4;

        const mainGain = ctx.createGain();
        mainGain.gain.value = effect === 'AMPLIFY' ? 3.0 : 1.2; 
        
        if (effect === 'ECHO') {
            const delay = ctx.createDelay();
            delay.delayTime.value = 0.25;
            const feedback = ctx.createGain();
            feedback.gain.value = 0.4;
            source.connect(delay);
            delay.connect(feedback);
            feedback.connect(delay);
            delay.connect(mainGain);
        }

        source.connect(mainGain);
        mainGain.connect(ctx.destination);
        
        source.onended = () => setIsPlaying(false);
        setIsPlaying(true);
        source.start(0);
        sourceNodeRef.current = source;
    };

    useEffect(() => {
        return () => { if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current); };
    }, []);

    return (
        <div className="fixed inset-0 z-0 bg-black flex flex-col pt-[64px] md:pt-[96px] overflow-hidden select-none">
            
            <div className="absolute inset-0 z-0 pointer-events-none">
                <style>{`
                    @keyframes slide-bg-vocal {
                        0% { transform: scale(1.1) translateX(-5%); }
                        100% { transform: scale(1.1) translateX(5%); }
                    }
                    .animate-slide-vocal {
                        animation: slide-bg-vocal 15s ease-in-out infinite alternate;
                    }
                `}</style>
                <img 
                    src={BG_VOCAL_FX} 
                    alt="" 
                    className="w-full h-full object-cover animate-slide-vocal opacity-50"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/90"></div>
            </div>
            
            <div className="relative w-full pt-2 md:pt-4 px-6 flex justify-between items-center shrink-0 z-20">
                <div className="flex flex-col">
                    <h2 className="text-white font-black text-2xl md:text-5xl uppercase tracking-tighter leading-none" style={{ WebkitTextStroke: '1.2px black', textShadow: '3px 3px 0px rgba(0,0,0,0.3)' }}>Vocal Lab</h2>
                    <p className="text-pink-500 font-black text-[9px] md:text-base uppercase tracking-widest mt-1 drop-shadow-md">registra e modifica la tua voce</p>
                </div>
                <button onClick={() => setView(AppView.SOUNDS)} className="hover:scale-110 active:scale-95 transition-all outline-none">
                    <img src={BTN_CLOSE_IMG} alt="Esci" className="w-12 h-12 md:w-20 h-auto drop-shadow-2xl" />
                </button>
            </div>

            <div className="flex-1 flex flex-col items-center justify-start md:justify-center p-2 gap-4 md:gap-8 relative z-10 overflow-y-auto no-scrollbar pb-10">
                
                <div className="relative w-full max-w-4xl aspect-[16/8] bg-slate-900 rounded-[2.5rem] border-[6px] md:border-[12px] border-slate-700 shadow-[0_0_50px_rgba(0,0,0,1),inset_0_0_20px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col items-center justify-center p-4">
                    
                    <div className="absolute top-4 left-0 right-0 px-6 flex justify-between items-center z-20 w-full">
                        <div className="flex items-center gap-2">
                            <div 
                                ref={ledRef}
                                className="w-4 h-4 md:w-6 md:h-6 rounded-full bg-green-500 transition-all duration-150 border-2 border-black/20 shadow-inner"
                            ></div>
                            <span className="text-white/40 font-black text-[8px] md:text-xs uppercase tracking-tighter">Mic Status</span>
                        </div>

                        <div 
                            ref={onAirRef}
                            className="bg-red-600 px-3 py-1 rounded-lg border-2 border-red-800 shadow-lg opacity-20 transition-all duration-150"
                        >
                            <span className="text-white font-black text-[10px] md:text-xl uppercase tracking-widest font-mono">ON AIR</span>
                        </div>
                    </div>

                    <canvas 
                        ref={canvasRef} 
                        width={400} 
                        height={120} 
                        className="w-[90%] h-[60%] opacity-90 filter drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]"
                    />

                    <div className="absolute inset-0 pointer-events-none opacity-10 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px]"></div>
                    <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-white/5 via-transparent to-white/5"></div>
                </div>

                <div className="relative shrink-0 flex flex-col items-center">
                    <button 
                        onClick={isRecording ? stopRecording : startRecording}
                        className="relative z-10 w-40 h-40 md:w-72 md:h-72 transition-all duration-300 active:scale-95 outline-none"
                    >
                        <img src={BTN_REC_IMG} alt="Registra" className="w-full h-full object-contain drop-shadow-2xl" />
                    </button>
                    
                    {!recordedBuffer && !isRecording && !isProcessing && (
                        <p className="text-white/40 font-bold text-[9px] md:text-xs uppercase mt-4 animate-pulse">
                            🎤 Clicca per iniziare a parlare
                        </p>
                    )}
                </div>

                {isProcessing && (
                    <div className="flex items-center gap-2 bg-black/60 px-6 py-2 rounded-full border border-white/20 animate-pulse">
                        <Loader2 className="animate-spin text-white" size={18} />
                        <span className="text-white font-black text-[10px] uppercase">Preparazione Magia...</span>
                    </div>
                )}

                <div className={`w-full max-w-2xl grid grid-cols-4 gap-2 md:gap-6 px-2 transition-all duration-500 ${recordedBuffer ? 'opacity-100 translate-y-0' : 'opacity-40 pointer-events-none translate-y-2'}`}>
                    {EFFECT_LIST.map((eff) => (
                        <button
                            key={eff.id}
                            onClick={() => playWithEffect(eff.id)}
                            className="aspect-square w-full transition-all hover:scale-110 active:scale-90 outline-none flex flex-col items-center justify-center p-1 group"
                        >
                            <img src={eff.img} alt={eff.label} className="w-full h-full object-contain drop-shadow-xl" />
                        </button>
                    ))}
                </div>
            </div>

            <div className="p-4 flex flex-col items-center opacity-40 shrink-0 mb-2">
                <p className="text-white font-black text-[7px] uppercase tracking-[0.4em]">Lone Boo Audio Lab • 2025</p>
            </div>

        </div>
    );
};

export default VocalFxPage;

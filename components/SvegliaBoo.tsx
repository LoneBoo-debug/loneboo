import React, { useEffect, useState, useRef } from 'react';
import { ArrowLeft, Send, Sun, Moon, Sparkles, Loader2, Volume2, VolumeX, Cloud, Hand, Smile, Eye, Brain, Heart, LogOut, MessageCircle, Globe, Music, Play, Pause, Square, Youtube, Image as ImageIcon, Trash2, Upload, Activity, Repeat, RotateCw, Sparkles as SparklesIcon, Zap, EyeOff, Flame, SmilePlus, Link as LinkIcon, HelpCircle, AlertCircle, ThumbsUp, ThumbsDown, Lock, KeyRound, BedDouble, X, Settings } from 'lucide-react';
import { AppView, ChatMessage } from '../types';
import AvatarBoo, { AvatarConfig, AvatarPartConfig, AVATAR_IMAGES } from './AvatarBoo';
import { generateSpeech } from '../services/ai';

interface SvegliaBooProps {
    setView: (view: AppView) => void;
}

const SVEGLIA_BG_MOBILE = 'https://i.postimg.cc/zB1zhV2V/Hailuo-Image-da-questa-immagine-togli-il-bl-455457776318812160.jpg';
const SVEGLIA_BG_DESKTOP = 'https://i.postimg.cc/zB1zhV2V/Hailuo-Image-da-questa-immagine-togli-il-bl-455457776318812160.jpg'; 
const THINKING_EYES_IMG = 'https://i.postimg.cc/43VQfXkH/Hailuo-Image-genera-tre-stati-di-ddquesti-ddocc-455131408418746368.png';

// --- VIDEO URLS CONFIGURATION ---
const VIDEO_URLS = {
    BALLA: 'https://res.cloudinary.com/djax1tgxn/video/upload/v1765396293/balla_w74kyy.webm',
    RIDE: 'https://res.cloudinary.com/djax1tgxn/video/upload/v1765396379/ride_ulzypp.webm',
    RUOTA: 'https://res.cloudinary.com/djax1tgxn/video/upload/v1765396399/ruota_vnrz1p.webm',
    PAZZO: 'https://res.cloudinary.com/djax1tgxn/video/upload/v1765396337/pazzo_rsmmxk.webm',
    BACIO: 'https://res.cloudinary.com/djax1tgxn/video/upload/v1765396104/bacio_nfl96j.webm',
    SALUTA: 'https://res.cloudinary.com/djax1tgxn/video/upload/v1765396420/saluta_qoqfmf.webm',
    NASCONDE: 'https://res.cloudinary.com/djax1tgxn/video/upload/v1765396315/nasconde_tjlerz.webm',
    RABBIA: 'https://res.cloudinary.com/djax1tgxn/video/upload/v1765396358/rabbia_grpul0.webm',
    JUMP: 'https://res.cloudinary.com/djax1tgxn/video/upload/v1765396293/balla_w74kyy.webm' 
};

// Initial Config (Positions)
const INITIAL_CONFIG: AvatarConfig = {
    eyes: { top: 7, left: 9, scale: 0.4 },
    eyesClosed: { top: 20, left: 9, scale: 0.5 },
    eyesThinking: { top: 6, left: 12, scale: 0.45 }, 
    mouth: { top: 46, left: 50, scale: 1.6 },
    armSx: { top: 30, left: -6, scale: 0.7, rotate: 5 }, 
    armDx: { top: 40, left: 70, scale: 0.9, rotate: -20 }
};

const EMOJIS = [
    '😀', '😂', '😍', '😎', '😜', '😡', '😱', '👻', 
    '🎃', '❤️', '🌟', '🎉', '🍕', '🍦', '🎈', '🐶',
    '🐱', '🌈', '🔥', '💀', '👋', '👍', '👎', '👀'
];

// YouTube API Type Definition
declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

const SvegliaBoo: React.FC<SvegliaBooProps> = ({ setView }) => {
  // --- AUTHENTICATION STATE ---
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');

  // --- APP STATE ---
  const [isLoaded, setIsLoaded] = useState(false);
  const [isTalking, setIsTalking] = useState(false);
  const [hasLeft, setHasLeft] = useState(false);
  
  // Chat State
  const [inputText, setInputText] = useState('');
  const [booResponse, setBooResponse] = useState("Tenetevi pronti, a breve inizia la Live...");
  const [isThinking, setIsThinking] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // Audio State
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [showSubtitle, setShowSubtitle] = useState(true);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);

  // --- MUSIC PLAYER STATE ---
  const [showMusicPanel, setShowMusicPanel] = useState(false);
  const [musicLink, setMusicLink] = useState('');
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [musicProgress, setMusicProgress] = useState(0);
  const [musicDuration, setMusicDuration] = useState(0);
  const playerRef = useRef<any>(null);
  const progressInterval = useRef<any>(null);

  // --- USER IMAGE STATE ---
  const [userImage, setUserImage] = useState<string | null>(null);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- ANIMATION STATE ---
  const [config, setConfig] = useState<AvatarConfig>(INITIAL_CONFIG);
  const [animOffset, setAnimOffset] = useState({ y: 0, rotate: 0 });
  const [overrideEyes, setOverrideEyes] = useState<string | undefined>(undefined);
  const [hearts, setHearts] = useState<{id: number, left: number, delay: number, scale: number, emoji: string, sway: number}[]>([]);
  const [statusEmoji, setStatusEmoji] = useState<string | null>(null);

  // --- VIDEO ACTION STATE ---
  const [isVideoActionPlaying, setIsVideoActionPlaying] = useState(false);
  const [isEnding, setIsEnding] = useState(false); 
  const [activeVideoSrc, setActiveVideoSrc] = useState<string>(VIDEO_URLS.BALLA);
  const [videoConfig, setVideoConfig] = useState({ scale: 2.5, x: 38, y: 24 }); 
  const videoActionRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    if (isUnlocked) {
        const imgM = new Image(); imgM.src = SVEGLIA_BG_MOBILE;
        const imgD = new Image(); imgD.src = SVEGLIA_BG_DESKTOP;
        
        imgD.onload = () => setIsLoaded(true);
        setTimeout(() => setIsLoaded(true), 1000);
        
        if (!window.YT) {
            const tag = document.createElement('script');
            tag.src = "https://www.youtube.com/iframe_api";
            const firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
        }
    }

    return () => {
        if (audioSourceRef.current) audioSourceRef.current.stop();
        if (audioContextRef.current) audioContextRef.current.close();
        if (progressInterval.current) clearInterval(progressInterval.current);
    };
  }, [isUnlocked]);

  const handleUnlock = () => {
      if (passwordInput === 'Mariella79') {
          setIsUnlocked(true);
          setAuthError('');
      } else {
          setAuthError('Parola magica sbagliata! Boo continua a dormire... 💤');
      }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
              setUserImage(reader.result as string);
          };
          reader.readAsDataURL(file);
      }
  };

  const handleImageUrlSubmit = () => {
      if (imageUrlInput.trim()) {
          setUserImage(imageUrlInput.trim());
          setImageUrlInput('');
      }
  };

  const removeUserImage = () => {
      setUserImage(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const extractVideoID = (url: string) => {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
      const match = url.match(regExp);
      return (match && match[2].length === 11) ? match[2] : null;
  };

  const loadMusicVideo = () => {
      const videoId = extractVideoID(musicLink);
      if (!videoId) {
          alert("Link YouTube non valido!");
          return;
      }

      if (playerRef.current) {
          playerRef.current.loadVideoById(videoId);
          setIsMusicPlaying(true);
      } else {
          if (window.YT && window.YT.Player) {
              playerRef.current = new window.YT.Player('hidden-player', {
                  height: '0',
                  width: '0',
                  videoId: videoId,
                  playerVars: { 'playsinline': 1, 'controls': 0, 'autoplay': 1 },
                  events: {
                      'onReady': (event: any) => {
                          event.target.playVideo();
                          setIsMusicPlaying(true);
                          setMusicDuration(event.target.getDuration());
                          startProgressTracking();
                      },
                      'onStateChange': (event: any) => {
                          if (event.data === window.YT.PlayerState.PLAYING) {
                              setIsMusicPlaying(true);
                              setMusicDuration(event.target.getDuration());
                              startProgressTracking();
                          } else {
                              setIsMusicPlaying(false);
                              stopProgressTracking();
                          }
                      }
                  }
              });
          }
      }
  };

  const startProgressTracking = () => {
      if (progressInterval.current) clearInterval(progressInterval.current);
      progressInterval.current = setInterval(() => {
          if (playerRef.current && playerRef.current.getCurrentTime) {
              setMusicProgress(playerRef.current.getCurrentTime());
          }
      }, 1000);
  };

  const stopProgressTracking = () => {
      if (progressInterval.current) clearInterval(progressInterval.current);
  };

  const toggleMusicPlay = () => {
      if (!playerRef.current) return;
      if (isMusicPlaying) {
          playerRef.current.pauseVideo();
      } else {
          playerRef.current.playVideo();
      }
  };

  const stopMusic = () => {
      if (!playerRef.current) return;
      playerRef.current.stopVideo();
      setMusicProgress(0);
      setIsMusicPlaying(false);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
      const time = parseFloat(e.target.value);
      setMusicProgress(time);
      if (playerRef.current) {
          playerRef.current.seekTo(time, true);
      }
  };

  const triggerStatusEmoji = (emoji: string) => {
      setStatusEmoji(emoji);
      setTimeout(() => {
          setStatusEmoji(null);
      }, 3000);
  };

  const triggerAction = (action: 'WAVE' | 'LAUGH' | 'HEART' | 'THINK' | 'EXIT' | 'VIDEO_DANCE' | 'VIDEO_LAUGH' | 'VIDEO_SPIN' | 'VIDEO_CRAZY' | 'VIDEO_KISS' | 'VIDEO_WAVE' | 'VIDEO_HIDE' | 'VIDEO_ANGRY') => {
      setAnimOffset({ y: 0, rotate: 0 });
      setOverrideEyes(undefined);
      setHearts([]);
      setIsEnding(false); 
      
      if (action !== 'EXIT') {
          setHasLeft(false);
      }

      switch (action) {
          case 'WAVE':
              let waveCount = 0;
              const originalRotate = config.armSx.rotate || 0;
              const waveInterval = setInterval(() => {
                  setConfig(prev => ({
                      ...prev,
                      armSx: { ...prev.armSx, rotate: waveCount % 2 === 0 ? originalRotate - 20 : originalRotate + 20 }
                  }));
                  waveCount++;
                  if (waveCount > 5) {
                      clearInterval(waveInterval);
                      setConfig(prev => ({ ...prev, armSx: { ...prev.armSx, rotate: originalRotate } }));
                  }
              }, 150);
              break;

          case 'LAUGH':
              setIsTalking(true); 
              let bounceCount = 0;
              const bounceInterval = setInterval(() => {
                  setAnimOffset(prev => ({ ...prev, y: bounceCount % 2 === 0 ? -15 : 0 }));
                  bounceCount++;
                  if (bounceCount > 10) { 
                      clearInterval(bounceInterval);
                      setAnimOffset({ y: 0, rotate: 0 });
                      setIsTalking(false); 
                  }
              }, 120);
              break;

          case 'HEART':
              setAnimOffset({ y: 0, rotate: 0 }); 
              
              const particleCount = 18;
              const heartEmojis = ['❤️', '💖', '💗', '💓', '✨', '😻'];
              
              const newHearts = Array.from({ length: particleCount }).map((_, i) => ({
                  id: Date.now() + i,
                  left: 40 + Math.random() * 20, 
                  delay: Math.random() * 0.8,
                  scale: 0.5 + Math.random() * 1.2,
                  emoji: heartEmojis[Math.floor(Math.random() * heartEmojis.length)],
                  sway: (Math.random() - 0.5) * 100
              }));
              setHearts(newHearts);
              setTimeout(() => setHearts([]), 3500);
              break;

          case 'THINK':
              setAnimOffset({ y: 0, rotate: 10 });
              setOverrideEyes(THINKING_EYES_IMG);
              const originalArmDx = { ...config.armDx };
              setConfig(prev => ({
                  ...prev,
                  armDx: { ...prev.armDx, rotate: -20, top: 30 } 
              }));
              setTimeout(() => {
                  setAnimOffset({ y: 0, rotate: 0 });
                  setOverrideEyes(undefined);
                  setConfig(prev => ({ ...prev, armDx: originalArmDx }));
              }, 2000);
              break;
          
          case 'EXIT':
              setAnimOffset({ y: 500, rotate: 0 }); 
              setTimeout(() => {
                  setHasLeft(true);
                  setAnimOffset({ y: 0, rotate: 0 });
              }, 300);
              break;

          case 'VIDEO_DANCE': setActiveVideoSrc(VIDEO_URLS.BALLA); setIsVideoActionPlaying(true); break;
          case 'VIDEO_LAUGH': setActiveVideoSrc(VIDEO_URLS.RIDE); setIsVideoActionPlaying(true); break;
          case 'VIDEO_SPIN': setActiveVideoSrc(VIDEO_URLS.RUOTA); setIsVideoActionPlaying(true); break;
          case 'VIDEO_CRAZY': setActiveVideoSrc(VIDEO_URLS.PAZZO); setIsVideoActionPlaying(true); break;
          case 'VIDEO_KISS': setActiveVideoSrc(VIDEO_URLS.BACIO); setIsVideoActionPlaying(true); break;
          case 'VIDEO_WAVE': setActiveVideoSrc(VIDEO_URLS.SALUTA); setIsVideoActionPlaying(true); break;
          case 'VIDEO_HIDE': setActiveVideoSrc(VIDEO_URLS.NASCONDE); setIsVideoActionPlaying(true); break;
          case 'VIDEO_ANGRY': setActiveVideoSrc(VIDEO_URLS.RABBIA); setIsVideoActionPlaying(true); break;
      }
  };

  const handleVideoEnd = () => {
      setIsEnding(true);
      setTimeout(() => {
          setIsVideoActionPlaying(false);
          setIsEnding(false);
      }, 1000);
  };

  const playPcmAudio = async (base64Audio: string) => {
      try {
          if (!audioContextRef.current) {
              audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
          }
          const ctx = audioContextRef.current;
          if (audioSourceRef.current) audioSourceRef.current.stop();

          const binaryString = atob(base64Audio);
          const len = binaryString.length;
          const bytes = new Uint8Array(len);
          for (let i = 0; i < len; i++) {
              bytes[i] = binaryString.charCodeAt(i);
          }
          const pcm16 = new Int16Array(bytes.buffer);
          const float32 = new Float32Array(pcm16.length);
          for (let i = 0; i < pcm16.length; i++) {
              float32[i] = pcm16[i] / 32768;
          }
          const buffer = ctx.createBuffer(1, float32.length, 24000);
          buffer.copyToChannel(float32, 0);
          const source = ctx.createBufferSource();
          source.buffer = buffer;
          source.connect(ctx.destination);
          
          source.onended = () => setIsTalking(false);
          setIsTalking(true);
          source.start();
          audioSourceRef.current = source;
          return true;
      } catch (e) {
          return false;
      }
  };

  const handleSendMessage = async () => {
      if (!inputText.trim() || isThinking) return;
      const speechText = inputText;
      setInputText('');
      setBooResponse("..."); 
      
      if (audioEnabled) {
          setIsThinking(true); 
          const resumeAudioPromise = (async () => {
              if (!audioContextRef.current) {
                  audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
              }
              if (audioContextRef.current.state === 'suspended') {
                  await audioContextRef.current.resume();
              }
          })();

          try {
              const [audioBase64] = await Promise.all([
                  generateSpeech(speechText),
                  resumeAudioPromise
              ]);
              setIsThinking(false);
              setBooResponse(speechText);
              if (audioBase64) {
                  const played = await playPcmAudio(audioBase64);
                  if (!played) fallbackAnimation(speechText);
              } else {
                  fallbackAnimation(speechText);
              }
          } catch (error) {
              setIsThinking(false);
              setBooResponse(speechText); 
              fallbackAnimation(speechText);
          }
      } else {
          setBooResponse(speechText);
          fallbackAnimation(speechText);
      }
  };

  const fallbackAnimation = (text: string) => {
      setIsTalking(true);
      const talkDuration = Math.min(Math.max(text.length * 60, 1500), 5000);
      setTimeout(() => setIsTalking(false), talkDuration);
  };

  const addEmoji = (emoji: string) => {
      setInputText(prev => prev + emoji);
  };

  // --- LOCK SCREEN (SERVICE PAGE) UI ---
  if (!isUnlocked) {
      return (
          <div className="fixed inset-0 z-[100] bg-slate-900 flex flex-col items-center justify-center p-6 animate-in fade-in duration-500">
              <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
                  <div className="absolute top-10 left-10 text-yellow-200 animate-pulse delay-700"><SparklesIcon size={24} /></div>
                  <div className="absolute bottom-20 right-10 text-yellow-200 animate-pulse delay-300"><SparklesIcon size={32} /></div>
              </div>

              <div className="relative z-10 flex flex-col items-center text-center max-w-md w-full">
                  <div className="relative mb-6">
                      <div className="absolute -top-4 -right-4 bg-yellow-400 rounded-full p-2 animate-bounce">
                          <span className="text-xl font-bold text-black">Zzz...</span>
                      </div>
                      <div className="bg-slate-800 p-6 rounded-full border-4 border-slate-700 shadow-xl">
                          <BedDouble size={64} className="text-blue-300" />
                      </div>
                  </div>

                  <h2 className="text-3xl md:text-4xl font-black text-white mb-2 tracking-wide">
                      Shhh! 🤫
                  </h2>
                  <h3 className="text-xl md:text-2xl font-black text-blue-300 mb-6">
                      Boo sta dormendo...
                  </h3>

                  <p className="text-slate-400 font-bold text-base md:text-lg mb-8 leading-relaxed">
                      Simpaticamente, Boo sta facendo un pisolino. <br/>
                      Non svegliarlo se non conosci la parola magica!
                  </p>

                  <div className="w-full bg-slate-800 p-4 rounded-2xl border-2 border-slate-700 shadow-lg mb-4">
                      <div className="flex items-center gap-2 mb-2 text-slate-400 font-bold text-xs uppercase tracking-widest">
                          <KeyRound size={14} /> Password Segreta
                      </div>
                      <input 
                          type="password" 
                          value={passwordInput}
                          onChange={(e) => setPasswordInput(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleUnlock()}
                          placeholder="Inserisci la parola magica..."
                          className="w-full bg-slate-900 text-white font-bold p-3 rounded-xl border border-slate-600 focus:border-yellow-400 focus:outline-none placeholder-slate-600 transition-colors"
                      />
                      {authError && (
                          <p className="text-red-400 font-bold text-xs mt-2 flex items-center gap-1 animate-pulse">
                              <AlertCircle size={12} /> {authError}
                          </p>
                      )}
                  </div>

                  <div className="flex flex-col gap-3 w-full">
                      <button 
                          onClick={handleUnlock}
                          className="w-full bg-yellow-400 text-black font-black py-4 rounded-xl border-b-4 border-yellow-600 hover:brightness-110 active:border-b-0 active:translate-y-1 transition-all shadow-lg flex items-center justify-center gap-2"
                      >
                          <Sun size={20} /> SVEGLIA BOO!
                      </button>
                      
                      <button 
                          onClick={() => setView(AppView.BOO_BEDROOM)}
                          className="w-full bg-slate-700 text-white font-bold py-3 rounded-xl border-2 border-slate-600 hover:bg-slate-600 transition-colors flex items-center justify-center gap-2"
                      >
                          <LogOut size={18} /> Lascialo dormire (Esci)
                      </button>
                  </div>
              </div>
          </div>
      );
  }

  // --- MAIN APP (UNLOCKED) ---
  return (
    <div className="relative w-full h-[calc(100vh-80px)] md:h-[calc(100vh-106px)] bg-sky-300 overflow-hidden flex flex-col md:flex-row">
        
        <div id="hidden-player" className="absolute top-0 left-0 w-0 h-0 opacity-0 pointer-events-none"></div>

        <style>{`
            @keyframes cloud-drift { 0% { transform: translateX(-150px); } 100% { transform: translateX(110vw); } }
            @keyframes bird-fly { 0% { transform: translateX(110vw) translateY(0) scaleX(1); } 25% { transform: translateX(75vw) translateY(15px) scaleX(1); } 50% { transform: translateX(50vw) translateY(-10px) scaleX(1); } 75% { transform: translateX(25vw) translateY(5px) scaleX(1); } 100% { transform: translateX(-20vw) translateY(-20px) scaleX(1); } }
            @keyframes wing-flap { 0%, 100% { transform: scaleY(1); } 50% { transform: scaleY(0.7); } }
            @keyframes heart-float { 
                0% { transform: translate(0, 0) scale(0); opacity: 0; } 
                10% { transform: translate(var(--sway-start), -10px) scale(var(--scale)); opacity: 1; }
                100% { transform: translate(var(--sway-end), -200px) scale(var(--scale)); opacity: 0; } 
            }
            @keyframes sun-spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
            
            .anim-cloud-slow { animation: cloud-drift 45s linear infinite; }
            .anim-cloud-fast { animation: cloud-drift 30s linear infinite; animation-delay: -10s; }
            .anim-cloud-medium { animation: cloud-drift 40s linear infinite; animation-delay: -20s; }
            .anim-cloud-offset { animation: cloud-drift 35s linear infinite; animation-delay: -5s; }
            .anim-bird-1 { animation: bird-fly 18s linear infinite; animation-delay: 0s; }
            .anim-bird-2 { animation: bird-fly 25s linear infinite; animation-delay: 5s; }
            .wing-animated { animation: wing-flap 0.2s infinite ease-in-out; transform-origin: center; }
            .anim-sun { animation: sun-spin 60s linear infinite; }
        `}</style>

        {/* --- MAIN CONTENT AREA (STAGE) --- */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-start md:justify-center pt-4 md:pt-0 px-4 gap-4 overflow-hidden w-full">
            
            {/* Background Image - Absolute inside Stage */}
            <div className="absolute inset-0 z-0">
                <img src={SVEGLIA_BG_MOBILE} alt="Sveglia Boo Mobile" className={`block md:hidden w-full h-full object-cover transition-opacity duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`} />
                <img src={SVEGLIA_BG_DESKTOP} alt="Sveglia Boo Desktop" className={`hidden md:block w-full h-full object-cover transition-opacity duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`} />
            </div>

            {/* Animated Background Elements */}
            <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none">
                <div className="absolute -top-10 -right-10 md:top-4 md:right-4 w-32 h-32 md:w-40 md:h-40 z-0 anim-sun opacity-90">
                    <Sun className="w-full h-full text-yellow-400 fill-yellow-200" />
                </div>
                <div className="absolute top-[5%] left-0 opacity-70 anim-cloud-slow"><Cloud fill="white" className="text-white w-24 h-24 blur-[1px]" /></div>
                <div className="absolute top-[15%] left-0 opacity-50 anim-cloud-fast scale-75"><Cloud fill="white" className="text-white w-20 h-20 blur-[1px]" /></div>
                <div className="absolute top-[25%] left-0 opacity-60 anim-cloud-medium scale-90"><Cloud fill="white" className="text-white w-22 h-22 blur-[1px]" /></div>
                <div className="absolute top-[10%] left-0 opacity-40 anim-cloud-offset scale-50"><Cloud fill="white" className="text-white w-16 h-16 blur-[0.5px]" /></div>
                <div className="absolute top-0 left-0 opacity-90 anim-plane z-10">
                    <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-white fill-white/80 drop-shadow-sm">
                        <path d="M2 12l20-9-9 20-2-9-9-2z" />
                    </svg>
                </div>
                <div className="absolute top-[20%] right-0 opacity-80 text-gray-900 anim-bird-1 z-20">
                    <svg width="40" height="20" viewBox="0 0 40 20" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M2 12 Q 10 2 20 12 Q 30 2 38 12" className="wing-animated" />
                    </svg>
                </div>
                <div className="absolute top-[10%] right-0 opacity-60 text-gray-800 anim-bird-2 scale-75 z-20">
                    <svg width="40" height="20" viewBox="0 0 40 20" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M2 12 Q 10 2 20 12 Q 30 2 38 12" className="wing-animated" />
                    </svg>
                </div>
            </div>

            {/* LIVE INDICATOR */}
            {!hasLeft && (
                <div className="absolute top-20 left-[22%] md:left-[25%] z-50 flex items-center gap-2 bg-black/70 backdrop-blur-md px-3 py-1.5 md:px-4 md:py-2 rounded-full border-2 border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.6)] animate-pulse">
                    <div className="w-2.5 h-2.5 md:w-3 md:h-3 bg-red-600 rounded-full shadow-[0_0_10px_red]"></div>
                    <span className="text-white font-black tracking-widest text-[10px] md:text-xs lg:text-sm drop-shadow-[0_0_5px_rgba(255,255,255,0.8)] whitespace-nowrap" style={{ fontFamily: '"Arial", sans-serif' }}>
                        LIVE ON AIR
                    </span>
                </div>
            )}
            
            {/* SUBTITLE */}
            {!hasLeft && showSubtitle && (
                <div className="absolute bottom-[30px] md:bottom-8 left-0 right-0 z-[60] flex justify-center px-4 transition-opacity duration-300 pointer-events-none">
                    <div className="bg-black/40 backdrop-blur-[2px] px-6 py-4 rounded-2xl border-2 border-white/10 shadow-lg w-[95%] md:w-[700px]">
                        <p 
                            className={`text-lg md:text-2xl font-bold text-center leading-relaxed break-words whitespace-pre-wrap ${isThinking ? 'animate-pulse text-gray-300' : 'text-white'}`}
                            style={{ textShadow: "1px 1px 2px black", fontFamily: '"Fredoka", sans-serif' }}
                        >
                            {booResponse}
                        </p>
                    </div>
                </div>
            )}

            {/* AVATAR + USER IMAGE + VIDEO CONTAINER */}
            <div className="relative mb-2 pointer-events-auto mt-16 md:mt-4 transition-all duration-300 ease-out w-full flex justify-center z-20" style={{ transform: `translateY(${animOffset.y}px) rotate(${animOffset.rotate}deg)` }}>
                {hasLeft ? (
                    <div className="bg-white/95 backdrop-blur-md p-8 rounded-[40px] border-8 border-cyan-500 shadow-2xl text-center max-w-md animate-in zoom-in duration-500">
                        <h2 className="text-3xl font-black text-gray-800 mb-4 leading-tight">Lone Boo è andato via! 👋</h2>
                        <p className="text-xl font-bold text-gray-600 mb-8 leading-relaxed">L'hanno chiamato a <span className="text-pink-500">Città Colorata</span> per una missione urgente!</p>
                        <div className="flex flex-col gap-3 items-center">
                            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">VIENI A TROVARCI SU:</p>
                            <div className="bg-yellow-400 text-black font-black py-4 px-8 rounded-2xl border-4 border-black shadow-[4px_4px_0_black] text-xl md:text-3xl tracking-wide transform -rotate-2 select-all">www.loneboo.online</div>
                        </div>
                    </div>
                ) : (
                    <div className="relative w-full max-w-3xl flex justify-center items-center">
                        
                        {userImage && !isVideoActionPlaying && (
                            <div className="absolute left-2 md:left-10 top-1/2 -translate-y-1/2 z-20 animate-in slide-in-from-left duration-500 group">
                                <div className="relative p-2 bg-white rounded-xl border-4 border-black shadow-[4px_4px_0_rgba(0,0,0,0.5)] transform -rotate-3 hover:rotate-0 transition-transform cursor-move">
                                    <img 
                                        src={userImage} 
                                        alt="User Upload" 
                                        className="max-w-[120px] md:max-w-[200px] max-h-[200px] object-cover rounded-lg pointer-events-none"
                                    />
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-red-500 border-2 border-black shadow-sm z-30"></div>
                                </div>
                            </div>
                        )}

                        <div className="transform transition-transform duration-500 relative flex justify-center items-center">
                            {statusEmoji && (
                                <div className="absolute -top-20 -right-16 md:-right-28 z-50 animate-in zoom-in slide-in-from-bottom-4 duration-300 origin-bottom-left">
                                    <span className="text-8xl md:text-9xl filter drop-shadow-xl block transform rotate-12">{statusEmoji}</span>
                                </div>
                            )}

                            <div className={`transition-all duration-1000 ease-out ${isVideoActionPlaying && !isEnding ? 'opacity-0 scale-95 blur-sm' : 'opacity-100 scale-100 blur-0'}`}>
                                <AvatarBoo 
                                    isTalking={isTalking} 
                                    config={config} 
                                    overrideEyes={overrideEyes} 
                                />
                                {hearts.map(heart => (
                                    <div 
                                        key={heart.id} 
                                        className="absolute text-4xl" 
                                        style={{ 
                                            top: '40%', 
                                            left: `${heart.left}%`, 
                                            animation: `heart-float 2.5s ease-out forwards`, 
                                            animationDelay: `${heart.delay}s`, 
                                            zIndex: 60,
                                            // @ts-ignore
                                            '--sway-start': `${heart.sway * 0.2}px`,
                                            '--sway-end': `${heart.sway}px`,
                                            '--scale': heart.scale
                                        }}
                                    >
                                        {heart.emoji}
                                    </div>
                                ))}
                            </div>

                            {isVideoActionPlaying && (
                                <div className={`absolute z-50 flex justify-center items-center transition-opacity duration-1000 ${isEnding ? 'opacity-0' : 'opacity-100'}`} 
                                    style={{ 
                                        transform: `translate(${videoConfig.x}px, ${videoConfig.y}px) scale(${videoConfig.scale})`,
                                        width: '160px', height: '160px', 
                                        pointerEvents: 'none'
                                    }}
                                >
                                    <video 
                                        ref={videoActionRef}
                                        src={activeVideoSrc}
                                        autoPlay={isVideoActionPlaying}
                                        playsInline
                                        className="w-full h-full object-contain"
                                        onEnded={handleVideoEnd}
                                    />
                                </div>
                            )}
                        </div>
                        
                        {!isVideoActionPlaying && <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-48 h-10 bg-black/20 blur-2xl rounded-full transition-transform duration-300 z-0" style={{ transform: `scale(${1 - (animOffset.y / -50)})` }}></div>}
                    </div>
                )}
            </div>
        </div>

        {/* --- CONSOLE DI CONTROLLO (SIDEBAR) --- */}
        <div className="relative w-full z-40 transition-transform duration-300 md:static md:w-[280px] md:h-full md:border-t-0 md:border-l-4 md:flex-shrink-0 bg-slate-900 border-t-4 border-black p-2 md:p-4">
            <div className="max-w-xl mx-auto flex flex-col gap-2 h-full md:justify-start pt-2 overflow-y-auto md:overflow-visible pb-16 md:pb-0">
                
                {/* 1. ACTIONS ROW */}
                <div className="grid grid-cols-5 gap-1 md:gap-2 shrink-0">
                    <button onClick={() => triggerAction('WAVE')} className="aspect-square bg-blue-500 hover:bg-blue-400 text-white rounded-xl border-b-4 border-blue-700 active:border-b-0 active:translate-y-1 shadow-lg flex items-center justify-center"><Hand size={20} /></button>
                    <button onClick={() => triggerAction('LAUGH')} className="aspect-square bg-yellow-400 hover:bg-yellow-300 text-black rounded-xl border-b-4 border-yellow-600 active:border-b-0 active:translate-y-1 shadow-lg flex items-center justify-center"><Smile size={20} /></button>
                    <button onClick={() => triggerAction('HEART')} className="aspect-square bg-pink-500 hover:bg-pink-400 text-white rounded-xl border-b-4 border-pink-700 active:border-b-0 active:translate-y-1 shadow-lg flex items-center justify-center"><Heart size={20} fill="currentColor" /></button>
                    <button onClick={() => triggerAction('THINK')} className="aspect-square bg-purple-500 hover:bg-purple-400 text-white rounded-xl border-b-4 border-purple-700 active:border-b-0 active:translate-y-1 shadow-lg flex items-center justify-center"><Brain size={20} /></button>
                    <button onClick={() => triggerAction('EXIT')} className="aspect-square bg-red-500 hover:bg-red-400 text-white rounded-xl border-b-4 border-red-700 active:border-b-0 active:translate-y-1 shadow-lg flex items-center justify-center"><LogOut size={20} /></button>
                </div>

                {/* 2. VIDEO ACTIONS GRID */}
                <div className="grid grid-cols-4 gap-1 md:gap-2 shrink-0">
                    <button onClick={() => triggerAction('VIDEO_DANCE')} className="aspect-square bg-orange-500 hover:bg-orange-400 text-white rounded-xl border-b-4 border-orange-700 active:border-b-0 active:translate-y-1 shadow-lg flex items-center justify-center" title="Balla"><Music size={20} /></button>
                    <button onClick={() => triggerAction('VIDEO_LAUGH')} className="aspect-square bg-yellow-400 hover:bg-yellow-300 text-black rounded-xl border-b-4 border-yellow-600 active:border-b-0 active:translate-y-1 shadow-lg flex items-center justify-center" title="Ride"><SmilePlus size={20} /></button>
                    <button onClick={() => triggerAction('VIDEO_SPIN')} className="aspect-square bg-blue-500 hover:bg-blue-400 text-white rounded-xl border-b-4 border-blue-700 active:border-b-0 active:translate-y-1 shadow-lg flex items-center justify-center" title="Gira"><RotateCw size={20} /></button>
                    <button onClick={() => triggerAction('VIDEO_CRAZY')} className="aspect-square bg-green-500 hover:bg-green-400 text-white rounded-xl border-b-4 border-green-700 active:border-b-0 active:translate-y-1 shadow-lg flex items-center justify-center" title="Pazzo"><Zap size={20} /></button>
                    <button onClick={() => triggerAction('VIDEO_KISS')} className="aspect-square bg-pink-500 hover:bg-pink-400 text-white rounded-xl border-b-4 border-pink-700 active:border-b-0 active:translate-y-1 shadow-lg flex items-center justify-center" title="Bacio"><Heart size={20} /></button>
                    <button onClick={() => triggerAction('VIDEO_WAVE')} className="aspect-square bg-indigo-500 hover:bg-indigo-400 text-white rounded-xl border-b-4 border-indigo-700 active:border-b-0 active:translate-y-1 shadow-lg flex items-center justify-center" title="Saluta"><Hand size={20} /></button>
                    <button onClick={() => triggerAction('VIDEO_HIDE')} className="aspect-square bg-gray-500 hover:bg-gray-400 text-white rounded-xl border-b-4 border-gray-700 active:border-b-0 active:translate-y-1 shadow-lg flex items-center justify-center" title="Nascondino"><EyeOff size={20} /></button>
                    <button onClick={() => triggerAction('VIDEO_ANGRY')} className="aspect-square bg-red-600 hover:bg-red-500 text-white rounded-xl border-b-4 border-red-800 active:border-b-0 active:translate-y-1 shadow-lg flex items-center justify-center" title="Rabbia"><Flame size={20} /></button>
                </div>

                {/* 3. INPUT AREA */}
                <div className="bg-slate-800 p-2 rounded-xl border-2 border-slate-700 flex flex-col gap-2 shrink-0">
                    <div className="flex gap-2">
                        <input 
                            type="text" 
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            placeholder="Scrivi a Boo..."
                            className="flex-1 bg-slate-700 text-white px-3 py-2 rounded-lg border border-slate-600 focus:border-yellow-400 outline-none text-sm"
                            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                        />
                        <button onClick={handleSendMessage} className="bg-yellow-400 text-black p-2 rounded-lg hover:bg-yellow-300 transition-colors">
                            {isThinking ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
                        </button>
                    </div>
                    
                    <div className="flex justify-between items-center">
                        <button onClick={() => setShowEmojiPicker(!showEmojiPicker)} className="text-slate-400 hover:text-yellow-400 transition-colors">
                            <Smile size={20} />
                        </button>
                        <div className="flex gap-2">
                            <button onClick={() => setAudioEnabled(!audioEnabled)} className={`p-1 rounded ${audioEnabled ? 'text-green-400' : 'text-red-400'}`}>
                                {audioEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
                            </button>
                            <button onClick={() => setShowSubtitle(!showSubtitle)} className={`p-1 rounded ${showSubtitle ? 'text-blue-400' : 'text-slate-500'}`}>
                                <MessageCircle size={20} />
                            </button>
                        </div>
                    </div>

                    {showEmojiPicker && (
                        <div className="grid grid-cols-8 gap-1 p-2 bg-slate-900 rounded-lg border border-slate-700">
                            {EMOJIS.map(e => (
                                <button key={e} onClick={() => addEmoji(e)} className="hover:bg-white/10 rounded p-1 text-lg">{e}</button>
                            ))}
                        </div>
                    )}
                </div>

                {/* 4. SETTINGS / EXTRAS */}
                <div className="bg-slate-800 p-2 rounded-xl border-2 border-slate-700 shrink-0">
                    <div className="flex items-center gap-2 mb-2 text-slate-400 text-xs font-bold uppercase">
                        <Settings size={12} /> Personalizza
                    </div>
                    
                    {/* User Image Upload */}
                    <div className="flex gap-2 mb-2">
                        <label className="flex-1 bg-slate-700 text-white text-xs font-bold py-2 rounded-lg border border-slate-600 hover:bg-slate-600 cursor-pointer flex items-center justify-center gap-1">
                            <Upload size={14} /> FOTO
                            <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
                        </label>
                        {userImage && (
                            <button onClick={removeUserImage} className="bg-red-500/20 text-red-400 p-2 rounded-lg hover:bg-red-500/40">
                                <Trash2 size={14} />
                            </button>
                        )}
                    </div>

                    {/* Music Link */}
                    <div className="flex gap-2">
                        <button onClick={() => setShowMusicPanel(!showMusicPanel)} className="flex-1 bg-purple-600 text-white text-xs font-bold py-2 rounded-lg border border-purple-500 hover:bg-purple-500 flex items-center justify-center gap-1">
                            <Music size={14} /> MUSICA
                        </button>
                    </div>
                </div>

                {/* MUSIC PANEL (CONDITIONAL) */}
                {showMusicPanel && (
                    <div className="bg-slate-800 p-2 rounded-xl border-2 border-purple-500 shrink-0 animate-in slide-in-from-bottom">
                        <div className="flex gap-1 mb-2">
                            <input 
                                type="text" 
                                value={musicLink} 
                                onChange={(e) => setMusicLink(e.target.value)}
                                placeholder="Link YouTube..."
                                className="flex-1 bg-slate-900 text-white px-2 py-1 rounded text-xs border border-slate-600"
                            />
                            <button onClick={loadMusicVideo} className="bg-purple-600 text-white p-1 rounded hover:bg-purple-500"><LinkIcon size={14} /></button>
                        </div>
                        {isMusicPlaying && (
                            <div className="flex items-center gap-2">
                                <button onClick={toggleMusicPlay} className="text-white hover:text-purple-400">
                                    {isMusicPlaying ? <Pause size={16} /> : <Play size={16} />}
                                </button>
                                <input 
                                    type="range" 
                                    min="0" 
                                    max={musicDuration} 
                                    value={musicProgress} 
                                    onChange={handleSeek}
                                    className="flex-1 h-1 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-purple-500"
                                />
                                <button onClick={stopMusic} className="text-red-400 hover:text-red-300"><Square size={14} /></button>
                            </div>
                        )}
                    </div>
                )}

                {/* BACK BUTTON */}
                <div className="mt-auto">
                    <button onClick={() => setView(AppView.BOO_BEDROOM)} className="w-full bg-slate-700 text-white font-bold py-3 rounded-xl border-2 border-slate-600 hover:bg-slate-600 transition-colors flex items-center justify-center gap-2">
                        <ArrowLeft size={18} /> ESCI DA SVEGLIA
                    </button>
                </div>

            </div>
        </div>

    </div>
  );
};

export default SvegliaBoo;
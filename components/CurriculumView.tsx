
import React, { useState, useEffect, useRef } from 'react';
import { GradeCurriculumData, SchoolSubject, SchoolChapter, SchoolLesson, AppView } from '../types';
import { Book, ChevronLeft, Volume2, CheckCircle, XCircle, ArrowRight, Star, ClipboardCheck, X, Pause, ImageIcon, PlayCircle } from 'lucide-react';

const CUSTOM_ITALIAN_BG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/pagaperitascho.webp';
const CUSTOM_MATH_BG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/matsfcsh887liber.webp';
const CUSTOM_HISTORY_BG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/storbucscha88.webp';
const CUSTOM_GEOGRAPHY_BG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/geosfbush662.webp';
const CUSTOM_SCIENCE_BG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/scebghim712.webp';
const CUSTOM_CLOSE_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/chiudisade.webp';
const CUSTOM_LISTEN_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/scoltalibrso.webp';
const CUSTOM_VERIFY_BTN = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/esercschol4321.webp';
const CUSTOM_VISUAL_BTN = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/visuallibrsches432.webp';
const CUSTOM_VIDEO_BTN = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/tyfgre.webp';
const CUSTOM_GAME_BTN = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/giochrees22541.webp';

const VOCALI_VIDEO_URL = 'https://www.youtube.com/embed/W12CrAsUK-w?autoplay=1&rel=0&modestbranding=1';

interface CurriculumViewProps {
  data: GradeCurriculumData;
  initialSubject: SchoolSubject;
  onExit: () => void;
  bgUrl: string;
  setView?: (view: AppView) => void;
}

const CurriculumView: React.FC<CurriculumViewProps> = ({ data, initialSubject, onExit, bgUrl, setView }) => {
  const [selectedSubject, setSelectedSubject] = useState<SchoolSubject>(initialSubject);
  const [selectedChapter, setSelectedChapter] = useState<SchoolChapter | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<SchoolLesson | null>(null);
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isExerciseOpen, setIsExerciseOpen] = useState(false);
  const [isVisualExerciseOpen, setIsVisualExerciseOpen] = useState(false);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Verifichiamo se è un libro con layout speciale
  const isSpecialBook = selectedSubject === SchoolSubject.ITALIANO || 
                        selectedSubject === SchoolSubject.MATEMATICA || 
                        selectedSubject === SchoolSubject.STORIA ||
                        selectedSubject === SchoolSubject.GEOGRAFIA ||
                        selectedSubject === SchoolSubject.SCIENZE;
  
  const getSpecialBg = () => {
    if (selectedSubject === SchoolSubject.ITALIANO) return CUSTOM_ITALIAN_BG;
    if (selectedSubject === SchoolSubject.MATEMATICA) return CUSTOM_MATH_BG;
    if (selectedSubject === SchoolSubject.STORIA) return CUSTOM_HISTORY_BG;
    if (selectedSubject === SchoolSubject.GEOGRAFIA) return CUSTOM_GEOGRAPHY_BG;
    if (selectedSubject === SchoolSubject.SCIENZE) return CUSTOM_SCIENCE_BG;
    return CUSTOM_ITALIAN_BG;
  };

  const specialBg = getSpecialBg();

  const subjects = [
    { key: SchoolSubject.ITALIANO, label: 'Italiano', color: 'bg-red-500', icon: '✍️' },
    { key: SchoolSubject.MATEMATICA, label: 'Matematica', color: 'bg-blue-500', icon: '🔢' },
    { key: SchoolSubject.STORIA, label: 'Storia', color: 'bg-amber-600', icon: '⏳' },
    { key: SchoolSubject.GEOGRAFIA, label: 'Geografia', color: 'bg-green-600', icon: '🌍' },
    { key: SchoolSubject.SCIENZE, label: 'Scienze', color: 'bg-purple-500', icon: '🧪' },
  ];

  const subjectInfo = subjects.find(s => s.key === selectedSubject)!;

  const toggleLessonAudio = (url: string) => {
    if (!url) {
        alert("Audio non ancora disponibile per questa lezione.");
        return;
    }

    if (audioRef.current && audioRef.current.src === url) {
        if (isAudioPlaying) {
            audioRef.current.pause();
            setIsAudioPlaying(false);
        } else {
            audioRef.current.play().catch(e => console.error("Audio error", e));
            setIsAudioPlaying(true);
        }
    } else {
        if (audioRef.current) {
            audioRef.current.pause();
        }
        const audio = new Audio(url);
        audio.onended = () => setIsAudioPlaying(false);
        audio.play().catch(e => console.error("Audio error", e));
        audioRef.current = audio;
        setIsAudioPlaying(true);
    }
  };

  useEffect(() => {
    return () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current = null;
        }
    };
  }, []);

  const handleQuizChoice = (idx: number) => {
    if (quizAnswer !== null) return;
    setQuizAnswer(idx);
    setShowFeedback(true);
    if (idx !== selectedLesson?.quiz.correctIndex) {
        setTimeout(() => {
            setQuizAnswer(null);
            setShowFeedback(false);
        }, 2000);
    }
  };

  const handleJumpToGame = (gameId: string) => {
    if (setView) {
        sessionStorage.setItem('target_game', gameId);
        setView(AppView.PLAY);
    }
  };

  // --- RENDERER: CAPITOLI (Indice del Libro) ---
  if (!selectedLesson) {
    const chapters = data.subjects[selectedSubject] || [];

    return (
      <div className="fixed inset-0 z-[150] flex flex-col bg-white overflow-hidden animate-in slide-in-from-right">
        {isSpecialBook && (
            <img src={specialBg} alt="" className="absolute inset-0 w-full h-full object-fill z-0" />
        )}

        {!isSpecialBook && (
            <div className={`${subjectInfo.color} p-4 md:p-6 flex items-center justify-between border-b-8 border-black/10 shrink-0 mt-[64px] md:mt-[96px] z-10`}>
                <button onClick={onExit} className="bg-white/20 p-2 rounded-full text-white hover:bg-white/30 transition-all">
                    <ChevronLeft size={32} strokeWidth={3} />
                </button>
                <h2 className="text-white font-black text-2xl md:text-4xl uppercase tracking-tighter drop-shadow-md">
                    Libro di {subjectInfo.label} - Classe {data.grade}ª
                </h2>
                <div className="w-10"></div>
            </div>
        )}

        {isSpecialBook && (
            <button 
                onClick={onExit} 
                className="fixed top-48 left-10 md:top-64 md:left-16 z-50 hover:scale-110 active:scale-95 transition-all outline-none"
            >
                <img src={CUSTOM_CLOSE_IMG} alt="Chiudi" className="w-16 h-16 md:w-20 md:h-20 drop-shadow-2xl" />
            </button>
        )}

        <div className={`flex-1 flex flex-col items-center z-10 ${isSpecialBook ? 'pt-64 md:pt-80 bg-transparent' : 'bg-slate-50 p-6 overflow-y-auto'}`}>
            <div className={`w-full max-w-4xl space-y-1 md:space-y-2 ${isSpecialBook ? 'px-12 md:px-24' : ''}`}>
                {chapters.length > 0 ? chapters.map(ch => (
                    <div key={ch.id} className={isSpecialBook ? "" : "bg-white rounded-3xl border-4 border-slate-200 p-6 shadow-sm mb-4"}>
                        {isSpecialBook ? (
                            <button 
                                onClick={() => ch.lessons.length > 0 && setSelectedLesson(ch.lessons[0])}
                                className="w-full text-left font-black text-slate-700 text-xl md:text-4xl uppercase tracking-tighter hover:text-blue-600 transition-colors py-1 md:py-2 flex justify-between items-center group active:scale-98"
                            >
                                <span>{ch.title}</span>
                                <ArrowRight size={28} className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-500" />
                            </button>
                        ) : (
                            <>
                                <h3 className="font-black text-xl md:text-3xl text-slate-800 mb-4 flex items-center gap-2 uppercase tracking-tight">
                                    < Book className={subjectInfo.color.replace('bg-', 'text-')} /> 
                                    {ch.title}
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {ch.lessons.map(ls => (
                                        <button 
                                            key={ls.id} 
                                            onClick={() => setSelectedLesson(ls)} 
                                            className="bg-slate-100 hover:bg-white hover:border-blue-400 border-2 border-transparent p-4 rounded-2xl text-left font-bold text-slate-600 transition-all flex justify-between items-center group shadow-sm active:scale-95"
                                        >
                                            <span className="truncate">{ls.title}</span>
                                            <ArrowRight size={24} className="text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                )) : (
                    <div className="flex flex-col items-center justify-center py-20 opacity-30">
                        < Book size={64} className="mb-4" />
                        <span className="font-black text-3xl uppercase">Lezioni in arrivo...</span>
                    </div>
                )}
            </div>
        </div>
      </div>
    );
  }

  // --- RENDERER: LEZIONE + QUIZ ---
  return (
      <div className="fixed inset-0 z-[160] flex flex-col bg-white overflow-hidden animate-in zoom-in-95 duration-300">
          {isSpecialBook && (
            <img src={specialBg} alt="" className="absolute inset-0 w-full h-full object-fill z-0" />
          )}

          {!isSpecialBook && (
            <div className={`${subjectInfo.color} p-4 md:p-6 flex items-center justify-between border-b-8 border-black/10 shrink-0 mt-[64px] md:mt-[96px] z-10`}>
                <button onClick={() => { setSelectedLesson(null); setQuizAnswer(null); setShowFeedback(false); if (audioRef.current) { audioRef.current.pause(); setIsAudioPlaying(false); } }} className="bg-white/20 p-2 rounded-full text-white hover:bg-white/30 transition-all">
                    <ChevronLeft size={32} strokeWidth={3} />
                </button>
                <div className="text-center">
                    <span className="text-white/60 font-black text-[10px] uppercase block mb-1 tracking-widest">{selectedSubject}</span>
                    <h2 className="text-white font-black text-xl md:text-3xl uppercase tracking-tighter truncate max-w-[200px] md:max-w-md drop-shadow-md">
                        {selectedLesson.title}
                    </h2>
                </div>
                <button 
                    onClick={() => toggleLessonAudio(selectedLesson.audioUrl)} 
                    className="bg-yellow-400 p-3 rounded-full text-black hover:scale-110 active:scale-90 transition-all shadow-lg border-4 border-white"
                >
                    {isAudioPlaying ? <Pause size={28} strokeWidth={2.5} /> : <Volume2 size={28} strokeWidth={2.5} />}
                </button>
            </div>
          )}

          {isSpecialBook && (
            <>
                <button 
                    onClick={() => { setSelectedLesson(null); setQuizAnswer(null); setShowFeedback(false); if (audioRef.current) { audioRef.current.pause(); setIsAudioPlaying(false); } }}
                    className="fixed top-48 left-10 md:top-64 md:left-16 z-50 hover:scale-110 active:scale-95 transition-all outline-none"
                >
                    <img src={CUSTOM_CLOSE_IMG} alt="Torna all'indice" className="w-16 h-16 md:w-20 md:h-20 drop-shadow-2xl" />
                </button>
                <button 
                    onClick={() => toggleLessonAudio(selectedLesson.audioUrl)} 
                    className="fixed top-48 right-10 md:top-64 md:right-16 z-50 hover:scale-110 active:scale-95 transition-all outline-none"
                >
                    <div className="relative">
                        <img src={CUSTOM_LISTEN_IMG} alt="Ascolta" className="w-16 h-16 md:w-20 md:h-20 drop-shadow-2xl" />
                        {isAudioPlaying && (
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="bg-black/20 rounded-full p-2">
                                    <Pause size={24} className="text-white fill-white" />
                                </div>
                            </div>
                        )}
                    </div>
                </button>
            </>
          )}

          <div className={`flex-1 flex flex-col items-center z-10 overflow-hidden ${isSpecialBook ? 'pt-52 md:pt-64 bg-transparent' : 'bg-white pt-10'}`}>
              <div className={`w-full max-w-4xl h-full flex flex-col items-center ${isSpecialBook ? 'px-14 md:px-32' : 'px-4'}`}>
                  
                  {/* Testo Lezione */}
                  <div className={`w-full flex-1 flex flex-col items-center justify-center`}>
                      {isSpecialBook && (
                          <h2 className="font-luckiest text-blue-600 text-3xl md:text-6xl mb-4 md:mb-8 uppercase tracking-tighter drop-shadow-sm text-center">
                              {selectedLesson.title}
                          </h2>
                      )}
                      <p className={`
                        leading-relaxed whitespace-pre-wrap font-sans font-black
                        ${isSpecialBook ? 'text-slate-800 text-base md:text-3xl text-justify' : 'text-center text-slate-700 text-lg md:text-2xl p-8 rounded-3xl bg-slate-50 border-2 border-slate-100 shadow-inner'}
                      `}>
                          {selectedLesson.text}
                      </p>
                  </div>

                  {/* Tasti Esercizio Affiancati (Solo per Special Books) */}
                  {isSpecialBook && (
                      <div className="pb-32 md:pb-44 shrink-0 w-full flex justify-start items-center gap-4 -ml-4 md:-ml-24">
                          <button 
                            onClick={() => setIsExerciseOpen(true)}
                            className="hover:scale-110 active:scale-95 transition-all outline-none rotate-[-3deg]"
                          >
                              <img src={CUSTOM_VERIFY_BTN} alt="Verifica" className="w-28 h-12 md:w-44 md:h-18 object-fill drop-shadow-xl rounded-xl" />
                          </button>
                          
                          <button 
                            onClick={() => setIsVisualExerciseOpen(true)}
                            className="hover:scale-110 active:scale-95 transition-all outline-none"
                          >
                              <img src={CUSTOM_VISUAL_BTN} alt="Esercizio Visuale" className="w-28 h-12 md:w-44 md:h-18 object-fill drop-shadow-xl rounded-xl" />
                          </button>

                          {/* TASTO VIDEO SPECIFICO PER LE VOCALI */}
                          {selectedLesson.id === 'it1_c1_l1' && (
                            <button 
                                onClick={() => setIsVideoOpen(true)}
                                className="hover:scale-110 active:scale-95 transition-all outline-none"
                            >
                                <img src={CUSTOM_VIDEO_BTN} alt="Video Vocali" className="w-28 h-12 md:w-44 md:h-18 object-fill drop-shadow-xl rounded-xl" />
                            </button>
                          )}

                          {/* TASTO GIOCO SPECIFICO PER LE PAROLE */}
                          {selectedLesson.id === 'it1_c4_l1' && (
                            <button 
                                onClick={() => handleJumpToGame('WORDGUESS')}
                                className="hover:scale-110 active:scale-95 transition-all outline-none"
                            >
                                <img src={CUSTOM_GAME_BTN} alt="Gara di Parole" className="w-28 h-12 md:w-44 md:h-18 object-fill drop-shadow-xl rounded-xl" />
                            </button>
                          )}
                      </div>
                  )}

                  {/* Quiz Inline (Solo se NON Special) */}
                  {!isSpecialBook && (
                      <div className="w-full bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl text-white mb-20 mt-10">
                          <div className="flex items-center gap-3 mb-6">
                              <Star className="text-yellow-400 fill-yellow-400" size={24} />
                              <h4 className="text-xl font-black uppercase tracking-tight">Mini Sfida!</h4>
                          </div>
                          <p className="text-lg font-bold mb-8 text-blue-200">{selectedLesson.quiz.question}</p>
                          <div className="grid grid-cols-1 gap-4">
                              {selectedLesson.quiz.options.map((opt, idx) => (
                                  <button 
                                      key={idx}
                                      onClick={() => handleQuizChoice(idx)}
                                      className={`
                                          p-5 rounded-2xl font-black text-lg border-4 transition-all text-left
                                          ${quizAnswer === null ? 'bg-slate-800 border-slate-700 hover:border-blue-500' : ''}
                                          ${quizAnswer === idx && idx === selectedLesson.quiz.correctIndex ? 'bg-green-500 border-green-300 text-white' : ''}
                                          ${quizAnswer === idx && idx !== selectedLesson.quiz.correctIndex ? 'bg-red-500 border-red-300 text-white animate-shake' : ''}
                                      `}
                                  >
                                      {opt}
                                  </button>
                              ))}
                          </div>
                      </div>
                  )}
              </div>
          </div>

          {/* MODALE ESERCIZIO STANDARD */}
          {isExerciseOpen && isSpecialBook && (
              <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300">
                  <div className="bg-white w-full max-w-md rounded-[3rem] border-8 border-blue-500 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 relative flex flex-col">
                      <button 
                        onClick={() => { setIsExerciseOpen(false); setQuizAnswer(null); setShowFeedback(false); }}
                        className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-full border-4 border-black hover:scale-110 active:scale-95 transition-all z-10"
                      >
                          <X size={24} strokeWidth={4} />
                      </button>
                      <div className="p-3 md:p-4 flex justify-center border-b-4 border-slate-100 shrink-0">
                          <img src={CUSTOM_VERIFY_BTN} alt="Esercizio" className="h-10 md:h-16 w-auto object-contain" />
                      </div>
                      <div className="p-4 md:p-6 overflow-y-auto no-scrollbar flex-1 flex flex-col gap-3">
                          <p className="text-xl md:text-2xl font-black text-slate-800 leading-tight text-center">{selectedLesson.quiz.question}</p>
                          <div className="grid grid-cols-1 gap-2.5 mt-1">
                              {selectedLesson.quiz.options.map((opt, idx) => (
                                  <button 
                                      key={idx}
                                      onClick={() => handleQuizChoice(idx)}
                                      className={`
                                          p-2.5 rounded-[1.5rem] font-black text-lg md:text-xl border-4 transition-all text-left shadow-lg flex items-center gap-4
                                          ${quizAnswer === null ? 'bg-slate-50 border-slate-200 text-blue-600 hover:border-blue-500 hover:bg-white' : ''}
                                          ${quizAnswer === idx && idx === selectedLesson.quiz.correctIndex ? 'bg-green-500 border-green-700 text-white' : ''}
                                          ${quizAnswer === idx && idx !== selectedLesson.quiz.correctIndex ? 'bg-red-500 border-red-700 text-white animate-shake' : (quizAnswer !== null ? 'opacity-50 border-slate-100 text-blue-600' : '')}
                                      `}
                                  >
                                      <span className={`w-7 h-7 md:w-9 md:h-9 rounded-full flex items-center justify-center text-sm md:text-base shrink-0 ${quizAnswer === idx ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-600'}`}>{String.fromCharCode(65 + idx)}</span>
                                      {opt}
                                  </button>
                              ))}
                          </div>
                          {showFeedback && (
                              <div className="mt-2 p-3 rounded-[2rem] bg-blue-50 border-4 border-blue-200 animate-in zoom-in">
                                  {quizAnswer === selectedLesson.quiz.correctIndex ? (
                                      <div className="text-green-600 text-center"><p className="font-black text-base md:text-lg uppercase tracking-tighter leading-tight">{selectedLesson.quiz.feedback}</p></div>
                                  ) : (
                                      <div className="text-red-600 text-center"><p className="font-black text-base md:text-lg uppercase tracking-tighter">Ops! Riprova! 💪</p></div>
                                  )}
                              </div>
                          )}
                      </div>
                  </div>
              </div>
          )}

          {/* MODALE ESERCIZIO VISUALE (PLACEHOLDER) */}
          {isVisualExerciseOpen && isSpecialBook && (
              <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300">
                  <div className="bg-white w-full max-w-lg rounded-[3rem] border-8 border-purple-500 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 relative flex flex-col min-h-[400px]">
                      <button 
                        onClick={() => setIsVisualExerciseOpen(false)}
                        className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-full border-4 border-black hover:scale-110 active:scale-95 transition-all z-10"
                      >
                          <X size={24} strokeWidth={4} />
                      </button>
                      <div className="p-3 md:p-4 flex justify-center border-b-4 border-slate-100 shrink-0">
                          <img src={CUSTOM_VISUAL_BTN} alt="Esercizio Visuale" className="h-10 md:h-16 w-auto object-contain" />
                      </div>
                      <div className="p-8 flex-1 flex flex-col items-center justify-center text-center gap-6">
                          <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center">
                              <ImageIcon size={48} className="text-purple-500" />
                          </div>
                          <h3 className="text-2xl md:text-3xl font-black text-slate-800 uppercase tracking-tight">Sfida Visuale in Arrivo!</h3>
                          <p className="text-lg font-bold text-slate-500 leading-tight">
                              Qui troverai esercizi basati su immagini magiche di Lone Boo. <br/>
                              <span className="text-purple-600">Torna a trovarci presto!</span> 👻
                          </p>
                      </div>
                  </div>
              </div>
          )}

          {/* MODALE VIDEO YOUTUBE (LE VOCALI) */}
          {isVideoOpen && isSpecialBook && (
              <div className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center p-0 md:p-4 animate-in fade-in" onClick={() => setIsVideoOpen(false)}>
                  <div className="relative w-full max-w-5xl bg-white rounded-[30px] md:rounded-[40px] border-[6px] md:border-[8px] border-red-600 shadow-2xl overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
                      <button onClick={() => setIsVideoOpen(false)} className="absolute top-4 right-4 z-[210] hover:scale-110 transition-transform">
                          <X className="bg-white/30 rounded-full p-1" size={40} />
                      </button>
                      <div className="flex-1 w-full aspect-video bg-black">
                          <iframe 
                            src={VOCALI_VIDEO_URL} 
                            className="w-full h-full border-0" 
                            allowFullScreen 
                            allow="autoplay; fullscreen" 
                          />
                      </div>
                      <div className="p-4 text-center bg-white shrink-0 border-t border-gray-100 flex items-center justify-center gap-3">
                          <PlayCircle className="text-red-600" />
                          <h3 className="text-gray-800 text-lg md:text-xl font-black uppercase truncate px-2">Impariamo le Vocali con Lone Boo!</h3>
                      </div>
                  </div>
              </div>
          )}
      </div>
  );
};

export default CurriculumView;

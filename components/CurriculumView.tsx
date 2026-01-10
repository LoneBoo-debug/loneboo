
import React, { useState, useEffect } from 'react';
import { GradeCurriculumData, SchoolSubject, SchoolChapter, SchoolLesson } from '../types';
import { Book, ChevronLeft, Volume2, CheckCircle, XCircle, ArrowRight, Star } from 'lucide-react';

const CUSTOM_ITALIAN_BG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/pagaperitascho.webp';
const CUSTOM_MATH_BG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/matsfcsh887liber.webp';
const CUSTOM_HISTORY_BG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/storbucscha88.webp';
const CUSTOM_GEOGRAPHY_BG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/geosfbush662.webp';
const CUSTOM_SCIENCE_BG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/scebghim712.webp';
const CUSTOM_CLOSE_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/chiudisade.webp';
const CUSTOM_LISTEN_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/scoltalibrso.webp';

interface CurriculumViewProps {
  data: GradeCurriculumData;
  initialSubject: SchoolSubject;
  onExit: () => void;
  bgUrl: string;
}

const CurriculumView: React.FC<CurriculumViewProps> = ({ data, initialSubject, onExit, bgUrl }) => {
  const [selectedSubject, setSelectedSubject] = useState<SchoolSubject>(initialSubject);
  const [selectedChapter, setSelectedChapter] = useState<SchoolChapter | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<SchoolLesson | null>(null);
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

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

  const playLessonAudio = (url: string) => {
    if (!url) {
        alert("Audio non ancora disponibile per questa lezione.");
        return;
    }
    const audio = new Audio(url);
    audio.play().catch(e => console.error("Audio error", e));
  };

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

  // --- RENDERER: CAPITOLI (Indice del Libro) ---
  if (!selectedLesson) {
    const chapters = data.subjects[selectedSubject] || [];

    return (
      <div className="fixed inset-0 z-[150] flex flex-col bg-white overflow-hidden animate-in slide-in-from-right">
        {/* SFONDO PERSONALIZZATO PER MATERIE SPECIALI */}
        {isSpecialBook && (
            <img src={specialBg} alt="" className="absolute inset-0 w-full h-full object-fill z-0" />
        )}

        {/* HEADER STANDARD (Nascosto se Speciale) */}
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

        {/* TASTO CHIUDI PERSONALIZZATO PER MATERIE SPECIALI */}
        {isSpecialBook && (
            <button 
                onClick={onExit} 
                className="fixed top-40 left-10 md:top-56 md:left-16 z-50 hover:scale-110 active:scale-95 transition-all outline-none"
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
                                    <Book className={subjectInfo.color.replace('bg-', 'text-')} /> 
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
                        <Book size={64} className="mb-4" />
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
          {/* SFONDO PERSONALIZZATO */}
          {isSpecialBook && (
            <img src={specialBg} alt="" className="absolute inset-0 w-full h-full object-fill z-0" />
          )}

          {/* HEADER STANDARD */}
          {!isSpecialBook && (
            <div className={`${subjectInfo.color} p-4 md:p-6 flex items-center justify-between border-b-8 border-black/10 shrink-0 mt-[64px] md:mt-[96px] z-10`}>
                <button onClick={() => { setSelectedLesson(null); setQuizAnswer(null); setShowFeedback(false); }} className="bg-white/20 p-2 rounded-full text-white hover:bg-white/30 transition-all">
                    <ChevronLeft size={32} strokeWidth={3} />
                </button>
                <div className="text-center">
                    <span className="text-white/60 font-black text-[10px] uppercase block mb-1 tracking-widest">{selectedSubject}</span>
                    <h2 className="text-white font-black text-xl md:text-3xl uppercase tracking-tighter truncate max-w-[200px] md:max-w-md drop-shadow-md">
                        {selectedLesson.title}
                    </h2>
                </div>
                <button 
                    onClick={() => playLessonAudio(selectedLesson.audioUrl)} 
                    className="bg-yellow-400 p-3 rounded-full text-black hover:scale-110 active:scale-90 transition-all shadow-lg border-4 border-white"
                >
                    <Volume2 size={28} strokeWidth={2.5} />
                </button>
            </div>
          )}

          {/* TASTI CHIUDI E ASCOLTA PERSONALIZZATI */}
          {isSpecialBook && (
            <>
                <button 
                    onClick={() => { setSelectedLesson(null); setQuizAnswer(null); setShowFeedback(false); }}
                    className="fixed top-40 left-10 md:top-56 md:left-16 z-50 hover:scale-110 active:scale-95 transition-all outline-none"
                >
                    <img src={CUSTOM_CLOSE_IMG} alt="Torna all'indice" className="w-16 h-16 md:w-20 md:h-20 drop-shadow-2xl" />
                </button>
                <button 
                    onClick={() => playLessonAudio(selectedLesson.audioUrl)} 
                    className="fixed top-40 right-10 md:top-56 md:right-16 z-50 hover:scale-110 active:scale-95 transition-all outline-none"
                >
                    <img src={CUSTOM_LISTEN_IMG} alt="Ascolta" className="w-16 h-16 md:w-20 md:h-20 drop-shadow-2xl" />
                </button>
            </>
          )}

          <div className={`flex-1 overflow-y-auto p-4 md:p-10 custom-scrollbar z-10 ${isSpecialBook ? 'pt-64 md:pt-72 bg-transparent' : 'bg-white'}`}>
              <div className="max-w-3xl mx-auto flex flex-col gap-8 pb-32">
                  {/* Testo Lezione */}
                  <div className={`${isSpecialBook ? 'bg-white/40 backdrop-blur-sm border-white' : 'bg-white border-slate-100'} p-6 md:p-10 rounded-[3rem] border-4 shadow-xl relative overflow-hidden`}>
                      {!isSpecialBook && <div className={`absolute top-0 left-0 w-3 h-full ${subjectInfo.color}`}></div>}
                      <p className="text-slate-800 font-black text-lg md:text-3xl leading-relaxed whitespace-pre-wrap font-sans">
                          {selectedLesson.text}
                      </p>
                  </div>

                  {/* Mini Quiz */}
                  <div className={`${isSpecialBook ? 'bg-slate-800/80' : 'bg-slate-900'} p-6 md:p-10 rounded-[3rem] border-8 border-slate-700 shadow-2xl text-white`}>
                      <div className="flex items-center gap-3 mb-6">
                          <Star className="text-yellow-400 fill-yellow-400" size={28} />
                          <h4 className="text-xl md:text-2xl font-black uppercase tracking-tighter">Mini Sfida! 🧠</h4>
                      </div>
                      <p className="text-lg md:text-2xl font-bold mb-8 text-blue-200">{selectedLesson.quiz.question}</p>
                      <div className="grid grid-cols-1 gap-4">
                          {selectedLesson.quiz.options.map((opt, idx) => (
                              <button 
                                  key={idx}
                                  onClick={() => handleQuizChoice(idx)}
                                  className={`
                                      p-5 rounded-2xl font-black text-lg md:text-xl border-4 transition-all text-left shadow-lg
                                      ${quizAnswer === null ? 'bg-slate-800 border-slate-700 hover:border-blue-500 hover:bg-slate-700' : ''}
                                      ${quizAnswer === idx && idx === selectedLesson.quiz.correctIndex ? 'bg-green-500 border-green-300 scale-105 shadow-green-500/50' : ''}
                                      ${quizAnswer === idx && idx !== selectedLesson.quiz.correctIndex ? 'bg-red-500 border-red-300 animate-shake' : ''}
                                  `}
                              >
                                  <span className="flex items-center gap-3">
                                      <span className="w-8 h-8 rounded-full bg-black/20 flex items-center justify-center text-xs">{String.fromCharCode(65 + idx)}</span>
                                      {opt}
                                  </span>
                              </button>
                          ))}
                      </div>
                      {showFeedback && (
                          <div className="mt-8 animate-in zoom-in">
                              {quizAnswer === selectedLesson.quiz.correctIndex ? (
                                  <div className="flex items-center gap-3 text-green-400 font-black text-xl md:text-2xl">
                                      <CheckCircle size={40} /> <span>{selectedLesson.quiz.feedback}</span>
                                  </div>
                              ) : (
                                  <div className="flex items-center gap-3 text-red-400 font-black text-xl md:text-2xl">
                                      <XCircle size={40} /> <span>Ops! Riprova, ce la puoi fare! 💪</span>
                                  </div>
                              )}
                          </div>
                      )}
                  </div>
              </div>
          </div>
      </div>
  );
};

export default CurriculumView;

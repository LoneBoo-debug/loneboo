
import React, { useState, useEffect } from 'react';
import { AppView, SchoolSubject, GradeCurriculumData } from '../types';
import { OFFICIAL_LOGO } from '../constants';
import CurriculumView from './CurriculumView';
import { GRADE1_DATA } from '../services/curriculum/grade1';
import { fetchGradeCurriculum } from '../services/curriculumService';
import TeacherChat from './TeacherChat';
import { Loader2 } from 'lucide-react';

const BG_URL = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/primafirstelem44newr44.webp';
const BTN_CLOSE_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/exitaulde4fes2+(1).webp';
const HINT_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/frechiedimaesre44+(1).webp';
const BTN_DIARY_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/defewefwed+(1).webp';

type Point = { x: number; y: number };

const CLICKABLE_ZONES: Record<string, Point[]> = {
  "ITALIANO": [
    { "x": 4, "y": 10.94 },
    { "x": 4, "y": 26.53 },
    { "x": 26.92, "y": 26.38 },
    { "x": 26.39, "y": 11.24 }
  ],
  "MATEMATICA": [
    { "x": 3.46, "y": 28.63 },
    { "x": 4, "y": 44.36 },
    { "x": 26.92, "y": 44.36 },
    { "x": 26.92, "y": 28.93 }
  ],
  "STORIA": [
    { "x": 3.2, "y": 46.61 },
    { "x": 4, "y": 61.75 },
    { "x": 26.92, "y": 61.6 },
    { "x": 26.92, "y": 47.06 }
  ],
  "GEOGRAFIA": [
    { "x": 3.73, "y": 64.15 },
    { "x": 4.26, "y": 79.44 },
    { "x": 26.39, "y": 79.59 },
    { "x": 27.19, "y": 64.3 }
  ],
  "SCIENZE": [
    { "x": 3.46, "y": 81.98 },
    { "x": 3.46, "y": 97.27 },
    { "x": 26.92, "y": 97.42 },
    { "x": 26.39, "y": 81.83 }
  ],
  "TEACHER_CHAT": [
    { "x": 71.7, "y": 32.82 },
    { "x": 72.49, "y": 41.37 },
    { "x": 94.08, "y": 42.27 },
    { "x": 94.08, "y": 32.82 }
  ]
};

const SchoolFirstGrade: React.FC<{ setView: (view: AppView) => void }> = ({ setView }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const [dynamicData, setDynamicData] = useState<GradeCurriculumData>(GRADE1_DATA);
    const [activeSubject, setActiveSubject] = useState<SchoolSubject | null>(null);
    const [showTeacherChat, setShowTeacherChat] = useState(false);

    useEffect(() => {
        const init = async () => {
            setIsFetching(true);
            const img = new Image();
            img.src = BG_URL;
            img.onload = () => {
                setIsLoaded(true);
                // Dopo il caricamento, controlliamo se c'è una materia in sospeso
                const pendingId = sessionStorage.getItem('pending_lesson_id');
                if (pendingId) {
                    const chapters = dynamicData.subjects[SchoolSubject.ITALIANO] || []; // Fallback o logica di ricerca estesa se necessario
                }
                const pendingSub = sessionStorage.getItem('pending_subject');
                if (pendingSub && Object.values(SchoolSubject).includes(pendingSub as SchoolSubject)) {
                    setActiveSubject(pendingSub as SchoolSubject);
                    sessionStorage.removeItem('pending_subject');
                }
            };

            // Caricamento dati da Google Sheets
            const remoteData = await fetchGradeCurriculum(1);
            if (remoteData) {
                setDynamicData(prev => {
                    const merged = { ...prev };
                    (Object.keys(remoteData.subjects) as SchoolSubject[]).forEach(s => {
                        if (remoteData.subjects[s] && remoteData.subjects[s].length > 0) {
                            merged.subjects[s] = remoteData.subjects[s];
                        }
                    });
                    return merged;
                });
            }
            
            setIsFetching(false);
        };
        init();
        window.scrollTo(0, 0);
    }, []);

    const getClipPath = (points: Point[]) => {
        if (points.length < 3) return 'none';
        return `polygon(${points.map(p => `${p.x}% ${p.y}%`).join(', ')})`;
    };

    const handleZoneClick = (zoneId: string) => {
        if (zoneId === 'TEACHER_CHAT') {
            setShowTeacherChat(true);
        } else {
            const subject = SchoolSubject[zoneId as keyof typeof SchoolSubject];
            if (subject) {
                setActiveSubject(subject);
            }
        }
    };

    const openDiary = () => {
        sessionStorage.setItem('current_diary_grade', '1');
        setView(AppView.SCHOOL_DIARY);
    };

    return (
        <div className="fixed inset-0 top-0 left-0 w-full h-[100dvh] z-0 bg-blue-900 overflow-hidden touch-none overscroll-none select-none">
            {(!isLoaded || isFetching) && (
                <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-blue-900/95 backdrop-blur-md">
                    <img src={OFFICIAL_LOGO} alt="Caricamento..." className="w-32 h-32 object-contain animate-spin-horizontal mb-6" />
                    <span className="text-white font-black text-lg tracking-widest animate-pulse uppercase flex items-center gap-2">
                        {isFetching ? <Loader2 className="animate-spin" /> : null}
                        Preparo i libri della 1ª...
                    </span>
                </div>
            )}

            <div className="absolute inset-0 z-0">
                <img 
                    src={BG_URL} 
                    alt="1ª Elementare" 
                    className={`w-full h-full object-fill ${isLoaded ? 'opacity-100' : 'opacity-0'}`} 
                />

                {isLoaded && !activeSubject && Object.entries(CLICKABLE_ZONES).map(([id, pts]) => (
                    <div 
                        key={id}
                        onClick={() => handleZoneClick(id)}
                        className="absolute inset-0 cursor-pointer active:bg-white/10 z-20"
                        style={{ clipPath: getClipPath(pts) }}
                        title={id.replace('_', ' ')}
                    />
                ))}
            </div>

            {isLoaded && !activeSubject && (
                <>
                    {/* LAVAGNA SCRITTA */}
                    <img 
                        src={HINT_IMG} 
                        alt="Tocca i libri o chiedi alla maestra" 
                        className="absolute z-50 drop-shadow-xl slide-in-from-right-4 duration-500 object-contain pointer-events-none" 
                        style={{ 
                            right: '11%', 
                            bottom: '26%', 
                            width: '33vw', 
                            maxWidth: '550px' 
                        }}
                    />

                    {/* TASTO ESCI */}
                    <button 
                        onClick={() => setView(AppView.SCHOOL_FIRST_FLOOR)}
                        className="absolute z-50 hover:scale-110 active:scale-95 transition-all outline-none"
                        style={{ 
                            right: '30%', 
                            bottom: '1.7%', 
                            width: '31.5vw', 
                            maxWidth: '500px' 
                        }}
                    >
                        <img 
                            src={BTN_CLOSE_IMG} 
                            alt="Esci" 
                            className="w-full h-auto drop-shadow-2xl object-contain" 
                        />
                    </button>

                    {/* TASTO DIARIO */}
                    <button 
                        onClick={openDiary}
                        className="absolute bottom-6 right-6 z-50 hover:scale-110 active:scale-95 transition-all outline-none"
                        title="Il mio diario"
                    >
                        <img 
                            src={BTN_DIARY_IMG} 
                            alt="Diario" 
                            className="w-24 md:w-36 h-auto drop-shadow-2xl" 
                        />
                    </button>
                </>
            )}

            {activeSubject && (
                <CurriculumView 
                    data={dynamicData} 
                    initialSubject={activeSubject}
                    onExit={() => setActiveSubject(null)} 
                    bgUrl={BG_URL}
                    setView={setView}
                />
            )}

            {showTeacherChat && (
                <TeacherChat onClose={() => setShowTeacherChat(false)} />
            )}
        </div>
    );
};

export default SchoolFirstGrade;

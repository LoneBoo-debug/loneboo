
import React, { useState, useEffect } from 'react';
import { AppView, SchoolSubject, GradeCurriculumData } from '../types';
import { OFFICIAL_LOGO } from '../constants';
import CurriculumView from './CurriculumView';
import { GRADE2_DATA } from '../services/curriculum/grade2';
import { fetchGradeCurriculum } from '../services/curriculumService';
import TeacherChat from './TeacherChat';
import { Loader2 } from 'lucide-react';

const BG_URL = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/secondlement44new33or.webp';
const BTN_CLOSE_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/wq22qasdfghjk+(1).webp';
const HINT_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/frechiedimaesre44+(1).webp';
const BTN_DIARY_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/diriomodernoalunnoclase3e3e+(1).webp';

type Point = { x: number; y: number };

const INITIAL_ZONES: Record<string, Point[]> = {
  "ITALIANO": [
    { "x": 2.67, "y": 10.64 },
    { "x": 2.67, "y": 26.83 },
    { "x": 26.39, "y": 27.13 },
    { "x": 26.39, "y": 10.34 }
  ],
  "MATEMATICA": [
    { "x": 2.67, "y": 29.08 },
    { "x": 2.4, "y": 44.81 },
    { "x": 26.92, "y": 44.96 },
    { "x": 26.65, "y": 29.23 }
  ],
  "STORIA": [
    { "x": 2.4, "y": 47.06 },
    { "x": 2.67, "y": 62.2 },
    { "x": 26.65, "y": 62.65 },
    { "x": 26.65, "y": 47.06 }
  ],
  "GEOGRAFIA": [
    { "x": 2.67, "y": 64.75 },
    { "x": 2.67, "y": 79.89 },
    { "x": 26.39, "y": 80.34 },
    { "x": 26.65, "y": 64.9 }
  ],
  "SCIENZE": [
    { "x": 2.93, "y": 82.58 },
    { "x": 2.67, "y": 98.02 },
    { "x": 26.39, "y": 98.32 },
    { "x": 26.65, "y": 82.58 }
  ],
  "TEACHER_CHAT": [
    { "x": 71.7, "y": 32.22 },
    { "x": 72.76, "y": 42.87 },
    { "x": 93.55, "y": 43.47 },
    { "x": 93.55, "y": 32.22 }
  ]
};

const SchoolSecondGrade: React.FC<{ setView: (view: AppView) => void }> = ({ setView }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const [dynamicData, setDynamicData] = useState<GradeCurriculumData>(GRADE2_DATA);
    const [activeSubject, setActiveSubject] = useState<SchoolSubject | null>(null);
    const [showTeacherChat, setShowTeacherChat] = useState(false);

    useEffect(() => {
        const init = async () => {
            setIsFetching(true);
            const img = new Image();
            img.src = BG_URL;
            img.onload = () => {
                setIsLoaded(true);
                const pendingSub = sessionStorage.getItem('pending_subject');
                if (pendingSub && Object.values(SchoolSubject).includes(pendingSub as SchoolSubject)) {
                    setActiveSubject(pendingSub as SchoolSubject);
                    sessionStorage.removeItem('pending_subject');
                }
            };

            const remoteData = await fetchGradeCurriculum(2);
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
            if (subject) setActiveSubject(subject);
        }
    };

    const openDiary = () => {
        sessionStorage.setItem('current_diary_grade', '2');
        setView(AppView.SCHOOL_DIARY);
    };

    return (
        <div className="fixed inset-0 top-0 left-0 w-full h-[100dvh] z-0 bg-green-900 overflow-hidden touch-none overscroll-none select-none">
            {(!isLoaded || isFetching) && (
                <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-green-900/95 backdrop-blur-md">
                    <img src={OFFICIAL_LOGO} alt="Caricamento..." className="w-32 h-32 object-contain animate-spin-horizontal mb-6" />
                    <span className="text-white font-black text-lg tracking-widest animate-pulse uppercase flex items-center gap-2">
                        {isFetching ? <Loader2 className="animate-spin" /> : null}
                        Preparo i libri della 2ª...
                    </span>
                </div>
            )}

            <div className="absolute inset-0 z-0">
                <img 
                    src={BG_URL} 
                    alt="2ª Elementare" 
                    className={`w-full h-full object-fill ${isLoaded ? 'opacity-100' : 'opacity-0'}`} 
                />

                {isLoaded && !activeSubject && Object.entries(INITIAL_ZONES).map(([id, pts]) => (
                    <div 
                        key={id}
                        onClick={() => handleZoneClick(id)}
                        className="absolute inset-0 cursor-pointer active:bg-white/10 z-20"
                        style={{ clipPath: getClipPath(pts) }}
                    />
                ))}
            </div>

            {isLoaded && !activeSubject && (
                <>
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

                    <button 
                        onClick={() => setView(AppView.SCHOOL_FIRST_FLOOR)}
                        className="absolute z-50 hover:scale-110 active:scale-95 transition-all outline-none"
                        style={{ 
                            right: '39%', 
                            bottom: '1.7%', 
                            width: '26vw', 
                            maxWidth: '400px' 
                        }}
                    >
                        <img 
                            src={BTN_CLOSE_IMG} 
                            alt="Esci" 
                            className="w-full h-auto drop-shadow-2xl object-contain" 
                        />
                    </button>

                    <button 
                        onClick={openDiary}
                        className="absolute bottom-6 right-6 z-50 hover:scale-110 active:scale-95 transition-all outline-none"
                        title="Il mio diario"
                    >
                        <img 
                            src={BTN_DIARY_IMG} 
                            alt="Diario" 
                            className="w-32 md:w-48 h-auto drop-shadow-2xl" 
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

export default SchoolSecondGrade;

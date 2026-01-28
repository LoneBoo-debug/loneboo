
import React, { useState, useEffect } from 'react';
import { AppView, SchoolSubject, GradeCurriculumData } from '../types';
import { OFFICIAL_LOGO } from '../constants';
import CurriculumView from './CurriculumView';
import { GRADE5_DATA } from '../services/curriculum/grade5';
import { fetchGradeCurriculum } from '../services/curriculumService';
import TeacherChat from './TeacherChat';
import { Loader2 } from 'lucide-react';

const BG_URL = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/quintaelem77new3swe.webp';
const BTN_CLOSE_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/wq22qasdfghjk+(1).webp';
const HINT_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/frechiedimaesre44+(1).webp';
const BTN_DIARY_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/diriomodernoalunnoclase3e3e+(1).webp';

interface Point { x: number; y: number; }

const SAVED_HOTSPOTS: Record<string, Point[]> = {
  "ITALIANO": [{"x": 1.6, "y": 11.09}, {"x": 1.87, "y": 27.73}, {"x": 26.65, "y": 27.58}, {"x": 26.39, "y": 11.24}],
  "MATEMATICA": [{"x": 1.87, "y": 29.98}, {"x": 1.87, "y": 46.01}, {"x": 25.85, "y": 46.01}, {"x": 25.85, "y": 30.13}],
  "STORIA": [{"x": 1.87, "y": 47.81}, {"x": 1.87, "y": 64}, {"x": 26.39, "y": 64.15}, {"x": 26.39, "y": 48.41}],
  "GEOGRAFIA": [{"x": 1.87, "y": 66.4}, {"x": 2.67, "y": 82.43}, {"x": 26.39, "y": 82.88}, {"x": 26.39, "y": 66.55}],
  "SCIENZE": [{"x": 1.87, "y": 84.68}, {"x": 2.13, "y": 98.77}, {"x": 26.65, "y": 99.22}, {"x": 26.39, "y": 84.53}],
  "TEACHER_CHAT": [{"x": 72.23, "y": 32.22}, {"x": 72.49, "y": 42.42}, {"x": 97.01, "y": 41.82}, {"x": 97.28, "y": 32.97}]
};

const SchoolFifthGrade: React.FC<{ setView: (view: AppView) => void }> = ({ setView }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const [dynamicData, setDynamicData] = useState<GradeCurriculumData>(GRADE5_DATA);
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

            const remoteData = await fetchGradeCurriculum(5);
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

    const getClipPath = (pts: Point[]) => {
        if (!pts || pts.length < 3) return 'none';
        return `polygon(${pts.map(p => `${p.x}% ${p.y}%`).join(', ')})`;
    };

    const handleZoneInteraction = (key: string) => {
        const subject = key as SchoolSubject;
        if (Object.values(SchoolSubject).includes(subject)) {
            setActiveSubject(subject);
        } else if (key === 'TEACHER_CHAT') {
            setShowTeacherChat(true);
        }
    };

    const openDiary = () => {
        sessionStorage.setItem('current_diary_grade', '5');
        setView(AppView.SCHOOL_DIARY);
    };

    return (
        <div className="fixed inset-0 top-0 left-0 w-full h-[100dvh] z-0 bg-pink-900 overflow-hidden touch-none overscroll-none select-none">
            {!isLoaded && (
                <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-pink-900/95 backdrop-blur-md">
                    <img src={OFFICIAL_LOGO} alt="Caricamento..." className="w-32 h-32 object-contain animate-spin-horizontal mb-6" />
                    <span className="text-white font-black text-lg tracking-widest animate-pulse uppercase flex items-center gap-2">
                        {isFetching ? <Loader2 className="animate-spin" /> : null}
                        Preparo i libri della 5ª...
                    </span>
                </div>
            )}

            <div className="absolute inset-0 z-0">
                <img 
                    src={BG_URL} 
                    alt="5ª Elementare" 
                    className={`w-full h-full object-fill ${isLoaded ? 'opacity-100' : 'opacity-0'}`} 
                />

                {isLoaded && !activeSubject && (Object.entries(SAVED_HOTSPOTS) as [string, Point[]][]).map(([key, pts]) => (
                    pts.length >= 3 && (
                        <div 
                            key={key}
                            onClick={() => handleZoneInteraction(key)}
                            className="absolute inset-0 z-20 cursor-pointer active:bg-white/10"
                            style={{ clipPath: getClipPath(pts) }}
                        />
                    )
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
                        onClick={() => setView(AppView.SCHOOL_SECOND_FLOOR)}
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

export default SchoolFifthGrade;

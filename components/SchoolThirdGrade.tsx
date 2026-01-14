import React, { useState, useEffect } from 'react';
import { AppView, SchoolSubject } from '../types';
import { OFFICIAL_LOGO } from '../constants';
import CurriculumView from './CurriculumView';
import { GRADE3_DATA } from '../services/curriculum/grade3';
import TeacherChat from './TeacherChat';

const BG_URL = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/terxeseleme55nwenew56.webp';
const BTN_CLOSE_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/esciule4ert5531+(1).webp';
const HINT_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/frechiedimaesre44+(1).webp';

interface Point { x: number; y: number; }

const SAVED_HOTSPOTS: Record<string, Point[]> = {
  "ITALIANO": [{"x": 2.67, "y": 11.09}, {"x": 2.67, "y": 26.98}, {"x": 26.39, "y": 27.43}, {"x": 26.39, "y": 11.09}],
  "MATEMATICA": [{"x": 2.4, "y": 29.83}, {"x": 2.13, "y": 45.26}, {"x": 26.39, "y": 45.41}, {"x": 26.92, "y": 29.68}],
  "STORIA": [{"x": 2.67, "y": 47.51}, {"x": 2.67, "y": 63.55}, {"x": 26.92, "y": 63.4}, {"x": 26.39, "y": 47.81}],
  "GEOGRAFIA": [{"x": 2.67, "y": 65.8}, {"x": 1.87, "y": 81.24}, {"x": 26.65, "y": 81.83}, {"x": 26.92, "y": 65.8}],
  "SCIENZE": [{"x": 1.87, "y": 83.33}, {"x": 2.13, "y": 98.92}, {"x": 27.45, "y": 99.37}, {"x": 27.45, "y": 83.78}],
  "TEACHER_CHAT": [{"x": 71.7, "y": 32.22}, {"x": 71.96, "y": 42.12}, {"x": 95.42, "y": 42.57}, {"x": 95.42, "y": 32.37}]
};

const SchoolThirdGrade: React.FC<{ setView: (view: AppView) => void }> = ({ setView }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [activeSubject, setActiveSubject] = useState<SchoolSubject | null>(null);
    const [showTeacherChat, setShowTeacherChat] = useState(false);

    useEffect(() => {
        const img = new Image();
        img.src = BG_URL;
        img.onload = () => setIsLoaded(true);
        window.scrollTo(0, 0);
    }, []);

    const getClipPath = (pts: Point[]) => {
        if (!pts || pts.length < 3) return 'none';
        return `polygon(${pts.map(p => `${p.x}% ${p.y}%`).join(', ')})`;
    };

    const handleZoneInteraction = (key: string) => {
        if (key === 'TEACHER_CHAT') {
            setShowTeacherChat(true);
        } else {
            const subject = key as SchoolSubject;
            if (Object.values(SchoolSubject).includes(subject)) {
                setActiveSubject(subject);
            }
        }
    };

    return (
        <div className="fixed inset-0 top-0 left-0 w-full h-[100dvh] z-0 bg-orange-900 overflow-hidden touch-none overscroll-none select-none">
            {!isLoaded && (
                <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-orange-900/95 backdrop-blur-md">
                    <img src={OFFICIAL_LOGO} alt="Caricamento..." className="w-32 h-32 object-contain animate-spin-horizontal mb-6" />
                    <span className="text-white font-black text-lg tracking-widest animate-pulse uppercase">Entro in 3ª Elementare...</span>
                </div>
            )}

            <div className="absolute inset-0 z-0">
                <img 
                    src={BG_URL} 
                    alt="3ª Elementare" 
                    className={`w-full h-full object-fill transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`} 
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
                    {/* LAVAGNA SCRITTA */}
                    <img 
                        src={HINT_IMG} 
                        alt="Tocca i libri o chiedi alla maestra" 
                        className="absolute z-50 drop-shadow-xl animate-in slide-in-from-right-4 duration-500 object-contain pointer-events-none" 
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
                </>
            )}

            {activeSubject && (
                <CurriculumView 
                    data={GRADE3_DATA} 
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

export default SchoolThirdGrade;
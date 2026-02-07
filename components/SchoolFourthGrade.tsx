
import React, { useState, useEffect, useRef } from 'react';
import { AppView, SchoolSubject, GradeCurriculumData } from '../types';
import { OFFICIAL_LOGO } from '../constants';
import CurriculumView from './CurriculumView';
import { GRADE4_DATA } from '../services/curriculum/grade4';
import { fetchGradeCurriculum } from '../services/curriculumService';
import TeacherChat from './TeacherChat';
import { Loader2 } from 'lucide-react';

const BG_URL = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/gradeschoolarcobalenonewsfour.webp';
const BTN_CLOSE_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/eciaula44frexasqzaq+(1)+(1).webp';
const BTN_DIARY_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/diriomodernoalunnoclase3e3e+(1).webp';

// Asset Audio e Video
const TEACHER_VOICE_URL = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/maestraornelloaspehcgginaulaminitv.mp3';
const TEACHER_TALK_VIDEO = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/0130+(1)ornellaspechha.mp4';

interface Point { x: number; y: number; }

const SAVED_HOTSPOTS: Record<string, Point[]> = {
  "ITALIANO": [{"x": 2.4, "y": 11.24}, {"x": 2.13, "y": 27.58}, {"x": 26.65, "y": 27.43}, {"x": 26.39, "y": 11.09}],
  "MATEMATICA": [{"x": 1.87, "y": 29.83}, {"x": 1.6, "y": 45.86}, {"x": 26.39, "y": 46.01}, {"x": 26.12, "y": 29.83}],
  "STORIA": [{"x": 1.87, "y": 48.26}, {"x": 2.13, "y": 64}, {"x": 26.39, "y": 64.45}, {"x": 26.39, "y": 48.41}],
  "GEOGRAFIA": [{"x": 1.87, "y": 66.7}, {"x": 1.87, "y": 82.43}, {"x": 26.12, "y": 83.18}, {"x": 26.12, "y": 67}],
  "SCIENZE": [{"x": 1.87, "y": 84.83}, {"x": 1.87, "y": 99.37}, {"x": 26.65, "y": 99.37}, {"x": 26.39, "y": 84.98}],
  "TEACHER_CHAT": [{"x": 71.96, "y": 32.37}, {"x": 71.96, "y": 42.42}, {"x": 95.68, "y": 42.42}, {"x": 95.68, "y": 33.27}]
};

const SchoolFourthGrade: React.FC<{ setView: (view: AppView) => void }> = ({ setView }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const [dynamicData, setDynamicData] = useState<GradeCurriculumData>(GRADE4_DATA);
    
    const [activeSubject, setActiveSubject] = useState<SchoolSubject | null>(() => {
        const pendingSub = sessionStorage.getItem('pending_subject');
        if (pendingSub) {
            sessionStorage.removeItem('pending_subject');
            return pendingSub as SchoolSubject;
        }
        return null;
    });

    const [showTeacherChat, setShowTeacherChat] = useState(false);

    const [isAudioOn, setIsAudioOn] = useState(() => localStorage.getItem('loneboo_music_enabled') === 'true');
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        const init = async () => {
            setIsFetching(true);
            const img = new Image();
            img.src = BG_URL;
            img.onload = () => setIsLoaded(true);

            const remoteData = await fetchGradeCurriculum(4);
            if (remoteData) {
                setDynamicData(remoteData);
            }
            setIsFetching(false);
        };
        init();

        if (!audioRef.current) {
            audioRef.current = new Audio(TEACHER_VOICE_URL);
            audioRef.current.loop = false;
            audioRef.current.volume = 0.5;
            audioRef.current.addEventListener('play', () => setIsPlaying(true));
            audioRef.current.addEventListener('pause', () => setIsPlaying(false));
            audioRef.current.addEventListener('ended', () => {
                setIsPlaying(false);
                if (audioRef.current) audioRef.current.currentTime = 0;
            });
        }

        window.scrollTo(0, 0);

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
            }
        };
    }, []);

    useEffect(() => {
        if (isLoaded && !isFetching && isAudioOn && audioRef.current) {
            const alreadyHeard = sessionStorage.getItem('heard_audio_school_grade_4') === 'true';
            if (!alreadyHeard) {
                audioRef.current.play().catch(e => console.log("Audio play blocked", e));
                sessionStorage.setItem('heard_audio_school_grade_4', 'true');
            }
        }
    }, [isLoaded, isFetching, isAudioOn]);

    const handleGlobalAudioChange = () => {
        const enabled = localStorage.getItem('loneboo_music_enabled') === 'true';
        setIsAudioOn(enabled);
        if (enabled && isLoaded && !isFetching) {
            audioRef.current?.play().catch(() => {});
            sessionStorage.setItem('heard_audio_school_grade_4', 'true');
        } else {
            audioRef.current?.pause();
            if (audioRef.current) audioRef.current.currentTime = 0;
        }
    };
    
    useEffect(() => {
        window.addEventListener('loneboo_audio_changed', handleGlobalAudioChange);
        return () => window.removeEventListener('loneboo_audio_changed', handleGlobalAudioChange);
    }, [isLoaded, isFetching]);

    const getClipPath = (pts: Point[]) => {
        if (!pts || pts.length < 3) return 'none';
        return `polygon(${pts.map(p => `${p.x}% ${p.y}%`).join(', ')})`;
    };

    const handleZoneInteraction = (key: string) => {
        if (key === 'TEACHER_CHAT') setShowTeacherChat(true);
        else {
            const subject = key as SchoolSubject;
            if (Object.values(SchoolSubject).includes(subject)) setActiveSubject(subject);
        }
    };

    return (
        <div className="fixed inset-0 top-0 left-0 w-full h-[100dvh] z-0 bg-purple-900 overflow-hidden touch-none overscroll-none select-none">
            {(!isLoaded || isFetching) && (
                <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-purple-900/95 backdrop-blur-md">
                    <img src={OFFICIAL_LOGO} alt="Caricamento..." className="w-32 h-32 object-contain animate-spin-horizontal mb-6" />
                    <span className="text-white font-black text-lg tracking-widest animate-pulse uppercase flex items-center gap-2">{isFetching ? <Loader2 className="animate-spin" /> : null} Preparo i libri della 4ª...</span>
                </div>
            )}

            {/* Mini TV di Ornella - Posizionato a DESTRA */}
            {isLoaded && !isFetching && !activeSubject && isAudioOn && isPlaying && (
                <div className="absolute top-20 md:top-28 right-4 z-50 animate-in zoom-in duration-500">
                    <div className="relative bg-black/40 backdrop-blur-sm p-0 rounded-[2.5rem] border-4 md:border-8 border-yellow-400 shadow-2xl overflow-hidden flex items-center justify-center w-28 h-28 md:w-52 md:h-52">
                        <video src={TEACHER_TALK_VIDEO} autoPlay loop muted playsInline className="w-full h-full object-cover" style={{ mixBlendMode: 'screen', filter: 'contrast(1.1) brightness(1.1)' }} />
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none"></div>
                    </div>
                </div>
            )}

            <div className="absolute inset-0 z-0">
                <img src={BG_URL} alt="4ª Elementare" className={`w-full h-full object-fill ${isLoaded ? 'opacity-100' : 'opacity-0'}`} />
                {isLoaded && !isFetching && !activeSubject && (Object.entries(SAVED_HOTSPOTS) as [string, Point[]][]).map(([key, pts]) => (
                    pts.length >= 3 && <div key={key} onClick={() => handleZoneInteraction(key)} className="absolute inset-0 z-20 cursor-pointer active:bg-white/10" style={{ clipPath: getClipPath(pts) }} />
                ))}
            </div>

            {isLoaded && !isFetching && !activeSubject && (
                <>
                    <button onClick={() => setView(AppView.SCHOOL_SECOND_FLOOR)} className="absolute z-50 hover:scale-110 active:scale-95 transition-all outline-none" style={{ right: '39%', bottom: '1.7%', width: '26vw', maxWidth: '400px' }}><img src={BTN_CLOSE_IMG} alt="Esci" className="w-full h-auto drop-shadow-2xl object-contain" /></button>
                    <button onClick={() => { sessionStorage.setItem('current_diary_grade', '4'); setView(AppView.SCHOOL_DIARY); }} className="absolute bottom-6 right-6 z-50 hover:scale-110 active:scale-95 transition-all outline-none" title="Il mio diario"><img src={BTN_DIARY_IMG} alt="Diario" className="w-32 md:w-48 h-auto drop-shadow-2xl" /></button>
                </>
            )}

            {activeSubject && <CurriculumView data={dynamicData} initialSubject={activeSubject} onExit={() => setActiveSubject(null)} bgUrl={BG_URL} setView={setView} />}
            {showTeacherChat && <TeacherChat onClose={() => setShowTeacherChat(false)} />}
        </div>
    );
};

export default SchoolFourthGrade;

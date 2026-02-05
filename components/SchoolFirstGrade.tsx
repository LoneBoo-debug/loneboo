
import React, { useState, useEffect, useRef } from 'react';
import { AppView, SchoolSubject, GradeCurriculumData } from '../types';
import { OFFICIAL_LOGO } from '../constants';
import CurriculumView from './CurriculumView';
import { GRADE1_DATA } from '../services/curriculum/grade1';
import { fetchGradeCurriculum } from '../services/curriculumService';
import TeacherChat from './TeacherChat';
import { Loader2 } from 'lucide-react';

const BG_URL = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/gradeschoolarcobalenonewsfirst.webp';
const BTN_CLOSE_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/eciaula44frexasqzaq+(1)+(1).webp';
const BTN_DIARY_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/diriomodernoalunnoclase3e3e+(1).webp';

// Asset Audio e Video
const TEACHER_VOICE_URL = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/maestraornelloaspehcgginaulaminitv.mp3';
const TEACHER_TALK_VIDEO = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/0130+(1)ornellaspechha.mp4';

type Point = { x: number; y: number };

const CLICKABLE_ZONES: Record<string, Point[]> = {
  "ITALIANO": [{ "x": 4, "y": 10.94 }, { "x": 4, "y": 26.53 }, { "x": 26.92, "y": 26.38 }, { "x": 26.39, "y": 11.24 }],
  "MATEMATICA": [{ "x": 3.46, "y": 28.63 }, { "x": 4, "y": 44.36 }, { "x": 26.92, "y": 44.36 }, { "x": 26.92, "y": 28.93 }],
  "STORIA": [{ "x": 3.2, "y": 46.61 }, { "x": 4, "y": 61.75 }, { "x": 26.92, "y": 61.6 }, { "x": 26.92, "y": 47.06 }],
  "GEOGRAFIA": [{ "x": 3.73, "y": 64.15 }, { "x": 4.26, "y": 79.44 }, { "x": 26.39, "y": 79.59 }, { "x": 27.19, "y": 64.3 }],
  "SCIENZE": [{ "x": 3.46, "y": 81.98 }, { "x": 3.46, "y": 97.27 }, { "x": 26.92, "y": 97.42 }, { "x": 26.39, "y": 81.83 }],
  "TEACHER_CHAT": [{ "x": 71.7, "y": 32.82 }, { "x": 72.49, "y": 41.37 }, { "x": 94.08, "y": 42.27 }, { "x": 94.08, "y": 32.82 }]
};

const SchoolFirstGrade: React.FC<{ setView: (view: AppView) => void }> = ({ setView }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const [dynamicData, setDynamicData] = useState<GradeCurriculumData>(GRADE1_DATA);
    
    // FIX: Inizializzazione intelligente per caricare la materia se si arriva dal diario
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

            const remoteData = await fetchGradeCurriculum(1);
            if (remoteData) {
                setDynamicData(prev => {
                    const merged = { ...prev };
                    (Object.keys(remoteData.subjects) as SchoolSubject[]).forEach(s => {
                        if (remoteData.subjects[s] && remoteData.subjects[s].length > 0) merged.subjects[s] = remoteData.subjects[s];
                    });
                    return merged;
                });
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
            window.removeEventListener('loneboo_audio_changed', handleGlobalAudioChange);
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
            }
        };
    }, []);

    // EFFETTO PER FAR PARTIRE L'AUDIO SOLO A CARICAMENTO ULTIMATO E CON LOGICA INTELLIGENTE
    useEffect(() => {
        if (isLoaded && !isFetching && isAudioOn && audioRef.current) {
            const alreadyHeard = sessionStorage.getItem('heard_audio_school_grade_1') === 'true';
            if (!alreadyHeard) {
                audioRef.current.play().catch(e => console.log("Audio play blocked", e));
                sessionStorage.setItem('heard_audio_school_grade_1', 'true');
            }
        }
    }, [isLoaded, isFetching, isAudioOn]);

    const handleGlobalAudioChange = () => {
        const enabled = localStorage.getItem('loneboo_music_enabled') === 'true';
        setIsAudioOn(enabled);
        if (enabled && isLoaded && !isFetching) {
            audioRef.current?.play().catch(() => {});
            sessionStorage.setItem('heard_audio_school_grade_1', 'true');
        } else {
            audioRef.current?.pause();
            if (audioRef.current) audioRef.current.currentTime = 0;
        }
    };
    
    useEffect(() => {
        window.addEventListener('loneboo_audio_changed', handleGlobalAudioChange);
        return () => window.removeEventListener('loneboo_audio_changed', handleGlobalAudioChange);
    }, [isLoaded, isFetching]);

    const getClipPath = (points: Point[]) => {
        if (points.length < 3) return 'none';
        return `polygon(${points.map(p => `${p.x}% ${p.y}%`).join(', ')})`;
    };

    const handleZoneClick = (zoneId: string) => {
        if (zoneId === 'TEACHER_CHAT') setShowTeacherChat(true);
        else {
            const subject = SchoolSubject[zoneId as keyof typeof SchoolSubject];
            if (subject) setActiveSubject(subject);
        }
    };

    return (
        <div className="fixed inset-0 top-0 left-0 w-full h-[100dvh] z-0 bg-blue-900 overflow-hidden touch-none overscroll-none select-none">
            {(!isLoaded || isFetching) && (
                <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-blue-900/95 backdrop-blur-md">
                    <img src={OFFICIAL_LOGO} alt="Caricamento..." className="w-32 h-32 object-contain animate-spin-horizontal mb-6" />
                    <span className="text-white font-black text-lg tracking-widest animate-pulse uppercase flex items-center gap-2">{isFetching ? <Loader2 className="animate-spin" /> : null} Preparo i libri della 1ª...</span>
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
                <img src={BG_URL} alt="1ª Elementare" className={`w-full h-full object-fill ${isLoaded ? 'opacity-100' : 'opacity-0'}`} />
                {isLoaded && !isFetching && !activeSubject && Object.entries(CLICKABLE_ZONES).map(([id, pts]) => (
                    <div key={id} onClick={() => handleZoneClick(id)} className="absolute inset-0 z-20 cursor-pointer active:bg-white/10" style={{ clipPath: getClipPath(pts) }} title={id.replace('_', ' ')} />
                ))}
            </div>

            {isLoaded && !isFetching && !activeSubject && (
                <>
                    <button onClick={() => setView(AppView.SCHOOL_FIRST_FLOOR)} className="absolute z-50 hover:scale-110 active:scale-95 transition-all outline-none" style={{ right: '39%', bottom: '1.7%', width: '26vw', maxWidth: '400px' }}><img src={BTN_CLOSE_IMG} alt="Esci" className="w-full h-auto drop-shadow-2xl object-contain" /></button>
                    <button onClick={() => { sessionStorage.setItem('current_diary_grade', '1'); setView(AppView.SCHOOL_DIARY); }} className="absolute bottom-6 right-6 z-50 hover:scale-110 active:scale-95 transition-all outline-none" title="Il mio diario"><img src={BTN_DIARY_IMG} alt="Diario" className="w-32 md:w-48 h-auto drop-shadow-2xl" /></button>
                </>
            )}

            {activeSubject && <CurriculumView data={dynamicData} initialSubject={activeSubject} onExit={() => setActiveSubject(null)} bgUrl={BG_URL} setView={setView} />}
            {showTeacherChat && <TeacherChat onClose={() => setShowTeacherChat(false)} />}
        </div>
    );
};

export default SchoolFirstGrade;

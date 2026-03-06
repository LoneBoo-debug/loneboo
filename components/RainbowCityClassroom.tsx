
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AppView } from '../types';
import StudyRegister from './StudyRegister';

const BG_DAY = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/sfondoautlagiornoday.webp';
const BG_NIGHT = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/sfondoaulanightnotte.webp';
const BTN_BACK_URL = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/esicualemediepage.webp';
const BTN_REGISTER_URL = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/Hailuo_Image_creami+una+immagine+nello+stil_485990668612460550.webp';
const PROF_ART_URL = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/arttecnoprofwsovelra4f3.webp';
const PROF_STO_URL = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/sotiageogroverlteahc65.webp';
const PROF_ITA_URL = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/Hailuo_Image_in+questa+immagine+aggiungi+se_484986400522477569.webp';
const PROF_CIV_URL = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/proffmotoriavel54we.webp';
const PROF_MAT_URL = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/proffisicamatematic.webp';
const PROF_APP_URL = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/profextraapprofondi.webp';

const BANNER_PRIMA = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/primamediabannerlogo55.webp';
const BANNER_SECONDA = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/secondamediabennerlogo543.webp';
const BANNER_TERZA = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/terzamediabnnerlogor55t5.webp';

const SUB_BOOKS: Record<string, { img: string, view: AppView }[]> = {
    ita: [
        { img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/italianobookmedie.webp', view: AppView.MEDIE_ITALIANO },
        { img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/inglesebookmedie.webp', view: AppView.MEDIE_INGLESE }
    ],
    sto: [
        { img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/storiabookmedie.webp', view: AppView.MEDIE_STORIA },
        { img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/geografiabookmedie.webp', view: AppView.MEDIE_GEOGRAFIA }
    ],
    mat: [
        { img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/matematicaboomedie.webp', view: AppView.MEDIE_MATEMATICA },
        { img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/scienzebookmedie.webp', view: AppView.MEDIE_SCIENZE }
    ],
    art: [
        { img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/aartebookmedie.webp', view: AppView.MEDIE_ARTE },
        { img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/tencologiabookmedie.webp', view: AppView.MEDIE_TECNOLOGIA }
    ],
    civ: [
        { img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/civicabookmedie.webp', view: AppView.MEDIE_CIVICA },
        { img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/motoriboomedie.webp', view: AppView.MEDIE_MOTORIA }
    ],
    app: [
        { img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/epserimentobookmedie2.webp', view: AppView.MEDIE_ESPERIMENTI },
        { img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/informaticabookmedie2.webp', view: AppView.MEDIE_INFORMATICA }
    ]
};

interface RainbowCityClassroomProps {
    title: string;
    setView: (view: AppView) => void;
    backView?: AppView;
}

const RainbowCityClassroom: React.FC<RainbowCityClassroomProps> = ({ title, setView, backView = AppView.RAINBOW_CITY_SCUOLA_MEDIA }) => {
    const [isNight, setIsNight] = useState(false);
    const [activeProfId, setActiveProfId] = useState<string | null>(null);
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);
    
    // Calibration state for professors
    const [calibrations] = useState<Record<string, { x: number, y: number, scale: number }>>({
        ita: { x: -24, y: -21, scale: 1.27 },
        sto: { x: -3, y: -9, scale: 1.15 },
        mat: { x: 0, y: -13, scale: 1.08 },
        art: { x: 0, y: -11, scale: 1.07 },
        civ: { x: 0, y: 0, scale: 1.00 },
        app: { x: 0, y: 1, scale: 1.06 }
    });

    // Calibration state for buttons
    const [btnCalib] = useState({
        x: 16,
        y: 2,
        scale: 1.22,
        gap: 0
    });

    // Calibration state for sub-books (bottom books)
    const [subBookCalib] = useState<Record<string, { x: number, y: number, scale: number, gap: number }>>({
        ita: { x: 59, y: 0, scale: 1.96, gap: 54 },
        sto: { x: 59, y: 0, scale: 1.96, gap: 54 },
        mat: { x: 59, y: 0, scale: 1.96, gap: 54 },
        art: { x: 59, y: 0, scale: 1.96, gap: 54 },
        civ: { x: 59, y: 0, scale: 1.96, gap: 54 },
        app: { x: 59, y: 0, scale: 1.96, gap: 54 },
    });

    useEffect(() => {
        window.scrollTo(0, 0);

        // Handle auto-navigation from search results
        const pendingSubject = sessionStorage.getItem('pending_subject');
        if (pendingSubject) {
            const subjectUpper = pendingSubject.toUpperCase();
            // Find which sub-book corresponds to this subject
            for (const category in SUB_BOOKS) {
                const book = SUB_BOOKS[category].find(b => b.view.includes(subjectUpper));
                if (book) {
                    setView(book.view);
                    return; // Stop here, we're navigating away
                }
            }
        }

        const checkTime = () => {
            const now = new Date();
            const hours = now.getHours();
            const minutes = now.getMinutes();
            const currentTimeInMinutes = hours * 60 + minutes;

            const nightStart = 20 * 60 + 15; // 20:15
            const nightEnd = 6 * 60 + 30;   // 06:30

            if (currentTimeInMinutes >= nightStart || currentTimeInMinutes < nightEnd) {
                setIsNight(true);
            } else {
                setIsNight(false);
            }
        };

        checkTime();
        const interval = setInterval(checkTime, 60000);
        return () => clearInterval(interval);
    }, []);

    const SUBJECT_BUTTONS = [
        { id: 'ita', img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/itastranie5r3e2.webp', label: 'Italiano e Lingue' },
        { id: 'sto', img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/stogeofrie543.webp', label: 'Storia e Geografia' },
        { id: 'mat', img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/matscien543d2.webp', label: 'Matematica e Scienze' },
        { id: 'art', img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/artetenco9i3r.webp', label: 'Arte e Tecnologia' },
        { id: 'civ', img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/civicamotori4kdi32.webp', label: 'Civica e Motoria' },
        { id: 'app', img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/appronfidmem5rf34e3e.webp', label: 'Approfondimenti' }
    ];

    const handleSubjectClick = (id: string) => {
        if (id === activeProfId) {
            setActiveProfId(null);
        } else {
            setActiveProfId(id);
        }
    };

    const getProfImage = () => {
        if (activeProfId === 'art') return PROF_ART_URL;
        if (activeProfId === 'sto') return PROF_STO_URL;
        if (activeProfId === 'ita') return PROF_ITA_URL;
        if (activeProfId === 'civ') return PROF_CIV_URL;
        if (activeProfId === 'mat') return PROF_MAT_URL;
        if (activeProfId === 'app') return PROF_APP_URL;
        return null;
    };

    const getTitleBanner = () => {
        if (title === "1 Media") return BANNER_PRIMA;
        if (title === "2 Media") return BANNER_SECONDA;
        if (title === "3 Media") return BANNER_TERZA;
        return null;
    };

    const titleBanner = getTitleBanner();

    const getGradeNumber = () => {
        if (title === "1 Media") return 6;
        if (title === "2 Media") return 7;
        if (title === "3 Media") return 8;
        return 6;
    };

    return (
        <div className="absolute inset-0 z-[100] bg-slate-950 flex items-center justify-center overflow-hidden">
            <img 
                src={isNight ? BG_NIGHT : BG_DAY} 
                alt={title} 
                className="absolute inset-0 w-full h-full object-cover"
            />

            {/* CLASSROOM TITLE BANNER */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 z-50 pointer-events-none w-full flex justify-center px-20">
                {titleBanner ? (
                    <img 
                        src={titleBanner} 
                        alt={title} 
                        className="h-[14vh] md:h-[18vh] lg:h-[22vh] w-auto object-contain drop-shadow-2xl"
                    />
                ) : (
                    <h1 className="font-luckiest text-2xl md:text-4xl lg:text-5xl uppercase tracking-wider text-white whitespace-nowrap drop-shadow-lg">
                        {title}
                    </h1>
                )}
            </div>

            {/* PROFESSOR LAYER (Integrated with background) */}
            <AnimatePresence mode="wait">
                {activeProfId && (
                    <motion.div 
                        key={activeProfId}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none"
                    >
                        <img 
                            src={getProfImage() || ''} 
                            alt="Professore" 
                            style={{
                                transform: `translate(${calibrations[activeProfId]?.x || 0}px, ${calibrations[activeProfId]?.y || 0}px) scale(${calibrations[activeProfId]?.scale || 1})`,
                            }}
                            className="max-h-[90vh] w-auto object-contain drop-shadow-2xl transition-transform duration-200"
                        />
                    </motion.div>
                )}
            </AnimatePresence>
            
            {/* SUBJECT BUTTONS COLUMN ON THE LEFT */}
            <div 
                style={{
                    left: `${btnCalib.x}px`,
                    top: `calc(50% + ${btnCalib.y}px)`,
                    gap: `${btnCalib.gap}px`,
                    transform: `translateY(-50%) scale(${btnCalib.scale})`,
                    transformOrigin: 'left center'
                }}
                className="absolute z-30 flex flex-col"
            >
                {SUBJECT_BUTTONS.map((btn) => (
                    <button 
                        key={btn.id}
                        className="group relative active:scale-95 transition-all outline-none"
                        onClick={() => handleSubjectClick(btn.id)}
                    >
                        <img 
                            src={btn.img} 
                            alt={btn.label} 
                            className="h-[13vh] md:h-[15vh] lg:h-[16vh] w-auto object-contain drop-shadow-2xl"
                        />
                    </button>
                ))}
            </div>

            {/* SUB-BOOKS AT THE BOTTOM */}
            <div 
                style={{
                    left: `${activeProfId ? subBookCalib[activeProfId]?.x : 59}%`,
                    bottom: `${activeProfId ? subBookCalib[activeProfId]?.y : 0}vh`,
                    gap: `${activeProfId ? subBookCalib[activeProfId]?.gap : 54}px`,
                }}
                className="absolute -translate-x-1/2 z-40 flex items-end"
            >
                <AnimatePresence>
                    {activeProfId && SUB_BOOKS[activeProfId]?.map((book, index) => (
                        <motion.button
                            key={`${activeProfId}-sub-${index}`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5 }}
                            style={{
                                transform: `scale(${subBookCalib[activeProfId]?.scale || 1.96})`,
                                transformOrigin: 'bottom center'
                            }}
                            className="hover:scale-110 active:scale-95 transition-all outline-none"
                            onClick={() => setView(book.view)}
                        >
                            <img 
                                src={book.img} 
                                alt={`Libro ${index}`} 
                                className="h-[18vh] md:h-[22vh] lg:h-[25vh] w-auto object-contain drop-shadow-2xl"
                            />
                        </motion.button>
                    ))}
                </AnimatePresence>
            </div>

            {/* EXIT BUTTON TOP RIGHT */}
            <div className="absolute top-6 right-6 z-50 flex flex-col gap-4 items-center">
                <button 
                    onClick={() => setView(backView)}
                    className="hover:scale-110 active:scale-95 transition-all outline-none"
                >
                    <img src={BTN_BACK_URL} alt="Indietro" className="w-16 h-16 md:w-24 h-auto drop-shadow-2xl" />
                </button>
                
                <button 
                    onClick={() => setIsRegisterOpen(true)}
                    className="hover:scale-110 active:scale-95 transition-all outline-none"
                >
                    <img src={BTN_REGISTER_URL} alt="Registro" className="w-16 h-16 md:w-24 h-auto drop-shadow-2xl" />
                </button>
            </div>

            <StudyRegister 
                isOpen={isRegisterOpen} 
                onClose={() => setIsRegisterOpen(false)} 
                grade={getGradeNumber()}
            />

            {/* Click anywhere on background to clear professor (if needed) */}
            {activeProfId && (
                <div 
                    className="absolute inset-0 z-0" 
                    onClick={() => setActiveProfId(null)}
                />
            )}
        </div>
    );
};

export default RainbowCityClassroom;

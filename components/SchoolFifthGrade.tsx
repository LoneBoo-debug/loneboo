
import React, { useState, useEffect } from 'react';
import { AppView, SchoolSubject } from '../types';
import { OFFICIAL_LOGO } from '../constants';
import CurriculumView from './CurriculumView';
import { GRADE5_DATA } from '../services/curriculum/grade5';

const BG_URL = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/quintalembg.webp';
const BTN_CLOSE_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/btn-close.webp';

const SchoolFifthGrade: React.FC<{ setView: (view: AppView) => void }> = ({ setView }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [activeSubject, setActiveSubject] = useState<SchoolSubject | null>(null);

    useEffect(() => {
        const img = new Image();
        img.src = BG_URL;
        img.onload = () => setIsLoaded(true);
        window.scrollTo(0, 0);
    }, []);

    const subjects = [
        { id: SchoolSubject.ITALIANO, label: 'Italiano', img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/italianobuc.webp' },
        { id: SchoolSubject.MATEMATICA, label: 'Matematica', img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/matebusc.webp' },
        { id: SchoolSubject.STORIA, label: 'Storia', img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/stobuscs.webp' },
        { id: SchoolSubject.GEOGRAFIA, label: 'Geografia', img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/geobusc.webp' },
        { id: SchoolSubject.SCIENZE, label: 'Scienze', img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/scisbuc.webp' },
    ];

    return (
        <div className="fixed inset-0 top-0 left-0 w-full h-[100dvh] z-0 bg-pink-900 overflow-hidden touch-none overscroll-none select-none">
            {!isLoaded && (
                <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-pink-900/95 backdrop-blur-md">
                    <img src={OFFICIAL_LOGO} alt="Caricamento..." className="w-32 h-32 object-contain animate-spin-horizontal mb-6" />
                    <span className="text-white font-black text-lg tracking-widest animate-pulse uppercase">Entro in 5ª Elementare...</span>
                </div>
            )}

            <div className="absolute inset-0 z-0">
                <img 
                    src={BG_URL} 
                    alt="5ª Elementare" 
                    className={`w-full h-full object-fill transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`} 
                />
            </div>

            {isLoaded && !activeSubject && (
                <>
                    <button 
                        onClick={() => setView(AppView.SCHOOL_SECOND_FLOOR)}
                        className="absolute top-20 left-4 md:top-28 md:left-8 z-50 hover:scale-110 active:scale-95 transition-all outline-none"
                    >
                        <img src={BTN_CLOSE_IMG} alt="Indietro" className="w-16 h-16 md:w-20 md:h-20 drop-shadow-2xl" />
                    </button>

                    {/* SIDEBAR MATERIE */}
                    <div 
                        className="absolute flex flex-col gap-1.5 md:gap-2.5 z-40 max-w-[55px] md:max-w-[100px]"
                        style={{ 
                            left: window.innerWidth < 768 ? '18.5%' : '21.5%',
                            top: '53.5%',
                            transform: 'translateY(-50%)'
                        }}
                    >
                        {subjects.map((s) => (
                            <button
                                key={s.id}
                                onClick={() => setActiveSubject(s.id)}
                                className="w-full hover:scale-110 active:scale-95 transition-transform outline-none drop-shadow-xl"
                                title={`Apri ${s.label}`}
                            >
                                <img src={s.img} alt={s.label} className="w-full h-auto" />
                            </button>
                        ))}
                    </div>

                    <div className="absolute bottom-[6%] left-1/2 -translate-x-1/2 flex justify-center pointer-events-none z-20 w-full px-4">
                        <div className="bg-white/90 backdrop-blur-md border-4 border-blue-500 px-6 py-3 rounded-[2rem] shadow-2xl animate-in slide-in-from-bottom-4">
                            <span className="font-luckiest text-blue-900 text-xl md:text-4xl uppercase tracking-tighter text-center block">
                                Scegli un libro per studiare! 📖
                            </span>
                        </div>
                    </div>
                </>
            )}

            {activeSubject && (
                <CurriculumView 
                    data={GRADE5_DATA} 
                    initialSubject={activeSubject}
                    onExit={() => setActiveSubject(null)} 
                    bgUrl={BG_URL}
                />
            )}
        </div>
    );
};

export default SchoolFifthGrade;


import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { AppView } from '../types';
import { getProgress, unlockStudentPass } from '../services/tokens';
import { fetchGradeCurriculum } from '../services/curriculumService';
import { ArrowLeft, GraduationCap, TrainFront, CheckCircle2 } from 'lucide-react';

const BADGE_URL = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/abbonamento+studentemedie.webp';
const DIPLOMA_URL = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/diplomaeleme667676.webp';
const LOCK_ICON_URL = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/icon-parents.webp';

interface PromotionInfoPageProps {
    setView: (view: AppView) => void;
}

const PromotionInfoPage: React.FC<PromotionInfoPageProps> = ({ setView }) => {
    const [progress, setProgress] = useState(getProgress());
    const [stats, setStats] = useState({ completed: 0, total: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const calculateStats = async () => {
            let totalExercises = 0;
            let completedExercises = 0;

            for (let grade = 1; grade <= 5; grade++) {
                const curriculum = await fetchGradeCurriculum(grade);
                if (curriculum) {
                    Object.values(curriculum.subjects).forEach(chapters => {
                        chapters.forEach(chapter => {
                            chapter.lessons.forEach(lesson => {
                                // Count quizzes (textual only)
                                lesson.quizzes.forEach((_, idx) => {
                                    totalExercises++;
                                    if (progress.completedQuizzes?.[lesson.id]?.[idx]) {
                                        completedExercises++;
                                    }
                                });
                            });
                        });
                    });
                }
            }

            setStats({ completed: completedExercises, total: totalExercises });
            setLoading(false);

            // If all completed and not yet unlocked, unlock it
            if (totalExercises > 0 && completedExercises >= totalExercises && !progress.hasStudentPass) {
                unlockStudentPass();
                setProgress(getProgress());
            }
        };

        calculateStats();
    }, [progress]);

    const isPromoted = stats.total > 0 && stats.completed >= stats.total;

    return (
        <div className="absolute inset-0 z-[100] bg-slate-900/90 backdrop-blur-md flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-lg relative">
                <button 
                    onClick={() => setView(AppView.SCHOOL_SECOND_FLOOR)}
                    className="absolute -top-12 left-0 flex items-center gap-2 text-white/70 hover:text-white transition-colors font-bold uppercase tracking-widest text-xs"
                >
                    <ArrowLeft size={16} /> Torna a Scuola
                </button>

                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white/10 backdrop-blur-xl rounded-[2.5rem] border-4 border-white/20 p-6 md:p-8 text-center shadow-2xl overflow-hidden"
                >
                    {isPromoted ? (
                        <div className="flex flex-col items-center">
                            <motion.div 
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ type: 'spring', damping: 12 }}
                                className="w-full mb-6"
                            >
                                <img 
                                    src={DIPLOMA_URL} 
                                    alt="Diploma di Promozione" 
                                    className="w-full h-auto rounded-xl shadow-2xl border-4 border-yellow-400/50"
                                />
                            </motion.div>

                            <h1 className="font-luckiest text-2xl md:text-3xl text-white uppercase tracking-wider mb-4 drop-shadow-lg">
                                Sei stato promosso!
                            </h1>

                            <div className="bg-green-500/20 border-2 border-green-500/50 rounded-2xl p-4 flex items-center gap-3 text-left w-full">
                                <CheckCircle2 size={32} className="text-green-400 shrink-0" />
                                <div>
                                    <h3 className="text-green-400 font-luckiest text-sm uppercase">Abbonamento Attivo!</h3>
                                    <p className="text-white/80 font-bold text-[10px]">Viaggia gratis verso la scuola media di città degli arcobaleni!</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="mb-6 flex justify-center gap-4">
                                <div className="relative">
                                    <img 
                                        src={BADGE_URL} 
                                        alt="Abbonamento Studente" 
                                        className="w-24 h-24 md:w-32 md:h-32 object-contain drop-shadow-2xl grayscale opacity-40 scale-90 rotate-12"
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <img src={LOCK_ICON_URL} alt="Locked" className="w-10 h-10 md:w-12 md:h-12 object-contain drop-shadow-lg" />
                                    </div>
                                </div>
                                <div className="relative">
                                    <img 
                                        src={DIPLOMA_URL} 
                                        alt="Diploma" 
                                        className="w-24 h-24 md:w-32 md:h-32 object-cover rounded-lg drop-shadow-2xl grayscale opacity-40 scale-90 -rotate-6"
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <img src={LOCK_ICON_URL} alt="Locked" className="w-10 h-10 md:w-12 md:h-12 object-contain drop-shadow-lg" />
                                    </div>
                                </div>
                            </div>

                            <h1 className="font-luckiest text-2xl md:text-3xl text-white uppercase tracking-wider mb-4 drop-shadow-lg">
                                Verso la Promozione!
                            </h1>

                            <p className="text-white/80 text-sm md:text-base font-bold mb-6 leading-relaxed px-4">
                                Completa tutti i quiz di tutte le aule della scuola elementare per sbloccare il tuo diploma e il badge speciale!
                            </p>

                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="bg-white/5 rounded-2xl p-4 border-2 border-white/10 flex flex-col items-center">
                                    <GraduationCap size={24} className="text-yellow-400 mb-2" />
                                    <span className="text-white/60 text-[10px] font-black uppercase tracking-widest mb-1">Progresso Quiz</span>
                                    <span className="text-white font-luckiest text-xl">
                                        {loading ? '...' : `${stats.completed} / ${stats.total}`}
                                    </span>
                                </div>
                                <div className="bg-white/5 rounded-2xl p-4 border-2 border-white/10 flex flex-col items-center">
                                    <TrainFront size={24} className="text-blue-400 mb-2" />
                                    <span className="text-white/60 text-[10px] font-black uppercase tracking-widest mb-1">Vantaggio</span>
                                    <span className="text-white font-luckiest text-[10px] uppercase leading-tight">Viaggi gratis verso la scuola media di città degli arcobaleni</span>
                                </div>
                            </div>

                            <div className="w-full bg-white/5 rounded-full h-3 overflow-hidden border border-white/10">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${stats.total > 0 ? (stats.completed / stats.total) * 100 : 0}%` }}
                                    className="h-full bg-gradient-to-r from-yellow-400 to-orange-500"
                                />
                            </div>
                        </>
                    )}
                </motion.div>

            </div>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 8px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.05);
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.2);
                    border-radius: 4px;
                }
            `}</style>
        </div>
    );
};

export default PromotionInfoPage;

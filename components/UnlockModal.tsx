
import React, { useState } from 'react';
import { Lock, BookOpen, Coins, X, Check } from 'lucide-react';

interface UnlockModalProps {
    onClose: () => void;
    onUnlock: () => void;
    onOpenNewsstand: () => void;
    currentTokens: number;
}

const UnlockModal: React.FC<UnlockModalProps> = ({ onClose, onUnlock, onOpenNewsstand, currentTokens }) => {
    const COST = 1500;
    const [step, setStep] = useState<'CHOICE' | 'CONFIRM'>('CHOICE');

    const handleCoinClick = () => {
        if (currentTokens >= COST) {
            setStep('CONFIRM');
        } else {
            alert(`Non hai abbastanza gettoni! Te ne servono ${COST}, ma ne hai solo ${currentTokens}. Gioca per guadagnarne altri!`);
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in" onClick={onClose}>
            <div className="bg-white w-full max-w-md rounded-[40px] border-8 border-purple-600 p-6 relative shadow-[0_0_50px_rgba(147,51,234,0.5)] text-center" onClick={e => e.stopPropagation()}>
                
                <button onClick={onClose} className="absolute top-4 right-4 bg-gray-100 p-2 rounded-full hover:bg-red-100 text-gray-500 hover:text-red-500 transition-colors">
                    <X size={24} />
                </button>

                <div className="mb-6 flex justify-center">
                    <div className="bg-purple-100 p-4 rounded-full border-4 border-purple-300">
                        <Lock size={48} className="text-purple-600" />
                    </div>
                </div>

                <h3 className="text-2xl font-black text-gray-800 mb-2 uppercase">Livello Bloccato</h3>
                
                {step === 'CHOICE' ? (
                    <>
                        <p className="text-gray-600 font-bold mb-8 leading-relaxed">
                            Questo livello è per veri esperti!<br/>
                            Per entrare hai due strade:
                        </p>

                        <div className="flex flex-col gap-4">
                            {/* OPTION 1: ALBUM */}
                            <button 
                                onClick={onOpenNewsstand}
                                className="bg-blue-500 text-white p-4 rounded-2xl border-b-4 border-blue-700 active:border-b-0 active:translate-y-1 transition-all flex items-center gap-4 hover:brightness-110 shadow-md group"
                            >
                                <div className="bg-white/20 p-2 rounded-xl group-hover:scale-110 transition-transform">
                                    <BookOpen size={24} />
                                </div>
                                <div className="text-left flex-1">
                                    <span className="block font-black text-sm uppercase opacity-80">Opzione 1</span>
                                    <span className="block font-black text-lg">COMPLETA L'ALBUM</span>
                                </div>
                            </button>

                            <div className="flex items-center gap-4 py-1">
                                <div className="h-px bg-gray-300 flex-1"></div>
                                <span className="font-black text-gray-400 text-sm">OPPURE</span>
                                <div className="h-px bg-gray-300 flex-1"></div>
                            </div>

                            {/* OPTION 2: COINS */}
                            <button 
                                onClick={handleCoinClick}
                                className="bg-yellow-400 text-black p-4 rounded-2xl border-b-4 border-yellow-600 active:border-b-0 active:translate-y-1 transition-all flex items-center gap-4 hover:brightness-110 shadow-md group"
                            >
                                <div className="bg-white/40 p-2 rounded-xl group-hover:scale-110 transition-transform">
                                    <Coins size={24} className="text-black" />
                                </div>
                                <div className="text-left flex-1">
                                    <span className="block font-black text-xs uppercase opacity-70">Opzione 2</span>
                                    <span className="block font-black text-lg">SBLOCCA SUBITO</span>
                                    <span className={`text-xs font-bold ${currentTokens >= COST ? 'text-green-700' : 'text-red-700'}`}>
                                        Prezzo: 1500 (Hai: {currentTokens})
                                    </span>
                                </div>
                            </button>
                        </div>
                    </>
                ) : (
                    /* CONFIRMATION STEP */
                    <div className="animate-in zoom-in duration-300">
                        <p className="text-xl font-bold text-gray-700 mb-6 leading-relaxed">
                            Sei sicuro? <br/>
                            Spenderai <span className="text-orange-500 font-black">1500 Gettoni</span> per sbloccare questo livello per sempre.
                        </p>

                        <div className="flex gap-3">
                            <button 
                                onClick={onUnlock}
                                className="flex-1 bg-green-500 text-white font-black py-4 rounded-xl border-b-4 border-green-700 active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-2 text-lg"
                            >
                                <Check size={24} strokeWidth={4} /> SÌ, VAI!
                            </button>
                            <button 
                                onClick={() => setStep('CHOICE')}
                                className="flex-1 bg-gray-200 text-gray-600 font-black py-4 rounded-xl border-b-4 border-gray-400 active:border-b-0 active:translate-y-1 transition-all"
                            >
                                NO, ASPETTA
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UnlockModal;

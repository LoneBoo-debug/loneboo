
import React, { useState } from 'react';
import { X, Check } from 'lucide-react';

const LOCK_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/icon-parents.webp';
const ALBUM_ICON_IMG = 'https://i.postimg.cc/s2Hdk34g/goldedition-(1).png';
const COINS_ICON_IMG = 'https://i.postimg.cc/zf0Pypyd/solid.png';
const BTN_CLOSE_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/btn-close.webp';

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
        <div className="fixed inset-0 z-[500] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in" onClick={onClose}>
            <div className="bg-white w-full max-w-md rounded-[40px] border-8 border-purple-600 p-5 md:p-6 relative shadow-[0_0_50px_rgba(147,51,234,0.5)] text-center" onClick={e => e.stopPropagation()}>
                
                <button onClick={onClose} className="absolute -top-4 -right-4 hover:scale-110 active:scale-95 transition-all outline-none z-10">
                    <img src={BTN_CLOSE_IMG} alt="Chiudi" className="w-16 h-16 md:w-24 md:h-24 object-contain drop-shadow-md" />
                </button>

                <div className="mb-1 flex justify-center">
                    <img 
                        src={LOCK_IMG} 
                        alt="Livello Bloccato" 
                        className="w-24 h-24 md:w-32 md:h-32 object-contain drop-shadow-xl" 
                    />
                </div>

                <h3 className="text-xl md:text-2xl font-black text-gray-800 mb-1 uppercase">Livello Bloccato</h3>
                
                {step === 'CHOICE' ? (
                    <>
                        <p className="text-gray-600 font-bold mb-4 md:mb-6 text-sm md:text-base leading-tight">
                            Questo livello è per veri esperti!<br/>
                            Per entrare hai due strade:
                        </p>

                        <div className="flex flex-col gap-3 md:gap-4">
                            {/* OPTION 1: ALBUM */}
                            <button 
                                onClick={onOpenNewsstand}
                                className="bg-blue-500 text-white p-3 md:p-4 rounded-2xl border-b-4 border-blue-700 active:border-b-0 active:translate-y-1 transition-all flex items-center gap-3 md:gap-4 hover:brightness-110 shadow-md group"
                            >
                                <img 
                                    src={ALBUM_ICON_IMG} 
                                    alt="Album" 
                                    className="w-12 h-12 md:w-16 md:h-16 object-contain group-hover:scale-110 transition-transform drop-shadow-md" 
                                />
                                <div className="text-left flex-1">
                                    <span className="block font-black text-[10px] md:text-sm uppercase opacity-80">Opzione 1</span>
                                    <span className="block font-black text-base md:text-lg">COMPLETA L'ALBUM</span>
                                </div>
                            </button>

                            <div className="flex items-center gap-4 py-0.5">
                                <div className="h-px bg-gray-300 flex-1"></div>
                                <span className="font-black text-gray-400 text-xs">OPPURE</span>
                                <div className="h-px bg-gray-300 flex-1"></div>
                            </div>

                            {/* OPTION 2: COINS */}
                            <button 
                                onClick={handleCoinClick}
                                className="bg-orange-300 text-black p-3 md:p-4 rounded-2xl border-b-4 border-orange-500 active:border-b-0 active:translate-y-1 transition-all flex items-center gap-3 md:gap-4 hover:brightness-110 shadow-md group"
                            >
                                <img 
                                    src={COINS_ICON_IMG} 
                                    alt="Gettoni" 
                                    className="w-12 h-12 md:w-16 md:h-16 object-contain group-hover:scale-110 transition-transform drop-shadow-md" 
                                />
                                <div className="text-left flex-1">
                                    <span className="block font-black text-[10px] md:text-xs uppercase opacity-70">Opzione 2</span>
                                    <span className="block font-black text-base md:text-lg">SBLOCCA SUBITO</span>
                                    <span className={`text-[10px] md:text-xs font-bold ${currentTokens >= COST ? 'text-green-700' : 'text-red-700'}`}>
                                        Prezzo: 1500 (Hai: {currentTokens})
                                    </span>
                                </div>
                            </button>
                        </div>
                    </>
                ) : (
                    /* CONFIRMATION STEP */
                    <div className="animate-in zoom-in duration-300 py-2">
                        <p className="text-lg md:text-xl font-bold text-gray-700 mb-6 leading-relaxed">
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

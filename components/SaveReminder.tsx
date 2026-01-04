import React, { useState } from 'react';
import { Download, X } from 'lucide-react';

const SAVE_PROGRESS_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/btn-save-progress.webp';

interface SaveReminderProps {
    onOpenNewsstand: () => void;
}

const SaveReminder: React.FC<SaveReminderProps> = ({ onOpenNewsstand }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* Pulsante Fluttuante con la nuova immagine */}
            <button
                onClick={() => setIsOpen(true)}
                className="absolute top-2 left-2 md:top-3 md:left-3 z-50 group hover:scale-110 transition-transform active:scale-95 outline-none"
                title="Salva Progressi"
            >
                <div className="relative">
                    <img 
                        src={SAVE_PROGRESS_IMG} 
                        alt="Salva i Progressi" 
                        className="w-20 h-auto md:w-28 drop-shadow-lg" 
                    />
                    {/* Pallino di notifica pulsante */}
                    <span className="absolute top-0 right-0 flex h-4 w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 border-2 border-white shadow-sm"></span>
                    </span>
                </div>
            </button>

            {/* Modal Overlay */}
            {isOpen && (
                <div 
                    className="absolute inset-0 z-[100] bg-black/95 rounded-[inherit] flex flex-col items-center justify-center p-6 text-center animate-in zoom-in duration-300" 
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Immagine nel modale al posto dell'icona */}
                    <div className="mb-6 transform hover:scale-105 transition-transform duration-500">
                        <img 
                            src={SAVE_PROGRESS_IMG} 
                            alt="Salva i Progressi" 
                            className="w-48 h-auto md:w-64 drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]" 
                        />
                    </div>
                    
                    <h3 className="text-white text-2xl md:text-3xl font-black mb-4 uppercase leading-tight tracking-wide">
                        Hai finito di giocare?
                    </h3>
                    
                    <p className="text-white/90 font-bold mb-8 text-base md:text-lg leading-relaxed max-w-xs mx-auto">
                        Prima di chiudere, scarica la tua <span className="text-yellow-400 border-b-2 border-yellow-400">tessera aggiornata</span> per mettere al sicuro tutti i tuoi gettoni! 🪙
                    </p>
                    
                    <div className="flex flex-col gap-3 w-full max-w-xs">
                        <button
                            onClick={() => { setIsOpen(false); onOpenNewsstand(); }}
                            className="w-full bg-green-500 text-white font-black py-4 px-6 rounded-full border-4 border-white shadow-[0_0_20px_rgba(34,197,94,0.6)] active:scale-95 active:translate-y-1 transition-all flex items-center justify-center gap-3 text-lg"
                        >
                            <Download size={24} strokeWidth={3} /> SCARICA TESSERA
                        </button>
                        
                        <button
                            onClick={() => setIsOpen(false)}
                            className="bg-white/10 text-white font-bold py-3 rounded-full border-2 border-white/20 hover:bg-white/20 transition-colors text-sm uppercase tracking-widest"
                        >
                            Voglio giocare ancora
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default SaveReminder;
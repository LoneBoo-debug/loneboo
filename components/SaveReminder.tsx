
import React, { useState } from 'react';
import { IdCard, Download } from 'lucide-react';

interface SaveReminderProps {
    onOpenNewsstand: () => void;
}

const SaveReminder: React.FC<SaveReminderProps> = ({ onOpenNewsstand }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* Flashing Icon Button - Top Left of the container */}
            <button
                onClick={() => setIsOpen(true)}
                className="absolute top-3 left-3 bg-white p-2 rounded-xl border-2 border-blue-500 shadow-md animate-pulse hover:scale-110 transition-transform z-50 group"
                title="Salva Progressi"
            >
                <IdCard className="text-blue-600 w-6 h-6" />
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
            </button>

            {/* Modal Overlay */}
            {isOpen && (
                <div className="absolute inset-0 z-[60] bg-black/95 rounded-[inherit] flex flex-col items-center justify-center p-6 text-center animate-in zoom-in" onClick={(e) => e.stopPropagation()}>
                    <div className="bg-blue-100 p-4 rounded-full mb-4 border-4 border-blue-300">
                        <IdCard size={48} className="text-blue-600" />
                    </div>
                    
                    <h3 className="text-white text-2xl font-black mb-4 uppercase leading-tight">
                        Hai finito di giocare?
                    </h3>
                    
                    <p className="text-white/90 font-bold mb-8 text-sm md:text-base leading-relaxed max-w-xs">
                        Se pensi di aver finito al parco giochi, ti consiglio di scaricare il tuo <span className="text-yellow-400 border-b-2 border-yellow-400">documento ufficiale</span> per non perdere i gettoni vinti!
                    </p>
                    
                    <button
                        onClick={() => { setIsOpen(false); onOpenNewsstand(); }}
                        className="w-full bg-green-500 text-white font-black py-4 px-6 rounded-full border-4 border-white shadow-[0_0_20px_rgba(34,197,94,0.6)] active:scale-95 transition-transform flex items-center justify-center gap-3 text-lg mb-4"
                    >
                        <Download size={24} strokeWidth={3} /> SCARICA TESSERA
                    </button>
                    
                    <button
                        onClick={() => setIsOpen(false)}
                        className="text-gray-400 font-bold underline text-sm hover:text-white transition-colors"
                    >
                        No, voglio giocare ancora
                    </button>
                </div>
            )}
        </>
    );
};

export default SaveReminder;

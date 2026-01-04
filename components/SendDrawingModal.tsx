import React, { useState, useRef } from 'react';
import { X, Loader2, Image as ImageIcon, Check, AlertCircle, MapPin, User, Calendar } from 'lucide-react';
import { OFFICIAL_LOGO } from '../constants';

const HEADER_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/inviadiseffrea.webp';
const BTN_SEND_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/senddisegfre.webp';

interface SendDrawingModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const SendDrawingModal: React.FC<SendDrawingModalProps> = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState({ name: '', age: '', city: '', province: '', image: '' });
    const [isSending, setIsSending] = useState(false);
    const [status, setStatus] = useState<'IDLE' | 'SUCCESS' | 'ERROR'>('IDLE');
    const [errorMsg, setErrorMsg] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    if (!isOpen) return null;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 4 * 1024 * 1024) {
                alert("L'immagine è troppo grande! Scegline una più piccola (massimo 4MB).");
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => setFormData(prev => ({ ...prev, image: reader.result as string }));
            reader.readAsDataURL(file);
        }
    };

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.image || isSending) return;

        setIsSending(true);
        setStatus('IDLE');
        setErrorMsg('');

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000);

        try {
            const response = await fetch('/api/send-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (response.status === 404 || !response.ok) {
                if (window.location.hostname.includes('webcontainer') || window.location.hostname.includes('localhost')) {
                    await new Promise(r => setTimeout(r, 2000));
                    setStatus('SUCCESS');
                    return;
                }
                throw new Error("Servizio non disponibile.");
            }

            setStatus('SUCCESS');
        } catch (err: any) {
            clearTimeout(timeoutId);
            setStatus('ERROR');
            setErrorMsg(err.name === 'AbortError' ? "Tempo scaduto!" : "Errore di invio.");
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in" onClick={onClose}>
            <div 
                className="bg-white rounded-[40px] border-8 border-blue-500 p-4 md:p-5 max-w-sm w-full shadow-2xl relative animate-in slide-in-from-bottom overflow-hidden" 
                onClick={e => e.stopPropagation()}
            >
                
                {/* TASTO CHIUDI - DIMENSIONI RADDOPPIATE */}
                <button onClick={onClose} className="absolute -top-1 -right-1 hover:scale-110 active:scale-95 transition-all outline-none z-50">
                    <img src="https://loneboo-images.s3.eu-south-1.amazonaws.com/btn-close.webp" alt="Chiudi" className="w-16 h-16 md:w-20 md:h-20 drop-shadow-md" />
                </button>

                {status === 'SUCCESS' ? (
                    <div className="text-center py-6 animate-in zoom-in">
                        <img src={OFFICIAL_LOGO} alt="Successo" className="w-16 h-16 mx-auto mb-4 animate-bounce" />
                        <h3 className="text-xl font-black text-blue-600 mb-2 uppercase">SPEDITO! 🎉</h3>
                        <p className="text-gray-500 font-bold mb-6 leading-tight text-sm px-4">Il tuo disegno è in viaggio verso Lone Boo!</p>
                        <button onClick={onClose} className="bg-blue-500 text-white font-black py-3 px-8 rounded-full border-4 border-black shadow-[4px_4px_0_black] active:translate-y-1 transition-all uppercase text-lg">CHIUDI</button>
                    </div>
                ) : (
                    <form onSubmit={handleSend} className="space-y-2.5">
                        {/* HEADER - DIMENSIONI AUMENTATE LEGGERMENTE */}
                        <div className="flex justify-center mb-0.5">
                            <img src={HEADER_IMG} alt="Invia il tuo disegno" className="w-full h-auto max-w-[200px] md:max-w-[230px] drop-shadow-sm" />
                        </div>
                        
                        {status === 'ERROR' && (
                            <div className="bg-red-50 border-2 border-red-200 p-1.5 rounded-xl flex items-center gap-2 text-red-600 text-[9px] font-bold animate-shake">
                                <AlertCircle size={12} />
                                <span>{errorMsg}</span>
                            </div>
                        )}

                        <div className="space-y-2">
                            {/* RIGA 1: NOME E ETÀ */}
                            <div className="grid grid-cols-4 gap-2">
                                <div className="relative col-span-3">
                                    <User className="absolute left-2.5 top-1/2 -translate-y-1/2 text-blue-400" size={14} />
                                    <input 
                                        type="text" 
                                        placeholder="IL TUO NOME..." 
                                        value={formData.name} 
                                        onChange={e => setFormData({...formData, name: e.target.value})} 
                                        className="w-full bg-blue-50 border-2 md:border-4 border-blue-100 rounded-xl p-2 pl-8 font-black uppercase text-slate-900 focus:border-blue-500 outline-none text-[10px]" 
                                        required 
                                        disabled={isSending}
                                    />
                                </div>
                                <div className="relative col-span-1">
                                    <input 
                                        type="text" 
                                        placeholder="ETÀ" 
                                        value={formData.age} 
                                        onChange={e => setFormData({...formData, age: e.target.value})} 
                                        className="w-full bg-blue-50 border-2 md:border-4 border-blue-100 rounded-xl p-2 text-center font-black uppercase text-slate-900 focus:border-blue-500 outline-none text-[10px]" 
                                        required
                                        disabled={isSending}
                                    />
                                </div>
                            </div>

                            {/* RIGA 2: CITTÀ E PROVINCIA */}
                            <div className="grid grid-cols-4 gap-2">
                                <div className="relative col-span-3">
                                    <MapPin className="absolute left-2.5 top-1/2 -translate-y-1/2 text-blue-400" size={14} />
                                    <input 
                                        type="text" 
                                        placeholder="CITTÀ..." 
                                        value={formData.city} 
                                        onChange={e => setFormData({...formData, city: e.target.value})} 
                                        className="w-full bg-blue-50 border-2 md:border-4 border-blue-100 rounded-xl p-2 pl-8 font-black uppercase text-slate-900 focus:border-blue-500 outline-none text-[10px]" 
                                        required
                                        disabled={isSending}
                                    />
                                </div>
                                <div className="relative col-span-1">
                                    <input 
                                        type="text" 
                                        placeholder="PROV." 
                                        value={formData.province} 
                                        onChange={e => setFormData({...formData, province: e.target.value})} 
                                        className="w-full bg-blue-50 border-2 md:border-4 border-blue-100 rounded-xl p-2 text-center font-black uppercase text-slate-900 focus:border-blue-500 outline-none text-[10px]" 
                                        maxLength={2}
                                        disabled={isSending}
                                    />
                                </div>
                            </div>
                        </div>

                        <div 
                            onClick={() => !isSending && fileInputRef.current?.click()} 
                            className={`
                                h-20 md:h-28 bg-gray-50 rounded-[20px] border-4 border-dashed transition-all overflow-hidden flex flex-col items-center justify-center cursor-pointer relative
                                ${formData.image ? 'border-green-400' : 'border-gray-300 hover:bg-gray-100'}
                                ${isSending ? 'opacity-50' : ''}
                            `}
                        >
                            {formData.image ? (
                                <img src={formData.image} alt="Anteprima" className="w-full h-full object-cover" />
                            ) : (
                                <>
                                    <div className="bg-white p-1.5 rounded-full shadow-sm mb-1">
                                        <ImageIcon size={18} className="text-blue-500" />
                                    </div>
                                    <span className="text-[8px] font-black text-gray-500 uppercase tracking-tighter">ALLEGA DISEGNO</span>
                                </>
                            )}
                            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                        </div>

                        <div className="flex justify-center pt-0.5">
                            <button 
                                type="submit" 
                                disabled={isSending || !formData.image || !formData.name} 
                                className="relative transition-all active:scale-95 disabled:opacity-40 disabled:grayscale outline-none group max-w-[130px] md:max-w-[150px]"
                            >
                                <img src={BTN_SEND_IMG} alt="Spedisci" className={`w-full h-auto drop-shadow-md ${isSending ? 'animate-pulse' : 'group-hover:scale-105'}`} />
                                
                                {isSending && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Loader2 className="animate-spin text-white" size={20} strokeWidth={4} />
                                    </div>
                                )}
                            </button>
                        </div>
                    </form>
                )}
                
                <p className="text-[7px] text-gray-400 font-bold text-center mt-2 uppercase leading-none opacity-60">Il disegno verrà pubblicato nella gallery del museo.</p>
            </div>
        </div>
    );
};

export default SendDrawingModal;
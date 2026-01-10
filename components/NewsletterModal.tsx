
import React, { useState, useEffect } from 'react';
import { X, Send, Check, AlertCircle, Loader2, Mail, User } from 'lucide-react';

interface NewsletterModalProps {
    onClose: () => void;
}

const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzt_QIilBK5UQ-jmXsD_gjl0kfKgUSsGBJWXlzavOEvzAtGsjcq5PdM-cnOoyWFJheMIw/exec';
const BTN_SUBSCRIBE_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/riceviaggiorna.webp';
const SUCCESS_TITLE_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/evvivanabbne433.webp';
const BTN_CLOSE_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/btn-close.webp';
const SUBMISSION_COOLDOWN = 1000 * 60 * 5; // 5 minuti di attesa tra un invio e l'altro

const NewsletterModal: React.FC<NewsletterModalProps> = ({ onClose }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [privacy, setPrivacy] = useState(false);
    // Honeypot field: se riempito, è un bot
    const [honeypot, setHoneypot] = useState('');
    const [status, setStatus] = useState<'IDLE' | 'SENDING' | 'SUCCESS' | 'ERROR'>('IDLE');
    const [errorMsg, setErrorMsg] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg('');

        // 1. Check Honeypot (Anti-Bot)
        if (honeypot.length > 0) {
            console.warn("Spam bot detected via honeypot");
            setStatus('SUCCESS'); // Simuliamo successo per confondere il bot
            return;
        }

        // 2. Check Rate Limiting (Anti-Spam manuale)
        const lastSub = localStorage.getItem('last_newsletter_sub');
        if (lastSub && (Date.now() - parseInt(lastSub)) < SUBMISSION_COOLDOWN) {
            setStatus('ERROR');
            setErrorMsg("Hai già provato poco fa. Aspetta qualche minuto!");
            return;
        }

        if (!name || !email || !privacy) return;

        // 3. Validazione Email Rinforzata
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
        const isFakeEmail = email.length < 6 || (email.split('@')[0].length < 2);
        
        if (!emailRegex.test(email) || isFakeEmail) {
            setStatus('ERROR');
            setErrorMsg("Indirizzo sbagliato, controlla bene!");
            return;
        }

        setStatus('SENDING');

        try {
            // Simuliamo un piccolo ritardo per sembrare una verifica reale
            await new Promise(resolve => setTimeout(resolve, 800));

            await fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email }),
            });

            // Salviamo il timestamp dell'invio avvenuto
            localStorage.setItem('last_newsletter_sub', Date.now().toString());
            setStatus('SUCCESS');
        } catch (error) {
            console.error("Errore invio newsletter:", error);
            setStatus('ERROR');
            setErrorMsg("Indirizzo sbagliato, controlla bene!");
        }
    };

    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-300" onClick={onClose}>
            <div 
                className="bg-white relative w-full max-w-[340px] p-5 md:p-7 rounded-[40px] border-8 border-boo-purple shadow-[8px_8px_0px_0px_black] animate-in zoom-in-95 duration-300 flex flex-col items-center"
                onClick={e => e.stopPropagation()}
            >
                {/* Close Button Image - Only visible if not success */}
                {status !== 'SUCCESS' && (
                    <button 
                        onClick={onClose}
                        className="absolute -top-6 -right-6 md:-top-8 md:-right-8 hover:scale-110 active:scale-95 transition-all outline-none z-20"
                    >
                        <img src={BTN_CLOSE_IMG} alt="Chiudi" className="w-14 h-14 md:w-20 md:h-20 object-contain drop-shadow-xl" />
                    </button>
                )}

                {status === 'SUCCESS' ? (
                    <div className="text-center py-2 animate-in zoom-in flex flex-col items-center">
                        <div className="mb-4">
                            <img 
                                src={SUCCESS_TITLE_IMG} 
                                alt="Evviva!" 
                                className="w-full max-w-[240px] mx-auto h-auto drop-shadow-xl"
                            />
                        </div>
                        <p className="text-gray-600 font-bold text-base leading-relaxed mb-6">
                            Ora sei un amico ufficiale di Lone Boo!<br/>
                            Riceverai presto le nostre novità magiche.
                        </p>
                        <button 
                            onClick={onClose}
                            className="w-full max-w-[90px] hover:scale-105 active:scale-95 transition-all outline-none"
                        >
                            <img 
                                src={BTN_CLOSE_IMG} 
                                alt="Chiudi" 
                                className="w-full h-auto drop-shadow-lg"
                            />
                        </button>
                    </div>
                ) : (
                    <>
                        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4 w-full pt-2">
                            {/* Honeypot Field - Invisibile agli umani */}
                            <div className="absolute opacity-0 -z-10 pointer-events-none" aria-hidden="true">
                                <input 
                                    type="text" 
                                    name="mid_name_validation" 
                                    value={honeypot} 
                                    onChange={e => setHoneypot(e.target.value)} 
                                    tabIndex={-1} 
                                    autoComplete="off" 
                                />
                            </div>

                            <div className="relative">
                                <label className="block text-gray-700 font-black text-[10px] uppercase mb-1 ml-2">Nome</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input 
                                        type="text" 
                                        value={name}
                                        onChange={e => setName(e.target.value)}
                                        placeholder="Il tuo nome..."
                                        required
                                        className="w-full bg-gray-50 border-4 border-gray-200 rounded-2xl p-3 pl-10 font-bold text-gray-800 focus:border-boo-purple outline-none transition-colors text-sm"
                                    />
                                </div>
                            </div>

                            <div className="relative">
                                <label className="block text-gray-700 font-black text-[10px] uppercase mb-1 ml-2">Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input 
                                        type="email" 
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        placeholder="La tua email..."
                                        required
                                        className="w-full bg-gray-50 border-4 border-gray-200 rounded-2xl p-3 pl-10 font-bold text-gray-800 focus:border-boo-purple outline-none transition-colors text-sm"
                                    />
                                </div>
                            </div>

                            {/* Custom 3D Toggle for Privacy */}
                            <div className="flex items-center gap-3 mt-1 mb-1 p-3 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                                <button
                                    type="button"
                                    onClick={() => setPrivacy(!privacy)}
                                    className={`
                                        w-12 h-12 shrink-0 rounded-xl border-4 border-black transition-all flex items-center justify-center
                                        shadow-[3px_3px_0px_0px_black] active:shadow-none active:translate-y-1 active:translate-x-1
                                        ${privacy ? 'bg-green-500' : 'bg-red-500'}
                                    `}
                                >
                                    {privacy ? (
                                        <Check className="text-white" strokeWidth={5} size={24} />
                                    ) : (
                                        <X className="text-white" strokeWidth={5} size={24} />
                                    )}
                                </button>
                                <label className="text-[9px] text-gray-500 font-bold leading-tight cursor-pointer select-none" onClick={() => setPrivacy(!privacy)}>
                                    Accetto di ricevere la newsletter di Lone Boo. I dati non verranno ceduti a terzi.
                                </label>
                            </div>

                            {status === 'ERROR' && (
                                <div className="bg-red-50 text-red-600 p-2 rounded-xl border-2 border-red-200 flex items-center gap-2 text-[10px] font-bold animate-shake">
                                    <AlertCircle size={14} />
                                    {errorMsg}
                                </div>
                            )}

                            {/* Submit Image Button */}
                            <button 
                                type="submit"
                                disabled={status === 'SENDING' || !name || !email || !privacy}
                                className={`
                                    relative mt-1 w-full transition-all group
                                    ${status === 'SENDING' ? 'opacity-70 pointer-events-none' : 'hover:scale-105 active:scale-95'}
                                    disabled:opacity-50 disabled:scale-100 disabled:grayscale
                                `}
                            >
                                {status === 'SENDING' && (
                                    <div className="absolute inset-0 flex items-center justify-center z-10">
                                        <Loader2 className="animate-spin text-boo-purple" size={32} strokeWidth={3} />
                                    </div>
                                )}
                                <img 
                                    src={BTN_SUBSCRIBE_IMG} 
                                    alt="Iscriviti" 
                                    className={`w-full h-auto drop-shadow-xl transition-all ${status === 'SENDING' ? 'blur-sm' : ''}`}
                                />
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
};

export default NewsletterModal;

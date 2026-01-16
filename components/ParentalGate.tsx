import React, { useState, useEffect } from 'react';
import { X, Lock, Check } from 'lucide-react';

const ICON_PARENTS = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/icon-parents.webp';
const BTN_CLOSE_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/btn-close.webp';

interface ParentalGateProps {
    onClose: () => void;
    onSuccess: () => void;
}

const ParentalGate: React.FC<ParentalGateProps> = ({ onClose, onSuccess }) => {
    const [problem, setProblem] = useState({ q: '', a: 0 });
    const [answer, setAnswer] = useState('');
    const [error, setError] = useState(false);

    useEffect(() => {
        // Genera un'operazione più complessa: (n1 x n2) : 2
        let n1 = Math.floor(Math.random() * 5) + 6; // 6-10
        let n2 = Math.floor(Math.random() * 5) + 6; // 6-10
        
        // Assicuriamoci che il prodotto sia pari per avere una divisione intera esatta
        if ((n1 * n2) % 2 !== 0) {
            n1++;
        }
        
        const result = (n1 * n2) / 2;
        setProblem({ 
            q: `(${n1} x ${n2}) : 2`, 
            a: result 
        });
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (parseInt(answer) === problem.a) {
            onSuccess();
        } else {
            setError(true);
            setAnswer('');
            setTimeout(() => setError(false), 500);
        }
    };

    return (
        <div className="fixed inset-0 z-[300] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in" onClick={onClose}>
            <div className="bg-white w-full max-w-sm rounded-[30px] border-8 border-slate-700 p-6 relative shadow-2xl" onClick={e => e.stopPropagation()}>
                
                <button 
                    onClick={onClose} 
                    className="absolute top-4 right-4 hover:scale-110 active:scale-95 transition-all outline-none"
                >
                    <img src={BTN_CLOSE_IMG} alt="Chiudi" className="w-16 h-16 md:w-18 md:h-18 object-contain drop-shadow-md" />
                </button>

                <div className="flex flex-col items-center text-center mb-6">
                    <img src={ICON_PARENTS} alt="Genitori" className="w-24 h-24 object-contain mb-4 drop-shadow-md" />
                    <h3 className="text-xl font-black text-slate-800 uppercase">Area Genitori</h3>
                    <p className="text-slate-500 font-bold text-sm">Risolvi per entrare</p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="text-center">
                        <span className="text-3xl md:text-4xl font-black text-slate-800 tracking-widest">{problem.q} = ?</span>
                    </div>

                    <input 
                        type="tel" 
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        className={`w-full text-center text-3xl font-black p-4 rounded-xl border-4 outline-none transition-all text-black bg-white shadow-inner ${error ? 'border-red-500 bg-red-50 animate-shake' : 'border-slate-300 focus:border-blue-500'}`}
                        placeholder="Risultato..."
                        autoFocus
                    />

                    <button 
                        type="submit"
                        className="w-full bg-blue-600 text-white font-black py-4 rounded-xl border-b-4 border-blue-800 active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-2 text-lg"
                    >
                        <Check size={24} strokeWidth={4} /> VERIFICA
                    </button>
                </form>
                
                <div className="mt-4 text-center">
                    <p className="text-[10px] text-gray-400 font-bold uppercase">Solo per adulti</p>
                </div>
            </div>
        </div>
    );
};

export default ParentalGate;
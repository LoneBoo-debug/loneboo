import React from 'react';
import SoundLayout from './SoundLayout';
import { DJ_SOUNDS } from '../../constants';

const DJ_BG = 'https://i.postimg.cc/zv2N8kSc/dsedses.jpg';
const DJ_TITLE_IMG = 'https://i.postimg.cc/yxjd99hX/djhgt-(1).png';

const DjConsole: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const playSound = (src: string) => { const a = new Audio(src); a.volume = 0.8; a.play().catch(()=>{}); };
    return (
        <SoundLayout onBack={onBack} titleImage={DJ_TITLE_IMG} backgroundImage={DJ_BG}>
            <div className="grid grid-cols-3 md:grid-cols-5 gap-4 w-full max-w-4xl p-4">
                {DJ_SOUNDS.map((s) => (
                    <button key={s.id} onPointerDown={(e) => { e.preventDefault(); playSound(s.src); }} className="aspect-square rounded-3xl border-4 border-black bg-white hover:bg-yellow-100 active:bg-yellow-300 active:scale-95 transition-all shadow-[0_8px_0_0_black] flex flex-col items-center justify-center">
                        <span className="text-5xl mb-2">{s.emoji}</span>
                        <span className="font-black text-gray-800 text-xs uppercase tracking-widest">{s.label}</span>
                    </button>
                ))}
            </div>
        </SoundLayout>
    );
};

export default DjConsole;
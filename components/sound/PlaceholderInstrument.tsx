import React from 'react';
import SoundLayout from './SoundLayout';
import { Construction } from 'lucide-react';

const CONSTRUCTION_IMG = 'https://i.postimg.cc/13NBmSgd/vidu-image-3059119613071461-(1).png';

const PlaceholderInstrument: React.FC<{ onBack: () => void, title: string }> = ({ onBack, title }) => {
    return (
        <SoundLayout onBack={onBack} titleText={title}>
            <div className="bg-white p-8 md:p-12 rounded-[40px] border-8 border-boo-purple shadow-2xl flex flex-col items-center text-center max-w-lg animate-in zoom-in">
                <img src={CONSTRUCTION_IMG} alt="Lavori" className="w-48 h-48 mb-6 drop-shadow-xl" />
                <h3 className="text-3xl font-black text-gray-800 mb-2">Musica in Arrivo!</h3>
                <p className="text-lg font-bold text-gray-500 mb-6 leading-tight">Boo sta accordando lo strumento... torna tra poco per suonare!</p>
                <div className="flex items-center gap-2 bg-purple-100 text-purple-700 px-6 py-2 rounded-full font-black text-xs uppercase"><Construction size={18} /><span>In costruzione</span></div>
            </div>
        </SoundLayout>
    );
};

export default PlaceholderInstrument;
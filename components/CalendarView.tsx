import React, { useState, useMemo } from 'react';
import { AppView } from '../types';
import { ChevronLeft, ChevronRight, Star, X, BookOpen, Info } from 'lucide-react';
import { OFFICIAL_LOGO } from '../constants';
import { CALENDAR_INFO, monthNames } from '../services/calendarDatabase';

const CALENDAR_BG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/sfndclendariomagno.webp';
const BTN_CLOSE_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/btn-close.webp';

const DayDetailModal: React.FC<{ day: number, month: string, dateKey: string, onClose: () => void }> = ({ day, month, dateKey, onClose }) => {
    const info = CALENDAR_INFO[dateKey];

    return (
        <div className="fixed inset-0 z-[500] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in" onClick={onClose}>
            <div className="bg-white rounded-[3rem] border-8 border-blue-500 w-full max-w-lg overflow-hidden relative shadow-2xl animate-in zoom-in" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-full border-4 border-black hover:scale-110 z-50">
                    <X size={24} strokeWidth={4} />
                </button>
                
                <div className="bg-blue-500 p-6 md:p-8 border-b-4 border-blue-700 flex flex-col items-center">
                    <div className="bg-white text-blue-600 font-black text-3xl md:text-5xl w-20 h-20 md:w-24 md:h-24 rounded-2xl flex items-center justify-center shadow-lg border-4 border-blue-800 mb-2">
                        {day}
                    </div>
                    <h2 className="text-white font-luckiest text-2xl md:text-3xl uppercase tracking-widest">{month}</h2>
                </div>

                <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto no-scrollbar bg-slate-50">
                    {info?.event ? (
                        <div className="flex flex-col gap-4">
                            <div className="bg-orange-100 p-5 rounded-3xl border-4 border-orange-200 flex items-center gap-4 shadow-sm">
                                <div className="bg-orange-500 p-2 rounded-xl text-white">
                                    <Star size={24} fill="currentColor" />
                                </div>
                                <div>
                                    <h4 className="font-black text-orange-400 text-[10px] uppercase tracking-widest leading-none mb-1">Ricorrenza</h4>
                                    <p className="text-orange-900 font-black text-xl md:text-2xl uppercase leading-tight">{info.event}</p>
                                </div>
                            </div>
                            
                            {info.description && (
                                <div className="bg-white p-6 rounded-3xl border-2 border-slate-100 shadow-sm">
                                    <p className="text-slate-700 font-bold text-base md:text-lg leading-relaxed italic">
                                        "{info.description}"
                                    </p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                            <Info size={48} className="mb-4 opacity-20" />
                            <p className="italic font-medium text-lg text-center">In questa data non ci sono ricorrenze particolari...</p>
                        </div>
                    )}
                </div>
                
                <div className="bg-blue-50 p-4 border-t border-slate-100 text-center">
                    <p className="text-[10px] font-black text-blue-300 uppercase tracking-widest">Lone Boo World • Calendario Magico</p>
                </div>
            </div>
        </div>
    );
};

const CalendarView: React.FC<{ setView: (v: AppView) => void }> = ({ setView }) => {
    const [currentDate, setCurrentDate] = useState(new Date(2025, 0, 1));
    const [selectedDay, setSelectedDay] = useState<{ day: number, dateKey: string } | null>(null);

    const dayNames = ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"];

    const calendarGrid = useMemo(() => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const startingDay = firstDay === 0 ? 6 : firstDay - 1;
        const grid = [];
        for (let i = 0; i < startingDay; i++) grid.push(null);
        for (let i = 1; i <= daysInMonth; i++) {
            const dateKey = `${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
            grid.push({ day: i, dateKey, info: CALENDAR_INFO[dateKey] });
        }
        return grid;
    }, [currentDate]);

    return (
        <div className="fixed inset-0 z-100 bg-slate-900 flex flex-col overflow-hidden animate-in fade-in pt-[64px] md:pt-[96px]">
            <img src={CALENDAR_BG} alt="" className="absolute inset-0 w-full h-full object-cover opacity-60 z-0" />
            <div className="relative z-20 w-full p-4 flex justify-between items-center shrink-0">
                <button onClick={() => setView(AppView.NEWSSTAND)} className="hover:scale-110 active:scale-95 transition-all outline-none border-none bg-transparent">
                    <img src={BTN_CLOSE_IMG} alt="Back" className="w-12 h-12 md:w-20" />
                </button>
                <div className="flex items-center gap-4 bg-white/30 backdrop-blur-md px-6 py-2 rounded-full border-4 border-white/50 shadow-2xl">
                    <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))} disabled={currentDate.getMonth() === 0} className="text-white disabled:opacity-30"><ChevronLeft size={32} strokeWidth={4}/></button>
                    <h2 className="text-2xl md:text-5xl font-black text-yellow-400 uppercase tracking-widest text-center min-w-[150px]" style={{ fontFamily: 'Luckiest Guy' }}>{monthNames[currentDate.getMonth()]}</h2>
                    <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))} disabled={currentDate.getMonth() === 11} className="text-white disabled:opacity-30"><ChevronRight size={32} strokeWidth={4}/></button>
                </div>
                <div className="w-12 md:w-20"></div>
            </div>
            <div className="relative z-10 flex-1 overflow-y-auto no-scrollbar p-2 md:p-6 pb-20">
                <div className="max-w-5xl mx-auto bg-white/10 backdrop-blur-xl rounded-[3rem] border-8 border-white/20 shadow-2xl p-4 md:p-8">
                    <div className="grid grid-cols-7 gap-1 md:gap-4 mb-4">
                        {dayNames.map(d => <div key={d} className="text-center font-black text-[10px] md:text-sm text-yellow-400 uppercase tracking-widest">{d}</div>)}
                    </div>
                    <div className="grid grid-cols-7 gap-1.5 md:gap-4 h-full">
                        {calendarGrid.map((item, idx) => {
                            if (!item) return <div key={`empty-${idx}`} className="aspect-square"></div>;
                            const isToday = new Date().toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), item.day).toDateString();
                            const isHoliday = !!item.info?.event;
                            return (
                                <button key={item.dateKey} onClick={() => setSelectedDay({ day: item.day, dateKey: item.dateKey })} className={`aspect-square relative rounded-2xl border-4 flex flex-col items-center justify-center p-1 transition-all ${isToday ? 'bg-yellow-400 border-white scale-105 z-10 shadow-[0_0_20px_rgba(253,224,71,0.6)]' : 'bg-white/80 border-slate-200 hover:bg-white'} ${isHoliday ? 'border-orange-400' : ''} active:scale-95`}>
                                    <span className={`text-base md:text-4xl font-black ${isToday ? 'text-blue-900' : (isHoliday ? 'text-orange-600' : 'text-slate-800')}`}>{item.day}</span>
                                    {isHoliday && <div className="absolute top-1 right-1 w-2 h-2 md:w-3 md:h-3 bg-orange-500 rounded-full animate-pulse border border-white"></div>}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
            {selectedDay && <DayDetailModal day={selectedDay.day} month={monthNames[currentDate.getMonth()]} dateKey={selectedDay.dateKey} onClose={() => setSelectedDay(null)} />}
        </div>
    );
};

export default CalendarView;
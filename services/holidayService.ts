
export interface HolidayInfo {
    isHoliday: boolean;
    label: string;
    discount: number;
}

export const getHolidayInfo = (): HolidayInfo => {
    const now = new Date();
    const md = (now.getMonth() + 1) * 100 + now.getDate();
    
    // Logic from Header.tsx
    if (md >= 1229 || md <= 102) return { isHoliday: true, label: "Sconto Capodanno", discount: 0.3 };
    if (md >= 1201 && md <= 1228) return { isHoliday: true, label: "Sconto Natale", discount: 0.3 };
    if (md >= 1010 && md <= 1101) return { isHoliday: true, label: "Sconto Halloween", discount: 0.3 };
    if (md >= 207 && md <= 214) return { isHoliday: true, label: "Sconto San Valentino", discount: 0.3 };
    if (md >= 215 && md <= 228) return { isHoliday: true, label: "Sconto Carnevale", discount: 0.3 };
    if (md >= 320 && md <= 415) return { isHoliday: true, label: "Sconto Pasqua", discount: 0.3 };
    if (md >= 830 && md <= 915) return { isHoliday: true, label: "Sconto Back to School", discount: 0.3 };
    
    return { isHoliday: false, label: "", discount: 0 };
};

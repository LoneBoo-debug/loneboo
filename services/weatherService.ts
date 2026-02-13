
export type WeatherType = 'SUN' | 'WIND' | 'RAIN' | 'SNOW';

export interface WeatherDay {
    label: string;
    date: string;
    type: WeatherType;
    icon: string;
}

const MODAL_ICONS = {
    SUN: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/soleiconmeteo443.webp',
    WIND: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/vwentoiconmeteo66.webp',
    RAIN: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/pioggoiaiconmeteo33.webp',
    SNOW: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/nveiconmeteo55.webp'
};

/**
 * Controlla se l'orario fornito ricade nella fascia notturna (20:15 - 06:45)
 */
export const isNightTime = (date: Date): boolean => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const totalMinutes = hours * 60 + minutes;

    const nightStart = 20 * 60 + 15; // 1215 min
    const nightEnd = 6 * 60 + 45;   // 405 min

    // È notte se siamo oltre le 20:15 O prima delle 06:45
    return totalMinutes >= nightStart || totalMinutes < nightEnd;
};

/**
 * Calcola il meteo per una data specifica in modo deterministico e coerente.
 * Normalizza la data a mezzanotte per evitare sbalzi tra componenti.
 */
export const getWeatherForDate = (inputDate: Date): WeatherType => {
    // Normalizzazione: creiamo una data pulita (solo Y-M-D) per il calcolo del seed
    const d = new Date(inputDate.getFullYear(), inputDate.getMonth(), inputDate.getDate());
    const day = d.getDate();
    const month = d.getMonth(); // 0-11
    const year = d.getFullYear();
    
    // totalDays ci dà un numero progressivo di giorni dall'epoca
    const totalDays = Math.floor(d.getTime() / (1000 * 60 * 60 * 24));
    
    // Seed stabile per blocchi di 3 giorni (tendenze meteo naturali)
    const streakSeed = (Math.floor(totalDays / 3) * 17 + (year % 10)) % 100;
    // Variazione giornaliera per piccoli cambiamenti sporadici
    const dailyVariance = (day * 7 + month * 13) % 100;

    // 1. DICEMBRE (11) e PRIMA METÀ DI GENNAIO (0, 1-15) -> SEMPRE NEVE
    if (month === 11 || (month === 0 && day <= 15)) {
        return 'SNOW';
    }

    // 2. SECONDA METÀ DI GENNAIO (0, 16-31) -> 80% PIOGGIA, 20% SOLE
    if (month === 0 && day > 15) {
        if (streakSeed < 80) return 'RAIN';
        return 'SUN';
    }

    // 3. FEBBRAIO (1) -> VENTO, PIOGGIA E SOLE ALTERNATI A BLOCCHI
    if (month === 1) {
        if (streakSeed < 35) return 'WIND';
        if (streakSeed < 70) return 'RAIN';
        return 'SUN';
    }

    // 4. LUGLIO (6) E AGOSTO (7) -> QUASI SEMPRE SOLE, VENTO RARO
    if (month === 6 || month === 7) {
        if (dailyVariance < 92) return 'SUN';
        return 'WIND';
    }

    // 5. PRIMAVERA / AUTUNNO (Default)
    if (streakSeed < 60) return 'SUN';
    if (streakSeed < 85) return 'RAIN';
    return 'WIND';
};

export const getForecast = (startDate: Date): WeatherDay[] => {
    const labels = ["Oggi", "Domani", "Dopodomani"];
    const dayNames = ["Dom", "Lun", "Mar", "Mer", "Gio", "Ven", "Sab"];
    
    return labels.map((label, i) => {
        const d = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + i);
        const type = getWeatherForDate(d);
        return {
            label,
            date: `${dayNames[d.getDay()]} ${d.getDate()}`,
            type,
            icon: MODAL_ICONS[type]
        };
    });
};

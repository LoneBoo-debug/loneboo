
import { FAN_ART_CSV_URL, FAN_ART_GALLERY } from '../constants';
import { FanArt } from '../types';

/**
 * Parses a single line of CSV, handling potential quotes around values.
 * Designed for Author, Age, ImageUrl, City, Province format.
 */
const parseCSVLine = (line: string): string[] => {
    // Basic split by comma if no quotes used
    if (!line.includes('"')) {
        return line.split(',').map(s => s.trim());
    }

    // Handle quotes: split but respect text inside " "
    const result = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            result.push(current.trim());
            current = '';
        } else {
            current += char;
        }
    }
    result.push(current.trim());
    return result;
};

export const getFanArt = async (): Promise<FanArt[]> => {
    let dynamicArts: FanArt[] = [];

    // 1. Try to fetch from CSV
    if (FAN_ART_CSV_URL) {
        try {
            const response = await fetch(FAN_ART_CSV_URL);
            if (response.ok) {
                const text = await response.text();
                
                // Split by lines and remove header row
                const lines = text.split('\n');
                // Assume row 0 is header: Author, Age, Image, City, Province
                const dataRows = lines.slice(1);

                dynamicArts = dataRows
                    .map((line, index): FanArt | null => {
                        if (!line.trim()) return null;

                        const parts = parseCSVLine(line);
                        // Expect at least 3 columns (Author, Age, Image)
                        if (parts.length < 3) return null;

                        const author = parts[0];
                        let age = parts[1];
                        const image = parts[2];
                        
                        // New optional columns
                        const city = parts[3] || '';
                        const province = parts[4] || '';

                        // Basic validation
                        if (!image || !image.startsWith('http')) return null;

                        // Automatically append 'anni' if missing (e.g. user entered just "5")
                        if (age && !String(age).toLowerCase().includes('anni')) {
                            age = `${age} anni`;
                        }

                        return {
                            id: `csv-${index}`,
                            author,
                            age,
                            image,
                            city,
                            province
                        };
                    })
                    .filter((item): item is FanArt => item !== null);
                
                // Show newest first (assuming append to bottom of sheet)
                dynamicArts.reverse();
            }
        } catch (error) {
            console.warn("Could not load dynamic Fan Art (network error or CORS):", error);
            // proceed with empty dynamicArts array
        }
    }

    // 2. Logic to ensure at least 4 items
    // If we have fewer than 4 dynamic items, fill the rest with static items
    const MIN_ITEMS = 4;
    
    if (dynamicArts.length < MIN_ITEMS) {
        const slotsToFill = MIN_ITEMS - dynamicArts.length;
        // Get the needed amount of static items (or all if we need more than available)
        const fillerItems = FAN_ART_GALLERY.slice(0, slotsToFill);
        
        // Merge: Dynamic items first, then static fillers
        return [...dynamicArts, ...fillerItems];
    }

    return dynamicArts;
};

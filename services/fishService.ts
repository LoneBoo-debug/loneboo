
export interface FishData {
    image: string;
    name: string;
    description: string;
    isMuseum?: string; // Column D
    category?: string; // Column E
    era?: string; // Column F
}

export const fetchFishData = async (url: string): Promise<FishData[]> => {
    try {
        const response = await fetch(url);
        const csvText = await response.text();
        
        // More robust CSV parser to handle quotes and commas inside cells
        const parseCSV = (text: string) => {
            const result: string[][] = [];
            let row: string[] = [];
            let cell = '';
            let inQuotes = false;
            
            for (let i = 0; i < text.length; i++) {
                const char = text[i];
                const nextChar = text[i + 1];
                
                if (char === '"' && inQuotes && nextChar === '"') {
                    cell += '"';
                    i++;
                } else if (char === '"') {
                    inQuotes = !inQuotes;
                } else if (char === ',' && !inQuotes) {
                    row.push(cell.trim());
                    cell = '';
                } else if ((char === '\n' || char === '\r') && !inQuotes) {
                    if (cell !== '' || row.length > 0) {
                        row.push(cell.trim());
                        result.push(row);
                        cell = '';
                        row = [];
                    }
                    if (char === '\r' && nextChar === '\n') i++;
                } else {
                    cell += char;
                }
            }
            
            if (cell !== '' || row.length > 0) {
                row.push(cell.trim());
                result.push(row);
            }
            
            return result;
        };

        const rows = parseCSV(csvText);
        if (rows.length === 0) return [];

        // Skip header if it exists
        const startIdx = rows[0][0].toLowerCase().includes('http') ? 0 : 1;
        
        const data: FishData[] = rows.slice(startIdx).map(row => ({
            image: row[0] || '',
            name: row[1] || '',
            description: row[2] || '',
            isMuseum: row[3] || '',
            category: row[4] || '',
            era: row[5] || ''
        }));
        
        return data.filter(f => f.image);
    } catch (error) {
        console.error('Error fetching fish data:', error);
        return [];
    }
};


export interface OssaData {
    category: string;
    iconImage: string;
    iconName: string;
    fullImage: string;
    description: string;
}

export const fetchOssaData = async (url: string): Promise<OssaData[]> => {
    try {
        const response = await fetch(url);
        const csvText = await response.text();
        
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

        // Skip header if it exists (check if first cell is a URL or a known header)
        const startIdx = rows[0][0].toLowerCase().includes('http') ? 0 : 1;
        
        const data: OssaData[] = rows.slice(startIdx).map(row => ({
            category: row[0] || '',
            iconImage: row[1] || '',
            iconName: row[2] || '',
            fullImage: row[3] || '',
            description: row[4] || ''
        }));
        
        return data.filter(d => d.category && d.iconImage);
    } catch (error) {
        console.error('Error fetching ossa data:', error);
        return [];
    }
};

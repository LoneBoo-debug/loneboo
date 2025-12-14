
import { COMMUNITY_CSV_URL } from '../constants';
import { CommunityPost } from '../types';

/**
 * Parses a single line of CSV.
 * Designed for format: Date, Content, Image, Likes
 */
const parseCSVLine = (line: string): string[] => {
    if (!line.includes('"')) {
        return line.split(',').map(s => s.trim());
    }
    // Handle quotes basic implementation
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

export const getCommunityPosts = async (): Promise<CommunityPost[]> => {
    let posts: CommunityPost[] = [];

    if (COMMUNITY_CSV_URL) {
        try {
            const response = await fetch(COMMUNITY_CSV_URL);
            if (response.ok) {
                const text = await response.text();
                const lines = text.split('\n');
                // Assume Header: Date, Content, Image, Likes
                const dataRows = lines.slice(1);

                posts = dataRows.map((line, index) => {
                    if (!line.trim()) return null;
                    const parts = parseCSVLine(line);
                    
                    // Need at least Content and Date
                    if (parts.length < 2) return null;

                    const date = parts[0] || 'Oggi';
                    const content = parts[1] || '';
                    const image = parts[2] || '';
                    const likes = parseInt(parts[3]) || 0;

                    // Determine Type
                    const type = (image && image.startsWith('http')) ? 'IMAGE' : 'TEXT';

                    return {
                        id: `csv-post-${index}`,
                        type: type,
                        content,
                        image: type === 'IMAGE' ? image : undefined,
                        date,
                        likes
                    } as CommunityPost;
                }).filter((p): p is CommunityPost => p !== null);
                
                // Usually new posts are added at bottom of sheet, reverse to show newest first
                posts.reverse();
            }
        } catch (error) {
            console.warn("Could not load Community CSV:", error);
        }
    }

    return posts;
};

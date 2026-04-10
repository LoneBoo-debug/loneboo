import Papa from 'papaparse';

export interface UpcomingMovie {
    thumbnail: string;
    title: string;
    releaseDate: string;
    description: string;
    isTabellone: boolean;
    isVisible: boolean;
}

const SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQFaeF94KIAD5LyOSu5mjrNCR3g_FoEiAjMxm0D-jz1OFDL4_vIdj5oMlPgh8RGOc-qOk_L_WsSSgH5/pub?gid=0&single=true&output=csv';

export const fetchUpcomingMovies = async (): Promise<UpcomingMovie[]> => {
    try {
        const response = await fetch(SHEET_URL);
        const csvText = await response.text();
        
        return new Promise((resolve, reject) => {
            Papa.parse(csvText, {
                header: false,
                complete: (results) => {
                    const movies: UpcomingMovie[] = results.data
                        .slice(1) // Skip header
                        .map((row: any) => ({
                            thumbnail: row[0] || '',
                            title: row[1] || '',
                            releaseDate: row[2] || '',
                            description: row[3] || '',
                            isTabellone: row[4]?.trim().toUpperCase() === 'TABELLONE',
                            isVisible: row[5]?.trim().toUpperCase() === 'OK'
                        }))
                        .filter((m: UpcomingMovie) => m.thumbnail || m.title);
                    resolve(movies);
                },
                error: (error: any) => {
                    reject(error);
                }
            });
        });
    } catch (error) {
        console.error('Error fetching movies:', error);
        return [];
    }
};

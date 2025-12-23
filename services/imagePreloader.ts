/**
 * Image Preloader Service Potenziato
 * Carica le immagini nella cache del browser prima che vengano visualizzate.
 */

const PRELOADED_CACHE = new Set<string>();

export const preloadImages = (urls: (string | undefined)[], priority: 'HIGH' | 'LOW' = 'LOW') => {
    const uniqueUrls = urls.filter(url => url && !PRELOADED_CACHE.has(url)) as string[];

    if (uniqueUrls.length === 0) return;

    const runPreload = () => {
        // Se la priorità è alta, carichiamo tutto subito, altrimenti procediamo a piccoli lotti
        if (priority === 'HIGH') {
            uniqueUrls.forEach(url => {
                const img = new Image();
                img.src = url;
                PRELOADED_CACHE.add(url);
            });
        } else {
            // Caricamento a lotti per non intasare la banda
            const batchSize = 3;
            const processBatch = (startIndex: number) => {
                const batch = uniqueUrls.slice(startIndex, startIndex + batchSize);
                if (batch.length === 0) return;

                batch.forEach(url => {
                    const img = new Image();
                    img.src = url;
                    PRELOADED_CACHE.add(url);
                });

                setTimeout(() => processBatch(startIndex + batchSize), 500);
            };
            processBatch(0);
        }
    };

    if ('requestIdleCallback' in window) {
        window.requestIdleCallback(() => runPreload(), { timeout: priority === 'HIGH' ? 500 : 3000 });
    } else {
        setTimeout(runPreload, priority === 'HIGH' ? 100 : 2000);
    }
};

export const clearPreloadCache = () => {
    PRELOADED_CACHE.clear();
};
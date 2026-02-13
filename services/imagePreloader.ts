
/**
 * Image Preloader Service Potenziato V2
 */

const PRELOADED_CACHE = new Set<string>();

export const preloadImages = (urls: (string | undefined)[], priority: 'HIGH' | 'LOW' = 'LOW') => {
    const uniqueUrls = urls.filter(url => url && !PRELOADED_CACHE.has(url)) as string[];

    if (uniqueUrls.length === 0) return;

    const runPreload = () => {
        if (priority === 'HIGH') {
            uniqueUrls.forEach(url => {
                const img = new Image();
                img.src = url;
                PRELOADED_CACHE.add(url);
            });
        } else {
            const batchSize = 2;
            const processBatch = (startIndex: number) => {
                const batch = uniqueUrls.slice(startIndex, startIndex + batchSize);
                if (batch.length === 0) return;

                batch.forEach(url => {
                    const img = new Image();
                    img.src = url;
                    PRELOADED_CACHE.add(url);
                });

                if (startIndex + batchSize < uniqueUrls.length) {
                    setTimeout(() => processBatch(startIndex + batchSize), 1000);
                }
            };
            processBatch(0);
        }
    };

    if ('requestIdleCallback' in window) {
        (window as any).requestIdleCallback(() => runPreload(), { timeout: 2000 });
    } else {
        setTimeout(runPreload, priority === 'HIGH' ? 100 : 1000);
    }
};

/**
 * Precarica i componenti lazy-loaded
 */
export const preloadComponent = (factory: () => Promise<any>) => {
    const runPreload = () => {
        factory().catch(() => {});
    };
    if ('requestIdleCallback' in window) {
        (window as any).requestIdleCallback(runPreload);
    } else {
        setTimeout(runPreload, 2000);
    }
};

export const clearPreloadCache = () => {
    PRELOADED_CACHE.clear();
};

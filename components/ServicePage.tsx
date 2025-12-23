
import React, { useState, useEffect } from 'react';
import { AppView } from '../types';
import { ArrowLeft, Play, Check, Code, Copy, AlertTriangle, Loader2, XCircle, FileWarning, Search, FolderOpen, StopCircle, Folder, MapPin, Compass, Globe, ToggleLeft, ToggleRight, Eye, Zap } from 'lucide-react';
import { LOCAL_ASSET_MAP } from '../services/LocalAssets';

interface ServicePageProps {
    setView: (view: AppView) => void;
}

const ServicePage: React.FC<ServicePageProps> = ({ setView }) => {
    const [status, setStatus] = useState<string>("Pronto");
    const [progress, setProgress] = useState(0);
    const [log, setLog] = useState<string[]>([]);
    const [failedUrls, setFailedUrls] = useState<string[]>([]);
    const [generatedCode, setGeneratedCode] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const [activeTab, setActiveTab] = useState<'LOG' | 'DIAGNOSTICS' | 'CODE'>('DIAGNOSTICS');
    
    // Diagnostics State
    const [missingAssets, setMissingAssets] = useState<{path: string, resolvedUrl: string}[]>([]);
    const [foundAssets, setFoundAssets] = useState<{path: string, resolvedUrl: string, method: string}[]>([]);
    const [isChecking, setIsChecking] = useState(false);
    const [detectedPrefix, setDetectedPrefix] = useState<string>('');

    // Force Remote State
    const [useRemote, setUseRemote] = useState(false);
    
    // Debug Visual State
    const [showDebugBorders, setShowDebugBorders] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem('force_remote_assets');
        setUseRemote(stored === 'true');
        
        // Check if debug borders are active
        const isDebugActive = document.getElementById('debug-assets-style');
        setShowDebugBorders(!!isDebugActive);
    }, []);

    const toggleRemote = () => {
        const newVal = !useRemote;
        setUseRemote(newVal);
        localStorage.setItem('force_remote_assets', String(newVal));
        window.location.reload();
    };

    const toggleDebugBorders = () => {
        const styleId = 'debug-assets-style';
        const existingStyle = document.getElementById(styleId);

        if (existingStyle) {
            existingStyle.remove();
            setShowDebugBorders(false);
        } else {
            const style = document.createElement('style');
            style.id = styleId;
            style.innerHTML = `
                /* IMMAGINI LOCALI (Percorso relativo o assets/) -> VERDE */
                img[src^="assets/"], img[src^="/assets/"], img[src^="./assets/"] {
                    border: 4px solid #00ff00 !important;
                    box-sizing: border-box;
                    filter: drop-shadow(0 0 5px #00ff00);
                }
                /* IMMAGINI REMOTE (http...) -> ROSSO */
                img[src^="http"] {
                    border: 4px solid #ff0000 !important;
                    box-sizing: border-box;
                    filter: drop-shadow(0 0 5px #ff0000);
                }
                /* Legenda fissa */
                #debug-legend {
                    position: fixed;
                    bottom: 20px;
                    left: 50%;
                    transform: translateX(-50%);
                    background: rgba(0,0,0,0.9);
                    color: white;
                    padding: 10px 20px;
                    border-radius: 20px;
                    z-index: 9999;
                    font-weight: bold;
                    border: 2px solid white;
                    display: flex;
                    gap: 15px;
                    font-size: 12px;
                    pointer-events: none;
                }
            `;
            document.head.appendChild(style);
            
            // Add legend element
            const legend = document.createElement('div');
            legend.id = 'debug-legend';
            legend.innerHTML = `
                <span style="color:#00ff00">🟢 LOCALE (OK)</span>
                <span style="color:#ff0000">🔴 ONLINE (FALLBACK)</span>
            `;
            document.body.appendChild(legend);
            
            setShowDebugBorders(true);
        }
    };

    // Clean up legend on unmount
    useEffect(() => {
        return () => {
            const legend = document.getElementById('debug-legend');
            if (legend && !showDebugBorders) legend.remove(); 
        };
    }, [showDebugBorders]);


    const addLog = (msg: string) => setLog(prev => [...prev, msg]);

    // --- SMART PROBE LOGIC ---
    const findCorrectPrefix = async (): Promise<string | null> => {
        const testFile = "assets/images/ui/logo-main.webp";
        const prefixesToCheck = ["", "/", "assets/", "public/", "loneboo-assets-v3/", "loneboo-assets-v2/", "dist/", "src/", "public/assets/"];
        setStatus("Ricerca cartella corretta...");
        
        for (const prefix of prefixesToCheck) {
            const urlToCheck = `${prefix}${testFile}`;
            try {
                const result = await new Promise<boolean>((resolve) => {
                    const img = new Image();
                    img.onload = () => resolve(true);
                    img.onerror = () => resolve(false);
                    img.src = `${urlToCheck}?t=${Date.now()}`;
                });
                if (result) {
                    addLog(`✅ Cartella trovata: "${prefix}"`);
                    return prefix;
                }
            } catch (e) {}
        }
        addLog("❌ Impossibile trovare la cartella assets.");
        return null;
    };

    const runDiagnostics = async () => {
        if (isChecking) return;
        setIsChecking(true);
        setMissingAssets([]);
        setFoundAssets([]);
        setProgress(0);
        setDetectedPrefix('');

        const prefix = await findCorrectPrefix();
        if (prefix === null) {
            setStatus("Assets non trovati. Verifica di aver estratto lo ZIP in 'public'.");
            setIsChecking(false);
        } else {
            setDetectedPrefix(prefix);
            setStatus(`Cartella rilevata: ${prefix || './'} - Avvio scansione...`);
        }

        await new Promise(r => setTimeout(r, 100));
        const mapEntries = Object.entries(LOCAL_ASSET_MAP);
        const total = mapEntries.length;
        let checkedCount = 0;
        let newMappingCode = "";

        try {
            const BATCH_SIZE = 10;
            for (let i = 0; i < total; i += BATCH_SIZE) {
                if (!document.body.contains(document.getElementById('root'))) break; 
                const batch = mapEntries.slice(i, i + BATCH_SIZE);
                const results = await Promise.all(batch.map(async ([url, path]) => {
                    const pathToCheck = prefix !== null ? `${prefix}${path}` : path;
                    const result = await new Promise<boolean>((resolve) => {
                        const img = new Image();
                        img.onload = () => resolve(true);
                        img.onerror = () => resolve(false);
                        img.src = `${pathToCheck}?t=${Date.now()}_${Math.random()}`;
                    });
                    return { url, originalPath: path, finalPath: pathToCheck, status: result ? 'OK' : 'MISSING' };
                }));

                results.forEach(res => {
                    if (res.status === 'OK') {
                        setFoundAssets(prev => [...prev, { path: res.originalPath, resolvedUrl: res.finalPath, method: prefix || 'Default' }]);
                        newMappingCode += `  "${res.url}": "${res.finalPath}",\n`;
                    } else {
                        setMissingAssets(prev => [...prev, { path: res.originalPath, resolvedUrl: 'File non trovato' }]);
                        newMappingCode += `  "${res.url}": "${res.originalPath}",\n`;
                    }
                });
                checkedCount += batch.length;
                setProgress(Math.round((checkedCount / total) * 100));
                await new Promise(r => setTimeout(r, 5));
            }

            const finalCode = `// Mappa corretta e verificata il ${new Date().toLocaleDateString()}
// Prefisso rilevato: "${prefix || ''}"
export const LOCAL_ASSET_MAP: Record<string, string> = {
${newMappingCode}
};

export const getAsset = (url: string) => {
  try {
      const forceRemote = localStorage.getItem('force_remote_assets') === 'true';
      if (forceRemote) return url;
  } catch (e) {}

  if (!LOCAL_ASSET_MAP) return url;
  return LOCAL_ASSET_MAP[url] || url;
};
`;
            setGeneratedCode(finalCode);
        } catch (e: any) {
            console.error("Diagnostic crash:", e);
            setStatus(`Errore critico: ${e.message}`);
        }
        setIsChecking(false);
    };

    const stopDiagnostics = () => { setIsChecking(false); setStatus("Diagnostica interrotta."); };

    // --- MIGRATION TOOL ---
    const downloadImage = async (url: string): Promise<{ blob: Blob, ext: string } | null> => {
        try {
            const response = await fetch(url, { mode: 'cors', credentials: 'omit' });
            if (!response.ok) throw new Error(`Fetch failed: ${response.status}`);
            const blob = await response.blob();
            let ext = url.split('.').pop()?.toLowerCase().split('?')[0] || 'jpg';
            if (blob.type === 'image/png') ext = 'png';
            if (blob.type === 'image/jpeg') ext = 'jpg';
            if (blob.type === 'image/webp') ext = 'webp';
            return { blob, ext };
        } catch (e) {
            addLog(`❌ Errore download: ${url.slice(0, 30)}...`);
            setFailedUrls(prev => [...prev, url]);
            return null;
        }
    };

    const convertToWebP = async (blob: Blob): Promise<Blob | null> => {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                if (!ctx) { resolve(null); return; }
                ctx.drawImage(img, 0, 0);
                canvas.toBlob((webpBlob) => { resolve(webpBlob); }, 'image/webp', 0.8);
            };
            img.onerror = () => resolve(null);
            img.src = URL.createObjectURL(blob);
        });
    };

    const startMigration = async () => {
        setIsProcessing(true);
        setLog([]);
        setFailedUrls([]);
        setGeneratedCode("");
        setStatus("Inizio download massivo...");
        setActiveTab('LOG');
        
        try {
            const JSZipModule = await import('jszip');
            const JSZip = JSZipModule.default;
            const FileSaverModule = await import('file-saver');
            const saveAs = FileSaverModule.saveAs || FileSaverModule.default;

            const zip = new JSZip();
            const mapEntries = Object.entries(LOCAL_ASSET_MAP);
            const total = mapEntries.length;
            
            let processed = 0;
            const mappingCodeLines: string[] = [];

            for (const [url, targetPath] of mapEntries) {
                const targetName = targetPath.split('/').pop()?.split('.')[0] || 'unknown';
                if (!url.startsWith('http')) {
                    mappingCodeLines.push(`  "${url}": "${targetPath}",`);
                    continue;
                }
                const result = await downloadImage(url);
                if (result) {
                    let finalBlob = result.blob;
                    let finalExt = result.ext;
                    if (finalExt !== 'svg' && finalExt !== 'webp') {
                        const webpBlob = await convertToWebP(result.blob);
                        if (webpBlob) { finalBlob = webpBlob; finalExt = 'webp'; }
                    }
                    const cleanPath = targetPath.replace(/^(public\/|assets\/images\/)/, '');
                    const zipPath = `assets/images/${cleanPath.replace(/\.[^/.]+$/, "")}.${finalExt}`;
                    zip.file(zipPath, finalBlob);
                    const newLocalPath = `${zipPath}`;
                    mappingCodeLines.push(`  "${url}": "${newLocalPath}",`);
                    addLog(`✅ OK: ${targetName}.${finalExt}`);
                }
                processed++;
                setProgress(Math.round((processed / total) * 100));
            }

            setStatus("Creazione archivio ZIP...");
            const zipBlob = await zip.generateAsync({ type: 'blob' });
            saveAs(zipBlob, 'loneboo-assets-v4.zip'); 

            const code = `// Mappa generata automaticamente il ${new Date().toLocaleDateString()}
export const LOCAL_ASSET_MAP: Record<string, string> = {
${mappingCodeLines.join('\n')}
};

export const getAsset = (url: string) => {
  try {
      const forceRemote = localStorage.getItem('force_remote_assets') === 'true';
      if (forceRemote) return url;
  } catch (e) {}

  if (!LOCAL_ASSET_MAP) return url;
  return LOCAL_ASSET_MAP[url] || url;
};
`;
            setGeneratedCode(code);
            setStatus("Completato! ZIP scaricato.");
            setActiveTab('CODE');

        } catch (e: any) {
            addLog(`❌ ERRORE: ${e.message}`);
            setStatus("Errore!");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <button onClick={() => setView(AppView.HOME)} className="bg-gray-700 p-2 rounded-full hover:bg-gray-600">
                        <ArrowLeft />
                    </button>
                    <h1 className="text-3xl font-black text-yellow-400">Strumenti di Servizio</h1>
                </div>

                {/* --- CONTROLS ROW --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    
                    {/* REMOTE SWITCH */}
                    <div className="bg-red-900/30 p-4 rounded-xl border border-red-500/50 flex flex-col justify-between gap-2">
                        <div className="flex justify-between items-center">
                            <h3 className="font-bold text-red-300 flex items-center gap-2"><Globe size={20} /> USA INTERNET</h3>
                            <button 
                                onClick={toggleRemote}
                                className={`flex items-center gap-2 px-4 py-2 rounded-full font-black text-xs uppercase transition-all shadow-lg ${useRemote ? 'bg-green-500 text-white' : 'bg-gray-700 text-gray-400'}`}
                            >
                                {useRemote ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
                                {useRemote ? "ON" : "OFF"}
                            </button>
                        </div>
                        <p className="text-[10px] text-gray-400">Ignora i file locali e scarica tutto dal web (consuma dati).</p>
                    </div>

                    {/* DEBUG VISUAL SWITCH (NEW) */}
                    <div className="bg-blue-900/30 p-4 rounded-xl border border-blue-500/50 flex flex-col justify-between gap-2">
                        <div className="flex justify-between items-center">
                            <h3 className="font-bold text-blue-300 flex items-center gap-2"><Eye size={20} /> DEBUG RAGGI-X</h3>
                            <button 
                                onClick={toggleDebugBorders}
                                className={`flex items-center gap-2 px-4 py-2 rounded-full font-black text-xs uppercase transition-all shadow-lg ${showDebugBorders ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-400'}`}
                            >
                                {showDebugBorders ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
                                {showDebugBorders ? "ON" : "OFF"}
                            </button>
                        </div>
                        <p className="text-[10px] text-gray-400">
                            <strong>Verde:</strong> File Locale (OK per Produzione). <br/>
                            <strong>Rosso:</strong> File Online (Manca file locale).
                        </p>
                    </div>
                </div>

                {/* --- TABS --- */}
                <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                    <button 
                        onClick={() => setActiveTab('DIAGNOSTICS')}
                        className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-colors ${activeTab === 'DIAGNOSTICS' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
                    >
                        <Search size={20} /> DIAGNOSTICA
                    </button>
                    <button 
                        onClick={() => setActiveTab('LOG')}
                        className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-colors ${activeTab === 'LOG' ? 'bg-green-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
                    >
                        <FolderOpen size={20} /> MIGRATORE
                    </button>
                    {generatedCode && (
                        <button 
                            onClick={() => setActiveTab('CODE')}
                            className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-colors ${activeTab === 'CODE' ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
                        >
                            <Code size={20} /> CODICE
                        </button>
                    )}
                </div>

                {/* --- CONTENT AREA --- */}
                <div className="bg-gray-800 rounded-3xl border border-gray-700 overflow-hidden min-h-[600px] flex flex-col">
                    
                    {/* 1. DIAGNOSTICA TAB */}
                    {activeTab === 'DIAGNOSTICS' && (
                        <div className="p-6 flex flex-col h-full">
                            <div className="bg-blue-900/30 p-4 rounded-xl border border-blue-500/30 mb-6">
                                <h3 className="text-xl font-bold text-blue-300 mb-2 flex items-center gap-2">
                                    <Compass /> Ricerca Intelligente
                                </h3>
                                <p className="text-sm text-gray-300 mb-2">
                                    Cerca dove sono finiti i file (<code>public/</code>, <code>assets/</code>...).
                                </p>
                            </div>

                            <div className="flex justify-between items-center mb-4">
                                <div className="text-sm font-mono text-gray-400">
                                    Trovati: <span className="text-green-400">{foundAssets.length}</span> | 
                                    Mancanti: <span className="text-red-400">{missingAssets.length}</span>
                                </div>
                                <div className="flex gap-2">
                                    {isChecking ? (
                                        <button onClick={stopDiagnostics} className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2">
                                            <StopCircle size={16} /> STOP
                                        </button>
                                    ) : (
                                        <button onClick={runDiagnostics} className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2">
                                            <Play size={16} /> AVVIA
                                        </button>
                                    )}
                                </div>
                            </div>

                            {detectedPrefix && (
                                <div className="mb-4 px-4 py-2 bg-green-900/30 border border-green-500 rounded text-green-300 font-mono text-sm">
                                    ✅ Cartella rilevata: <strong>{detectedPrefix}</strong>
                                </div>
                            )}

                            {isChecking && (
                                <div className="w-full bg-gray-700 h-4 rounded-full mb-4 overflow-hidden relative">
                                    <div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${progress}%` }}></div>
                                </div>
                            )}

                            <div className="flex-1 bg-black rounded-xl border border-gray-700 overflow-hidden flex flex-col h-[400px]">
                                <div className="flex-1 overflow-y-auto p-2 space-y-1 font-mono text-xs">
                                    {missingAssets.map((item, i) => (
                                        <div key={`miss-${i}`} className="flex flex-col md:flex-row md:items-center p-2 rounded bg-red-900/20 border border-red-900/50 text-red-400 gap-1 md:gap-0">
                                            <div className="w-24 flex items-center gap-2 font-bold shrink-0"><XCircle size={14} /> MANCANTE</div>
                                            <div className="flex-1 break-all px-1 text-gray-300">{item.path}</div>
                                        </div>
                                    ))}
                                    {foundAssets.map((item, i) => (
                                        <div key={`ok-${i}`} className="flex flex-col md:flex-row md:items-center p-2 rounded hover:bg-gray-800/50 text-green-600 gap-1 md:gap-0">
                                            <div className="w-24 flex items-center gap-2 shrink-0"><Check size={14} /> OK</div>
                                            <div className="flex-1 text-green-400 break-all px-1">{item.resolvedUrl}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            
                            {!isChecking && foundAssets.length > 0 && missingAssets.length === 0 && (
                                <div className="mt-4 p-4 bg-green-900/20 border border-green-500/50 rounded-xl flex items-center justify-between animate-pulse">
                                    <p className="font-bold text-green-400 mb-1">✅ SUCCESS! File trovati.</p>
                                    <button onClick={() => setActiveTab('CODE')} className="bg-purple-600 px-4 py-2 rounded-lg font-bold text-sm hover:bg-purple-500 shadow-lg">VEDI CODICE</button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* 2. MIGRATORE TAB */}
                    {activeTab === 'LOG' && (
                        <div className="p-6 flex flex-col h-full">
                            <div className="bg-green-900/30 p-4 rounded-xl border border-green-500/30 mb-6">
                                <h3 className="text-xl font-bold text-green-300 mb-2 flex items-center gap-2">
                                    <FolderOpen /> Strumento Migrazione V4
                                </h3>
                                <p className="text-sm text-gray-300">
                                    Scarica lo ZIP con la struttura perfetta.
                                </p>
                            </div>

                            <button 
                                onClick={startMigration}
                                disabled={isProcessing}
                                className="bg-green-600 hover:bg-green-500 text-white w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 disabled:opacity-50 mb-4"
                            >
                                {isProcessing ? <Loader2 className="animate-spin" /> : <Play />}
                                AVVIA DOWNLOAD (V4)
                            </button>

                            {isProcessing && <div className="mb-2 text-center text-sm font-mono text-gray-400">{status} ({progress}%)</div>}

                            <div className="flex-1 bg-black p-4 rounded-xl overflow-y-auto font-mono text-xs text-gray-400 border border-gray-700">
                                {log.map((l, i) => <div key={i} className="mb-1 border-b border-gray-800 pb-1">{l}</div>)}
                            </div>
                        </div>
                    )}

                    {/* 3. CODE TAB */}
                    {activeTab === 'CODE' && (
                        <div className="flex-1 flex flex-col h-full bg-gray-900">
                            <div className="p-4 bg-gray-800 text-gray-400 text-xs border-b border-gray-700">
                                <p className="font-bold text-green-400 mb-1">CODICE CORRETTO:</p>
                                Copia in <code>services/LocalAssets.ts</code>.
                            </div>
                            <textarea 
                                className="flex-1 bg-black p-4 text-blue-300 font-mono text-xs resize-none focus:outline-none"
                                readOnly
                                value={generatedCode}
                            />
                            <div className="p-4 border-t border-gray-700 bg-gray-800 flex justify-end">
                                <button 
                                    onClick={() => navigator.clipboard.writeText(generatedCode)}
                                    className="bg-purple-600 hover:bg-purple-500 text-white py-2 px-6 rounded font-bold text-sm flex items-center gap-2 shadow-lg hover:scale-105 transition-transform"
                                >
                                    <Copy size={16} /> COPIA TUTTO
                                </button>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default ServicePage;

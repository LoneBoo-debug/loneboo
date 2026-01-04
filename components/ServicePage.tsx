import React, { useState } from 'react';
import { AppView } from '../types';
import { ArrowLeft, Play, Copy, Loader2, Database, ShieldCheck, Zap, Music, Ghost, Pizza, Camera, Map as MapIcon } from 'lucide-react';

// --- IMPORT TUTTI I DATABASE ---
import * as CONST from '../constants';
import { BOOKS_DATABASE } from '../services/booksDatabase';
import { COLORING_DATABASE } from '../services/coloringDatabase';
import { CHARACTERS } from '../services/databaseAmici';
import { STORY_DICE_DATABASE } from '../services/dbdadi';
import { INTRUSO_DATABASE } from '../services/dbIntruso';
import { HAT_INPUT_ITEMS, HAT_RECIPES } from '../services/dbMagicHat';
import { RECYCLE_DATABASE } from '../services/dbRecycle';
import { STICKERS_COLLECTION, STICKERS_COLLECTION_VOL2 } from '../services/stickersDatabase';
import { FAIRY_TALES } from '../services/talesDatabase';
import { GW_DATABASE } from '../services/dbCardChi';

interface ServicePageProps {
    setView: (view: AppView) => void;
}

const ServicePage: React.FC<ServicePageProps> = ({ setView }) => {
    const [status, setStatus] = useState<string>("Pronto per Giga-Scan V14");
    const [progress, setProgress] = useState(0);
    const [log, setLog] = useState<string[]>([]);
    const [generatedCode, setGeneratedCode] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const [activeTab, setActiveTab] = useState<'LOG' | 'CODE'>('LOG');

    const addLog = (msg: string) => setLog(prev => [msg, ...prev].slice(0, 1000));

    const triggerDownload = (blob: Blob, filename: string) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    };

    const collectAllAssets = () => {
        const assets = new Map<string, string>();

        const add = (url: string, path: string) => {
            if (url && (url.startsWith('http') || url.startsWith('https'))) {
                const cleanUrl = url.trim().replace(/ /g, '%20');
                if (cleanUrl.includes('placeholder.com') || cleanUrl.includes('via.placeholder')) return;
                if (!assets.has(cleanUrl)) assets.set(cleanUrl, path);
            }
        };

        // --- 1. CORE MAPS & HOME (SFONDI MACRO) ---
        add(CONST.CITY_MAP_IMAGE, 'assets/images/bg/city-map-desktop.webp');
        add(CONST.CITY_MAP_IMAGE_MOBILE, 'assets/images/bg/city-map-mobile.webp');
        add(CONST.HOME_BG_MOBILE, 'assets/images/bg/home-mobile.webp');
        add(CONST.HOME_BG_DESKTOP, 'assets/images/bg/home-desktop.webp');
        add('https://i.postimg.cc/28kfHpKB/piazzaxxx.jpg', 'assets/images/bg/piazza-mobile.webp');
        add('https://i.postimg.cc/8Psrn96x/piazza169.jpg', 'assets/images/bg/piazza-desktop.webp');
        add('https://i.postimg.cc/rmp2mHP4/museuuum.jpg', 'assets/images/bg/museum-mobile.webp');
        add('https://i.postimg.cc/rFhND518/museo169.jpg', 'assets/images/bg/museum-desktop.webp');
        add('https://i.postimg.cc/ydzqLxbs/faccad.jpg', 'assets/images/bg/academy-mobile.webp');
        add('https://i.postimg.cc/fLFPzmRh/percoooox.jpg', 'assets/images/bg/park-mobile.webp');
        add('https://i.postimg.cc/85n0dxWj/parco169.jpg', 'assets/images/bg/park-desktop.webp');
        add('https://i.postimg.cc/gJqK5hLQ/boscod.jpg', 'assets/images/bg/tales-mobile.webp');
        add('https://i.postimg.cc/kXHYkNRR/fiabe169.jpg', 'assets/images/bg/tales-desktop.webp');
        add('https://i.postimg.cc/qvqZTBxY/sfobiblo.jpg', 'assets/images/bg/library.webp');
        add('https://i.postimg.cc/Cxsx1Jsm/edicolejdh.jpg', 'assets/images/bg/newsstand.webp');
        add('https://i.postimg.cc/hjXYYZP2/f40f6e20-ff24-4e62-b204-bb61dd9b04e9.jpg', 'assets/images/bg/station-mobile.webp');
        add('https://i.postimg.cc/fbvLbfdd/stazione-169.jpg', 'assets/images/bg/station-desktop.webp');

        // --- 2. STANZE DELLA CASA (SFONDI) ---
        add('https://i.postimg.cc/9F308yt9/houseplanss-(1).png', 'assets/images/bg/rooms/house-map-mobile.webp');
        add('https://i.postimg.cc/7YLR63CN/hpuse169.jpg', 'assets/images/bg/rooms/house-map-desktop.webp');
        add('https://i.postimg.cc/bNw01THX/cucina1692-(1).jpg', 'assets/images/bg/rooms/kitchen-mobile.webp');
        add('https://i.postimg.cc/tTtyjxgs/cuxdfr.jpg', 'assets/images/bg/rooms/kitchen-desktop.webp');
        add('https://i.postimg.cc/J41wZGh9/salotto1689.jpg', 'assets/images/bg/rooms/living-mobile.webp');
        add('https://i.postimg.cc/59BWYLb2/salotttreer.jpg', 'assets/images/bg/rooms/living-desktop.webp');
        add('https://i.postimg.cc/sxwjLq6j/stanzalettoh44.jpg', 'assets/images/bg/rooms/bedroom-mobile.webp');
        add('https://i.postimg.cc/6pVR2HTG/stanzadaletto.jpg', 'assets/images/bg/rooms/bedroom-desktop.webp');
        add('https://i.postimg.cc/448VtJVN/bagnitt.jpg', 'assets/images/bg/rooms/bathroom-mobile.webp');
        add('https://i.postimg.cc/cCGKGMks/bgno169.jpg', 'assets/images/bg/rooms/bathroom-desktop.webp');
        add('https://i.postimg.cc/sX3m3PK4/giardinogarden.jpg', 'assets/images/bg/rooms/garden.webp');

        // --- 3. NAVIGAZIONE CASA (BOTTONI STANZE) ---
        add('https://i.postimg.cc/Mp8f1HCL/salottosix.png', 'assets/images/ui/nav/nav-living-left.webp');
        add('https://i.postimg.cc/nVykrv1Y/camera-dx.png', 'assets/images/ui/nav/nav-bedroom-right.webp');
        add('https://i.postimg.cc/L5LjLbVf/cucinasx.png', 'assets/images/ui/nav/nav-kitchen-left.webp');
        add('https://i.postimg.cc/pdsCL40Z/bagnodx.png', 'assets/images/ui/nav/nav-bathroom-right.webp');
        add('https://i.postimg.cc/LsWP7pQd/gardensx.png', 'assets/images/ui/nav/nav-garden-left.webp');
        add('https://i.postimg.cc/KY1ktWGK/salottodx.png', 'assets/images/ui/nav/nav-living-right.webp');
        add('https://i.postimg.cc/y8PXL2zs/cucina-dx.png', 'assets/images/ui/nav/nav-kitchen-right.webp');
        add('https://i.postimg.cc/BQCK3D7t/rientragiu.png', 'assets/images/ui/nav/nav-back-home.webp');

        // --- 4. SEZIONE DISCO (SFONDI + TITOLI) ---
        add('https://i.postimg.cc/9M86Fxpz/disco3.png', 'assets/images/bg/disco-mobile.webp');
        add('https://i.postimg.cc/136sRMS0/disco169.jpg', 'assets/images/bg/disco-desktop.webp');
        add('https://i.postimg.cc/TYPd5zZL/sfondopiano.png', 'assets/images/bg/piano-bg.webp');
        add('https://i.postimg.cc/tJZ6XsdD/sfobatt.png', 'assets/images/bg/drums-bg.webp');
        add('https://i.postimg.cc/zv2N8kSc/dsedses.jpg', 'assets/images/bg/dj-bg.webp');
        add('https://i.postimg.cc/P5XJ9qyR/sfondorch.jpg', 'assets/images/bg/orchestra-bg.webp');
        add('https://i.postimg.cc/Ss67VsDQ/pianomag.png', 'assets/images/ui/titles/piano-title.webp');
        add('https://i.postimg.cc/BQCFJfHV/batters.png', 'assets/images/ui/titles/drums-title.webp');
        add('https://i.postimg.cc/yxjd99hX/djhgt-(1).png', 'assets/images/ui/titles/dj-title.webp');
        add('https://i.postimg.cc/8cgM6SSX/Intorche-(1).png', 'assets/images/ui/titles/orchestra-title.webp');
        add('https://i.postimg.cc/wx5Gh3hY/batteriafx-(1).png', 'assets/images/ui/instruments/drum-kit.webp');
        add('https://i.postimg.cc/3w6ZtPXz/tornadsco-(1)-(1).png', 'assets/images/ui/buttons/btn-back-disco.webp');

        // --- 5. CACCIA ALLA FRUTTA (COMPLETO) ---
        add('https://i.postimg.cc/63vv9WmD/sfondfrut-(1).jpg', 'assets/images/bg/games/fruit-bg.webp');
        add('https://i.postimg.cc/65NPhQsS/spaoiu-(1).png', 'assets/images/characters/boo-shooter.webp');
        add('https://i.postimg.cc/DfQFBfmT/cacciafrutta-(1)-(1)-(1).png', 'assets/images/ui/titles/fruit-title.webp');
        add('https://i.postimg.cc/J0NhGGmX/hggf-(1).png', 'assets/images/ui/buttons/fruit-start.webp');
        add('https://i.postimg.cc/CKm96sNy/nexeree-(1).png', 'assets/images/ui/buttons/fruit-next.webp');
        add('https://i.postimg.cc/DwqT5GHw/riprofe-(1).png', 'assets/images/ui/buttons/fruit-retry.webp');
        add('https://i.postimg.cc/7P3tn0Hz/fienid-(1)-(1).png', 'assets/images/ui/buttons/fruit-go-barn.webp');
        add('https://i.postimg.cc/VNBQrTHT/fienilea-(1).png', 'assets/images/ui/headers/barn-header.webp');
        add('https://i.postimg.cc/W33pwTrd/vendi-tutto-(1)-(1).png', 'assets/images/ui/buttons/btn-sell-all.webp');
        add('https://i.postimg.cc/GtmMpgZG/velocitr-(1)-(1).png', 'assets/images/ui/icons/up-speed.webp');
        add('https://i.postimg.cc/5yrm2452/superfer-(1)-(1).png', 'assets/images/ui/icons/up-power.webp');
        add('https://i.postimg.cc/rp2Q4wBr/calamita-(1)-(1).png', 'assets/images/ui/icons/up-magnet.webp');
        add('https://i.postimg.cc/hGn1j3mw/sudied-(1)-(1).png', 'assets/images/ui/icons/up-shield.webp');
        add('https://i.postimg.cc/CKDvTHY3/gameover-(1).png', 'assets/images/ui/feedback/fruit-lost.webp');
        add('https://i.postimg.cc/vHkLYgPY/livellocompleted-(1).png', 'assets/images/ui/feedback/fruit-win.webp');

        // --- 6. BAULE DEI SEGRETI (COMPLETO) ---
        add('https://i.postimg.cc/kXB7MZWz/bauden.jpg', 'assets/images/bg/rooms/trunk-mobile.webp');
        add('https://i.postimg.cc/h4mHCBbq/bayyert.jpg', 'assets/images/bg/rooms/trunk-desktop.webp');
        add('https://i.postimg.cc/7YRV2Cd1/referf-(1).jpg', 'assets/images/bg/games/scratch-bg.webp');
        add('https://i.postimg.cc/NfHM644y/fiond.jpg', 'assets/images/bg/games/slingshot-mobile.webp');
        add('https://i.postimg.cc/vT94ZL27/dfsfdsds.jpg', 'assets/images/bg/games/slingshot-desktop.webp');
        add('https://i.postimg.cc/J7ybdtCv/sdsad.jpg', 'assets/images/bg/games/goose-bg.webp');
        add('https://i.postimg.cc/cC0DFrNT/nuododeo-(1)-(1).png', 'assets/images/ui/buttons/scratch-new.webp');
        add('https://i.postimg.cc/FsFWcdpV/regolejd-(1)-(1).png', 'assets/images/ui/buttons/scratch-rules.webp');
        add('https://i.postimg.cc/T27xKDvK/baratt-(1)-(1)-(1).png', 'assets/images/ui/games/slingshot-can.webp');
        add('https://i.postimg.cc/3xJYNFdv/sass-(1).png', 'assets/images/ui/games/slingshot-stone.webp');
        add('https://i.postimg.cc/mkRJzmXw/yesno-(1)-(1).png', 'assets/images/ui/feedback/parents-lock.webp');

        // --- 7. INFO POINT & MARAGNO ---
        add('https://i.postimg.cc/VLZVtZjv/dfdfd-(1).png', 'assets/images/bg/rooms/info-point.webp');
        add('https://i.postimg.cc/vBbWm9HC/ffadsfa-(1).png', 'assets/images/characters/maragno/full.webp');
        add('https://i.postimg.cc/bJVHFrqs/ffersids-(1)-(1).png', 'assets/images/characters/maragno/offended.webp');
        add('https://i.postimg.cc/s2GG3t03/dssdf-(1)-(1).png', 'assets/images/ui/vehicles/marlo-taxi.webp');
        add('https://i.postimg.cc/vHmPQR49/SDFFSDFSD-(1)-(1)-(1)-(1).png', 'assets/images/ui/buttons/btn-back-city.webp');
        add('https://i.postimg.cc/3RBBT97c/FGFDFDS-(1)-(1)-(1).png', 'assets/images/ui/buttons/btn-chat-maragno.webp');

        // --- 8. TORRE MAGICA & AI ---
        add('https://i.postimg.cc/KY2JJg7L/torremagicddsjpeg.jpg', 'assets/images/bg/tower-mobile.webp');
        add('https://i.postimg.cc/yxmrqxt3/magia169.jpg', 'assets/images/bg/tower-desktop.webp');
        add('https://i.postimg.cc/y6fm1Drs/passfanta-(1).png', 'assets/images/ui/titles/passport-title.webp');
        add('https://i.postimg.cc/L6T1RpzJ/fotopass.jpg', 'assets/images/characters/passport-boo.webp');
        add('https://i.postimg.cc/G2jmLsc6/cacciamagica-(1)-(1).png', 'assets/images/ui/titles/hunt-title.webp');
        add('https://i.postimg.cc/cLdsKxJp/boodiplo-(1).png', 'assets/images/characters/boo-diploma.webp');
        add('https://i.postimg.cc/X7qKBDrZ/sdfasadfdfsa-(1)-(1)-(1).png', 'assets/images/ui/instruments/magic-hat.webp');
        add('https://i.postimg.cc/sDjwgFcf/dadi-storia-(1)-(1).png', 'assets/images/ui/titles/dice-title.webp');
        add('https://i.postimg.cc/65YbdbPv/ornatorre-(1)-(1).png', 'assets/images/ui/buttons/btn-back-tower.webp');

        // --- 9. BOARD GAMES FEEDBACK (NONNO, GAIA, ZUCCOTTO) ---
        add('https://i.postimg.cc/C1p5QqV3/sisisis-(1)-(1).png', 'assets/images/characters/gaia/gaia-yes.webp');
        add('https://i.postimg.cc/tCvTHfjr/nonono-(1)-(1).png', 'assets/images/characters/gaia/gaia-no.webp');
        add('https://i.postimg.cc/FRxrCCGQ/stosotos-(1)-(1).png', 'assets/images/characters/gaia/gaia-thinking.webp');
        add('https://i.postimg.cc/s2hq2BZp/indovinato-(1)-(1).png', 'assets/images/characters/gaia/gaia-correct.webp');
        add('https://i.postimg.cc/bvkVhKKB/nlui-(1)-(1).png', 'assets/images/characters/gaia/gaia-wrong.webp');
        add('https://i.postimg.cc/Cx4Jg8cB/nonno-pensante-(1)-(1).png', 'assets/images/characters/grandpa-thinking.webp');
        add('https://i.postimg.cc/PJrbWGY6/SEDERF-(1)-(1)-(1)-(1).png', 'assets/images/characters/zuccotto-thinking.webp');
        add('https://i.postimg.cc/2y7kfJtD/vwrder-(1)-(1).png', 'assets/images/ui/feedback/zuccotto-wins.webp');
        add('https://i.postimg.cc/Fs00t9mG/adswds-(1).png', 'assets/images/ui/feedback/victory-hug.webp');
        add('https://i.postimg.cc/9FzrG83V/dsadsa-(1).png', 'assets/images/ui/feedback/victory-checkers.webp');

        // --- 10. ARCADE MINIATURES & SYSTEM UI ---
        add('https://i.postimg.cc/J0xNNBnW/bandhe.jpg', 'assets/images/games/thumbs/guesswho.webp');
        add('https://i.postimg.cc/Y0ntHPq5/il-gli.jpg', 'assets/images/games/thumbs/grammar.webp');
        add('https://i.postimg.cc/2SBrs2pG/quiz-spettrale.jpg', 'assets/images/games/thumbs/logic.webp');
        add('https://i.postimg.cc/WbTZbqp0/scoppia-le-bolle.jpg', 'assets/images/games/thumbs/bubbles.webp');
        add('https://i.postimg.cc/v8hjFFZb/corsa-pazza.jpg', 'assets/images/games/thumbs/racing.webp');
        add('https://i.postimg.cc/0QpvC8JQ/ritorna-al-parco-(1)-(2).png', 'assets/images/ui/buttons/btn-back-park-red.webp');
        add('https://i.postimg.cc/K80g02mb/erde-(1).png', 'assets/images/ui/buttons/btn-back-park-green.webp');
        add('https://i.postimg.cc/fyF07TTv/tasto-gioca-ancora-(1).png', 'assets/images/ui/buttons/btn-play-again.webp');

        // --- 11. RECURRING DATABASES (THE BIG ONES) ---
        STICKERS_COLLECTION.forEach(s => add(s.image, `assets/images/stickers/v1/${s.id}.webp`));
        STICKERS_COLLECTION_VOL2.forEach(s => add(s.image, `assets/images/stickers/v2/${s.id}.webp`));
        CHARACTERS.forEach(c => add(c.image, `assets/images/characters/profile/${c.id}.webp`));
        BOOKS_DATABASE.forEach(b => add(b.coverImage, `assets/images/books/${b.id}.webp`));
        FAIRY_TALES.forEach(t => add(t.image, `assets/images/tales/covers/${t.id}.webp`));
        INTRUSO_DATABASE.forEach(i => add(i.url, `assets/images/games/intruso/${i.id}.webp`));
        RECYCLE_DATABASE.forEach(r => add(r.image, `assets/images/games/recycle/${r.id}.webp`));
        GW_DATABASE.forEach(c => add(c.image, `assets/images/games/guesswho/${c.id}.webp`));
        COLORING_DATABASE.forEach(cat => {
            cat.items.forEach(item => add(item.thumbnail, `assets/images/coloring/${cat.id}/${item.id}.webp`));
        });

        // --- 12. MISC UI & SYSTEM ---
        add(CONST.OFFICIAL_LOGO, 'assets/images/ui/logo-official.webp');
        add('https://i.postimg.cc/NFY3kzkS/notifir-(1).png', 'assets/images/ui/icons/menu-notif.webp');
        add('https://i.postimg.cc/CxyjrpqF/salvagegeg-(1).png', 'assets/images/ui/icons/menu-info.webp');
        add('https://i.postimg.cc/nLF3F9GS/accessdre-(1).png', 'assets/images/ui/icons/menu-magic.webp');
        add('https://i.postimg.cc/Y2YYPq1C/area-genitori-(1).png', 'assets/images/ui/icons/menu-parents.webp');

        return Array.from(assets.entries());
    };

    const downloadImage = async (url: string): Promise<Blob | null> => {
        try {
            const res = await fetch(url, { mode: 'cors', credentials: 'omit' });
            if (!res.ok) return null;
            return await res.blob();
        } catch (e) { return null; }
    };

    const convertToWebP = async (blob: Blob): Promise<Blob | null> => {
        if (blob.type === 'image/svg+xml') return blob;
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width; canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                if (!ctx) return resolve(null);
                ctx.drawImage(img, 0, 0);
                canvas.toBlob((b) => resolve(b), 'image/webp', 0.85);
            };
            img.onerror = () => resolve(null);
            img.src = URL.createObjectURL(blob);
        });
    };

    const startGigaScan = async () => {
        setIsProcessing(true);
        setLog([]);
        setActiveTab('LOG');
        setStatus("Giga-Scan V14 avviato...");

        try {
            const JSZip = (await import('jszip')).default;
            const zip = new JSZip();

            const allEntries = collectAllAssets();
            const total = allEntries.length;
            addLog(`🚀 [GIGA-SCAN V14] Trovati ${total} asset univoci. Inizio download massivo...`);

            const mappingLines: string[] = [];

            for (let i = 0; i < total; i++) {
                const [url, targetPath] = allEntries[i];
                setStatus(`Cattura ${i + 1}/${total}...`);
                setProgress(Math.round(((i + 1) / total) * 100));

                const blob = await downloadImage(url);
                if (blob) {
                    let finalBlob = blob;
                    let finalPath = targetPath;

                    if (!url.toLowerCase().endsWith('.svg')) {
                        const webp = await convertToWebP(blob);
                        if (webp) {
                            finalBlob = webp;
                            finalPath = targetPath.replace(/\.(png|jpg|jpeg)$/i, '.webp');
                            if (!finalPath.endsWith('.webp')) finalPath += '.webp';
                        }
                    }

                    zip.file(finalPath, finalBlob);
                    mappingLines.push(`  "${url}": "${finalPath}",`);
                    addLog(`✅ [OK] ${finalPath}`);
                } else {
                    addLog(`❌ [FALLITO] ${url}`);
                    mappingLines.push(`  "${url}": "${url}", // REMOTE`);
                }
            }

            setStatus("Generazione ZIP in corso...");
            const zipContent = await zip.generateAsync({ type: 'blob' });
            triggerDownload(zipContent, `loneboo-gigascan-v14.zip`);

            const code = `// Mappa Asset Giga-Scan V14 - Generata il ${new Date().toLocaleString()}
export const LOCAL_ASSET_MAP: Record<string, string> = {
${mappingLines.join('\n')}
};

export const getAsset = (url: string): string => {
  if (!url) return "";
  if (url.startsWith('assets/') || url.startsWith('/assets/')) return url;
  try {
      if (localStorage.getItem('force_remote_assets') === 'true') return url;
  } catch (e) {}
  return LOCAL_ASSET_MAP[url] || url;
};`;

            setGeneratedCode(code);
            setStatus("GIGA-SCAN COMPLETATO!");
            setActiveTab('CODE');
            addLog(`🎉 MISSIONE COMPIUTA! ${mappingLines.length} file salvati e strutturati.`);

        } catch (e: any) {
            addLog(`🔥 ERRORE CRITICO: ${e.message}`);
            setStatus("Errore Giga-Scan");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#020617] text-slate-100 p-4 md:p-8 font-mono text-sm">
            <div className="max-w-5xl mx-auto">
                <div className="flex items-center justify-between mb-8 bg-slate-800/50 p-6 rounded-[2.5rem] border-b-4 border-slate-700 backdrop-blur-md">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setView(AppView.HOME)} className="bg-slate-700 p-2 rounded-xl hover:bg-slate-600 transition-colors"><ArrowLeft /></button>
                        <div>
                            <h1 className="text-xl md:text-3xl font-black text-yellow-400 uppercase tracking-tighter leading-none">GIGA-SCAN V14</h1>
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Integrità Totale Asset & Struttura Cartelle</span>
                        </div>
                    </div>
                    <div className="hidden md:flex gap-2">
                        <div className="bg-blue-950 p-2 rounded-lg border border-blue-500/30 flex items-center gap-2">
                            <MapIcon size={16} className="text-blue-400" />
                            <span className="text-[10px] font-black">RIPRISTINO MAPPE</span>
                        </div>
                        <div className="bg-green-950 p-2 rounded-lg border border-green-500/30 flex items-center gap-2">
                            <ShieldCheck size={16} className="text-green-400" />
                            <span className="text-[10px] font-black">ZERO LOSS</span>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-900 rounded-[2.5rem] border-4 border-slate-800 overflow-hidden min-h-[500px] flex flex-col shadow-2xl relative">
                    <div className="bg-slate-800 px-6 py-3 flex items-center justify-between border-b border-slate-700">
                        <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${isProcessing ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`}></div>
                            <span className="font-bold text-xs uppercase tracking-widest">{status}</span>
                        </div>
                        {isProcessing && <span className="text-yellow-500 font-black">{progress}%</span>}
                    </div>

                    <div className="flex-1 relative flex flex-col">
                        {activeTab === 'LOG' && (
                            <div className="flex-1 p-4 overflow-y-auto bg-black/40 scrollbar-hide flex flex-col-reverse">
                                {log.map((line, i) => (
                                    <div key={i} className={`py-1 border-b border-white/5 font-mono text-[10px] ${line.includes('✅') ? 'text-green-400' : line.includes('❌') ? 'text-red-400' : 'text-slate-400'}`}>
                                        {line}
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeTab === 'CODE' && (
                            <div className="flex-1 flex flex-col bg-slate-950">
                                <textarea 
                                    className="flex-1 p-4 bg-transparent text-blue-400 focus:outline-none resize-none text-[10px]" 
                                    readOnly 
                                    value={generatedCode} 
                                />
                                <div className="p-4 bg-slate-900 border-t border-slate-800 flex justify-end">
                                    <button 
                                        onClick={() => { navigator.clipboard.writeText(generatedCode); alert("Mappa copiata!"); }}
                                        className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-2"
                                    >
                                        <Copy size={16} /> COPIA MAPPA V14
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-8 flex flex-col items-center">
                    <button 
                        onClick={startGigaScan}
                        disabled={isProcessing}
                        className={`
                            group relative w-full md:w-96 py-8 rounded-[3rem] font-black text-2xl uppercase tracking-tighter transition-all
                            border-b-8 active:border-b-0 active:translate-y-2
                            ${isProcessing ? 'bg-slate-700 border-slate-800 text-slate-500 cursor-not-allowed' : 'bg-yellow-400 border-yellow-600 text-black hover:bg-yellow-300 shadow-2xl'}
                        `}
                    >
                        <div className="flex items-center justify-center gap-3">
                            {isProcessing ? <Loader2 className="animate-spin" size={32} /> : <Play size={32} fill="black" />}
                            <span>START GIGA-SCAN V14</span>
                        </div>
                    </button>
                    <p className="text-slate-600 text-[9px] mt-6 font-bold uppercase tracking-widest text-center">
                        Giga-Scan V14: Scansione cumulativa forzata di tutte le sezioni, minigiochi e database ({collectAllAssets().length} file).
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ServicePage;
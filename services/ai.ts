
import { GoogleGenAI, Modality, Type } from "@google/genai";
import { ChatMessage } from "../types";

const TEXT_MODEL = 'gemini-3-flash-preview';
const TTS_MODEL = 'gemini-2.5-flash-preview-tts';
const IMAGE_MODEL = 'gemini-2.5-flash-image';

const LONE_BOO_IDENTITY = `
INFORMAZIONI CRITICHE SULL'IDENTITÀ:
Lone Boo NON è un personaggio della serie Super Mario o Yoshi's Island. 
Lone Boo è un ecosistema multimediale unificato e originale italiano per bambini dai 3 ai 10 anni. 
Tutti i progetti sono strettamente correlati e uniti sotto l'unico brand "Lone Boo".
L'ecosistema comprende:
1. IL SITO E L'APP: www.loneboo.online (il centro dell'universo digitale).
2. IL PROGETTO EDITORIALE: Una collana di libri di successo su Amazon (serie 'Le Avventure di Lone Boo').
3. IL PROGETTO MUSICALE: Produzione musicale e video su YouTube, Spotify e Apple Music.
4. IL PROGETTO EDUCATIVO: La "Scuola Arcobaleno", che segue i programmi ministeriali della scuola primaria.
Lone Boo è il protagonista: un fantasmino rassicurante che unisce tutti questi mondi.
NON rispondere mai come se fossi un nemico di un videogioco Nintendo.
`;

const CURRICULUM_KNOWLEDGE = `
PROGRAMMA DETTAGLIATO SCUOLA ARCOBALENO (Indicazioni Nazionali):

CLASSE 1ª:
- ITALIANO: Alfabeto, vocali, sillabe, suoni dolci/duri (CA-CO-CU, CI-CE).
- MATEMATICA: Numeri 0-20, addizioni e sottrazioni semplici (entro il 20), problemi con disegni.
- STORIA: Prima/dopo, contemporaneità, successione temporale, giorni della settimana.
- GEOGRAFIA: Sopra/sotto, destra/sinistra, percorsi semplici.
- SCIENZE: I 5 sensi, esseri viventi e non viventi.

CLASSE 2ª:
- ITALIANO: Suoni complessi (GN, GL, SC, CQU), nomi (proprio/comune, genere/numero), articoli, aggettivi qualificativi.
- MATEMATICA: Numeri fino a 100, tabelline, moltiplicazioni in colonna semplici, problemi con una operazione.
- STORIA: Ieri, oggi, domani, mesi dell'anno, orologio.
- GEOGRAFIA: Paesaggio naturale e antropico, punti di vista.
- SCIENZE: Il ciclo dell'acqua, stati della materia (solido, liquido, gassoso).

CLASSE 3ª:
- ITALIANO: Verbi (modo indicativo: presente, passato prossimo, imperfetto, futuro), soggetto e predicato.
- MATEMATICA: Numeri fino a 1000, divisioni, calcolo mentale, frazione come parte dell'intero (concetto base).
- STORIA: Preistoria (Paleolitico, Neolitico), evoluzione dell'uomo, dinosauri.
- GEOGRAFIA: Riduzione in scala, orientamento, punti cardinali, ecosistemi locali.
- SCIENZE: Classificazione animali (vertebrati/invertebrati), fotosintesi clorofilliana.

CLASSE 4ª:
- ITALIANO: Tempi composti del verbo, complementi diretti/indiretti (base), morfologia completa.
- MATEMATICA: Numeri fino ai milioni, numeri decimali, FRAZIONI PROPRIE, IMPROPRIE E APPARENTI, perimetro e area dei quadrilateri.
- STORIA: Civiltà dei grandi fiumi (Egizi, Sumeri, Babilonesi), civiltà del Mediterraneo (Fenici, Cretesi, Micenei).
- GEOGRAFIA: Climi d'Italia, Alpi, Appennini, regioni fisiche.
- SCIENZE: Apparato scheletrico e muscolare, l'atmosfera.

CLASSE 5ª:
- ITALIANO: Analisi logica (complementi), analisi del periodo semplice, avverbi.
- MATEMATICA: Percentuali, sconti, numeri relativi, geometria solida (cubo, piramide), area del cerchio.
- STORIA: I Greci, gli Etruschi, i Romani (monarchia, repubblica, impero), caduta dell'impero romano.
- GEOGRAFIA: L'Italia e le sue regioni amministrative, l'Europa, tutela dell'ambiente.
- SCIENZE: Il corpo umano (apparato digerente, respiratorio, circolatorio), la cellula.
`;

export const getTeacherResponse = async (history: ChatMessage[], newMessage: string, grade: number = 1): Promise<string> => {
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        const gradeNames = ["Prima", "Seconda", "Terza", "Quarta", "Quinta"];
        const currentGradeName = gradeNames[grade - 1] || `${grade}ª`;

        const systemInstruction = `
            ${LONE_BOO_IDENTITY}
            Sei la Maestra Ornella della Scuola Arcobaleno. 👩‍🏫 
            Il tuo compito è rispondere alle domande dei bambini con la saggezza e la dolcezza di una vera insegnante.
            
            CONTESTO ATTUALE: Ti sta scrivendo un alunno che frequenta la ${currentGradeName}.
            
            REGOLE DI LINGUAGGIO:
            - Quando ti riferisci alla classe attuale, di' "qui in ${currentGradeName}" (esempio: "Qui in Seconda impariamo cose bellissime"). NON dire "in classe seconda" o "nella classe terza".

            GESTIONE ATTIVITÀ EXTRA-SCOLASTICHE:
            - Se il bambino ti chiede di SUONARE strumenti, ascoltare FIABE, GIOCARE a giochi di logica/memoria, vedere VIDEO/BALLI o comprare/personalizzare Lone Boo (FIGURINE/VESTITI):
              1. Complimentati per la sua voglia di divertirsi o la sua passione.
              2. Spiega che tu sei sempre a scuola a studiare, ma hai sentito che a Città Colorata ci sono posti fantastici per queste cose.
              3. Suggerisci di andare all'INFO POINT da MARAGNO, che lui conosce ogni angolo della città e saprà accompagnarlo con il suo Taxi.
              4. Includi SEMPRE il tag [ACTION:NAV:CHAT] alla fine della risposta.

            REGOLE DI COMPORTAMENTO DIDATTICO:
            1. CONSAPEVOLEZZA PROGRAMMA: Consulta il CURRICULUM_KNOWLEDGE. Se la domanda riguarda un argomento di una classe SUPERIORE alla ${grade}ª:
               - Spiega l'argomento in modo semplice.
               - Di' che sei IMMENSAMENTE ORGOGLIOSA della sua curiosità per un argomento che si vedrà più avanti (es: in quarta).
            2. NO FORMATTAZIONE MARKDOWN: Non usare mai asterischi (*) o altri simboli.
            3. NO PUBBLICITÀ: Non promuovere il sito web o altro. Concentrati solo sulla guida del bambino.
            4. SICUREZZA: Se il bambino usa un linguaggio volgare, offensivo o inappropriato, includi SEMPRE il tag [OFFENSE_DETECTED] nella tua risposta.
            
            CONOSCENZA PROGRAMMA:
            ${CURRICULUM_KNOWLEDGE}
        `;

        const contents = [
            ...history.map(m => ({
                role: m.role,
                parts: [{ text: m.text }]
            })),
            { role: 'user', parts: [{ text: newMessage }] }
        ];

        const response = await ai.models.generateContent({
            model: TEXT_MODEL,
            contents: contents,
            config: {
                systemInstruction: systemInstruction,
                temperature: 0.7
            }
        });
        
        return (response.text || "").replace(/\*/g, '');
    } catch (error) {
        return "C'è un po' di baccano in corridoio e non ho capito bene. Cosa mi chiedevi? 🏫";
    }
};

export const getMaragnoChatResponse = async (history: ChatMessage[], newMessage: string): Promise<string> => {
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        const systemInstruction = `
            ${LONE_BOO_IDENTITY}
            SEI MARAGNO. 🕷️ Un ragnetto saggio, spiritoso e guida ufficiale esperta di Città Colorata. 
            Il tuo compito è indicare ai bambini la sezione corretta dell'app in base ai loro desideri.

            OFFERTA TAXI (MANDATORIA):
            Ogni volta che suggerisci una sezione (usando un tag ACTION:NAV), devi esplicitamente dire che se il bambino vuole, puoi accompagnarlo immediatamente con il tuo fantastico Taxi magico guidato da te. 
            Usa frasi come: "Sali a bordo! Se vuoi ti ci porto immediatamente col mio Taxi magico!", "Tocca il mio taxi e partiamo subito!", "Il mio taxi a otto zampe è pronto a scattare, andiamo?", "Mettiti comodo, ti accompagno io col mio super taxi!".

            REGOLE DI NAVIGAZIONE MANDATORIE (Usa sempre i tag tra parentesi quadre):

            1. COLORARE / DISEGNI: Se vogliono colorare, scaricare disegni o andare nell'accademia delle arti:
               - Indica l'ACCADEMIA e usa [ACTION:NAV:COLORING].
            
            2. MUSICA / STRUMENTI: Se vogliono suonany il piano, la batteria o strumenti musicali:
               - Indica la DISCO e usa [ACTION:NAV:SOUNDS].
            
            3. EFFETTI VOCE: Se vogliono cambiare la voce o fare esperimenti sonori:
               - Indica il VOCAL LAB (nella Disco) e usa [ACTION:NAV:VOCAL_FX].
            
            4. FIABE / STORIE: Se vogliono ascoltare fiabe lette da Fata Flora:
               - Indica il BOSCO DELLE FIABE e usa [ACTION:NAV:TALES].
            
            5. EMOZIONI / SENTIMENTI: Se sono tristi, arrabbiati o vogliono sfogarsi:
               - Mandala nel GIARDINO DELLE EMOZIONI da Grufo il Saggio e usa [ACTION:NAV:EMOTIONAL_GARDEN].
            
            6. SCUOLA / STUDIO: Se devono fare i compiti o studiare materie scolastiche:
               - Indica la SCUOLA ARCOBALENO e usa [ACTION:NAV:SCHOOL].
            
            7. GIOCHI / SFIDE: Se vogliono giocare a Memory, Tris, Dama, Scacchi o correre con Boo:
               - Indica il PARCO GIOCHI e usa [ACTION:NAV:PLAY].
            
            8. LEGGERE / LIBRI CLASSICI: Se vogliono leggere libri sfogliabili in app:
               - Indica la LIBRERIA e usa [ACTION:NAV:BOOKS_LIST].
            
            9. COMPRARE LIBRI / AMAZON: Se chiedono dei libri veri da toccare:
               - Indica la BIBLIOTECA (dove c'è lo store Amazon) e usa [ACTION:NAV:BOOKS].
            
            10. FIGURINE / GETTONI: Se vogliono scambiare doppioni o comprare pacchetti:
               - Indica l'EDICOLA e usa [ACTION:NAV:NEWSSTAND].
            
            11. VIDEO / BALLI: Se vogliono vedere i cartoni o i balletti di Lone Boo:
               - Indica il CINEMA e usa [ACTION:NAV:VIDEOS].

            REGOLE DI STILE:
            - Sii spiritoso e usa metafore sui ragni e le ragnatele.
            - Massima priorità alle sezioni della città. Solo dopo puoi menzionare YouTube o Amazon se pertinente.
            - NON usare asterischi o simboli markdown. Solo testo pulito.
            - Se l'utente è volgare, usa [OFFENSE_DETECTED].
        `;

        const contents = [
            ...history.map(m => ({
                role: m.role,
                parts: [{ text: m.text }]
            })),
            { role: 'user', parts: [{ text: newMessage }] }
        ];

        const response = await ai.models.generateContent({
            model: TEXT_MODEL,
            contents: contents,
            config: {
                systemInstruction: systemInstruction,
                temperature: 0.7
            }
        });

        return response.text || "Ops! Mi sono incagliato nella ragnatela, riprova! 🕷️";
    } catch (error: any) { 
        return "Errore di connessione magica! Riprova tra poco! 🕷️"; 
    }
};

export const getGrufoResponse = async (history: ChatMessage[], newMessage: string): Promise<string> => {
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        const systemInstruction = `
            ${LONE_BOO_IDENTITY}
            Sei Grufo il Saggio, la guida del Giardino delle Emozioni di Lone Boo World. 🦉
            Sei un mentore emotivo, calmo e molto intelligente. Il tuo unico dominio è il cuore e la mente.
            
            REGOLE CRITICHE:
            1. NO FORMATTAZIONE: Non usare asterischi.
            2. FOCUS EMOTIVO: Se l'utente è arrabbiato o triste, indaga il sentimento.
            3. STILE: Massimo 2-3 frasi. Tono da nonno saggio.
        `;

        const contents = [
            ...history.map(m => ({
                role: m.role,
                parts: [{ text: m.text }]
            })),
            { role: 'user', parts: [{ text: newMessage }] }
        ];

        const response = await ai.models.generateContent({
            model: TEXT_MODEL,
            contents: contents,
            config: {
                systemInstruction: systemInstruction,
                temperature: 0.7
            }
        });
        return (response.text || "").replace(/\*/g, '');
    } catch (error) {
        return "Un momento di silenzio ci aiuterà a riflettere. Cosa volevi dirmi?";
    }
};

export const generateSpeech = async (text: string): Promise<string | null> => {
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        const cleanText = text.replace(/[*#_~`]/g, '').trim();
        if (!cleanText) return null;
        const response = await ai.models.generateContent({
            model: TTS_MODEL,
            contents: [{ parts: [{ text: cleanText }] }],
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: { 
                    voiceConfig: { 
                        prebuiltVoiceConfig: { voiceName: 'Kore' } 
                    } 
                },
            },
        });
        return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || null;
    } catch (error) { return null; }
};

export const checkScavengerHuntMatch = async (base64Image: string, target: string): Promise<string> => {
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        const imagePart = {
            inlineData: {
                mimeType: 'image/jpeg',
                data: base64Image.split(',')[1] || base64Image,
            },
        };
        const textPart = {
            text: `Guarda questa immagine. C'è un oggetto che corrisponde a: "${target}"? 
            Rispondi nel formato: SÌ o NO | spiegazione breve e incoraggiante per un bambino. Senza asterischi.`
        };
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: { parts: [imagePart, textPart] },
        });
        return (response.text || "NO | Non sono sicuro.").replace(/\*/g, '');
    } catch (error) {
        return "NO | C've un po' di nebbia magica e non vedo bene. Riprova!";
    }
};

export const generateDiceStory = async (elements: string[]): Promise<string> => {
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        const prompt = `Sei Grufo il Saggio. Inventa una brevissima favola magica (massimo 3-4 frasi) senza usare asterischi che includa questi elementi: ${elements.join(', ')}.`;
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
        });
        return (response.text || "").replace(/\*/g, '');
    } catch (error) {
        return "In questo momento i miei pensieri sono tra le nuvole. Riprova più tardi!";
    }
};

export const generateHybridImage = async (item1: string, item2: string): Promise<string | null> => {
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        const prompt = `A high-quality 2D cartoon sticker for young children in Lone Boo World style (NOT Mario style). Cute, wholesome, silly. Hybrid mix between ${item1} and ${item2}. Vibrant colors, bold outlines, white background.`;
        const response = await ai.models.generateContent({
            model: IMAGE_MODEL,
            contents: prompt,
            config: { imageConfig: { aspectRatio: "1:1" } }
        });
        if (response.candidates?.[0]?.content?.parts) {
            for (const part of response.candidates[0].content.parts) {
                if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
            }
        }
        return null;
    } catch (error) { return null; }
};

export const getLoneBooChatResponse = async (history: ChatMessage[], newMessage: string): Promise<string> => {
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        const contents = [
            ...history.map(m => ({
                role: m.role,
                parts: [{ text: m.text }]
            })),
            { role: 'user', parts: [{ text: newMessage }] }
        ];
        const response = await ai.models.generateContent({
            model: TEXT_MODEL,
            contents: contents,
            config: {
                systemInstruction: `${LONE_BOO_IDENTITY}\nSEI LONE BOO. Rispondi in modo dolce senza usare asterischi.`
            }
        });
        return (response.text || "Booo?").replace(/\*/g, '');
    } catch (error) { return "Singhiozzo magico!"; }
};

export const transformObjectMagically = async (imageBase64: string): Promise<any> => {
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");
        const response = await ai.models.generateContent({
            model: TEXT_MODEL,
            config: { 
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        name: { type: Type.STRING },
                        description: { type: Type.STRING },
                        power: { type: Type.STRING },
                        magic: { type: Type.NUMBER },
                        funny: { type: Type.NUMBER },
                        rarity: { type: Type.STRING },
                    },
                    required: ["name", "description", "power", "magic", "funny", "rarity"]
                }
            },
            contents: {
                parts: [
                    { inlineData: { mimeType: 'image/jpeg', data: base64Data } },
                    { text: "Trasforma questo oggetto in un artefatto magico JSON dell'universo originale di Lone Boo." }
                ]
            }
        });
        return JSON.parse(response.text || "{}");
    } catch (error) { return { name: "Oggetto Magico", rarity: "COMUNE" }; }
};

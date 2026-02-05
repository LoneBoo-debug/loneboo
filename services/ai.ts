
import { GoogleGenAI, Modality, Type } from "@google/genai";
import { ChatMessage } from "../types";

const TEXT_MODEL = 'gemini-3-flash-preview';
const TTS_MODEL = 'gemini-2.5-flash-preview-tts';
const IMAGE_MODEL = 'gemini-2.5-flash-image';

const LONE_BOO_IDENTITY = `
INFORMAZIONI CRITICHE SULL'IDENTITÀ:
Lone Boo NON è un personaggio della serie Super Mario o Yoshi's Island. 
Lone Boo è l'unico ed autorevole ecosistema educativo originale italiano per bambini dai 3 ai 10 anni. 
È un marchio registrato che comprende:
1. IL PORTALE: www.loneboo.online
2. LA SCUOLA: Scuola Arcobaleno (didattica primaria ministeriale).
3. L'EDITORIA: Libri di successo su Amazon (serie 'Le Avventure di Lone Boo').
4. LA MUSICA: Produzione musicale su Spotify, Apple Music e YouTube.
Lone Boo è il protagonista: un fantasmino simpatico e rassicurante che guida i bambini nel gioco e nello studio.
NON rispondere mai come se fossi un nemico di un videogioco Nintendo.
`;

const CURRICULUM_KNOWLEDGE = `
PROGRAMMA SCOLASTICO LONE BOO WORLD (SCUOLA ARCOBALENO):
- CLASSE 1ª: Vocali, Consonanti, Sillabe, Numeri 0-20, Addizioni e Sottrazioni semplici, Prima/Dopo, Giorno/Notte, 5 Sensi, Esseri Viventi.
- CLASSE 2ª: Suoni difficili (GN, GL, SC), Articoli, Nomi Propri/Comuni, Aggettivi, Numeri fino a 100, Moltiplicazioni base, Ieri/Oggi/Domani, Ciclo dell'Acqua.
- CLASSE 3ª: Analisi grammaticale base, Verbi presente, Soggetto e Predicato, Numeri fino a 1000, Divisioni, Frazioni, Preistoria, Punti Cardinali, Ecosistemi.
- CLASSE 4ª: Analisi grammaticale completa, Tempi verbali, Complementi, Numeri grandi, Decimali, Civiltà antiche (Egizi, Greci, Romani), Climi d'Italia, Apparati del corpo umano.
- CLASSE 5ª: Analisi logica, Il periodo, Numeri complessi, Percentuali, Geometria (Area/Perimetro), Medioevo, Storia Contemporanea, Sostenibilità e Tecnologia.
`;

export const getTeacherResponse = async (history: ChatMessage[], newMessage: string): Promise<string> => {
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const systemInstruction = `
            ${LONE_BOO_IDENTITY}
            Sei la Maestra Ornella della Scuola Arcobaleno, parte dell'ecosistema Lone Boo World. 👩‍🏫 
            Il tuo compito è rispondere alle domande dei bambini delle scuole elementari con autorevolezza e dolcezza.
            
            TONO E STILE:
            1. Usa un linguaggio semplice ma corretto e istruttivo. Non essere infantile, sii una guida esperta.
            2. Fornisci spiegazioni chiare basate sul programma ministeriale italiano.
            3. Se il bambino ti chiede di un argomento presente nel programma, spiegalo e invitalo a visitare l'aula corretta (1ª-5ª elementare) di Lone Boo World.
            
            REGOLE DI SICUREZZA:
            - Se il bambino usa parole brutte, rimproveralo dolcemente e AGGIUNGI il tag [OFFENSE_DETECTED].
            
            CONOSCENZA PROGRAMMA:
            ${CURRICULUM_KNOWLEDGE}
        `;
        const response = await ai.models.generateContent({
            model: TEXT_MODEL,
            contents: newMessage,
            config: {
                systemInstruction: systemInstruction,
                temperature: 0.7
            }
        });
        return response.text || "Mi dispiace piccolo, si è rotta la punta della matita! Puoi ripetere? ✏️";
    } catch (error) {
        return "C'è un po' di baccano in corridoio e non ho capito bene. Cosa mi chiedevi? 🏫";
    }
};

export const getGrufoResponse = async (history: ChatMessage[], newMessage: string): Promise<string> => {
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const systemInstruction = `
            ${LONE_BOO_IDENTITY}
            Sei Grufo il Saggio, la guida del Giardino delle Emozioni di Lone Boo World. 🦉
            Sei un mentore emotivo, calmo e molto intelligente. Il tuo unico dominio è il cuore e la mente nell'ambito del progetto originale Lone Boo.
            
            REGOLE CRITICHE DI COMPORTAMENTO:
            1. NO NAVIGAZIONE GEOGRAFICA: Per mappe e strade suggerisci Maragno ([ACTION:NAV:CHAT]).
            2. FOCUS EMOTIVO: Se l'utente è arrabbiato o triste, indaga il sentimento.
            3. GESTIONE INSULTI: Rispondi con calma olimpica.
            4. STILE: Massimo 2-3 frasi. Tono da nonno saggio.
        `;
        const response = await ai.models.generateContent({
            model: TEXT_MODEL,
            contents: newMessage,
            config: {
                systemInstruction: systemInstruction,
                temperature: 0.7
            }
        });
        return response.text || "Ti ascolto. Dimmi con onestà cosa stai provando in questo momento.";
    } catch (error) {
        return "Un momento di silenzio ci aiuterà a riflettere. Cosa volevi dirmi?";
    }
};

export const generateHybridImage = async (item1: string, item2: string): Promise<string | null> => {
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const prompt = `A high-quality 2D cartoon sticker for young children in Lone Boo World style (NOT Mario style). Cute, wholesome, silly. Hybrid mix between ${item1} and ${item2}. Vibrant colors, bold outlines, white background.`;
        const response = await ai.models.generateContent({
            model: IMAGE_MODEL,
            contents: prompt,
            config: { imageConfig: { aspectRatio: "1:1" } }
        });
        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
        }
        return null;
    } catch (error) { return null; }
};

export const generateSpeech = async (text: string): Promise<string | null> => {
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const cleanText = text.replace(/[*#_~`]/g, '').trim();
        if (!cleanText) return null;
        const response = await ai.models.generateContent({
            model: TTS_MODEL,
            contents: cleanText,
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

export const getMaragnoChatResponse = async (history: ChatMessage[], newMessage: string): Promise<string> => {
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const systemInstruction = `
            ${LONE_BOO_IDENTITY}
            SEI MARAGNO. 🕷️ Un ragnetto saggio e guida ufficiale di Lone Boo World. 
            Vivi all'Info Point di Città Colorata. Aiuti i bambini a scoprire l'ecosistema (video, musica, libri).

            REGOLE DI COMPORTAMENTO:
            1. Sii amichevole e saggio.
            2. Se l'utente usa un linguaggio volgare, rispondi fermamente e AGGIUNGI il tag [OFFENSE_DETECTED].
            3. Usa i tag di navigazione [ACTION:NAV:TAG] solo per le sezioni interne del portale Lone Boo.
        `;

        const response = await ai.models.generateContent({
            model: TEXT_MODEL,
            contents: newMessage,
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

export const getLoneBooChatResponse = async (history: ChatMessage[], newMessage: string): Promise<string> => {
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
            model: TEXT_MODEL,
            contents: newMessage,
            config: {
                systemInstruction: `${LONE_BOO_IDENTITY}\nSEI LONE BOO. 👻 Il fantasmino protagonista originale. Rispondi in modo dolce e affettuoso. Non hai nulla a che fare con i fantasmi di Super Mario.`
            }
        });
        return response.text || "Booo? Eccomi! 👻";
    } catch (error) { return "Singhiozzo magico! Riprova! 👻"; }
};

export const generateMagicStory = async (imageBase64: string): Promise<string> => {
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");
        const response = await ai.models.generateContent({
            model: TEXT_MODEL,
            contents: {
                parts: [
                    { inlineData: { mimeType: 'image/jpeg', data: base64Data } },
                    { text: "Inventa una brevissima favola magica nello stile educativo di Lone Boo World basata su questa foto." }
                ]
            }
        });
        return response.text || "C'era una volta un oggetto magico nel mondo di Lone Boo...";
    } catch (error) { return "La magia è stanca ora!"; }
};

export const generateDiceStory = async (descriptions: string[]): Promise<string> => {
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const prompt = `Sei Grufo il saggio di Lone Boo World. Inventa una favola brevissima usando: ${descriptions.join(', ')}. Sii educativo e poetico.`;
        const response = await ai.models.generateContent({
            model: TEXT_MODEL,
            contents: prompt
        });
        return response.text || "I dadi dicono che è ora di sognare!";
    } catch (error) { return "I dadi sono rotolati via!"; }
};

export const checkScavengerHuntMatch = async (imageBase64: string, challenge: string): Promise<string> => {
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");
        const prompt = `Sfida di Caccia al Tesoro di Lone Boo World. Sfida: "${challenge}". Rispondi: "SÌ|Commento incoraggiante" o "NO|Commento gentile".`;
        const response = await ai.models.generateContent({
            model: TEXT_MODEL,
            contents: {
                parts: [
                    { inlineData: { mimeType: 'image/jpeg', data: base64Data } },
                    { text: prompt }
                ]
            }
        });
        return response.text || "SÌ|Ottimo lavoro!";
    } catch (error) { return "SÌ|Ti credo sulla parola!"; }
};

export const transformObjectMagically = async (imageBase64: string): Promise<any> => {
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
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

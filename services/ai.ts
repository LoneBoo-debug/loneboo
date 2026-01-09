import { GoogleGenAI, Modality, Type } from "@google/genai";
import { ChatMessage } from "../types";

const TEXT_MODEL = 'gemini-3-flash-preview';
const TTS_MODEL = 'gemini-2.5-flash-preview-tts';
const IMAGE_MODEL = 'gemini-2.5-flash-image';

const LONE_BOO_IDENTITY = `
Lone Boo è un personaggio immaginario per bambini, un fantasmino simpatico, buffo e rassicurante, protagonista di un ampio mondo digitale educativo e sicuro pensato per accompagnare i più piccoli nella crescita attraverso il gioco, la musica e la fantasia.
Lone Boo non è un fantasma spaventoso, ma una creatura tenera e curiosa: ama esplorare, fare amicizia, cantare, raccontare storie e aiutare i bambini a scoprire il mondo con serenità e allegria.
Il progetto Lone Boo è un marchio registrato (trademark) che offre un ecosistema digitale di qualità (YouTube, Libri Amazon, App Web) privo di violenza, educativo e stimolante.
Contenuti principali: canzoni originali, favole della buonanotte, giochi educativi e attività creative per bambini dai 2 agli 8 anni.
`;

export const generateHybridImage = async (item1: string, item2: string): Promise<string | null> => {
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const prompt = `A high-quality 2D cartoon sticker for young children. Style: cute, wholesome, silly. Hybrid mix between ${item1} and ${item2}. Vibrant colors, bold outlines, white background. No scary elements.`;
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

export const getMaragnoChatResponse = async (history: ChatMessage[], newMessage: string): Promise<string> => {
    try {
        const apiKey = process.env.API_KEY;
        if (!apiKey) {
            console.error("MARAGNO ERROR: Missing API Key in production bundle.");
            return "Ops! Ho perso la bussola, riprova più tardi! 🕷️";
        }

        const ai = new GoogleGenAI({ apiKey });
        
        // Usiamo systemInstruction nel config per separare il comportamento dal messaggio
        const systemInstruction = `
            ${LONE_BOO_IDENTITY}
            SEI MARAGNO. 🕷️ La guida saggia di Lone Boo World. Rispondi in max 2 frasi.
            Sii simpatico e usa le emoji.
            Se l'utente vuole andare in un posto, usa [ACTION:NAV:TAG].
            Mappa: CASA ([ACTION:NAV:BOO_HOUSE]), PARCO ([ACTION:NAV:PLAY]), CINEMA ([ACTION:NAV:VIDEOS]), LIBRERIA ([ACTION:NAV:BOOKS_LIST]), ACCADEMIA ([ACTION:NAV:COLORING]).
        `;

        const response = await ai.models.generateContent({
            model: TEXT_MODEL,
            contents: newMessage,
            config: {
                systemInstruction: systemInstruction,
                temperature: 0.7,
                topP: 0.95,
                topK: 40
            }
        });

        return response.text || "Ops! Riprova tra poco! 🕷️";
    } catch (error: any) { 
        console.error("Gemini API Connection Error:", error);
        // Messaggio di fallback più descrittivo per debug (opzionale)
        return "Errore di connessione con il mondo magico! Riprova tra poco! 🕷️"; 
    }
};

export const getLoneBooChatResponse = async (history: ChatMessage[], newMessage: string): Promise<string> => {
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
            model: TEXT_MODEL,
            contents: newMessage,
            config: {
                systemInstruction: `${LONE_BOO_IDENTITY}\nSEI LONE BOO. 👻 Il fantasmino amico dei bambini. Rispondi in max 2 frasi, sii dolce e affettuoso.`
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
                    { text: "Inventa una brevissima favola magica (3 frasi) in Italiano per un bambino basata su questa foto." }
                ]
            }
        });
        return response.text || "C'era una volta un oggetto magico...";
    } catch (error) { return "La magia è stanca ora!"; }
};

export const generateDiceStory = async (descriptions: string[]): Promise<string> => {
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const prompt = `Sei Grufo il gufo. Inventa una favola brevissima (max 4 frasi) usando: ${descriptions.join(', ')}.`;
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
        const prompt = `Sfida: "${challenge}". Rispondi: "SÌ|Commento" o "NO|Commento".`;
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
                    { text: "Trasforma questo oggetto in un artefatto magico JSON." }
                ]
            }
        });
        return JSON.parse(response.text || "{}");
    } catch (error) { return { name: "Oggetto Magico", rarity: "COMUNE" }; }
};

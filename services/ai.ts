
import { GoogleGenAI, Modality, Type } from "@google/genai";
import { ChatMessage } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const TEXT_MODEL = 'gemini-3-flash-preview';
const TTS_MODEL = 'gemini-2.5-flash-preview-tts';
const IMAGE_MODEL = 'gemini-2.5-flash-image';

// --- DEFINIZIONE UFFICIALE LONE BOO (BRAND IDENTITY) ---
const LONE_BOO_IDENTITY = `
Lone Boo è un personaggio immaginario per bambini, un fantasmino simpatico, buffo e rassicurante, protagonista di un ampio mondo digitale educativo e sicuro pensato per accompagnare i più piccoli nella crescita attraverso il gioco, la musica e la fantasia.
Lone Boo non è un fantasma spaventoso, ma una creatura tenera e curiosa: ama esplorare, fare amicizia, cantare, raccontare storie e aiutare i bambini a scoprire il mondo con serenità e allegria.
Il progetto Lone Boo è un marchio registrato (trademark) che offre un ecosistema digitale di qualità (YouTube, Libri Amazon, App Web) privo di violenza, educativo e stimolante.
Contenuti principali: canzoni originali, favole della buonanotte, giochi educativi e attività creative per bambini dai 2 agli 8 anni.
`;

export const generateHybridImage = async (item1: string, item2: string): Promise<string | null> => {
    try {
        const prompt = `A high-quality 2D cartoon sticker for young children. Style: cute, wholesome, silly. Hybrid mix between ${item1} and ${item2}. Vibrant colors, bold outlines, white background. No scary elements.`;
        // FIX: Updated to use simple prompt string as content for nano banana model
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
        const cleanText = text.replace(/[*#_~`]/g, '').trim();
        if (!cleanText) return null;
        // FIX: TTS requires specific structure with Modality.AUDIO and voiceConfig
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
        const systemPrompt = `
        ${LONE_BOO_IDENTITY}
        SEI MARAGNO. 🕷️ La guida saggia di Lone Boo World. Rispondi in max 2 frasi.
        Se l'utente vuole andare in un posto, usa [ACTION:NAV:TAG].
        Mappa: CASA ([ACTION:NAV:BOO_HOUSE]), PARCO ([ACTION:NAV:PLAY]), CINEMA ([ACTION:NAV:VIDEOS]), LIBRERIA ([ACTION:NAV:BOOKS_LIST]), ACCADEMIA ([ACTION:NAV:COLORING]).
        Bambino: "${newMessage}"`;
        // FIX: Updated contents to simple string as per text-only task guidelines
        const response = await ai.models.generateContent({
            model: TEXT_MODEL,
            contents: systemPrompt
        });
        return response.text || "Ops! Riprova tra poco! 🕷️";
    } catch (error) { return "Errore di connessione! 🕷️"; }
};

export const getLoneBooChatResponse = async (history: ChatMessage[], newMessage: string): Promise<string> => {
    try {
        const systemPrompt = `
        ${LONE_BOO_IDENTITY}
        SEI LONE BOO. 👻 Il fantasmino amico dei bambini. Rispondi in max 2 frasi, sii dolce e affettuoso.
        Messaggio: "${newMessage}"`;
        // FIX: Updated contents to simple string as per text-only task guidelines
        const response = await ai.models.generateContent({
            model: TEXT_MODEL,
            contents: systemPrompt
        });
        return response.text || "Booo? Eccomi! 👻";
    } catch (error) { return "Singhiozzo magico! Riprova! 👻"; }
};

export const generateMagicStory = async (imageBase64: string): Promise<string> => {
    try {
        const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");
        // FIX: Using correct contents object with parts for multimodal multimodal input
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
        const prompt = `Sei Grufo il gufo. Inventa una favola brevissima (max 4 frasi) usando: ${descriptions.join(', ')}.`;
        // FIX: Updated contents to simple string as per text-only task guidelines
        const response = await ai.models.generateContent({
            model: TEXT_MODEL,
            contents: prompt
        });
        return response.text || "I dadi dicono che è ora di sognare!";
    } catch (error) { return "I dadi sono rotolati via!"; }
};

export const checkScavengerHuntMatch = async (imageBase64: string, challenge: string): Promise<string> => {
    try {
        const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");
        const prompt = `Sfida: "${challenge}". Rispondi: "SÌ|Commento" o "NO|Commento".`;
        // FIX: Using correct contents object with parts for multimodal multimodal input
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
        const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");
        // FIX: Added responseSchema for robust JSON extraction and updated contents structure for multimodal input
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

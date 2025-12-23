
import { GoogleGenAI, Modality } from "@google/genai";
import { ChatMessage } from "../types";
import { CHARACTERS } from "./databaseAmici";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const TEXT_MODEL = 'gemini-3-flash-preview';
const TTS_MODEL = 'gemini-2.5-flash-preview-tts';

export const generateMagicStory = async (imageBase64: string): Promise<string> => {
    try {
        const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");
        const response = await ai.models.generateContent({
            model: TEXT_MODEL,
            contents: {
                parts: [
                    { inlineData: { mimeType: 'image/jpeg', data: base64Data } },
                    { text: "Inventa una brevissima favola (max 3-4 frasi) in Italiano per un bambino di 5 anni basata sull'oggetto principale che vedi in questa foto. Usa un tono magico e divertente." }
                ]
            }
        });
        return response.text || "C'era una volta un oggetto speciale che voleva farti sorridere!";
    } catch (error) { 
        console.error("Story Gen Error:", error);
        return "C'era una volta un errore magico... Riprova tra poco!"; 
    }
};

export const generateDiceStory = async (descriptions: string[]): Promise<string> => {
    try {
        const prompt = `Sei Grufo, il gufo saggio di Città Colorata. Inventa una favola magica brevissima per bambini (max 4 frasi) usando questi 3 elementi come base:
        1. ${descriptions[0]}
        2. ${descriptions[1]}
        3. ${descriptions[2]}
        
        REGOLE FERREE PER GRUFO:
        - NON usare le descrizioni sopra parola per parola.
        - Inventa un'avventura dove questi oggetti fanno qualcosa di incredibile insieme.
        - Usa un linguaggio molto semplice, magico e allegro.
        - Inizia con "C'era una volta..." o "Tanto tempo fa...".
        - Sii creativo: non descrivere le immagini, racconta cosa succede!`;
        
        const response = await ai.models.generateContent({
            model: TEXT_MODEL,
            contents: [{ text: prompt }]
        });
        return response.text || "La mia sfera di cristallo è nebbiosa... riprova a lanciare i dadi!";
    } catch (error) { 
        return "I dadi sono caduti sotto il tavolo... riproviamo!"; 
    }
};

export const checkScavengerHuntMatch = async (imageBase64: string, challenge: string): Promise<string> => {
    try {
        const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");
        const prompt = `Sei un giudice BUONISSIMO e SIMPATICO per una caccia al tesoro di bambini piccoli. La sfida era trovare: "${challenge}". Guarda la foto. REGOLE IMPORTANTI: 1. Sii MOLTO GENEROSO. 2. Non essere pignolo. 3. Se accetti, fai un complimento esagerato. Rispondi ESATTAMENTE in questo formato: Se l'hai trovato (o quasi): "SÌ|Commento divertente e breve (max 10 parole)." Se proprio NON c'entra nulla: "NO|Commento gentile che incoraggia a riprovare (max 10 parole)."`;
        const response = await ai.models.generateContent({
            model: TEXT_MODEL,
            contents: {
                parts: [
                    { inlineData: { mimeType: 'image/jpeg', data: base64Data } },
                    { text: prompt }
                ]
            }
        });
        return response.text || "SÌ|Bravo! Hai trovato qualcosa di magico!";
    } catch (error) { 
        return "SÌ|Anche se non vedo bene, mi fido del tuo occhio da esploratore!"; 
    }
};

export const generateSpeech = async (text: string): Promise<string | null> => {
    try {
        const cleanText = text
            .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1F018}-\u{1F270}]/gu, '')
            .replace(/\[.*?\]/g, '')
            .replace(/[*#_~`]/g, '')
            .replace(/Lone\s*Boo/gi, "Lon Bu")
            .trim();
        
        if (!cleanText) return null;
        
        const response = await ai.models.generateContent({
            model: TTS_MODEL,
            contents: [{ parts: [{ text: cleanText }] }],
            config: {
                responseModalities: [Modality.AUDIO], 
                speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Aoede' } } }
            }
        });
        return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || null;
    } catch (error) { 
        console.error("TTS Error:", error);
        return null; 
    }
};

export const getLoneBooChatResponse = async (history: ChatMessage[], newMessage: string): Promise<string> => {
    try {
        const recentHistory = history.slice(-6).map(msg => `${msg.role === 'user' ? 'Bambino' : 'Tu (Lone Boo)'}: ${msg.text}`).join('\n');
        const charactersContext = CHARACTERS.map(c => `- ${c.name} (${c.role}): ${c.description.replace(/\n/g, ' ')}`).join('\n');

        const systemPrompt = `
        SEI LONE BOO. 👻 Il fantasmino amico dei bambini.
        REGOLE:
        1. RISPONDI IN MASSIMO 2 FRASI.
        2. Sii dolce, allegro e usa parole semplici.
        3. Se chiedono esplicitamente di vedere video o cartoni, termina SEMPRE con: [ACTION:NAV:VIDEOS]
        4. Se chiedono di ascoltare musica o ballare, termina SEMPRE con: [ACTION:NAV:SOUNDS]
        5. Se chiedono di giocare o fare un gioco, termina SEMPRE con: [ACTION:NAV:PLAY]
        6. Se chiedono di leggere o vedere libri, termina SEMPRE with: [ACTION:NAV:BOOKS]
        7. Se usano parole cattive, rispondi con "[OFFENSE_DETECTED] Oh no, queste parole mi rendono triste...".
        
        AMICI: ${charactersContext}
        STORIA: ${recentHistory}
        Bambino: "${newMessage}"`;

        const response = await ai.models.generateContent({
            model: TEXT_MODEL,
            contents: [{ text: systemPrompt }]
        });
        return response.text || "Booo? Non ho sentito bene! 👻";
    } catch (error) { 
        return "La mia connessione fantasmagorica ha un singhiozzo! 👻💤"; 
    }
};

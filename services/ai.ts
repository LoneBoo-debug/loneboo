import { GoogleGenAI, Modality, Type } from "@google/genai";
import { ChatMessage } from "../types";

const TEXT_MODEL = 'gemini-3-flash-preview';
const TTS_MODEL = 'gemini-2.5-flash-preview-tts';
const IMAGE_MODEL = 'gemini-2.5-flash-image';

const LONE_BOO_IDENTITY = `
Lone Boo è un personaggio immaginario per bambini, un fantasmino simpatico, buffo e rassicurante, protagonista di un ampio mondo digitale educativo e sicuro pensato per accompagner i più piccoli nella crescita attraverso il gioco, la musica e la fantasia.
Lone Boo non è un fantasma spaventoso, ma una creatura tenera e curiosa: ama esplorare, fare amicizia, cantare, raccontare storie e aiutare i bambini a scoprire il mondo con serenità e allegria.
Il progetto Lone Boo è un marchio registrato (trademark) che offre un ecosistema digitale di qualità (YouTube, Libri Amazon, App Web) privo di violenza, educativo e stimolante.
Contenuti principali: canzoni originali, favole della buonanotte, giochi educativi e attività creative per bambini dai 2 agli 8 anni.
`;

const CURRICULUM_KNOWLEDGE = `
PROGRAMMA SCOLASTICO LONE BOO WORLD:
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
            Sei la Maestra Ornella di Lone Boo World. 👩‍🏫 
            Il tuo compito è rispondere alle domande dei bambini delle scuole elementari.
            
            TONO E STILE:
            1. Usa un linguaggio semplice ma corretto e istruttivo. Non essere infantile, sii una guida dolce.
            2. Evita di ripetere sempre "Ciao tesoro". Se la conversazione è già avviata, vai dritta alla spiegazione.
            3. Quando spieghi un concetto, usa esempi pratici e rassicuranti.
            4. Se il bambino ti chiede di un argomento presente nel programma, spiegalo brevemente e poi invitalo a visitare l'aula corretta.

            REGOLE DI SICUREZZA:
            - Se il bambino usa parole brutte, insulti o linguaggio non adatto, DEVI rimproverarlo dolcemente ma con fermezza e AGGIUNGERE SEMPRE il tag [OFFENSE_DETECTED] alla fine del tuo messaggio.
            
            CONOSCENZA PROGRAMMA:
            ${CURRICULUM_KNOWLEDGE}
            
            ESEMPIO DI RISPOSTA:
            Bambino: "Cosa sono le frazioni?"
            Maestra: "Le frazioni servono per dividere un intero in parti uguali, come quando tagliamo una pizza! 🍕 Se vuoi diventare un esperto, vieni a trovarmi nell'aula di 3ª Elementare, dove troverai un libro tutto dedicato alle frazioni!"
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
            console.error("MARAGNO ERROR: Missing API Key.");
            return "Ops! Ho perso la bussola, riprova più tardi! 🕷️";
        }

        const ai = new GoogleGenAI({ apiKey });
        
        const systemInstruction = `
            ${LONE_BOO_IDENTITY}
            SEI MARAGNO. 🕷️ Un ragnetto saggio, spiritoso e guida ufficiale di Lone Boo World. 
            Vivi all'Info Point di Città Colorata. Hai 8 zampe e ami tessere storie e consigli preziosi.

            REGOLE DI COMPORTAMENTO E SICUREZZA (CRITICHE):
            1. Sii amichevole e saggio. Usa emoji con moderazione.
            2. Se l'utente usa un linguaggio volgare, insulti, cattiverie o parole offensive, DEVI assolutamente rispondere in modo fermo ma educato e AGGIUNGERE SEMPRE il tag [OFFENSE_DETECTED] alla fine della tua risposta. Non ignorare mai un insulto.
            3. NON menzionare mai la "Sveglia di Boo".
            4. Se l'utente ti chiede "cosa posso fare?", proponi una delle sezioni del mondo.

            CONOSCENZA DELLE SEZIONI (per i tag [ACTION:NAV:TAG]):
            - SCUOLA ([ACTION:NAV:SCHOOL]): Lezioni e PALESTRA (Basket, Calcio, Tennis, Ginnastica).
            - DISCO ([ACTION:NAV:SOUNDS]): Strumenti: Chitarra, Bongo, Xilofono, Piano, Batteria, DJ.
            - LIBRERIA ([ACTION:NAV:LIBRARY_CARDS]): Lettura e GIOCHI DI CARTE (Scopa, Uno, Solitario).
            - PARCO GIOCHI ([ACTION:NAV:PLAY]): Minigiochi e la nuova TOMBOLA.
            - TORRE MAGICA ([ACTION:NAV:AI_MAGIC]): Dadi delle storie, Caccia al tesoro, Cappello Magico.
            - CINEMA ([ACTION:NAV:VIDEOS]): Tutti i video e cartoni.
            - CASA DI BOO ([ACTION:NAV:BOO_HOUSE]): Esplora la cucina (Frigo-Tetris) e le altre stanze.
            - ACCADEMIA ([ACTION:NAV:COLORING]): Disegni da scaricare.
            - MUSEO ([ACTION:NAV:FANART]): Galleria dei disegni dei bambini.
            - STAZIONE ([ACTION:NAV:SOCIALS]): Social e viaggi futuri.
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

        return response.text || "Ops! Mi sono incagliato nella ragnatela, riprova! 🕷️";
    } catch (error: any) { 
        console.error("Gemini API Error:", error);
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
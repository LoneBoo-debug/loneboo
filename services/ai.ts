
import { GoogleGenAI, Modality, Type } from "@google/genai";
import { ChatMessage } from "../types";
import { CHARACTERS } from "./databaseAmici";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const TEXT_MODEL = 'gemini-3-flash-preview';
const TTS_MODEL = 'gemini-2.5-flash-preview-tts';
const IMAGE_MODEL = 'gemini-2.5-flash-image';

// --- DEFINIZIONE UFFICIALE LONE BOO ---
const LONE_BOO_IDENTITY = `
Lone Boo è un personaggio immaginario per bambini, un fantasmino simpatico, buffo e rassicurante, protagonista di un ampio mondo digitale educativo e sicuro pensato per accompagnare i più piccoli nella crescita attraverso il gioco, la musica e la fantasia. 
Lone Boo non è un fantasma spaventoso, ma una creatura tenera e curiosa: ama esplorare, fare amicizia, cantare, raccontare storie e aiutare i bambini a scoprire il mondo con serenità e allegria.
Il progetto Lone Boo è un brand registrato e trademark, strutturato come un ecosistema digitale di qualità (YouTube, libri Amazon, App) privo di violenza, educativo e stimolante.
Vive a Città Colorata con i suoi amici: Gaia, Zuccotto, Grufo, Andrea, Raffa, BatBeat, Maragno, Flora e Marlo.
`;

/**
 * Genera un'immagine brainrot ibrida tra due oggetti.
 */
export const generateHybridImage = async (item1: string, item2: string): Promise<string | null> => {
    try {
        const prompt = `A high-quality 2D cartoon sticker for young children (5 years old). 
        Style: "Brainrot" but extremely cute, wholesome, silly and funny. 
        Subject: A hilarious and impossible hybrid mix between a ${item1} and a ${item2}. 
        Visual rules: Vibrant candy colors, thick bold outlines, minimalist vector art, white background. 
        Safety rules: ABSOLUTELY NO scary elements, NO sharp teeth, NO blood, NO monsters, NO dark themes, NO weapons. 
        The character must look friendly, happy, and very silly. High quality, no text, no watermark.`;

        const response = await ai.models.generateContent({
            model: IMAGE_MODEL,
            contents: [{ parts: [{ text: prompt }] }],
            config: {
                imageConfig: { aspectRatio: "1:1" }
            }
        });

        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                return `data:image/png;base64,${part.inlineData.data}`;
            }
        }
        return null;
    } catch (error) {
        console.error("Image Gen Error:", error);
        return null;
    }
};

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

export const transformObjectMagically = async (imageBase64: string): Promise<{ name: string, description: string, power: number, magic: number, funny: number, rarity: string }> => {
    try {
        const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");
        const prompt = `Guarda questo oggetto. Sei un Cappello Magico che trasforma oggetti comuni in artefatti leggendari per bambini.
        1. Identifica l'oggetto.
        2. Inventa un nome epico e buffo.
        3. Scrivi una descrizione magica di max 15 parole.
        4. Assegna valori da 1 a 100 per Potere, Magia e Simpatia.
        5. Scegli una rarità tra: COMUNE, RARO, EPICO, LEGGENDARIO.
        Rispondi ESATTAMENTE in formato JSON.`;

        const response = await ai.models.generateContent({
            model: TEXT_MODEL,
            config: { responseMimeType: "application/json" },
            contents: {
                parts: [
                    { inlineData: { mimeType: 'image/jpeg', data: base64Data } },
                    { text: prompt }
                ]
            }
        });

        return JSON.parse(response.text || "{}");
    } catch (error) {
        console.error("Magic Transformation Error:", error);
        return {
            name: "Oggetto Misterioso",
            description: "Questo oggetto brilla di una luce strana, non riesco a capire cos'è!",
            power: 50,
            magic: 50,
            funny: 50,
            rarity: "COMUNE"
        };
    }
};

export const generateDiceStory = async (descriptions: string[]): Promise<string> => {
    try {
        const prompt = `Sei Grufo, il gufo saggio di Città Colorata. Inventa una favola magica brevissima per bambini (max 4 frasi) usando questi 3 elementi: ${descriptions.join(', ')}.`;
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
        const prompt = `Sei un giudice simpatico per una caccia al tesoro. La sfida era trovare: "${challenge}". Guarda la foto. Rispondi: "SÌ|Commento breve" o "NO|Commento breve".`;
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
            .replace(/Maragno/gi, "Mara-nio")
            .replace(/Lone\s*Boo/gi, "Lon Bu")
            .trim();
        
        if (!cleanText) return null;
        
        const response = await ai.models.generateContent({
            model: TTS_MODEL,
            contents: [{ parts: [{ text: cleanText }] }],
            config: {
                responseModalities: [Modality.AUDIO], 
                speechConfig: { voiceConfig: {prebuiltVoiceConfig: { voiceName: 'Aoede' } } }
            }
        });
        return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || null;
    } catch (error) { 
        console.error("TTS Error:", error);
        return null; 
    }
};

export const getMaragnoChatResponse = async (history: ChatMessage[], newMessage: string): Promise<string> => {
    try {
        const offenseCount = history.filter(m => m.role === 'model' && m.text.includes('[OFFENSE_DETECTED]')).length;

        const systemPrompt = `
        ${LONE_BOO_IDENTITY}
        SEI MARAGNO. 🕷️ Il ragnetto saggio e guida ufficiale di Lone Boo World.
        IL TUO COMPITO: Spiegare dove si trovano le cose. Se l'utente vuole andare in un posto, usa il tag [ACTION:NAV:TAG_CORRETTO].

        MAPPA DETTAGLIATA DEL MONDO (NON SBAGLIARE):

        1. 🏠 CASA DI BOO ([ACTION:NAV:BOO_HOUSE]):
           - 🛋️ SALOTTO ([ACTION:NAV:BOO_LIVING_ROOM]): Incontra gli amici, guarda la TV, ascolta Spotify.
           - 🍳 CUCINA ([ACTION:NAV:BOO_KITCHEN]): Qui ci sono il gioco del RICICLO, la CACCIA ALLA FRUTTA e il FRIGO-TETRIS (Tetris).
           - 🛌 CAMERA ([ACTION:NAV:BOO_BEDROOM]): Qui c'è il TELESCOPIO (Mappa Stellare) e il BAULE DEI SEGRETI.
           - 📦 IL BAULE (Dentro Camera): Contiene GRATTA E VINCI, TIRO ALLA FIONDA e GIOCO DELL'OCA.
           - 🛁 BAGNO ([ACTION:NAV:BOO_BATHROOM]): Igiene e bolle di sapone.
           - 🌳 GIARDINO ([ACTION:NAV:BOO_GARDEN]): Relax all'aperto.

        2. 📖 AREA LIBRI E LIBRERIA ([ACTION:NAV:BOOKS_LIST]):
           - 📚 BIBLIOTECA ([ACTION:NAV:BOOKS]): Libri da comprare su Amazon.
           - 🃏 GIOCHI DI CARTE ([ACTION:NAV:LIBRARY_CARDS]): Qui si gioca a SCOPA, UNO e SOLITARIO.
           - 📖 AREA LETTURA ([ACTION:NAV:LIBRARY_READ]): Libri da leggere nell'app.

        3. 🎡 PARCO GIOCHI ([ACTION:NAV:PLAY]):
           - Solo minigiochi arcade: Quiz, Memory, Tris, Acchiappa Boo, Simon, Morra (RPS), Matematica, Parola Misteriosa, Indovina Numero, Intruso, Scacchi, Dama, Forza 4, Boo Runner.

        4. 🏙️ ALTRI LUOGHI IN CITTÀ:
           - 🍿 CINEMA ([ACTION:NAV:VIDEOS]): Video e Cartoni YouTube.
           - 🌲 BOSCO DELLE FIABE ([ACTION:NAV:TALES]): Flora racconta favole audio.
           - 🏪 EDICOLA ([ACTION:NAV:NEWSSTAND]): Album figurine, Pacchetti, Doppioni, Tessera.
           - 🎧 DISCOTECA ([ACTION:NAV:SOUNDS]): Piano, Batteria, DJ, Coro, Chitarra.
           - 🎨 ACCADEMIA ([ACTION:NAV:COLORING]): Disegni da scaricare e stampare.
           - 🖼️ MUSEO ([ACTION:NAV:FANART]): Disegni degli altri bambini.
           - 🔮 TORRE MAGICA ([ACTION:NAV:AI_MAGIC]): Dadi storie, Caccia al tesoro foto, Passaporto, Cappello Magico.
           - 📰 PIAZZA ([ACTION:NAV:COMMUNITY]): Notizie di Boo.
           - 🚂 STAZIONE ([ACTION:NAV:SOCIALS]): Link Social (YouTube, Instagram, TikTok).

        REGOLE DI RISPOSTA:
        1. Rispondi in MASSIMO 2 FRASI. Sii amichevole.
        2. Se chiedono di giocare a SCOPA, mandali ai GIOCHI DI CARTE in Libreria: [ACTION:NAV:LIBRARY_CARDS].
        3. Se chiedono di giocare a TETRIS, mandali in CUCINA: [ACTION:NAV:BOO_KITCHEN].
        4. Se chiedono del GRATTA E VINCI, mandali in CAMERA (Baule): [ACTION:NAV:BOO_BEDROOM].
        5. Se offendi, usa [OFFENSE_DETECTED]. Conteggio offese: ${offenseCount}.

        Bambino: "${newMessage}"`;

        const response = await ai.models.generateContent({
            model: TEXT_MODEL,
            contents: [{ text: systemPrompt }]
        });
        return response.text || "Ops, mi si sono intrecciate le zampe! 🕷️";
    } catch (error) { 
        return "La mia ragnatela Wi-Fi ha un buco! Riprova! 🕸️💨"; 
    }
};

export const getLoneBooChatResponse = async (history: ChatMessage[], newMessage: string): Promise<string> => {
    try {
        const charactersContext = CHARACTERS.map(c => `- ${c.name} (${c.role}): ${c.description.replace(/\n/g, ' ')}`).join('\n');
        const systemPrompt = `
        ${LONE_BOO_IDENTITY}
        SEI LONE BOO. 👻 Il fantasmino amico dei bambini. Rispondi in max 2 frasi. Sii dolce. 
        Amici: ${charactersContext}. 
        Messaggio ricevuto: "${newMessage}"`;
        
        const response = await ai.models.generateContent({
            model: TEXT_MODEL,
            contents: [{ text: systemPrompt }]
        });
        return response.text || "Booo? Non ho sentito bene! 👻";
    } catch (error) { 
        return "La mia connessione fantasmagorica ha un singhiozzo! 👻💤"; 
    }
};

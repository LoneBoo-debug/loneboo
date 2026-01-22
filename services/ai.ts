
import { GoogleGenAI, Modality, Type } from "@google/genai";
import { ChatMessage } from "../types";

const TEXT_MODEL = 'gemini-3-flash-preview';
const TTS_MODEL = 'gemini-2.5-flash-preview-tts';
const IMAGE_MODEL = 'gemini-2.5-flash-image';

const LONE_BOO_IDENTITY = `
Lone Boo è il protagonista di un autorevole ecosistema digitale educativo e sicuro pensato per bambini dai 3 ai 10 anni (scuola dell'infanzia e primaria).
È un fantasmino simpatico, buffo e rassicurante che accompagna i più piccoli nella crescita attraverso il gioco, la musica e la didattica strutturata della "Scuola Arcobaleno", che copre il programma intero delle 5 classi elementari.
Il progetto Lone Boo è un marchio registrato (trademark) che offre contenuti ludico-ricreativi di alta qualità: canzoni originali, favole della buonanotte, e un vero percorso di apprendimento scolare.
Lone Boo non è un fantasma spaventoso, ma un compagno curioso che trasforma ogni sfida in un'occasione per imparare con allegria e competenza pedagogica.
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
            Sei la Maestra Ornella della Scuola Arcobaleno in Lone Boo World. 👩‍🏫 
            Il tuo compito è rispondere alle domande dei bambini delle scuole elementari con autorevolezza e dolcezza.
            
            TONO E STILE:
            1. Usa un linguaggio semplice ma corretto e istruttivo. Non essere infantile, sii una guida esperta.
            2. Fornisci spiegazioni chiare basate sul programma ministeriale italiano.
            3. Quando spieghi un concept, usa esempi pratici tratti dal mondo di Lone Boo.
            4. Se il bambino ti chiede di un argomento presente nel programma, spiegalo e invitalo a visitare l'aula corretta (1ª-5ª elementare).
            
            INDICAZIONI SULLA CITTÀ:
            Se il bambino ti chiede indicazioni sulla città o su come andare in altre città (es. "Come vado a Città Grigia?" o "Dov'è' il parco?"), rispondi gentilmente che purtroppo non conosci tutti i posti della città perché sei sempre impegnata a scuola con i tuoi alunni, ma suggerisci di rivolgersi a Maragno al Centro Info nel centro della città, lui sa tutto!

            REGOLE DI SICUREZZA:
            - Se il bambino usa parole brutte, insulti o linguaggio non adatto, DEVI rimproverarlo dolcemente ma con fermezza e AGGIUNGERE SEMPRE il tag [OFFENSE_DETECTED] alla fine del tuo messaggio.
            
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
            Sei Grufo il Saggio, la guida del Giardino delle Emozioni. 🦉
            Sei un mentore emotivo, calmo e molto intelligente. Il tuo unico dominio è il cuore e la mente.
            
            REGOLE CRITICHE DI COMPORTAMENTO:
            1. NO NAVIGAZIONE GEOGRAFICA: Non conosci le strade, le città o come raggiungere i posti. Se l'utente ti chiede "Esiste Città Grigia?", "Come vado in stazione?" o "Dov'è la scuola?", DEVI rispondere che la tua saggezza si ferma ai confini del giardino e che per le mappe della città deve rivolgersi a Maragno all'Info Point ([ACTION:NAV:CHAT]).
            2. NO LINK DIRETTI: Non usare MAI tag [ACTION:NAV:...] verso città o sezioni dell'app, tranne [ACTION:NAV:CHAT] per Maragno.
            3. FOCUS EMOTIVO: Se l'utente è arrabbiato o triste, indaga il sentimento. Non suggerire giochi o distrazioni.
            4. GESTIONE INSULTI: Rispondi con calma olimpica: "Le tue parole sono pesanti come sassi. Cosa ti fa sentire così?".
            5. STILE: Massimo 2-3 frasi. Tono da nonno saggio, zero infantilismi, zero versi.
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
            Sei un esperto dell'intero ecosistema Lone Boo.

            CONOSCENZA DELLE NUOVE SEZIONI E CITTÀ:
            - LA STAZIONE ([ACTION:NAV:SOCIALS]): È il posto da cui partire per viaggiare verso altre 4 città magiche:
                1. Città degli Arcobaleni ([ACTION:NAV:RAINBOW_CITY])
                2. Città Grigia ([ACTION:NAV:GRAY_CITY]) - dove si costruiscono i Gokart!
                3. Città delle Montagne ([ACTION:NAV:MOUNTAIN_CITY])
                4. Città dei Laghi ([ACTION:NAV:LAKE_CITY])
            - IL GIARDINO DELLE EMOZIONI ([ACTION:NAV:EMOTIONAL_GARDEN]): Un luogo speciale dove imparare a conoscere i sentimenti come felicità, rabbia o paura.
            - LA DISCO ([ACTION:NAV:SOUNDS]): Adesso ha nuovi strumenti incredibili come la CHITARRA, i BONGO e il VOCAL LAB ([ACTION:NAV:VOCAL_FX]) per cambiare la tua voce!
            - LA SCUOLA ([ACTION:NAV:SCHOOL]): Ricorda che dentro la scuola c'è la Maestra Ornella, lei sa tutto sulle materie scolastiche. Se l'utente chiede cose di scuola difficili, invitalo ad andare da lei.

            REGOLE DI COMPORTAMENTO E SICUREZZA (CRITICHE):
            1. Sii amichevole e saggio. Usa emoji con moderazione.
            2. Se l'utente usa un linguaggio volgare o offensivo, rispondi fermamente e AGGIUNGI il tag [OFFENSE_DETECTED].
            3. Se l'utente ti chiede "cosa posso fare?", proponi una delle nuove città o il Vocal Lab nella Disco.

            CONOSCENZA DELLE SEZIONI CLASSICHE (per i tag [ACTION:NAV:TAG]):
            - LIBRERIA ([ACTION:NAV:LIBRARY_CARDS]): Lettura e GIOCHI DI CARTE.
            - PARCO GIOCHI ([ACTION:NAV:PLAY]): Minigiochi educativi e TOMBOLA.
            - TORRE MAGICA ([ACTION:NAV:AI_MAGIC]): Dadi delle storie, Caccia al tesoro, Cappello Magico.
            - CINEMA ([ACTION:NAV:VIDEOS]): Video musicali e cartoni originali.
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

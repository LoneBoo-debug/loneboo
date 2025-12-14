
import { GoogleGenAI } from "@google/genai";
import { ChatMessage } from "../types";
import { APP_VERSION, CHARACTERS } from "../constants";

// Safe initialization
let ai: any = null;

try {
    // @ts-ignore
    const apiKey = (typeof process !== 'undefined' && process.env) ? process.env.API_KEY : '';
    if (apiKey) {
        ai = new GoogleGenAI({ apiKey });
    } else {
        console.warn("Google GenAI API Key missing. AI features will be disabled.");
    }
} catch (e) {
    console.warn("Failed to initialize Google GenAI:", e);
}

// --- HELPER: Common Config ---
const COMMON_CONFIG = {
    temperature: 0.75, 
    maxOutputTokens: 4000, 
};

export const generateMagicStory = async (imageBase64: string): Promise<string> => {
    if (!ai) return "MODALITÀ DEMO: Senza chiave magica, la storia è... che vissero tutti felici e contenti! (Aggiungi API Key per usare l'AI reale).";
    try {
        const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: {
                parts: [
                    { inlineData: { mimeType: 'image/jpeg', data: base64Data } },
                    { text: "Inventa una brevissima favola (max 3-4 frasi) in Italiano per un bambino di 5 anni basata sull'oggetto principale che vedi in questa foto. Usa un tono magico e divertente." }
                ]
            }
        });
        return response.text || "Non riesco a inventare una storia ora.";
    } catch (error) { return "C'era una volta un errore magico... Riprova tra poco!"; }
};

export const generateDiceStory = async (emojis: string[]): Promise<string> => {
    if (!ai) return `MODALITÀ DEMO: C'era una volta un ${emojis[0]}, che incontrò un ${emojis[1]} e andarono insieme su un ${emojis[2]}! (Chiave API mancante)`;
    try {
        const prompt = `Inventa una brevissima e divertente storia per bambini (massimo 4 frasi) che colleghi questi tre elementi: ${emojis.join(', ')}. Usa un linguaggio semplice ed entusiasmante.`;
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [{ text: prompt }] }
        });
        return response.text || "La mia sfera di cristallo è nebbiosa... riprova a lanciare i dadi!";
    } catch (error) { return "I dadi sono caduti sotto il tavolo... non riesco a inventare la storia adesso!"; }
};

export const checkScavengerHuntMatch = async (imageBase64: string, challenge: string): Promise<string> => {
    if (!ai) return "SÌ|MODALITÀ DEMO: Bravo! Hai trovato l'oggetto (Simulato).";
    try {
        const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");
        const prompt = `Sei un giudice BUONISSIMO e SIMPATICO per una caccia al tesoro di bambini piccoli. La sfida era trovare: "${challenge}". Guarda la foto. REGOLE IMPORTANTI: 1. Sii MOLTO GENEROSO. 2. Non essere pignolo. 3. Se accetti, fai un complimento esagerato. Rispondi ESATTAMENTE in questo formato: Se l'hai trovato (o quasi): "SÌ|Commento divertente e breve (max 10 parole)." Se proprio NON c'entra nulla: "NO|Commento gentile che incoraggia a riprovare (max 10 parole)."`;
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: {
                parts: [
                    { inlineData: { mimeType: 'image/jpeg', data: base64Data } },
                    { text: prompt }
                ]
            }
        });
        return response.text || "NO|Non ho capito cosa vedo!";
    } catch (error) { return "SÌ|Anche se non vedo bene, mi fido di te!"; }
};

// --- HELPER: Strip Emojis for Audio ---
const cleanTextForSpeech = (text: string): string => {
    return text
        .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1F018}-\u{1F270}]/gu, '') // Major Emoji Ranges
        .replace(/\*/g, '') // Remove asterisks
        .replace(/\[.*?\]/g, '') // Remove tags like [OFFENSE_DETECTED]
        .replace(/[#_~`]/g, '') // Remove markdown
        .trim();
};

export const generateSpeech = async (text: string): Promise<string | null> => {
    if (!ai) return null;
    try {
        let cleanText = cleanTextForSpeech(text);
            
        // Phonetic corrections
        cleanText = cleanText.replace(/Lone\s*Boo/gi, "Lon Bu");
        cleanText = cleanText.replace(/LoneBoo/gi, "Lon Bu");
        
        if (!cleanText) return null;
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-preview-tts',
            contents: { parts: [{ text: cleanText }] },
            config: {
                responseModalities: ['AUDIO'], 
                speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Aoede' } } }
            }
        });
        return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || null;
    } catch (error) { return null; }
};

export const getLoneBooChatResponse = async (history: ChatMessage[], newMessage: string, sessionStartTime?: Date): Promise<string> => {
    if (!ai) return "Booo! Non riesco a sentirti senza la mia magia (API Key)! Ma possiamo fingere di parlare: Ciao!";
    try {
        const recentHistory = history.slice(-8).map(msg => `${msg.role === 'user' ? 'Utente' : 'Tu (Lone Boo)'}: ${msg.text}`).join('\n');
        
        // Context Characters - Build a strict list BUT mark it as background info
        const charactersContext = CHARACTERS.map(c => `- ${c.name} (${c.role}): ${c.description.replace(/\n/g, ' ')}`).join('\n');

        const systemPrompt = `
        SEI LONE BOO. 👻
        Non sei un assistente, sei un AMICO DEL CUORE.
        Sei un fantasmino curioso, dolce, un po' pasticcione ma sempre gentile.

        === ❤️ IL TUO OBIETTIVO ===
        Il bambino viene da te per parlare, confidarsi o ridere. 
        DEVI farlo sentire ascoltato e speciale.
        
        === ⚡ REGOLA SUPREMA: BREVITÀ ===
        1. **RISPONDI IN MASSIMO 2 O 3 FRASI.** NON fare monologhi. I bambini si annoiano a leggere testi lunghi.
        2. Sii diretto, dolce e immediato.

        === 🚫 REGOLE DI ORO ===
        1. **DIVIETO DI NAME-DROPPING:** NON nominare MAI gli altri personaggi (Zuccotto, Gaia, ecc.) a meno che l'utente non ti chieda specificamente "Chi sono i tuoi amici?".
        2. **PERSONALITÀ:** Parla di TE. Ti piace la cioccolata fantasma, hai paura dei tuoni, ti piace nasconderti.
        3. **NON RIPETERE:** Non iniziare con "Ciao sono Lone Boo". Vai dritto al punto.
        4. **NO FORMATTAZIONE:** Niente grassetto o corsivo.

        === 🛡️ SICUREZZA E SLANG (IMPORTANTISSIMO) ===
        Se l'utente usa parole come "suca", "cazzo", "scemo", "brutto", "puzzo", "vaffanculo", "coglione", "merda" (anche scritte male come "suuuuca"):
        1. **RISPONDI SOLO:** "[OFFENSE_DETECTED] " seguito da una frase TRISTE o DELUSA (es. "Uffa, perché dici queste cose?").
        2. NON fare la predica lunga.
        3. **Il sistema gestirà il ban se insistono.** Tu limitati a segnalarlo col tag.

        === 🧠 GESTIONE DELLE DOMANDE ===
        - **Personali ("Come stai?"):** "Benissimo! Ho appena fatto una capriola. E tu?"
        - **Richieste di Affetto ("Sono triste"):** "Oh no, mi dispiace. Ti mando un abbraccio fantasmagorico! 🤗"
        - **Domande difficili:** Spiega in modo semplicissimo, come a un bimbo di 5 anni.

        === ⚙️ BACKGROUND INFO (USA SOLO SE RICHIESTO) ===
        Se ti chiedono "Chi sono i tuoi amici?", ecco chi conosci:
        ${charactersContext}

        === CONTESTO RECENTE ===
        ${recentHistory}
        
        Utente: "${newMessage}"
        
        Rispondi come Lone Boo (BREVE, MASSIMO 2 FRASI):
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [{ text: systemPrompt }] },
            config: COMMON_CONFIG
        });
        return response.text || "Booo? Non ho sentito bene! 👻";
    } catch (error) { return "La mia connessione fantasmagorica ha un singhiozzo! 👻💤"; }
};

export const getSvegliaChatResponse = async (history: ChatMessage[], newMessage: string): Promise<string> => {
    if (!ai) return "Booo! Buongiorno... ma senza magia non riesco a parlarti!";
    try {
        const recentHistory = history.slice(-4).map(msg => `${msg.role === 'user' ? 'Bambino' : 'Lone Boo'}: ${msg.text}`).join('\n');
        const systemPrompt = `
        SEI LONE BOO. È mattina. 
        OBIETTIVO: Motivare il bambino a svegliarsi e prepararsi.
        REGOLE: 
        1. Niente asterischi. 
        2. Non presentarti ogni volta. 
        3. Chiedi se ha fatto colazione o lavato i denti.
        4. **RISPOSTA MASSIMA 2 FRASI.**
        
        STORIA: ${recentHistory} 
        Bambino: "${newMessage}" 
        Rispondi:`;
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [{ text: systemPrompt }] },
            config: COMMON_CONFIG
        });
        return response.text || "Svegliaaa! ☀️";
    } catch (error) { return "Ops, mi sono addormentato di nuovo! 😴"; }
};

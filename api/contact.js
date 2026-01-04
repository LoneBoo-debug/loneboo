
import { Resend } from 'resend';

export default async function handler(request, response) {
  // 1. Controllo Metodo
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Metodo non consentito' });
  }

  try {
    // 2. Controllo API Key
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error("Errore: RESEND_API_KEY non configurata su Vercel");
      return response.status(500).json({ error: 'Errore configurazione server' });
    }

    const resend = new Resend(apiKey);
    const { name, age, city, image } = request.body;

    // 3. Validazione Dati
    if (!name || !image) {
      return response.status(400).json({ error: 'Nome o immagine mancanti' });
    }

    // 4. Pulizia Base64 (Rimuove l'header se presente)
    const base64Content = image.includes(',') ? image.split(',')[1] : image;

    // 5. Invio Email
    const { data, error } = await resend.emails.send({
      from: 'Lone Boo World <onboarding@resend.dev>',
      to: ['artloneboo@protonmail.com'],
      subject: `🎨 Nuovo Disegno da ${name}!`,
      html: `
        <div style="font-family: sans-serif; color: #333; line-height: 1.6;">
          <h2 style="color: #8B5CF6;">Un nuovo piccolo artista ha inviato un disegno! 👻</h2>
          <p>Ecco i dettagli:</p>
          <ul style="list-style: none; padding: 0;">
            <li><strong>Nome:</strong> ${name}</li>
            <li><strong>Età:</strong> ${age || 'Non specificata'}</li>
            <li><strong>Città:</strong> ${city || 'Non specificata'}</li>
          </ul>
          <p>Trovi il disegno in allegato a questa email.</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 12px; color: #999;">Inviato automaticamente dall'App Lone Boo World</p>
        </div>
      `,
      attachments: [
        {
          filename: `disegno-${name.replace(/\s+/g, '_')}.jpg`,
          content: base64Content,
        },
      ],
    });

    if (error) {
      console.error("Resend Error:", error);
      return response.status(500).json({ error: error.message });
    }

    return response.status(200).json({ success: true });

  } catch (err) {
    console.error("Server Crash:", err);
    return response.status(500).json({ error: 'Errore interno del server' });
  }
}

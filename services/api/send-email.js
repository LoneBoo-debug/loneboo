import { Resend } from 'resend';

export default async function handler(request, response) {
  try {
    // 1. Controllo Ambiente
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error("Critical: RESEND_API_KEY is missing");
      return response.status(500).json({ error: 'Errore configurazione server' });
    }

    // 2. Controllo Metodo
    if (request.method !== 'POST') {
      return response.status(405).json({ error: 'Metodo non consentito' });
    }

    // 3. Inizializzazione Resend
    const resend = new Resend(apiKey);
    const { name, age, city, province, image } = request.body;

    // 4. Validazione Dati
    if (!image || !name) {
        return response.status(400).json({ error: 'Nome o immagine mancanti' });
    }

    // Preparazione Base64 per allegato
    const base64Content = image.includes(',') ? image.split(',')[1] : image;

    // 5. Invio Email
    const data = await resend.emails.send({
      from: 'Museo Lone Boo <onboarding@resend.dev>',
      to: ['artloneboo@protonmail.com'],
      subject: `🎨 Nuovo Disegno da ${name}!`,
      html: `
        <div style="font-family: sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: 0 auto; border: 4px solid #8B5CF6; padding: 20px; border-radius: 20px;">
          <h1 style="color: #8B5CF6; text-align: center;">Nuova Fan Art! 👻</h1>
          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 10px; margin-bottom: 20px;">
            <p style="margin: 5px 0;"><strong>Nome Artista:</strong> ${name}</p>
            <p style="margin: 5px 0;"><strong>Età:</strong> ${age || 'N/D'}</p>
            <p style="margin: 5px 0;"><strong>Città:</strong> ${city || 'N/D'} ${province ? `(${province})` : ''}</p>
          </div>
          <p style="text-align: center;">Trovi il capolavoro in allegato a questa email!</p>
          <hr style="border: 0; border-top: 2px dashed #8B5CF6; margin: 20px 0;" />
          <p style="font-size: 12px; color: #999; text-align: center;">Inviato dall'App Lone Boo World</p>
        </div>
      `,
      attachments: [
        {
          filename: `disegno-${name.replace(/\s+/g, '_')}.jpg`,
          content: base64Content,
        },
      ],
    });

    if (data.error) {
        console.error("Resend API Error:", data.error);
        return response.status(500).json({ error: data.error.message });
    }

    return response.status(200).json({ success: true, id: data.id });

  } catch (error) {
    console.error('Server Handler Error:', error);
    return response.status(500).json({ error: 'Errore interno del server' });
  }
}
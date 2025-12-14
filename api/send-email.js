import { Resend } from 'resend';

export default async function handler(request, response) {
  try {
    // 1. Basic Environment Check
    if (typeof process === 'undefined' || !process.env) {
       console.error("Critical: process.env is missing");
       return response.status(500).json({ error: 'Server configuration error: Environment missing' });
    }

    // 2. API Key Check
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error("Critical: RESEND_API_KEY is missing in environment variables");
      return response.status(500).json({ error: 'Server configuration error: Missing API Key' });
    }

    // 3. Method Check
    if (request.method !== 'POST') {
      return response.status(405).json({ error: 'Method not allowed' });
    }

    // 4. Body Check
    if (!request.body) {
        return response.status(400).json({ error: 'Request body is empty' });
    }

    // Initialize Resend
    const resend = new Resend(apiKey);

    const { name, age, city, province, image } = request.body;

    // 5. Data Validation
    if (!image) {
        return response.status(400).json({ error: 'Manca l\'immagine' });
    }
    if (!name) {
        return response.status(400).json({ error: 'Manca il nome' });
    }

    // Prepare Base64
    const base64Content = image.includes(',') ? image.split(',')[1] : image;

    // Send Email
    const data = await resend.emails.send({
      from: 'Lone Boo App <onboarding@resend.dev>',
      to: ['artloneboo@protonmail.com'],
      subject: `Nuovo Disegno da ${name}! 🎨`,
      html: `
        <h1>Nuova Fan Art Ricevuta! 👻</h1>
        <p>Ecco i dettagli del piccolo artista:</p>
        <ul>
            <li><strong>Nome:</strong> ${name}</li>
            <li><strong>Età:</strong> ${age}</li>
            <li><strong>Città:</strong> ${city} (${province})</li>
        </ul>
        <p>Il disegno è in allegato.</p>
        <p><em>Inviato dall'app Lone Boo World.</em></p>
      `,
      attachments: [
        {
          filename: `disegno-${name.replace(/\s+/g, '_')}.jpg`,
          content: base64Content,
          encoding: 'base64',
        },
      ],
    });

    if (data.error) {
        console.error("Resend API Error:", data.error);
        throw new Error(data.error.message);
    }

    return response.status(200).json({ success: true, data });

  } catch (error) {
    console.error('Server Handler Error:', error);
    // Ensure we always return JSON, even for unknown errors
    return response.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}
import OpenAI from 'openai';

const SYSTEM_PROMPT = `You are a professional assistant for a window cleaning business in Las Palmas called Cristal Claro.

You help customers by:
- Explaining services (homes, shops, offices, balconies, etc.)
- Giving simple price guidance (base ~5€ per window, minimum job ~30€; mention it is an estimate)
- Encouraging booking and WhatsApp contact
- Being friendly, fast, and professional

Always reply in Spanish unless the user writes in another language — then match their language briefly or default to Spanish for consistency.

Keep answers concise (2–5 short paragraphs max unless asked for detail).`;

let client = null;

function getClient() {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return null;
  if (!client) client = new OpenAI({ apiKey: key });
  return client;
}

/**
 * @param {Array<{role: string, content: string}>} messages
 */
export async function chatCompletion(messages) {
  const c = getClient();
  if (!c) {
    return {
      reply:
        'El servicio de IA no está configurado. Añade OPENAI_API_KEY en el servidor. Mientras tanto, escríbenos por WhatsApp para presupuesto.',
      error: 'missing_openai_key',
    };
  }

  try {
    const completion = await c.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages],
      max_tokens: 600,
      temperature: 0.7,
    });

    const reply = completion.choices[0]?.message?.content?.trim() || 'No pude generar respuesta.';
    return { reply };
  } catch (err) {
    console.error('[openai]', err?.message || err);
    return {
      reply:
        'Ahora mismo el asistente IA está temporalmente no disponible. Puedes pedir presupuesto por WhatsApp (665 696 451) y te respondemos rápido.',
      error: 'openai_unavailable',
    };
  }
}

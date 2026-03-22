import { Router } from 'express';
import { chatCompletion } from '../lib/openaiClient.js';

const router = Router();

/**
 * POST /chat
 * Body: { messages: [{ role: 'user'|'assistant', content: string }] }
 * Returns: { reply: string, error?: string }
 */
router.post('/', async (req, res) => {
  try {
    const { messages } = req.body || {};
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'messages array required' });
    }
    const trimmed = messages
      .filter((m) => m && typeof m.content === 'string')
      .slice(-20)
      .map((m) => ({
        role: m.role === 'assistant' ? 'assistant' : 'user',
        content: String(m.content).slice(0, 8000),
      }));

    const result = await chatCompletion(trimmed);
    res.json(result);
  } catch (err) {
    console.error('[chat]', err);
    res.status(500).json({
      reply: 'Error temporal. Intenta de nuevo o contacta por WhatsApp.',
      error: 'server_error',
    });
  }
});

export default router;

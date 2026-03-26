/**
 * Cristal Claro — API server
 * Endpoints: /chat, /lead, /leads (admin), /booking, /bookings (admin), /analytics (admin)
 */
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDb, leadsPerDay } from './lib/db.js';
import chatRouter from './routes/chat.js';
import { leadRouter, adminLeadsRouter } from './routes/leads.js';
import { bookingRouter, adminBookingsRouter } from './routes/bookings.js';
import { requireAdmin } from './middleware/adminAuth.js';

const app = express();
const PORT = process.env.PORT || 4000;

// CORS:
// - If CLIENT_ORIGIN is set, only allow those origins.
// - If it's not set (common on fresh Render envs), reflect the request origin so
//   the browser can call us from GitHub Pages without CORS failures.
const rawOrigins = process.env.CLIENT_ORIGIN;
const origins = rawOrigins
  ? rawOrigins
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
  : null;

app.use(
  cors({
    origin: origins || true,
    credentials: true,
  })
);
app.use(express.json({ limit: '1mb' }));

// Extra hardening for GitHub Pages -> Render requests:
// Some Render deployments end up without the expected CORS headers for the
// browser origin. We explicitly reflect the request origin and answer OPTIONS
// preflight so the frontend doesn't fail with "Algo salió mal".
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin) res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE,OPTIONS');

  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

// Root shows something useful (bare domain alone used to 404 as "Cannot GET /").
app.get('/', (_req, res) => {
  res.redirect(302, '/health');
});

app.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'cristal-claro-ai', ts: new Date().toISOString() });
});

app.use('/chat', chatRouter);
app.use('/lead', leadRouter);
app.use('/leads', adminLeadsRouter(requireAdmin));
app.use('/booking', bookingRouter);
app.use('/bookings', adminBookingsRouter(requireAdmin));

app.get('/analytics', requireAdmin, async (_req, res) => {
  try {
    const perDay = await leadsPerDay();
    res.json({ leadsPerDay: perDay });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'analytics failed' });
  }
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal error' });
});

await connectDb();

app.listen(PORT, () => {
  console.log(`Cristal Claro API listening on http://localhost:${PORT}`);
});

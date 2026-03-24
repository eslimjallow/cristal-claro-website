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

// CORS: allow Vite dev + production client URL
const origins = (process.env.CLIENT_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: origins,
    credentials: true,
  })
);
app.use(express.json({ limit: '1mb' }));

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

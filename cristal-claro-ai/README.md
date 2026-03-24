# Cristal Claro — AI Sales Agent (Chat + API)

Production-ready stack for **Cristal Claro** (Las Palmas): guided sales funnel, instant quotes, lead capture, bookings, OpenAI answers, WhatsApp links, and an admin dashboard.

## Structure

```
cristal-claro-ai/
├── client/          # React (Vite) + Tailwind — chat widget + /admin
├── server/          # Express API — chat, leads, bookings, analytics
└── README.md
```

## Features

| Feature | Description |
|--------|---------------|
| **Guided flow** | Presupuesto paso a paso + estimación de precio |
| **AI mode** | Preguntas libres vía OpenAI (español) |
| **Pricing** | 5€/ventana, +20% (3+ pisos), +15% (pértiga), mínimo 30€ |
| **Leads & bookings** | MongoDB o almacenamiento JSON local (`server/data/`) |
| **Admin** | `/admin` — leads, reservas, estados, analítica por día |
| **WhatsApp** | Botón + enlace con mensaje pre-rellenado |
| **i18n** | ES / EN en el chat (selector) |
| **Bonus** | Pitido al nuevo lead (panel admin, polling 30s) |

## Prerequisites

- **Node.js 18+**
- **OpenAI API key** (for AI mode)
- **MongoDB** (optional — without `MONGODB_URI`, data is saved to `server/data/*.json`)

---

## 1. Backend setup

```bash
cd server
cp .env.example .env
# Edit .env — set OPENAI_API_KEY, ADMIN_API_TOKEN, WHATSAPP_NUMBER, etc.
npm install
npm run dev
```

Server runs at **http://localhost:4000**

### Environment variables (`server/.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `PORT` | No | Default `4000` |
| `OPENAI_API_KEY` | Yes (for AI) | OpenAI key |
| `OPENAI_MODEL` | No | Default `gpt-4o-mini` |
| `OPENAI_MODEL_CANDIDATES` | No | Comma-separated failover list, e.g. `gpt-4o-mini,gpt-4o` |
| `MONGODB_URI` | No | If omitted, JSON files are used |
| `ADMIN_API_TOKEN` | Yes (admin) | Secret token for `/leads`, `/bookings`, `/analytics` |
| `CLIENT_ORIGIN` | No | CORS origin(s), comma-separated. Default `http://localhost:5173` |
| `WHATSAPP_NUMBER` | No | E.164 digits only, e.g. `34612345678` (used if you add server-side WA templates later) |

---

## 2. Frontend setup

```bash
cd client
cp .env.example .env
npm install
npm run dev
```

App runs at **http://localhost:5173**

Vite proxies **`/api/*`** → `http://localhost:4000/*` (see `client/vite.config.js`).

### Environment variables (`client/.env`)

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Leave **empty** locally (uses `/api` proxy). In production, set to your API base URL, e.g. `https://cristal-api.onrender.com` (no trailing slash) |
| `VITE_WHATSAPP_NUMBER` | Digits only, e.g. `34612345678` for `wa.me` links |

---

## 3. API endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/health` | No | Health check |
| POST | `/chat` | No | `{ messages: [{ role, content }] }` → `{ reply }` |
| POST | `/lead` | No | Create lead (body includes `phone`, quote fields…) |
| GET | `/leads` | Bearer `ADMIN_API_TOKEN` | List leads |
| PATCH | `/leads/:id/status` | Bearer | `{ status: new\|contacted\|booked }` |
| POST | `/booking` | No | Create booking |
| GET | `/bookings` | Bearer | List bookings |
| PATCH | `/bookings/:id/status` | Bearer | `{ status: requested\|confirmed\|cancelled }` |
| GET | `/analytics` | Bearer | `{ leadsPerDay: [{ date, count }] }` |

---

## 4. Deploy

### Frontend — Vercel

1. Root directory: `client`
2. Build: `npm run build`
3. Output: `dist`
4. Set env: `VITE_API_URL`, `VITE_WHATSAPP_NUMBER`
5. Add `vercel.json` rewrites so SPA routes (`/admin`) work:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

(`vercel.json` is included in `client/`.)

### Backend — Render / Railway / Fly.io

1. Root: `server`
2. Start: `npm start`
3. Set env vars (see table above)
4. Set `CLIENT_ORIGIN` to your Vercel URL (e.g. `https://tu-app.vercel.app`)

---

## 5. Admin panel

1. Open **https://your-site.com/admin** (or `http://localhost:5173/admin`)
2. Paste the same value as **`ADMIN_API_TOKEN`** from the server `.env`
3. Manage leads and bookings; analytics shows leads per calendar day

---

## Security notes

- Never commit `.env` files.
- Use a long random `ADMIN_API_TOKEN`.
- In production, always use HTTPS and restrict CORS with `CLIENT_ORIGIN`.

---

## License

Private / proprietary — Cristal Claro.

# Deploy Cristal Claro AI (chat + API)

Deploy the **API** and **React app** as two services, then link the URL in the main website’s `site-config.js`.

## 1. Deploy API (Render — free tier)

1. Push this repo to GitHub (including `cristal-claro-ai/server`).
2. [Render](https://render.com) → **New** → **Web Service** → connect the repo.
3. **Root directory:** `cristal-claro-ai/server`
4. **Build command:** `npm install`
5. **Start command:** `npm start`
6. **Environment** (Render → Environment):

| Key | Value |
|-----|--------|
| `OPENAI_API_KEY` | Your OpenAI key |
| `ADMIN_API_TOKEN` | Long random string (admin panel) |
| `CLIENT_ORIGIN` | Your Vercel chat URL + GitHub Pages URL, comma-separated, e.g. `https://cristal-claro-chat.vercel.app,https://eslimjallow.github.io` |
| `MONGODB_URI` | Optional — omit to use JSON files on disk |

7. After deploy, copy the API URL, e.g. `https://cristal-claro-api.onrender.com`

---

## 2. Deploy chat app (Vercel)

1. [Vercel](https://vercel.com) → **Add New** → **Project** → import the same repo.
2. **Root directory:** `cristal-claro-ai/client`
3. **Framework:** Vite  
4. **Environment variables:**

| Key | Value |
|-----|--------|
| `VITE_API_URL` | Your Render API URL (no `/api` suffix), e.g. `https://cristal-claro-api.onrender.com` |
| `VITE_WHATSAPP_NUMBER` | `34665696451` (digits only, same as main site) |

5. Deploy and copy the production URL, e.g. `https://cristal-claro-chat.vercel.app`

---

## 3. Link the main website (GitHub Pages)

1. Open **`site-config.js`** in the repo root (next to `index.html`).
2. Set:

```javascript
window.CRISTAL_CLARO_CHAT_URL = 'https://YOUR-VERCEL-URL.vercel.app';
```

3. Commit and push. The navbar, hero, and footer will show **Asistente IA** linking to your chat app.

---

## 4. CORS checklist

`CLIENT_ORIGIN` on the API must include:

- The exact Vercel URL (e.g. `https://xxx.vercel.app`)
- Your GitHub Pages origin if you ever call the API from the static site (this project calls the API **from the chat app only**, so Vercel URL is enough for chat + lead forms)

---

## 5. Admin panel

Open `https://YOUR-VERCEL-URL.vercel.app/admin` and log in with the same **`ADMIN_API_TOKEN`** you set on Render.

---

## Optional: `render.yaml`

If you use Render Blueprints, see `render.yaml` in this folder (adjust repo name if needed).

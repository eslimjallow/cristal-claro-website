# Enlazar el asistente IA con la web principal

No puedo desplegar en **tu** cuenta de Vercel/Render desde aquí (hace falta tu login y API keys). Sigue estos pasos:

## 1. Desplegar API + chat (React)

Instrucciones detalladas: **`cristal-claro-ai/DEPLOY.md`**

- **API (Render u otro):** carpeta `cristal-claro-ai/server`
- **Chat (Vercel u otro):** carpeta `cristal-claro-ai/client`  
  - Variables: `VITE_API_URL` (URL del API), `VITE_WHATSAPP_NUMBER=34665696451`

## 2. Conectar la web estática (GitHub Pages)

1. Copia la URL pública del chat (ej. `https://tu-proyecto.vercel.app`).
2. Abre **`site-config.js`** en la raíz del repo (junto a `index.html`).
3. Pon:

```javascript
window.CRISTAL_CLARO_CHAT_URL = 'https://tu-proyecto.vercel.app';
```

4. Haz `git add`, `commit` y `push` a GitHub.

Los enlaces **Asistente IA** (menú, hero y pie) solo se muestran si la URL empieza por `http://` o `https://`.

## 3. Archivos implicados

| Archivo | Uso |
|---------|-----|
| `site-config.js` | URL del chat desplegado |
| `site-config.example.js` | Plantilla de ejemplo |
| `index.html` | Carga `site-config.js` antes de `script.js` |

Si `CRISTAL_CLARO_CHAT_URL` está vacío, los enlaces al asistente **no se muestran** (evita enlaces rotos antes de desplegar).

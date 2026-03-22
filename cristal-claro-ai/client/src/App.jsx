import { useState } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import ChatWidget from './components/ChatWidget';
import AdminDashboard from './pages/AdminDashboard';
import { t } from './lib/i18n';

function Landing({ lang, onLangChange }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <p className="font-bold text-slate-900 text-lg">{t(lang, 'landingTitle')}</p>
            <p className="text-sm text-slate-600">{t(lang, 'landingSubtitle')}</p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={lang}
              onChange={(e) => onLangChange(e.target.value)}
              className="rounded-lg border border-slate-200 text-sm px-2 py-1"
            >
              <option value="es">ES</option>
              <option value="en">EN</option>
            </select>
            <Link
              to="/admin"
              className="text-sm text-brand-600 font-medium hover:underline"
            >
              {t(lang, 'admin')}
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1 max-w-5xl mx-auto px-4 py-12 w-full">
        <div className="rounded-3xl bg-gradient-to-br from-brand-50 to-white border border-brand-100 p-8 md:p-12 shadow-sm">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">
            Cristal Claro
          </h1>
          <p className="text-slate-600 max-w-xl mb-6">
            {t(lang, 'landingSubtitle')}
          </p>
          <ul className="space-y-2 text-sm text-slate-700 mb-8">
            <li>✓ Presupuesto instantáneo (5€/ventana, mínimo 30€)</li>
            <li>✓ Reserva de citas y captura de leads</li>
            <li>✓ Asistente IA para dudas sobre servicios</li>
            <li>✓ Las Palmas de Gran Canaria</li>
          </ul>
          <p className="text-sm text-slate-500">
            Usa el botón flotante para abrir el asistente comercial.
          </p>
        </div>
      </main>
      <footer className="border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} Cristal Claro · Las Palmas
      </footer>
      <ChatWidget lang={lang} onLangChange={onLangChange} />
    </div>
  );
}

export default function App() {
  const [lang, setLang] = useState('es');

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="*" element={<Landing lang={lang} onLangChange={setLang} />} />
      </Routes>
    </BrowserRouter>
  );
}

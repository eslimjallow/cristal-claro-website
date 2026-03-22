import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiUrl } from '../lib/api';

const TOKEN_KEY = 'cristalclaro_admin_token';

function playBeep() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.connect(g);
    g.connect(ctx.destination);
    o.frequency.value = 880;
    g.gain.value = 0.08;
    o.start();
    o.stop(ctx.currentTime + 0.12);
  } catch {
    /* ignore */
  }
}

async function authFetch(path, token, options = {}) {
  const res = await fetch(apiUrl(path), {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || res.statusText);
  }
  return res.json();
}

export default function AdminDashboard() {
  const [token, setToken] = useState(() => sessionStorage.getItem(TOKEN_KEY) || '');
  const [input, setInput] = useState('');
  const [leads, setLeads] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [analytics, setAnalytics] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const prevLeadCount = useRef(0);

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError('');
    try {
      const [l, b, a] = await Promise.all([
        authFetch('/leads', token),
        authFetch('/bookings', token),
        authFetch('/analytics', token),
      ]);
      const list = l.leads || [];
      if (prevLeadCount.current && list.length > prevLeadCount.current) {
        playBeep();
      }
      prevLeadCount.current = list.length;
      setLeads(list);
      setBookings(b.bookings || []);
      setAnalytics(a.leadsPerDay || []);
    } catch (e) {
      setError(e.message || 'Error');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!token) return;
    const id = setInterval(load, 30000);
    return () => clearInterval(id);
  }, [token, load]);

  const saveToken = (e) => {
    e.preventDefault();
    sessionStorage.setItem(TOKEN_KEY, input.trim());
    setToken(input.trim());
  };

  const logout = () => {
    sessionStorage.removeItem(TOKEN_KEY);
    setToken('');
    setInput('');
  };

  const patchLeadStatus = async (id, status) => {
    try {
      await authFetch(`/leads/${id}/status`, token, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
      await load();
    } catch (e) {
      setError(e.message);
    }
  };

  const patchBookingStatus = async (id, status) => {
    try {
      await authFetch(`/bookings/${id}/status`, token, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
      await load();
    } catch (e) {
      setError(e.message);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <form
          onSubmit={saveToken}
          className="w-full max-w-md rounded-2xl bg-white p-8 shadow-chat border border-slate-200"
        >
          <h1 className="text-xl font-bold text-slate-800 mb-2">Cristal Claro — Admin</h1>
          <p className="text-sm text-slate-600 mb-4">Introduce el token de API (ADMIN_API_TOKEN del servidor).</p>
          <input
            type="password"
            className="w-full rounded-xl border border-slate-200 px-3 py-2 mb-4 text-sm"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Token"
          />
          <button
            type="submit"
            className="w-full rounded-xl bg-brand-600 text-white py-2 text-sm font-semibold"
          >
            Entrar
          </button>
          <p className="mt-4 text-center">
            <Link to="/" className="text-sm text-brand-600">
              ← Volver al inicio
            </Link>
          </p>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Panel de administración</h1>
            <p className="text-sm text-slate-600">Leads, reservas y analítica básica</p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={load}
              className="rounded-xl bg-white border border-slate-200 px-4 py-2 text-sm"
              disabled={loading}
            >
              Actualizar
            </button>
            <button type="button" onClick={logout} className="rounded-xl bg-slate-800 text-white px-4 py-2 text-sm">
              Salir
            </button>
            <Link to="/" className="rounded-xl bg-brand-500 text-white px-4 py-2 text-sm inline-flex items-center">
              Web
            </Link>
          </div>
        </header>

        {error && (
          <div className="mb-4 rounded-xl bg-red-50 text-red-700 px-4 py-2 text-sm border border-red-100">{error}</div>
        )}

        <section className="mb-10">
          <h2 className="text-lg font-semibold text-slate-800 mb-3">Leads por día</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2">
            {analytics.length === 0 && <p className="text-sm text-slate-500">Sin datos aún.</p>}
            {analytics.map((row) => (
              <div key={row.date} className="rounded-xl bg-white border border-slate-200 p-3 text-center">
                <p className="text-xs text-slate-500">{row.date}</p>
                <p className="text-2xl font-bold text-brand-600">{row.count}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-lg font-semibold text-slate-800 mb-3">Leads ({leads.length})</h2>
          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-4 py-3">Nombre</th>
                  <th className="px-4 py-3">Teléfono</th>
                  <th className="px-4 py-3">Ventanas</th>
                  <th className="px-4 py-3">Precio est.</th>
                  <th className="px-4 py-3">Fecha deseada</th>
                  <th className="px-4 py-3">Estado</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr key={lead._id} className="border-t border-slate-100">
                    <td className="px-4 py-2">{lead.name || '—'}</td>
                    <td className="px-4 py-2 font-mono">{lead.phone}</td>
                    <td className="px-4 py-2">{lead.windows}</td>
                    <td className="px-4 py-2">{lead.priceEstimate != null ? `${lead.priceEstimate}€` : '—'}</td>
                    <td className="px-4 py-2">{lead.dateNeeded || '—'}</td>
                    <td className="px-4 py-2">
                      <select
                        value={lead.status || 'new'}
                        onChange={(e) => patchLeadStatus(lead._id, e.target.value)}
                        className="rounded-lg border border-slate-200 px-2 py-1 text-xs"
                      >
                        <option value="new">Nuevo</option>
                        <option value="contacted">Contactado</option>
                        <option value="booked">Reservado</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-800 mb-3">Reservas ({bookings.length})</h2>
          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-4 py-3">Nombre</th>
                  <th className="px-4 py-3">Teléfono</th>
                  <th className="px-4 py-3">Fecha</th>
                  <th className="px-4 py-3">Hora</th>
                  <th className="px-4 py-3">Estado</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b._id} className="border-t border-slate-100">
                    <td className="px-4 py-2">{b.name || '—'}</td>
                    <td className="px-4 py-2 font-mono">{b.phone}</td>
                    <td className="px-4 py-2">{b.date}</td>
                    <td className="px-4 py-2">{b.time || '—'}</td>
                    <td className="px-4 py-2">
                      <select
                        value={b.status || 'requested'}
                        onChange={(e) => patchBookingStatus(b._id, e.target.value)}
                        className="rounded-lg border border-slate-200 px-2 py-1 text-xs"
                      >
                        <option value="requested">Solicitada</option>
                        <option value="confirmed">Confirmada</option>
                        <option value="cancelled">Cancelada</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}

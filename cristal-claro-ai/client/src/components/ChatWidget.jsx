import { useEffect, useRef, useState } from 'react';
import { postChat, postLead, postBooking } from '../lib/api';
import { estimatePrice } from '../lib/pricing';
import { t } from '../lib/i18n';

const WA_MSG = 'Hola, quiero información sobre limpieza de ventanas';

function waUrl() {
  const n = import.meta.env.VITE_WHATSAPP_NUMBER || '665696451';
  let digits = String(n).replace(/\D/g, '');
  // If a local 9-digit ES number is provided, prepend country code for wa.me.
  if (digits.length === 9) digits = `34${digits}`;
  return `https://wa.me/${digits}?text=${encodeURIComponent(WA_MSG)}`;
}

function MessageBubble({ role, children }) {
  const isBot = role === 'bot';
  return (
    <div className={`flex ${isBot ? 'justify-start' : 'justify-end'} mb-3`}>
      <div
        className={`max-w-[88%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm ${
          isBot
            ? 'bg-white text-slate-800 border border-slate-100 rounded-bl-md'
            : 'bg-brand-500 text-white rounded-br-md'
        }`}
      >
        {children}
      </div>
    </div>
  );
}

export default function ChatWidget({ lang, onLangChange }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [flow, setFlow] = useState(null); // 'quote' | 'ai' | 'booking'
  const [quoteStep, setQuoteStep] = useState(0);
  const [bookingStep, setBookingStep] = useState(0);
  const [draft, setDraft] = useState({
    windows: '',
    propertyType: '',
    heightCategory: 'low',
    needsPole: false,
    location: '',
    dateNeeded: '',
    name: '',
    phone: '',
    email: '',
  });
  const [bookingDraft, setBookingDraft] = useState({
    name: '',
    phone: '',
    email: '',
    date: '',
    time: '',
    notes: '',
  });
  const [aiInput, setAiInput] = useState('');
  const [aiHistory, setAiHistory] = useState([]);
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef(null);

  // Allow deep-linking to open the chat automatically.
  // Example: https://.../chat/?open=1
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get('open') === '1') setOpen(true);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    requestAnimationFrame(() => {
      if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    });
  }, [messages, typing, open]);

  const pushUser = (text) => {
    setMessages((m) => [...m, { role: 'user', text }]);
  };
  const pushBot = (text) => {
    setMessages((m) => [...m, { role: 'bot', text }]);
  };

  const startSession = () => {
    setFlow(null);
    setQuoteStep(0);
    setBookingStep(0);
    setAiHistory([]);
    setDraft({
      windows: '',
      propertyType: '',
      heightCategory: 'low',
      needsPole: false,
      location: '',
      dateNeeded: '',
      name: '',
      phone: '',
      email: '',
    });
    setBookingDraft({ name: '', phone: '', email: '', date: '', time: '', notes: '' });
    setMessages([{ role: 'bot', text: t(lang, 'w1') }]);
  };

  useEffect(() => {
    if (!open) return;
    setMessages([{ role: 'bot', text: t(lang, 'w1') }]);
    setFlow(null);
    setQuoteStep(0);
    setBookingStep(0);
    setAiHistory([]);
    setAiInput('');
    setDraft({
      windows: '',
      propertyType: '',
      heightCategory: 'low',
      needsPole: false,
      location: '',
      dateNeeded: '',
      name: '',
      phone: '',
      email: '',
    });
    setBookingDraft({ name: '', phone: '', email: '', date: '', time: '', notes: '' });
  }, [open, lang]);

  const pricePreview = () =>
    estimatePrice({
      windows: Number(draft.windows) || 0,
      heightCategory: draft.heightCategory,
      needsPole: draft.needsPole,
    });

  const submitLead = async () => {
    setTyping(true);
    try {
      await postLead({
        name: draft.name,
        phone: draft.phone,
        email: draft.email,
        windows: Number(draft.windows) || 0,
        propertyType: draft.propertyType,
        heightCategory: draft.heightCategory,
        needsPole: draft.needsPole,
        location: draft.location,
        dateNeeded: draft.dateNeeded,
        source: 'chat',
      });
      const msg = t(lang, 'thanks', { name: draft.name || '—' });
      pushBot(msg);
      pushBot(
        <a
          href={waUrl()}
          target="_blank"
          rel="noreferrer"
          className="text-brand-600 underline font-medium"
        >
          WhatsApp →
        </a>
      );
      setFlow('done');
    } catch {
      pushBot(t(lang, 'errorGeneric'));
    } finally {
      setTyping(false);
    }
  };

  const sendAi = async () => {
    const text = aiInput.trim();
    if (!text) return;
    pushUser(text);
    setAiInput('');
    setTyping(true);
    const nextHist = [...aiHistory, { role: 'user', content: text }];
    try {
      const { reply } = await postChat(nextHist);
      pushBot(reply);
      setAiHistory([...nextHist, { role: 'assistant', content: reply }]);
    } catch {
      pushBot(t(lang, 'errorGeneric'));
    } finally {
      setTyping(false);
    }
  };

  const submitBooking = async () => {
    setTyping(true);
    try {
      await postBooking({
        name: bookingDraft.name,
        phone: bookingDraft.phone,
        email: bookingDraft.email,
        date: bookingDraft.date,
        time: bookingDraft.time,
        notes: bookingDraft.notes,
      });
      pushBot(t(lang, 'bookThanks'));
      setFlow('done');
    } catch {
      pushBot(t(lang, 'errorGeneric'));
    } finally {
      setTyping(false);
    }
  };

  /* ——— Choice row ——— */
  const ChoiceButtons = () => (
    <div className="flex flex-wrap gap-2 mt-2">
      <button
        type="button"
        onClick={() => {
          setFlow('quote');
          setQuoteStep(0);
          pushBot(t(lang, 'qWindows'));
        }}
        className="rounded-full bg-brand-500 text-white px-3 py-1.5 text-xs font-medium hover:bg-brand-600 transition"
      >
        {t(lang, 'btnQuote')}
      </button>
      <button
        type="button"
        onClick={() => {
          setFlow('ai');
          pushBot(t(lang, 'aiHint'));
        }}
        className="rounded-full bg-white border border-brand-200 text-brand-700 px-3 py-1.5 text-xs font-medium hover:bg-brand-50"
      >
        {t(lang, 'btnInfo')}
      </button>
      <button
        type="button"
        onClick={() => window.open(waUrl(), '_blank')}
        className="rounded-full bg-emerald-500 text-white px-3 py-1.5 text-xs font-medium hover:bg-emerald-600"
      >
        {t(lang, 'btnWa')}
      </button>
      <button
        type="button"
        onClick={() => {
          setFlow('booking');
          setBookingStep(0);
          pushBot(t(lang, 'bookingIntro'));
        }}
        className="rounded-full bg-slate-700 text-white px-3 py-1.5 text-xs font-medium hover:bg-slate-800"
      >
        {t(lang, 'btnBook')}
      </button>
    </div>
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-brand-500 text-white shadow-chat hover:bg-brand-600 transition hover:scale-105 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:ring-offset-2"
        aria-label={t(lang, 'openChat')}
      >
        <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-end sm:items-center sm:justify-end sm:p-6 pointer-events-none">
          <div
            className="pointer-events-auto flex h-[min(560px,92dvh)] w-full max-w-md flex-col overflow-hidden rounded-t-3xl border border-slate-200 bg-slate-50 shadow-chat sm:rounded-3xl"
            role="dialog"
            aria-modal="true"
          >
            <header className="flex items-center justify-between bg-gradient-to-r from-brand-500 to-brand-600 px-4 py-3 text-white">
              <div>
                <p className="font-semibold text-sm">Cristal Claro</p>
                <p className="text-[11px] text-brand-100">Las Palmas · {t(lang, 'lang')}</p>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={lang}
                  onChange={(e) => onLangChange(e.target.value)}
                  className="rounded-lg bg-white/20 text-xs text-white border-0 py-1 px-2"
                >
                  <option value="es">ES</option>
                  <option value="en">EN</option>
                </select>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-lg p-1 hover:bg-white/10"
                  aria-label={t(lang, 'close')}
                >
                  ✕
                </button>
              </div>
            </header>

            <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 py-4 scrollbar-thin">
              {messages.map((msg, i) => (
                <MessageBubble key={i} role={msg.role}>
                  {typeof msg.text === 'string' ? (
                    <span dangerouslySetInnerHTML={{ __html: msg.text.replace(/\n/g, '<br/>') }} />
                  ) : (
                    msg.text
                  )}
                </MessageBubble>
              ))}
              {messages.length === 1 && flow === null && <ChoiceButtons />}
              {typing && (
                <div className="text-xs text-slate-400 px-2 mb-2 flex items-center gap-1">
                  <span className="inline-flex gap-0.5">
                    <span className="animate-bounce">●</span>
                    <span className="animate-bounce delay-75">●</span>
                    <span className="animate-bounce delay-150">●</span>
                  </span>
                  {t(lang, 'typing')}
                </div>
              )}
            </div>

            {/* Quote flow controls */}
            {flow === 'quote' && (
              <div className="border-t border-slate-200 bg-white px-3 py-3 space-y-2">
                {quoteStep === 0 && (
                  <div className="flex gap-2">
                    <input
                      type="number"
                      min={1}
                      className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm"
                      placeholder="12"
                      value={draft.windows}
                      onChange={(e) => setDraft((d) => ({ ...d, windows: e.target.value }))}
                    />
                    <button
                      type="button"
                      className="rounded-xl bg-brand-500 text-white px-4 py-2 text-sm font-medium"
                      onClick={() => {
                        pushUser(draft.windows || '—');
                        setQuoteStep(1);
                        pushBot(t(lang, 'qProperty'));
                      }}
                    >
                      OK
                    </button>
                  </div>
                )}
                {quoteStep === 1 && (
                  <div className="flex flex-wrap gap-2">
                    {[
                      ['casa', t(lang, 'propCasa')],
                      ['apartamento', t(lang, 'propApto')],
                      ['local', t(lang, 'propLocal')],
                    ].map(([val, label]) => (
                      <button
                        key={val}
                        type="button"
                        className="rounded-full border border-slate-200 px-3 py-1.5 text-xs"
                        onClick={() => {
                          setDraft((d) => ({ ...d, propertyType: val }));
                          pushUser(label);
                          setQuoteStep(2);
                          pushBot(t(lang, 'qHeight'));
                        }}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                )}
                {quoteStep === 2 && (
                  <div className="flex flex-wrap gap-2">
                    {[
                      ['ground', t(lang, 'hGround')],
                      ['low', t(lang, 'hLow')],
                      ['high', t(lang, 'hHigh')],
                    ].map(([val, label]) => (
                      <button
                        key={val}
                        type="button"
                        className="rounded-full border border-slate-200 px-3 py-1.5 text-xs"
                        onClick={() => {
                          setDraft((d) => ({ ...d, heightCategory: val }));
                          pushUser(label);
                          setQuoteStep(3);
                          pushBot(t(lang, 'qAccess'));
                        }}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                )}
                {quoteStep === 3 && (
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      className="rounded-full border border-slate-200 px-3 py-1.5 text-xs"
                      onClick={() => {
                        setDraft((d) => ({ ...d, needsPole: false }));
                        pushUser(t(lang, 'accEasy'));
                        setQuoteStep(4);
                        pushBot(t(lang, 'qLocation'));
                      }}
                    >
                      {t(lang, 'accEasy')}
                    </button>
                    <button
                      type="button"
                      className="rounded-full border border-slate-200 px-3 py-1.5 text-xs"
                      onClick={() => {
                        setDraft((d) => ({ ...d, needsPole: true }));
                        pushUser(t(lang, 'accPole'));
                        setQuoteStep(4);
                        pushBot(t(lang, 'qLocation'));
                      }}
                    >
                      {t(lang, 'accPole')}
                    </button>
                  </div>
                )}
                {quoteStep === 4 && (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm"
                      value={draft.location}
                      onChange={(e) => setDraft((d) => ({ ...d, location: e.target.value }))}
                      placeholder="Las Palmas"
                    />
                    <button
                      type="button"
                      className="rounded-xl bg-brand-500 text-white px-4 py-2 text-sm"
                      onClick={() => {
                        pushUser(draft.location || '—');
                        setQuoteStep(5);
                        pushBot(t(lang, 'qDate'));
                      }}
                    >
                      OK
                    </button>
                  </div>
                )}
                {quoteStep === 5 && (
                  <div className="flex gap-2">
                    <input
                      type="date"
                      className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm"
                      value={draft.dateNeeded}
                      onChange={(e) => setDraft((d) => ({ ...d, dateNeeded: e.target.value }))}
                    />
                    <button
                      type="button"
                      className="rounded-xl bg-brand-500 text-white px-4 py-2 text-sm"
                      onClick={() => {
                        pushUser(draft.dateNeeded || '—');
                        const est = pricePreview();
                        setQuoteStep(6);
                        pushBot(
                          <>
                            {t(lang, 'priceLabel')}{' '}
                            <strong>{est}€</strong>
                          </>
                        );
                      }}
                    >
                      OK
                    </button>
                  </div>
                )}
                {quoteStep === 6 && (
                  <button
                    type="button"
                    className="w-full rounded-xl bg-brand-600 text-white py-2 text-sm font-medium"
                    onClick={() => {
                      setQuoteStep(7);
                      pushBot(t(lang, 'leadIntro'));
                    }}
                  >
                    {t(lang, 'nextStep')}
                  </button>
                )}
                {quoteStep === 7 && (
                  <div className="space-y-2">
                    <input
                      type="text"
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                      placeholder={t(lang, 'leadName')}
                      value={draft.name}
                      onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
                    />
                    <input
                      type="tel"
                      required
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                      placeholder={t(lang, 'leadPhone')}
                      value={draft.phone}
                      onChange={(e) => setDraft((d) => ({ ...d, phone: e.target.value }))}
                    />
                    <input
                      type="email"
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                      placeholder={t(lang, 'leadEmail')}
                      value={draft.email}
                      onChange={(e) => setDraft((d) => ({ ...d, email: e.target.value }))}
                    />
                    <button
                      type="button"
                      disabled={!draft.phone.trim()}
                      className="w-full rounded-xl bg-emerald-500 text-white py-2 text-sm font-medium disabled:opacity-50"
                      onClick={() => {
                        pushUser(`${draft.name} · ${draft.phone}`);
                        submitLead();
                      }}
                    >
                      {t(lang, 'submitLead')}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* AI mode */}
            {flow === 'ai' && (
              <div className="border-t border-slate-200 bg-white px-3 py-3 flex gap-2">
                <input
                  type="text"
                  className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm"
                  placeholder={t(lang, 'placeholderAi')}
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendAi()}
                />
                <button
                  type="button"
                  onClick={sendAi}
                  className="rounded-xl bg-brand-500 text-white px-4 py-2 text-sm font-medium"
                >
                  {t(lang, 'send')}
                </button>
              </div>
            )}

            {/* Booking */}
            {flow === 'booking' && bookingStep === 0 && (
              <div className="border-t border-slate-200 bg-white px-3 py-3 space-y-2">
                <input
                  type="text"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                  placeholder={t(lang, 'bookName')}
                  value={bookingDraft.name}
                  onChange={(e) => setBookingDraft((d) => ({ ...d, name: e.target.value }))}
                />
                <input
                  type="tel"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                  placeholder={t(lang, 'bookPhone')}
                  value={bookingDraft.phone}
                  onChange={(e) => setBookingDraft((d) => ({ ...d, phone: e.target.value }))}
                />
                <input
                  type="email"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                  placeholder={t(lang, 'bookEmail')}
                  value={bookingDraft.email}
                  onChange={(e) => setBookingDraft((d) => ({ ...d, email: e.target.value }))}
                />
                <input
                  type="date"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                  value={bookingDraft.date}
                  onChange={(e) => setBookingDraft((d) => ({ ...d, date: e.target.value }))}
                />
                <input
                  type="time"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                  value={bookingDraft.time}
                  onChange={(e) => setBookingDraft((d) => ({ ...d, time: e.target.value }))}
                />
                <textarea
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                  rows={2}
                  placeholder={t(lang, 'bookNotes')}
                  value={bookingDraft.notes}
                  onChange={(e) => setBookingDraft((d) => ({ ...d, notes: e.target.value }))}
                />
                <button
                  type="button"
                  disabled={!bookingDraft.phone.trim() || !bookingDraft.date}
                  className="w-full rounded-xl bg-brand-600 text-white py-2 text-sm font-medium disabled:opacity-50"
                  onClick={submitBooking}
                >
                  {t(lang, 'submitBook')}
                </button>
              </div>
            )}

            <footer className="border-t border-slate-100 px-3 py-2 flex justify-between items-center bg-slate-50">
              <button
                type="button"
                className="text-xs text-brand-600"
                onClick={() => {
                  startSession();
                }}
              >
                {t(lang, 'backMenu')}
              </button>
              <a href={waUrl()} target="_blank" rel="noreferrer" className="text-xs text-emerald-600">
                WhatsApp
              </a>
            </footer>
          </div>
        </div>
      )}
    </>
  );
}

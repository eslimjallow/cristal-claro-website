/**
 * Cristal Claro — Chat app URL.
 * Uses GitHub Pages /chat app; backend API is configured separately.
 */
window.CRISTAL_CLARO_CHAT_URL = 'https://eslimjallow.github.io/cristal-claro-website/chat/';

// Make the "Asistente IA" button work even if other JS fails.
// This runs immediately when `site-config.js` loads.
(function () {
  var url = (window.CRISTAL_CLARO_CHAT_URL || '').trim();
  var ok = /^https?:\/\//i.test(url);
  document.querySelectorAll('[data-chat-link]').forEach(function (el) {
    if (ok) {
      el.href = url;
      el.classList.remove('chat-app-hidden');
    } else {
      el.classList.add('chat-app-hidden');
      el.removeAttribute('href');
    }
  });
})();

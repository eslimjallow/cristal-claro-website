/**
 * Runtime API base on production (GitHub Pages). Local dev leaves this unset so Vite proxies /api → localhost:4000.
 */
(function () {
  var h = window.location.hostname;
  var isLocal = h === 'localhost' || h === '127.0.0.1';
  if (!isLocal) {
    window.__CRISTAL_API_URL__ = 'https://cristal-claro-website.onrender.com';
  }
})();

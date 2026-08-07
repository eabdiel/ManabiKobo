const CACHE_NAME = "manabi-kobo-shell-v2";
const SHELL_ASSETS = [
  "/static/css/design-tokens.css",
  "/static/css/app.css",
  "/static/css/workbench.css",
  "/static/js/app.js",
  "/static/js/workbench-core.js",
  "/static/js/install-app.js",
  "/static/css/language-ide.css",
  "/static/js/language-ide.js",
  "/static/icons/favicon.ico",
  "/static/icons/apple-touch-icon.png",
  "/static/icons/android-chrome-192x192.png",
  "/static/icons/android-chrome-512x512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL_ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
    )).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  const requestUrl = new URL(event.request.url);
  if (requestUrl.origin !== self.location.origin) return;

  if (requestUrl.pathname.startsWith("/static/")) {
    event.respondWith(
      caches.match(event.request).then((cached) => cached || fetch(event.request).then((response) => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        return response;
      }))
    );
  }
});

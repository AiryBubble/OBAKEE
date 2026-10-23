const CACHE_NAME = "static-cache-v5";
const FILES_TO_CACHE = [
  "/index.html",
  "/style.css",
  "/BIZUDPGothic-Regular.woff2",
  "/favicon.webp",
  "/icons/apple-touch-icon.png",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/icons/maskable-512.png",
  "/Banner.webp",
  "/app/index.html",
  "/app/pwgen/index.html",
  "/app/qrgen/index.html",
  "/app/qrgen/qrcode.js",
  "/app/qrgen/jquery.js",
  "/app/uidgen/index.html",
  "/app/uidgen/uidgen.js",
  "/app/webtools/index.html",
  "/app/webtools/webtools.js",
  "/app/securitytxt/index.html",
  "/app/securitytxt/securitytxt.js",
  "/app/roulette/index.html",
  "/app/roulette/roulette.js",
  "/app/unicode/index.html",
  "/app/unicode/unicode.js",
  "/app/hue/index.html",
  "/app/pngedit/index.html",
  "/app/webrtc/index.html",
  "/app/hookdel/index.html",
  "/app/twmr/index.html"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keyList) =>
      Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const requestUrl = new URL(event.request.url);
  if (event.request.method !== "GET" || requestUrl.origin !== self.location.origin) return;

  event.respondWith(
    caches.match(event.request).then(async (response) => {
      if (response) return response;
      try {
        return await fetch(event.request);
      } catch (error) {
        return new Response("Offline", { status: 503, statusText: "Offline" });
      }
    })
  );
});
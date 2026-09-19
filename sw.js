const CACHE_NAME = "static-cache-v1";
const FILES_TO_CACHE = [
  "/index.html",
  "/style.css",
  "/BIZUDPGothic-Regular.woff2",
  "/favicon.webp",
  "/Banner.webp",
  "/app/index.html",
  "/app/pwgen/index.html",
  "/app/qrgen/index.html",
  "/app/qrgen/qrcode.js",
  "/app/qrgen/jquery.js",
  "/app/uidgen/index.html",
  "/app/hue/index.html",
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
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

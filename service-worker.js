
const CACHE_NAME = "study-planner-v3";

const FILES_TO_CACHE = [
    "./",
    "./index.html",
    "./style.css",
    "./script.js",
    "./manifest.webmanifest",
    "./icons/icon-192.png",
    "./icons/icon-512.png"
];

const INDEX_URL = new URL("./index.html", self.registration.scope).href;

// INSTALL
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(FILES_TO_CACHE))
            .then(() => self.skipWaiting())
    );
});

// ACTIVATE
self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) =>
            Promise.all(
                cacheNames
                    .filter((name) => name !== CACHE_NAME)
                    .map((name) => caches.delete(name))
            )
        ).then(() => self.clients.claim())
    );
});

// FETCH
self.addEventListener("fetch", (event) => {
    const request = event.request;

    if (request.method !== "GET") return;

    if (request.mode === "navigate") {
        event.respondWith(
            fetch(request).catch(() =>
                caches.match(INDEX_URL)
            )
        );
        return;
    }

    event.respondWith(
        caches.match(request).then((cachedResponse) =>
            cachedResponse || fetch(request)
        )
    );
});

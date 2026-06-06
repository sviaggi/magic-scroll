// Magic Scroll — Service Worker v2
// Handles three tiers of assets:
//   1. App shell (HTML, abcjs) — pre-cached at install, always served from cache
//   2. Fonts & theme images — cached on first use, served from cache thereafter
//   3. Soundfont (large binary) — cached on first use, streamed from network first

const CACHE_VERSION = 'magic-scroll-v2';

// Pre-cached at install — must all exist for the app to work offline
const SHELL_FILES = [
  './Magic Scroll v0.9.9.5.html',
  './abcjs-basic.js',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './apple-touch-icon.png',
];

// Cached on first use — app works without these (CSS colour fallback applies)
// Include whichever of these files exist in your package.
const OPTIONAL_FILES = [
  // Custom fonts (local files distributed with the app)
  './SunnyDay.otf',
  './GotischD.otf',
  './GotischSchmuck.otf',
  // Theme background images
  './parchment.jpg', './parchment.png',
  './dark.jpg',      './dark.png',
  './green.jpg',     './green.png',
  './session.jpg',   './session.png',
  // Fallback web fonts from fonts/ subfolder (produced by download-assets.js)
  './fonts/courier-prime-400.woff2',
  './fonts/courier-prime-400italic.woff2',
  './fonts/courier-prime-700.woff2',
  './fonts/playfair-display-400.woff2',
  './fonts/playfair-display-400italic.woff2',
  './fonts/playfair-display-700.woff2',
  './fonts/im-fell-english-400.woff2',
  './fonts/im-fell-english-400italic.woff2',
];

// ── Install ───────────────────────────────────────────────────────────────────
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_VERSION).then(function(cache) {
      // Shell: must succeed
      return cache.addAll(SHELL_FILES).then(function() {
        // Optionals: cache whatever exists, silently skip missing files
        return Promise.allSettled(
          OPTIONAL_FILES.map(function(url) {
            return fetch(url, { method: 'HEAD' }).then(function(res) {
              if (res.ok) return cache.add(url);
            }).catch(function() {});
          })
        );
      });
    }).then(function() { return self.skipWaiting(); })
  );
});

// ── Activate ──────────────────────────────────────────────────────────────────
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(k) { return k !== CACHE_VERSION; })
            .map(function(k)   { return caches.delete(k); })
      );
    }).then(function() { return self.clients.claim(); })
  );
});

// ── Fetch ─────────────────────────────────────────────────────────────────────
self.addEventListener('fetch', function(event) {
  if (event.request.method !== 'GET') return;

  var url = event.request.url;

  // Google Fonts: stale-while-revalidate
  // Serve from cache instantly, update cache in background
  if (url.includes('fonts.googleapis.com') || url.includes('fonts.gstatic.com')) {
    event.respondWith(
      caches.open(CACHE_VERSION).then(function(cache) {
        return cache.match(event.request).then(function(cached) {
          var networkFetch = fetch(event.request).then(function(response) {
            if (response.ok) cache.put(event.request, response.clone());
            return response;
          }).catch(function() { return cached; });
          // Return cached immediately if available, otherwise wait for network
          return cached || networkFetch;
        });
      })
    );
    return;
  }

  // Soundfont (large binary): network-first, cache on first successful load
  // Don't pre-cache — 50-150 MB would block install
  if (url.includes('Soundfont') || url.endsWith('.sf2') || url.endsWith('.sfz')) {
    event.respondWith(
      caches.open(CACHE_VERSION).then(function(cache) {
        return cache.match(event.request).then(function(cached) {
          if (cached) return cached;
          return fetch(event.request).then(function(response) {
            if (response.ok) {
              // Clone before consuming: cache it for next offline use
              cache.put(event.request, response.clone());
            }
            return response;
          });
        });
      })
    );
    return;
  }

  // App shell + theme images + fonts: cache-first
  event.respondWith(
    caches.match(event.request).then(function(cached) {
      return cached || fetch(event.request).then(function(response) {
        if (response.ok) {
          var clone = response.clone();
          caches.open(CACHE_VERSION).then(function(c) { c.put(event.request, clone); });
        }
        return response;
      });
    })
  );
});

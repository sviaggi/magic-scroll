// Magic Scroll — Service Worker v3
// Fixes offline support: shell files now cached dynamically from the
// installing page's URL, so renaming the HTML file never breaks caching.

const CACHE_VERSION = 'magic-scroll-v8';

// ── Install ───────────────────────────────────────────────────────────────────
// Strategy: cache-on-navigate for the HTML shell (so renaming never breaks it),
// plus explicit pre-cache for known companion files.
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_VERSION).then(function(cache) {

      // 0. Cache whichever HTML page triggered this install, so the installed
      //    app launches offline regardless of the filename.
      var pagePromise = self.clients.matchAll({ includeUncontrolled: true, type: 'window' })
        .then(function(clients) {
          return Promise.allSettled(clients.map(function(client) {
            return cache.add(client.url).catch(function() {});
          }));
        }).catch(function() {});

      // 1. Companion files we know exist alongside the HTML
      var companions = [
        './backing-track.js',
        './chord-engine.js',
        './abcjs-basic.js',
        './manifest.json',
        './icon-192.png',
        './icon-512.png',
        './apple-touch-icon.png',
      ];
      var companionPromise = Promise.allSettled(
        companions.map(function(url) {
          return cache.add(url).catch(function() {});
        })
      );

      // 2. Optional assets (fonts, theme images) — cache whatever exists
      var optional = [
        './SunnyDay.otf',
        './GotischD.otf',
        './GotischSchmuck.otf',
        './parchment.jpg', './parchment.png',
        './dark.jpg',      './dark.png',
        './green.jpg',     './green.png',
        './session.jpg',   './session.png',
        './fonts/courier-prime-400.woff2',
        './fonts/courier-prime-400italic.woff2',
        './fonts/courier-prime-700.woff2',
        './fonts/playfair-display-400.woff2',
        './fonts/playfair-display-400italic.woff2',
        './fonts/playfair-display-700.woff2',
        './fonts/im-fell-english-400.woff2',
        './fonts/im-fell-english-400italic.woff2',
      ];
      var optionalPromise = Promise.allSettled(
        optional.map(function(url) {
          return fetch(url, { method: 'HEAD' })
            .then(function(r) { if (r.ok) return cache.add(url); })
            .catch(function() {});
        })
      );

      return Promise.all([pagePromise, companionPromise, optionalPromise]);
    }).then(function() {
      // Activate immediately — don't wait for old tabs to close
      return self.skipWaiting();
    })
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
    }).then(function() {
      // Claim all open tabs immediately
      return self.clients.claim();
    })
  );
});

// ── Fetch ─────────────────────────────────────────────────────────────────────
self.addEventListener('fetch', function(event) {
  if (event.request.method !== 'GET') return;

  var url = event.request.url;

  // ── Google Fonts: stale-while-revalidate ──────────────────────────────────
  if (url.includes('fonts.googleapis.com') || url.includes('fonts.gstatic.com')) {
    event.respondWith(
      caches.open(CACHE_VERSION).then(function(cache) {
        return cache.match(event.request).then(function(cached) {
          var network = fetch(event.request).then(function(res) {
            if (res.ok) cache.put(event.request, res.clone());
            return res;
          }).catch(function() { return cached; });
          return cached || network;
        });
      })
    );
    return;
  }

  // ── Soundfont (large binary): network-first, cache on first load ──────────
  if (url.includes('Soundfont') || url.endsWith('.sf2') || url.endsWith('.sfz')) {
    event.respondWith(
      caches.open(CACHE_VERSION).then(function(cache) {
        return cache.match(event.request).then(function(cached) {
          if (cached) return cached;
          return fetch(event.request).then(function(res) {
            if (res.ok) cache.put(event.request, res.clone());
            return res;
          });
        });
      })
    );
    return;
  }

  // ── Everything else: cache-first, populate cache on first fetch ───────────
  // This covers the HTML file regardless of its name, plus all other assets.
  // On first online visit the page loads normally and gets cached.
  // On subsequent visits (online or offline) it's served from cache instantly.
  event.respondWith(
    caches.open(CACHE_VERSION).then(function(cache) {
      return cache.match(event.request).then(function(cached) {
        if (cached) {
          // Revalidate in the background so the cache stays fresh
          fetch(event.request).then(function(res) {
            if (res && res.ok) cache.put(event.request, res.clone());
          }).catch(function() {});
          return cached;
        }
        // Not in cache — fetch and store for next time
        return fetch(event.request).then(function(res) {
          if (res && res.ok) cache.put(event.request, res.clone());
          return res;
        });
      });
    })
  );
});

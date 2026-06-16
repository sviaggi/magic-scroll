// Magic Scroll — Service Worker v3
// Fixes offline support: shell files now cached dynamically from the
// installing page's URL, so renaming the HTML file never breaks caching.

const CACHE_VERSION = 'magic-scroll-v1.0.0';

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
        // Audio engine + bundled FluidR3 soundfonts (primary, higher quality)
        './sounds/WebAudioFontPlayer.js',
        './sounds/0000_FluidR3_GM_sf2_file.js',
        './sounds/0240_FluidR3_GM_sf2_file.js',
        './sounds/0330_FluidR3_GM_sf2_file.js',
        './sounds/12800_0_FluidR3_GM_sf2_file.js',
        // Aspirin backup fonts (loaded only if a FluidR3 font fails)
        './sounds/0000_Aspirin_sf2_file.js',
        './sounds/0240_Aspirin_sf2_file.js',
        './sounds/0330_Aspirin_sf2_file.js',
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
        './Valeson-ExtBla.otf',
        './SunnyDay.otf',
        './GotischD.otf',
        './GotischSchmuck.otf',
        './parchment.jpg', './parchment.png',
        './obsidian.png',
        './mossy.png',
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

  // ── Soundfont (large binary): cache-first, cache on first load ────────────
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

  // ── Everything else: NETWORK-FIRST ────────────────────────────────────────
  // Always fetch the freshest copy when online (so edits to the HTML/JS appear
  // on the very next reload), falling back to cache only when offline.
  event.respondWith(
    caches.open(CACHE_VERSION).then(function(cache) {
      return fetch(event.request).then(function(res) {
        if (res && res.ok) cache.put(event.request, res.clone());
        return res;
      }).catch(function() {
        return cache.match(event.request);
      });
    })
  );
});

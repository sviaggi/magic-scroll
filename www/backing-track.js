/**
 * backing-track.js  v4.1  —  Magic Scroll Backing Track Engine
 *
 * Audio:  WebAudioFont (MIT)  https://github.com/surikov/webaudiofont
 *   Player:  sounds/WebAudioFontPlayer.js  (bundled locally)
 *   Fonts:   sounds/*.js  tried first; on miss, fetched from CDN and
 *            cached in IndexedDB so the app works offline after first use.
 *   License: sounds/LICENSE.txt
 *
 * Public API (window globals):
 *   btStart()          start from bar 0
 *   btStop()           stop + reset to bar 0
 *   btIsRunning()      → boolean
 *   btGetSong()        → song object (or null)
 *   btOpenBar(song)    show player bar bound to <song>
 *   btCloseBar()       hide bar + stop
 *   btLoaded           true once this file executed
 *   BT_INSTRUMENTS     extensible registry — push to add instruments
 */
(function () {
  'use strict';

  var SOUNDS    = 'sounds/';
  var CDN       = 'https://cdn.jsdelivr.net/gh/surikov/webaudiofont/npm/dist/';
  var DB_NAME   = 'MagicScrollFonts';
  var DB_VER    = 2;
  var LOOKAHEAD = 0.35;
  var TICK_MS   = 100;

  // Primary fonts: FluidR3 (higher quality, bundled in sounds/).
  // `fb` = fallback to the original lightweight Aspirin font if the FluidR3
  // one fails to load/decode. If BOTH fail, playback drops to the oscillator
  // synth (see _drum/_note below) so the app is never silent.
  var FONTS = {
    piano:  { file:'0000_FluidR3_GM_sf2_file.js',    v:'_tone_0000_FluidR3_GM_sf2_file',
              fb:{ file:'0000_Aspirin_sf2_file.js',    v:'_tone_0000_Aspirin_sf2_file'    } },
    guitar: { file:'0240_FluidR3_GM_sf2_file.js',    v:'_tone_0240_FluidR3_GM_sf2_file',
              fb:{ file:'0240_Aspirin_sf2_file.js',    v:'_tone_0240_Aspirin_sf2_file'    } },
    bass:   { file:'0330_FluidR3_GM_sf2_file.js',    v:'_tone_0330_FluidR3_GM_sf2_file',
              fb:{ file:'0330_Aspirin_sf2_file.js',    v:'_tone_0330_Aspirin_sf2_file'    } },
    drums:  { file:'12800_0_FluidR3_GM_sf2_file.js', v:'_tone_12800_0_FluidR3_GM_sf2_file',
              fb:{ file:'12800_0_Aspirin_sf2_file.js', v:'_tone_12800_0_Aspirin_sf2_file' } },
  };

  // State
  var _running    = false;
  var _paused     = false;
  var _pausedBar  = 0;
  var _bt_song    = null;
  var _waf        = null;
  var _fontReady  = {};
  var _fontVar    = {};   // key → global var name that actually loaded (FluidR3 or Aspirin fallback)
  var _playerReady = false;
  var _schedID    = null;
  var _schedBar   = 0;
  var _schedNext  = 0;
  var _displayBar = 0;
  var _totalBars  = 0;
  var _bars_cache = null;
  var _barMeters  = null;    // effective {num,denom} per cached bar (for mid-song meter changes)
  var _transpose  = 0;       // semitone offset from main app
  var _bt_state   = {};

  // ── Audio context ────────────────────────────────────────────────────────────
  function _ctx() {
    return typeof getSharedAudioCtx === 'function' ? getSharedAudioCtx()
         : null;
  }

  // ── Reverb master bus ────────────────────────────────────────────────────────
  // All instruments play through a shared dry + convolution-reverb bus so notes
  // blend together and abrupt sample tails are softened by the reverb decay.
  var _master = null, _masterCtx = null;
  function _makeImpulse(ctx, seconds, decay) {
    var rate = ctx.sampleRate, len = Math.max(1, Math.floor(rate * seconds));
    var buf = ctx.createBuffer(2, len, rate);
    for (var c = 0; c < 2; c++) {
      var d = buf.getChannelData(c);
      for (var i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay);
    }
    return buf;
  }
  function _getMaster(ctx) {
    if (_master && _masterCtx === ctx) return _master;
    try {
      var input = ctx.createGain();
      var dry   = ctx.createGain(); dry.gain.value = 0.88;
      var wet   = ctx.createGain(); wet.gain.value = 1.0;
      var conv  = ctx.createConvolver(); conv.buffer = _makeImpulse(ctx, 2.0, 2.6);
      input.connect(dry);  dry.connect(ctx.destination);
      input.connect(conv); conv.connect(wet); wet.connect(ctx.destination);
      _master = input; _masterCtx = ctx;
      return input;
    } catch (e) { return ctx.destination; }
  }

  // ── BPM / time-sig helpers (read from OWN bar controls) ─────────────────────
  function _bpm() {
    var el = document.getElementById('bt-tempo');
    return (el ? parseInt(el.value) : 0) || 120;
  }
  function _parseSig(val) {
    var p = String(val || '').split('/');
    return { num: parseInt(p[0]) || 4, denom: parseInt(p[1]) || 4 };
  }
  // Value of the Meter control. 'auto' = follow the sheet's per-bar meter changes.
  function _meterSelVal() {
    var el = document.getElementById('bt-time-sig');
    return el ? el.value : '4/4';
  }
  function _barTimeSig() {
    var val = _meterSelVal();
    if (val === 'auto') return _songInitialSig();
    return _parseSig(val);
  }
  function _nb()     { return _barTimeSig().num; }
  function _denom()  { return _barTimeSig().denom; }
  function _bs()     { return 60 / _bpm(); }

  // Distinct time signatures appearing in the current song's chart (in order).
  function _songMeterSet() {
    var out = [];
    if (_bt_song && _bt_song.ireal_chart && _bt_song.ireal_chart.bars) {
      _bt_song.ireal_chart.bars.forEach(function(b) {
        if (b && b.timeChange && out.indexOf(b.timeChange) === -1) out.push(b.timeChange);
      });
    }
    return out;
  }
  // The song's opening meter (first explicit change), else 4/4.
  function _songInitialSig() {
    var set = _songMeterSet();
    return set.length ? _parseSig(set[0]) : { num: 4, denom: 4 };
  }
  // Build a per-bar effective meter array, carrying each timeChange forward.
  function _computeBarMeters(bars) {
    var out = [], cur = _songInitialSig();
    for (var i = 0; i < bars.length; i++) {
      var b = bars[i];
      if (b && b.timeChange) cur = _parseSig(b.timeChange);
      out.push(cur);
    }
    return out;
  }
  // Effective meter for a scheduled bar: a manual selection overrides the sheet;
  // otherwise ('auto') follow the precomputed per-bar meter.
  function _meterForBar(bi) {
    var sel = _meterSelVal();
    if (sel && sel !== 'auto') return _parseSig(sel);
    if (_barMeters && _barMeters[bi]) return _barMeters[bi];
    return _songInitialSig();
  }
  // Set the Meter control to match the song: 'N/A' (auto) when it has multiple
  // meters, the single meter when there's exactly one, else default 4/4.
  function _initMeterControl() {
    var sel = document.getElementById('bt-time-sig');
    if (!sel) return;
    var set = _songMeterSet();
    var target;
    if (set.length > 1) target = 'auto';
    else if (set.length === 1) {
      var has = Array.prototype.some.call(sel.options, function(o) { return o.value === set[0]; });
      target = has ? set[0] : 'auto';
    } else target = '4/4';
    sel.value = target;
  }

  // ── IndexedDB font cache ─────────────────────────────────────────────────────
  var _db = null;
  function _openDB(cb) {
    if (_db) { cb(_db); return; }
    try {
      var r = indexedDB.open(DB_NAME, DB_VER);
      r.onupgradeneeded = function(e) { e.target.result.createObjectStore('fonts'); };
      r.onsuccess       = function(e) { _db = e.target.result; cb(_db); };
      r.onerror         = function()  { cb(null); };
    } catch(e) { cb(null); }
  }
  function _dbGet(key, cb) {
    _openDB(function(db) {
      if (!db) { cb(null); return; }
      try {
        var req = db.transaction('fonts','readonly').objectStore('fonts').get(key);
        req.onsuccess = function(e) { cb(e.target.result || null); };
        req.onerror   = function()  { cb(null); };
      } catch(e) { cb(null); }
    });
  }
  function _dbPut(key, val) {
    _openDB(function(db) {
      if (!db) return;
      try { db.transaction('fonts','readwrite').objectStore('fonts').put(val, key); } catch(e) {}
    });
  }

  // ── Script loading helpers ───────────────────────────────────────────────────
  function _runText(text, cb) {
    try {
      var blob = new Blob([text], { type:'application/javascript' });
      var url  = URL.createObjectURL(blob);
      var s    = document.createElement('script');
      s.src    = url;
      s.onload  = function() { URL.revokeObjectURL(url); cb(true);  };
      s.onerror = function() { URL.revokeObjectURL(url); cb(false); };
      document.head.appendChild(s);
    } catch(e) { cb(false); }
  }
  function _loadTag(src, cb) {
    var s     = document.createElement('script');
    s.src     = src;
    s.onload  = function() { cb(true);  };
    s.onerror = function() { cb(false); };
    document.head.appendChild(s);
  }

  // ── Font loading: local → IndexedDB → CDN ───────────────────────────────────
  // Load one font variant ({file, v}) via local sounds/ → IndexedDB → CDN.
  // cb(true) only if the expected global variable is present afterwards.
  function _loadVariant(variant, cb) {
    if (window[variant.v]) { cb(true); return; }
    _loadTag(SOUNDS + variant.file, function(ok) {
      if (ok && window[variant.v]) { cb(true); return; }
      _dbGet(variant.file, function(cached) {
        if (cached) { _runText(cached, function(ok2) { cb(ok2 && !!window[variant.v]); }); return; }
        fetch(CDN + variant.file)
          .then(function(r) { return r.ok ? r.text() : Promise.reject(r.status); })
          .then(function(text) { _dbPut(variant.file, text); _runText(text, function(ok3) { cb(ok3 && !!window[variant.v]); }); })
          .catch(function() { cb(false); });
      });
    });
  }

  // Load an instrument: try the high-quality primary font, then fall back to
  // the original default soundfont. Reports the global var name that loaded
  // (or null if both failed → caller uses the synth).
  function _loadFont(key, cb) {
    var f = FONTS[key];
    if (!f) { cb(null); return; }
    _loadVariant(f, function(ok) {
      if (ok) { cb(f.v); return; }
      if (f.fb) { _loadVariant(f.fb, function(ok2) { cb(ok2 ? f.fb.v : null); }); }
      else { cb(null); }
    });
  }

  function _initPlayer(done) {
    if (_playerReady) { done(); return; }
    function loadWAF(cb) {
      if (typeof WebAudioFontPlayer !== 'undefined') { cb(); return; }
      _loadTag(SOUNDS + 'WebAudioFontPlayer.js', function(ok) {
        if (ok) { cb(); return; }
        _loadTag(CDN + 'WebAudioFontPlayer.js', cb);
      });
    }
    loadWAF(function() {
      if (typeof WebAudioFontPlayer !== 'undefined') _waf = new WebAudioFontPlayer();
      var audioCtx = _ctx();
      var keys = Object.keys(FONTS);
      var pending = keys.length;
      keys.forEach(function(k) {
        _loadFont(k, function(varName) {
          if (varName && _waf && audioCtx && window[varName]) {
            try { _waf.loader.decodeAfterLoading(audioCtx, varName); } catch(e) {}
            _fontVar[k]   = varName;
            _fontReady[k] = true;
          }
          if (--pending === 0) { _playerReady = true; done(); }
        });
      });
    });
  }

  // ── MIDI helpers ─────────────────────────────────────────────────────────────
  var _NM = { C:0,'C#':1,Db:1,D:2,'D#':3,Eb:3,E:4,F:5,'F#':6,Gb:6,G:7,'G#':8,Ab:8,A:9,'A#':10,Bb:10,B:11 };
  function _clean(r) { return (r||'').replace(/♯/g,'#').replace(/♭/g,'b'); }
  function _midi(root, oct) { var pc = _NM[_clean(root)]; return pc !== undefined ? (oct+1)*12 + pc : 60; }
  function _tmidi(root, oct) { return _midi(root, oct) + (_transpose || 0); }
  var _QI = {
    '':[0,4,7],maj:[0,4,7],M:[0,4,7],m:[0,3,7],min:[0,3,7],'-':[0,3,7],
    '7':[0,4,7,10],maj7:[0,4,7,11],M7:[0,4,7,11],'Δ':[0,4,7,11],'Δ7':[0,4,7,11],'^7':[0,4,7,11],
    m7:[0,3,7,10],min7:[0,3,7,10],'-7':[0,3,7,10],dim:[0,3,6],dim7:[0,3,6,9],'°7':[0,3,6,9],
    'ø':[0,3,6,10],'ø7':[0,3,6,10],m7b5:[0,3,6,10],aug:[0,4,8],'+':[0,4,8],
    sus2:[0,2,7],sus4:[0,5,7],'6':[0,4,7,9],m6:[0,3,7,9],
    '9':[0,4,7,10,14],maj9:[0,4,7,11,14],m9:[0,3,7,10,14],'11':[0,4,7,10,14],'13':[0,4,7,10,14],
  };
  function _chordNotes(root, qual, bassNote, oct) {
    var base  = _midi(root, oct);
    var ivs   = (_QI[qual] || [0,4,7]).slice(0, 4);
    var notes = ivs.map(function(i) { return base + i; });
    notes = notes.map(function(n) { return n > base + 14 ? n - 12 : n; });
    var t = _transpose || 0;
    notes = notes.map(function(n) { return n + t; });
    if (bassNote) { var bm = _midi(bassNote, oct-1) + t; if (bm !== notes[0]) notes.unshift(bm); }
    return notes;
  }

  // ── Drum MIDI note numbers ───────────────────────────────────────────────────
  var D = { kick:36, snare:38, rim:37, hh:42, hho:46, ride:51, crash:49 };

  // ── Synthesis fallback ───────────────────────────────────────────────────────
  function _synDrum(ctx, dest, when, type, vol) {
    if (type === 'kick') {
      var o = ctx.createOscillator(), g = ctx.createGain();
      o.connect(g); g.connect(dest);
      o.frequency.setValueAtTime(150, when);
      o.frequency.exponentialRampToValueAtTime(30, when + 0.25);
      g.gain.setValueAtTime(vol * 0.9, when);
      g.gain.exponentialRampToValueAtTime(0.0001, when + 0.35);
      o.start(when); o.stop(when + 0.36);
    } else if (type === 'snare' || type === 'rim') {
      var len = Math.ceil(ctx.sampleRate * 0.12);
      var buf = ctx.createBuffer(1, len, ctx.sampleRate);
      var d   = buf.getChannelData(0);
      for (var i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
      var src = ctx.createBufferSource(), f = ctx.createBiquadFilter(), gn = ctx.createGain();
      f.type = 'bandpass'; f.frequency.value = type === 'rim' ? 800 : 3000;
      src.buffer = buf; src.connect(f); f.connect(gn); gn.connect(dest);
      gn.gain.setValueAtTime(vol * (type === 'rim' ? 0.35 : 0.5), when);
      gn.gain.exponentialRampToValueAtTime(0.0001, when + 0.1);
      src.start(when); src.stop(when + 0.13);
    } else {
      var isO = (type === 'hho' || type === 'crash');
      var l2  = Math.ceil(ctx.sampleRate * (isO ? 0.22 : 0.05));
      var b2  = ctx.createBuffer(1, l2, ctx.sampleRate);
      var d2  = b2.getChannelData(0);
      for (var j = 0; j < l2; j++) d2[j] = Math.random() * 2 - 1;
      var s2 = ctx.createBufferSource(), hf = ctx.createBiquadFilter(), hg = ctx.createGain();
      hf.type = 'highpass'; hf.frequency.value = type === 'ride' ? 5000 : 9000;
      s2.buffer = b2; s2.connect(hf); hf.connect(hg); hg.connect(dest);
      hg.gain.setValueAtTime(vol * 0.25, when);
      hg.gain.exponentialRampToValueAtTime(0.0001, when + (isO ? 0.20 : 0.04));
      s2.start(when); s2.stop(when + (isO ? 0.22 : 0.06));
    }
  }
  function _synNote(ctx, dest, midi, when, dur, vol) {
    var osc = ctx.createOscillator(), g = ctx.createGain();
    osc.connect(g); g.connect(dest); osc.type = 'triangle';
    osc.frequency.value = 440 * Math.pow(2, (midi - 69) / 12);
    g.gain.setValueAtTime(0, when);
    g.gain.linearRampToValueAtTime(vol * 0.3, when + 0.01);
    g.gain.setValueAtTime(vol * 0.3, when + dur * 0.7);
    g.gain.exponentialRampToValueAtTime(0.0001, when + dur);
    osc.start(when); osc.stop(when + dur + 0.05);
  }

  function _drum(ctx, dest, when, midiNote, synType, vol) {
    if (_waf && _fontReady.drums && window[_fontVar.drums]) {
      try { _waf.queueWaveTable(ctx, dest, window[_fontVar.drums], when, midiNote, 0.5, vol); return; } catch(e) {}
    }
    _synDrum(ctx, dest, when, synType, vol);
  }
  function _note(fk, ctx, dest, when, midi, dur, vol) {
    if (_waf && _fontReady[fk] && _fontVar[fk] && window[_fontVar[fk]]) {
      try { _waf.queueWaveTable(ctx, dest, window[_fontVar[fk]], when, midi, dur, vol); return; } catch(e) {}
    }
    _synNote(ctx, dest, midi, when, dur, vol);
  }

  // ── Drum patterns ─────────────────────────────────────────────────────────────
  // fn(nb, denom) → [[stepIdx, midiNote, synthType, amp], ...]
  // Grid resolution: nb*4 steps per bar (16th notes)
  var DRUM_PATTERNS = {
    'Rock': function(nb, dm) {
      var p = [];
      if (nb === 3) {
        p.push([0,D.kick,'kick',1.0],[4,D.snare,'snare',0.88],[8,D.snare,'snare',0.82]);
        for (var s=0; s<12; s++) p.push([s, D.hh, 'hh', 0.36 + s%2*0.1]);
        return p;
      }
      if (nb === 6 && dm === 8) {
        [0,12].forEach(function(s) { p.push([s,D.kick,'kick',1.0]); });
        [8,20].forEach(function(s) { p.push([s,D.snare,'snare',0.85]); });
        for (var s6=0; s6<24; s6+=4) p.push([s6, D.hh, 'hh', 0.38]);
        return p;
      }
      for (var b=0; b<nb; b++) {
        var isK  = (b===0) || (nb>=4 && b===Math.floor(nb/2));
        var isSn = (nb<=2&&b===1)||(nb===3&&b>0)||(nb>=4&&(b===1||b===3))||(nb===5&&(b===1||b===3||b===4));
        if (isK)  p.push([b*4, D.kick,  'kick',  1.0]);
        if (isSn) p.push([b*4, D.snare, 'snare', 0.88]);
        for (var s=0; s<4; s++) p.push([b*4+s, D.hh, 'hh', 0.36 + s%2*0.1]);
      }
      return p;
    },
    'Jazz': function(nb, dm) {
      var p = [];
      if (nb === 3) {
        [[0,0.62],[3,0.42],[4,0.58],[7,0.42],[8,0.58],[11,0.42]].forEach(function(x) { p.push([x[0],D.ride,'ride',x[1]]); });
        p.push([0,D.kick,'kick',0.48],[8,D.snare,'snare',0.30]);
        return p;
      }
      if (nb === 6 && dm === 8) {
        for (var b6=0; b6<6; b6++) p.push([b6*4, D.ride, 'ride', 0.55]);
        p.push([0,D.kick,'kick',0.50],[12,D.kick,'kick',0.38]);
        p.push([8,D.snare,'snare',0.28],[20,D.snare,'snare',0.28]);
        return p;
      }
      for (var b=0; b<nb; b++) {
        p.push([b*4, D.ride, 'ride', 0.62]);
        p.push([b*4+3, D.ride, 'ride', 0.42]);
        if (b===0) p.push([0, D.kick, 'kick', 0.45]);
        if (b===1||b===3) p.push([b*4, D.snare, 'snare', 0.28]);
      }
      return p;
    },
    'Bossa Nova': function(nb, dm) {
      var p = [];
      if (nb === 4) {
        [0,4,6,8,12,14].forEach(function(s) { p.push([s, D.rim, 'rim', 0.52]); });
        p.push([0,D.kick,'kick',0.78],[8,D.kick,'kick',0.58]);
        p.push([4,D.hh,'hh',0.32],[12,D.hh,'hh',0.32]);
        return p;
      }
      for (var b=0; b<nb; b++) {
        if (b%2===0) p.push([b*4, D.kick, 'kick', 0.72]);
        p.push([b*4, D.rim, 'rim', 0.48],[b*4+2, D.rim, 'rim', 0.38]);
      }
      return p;
    },
    'Latin': function(nb, dm) {
      var p = [];
      for (var b=0; b<nb; b++) {
        p.push([b*4,D.kick,'kick',0.82],[b*4+1,D.rim,'rim',0.58],
               [b*4+2,D.snare,'snare',0.74],[b*4+3,D.rim,'rim',0.48],
               [b*4,D.hh,'hh',0.28],[b*4+2,D.hh,'hh',0.22]);
      }
      return p;
    },
    'Ballad': function(nb, dm) {
      var p = [];
      if (nb === 3) {
        p.push([0,D.kick,'kick',0.80],[4,D.hh,'hh',0.25],[8,D.hh,'hh',0.22]);
        return p;
      }
      if (nb === 6 && dm === 8) {
        for (var b6=0; b6<6; b6++) {
          if (b6===0) p.push([0, D.kick, 'kick', 0.82]);
          if (b6===3) p.push([12, D.snare, 'snare', 0.68]);
          p.push([b6*4, D.hh, 'hh', 0.24]);
          if (b6===2||b6===5) p.push([b6*4, D.hho, 'hho', 0.16]);
        }
        return p;
      }
      p.push([0, D.kick, 'kick', 0.80]);
      if (nb >= 4) p.push([8, D.kick, 'kick', 0.55]);
      for (var b=0; b<nb; b++) {
        if (b%2===1) p.push([b*4, D.snare, 'snare', 0.68]);
        p.push([b*4, D.hh, 'hh', 0.24],[b*4+2, D.hh, 'hh', 0.18]);
        if (b===nb-1) p.push([b*4+3, D.hho, 'hho', 0.14]);
      }
      return p;
    },
    'Waltz': function(nb, dm) {
      var p = [], n = nb % 3 === 0 ? nb : 3;
      p.push([0, D.kick, 'kick', 0.88]);
      for (var b=1; b<n; b++) p.push([b*4, D.hh, 'hh', b===1 ? 0.30 : 0.26]);
      return p;
    },
    '5/4': function(nb, dm) {
      var p = [];
      [0,12,20].forEach(function(s) { p.push([s, D.kick, 'kick', s===0 ? 1.0 : 0.78]); });
      [4,8,16].forEach(function(s)  { p.push([s, D.hh,   'hh',  0.35]); });
      p.push([8,D.snare,'snare',0.82],[16,D.snare,'snare',0.78]);
      for (var s=0; s<20; s+=2) p.push([s, D.hh, 'hh', 0.28]);
      return p;
    },
    '7/8': function(nb, dm) {
      var p = [];
      [0,12,20].forEach(function(s) { p.push([s, D.kick, 'kick', s===0 ? 1.0 : 0.80]); });
      p.push([8,D.snare,'snare',0.82],[16,D.snare,'snare',0.78]);
      for (var s=0; s<28; s+=4) p.push([s, D.hh, 'hh', 0.32]);
      return p;
    },
  };

  // ── Instrument schedulers ─────────────────────────────────────────────────────
  function _chords(bar) {
    if (!bar) return [];
    if (bar._playChords && bar._playChords.length) return bar._playChords;  // carried-forward % / slash bar
    return bar.chords.filter(function(c) { return c.type === 'chord'; });
  }

  function scheduleDrums(ctx, dest, bars, bi, t0, barDur, state, nb, denom) {
    var patKey = state.pattern;
    if (nb===5 && denom===4 && !DRUM_PATTERNS[patKey]) patKey = '5/4';
    if (nb===7 && denom===8 && !DRUM_PATTERNS[patKey]) patKey = '7/8';
    var fn      = DRUM_PATTERNS[patKey] || DRUM_PATTERNS['Ballad'];
    var steps   = fn(nb, denom);
    var stepDur = barDur / (nb * 4);
    steps.forEach(function(st) {
      var when = t0 + st[0] * stepDur;
      if (when >= t0) _drum(ctx, dest, when, st[1], st[2], st[3] * state.volume);
    });
  }

  function scheduleKeys(ctx, dest, bars, bi, t0, barDur, state, nb, denom) {
    var bar = bars[bi]; if (!bar) return;
    var ch  = _chords(bar); if (!ch.length) return;
    var vol = state.volume * 0.65, bd = barDur / nb, pat = state.pattern;
    function play(c, when, dur) {
      _chordNotes(c.root, c.qual, c.bass, 4).forEach(function(m) { _note('piano', ctx, dest, when, m, dur*0.88, vol); });
    }
    if      (pat === 'Whole note')  { play(ch[0], t0, barDur); }
    else if (pat === 'Half notes')  { play(ch[0], t0, barDur*0.5); play(ch.length>1?ch[1]:ch[0], t0+barDur*0.5, barDur*0.5); }
    else if (pat === 'Offbeat')     { play(ch[0], t0+bd*0.5, barDur*0.82); }
    else if (pat === 'Comp') {
      play(ch[0], t0, bd*0.85); play(ch[0], t0+bd*1.5, bd*0.75);
      if (nb >= 4) play(ch.length>1?ch[1]:ch[0], t0+bd*3, bd*0.85);
    }
    else if (pat === 'Arpeggio') {
      var an0 = _chordNotes(ch[0].root, ch[0].qual, ch[0].bass, 4);
      var aLad = an0.concat([an0[0] + 12]);                 // climb up to the octave
      var aSeq = aLad.concat(aLad.slice(1, -1).reverse());  // then back down (no repeated ends)
      var steps = Math.max(8, nb * 2), sd = barDur / steps;
      for (var ai = 0; ai < steps; ai++)
        _note('piano', ctx, dest, t0 + ai * sd, aSeq[ai % aSeq.length], sd * 1.7, vol);
    }
    else if (pat === 'Ballad roll') {
      var bn = _chordNotes(ch[0].root, ch[0].qual, ch[0].bass, 3);
      _note('piano', ctx, dest, t0, bn[0], barDur * 0.95, vol);            // sustained low root
      var up = _chordNotes(ch[0].root, ch[0].qual, null, 4);
      var st2 = barDur / Math.max(3, up.length);
      up.forEach(function(m, i) { _note('piano', ctx, dest, t0 + i * st2, m, st2 * 1.9, vol * 0.8); });
    }
  }

  function scheduleBass(ctx, dest, bars, bi, t0, barDur, state, nb, denom) {
    var bar = bars[bi]; if (!bar) return;
    var ch  = _chords(bar); if (!ch.length) return;
    var vol = state.volume * 0.82, bd = barDur / nb, pat = state.pattern, oct = 2;
    function playR(c, when, dur, v) { _note('bass', ctx, dest, when, _tmidi(c.bass||c.root, oct), dur*0.82, v||vol); }
    if      (pat === 'Root')        { playR(ch[0], t0, barDur*0.9); }
    else if (pat === 'Root–5') {
      var r5 = _tmidi(ch[0].root, oct);
      _note('bass', ctx, dest, t0,            r5,   bd*0.82, vol);
      _note('bass', ctx, dest, t0+bd*(nb>=4?2:1), r5+7, bd*0.82, vol);
    } else if (pat === 'Octave pump') {
      for (var b=0; b<nb; b++) {
        var c = ch[Math.min(Math.floor(b*ch.length/nb), ch.length-1)];
        _note('bass', ctx, dest, t0+b*bd, _tmidi(c.root, b%2===0 ? oct : oct+1), bd*0.82, vol);
      }
    } else if (pat === 'Walking') {
      var r0 = _tmidi(ch[0].root, oct), f0 = r0 + 7;
      var nxt = bars[(bi+1) % bars.length], nch = _chords(nxt);
      var app = nch.length ? _tmidi(nch[0].root, oct) - 1 : r0 + 11;
      if (nb === 4) {
        _note('bass',ctx,dest,t0,      r0,  bd*0.82,vol);  _note('bass',ctx,dest,t0+bd,  r0+2,bd*0.82,vol*0.85);
        _note('bass',ctx,dest,t0+bd*2, f0,  bd*0.82,vol);  _note('bass',ctx,dest,t0+bd*3,app, bd*0.82,vol*0.9);
      } else if (nb === 3) {
        _note('bass',ctx,dest,t0,      r0, bd*0.82,vol); _note('bass',ctx,dest,t0+bd, f0,  bd*0.82,vol*0.85);
        _note('bass',ctx,dest,t0+bd*2, app,bd*0.82,vol*0.9);
      } else { playR(ch[0], t0, barDur*0.9); }
    }
  }

  function scheduleGuitar(ctx, dest, bars, bi, t0, barDur, state, nb, denom) {
    var bar = bars[bi]; if (!bar) return;
    var ch  = _chords(bar); if (!ch.length) return;
    var vol = state.volume * 0.72, bd = barDur / nb, pat = state.pattern, oct = 3;
    function playG(c, when, dur) {
      _chordNotes(c.root, c.qual, null, oct).slice(0, 3).forEach(function(m) {
        _note('guitar', ctx, dest, when, m, dur*0.90, vol);
      });
    }
    if (pat === 'Strum') {
      for (var b=0; b<nb; b++) playG(ch[Math.min(Math.floor(b*ch.length/nb),ch.length-1)], t0+b*bd, bd*0.88);
    } else if (pat === 'Comp') {
      playG(ch[0], t0, bd*0.85); playG(ch[0], t0+bd*1.5, bd*0.75);
      if (nb >= 4) playG(ch.length>1?ch[1]:ch[0], t0+bd*3, bd*0.82);
    } else if (pat === 'Arpeggio') {
      var gA = _chordNotes(ch[0].root, ch[0].qual, null, oct);
      var gLad = gA.concat([gA[0] + 12]);
      var gSeq = gLad.concat(gLad.slice(1, -1).reverse());  // up then down
      var gSteps = Math.max(8, nb * 2), gnd = barDur / gSteps;
      for (var gi = 0; gi < gSteps; gi++)
        _note('guitar', ctx, dest, t0 + gi * gnd, gSeq[gi % gSeq.length], gnd * 1.6, vol);
    } else if (pat === 'Offbeat') {
      for (var b2=1; b2<nb; b2+=2)
        playG(ch[Math.min(Math.floor(b2*ch.length/nb),ch.length-1)], t0+b2*bd, bd*0.82);
    } else if (pat === 'Fingerpick') {
      var fn = _chordNotes(ch[0].root, ch[0].qual, null, oct), low = fn[0], hi = fn.slice(1);
      var steps = Math.max(4, nb * 2), sd = barDur / steps;
      for (var fi = 0; fi < steps; fi++) {
        if (fi % 2 === 0) _note('guitar', ctx, dest, t0 + fi * sd, low, sd * 1.9, vol);
        else { var hm = hi[Math.floor(fi / 2) % hi.length] || low; _note('guitar', ctx, dest, t0 + fi * sd, hm, sd * 1.9, vol * 0.85); }
      }
    }
  }

  // ── Instrument registry ───────────────────────────────────────────────────────
  // Instrument labels route through t() at build time (see _buildBTBar's
  // BT_INSTRUMENTS.forEach below) rather than being translated here, since
  // t() may not be defined yet this early if script load order ever changes
  // — .label stays the English fallback key text either way.
  var BT_INSTRUMENTS = [
    { id:'drums',  label:'Drums',  fontKey:'drums',
      patterns: Object.keys(DRUM_PATTERNS), defaultPattern:'Ballad',     defaultVol:0.70, schedule:scheduleDrums  },
    { id:'keys',   label:'Keys',   fontKey:'piano',
      patterns: ['Whole note','Half notes','Offbeat','Comp','Arpeggio','Ballad roll'], defaultVol:0.32, schedule:scheduleKeys,
      defaultPattern:'Comp' },
    { id:'bass',   label:'Bass',   fontKey:'bass',
      patterns: ['Root','Root–5','Octave pump','Walking'],                defaultVol:0.50, schedule:scheduleBass,
      defaultPattern:'Walking' },
    { id:'guitar', label:'Guitar', fontKey:'guitar',
      patterns: ['Strum','Comp','Arpeggio','Offbeat','Fingerpick'], defaultVol:0.42, schedule:scheduleGuitar,
      defaultPattern:'Arpeggio' },
  ];
  // English label -> i18n key, used only for display (BT_INSTRUMENTS[].label
  // itself stays English — it's also used as an internal/default value in a
  // few places, e.g. matched against pattern names).
  var _BT_INST_I18N_KEY = { Drums:'playbar.instDrums', Keys:'playbar.instKeys', Bass:'playbar.instBass', Guitar:'playbar.instGuitar' };
  function _btInstLabel(label) {
    var key = _BT_INST_I18N_KEY[label];
    return (key && typeof t === 'function') ? t(key) : label;
  }
  BT_INSTRUMENTS.forEach(function(inst) {
    _bt_state[inst.id] = { enabled: inst.id !== 'guitar', pattern:inst.defaultPattern, volume:inst.defaultVol };
  });

  // Raw bars (no expansion) — used for UI display before playback starts
  function _rawBars() {
    if (!_bt_song || !_bt_song.ireal_chart || !_bt_song.ireal_chart.bars) return [];
    var bars = _bt_song.ireal_chart.bars.filter(function(b) { return b && b.chords && b.chords.length; });
    // Carry the last real chord forward across % (rep1) and slash bars so the
    // backing track keeps playing it instead of going silent. Stored on a
    // transient field that does NOT affect the displayed lead sheet.
    var lastReal = null;
    bars.forEach(function(b) {
      var real = b.chords.filter(function(c) { return c.type === 'chord'; });
      if (real.length) { lastReal = real; b._playChords = null; }
      else if (lastReal && b.chords.some(function(c) { return c.type === 'rep1' || c.type === 'slash'; })) {
        b._playChords = lastReal;
      } else { b._playChords = null; }
    });
    return bars;
  }

  // Expand {…} repeat sections into a flat bar sequence for one pass through the form.
  // Each {…} plays twice; 1st/2nd endings are handled properly.
  function _expandForm(rawBars) {
    var out = [], n = rawBars.length, i = 0;
    while (i < n) {
      out.push(rawBars[i]);
      if (rawBars[i].closeRepeat) {
        // Find matching openRepeat (search backwards in rawBars)
        var openIdx = i - 1;
        while (openIdx >= 0 && !rawBars[openIdx].openRepeat) openIdx--;
        if (openIdx >= 0) {
          // Is there a 1st ending within this repeat section?
          var firstEndStart = -1;
          for (var j = openIdx; j <= i; j++) {
            if (rawBars[j].endingNum === '1' && firstEndStart < 0) { firstEndStart = j; break; }
          }
          // Repeat: from openRepeat up to (and including) closeRepeat bar,
          // or up to just before the 1st ending if endings are present.
          var repeatUntil = firstEndStart >= 0 ? firstEndStart - 1 : i;
          for (var k = openIdx; k <= repeatUntil; k++) out.push(rawBars[k]);
          // If a 1st ending was found, look for a 2nd ending right after i
          if (firstEndStart >= 0) {
            var j2 = i + 1;
            while (j2 < n) {
              if (rawBars[j2].endingNum === '2') {
                while (j2 < n) {
                  out.push(rawBars[j2]);
                  if (rawBars[j2].closeRepeat) { i = j2; break; }
                  j2++;
                }
                break;
              }
              if (rawBars[j2].openRepeat) break; // new repeat section — no 2nd ending here
              j2++;
            }
          }
        }
      }
      i++;
    }
    return out;
  }

  // Current play count: UI control → song default → global default (3)
  function _getPlays() {
    var el = document.getElementById('bt-plays');
    var n  = el ? (parseInt(el.value) || 0) : 0;
    if (n > 0) return n;
    return (_bt_song && _bt_song.plays) || 3;
  }

  // Returns cached expanded bars during playback; raw bars otherwise
  function _bars() { return _bars_cache || _rawBars(); }

  // ── Scheduler tick ────────────────────────────────────────────────────────────
  function _tick() {
    if (!_running) return;
    var ctx = _ctx(); if (!ctx) return;
    var bars = _bars(); if (!bars.length) return;
    if (!_barMeters || _barMeters.length !== bars.length) _barMeters = _computeBarMeters(bars);
    var bs     = _bs();
    var now    = ctx.currentTime;
    // Auto-stop when all bars have been scheduled
    if (_schedBar >= bars.length) {
      _running = false; _paused = false;
      if (_schedID) { clearInterval(_schedID); _schedID = null; }
      _bars_cache = null; _barMeters = null; _schedBar = 0; _displayBar = 0;
      document.querySelectorAll('.ls-bar.bt-playing').forEach(function(el) { el.classList.remove('bt-playing'); });
      var pb = document.getElementById('bt-play-btn');
      if (pb) { pb.textContent = '▶︎'; pb.classList.remove('bt-running'); }
      var st = document.getElementById('bt-status');
      if (st) st.textContent = '';
      var prg = document.getElementById('bt-progress');
      if (prg) prg.value = '0';
      return;
    }
    while (_schedNext < now + LOOKAHEAD && _schedBar < bars.length) {
      var bi = _schedBar, t0 = _schedNext;
      var sig = _meterForBar(bi);            // per-bar meter (follows mid-song changes)
      var nb = sig.num, denom = sig.denom;
      var barDur = nb * bs;
      (function(idx, when, chartIdx) {
        setTimeout(function() {
          if (!_running) return;
          _displayBar = idx;
          var prog = document.getElementById('bt-progress');
          if (prog) prog.value = idx;
          var cur = document.getElementById('bt-bar-cur');
          if (cur) cur.textContent = t('playbar.bar', { n: idx + 1 });
          document.querySelectorAll('.ls-bar.bt-playing').forEach(function(el) { el.classList.remove('bt-playing'); });
          var targetCell = document.querySelector('.ls-bar[data-bar-idx="' + chartIdx + '"]');
          if (targetCell) { targetCell.classList.add('bt-playing'); targetCell.scrollIntoView({block:'nearest'}); }
        }, Math.max(0, (when - now) * 1000));
      })(bi, t0, bars[bi] && bars[bi]._chartIdx != null ? bars[bi]._chartIdx : bi);
      BT_INSTRUMENTS.forEach(function(inst) {
        var s = _bt_state[inst.id];
        if (s && s.enabled) inst.schedule(ctx, _getMaster(ctx), bars, bi, t0, barDur, s, nb, denom);
      });
      _schedNext += barDur;
      _schedBar++;
    }
  }

  // ── Playback control ──────────────────────────────────────────────────────────
  function _btStartFromBar(startBar) {
    _transpose = (typeof window !== 'undefined' && typeof window.getTransposeAmount === 'function') ? window.getTransposeAmount() : 0;
    var song = (typeof songs !== 'undefined' && typeof currentIdx !== 'undefined' && currentIdx >= 0)
               ? songs[currentIdx] : null;
    if (!song || !song.ireal_chart) {
      if (typeof showToast === 'function') showToast(t('playbar.openLeadSheetToUse'));
      return;
    }
    _bt_song = song;
    _bars_cache = null;                // clear any stale expansion before reading raw bars
    var bars = _rawBars();
    if (!bars.length) { if (typeof showToast === 'function') showToast(t('playbar.noChordData')); return; }

    _totalBars  = bars.length;  // preliminary — updated after cache is built below
    _running    = true;
    _paused     = false;

    var prog = document.getElementById('bt-progress');
    var total = document.getElementById('bt-bar-total');

    var ctx = _ctx(); if (!ctx) { _running = false; return; }
    if (ctx.state === 'suspended') { try { ctx.resume(); } catch(e) {} }

    // Build expanded bar list (repeats × plays count) — cache for the whole playback
    var onePass = _expandForm(bars);
    var plays   = _getPlays();
    _bars_cache = [];
    for (var p = 0; p < plays; p++) _bars_cache = _bars_cache.concat(onePass);
    _totalBars = _bars_cache.length;
    _barMeters = _computeBarMeters(_bars_cache);   // per-bar meters for the whole pass

    // Clamp startBar to the expanded length
    _schedBar   = Math.max(0, Math.min(typeof startBar === 'number' ? startBar : 0, _bars_cache.length - 1));
    _displayBar = _schedBar;

    // Update progress bar max to reflect full expanded length
    if (prog) { prog.max = String(Math.max(0, _bars_cache.length - 1)); prog.value = String(_schedBar); }
    if (total) total.textContent = String(_bars_cache.length);

    var t0 = (typeof metroNextDownbeat === 'function' && typeof metroRunning !== 'undefined' && metroRunning)
             ? metroNextDownbeat() : ctx.currentTime + 0.1;
    _schedNext = t0;

    var playBtn = document.getElementById('bt-play-btn');
    // Was '⏸︎' (U+23F8 + text-presentation selector) — U+23F8 is an
    // emoji-eligible codepoint, and the text-presentation selector isn't
    // reliably honoured for it on every platform/webview, so it can still
    // render as a colour emoji instead of a plain glyph. '‖' (U+2016 DOUBLE
    // VERTICAL LINE) is a plain punctuation character with no emoji form at
    // all, so it always renders as text.
    if (playBtn) { playBtn.textContent = '‖'; playBtn.classList.add('bt-running'); }
    var status = document.getElementById('bt-status');
    if (status) status.textContent = t('playbar.loading');

    _initPlayer(function() {
      if (!_running) return;
      if (status) status.textContent = '';
      // Reset schedule start time — font loading may have taken several seconds,
      // causing _schedNext to be in the past; reschedule to now to avoid silent playback.
      var freshCtx = _ctx();
      if (freshCtx && freshCtx.currentTime > _schedNext + 0.2) {
        _schedNext = freshCtx.currentTime + 0.1;
      }
      _schedID = setInterval(_tick, TICK_MS);
      _tick();
    });
  }

  // Play/Pause toggle (play button)
  function _btPlayPause() {
    if (_running) {
      // Pause: freeze position
      _pausedBar  = _schedBar;
      _running    = false;
      _paused     = true;
      if (_schedID) { clearInterval(_schedID); _schedID = null; }
      var playBtn = document.getElementById('bt-play-btn');
      if (playBtn) { playBtn.textContent = '▶︎'; playBtn.classList.remove('bt-running'); }
      var status = document.getElementById('bt-status');
      if (status) status.textContent = '';
    } else {
      // Unlock AudioContext (required on iOS/mobile), then start
      var bar2start = _paused ? _pausedBar : _schedBar;
      if (typeof _getRunningCtx === 'function') {
        _getRunningCtx().then(function() { _btStartFromBar(bar2start); }).catch(function() { _btStartFromBar(bar2start); });
      } else {
        _btStartFromBar(bar2start);
      }
    }
  }

  // Stop + reset to bar 0 (stop button)
  function btStop() {
    _running    = false;
    _paused     = false;
    _schedBar   = 0;
    _displayBar = 0;
    _bars_cache = null;
    if (_schedID) { clearInterval(_schedID); _schedID = null; }
    document.querySelectorAll('.ls-bar.bt-playing').forEach(function(el) { el.classList.remove('bt-playing'); });
    var playBtn = document.getElementById('bt-play-btn');
    if (playBtn) { playBtn.textContent = '▶︎'; playBtn.classList.remove('bt-running'); }
    var status = document.getElementById('bt-status');
    if (status) status.textContent = '';
    var prog = document.getElementById('bt-progress');
    if (prog) prog.value = '0';
    var cur = document.getElementById('bt-bar-cur');
    if (cur) cur.textContent = t('playbar.bar', { n: 1 });
  }

  // Public btStart = play from bar 0 (used by external callers)
  function btStart() { _btStartFromBar(0); }

  // ── Bar open/close ────────────────────────────────────────────────────────────
  // Reserve blank space at the bottom of the scroll area equal to the playbar's
  // height (it's fixed-position and can be 2–3 rows tall on phones) so it never
  // covers the last lines of a lead sheet / song.
  var _btPadObserver = null;
  function _btAdjustBottomPad() {
    var bar  = document.getElementById('bt-bar');
    var main = document.getElementById('main');
    if (!main) return;
    // NOTE: don't test offsetParent — it's always null for position:fixed elements
    // (which the bar is), which previously made this never reserve any space.
    if (bar && bar.style.display !== 'none' && bar.offsetHeight > 0) {
      // The bar sits ~38px above the screen bottom; clear its full height + that gap.
      var reserve = bar.offsetHeight + 56;
      main.style.paddingBottom = reserve + 'px';
    } else {
      main.style.paddingBottom = '';
    }
  }

  // Apply the current song's style-based instrument arrangement (pattern +
  // guitar on/off per instrument), falling back to each instrument's own
  // built-in default when the style resolver isn't available or returns
  // nothing for a given instrument. Also refreshes the already-built bar UI
  // (pattern <select>s + mute toggles) so it doesn't show stale state.
  function _applyStyleArrangement(style) {
    if (typeof window._styleArrangementFor !== 'function') return;
    var arr = window._styleArrangementFor(style);
    if (!arr) return;
    BT_INSTRUMENTS.forEach(function(inst) {
      var a = arr[inst.id], st = _bt_state[inst.id];
      if (!a || !st) return;
      if (inst.id === 'guitar') {
        if (a.pattern) st.pattern = a.pattern;
        if (typeof a.enabled === 'boolean') st.enabled = a.enabled;
      } else if (typeof a === 'string') {
        st.pattern = a;
      }
    });
    _refreshBTBarUI();
  }
  function _refreshBTBarUI() {
    BT_INSTRUMENTS.forEach(function(inst) {
      var st = _bt_state[inst.id]; if (!st) return;
      var sel = document.querySelector('.bt-pat-sel[data-id="' + inst.id + '"]');
      if (sel) sel.value = st.pattern;
      var btn = document.querySelector('.bt-inst-toggle[data-id="' + inst.id + '"]');
      if (btn) {
        btn.classList.toggle('active', !!st.enabled);
        btn.title = t(st.enabled ? 'playbar.mute' : 'playbar.unmute', { inst: _btInstLabel(inst.label) });
      }
    });
  }

  function btOpenBar(song) {
    // Show the bar immediately — before any stop/reset that might throw
    var bar = document.getElementById('bt-bar');
    if (bar) bar.style.display = '';
    // Keep the bottom padding in sync with the bar's (variable) height.
    if (bar && typeof ResizeObserver !== 'undefined' && !_btPadObserver) {
      _btPadObserver = new ResizeObserver(function() { _btAdjustBottomPad(); });
      _btPadObserver.observe(bar);
    }
    setTimeout(_btAdjustBottomPad, 0);
    if (song && song !== _bt_song && _running) { try { btStop(); } catch(e) { console.error('[BT] btStop error:', e); } }
    var _isNewSong = song && song !== _bt_song;
    if (song) _bt_song = song;
    // Re-derive the instrument arrangement from this song's style whenever a
    // (possibly different) song is opened — same spirit as the BPM fallback
    // just below. Guitar's on/off state matters most here since it defaults
    // to off globally but should follow the style for guitar-forward genres.
    if (_isNewSong && _bt_song) _applyStyleArrangement(_bt_song.style);
    // Annotate each bar with its chart index so the tick highlights the right cell during repeats
    if (_bt_song && _bt_song.ireal_chart && _bt_song.ireal_chart.bars) {
      _bt_song.ireal_chart.bars.forEach(function(b, i) { if (b) b._chartIdx = i; });
    }
    if (bar) bar.focus();
    // Refresh plays control to match the new song's default
    var playsEl = document.getElementById('bt-plays');
    if (playsEl && _bt_song) playsEl.value = String(_bt_song.plays || 3);
    // Tempo: follow the song's BPM (resolved from its style on import, else 120),
    // clamped to the slider's range.
    var _tEl = document.getElementById('bt-tempo');
    var _tLbl = document.getElementById('bt-tempo-lbl');
    if (_tEl && _bt_song) {
      var _b = parseInt(_bt_song.bpm) || 0;
      // No stored tempo (e.g. older lead sheets) → fall back to the style default.
      if (!_b) _b = (typeof window._styleDefaultBPM === 'function')
                      ? window._styleDefaultBPM(_bt_song.style) : 120;
      var _mn = parseInt(_tEl.min) || 40, _mx = parseInt(_tEl.max) || 240;
      _b = Math.max(_mn, Math.min(_mx, _b));
      _tEl.value = String(_b);
      if (_tLbl) _tLbl.textContent = String(_b);
    }
    _initMeterControl();  // N/A for multi-meter songs, else the song's meter
    _bars_cache = null; _barMeters = null;  // clear any stale expansion
    var rawB = _rawBars(); _totalBars = rawB.length;
    var prog = document.getElementById('bt-progress');
    if (prog) { prog.max = String(Math.max(0, rawB.length - 1)); prog.value = '0'; }
    var total = document.getElementById('bt-bar-total');
    if (total) total.textContent = rawB.length ? String(rawB.length) : '--';
  }

  function btCloseBar() {
    btStop();
    var bar = document.getElementById('bt-bar');
    if (bar) bar.style.display = 'none';
    _btAdjustBottomPad();   // release the reserved space
  }

  // ── UI builder ────────────────────────────────────────────────────────────────
  function _buildBTBar() {
    // Inject mobile layout styles once — guarantees correct layout regardless
    // of whether the HTML file is served fresh or from a stale SW cache.
    // Kept as an exact mirror of the #bt-bar mobile rules in the main
    // stylesheet's @media (max-width:620px) block — a previous version of
    // this injected block had drifted out of sync with those rules (missing
    // justify-content, the #bt-player-controls .bt-row > * flex-share rule,
    // and .bt-inst-toggles), and since this tag is appended to <head> (i.e.
    // later in document order than the main stylesheet), any rule it *did*
    // redeclare with different values silently won every tie. On a stale
    // cache serving an older HTML missing some of these rules, that drift
    // left instrument-toggle buttons and other controls with no mobile
    // sizing at all — the bar fell back to its cramped desktop layout.
    if (!document.getElementById('_bt_mobile_css')) {
      var mstyle = document.createElement('style');
      mstyle.id = '_bt_mobile_css';
      mstyle.textContent =
        '@media (max-width:620px){' +
          '#bt-bar{left:8px!important;right:8px!important;width:auto!important;transform:none!important;border-radius:6px!important;}' +
          '#bt-inst-panel{border-radius:6px 6px 0 0!important;left:-1px!important;right:-1px!important;}' +
          '#bt-player-inner{padding:8px 10px 6px!important;gap:4px!important;}' +
          '#bt-player-controls{display:flex!important;flex-direction:column!important;align-items:stretch!important;gap:4px!important;overflow:visible!important;flex-wrap:nowrap!important;}' +
          '.bt-row{display:flex!important;flex-direction:row!important;flex-wrap:nowrap!important;align-items:center!important;justify-content:center!important;gap:6px!important;width:100%!important;}' +
          '#bt-player-controls .bt-row > *{flex:1 1 0!important;min-width:0!important;text-align:center!important;}' +
          '.bt-flex-spacer{display:none!important;}' +
          '#bt-status{display:none!important;}' +
          '.bt-tempo-slider{width:auto!important;}' +
          '.bt-vol-slider{width:auto!important;}' +
          '#bt-player-controls .bt-row-3 #bt-settings-btn{flex:0 0 auto!important;min-width:30px!important;}' +
          '.bt-inst-toggles{display:flex!important;flex:1 1 auto!important;min-width:0!important;}' +
          '.bt-inst-toggles .bt-inst-toggle{flex:1 1 0!important;min-width:0!important;overflow:hidden!important;text-overflow:ellipsis!important;white-space:nowrap!important;padding-left:3px!important;padding-right:3px!important;}' +
        '}';
      document.head.appendChild(mstyle);
    }

    var container = document.getElementById('bt-bar');
    if (!container) return;
    container.innerHTML = '';

    // Instrument settings panel (absolute positioned — floats above bar)
    var instPanel = document.createElement('div');
    instPanel.id = 'bt-inst-panel';
    instPanel.style.display = 'none';
    BT_INSTRUMENTS.forEach(function(inst) {
      var s   = _bt_state[inst.id];
      var row = document.createElement('div');
      row.className = 'bt-inst-row';
      var lbl = document.createElement('span');
      lbl.className = 'bt-inst-name'; lbl.textContent = _btInstLabel(inst.label);
      row.appendChild(lbl);
      var patSel = document.createElement('select');
      patSel.className = 'bt-ctrl-btn bt-pat-sel';
      patSel.setAttribute('data-id', inst.id);
      inst.patterns.forEach(function(p) {
        var opt = document.createElement('option');
        opt.value = p; opt.textContent = p;
        if (p === s.pattern) opt.selected = true;
        patSel.appendChild(opt);
      });
      patSel.addEventListener('change', function() { s.pattern = patSel.value; });
      row.appendChild(patSel);
      var vol = document.createElement('input');
      vol.type = 'range'; vol.min = '0'; vol.max = '1'; vol.step = '0.05';
      vol.className = 'bt-vol-slider'; vol.value = String(s.volume);
      vol.addEventListener('input', function() { s.volume = parseFloat(vol.value); });
      row.appendChild(vol);
      instPanel.appendChild(row);
    });
    container.appendChild(instPanel);

    // Main inner wrapper
    var inner = document.createElement('div');
    inner.id = 'bt-player-inner';

    // Controls — 3 logical rows (collapse to column on mobile)
    var controls = document.createElement('div');
    controls.id = 'bt-player-controls';

    // ── Row 1: transport + plays ──────────────────────────────────────────────
    var row1 = document.createElement('div'); row1.className = 'bt-row bt-row-1';

    var playBtn = document.createElement('button');
    playBtn.id = 'bt-play-btn'; playBtn.className = 'bt-ctrl-btn bt-play-btn';
    playBtn.textContent = '▶︎'; playBtn.title = t('playbar.playPause');
    playBtn.addEventListener('click', _btPlayPause);
    row1.appendChild(playBtn);

    var stopBtn = document.createElement('button');
    stopBtn.id = 'bt-stop-btn'; stopBtn.className = 'bt-ctrl-btn';
    // '■' (U+25A0 BLACK SQUARE) instead of '⏹︎' (U+23F9 + text-presentation
    // selector) — same reasoning as the pause icon above: U+23F9 is emoji-
    // eligible and the selector isn't reliably honoured everywhere, while
    // U+25A0 has no emoji form to fall back to at all.
    stopBtn.textContent = '■'; stopBtn.title = t('playbar.stopReturn');
    stopBtn.addEventListener('click', btStop);
    row1.appendChild(stopBtn);

    var playsLbl = document.createElement('label');
    playsLbl.id = 'bt-plays-lbl'; playsLbl.textContent = t('playbar.plays');
    row1.appendChild(playsLbl);

    var playsInput = document.createElement('input');
    playsInput.type = 'number'; playsInput.id = 'bt-plays';
    playsInput.min = '1'; playsInput.max = '10'; playsInput.step = '1';
    playsInput.className = 'bt-plays-input';
    playsInput.value = String((_bt_song && _bt_song.plays) || 3);
    playsInput.title = t('playbar.playsTitle');
    playsInput.addEventListener('change', function() {
      var n = Math.max(1, Math.min(10, parseInt(playsInput.value) || 1));
      playsInput.value = String(n);
      if (_bt_song) {
        _bt_song.plays = n;
        if (typeof saveSongs === 'function') saveSongs();
      }
    });
    row1.appendChild(playsInput);

    var spacer = document.createElement('span');
    spacer.className = 'bt-flex-spacer';
    row1.appendChild(spacer);

    var status = document.createElement('span');
    status.id = 'bt-status';
    row1.appendChild(status);

    controls.appendChild(row1);

    // ── Row 2: tempo + meter ──────────────────────────────────────────────────
    var row2 = document.createElement('div'); row2.className = 'bt-row bt-row-2';

    var bpmLbl = document.createElement('label');
    bpmLbl.id = 'bt-bpm-lbl'; bpmLbl.textContent = t('playbar.bpm');
    row2.appendChild(bpmLbl);

    var tempoSlider = document.createElement('input');
    tempoSlider.type = 'range'; tempoSlider.id = 'bt-tempo';
    tempoSlider.min = '40'; tempoSlider.max = '240'; tempoSlider.value = '120';
    tempoSlider.className = 'bt-tempo-slider';
    row2.appendChild(tempoSlider);

    var tempoLbl = document.createElement('span');
    tempoLbl.id = 'bt-tempo-lbl'; tempoLbl.className = 'bt-tempo-lbl';
    tempoLbl.textContent = '120';
    tempoSlider.addEventListener('input', function() {
      tempoLbl.textContent = tempoSlider.value;
      // Keep the song's BPM in sync so it persists and exports at the chosen tempo.
      if (_bt_song) _bt_song.bpm = parseInt(tempoSlider.value) || 120;
    });
    tempoSlider.addEventListener('change', function() {
      if (_bt_song) {
        _bt_song.bpm = parseInt(tempoSlider.value) || 120;
        if (typeof window.saveSongs === 'function') { try { window.saveSongs(); } catch(e) {} }
      }
    });
    row2.appendChild(tempoLbl);

    var meterLbl = document.createElement('label');
    meterLbl.id = 'bt-meter-lbl'; meterLbl.textContent = t('playbar.meter');
    row2.appendChild(meterLbl);

    var timeSigSel = document.createElement('select');
    timeSigSel.id = 'bt-time-sig'; timeSigSel.className = 'bt-ctrl-btn';
    // 'auto' (shown as N/A) = follow the sheet's per-bar meter, including
    // mid-song time-signature changes. Any explicit choice overrides the sheet.
    [['auto', t('playbar.meterAuto')],['4/4','4/4'],['3/4','3/4'],['2/4','2/4'],['6/8','6/8'],['5/4','5/4'],['7/8','7/8']].forEach(function(v) {
      var opt = document.createElement('option');
      opt.value = v[0]; opt.textContent = v[1];
      timeSigSel.appendChild(opt);
    });
    timeSigSel.title = t('playbar.meterTitle');
    row2.appendChild(timeSigSel);

    controls.appendChild(row2);

    // ── Row 3: instrument toggles + settings ─────────────────────────────────
    var row3 = document.createElement('div'); row3.className = 'bt-row bt-row-3';

    var toggleWrap = document.createElement('span');
    toggleWrap.className = 'bt-inst-toggles';
    BT_INSTRUMENTS.forEach(function(inst) {
      var btn = document.createElement('button');
      var s   = _bt_state[inst.id];
      btn.className = 'bt-inst-toggle' + (s && s.enabled ? ' active' : '');
      btn.setAttribute('data-id', inst.id);
      btn.textContent = _btInstLabel(inst.label);
      btn.title = t(s && s.enabled ? 'playbar.mute' : 'playbar.unmute', { inst: _btInstLabel(inst.label) });
      btn.addEventListener('click', function() {
        var st = _bt_state[inst.id]; st.enabled = !st.enabled;
        btn.classList.toggle('active', st.enabled);
        btn.title = t(st.enabled ? 'playbar.mute' : 'playbar.unmute', { inst: _btInstLabel(inst.label) });
      });
      toggleWrap.appendChild(btn);
    });
    row3.appendChild(toggleWrap);

    var settBtn = document.createElement('button');
    settBtn.id = 'bt-settings-btn'; settBtn.className = 'bt-ctrl-btn';
    settBtn.textContent = '⚙'; settBtn.title = t('playbar.perInstSettings');
    settBtn.addEventListener('click', function() {
      var open = instPanel.style.display !== 'none';
      instPanel.style.display = open ? 'none' : '';
      settBtn.classList.toggle('active', !open);
    });
    row3.appendChild(settBtn);

    controls.appendChild(row3);

    inner.appendChild(controls);

    var hr = document.createElement('hr');
    hr.className = 'bt-hr';
    inner.appendChild(hr);

    var progRow = document.createElement('div');
    progRow.id = 'bt-progress-row';

    var curLbl = document.createElement('span');
    curLbl.id = 'bt-bar-cur'; curLbl.textContent = t('playbar.bar', { n: 1 });
    progRow.appendChild(curLbl);

    var prog = document.createElement('input');
    prog.type = 'range'; prog.id = 'bt-progress';
    prog.min = '0'; prog.max = '0'; prog.value = '0'; prog.step = '1';
    prog.addEventListener('input', function() {
      var nb2 = parseInt(this.value) || 0;
      _displayBar = nb2; _schedBar = nb2;
      _paused = true; _pausedBar = nb2;
      var ctx2 = _ctx(); if (ctx2) _schedNext = ctx2.currentTime + 0.05;
      var cur2 = document.getElementById('bt-bar-cur');
      if (cur2) cur2.textContent = t('playbar.bar', { n: nb2 + 1 });
    });
    progRow.appendChild(prog);

    var totalLbl = document.createElement('span');
    totalLbl.id = 'bt-bar-total'; totalLbl.textContent = '--';
    progRow.appendChild(totalLbl);

    inner.appendChild(progRow);
    container.appendChild(inner);
  }

  // Initialise
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', _buildBTBar);
  } else {
    _buildBTBar();
  }

  // ── Sheet-music integration ────────────────────────────────────────────────
  // Lets the abcjs sheet-music player reuse the loaded FluidR3 piano with the
  // same FluidR3 → Aspirin → (caller's synth) fallback chain.
  //   btEnsureAudio(cb)  — load/decode the soundfonts once (idempotent).
  //   btPlayPianoNote(…) — queue one piano note; returns false if no sampled
  //                        font is ready, so the caller keeps its oscillator.
  window.btEnsureAudio = function(cb) {
    try { _initPlayer(function() { if (typeof cb === 'function') cb(); }); }
    catch (e) { if (typeof cb === 'function') cb(); }
  };
  window.btPlayPianoNote = function(ctx, dest, midi, when, dur, vol) {
    if (_waf && _fontReady.piano && _fontVar.piano && window[_fontVar.piano]) {
      try { _waf.queueWaveTable(ctx, dest, window[_fontVar.piano], when, midi, dur, (vol == null ? 0.8 : vol)); return true; } catch (e) {}
    }
    return false;
  };

  window.btAudioState = function() {
    return {
      player: !!_waf,
      ready: { piano:!!_fontReady.piano, bass:!!_fontReady.bass, guitar:!!_fontReady.guitar, drums:!!_fontReady.drums },
      vars:  { piano:_fontVar.piano||null, bass:_fontVar.bass||null, guitar:_fontVar.guitar||null, drums:_fontVar.drums||null }
    };
  };

  window.btStart        = btStart;
  window.btStop         = btStop;
  window.btIsRunning    = function() { return _running; };
  window.btGetSong      = function() { return _bt_song; };
  window.btOpenBar      = btOpenBar;
  window.btCloseBar     = btCloseBar;
  // Live-update the sounding transpose (e.g. when the capo or key changes) so a
  // playing backing track follows immediately — the scheduler reads _transpose
  // per note, so subsequent bars use the new value.
  window.btRefreshTranspose = function() {
    _transpose = (typeof window !== 'undefined' && typeof window.getTransposeAmount === 'function')
                 ? window.getTransposeAmount() : 0;
  };
  window.BT_INSTRUMENTS = BT_INSTRUMENTS;
  window.btLoaded       = true;
})();

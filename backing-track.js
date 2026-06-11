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

  var FONTS = {
    piano:  { file:'0000_Aspirin_sf2_file.js',    v:'_tone_0000_Aspirin_sf2_file'    },
    guitar: { file:'0240_Aspirin_sf2_file.js',    v:'_tone_0240_Aspirin_sf2_file'    },
    bass:   { file:'0330_Aspirin_sf2_file.js',    v:'_tone_0330_Aspirin_sf2_file'    },
    drums:  { file:'12800_0_Aspirin_sf2_file.js', v:'_tone_12800_0_Aspirin_sf2_file' },
  };

  // State
  var _running    = false;
  var _paused     = false;
  var _pausedBar  = 0;
  var _bt_song    = null;
  var _waf        = null;
  var _fontReady  = {};
  var _playerReady = false;
  var _schedID    = null;
  var _schedBar   = 0;
  var _schedNext  = 0;
  var _displayBar = 0;
  var _totalBars  = 0;
  var _bars_cache = null;
  var _transpose  = 0;       // semitone offset from main app
  var _bt_state   = {};

  // ── Audio context ────────────────────────────────────────────────────────────
  function _ctx() {
    return typeof getSharedAudioCtx === 'function' ? getSharedAudioCtx()
         : null;
  }

  // ── BPM / time-sig helpers (read from OWN bar controls) ─────────────────────
  function _bpm() {
    var el = document.getElementById('bt-tempo');
    return (el ? parseInt(el.value) : 0) || 120;
  }
  function _barTimeSig() {
    var el  = document.getElementById('bt-time-sig');
    var val = el ? el.value : '4/4';
    var p   = val.split('/');
    return { num: parseInt(p[0]) || 4, denom: parseInt(p[1]) || 4 };
  }
  function _nb()     { return _barTimeSig().num; }
  function _denom()  { return _barTimeSig().denom; }
  function _bs()     { return 60 / _bpm(); }

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
  function _loadFont(key, cb) {
    var f = FONTS[key];
    if (!f) { cb(false); return; }
    if (window[f.v]) { cb(true); return; }
    _loadTag(SOUNDS + f.file, function(ok) {
      if (ok && window[f.v]) { cb(true); return; }
      _dbGet(f.file, function(cached) {
        if (cached) { _runText(cached, function(ok2) { cb(ok2 && !!window[f.v]); }); return; }
        fetch(CDN + f.file)
          .then(function(r) { return r.ok ? r.text() : Promise.reject(r.status); })
          .then(function(text) { _dbPut(f.file, text); _runText(text, function(ok3) { cb(ok3 && !!window[f.v]); }); })
          .catch(function() { cb(false); });
      });
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
        _loadFont(k, function(ok) {
          if (ok && _waf && audioCtx && window[FONTS[k].v]) {
            try { _waf.loader.decodeAfterLoading(audioCtx, FONTS[k].v); } catch(e) {}
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
    if (_waf && _fontReady.drums && window[FONTS.drums.v]) {
      try { _waf.queueWaveTable(ctx, dest, window[FONTS.drums.v], when, midiNote, 0.5, vol); return; } catch(e) {}
    }
    _synDrum(ctx, dest, when, synType, vol);
  }
  function _note(fk, ctx, dest, when, midi, dur, vol) {
    var f = FONTS[fk];
    if (_waf && _fontReady[fk] && f && window[f.v]) {
      try { _waf.queueWaveTable(ctx, dest, window[f.v], when, midi, dur, vol); return; } catch(e) {}
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
  function _chords(bar) { return bar ? bar.chords.filter(function(c) { return c.type === 'chord'; }) : []; }

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
      var notes = _chordNotes(ch[0].root, ch[0].qual, null, oct);
      var nd    = barDur / Math.max(notes.length, 1);
      notes.forEach(function(m, i) { _note('guitar', ctx, dest, t0+i*nd, m, nd*0.88, vol); });
    } else if (pat === 'Offbeat') {
      for (var b2=1; b2<nb; b2+=2)
        playG(ch[Math.min(Math.floor(b2*ch.length/nb),ch.length-1)], t0+b2*bd, bd*0.82);
    }
  }

  // ── Instrument registry ───────────────────────────────────────────────────────
  var BT_INSTRUMENTS = [
    { id:'drums',  label:'Drums',  fontKey:'drums',
      patterns: Object.keys(DRUM_PATTERNS), defaultPattern:'Ballad',     defaultVol:0.70, schedule:scheduleDrums  },
    { id:'keys',   label:'Keys',   fontKey:'piano',
      patterns: ['Whole note','Half notes','Offbeat','Comp'],             defaultVol:0.32, schedule:scheduleKeys,
      defaultPattern:'Half notes' },
    { id:'bass',   label:'Bass',   fontKey:'bass',
      patterns: ['Root','Root–5','Octave pump','Walking'],                defaultVol:0.50, schedule:scheduleBass,
      defaultPattern:'Root' },
    { id:'guitar', label:'Guitar', fontKey:'guitar',
      patterns: ['Strum','Comp','Arpeggio','Offbeat'],                    defaultVol:0.42, schedule:scheduleGuitar,
      defaultPattern:'Comp' },
  ];
  BT_INSTRUMENTS.forEach(function(inst) {
    _bt_state[inst.id] = { enabled:true, pattern:inst.defaultPattern, volume:inst.defaultVol };
  });

  // Raw bars (no expansion) — used for UI display before playback starts
  function _rawBars() {
    if (!_bt_song || !_bt_song.ireal_chart || !_bt_song.ireal_chart.bars) return [];
    return _bt_song.ireal_chart.bars.filter(function(b) { return b && b.chords && b.chords.length; });
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
    var nb     = _nb(), denom = _denom(), bs = _bs();
    var barDur = nb * bs;
    var now    = ctx.currentTime;
    // Auto-stop when all bars have been scheduled
    if (_schedBar >= bars.length) {
      _running = false; _paused = false;
      if (_schedID) { clearInterval(_schedID); _schedID = null; }
      _bars_cache = null; _schedBar = 0; _displayBar = 0;
      document.querySelectorAll('.ls-bar.bt-playing').forEach(function(el) { el.classList.remove('bt-playing'); });
      var pb = document.getElementById('bt-play-btn');
      if (pb) { pb.textContent = '▶'; pb.classList.remove('bt-running'); }
      var st = document.getElementById('bt-status');
      if (st) st.textContent = '';
      var prg = document.getElementById('bt-progress');
      if (prg) prg.value = '0';
      return;
    }
    while (_schedNext < now + LOOKAHEAD && _schedBar < bars.length) {
      var bi = _schedBar, t0 = _schedNext;
      (function(idx, when, chartIdx) {
        setTimeout(function() {
          if (!_running) return;
          _displayBar = idx;
          var prog = document.getElementById('bt-progress');
          if (prog) prog.value = idx;
          var cur = document.getElementById('bt-bar-cur');
          if (cur) cur.textContent = 'Bar ' + (idx + 1);
          document.querySelectorAll('.ls-bar.bt-playing').forEach(function(el) { el.classList.remove('bt-playing'); });
          var targetCell = document.querySelector('.ls-bar[data-bar-idx="' + chartIdx + '"]');
          if (targetCell) { targetCell.classList.add('bt-playing'); targetCell.scrollIntoView({block:'nearest'}); }
        }, Math.max(0, (when - now) * 1000));
      })(bi, t0, bars[bi] && bars[bi]._chartIdx != null ? bars[bi]._chartIdx : bi);
      BT_INSTRUMENTS.forEach(function(inst) {
        var s = _bt_state[inst.id];
        if (s && s.enabled) inst.schedule(ctx, ctx.destination, bars, bi, t0, barDur, s, nb, denom);
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
      if (typeof showToast === 'function') showToast('Open a lead sheet to use the backing track');
      return;
    }
    _bt_song = song;
    _bars_cache = null;                // clear any stale expansion before reading raw bars
    var bars = _rawBars();
    if (!bars.length) { if (typeof showToast === 'function') showToast('No chord data in this lead sheet'); return; }

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
    if (playBtn) { playBtn.textContent = '⏸'; playBtn.classList.add('bt-running'); }
    var status = document.getElementById('bt-status');
    if (status) status.textContent = 'Loading…';

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
      if (playBtn) { playBtn.textContent = '▶'; playBtn.classList.remove('bt-running'); }
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
    if (playBtn) { playBtn.textContent = '▶'; playBtn.classList.remove('bt-running'); }
    var status = document.getElementById('bt-status');
    if (status) status.textContent = '';
    var prog = document.getElementById('bt-progress');
    if (prog) prog.value = '0';
    var cur = document.getElementById('bt-bar-cur');
    if (cur) cur.textContent = 'Bar 1';
  }

  // Public btStart = play from bar 0 (used by external callers)
  function btStart() { _btStartFromBar(0); }

  // ── Bar open/close ────────────────────────────────────────────────────────────
  function btOpenBar(song) {
    // Show the bar immediately — before any stop/reset that might throw
    var bar = document.getElementById('bt-bar');
    if (bar) bar.style.display = '';
    if (song && song !== _bt_song && _running) { try { btStop(); } catch(e) { console.error('[BT] btStop error:', e); } }
    if (song) _bt_song = song;
    // Annotate each bar with its chart index so the tick highlights the right cell during repeats
    if (_bt_song && _bt_song.ireal_chart && _bt_song.ireal_chart.bars) {
      _bt_song.ireal_chart.bars.forEach(function(b, i) { if (b) b._chartIdx = i; });
    }
    if (bar) bar.focus();
    // Refresh plays control to match the new song's default
    var playsEl = document.getElementById('bt-plays');
    if (playsEl && _bt_song) playsEl.value = String(_bt_song.plays || 3);
    _bars_cache = null;  // clear any stale expansion
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
  }

  // ── UI builder ────────────────────────────────────────────────────────────────
  function _buildBTBar() {
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
      lbl.className = 'bt-inst-name'; lbl.textContent = inst.label;
      row.appendChild(lbl);
      var patSel = document.createElement('select');
      patSel.className = 'bt-ctrl-btn bt-pat-sel';
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

    // Controls row
    var controls = document.createElement('div');
    controls.id = 'bt-player-controls';

    var playBtn = document.createElement('button');
    playBtn.id = 'bt-play-btn'; playBtn.className = 'bt-ctrl-btn bt-play-btn';
    playBtn.textContent = '▶'; playBtn.title = 'Play / Pause';
    playBtn.addEventListener('click', _btPlayPause);
    controls.appendChild(playBtn);

    var stopBtn = document.createElement('button');
    stopBtn.id = 'bt-stop-btn'; stopBtn.className = 'bt-ctrl-btn';
    stopBtn.textContent = '⏹'; stopBtn.title = 'Stop and return to start';
    stopBtn.addEventListener('click', btStop);
    controls.appendChild(stopBtn);

    var bpmLbl = document.createElement('label');
    bpmLbl.textContent = 'BPM';
    controls.appendChild(bpmLbl);

    var tempoSlider = document.createElement('input');
    tempoSlider.type = 'range'; tempoSlider.id = 'bt-tempo';
    tempoSlider.min = '40'; tempoSlider.max = '240'; tempoSlider.value = '120';
    tempoSlider.className = 'bt-tempo-slider';
    controls.appendChild(tempoSlider);

    var tempoLbl = document.createElement('span');
    tempoLbl.id = 'bt-tempo-lbl'; tempoLbl.className = 'bt-tempo-lbl';
    tempoLbl.textContent = '120';
    tempoSlider.addEventListener('input', function() { tempoLbl.textContent = tempoSlider.value; });
    controls.appendChild(tempoLbl);

    var meterLbl = document.createElement('label');
    meterLbl.textContent = 'Meter';
    controls.appendChild(meterLbl);

    var timeSigSel = document.createElement('select');
    timeSigSel.id = 'bt-time-sig'; timeSigSel.className = 'bt-ctrl-btn';
    ['4/4','3/4','2/4','6/8','5/4','7/8'].forEach(function(v) {
      var opt = document.createElement('option');
      opt.value = v; opt.textContent = v;
      timeSigSel.appendChild(opt);
    });
    controls.appendChild(timeSigSel);

    var playsLbl = document.createElement('label');
    playsLbl.textContent = 'Plays';
    controls.appendChild(playsLbl);

    var playsInput = document.createElement('input');
    playsInput.type = 'number'; playsInput.id = 'bt-plays';
    playsInput.min = '1'; playsInput.max = '10'; playsInput.step = '1';
    playsInput.className = 'bt-plays-input';
    // Set initial value from song default or smart default
    playsInput.value = String((_bt_song && _bt_song.plays) || 3);
    playsInput.title = 'Number of times to play through the chart';
    playsInput.addEventListener('change', function() {
      var n = Math.max(1, Math.min(10, parseInt(playsInput.value) || 1));
      playsInput.value = String(n);
      if (_bt_song) {
        _bt_song.plays = n;
        if (typeof saveSongs === 'function') saveSongs();
      }
    });
    controls.appendChild(playsInput);

    var spacer = document.createElement('span');
    spacer.className = 'bt-flex-spacer';
    controls.appendChild(spacer);

    var status = document.createElement('span');
    status.id = 'bt-status';
    controls.appendChild(status);

    var toggleWrap = document.createElement('span');
    toggleWrap.className = 'bt-inst-toggles';
    BT_INSTRUMENTS.forEach(function(inst) {
      var btn = document.createElement('button');
      var s   = _bt_state[inst.id];
      btn.className = 'bt-inst-toggle' + (s && s.enabled ? ' active' : '');
      btn.setAttribute('data-id', inst.id);
      btn.textContent = inst.label;
      btn.title = (s && s.enabled ? 'Mute ' : 'Unmute ') + inst.label;
      btn.addEventListener('click', function() {
        var st = _bt_state[inst.id]; st.enabled = !st.enabled;
        btn.classList.toggle('active', st.enabled);
        btn.title = (st.enabled ? 'Mute ' : 'Unmute ') + inst.label;
      });
      toggleWrap.appendChild(btn);
    });
    controls.appendChild(toggleWrap);

    var settBtn = document.createElement('button');
    settBtn.id = 'bt-settings-btn'; settBtn.className = 'bt-ctrl-btn';
    settBtn.textContent = '⚙'; settBtn.title = 'Per-instrument settings';
    settBtn.addEventListener('click', function() {
      var open = instPanel.style.display !== 'none';
      instPanel.style.display = open ? 'none' : '';
      settBtn.classList.toggle('active', !open);
    });
    controls.appendChild(settBtn);

    inner.appendChild(controls);

    var hr = document.createElement('hr');
    hr.className = 'bt-hr';
    inner.appendChild(hr);

    var progRow = document.createElement('div');
    progRow.id = 'bt-progress-row';

    var curLbl = document.createElement('span');
    curLbl.id = 'bt-bar-cur'; curLbl.textContent = 'Bar 1';
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
      if (cur2) cur2.textContent = 'Bar ' + (nb2 + 1);
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

  window.btStart        = btStart;
  window.btStop         = btStop;
  window.btIsRunning    = function() { return _running; };
  window.btGetSong      = function() { return _bt_song; };
  window.btOpenBar      = btOpenBar;
  window.btCloseBar     = btCloseBar;
  window.BT_INSTRUMENTS = BT_INSTRUMENTS;
  window.btLoaded       = true;
})();

/**
 * chord-engine.js — Algorithmic chord voicing for Magic Scroll
 *
 * Exposes one public function:
 *   window.computeVoicing(chordName, instrument)
 *     -> { frets, fingers, base, barres }  (same format as CHORD_DATA entries)
 *     -> null if no voicing found
 *
 * Only used as a fallback when the chord has no hard-coded entry in CHORD_DATA.
 * Results are cached so repeated lookups for the same (chord, instrument) are free.
 */
'use strict';
(function () {

  // -- String tunings (MIDI pitch per string, index 0 = lowest visual string) --
  const TUNINGS = {
    // Guitar
    guitar:              [40, 45, 50, 55, 59, 64], // E2 A2 D3 G3 B3 E4
    drop_d:              [38, 45, 50, 55, 59, 64], // D2 A2 D3 G3 B3 E4
    dadgad:              [38, 45, 50, 55, 57, 62], // D2 A2 D3 G3 A3 D4
    open_g:              [38, 43, 50, 55, 59, 62], // D2 G2 D3 G3 B3 D4
    // Ukulele
    ukulele:             [67, 60, 64, 69],          // G4 C4 E4 A4 (reentrant)
    baritone_uke:        [50, 55, 59, 64],          // D3 G3 B3 E4
    // Mandolin family
    mandolin:            [55, 62, 69, 76],          // G3 D4 A4 E5
    mandola:             [48, 55, 62, 69],          // C3 G3 D4 A4
    mando_cross_gdgd:    [55, 62, 67, 74],          // G3 D4 G4 D5
    mando_cross_aeae:    [57, 64, 69, 76],          // A3 E4 A4 E5
    mando_cajun_fcgd:    [53, 60, 67, 74],          // F3 C4 G4 D5
    mando_gdad:          [55, 62, 69, 74],          // G3 D4 A4 D5
    // Banjo family
    banjo:               [50, 55, 59, 62, 67],      // D3 G3 B3 D4 G4 (5-string open G)
    banjo_sawmill:       [50, 55, 60, 62],          // D3 G3 C4 D4
    banjo_double_c:      [48, 55, 60, 62],          // C3 G3 C4 D4
    banjo_old_std:       [48, 55, 59, 62],          // C3 G3 B3 D4
    // Stringed folk instruments
    irish_bouzouki:      [43, 50, 57, 62],          // G2 D3 A3 D4
    greek_bouzouki:      [48, 53, 57, 62],          // C3 F3 A3 D4
    cittern_gdgdg:       [43, 50, 55, 62, 67],      // G2 D3 G3 D4 G4
    cittern_gdadg:       [43, 50, 57, 62, 67],      // G2 D3 A3 D4 G4
    balalaika:           [57, 64, 64],              // A3 E4 E4
    cavaquinho:          [62, 67, 71, 74],          // D4 G4 B4 D5
    vihuela:             [45, 50, 55, 59, 64],      // A2 D3 G3 B3 E4
  };

  // -- Chord interval definitions ----------------------------------------------
  // ivl: semitones above root
  // pri: priority (0=root/must, 1=3rd/defining, 2=7th/6th, 3=5th/omittable, 4=extension)
  const CHORD_TYPES = {
    '':      { ivl: [0, 4, 7],           pri: [0, 1, 3] },
    'm':     { ivl: [0, 3, 7],           pri: [0, 1, 3] },
    '7':     { ivl: [0, 4, 7, 10],       pri: [0, 1, 3, 2] },
    'maj7':  { ivl: [0, 4, 7, 11],       pri: [0, 1, 3, 2] },
    'm7':    { ivl: [0, 3, 7, 10],       pri: [0, 1, 3, 2] },
    'dim':   { ivl: [0, 3, 6],           pri: [0, 1, 1] },
    'dim7':  { ivl: [0, 3, 6, 9],        pri: [0, 1, 1, 2] },
    'm7b5':  { ivl: [0, 3, 6, 10],       pri: [0, 1, 1, 2] },
    '+':     { ivl: [0, 4, 8],           pri: [0, 1, 1] },
    'aug':   { ivl: [0, 4, 8],           pri: [0, 1, 1] },
    'sus2':  { ivl: [0, 2, 7],           pri: [0, 1, 3] },
    'sus4':  { ivl: [0, 5, 7],           pri: [0, 1, 3] },
    '6':     { ivl: [0, 4, 7, 9],        pri: [0, 1, 3, 2] },
    'm6':    { ivl: [0, 3, 7, 9],        pri: [0, 1, 3, 2] },
    '9':     { ivl: [0, 4, 7, 10, 2],    pri: [0, 1, 3, 2, 4] },
    'maj9':  { ivl: [0, 4, 7, 11, 2],    pri: [0, 1, 3, 2, 4] },
    'm9':    { ivl: [0, 3, 7, 10, 2],    pri: [0, 1, 3, 2, 4] },
    '11':    { ivl: [0, 4, 7, 10, 2, 5], pri: [0, 1, 3, 2, 4, 4] },
    '13':    { ivl: [0, 4, 7, 10, 9],    pri: [0, 1, 3, 2, 2] },
    '7b5':   { ivl: [0, 4, 6, 10],       pri: [0, 1, 1, 2] },
    '7#5':   { ivl: [0, 4, 8, 10],       pri: [0, 1, 1, 2] },
    '7b9':   { ivl: [0, 4, 7, 10, 1],    pri: [0, 1, 3, 2, 4] },
    '7#9':   { ivl: [0, 4, 7, 10, 3],    pri: [0, 1, 3, 2, 4] },
    'add9':  { ivl: [0, 4, 7, 2],        pri: [0, 1, 3, 4] },
    'add11': { ivl: [0, 4, 7, 5],        pri: [0, 1, 3, 4] },
    'mmaj7': { ivl: [0, 3, 7, 11],       pri: [0, 1, 3, 2] },
    '5':     { ivl: [0, 7],              pri: [0, 3] },
  };

  // -- Note name to pitch class ------------------------------------------------
  const NOTE_PC = {
    C: 0, 'C#': 1, Db: 1, D: 2, 'D#': 3, Eb: 3,
    E: 4, F: 5, 'F#': 6, Gb: 6, G: 7, 'G#': 8,
    Ab: 8, A: 9, 'A#': 10, Bb: 10, B: 11,
  };

  // Common quality aliases -> normalised key
  const ALIASES = {
    M: '', maj: '', Maj: '', major: '',
    minor: 'm', min: 'm',
    '-': 'm', '-7': 'm7', '-maj7': 'mmaj7',
    mM7: 'mmaj7', mMaj7: 'mmaj7',
    '2': 'add9',
  };

  // -- Parse a chord name ------------------------------------------------------
  function _parseChord(name) {
    if (!name) return null;
    var bare = name.indexOf('/') !== -1 ? name.slice(0, name.indexOf('/')) : name;
    var m = bare.match(/^([A-G][b#]?)(.*)/);
    if (!m) return null;
    var rootName = m[1];
    var rawQual  = m[2];
    var rootPC   = NOTE_PC[rootName];
    if (rootPC === undefined) return null;

    var qual = ALIASES[rawQual] !== undefined ? ALIASES[rawQual] : rawQual;
    if (CHORD_TYPES[qual]) return { rootPC: rootPC, type: CHORD_TYPES[qual] };

    // Fallback: progressively simpler qualities
    var fallbacks = ['mmaj7','m7b5','dim7','maj7','m7','dim','sus4','sus2','+','aug','m','7',''];
    for (var i = 0; i < fallbacks.length; i++) {
      var fb = fallbacks[i];
      if (qual.startsWith(fb) && CHORD_TYPES[fb]) return { rootPC: rootPC, type: CHORD_TYPES[fb] };
    }
    return { rootPC: rootPC, type: CHORD_TYPES[''] };
  }

  // -- Finger-count estimate ---------------------------------------------------
  // Returns fingers needed. Correctly handles barres: open string inside span breaks barre.
  function _estimateFingers(frets, N) {
    var minFret = 0, frettedCount = 0;
    for (var i = 0; i < N; i++) {
      if (frets[i] > 0) { frettedCount++; if (minFret === 0 || frets[i] < minFret) minFret = frets[i]; }
    }
    if (frettedCount === 0) return 0;

    var firstAtMin = -1, lastAtMin = -1;
    for (var s = 0; s < N; s++) {
      if (frets[s] === minFret) { if (firstAtMin === -1) firstAtMin = s; lastAtMin = s; }
    }
    var barrePossible = firstAtMin !== -1 && firstAtMin !== lastAtMin;
    if (barrePossible) {
      for (var s2 = firstAtMin; s2 <= lastAtMin; s2++) {
        if (frets[s2] < minFret) { barrePossible = false; break; }
      }
    }
    if (barrePossible) {
      var nonBarre = 0;
      for (var s3 = 0; s3 < N; s3++) { if (frets[s3] > minFret) nonBarre++; }
      return 1 + nonBarre;
    }
    return frettedCount;
  }

  // -- Scoring -----------------------------------------------------------------
  function _score(frets, N, tuning, rootPC, tones) {
    var score = 0;
    var covered = {};
    var playedCount = 0, firstPlayed = -1, lastPlayed = -1, maxFret = 0, sumFrets = 0;
    for (var s = 0; s < N; s++) {
      var f = frets[s];
      if (f >= 0) {
        covered[(tuning[s] + f) % 12] = true;
        if (firstPlayed === -1) firstPlayed = s;
        lastPlayed = s;
        playedCount++;
        if (f > maxFret) maxFret = f;
        sumFrets += f;
      }
    }
    if (playedCount < 2) return -9999;

    // Tone coverage
    for (var t = 0; t < tones.length; t++) {
      var tone = tones[t];
      if (covered[tone.pc]) {
        score += (5 - tone.pri) * 8;  // pri0->40, pri1->32, pri2->24, pri3->16, pri4->8
      } else {
        if (tone.pri === 0) return -9999;  // must have root
        if (tone.pri === 1) score -= 28;   // missing 3rd
        if (tone.pri === 2) score -= 12;   // missing 7th/6th
      }
    }

    // Root in bass: give credit if EITHER the first-played-by-index string
    // OR the lowest-pitched played note is the root.
    // First-played handles reentrant instruments (ukulele G string).
    // Lowest-pitch handles cases where a lower string is muted (e.g. ukulele C on str1).
    var firstPlayedPC = -1, lowestPitch = Infinity, lowestPC = -1;
    for (var s2 = 0; s2 < N; s2++) {
      if (frets[s2] >= 0) {
        var p2 = tuning[s2] + frets[s2];
        if (firstPlayedPC === -1) firstPlayedPC = p2 % 12;
        if (p2 < lowestPitch) { lowestPitch = p2; lowestPC = p2 % 12; }
      }
    }
    if (firstPlayedPC === rootPC || lowestPC === rootPC) score += 15;

    // Interior mutes
    for (var s3 = firstPlayed; s3 <= lastPlayed; s3++) {
      if (frets[s3] === -1) score -= 10;
    }

    // Muting the lowest string costs a little
    if (frets[0] === -1) score -= 3;

    // Prefer more strings voiced
    score += playedCount * 7;

    // Prefer lower frets: penalise both position (max) and total finger travel (sum)
    score -= maxFret * 1.5 + sumFrets * 0.5;

    // Finger-count penalty + playability bonus
    var fingerCount = _estimateFingers(frets, N);
    if (fingerCount > 4) {
      score -= 60 * (fingerCount - 4);
    } else {
      // Reward easier shapes: fewer fingers = easier = better
      score += (4 - Math.max(1, fingerCount)) * 3;
    }

    // Penalise if the first played string is high up the neck (fret >= 5)
    // These shapes require awkward stretches and are rarely the best voicing
    for (var s4 = 0; s4 < N; s4++) {
      if (frets[s4] >= 0) {
        if (frets[s4] >= 5) score -= 15;
        break;
      }
    }

    return score;
  }

  // -- Barre detection ---------------------------------------------------------
  function _detectBarres(frets, N) {
    var minFret = 0;
    for (var i = 0; i < N; i++) {
      if (frets[i] > 0 && (minFret === 0 || frets[i] < minFret)) minFret = frets[i];
    }
    if (minFret === 0) return [];

    var firstAtMin = -1, lastAtMin = -1;
    for (var s = 0; s < N; s++) {
      if (frets[s] === minFret) { if (firstAtMin === -1) firstAtMin = s; lastAtMin = s; }
    }
    if (firstAtMin === -1 || firstAtMin === lastAtMin) return [];

    var broken = false, barreCount = 0;
    for (var s2 = firstAtMin; s2 <= lastAtMin; s2++) {
      if (frets[s2] < minFret) { broken = true; break; }
      if (frets[s2] === minFret) barreCount++;
    }
    if (broken || barreCount < 2) return [];
    return [{ fret: minFret, from: firstAtMin + 1, to: lastAtMin + 1 }];
  }

  // -- Finger assignment -------------------------------------------------------
  function _assignFingers(frets, N) {
    var fingers = new Array(N).fill(0);
    var seen = {}, uniqueFrets = [];
    for (var s = 0; s < N; s++) {
      if (frets[s] > 0 && !seen[frets[s]]) { seen[frets[s]] = true; uniqueFrets.push(frets[s]); }
    }
    uniqueFrets.sort(function(a,b){return a-b;});
    for (var fi = 0; fi < uniqueFrets.length; fi++) {
      var fv = uniqueFrets[fi];
      var cap = Math.min(fi + 1, 4);
      for (var s2 = 0; s2 < N; s2++) { if (frets[s2] === fv) fingers[s2] = cap; }
    }
    return fingers;
  }

  // -- Build output object -----------------------------------------------------
  function _buildOutput(frets, N, tuning) {
    var base = 0, maxFret = 0;
    for (var s = 0; s < N; s++) {
      if (frets[s] > 0) {
        if (base === 0 || frets[s] < base) base = frets[s];
        if (frets[s] > maxFret) maxFret = frets[s];
      }
    }
    // If all fretted notes fit within a nut-anchored 4-fret window (frets 1–4),
    // always display from the nut (base=1) so the diagram shows position clearly.
    if (maxFret <= 4) base = 1;
    if (base === 0) base = 1;
    var barres  = _detectBarres(frets, N);
    var fingers = _assignFingers(frets, N);
    return { frets: Array.from(frets), fingers: fingers, base: base, barres: barres };
  }

  // -- Main voicing search -----------------------------------------------------
  var MAX_FRET = 14;
  var SPAN     = 4;

  function _search(chordName, instrument) {
    var tuning = TUNINGS[instrument];
    if (!tuning) return null;

    var parsed = _parseChord(chordName);
    if (!parsed) return null;

    var rootPC = parsed.rootPC;
    var type   = parsed.type;
    var N      = tuning.length;

    var tones = [];
    for (var ti = 0; ti < type.ivl.length; ti++) {
      tones.push({ pc: (rootPC + type.ivl[ti] + 120) % 12, pri: type.pri[ti] });
    }

    var allPCsArr = tones.map(function(t){return t.pc;});
    var allPCs = {};
    for (var ai = 0; ai < allPCsArr.length; ai++) allPCs[allPCsArr[ai]] = true;

    var mustPCsArr = tones.filter(function(t){return t.pri <= 1;}).map(function(t){return t.pc;});
    var mustPCs = {};
    for (var mi = 0; mi < mustPCsArr.length; mi++) mustPCs[mustPCsArr[mi]] = true;

    var bestFrets = null, bestScore = -Infinity;

    for (var fmin = 0; fmin <= MAX_FRET - SPAN + 1; fmin++) {
      var fmax  = fmin + SPAN - 1;
      var fRangeStart = fmin === 0 ? 1 : fmin;

      // Per-string options: -1=mute, 0=open, positive=fret in window
      var strOpts = [];
      for (var s = 0; s < N; s++) {
        var openPC = tuning[s] % 12;
        var opts = [-1];
        if (allPCs[openPC]) opts.push(0);
        for (var f = fRangeStart; f <= fmax; f++) {
          if (allPCs[(tuning[s] + f) % 12]) opts.push(f);
        }
        strOpts.push(opts);
      }

      // Precompute which PCs each option covers, per string
      var strOptPCs = [];
      for (var s2 = 0; s2 < N; s2++) {
        var opcs = [];
        for (var oi = 0; oi < strOpts[s2].length; oi++) {
          var fo = strOpts[s2][oi];
          opcs.push(fo >= 0 ? (tuning[s2] + fo) % 12 : -1);
        }
        strOptPCs.push(opcs);
      }

      // Exhaustive DFS with pruning
      var assign = new Array(N).fill(-1);
      var covered = {};

      function dfs(s) {
        if (s === N) {
          for (var pc in mustPCs) { if (!covered[pc]) return; }
          var sc = _score(assign, N, tuning, rootPC, tones);
          if (sc > bestScore) { bestScore = sc; bestFrets = assign.slice(); }
          return;
        }
        // Prune: check remaining strings can cover all uncovered mustPCs
        for (var mpc in mustPCs) {
          if (covered[mpc]) continue;
          var canCover = false;
          for (var s2c = s; s2c < N && !canCover; s2c++) {
            for (var oi2 = 0; oi2 < strOptPCs[s2c].length; oi2++) {
              if (strOptPCs[s2c][oi2] == mpc) { canCover = true; break; }
            }
          }
          if (!canCover) return;
        }
        for (var oi3 = 0; oi3 < strOpts[s].length; oi3++) {
          var fv = strOpts[s][oi3];
          assign[s] = fv;
          var pc2 = strOptPCs[s][oi3];
          var added = pc2 >= 0 && !covered[pc2];
          if (added) covered[pc2] = true;
          dfs(s + 1);
          if (added) delete covered[pc2];
        }
      }

      dfs(0);
    }

    if (!bestFrets) return null;
    return _buildOutput(bestFrets, N, tuning);
  }

  // -- Cache & public API ------------------------------------------------------
  var _cache = Object.create(null);

  window.computeVoicing = function (chordName, instrument) {
    if (!chordName || !instrument || instrument === 'none' || instrument === 'piano') return null;
    var key = chordName + '\x00' + instrument;
    if (key in _cache) return _cache[key];
    _cache[key] = _search(chordName, instrument);
    return _cache[key];
  };

})();

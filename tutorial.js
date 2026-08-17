/**
 * tutorial.js — Magic Scroll guided tutorial system (DEV BUILD ONLY)
 * ============================================================================
 * Self-contained onboarding overlay: spotlight pop-ups that point at real
 * topbar/sidebar controls, a first-run welcome banner, contextual nudges the
 * first time a sheet-music/lead-sheet song is opened, and a set of replayable
 * "flows" re-entered from Options → Tutorials (see the #tutorials-wrap block
 * in MagicScroll-development.html's topbar).
 *
 * Loaded as a plain <script src="tutorial.js"> right before </body>, after
 * the app's own inline script has already run — so every app function/element
 * this file touches (openSettingsPanel, window.MS_LANG, renderABCSong, etc.)
 * already exists. Nothing in the core app file was changed for THIS file's
 * sake except: the small #tutorials-wrap topbar block, its id added to
 * _TOPBAR_SETTINGS_IDS (mobile/options relocation) and to the outside-click
 * "wraps" allowlist, and this file's <script> tag. Everything else — overlay,
 * spotlight, popups, flow content, persistence, translations — lives here.
 *
 * BEHAVIOUR CONTRACT (per product spec)
 * While a "guided" step is active, the rest of the page is click-blocked.
 * The user has exactly three ways to move past it:
 *   1. Click the actual highlighted control (the spotlight leaves it clickable
 *      — no fake overlay button, the real element receives the real click).
 *   2. Click the ✕ in the pop-up — exits the current tour entirely.
 *   3. Click "Don't show tutorial pop-ups again" — exits AND disables all
 *      tutorials app-wide until re-enabled from Options → Tutorials.
 * A "Back" button (new) additionally lets the user step to the previous
 * pop-up to re-read it — it's pure navigation, doesn't undo anything the app
 * itself did, and doesn't count as one of the three ways off a step above.
 * "Informational" steps (no action required — just pointing something out, a
 * welcome/closing message) show a Next/Done button in the pop-up itself,
 * since there's nothing on the page to click.
 * ============================================================================
 */
(function () {
  'use strict';
  if (window.__msTutorialLoaded) return;
  window.__msTutorialLoaded = true;

  // ── PERSISTENCE ────────────────────────────────────────────────────────
  var LS_DISABLED = 'ms_tutorials_disabled';
  var LS_WELCOMED = 'ms_tutorial_welcomed';
  var LS_SEEN_PRE = 'ms_tutorial_seen_';
  var LS_CTX_PRE  = 'ms_tutorial_ctx_offered_';

  function lsGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function lsSet(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }

  function tutorialsDisabled() { return lsGet(LS_DISABLED) === '1'; }
  function setTutorialsDisabled(v) { lsSet(LS_DISABLED, v ? '1' : '0'); }
  function flowSeen(id) { return lsGet(LS_SEEN_PRE + id) === '1'; }
  function markFlowSeen(id) { lsSet(LS_SEEN_PRE + id, '1'); }
  function ctxOffered(id) { return lsGet(LS_CTX_PRE + id) === '1'; }
  function markCtxOffered(id) { lsSet(LS_CTX_PRE + id, '1'); }

  // ── SMALL DOM/GEOMETRY HELPERS ─────────────────────────────────────────
  function isVisible(el) {
    if (!el) return false;
    var r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  }
  function waitForTarget(selector, timeoutMs, cb) {
    if (!selector) { cb(null); return; }
    var immediate = document.querySelector(selector);
    if (isVisible(immediate)) { cb(immediate); return; }
    var start = Date.now();
    var iv = setInterval(function () {
      var el = document.querySelector(selector);
      if (isVisible(el)) { clearInterval(iv); cb(el); return; }
      if (Date.now() - start > timeoutMs) { clearInterval(iv); cb(isVisible(el) ? el : null); }
    }, 100);
  }
  // Branching-step counterpart of waitForTarget: polls until AT LEAST ONE of
  // the given {selector, branch} entries is visible, then hands back every
  // entry that's visible at that moment (not just the first) — so if both
  // the drop zone and the "✦ New" button are on screen, both come back and
  // both get wired up as valid, simultaneous ways to advance.
  function waitForAnyTarget(targets, timeoutMs, cb) {
    function collect() {
      return targets.map(function (t) {
        var el = document.querySelector(t.selector);
        return isVisible(el) ? { el: el, branch: t.branch } : null;
      }).filter(Boolean);
    }
    var immediate = collect();
    if (immediate.length) { cb(immediate); return; }
    var start = Date.now();
    var iv = setInterval(function () {
      var found = collect();
      if (found.length) { clearInterval(iv); cb(found); return; }
      if (Date.now() - start > timeoutMs) { clearInterval(iv); cb([]); }
    }, 100);
  }
  // Polls until the given selector is no longer visible (a modal/panel the
  // user opened by clicking a step's real target has been closed), then
  // calls cb. No timeout — unlike waitForTarget/waitForAnyTarget this is
  // waiting on the USER to finish doing something (e.g. browsing Collections)
  // rather than on the page to finish rendering, so there's no "genuinely
  // never happens" case to bail out of; exit()/state.active going false is
  // what actually stops it (checked by the caller before acting on cb).
  function waitForClose(selector, cb) {
    function check() {
      if (!state.active) return;
      var el = document.querySelector(selector);
      if (!isVisible(el)) { cb(); return; }
      setTimeout(check, 200);
    }
    check();
  }

  // ── TRANSLATIONS ─────────────────────────────────────────────────────────
  // All tutorial copy lives in sidecar files — tutorial-strings-en.js (source
  // of truth + documentation of what every key means/where it's used),
  // tutorial-strings-fr.js, tutorial-strings-zh.js — loaded via <script src>
  // BEFORE this file, defining window.MS_TUTORIAL_STRINGS_EN/FR/ZH. This
  // mirrors the app's own strings-en/fr/zh.js sidecar convention, kept
  // separate from those files because this is a dev-build/test feature and
  // the app's own t() falls back to raw key text on a miss (see
  // applyI18nStrings' guard) — wiring tutorial copy through data-i18n
  // without also editing those three files would just print keys on screen.
  // tt() below does the same dictionary-with-English-fallback lookup, driven
  // by the same window.MS_LANG the rest of the app already sets from
  // #lang-sel. If a sidecar file fails to load, its dictionary is just
  // missing and every lookup falls through to English (or, if even that
  // failed to load, to the raw key) — never throws.
  function stringsForLang(lang) {
    if (lang === 'fr') return window.MS_TUTORIAL_STRINGS_FR || {};
    if (lang === 'zh') return window.MS_TUTORIAL_STRINGS_ZH || {};
    return window.MS_TUTORIAL_STRINGS_EN || {};
  }

  function currentLang() {
    var l = window.MS_LANG;
    return (l === 'fr' || l === 'zh') ? l : 'en';
  }
  function tt(key, vars) {
    var dict = stringsForLang(currentLang());
    var en = window.MS_TUTORIAL_STRINGS_EN || {};
    var s = (dict[key] !== undefined) ? dict[key] : (en[key] !== undefined ? en[key] : key);
    if (vars) { Object.keys(vars).forEach(function (k) { s = s.split('{' + k + '}').join(vars[k]); }); }
    return s;
  }

  // ── FLOW CONTENT ────────────────────────────────────────────────────────
  // Every step: { key, mode:'wait'|'show', target|targets, event, placement,
  //               alreadyOpen(), secondaryTargets, last }. `target` is a
  //               single CSS selector (classic single-target step). `targets`
  //               (branching steps only) is an array of {selector, branch}
  //               — every visible one stays simultaneously clickable, and
  //               whichever the user actually clicks splices that branch's
  //               steps (from BRANCHES below) into the live flow right after
  //               this step. `secondaryTargets` is a plain array of extra
  //               selectors to also carve out of the dark mask/give a glow
  //               ring to, purely for visibility/access — no listener, no
  //               branch, doesn't affect advancement. Title/body text is
  //               resolved from the MS_TUTORIAL_STRINGS_* dictionaries via
  //               `flowId + '.' + key + '.title' / '.body'` at render time
  // (see renderPopupContent), so it always reflects the current language.
  // 'wait'  — blocking: user must click/interact with the real target.
  // 'show'  — informational: pop-up carries its own Next/Done button.
  var sidebarOpen = function () {
    return window.innerWidth <= 520
      ? document.body.classList.contains('sidebar-open')
      : !!(document.getElementById('sidebar') && !document.getElementById('sidebar').classList.contains('collapsed'));
  };
  var panelOpen = function (id) {
    var p = document.getElementById(id);
    return !!(p && p.classList.contains('open'));
  };
  // Both editors rebuild their toolbar's "active" DOM state on every render
  // rather than exposing their internal isEditing/isLsEditMode flags on
  // window, so — same as panelOpen()/sidebarOpen() above — these read that
  // back off the DOM instead of reaching into app internals.
  var abcEditModeOn = function () {
    var bar = document.getElementById('abc-transpose-bar');
    return !!(bar && bar.style.display !== 'none' && isVisible(bar));
  };
  var lsEditModeOn = function () {
    var btn = document.getElementById('btn-ls-edit');
    return !!(btn && btn.classList.contains('active'));
  };
  // The classic plaintext/Chords-type editor toggles this class on <body>
  // via setEditMode() (see MagicScroll-development.html) whenever it's open
  // for editing — it's the one reliable, already-there signal that the user
  // is sitting on a song's edit page right now. Used by start() to fast-
  // forward the addingSongs flow straight to its editor-basics content
  // instead of walking someone who's already there back through "open the
  // sidebar, add a new song" first.
  var songEditModeOn = function () {
    return document.body.classList.contains('editing-song');
  };

  var FLOWS = {
    generalUsage: {
      steps: [
        { key: 'welcome', mode: 'show', target: null },
        { key: 'sidebar', mode: 'wait', target: '#btn-sidebar', event: 'click', alreadyOpen: sidebarOpen, placement: 'right' },
        // Real click on the actual Collections button, which opens the real
        // browser modal — waitForClose hides the spotlight/popup while that
        // modal is open (rather than leaving them floating uselessly on top
        // of it) and resumes with the next step once the user closes it and
        // is back looking at the library, per the product ask: "the tutorial
        // bit should go away but return the next time the user accesses that
        // particular part of the menu." skippable: true — browsing
        // Collections isn't something every user wants to do mid-tour, so a
        // real Next button lets them move on without opening the modal at
        // all (see step.skippable in renderPopupContent).
        { key: 'collections', mode: 'wait', target: '#btn-collections', event: 'click', placement: 'right', waitForClose: '#collections-modal', reopenSidebarAfter: true, skippable: true },
        // "✦ New" branches straight into the Adding Songs tour's new-song
        // content (same BRANCHES entry addingSongs' own "choose" step uses —
        // see the ns:'addingSongs' override on those steps so their copy
        // resolves correctly even though state.flowId is still
        // 'generalUsage' here) and the tour ends there rather than returning
        // to finish the rest of General Usage — clicking New is a deliberate
        // "take me to Adding Songs" redirect, not a brief detour. The drop
        // zone itself isn't a branch target (dragging a file just imports it
        // directly, already covered by this step's own copy) — only New
        // used to silently do nothing when clicked, which is the bug this
        // fixes.
        { key: 'dropzone', mode: 'show', target: '#drop-zone', placement: 'top', branchTargets: [
            { selector: '#btn-new-song-sidebar', branch: 'addingSongs_newSongBranch' }
          ] },
        { key: 'chords', mode: 'wait', target: '#btn-music-menu', event: 'click', alreadyOpen: function () { return panelOpen('music-menu-panel'); }, placement: 'bottom',
          // On narrow/mobile widths the open sidebar is a fixed-position
          // overlay drawer (z-index 500) that physically covers the left
          // ~260px of the topbar — including the Chords tab — so it must be
          // closed before this step's target is even reachable. Desktop
          // never needs this: the sidebar sits beside the content there,
          // never on top of the topbar. See closeSidebarFirst in showStep().
          closeSidebarFirst: true },
        { key: 'keygroup', mode: 'show', target: '#topbar-key-group', placement: 'bottom' },
        { key: 'options', mode: 'wait', target: '#btn-settings-menu', event: 'click', alreadyOpen: function () { return panelOpen('settings-menu-panel'); }, placement: 'bottom' },
        { key: 'size', mode: 'show', target: '#topbar-size-group', placement: 'bottom' },
        { key: 'tutorials', mode: 'show', target: '#btn-tutorials-settings', placement: 'bottom' },
        { key: 'scroll', mode: 'show', target: '#topbar-scroll-group', placement: 'bottom' },
        { key: 'done', mode: 'show', target: null, last: true }
      ]
    },
    addingSongs: {
      steps: [
        { key: 'intro', mode: 'show', target: null },
        { key: 'sidebar', mode: 'wait', target: '#btn-sidebar', event: 'click', alreadyOpen: sidebarOpen, placement: 'right' },
        // "choose" is a branching wait step: BOTH targets stay clickable at
        // once (unlike every other wait step, which has exactly one correct
        // target). Whichever the user actually clicks splices that branch's
        // steps (see BRANCHES below) in right after this one. This exists so
        // a user with no files handy yet can still complete this step via
        // "✦ New" instead of being stuck staring at an unusable drop zone.
        { key: 'choose', mode: 'wait', event: 'click', placement: 'right', targets: [
            { selector: '#drop-zone', branch: 'addingSongs_dropzoneBranch' },
            { selector: '#btn-new-song-sidebar', branch: 'addingSongs_newSongBranch' }
          ] }
      ]
    },
    sheetMusic: {
      steps: [
        { key: 'intro', mode: 'show', target: null },
        { key: 'toolbar', mode: 'show', target: '#abc-toolbar', placement: 'bottom' },
        // Was mode:'show' (just pointed at the button, never required a
        // click) — but #abc-transpose-bar (the "transpose" step just below)
        // only exists in the DOM once edit mode is actually on, so the old
        // sequence usually reached "transpose" with nothing there to
        // highlight and fell back to an unhighlighted centred pop-up. Now a
        // real wait step: the user has to actually click Edit, which turns
        // edit mode on for real before "transpose" ever renders.
        { key: 'edit', mode: 'wait', target: '#btn-abc-edit', event: 'click', alreadyOpen: abcEditModeOn, placement: 'bottom' },
        { key: 'menu', mode: 'show', target: '#btn-abc-sheetmusic-menu-trigger', placement: 'bottom' },
        // Reachable now that "edit" above guarantees edit mode is on.
        { key: 'transpose', mode: 'show', target: '#abc-transpose-bar', placement: 'bottom' },
        // New: covers "⛓ Create set" (#btn-abc-set), which stacks other ABC
        // tunes from the library right after this one into a combined,
        // playable-through set — the same idea as a session's tune set.
        // Real wait step, same pattern as generalUsage's "collections": the
        // click opens the app's own #abc-set-modal (search/filter, check
        // tunes on in the order you want them, "Show set"), which needs the
        // user's full attention and covers a lot of the screen, so
        // waitForClose hides the tutorial's own UI while it's open and
        // resumes with "done" once the user closes it (Show set OR Cancel —
        // waitForClose only cares that the modal itself is gone, not which
        // button got it there). skippable: true because building a set isn't
        // something every user wants to do mid-tour, and a fresh library
        // with only one ABC tune in it has nothing else to add anyway — the
        // modal would just show its empty state.
        { key: 'createSet', mode: 'wait', target: '#btn-abc-set', event: 'click', placement: 'bottom', waitForClose: '#abc-set-modal', skippable: true },
        { key: 'done', mode: 'show', target: null, last: true }
      ]
    },
    leadSheets: {
      steps: [
        { key: 'intro', mode: 'show', target: null },
        { key: 'toolbar', mode: 'show', target: '#ireal-toolbar', placement: 'bottom' },
        // New step: chord cells in #ireal-content only respond to editing
        // once the chart's own edit mode is on (#btn-ls-edit toggles it) —
        // the old flow went straight to "content" and told the user to tap
        // a cell to edit it while still in read-only mode, so nothing
        // happened. This forces the real click first.
        { key: 'edit', mode: 'wait', target: '#btn-ls-edit', event: 'click', alreadyOpen: lsEditModeOn, placement: 'bottom' },
        { key: 'content', mode: 'show', target: '#ireal-content', placement: 'top' },
        { key: 'done', mode: 'show', target: null, last: true }
      ]
    }
  };

  // Step arrays spliced into a flow's live `state.steps` when a branching
  // "targets"/"branchTargets" step resolves — see the "choose" step in
  // addingSongs and the "dropzone" step in generalUsage above, and the
  // splice logic in showStep(). Keyed by the `branch` name given on each
  // target. state.flowId doesn't change when these splice in (it's still
  // whichever flow the user started, e.g. 'generalUsage'), so every step
  // here carries an explicit `ns: 'addingSongs'` — renderPopupContent()
  // prefers a step's own `ns` over state.flowId for string lookup — to keep
  // pulling from the addingSongs.* keys (where this copy is documented and
  // maintained once) regardless of which flow actually spliced it in.
  var BRANCHES = {
    // User dropped/picked a file — nothing further to demonstrate, Magic
    // Scroll takes it from there automatically.
    addingSongs_dropzoneBranch: [
      { key: 'dropzoneDone', ns: 'addingSongs', mode: 'show', target: null, last: true }
    ],
    // User clicked "✦ New" — walk through the New Song form that just
    // opened, then (this round) actually create it and cover the basics of
    // the song/chord-sheet editor itself: entering/exiting Add Chords mode,
    // then the editor's own toolbar (Share ▾ and Collaborate). This
    // deliberately DOES require a real click on "Open Editor" now — unlike
    // round 1, which stopped short of that specifically to avoid forcing a
    // real song into the user's library. Actually reaching the edit tab (the
    // whole point of this addition) has no way around that; "toolbar" below
    // reminds the user it's a real, keepable-or-deletable song, same as if
    // they'd clicked through New Song themselves.
    // Both New Song modal steps below carve out the WHOLE modal box
    // (secondaryTargets: ['#new-song-box']), not just each step's own small
    // primary target — otherwise everything else in the modal (crucially,
    // the Title/Artist/Key fields) sits under the dark mask and is neither
    // visible nor clickable, which on "openEditor" left the user unable to
    // type a title and therefore unable to progress at all (its target,
    // "Open Editor", validates the title client-side and just refocuses the
    // field instead of advancing when it's blank). placement: 'right' keeps
    // the pop-up beside the modal instead of on top of it — the modal is
    // centred with room on both sides on any normal desktop width; on
    // narrow/mobile widths where it isn't, positionPopup's own placement
    // fallback chain (bottom → top → right → left, see tryPlacement) takes
    // over the same way it does for every other step in this file.
    addingSongs_newSongBranch: [
      { key: 'nstype', ns: 'addingSongs', mode: 'show', target: '#ns-type', placement: 'right', secondaryTargets: ['#new-song-box'] },
      { key: 'openEditor', ns: 'addingSongs', mode: 'wait', target: '#btn-ns-create', event: 'click', placement: 'right', secondaryTargets: ['#new-song-box'] },
      // "format" ("Just start typing") moved here from before "openEditor"
      // — it used to point at a hint block inside the New Song modal, shown
      // before the editor (or any song) existed at all, which read fine but
      // gave the user nothing to actually act on. Now it targets the real,
      // now-open editor directly (#song-editor-wrap — covers both the plain
      // textarea and, later, the Add Chords precision canvas that overlays
      // it) so the user can genuinely start typing lyrics while this step is
      // up. mode:'show' with its own Next button, same as always — there's
      // no "wait for" signal for arbitrary typing the way a click can be
      // waited for, so the user moves on when they're ready rather than
      // when they've typed something specific.
      { key: 'format', ns: 'addingSongs', mode: 'show', target: '#song-editor-wrap', placement: 'top' },
      // Only reachable for the default "Song / Chord Sheet" type — ABC/iReal
      // picks don't open into this editor at all (see nstype's own copy).
      // If #btn-precision-toggle never appears (a different type was picked,
      // or the title was left blank and openEditor's click didn't actually
      // create anything), these three steps simply time out / render as a
      // graceful centred fallback per the standard "target genuinely not on
      // the page" rule, landing on "toolbar" the same way as before.
      //
      // All three keep the live editing surface carved out and placement:'top'
      // puts the pop-up itself above the toggle button, over the Title/Artist
      // fields (not needed at this stage, fine to stay covered) rather than
      // down over the editor it's the whole point of keeping clickable — Add
      // Chords mode is meaningless without lyrics already in the editor to
      // tag (the reason "format" above moved ahead of these), so the editor
      // has to stay usable/visible the whole time the user is turning
      // tagging mode on, actually using it, and turning it back off.
      //
      // #song-editor-wrap and #precision-canvas are siblings inside
      // #edit-pane, not one nested in the other (see the wrap/canvas markup
      // around "song-editor-wrap") — the app shows exactly one of the two at
      // a time and collapses the other to display:none (#song-editor-wrap
      // has no explicit height of its own; with its textarea hidden it
      // measures 0×0). resolveSelectors() already filters secondaryTargets
      // down to whichever elements are actually visible, so listing both is
      // safe — the hidden one is silently dropped — but a *primary* target
      // is different: showStep's waitForTarget blocks on it being visible at
      // all, polling for up to 2200ms before giving up. addChordsOn is
      // rendered before the toggle click (plain-typing mode, wrap visible) so
      // #song-editor-wrap works fine as its own secondary target. But
      // addChordsUsage and addChordsOff both render *after* Add Chords mode
      // is already on — #song-editor-wrap is the collapsed one there, so
      // using it as addChordsUsage's primary target left the step stuck
      // showing the previous popup's stale content for the full 2200ms
      // timeout before finally rendering with zero carved-out targets (mask
      // fully covering the canvas). addChordsUsage targets #precision-canvas
      // instead (the element actually on screen at that point), and
      // addChordsOff's secondary target swaps to #precision-canvas for the
      // same reason — it renders while the user is still in Add Chords mode,
      // right up until they click the toggle to leave it.
      { key: 'addChordsOn', ns: 'addingSongs', mode: 'wait', target: '#btn-precision-toggle', event: 'click', placement: 'top', secondaryTargets: ['#song-editor-wrap'] },
      // New: a middle step between turning tagging mode on and back off —
      // round 3 went straight from one toggle click to the next with no
      // chance to actually try it. mode:'show' (own Next button) since,
      // again, there's nothing to "wait for" here beyond the user trying it
      // themselves at their own pace.
      { key: 'addChordsUsage', ns: 'addingSongs', mode: 'show', target: '#precision-canvas', placement: 'top', secondaryTargets: ['#song-editor-wrap'] },
      { key: 'addChordsOff', ns: 'addingSongs', mode: 'wait', target: '#btn-precision-toggle', event: 'click', placement: 'top', secondaryTargets: ['#precision-canvas'] },
      { key: 'toolbar', ns: 'addingSongs', mode: 'show', target: '#edit-toolbar', placement: 'bottom' },
      { key: 'done', ns: 'addingSongs', mode: 'show', target: null, last: true }
    ]
  };

  // ── DOM / CSS BUILD ─────────────────────────────────────────────────────
  var els = {};
  function injectStyle() {
    // Font: the whole widget used to default to --font-ui (the app's
    // decorative title/chrome typeface — 'TypographerGotisch Schmuck' /
    // 'IM Fell English' by default), which every element without its own
    // font-family inherited straight from #ms-tut-root, including the
    // pop-up's own paragraph body text. That decorative face reads fine as
    // a one-line heading but is hard to read as a full sentence. #ms-tut-root
    // now defaults to --font-mono instead (the app's standard body/tab
    // font, Valeson by default — see the --font-* comment block near the
    // top of this file's sibling HTML for the full family list), so
    // anything without its own override (body copy, hints, the progress
    // counter, buttons, links) reads in the same body font as the rest of
    // the app. --font-ui is then reapplied explicitly, just to the two real
    // headings (.ms-tut-popup h5 / .ms-tut-banner h5 below) — headings are
    // short enough that the decorative face stays legible there and it
    // keeps the pop-up's title visually matched to the rest of the app's
    // chrome. Both variables already resolve through the user's own Themes
    // → Fonts picker (sf-mono / sf-ui, see MagicScroll's font-settings
    // block) if they've customised either slot, so this follows whatever
    // the user has actually set rather than hardcoding a font name.
    var css = ''
    + '#ms-tut-root{font-family:var(--font-mono, sans-serif);}'
    + '.ms-tut-mask{position:fixed;background:rgba(0,0,0,0.62);z-index:999990;pointer-events:auto;cursor:default;}'
    + '.ms-tut-mask-precise{position:fixed;left:0;top:0;width:100vw;height:100vh;background:rgba(0,0,0,0.62);z-index:999990;pointer-events:auto;cursor:default;}'
    + '.ms-tut-ring{position:fixed;pointer-events:none;z-index:999991;border:2px solid var(--c-accent,#c8922a);border-radius:7px;'
    +   'box-shadow:0 0 0 4px var(--c-accent-glow,rgba(200,146,42,.28)),0 0 16px 2px var(--c-accent,#c8922a);'
    +   'transition:left .16s ease,top .16s ease,width .16s ease,height .16s ease;animation:ms-tut-pulse 1.6s ease-in-out infinite;}'
    + '@keyframes ms-tut-pulse{0%,100%{opacity:1;}50%{opacity:.65;}}'
    + '.ms-tut-popup{position:fixed;z-index:999999;background:var(--c-chrome-bg2,#1a1510);border:1px solid var(--c-chrome-border,#7a5818);'
    +   'border-radius:6px;box-shadow:0 10px 40px rgba(0,0,0,.75);padding:14px 16px;width:308px;max-width:calc(100vw - 24px);'
    +   'color:var(--c-chrome-text,#e8d9b8);font-size:0.8rem;line-height:1.55;box-sizing:border-box;}'
    + '.ms-tut-popup.ms-tut-shake{animation:ms-tut-shake .32s ease;}'
    + '@keyframes ms-tut-shake{0%,100%{transform:translateX(0);}25%{transform:translateX(-5px);}75%{transform:translateX(5px);}}'
    + '.ms-tut-popup h5{margin:0 0 8px;color:var(--c-accent,#c8922a);font-size:0.92rem;font-weight:normal;padding-right:26px;'
    +   'font-family:var(--font-ui,serif);}'
    + '.ms-tut-close{position:absolute;top:8px;right:8px;width:24px;height:24px;display:flex;align-items:center;justify-content:center;'
    +   'background:transparent;border:1px solid var(--c-chrome-border,#7a5818);border-radius:3px;color:var(--c-chrome-muted,#9a8a6a);'
    +   'font-family:var(--font-mono,inherit);font-size:0.78rem;line-height:1;cursor:pointer;padding:0;}'
    + '.ms-tut-close:hover{color:var(--c-accent,#c8922a);border-color:var(--c-accent,#c8922a);}'
    + '.ms-tut-body{margin:0 0 10px;font-family:var(--font-mono,sans-serif);}'
    + '.ms-tut-body strong{color:var(--c-accent,#c8922a);font-weight:normal;}'
    + '.ms-tut-body code{background:var(--c-chrome-bg,#0f0d09);padding:1px 4px;border-radius:2px;font-size:0.9em;}'
    + '.ms-tut-hint{font-style:italic;color:var(--c-chrome-muted,#9a8a6a);font-size:0.72rem;margin:0 0 10px;font-family:var(--font-mono,sans-serif);}'
    + '.ms-tut-footer{display:flex;align-items:center;justify-content:space-between;gap:8px;}'
    + '.ms-tut-progress{font-size:0.65rem;color:var(--c-chrome-muted,#9a8a6a);white-space:nowrap;font-family:var(--font-mono,sans-serif);}'
    + '.ms-tut-btns{display:flex;gap:6px;}'
    + '.ms-tut-back-btn{background:transparent;color:var(--c-chrome-text,#e8d9b8);border:1px solid var(--c-chrome-border,#7a5818);'
    +   'font-family:var(--font-mono,inherit);font-size:0.75rem;padding:5px 11px;cursor:pointer;border-radius:2px;}'
    + '.ms-tut-back-btn:hover{border-color:var(--c-accent,#c8922a);color:var(--c-accent,#c8922a);}'
    + '.ms-tut-next-btn{background:var(--c-accent,#c8922a);color:var(--c-chrome-bg,#0f0d09);border:1px solid var(--c-accent,#c8922a);'
    +   'font-family:var(--font-mono,inherit);font-size:0.75rem;padding:5px 14px;cursor:pointer;border-radius:2px;}'
    + '.ms-tut-dontshow-row{margin-top:9px;padding-top:8px;border-top:1px solid var(--c-chrome-border,#7a5818);}'
    + '.ms-tut-dontshow{background:none;border:none;color:var(--c-chrome-muted,#9a8a6a);text-decoration:underline;cursor:pointer;'
    +   'font-size:0.65rem;padding:0;font-family:var(--font-mono,inherit);}'
    + '.ms-tut-dontshow:hover{color:var(--c-accent,#c8922a);}'
    + '.ms-tut-banner{position:fixed;bottom:16px;right:16px;z-index:999998;background:var(--c-chrome-bg2,#1a1510);'
    +   'border:1px solid var(--c-chrome-border,#7a5818);border-radius:6px;padding:13px 15px;max-width:270px;'
    +   'box-shadow:0 8px 30px rgba(0,0,0,.6);color:var(--c-chrome-text,#e8d9b8);font-size:0.78rem;line-height:1.5;'
    +   'opacity:0;transform:translateY(8px);transition:opacity .25s ease,transform .25s ease;}'
    + '.ms-tut-banner.ms-tut-in{opacity:1;transform:translateY(0);}'
    + '.ms-tut-banner h5{margin:0 0 6px;color:var(--c-accent,#c8922a);font-size:0.85rem;font-weight:normal;font-family:var(--font-ui,serif);}'
    + '.ms-tut-banner .ms-tut-banner-actions{display:flex;gap:6px;margin-top:10px;flex-wrap:wrap;}'
    + '.ms-tut-banner button{font-family:var(--font-mono,inherit);font-size:0.7rem;padding:4px 9px;cursor:pointer;border-radius:2px;}'
    + '.ms-tut-banner .ms-tut-banner-start{background:var(--c-accent,#c8922a);color:var(--c-chrome-bg,#0f0d09);border:1px solid var(--c-accent,#c8922a);}'
    + '.ms-tut-banner .ms-tut-banner-later{background:transparent;color:var(--c-chrome-text,#e8d9b8);border:1px solid var(--c-chrome-border,#7a5818);}'
    + '.ms-tut-banner .ms-tut-banner-never{background:none;border:none;color:var(--c-chrome-muted,#9a8a6a);text-decoration:underline;cursor:pointer;font-size:0.68rem;padding:0;margin-top:8px;display:inline-block;font-family:var(--font-mono,inherit);}'
    + '.tutorial-flow-btn{display:block;width:100%;text-align:left;margin-bottom:5px;background:var(--c-chrome-bg3,#241d14);'
    +   'border:1px solid var(--c-chrome-border,#7a5818);color:var(--c-chrome-text,#e8d9b8);padding:6px 9px;border-radius:3px;cursor:pointer;font-family:var(--font-mono,inherit);}'
    + '.tutorial-flow-btn:hover{border-color:var(--c-accent,#c8922a);color:var(--c-accent,#c8922a);}'
    + '.tutorial-flow-btn .tf-label{display:block;font-size:0.78rem;}'
    + '.tutorial-flow-btn .tf-desc{display:block;font-size:0.63rem;color:var(--c-chrome-muted,#9a8a6a);margin-top:1px;}'
    ;
    var style = document.createElement('style');
    style.id = 'ms-tut-style';
    style.textContent = css;
    document.head.appendChild(style);
  }

  function buildDom() {
    var root = document.createElement('div');
    root.id = 'ms-tut-root';

    ['top', 'right', 'bottom', 'left'].forEach(function (side) {
      var m = document.createElement('div');
      m.className = 'ms-tut-mask';
      m.dataset.side = side;
      m.addEventListener('click', onMaskClick);
      root.appendChild(m);
      els['mask_' + side] = m;
    });

    // Precise mask — a single full-viewport div whose clip-path cuts one hole
    // per currently-highlighted target rect (see applyMask below). Used
    // instead of the 4 strip divs above whenever the browser supports
    // clip-path: path(), since strips can only cut ONE rectangular hole: for
    // a multi-target step (e.g. drop-zone + "✦ New", which aren't the same
    // width) the strips' hole had to be their bounding-box union, which
    // silently carved out unrelated sidebar buttons sitting in that
    // bounding box too (Folder/Export library/Collections all sit between/
    // near those two) — clickable when they shouldn't have been, since nothing
    // was blocking clicks on them. This div cuts one independent hole per
    // rect instead, so only the actual highlighted control(s) are ever
    // reachable. The 4-strip divs stay as the fallback for browsers without
    // clip-path: path() support (their old union-hole behaviour, imprecise
    // but still functional).
    var maskPrecise = document.createElement('div');
    maskPrecise.className = 'ms-tut-mask-precise';
    maskPrecise.style.display = 'none';
    maskPrecise.addEventListener('click', onMaskClick);
    root.appendChild(maskPrecise);
    els.maskPrecise = maskPrecise;

    // Ring pool: usually just one glowing highlight, but a branching
    // "targets" step needs one ring per simultaneously-clickable target (see
    // ensureRingPool/applyRings below) — start with a single ring and grow
    // the pool lazily only when a step actually needs more.
    els.rings = [];
    var ring = document.createElement('div');
    ring.className = 'ms-tut-ring';
    ring.style.display = 'none';
    root.appendChild(ring);
    els.rings.push(ring);

    var popup = document.createElement('div');
    popup.className = 'ms-tut-popup';
    popup.style.display = 'none';
    popup.innerHTML =
      '<button type="button" class="ms-tut-close" aria-label="Close tutorial">✕</button>' +
      '<h5></h5>' +
      '<p class="ms-tut-body"></p>' +
      '<p class="ms-tut-hint" style="display:none;"></p>' +
      '<div class="ms-tut-footer">' +
      '  <span class="ms-tut-progress"></span>' +
      '  <div class="ms-tut-btns">' +
      '    <button type="button" class="ms-tut-back-btn" style="display:none;">Back</button>' +
      '    <button type="button" class="ms-tut-next-btn" style="display:none;">Next</button>' +
      '  </div>' +
      '</div>' +
      '<div class="ms-tut-dontshow-row">' +
      '  <button type="button" class="ms-tut-dontshow">Don’t show tutorial pop-ups again</button>' +
      '</div>';
    root.appendChild(popup);
    els.popup = popup;
    els.popupH5 = popup.querySelector('h5');
    els.popupBody = popup.querySelector('.ms-tut-body');
    els.popupHint = popup.querySelector('.ms-tut-hint');
    els.popupProgress = popup.querySelector('.ms-tut-progress');
    els.popupBack = popup.querySelector('.ms-tut-back-btn');
    els.popupNext = popup.querySelector('.ms-tut-next-btn');
    els.popupClose = popup.querySelector('.ms-tut-close');
    els.popupDontShow = popup.querySelector('.ms-tut-dontshow');

    document.body.appendChild(root);
    els.root = root;

    // The tutorial overlay's own elements (mask strips, popup) live outside
    // #sidebar/other app containers in the DOM, so without this a click
    // anywhere in the popup (or on a mask strip) also bubbles up and gets
    // read by the app's own document-level "click outside closes this"
    // handlers (e.g. the mobile sidebar-close handler) as an outside click —
    // closing the very panel a guided step is pointing at mid-tour. Stop it
    // right here so it never reaches those handlers.
    popup.addEventListener('click', function (e) { e.stopPropagation(); });

    els.popupClose.addEventListener('click', function () { exit(); });
    els.popupDontShow.addEventListener('click', function () {
      setTutorialsDisabled(true);
      syncEnabledToggle();
      exit();
    });
    els.popupBack.addEventListener('click', function () { goBack(); });
    els.popupNext.addEventListener('click', function () { advance(); });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && state.active) exit();
    });
    window.addEventListener('resize', function () { if (state.active) reposition(); });
    window.addEventListener('scroll', function () { if (state.active) reposition(); }, true);
  }

  function onMaskClick(e) {
    // Same reasoning as the popup's own click listener above — the mask
    // strips live outside the app's normal containers, so an un-stopped
    // click here would otherwise bubble up and trip the app's own
    // click-outside-closes handlers.
    if (e) e.stopPropagation();
    if (!state.active) return;
    els.popup.classList.remove('ms-tut-shake');
    void els.popup.offsetWidth; // restart the animation if clicked repeatedly
    els.popup.classList.add('ms-tut-shake');
  }

  // ── ENGINE STATE ─────────────────────────────────────────────────────────
  // state.target: the primary highlighted element (single-target steps), or
  // the first of the currently-resolved targets on a branching step — kept
  // around for scrollIntoView and as a sane single-value fallback.
  // state.targets: EVERY currently-highlighted element (primary target(s) +
  // any secondaryTargets) — this is what reposition() actually draws rings
  // for and masks around.
  // state.paused: true while a waitForClose step's real click has opened a
  // modal and the tutorial's own UI is deliberately hidden (see showStep's
  // waitForClose branch) — the tour is still state.active, but reposition()
  // must no-op while paused, otherwise the window resize/scroll listeners
  // (which call reposition() any time state.active is true, for the normal
  // case of the page shifting under an active spotlight) would immediately
  // re-show the mask/popup out from under that deliberate hide the moment
  // either fires, which a modal opening/animating in routinely triggers.
  // state.gen: bumped every start()/exit(). Several async operations here
  // (waitForTarget/waitForAnyTarget's polling, the 220ms advance delay, the
  // 260ms reposition-settle delay, waitForClose's polling) can still be
  // in flight when a flow is exited and a DIFFERENT flow started — e.g. a
  // "show" step whose target never appears (no relevant song open) sits
  // polling for up to 2200ms; if the user exits that tour and starts another
  // within that window, `state.active` alone can't tell the stale callback
  // "you're not for this run" (it goes back to true immediately). Every such
  // callback captures the gen it was created under and checks it's still
  // current before touching state/DOM — otherwise it silently no-ops instead
  // of corrupting whatever flow is running now.
  var state = { active: false, paused: false, gen: 0, flowId: null, steps: [], index: 0, target: null, targets: [], listenerCleanup: null };

  function hideAll() {
    ['top', 'right', 'bottom', 'left'].forEach(function (s) { els['mask_' + s].style.width = '0px'; els['mask_' + s].style.height = '0px'; });
    els.maskPrecise.style.display = 'none';
    els.rings.forEach(function (r) { r.style.display = 'none'; });
    els.popup.style.display = 'none';
  }

  // Feature-detected once: does this browser support clip-path: path(), the
  // thing that lets applyMask cut one independent hole per target rect
  // instead of a single bounding-box union? Checked defensively (try/catch —
  // very old browsers may not have window.CSS.supports at all).
  var CLIP_PATH_SUPPORTED = (function () {
    try {
      return !!(window.CSS && CSS.supports && CSS.supports('clip-path', 'path(evenodd, "M0 0L1 0L1 1Z")'));
    } catch (e) { return false; }
  })();

  function resolveSelectors(list) {
    return (list || []).map(function (sel) { return document.querySelector(sel); }).filter(isVisible);
  }

  // Merges any number of rects into their bounding union. Used for: (a)
  // popup placement, which reasons about one group bounding box rather than
  // N independent rects, and (b) the no-clip-path-support masking fallback,
  // where a single rectangular hole is the best that's achievable — see
  // applyMask. NOT used for the normal (clip-path-supported) masking path
  // any more — that cuts one independent hole per rect (buildMaskPath)
  // specifically because the union used to silently include whatever
  // unrelated buttons happened to sit inside the bounding box between two
  // spread-out targets (e.g. the sidebar's Folder/Export library buttons,
  // which sit between the drop zone and "✦ New").
  function unionRect(rects) {
    if (!rects.length) return null;
    if (rects.length === 1) return rects[0];
    var l = rects[0].left, t = rects[0].top, r = rects[0].right, b = rects[0].bottom;
    for (var i = 1; i < rects.length; i++) {
      l = Math.min(l, rects[i].left); t = Math.min(t, rects[i].top);
      r = Math.max(r, rects[i].right); b = Math.max(b, rects[i].bottom);
    }
    return { left: l, top: t, right: r, bottom: b, width: r - l, height: b - t };
  }

  function stripsFor(rect, pad, vw, vh) {
    var x0 = Math.max(0, rect.left - pad), y0 = Math.max(0, rect.top - pad);
    var x1 = Math.min(vw, rect.right + pad), y1 = Math.min(vh, rect.bottom + pad);
    return {
      top:    { left: 0,  top: 0,  width: vw, height: Math.max(0, y0) },
      bottom: { left: 0,  top: y1, width: vw, height: Math.max(0, vh - y1) },
      left:   { left: 0,  top: y0, width: Math.max(0, x0), height: Math.max(0, y1 - y0) },
      right:  { left: x1, top: y0, width: Math.max(0, vw - x1), height: Math.max(0, y1 - y0) }
    };
  }

  function rectsOverlap(a, b) {
    return !(a.x1 <= b.x0 || b.x1 <= a.x0 || a.y1 <= b.y0 || b.y1 <= a.y0);
  }
  // evenodd counts path-boundary crossings, so nesting one hole-rect fully
  // inside another (e.g. a step's own small target plus a secondaryTarget
  // that contains it, like Adding Songs' "openEditor" step highlighting
  // both "Open Editor" and the whole New Song modal box around it) crosses
  // THREE boundaries instead of two at the inner rect — flipping it back to
  // "covered by the mask" right when it's supposed to be the most clickable
  // thing on the step. Any two overlapping rects have the same problem to a
  // lesser degree. Merging every overlapping/nested pair into their
  // bounding union before building subpaths keeps every hole a single,
  // unambiguous, non-nested rectangle, so evenodd only ever sees exactly
  // two crossings (outer, hole) at any point inside one.
  function mergeOverlappingRects(list) {
    var merged = list.slice();
    var changed = true;
    while (changed) {
      changed = false;
      for (var i = 0; i < merged.length && !changed; i++) {
        for (var j = i + 1; j < merged.length; j++) {
          if (rectsOverlap(merged[i], merged[j])) {
            var a = merged[i], b = merged[j];
            var u = { x0: Math.min(a.x0, b.x0), y0: Math.min(a.y0, b.y0), x1: Math.max(a.x1, b.x1), y1: Math.max(a.y1, b.y1) };
            merged.splice(j, 1);
            merged.splice(i, 1);
            merged.push(u);
            changed = true;
            break;
          }
        }
      }
    }
    return merged;
  }

  // Builds an SVG-path `d` string for clip-path: path(evenodd, "..."): one
  // outer subpath covering the full viewport, plus one subpath per
  // (padded, overlap-merged) rect — under the evenodd fill rule, a point
  // covered by exactly one subpath (just the outer one) stays
  // painted/opaque, and a point covered by two (the outer one AND a rect's
  // subpath) becomes a hole. Independent per-rect holes for targets that
  // don't overlap, unlike a single bounding-box union across all of them.
  function buildMaskPath(rects, pad, vw, vh) {
    var padded = rects.map(function (rect) {
      var x0 = Math.max(0, rect.left - pad), y0 = Math.max(0, rect.top - pad);
      var x1 = Math.min(vw, rect.right + pad), y1 = Math.min(vh, rect.bottom + pad);
      return { x0: x0, y0: y0, x1: x1, y1: y1 };
    }).filter(function (r) { return r.x1 > r.x0 && r.y1 > r.y0; });
    var merged = mergeOverlappingRects(padded);
    var d = 'M0 0H' + vw + 'V' + vh + 'H0Z';
    merged.forEach(function (r) {
      d += ' M' + r.x0 + ' ' + r.y0 + 'H' + r.x1 + 'V' + r.y1 + 'H' + r.x0 + 'Z';
    });
    return d;
  }

  // rects: array of DOMRect-like objects (0, 1, or many — see reposition()).
  function applyMask(rects) {
    var vw = window.innerWidth, vh = window.innerHeight;

    if (CLIP_PATH_SUPPORTED) {
      ['top', 'right', 'bottom', 'left'].forEach(function (s) { els['mask_' + s].style.width = '0px'; els['mask_' + s].style.height = '0px'; });
      els.maskPrecise.style.display = 'block';
      els.maskPrecise.style.clipPath = 'path(evenodd, "' + buildMaskPath(rects, 6, vw, vh) + '")';
      return;
    }

    // Fallback for browsers without clip-path: path() — the original 4-strip
    // approach, which can only cut a single rectangular hole, so multiple
    // rects collapse to their bounding-box union (imprecise but functional).
    els.maskPrecise.style.display = 'none';
    var rect = unionRect(rects);
    var s;
    if (!rect) {
      s = {
        top: { left: 0, top: 0, width: vw, height: vh },
        bottom: { left: 0, top: 0, width: 0, height: 0 },
        left: { left: 0, top: 0, width: 0, height: 0 },
        right: { left: 0, top: 0, width: 0, height: 0 }
      };
    } else {
      s = stripsFor(rect, 6, vw, vh);
    }
    ['top', 'right', 'bottom', 'left'].forEach(function (k) {
      var el = els['mask_' + k], v = s[k];
      el.style.left = v.left + 'px'; el.style.top = v.top + 'px';
      el.style.width = v.width + 'px'; el.style.height = v.height + 'px';
    });
  }

  function ensureRingPool(n) {
    while (els.rings.length < n) {
      var ring = document.createElement('div');
      ring.className = 'ms-tut-ring';
      ring.style.display = 'none';
      els.root.appendChild(ring);
      els.rings.push(ring);
    }
  }

  // Draws one glow ring per rect (a normal single-target step passes a
  // 1-element array; a branching step passes one per simultaneously-valid
  // target), and hides any pooled rings left over from a previous step that
  // needed more of them.
  function applyRings(rects) {
    ensureRingPool(rects.length);
    var pad = 5;
    els.rings.forEach(function (ring, i) {
      if (i >= rects.length) { ring.style.display = 'none'; return; }
      var rect = rects[i];
      ring.style.display = 'block';
      ring.style.left = (rect.left - pad) + 'px';
      ring.style.top = (rect.top - pad) + 'px';
      ring.style.width = (rect.width + pad * 2) + 'px';
      ring.style.height = (rect.height + pad * 2) + 'px';
    });
  }

  function tryPlacement(side, rect, pw, ph, gap, vw, vh) {
    var left, top;
    if (side === 'bottom') { left = rect.left; top = rect.bottom + gap; if (top + ph > vh - 8) return null; }
    else if (side === 'top') { left = rect.left; top = rect.top - ph - gap; if (top < 8) return null; }
    else if (side === 'right') { left = rect.right + gap; top = rect.top; if (left + pw > vw - 8) return null; }
    else if (side === 'left') { left = rect.left - pw - gap; top = rect.top; if (left < 8) return null; }
    else return null;
    return { left: left, top: top };
  }

  function positionPopup(rect, placementPref) {
    var popup = els.popup;
    popup.style.display = 'block';
    var pw = popup.offsetWidth || 308, ph = popup.offsetHeight || 140;
    var vw = window.innerWidth, vh = window.innerHeight;
    var left, top;
    if (!rect) {
      left = (vw - pw) / 2; top = (vh - ph) / 2;
    } else {
      var order = (placementPref && placementPref !== 'auto')
        ? [placementPref, 'bottom', 'top', 'right', 'left']
        : ['bottom', 'top', 'right', 'left'];
      var pos = null;
      for (var i = 0; i < order.length; i++) {
        pos = tryPlacement(order[i], rect, pw, ph, 14, vw, vh);
        if (pos) break;
      }
      if (!pos) pos = { left: (vw - pw) / 2, top: Math.max(8, Math.min(vh - ph - 8, rect.bottom + 14)) };
      left = pos.left; top = pos.top;
    }
    left = Math.max(8, Math.min(left, vw - pw - 8));
    top = Math.max(8, Math.min(top, vh - ph - 8));
    popup.style.left = left + 'px';
    popup.style.top = top + 'px';
  }

  function reposition() {
    if (!state.active || state.paused) return;
    var step = state.steps[state.index];
    var rects = state.targets.map(function (el) { return el.getBoundingClientRect(); });
    applyMask(rects);
    applyRings(rects);
    // Popup placement still anchors off the group's bounding box — a single
    // rect to reason about "which side has room" against is simpler than
    // trying to dodge N independent rects, and in practice targets that are
    // highlighted together sit close enough that this reads naturally.
    positionPopup(unionRect(rects), step.placement);
  }

  function clearStepListener() {
    if (state.listenerCleanup) { state.listenerCleanup(); state.listenerCleanup = null; }
  }

  function renderPopupContent(step) {
    var ns = (step.ns || state.flowId) + '.' + step.key;
    els.popupH5.textContent = tt(ns + '.title');
    els.popupBody.innerHTML = tt(ns + '.body');
    var n = state.steps.length;
    els.popupProgress.textContent = tt('ui.stepProgress', { n: state.index + 1, total: n });
    els.popupBack.style.display = state.index > 0 ? 'inline-block' : 'none';
    els.popupBack.textContent = tt('ui.back');
    if (step.mode === 'wait') {
      els.popupHint.style.display = 'block';
      // step.skippable: a wait step the user isn't required to actually
      // perform — e.g. generalUsage's "collections" step opens a real
      // browser modal some users may not want to open right now. Shows a
      // real Next button alongside the usual hint text so clicking the
      // highlighted control still works exactly as normal, but isn't the
      // only way past the step. advance() (wired to popupNext below)
      // doesn't care whether the step is wait or show, so no other change
      // is needed for the click-Next path to work correctly here.
      els.popupHint.textContent = tt(step.skippable ? 'ui.hintClickSkippable' : 'ui.hintClick');
      if (step.skippable) {
        els.popupNext.style.display = 'inline-block';
        els.popupNext.textContent = tt('ui.next');
      } else {
        els.popupNext.style.display = 'none';
      }
    } else {
      els.popupHint.style.display = 'none';
      els.popupNext.style.display = 'inline-block';
      els.popupNext.textContent = step.last ? tt('ui.done') : tt('ui.next');
    }
    els.popupClose.title = tt('ui.closeTitle');
    els.popupDontShow.textContent = tt('ui.dontShow');
  }

  // Shared tail end of resolving a step, once we know which element(s) (if
  // any) are the primary target(s): resolves secondaryTargets/branchTargets
  // too, scrolls the primary target into view, renders the pop-up, and
  // positions everything. Returns the resolved {el, branch} pairs for any
  // branchTargets, so the caller can wire up their click-to-branch listeners
  // (branchTargets can appear on a 'show' step, unlike step.targets above,
  // which is wait-only — see the "dropzone" step in generalUsage).
  function finishRenderingStep(step, primaryEls) {
    var secondaryEls = resolveSelectors(step.secondaryTargets);
    var branchEls = (step.branchTargets || []).map(function (bt) {
      var el = document.querySelector(bt.selector);
      return isVisible(el) ? { el: el, branch: bt.branch } : null;
    }).filter(Boolean);

    state.targets = primaryEls.concat(secondaryEls).concat(branchEls.map(function (b) { return b.el; }));
    state.target = primaryEls.length ? primaryEls[0] : null;

    if (state.target && state.target.scrollIntoView) {
      try { state.target.scrollIntoView({ block: 'center', behavior: 'auto' }); } catch (e) {}
    }

    renderPopupContent(step);
    reposition();
    setTimeout(function () { if (state.active && state.steps[state.index] === step) reposition(); }, 260);

    return branchEls;
  }

  // Splices a chosen branch's steps into the live flow right after the
  // current step, discarding anything already spliced there by an earlier
  // choice (e.g. the user went Back and picked differently the second time),
  // then advances into it. Shared by both branching mechanisms: step.targets
  // (wait-only, e.g. addingSongs' "choose") and step.branchTargets (works on
  // a 'show' step too, e.g. generalUsage's "dropzone" — New branches away,
  // but leaving the drop zone alone and just clicking Next still works).
  function spliceBranchAndAdvance(branchName, myGen) {
    var branchSteps = BRANCHES[branchName] || [];
    state.steps = state.steps.slice(0, state.index + 1).concat(branchSteps);
    setTimeout(function () {
      if (!state.active || state.gen !== myGen) return;
      state.index++;
      showStep(false);
    }, 220);
  }

  // isBack: true when arriving here via the Back button — skips the forward-
  // only "alreadyOpen" auto-skip so Back always lands on the step the user
  // asked for instead of bouncing straight past it again.
  function showStep(isBack) {
    clearStepListener();
    var step = state.steps[state.index];
    if (!step) { finishFlow(); return; }

    // Captured now, checked inside every async callback below (alongside
    // state.active) so a callback left over from a flow that has since been
    // exited/replaced — e.g. waitForTarget's up-to-2200ms poll for a target
    // that never appears — can tell it's stale and no-op instead of acting
    // on whatever unrelated flow happens to be running by the time it fires.
    // See state.gen's own comment for the full story.
    var myGen = state.gen;

    // On narrow/mobile widths the sidebar is a fixed overlay that covers
    // part of the topbar (see closeSidebarFirst on the "chords" step) — close
    // it for real (same button the user would click) and re-enter this same
    // step once the close transition has had time to finish, rather than
    // highlighting a target that's currently hidden underneath the drawer.
    if (step.closeSidebarFirst && window.innerWidth <= 520 && document.body.classList.contains('sidebar-open')) {
      var sidebarBtn = document.getElementById('btn-sidebar');
      if (sidebarBtn) sidebarBtn.click();
      setTimeout(function () { if (state.active && state.gen === myGen) showStep(isBack); }, 260);
      return;
    }

    // ── Branching multi-target step (step.targets, e.g. addingSongs' "choose") ──
    if (step.targets) {
      waitForAnyTarget(step.targets, 2200, function (resolved) {
        if (!state.active || state.gen !== myGen) return; // exited/replaced while waiting

        if (step.mode === 'wait' && !resolved.length) {
          // Neither target is on the page — can't force an impossible click; skip it.
          state.index += isBack ? -1 : 1;
          showStep(isBack);
          return;
        }

        finishRenderingStep(step, resolved.map(function (r) { return r.el; }));

        if (step.mode === 'wait' && resolved.length) {
          var fired = false;
          var cleanups = [];
          resolved.forEach(function (r) {
            var evt = step.event || 'click';
            var handler = function () {
              if (fired) return; // only the first of the simultaneous targets counts
              fired = true;
              clearStepListener();
              spliceBranchAndAdvance(r.branch, myGen);
            };
            r.el.addEventListener(evt, handler);
            cleanups.push(function () { r.el.removeEventListener(evt, handler); });
          });
          state.listenerCleanup = function () { cleanups.forEach(function (fn) { fn(); }); };
        }
      });
      return;
    }

    // ── Classic single-target (or no-target/centred) step ──
    waitForTarget(step.target, step.target ? 2200 : 0, function (el) {
      if (!state.active || state.gen !== myGen) return; // exited/replaced while waiting

      if (step.mode === 'wait' && step.target && !el) {
        // Target genuinely not on the page — can't force an impossible click; skip it.
        state.index += isBack ? -1 : 1;
        showStep(isBack);
        return;
      }
      if (!isBack && step.mode === 'wait' && step.alreadyOpen && step.alreadyOpen()) {
        // Already in the state we'd be waiting for — no need to block on it.
        state.index++;
        showStep(false);
        return;
      }

      var branchEls = finishRenderingStep(step, el ? [el] : []);
      var cleanups = [];

      if (step.mode === 'wait' && el) {
        var evt = step.event || 'click';
        var handler = function () {
          clearStepListener();
          if (step.waitForClose) {
            // The real click just opened a modal/panel (e.g. Collections) —
            // hide the tutorial's own UI while the user is in there instead
            // of leaving it floating uselessly on top, and pick back up with
            // the next step once they close it and are back at the library.
            // state.paused blocks reposition() (see its definition) so the
            // resize/scroll listeners — which fire routinely while a modal
            // opens/animates in — can't undo this hide out from under it.
            state.paused = true;
            hideAll();
            waitForClose(step.waitForClose, function () {
              state.paused = false;
              if (!state.active || state.gen !== myGen) return;
              // On mobile, the app's own outside-click-closes-sidebar
              // handler (unrelated to this tutorial — same behaviour with no
              // tour running at all) treats a click on the modal's own close
              // button as a click outside the sidebar and closes it too.
              // reopenSidebarAfter re-opens it before moving on, since the
              // very next step usually still needs it (e.g. "dropzone").
              if (step.reopenSidebarAfter && window.innerWidth <= 520 && !document.body.classList.contains('sidebar-open')) {
                var sidebarBtn2 = document.getElementById('btn-sidebar');
                if (sidebarBtn2) sidebarBtn2.click();
                setTimeout(function () {
                  if (!state.active || state.gen !== myGen) return;
                  state.index++;
                  showStep(false);
                }, 260);
                return;
              }
              state.index++;
              showStep(false);
            });
            return;
          }
          setTimeout(function () {
            if (!state.active || state.gen !== myGen) return;
            state.index++;
            showStep(false);
          }, 220);
        };
        el.addEventListener(evt, handler);
        cleanups.push(function () { el.removeEventListener(evt, handler); });
      }

      if (branchEls.length) {
        var branchFired = false;
        branchEls.forEach(function (b) {
          var bEvt = step.event || 'click';
          var bHandler = function () {
            if (branchFired) return;
            branchFired = true;
            clearStepListener();
            spliceBranchAndAdvance(b.branch, myGen);
          };
          b.el.addEventListener(bEvt, bHandler);
          cleanups.push(function () { b.el.removeEventListener(bEvt, bHandler); });
        });
      }

      if (cleanups.length) {
        state.listenerCleanup = function () { cleanups.forEach(function (fn) { fn(); }); };
      }
    });
  }

  function advance() {
    var step = state.steps[state.index];
    if (step && step.last) { finishFlow(); return; }
    clearStepListener();
    state.index++;
    showStep(false);
  }

  function goBack() {
    if (state.index <= 0) return;
    clearStepListener();
    state.index--;
    showStep(true);
  }

  function finishFlow() {
    if (state.flowId) markFlowSeen(state.flowId);
    exit();
  }

  function exit() {
    clearStepListener();
    state.active = false;
    state.paused = false;
    state.gen++; // invalidate any in-flight async callbacks from this run
    state.target = null;
    state.targets = [];
    hideAll();
    els.root.style.display = 'none';
  }

  // Jumps state.steps to start partway through addingSongs_newSongBranch,
  // at the step whose key matches jumpToKey, discarding everything before
  // it — shared by the songEditModeOn() skip-ahead below and the "first
  // time adding a song" auto-trigger (see wireFirstAddSongTrigger), which
  // launches straight into an already-open New Song modal and has no use
  // for intro/sidebar/choose. No-op (leaves state.steps as flow.steps) if
  // no step in the branch matches jumpToKey.
  function jumpToAddingSongsBranchStep(jumpToKey) {
    var branch = BRANCHES.addingSongs_newSongBranch;
    for (var bi = 0; bi < branch.length; bi++) {
      if (branch[bi].key === jumpToKey) { state.steps = branch.slice(bi); return; }
    }
  }

  // opts.startAt (optional): a step key inside addingSongs_newSongBranch to
  // jump straight to, bypassing intro/sidebar/choose — see
  // jumpToAddingSongsBranchStep's comment above. Only meaningful for
  // flowId === 'addingSongs'.
  function start(flowId, opts) {
    var flow = FLOWS[flowId];
    if (!flow) return;
    opts = opts || {};
    hideBanner();
    var tp = document.getElementById('tutorials-panel');
    if (tp) tp.classList.remove('open');
    // #tutorials-panel above is only the small flow-picker popover nested
    // INSIDE the big Options dropdown (#settings-menu-panel) — closing just
    // that popover still leaves the dropdown itself open and on top of
    // whatever this flow's first real step needs to highlight (reported:
    // starting Sheet Music from Options → Tutorials left Options covering
    // the sheet-music toolbar). Close the dropdown for real, the same way
    // closeSidebarFirst below closes the mobile sidebar — a real click on
    // its real toggle — rather than reaching in and stripping its "open"
    // class directly.
    var settingsBtn = document.getElementById('btn-settings-menu');
    var settingsPanel = document.getElementById('settings-menu-panel');
    if (settingsBtn && settingsPanel && settingsPanel.classList.contains('open')) settingsBtn.click();

    clearStepListener();
    state.active = true;
    state.paused = false;
    state.gen++; // new run — invalidate any callbacks still in flight from before
    state.flowId = flowId;
    // Clone the flow's step array — a branching step splices extra steps
    // into state.steps at runtime (see showStep), and that must never mutate
    // FLOWS[flowId].steps itself, or the second time this flow is replayed
    // it'd start with last time's spliced-in branch already baked in.
    state.steps = flow.steps.slice();
    // If Adding Songs is launched while the user is already sitting on a
    // classic song's edit page (songEditModeOn — see its own comment),
    // intro/sidebar/choose/nstype/format/openEditor all lead toward getting
    // exactly that state, which has already happened. Skip straight to the
    // editor-basics content instead of telling someone already there to add
    // a new song first — reuse the tail of the New Song branch (same steps,
    // same copy) rather than duplicating it.
    if (flowId === 'addingSongs' && opts.startAt) {
      jumpToAddingSongsBranchStep(opts.startAt);
    } else if (flowId === 'addingSongs' && songEditModeOn()) {
      jumpToAddingSongsBranchStep('addChordsOn');
    }
    state.index = 0;
    els.root.style.display = 'block';
    showStep(false);
  }

  // ── OPTIONS PANEL WIRING ────────────────────────────────────────────────
  function syncEnabledToggle() {
    var cb = document.getElementById('tutorials-enabled-toggle');
    if (cb) cb.checked = !tutorialsDisabled();
  }

  function buildFlowList() {
    var host = document.getElementById('tutorial-flow-list');
    if (!host) return;
    host.innerHTML = '';
    Object.keys(FLOWS).forEach(function (id) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'tutorial-flow-btn';
      btn.dataset.tutorialFlow = id;
      btn.innerHTML = '<span class="tf-label">▶ ' + tt('flow.' + id + '.label') + '</span><span class="tf-desc">' + tt('flow.' + id + '.desc') + '</span>';
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        start(id);
      });
      host.appendChild(btn);
    });
  }

  function localizeStaticPanel() {
    var h5 = document.getElementById('tutorials-panel-h5'); if (h5) h5.textContent = tt('ui.tutorialsTitle');
    var st = document.getElementById('tutorials-section-tours'); if (st) st.textContent = tt('ui.guidedTours');
    var ss = document.getElementById('tutorials-section-settings'); if (ss) ss.textContent = tt('ui.settingsSection');
    var lbl = document.getElementById('tutorials-toggle-label'); if (lbl) lbl.textContent = tt('ui.showPopups');
    var trig = document.getElementById('btn-tutorials-settings');
    if (trig) {
      trig.title = tt('ui.triggerTitle');
      // Preserve the trigger's own markup shape (icon + label) — just refresh the text.
      trig.textContent = tt('ui.triggerLabel');
    }
  }

  function relocalizeAll() {
    localizeStaticPanel();
    buildFlowList();
    if (state.active) {
      var step = state.steps[state.index];
      if (step) renderPopupContent(step);
    }
  }

  function wireOptionsPanel() {
    var trigger = document.getElementById('btn-tutorials-settings');
    var panel = document.getElementById('tutorials-panel');
    var closeBtn = document.getElementById('btn-tutorials-panel-close');
    var toggle = document.getElementById('tutorials-enabled-toggle');
    if (!trigger || !panel) return;

    trigger.addEventListener('click', function (e) {
      e.stopPropagation();
      if (panel.classList.contains('open')) { panel.classList.remove('open'); return; }
      syncEnabledToggle();
      if (typeof window.openSettingsPanel === 'function') {
        window.openSettingsPanel(panel, trigger);
      } else {
        document.querySelectorAll('.settings-panel').forEach(function (p) { p.classList.remove('open'); });
        panel.classList.add('open');
      }
    });
    if (closeBtn) {
      closeBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        panel.classList.remove('open');
      });
    }
    if (toggle) {
      toggle.addEventListener('click', function (e) { e.stopPropagation(); });
      toggle.addEventListener('change', function () {
        setTutorialsDisabled(!toggle.checked);
        if (!toggle.checked && state.active) exit();
      });
    }
    syncEnabledToggle();
    buildFlowList();
    localizeStaticPanel();

    // Re-localize everything tutorial-related whenever the user switches
    // languages via the app's own #lang-sel — in addition to, not instead
    // of, the app's own change handler.
    var langSel = document.getElementById('lang-sel');
    if (langSel) langSel.addEventListener('change', function () { setTimeout(relocalizeAll, 0); });
  }

  // ── FIRST-VISIT WELCOME BANNER (non-blocking) ──────────────────────────
  var bannerEl = null;
  function hideBanner() {
    if (bannerEl && bannerEl.parentNode) {
      bannerEl.classList.remove('ms-tut-in');
      var toRemove = bannerEl;
      setTimeout(function () { if (toRemove.parentNode) toRemove.parentNode.removeChild(toRemove); }, 260);
      bannerEl = null;
    }
  }
  function maybeShowWelcomeBanner() {
    if (tutorialsDisabled() || lsGet(LS_WELCOMED)) return;
    bannerEl = document.createElement('div');
    bannerEl.className = 'ms-tut-banner';
    bannerEl.innerHTML =
      '<h5>' + tt('banner.title') + '</h5>' +
      '<div>' + tt('banner.body') + '</div>' +
      '<div class="ms-tut-banner-actions">' +
      '  <button type="button" class="ms-tut-banner-start">' + tt('banner.start') + '</button>' +
      '  <button type="button" class="ms-tut-banner-later">' + tt('banner.later') + '</button>' +
      '</div>' +
      '<button type="button" class="ms-tut-banner-never">' + tt('banner.never') + '</button>';
    document.body.appendChild(bannerEl);
    requestAnimationFrame(function () { if (bannerEl) bannerEl.classList.add('ms-tut-in'); });

    bannerEl.querySelector('.ms-tut-banner-start').addEventListener('click', function () {
      lsSet(LS_WELCOMED, '1');
      hideBanner();
      start('generalUsage');
    });
    bannerEl.querySelector('.ms-tut-banner-later').addEventListener('click', function () {
      lsSet(LS_WELCOMED, '1');
      hideBanner();
    });
    bannerEl.querySelector('.ms-tut-banner-never').addEventListener('click', function () {
      lsSet(LS_WELCOMED, '1');
      setTutorialsDisabled(true);
      syncEnabledToggle();
      hideBanner();
    });
  }

  // ── CONTEXTUAL NUDGES — first time a sheet-music or lead-sheet song opens,
  // offer that specific tour (once ever) instead of only surfacing it deep
  // in Options → Tutorials. Small dismissible banner, same visual language
  // as the welcome banner; never overlaps it (mutually exclusive by only
  // ever having one `bannerEl` at a time) and never interrupts an active
  // guided tour. ──────────────────────────────────────────────────────────
  function offerContextual(flowId, titleKey, bodyKey) {
    if (tutorialsDisabled()) return;
    if (flowSeen(flowId)) return;      // already completed this tour
    if (ctxOffered(flowId)) return;    // already offered before (accepted or not)
    if (state.active) return;          // a guided tour is currently running
    if (bannerEl) return;              // another banner is already showing
    markCtxOffered(flowId);

    bannerEl = document.createElement('div');
    bannerEl.className = 'ms-tut-banner';
    bannerEl.innerHTML =
      '<h5>' + tt(titleKey) + '</h5>' +
      '<div>' + tt(bodyKey) + '</div>' +
      '<div class="ms-tut-banner-actions">' +
      '  <button type="button" class="ms-tut-banner-start">' + tt('ctx.start') + '</button>' +
      '  <button type="button" class="ms-tut-banner-later">' + tt('ctx.dismiss') + '</button>' +
      '</div>';
    document.body.appendChild(bannerEl);
    requestAnimationFrame(function () { if (bannerEl) bannerEl.classList.add('ms-tut-in'); });

    bannerEl.querySelector('.ms-tut-banner-start').addEventListener('click', function () {
      hideBanner();
      start(flowId);
    });
    bannerEl.querySelector('.ms-tut-banner-later').addEventListener('click', function () { hideBanner(); });
  }

  function wireContextualNudges() {
    if (typeof window.renderABCSong === 'function' && !window.renderABCSong.__msWrapped) {
      var origAbc = window.renderABCSong;
      var wrappedAbc = function () {
        var r = origAbc.apply(this, arguments);
        setTimeout(function () { offerContextual('sheetMusic', 'ctx.sheetMusic.title', 'ctx.sheetMusic.body'); }, 450);
        return r;
      };
      wrappedAbc.__msWrapped = true;
      window.renderABCSong = wrappedAbc;
    }
    if (typeof window.renderIRealSong === 'function' && !window.renderIRealSong.__msWrapped) {
      var origIreal = window.renderIRealSong;
      var wrappedIreal = function () {
        var r = origIreal.apply(this, arguments);
        setTimeout(function () { offerContextual('leadSheets', 'ctx.leadSheets.title', 'ctx.leadSheets.body'); }, 450);
        return r;
      };
      wrappedIreal.__msWrapped = true;
      window.renderIRealSong = wrappedIreal;
    }
  }

  // Returns the effective "namespace" of whichever step is currently
  // showing — the same lookup renderPopupContent() uses for string keys
  // (step.ns if the step carries one, else state.flowId). Needed below
  // because a branch step spliced into a DIFFERENT flow (e.g. generalUsage's
  // "dropzone" step branching into addingSongs_newSongBranch) leaves
  // state.flowId as 'generalUsage' the whole time — only the spliced step
  // itself is tagged ns:'addingSongs'.
  function currentStepNs() {
    var step = state.steps[state.index];
    return (step && step.ns) || state.flowId;
  }

  // ── FIRST-TIME "ADDING A SONG" AUTO-TRIGGER ────────────────────────────
  // Per product spec: the first time a user ever opens the New Song modal
  // (clicks "✦ New"), the Adding Songs tour should start automatically — no
  // banner, no confirmation needed, unlike the welcome banner/contextual
  // nudges above. Fires at most once ever, gated by its own flag rather than
  // flowSeen('addingSongs') alone, so an incomplete or type-mismatched run
  // (see the #ns-type listener below) still counts as "the first time" and
  // never retriggers on a later New Song click.
  var LS_FIRSTADD = 'ms_tutorial_firstadd_triggered';
  function wireFirstAddSongTrigger() {
    var btn = document.getElementById('btn-new-song-sidebar');
    if (btn) {
      // This file's <script> tag loads last, right before </body>, so this
      // listener is registered — and therefore runs — after the app's own
      // click handler that actually calls openNewSongModal(). By the time
      // this fires, the real modal is already open; start('addingSongs',
      // {startAt:'nstype'}) just renders the tour's first pop-up on top of
      // it rather than replaying intro/sidebar/choose, which the user has
      // just done for real by clicking this same button.
      btn.addEventListener('click', function () {
        if (tutorialsDisabled() || flowSeen('addingSongs') || lsGet(LS_FIRSTADD) || state.active) return;
        lsSet(LS_FIRSTADD, '1');
        setTimeout(function () { start('addingSongs', { startAt: 'nstype' }); }, 300);
      });
    }

    // Per product spec: choosing ABC Notation or either Lead Sheet option
    // ends the Adding Songs tour right there rather than continuing through
    // steps that only make sense for the classic Song/Chord Sheet editor
    // (addChordsOn/addChordsUsage/addChordsOff, #edit-toolbar) — those
    // formats get their own dedicated, more relevant tours (sheetMusic /
    // leadSheets), already auto-offered by wireContextualNudges the moment
    // the newly created song actually opens. Applies whenever the Adding
    // Songs tour (or a branch spliced from another flow into it — see
    // currentStepNs() above) is showing the New Song modal, not just the
    // first-time auto-trigger above: a manually replayed Adding Songs tour
    // hits the same mismatch if the user picks a different type there too.
    var typeSel = document.getElementById('ns-type');
    if (typeSel) {
      typeSel.addEventListener('change', function () {
        if (state.active && currentStepNs() === 'addingSongs' && typeSel.value !== 'song') exit();
      });
    }
  }

  // ── INIT ─────────────────────────────────────────────────────────────────
  function init() {
    injectStyle();
    buildDom();
    hideAll();
    els.root.style.display = 'none';
    wireOptionsPanel();
    wireContextualNudges();
    wireFirstAddSongTrigger();
    setTimeout(maybeShowWelcomeBanner, 900);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Small debug/manual-trigger surface.
  window.MagicScrollTutorial = {
    start: start, exit: exit, flows: Object.keys(FLOWS),
    _debugState: function () {
      var step = state.steps[state.index];
      return {
        active: state.active, paused: state.paused, flowId: state.flowId, index: state.index,
        mode: step && step.mode, target: step && step.target,
        key: step && step.key, targetsCount: state.targets.length
      };
    }
  };
})();

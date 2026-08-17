/**
 * tutorial-strings-en.js — Magic Scroll GUIDED TUTORIAL copy (English / source
 * locale). DEV BUILD ONLY — sibling to strings-en.js, but kept separate on
 * purpose: this is a test feature, not core app copy, and the app's own
 * `t()` falls back to raw key text on a miss (see strings-en.js's `t()`
 * comment), so tutorial strings need their own dictionary + lookup rather
 * than borrowing `data-i18n`/`t()` directly.
 *
 * WHY THIS FILE EXISTS
 * All the words a user reads inside a tutorial pop-up, banner, or the
 * Options → Tutorials panel live here — not inline in tutorial.js — so a
 * human editor/translator can do a proofreading pass on tone and wording
 * without touching any tutorial *logic* (targets, click-blocking, branching,
 * persistence). tutorial.js only ever reads from this dictionary (via its
 * `tt(key, vars)` helper); it has no copy of its own.
 *
 * HOW IT'S WIRED IN
 * Loaded via `<script src="tutorial-strings-en.js">` before tutorial.js in
 * the dev HTML. Defines `window.MS_TUTORIAL_STRINGS_EN`. Sibling files
 * `tutorial-strings-fr.js` / `tutorial-strings-zh.js` define
 * `MS_TUTORIAL_STRINGS_FR` / `_ZH` with the exact same keys, translated.
 * tutorial.js's `tt(key, vars)` reads `window.MS_LANG` (the same global the
 * main app sets from the Options → Language dropdown — see strings-en.js)
 * to pick which dictionary to read from, falling back to this English one on
 * any missing key (same "never show a broken/blank string" principle as the
 * main app's own `t()`). `{n}`/`{total}`/etc. placeholders get substituted
 * via the `vars` argument, same convention as the main app's `t()`.
 *
 * KEY NAMING
 * `<flowId>.<stepKey>.title` / `.body` for the actual tutorial content
 * (matches the `key` field on each step object in tutorial.js's `FLOWS`
 * object — cross-reference the two to find exactly where a string appears).
 * `flow.<flowId>.label` / `.desc` for the four flow-picker buttons in
 * Options → Tutorials. `ui.*` for chrome shared across every pop-up
 * (Next/Back/Done buttons, progress counter, etc). `banner.*` for the
 * first-visit welcome banner. `ctx.*` for the small contextual nudge banners
 * that offer the Sheet Music / Lead Sheets tour the first time that kind of
 * song is opened.
 *
 * ADDING/EDITING A STEP'S TEXT
 * Just edit the value here (and in tutorial-strings-fr.js / -zh.js). Do NOT
 * add or remove keys without also updating the matching `key` in tutorial.js's
 * `FLOWS` (or `BRANCHES`) object, or the two will drift out of sync — a
 * missing key silently falls back to raw key text (e.g. "generalUsage.
 * sidebar.title") rather than crashing, which is deliberately loud/ugly so a
 * mismatch is easy to spot while testing rather than being silently wrong.
 *
 * A NOTE ON <strong>/<code> — a small number of body strings use inline
 * <strong> or <code> tags (they're written to `innerHTML`, not
 * `textContent`, inside tutorial.js's renderPopupContent()). No user data
 * ever flows into these strings, so this is the same trust level as any
 * other hard-coded markup in the app. Keep any translation's tags on the
 * same words/phrase they wrap in English, not necessarily the same position
 * in the sentence — grammar can reorder around them.
 */
window.MS_TUTORIAL_STRINGS_EN = {

  // ═══════════════════════════════════════════════════════════════════════
  // UI CHROME — shared by every pop-up, regardless of which flow/step is
  // showing. Rendered by tutorial.js's renderPopupContent().
  // ═══════════════════════════════════════════════════════════════════════
  'ui.stepProgress': 'Step {n} of {total}',        // small counter, bottom-left of every pop-up. {n} = current step (1-based), {total} = step count in this flow
  'ui.next': 'Next',                                // primary button on an informational ("show" mode) step — advances to the next step
  'ui.back': 'Back',                                // secondary button, hidden on the very first step of a flow — re-shows the previous step's pop-up (pure navigation; doesn't undo any app action)
  'ui.done': 'Done',                                // same button/position as ui.next, but on the LAST step of a flow (step.last === true) — same action (finishes the tour), different label since there's nothing left to advance to
  'ui.hintClick': 'Click the highlighted control to continue.',  // italic hint line shown instead of a Next button on a "wait" (guided/blocking) step — the pop-up has no forward button on these; the ONLY ways off it are the real highlighted control, ✕, or "don't show again"
  'ui.hintClickSkippable': 'Click the highlighted control to continue, or Next to skip this step.',  // same hint line, but for a "wait" step that ALSO sets step.skippable — a real Next button is shown alongside it (e.g. generalUsage's "collections" step, since browsing Collections isn't something every user wants to do mid-tour)
  'ui.dontShow': 'Don’t show tutorial pop-ups again',  // small underlined link at the bottom of every pop-up — exits the current tour AND disables all tutorials app-wide (ms_tutorials_disabled)
  'ui.closeTitle': 'Close tutorial',                // title/tooltip attribute on the ✕ button, top-right of every pop-up — exits the current tour only (tutorials stay enabled)
  'ui.tutorialsTitle': '🎓 Tutorials',               // <h5> heading inside the Options → Tutorials panel itself
  'ui.guidedTours': 'Guided Tours',                 // section label above the 4 flow-picker buttons, inside Options → Tutorials
  'ui.settingsSection': 'Settings',                 // section label above the "show tutorial pop-ups" checkbox, inside Options → Tutorials
  'ui.showPopups': 'Show tutorial pop-ups',         // checkbox label, inside Options → Tutorials — unticking it is equivalent to clicking "Don't show tutorial pop-ups again" on any pop-up
  'ui.triggerTitle': 'Replay guided tutorials',     // title/tooltip attribute on the "🎓 Tutorials" button in the topbar (Options tab)
  'ui.triggerLabel': '🎓 Tutorials',                 // visible text of that same topbar trigger button — keep the 🎓 emoji prefix so it stays recognisable at a glance next to Themes/Print/Language

  // ═══════════════════════════════════════════════════════════════════════
  // FIRST-VISIT WELCOME BANNER — small, non-blocking card, bottom-right of
  // the screen, shown once ever (unless tutorials are already disabled or
  // it's already been dismissed). Offers the General Usage tour. Rendered by
  // tutorial.js's maybeShowWelcomeBanner().
  // ═══════════════════════════════════════════════════════════════════════
  'banner.title': 'New to Magic Scroll?',
  'banner.body': 'Take a quick tour of the basics: library, chords, and options.',
  'banner.start': 'Take the tour',       // button — starts the General Usage flow
  'banner.later': 'Maybe later',         // button — dismisses the banner for good (won't reappear), tutorials stay enabled
  'banner.never': 'Don’t show this again',  // link — dismisses the banner AND disables all tutorials app-wide

  // ═══════════════════════════════════════════════════════════════════════
  // CONTEXTUAL NUDGE BANNERS — same visual style as the welcome banner, but
  // triggered the FIRST TIME EVER a sheet-music (ABC) or lead-sheet song is
  // actually opened (tutorial.js wraps renderABCSong()/renderIRealSong() to
  // detect this), rather than only being reachable via Options → Tutorials.
  // Only two buttons (no "never" link) — offered once per flow regardless of
  // the user's choice, so there's no need for a separate permanent opt-out.
  // ═══════════════════════════════════════════════════════════════════════
  'ctx.sheetMusic.title': 'Sheet music open',
  'ctx.sheetMusic.body': 'Want a quick tour of the sheet-music toolbar?',
  'ctx.leadSheets.title': 'Lead sheet open',
  'ctx.leadSheets.body': 'Want a quick tour of the lead-sheet toolbar?',
  'ctx.start': 'Show me',      // button — starts the relevant flow (sheetMusic or leadSheets)
  'ctx.dismiss': 'No thanks',  // button — just dismisses this one banner

  // ═══════════════════════════════════════════════════════════════════════
  // FLOW METADATA — the four buttons listed under Options → Tutorials →
  // "Guided Tours". Rendered by tutorial.js's buildFlowList().
  // ═══════════════════════════════════════════════════════════════════════
  'flow.generalUsage.label': 'General Usage',
  'flow.generalUsage.desc': 'Chords, auto-scroll, library & options',
  'flow.addingSongs.label': 'Adding Songs',
  'flow.addingSongs.desc': 'Import a file or write one from scratch',
  'flow.sheetMusic.label': 'Sheet Music',
  'flow.sheetMusic.desc': 'Real notation via ABC, with toolbar & editing',
  'flow.leadSheets.label': 'Lead Sheets',
  'flow.leadSheets.desc': 'iReal-Pro-style chord grids',

  // ═══════════════════════════════════════════════════════════════════════
  // GENERAL USAGE FLOW — the broad orientation tour (also the one offered by
  // the first-visit welcome banner above). 11 steps. See the `generalUsage`
  // entry in tutorial.js's FLOWS object for exact target selectors/modes;
  // summarised per-step below.
  // ═══════════════════════════════════════════════════════════════════════

  // Step "welcome" — no target (pop-up centred on screen). Mode: show (has
  // a Next button). The very first thing a new user sees if they accept the
  // welcome banner's "Take the tour" offer.
  'generalUsage.welcome.title': 'Welcome to Magic Scroll',
  'generalUsage.welcome.body': 'A quick lap around the app, under a minute. You can replay this, or any of the other tours, from Options → Tutorials whenever you like.',

  // Step "sidebar" — target: #btn-sidebar (the "☰ Library" button, topbar).
  // Mode: wait (guided/blocking) — user must click the real button to
  // continue; auto-skipped if the sidebar is already open when this step is
  // reached (mid-session replay).
  'generalUsage.sidebar.title': 'Your Library',
  'generalUsage.sidebar.body': 'Click here to open your Library: every song and tune you’ve added, with search up top and a Collections button down at the bottom for shareable songbooks.',

  // Step "collections" — target: #btn-collections (the "📦 Collections"
  // button, sidebar footer). Mode: wait — must click the real button, which
  // opens the real Collections browser modal. waitForClose:
  // '#collections-modal' hides the tutorial's own pop-up/spotlight while
  // that modal is open (rather than leaving them floating uselessly on top
  // of it) and picks back up with the next step once the user closes the
  // modal and is back looking at the library. skippable: true — also shows
  // a real Next button so a user who doesn't want to browse Collections
  // right now isn't stuck; see ui.hintClickSkippable above.
  'generalUsage.collections.title': 'Community collections',
  'generalUsage.collections.body': 'Click here to browse curated and community song collections and add any of them straight into your library, a fast way to fill it up beyond what you type or import yourself.',

  // Step "dropzone" — target: #drop-zone (the "Open files here" drag-and-
  // drop area inside the sidebar). Mode: show. branchTargets adds
  // #btn-new-song-sidebar (the "✦ New" button just below it) as a live
  // branch trigger, not just a highlight: clicking it splices in the Adding
  // Songs flow's new-song steps (see BRANCHES.addingSongs_newSongBranch in
  // tutorial.js) and the tour ends there — a deliberate "take me to Adding
  // Songs" handoff, not a brief detour back to the rest of General Usage.
  // Leaving New alone and clicking this pop-up's own Next continues the tour
  // normally.
  'generalUsage.dropzone.title': 'Adding songs',
  'generalUsage.dropzone.body': 'Drag a file straight onto this drop zone to import it, or click <strong>✦ New</strong> below it to write one from scratch. There’s a whole tutorial on this: Options → Tutorials → Adding Songs.',

  // Step "chords" — target: #btn-music-menu (the "🎵 Chords" topbar tab).
  // Mode: wait — must click the real tab to continue; auto-skipped if
  // already open. closeSidebarFirst: on narrow/mobile widths the open
  // sidebar is a fixed overlay drawer that physically covers this tab, so
  // tutorial.js closes it first if needed before highlighting this step.
  'generalUsage.chords.title': 'Chords tab',
  'generalUsage.chords.body': 'Click here to open key, transpose, and chord-diagram tools for whatever song is open.',

  // Step "keygroup" — target: #topbar-key-group (Key label + transpose
  // buttons + "Simplify chords", inside the now-open Chords tab). Mode:
  // show. Also mentions the neighbouring "Chord Diagrams" button by name
  // without a separate step for it.
  'generalUsage.keygroup.title': 'Key & transpose',
  'generalUsage.keygroup.body': 'Magic Scroll detects the song’s key automatically. Nudge it up or down a semitone with ♭−/♯+, or tap <strong>Chord Diagrams</strong> nearby for fingering charts on any instrument.',

  // Step "options" — target: #btn-settings-menu (the "⚙ Options" topbar
  // tab). Mode: wait — must click the real tab to continue; auto-skipped if
  // already open. (Opening this tab also closes the Chords tab from the
  // previous step — that's existing app behaviour, not tutorial-specific.)
  'generalUsage.options.title': 'Options tab',
  'generalUsage.options.body': 'Click here: this is where text size, line spacing, language, and full theme customisation live.',

  // Step "size" — target: #topbar-size-group (the "Size" dropdown, inside
  // the now-open Options tab). Mode: show. Also mentions the neighbouring
  // "Themes" button by name without a separate step for it.
  'generalUsage.size.title': 'Reading comfort',
  'generalUsage.size.body': 'Adjust text size and line spacing here, and dig into colours, fonts, and a background image under <strong>Themes</strong> nearby.',

  // Step "tutorials" — target: #btn-tutorials-settings (the "🎓 Tutorials"
  // button itself, inside the now-open Options tab). Mode: show. A small
  // "you are here" moment — points at the very control the user could later
  // use to replay this tour or start one of the other three.
  'generalUsage.tutorials.title': 'You are here',
  'generalUsage.tutorials.body': 'This tour, plus separate ones for Adding Songs, Sheet Music, and Lead Sheets, all live right here. Replay any of them any time, or turn tutorial pop-ups off for good.',

  // Step "scroll" — target: #topbar-scroll-group (Scroll button + speed
  // slider, always visible in the topbar, not inside any dropdown). Mode:
  // show.
  'generalUsage.scroll.title': 'Auto-scroll',
  'generalUsage.scroll.body': 'Hands-free reading: press Scroll to start, and drag the slider to set the pace.',

  // Step "done" — no target (pop-up centred). Mode: show, step.last = true
  // (button reads "Done" instead of "Next"). Final step of the flow.
  'generalUsage.done.title': 'That’s the basics',
  'generalUsage.done.body': 'Explore Adding Songs, Sheet Music, and Lead Sheets from Options → Tutorials whenever you’re ready. Enjoy!',

  // ═══════════════════════════════════════════════════════════════════════
  // ADDING SONGS FLOW — 3 steps, then branches into one of two short paths
  // depending on what the user actually clicks at "choose" — see BRANCHES in
  // tutorial.js. The New Song branch (8 steps) is the deeper of the two: it
  // walks all the way into the song editor itself — typing some lyrics
  // first, then entering/trying/exiting Add Chords mode, then the editor's
  // Share/Collaborate toolbar — so it actually creates a real song along the
  // way (see "openEditor" below), unless the user was already editing one
  // when the tutorial started (see songEditModeOn in tutorial.js — the flow
  // then starts straight at "addChordsOn" instead).
  // Reachable from Options → Tutorials, or offered on first use elsewhere.
  // ═══════════════════════════════════════════════════════════════════════

  // Step "intro" — no target (centred). Mode: show.
  'addingSongs.intro.title': 'Adding a Song or Tune',
  'addingSongs.intro.body': 'Two ways in: drag a file onto the sidebar, or open the New Song form and paste or type it in.',

  // Step "sidebar" — target: #btn-sidebar. Mode: wait. Identical purpose to
  // generalUsage's "sidebar" step above (separate copy so each flow reads
  // naturally as its own self-contained tour, even though the underlying
  // action is the same).
  'addingSongs.sidebar.title': 'Open your Library',
  'addingSongs.sidebar.body': 'Click here to open the sidebar: that’s where songs live, and where you’ll drop files.',

  // Step "choose" — THE key hands-on step of this flow. Mode: wait, but
  // with TWO valid targets that BOTH stay clickable at once (unlike every
  // other "wait" step in the app, which has exactly one correct target):
  //   • #drop-zone (click it to browse for a file, or literally drag one
  //     onto it) → branches to the short "dropzoneDone" step below.
  //   • #btn-new-song-sidebar ("✦ New") → branches into "nstype"/"format"/
  //     "done" below, which walk through the New Song form.
  // This exists specifically so a user with no files handy on their device
  // yet (the drop zone alone isn't actually usable for them) can still
  // complete this step by clicking New instead — see the BRANCHES comment
  // in tutorial.js for the full mechanic.
  'addingSongs.choose.title': 'Two ways to add a song',
  'addingSongs.choose.body': 'Drag a file onto the highlighted drop zone (or click it to browse your files), or click <strong>✦ New</strong> to write one from scratch. Try either one.',

  // Branch A ("dropzoneDone") — only shown if the user clicked/used the drop
  // zone. No target (centred). Mode: show, step.last = true. Short close-out
  // since there's nothing further to demonstrate once a file's been chosen
  // (Magic Scroll takes it from there automatically).
  'addingSongs.dropzoneDone.title': 'Nice!',
  'addingSongs.dropzoneDone.body': 'Once you pick a file, Magic Scroll adds it to your library automatically. You can also always start a blank song with <strong>✦ New</strong> at the bottom of the sidebar.',

  // Branch B, step 1/8 ("nstype") — only shown if the user clicked New.
  // Target: #ns-type (the format <select> inside the now-open New Song
  // modal). Mode: show.
  'addingSongs.nstype.title': 'Pick a format',
  'addingSongs.nstype.body': '<strong>Song / Chord Sheet</strong> for lyrics with chords, <strong>ABC Notation</strong> for real sheet music, or either iReal option for jazz-style lead sheets. The Sheet Music and Lead Sheets tutorials cover those two in more depth.',

  // Branch B, step 2/8 ("openEditor") — target: #btn-ns-create ("Open
  // Editor" button). Mode: wait — this DOES require a real click, because
  // reaching the actual editor is the whole point of the steps that follow
  // it. Clicking it for real creates the song (same as if the user had
  // clicked it themselves), which "toolbar" further down is upfront about.
  'addingSongs.openEditor.title': 'Create it',
  'addingSongs.openEditor.body': 'Fill in a title above, then click <strong>Open Editor</strong> to create the song and jump straight into writing it. (Cancel closes this without saving anything, if you’d rather stop here.)',

  // Branch B, step 3/8 ("format") — target: #song-editor-wrap (the real,
  // now-open editor — moved here from before "openEditor", where it used
  // to point at a hint block inside the New Song modal before any editor
  // existed to act on). Mode: show.
  'addingSongs.format.title': 'Just start typing',
  'addingSongs.format.body': 'Type or paste your lyrics into the editor below. The <strong>🎯 Add Chords</strong> button above it (up next) lets you tap a word to drop a chord on it once you’ve got something to tag. Old two-line sheets with chords on their own line paste in fine too.',

  // Branch B, step 4/8 ("addChordsOn") — target: #btn-precision-toggle ("🎯
  // Add Chords" button, only present for the "Song / Chord Sheet" type —
  // see BRANCHES' comment in tutorial.js for what happens with the other
  // types). Mode: wait.
  'addingSongs.addChordsOn.title': 'Tag chords to your lyrics',
  'addingSongs.addChordsOn.body': 'Click <strong>🎯 Add Chords</strong> to switch into chord-tagging mode: every word in your lyrics becomes clickable.',

  // Branch B, step 5/8 ("addChordsUsage") — new. Target: #song-editor-wrap
  // (same as "format" above — while tagging mode is on this is the Add
  // Chords precision canvas rather than the plain textarea, but both live
  // in the same wrapper). Mode: show — nothing to "wait for" here beyond
  // the user trying it at their own pace, so it has its own Next button.
  'addingSongs.addChordsUsage.title': 'Add your chords',
  'addingSongs.addChordsUsage.body': 'Tap any word above to drop a chord on it, or tap an existing chord to edit or remove it. Try adding a few, then click Next whenever you’re ready to turn tagging mode back off.',

  // Branch B, step 6/8 ("addChordsOff") — same target as addChordsOn
  // (#btn-precision-toggle is a toggle — clicking it again turns the mode
  // back off). Mode: wait. Deliberately a second wait step on the same
  // button rather than folded into addChordsUsage, so the user actually
  // performs both directions of the toggle rather than just reading about
  // the second one.
  'addingSongs.addChordsOff.title': 'Back to plain typing',
  'addingSongs.addChordsOff.body': 'Click <strong>🎯 Add Chords</strong> again to turn tagging mode back off and return to typing normally. Toggle it on and off any time you switch between typing lyrics and placing chords.',

  // Branch B, step 7/8 ("toolbar") — target: #edit-toolbar (the row above
  // the editor with Share, Collaborate, etc.). Mode: show. Also the step
  // that owns up to "openEditor" above having just created a real song.
  'addingSongs.toolbar.title': 'Sharing & collaborating',
  'addingSongs.toolbar.body': '<strong>📤 Share ▾</strong> sends this song to another app, downloads it as a file, publishes it to the online library, or exports a classic monospace chord sheet. <strong>🔗 Collaborate</strong> starts a live session: share the code it gives you and whoever joins can edit alongside you in real time. (This is a real song in your library now, however you got here. Rename it, keep building on it, or delete it if you don’t need it.)',

  // Branch B, step 8/8 ("done") — no target (centred). Mode: show,
  // step.last = true.
  'addingSongs.done.title': 'That’s the song editor',
  'addingSongs.done.body': 'Explore Sheet Music and Lead Sheets from Options → Tutorials next. They each have their own editor with their own tricks.',

  // ═══════════════════════════════════════════════════════════════════════
  // SHEET MUSIC FLOW — 6 steps. "edit" is now mode:'wait' (see below) —
  // every other step is "show" and, same as before, if no ABC-notation song
  // happens to be open when this flow runs, tutorial.js's waitForTarget()
  // gracefully degrades each targeted step to a centred pop-up instead of
  // erroring.
  // ═══════════════════════════════════════════════════════════════════════

  // Step "intro" — no target (centred). Mode: show.
  'sheetMusic.intro.title': 'Sheet Music (ABC Notation)',
  'sheetMusic.intro.body': 'Sheet-music songs render real musical notation instead of chords and lyrics, great for tunes, classical pieces, and anything better read than played by ear. Open or create an ABC-notation song to see the toolbar below for real.',

  // Step "toolbar" — target: #abc-toolbar (the whole toolbar strip above an
  // open ABC song). Mode: show.
  'sheetMusic.toolbar.title': 'The sheet music toolbar',
  'sheetMusic.toolbar.body': 'Appears above any ABC-notation song. <strong>Edit</strong> switches to the raw notation; <strong>Sheet music ▾</strong> holds playback, soundfont, whistle-tab, and note-name options.',

  // Step "edit" — target: #btn-abc-edit ("✎ Edit" button). Mode: wait (was
  // "show" — see tutorial.js's comment on this step for why: the
  // "transpose" step below only has something to highlight once edit mode
  // is actually on, so this now requires the real click rather than just
  // pointing at the button).
  'sheetMusic.edit.title': 'Edit the notation',
  'sheetMusic.edit.body': 'Click Edit to see and change the raw ABC text directly. Letters A–G are notes, | marks bar lines, and chord symbols go in quotes above a note, e.g. "G7". This is also where permanent transposing lives, coming up next.',

  // Step "menu" — target: #btn-abc-sheetmusic-menu-trigger ("🎼 Sheet music
  // ▾" button). Mode: show.
  'sheetMusic.menu.title': 'Sheet music options',
  'sheetMusic.menu.body': 'Load a custom soundfont for playback, show tin-whistle fingering tabs, or reveal the letter name under every note.',

  // Step "transpose" — target: #abc-transpose-bar (the ♭−/♯+ bar shown when
  // editing an ABC song — reachable now that "edit" above forces edit mode
  // on first). Mode: show. Copy now also covers #topbar-key-group (the
  // Chords tab's own ♭−/♯+, highlighted in General Usage's "keygroup" step)
  // as the non-destructive alternative.
  'sheetMusic.transpose.title': 'Transpose',
  'sheetMusic.transpose.body': 'Shift the whole piece up or down, permanently rewriting every note (no retyping needed). Prefer not to touch the notation itself? The <strong>🎵 Chords</strong> tab on the topbar has its own ♭−/♯+ that transposes the display only, without changing anything saved.',

  // Step "done" — no target (centred). Mode: show, step.last = true.
  'sheetMusic.done.title': 'Getting sheet music in',
  'sheetMusic.done.body': 'Start one via <strong>✦ New → ABC Notation</strong> and paste in ABC text, or drag in a .abc, .mxl, or .mscz file. MuseScore files convert automatically.',

  // ═══════════════════════════════════════════════════════════════════════
  // LEAD SHEETS FLOW — 5 steps. "edit" (new) is mode:'wait' — every other
  // step is "show", same "gracefully degrades if nothing's open" behaviour
  // as Sheet Music above.
  // ═══════════════════════════════════════════════════════════════════════

  // Step "intro" — no target (centred). Mode: show.
  'leadSheets.intro.title': 'Lead Sheets (iReal Pro style)',
  'leadSheets.intro.body': 'A compact chord-grid format for jazz standards and quick charts, the same style iReal Pro uses. Open or create a lead sheet to see the toolbar below for real.',

  // Step "toolbar" — target: #ireal-toolbar (toolbar strip above an open
  // lead sheet). Mode: show.
  'leadSheets.toolbar.title': 'The lead sheet toolbar',
  'leadSheets.toolbar.body': 'Appears above any lead sheet, with options for playback style, key, and sharing.',

  // Step "edit" (new) — target: #btn-ls-edit ("✎ Edit" button). Mode: wait
  // — chord cells in the chart below don't respond to clicks until this is
  // on, so the tour now makes the user actually turn it on before "content"
  // tells them to start clicking cells.
  'leadSheets.edit.title': 'Turn on editing',
  'leadSheets.edit.body': 'Click Edit to switch this chart into edit mode. The chord cells below only respond to clicks once this is on. Click it again later (or Save, its label once it’s active) to lock changes back in.',

  // Step "content" — target: #ireal-content (the actual chord-grid area).
  // Mode: show. Copy updated to assume edit mode is now on (the new "edit"
  // step above guarantees it, or gracefully skipped if there's no chart to
  // edit at all).
  'leadSheets.content.title': 'Editing a chart',
  'leadSheets.content.body': 'Now that editing is on, tap any chord cell to change it directly, or use its ⋮ menu for repeats, endings, and other jazz-chart notation.',

  // Step "done" — no target (centred). Mode: show, step.last = true.
  'leadSheets.done.title': 'Getting a lead sheet in',
  'leadSheets.done.body': 'Start a blank one via <strong>✦ New → 🎼 Lead Sheet (Blank)</strong>, or paste an <code>irealb://</code> link via <strong>🎼 Lead Sheet(s) (iReal Pro URL)</strong>. Single tunes and whole playlists both work.'
};

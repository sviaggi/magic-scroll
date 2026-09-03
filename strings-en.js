/**
 * strings-en.js — Magic Scroll user-facing text (English / source locale).
 *
 * WHY THIS FILE EXISTS
 * All copy the user actually reads — button labels, tooltips, placeholder
 * text, alert/confirm/prompt messages, tutorial hints — lives here instead
 * of being hard-coded inline throughout MagicScroll-release.html. That's
 * for two reasons:
 *   1. Copy-editing: someone can proofread/rewrite the app's wording without
 *      touching (or understanding) any application logic.
 *   2. Translation: a future strings-<lang>.js (e.g. strings-es.js,
 *      strings-fr.js) can ship the exact same keys with translated values,
 *      and swapping which file is loaded — see the <script> tag in the main
 *      HTML file — retargets the whole app to that language. No application
 *      code needs to change to add a language.
 *
 * HOW IT'S WIRED IN
 *  - Static HTML: elements carry a `data-i18n="key"` (element text content),
 *    `data-i18n-title="key"` (title tooltip) and/or `data-i18n-placeholder="key"`
 *    (input placeholder) attribute. `applyI18nStrings()` (in the main HTML
 *    file, run once at boot, and again whenever `setLanguage()` switches
 *    languages) walks the DOM and fills all three from whichever language
 *    dictionary is currently active.
 *  - JS-generated text (alerts, confirms, prompts, dynamically-built status
 *    messages): call `t('key')`, or `t('key', {name: value, ...})` when the
 *    string has a `{name}`-style placeholder for data that varies at runtime
 *    (a song title, a count, an error message, ...). See the `t()` helper
 *    defined at the bottom of this file. Note this only affects text
 *    generated AFTER a language switch — a hint/status string built once by
 *    JS and left sitting in the DOM (e.g. the lead-sheet edit hint, built
 *    once when that editor opens) won't retroactively re-translate until
 *    whatever built it runs again.
 *
 * MULTIPLE LANGUAGES
 * This file defines `window.MS_STRINGS_EN` (rather than the generic
 * `window.MS_STRINGS` older versions used) so sibling dictionaries —
 * `window.MS_STRINGS_ZH` (see strings-zh.js) and `window.MS_STRINGS_FR`
 * (see strings-fr.js), each loaded via its own `<script src="strings-xx.js">`
 * tag right after this one — can sit alongside it without any file
 * overwriting another. `window.MS_LANG` ('en', 'zh', or 'fr', persisted in
 * localStorage as `ug_lang`) picks which one `t()` actually reads from;
 * `window.setLanguage(lang)` (defined below) changes it and re-applies every
 * `data-i18n*` element on the page. A missing key in a non-English
 * dictionary silently falls back to the English string rather than showing
 * raw key text, so a partially-translated language degrades gracefully
 * instead of looking broken. Adding another language is the same shape: a
 * new strings-<lang>.js defining `window.MS_STRINGS_<LANG>`, a case in
 * `_activeDict()` below, a `<script src>` tag for it, and an `<option>` in
 * the `#lang-sel` dropdown.
 *
 * SCOPE / STATUS (as of this pass)
 * This is a first, substantial i18n pass — it covers every alert/confirm/
 * prompt dialog in the app (the messages most worth getting exactly right
 * for a translator, since they're often the only feedback the user gets for
 * an action), the topbar, sidebar header/search, the song/lead-sheet/ABC
 * editor toolbars and their tutorial hints and placeholder/example text, the
 * theme settings panel, empty states, and the main modals. It does NOT yet
 * cover literally every string in the app (this is a ~20,000-line file with
 * many hundreds of scattered dynamic status messages in less-common code
 * paths) — anything not yet migrated still reads as a plain hard-coded
 * string inline, same as before. The mechanism above is meant to make
 * finishing that migration, section by section, straightforward whenever
 * it's worth doing.
 *
 * KEY NAMING
 * Dot-separated, coarsely grouped by where the string appears (topbar.*,
 * editor.*, alert.*, confirm.*, prompt.*, modal.*, ...) so a translator can
 * tell roughly where in the app a string shows up without running it.
 */
window.MS_STRINGS_EN = {

  // ── TOPBAR ─────────────────────────────────────────────────────────────
  'topbar.library':            '☰',
  'topbar.libraryTitle':       'Library',
  'topbar.chords':             '🎵',
  'topbar.chordsTitle':        'Key, chords & ear-training tools',
  'topbar.chordsLabel':        'Chords',
  'topbar.key':                'Key',
  'topbar.transposeDown':      'Transpose down one semitone',
  'topbar.transposeUp':        'Transpose up one semitone',
  'topbar.transposeReset':     'Reset to original key',
  'topbar.simplifyChords':     'Simplify chords',
  'topbar.simplifyChordsTitle':'Simplify all chords to root form',
  'topbar.size':                'Size',
  'topbar.lineSpacing':         'Line Spacing',
  'topbar.lineSpacingTitle':    'Line spacing for song & lead-sheet text',
  'topbar.themes':              'Themes',
  'topbar.themesTitle':         'Customise theme, colours, fonts & background',
  'topbar.scroll':              '▶︎',
  'topbar.scrollTitle':         'Scroll',
  'topbar.scrollStop':          '■',
  'topbar.scrollStopLabel':     'Stop',

  // ── SIDEBAR ────────────────────────────────────────────────────────────
  'sidebar.searchPlaceholder':  'Search…',
  'sidebar.multiselectTitle':   'Select multiple songs',
  'sidebar.filterTitle':        'Filter by type',
  'toast.songLoaded':           'Loaded {title}',

  // ── SONG/CHORD-SHEET EDITOR ────────────────────────────────────────────
  'editor.addChords':           '🎯 Add Chords',
  'editor.addChordsTitle':      'Tag chords to exact words/syllables instead of aligning them by hand',
  'editor.bold':                'Bold (**text**)',
  'editor.italic':              'Italic (*text*)',
  'editor.underline':           'Underline (_text_)',
  'editor.embed':               '⧉ Embed…',
  'editor.embedTitle':          'Embed a video or link',
  'editor.precisionHint':       'Click on the word (or the spot) where you want a chord, then type it into the box that appears. Click an existing chord to edit or remove it.',
  'editor.tabWrite':            '🎸 Tab Riff',
  'editor.tabWriteTitle':       "Tab out a solo/riff using the current instrument's tuning — type fret numbers directly, they line up across strings automatically",
  'editor.tabWriteHint':        'Click a string line, then type fret numbers — the other strings fill in automatically. Click an earlier spot to add a double-stop without disturbing what comes after. Hold Shift to glue on a second digit (frets 10+) or the target fret after h/p/b/slide marks. Space = rest, Enter = new line, Esc or the button again to finish.',
  'editor.editToggle':          '✎ Edit',
  'editor.editToggleActive':    '✎ Save',
  'editor.editToggleTitle':     'Toggle between edit and read mode',
  'editor.cancel':              '✕ Cancel',
  'editor.cancelTitle':         'Discard all changes made since entering edit mode',
  'editor.save':                '📤 Share',
  'editor.saveTitle':           'Save changes to this song (Ctrl+S)',
  'editor.saveAs':              '💾 Save As…',
  'editor.publish':             '☁ Publish',
  'editor.exportMonospace':     '⬇ Export monospace',
  // Placeholder / example text shown inside empty fields — these are what a
  // user sees BEFORE they've typed anything, so they need translating same
  // as any other visible copy.
  'editor.titlePlaceholder':    'Song title',
  'editor.artistPlaceholder':   'Artist name',
  'editor.keyPlaceholder':      'e.g. Am',
  'editor.timeSigPlaceholder':  'e.g. 4/4',
  'editor.songPlaceholder': 'Paste or type your song here.\n\n[Verse]\nType out your lyrics... take your time, get \'em right\nNo columns, no rulers, no fuss is in sight\nTap "Add Chords" above, and pick the right spot\nOver words, over space, over all, over thought\n\n[Chorus]\n[G]Like this, a chord [D] or a strum where you need[D]\nC                                D                                      Em                     G\nIt\'ll format real pretty! Don\'t you think it looks clean?\nIt\'s fast and it\'s simple, it\'s free, (there\'s no toll!)\nI hope you enjoy using your magic scroll!',

  // ── LEAD-SHEET EDITOR ──────────────────────────────────────────────────
  'editor.lsHint': 'Editing — change the title, author, style, BPM and time signature above; click a bar to change its chords, or use its ⋮ menu for barlines, mid-piece time changes, sections and inserting/deleting bars. '
    + 'Chord shorthand: b/# for flat/sharp (Bb, F#) · m or - for minor (Dm) · maj7 or ^ for major 7th (Cmaj7) · 7 for dominant 7th (G7) · sus2/sus4 for suspended · dim or o for diminished · aug or + for augmented — e.g. F#m7b5, Bbmaj7, Caug.',
  'editor.lsEditToggleTitle':       'Edit this lead sheet',
  'editor.lsEditToggleTitleActive': 'Save changes and exit edit mode',

  // ── ABC SHEET-MUSIC EDITOR ─────────────────────────────────────────────
  'editor.abcHint': 'Editing raw ABC notation — notes are letters A-G (lowercase = higher octave; add \' after a note for another octave up, or , for an octave down); a number after a note changes its length (C2 = twice as long, C/2 = half); | marks a bar line. Chord symbols go in quotes above the note they fall on, e.g. "G7". K: sets the key, M: sets the meter, Q: sets the tempo.',

  // ── ADD-CHORDS PRECISION POPUP ──────────────────────────────────────────
  'precision.chordInputPlaceholder': 'Chord, e.g. Am7',

  // ── CREATE SET MODAL ────────────────────────────────────────────────────
  'createSet.searchPlaceholder': 'Search tunes or type (jig, reel, waltz…)',

  // ── NEW SONG MODAL ───────────────────────────────────────────────────────
  'newSong.abcPlaceholder':   'X:1\nT:My Tune\nC:Composer\nM:4/4\nL:1/8\nK:G\n...',
  'newSong.irealPlaceholder': 'irealb://SongTitle%3DComposer%3D%3DStyle%3DKey...',

  // ── SEARCH ───────────────────────────────────────────────────────────────
  // Shown in a search-result snippet in place of a [yt:…]/[video:…] tag —
  // a truncated one-line snippet has no room for a real video embed/link.
  'search.videoLabel': 'Video',

  // ── COMMUNITY COLLECTIONS ────────────────────────────────────────────────
  'collections.searchPlaceholder': 'Search community collections…',

  // ── COLLABORATION ─────────────────────────────────────────────────────────
  'collab.namePlaceholder': 'Your name',
  'collab.codePlaceholder': 'ABCDEF',

  // ── PLAYBACK BARS (ABC sheet-music player + lead-sheet backing track) ───
  'playbar.play':                 'Play',
  'playbar.stop':                 'Stop',
  'playbar.playPause':            'Play / Pause',
  'playbar.stopReturn':           'Stop and return to start',
  'playbar.bpm':                  'BPM',
  'playbar.meter':                'Meter',
  'playbar.meterAuto':            'N/A',
  'playbar.meterTitle':           'Meter — N/A follows the sheet (and any meter changes within it); pick a value to force a fixed meter',
  'playbar.plays':                'Plays',
  'playbar.playsTitle':           'Number of times to play through the chart',
  'playbar.bar':                  'Bar {n}',
  'playbar.mute':                 'Mute {inst}',
  'playbar.unmute':               'Unmute {inst}',
  'playbar.perInstSettings':      'Per-instrument settings',
  'playbar.loading':              'Loading…',
  'playbar.openLeadSheetToUse':   'Open a lead sheet to use the backing track',
  'playbar.noChordData':          'No chord data in this lead sheet',
  'playbar.instDrums':            'Drums',
  'playbar.instKeys':             'Keys',
  'playbar.instBass':             'Bass',
  'playbar.instGuitar':           'Guitar',

  // ── CHORD DIAGRAMS ─────────────────────────────────────────────────────
  'diagrams.fabTitle':          'Chord Diagrams',

  // ── OPTIONS PANEL ──────────────────────────────────────────────────────
  'options.language':           'Language',
  'options.languageTitle':      'Change the app\'s display language',

  // ── EMPTY STATE ────────────────────────────────────────────────────────
  'emptyState.title':           'No song loaded',

  // ── ALERTS (window.alert — informational; no user choice) ─────────────
  'alert.themeSaved':                 'Theme "{name}" saved!',
  'alert.noCustomThemes':             'No custom themes saved yet — use "Save as Theme" first, then export.',
  'alert.invalidThemeFile':           'That file isn’t valid theme JSON.',
  'alert.noThemesInFile':             'No themes found in that file.',
  'alert.themesImported':             'Imported {count} theme{plural}.',
  'alert.fontLoadFailed':             'Could not load that font file: {filename}',
  'alert.jsonError':                  'JSON error: {message}',
  'alert.invalidConfigFile':          'Not a valid Magic Scroll config file.',
  'alert.configParseError':           'Could not parse config file:\n{message}',
  'alert.mxlExtractFailed':           'Could not extract XML from .mxl file',
  'alert.musicXmlParseFailed':        'Could not parse MusicXML in {filename}',
  'alert.mxlReadError':               'Error reading .mxl: {message}',
  'alert.msczExtractFailed':          'Could not extract score from {filename}',
  'alert.museScoreParseFailed':       'Could not parse MuseScore file {filename}',
  'alert.msczReadError':              'Error reading .mscz: {message}',
  'alert.midiParseFailed':            'Could not parse MIDI: {filename}',
  'alert.jsonParseError':             'JSON parse error:\n{message}',
  'alert.simplifyPlainTextOnly':      'Simplify works on plain-text songs only.',
  'alert.editPlainTextOnly':          'Edit mode works on plain-text songs only.',
  'alert.exportMonospacePlainTextOnly': 'Export monospace works on plain-text chord sheets only.',
  'alert.printFailed':                'Print failed: {message}',
  'alert.printPopupBlocked':          'Couldn’t open the print view. Please allow pop-ups, or use your browser’s Print / Save as PDF.',
  'alert.noSongLoaded':               'No song loaded.',
  'alert.openLeadSheetFirst':         'Open the lead sheet first.',
  'alert.irealUrlFailed':             'Could not build iReal URL: {message}',
  'alert.collabPlainTextOrLeadSheetOnly': 'Collaborate works on plain-text songs and lead sheets only.',
  'alert.collabConnectFailed':        'Collaborate needs an internet connection and could not connect. Check your connection and try again.',
  'alert.collabHostOnlyEnd':          'Only the host can end this collaboration.',

  // ── CONFIRMS (window.confirm — Yes/No before a destructive action) ────
  'confirm.deleteTheme':              'Delete theme "{name}"?',
  'confirm.resetColours':             'Reset colours to defaults?',
  'confirm.resetFonts':               'Reset fonts to defaults?',
  'confirm.deleteFolder':             'Delete folder "{name}"? Songs stay, just the folder is removed.',
  'confirm.deleteFolderAndSongs':     'Delete folder "{name}" AND all {count} song{plural} inside it? This cannot be undone.',
  'confirm.deleteEmptyFolder':        'Delete folder "{name}"? It has no songs in it.',
  'confirm.removeSong':               'Remove "{title}"?',
  'confirm.deleteSongs':              'Delete {count} song(s)?',
  'confirm.endCollab':                'End this collaboration for everyone? The current content will be saved permanently for all participants.',

  // ── PROMPTS (window.prompt — asks the user to type something) ─────────
  'prompt.saveThemeName':             'Save as theme name:',
  'prompt.importedThemeName':         'Name for this imported theme:',
  'prompt.renameSong':                'Rename:',
  'prompt.newFolderName':             'New folder name:',
  'prompt.renameFolder':              'Rename folder:',
  'prompt.folderName':                'Folder name:',
  'prompt.embedLink':                 'Paste a link to embed (YouTube video, or any web link):',
  'prompt.embedLinkText':             'Link text (optional):',
  'prompt.copyIrealUrl':              'Copy this irealb:// URL:',

  // ── TOPBAR (additional) ─────────────────────────────────────────────────
  'topbar.options':             '⚙',
  'topbar.optionsTitle':        'Size, theme & print',
  'topbar.optionsLabel':        'Options',
  'topbar.scrollLabel':         'Scroll',
  'topbar.scrollSpeedTitle':    'Scroll speed',
  'topbar.detectedKeyTitle':    'Detected key — click ♭/♯ to transpose',
  'topbar.detectedKeyCapoTitle': 'This song is being played using the {shapeKey} chord shapes with a capo on fret {fret}, transposing it up to {soundingKey}.',
  'topbar.collapseLabel':       '▲ hide',
  'topbar.collapseTitle':       'Hide controls (click ▼ strip to restore)',
  'topbar.restoreTitle':        'Show controls (tap to restore)',

  // ── SIDEBAR (additional) ────────────────────────────────────────────────
  'sidebar.libraryHeader':      'Library',
  'sidebar.emptyLibrary':       '🗑 Empty library',
  'sidebar.clearSearchTitle':   'Clear search',
  'sidebar.onlineSearchOn':     'Online search is on — click to disable',
  'sidebar.onlineSearchOff':    'Online search is off — click to enable',
  'sidebar.previousSong':       '◀ Previous Song',
  'sidebar.previousSongTitle':  'Go back to the previous song you had open',
  'sidebar.noPreviousSong':     'No previous song.',
  'sidebar.untitled':           'Untitled',
  'sidebar.selectRandom':       '🎲 Select Random',
  'sidebar.selectRandomTitle':  'Open a random song from your library',
  'sidebar.joinCollab':         '🔗 Join Collaboration…',
  'sidebar.joinCollab2':        'Join Collaboration',
  'sidebar.joinCollabTitle':    'Join a live collaboration using a code someone shared with you',
  'sidebar.nSelected':          '{n} selected',
  'sidebar.bulkSelectAllTitle': 'Select all visible songs',
  'sidebar.bulkPublishTitle':   'Publish selected songs to online library',
  'sidebar.folder':             '📁 Folder',
  'sidebar.bulkFolderTitle':    'Move selected to folder',
  'sidebar.bulkDelete':         '✕ Delete',
  'sidebar.bulkDeleteTitle':    'Delete selected',
  'sidebar.cancel':             'Cancel',
  'sidebar.bulkCancelTitle':    'Cancel selection',
  'sidebar.openFilesHere':      'Open files here',
  'sidebar.new':                '✦ New',
  'sidebar.newTitle':           'Create a new blank song',
  'sidebar.newFolderTitle':     'Create a new folder to organise songs into',
  'sidebar.exportLibrary':      'Export library',
  'sidebar.exportLibraryTitle': 'Save library to file · Shift+click for Save As',
  'sidebar.collections':        '📦 Collections',
  'sidebar.collectionsTitle':   'Browse and add song collections',
  'sidebar.resizeHandleTitle':  'Drag to resize sidebar',

  // ── FILTER PANEL ─────────────────────────────────────────────────────────
  'filter.all':                 'All',
  'filter.allTitle':            'Show all types',
  'filter.none':                'None',
  'filter.noneTitle':           'Hide all types',
  'filter.unspecified':         '(Unspecified)',
  'filter.libraryEmpty':        'Library is empty',
  'filter.catChords':           'Chords',
  'filter.catTabs':             'Tabs',
  'filter.catSheetMusic':       'Sheet Music',
  'filter.catLeadSheets':       'Lead Sheets',
  'sidebar.randomNoMatch':      'No songs match the current filter.',

  // ── EMPTY STATE (additional) ────────────────────────────────────────────
  'emptyState.body':            'Drop .txt, .json, or .html files into the sidebar, or click <strong>✦ New Song</strong> to write one.',

  // ── SONG/CHORD-SHEET EDITOR (additional) ────────────────────────────────
  'editor.titleLabel':          'Title',
  'editor.artistLabel':         'Artist',
  'editor.keyLabel':            'Key',
  'editor.timeSigLabel':        'Time Sig.',
  'editor.transpose':           'Transpose',
  'editor.transposeDownTitle':  'Move every chord in the text down a semitone (permanent)',
  'editor.transposeUpTitle':    'Move every chord in the text up a semitone (permanent)',
  'editor.transposeDownAbcTitle': 'Move every note in this tune down a semitone (permanent) — updates K: and the note pitches',
  'editor.transposeUpAbcTitle':   'Move every note in this tune up a semitone (permanent) — updates K: and the note pitches',
  'editor.saveMenu':            '📤 Share ▾',
  'editor.publish2':            'Publish',

  // ── PRECISION POPUP (additional) ────────────────────────────────────────
  'precision.add':              'Add',
  'precision.remove':           'Remove',

  // ── TOOLBARS (song/lead-sheet/ABC shared chrome) ────────────────────────
  'toolbar.saveOptionsTitle':          'Share options',
  'toolbar.publishSheetMusicTitle':    'Publish this sheet music to the online library',
  'toolbar.createSet':                 '⛓ Create set',
  'toolbar.createSetTitle':            'Stack other tunes from your library under this one to make a set',

  // ── TRANSCRIBE AUDIO (BETA) ───────────────────────────────────────────────
  'transcribe.button':                 '🎙 Transcribe (Beta)',
  'transcribe.buttonTitle':            'Turn a recording or audio file into a rough draft melody you can clean up. Experimental! Expect mistakes.',
  'transcribe.modalTitle':             'Transcribe Audio (Beta)',
  'transcribe.disclaimer':             'Experimental: So this is a new feature and it kind of sucks right now! It\'s a rough algorithmic guess at what you\'re playing, not a full transcription engine. Works best on a single clear melody instrument or voice with no accompaniment. Treat the result as a starting point, review and correct the notes it produces, or take a screenshot and send it to me if it\'s egregiously bad and kind of funny.',
  'transcribe.orLabel':                'or',
  'transcribe.startRecording':         '● Start Recording',
  'transcribe.stopRecording':          '■ Stop Recording',
  'transcribe.recording':              'Recording…',
  'transcribe.chooseFile':             '📂 Choose Audio File…',
  'transcribe.analyzing':              'Analysing audio…',
  'transcribe.noPitchFound':           'Couldn\'t detect any clear notes in that audio. Sorry, this tool kinda sucks! try a cleaner, single-instrument/voice recording.',
  'transcribe.micDenied':              'Microphone access was denied or unavailable.',
  'transcribe.decodeError':            'Couldn\'t read that audio file.',
  'transcribe.insertedComment':        'Beta transcription: Pitch/rhythm are rough guesses; review and correct before use.',
  'transcribe.insertedToast':          'Inserted {n} transcribed notes (guessed key: {key}) — review before using.',
  'toolbar.sheetMusicMenu':            '🎼 Sheet music ▾',
  'toolbar.sheetMusicOptionsTitle':    'Sheet music options',
  'toolbar.soundfont':                 '🎵 Soundfont',
  'toolbar.soundfontTitle':            'Load SF2 or SFZ soundfont',
  'toolbar.unloadSoundfont':           '✕ Unload Soundfont',
  'toolbar.unloadSoundfontTitle':      'Unload soundfont (revert to the default sound)',
  'toolbar.whistleTabs':               '🪈 Whistle Tabs',
  'toolbar.whistleTabsTitle':          'Toggle tin whistle fingering diagrams',
  'toolbar.whistleKeyTitle':           'Whistle key',
  'toolbar.whistleD':                  'D whistle',
  'toolbar.whistleC':                  'C whistle',
  'toolbar.whistleG':                  'G whistle',
  'toolbar.whistleBb':                 'Bb whistle',
  'toolbar.whistleEb':                 'Eb whistle',
  'toolbar.hideChords':                '🎼 Hide Chords',
  'toolbar.hideChordsTitle':           'Hide the chord symbols marked in this ABC file',
  'toolbar.noteNames':                 '🔤 Note Names',
  'toolbar.noteNamesTitle':            'Show the letter name under each note',
  'toolbar.collaborate':               '🔗 Collaborate',
  'toolbar.collaborateTitle':          'Start or manage a live collaboration on this song',
  'toolbar.chordView':                 '≡ Condensed',
  'toolbar.chordViewTitle':            'Showing chords floating above each word — click to show them inline in [brackets] instead (more compact)',

  // ── CHORD DIAGRAMS PANEL ─────────────────────────────────────────────────
  'diagrams.title':              'Chord Diagrams',
  'diagrams.smallerTitle':       'Smaller diagrams (also affects text)',
  'diagrams.largerTitle':        'Larger diagrams (also affects text)',
  'diagrams.closeTitle':         'Close chord diagrams',
  'diagrams.primaryInstrument':  'Primary instrument',
  'diagrams.secondaryInstrument':'Secondary instrument',
  'diagrams.capo':               'Capo',
  'diagrams.capoTitle':          'Capo / pre-transpose this instrument (−11 to 11): shows the shape to finger so it sounds like the page chord',
  'diagrams.customBtn':          '⚙ Custom…',
  'diagrams.customTitle':        'Define your own instrument & tuning',
  'diagrams.none':               'None',
  'diagrams.hideTitle':          'Hide chord diagrams',
  'diagrams.customInstrumentTitle': '⚙ Custom instrument',
  'diagrams.customHint':         'Pick the number of strings (1–8) and each string\'s tuning, lowest string first. Chord diagrams are computed for this tuning.',
  'diagrams.strings':            'Strings',
  'diagrams.useInstrument':      'Use instrument',
  'diagrams.chordsInSong':       'Chords in this song',

  // ── CREATE SET MODAL (additional) ───────────────────────────────────────
  'createSet.hint':              'Tick tunes to stack them on the page. They appear in the order you select them — the order is shown below.',
  'createSet.filterTypeTitle':   'Filter by tune type',
  'createSet.allTypes':          'All types',
  'createSet.noMatch':           'No tunes match this search / type.',
  'createSet.showSet':           'Show set',

  // ── NEW SONG MODAL (additional) ─────────────────────────────────────────
  'newSong.title':               '✦ New Song',
  'newSong.hint':                'Fill in the details, then write or paste your song in the editor that opens.',
  'newSong.typeLabel':           'Type',
  'newSong.typeSong':            'Song / Chord Sheet',
  'newSong.typeAbc':             'ABC Notation (sheet music)',
  'newSong.typeIreal':           '🎼 Lead Sheet(s) (iReal Pro URL)',
  'newSong.typeBlankLead':       '🎼 Lead Sheet (Blank)',
  'newSong.keyOptional':         'Key (optional)',
  'newSong.format':              'Just type your lyrics — the editor that opens has an <strong>Add Chords</strong> button, tap a word to drop a chord right on it. (Old two-line sheets with chords on their own line still paste in fine — they get converted automatically.)',
  'newSong.abcPasteLabel':       'Paste ABC Notation below — title and composer are extracted automatically',
  'newSong.irealPasteLabel':     'Paste an <code>irealb://</code> URL — single songs and full playlists are supported',
  'newSong.openEditor':          'Open Editor',

  // ── CONTACT / CREDITS PANEL ──────────────────────────────────────────────
  'contact.version':             'version 1.2.4',
  'contact.bugReportsHeading':   'Bug Reports / Donations',
  'contact.getInTouch':          'Found an issue? Get in touch:',
  'contact.includeDescription':  'Please include the song file and a description of what went wrong.',
  'contact.likeProject':         'Like the project? A donation would mean the world! ☕ 🌍',
  'contact.loading':             'Loading…',
  'contact.tabToggle':           '♩ Magic Scroll - by Spencer California<br>(Your favourite bard\'s favourite bard)</br>',

  // ── COLLECTIONS MODAL ────────────────────────────────────────────────────
  'collections.builtin':         '📦 Built-in',
  'collections.community':       '☁ Community',
  'collections.desc':            'Pre-made sets of songs. Adding one creates a new folder in your library.',
  'collections.close':           'Close',

  // ── PUBLISH MODAL ─────────────────────────────────────────────────────────
  'publish.title':                '☁ Publish to Online Library',
  'publish.checklist':
    '<strong>Before you publish, please confirm:</strong>'
    + '<ul>'
    + '<li>Publishing is <strong>final</strong> — the published version can\'t be changed or removed without an administrator.</li>'
    + '<li>Don\'t submit a minor edit or revised version if a similar song already exists in the library.</li>'
    + '<li>Don\'t publish something that isn\'t useful to other players — personal annotations, incomplete drafts, or private variations aren\'t a good fit. Remember there are offline functions if you need to share something with a small group-- You can just save the file to your device and send it over Whatsapp, Discord, or other messaging apps instead!</li>'
    + '<li>Make sure the song is <strong>complete</strong>: lyrics, chords, key/capo info, and any other details should be thoroughly checked before committing.</li>'
    + '<li><strong>Do not submit copyrighted material.</strong> Only publish songs you have the right to share — original compositions, traditional or public domain songs, or content with an open licence.</li>'
    + '</ul>'
    + '<div style="margin-top:10px;padding:8px 10px;background:var(--c-chrome-bg);border-radius:4px;font-size:0.74rem;color:var(--c-chrome-muted);line-height:1.5;">'
    + '🔒 Submissions are <strong>anonymous</strong> — no account, name, or identifying information is attached to anything you publish.'
    + '</div>',

  // ── COLLABORATION (additional) ──────────────────────────────────────────
  'collab.startExplainer': 'Start a live collaboration session for this song. Anyone you share the join code with can add it to their own library and edit alongside you in real time — no accounts, nothing to sign up for. When you end the session, the final version is saved for everyone who joined.',
  'collab.startBtn':       'Start Collaborating',
  'collab.shareCode':      'Share this code with others so they can join:',
  'collab.copyCode':       'Copy Code',
  'collab.hostOnlyNote':   'Only the host can end this collaboration.',
  'collab.endCollab':      'End Collaboration',
  'collab.enterCode':      'Enter the 6-character collaboration code shared with you.',
  'collab.join':           'Join',

  // ── KEBAB MENUS (song list + folders) ────────────────────────────────────
  'kebab.songOptions':          'Song options',
  'kebab.favourite':            '★ Favourite',
  'kebab.removeFavourite':      '☆ Remove Favourite',
  'kebab.rename':                '✎ Rename',
  'kebab.moveToFolder':         '📁 Move to folder',
  'kebab.duplicate':            '⧉ Duplicate',
  'kebab.publishEllipsis':      '☁ Publish…',
  'kebab.collaborateEllipsis':  '⇄ Collaborate…',
  'kebab.collaborating':        '⇄ Collaborating ({code})…',
  'kebab.remove':                '✕ Remove',
  'kebab.noFolder':             '— No folder',
  'kebab.noFoldersYet':         'No folders yet — make one below',
  'kebab.folderOptions':        'Folder options',
  'kebab.export':                '⬇ Export',
  'kebab.publishCollection':    'Publish collection…',
  'kebab.deleteFolderKeepSongs':  'Delete Folder (Keep Songs)',
  'kebab.deleteFolderAndSongs':   'Delete Folder + Songs',
  'kebab.liveCollaboration':    'Live collaboration',

  // ── METRONOME ─────────────────────────────────────────────────────────────
  'metronome.toggle':           '♩ Metronome',
  'metronome.openTitle':        'Open metronome',
  'metronome.timeSig':          'Time sig',
  'metronome.beat':             'Beat',
  'metronome.tapTempo':         'Tap tempo',
  'metronome.tapTempoTitle':    'Tap to set tempo',
  'metronome.start':            '▶︎ Start',
  'metronome.stop':             '■ Stop',
  'metronome.startStopTitle':   'Start / stop',
  'metronome.runningLabel':     '♩ {bpm} BPM ●',

  // ── TUNER ──────────────────────────────────────────────────────────────────
  'tuner.toggle':                '𝄞 Tuner',
  'tuner.toggleTitle':           'Chromatic tuner (uses microphone)',
  'tuner.panelTitle':            'Chromatic Tuner',
  'tuner.instrument':            'Instrument',
  'tuner.primaryInstrument':     'Primary Instrument',
  'tuner.secondaryInstrument':   'Secondary Instrument',
  'tuner.chromatic':             'Chromatic',
  'tuner.sensitivity':           'Sensitivity',
  'tuner.sensitivityHigh':       'High (quiet rooms)',
  'tuner.sensitivityMedium':     'Medium',
  'tuner.sensitivityLow':        'Low (noisy rooms)',
  'tuner.a4reference':           'A4 reference',
  'tuner.a4standard':            '440 Hz (standard)',
  'tuner.startListening':        '🎤 Start Listening',
  'tuner.stopListening':         '⏹︎ Stop Listening',
  'tuner.requiresHttps':         'Microphone requires HTTPS — open via your https:// URL.',
  'tuner.notAvailable':          'Microphone not available in this browser or context.',
  'tuner.micDenied':             '⚠ Microphone access denied: {msg}',

  // ── PRINT PANEL ────────────────────────────────────────────────────────────
  'printPanel.print':                   'Print',
  'printPanel.optionsTitle':            'Print options',
  'printPanel.panelTitle':              'Print options',
  'printPanel.font':                    'Font',
  'printPanel.fontChoice':              'Font choice',
  'printPanel.fontDefault':             'Page fonts (user-defined)',
  'printPanel.includeDiagrams':         'Include diagrams',
  'printPanel.primaryInstrumentNote':   '(primary instrument)',
  'printPanel.layout':                  'Layout',
  'printPanel.fitOnePage':              'Fit to one page',
  'printPanel.multiColumn':             'Multi-column',
  'printPanel.reducesBlankSpace':       '(reduces blank space)',
  'printPanel.skipChoruses':            'Skip repeated choruses',
  'printPanel.condensedNote':           '(chords inline in brackets, more per page)',
  'printPanel.whichTune':               'Which tune',
  'printPanel.allTunes':                'All tunes (whole set)',
  'printPanel.fittingHint':             'Fitting everything on one page in a nice, legible format can be difficult! It might be worth duplicating the song file to make a print-ready version that\'s edited to remove any redundant/unnecessary information (song titles, flavour text, hyperlinks).',
  'printPanel.printNow':                '🖨 Print now',

  // ── THEMES PANEL ─────────────────────────────────────────────────────────
  'themes.panelTitle':           '🎨 Themes',
  'themes.closeTitle':           'Close',
  'themes.presetThemes':         'Preset Themes',
  'themes.groupLight':           'Light',
  'themes.groupDark':            'Dark',
  'themes.uiColours':            'UI Colours',
  'themes.uiBg':                 'UI BG',
  'themes.uiBgAlt':              'UI BG Alt',
  'themes.uiBorder':             'UI Border',
  'themes.uiText':               'UI Text',
  'themes.uiMuted':              'UI Muted',
  'themes.accent':               'Accent',
  'themes.songCardColours':      'Song Card Colours',
  'themes.cardBg':               'Card BG',
  'themes.cardText':             'Card Text',
  'themes.cardTitle':            'Card Title',
  'themes.cardArtist':           'Card Artist',
  'themes.chordText':            'Chord Text',
  'themes.backgroundImage':      'Background Image',
  'themes.imageFile':            'Image file',
  'themes.browse':               '📂 Browse…',
  'themes.none':                 '(none)',
  'themes.imageScale':           'Image scale',
  'themes.scaleSmall':           'Small (300px tile)',
  'themes.scaleMedium':          'Medium (500px tile)',
  'themes.scaleLarge':           'Large (800px tile)',
  'themes.scaleXL':              'XL (1200px tile)',
  'themes.scaleFullWidth':       'Full width',
  'themes.scaleCover':           'Cover (stretch)',
  'themes.scrollWithPage':       'Scroll with page',
  'themes.clearImage':           'Clear image',
  'themes.clearBtn':             '✕ Clear',
  'themes.fonts':                'Fonts',
  'themes.fontBodyTab':          'Body / Tab',
  'themes.fontChordTokens':      'Chord Tokens',
  'themes.fontSongTitle':        'Song Title',
  'themes.fontAppUI':            'App UI',
  'themes.displayOptions':       'Display Options',
  'themes.monoSpacing':          'Monospace chord/lyric spacing',
  'themes.monoSpacingTitle':     'Render chord and lyric lines in a true monospace font so chords line up exactly above their lyrics',
  'themes.monoSpacingOff':       '⇔ Off',
  'themes.apply':                'Apply',
  'themes.saveAsTheme':          'Save as Theme',
  'themes.resetColours':         'Reset Colours',
  'themes.resetFonts':           'Reset Fonts',
  'themes.export':               '⇩ Export Themes',
  'themes.exportTitle':          'Download your saved custom themes as a file you can share',
  'themes.import':               '⇧ Import Themes',
  'themes.importTitle':          'Load custom themes shared by someone else',

  // ── SONG/LEAD-SHEET/ABC META PILLS ("Type:", "Key:", ...) ──────────────
  'meta.type':                  'Type',
  'meta.key':                   'Key',
  'meta.time':                  'Time',
  'meta.tuning':                'Tuning',
  'meta.capo':                  'Capo',
  'meta.fret':                  'Fret {n}',
  'meta.style':                 'Style',
  'meta.lead':                  'Lead',

  // ── PLAYBACK (additional) ───────────────────────────────────────────────
  'playbar.pause':               'Pause',
  'playbar.resume':              'Resume',
  'playbar.audioUnavailable':    'Audio couldn\'t start — try again, or restart the app if this keeps happening.',

  // ── LEAD-SHEET EDIT MODE (toolbar, header fields, per-bar menu) ────────
  'lsEdit.style':                     'Style',
  'lsEdit.customEllipsis':            'Custom…',
  'lsEdit.customStylePlaceholder':    'Custom style name',
  'lsEdit.composerArtistPlaceholder': 'Composer / artist',
  'lsEdit.transposeDownTitle':        'Move every chord in this chart down a semitone (permanent)',
  'lsEdit.transposeUpTitle':          'Move every chord in this chart up a semitone (permanent)',
  'lsEdit.downloadMsleadTitle':       'Download this lead sheet as a .mslead file',
  'lsEdit.irealUrlBtn':               '🔗 iReal URL',
  'lsEdit.irealUrlTitle':             'Copy this lead sheet as an irealb:// URL (re-importable here or in iReal Pro)',
  'lsEdit.copied':                    '✓ Copied',
  'lsEdit.publishLeadSheetTitle':     'Publish this lead sheet to the online library',
  'lsEdit.collaborateLeadSheetTitle': 'Start or manage a live collaboration on this lead sheet',
  'lsEdit.chordViewBracketsTitle':    'Showing chords inline in [brackets] — click to float them above the words instead',
  'lsEdit.barOptionsTitle':           'Bar options (barlines, time signature, insert/delete…)',
  'lsEdit.setTimeSig':                'Set time sig',
  'lsEdit.timeColon':                 'Time: {v}',
  'lsEdit.setTimeSigModalTitle':      'Set time signature',
  'lsEdit.setSection':                'Set section',
  'lsEdit.sectionColon':              'Section: {v}',
  'lsEdit.setSectionModalTitle':      'Set section marker',
  'lsEdit.sectionLabelField':         'Section label',
  'lsEdit.setEnding':                 'Set ending',
  'lsEdit.endingColon':               'Ending: {v}',
  'lsEdit.setEndingModalTitle':       'Set ending number',
  'lsEdit.endingField':               'Ending (e.g. 1, 2)',
  'lsEdit.openRepeat':                'Open repeat',
  'lsEdit.openRepeatOn':              '✓ Open repeat',
  'lsEdit.closeRepeat':               'Close repeat',
  'lsEdit.closeRepeatOn':             '✓ Close repeat',
  'lsEdit.doubleBarEnd':              'Double barline (end)',
  'lsEdit.doubleBarEndOn':            '✓ Double barline (end)',
  'lsEdit.doubleBarStart':            'Double barline (start)',
  'lsEdit.doubleBarStartOn':          '✓ Double barline (start)',
  'lsEdit.finalBarline':              'Final barline',
  'lsEdit.finalBarlineOn':            '✓ Final barline',
  'lsEdit.insertBarBefore':           'Insert bar before',
  'lsEdit.insertBarAfter':            'Insert bar after',
  'lsEdit.insertBarsModalTitle':      'Insert how many bars?',
  'lsEdit.insertBarsCountField':      'Number of bars',
  'lsEdit.deleteBar':                 'Delete bar',

  // ── COLLECTIONS (submenu list content) ──────────────────────────────────
  'collections.communityDesc':          'Collections shared by other Magic Scroll users.',
  'collections.requiresHttp':           'Collections require an HTTP server.',
  'collections.noBuiltin':              'No built-in collections available.',
  'collections.manifestLoadFailed':     'Could not load collections manifest.',
  'collections.communityNotConfigured': 'Community library not configured for this build.',
  'collections.noMatching':             'No matching collections.',
  'collections.noneYet':                'No community collections yet — be the first to publish one!',
  'collections.communityUnreachable':   'Could not reach the community library.',
  'collections.unnamed':                'Unnamed',
  'collections.songCount':              '{n} songs',
  'collections.songCountOne':           '{n} song',
  'collections.contains':               'Contains: {list}',
  'collections.moreCount':              ' +{n} more',
  'collections.add':                    '+ Add',
  'collections.adding':                 'Adding…',
  'collections.added':                  '✓ Added',
  'collections.addedCount':             '✓ Added ({n})',
  'collections.alreadyInLibrary':       'Already in library',
  'collections.failed':                 'Failed',
  'collections.defaultFolderName':      'Collection',

  // ── SHARE (native share-sheet, toolbar + kebab menu) ────────────────────
  'share.button':                'Share…',
  'share.buttonTitle':           'Share this with another app',
  'share.defaultMessage':        "I'm sharing a bit of music via Magic Scroll!",
  'share.fallbackDownloaded':    'Downloaded {filename} (share not available on this device)',
  'download.toast':              'Downloaded: {filename}',

  // ── MULTI-PART SHEET MUSIC (MuseScore/MusicXML imports with >1 instrument) ─
  'sheetmusic.partFallback':     'Part {n}',

  // ── INSTRUMENT CATEGORIES (Chord Diagrams instrument tabs) ──────────────
  // The category half of each "Category: Tuning" <option> in the instrument
  // pickers (see applyInstrumentCategoryI18n) — keyed by the <select>'s own
  // data-family attribute, which is already a clean English slug, so no
  // separate word→key lookup is needed. The tuning half (DADGAD, Open G,
  // Cross-tuned GDGD, ...) is deliberately left untranslated in every
  // language — those are internationally-recognised tuning names, not really
  // translatable the way "Guitar" or "Banjo" are.
  'instCat.guitar':              'Guitar',
  'instCat.ukulele':             'Ukulele',
  'instCat.banjo':                'Banjo',
  'instCat.mandolin':            'Mandolin',
  'instCat.folk':                'Folk',
  'instCat.concertina':          'Concertina',
  'instCat.melodeon':            'Melodeon',
  'instCat.piano':                'Piano',
};

// ── Active language ──────────────────────────────────────────────────────
// 'en', 'zh', or 'fr', persisted so the choice survives a reload. Read once
// at load; setLanguage() below is the only thing that should change it after.
window.MS_LANG = (function() {
  try { return localStorage.getItem('ug_lang') || 'en'; } catch (e) { return 'en'; }
})();
function _activeDict() {
  if (window.MS_LANG === 'zh' && window.MS_STRINGS_ZH) return window.MS_STRINGS_ZH;
  if (window.MS_LANG === 'fr' && window.MS_STRINGS_FR) return window.MS_STRINGS_FR;
  return window.MS_STRINGS_EN;
}

// ── Lookup helper ────────────────────────────────────────────────────────
// t('some.key') returns the string; t('some.key', {name: 'X', count: 3})
// substitutes {name}/{count}/... placeholders inside it. Missing key in the
// active (non-English) dictionary falls back to English rather than raw key
// text, so a partially-translated language still reads as real copy
// everywhere except the specific strings not yet translated. Missing key in
// English too (a genuine typo, or strings-en.js failed to load) falls back
// to the key itself, so that failure is loud instead of silent.
window.t = function t(key, vars) {
  var dict = _activeDict();
  var s = (dict && dict[key] !== undefined) ? dict[key]
    : (window.MS_STRINGS_EN && window.MS_STRINGS_EN[key] !== undefined) ? window.MS_STRINGS_EN[key]
    : key;
  if (vars) {
    Object.keys(vars).forEach(function(k) {
      s = s.split('{' + k + '}').join(vars[k]);
    });
  }
  return s;
};

// ── Language switch ──────────────────────────────────────────────────────
// Changes the active dictionary, persists the choice, and re-applies every
// data-i18n/-title/-placeholder element on the page. Does NOT retroactively
// fix already-built dynamic text (see the file header comment) — that
// catches up the next time whatever built it runs again.
window.setLanguage = function setLanguage(lang) {
  window.MS_LANG = lang;
  try { localStorage.setItem('ug_lang', lang); } catch (e) {}
  // Keep the page's declared language in sync with what's actually
  // displayed (WCAG 3.1.1 Language of Page) — screen readers use this to
  // pick the right pronunciation/voice, and it was left at the initial
  // hard-coded "en" from <html lang="en"> even after switching to zh/fr.
  if (typeof document !== 'undefined' && document.documentElement) document.documentElement.lang = lang;
  if (typeof applyI18nStrings === 'function') applyI18nStrings();
  // Fixes up stateful toggle-button labels (Edit/Save, Scroll/Stop, ...) and
  // re-measures cached layout CSS vars that a text-width/height change can
  // invalidate — see this hook's own comment in the main HTML file for why.
  if (typeof window._afterLanguageSwitch === 'function') window._afterLanguageSwitch();
};

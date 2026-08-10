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
 * `window.MS_STRINGS` older versions used) so a second dictionary —
 * `window.MS_STRINGS_ZH` (see strings-zh.js), loaded via its own
 * `<script src="strings-zh.js">` tag right after this one — can sit
 * alongside it without either file overwriting the other. `window.MS_LANG`
 * ('en' or 'zh', persisted in localStorage as `ug_lang`) picks which one
 * `t()` actually reads from; `window.setLanguage(lang)` (defined below)
 * changes it and re-applies every `data-i18n*` element on the page. A
 * missing key in a non-English dictionary silently falls back to the
 * English string rather than showing raw key text, so a partially-
 * translated language degrades gracefully instead of looking broken.
 * Adding a third language is the same shape: a new strings-<lang>.js
 * defining `window.MS_STRINGS_<LANG>`, a case in `_activeDict()` below, a
 * `<script src>` tag for it, and an `<option>` in the `#lang-sel` dropdown.
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
  'topbar.library':            '☰ Library',
  'topbar.chords':             '🎵 Chords',
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
  'topbar.scroll':              '▶︎ Scroll',
  'topbar.scrollStop':          '■ Stop',

  // ── SIDEBAR ────────────────────────────────────────────────────────────
  'sidebar.searchPlaceholder':  'Search…',
  'sidebar.multiselectTitle':   'Select multiple songs',
  'sidebar.filterTitle':        'Filter by type',

  // ── SONG/CHORD-SHEET EDITOR ────────────────────────────────────────────
  'editor.addChords':           '🎯 Add Chords',
  'editor.addChordsTitle':      'Tag chords to exact words/syllables instead of aligning them by hand',
  'editor.bold':                'Bold (**text**)',
  'editor.italic':              'Italic (*text*)',
  'editor.underline':           'Underline (_text_)',
  'editor.embed':               '⧉ Embed…',
  'editor.embedTitle':          'Embed a video or link',
  'editor.precisionHint':       'Click on the word (or the spot) where you want a chord, then type it into the box that appears. Click an existing chord to edit or remove it.',
  'editor.editToggle':          '✎ Edit',
  'editor.editToggleTitle':     'Toggle between edit and read mode',
  'editor.cancel':              '✕ Cancel',
  'editor.cancelTitle':         'Discard all changes made since entering edit mode',
  'editor.save':                '💾 Save',
  'editor.saveTitle':           'Save changes to this song (Ctrl+S)',
  'editor.saveAs':              '⬇ Save As…',
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

  // ── ABC SHEET-MUSIC EDITOR ─────────────────────────────────────────────
  'editor.abcHint': 'Editing raw ABC notation — notes are letters A-G (lowercase = higher octave; add \' after a note for another octave up, or , for an octave down); a number after a note changes its length (C2 = twice as long, C/2 = half); | marks a bar line. Chord symbols go in quotes above the note they fall on, e.g. "G7". K: sets the key, M: sets the meter, Q: sets the tempo.',

  // ── ADD-CHORDS PRECISION POPUP ──────────────────────────────────────────
  'precision.chordInputPlaceholder': 'Chord, e.g. Am7',

  // ── CREATE SET MODAL ────────────────────────────────────────────────────
  'createSet.searchPlaceholder': 'Search tunes or type (jig, reel, waltz…)',

  // ── NEW SONG MODAL ───────────────────────────────────────────────────────
  'newSong.abcPlaceholder':   'X:1\nT:My Tune\nC:Composer\nM:4/4\nL:1/8\nK:G\n...',
  'newSong.irealPlaceholder': 'irealb://SongTitle%3DComposer%3D%3DStyle%3DKey...',

  // ── COMMUNITY COLLECTIONS ────────────────────────────────────────────────
  'collections.searchPlaceholder': 'Search community collections…',

  // ── COLLABORATION ─────────────────────────────────────────────────────────
  'collab.namePlaceholder': 'Your name',
  'collab.codePlaceholder': 'ABCDEF',

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
};

// ── Active language ──────────────────────────────────────────────────────
// 'en' or 'zh', persisted so the choice survives a reload. Read once at
// load; setLanguage() below is the only thing that should change it after.
window.MS_LANG = (function() {
  try { return localStorage.getItem('ug_lang') || 'en'; } catch (e) { return 'en'; }
})();
function _activeDict() {
  if (window.MS_LANG === 'zh' && window.MS_STRINGS_ZH) return window.MS_STRINGS_ZH;
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
  if (typeof applyI18nStrings === 'function') applyI18nStrings();
};

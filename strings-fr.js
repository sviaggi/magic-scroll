/**
 * strings-fr.js — Magic Scroll user-facing text (French / Français).
 *
 * Same keys as strings-en.js, translated. See that file's header comment for
 * how this is wired in (window.MS_STRINGS_FR, window.setLanguage(), the
 * #lang-sel dropdown in Options). A key missing here silently falls back to
 * the English string via t()'s lookup, so this file can be a partial
 * translation without anything looking broken — it just isn't, currently:
 * every key in strings-en.js has a translation below as of this pass.
 *
 * {name}/{count}/{filename}/{message}/{title}/{plural} tokens are left
 * exactly as-is — t() substitutes them at runtime regardless of language, so
 * they must appear verbatim (same spelling, same braces) in each dictionary.
 */
window.MS_STRINGS_FR = {

  // ── TOPBAR ─────────────────────────────────────────────────────────────
  'topbar.library':            '☰',
  'topbar.libraryTitle':       'Bibliothèque',
  'topbar.chords':              '🎵',
  'topbar.chordsTitle':         'Tonalité, accords et outils d\'entraînement auditif',
  'topbar.chordsLabel':         'Accords',
  'topbar.key':                 'Tonalité',
  'topbar.transposeDown':      'Transposer d\'un demi-ton vers le bas',
  'topbar.transposeUp':        'Transposer d\'un demi-ton vers le haut',
  'topbar.transposeReset':     'Revenir à la tonalité d\'origine',
  'topbar.simplifyChords':     'Simplifier les accords',
  'topbar.simplifyChordsTitle':'Simplifier tous les accords sous leur forme de base',
  'topbar.size':                'Taille',
  'topbar.lineSpacing':         'Interligne',
  'topbar.lineSpacingTitle':    'Interligne du texte des chansons et des grilles',
  'topbar.themes':              'Thèmes',
  'topbar.themesTitle':         'Personnaliser le thème, les couleurs, les polices et le fond',
  'topbar.scroll':              '▶︎',
  'topbar.scrollTitle':         'Défilement',
  'topbar.scrollStop':          '■',
  'topbar.scrollStopLabel':     'Arrêter',

  // ── SIDEBAR ────────────────────────────────────────────────────────────
  'sidebar.searchPlaceholder':  'Rechercher…',
  'sidebar.multiselectTitle':   'Sélectionner plusieurs chansons',
  'sidebar.filterTitle':        'Filtrer par type',
  'toast.songLoaded':           '{title} chargée',

  // ── SONG/CHORD-SHEET EDITOR ────────────────────────────────────────────
  'editor.addChords':           '🎯 Ajouter des accords',
  'editor.addChordsTitle':      'Associer les accords aux mots ou syllabes exacts au lieu de les aligner à la main',
  'editor.bold':                'Gras (**texte**)',
  'editor.italic':              'Italique (*texte*)',
  'editor.underline':           'Souligné (_texte_)',
  'editor.embed':               '⧉ Intégrer…',
  'editor.embedTitle':          'Intégrer une vidéo ou un lien',
  'editor.precisionHint':       'Cliquez sur le mot (ou l\'endroit) où vous voulez un accord, puis saisissez-le dans la zone qui apparaît. Cliquez sur un accord existant pour le modifier ou le supprimer.',
  'editor.tabWrite':            '🎸 Tablature',
  'editor.tabWriteTitle':       "Tabuler un solo/riff selon l'accordage de l'instrument principal actuel — saisissez directement les numéros de case, les cordes s'alignent automatiquement",
  'editor.tabWriteHint':        'Cliquez sur la ligne d\'une corde, puis saisissez des numéros de case — les autres cordes se complètent automatiquement. Cliquez plus tôt dans la ligne pour ajouter une double corde sans perturber la suite. Maintenez Maj. pour coller un second chiffre (cases 10+) ou la case cible après une marque h/p/b/glissé. Espace = silence, Entrée = nouvelle ligne, Échap ou le bouton de nouveau pour terminer.',
  'editor.editToggle':          '✎ Modifier',
  'editor.editToggleActive':    '✎ Enregistrer',
  'editor.editToggleTitle':     'Basculer entre le mode lecture et le mode édition',
  'editor.cancel':              '✕ Annuler',
  'editor.cancelTitle':         'Annuler toutes les modifications effectuées depuis l\'entrée en mode édition',
  'editor.save':                '📤 Partager',
  'editor.saveTitle':           'Enregistrer les modifications de cette chanson (Ctrl+S)',
  'editor.saveAs':              '💾 Enregistrer sous…',
  'editor.publish':             '☁ Publier',
  'editor.exportMonospace':     '⬇ Exporter en police fixe',
  // Placeholder / example text shown inside empty fields — these are what a
  // user sees BEFORE they've typed anything, so they need translating same
  // as any other visible copy.
  'editor.titlePlaceholder':    'Titre de la chanson',
  'editor.artistPlaceholder':   'Nom de l\'artiste',
  'editor.keyPlaceholder':      'ex. Am',
  'editor.timeSigPlaceholder':  'ex. 4/4',
  // Unlike the rest of this file, this one is deliberately NOT a literal
  // translation of the English placeholder — it's a demo SONG, so it should
  // read like one. Rewritten to actually rhyme in French (a loose monorhyme
  // quatrain on -ant/-emps for the verse, an -eau/-oût/-out near-rhyme for
  // the chorus) rather than translating the English rhymes word-for-word,
  // which wouldn't have rhymed at all in French. The chord-tag mechanics
  // ([G]/[D] precision tags, and the classic two-line chord-row example)
  // are kept byte-for-byte functional — only the surrounding words changed.
  'editor.songPlaceholder': 'Collez ou tapez votre chanson ici.\n\n[Couplet]\nÉcrivez vos mots, prenez votre temps,\nPas de colonnes ni de réglages gênants,\nCliquez « Ajouter des accords », au bon moment,\nSur les mots, sur l\'espace, sur tout, à chaque instant,\n\n[Refrain]\n[G]Comme ça, un accord [D] ou un rythme, comme il te faut[D]\nC                                D                                      Em                     G\nÇa se met en forme toute seule, tu ne trouves pas ça beau ?\nC\'est rapide, simple et gratuit, il n\'y a pas de coût,\nAmuse-toi bien avec ton Magic Scroll partout !',

  // ── LEAD-SHEET EDITOR ──────────────────────────────────────────────────
  'editor.lsHint': 'Édition — modifiez le titre, l\'auteur, le style, le BPM et la signature rythmique ci-dessus ; cliquez sur une mesure pour changer ses accords, ou utilisez son menu ⋮ pour les barres de mesure, les changements de rythme en cours de morceau, les sections et l\'insertion/suppression de mesures. '
    + 'Abréviations d\'accords : b/# pour bémol/dièse (Bb, F#) · m ou - pour mineur (Dm) · maj7 ou ^ pour majeur 7 (Cmaj7) · 7 pour septième de dominante (G7) · sus2/sus4 pour suspendu · dim ou o pour diminué · aug ou + pour augmenté — ex. F#m7b5, Bbmaj7, Caug.',
  'editor.lsEditToggleTitle':       'Modifier cette grille',
  'editor.lsEditToggleTitleActive': 'Enregistrer les modifications et quitter le mode édition',

  // ── ABC SHEET-MUSIC EDITOR ─────────────────────────────────────────────
  'editor.abcHint': 'Édition de la notation ABC brute — les notes sont des lettres A-G (minuscule = octave supérieure ; ajoutez \' après une note pour monter d\'une octave, ou , pour descendre d\'une octave) ; un chiffre après une note change sa durée (C2 = deux fois plus longue, C/2 = moitié moins). | marque une barre de mesure. Les symboles d\'accords se placent entre guillemets au-dessus de la note correspondante, ex. "G7". K: définit la tonalité, M: la mesure, Q: le tempo.',

  // ── ADD-CHORDS PRECISION POPUP ──────────────────────────────────────────
  'precision.chordInputPlaceholder': 'Accord, ex. Am7',

  // ── CREATE SET MODAL ────────────────────────────────────────────────────
  'createSet.searchPlaceholder': 'Rechercher un morceau ou un type (gigue, reel, valse…)',

  // ── NEW SONG MODAL ───────────────────────────────────────────────────────
  'newSong.abcPlaceholder':   'X:1\nT:Mon morceau\nC:Compositeur\nM:4/4\nL:1/8\nK:G\n...',
  'newSong.irealPlaceholder': 'irealb://TitreDeLaChanson%3DCompositeur%3D%3DStyle%3DTonalité...',

  // ── SEARCH ───────────────────────────────────────────────────────────────
  // Shown in a search-result snippet in place of a [yt:…]/[video:…] tag —
  // a truncated one-line snippet has no room for a real video embed/link.
  'search.videoLabel': 'Vidéo',

  // ── COMMUNITY COLLECTIONS ────────────────────────────────────────────────
  'collections.searchPlaceholder': 'Rechercher des collections communautaires…',

  // ── COLLABORATION ─────────────────────────────────────────────────────────
  'collab.namePlaceholder': 'Votre nom',
  'collab.codePlaceholder': 'ABCDEF',

  // ── PLAYBACK BARS (ABC sheet-music player + lead-sheet backing track) ───
  'playbar.play':                 'Lecture',
  'playbar.stop':                 'Arrêter',
  'playbar.playPause':            'Lecture / Pause',
  'playbar.stopReturn':           'Arrêter et revenir au début',
  'playbar.bpm':                  'BPM',
  'playbar.meter':                'Mesure',
  'playbar.meterAuto':            'N/D',
  'playbar.meterTitle':           'Mesure — N/D suit la partition (et ses changements de mesure éventuels) ; choisissez une valeur pour imposer une mesure fixe',
  'playbar.plays':                'Lectures',
  'playbar.playsTitle':           'Nombre de fois où jouer la grille',
  'playbar.bar':                  'Mesure {n}',
  'playbar.mute':                 'Couper {inst}',
  'playbar.unmute':               'Réactiver {inst}',
  'playbar.perInstSettings':      'Réglages par instrument',
  'playbar.loading':              'Chargement…',
  'playbar.openLeadSheetToUse':   'Ouvrez une grille pour utiliser la piste d\'accompagnement',
  'playbar.noChordData':          'Aucune donnée d\'accords dans cette grille',
  'playbar.instDrums':            'Batterie',
  'playbar.instKeys':             'Clavier',
  'playbar.instBass':             'Basse',
  'playbar.instGuitar':           'Guitare',

  // ── CHORD DIAGRAMS ─────────────────────────────────────────────────────
  'diagrams.fabTitle':          'Diagrammes d\'accords',

  // ── OPTIONS PANEL ──────────────────────────────────────────────────────
  'options.language':           'Langue',
  'options.languageTitle':      'Changer la langue d\'affichage de l\'application',

  // ── EMPTY STATE ────────────────────────────────────────────────────────
  'emptyState.title':           'Aucune chanson chargée',

  // ── ALERTS (window.alert — informational; no user choice) ─────────────
  'alert.themeSaved':                 'Thème « {name} » enregistré !',
  'alert.noCustomThemes':             'Aucun thème personnalisé enregistré — utilisez d\'abord « Enregistrer comme thème », puis exportez.',
  'alert.invalidThemeFile':           'Ce fichier n\'est pas un JSON de thème valide.',
  'alert.noThemesInFile':             'Aucun thème trouvé dans ce fichier.',
  'alert.themesImported':             '{count} thème{plural} importé{plural}.',
  'alert.fontLoadFailed':             'Impossible de charger ce fichier de police : {filename}',
  'alert.jsonError':                  'Erreur JSON : {message}',
  'alert.invalidConfigFile':          'Ce n\'est pas un fichier de configuration Magic Scroll valide.',
  'alert.configParseError':           'Impossible d\'analyser le fichier de configuration :\n{message}',
  'alert.mxlExtractFailed':           'Impossible d\'extraire le XML du fichier .mxl',
  'alert.musicXmlParseFailed':        'Impossible d\'analyser le MusicXML dans {filename}',
  'alert.mxlReadError':               'Erreur de lecture du .mxl : {message}',
  'alert.msczExtractFailed':          'Impossible d\'extraire la partition de {filename}',
  'alert.museScoreParseFailed':       'Impossible d\'analyser le fichier MuseScore {filename}',
  'alert.msczReadError':              'Erreur de lecture du .mscz : {message}',
  'alert.midiParseFailed':            'Impossible d\'analyser le MIDI : {filename}',
  'alert.jsonParseError':             'Erreur d\'analyse JSON :\n{message}',
  'alert.simplifyPlainTextOnly':      'La simplification ne fonctionne que sur les chansons en texte brut.',
  'alert.editPlainTextOnly':          'Le mode édition ne fonctionne que sur les chansons en texte brut.',
  'alert.exportMonospacePlainTextOnly': 'L\'export en police fixe ne fonctionne que sur les grilles d\'accords en texte brut.',
  'alert.printFailed':                'Échec de l\'impression : {message}',
  'alert.printPopupBlocked':          'Impossible d\'ouvrir l\'aperçu d\'impression. Merci d\'autoriser les fenêtres pop-up, ou d\'utiliser Imprimer / Enregistrer en PDF de votre navigateur.',
  'alert.noSongLoaded':               'Aucune chanson chargée.',
  'alert.openLeadSheetFirst':         'Ouvrez d\'abord la grille.',
  'alert.irealUrlFailed':             'Impossible de générer l\'URL iReal : {message}',
  'alert.collabPlainTextOrLeadSheetOnly': 'La collaboration ne fonctionne que sur les chansons en texte brut et les grilles.',
  'alert.collabConnectFailed':        'La collaboration nécessite une connexion internet et la connexion a échoué. Vérifiez votre connexion et réessayez.',
  'alert.collabHostOnlyEnd':          'Seul l\'hôte peut mettre fin à cette collaboration.',

  // ── CONFIRMS (window.confirm — Yes/No before a destructive action) ────
  'confirm.deleteTheme':              'Supprimer le thème « {name} » ?',
  'confirm.resetColours':             'Réinitialiser les couleurs par défaut ?',
  'confirm.resetFonts':               'Réinitialiser les polices par défaut ?',
  'confirm.deleteFolder':             'Supprimer le dossier « {name} » ? Les chansons restent, seul le dossier est supprimé.',
  'confirm.deleteFolderAndSongs':     'Supprimer le dossier « {name} » ET les {count} chanson{plural} qu\'il contient ? Cette action est irréversible.',
  'confirm.deleteEmptyFolder':        'Supprimer le dossier « {name} » ? Il ne contient aucune chanson.',
  'confirm.removeSong':               'Retirer « {title} » ?',
  'confirm.deleteSongs':              'Supprimer {count} chanson(s) ?',
  'confirm.endCollab':                'Mettre fin à cette collaboration pour tout le monde ? Le contenu actuel sera enregistré définitivement pour tous les participants.',

  // ── PROMPTS (window.prompt — asks the user to type something) ─────────
  'prompt.saveThemeName':             'Nom du thème à enregistrer :',
  'prompt.importedThemeName':         'Nom pour ce thème importé :',
  'prompt.renameSong':                'Renommer :',
  'prompt.newFolderName':             'Nom du nouveau dossier :',
  'prompt.renameFolder':              'Renommer le dossier :',
  'prompt.folderName':                'Nom du dossier :',
  'prompt.embedLink':                 'Collez un lien à intégrer (vidéo YouTube, ou tout autre lien web) :',
  'prompt.embedLinkText':             'Texte du lien (optionnel) :',
  'prompt.copyIrealUrl':              'Copiez cette URL irealb:// :',

  // ── TOPBAR (additional) ─────────────────────────────────────────────────
  'topbar.options':             '⚙',
  'topbar.optionsTitle':        'Taille, thème et impression',
  'topbar.optionsLabel':        'Options',
  'topbar.scrollLabel':         'Défilement',
  'topbar.scrollSpeedTitle':    'Vitesse de défilement',
  'topbar.detectedKeyTitle':    'Tonalité détectée — cliquez sur ♭/♯ pour transposer',
  'topbar.detectedKeyCapoTitle': 'Ce morceau se joue avec les positions d\'accords de {shapeKey}, capodastre sur la case {fret}, ce qui le transpose vers {soundingKey}.',
  'topbar.collapseLabel':       '▲ masquer',
  'topbar.collapseTitle':       'Masquer les commandes (cliquez sur la bande ▼ pour les restaurer)',
  'topbar.restoreTitle':        'Afficher les commandes (touchez pour restaurer)',

  // ── SIDEBAR (additional) ────────────────────────────────────────────────
  'sidebar.libraryHeader':      'Bibliothèque',
  'sidebar.emptyLibrary':       '🗑 Vider la bibliothèque',
  'sidebar.clearSearchTitle':   'Effacer la recherche',
  'sidebar.onlineSearchOn':     'Recherche en ligne activée — cliquez pour désactiver',
  'sidebar.onlineSearchOff':    'Recherche en ligne désactivée — cliquez pour activer',
  'sidebar.previousSong':       '◀ Chanson précédente',
  'sidebar.previousSongTitle':  'Revenir à la chanson précédente',
  'sidebar.noPreviousSong':     'Aucune chanson précédente.',
  'sidebar.untitled':           'Sans titre',
  'sidebar.selectRandom':       '🎲 Chanson aléatoire',
  'sidebar.selectRandomTitle':  'Ouvrir une chanson aléatoire de votre bibliothèque',
  'sidebar.joinCollab':         '🔗 Rejoindre une collaboration…',
  'sidebar.joinCollab2':        'Rejoindre la collaboration',
  'sidebar.joinCollabTitle':    'Rejoindre une collaboration en direct avec un code partagé par quelqu\'un',
  'sidebar.nSelected':          '{n} sélectionnée(s)',
  'sidebar.bulkSelectAllTitle': 'Sélectionner toutes les chansons visibles',
  'sidebar.bulkPublishTitle':   'Publier les chansons sélectionnées dans la bibliothèque en ligne',
  'sidebar.folder':             '📁 Dossier',
  'sidebar.bulkFolderTitle':    'Déplacer la sélection vers un dossier',
  'sidebar.bulkDelete':         '✕ Supprimer',
  'sidebar.bulkDeleteTitle':    'Supprimer la sélection',
  'sidebar.cancel':             'Annuler',
  'sidebar.bulkCancelTitle':    'Annuler la sélection',
  'sidebar.openFilesHere':      'Ouvrir des fichiers ici',
  'sidebar.new':                '✦ Nouveau',
  'sidebar.newTitle':           'Créer une nouvelle chanson vierge',
  'sidebar.newFolderTitle':     'Créer un nouveau dossier pour organiser vos chansons',
  'sidebar.exportLibrary':      'Exporter la bibliothèque',
  'sidebar.exportLibraryTitle': 'Enregistrer la bibliothèque dans un fichier · Maj+clic pour Enregistrer sous',
  'sidebar.collections':        '📦 Collections',
  'sidebar.collectionsTitle':   'Parcourir et ajouter des collections de chansons',
  'sidebar.resizeHandleTitle':  'Faire glisser pour redimensionner la barre latérale',

  // ── FILTER PANEL ─────────────────────────────────────────────────────────
  'filter.all':                 'Tout',
  'filter.allTitle':            'Afficher tous les types',
  'filter.none':                'Aucun',
  'filter.noneTitle':           'Masquer tous les types',
  'filter.unspecified':         '(Non précisé)',
  'filter.libraryEmpty':        'La bibliothèque est vide',
  'filter.catChords':           'Accords',
  'filter.catTabs':             'Tablatures',
  'filter.catSheetMusic':       'Partitions',
  'filter.catLeadSheets':       'Grilles',
  'sidebar.randomNoMatch':      'Aucune chanson ne correspond au filtre actuel.',

  // ── EMPTY STATE (additional) ────────────────────────────────────────────
  'emptyState.body':            'Déposez des fichiers .txt, .json ou .html dans la barre latérale, ou cliquez sur <strong>✦ Nouvelle chanson</strong> pour en écrire une.',

  // ── SONG/CHORD-SHEET EDITOR (additional) ────────────────────────────────
  'editor.titleLabel':          'Titre',
  'editor.artistLabel':         'Artiste',
  'editor.keyLabel':            'Tonalité',
  'editor.timeSigLabel':        'Signature ryth.',
  'editor.transpose':           'Transposer',
  'editor.transposeDownTitle':  'Descendre tous les accords du texte d\'un demi-ton (définitif)',
  'editor.transposeUpTitle':    'Monter tous les accords du texte d\'un demi-ton (définitif)',
  'editor.transposeDownAbcTitle': 'Descendre toutes les notes de ce morceau d\'un demi-ton (définitif) — met à jour K: et les hauteurs des notes',
  'editor.transposeUpAbcTitle':   'Monter toutes les notes de ce morceau d\'un demi-ton (définitif) — met à jour K: et les hauteurs des notes',
  'editor.saveMenu':            '📤 Partager ▾',
  'editor.publish2':            'Publier',

  // ── PRECISION POPUP (additional) ────────────────────────────────────────
  'precision.add':              'Ajouter',
  'precision.remove':           'Supprimer',

  // ── TOOLBARS (song/lead-sheet/ABC shared chrome) ────────────────────────
  'toolbar.saveOptionsTitle':          'Options de partage',
  'toolbar.publishSheetMusicTitle':    'Publier cette partition dans la bibliothèque en ligne',
  'toolbar.createSet':                 '⛓ Créer un enchaînement',
  'toolbar.createSetTitle':            'Empiler d\'autres morceaux de votre bibliothèque à la suite de celui-ci pour créer un enchaînement',

  // ── TRANSCRIBE AUDIO (BETA) ───────────────────────────────────────────────
  'transcribe.button':                 '🎙 Transcrire (bêta)',
  'transcribe.buttonTitle':            'Transformer un enregistrement ou un fichier audio en mélodie brouillon à corriger — fonctionnalité expérimentale, attendez-vous à des erreurs',
  'transcribe.modalTitle':             'Transcrire l\'audio (bêta)',
  'transcribe.disclaimer':             'Expérimental : la hauteur et le rythme sont des estimations approximatives d\'un algorithme simple, pas un vrai moteur de transcription. Fonctionne mieux avec un seul instrument mélodique ou une voix claire, sans accompagnement. Considérez le résultat comme un point de départ à corriger — vérifiez et corrigez toujours les notes produites avant de les utiliser.',
  'transcribe.orLabel':                'ou',
  'transcribe.startRecording':         '● Démarrer l\'enregistrement',
  'transcribe.stopRecording':          '■ Arrêter l\'enregistrement',
  'transcribe.recording':              'Enregistrement…',
  'transcribe.chooseFile':             '📂 Choisir un fichier audio…',
  'transcribe.analyzing':              'Analyse de l\'audio…',
  'transcribe.noPitchFound':           'Impossible de détecter des notes claires dans cet audio — essayez un enregistrement plus net, avec un seul instrument ou une seule voix.',
  'transcribe.micDenied':              'Accès au microphone refusé ou indisponible.',
  'transcribe.decodeError':            'Impossible de lire ce fichier audio.',
  'transcribe.insertedComment':        'Transcription bêta — la hauteur et le rythme sont des estimations approximatives ; vérifiez et corrigez avant utilisation.',
  'transcribe.insertedToast':          '{n} notes transcrites insérées (tonalité devinée : {key}) — à vérifier avant utilisation.',
  'toolbar.sheetMusicMenu':            '🎼 Partition ▾',
  'toolbar.sheetMusicOptionsTitle':    'Options de la partition',
  'toolbar.soundfont':                 '🎵 Banque de sons',
  'toolbar.soundfontTitle':            'Charger une banque de sons SF2 ou SFZ',
  'toolbar.unloadSoundfont':           '✕ Décharger la banque de sons',
  'toolbar.unloadSoundfontTitle':      'Décharger la banque de sons (revenir au son par défaut)',
  'toolbar.whistleTabs':               '🪈 Tablatures de tin whistle',
  'toolbar.whistleTabsTitle':          'Afficher/masquer les diagrammes de doigté du tin whistle',
  'toolbar.whistleKeyTitle':           'Tonalité du tin whistle',
  'toolbar.whistleD':                  'Tin whistle en Ré',
  'toolbar.whistleC':                  'Tin whistle en Do',
  'toolbar.whistleG':                  'Tin whistle en Sol',
  'toolbar.whistleBb':                 'Tin whistle en Sib',
  'toolbar.whistleEb':                 'Tin whistle en Mib',
  'toolbar.hideChords':                '🎼 Masquer les accords',
  'toolbar.hideChordsTitle':           'Masquer les symboles d\'accords indiqués dans ce fichier ABC',
  'toolbar.noteNames':                 '🔤 Noms des notes',
  'toolbar.noteNamesTitle':            'Afficher le nom de la note sous chaque note',
  'toolbar.collaborate':               '🔗 Collaborer',
  'toolbar.collaborateTitle':          'Démarrer ou gérer une collaboration en direct sur cette chanson',
  'toolbar.chordView':                 '≡ Condensé',
  'toolbar.chordViewTitle':            'Les accords flottent au-dessus de chaque mot — cliquez pour les afficher en ligne entre [crochets] à la place (plus compact)',

  // ── CHORD DIAGRAMS PANEL ─────────────────────────────────────────────────
  'diagrams.title':              'Diagrammes d\'accords',
  'diagrams.smallerTitle':       'Diagrammes plus petits (affecte aussi le texte)',
  'diagrams.largerTitle':        'Diagrammes plus grands (affecte aussi le texte)',
  'diagrams.closeTitle':         'Fermer les diagrammes d\'accords',
  'diagrams.primaryInstrument':  'Instrument principal',
  'diagrams.secondaryInstrument':'Instrument secondaire',
  'diagrams.capo':               'Capo',
  'diagrams.capoTitle':          'Capo / pré-transposition de cet instrument (−11 à 11) : indique la position à jouer pour retrouver l\'accord affiché',
  'diagrams.customBtn':          '⚙ Personnalisé…',
  'diagrams.customTitle':        'Définir votre propre instrument et accordage',
  'diagrams.none':               'Aucun',
  'diagrams.hideTitle':          'Masquer les diagrammes d\'accords',
  'diagrams.customInstrumentTitle': '⚙ Instrument personnalisé',
  'diagrams.customHint':         'Choisissez le nombre de cordes (1 à 8) et l\'accordage de chacune, de la plus grave à la plus aiguë. Les diagrammes d\'accords sont calculés pour cet accordage.',
  'diagrams.strings':            'Cordes',
  'diagrams.useInstrument':      'Utiliser cet instrument',
  'diagrams.chordsInSong':       'Accords de cette chanson',

  // ── CREATE SET MODAL (additional) ───────────────────────────────────────
  'createSet.hint':              'Cochez les morceaux à empiler sur la page. Ils apparaissent dans l\'ordre où vous les sélectionnez — cet ordre est indiqué ci-dessous.',
  'createSet.filterTypeTitle':   'Filtrer par type de morceau',
  'createSet.allTypes':          'Tous les types',
  'createSet.noMatch':           'Aucun morceau ne correspond à cette recherche / ce type.',
  'createSet.showSet':           'Afficher l\'enchaînement',

  // ── NEW SONG MODAL (additional) ─────────────────────────────────────────
  'newSong.title':               '✦ Nouvelle chanson',
  'newSong.hint':                'Remplissez les détails, puis écrivez ou collez votre chanson dans l\'éditeur qui s\'ouvre.',
  'newSong.typeLabel':           'Type',
  'newSong.typeSong':            'Chanson / Grille d\'accords',
  'newSong.typeAbc':             'Notation ABC (partition)',
  'newSong.typeIreal':           '🎼 Grille(s) (URL iReal Pro)',
  'newSong.typeBlankLead':       '🎼 Grille (vierge)',
  'newSong.keyOptional':         'Tonalité (optionnel)',
  'newSong.format':              'Tapez simplement vos paroles — l\'éditeur qui s\'ouvre a un bouton <strong>Ajouter des accords</strong>, touchez un mot pour y déposer un accord. (Les anciennes grilles à deux lignes, avec les accords sur leur propre ligne, se collent aussi très bien — elles sont converties automatiquement.)',
  'newSong.abcPasteLabel':       'Collez la notation ABC ci-dessous — le titre et le compositeur sont extraits automatiquement',
  'newSong.irealPasteLabel':     'Collez une URL <code>irealb://</code> — les chansons seules et les playlists complètes sont prises en charge',
  'newSong.openEditor':          'Ouvrir l\'éditeur',

  // ── CONTACT / CREDITS PANEL ──────────────────────────────────────────────
  'contact.version':             'version 1.2.4',
  'contact.bugReportsHeading':   'Rapports de bugs / Dons',
  'contact.getInTouch':          'Vous avez trouvé un problème ? Contactez-nous :',
  'contact.includeDescription':  'Merci de joindre le fichier de la chanson et une description du problème rencontré.',
  'contact.likeProject':         'Vous aimez le projet ? Un don compterait énormément ! ☕ 🌍',
  'contact.loading':             'Chargement…',
  'contact.tabToggle':           '♩ Magic Scroll - par Spencer California<br>(Le barde préféré de votre barde préféré)</br>',

  // ── COLLECTIONS MODAL ────────────────────────────────────────────────────
  'collections.builtin':         '📦 Intégrées',
  'collections.community':       '☁ Communauté',
  'collections.desc':            'Ensembles de chansons prêts à l\'emploi. En ajouter un crée un nouveau dossier dans votre bibliothèque.',
  'collections.close':           'Fermer',

  // ── PUBLISH MODAL ─────────────────────────────────────────────────────────
  'publish.title':                '☁ Publier dans la bibliothèque en ligne',
  'publish.checklist':
    '<strong>Avant de publier, merci de confirmer :</strong>'
    + '<ul>'
    + '<li>La publication est <strong>définitive</strong> — la version publiée ne peut être modifiée ou retirée sans l\'intervention d\'un administrateur.</li>'
    + '<li>Ne soumettez pas une modification mineure ou une nouvelle version si une chanson similaire existe déjà dans la bibliothèque.</li>'
    + '<li>Ne publiez pas quelque chose qui ne serait pas utile aux autres musiciens — annotations personnelles, brouillons incomplets ou variantes privées ne conviennent pas. N\'oubliez pas qu\'il existe des fonctions hors ligne si vous devez partager quelque chose avec un petit groupe : vous pouvez simplement enregistrer le fichier sur votre appareil et l\'envoyer via WhatsApp, Discord, ou une autre messagerie !</li>'
    + '<li>Assurez-vous que la chanson est <strong>complète</strong> : paroles, accords, informations de tonalité/capo et tout autre détail doivent être soigneusement vérifiés avant validation.</li>'
    + '<li><strong>Ne soumettez pas de contenu protégé par le droit d\'auteur.</strong> Ne publiez que des chansons que vous avez le droit de partager — compositions originales, chansons traditionnelles ou du domaine public, ou contenu sous licence libre.</li>'
    + '</ul>'
    + '<div style="margin-top:10px;padding:8px 10px;background:var(--c-chrome-bg);border-radius:4px;font-size:0.74rem;color:var(--c-chrome-muted);line-height:1.5;">'
    + '🔒 Les publications sont <strong>anonymes</strong> — aucun compte, nom ou information d\'identification n\'est associé à ce que vous publiez.'
    + '</div>',

  // ── COLLABORATION (additional) ──────────────────────────────────────────
  'collab.startExplainer': 'Démarrez une session de collaboration en direct pour cette chanson. Toute personne à qui vous partagez le code peut l\'ajouter à sa propre bibliothèque et l\'éditer avec vous en temps réel — sans compte, sans inscription. Quand vous mettez fin à la session, la version finale est enregistrée pour tous les participants.',
  'collab.startBtn':       'Démarrer la collaboration',
  'collab.shareCode':      'Partagez ce code avec d\'autres pour qu\'ils puissent rejoindre :',
  'collab.copyCode':       'Copier le code',
  'collab.hostOnlyNote':   'Seul l\'hôte peut mettre fin à cette collaboration.',
  'collab.endCollab':      'Mettre fin à la collaboration',
  'collab.enterCode':      'Saisissez le code de collaboration à 6 caractères qui vous a été partagé.',
  'collab.join':           'Rejoindre',

  // ── KEBAB MENUS (song list + folders) ────────────────────────────────────
  'kebab.songOptions':          'Options de la chanson',
  'kebab.favourite':            '★ Favori',
  'kebab.removeFavourite':      '☆ Retirer des favoris',
  'kebab.rename':                '✎ Renommer',
  'kebab.moveToFolder':         '📁 Déplacer vers un dossier',
  'kebab.duplicate':            '⧉ Dupliquer',
  'kebab.publishEllipsis':      '☁ Publier…',
  'kebab.collaborateEllipsis':  '⇄ Collaborer…',
  'kebab.collaborating':        '⇄ Collaboration en cours ({code})…',
  'kebab.remove':                '✕ Retirer',
  'kebab.noFolder':             '— Aucun dossier',
  'kebab.noFoldersYet':         'Aucun dossier pour l\'instant — créez-en un ci-dessous',
  'kebab.folderOptions':        'Options du dossier',
  'kebab.export':                '⬇ Exporter',
  'kebab.publishCollection':    'Publier la collection…',
  'kebab.deleteFolderKeepSongs':  'Supprimer le dossier (garder les chansons)',
  'kebab.deleteFolderAndSongs':   'Supprimer le dossier + les chansons',
  'kebab.liveCollaboration':    'Collaboration en direct',

  // ── METRONOME ─────────────────────────────────────────────────────────────
  'metronome.toggle':           '♩ Métronome',
  'metronome.openTitle':        'Ouvrir le métronome',
  'metronome.timeSig':          'Signature ryth.',
  'metronome.beat':             'Temps',
  'metronome.tapTempo':         'Tempo au tapé',
  'metronome.tapTempoTitle':    'Tapotez pour régler le tempo',
  'metronome.start':            '▶︎ Démarrer',
  'metronome.stop':             '■ Arrêter',
  'metronome.startStopTitle':   'Démarrer / arrêter',
  'metronome.runningLabel':     '♩ {bpm} BPM ●',

  // ── TUNER ──────────────────────────────────────────────────────────────────
  'tuner.toggle':                '𝄞 Accordeur',
  'tuner.toggleTitle':           'Accordeur chromatique (utilise le microphone)',
  'tuner.panelTitle':            'Accordeur chromatique',
  'tuner.instrument':            'Instrument',
  'tuner.primaryInstrument':     'Instrument principal',
  'tuner.secondaryInstrument':   'Instrument secondaire',
  'tuner.chromatic':             'Chromatique',
  'tuner.sensitivity':           'Sensibilité',
  'tuner.sensitivityHigh':       'Élevée (pièces silencieuses)',
  'tuner.sensitivityMedium':     'Moyenne',
  'tuner.sensitivityLow':        'Faible (pièces bruyantes)',
  'tuner.a4reference':           'Référence La4',
  'tuner.a4standard':            '440 Hz (standard)',
  'tuner.startListening':        '🎤 Démarrer l\'écoute',
  'tuner.stopListening':         '⏹︎ Arrêter l\'écoute',
  'tuner.requiresHttps':         'Le microphone nécessite HTTPS — ouvrez l\'application via son URL https://.',
  'tuner.notAvailable':          'Microphone non disponible dans ce navigateur ou ce contexte.',
  'tuner.micDenied':             '⚠ Accès au microphone refusé : {msg}',

  // ── PRINT PANEL ────────────────────────────────────────────────────────────
  'printPanel.print':                   'Imprimer',
  'printPanel.optionsTitle':            'Options d\'impression',
  'printPanel.panelTitle':              'Options d\'impression',
  'printPanel.font':                    'Police',
  'printPanel.fontChoice':              'Choix de la police',
  'printPanel.fontDefault':             'Polices de la page (définies par l\'utilisateur)',
  'printPanel.includeDiagrams':         'Inclure les diagrammes',
  'printPanel.primaryInstrumentNote':   '(instrument principal)',
  'printPanel.layout':                  'Mise en page',
  'printPanel.fitOnePage':              'Ajuster sur une page',
  'printPanel.multiColumn':             'Plusieurs colonnes',
  'printPanel.reducesBlankSpace':       '(réduit les espaces vides)',
  'printPanel.skipChoruses':            'Ignorer les refrains répétés',
  'printPanel.condensedNote':           '(accords en ligne entre crochets, plus de contenu par page)',
  'printPanel.whichTune':               'Quel morceau',
  'printPanel.allTunes':                'Tous les morceaux (ensemble complet)',
  'printPanel.fittingHint':             'Faire tenir l\'ensemble sur une page tout en restant lisible peut être difficile ! Il peut être utile de dupliquer le fichier de la chanson pour créer une version prête à imprimer, débarrassée des informations superflues (titres, texte d\'ambiance, hyperliens).',
  'printPanel.printNow':                '🖨 Imprimer maintenant',

  // ── THEMES PANEL ─────────────────────────────────────────────────────────
  'themes.panelTitle':           '🎨 Thèmes',
  'themes.closeTitle':           'Fermer',
  'themes.presetThemes':         'Thèmes prédéfinis',
  'themes.groupLight':           'Clair',
  'themes.groupDark':            'Sombre',
  'themes.uiColours':            'Couleurs de l\'interface',
  'themes.uiBg':                 'Fond de l\'interface',
  'themes.uiBgAlt':              'Fond alt. de l\'interface',
  'themes.uiBorder':             'Bordure de l\'interface',
  'themes.uiText':               'Texte de l\'interface',
  'themes.uiMuted':              'Texte atténué',
  'themes.accent':               'Accent',
  'themes.songCardColours':      'Couleurs des fiches de chansons',
  'themes.cardBg':               'Fond de la fiche',
  'themes.cardText':             'Texte de la fiche',
  'themes.cardTitle':            'Titre de la fiche',
  'themes.cardArtist':           'Artiste de la fiche',
  'themes.chordText':            'Texte des accords',
  'themes.backgroundImage':      'Image de fond',
  'themes.imageFile':            'Fichier image',
  'themes.browse':               '📂 Parcourir…',
  'themes.none':                 '(aucune)',
  'themes.imageScale':           'Échelle de l\'image',
  'themes.scaleSmall':           'Petite (mosaïque 300 px)',
  'themes.scaleMedium':          'Moyenne (mosaïque 500 px)',
  'themes.scaleLarge':           'Grande (mosaïque 800 px)',
  'themes.scaleXL':              'Très grande (mosaïque 1200 px)',
  'themes.scaleFullWidth':       'Pleine largeur',
  'themes.scaleCover':           'Couvrir (étirer)',
  'themes.scrollWithPage':       'Défiler avec la page',
  'themes.clearImage':           'Effacer l\'image',
  'themes.clearBtn':             '✕ Effacer',
  'themes.fonts':                'Polices',
  'themes.fontBodyTab':          'Corps / Tablature',
  'themes.fontChordTokens':      'Symboles d\'accords',
  'themes.fontSongTitle':        'Titre de la chanson',
  'themes.fontAppUI':            'Interface de l\'application',
  'themes.displayOptions':       'Options d\'affichage',
  'themes.monoSpacing':          'Espacement à chasse fixe pour accords/paroles',
  'themes.monoSpacingTitle':     'Afficher les lignes d\'accords et de paroles dans une véritable police à chasse fixe pour que les accords s\'alignent exactement au-dessus de leurs paroles',
  'themes.monoSpacingOff':       '⇔ Désactivé',
  'themes.apply':                'Appliquer',
  'themes.saveAsTheme':          'Enregistrer comme thème',
  'themes.resetColours':         'Réinitialiser les couleurs',
  'themes.resetFonts':           'Réinitialiser les polices',
  'themes.export':               '⇩ Exporter les thèmes',
  'themes.exportTitle':          'Télécharger vos thèmes personnalisés enregistrés dans un fichier partageable',
  'themes.import':               '⇧ Importer des thèmes',
  'themes.importTitle':          'Charger des thèmes personnalisés partagés par quelqu\'un d\'autre',

  // ── SONG/LEAD-SHEET/ABC META PILLS ("Type:", "Key:", ...) ──────────────
  'meta.type':                  'Type',
  'meta.key':                   'Tonalité',
  'meta.time':                  'Rythme',
  'meta.tuning':                'Accordage',
  'meta.capo':                  'Capo',
  'meta.fret':                  'Case {n}',
  'meta.style':                 'Style',
  'meta.lead':                  'Grille',

  // ── PLAYBACK (additional) ───────────────────────────────────────────────
  'playbar.pause':               'Pause',
  'playbar.resume':              'Reprendre',
  'playbar.audioUnavailable':    'Impossible de démarrer l\'audio — réessayez, ou redémarrez l\'application si cela persiste.',

  // ── LEAD-SHEET EDIT MODE (toolbar, header fields, per-bar menu) ────────
  'lsEdit.style':                     'Style',
  'lsEdit.customEllipsis':            'Personnalisé…',
  'lsEdit.customStylePlaceholder':    'Nom du style personnalisé',
  'lsEdit.composerArtistPlaceholder': 'Compositeur / artiste',
  'lsEdit.transposeDownTitle':        'Descendre tous les accords de cette grille d\'un demi-ton (définitif)',
  'lsEdit.transposeUpTitle':          'Monter tous les accords de cette grille d\'un demi-ton (définitif)',
  'lsEdit.downloadMsleadTitle':       'Télécharger cette grille au format .mslead',
  'lsEdit.irealUrlBtn':               '🔗 URL iReal',
  'lsEdit.irealUrlTitle':             'Copier cette grille sous forme d\'URL irealb:// (ré-importable ici ou dans iReal Pro)',
  'lsEdit.copied':                    '✓ Copié',
  'lsEdit.publishLeadSheetTitle':     'Publier cette grille dans la bibliothèque en ligne',
  'lsEdit.collaborateLeadSheetTitle': 'Démarrer ou gérer une collaboration en direct sur cette grille',
  'lsEdit.chordViewBracketsTitle':    'Les accords s\'affichent en ligne entre [crochets] — cliquez pour les faire flotter au-dessus des mots à la place',
  'lsEdit.barOptionsTitle':           'Options de la mesure (barres, signature rythmique, insertion/suppression…)',
  'lsEdit.setTimeSig':                'Définir la signature ryth.',
  'lsEdit.timeColon':                 'Rythme : {v}',
  'lsEdit.setTimeSigModalTitle':      'Définir la signature rythmique',
  'lsEdit.setSection':                'Définir la section',
  'lsEdit.sectionColon':              'Section : {v}',
  'lsEdit.setSectionModalTitle':      'Définir un marqueur de section',
  'lsEdit.sectionLabelField':         'Nom de la section',
  'lsEdit.setEnding':                 'Définir la fin',
  'lsEdit.endingColon':               'Fin : {v}',
  'lsEdit.setEndingModalTitle':       'Définir le numéro de fin',
  'lsEdit.endingField':               'Fin (ex. 1, 2)',
  'lsEdit.openRepeat':                'Ouvrir la reprise',
  'lsEdit.openRepeatOn':              '✓ Ouvrir la reprise',
  'lsEdit.closeRepeat':               'Fermer la reprise',
  'lsEdit.closeRepeatOn':             '✓ Fermer la reprise',
  'lsEdit.doubleBarEnd':              'Double barre (fin)',
  'lsEdit.doubleBarEndOn':            '✓ Double barre (fin)',
  'lsEdit.doubleBarStart':            'Double barre (début)',
  'lsEdit.doubleBarStartOn':          '✓ Double barre (début)',
  'lsEdit.finalBarline':              'Barre finale',
  'lsEdit.finalBarlineOn':            '✓ Barre finale',
  'lsEdit.insertBarBefore':           'Insérer une mesure avant',
  'lsEdit.insertBarAfter':            'Insérer une mesure après',
  'lsEdit.insertBarsModalTitle':      'Insérer combien de mesures ?',
  'lsEdit.insertBarsCountField':      'Nombre de mesures',
  'lsEdit.deleteBar':                 'Supprimer la mesure',

  // ── COLLECTIONS (submenu list content) ──────────────────────────────────
  'collections.communityDesc':          'Collections partagées par d\'autres utilisateurs de Magic Scroll.',
  'collections.requiresHttp':           'Les collections nécessitent un serveur HTTP.',
  'collections.noBuiltin':              'Aucune collection intégrée disponible.',
  'collections.manifestLoadFailed':     'Impossible de charger le manifeste des collections.',
  'collections.communityNotConfigured': 'La bibliothèque communautaire n\'est pas configurée pour cette version.',
  'collections.noMatching':             'Aucune collection correspondante.',
  'collections.noneYet':                'Aucune collection communautaire pour l\'instant — soyez le premier à en publier une !',
  'collections.communityUnreachable':   'Impossible d\'accéder à la bibliothèque communautaire.',
  'collections.unnamed':                'Sans titre',
  'collections.songCount':              '{n} chansons',
  'collections.songCountOne':           '{n} chanson',
  'collections.contains':               'Contient : {list}',
  'collections.moreCount':              ' +{n} de plus',
  'collections.add':                    '+ Ajouter',
  'collections.adding':                 'Ajout en cours…',
  'collections.added':                  '✓ Ajouté',
  'collections.addedCount':             '✓ Ajouté ({n})',
  'collections.alreadyInLibrary':       'Déjà dans la bibliothèque',
  'collections.failed':                 'Échec',
  'collections.defaultFolderName':      'Collection',

  // ── SHARE (native share-sheet, toolbar + kebab menu) ────────────────────
  'share.button':                'Partager…',
  'share.buttonTitle':           'Partager avec une autre application',
  'share.defaultMessage':        "Je partage un peu de musique via Magic Scroll !",
  'share.fallbackDownloaded':    'Téléchargé {filename} (partage non disponible sur cet appareil)',
  'download.toast':              'Téléchargé : {filename}',

  // ── MULTI-PART SHEET MUSIC (MuseScore/MusicXML imports with >1 instrument) ─
  'sheetmusic.partFallback':     'Partie {n}',

  // ── INSTRUMENT CATEGORIES (Chord Diagrams instrument tabs) ──────────────
  // See strings-en.js for how this is wired in. Tuning names (DADGAD, Open
  // G, accordages spécifiques…) stay untranslated on purpose.
  'instCat.guitar':              'Guitare',
  'instCat.ukulele':             'Ukulélé',
  'instCat.banjo':                'Banjo',
  'instCat.mandolin':            'Mandoline',
  'instCat.folk':                'Folk',
  'instCat.concertina':          'Concertina',
  'instCat.melodeon':            'Accordéon diatonique',
  'instCat.piano':                'Piano',
};

// ── Active language ──────────────────────────────────────────────────────
// Merged into strings-en.js's _activeDict()/t()/setLanguage() — this file
// only needs to define the dictionary itself; see strings-en.js for the
// shared machinery (window.MS_LANG, t(), setLanguage()).

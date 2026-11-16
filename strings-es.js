/**
 * strings-es.js — Magic Scroll user-facing text (Latin American Spanish /
 * Español latinoamericano, BCP-47 "es-419").
 *
 * Same keys as strings-en.js, translated. See that file's header comment for
 * how this is wired in (window.MS_STRINGS_ES, window.setLanguage(), the
 * #lang-sel dropdown in Options — whose value for this language is
 * "es-419", which also becomes <html lang>). A key missing here silently
 * falls back to the English string via t()'s lookup, so this file can be a
 * partial translation without anything looking broken — every key in
 * strings-en.js has a translation below as of this pass.
 *
 * Register: informal "tú" throughout (the norm for consumer apps across
 * Latin America); no vosotros forms, and Latin American vocabulary
 * (celular, computadora, archivo, etc.).
 *
 * {name}/{count}/{filename}/{message}/{title}/{plural} tokens are left
 * exactly as-is — t() substitutes them at runtime regardless of language, so
 * they must appear verbatim (same spelling, same braces) in each dictionary.
 */
window.MS_STRINGS_ES = {

  // ── TOPBAR ─────────────────────────────────────────────────────────────
  'topbar.library':            '☰',
  'topbar.libraryTitle':       'Biblioteca',
  'topbar.chords':             '🎵',
  'topbar.chordsTitle':        'Tonalidad, acordes y herramientas de entrenamiento auditivo',
  'topbar.chordsLabel':        'Acordes',
  'topbar.key':                'Tono',
  'topbar.transposeDown':      'Transponer un semitono hacia abajo',
  'topbar.transposeUp':        'Transponer un semitono hacia arriba',
  'topbar.transposeReset':     'Volver al tono original',
  'topbar.simplifyChords':     'Simplificar acordes',
  'topbar.simplifyChordsTitle':'Simplificar todos los acordes a su forma básica',
  'topbar.size':                'Tamaño',
  'topbar.lineSpacing':         'Interlineado',
  'topbar.lineSpacingTitle':    'Interlineado del texto de canciones y hojas guía',
  'topbar.themes':              'Temas',
  'topbar.themesTitle':         'Personalizar tema, colores, fuentes y fondo',
  'topbar.scroll':              '▶︎',
  'topbar.scrollTitle':         'Desplazar',
  'topbar.scrollStop':          '■',
  'topbar.scrollStopLabel':     'Detener',

  // ── SIDEBAR ────────────────────────────────────────────────────────────
  'sidebar.searchPlaceholder':  'Buscar…',
  'sidebar.multiselectTitle':   'Seleccionar varias canciones',
  'sidebar.filterTitle':        'Filtrar por tipo',
  'toast.songLoaded':           'Se cargó {title}',

  // ── SONG/CHORD-SHEET EDITOR ────────────────────────────────────────────
  'editor.addChords':           '🎯 Agregar acordes',
  'editor.addChordsTitle':      'Asigna acordes a palabras o sílabas exactas en lugar de alinearlos a mano',
  'editor.bold':                'Negrita (**texto**)',
  'editor.italic':              'Cursiva (*texto*)',
  'editor.underline':           'Subrayado (_texto_)',
  'editor.embed':               '⧉ Insertar…',
  'editor.embedTitle':          'Insertar un video o un enlace',
  'editor.precisionHint':       'Haz clic en la palabra (o en el lugar) donde quieres un acorde y escríbelo en el cuadro que aparece. Haz clic en un acorde existente para editarlo o quitarlo.',
  'editor.tabWrite':            '🎸 Riff en tablatura',
  'editor.tabWriteTitle':       'Escribe un solo o riff en tablatura con la afinación del instrumento actual: escribe los números de traste directamente y se alinean entre las cuerdas automáticamente',
  'editor.tabWriteHint':        'Haz clic en la línea de una cuerda y escribe los números de traste: las demás cuerdas se completan solas. Haz clic en un punto anterior para agregar una doble cuerda sin alterar lo que sigue. Mantén Shift para unir un segundo dígito (trastes 10+) o el traste de destino después de las marcas h/p/b/slide. Espacio = silencio, Enter = nueva línea, Esc o el botón otra vez para terminar.',
  'editor.editToggle':          '✎ Editar',
  'editor.editToggleActive':    '✎ Guardar',
  'editor.editToggleTitle':     'Alternar entre modo de edición y modo de lectura',
  'editor.cancel':              '✕ Cancelar',
  'editor.cancelTitle':         'Descartar todos los cambios hechos desde que entraste al modo de edición',
  'editor.save':                '📤 Compartir',
  'editor.saveTitle':           'Guardar los cambios de esta canción (Ctrl+S)',
  'editor.saveAs':              '💾 Guardar como…',
  'editor.publish':             '☁ Publicar',
  'editor.exportMonospace':     '⬇ Exportar en monoespaciado',
  'editor.titlePlaceholder':    'Título de la canción',
  'editor.artistPlaceholder':   'Nombre del artista',
  'editor.keyPlaceholder':      'p. ej. Am',
  'editor.timeSigPlaceholder':  'p. ej. 4/4',
  'editor.songPlaceholder': 'Pega o escribe tu canción aquí.\n\n[Verso]\nEscribe tu letra, sin prisa, con calma,\nSin columnas ni reglas que te quiten el alma,\nToca "Agregar acordes" y elige el lugar,\nSobre cada palabra, donde quieras tocar.\n\n[Coro]\n[G]Así, un acorde [D] o un rasgueo al pasar[D]\nC                                D                                      Em                     G\n¡Queda bien bonito! ¿No ves qué limpio está?\nEs rápido y simple, ¡y gratis, además!\n¡Que disfrutes tu Magic Scroll de verdad!',

  // ── LEAD-SHEET EDITOR ──────────────────────────────────────────────────
  'editor.lsHint': 'Editando: cambia arriba el título, el autor, el estilo, el BPM y el compás; haz clic en un compás para cambiar sus acordes, o usa su menú ⋮ para barras de compás, cambios de compás a mitad de la pieza, secciones y para insertar o eliminar compases. '
    + 'Abreviaturas de acordes: b/# para bemol/sostenido (Bb, F#) · m o - para menor (Dm) · maj7 o ^ para séptima mayor (Cmaj7) · 7 para séptima de dominante (G7) · sus2/sus4 para suspendido · dim u o para disminuido · aug o + para aumentado; p. ej. F#m7b5, Bbmaj7, Caug.',
  'editor.lsEditToggleTitle':       'Editar esta hoja guía',
  'editor.lsEditToggleTitleActive': 'Guardar los cambios y salir del modo de edición',

  // ── ABC SHEET-MUSIC EDITOR ─────────────────────────────────────────────
  'editor.abcHint': 'Estás editando notación ABC: las notas son las letras A-G (minúscula = una octava más arriba; agrega \' después de una nota para subir otra octava, o , para bajar una); un número después de una nota cambia su duración (C2 = el doble, C/2 = la mitad); | marca una barra de compás. Los cifrados de acordes van entre comillas justo antes de la nota sobre la que caen, p. ej. "G7". K: define la tonalidad, M: el compás y Q: el tempo.',

  // ── ADD-CHORDS PRECISION POPUP ──────────────────────────────────────────
  'precision.chordInputPlaceholder': 'Acorde, p. ej. Am7',

  // ── CREATE SET MODAL ────────────────────────────────────────────────────
  'createSet.searchPlaceholder': 'Busca melodías o escribe un tipo (jig, reel, vals…)',

  // ── NEW SONG MODAL ───────────────────────────────────────────────────────
  'newSong.abcPlaceholder':   'X:1\nT:Mi melodía\nC:Compositor\nM:4/4\nL:1/8\nK:G\n...',
  'newSong.irealPlaceholder': 'irealb://SongTitle%3DComposer%3D%3DStyle%3DKey...',

  // ── SEARCH ───────────────────────────────────────────────────────────────
  'search.videoLabel': 'Video',

  // ── COMMUNITY COLLECTIONS ────────────────────────────────────────────────
  'collections.searchPlaceholder': 'Buscar colecciones de la comunidad…',

  // ── COLLABORATION ─────────────────────────────────────────────────────────
  'collab.namePlaceholder': 'Tu nombre',
  'collab.codePlaceholder': 'ABCDEF',

  // ── PLAYBACK BARS (ABC sheet-music player + lead-sheet backing track) ───
  'playbar.play':                 'Reproducir',
  'playbar.stop':                 'Detener',
  'playbar.playPause':            'Reproducir / Pausar',
  'playbar.stopReturn':           'Detener y volver al inicio',
  'playbar.bpm':                  'BPM',
  'playbar.meter':                'Compás',
  'playbar.meterAuto':            'N/D',
  'playbar.meterTitle':           'Compás: N/D sigue la partitura (y cualquier cambio de compás dentro de ella); elige un valor para forzar un compás fijo',
  'playbar.plays':                'Vueltas',
  'playbar.playsTitle':           'Cantidad de veces que se reproduce la pieza completa',
  'playbar.bar':                  'Compás {n}',
  'playbar.mute':                 'Silenciar {inst}',
  'playbar.unmute':               'Activar sonido de {inst}',
  'playbar.perInstSettings':      'Ajustes por instrumento',
  'playbar.loading':              'Cargando…',
  'playbar.openLeadSheetToUse':   'Abre una hoja guía para usar la pista de acompañamiento',
  'playbar.noChordData':          'Esta hoja guía no tiene acordes',
  'playbar.instDrums':            'Batería',
  'playbar.instKeys':             'Teclado',
  'playbar.instBass':             'Bajo',
  'playbar.instGuitar':           'Guitarra',

  // ── CHORD DIAGRAMS ─────────────────────────────────────────────────────
  'diagrams.fabTitle':          'Diagramas de acordes',

  // ── OPTIONS PANEL ──────────────────────────────────────────────────────
  'options.language':           'Idioma',
  'options.languageTitle':      'Cambiar el idioma de la app',

  // ── EMPTY STATE ────────────────────────────────────────────────────────
  'emptyState.title':           'No hay ninguna canción cargada',

  // ── ALERTS (window.alert — informational; no user choice) ─────────────
  'alert.storageFull':                'Tu biblioteca es demasiado grande para el almacenamiento de este dispositivo, así que los cambios recientes no se están guardando y se perderán si cierras la app. Usa "Exportar biblioteca" ahora para respaldarlos y luego libera espacio quitando algunas canciones o copias de listas.',
  'alert.themeSaved':                 '¡Se guardó el tema "{name}"!',
  'alert.noCustomThemes':             'Todavía no hay temas personalizados guardados. Usa primero "Guardar como tema" y luego exporta.',
  'alert.invalidThemeFile':           'Ese archivo no es un JSON de tema válido.',
  'alert.noThemesInFile':             'No se encontraron temas en ese archivo.',
  'alert.themesImported':             'Temas importados: {count}.',
  'alert.fontLoadFailed':             'No se pudo cargar ese archivo de fuente: {filename}',
  'alert.jsonError':                  'Error de JSON: {message}',
  'alert.invalidConfigFile':          'No es un archivo de configuración válido de Magic Scroll.',
  'alert.configParseError':           'No se pudo leer el archivo de configuración:\n{message}',
  'alert.mxlExtractFailed':           'No se pudo extraer el XML del archivo .mxl',
  'alert.musicXmlParseFailed':        'No se pudo leer el MusicXML de {filename}',
  'alert.mxlReadError':               'Error al leer el .mxl: {message}',
  'alert.msczExtractFailed':          'No se pudo extraer la partitura de {filename}',
  'alert.museScoreParseFailed':       'No se pudo leer el archivo de MuseScore {filename}',
  'alert.msczReadError':              'Error al leer el .mscz: {message}',
  'alert.midiParseFailed':            'No se pudo leer el MIDI: {filename}',
  'alert.jsonParseError':             'Error al leer el JSON:\n{message}',
  'alert.simplifyPlainTextOnly':      'Simplificar solo funciona con canciones de texto plano.',
  'alert.editPlainTextOnly':          'El modo de edición solo funciona con canciones de texto plano.',
  'alert.exportMonospacePlainTextOnly': 'Exportar en monoespaciado solo funciona con cancioneros de acordes en texto plano.',
  'alert.printFailed':                'Error al imprimir: {message}',
  'alert.printPopupBlocked':          'No se pudo abrir la vista de impresión. Permite las ventanas emergentes o usa Imprimir / Guardar como PDF de tu navegador.',
  'alert.noSongLoaded':               'No hay ninguna canción cargada.',
  'alert.openLeadSheetFirst':         'Primero abre la hoja guía.',
  'alert.irealUrlFailed':             'No se pudo crear la URL de iReal: {message}',
  'alert.collabPlainTextOrLeadSheetOnly': 'Colaborar solo funciona con canciones de texto plano y hojas guía.',
  'alert.collabConnectFailed':        'Colaborar necesita conexión a internet y no se pudo conectar. Revisa tu conexión e inténtalo de nuevo.',
  'alert.collabHostOnlyEnd':          'Solo el anfitrión puede terminar esta colaboración.',

  // ── CONFIRMS (window.confirm — Yes/No before a destructive action) ────
  'confirm.deleteTheme':              '¿Eliminar el tema "{name}"?',
  'confirm.resetColours':             '¿Restablecer los colores predeterminados?',
  'confirm.resetFonts':               '¿Restablecer las fuentes predeterminadas?',
  'confirm.deleteFolder':             '¿Eliminar la carpeta "{name}"? Las canciones se conservan; solo se quita la carpeta.',
  'confirm.deleteFolderAndSongs':     '¿Eliminar la carpeta "{name}" Y las {count} canciones que contiene? Esto no se puede deshacer.',
  'confirm.deleteEmptyFolder':        '¿Eliminar la carpeta "{name}"? No tiene canciones.',
  'confirm.removeSong':               '¿Quitar "{title}"?',
  'confirm.deleteSongs':              '¿Eliminar {count} canción(es)?',
  'confirm.endCollab':                '¿Terminar esta colaboración para todos? El contenido actual se guardará de forma permanente para todos los participantes.',

  // ── PROMPTS (window.prompt — asks the user to type something) ─────────
  'prompt.saveThemeName':             'Nombre del tema:',
  'prompt.importedThemeName':         'Nombre para este tema importado:',
  'prompt.renameSong':                'Cambiar nombre:',
  'prompt.newFolderName':             'Nombre de la nueva carpeta:',
  'prompt.renameFolder':              'Cambiar nombre de la carpeta:',
  'prompt.renameSetlist':             'Cambiar nombre de la lista:',
  'prompt.folderName':                'Nombre de la carpeta:',
  'prompt.embedLink':                 'Pega un enlace para insertar (video de YouTube o cualquier enlace web):',
  'prompt.embedLinkText':             'Texto del enlace (opcional):',
  'prompt.copyIrealUrl':              'Copia esta URL irealb://:',

  // ── TOPBAR (additional) ─────────────────────────────────────────────────
  'topbar.options':             '⚙',
  'topbar.optionsTitle':        'Tamaño, tema e impresión',
  'topbar.optionsLabel':        'Opciones',
  'topbar.scrollLabel':         'Desplazar',
  'topbar.scrollSpeedTitle':    'Velocidad de desplazamiento',
  'topbar.detectedKeyTitle':    'Tono detectado: haz clic en ♭/♯ para transponer',
  'topbar.detectedKeyCapoTitle': 'Esta canción se toca con las posiciones de acordes de {shapeKey} con cejilla en el traste {fret}, lo que la sube a {soundingKey}.',
  'topbar.collapseLabel':       '▲ ocultar',
  'topbar.collapseTitle':       'Ocultar controles (haz clic en la franja ▼ para mostrarlos)',
  'topbar.restoreTitle':        'Mostrar controles (toca para restaurar)',

  // ── SIDEBAR (additional) ────────────────────────────────────────────────
  'sidebar.libraryHeader':      'Biblioteca',
  'sidebar.emptyLibrary':       '🗑 Vaciar biblioteca',
  'sidebar.clearSearchTitle':   'Borrar búsqueda',
  'sidebar.onlineSearchOn':     'La búsqueda en línea está activada: haz clic para desactivarla',
  'sidebar.onlineSearchOff':    'La búsqueda en línea está desactivada: haz clic para activarla',
  'sidebar.previousSong':       '◀ Canción anterior',
  'sidebar.previousSongTitle':  'Volver a la canción que tenías abierta antes',
  'sidebar.noPreviousSong':     'No hay canción anterior.',
  'sidebar.untitled':           'Sin título',
  'sidebar.selectRandom':       '🎲 Elegir al azar',
  'sidebar.selectRandomTitle':  'Abrir una canción al azar de tu biblioteca',
  'sidebar.joinCollab':         '🔗 Unirse a una colaboración…',
  'sidebar.joinCollab2':        'Unirse a una colaboración',
  'sidebar.joinCollabTitle':    'Únete a una colaboración en vivo con un código que alguien compartió contigo',
  'sidebar.nSelected':          '{n} seleccionadas',
  'sidebar.bulkSelectAllTitle': 'Seleccionar todas las canciones visibles',
  'sidebar.bulkPublishTitle':   'Publicar las canciones seleccionadas en la biblioteca en línea',
  'sidebar.folder':             '📁 Carpeta',
  'sidebar.bulkFolderTitle':    'Mover las seleccionadas a una carpeta',
  'sidebar.bulkDelete':         '✕ Eliminar',
  'sidebar.bulkDeleteTitle':    'Eliminar las seleccionadas',
  'sidebar.cancel':             'Cancelar',
  'scrollDuration.title':          '⏱ Duración del desplazamiento',
  'scrollDuration.hint':           'Indica cuánto quieres que tarde el desplazamiento automático en llegar al final de la página; la velocidad se calcula por ti.',
  'scrollDuration.minutesLabel':   'Minutos',
  'scrollDuration.secondsLabel':   'Segundos',
  'scrollDuration.apply':          'Empezar a desplazar',
  'sidebar.bulkCancelTitle':    'Cancelar selección',
  'sidebar.openFilesHere':      'Abrir archivos aquí',
  'sidebar.new':                '✦ Nueva',
  'sidebar.newTitle':           'Crear una canción nueva en blanco',
  'sidebar.newFolderTitle':     'Crear una carpeta nueva para organizar canciones',
  'sidebar.exportLibrary':      'Exportar biblioteca',
  'sidebar.exportLibraryTitle': 'Guardar la biblioteca en un archivo · Shift+clic para Guardar como',
  'sidebar.collections':        '📦 Colecciones',
  'sidebar.collectionsTitle':   'Explorar y agregar colecciones de canciones',
  'sidebar.resizeHandleTitle':  'Arrastra para cambiar el tamaño de la barra lateral',
  'sidebar.setlists':           '🎼 Listas',
  'sidebar.setlistsTitle':      'Cambiar a tus listas de canciones',
  'sidebar.setlistsHeader':     'Listas de canciones',
  'sidebar.add':                '＋ Agregar',
  'sidebar.exportSetlists':     'Exportar listas',

  // ── SETLISTS ─────────────────────────────────────────────────────────────
  'setlist.addTitle':           '🎼 Agregar a una lista',
  'setlist.addHint':            'Marca las canciones que quieres agregar. Escribe un nombre nuevo abajo para crear una lista, o elige una existente para agregarlas a ella.',
  'setlist.nameLabel':          'Lista',
  'setlist.namePlaceholder':    'Nombre de una lista nueva o existente',
  'setlist.searchPlaceholder':  'Buscar en tu biblioteca…',
  'setlist.noMatch':            'Ninguna canción coincide con esta búsqueda.',
  'setlist.selectedSummary':    '{n} seleccionadas: {names}',
  'setlist.noneSelected':       'Todavía no hay canciones seleccionadas',
  'setlist.addApply':           'Agregar a la lista',
  'setlist.noSetlistsYet':      'Todavía no hay listas: toca Agregar para crear una.',
  'setlist.emptySetlist':       'Esta lista está vacía: toca Agregar para sumar canciones.',
  'setlist.songCount':          '{n} canciones',
  'setlist.backToSetlists':     'Volver a las listas',
  'setlist.dragToReorder':      'Arrastra para reordenar',
  'confirm.removeSetlist':      '¿Eliminar "{name}"? Se borrarán la lista y todas sus copias de canciones; las canciones originales de la biblioteca no se ven afectadas.',
  'alert.setlistNameRequired':      'Escribe un nombre para la lista.',
  'alert.setlistNoSongsSelected':   'Marca al menos una canción para agregar.',
  'alert.invalidSetlistsFile':      'Ese archivo no parece una exportación de listas de Magic Scroll.',
  'setlist.importSummary':          'Se importaron {songs} canción(es) en {setlists} lista(s).',

  // ── FILTER PANEL ─────────────────────────────────────────────────────────
  'filter.all':                 'Todos',
  'filter.allTitle':            'Mostrar todos los tipos',
  'filter.none':                'Ninguno',
  'filter.noneTitle':           'Ocultar todos los tipos',
  'filter.unspecified':         '(Sin especificar)',
  'filter.libraryEmpty':        'La biblioteca está vacía',
  'filter.catChords':           'Acordes',
  'filter.catTabs':             'Tablaturas',
  'filter.catSheetMusic':       'Partituras',
  'filter.catLeadSheets':       'Hojas guía',
  'sidebar.randomNoMatch':      'Ninguna canción coincide con el filtro actual.',

  // ── EMPTY STATE (additional) ────────────────────────────────────────────
  'emptyState.body':            'Arrastra archivos .txt, .json o .html a la barra lateral, o haz clic en <strong>✦ Nueva canción</strong> para escribir una.',

  // ── SONG/CHORD-SHEET EDITOR (additional) ────────────────────────────────
  'editor.titleLabel':          'Título',
  'editor.artistLabel':         'Artista',
  'editor.keyLabel':            'Tono',
  'editor.timeSigLabel':        'Compás',
  'editor.transpose':           'Transponer',
  'editor.transposeDownTitle':  'Bajar un semitono todos los acordes del texto (permanente)',
  'editor.transposeUpTitle':    'Subir un semitono todos los acordes del texto (permanente)',
  'editor.transposeDownAbcTitle': 'Bajar un semitono todas las notas de esta melodía (permanente); actualiza K: y la altura de las notas',
  'editor.transposeUpAbcTitle':   'Subir un semitono todas las notas de esta melodía (permanente); actualiza K: y la altura de las notas',
  'editor.saveMenu':            '📤 Compartir ▾',
  'editor.publish2':            'Publicar',

  // ── PRECISION POPUP (additional) ────────────────────────────────────────
  'precision.add':              'Agregar',
  'precision.remove':           'Quitar',

  // ── TOOLBARS (song/lead-sheet/ABC shared chrome) ────────────────────────
  'toolbar.saveOptionsTitle':          'Opciones para compartir',
  'toolbar.publishSheetMusicTitle':    'Publicar esta partitura en la biblioteca en línea',
  'toolbar.createSet':                 '⛓ Crear set',
  'toolbar.createSetTitle':            'Apila otras melodías de tu biblioteca debajo de esta para formar un set',

  // ── TRANSCRIBE AUDIO (BETA) ───────────────────────────────────────────────
  'transcribe.button':                 '🎙 Transcribir (beta)',
  'transcribe.buttonTitle':            'Convierte una grabación o un archivo de audio en un borrador aproximado de la melodía que luego puedes corregir. ¡Experimental! Espera errores.',
  'transcribe.modalTitle':             'Transcribir audio (beta)',
  'transcribe.disclaimer':             'Experimental: esta función es nueva y, la verdad, todavía no funciona muy bien. Es una estimación algorítmica aproximada de lo que estás tocando, no un motor de transcripción completo. Funciona mejor con un solo instrumento melódico o una voz clara, sin acompañamiento. Toma el resultado como punto de partida: revisa y corrige las notas que genera, o haz una captura de pantalla y mándamela si sale tremendamente mal y medio chistoso.',
  'transcribe.orLabel':                'o',
  'transcribe.startRecording':         '● Empezar a grabar',
  'transcribe.stopRecording':          '■ Detener grabación',
  'transcribe.recording':              'Grabando…',
  'transcribe.chooseFile':             '📂 Elegir archivo de audio…',
  'transcribe.analyzing':              'Analizando el audio…',
  'transcribe.noPitchFound':           'No se detectaron notas claras en ese audio. ¡Perdón, esta herramienta todavía es bastante limitada! Prueba con una grabación más limpia, de un solo instrumento o voz.',
  'transcribe.micDenied':              'Se negó el acceso al micrófono o no está disponible.',
  'transcribe.decodeError':            'No se pudo leer ese archivo de audio.',
  'transcribe.insertedComment':        'Transcripción beta: la altura y el ritmo son estimaciones aproximadas; revisa y corrige antes de usarla.',
  'transcribe.insertedToast':          'Se insertaron {n} notas transcritas (tonalidad estimada: {key}); revísalas antes de usarlas.',
  'toolbar.sheetMusicMenu':            '🎼 Partitura ▾',
  'toolbar.sheetMusicOptionsTitle':    'Opciones de partitura',
  'toolbar.soundfont':                 '🎵 Soundfont',
  'toolbar.soundfontTitle':            'Cargar un soundfont SF2 o SFZ',
  'toolbar.unloadSoundfont':           '✕ Quitar soundfont',
  'toolbar.unloadSoundfontTitle':      'Quitar el soundfont (volver al sonido predeterminado)',
  'toolbar.whistleTabs':               '🪈 Digitación de flauta',
  'toolbar.whistleTabsTitle':          'Mostrar u ocultar los diagramas de digitación de tin whistle',
  'toolbar.whistleKeyTitle':           'Tono de la flauta',
  'toolbar.whistleD':                  'Flauta en D',
  'toolbar.whistleC':                  'Flauta en C',
  'toolbar.whistleG':                  'Flauta en G',
  'toolbar.whistleBb':                 'Flauta en Bb',
  'toolbar.whistleEb':                 'Flauta en Eb',
  'toolbar.hideChords':                '🎼 Ocultar acordes',
  'toolbar.hideChordsTitle':           'Ocultar los cifrados de acordes marcados en este archivo ABC',
  'toolbar.noteNames':                 '🔤 Nombres de notas',
  'toolbar.noteNamesTitle':            'Mostrar el nombre de cada nota debajo de ella',
  'toolbar.collaborate':               '🔗 Colaborar',
  'toolbar.collaborateTitle':          'Iniciar o administrar una colaboración en vivo en esta canción',
  'toolbar.chordView':                 '≡ Compacto',
  'toolbar.chordViewTitle':            'Se muestran los acordes flotando sobre cada palabra: haz clic para mostrarlos en línea entre [corchetes] (más compacto)',

  // ── CHORD DIAGRAMS PANEL ─────────────────────────────────────────────────
  'diagrams.title':              'Diagramas de acordes',
  'diagrams.smallerTitle':       'Diagramas más pequeños (también afecta al texto)',
  'diagrams.largerTitle':        'Diagramas más grandes (también afecta al texto)',
  'diagrams.closeTitle':         'Cerrar diagramas de acordes',
  'diagrams.primaryInstrument':  'Instrumento principal',
  'diagrams.secondaryInstrument':'Instrumento secundario',
  'diagrams.capo':               'Cejilla',
  'diagrams.capoTitle':          'Cejilla / transposición previa de este instrumento (−11 a 11): muestra la posición que debes tocar para que suene como el acorde de la página',
  'diagrams.customBtn':          '⚙ Personalizado…',
  'diagrams.customTitle':        'Define tu propio instrumento y afinación',
  'diagrams.none':               'Ninguno',
  'diagrams.hideTitle':          'Ocultar diagramas de acordes',
  'diagrams.customInstrumentTitle': '⚙ Instrumento personalizado',
  'diagrams.customHint':         'Elige la cantidad de cuerdas (1–8) y la afinación de cada una, empezando por la más grave. Los diagramas de acordes se calculan para esta afinación.',
  'diagrams.strings':            'Cuerdas',
  'diagrams.useInstrument':      'Usar instrumento',
  'diagrams.chordsInSong':       'Acordes de esta canción',

  // ── CREATE SET MODAL (additional) ───────────────────────────────────────
  'createSet.hint':              'Marca melodías para apilarlas en la página. Aparecen en el orden en que las seleccionas; el orden se muestra abajo.',
  'createSet.filterTypeTitle':   'Filtrar por tipo de melodía',
  'createSet.allTypes':          'Todos los tipos',
  'createSet.noMatch':           'Ninguna melodía coincide con esta búsqueda o tipo.',
  'createSet.showSet':           'Mostrar set',

  // ── NEW SONG MODAL (additional) ─────────────────────────────────────────
  'newSong.title':               '✦ Nueva canción',
  'newSong.hint':                'Completa los datos y luego escribe o pega tu canción en el editor que se abre.',
  'newSong.typeLabel':           'Tipo',
  'newSong.typeSong':            'Canción / Cancionero de acordes',
  'newSong.typeAbc':             'Notación ABC (partitura)',
  'newSong.typeIreal':           '🎼 Hoja(s) guía (URL de iReal Pro)',
  'newSong.typeBlankLead':       '🎼 Hoja guía (en blanco)',
  'newSong.keyOptional':         'Tono (opcional)',
  'newSong.format':              'Solo escribe tu letra: el editor que se abre tiene un botón <strong>Agregar acordes</strong>; toca una palabra para ponerle un acorde justo encima. (Los cancioneros antiguos de dos líneas, con los acordes en su propia línea, también se pueden pegar sin problema: se convierten automáticamente).',
  'newSong.abcPasteLabel':       'Pega la notación ABC abajo: el título y el compositor se extraen automáticamente',
  'newSong.irealPasteLabel':     'Pega una URL <code>irealb://</code>: se admiten canciones sueltas y listas de reproducción completas',
  'newSong.openEditor':          'Abrir editor',

  // ── CONTACT / CREDITS PANEL ──────────────────────────────────────────────
  'contact.version':             'versión 1.2.6',
  'contact.bugReportsHeading':   'Reporte de errores / Donaciones',
  'contact.getInTouch':          '¿Encontraste un problema? Escríbeme:',
  'contact.includeDescription':  'Incluye el archivo de la canción y una descripción de lo que salió mal.',
  'contact.likeProject':         '¿Te gusta el proyecto? ¡Una donación significaría muchísimo! ☕ 🌍',
  'contact.loading':             'Cargando…',
  'contact.tabToggle':           '♩ Magic Scroll - por Spencer California<br>(El bardo favorito de tu bardo favorito)</br>',

  // ── COLLECTIONS MODAL ────────────────────────────────────────────────────
  'collections.builtin':         '📦 Incluidas',
  'collections.community':       '☁ Comunidad',
  'collections.desc':            'Conjuntos de canciones ya preparados. Al agregar uno se crea una carpeta nueva en tu biblioteca.',
  'collections.close':           'Cerrar',

  // ── PUBLISH MODAL ─────────────────────────────────────────────────────────
  'publish.title':                '☁ Publicar en la biblioteca en línea',
  'publish.checklist':
    '<strong>Antes de publicar, confirma lo siguiente:</strong>'
    + '<ul>'
    + '<li>Publicar es <strong>definitivo</strong>: la versión publicada no se puede cambiar ni quitar sin un administrador.</li>'
    + '<li>No envíes una edición menor o una versión revisada si ya existe una canción similar en la biblioteca.</li>'
    + '<li>No publiques algo que no sea útil para otros músicos: anotaciones personales, borradores incompletos o variaciones privadas no encajan aquí. Recuerda que hay funciones sin conexión si necesitas compartir algo con un grupo pequeño: ¡puedes guardar el archivo en tu dispositivo y mandarlo por WhatsApp, Discord u otras apps de mensajería!</li>'
    + '<li>Asegúrate de que la canción esté <strong>completa</strong>: revisa a fondo la letra, los acordes, el tono/la cejilla y cualquier otro detalle antes de publicarla.</li>'
    + '<li><strong>No envíes material con derechos de autor.</strong> Publica solo canciones que tengas derecho a compartir: composiciones originales, canciones tradicionales o de dominio público, o contenido con licencia abierta.</li>'
    + '</ul>'
    + '<div style="margin-top:10px;padding:8px 10px;background:var(--c-chrome-bg);border-radius:4px;font-size:0.74rem;color:var(--c-chrome-muted);line-height:1.5;">'
    + '🔒 Las publicaciones son <strong>anónimas</strong>: no se adjunta ninguna cuenta, nombre ni dato que te identifique a nada de lo que publicas.'
    + '</div>',

  // ── COLLABORATION (additional) ──────────────────────────────────────────
  'collab.startExplainer': 'Inicia una sesión de colaboración en vivo para esta canción. Cualquier persona con la que compartas el código puede agregarla a su propia biblioteca y editarla contigo en tiempo real, sin cuentas ni registros. Cuando terminas la sesión, la versión final se guarda para todos los que se unieron.',
  'collab.startBtn':       'Empezar a colaborar',
  'collab.shareCode':      'Comparte este código para que otros se unan:',
  'collab.copyCode':       'Copiar código',
  'collab.hostOnlyNote':   'Solo el anfitrión puede terminar esta colaboración.',
  'collab.endCollab':      'Terminar colaboración',
  'collab.enterCode':      'Escribe el código de colaboración de 6 caracteres que compartieron contigo.',
  'collab.join':           'Unirse',

  // ── KEBAB MENUS (song list + folders) ────────────────────────────────────
  'kebab.songOptions':          'Opciones de la canción',
  'kebab.favourite':            '★ Favorita',
  'kebab.removeFavourite':      '☆ Quitar de favoritas',
  'kebab.rename':                '✎ Cambiar nombre',
  'kebab.moveToFolder':         '📁 Mover a carpeta',
  'kebab.addToSetlist':         '🎼 Agregar a una lista',
  'kebab.duplicate':            '⧉ Duplicar',
  'kebab.publishEllipsis':      '☁ Publicar…',
  'kebab.collaborateEllipsis':  '⇄ Colaborar…',
  'kebab.collaborating':        '⇄ Colaborando ({code})…',
  'kebab.remove':                '✕ Quitar',
  'kebab.noFolder':             '— Sin carpeta',
  'kebab.noFoldersYet':         'Todavía no hay carpetas: crea una abajo',
  'kebab.folderOptions':        'Opciones de la carpeta',
  'kebab.setlistOptions':       'Opciones de la lista',
  'kebab.export':                '⬇ Exportar',
  'kebab.publishCollection':    'Publicar colección…',
  'kebab.deleteFolderKeepSongs':  'Eliminar carpeta (conservar canciones)',
  'kebab.deleteFolderAndSongs':   'Eliminar carpeta y canciones',
  'kebab.liveCollaboration':    'Colaboración en vivo',

  // ── METRONOME ─────────────────────────────────────────────────────────────
  'metronome.toggle':           '♩ Metrónomo',
  'metronome.openTitle':        'Abrir metrónomo',
  'metronome.timeSig':          'Compás',
  'metronome.beat':             'Pulso',
  'metronome.tapTempo':         'Marcar tempo',
  'metronome.tapTempoTitle':    'Toca para marcar el tempo',
  'metronome.start':            '▶︎ Iniciar',
  'metronome.stop':             '■ Detener',
  'metronome.startStopTitle':   'Iniciar / detener',
  'metronome.runningLabel':     '♩ {bpm} BPM ●',

  // ── TUNER ──────────────────────────────────────────────────────────────────
  'tuner.toggle':                '𝄞 Afinador',
  'tuner.toggleTitle':           'Afinador cromático (usa el micrófono)',
  'tuner.panelTitle':            'Afinador cromático',
  'tuner.instrument':            'Instrumento',
  'tuner.primaryInstrument':     'Instrumento principal',
  'tuner.secondaryInstrument':   'Instrumento secundario',
  'tuner.chromatic':             'Cromático',
  'tuner.sensitivity':           'Sensibilidad',
  'tuner.sensitivityHigh':       'Alta (lugares silenciosos)',
  'tuner.sensitivityMedium':     'Media',
  'tuner.sensitivityLow':        'Baja (lugares ruidosos)',
  'tuner.a4reference':           'Referencia A4',
  'tuner.a4standard':            '440 Hz (estándar)',
  'tuner.startListening':        '🎤 Empezar a escuchar',
  'tuner.stopListening':         '⏹︎ Dejar de escuchar',
  'tuner.requiresHttps':         'El micrófono requiere HTTPS: ábrelo desde tu URL https://.',
  'tuner.notAvailable':          'El micrófono no está disponible en este navegador o contexto.',
  'tuner.micDenied':             '⚠ Se negó el acceso al micrófono: {msg}',

  // ── PRINT PANEL ────────────────────────────────────────────────────────────
  'printPanel.print':                   'Imprimir',
  'printPanel.optionsTitle':            'Opciones de impresión',
  'printPanel.panelTitle':              'Opciones de impresión',
  'printPanel.font':                    'Fuente',
  'printPanel.fontChoice':              'Elección de fuente',
  'printPanel.fontDefault':             'Fuentes de la página (definidas por ti)',
  'printPanel.includeDiagrams':         'Incluir diagramas',
  'printPanel.primaryInstrumentNote':   '(instrumento principal)',
  'printPanel.layout':                  'Diseño',
  'printPanel.fitOnePage':              'Ajustar a una página',
  'printPanel.multiColumn':             'Varias columnas',
  'printPanel.reducesBlankSpace':       '(reduce el espacio en blanco)',
  'printPanel.skipChoruses':            'Omitir coros repetidos',
  'printPanel.condensedNote':           '(acordes en línea entre corchetes, más contenido por página)',
  'printPanel.whichTune':               'Qué melodía',
  'printPanel.allTunes':                'Todas las melodías (el set completo)',
  'printPanel.fittingHint':             '¡Meter todo en una sola página con un formato bonito y legible puede ser difícil! Quizás convenga duplicar el archivo de la canción para hacer una versión lista para imprimir, sin información redundante o innecesaria (títulos, textos decorativos, enlaces).',
  'printPanel.printNow':                '🖨 Imprimir ahora',

  // ── THEMES PANEL ─────────────────────────────────────────────────────────
  'themes.panelTitle':           '🎨 Temas',
  'themes.closeTitle':           'Cerrar',
  'themes.presetThemes':         'Temas predefinidos',
  'themes.groupLight':           'Claros',
  'themes.groupDark':            'Oscuros',
  'themes.uiColours':            'Colores de la interfaz',
  'themes.uiBg':                 'Fondo',
  'themes.uiBgAlt':              'Fondo alt.',
  'themes.uiBorder':             'Borde',
  'themes.uiText':               'Texto',
  'themes.uiMuted':              'Texto tenue',
  'themes.accent':               'Acento',
  'themes.songCardColours':      'Colores de la tarjeta de canción',
  'themes.cardBg':               'Fondo de tarjeta',
  'themes.cardText':             'Texto de tarjeta',
  'themes.cardTitle':            'Título de tarjeta',
  'themes.cardArtist':           'Artista de tarjeta',
  'themes.chordText':            'Texto de acordes',
  'themes.backgroundImage':      'Imagen de fondo',
  'themes.imageFile':            'Archivo de imagen',
  'themes.browse':               '📂 Examinar…',
  'themes.none':                 '(ninguna)',
  'themes.imageScale':           'Escala de la imagen',
  'themes.scaleSmall':           'Pequeña (mosaico de 300px)',
  'themes.scaleMedium':          'Mediana (mosaico de 500px)',
  'themes.scaleLarge':           'Grande (mosaico de 800px)',
  'themes.scaleXL':              'XL (mosaico de 1200px)',
  'themes.scaleFullWidth':       'Ancho completo',
  'themes.scaleCover':           'Cubrir (estirar)',
  'themes.scrollWithPage':       'Desplazar con la página',
  'themes.clearImage':           'Quitar imagen',
  'themes.clearBtn':             '✕ Quitar',
  'themes.fonts':                'Fuentes',
  'themes.fontBodyTab':          'Cuerpo / Tablatura',
  'themes.fontChordTokens':      'Acordes',
  'themes.fontSongTitle':        'Título de la canción',
  'themes.fontAppUI':            'Interfaz de la app',
  'themes.displayOptions':       'Opciones de visualización',
  'themes.monoSpacing':          'Espaciado monoespaciado de acordes y letra',
  'themes.monoSpacingTitle':     'Muestra las líneas de acordes y letra en una fuente monoespaciada real para que los acordes queden exactamente sobre su letra',
  'themes.monoSpacingOff':       '⇔ Desactivado',
  'themes.apply':                'Aplicar',
  'themes.saveAsTheme':          'Guardar como tema',
  'themes.resetColours':         'Restablecer colores',
  'themes.resetFonts':           'Restablecer fuentes',
  'themes.export':               '⇩ Exportar temas',
  'themes.exportTitle':          'Descarga tus temas personalizados como un archivo para compartir',
  'themes.import':               '⇧ Importar temas',
  'themes.importTitle':          'Cargar temas personalizados que compartió otra persona',

  // ── SONG/LEAD-SHEET/ABC META PILLS ("Type:", "Key:", ...) ──────────────
  'meta.type':                  'Tipo',
  'meta.key':                   'Tono',
  'meta.time':                  'Compás',
  'meta.tuning':                'Afinación',
  'meta.capo':                  'Cejilla',
  'meta.fret':                  'Traste {n}',
  'meta.style':                 'Estilo',
  'meta.lead':                  'Melodía',

  // ── PLAYBACK (additional) ───────────────────────────────────────────────
  'playbar.pause':               'Pausar',
  'playbar.resume':              'Reanudar',
  'playbar.audioUnavailable':    'No se pudo iniciar el audio. Inténtalo de nuevo o reinicia la app si sigue pasando.',

  // ── LEAD-SHEET EDIT MODE (toolbar, header fields, per-bar menu) ────────
  'lsEdit.style':                     'Estilo',
  'lsEdit.customEllipsis':            'Personalizado…',
  'lsEdit.customStylePlaceholder':    'Nombre del estilo personalizado',
  'lsEdit.composerArtistPlaceholder': 'Compositor / artista',
  'lsEdit.transposeDownTitle':        'Bajar un semitono todos los acordes de esta hoja (permanente)',
  'lsEdit.transposeUpTitle':          'Subir un semitono todos los acordes de esta hoja (permanente)',
  'lsEdit.downloadMsleadTitle':       'Descargar esta hoja guía como archivo .mslead',
  'lsEdit.irealUrlBtn':               '🔗 URL de iReal',
  'lsEdit.irealUrlTitle':             'Copiar esta hoja guía como URL irealb:// (se puede volver a importar aquí o en iReal Pro)',
  'lsEdit.copied':                    '✓ Copiado',
  'lsEdit.publishLeadSheetTitle':     'Publicar esta hoja guía en la biblioteca en línea',
  'lsEdit.collaborateLeadSheetTitle': 'Iniciar o administrar una colaboración en vivo en esta hoja guía',
  'lsEdit.chordViewBracketsTitle':    'Se muestran los acordes en línea entre [corchetes]: haz clic para que floten sobre las palabras',
  'lsEdit.barOptionsTitle':           'Opciones del compás (barras, compás, insertar/eliminar…)',
  'lsEdit.setTimeSig':                'Definir compás',
  'lsEdit.timeColon':                 'Compás: {v}',
  'lsEdit.setTimeSigModalTitle':      'Definir el compás',
  'lsEdit.setSection':                'Definir sección',
  'lsEdit.sectionColon':              'Sección: {v}',
  'lsEdit.setSectionModalTitle':      'Definir marca de sección',
  'lsEdit.sectionLabelField':         'Nombre de la sección',
  'lsEdit.setEnding':                 'Definir final',
  'lsEdit.endingColon':               'Final: {v}',
  'lsEdit.setEndingModalTitle':       'Definir número de final',
  'lsEdit.endingField':               'Final (p. ej. 1, 2)',
  'lsEdit.openRepeat':                'Inicio de repetición',
  'lsEdit.openRepeatOn':              '✓ Inicio de repetición',
  'lsEdit.closeRepeat':               'Fin de repetición',
  'lsEdit.closeRepeatOn':             '✓ Fin de repetición',
  'lsEdit.doubleBarEnd':              'Doble barra (final)',
  'lsEdit.doubleBarEndOn':            '✓ Doble barra (final)',
  'lsEdit.doubleBarStart':            'Doble barra (inicio)',
  'lsEdit.doubleBarStartOn':          '✓ Doble barra (inicio)',
  'lsEdit.finalBarline':              'Barra final',
  'lsEdit.finalBarlineOn':            '✓ Barra final',
  'lsEdit.insertBarBefore':           'Insertar compás antes',
  'lsEdit.insertBarAfter':            'Insertar compás después',
  'lsEdit.insertBarsModalTitle':      '¿Cuántos compases quieres insertar?',
  'lsEdit.insertBarsCountField':      'Cantidad de compases',
  'lsEdit.deleteBar':                 'Eliminar compás',

  // ── COLLECTIONS (submenu list content) ──────────────────────────────────
  'collections.communityDesc':          'Colecciones compartidas por otros usuarios de Magic Scroll.',
  'collections.requiresHttp':           'Las colecciones requieren un servidor HTTP.',
  'collections.noBuiltin':              'No hay colecciones incluidas disponibles.',
  'collections.manifestLoadFailed':     'No se pudo cargar el índice de colecciones.',
  'collections.communityNotConfigured': 'La biblioteca de la comunidad no está configurada en esta versión.',
  'collections.noMatching':             'No hay colecciones que coincidan.',
  'collections.noneYet':                'Todavía no hay colecciones de la comunidad. ¡Sé el primero en publicar una!',
  'collections.communityUnreachable':   'No se pudo conectar con la biblioteca de la comunidad.',
  'collections.unnamed':                'Sin nombre',
  'collections.songCount':              '{n} canciones',
  'collections.songCountOne':           '{n} canción',
  'collections.contains':               'Contiene: {list}',
  'collections.moreCount':              ' +{n} más',
  'collections.add':                    '+ Agregar',
  'collections.adding':                 'Agregando…',
  'collections.added':                  '✓ Agregada',
  'collections.addedCount':             '✓ Agregadas ({n})',
  'collections.alreadyInLibrary':       'Ya está en la biblioteca',
  'collections.failed':                 'Falló',
  'collections.defaultFolderName':      'Colección',

  // ── SHARE (native share-sheet, toolbar + kebab menu) ────────────────────
  'share.button':                'Compartir…',
  'share.buttonTitle':           'Compartir esto con otra app',
  'share.defaultMessage':        '¡Te comparto un poco de música con Magic Scroll!',
  'share.fallbackDownloaded':    'Se descargó {filename} (compartir no está disponible en este dispositivo)',
  'download.toast':              'Descargado: {filename}',

  // ── MULTI-PART SHEET MUSIC (MuseScore/MusicXML imports with >1 instrument) ─
  'sheetmusic.partFallback':     'Parte {n}',

  // ── INSTRUMENT CATEGORIES (Chord Diagrams instrument tabs) ──────────────
  // Tuning names (DADGAD, Open G, Cross-tuned GDGD, ...) stay untranslated
  // on purpose — see strings-en.js.
  'instCat.guitar':              'Guitarra',
  'instCat.ukulele':             'Ukelele',
  'instCat.banjo':                'Banjo',
  'instCat.mandolin':            'Mandolina',
  'instCat.folk':                'Folk',
  'instCat.concertina':          'Concertina',
  'instCat.melodeon':            'Acordeón diatónico',
  'instCat.piano':                'Piano',
};

// ── Active language ──────────────────────────────────────────────────────
// Merged into strings-en.js's _activeDict()/t()/setLanguage() — this file
// only needs to define the dictionary itself; see strings-en.js for the
// shared machinery (window.MS_LANG, t(), setLanguage()).

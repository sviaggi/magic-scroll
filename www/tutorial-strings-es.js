/**
 * tutorial-strings-es.js — Magic Scroll GUIDED TUTORIAL copy (Latin American
 * Spanish, "es-419").
 * Sibling to tutorial-strings-en.js — same keys, Spanish text. See that
 * file's header for the full explanation of why this file exists, how it's
 * wired in, key-naming convention, and editing instructions; only the
 * essentials are repeated here.
 *
 * Defines window.MS_TUTORIAL_STRINGS_ES. Loaded via
 * <script src="tutorial-strings-es.js"> alongside -en.js/-fr.js/-zh.js,
 * before tutorial.js. tutorial.js's tt() reads this dictionary when
 * window.MS_LANG === 'es-419', falling back to English on any key missing
 * here — but keep this file's key set identical to tutorial-strings-en.js.
 *
 * Register: informal "tú", Latin American vocabulary, no vosotros forms.
 * Keep <strong>/<code> tags on the words they wrap in English.
 */
window.MS_TUTORIAL_STRINGS_ES = {

  // UI CHROME
  'ui.stepProgress': 'Paso {n} de {total}',
  'ui.next': 'Siguiente',
  'ui.back': 'Atrás',
  'ui.done': 'Listo',
  'ui.hintClick': 'Haz clic en el control resaltado para continuar.',
  'ui.hintClickSkippable': 'Haz clic en el control resaltado para continuar, o en Siguiente para saltar este paso.',
  'ui.dontShow': 'No volver a mostrar los mensajes del tutorial',
  'ui.closeTitle': 'Cerrar tutorial',
  'ui.tutorialsTitle': '🎓 Tutoriales',
  'ui.guidedTours': 'Recorridos guiados',
  'ui.settingsSection': 'Ajustes',
  'ui.showPopups': 'Mostrar mensajes del tutorial',
  'ui.triggerTitle': 'Volver a ver los tutoriales guiados',
  'ui.triggerLabel': '🎓 Tutoriales',

  // FIRST-RUN BANNER
  'banner.title': '¿Eres nuevo en Magic Scroll?',
  'banner.body': 'Haz un recorrido rápido por lo básico: biblioteca, acordes y opciones.',
  'banner.start': 'Hacer el recorrido',
  'banner.later': 'Quizás después',
  'banner.never': 'No volver a mostrar esto',

  // CONTEXTUAL BANNERS
  'ctx.sheetMusic.title': 'Partitura abierta',
  'ctx.sheetMusic.body': '¿Quieres un recorrido rápido por la barra de herramientas de partituras?',
  'ctx.leadSheets.title': 'Hoja guía abierta',
  'ctx.leadSheets.body': '¿Quieres un recorrido rápido por la barra de herramientas de hojas guía?',
  'ctx.start': 'Muéstrame',
  'ctx.dismiss': 'No, gracias',

  // FLOW PICKER
  'flow.generalUsage.label': 'Uso general',
  'flow.generalUsage.desc': 'Acordes, desplazamiento automático, biblioteca y opciones',
  'flow.addingSongs.label': 'Agregar canciones',
  'flow.addingSongs.desc': 'Importa un archivo o escribe una desde cero',
  'flow.sheetMusic.label': 'Partituras',
  'flow.sheetMusic.desc': 'Notación real con ABC, barra de herramientas y edición',
  'flow.leadSheets.label': 'Hojas guía',
  'flow.leadSheets.desc': 'Cuadrículas de acordes al estilo iReal Pro',

  // GENERAL USAGE
  'generalUsage.welcome.title': 'Bienvenido a Magic Scroll',
  'generalUsage.welcome.body': 'Una vuelta rápida por la app, en menos de un minuto. Puedes repetir este recorrido, o cualquiera de los otros, desde Opciones → Tutoriales cuando quieras.',
  'generalUsage.sidebar.title': 'Tu biblioteca',
  'generalUsage.sidebar.body': 'Haz clic aquí para abrir tu biblioteca: todas las canciones y melodías que agregaste, con la búsqueda arriba y un botón de Colecciones abajo para cancioneros que se pueden compartir.',
  'generalUsage.collections.title': 'Colecciones de la comunidad',
  'generalUsage.collections.body': 'Haz clic aquí para explorar colecciones seleccionadas y de la comunidad, y agregar cualquiera directo a tu biblioteca: una forma rápida de llenarla más allá de lo que escribes o importas tú.',
  'generalUsage.dropzone.title': 'Agregar canciones',
  'generalUsage.dropzone.body': 'Arrastra un archivo directo a esta zona para importarlo, o haz clic en <strong>✦ Nueva</strong> debajo para escribir una desde cero. Hay un tutorial completo sobre esto: Opciones → Tutoriales → Agregar canciones.',
  'generalUsage.chords.title': 'Pestaña Acordes',
  'generalUsage.chords.body': 'Haz clic aquí para abrir las herramientas de tono, transposición y diagramas de acordes de la canción que tengas abierta.',
  'generalUsage.keygroup.title': 'Tono y transposición',
  'generalUsage.keygroup.body': 'Magic Scroll detecta el tono de la canción automáticamente. Súbelo o bájalo un semitono con ♭−/♯+, o toca <strong>Diagramas de acordes</strong> aquí cerca para ver digitaciones en cualquier instrumento.',
  'generalUsage.options.title': 'Pestaña Opciones',
  'generalUsage.options.body': 'Haz clic aquí: aquí están el tamaño del texto, el interlineado, el idioma y la personalización completa del tema.',
  'generalUsage.size.title': 'Comodidad de lectura',
  'generalUsage.size.body': 'Ajusta aquí el tamaño del texto y el interlineado, y explora colores, fuentes e imagen de fondo en <strong>Temas</strong>, aquí cerca.',
  'generalUsage.tutorials.title': 'Estás aquí',
  'generalUsage.tutorials.body': 'Este recorrido, y los de Agregar canciones, Partituras y Hojas guía, están todos aquí. Repite cualquiera cuando quieras, o desactiva los mensajes del tutorial para siempre.',
  'generalUsage.scroll.title': 'Desplazamiento automático',
  'generalUsage.scroll.body': 'Lectura con manos libres: presiona Desplazar para empezar y mueve el control deslizante para ajustar el ritmo.',
  'generalUsage.done.title': 'Eso es lo básico',
  'generalUsage.done.body': 'Explora Agregar canciones, Partituras y Hojas guía desde Opciones → Tutoriales cuando estés listo. ¡Que lo disfrutes!',

  // ADDING SONGS
  'addingSongs.intro.title': 'Agregar una canción o melodía',
  'addingSongs.intro.body': 'Hay dos formas: arrastrar un archivo a la barra lateral, o abrir el formulario de Nueva canción y pegarla o escribirla.',
  'addingSongs.sidebar.title': 'Abre tu biblioteca',
  'addingSongs.sidebar.body': 'Haz clic aquí para abrir la barra lateral: ahí viven tus canciones y ahí vas a soltar los archivos.',
  'addingSongs.choose.title': 'Dos formas de agregar una canción',
  'addingSongs.choose.body': 'Arrastra un archivo a la zona resaltada (o haz clic en ella para buscar entre tus archivos), o haz clic en <strong>✦ Nueva</strong> para escribir una desde cero. Prueba cualquiera de las dos.',
  'addingSongs.dropzoneDone.title': '¡Muy bien!',
  'addingSongs.dropzoneDone.body': 'Cuando eliges un archivo, Magic Scroll lo agrega a tu biblioteca automáticamente. También puedes empezar siempre una canción en blanco con <strong>✦ Nueva</strong>, al final de la barra lateral.',
  'addingSongs.nstype.title': 'Elige un formato',
  'addingSongs.nstype.body': '<strong>Canción / Cancionero de acordes</strong> para letras con acordes, <strong>Notación ABC</strong> para partituras reales, o cualquiera de las opciones de iReal para hojas guía estilo jazz. Los tutoriales de Partituras y Hojas guía explican esos dos con más detalle.',
  'addingSongs.openEditor.title': 'Créala',
  'addingSongs.openEditor.body': 'Escribe un título arriba y luego haz clic en <strong>Abrir editor</strong> para crear la canción y empezar a escribirla de inmediato. (Cancelar cierra esto sin guardar nada, si prefieres parar aquí).',
  'addingSongs.format.title': 'Solo empieza a escribir',
  'addingSongs.format.body': 'Escribe o pega tu letra en el editor de abajo. El botón <strong>🎯 Agregar acordes</strong> de arriba (lo vemos a continuación) te deja tocar una palabra para ponerle un acorde cuando ya tengas algo que marcar. Los cancioneros antiguos de dos líneas, con los acordes en su propia línea, también se pegan sin problema.',
  'addingSongs.addChordsOn.title': 'Asigna acordes a tu letra',
  'addingSongs.addChordsOn.body': 'Haz clic en <strong>🎯 Agregar acordes</strong> para entrar al modo de marcado de acordes: cada palabra de tu letra se vuelve clicable.',
  'addingSongs.addChordsUsage.title': 'Agrega tus acordes',
  'addingSongs.addChordsUsage.body': 'Toca cualquier palabra de arriba para ponerle un acorde, o toca un acorde existente para editarlo o quitarlo. Prueba agregar algunos y luego haz clic en Siguiente cuando quieras desactivar el modo de marcado.',
  'addingSongs.addChordsOff.title': 'De vuelta a escribir normal',
  'addingSongs.addChordsOff.body': 'Haz clic otra vez en <strong>🎯 Agregar acordes</strong> para desactivar el modo de marcado y volver a escribir normalmente. Actívalo y desactívalo cuando quieras pasar de escribir la letra a colocar acordes.',
  'addingSongs.toolbar.title': 'Compartir y colaborar',
  'addingSongs.toolbar.body': '<strong>📤 Compartir ▾</strong> envía esta canción a otra app, la descarga como archivo, la publica en la biblioteca en línea o exporta un cancionero clásico en monoespaciado. <strong>🔗 Colaborar</strong> inicia una sesión en vivo: comparte el código que te da y quien se una podrá editar contigo en tiempo real. (Esta ya es una canción real en tu biblioteca, sin importar cómo llegaste aquí. Cámbiale el nombre, sigue trabajándola o elimínala si no la necesitas).',
  'addingSongs.done.title': 'Ese es el editor de canciones',
  'addingSongs.done.body': 'Ahora explora Partituras y Hojas guía desde Opciones → Tutoriales. Cada una tiene su propio editor con sus propios trucos.',

  // SHEET MUSIC
  'sheetMusic.intro.title': 'Partituras (notación ABC)',
  'sheetMusic.intro.body': 'Las canciones con partitura muestran notación musical real en lugar de acordes y letra: ideales para melodías, piezas clásicas y todo lo que conviene leer en vez de tocar de oído. Abre o crea una canción en notación ABC para ver en acción la barra de herramientas de abajo.',
  'sheetMusic.toolbar.title': 'La barra de herramientas de partituras',
  'sheetMusic.toolbar.body': 'Aparece arriba de cualquier canción en notación ABC. <strong>Editar</strong> cambia a la notación en bruto; <strong>Partitura ▾</strong> reúne las opciones de reproducción, soundfont, digitación de flauta y nombres de notas.',
  'sheetMusic.edit.title': 'Edita la notación',
  'sheetMusic.edit.body': 'Haz clic en Editar para ver y cambiar directamente el texto ABC. Las letras A–G son notas, | marca las barras de compás y los cifrados de acordes van entre comillas sobre una nota, p. ej. "G7". Aquí también está la transposición permanente, que vemos a continuación.',
  'sheetMusic.menu.title': 'Opciones de partitura',
  'sheetMusic.menu.body': 'Carga un soundfont personalizado para la reproducción, muestra la digitación de tin whistle o el nombre de cada nota debajo de ella.',
  'sheetMusic.transpose.title': 'Transponer',
  'sheetMusic.transpose.body': 'Sube o baja toda la pieza, reescribiendo cada nota de forma permanente (sin volver a escribir nada). ¿Prefieres no tocar la notación? La pestaña <strong>🎵 Acordes</strong> de la barra superior tiene su propio ♭−/♯+ que solo transpone lo que se muestra, sin cambiar nada guardado.',
  'sheetMusic.createSet.title': 'Crear un set',
  'sheetMusic.createSet.body': 'Haz clic en Crear set para apilar otras melodías de tu biblioteca justo después de esta. Marca las que quieras; el orden en que las marcas es el orden en que se tocan. Mostrar set las abre juntas, una tras otra, como un set de sesión.',
  'sheetMusic.done.title': 'Cómo agregar partituras',
  'sheetMusic.done.body': 'Empieza una con <strong>✦ Nueva → Notación ABC</strong> y pega el texto ABC, o arrastra un archivo .abc, .mxl o .mscz. Los archivos de MuseScore se convierten automáticamente.',

  // LEAD SHEETS
  'leadSheets.intro.title': 'Hojas guía (estilo iReal Pro)',
  'leadSheets.intro.body': 'Un formato compacto de cuadrícula de acordes para estándares de jazz y cifrados rápidos, el mismo estilo que usa iReal Pro. Abre o crea una hoja guía para ver en acción la barra de herramientas de abajo.',
  'leadSheets.toolbar.title': 'La barra de herramientas de hojas guía',
  'leadSheets.toolbar.body': 'Aparece arriba de cualquier hoja guía, con opciones de estilo de reproducción, tono y para compartir.',
  'leadSheets.edit.title': 'Activa la edición',
  'leadSheets.edit.body': 'Haz clic en Editar para pasar esta hoja al modo de edición. Las celdas de acordes de abajo solo responden a los clics cuando está activado. Vuelve a hacer clic más tarde (o en Guardar, como se llama una vez activo) para fijar los cambios.',
  'leadSheets.content.title': 'Editar una hoja',
  'leadSheets.content.body': 'Ahora que la edición está activada, toca cualquier celda de acorde para cambiarla directamente, o usa su menú ⋮ para repeticiones, finales y otra notación de cifrado de jazz.',
  'leadSheets.done.title': 'Cómo agregar una hoja guía',
  'leadSheets.done.body': 'Empieza una en blanco con <strong>✦ Nueva → 🎼 Hoja guía (en blanco)</strong>, o pega un enlace <code>irealb://</code> con <strong>🎼 Hoja(s) guía (URL de iReal Pro)</strong>. Funcionan tanto melodías sueltas como listas de reproducción completas.'
};

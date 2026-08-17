/**
 * tutorial-strings-fr.js — Magic Scroll GUIDED TUTORIAL copy (French).
 * Sibling to tutorial-strings-en.js — same keys, French text. See that
 * file's header for the full explanation of why this file exists, how it's
 * wired in, key-naming convention, and editing instructions; only the
 * essentials are repeated here.
 *
 * Defines window.MS_TUTORIAL_STRINGS_FR. Loaded via
 * <script src="tutorial-strings-fr.js"> alongside -en.js/-zh.js, before
 * tutorial.js, in the dev HTML. tutorial.js's tt() reads this dictionary
 * when window.MS_LANG === 'fr', falling back to English on any key missing
 * here (so it is SAFE to leave a key untranslated temporarily — it just
 * shows English text until someone fills it in — but do not remove a key
 * that exists in tutorial-strings-en.js, and do not add one that doesn't;
 * keep the two files' key sets identical).
 *
 * A NOTE ON <strong>/<code> — keep any translation's tags on the words they
 * wrap in English, not necessarily the same position in the sentence —
 * French grammar can reorder around them.
 */
window.MS_TUTORIAL_STRINGS_FR = {

  // UI CHROME
  'ui.stepProgress': 'Étape {n} sur {total}',
  'ui.next': 'Suivant',
  'ui.back': 'Précédent',
  'ui.done': 'Terminé',
  'ui.hintClick': 'Cliquez sur l’élément mis en évidence pour continuer.',
  'ui.hintClickSkippable': 'Cliquez sur l’élément mis en évidence pour continuer, ou sur Suivant pour passer cette étape.',
  'ui.dontShow': 'Ne plus afficher les pop-ups de tutoriel',
  'ui.closeTitle': 'Fermer le tutoriel',
  'ui.tutorialsTitle': '🎓 Tutoriels',
  'ui.guidedTours': 'Visites guidées',
  'ui.settingsSection': 'Paramètres',
  'ui.showPopups': 'Afficher les pop-ups de tutoriel',
  'ui.triggerTitle': 'Revoir les tutoriels guidés',
  'ui.triggerLabel': '🎓 Tutoriels',

  // FIRST-VISIT WELCOME BANNER
  'banner.title': 'Nouveau sur Magic Scroll ?',
  'banner.body': 'Faites un tour rapide des bases : bibliothèque, accords et options.',
  'banner.start': 'Découvrir',
  'banner.later': 'Plus tard',
  'banner.never': 'Ne plus afficher ce message',

  // CONTEXTUAL NUDGE BANNERS
  'ctx.sheetMusic.title': 'Partition ouverte',
  'ctx.sheetMusic.body': 'Envie d’une visite rapide de la barre d’outils de partition ?',
  'ctx.leadSheets.title': 'Grille ouverte',
  'ctx.leadSheets.body': 'Envie d’une visite rapide de la barre d’outils de grille d’accords ?',
  'ctx.start': 'Montrez-moi',
  'ctx.dismiss': 'Non merci',

  // FLOW METADATA
  'flow.generalUsage.label': 'Utilisation générale',
  'flow.generalUsage.desc': 'Accords, défilement automatique, bibliothèque et options',
  'flow.addingSongs.label': 'Ajouter des chansons',
  'flow.addingSongs.desc': 'Importer un fichier ou en écrire un nouveau',
  'flow.sheetMusic.label': 'Partition',
  'flow.sheetMusic.desc': 'Vraie notation via ABC — barre d’outils et édition',
  'flow.leadSheets.label': 'Grilles d’accords',
  'flow.leadSheets.desc': 'Grilles d’accords façon iReal Pro',

  // GENERAL USAGE FLOW
  'generalUsage.welcome.title': 'Bienvenue sur Magic Scroll',
  'generalUsage.welcome.body': 'Un petit tour rapide de l’application — moins d’une minute. Vous pouvez le refaire, comme les autres visites, depuis Options → Tutoriels quand vous voulez.',
  'generalUsage.sidebar.title': 'Votre bibliothèque',
  'generalUsage.sidebar.body': 'Cliquez ici pour ouvrir votre bibliothèque — toutes les chansons et morceaux que vous avez ajoutés, avec la recherche en haut et un bouton Collections en bas pour des recueils partageables.',
  'generalUsage.collections.title': 'Collections communautaires',
  'generalUsage.collections.body': 'Cliquez ici pour parcourir des collections de chansons sélectionnées ou communautaires et en ajouter directement à votre bibliothèque — un moyen rapide de l’enrichir au-delà de ce que vous tapez ou importez vous-même.',
  'generalUsage.dropzone.title': 'Ajouter des chansons',
  'generalUsage.dropzone.body': 'Glissez un fichier directement dans cette zone pour l’importer, ou cliquez sur <strong>✦ Nouveau</strong> juste en dessous pour en écrire une de zéro. Il y a un tutoriel complet là-dessus — Options → Tutoriels → Ajouter des chansons.',
  'generalUsage.chords.title': 'Onglet Accords',
  'generalUsage.chords.body': 'Cliquez ici pour ouvrir les outils de tonalité, de transposition et de diagrammes d’accords pour la chanson en cours.',
  'generalUsage.keygroup.title': 'Tonalité et transposition',
  'generalUsage.keygroup.body': 'Magic Scroll détecte automatiquement la tonalité de la chanson. Ajustez-la d’un demi-ton avec ♭−/♯+, ou touchez <strong>Diagrammes d’accords</strong> juste à côté pour des schémas de doigté pour n’importe quel instrument.',
  'generalUsage.options.title': 'Onglet Options',
  'generalUsage.options.body': 'Cliquez ici — c’est là que se trouvent la taille du texte, l’interligne, la langue et toute la personnalisation des thèmes.',
  'generalUsage.size.title': 'Confort de lecture',
  'generalUsage.size.body': 'Réglez la taille du texte et l’interligne ici, et explorez les couleurs, les polices et une image de fond sous <strong>Thèmes</strong> juste à côté.',
  'generalUsage.tutorials.title': 'Vous y êtes',
  'generalUsage.tutorials.body': 'Cette visite, ainsi que celles pour Ajouter des chansons, Partition et Grilles d’accords, se trouvent toutes ici — refaites-les quand vous voulez, ou désactivez les pop-ups de tutoriel pour de bon.',
  'generalUsage.scroll.title': 'Défilement automatique',
  'generalUsage.scroll.body': 'Lecture mains libres — appuyez sur Défilement pour démarrer, et faites glisser le curseur pour régler la vitesse.',
  'generalUsage.done.title': 'Voilà l’essentiel',
  'generalUsage.done.body': 'Découvrez Ajouter des chansons, Partition et Grilles d’accords depuis Options → Tutoriels quand vous serez prêt·e. Amusez-vous bien !',

  // ADDING SONGS FLOW
  'addingSongs.intro.title': 'Ajouter une chanson ou un morceau',
  'addingSongs.intro.body': 'Deux façons de faire : glisser un fichier dans la barre latérale, ou ouvrir le formulaire Nouvelle chanson et coller ou taper le contenu. Voyons les deux.',
  'addingSongs.sidebar.title': 'Ouvrez votre bibliothèque',
  'addingSongs.sidebar.body': 'Cliquez ici pour ouvrir la barre latérale — c’est là que vivent les chansons, et où vous déposerez vos fichiers.',
  'addingSongs.choose.title': 'Deux façons d’ajouter une chanson',
  'addingSongs.choose.body': 'Glissez un fichier sur la zone de dépôt mise en évidence (ou cliquez dessus pour parcourir vos fichiers), ou cliquez sur <strong>✦ Nouveau</strong> pour en écrire une de zéro — essayez l’une des deux.',
  'addingSongs.dropzoneDone.title': 'Parfait !',
  'addingSongs.dropzoneDone.body': 'Une fois un fichier choisi, Magic Scroll l’ajoute automatiquement à votre bibliothèque. Vous pouvez aussi toujours commencer une chanson vierge avec <strong>✦ Nouveau</strong> en bas de la barre latérale.',
  'addingSongs.nstype.title': 'Choisissez un format',
  'addingSongs.nstype.body': '<strong>Chanson / Grille d’accords</strong> pour des paroles avec accords, <strong>Notation ABC</strong> pour une vraie partition, ou l’une des options iReal pour des grilles façon jazz. Les tutoriels Partition et Grilles d’accords approfondissent ces deux-là.',
  'addingSongs.format.title': 'Il suffit de commencer à taper',
  'addingSongs.format.body': 'Collez ou tapez vos paroles dans l’éditeur ci-dessous — le bouton <strong>🎯 Ajouter des accords</strong> juste au-dessus (à venir) vous permet de toucher un mot pour y déposer un accord une fois que vous avez de quoi en marquer. Les anciennes grilles à deux lignes, avec les accords sur leur propre ligne, se collent bien aussi.',
  'addingSongs.openEditor.title': 'Créez-la',
  'addingSongs.openEditor.body': 'Renseignez un titre ci-dessus, puis cliquez sur <strong>Ouvrir l’éditeur</strong> pour créer la chanson et commencer à l’écrire directement. (Annuler ferme cette fenêtre sans rien enregistrer, si vous préférez vous arrêter là.)',
  'addingSongs.addChordsOn.title': 'Associez des accords à vos paroles',
  'addingSongs.addChordsOn.body': 'Cliquez sur <strong>🎯 Ajouter des accords</strong> pour passer en mode d’association d’accords — chaque mot de vos paroles devient cliquable.',
  'addingSongs.addChordsUsage.title': 'Ajoutez vos accords',
  'addingSongs.addChordsUsage.body': 'Touchez n’importe quel mot ci-dessus pour y déposer un accord, ou touchez un accord existant pour le modifier ou le supprimer. Essayez d’en ajouter quelques-uns — cliquez sur Suivant quand vous êtes prêt·e à redésactiver le mode d’association.',
  'addingSongs.addChordsOff.title': 'Retour à la saisie normale',
  'addingSongs.addChordsOff.body': 'Cliquez à nouveau sur <strong>🎯 Ajouter des accords</strong> pour désactiver le mode d’association et revenir à la saisie normale — activez-le et désactivez-le à volonté selon que vous tapez des paroles ou placez des accords.',
  'addingSongs.toolbar.title': 'Partage et collaboration',
  'addingSongs.toolbar.body': '<strong>📤 Partager ▾</strong> envoie cette chanson vers une autre application, la télécharge en fichier, la publie dans la bibliothèque en ligne, ou exporte une grille d’accords classique en espacement fixe. <strong>🔗 Collaborer</strong> démarre une session en direct — partagez le code fourni, et quiconque le rejoint peut modifier la chanson en même temps que vous. (Que cette chanson soit celle que vous aviez déjà ouverte ou une que cette visite vient de créer, c’est une vraie chanson dans votre bibliothèque — renommez-la, continuez à la développer, ou supprimez-la si vous n’en avez pas besoin.)',
  'addingSongs.done.title': 'Voilà pour l’éditeur de chansons',
  'addingSongs.done.body': 'Découvrez ensuite Partition et Grilles d’accords depuis Options → Tutoriels — chacun a son propre éditeur et ses propres astuces.',

  // SHEET MUSIC FLOW
  'sheetMusic.intro.title': 'Partition (notation ABC)',
  'sheetMusic.intro.body': 'Les chansons en partition affichent une vraie notation musicale, pas seulement des accords et des paroles — idéal pour les airs, les morceaux classiques, et tout ce qui se lit mieux qu’il ne se joue à l’oreille. Ouvrez ou créez une chanson en notation ABC pour voir la barre d’outils ci-dessous en action.',
  'sheetMusic.toolbar.title': 'La barre d’outils de partition',
  'sheetMusic.toolbar.body': 'Elle apparaît au-dessus de toute chanson en notation ABC. <strong>Modifier</strong> bascule vers la notation brute ; <strong>Partition ▾</strong> regroupe la lecture, les soundfonts, les tablatures de tin whistle et les noms de notes.',
  'sheetMusic.edit.title': 'Modifier la notation',
  'sheetMusic.edit.body': 'Cliquez sur Modifier pour voir et changer directement le texte ABC brut — les lettres A à G sont des notes, | marque les barres de mesure, et les symboles d’accords se placent entre guillemets au-dessus d’une note, par ex. « G7 ». C’est aussi là que se trouve la transposition permanente, juste après.',
  'sheetMusic.menu.title': 'Options de partition',
  'sheetMusic.menu.body': 'Chargez un soundfont personnalisé pour la lecture, affichez les tablatures de doigté pour tin whistle, ou révélez le nom de la note sous chaque note.',
  'sheetMusic.transpose.title': 'Transposer',
  'sheetMusic.transpose.body': 'Décalez tout le morceau vers le haut ou le bas, en réécrivant chaque note de façon permanente — sans rien retaper. Vous préférez ne pas toucher à la notation elle-même ? L’onglet <strong>🎵 Accords</strong> de la barre supérieure a son propre ♭−/♯+ qui transpose uniquement l’affichage, sans rien changer d’enregistré.',
  'sheetMusic.createSet.title': 'Créer un ensemble',
  'sheetMusic.createSet.body': 'Cliquez sur Créer un ensemble pour enchaîner d’autres morceaux de votre bibliothèque juste après celui-ci. Cochez ceux que vous voulez : l’ordre dans lequel vous les cochez est celui dans lequel ils joueront. Afficher l’ensemble les ouvre ensemble, à la suite, comme un ensemble de session.',
  'sheetMusic.done.title': 'Importer une partition',
  'sheetMusic.done.body': 'Créez-en une via <strong>✦ Nouveau → Notation ABC</strong> et collez du texte ABC, ou glissez un fichier .abc, .mxl ou .mscz — les fichiers MuseScore se convertissent automatiquement.',

  // LEAD SHEETS FLOW
  'leadSheets.intro.title': 'Grilles d’accords (façon iReal Pro)',
  'leadSheets.intro.body': 'Un format compact en grille d’accords pour les standards de jazz et les grilles rapides — le même style qu’utilise iReal Pro. Ouvrez ou créez une grille pour voir la barre d’outils ci-dessous en action.',
  'leadSheets.toolbar.title': 'La barre d’outils de grille',
  'leadSheets.toolbar.body': 'Elle apparaît au-dessus de toute grille d’accords, avec des options de style de lecture, de tonalité et de partage.',
  'leadSheets.edit.title': 'Activez la modification',
  'leadSheets.edit.body': 'Cliquez sur Modifier pour passer cette grille en mode édition — les cases d’accords ci-dessous ne répondent aux clics qu’une fois ce mode activé. Cliquez à nouveau dessus plus tard (ou sur Enregistrer, son intitulé une fois actif) pour verrouiller vos changements.',
  'leadSheets.content.title': 'Modifier une grille',
  'leadSheets.content.body': 'Maintenant que la modification est activée, touchez n’importe quelle case d’accord pour la changer directement, ou utilisez son menu ⋮ pour les reprises, les finals et les autres notations de grille jazz.',
  'leadSheets.done.title': 'Importer une grille d’accords',
  'leadSheets.done.body': 'Créez-en une vierge via <strong>✦ Nouveau → 🎼 Grille (vierge)</strong>, ou collez un lien <code>irealb://</code> via <strong>🎼 Grille(s) (URL iReal Pro)</strong> — les morceaux seuls et les playlists complètes fonctionnent tous les deux.'
};

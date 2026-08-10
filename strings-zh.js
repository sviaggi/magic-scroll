/**
 * strings-zh.js — Magic Scroll user-facing text (Simplified Chinese / 中文).
 *
 * Same keys as strings-en.js, translated. See that file's header comment for
 * how this is wired in (window.MS_STRINGS_ZH, window.setLanguage(), the
 * #lang-sel dropdown in Options). A key missing here silently falls back to
 * the English string via t()'s lookup, so this file can be a partial
 * translation without anything looking broken — it just isn't, currently:
 * every key in strings-en.js has a translation below as of this pass.
 *
 * {name}/{count}/{filename}/{message}/{title}/{plural} tokens are left
 * exactly as-is — t() substitutes them at runtime regardless of language, so
 * they must appear verbatim (same spelling, same braces) in each dictionary.
 */
window.MS_STRINGS_ZH = {

  // ── TOPBAR ─────────────────────────────────────────────────────────────
  'topbar.library':            '☰ 曲库',
  'topbar.chords':             '🎵 和弦',
  'topbar.key':                '调',
  'topbar.transposeDown':      '降低半音移调',
  'topbar.transposeUp':        '升高半音移调',
  'topbar.transposeReset':     '恢复原调',
  'topbar.simplifyChords':     '简化和弦',
  'topbar.simplifyChordsTitle':'将所有和弦简化为根音形式',
  'topbar.size':                '字号',
  'topbar.lineSpacing':         '行距',
  'topbar.lineSpacingTitle':    '歌曲与主调谱文本的行距',
  'topbar.themes':              '主题',
  'topbar.themesTitle':         '自定义主题、颜色、字体与背景',
  'topbar.scroll':              '▶︎ 滚动',
  'topbar.scrollStop':          '■ 停止',

  // ── SIDEBAR ────────────────────────────────────────────────────────────
  'sidebar.searchPlaceholder':  '搜索…',
  'sidebar.multiselectTitle':   '多选歌曲',
  'sidebar.filterTitle':        '按类型筛选',

  // ── SONG/CHORD-SHEET EDITOR ────────────────────────────────────────────
  'editor.addChords':           '🎯 添加和弦',
  'editor.addChordsTitle':      '将和弦精确标注到字词或音节上，而不必手动对齐',
  'editor.bold':                '粗体 (**文字**)',
  'editor.italic':              '斜体 (*文字*)',
  'editor.underline':           '下划线 (_文字_)',
  'editor.embed':               '⧉ 嵌入…',
  'editor.embedTitle':          '嵌入视频或链接',
  'editor.precisionHint':       '点击想要添加和弦的字词（或位置），然后在弹出的输入框中输入和弦。点击已有的和弦可以编辑或删除它。',
  'editor.editToggle':          '✎ 编辑',
  'editor.editToggleTitle':     '在编辑模式与阅读模式之间切换',
  'editor.cancel':              '✕ 取消',
  'editor.cancelTitle':         '放弃自进入编辑模式以来所做的所有更改',
  'editor.save':                '💾 保存',
  'editor.saveTitle':           '保存对这首歌曲的更改 (Ctrl+S)',
  'editor.saveAs':              '⬇ 另存为…',
  'editor.publish':             '☁ 发布',
  'editor.exportMonospace':     '⬇ 导出等宽文本',
  // Placeholder / example text shown inside empty fields — these are what a
  // user sees BEFORE they've typed anything, so they need translating same
  // as any other visible copy.
  'editor.titlePlaceholder':    '歌曲标题',
  'editor.artistPlaceholder':   '演唱者/作者',
  'editor.keyPlaceholder':      '例如 Am',
  'editor.timeSigPlaceholder':  '例如 4/4',
  'editor.songPlaceholder': '在此粘贴或输入你的歌曲。\n\n[主歌]\n输入歌词……慢慢来，把词写对\n不用对齐列，不用标尺，无需费心\n点击上方的"添加和弦"，选择合适的位置\n无论词语、间隔，处处皆可标注\n\n[副歌]\n[G]就像这样，一个和弦 [D] 或一次扫弦，随你需要的地方[D]\nC                                D                                      Em                     G\n排版效果真漂亮！是不是很清晰？\n又快又简单，而且免费（不收一分钱！）\n希望你喜欢使用 Magic Scroll！',

  // ── LEAD-SHEET EDITOR ──────────────────────────────────────────────────
  'editor.lsHint': '编辑中 — 在上方修改标题、作者、风格、BPM 和拍号；点击一个小节可修改其和弦，或使用其 ⋮ 菜单设置小节线、乐曲中途的拍号变化、段落标记，以及插入/删除小节。'
    + '和弦简写：b/# 表示降/升号（Bb、F#）· m 或 - 表示小调（Dm）· maj7 或 ^ 表示大七和弦（Cmaj7）· 7 表示属七和弦（G7）· sus2/sus4 表示挂留和弦 · dim 或 o 表示减和弦 · aug 或 + 表示增和弦 — 例如 F#m7b5、Bbmaj7、Caug。',

  // ── ABC SHEET-MUSIC EDITOR ─────────────────────────────────────────────
  'editor.abcHint': '正在编辑原始 ABC 记谱 — 音符用字母 A-G 表示（小写字母表示高八度；音符后加 \' 可再升高一个八度，加 , 可降低一个八度）；音符后的数字改变时值（C2 表示时值加倍，C/2 表示减半）；| 表示小节线。和弦符号写在其所在音符上方的引号中，例如 "G7"。K: 设置调号，M: 设置拍号，Q: 设置速度。',

  // ── ADD-CHORDS PRECISION POPUP ──────────────────────────────────────────
  'precision.chordInputPlaceholder': '和弦，例如 Am7',

  // ── CREATE SET MODAL ────────────────────────────────────────────────────
  'createSet.searchPlaceholder': '搜索曲目或类型（吉格、里尔、华尔兹…）',

  // ── NEW SONG MODAL ───────────────────────────────────────────────────────
  'newSong.abcPlaceholder':   'X:1\nT:我的曲子\nC:作曲者\nM:4/4\nL:1/8\nK:G\n...',
  'newSong.irealPlaceholder': 'irealb://歌曲标题%3D作曲者%3D%3D风格%3D调号...',

  // ── COMMUNITY COLLECTIONS ────────────────────────────────────────────────
  'collections.searchPlaceholder': '搜索社区歌单…',

  // ── COLLABORATION ─────────────────────────────────────────────────────────
  'collab.namePlaceholder': '你的名字',
  'collab.codePlaceholder': 'ABCDEF',

  // ── CHORD DIAGRAMS ─────────────────────────────────────────────────────
  'diagrams.fabTitle':          '和弦图',

  // ── OPTIONS PANEL ──────────────────────────────────────────────────────
  'options.language':           '语言',
  'options.languageTitle':      '更改应用的显示语言',

  // ── EMPTY STATE ────────────────────────────────────────────────────────
  'emptyState.title':           '未加载任何歌曲',

  // ── ALERTS (window.alert — informational; no user choice) ─────────────
  'alert.themeSaved':                 '主题"{name}"已保存！',
  'alert.noCustomThemes':             '尚未保存任何自定义主题 — 请先使用"另存为主题"，然后再导出。',
  'alert.invalidThemeFile':           '该文件不是有效的主题 JSON。',
  'alert.noThemesInFile':             '该文件中未找到任何主题。',
  'alert.themesImported':             '已导入 {count} 个主题{plural}。',
  'alert.fontLoadFailed':             '无法加载该字体文件：{filename}',
  'alert.jsonError':                  'JSON 错误：{message}',
  'alert.invalidConfigFile':          '不是有效的 Magic Scroll 配置文件。',
  'alert.configParseError':           '无法解析配置文件：\n{message}',
  'alert.mxlExtractFailed':           '无法从 .mxl 文件中提取 XML',
  'alert.musicXmlParseFailed':        '无法解析 {filename} 中的 MusicXML',
  'alert.mxlReadError':               '读取 .mxl 时出错：{message}',
  'alert.msczExtractFailed':          '无法从 {filename} 中提取乐谱',
  'alert.museScoreParseFailed':       '无法解析 MuseScore 文件 {filename}',
  'alert.msczReadError':              '读取 .mscz 时出错：{message}',
  'alert.midiParseFailed':            '无法解析 MIDI：{filename}',
  'alert.jsonParseError':             'JSON 解析错误：\n{message}',
  'alert.simplifyPlainTextOnly':      '简化功能仅适用于纯文本歌曲。',
  'alert.editPlainTextOnly':          '编辑模式仅适用于纯文本歌曲。',
  'alert.exportMonospacePlainTextOnly': '导出等宽文本仅适用于纯文本和弦谱。',
  'alert.printFailed':                '打印失败：{message}',
  'alert.printPopupBlocked':          '无法打开打印视图。请允许弹出窗口，或使用浏览器的打印/另存为 PDF 功能。',
  'alert.noSongLoaded':               '未加载任何歌曲。',
  'alert.openLeadSheetFirst':         '请先打开主调谱。',
  'alert.irealUrlFailed':             '无法构建 iReal URL：{message}',
  'alert.collabPlainTextOrLeadSheetOnly': '协作功能仅适用于纯文本歌曲和主调谱。',
  'alert.collabConnectFailed':        '协作功能需要网络连接，但连接失败。请检查你的网络连接后重试。',
  'alert.collabHostOnlyEnd':          '只有主持人可以结束此次协作。',

  // ── CONFIRMS (window.confirm — Yes/No before a destructive action) ────
  'confirm.deleteTheme':              '删除主题"{name}"？',
  'confirm.resetColours':             '将颜色重置为默认值？',
  'confirm.resetFonts':               '将字体重置为默认值？',
  'confirm.deleteFolder':             '删除文件夹"{name}"？其中的歌曲会保留，只删除文件夹本身。',
  'confirm.deleteFolderAndSongs':     '删除文件夹"{name}"及其中全部 {count} 首歌曲{plural}？此操作无法撤销。',
  'confirm.deleteEmptyFolder':        '删除文件夹"{name}"？它里面没有任何歌曲。',
  'confirm.removeSong':               '移除"{title}"？',
  'confirm.deleteSongs':              '删除 {count} 首歌曲？',
  'confirm.endCollab':                '要为所有人结束此次协作吗？当前内容将永久保存给所有参与者。',

  // ── PROMPTS (window.prompt — asks the user to type something) ─────────
  'prompt.saveThemeName':             '另存为主题名称：',
  'prompt.importedThemeName':         '为导入的主题命名：',
  'prompt.renameSong':                '重命名：',
  'prompt.newFolderName':             '新文件夹名称：',
  'prompt.renameFolder':              '重命名文件夹：',
  'prompt.folderName':                '文件夹名称：',
  'prompt.embedLink':                 '粘贴要嵌入的链接（YouTube 视频或任意网页链接）：',
  'prompt.embedLinkText':             '链接文字（可选）：',
  'prompt.copyIrealUrl':              '复制此 irealb:// URL：',
};

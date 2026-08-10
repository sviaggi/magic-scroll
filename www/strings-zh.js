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
  'editor.editToggleActive':    '✎ 保存',
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
  'editor.lsEditToggleTitle':       '编辑此主调谱',
  'editor.lsEditToggleTitleActive': '保存更改并退出编辑模式',

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

  // ── PLAYBACK BARS (ABC sheet-music player + lead-sheet backing track) ───
  'playbar.play':                 '播放',
  'playbar.stop':                 '停止',
  'playbar.playPause':            '播放/暂停',
  'playbar.stopReturn':           '停止并回到开头',
  'playbar.bpm':                  'BPM',
  'playbar.meter':                '拍号',
  'playbar.meterAuto':            '自动',
  'playbar.meterTitle':           '拍号 — "自动" 会跟随乐谱本身的拍号（包括曲中的拍号变化）；选择一个值可强制使用固定拍号',
  'playbar.plays':                '播放次数',
  'playbar.playsTitle':           '整首曲谱播放的次数',
  'playbar.bar':                  '第 {n} 小节',
  'playbar.mute':                 '静音{inst}',
  'playbar.unmute':               '取消静音{inst}',
  'playbar.perInstSettings':      '各乐器设置',
  'playbar.loading':              '加载中…',
  'playbar.openLeadSheetToUse':   '请先打开一份主调谱以使用伴奏',
  'playbar.noChordData':          '此主调谱中没有和弦数据',
  'playbar.instDrums':            '鼓',
  'playbar.instKeys':             '键盘',
  'playbar.instBass':             '贝斯',
  'playbar.instGuitar':           '吉他',

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

  // ── TOPBAR (additional) ─────────────────────────────────────────────────
  'topbar.options':             '⚙ 选项',
  'topbar.optionsTitle':        '大小、主题和打印',
  'topbar.scrollLabel':         '滚动',
  'topbar.scrollSpeedTitle':    '滚动速度',
  'topbar.detectedKeyTitle':    '检测到的调 — 点击 ♭/♯ 转调',
  'topbar.collapseLabel':       '▲ 隐藏',
  'topbar.collapseTitle':       '隐藏控件（点击 ▼ 条以恢复）',
  'topbar.restoreTitle':        '显示控件（点按以恢复）',

  // ── SIDEBAR (additional) ────────────────────────────────────────────────
  'sidebar.libraryHeader':      '曲库',
  'sidebar.emptyLibrary':       '🗑 清空曲库',
  'sidebar.clearSearchTitle':   '清除搜索',
  'sidebar.onlineSearchOn':     '在线搜索已开启 — 点击禁用',
  'sidebar.onlineSearchOff':    '在线搜索已关闭 — 点击启用',
  'sidebar.selectRandom':       '🎲 随机选择',
  'sidebar.selectRandomTitle':  '从你的曲库中打开一首随机歌曲',
  'sidebar.joinCollab':         '🔗 加入协作…',
  'sidebar.joinCollab2':        '加入协作',
  'sidebar.joinCollabTitle':    '使用他人分享的代码加入实时协作',
  'sidebar.nSelected':          '已选择 {n} 项',
  'sidebar.bulkSelectAllTitle': '选择所有可见歌曲',
  'sidebar.bulkPublishTitle':   '将选中的歌曲发布到在线曲库',
  'sidebar.folder':             '📁 文件夹',
  'sidebar.bulkFolderTitle':    '将选中项移动到文件夹',
  'sidebar.bulkDelete':         '✕ 删除',
  'sidebar.bulkDeleteTitle':    '删除选中项',
  'sidebar.cancel':             '取消',
  'sidebar.bulkCancelTitle':    '取消选择',
  'sidebar.openFilesHere':      '在此打开文件',
  'sidebar.new':                '✦ 新建',
  'sidebar.newTitle':           '创建一首新的空白歌曲',
  'sidebar.newFolderTitle':     '创建一个新文件夹以整理歌曲',
  'sidebar.exportLibrary':      '导出曲库',
  'sidebar.exportLibraryTitle': '将曲库保存为文件 · Shift+点击另存为',
  'sidebar.collections':        '📦 合集',
  'sidebar.collectionsTitle':   '浏览并添加歌曲合集',
  'sidebar.resizeHandleTitle':  '拖动以调整侧边栏大小',

  // ── FILTER PANEL ─────────────────────────────────────────────────────────
  'filter.all':                 '全部',
  'filter.allTitle':            '显示所有类型',
  'filter.none':                '无',
  'filter.noneTitle':           '隐藏所有类型',
  'filter.unspecified':         '（未指定）',
  'filter.libraryEmpty':        '曲库为空',

  // ── EMPTY STATE (additional) ────────────────────────────────────────────
  'emptyState.body':            '将 .txt、.json 或 .html 文件拖入侧边栏，或点击<strong>✦ 新建歌曲</strong>来写一首。',

  // ── SONG/CHORD-SHEET EDITOR (additional) ────────────────────────────────
  'editor.titleLabel':          '标题',
  'editor.artistLabel':         '艺术家',
  'editor.keyLabel':            '调',
  'editor.timeSigLabel':        '拍号',
  'editor.transpose':           '转调',
  'editor.transposeDownTitle':  '将文本中的所有和弦下移半音（永久）',
  'editor.transposeUpTitle':    '将文本中的所有和弦上移半音（永久）',
  'editor.transposeDownAbcTitle': '将此曲中的所有音符下移半音（永久）— 会更新 K: 和音高',
  'editor.transposeUpAbcTitle':   '将此曲中的所有音符上移半音（永久）— 会更新 K: 和音高',
  'editor.saveMenu':            '💾 保存 ▾',
  'editor.publish2':            '发布',

  // ── PRECISION POPUP (additional) ────────────────────────────────────────
  'precision.add':              '添加',
  'precision.remove':           '移除',

  // ── TOOLBARS (song/lead-sheet/ABC shared chrome) ────────────────────────
  'toolbar.saveOptionsTitle':          '保存选项',
  'toolbar.publishSheetMusicTitle':    '将此乐谱发布到在线曲库',
  'toolbar.createSet':                 '⛓ 创建曲目组',
  'toolbar.createSetTitle':            '将曲库中的其他曲目叠加到本页，组成一个曲目组',
  'toolbar.sheetMusicMenu':            '🎼 乐谱 ▾',
  'toolbar.sheetMusicOptionsTitle':    '乐谱选项',
  'toolbar.soundfont':                 '🎵 音色库',
  'toolbar.soundfontTitle':            '加载 SF2 或 SFZ 音色库',
  'toolbar.unloadSoundfont':           '✕ 卸载音色库',
  'toolbar.unloadSoundfontTitle':      '卸载音色库（恢复默认音色）',
  'toolbar.whistleTabs':               '🪈 哨笛指法',
  'toolbar.whistleTabsTitle':          '切换锡哨指法图',
  'toolbar.whistleKeyTitle':           '哨笛调性',
  'toolbar.whistleD':                  'D 调哨笛',
  'toolbar.whistleC':                  'C 调哨笛',
  'toolbar.whistleG':                  'G 调哨笛',
  'toolbar.whistleBb':                 'Bb 调哨笛',
  'toolbar.whistleEb':                 'Eb 调哨笛',
  'toolbar.hideChords':                '🎼 隐藏和弦',
  'toolbar.hideChordsTitle':           '隐藏此 ABC 文件中标记的和弦符号',
  'toolbar.noteNames':                 '🔤 音名',
  'toolbar.noteNamesTitle':            '在每个音符下方显示其字母音名',
  'toolbar.collaborate':               '🔗 协作',
  'toolbar.collaborateTitle':          '开始或管理此歌曲的实时协作',
  'toolbar.chordView':                 '≡ 精简视图',
  'toolbar.chordViewTitle':            '当前以浮动方式在每个词上方显示和弦 — 点击改为以 [方括号] 形式内联显示（更紧凑）',

  // ── CHORD DIAGRAMS PANEL ─────────────────────────────────────────────────
  'diagrams.title':              '和弦图',
  'diagrams.smallerTitle':       '缩小和弦图（同时影响文字大小）',
  'diagrams.largerTitle':        '放大和弦图（同时影响文字大小）',
  'diagrams.closeTitle':         '关闭和弦图',
  'diagrams.primaryInstrument':  '主要乐器',
  'diagrams.secondaryInstrument':'次要乐器',
  'diagrams.capo':               '变调夹',
  'diagrams.capoTitle':          '此乐器的变调夹／预转调（−11 到 11）：显示按弦指法，使其听起来与页面上的和弦一致',
  'diagrams.customBtn':          '⚙ 自定义…',
  'diagrams.customTitle':        '定义你自己的乐器和调弦',
  'diagrams.none':               '无',
  'diagrams.hideTitle':          '隐藏和弦图',
  'diagrams.customInstrumentTitle': '⚙ 自定义乐器',
  'diagrams.customHint':         '选择弦数（1–8）以及每根弦的调音，从最低音弦开始。和弦图将根据此调弦计算。',
  'diagrams.strings':            '弦数',
  'diagrams.useInstrument':      '使用此乐器',
  'diagrams.chordsInSong':       '此歌曲中的和弦',

  // ── CREATE SET MODAL (additional) ───────────────────────────────────────
  'createSet.hint':              '勾选要叠加到页面上的曲目。它们会按你选择的顺序显示 — 顺序见下方。',
  'createSet.filterTypeTitle':   '按曲目类型筛选',
  'createSet.allTypes':          '所有类型',
  'createSet.noMatch':           '没有符合此搜索/类型的曲目。',
  'createSet.showSet':           '显示曲目组',

  // ── NEW SONG MODAL (additional) ─────────────────────────────────────────
  'newSong.title':               '✦ 新建歌曲',
  'newSong.hint':                '填写详细信息，然后在打开的编辑器中撰写或粘贴你的歌曲。',
  'newSong.typeLabel':           '类型',
  'newSong.typeSong':            '歌曲／和弦谱',
  'newSong.typeAbc':             'ABC 记谱法（乐谱）',
  'newSong.typeIreal':           '🎼 主调谱（iReal Pro URL）',
  'newSong.typeBlankLead':       '🎼 主调谱（空白）',
  'newSong.keyOptional':         '调（可选）',
  'newSong.format':              '直接输入歌词即可 — 打开的编辑器中有一个<strong>添加和弦</strong>按钮，点击某个词即可在其上方放置和弦。（旧式的和弦单独成行的两行式歌单同样可以直接粘贴 — 会自动转换。）',
  'newSong.abcPasteLabel':       '在下方粘贴 ABC 记谱 — 标题和作曲者会自动提取',
  'newSong.irealPasteLabel':     '粘贴一个 <code>irealb://</code> URL — 支持单曲和完整播放列表',
  'newSong.openEditor':          '打开编辑器',

  // ── CONTACT / CREDITS PANEL ──────────────────────────────────────────────
  'contact.version':             '版本 1.2',
  'contact.bugReportsHeading':   '错误报告／捐赠',
  'contact.getInTouch':          '发现问题？联系我们：',
  'contact.includeDescription':  '请附上歌曲文件以及出错情况的描述。',
  'contact.likeProject':         '喜欢这个项目吗？你的捐赠对我们意义重大！☕ 🌍',
  'contact.loading':             '加载中…',
  'contact.tabToggle':           '♩ Magic Scroll — 作者 Spencer California<br>（你最爱的吟游诗人最爱的吟游诗人）</br>',

  // ── COLLECTIONS MODAL ────────────────────────────────────────────────────
  'collections.builtin':         '📦 内置',
  'collections.community':       '☁ 社区',
  'collections.desc':            '预先制作好的歌曲合集。添加后会在你的曲库中创建一个新文件夹。',
  'collections.close':           '关闭',

  // ── PUBLISH MODAL ─────────────────────────────────────────────────────────
  'publish.title':                '☁ 发布到在线曲库',
  'publish.checklist':
    '<strong>发布前，请确认：</strong>'
    + '<ul>'
    + '<li>发布是<strong>最终的</strong> — 已发布的版本除非由管理员操作，否则无法更改或删除。</li>'
    + '<li>如果曲库中已有类似的歌曲，请不要提交细微修改或修订版本。</li>'
    + '<li>不要发布对其他玩家没有用处的内容 — 个人注解、未完成的草稿或私人变体都不合适。别忘了还有离线功能可用：如果你只是想跟一小群人分享，直接把文件保存到设备上，通过 Whatsapp、Discord 或其他消息应用发送即可！</li>'
    + '<li>请确保歌曲<strong>完整</strong>：提交前应仔细检查歌词、和弦、调／变调夹信息及其他所有细节。</li>'
    + '<li><strong>请勿提交受版权保护的内容。</strong>仅发布你有权分享的歌曲 — 原创作品、传统或公有领域歌曲，或采用开放许可的内容。</li>'
    + '</ul>'
    + '<div style="margin-top:10px;padding:8px 10px;background:var(--c-chrome-bg);border-radius:4px;font-size:0.74rem;color:var(--c-chrome-muted);line-height:1.5;">'
    + '🔒 提交是<strong>匿名的</strong> — 你发布的内容不会附带任何账号、姓名或身份信息。'
    + '</div>',

  // ── COLLABORATION (additional) ──────────────────────────────────────────
  'collab.startExplainer': '为这首歌开始一次实时协作会话。你分享加入代码给任何人，他们都可以把它加入自己的曲库，并与你实时同步编辑 — 无需账号，无需注册。当你结束会话时，最终版本会为所有参与者保存下来。',
  'collab.startBtn':       '开始协作',
  'collab.shareCode':      '将此代码分享给他人，以便他们加入：',
  'collab.copyCode':       '复制代码',
  'collab.hostOnlyNote':   '只有主持人可以结束此次协作。',
  'collab.endCollab':      '结束协作',
  'collab.enterCode':      '输入他人分享给你的 6 位协作代码。',
  'collab.join':           '加入',

  // ── KEBAB MENUS (song list + folders) ────────────────────────────────────
  'kebab.songOptions':          '歌曲选项',
  'kebab.favourite':            '★ 收藏',
  'kebab.removeFavourite':      '☆ 取消收藏',
  'kebab.rename':                '✎ 重命名',
  'kebab.moveToFolder':         '📁 移动到文件夹',
  'kebab.duplicate':            '⧉ 复制',
  'kebab.publishEllipsis':      '☁ 发布…',
  'kebab.collaborateEllipsis':  '⇄ 协作…',
  'kebab.collaborating':        '⇄ 协作中（{code}）…',
  'kebab.remove':                '✕ 移除',
  'kebab.noFolder':             '— 无文件夹',
  'kebab.noFoldersYet':         '还没有文件夹 — 在下方新建一个',
  'kebab.folderOptions':        '文件夹选项',
  'kebab.export':                '⬇ 导出',
  'kebab.publishCollection':    '发布合集…',
  'kebab.deleteFolderKeepSongs':  '删除文件夹（保留歌曲）',
  'kebab.deleteFolderAndSongs':   '删除文件夹及歌曲',
  'kebab.liveCollaboration':    '实时协作',

  // ── METRONOME ─────────────────────────────────────────────────────────────
  'metronome.toggle':           '♩ 节拍器',
  'metronome.openTitle':        '打开节拍器',
  'metronome.timeSig':          '拍号',
  'metronome.beat':             '拍子',
  'metronome.tapTempo':         '点击定速',
  'metronome.tapTempoTitle':    '点击以设定速度',
  'metronome.start':            '▶︎ 开始',
  'metronome.stop':             '■ 停止',
  'metronome.startStopTitle':   '开始／停止',
  'metronome.runningLabel':     '♩ {bpm} BPM ●',

  // ── TUNER ──────────────────────────────────────────────────────────────────
  'tuner.toggle':                '𝄞 调音器',
  'tuner.toggleTitle':           '半音阶调音器（需使用麦克风）',
  'tuner.panelTitle':            '半音阶调音器',
  'tuner.instrument':            '乐器',
  'tuner.primaryInstrument':     '主要乐器',
  'tuner.secondaryInstrument':   '次要乐器',
  'tuner.chromatic':             '半音阶',
  'tuner.sensitivity':           '灵敏度',
  'tuner.sensitivityHigh':       '高（安静房间）',
  'tuner.sensitivityMedium':     '中',
  'tuner.sensitivityLow':        '低（嘈杂房间）',
  'tuner.a4reference':           'A4 基准音',
  'tuner.a4standard':            '440 Hz（标准）',
  'tuner.startListening':        '🎤 开始聆听',
  'tuner.stopListening':         '⏹︎ 停止聆听',
  'tuner.requiresHttps':         '麦克风需要 HTTPS — 请通过你的 https:// 网址打开。',
  'tuner.notAvailable':          '此浏览器或环境下麦克风不可用。',
  'tuner.micDenied':             '⚠ 麦克风访问被拒绝：{msg}',

  // ── PRINT PANEL ────────────────────────────────────────────────────────────
  'printPanel.print':                   '打印',
  'printPanel.optionsTitle':            '打印选项',
  'printPanel.panelTitle':              '打印选项',
  'printPanel.font':                    '字体',
  'printPanel.fontChoice':              '字体选择',
  'printPanel.fontDefault':             '页面字体（用户自定义）',
  'printPanel.includeDiagrams':         '包含和弦图',
  'printPanel.primaryInstrumentNote':   '（主要乐器）',
  'printPanel.layout':                  '布局',
  'printPanel.fitOnePage':              '适应单页',
  'printPanel.multiColumn':             '多栏排版',
  'printPanel.reducesBlankSpace':       '（减少空白区域）',
  'printPanel.skipChoruses':            '跳过重复副歌',
  'printPanel.condensedNote':           '（和弦以方括号内联显示，每页容纳更多内容）',
  'printPanel.whichTune':               '选择曲目',
  'printPanel.fittingHint':             '要把所有内容排在一页上并保持美观易读可能有些困难！你可以考虑复制一份歌曲文件，制作一个专门用于打印的版本，删除其中多余/不必要的信息（歌名、修饰性文字、超链接）。',
  'printPanel.printNow':                '🖨 立即打印',

  // ── THEMES PANEL ─────────────────────────────────────────────────────────
  'themes.panelTitle':           '🎨 主题',
  'themes.presetThemes':         '预设主题',
  'themes.uiColours':            '界面颜色',
  'themes.uiBg':                 '界面背景',
  'themes.uiBgAlt':              '界面背景（副）',
  'themes.uiBorder':             '界面边框',
  'themes.uiText':               '界面文字',
  'themes.uiMuted':              '界面弱化文字',
  'themes.accent':               '强调色',
  'themes.songCardColours':      '歌曲卡片颜色',
  'themes.cardBg':               '卡片背景',
  'themes.cardText':             '卡片文字',
  'themes.cardTitle':            '卡片标题',
  'themes.cardArtist':           '卡片艺术家',
  'themes.chordText':            '和弦文字',
  'themes.backgroundImage':      '背景图片',
  'themes.imageFile':            '图片文件',
  'themes.browse':               '📂 浏览…',
  'themes.none':                 '（无）',
  'themes.imageScale':           '图片缩放',
  'themes.scaleSmall':           '小（300px 平铺）',
  'themes.scaleMedium':          '中（500px 平铺）',
  'themes.scaleLarge':           '大（800px 平铺）',
  'themes.scaleXL':              '特大（1200px 平铺）',
  'themes.scaleFullWidth':       '全宽',
  'themes.scaleCover':           '覆盖（拉伸）',
  'themes.scrollWithPage':       '随页面滚动',
  'themes.clearImage':           '清除图片',
  'themes.clearBtn':             '✕ 清除',
  'themes.fonts':                '字体',
  'themes.fontBodyTab':          '正文／六线谱',
  'themes.fontChordTokens':      '和弦符号',
  'themes.fontSongTitle':        '歌曲标题',
  'themes.fontAppUI':            '应用界面',
  'themes.displayOptions':       '显示选项',
  'themes.monoSpacing':          '等宽和弦／歌词间距',
  'themes.monoSpacingTitle':     '以真正的等宽字体渲染和弦与歌词行，使和弦精确对齐在歌词上方',
  'themes.monoSpacingOff':       '⇔ 关闭',
  'themes.apply':                '应用',
  'themes.saveAsTheme':          '另存为主题',
  'themes.resetColours':         '重置颜色',
  'themes.resetFonts':           '重置字体',
  'themes.export':               '⇩ 导出主题',
  'themes.exportTitle':          '将你保存的自定义主题下载为可分享的文件',
  'themes.import':               '⇧ 导入主题',
  'themes.importTitle':          '加载他人分享的自定义主题',

  // ── SONG/LEAD-SHEET/ABC META PILLS ("Type:", "Key:", ...) ──────────────
  'meta.type':                  '类型',
  'meta.key':                   '调',
  'meta.time':                  '拍号',
  'meta.tuning':                '调弦',
  'meta.capo':                  '变调夹',
  'meta.fret':                  '第 {n} 品',
  'meta.style':                 '风格',
  'meta.lead':                  '主调谱',

  // ── PLAYBACK (additional) ───────────────────────────────────────────────
  'playbar.pause':               '暂停',
  'playbar.resume':              '继续',

  // ── LEAD-SHEET EDIT MODE (toolbar, header fields, per-bar menu) ────────
  'lsEdit.style':                     '风格',
  'lsEdit.customEllipsis':            '自定义…',
  'lsEdit.customStylePlaceholder':    '自定义风格名称',
  'lsEdit.composerArtistPlaceholder': '作曲者／艺术家',
  'lsEdit.transposeDownTitle':        '将此曲谱中的所有和弦下移半音（永久）',
  'lsEdit.transposeUpTitle':          '将此曲谱中的所有和弦上移半音（永久）',
  'lsEdit.downloadMsleadTitle':       '将此主调谱下载为 .mslead 文件',
  'lsEdit.irealUrlBtn':               '🔗 iReal 链接',
  'lsEdit.irealUrlTitle':             '将此主调谱复制为 irealb:// URL（可在本应用或 iReal Pro 中重新导入）',
  'lsEdit.copied':                    '✓ 已复制',
  'lsEdit.publishLeadSheetTitle':     '将此主调谱发布到在线曲库',
  'lsEdit.collaborateLeadSheetTitle': '开始或管理此主调谱的实时协作',
  'lsEdit.chordViewBracketsTitle':    '当前以 [方括号] 形式内联显示和弦 — 点击改为浮动显示在词语上方',
  'lsEdit.barOptionsTitle':           '小节选项（小节线、拍号、插入／删除…）',
  'lsEdit.setTimeSig':                '设置拍号',
  'lsEdit.timeColon':                 '拍号：{v}',
  'lsEdit.setTimeSigModalTitle':      '设置拍号',
  'lsEdit.setSection':                '设置段落',
  'lsEdit.sectionColon':              '段落：{v}',
  'lsEdit.setSectionModalTitle':      '设置段落标记',
  'lsEdit.sectionLabelField':         '段落标签',
  'lsEdit.setEnding':                 '设置反复房子',
  'lsEdit.endingColon':               '反复房子：{v}',
  'lsEdit.setEndingModalTitle':       '设置反复房子编号',
  'lsEdit.endingField':               '反复房子（例如 1、2）',
  'lsEdit.openRepeat':                '起始反复记号',
  'lsEdit.openRepeatOn':              '✓ 起始反复记号',
  'lsEdit.closeRepeat':               '结束反复记号',
  'lsEdit.closeRepeatOn':             '✓ 结束反复记号',
  'lsEdit.doubleBarEnd':              '双小节线（段末）',
  'lsEdit.doubleBarEndOn':            '✓ 双小节线（段末）',
  'lsEdit.doubleBarStart':            '双小节线（段首）',
  'lsEdit.doubleBarStartOn':          '✓ 双小节线（段首）',
  'lsEdit.finalBarline':              '终止线',
  'lsEdit.finalBarlineOn':            '✓ 终止线',
  'lsEdit.insertBarBefore':           '在此之前插入小节',
  'lsEdit.insertBarAfter':            '在此之后插入小节',
  'lsEdit.deleteBar':                 '删除小节',

  // ── COLLECTIONS (submenu list content) ──────────────────────────────────
  'collections.communityDesc':          '由其他 Magic Scroll 用户分享的合集。',
  'collections.requiresHttp':           '合集功能需要 HTTP 服务器。',
  'collections.noBuiltin':              '暂无内置合集。',
  'collections.manifestLoadFailed':     '无法加载合集清单。',
  'collections.communityNotConfigured': '此构建版本未配置社区曲库。',
  'collections.noMatching':             '没有匹配的合集。',
  'collections.noneYet':                '还没有社区合集 — 快来发布第一个吧！',
  'collections.communityUnreachable':   '无法连接到社区曲库。',
  'collections.unnamed':                '未命名',
  'collections.songCount':              '{n} 首歌曲',
  'collections.songCountOne':           '{n} 首歌曲',
  'collections.contains':               '包含：{list}',
  'collections.moreCount':              ' 等 {n} 首',
  'collections.add':                    '+ 添加',
  'collections.adding':                 '添加中…',
  'collections.added':                  '✓ 已添加',
  'collections.addedCount':             '✓ 已添加（{n}）',
  'collections.alreadyInLibrary':       '已在曲库中',
  'collections.failed':                 '失败',
  'collections.defaultFolderName':      '合集',
};

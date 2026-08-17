/**
 * tutorial-strings-zh.js — Magic Scroll GUIDED TUTORIAL copy (Simplified
 * Chinese). Sibling to tutorial-strings-en.js — same keys, Chinese text. See
 * that file's header for the full explanation of why this file exists, how
 * it's wired in, key-naming convention, and editing instructions; only the
 * essentials are repeated here.
 *
 * Defines window.MS_TUTORIAL_STRINGS_ZH. Loaded via
 * <script src="tutorial-strings-zh.js"> alongside -en.js/-fr.js, before
 * tutorial.js, in the dev HTML. tutorial.js's tt() reads this dictionary
 * when window.MS_LANG === 'zh', falling back to English on any key missing
 * here (so it is SAFE to leave a key untranslated temporarily — it just
 * shows English text until someone fills it in — but do not remove a key
 * that exists in tutorial-strings-en.js, and do not add one that doesn't;
 * keep the two files' key sets identical).
 *
 * A NOTE ON <strong>/<code> — keep any translation's tags on the words they
 * wrap in English; Chinese word order rarely needs them moved, but check
 * each one still reads naturally.
 */
window.MS_TUTORIAL_STRINGS_ZH = {

  // UI CHROME
  'ui.stepProgress': '第 {n} 步，共 {total} 步',
  'ui.next': '下一步',
  'ui.back': '上一步',
  'ui.done': '完成',
  'ui.hintClick': '点击高亮的控件以继续。',
  'ui.hintClickSkippable': '点击高亮的控件以继续，或点击“下一步”跳过此步骤。',
  'ui.dontShow': '不再显示教程弹窗',
  'ui.closeTitle': '关闭教程',
  'ui.tutorialsTitle': '🎓 教程',
  'ui.guidedTours': '引导教程',
  'ui.settingsSection': '设置',
  'ui.showPopups': '显示教程弹窗',
  'ui.triggerTitle': '重新查看引导教程',
  'ui.triggerLabel': '🎓 教程',

  // FIRST-VISIT WELCOME BANNER
  'banner.title': '初次使用 Magic Scroll？',
  'banner.body': '快速了解基础功能——曲库、和弦与选项。',
  'banner.start': '开始导览',
  'banner.later': '稍后再说',
  'banner.never': '不再显示此消息',

  // CONTEXTUAL NUDGE BANNERS
  'ctx.sheetMusic.title': '已打开乐谱',
  'ctx.sheetMusic.body': '想快速了解乐谱工具栏吗？',
  'ctx.leadSheets.title': '已打开主调谱',
  'ctx.leadSheets.body': '想快速了解主调谱工具栏吗？',
  'ctx.start': '显示教程',
  'ctx.dismiss': '不用了',

  // FLOW METADATA
  'flow.generalUsage.label': '常规使用',
  'flow.generalUsage.desc': '和弦、自动滚动、曲库与选项',
  'flow.addingSongs.label': '添加歌曲',
  'flow.addingSongs.desc': '导入文件或从零开始创建',
  'flow.sheetMusic.label': '乐谱',
  'flow.sheetMusic.desc': '通过 ABC 呈现真实乐谱——工具栏与编辑',
  'flow.leadSheets.label': '主调谱',
  'flow.leadSheets.desc': 'iReal Pro 风格的和弦表',

  // GENERAL USAGE FLOW
  'generalUsage.welcome.title': '欢迎使用 Magic Scroll',
  'generalUsage.welcome.body': '快速浏览一遍应用——不到一分钟。您可以随时在 选项 → 教程 中重新查看这个或其他导览。',
  'generalUsage.sidebar.title': '您的曲库',
  'generalUsage.sidebar.body': '点击这里打开曲库——您添加的所有歌曲和曲调都在这里，顶部有搜索，底部有合集按钮，方便分享歌本。',
  'generalUsage.collections.title': '社区合集',
  'generalUsage.collections.body': '点击这里浏览精选和社区歌曲合集，直接将它们添加到您的曲库——快速充实曲库的好方法，不必自己逐一输入或导入。',
  'generalUsage.dropzone.title': '添加歌曲',
  'generalUsage.dropzone.body': '把文件直接拖到这个区域即可导入，或点击下方的 <strong>✦ 新建</strong> 从零开始创作。关于这部分有专门的教程——选项 → 教程 → 添加歌曲。',
  'generalUsage.chords.title': '和弦标签页',
  'generalUsage.chords.body': '点击这里打开当前歌曲的调性、移调和和弦图工具。',
  'generalUsage.keygroup.title': '调性与移调',
  'generalUsage.keygroup.body': 'Magic Scroll 会自动检测歌曲的调性。用 ♭−/♯+ 微调半音，或点击旁边的 <strong>和弦图</strong> 查看任意乐器的指法图。',
  'generalUsage.options.title': '选项标签页',
  'generalUsage.options.body': '点击这里——文字大小、行距、语言以及完整的主题自定义都在这里。',
  'generalUsage.size.title': '阅读舒适度',
  'generalUsage.size.body': '在这里调整文字大小和行距，旁边的 <strong>主题</strong> 里还可以设置颜色、字体和背景图片。',
  'generalUsage.tutorials.title': '您在这里',
  'generalUsage.tutorials.body': '这个导览，以及添加歌曲、乐谱、主调谱的独立导览，都在这里——随时重新查看，或彻底关闭教程弹窗。',
  'generalUsage.scroll.title': '自动滚动',
  'generalUsage.scroll.body': '解放双手阅读——点击“滚动”开始，拖动滑块调整速度。',
  'generalUsage.done.title': '基础功能就是这些',
  'generalUsage.done.body': '准备好后，可以在 选项 → 教程 中探索添加歌曲、乐谱和主调谱。祝您使用愉快！',

  // ADDING SONGS FLOW
  'addingSongs.intro.title': '添加一首歌曲或曲调',
  'addingSongs.intro.body': '两种方式：把文件拖到侧边栏，或者打开“新建歌曲”表单粘贴或输入内容。我们来看看这两种方式。',
  'addingSongs.sidebar.title': '先打开曲库',
  'addingSongs.sidebar.body': '点击这里打开侧边栏——歌曲都存放在这里，也是您拖放文件的地方。',
  'addingSongs.choose.title': '两种添加歌曲的方式',
  'addingSongs.choose.body': '将文件拖到高亮显示的拖放区域（或点击它浏览文件），或点击 <strong>✦ 新建</strong> 从零开始创作——两种方式都可以试试。',
  'addingSongs.dropzoneDone.title': '太好了！',
  'addingSongs.dropzoneDone.body': '选择文件后，Magic Scroll 会自动将其添加到您的曲库。您也可以随时通过侧边栏底部的 <strong>✦ 新建</strong> 开始一首空白歌曲。',
  'addingSongs.nstype.title': '选择格式',
  'addingSongs.nstype.body': '<strong>歌曲／和弦谱</strong> 适合带和弦的歌词，<strong>ABC 记谱法</strong> 适合真正的乐谱，两种 iReal 选项适合爵士风格的主调谱。乐谱和主调谱教程会更深入地介绍后两种。',
  'addingSongs.format.title': '直接开始输入',
  'addingSongs.format.body': '在下方的编辑器中粘贴或输入您的歌词——上方的 <strong>🎯 添加和弦</strong> 按钮（接下来会介绍）可以让您在有内容可以标注后，点击一个词为它加上和弦。旧式的两行谱（和弦单独一行）粘贴进来也没问题。',
  'addingSongs.openEditor.title': '创建它',
  'addingSongs.openEditor.body': '在上方填写标题，然后点击<strong>打开编辑器</strong>创建歌曲并直接开始编写。（如果您想就此打住，点击“取消”可以不保存任何内容直接关闭。）',
  'addingSongs.addChordsOn.title': '为歌词标注和弦',
  'addingSongs.addChordsOn.body': '点击<strong>🎯 添加和弦</strong>切换到和弦标注模式——歌词中的每个词都会变为可点击。',
  'addingSongs.addChordsUsage.title': '添加您的和弦',
  'addingSongs.addChordsUsage.body': '点击上方任意一个词即可为它添加和弦，或点击已有的和弦进行修改或删除。试着添加几个——准备好关闭标注模式时，点击“下一步”。',
  'addingSongs.addChordsOff.title': '回到普通输入',
  'addingSongs.addChordsOff.body': '再次点击<strong>🎯 添加和弦</strong>即可关闭标注模式，回到正常输入——在输入歌词和放置和弦之间切换时，随时开关它。',
  'addingSongs.toolbar.title': '分享与协作',
  'addingSongs.toolbar.body': '<strong>📤 分享 ▾</strong> 可以将这首歌发送到其他应用、下载为文件、发布到在线曲库，或导出为经典的等宽和弦谱。<strong>🔗 协作</strong> 会开启一个实时会话——把它给出的代码分享出去，加入的人就能和您一起实时编辑。（无论这首歌是您本来就打开的，还是这次导览刚刚创建的，它都是曲库中一首真实的歌——可以重命名、继续完善，或者如果不需要就删除它。）',
  'addingSongs.done.title': '歌曲编辑器就是这样',
  'addingSongs.done.body': '接下来可以在 选项 → 教程 中探索乐谱和主调谱——它们各自有自己的编辑器和技巧。',

  // SHEET MUSIC FLOW
  'sheetMusic.intro.title': '乐谱（ABC 记谱法）',
  'sheetMusic.intro.body': '乐谱类歌曲会显示真正的乐谱记谱，而不只是和弦和歌词——非常适合曲调、古典作品，以及那些更适合看谱而非凭耳朵弹奏的内容。打开或创建一首 ABC 记谱歌曲，就能看到下面工具栏的实际效果。',
  'sheetMusic.toolbar.title': '乐谱工具栏',
  'sheetMusic.toolbar.body': '出现在任何 ABC 记谱歌曲的上方。<strong>编辑</strong> 可切换到原始记谱文本；<strong>乐谱 ▾</strong> 包含播放、音色库、口哨谱和音名等选项。',
  'sheetMusic.edit.title': '编辑记谱',
  'sheetMusic.edit.body': '点击“编辑”可以直接查看和修改原始 ABC 文本——字母 A–G 表示音符，| 表示小节线，和弦符号写在音符上方的引号里，例如“G7”。接下来的永久移调功能也在这里。',
  'sheetMusic.menu.title': '乐谱选项',
  'sheetMusic.menu.body': '加载自定义音色库用于播放，显示锡哨指法谱，或在每个音符下方显示音名。',
  'sheetMusic.transpose.title': '移调',
  'sheetMusic.transpose.body': '整体升高或降低乐曲，永久改写每一个音符——无需重新输入。不想改动记谱本身？顶部工具栏的<strong>🎵 和弦</strong>标签页也有自己的 ♭−/♯+，只改变显示效果，不会更改任何已保存的内容。',
  'sheetMusic.createSet.title': '创建曲目组合',
  'sheetMusic.createSet.body': '点击“创建组合”，可以把库中其他曲子接在这首后面。勾选想要的曲子——勾选的先后顺序就是播放顺序。点击“显示组合”会把它们连在一起播放，就像session里的一组曲子一样。',
  'sheetMusic.done.title': '导入乐谱',
  'sheetMusic.done.body': '通过 <strong>✦ 新建 → ABC 记谱法</strong> 创建并粘贴 ABC 文本，或拖入 .abc、.mxl 或 .mscz 文件——MuseScore 文件会自动转换。',

  // LEAD SHEETS FLOW
  'leadSheets.intro.title': '主调谱（iReal Pro 风格）',
  'leadSheets.intro.body': '一种紧凑的和弦表格式，适合爵士标准曲和快速谱表——与 iReal Pro 使用的风格相同。打开或创建一份主调谱，就能看到下面工具栏的实际效果。',
  'leadSheets.toolbar.title': '主调谱工具栏',
  'leadSheets.toolbar.body': '出现在任何主调谱上方，包含播放风格、调性和分享等选项。',
  'leadSheets.edit.title': '开启编辑',
  'leadSheets.edit.body': '点击“编辑”将这份谱表切换到编辑模式——下方的和弦格只有在开启此模式后才能响应点击。之后再次点击它（激活后按钮会显示为“保存”）即可锁定您的更改。',
  'leadSheets.content.title': '编辑谱表',
  'leadSheets.content.body': '编辑模式已开启，现在点击任意和弦格即可直接修改，或使用其 ⋮ 菜单设置反复记号、结尾记号等爵士谱表记号。',
  'leadSheets.done.title': '导入主调谱',
  'leadSheets.done.body': '通过 <strong>✦ 新建 → 🎼 主调谱（空白）</strong> 创建空白谱表，或通过 <strong>🎼 主调谱（iReal Pro URL）</strong> 粘贴 <code>irealb://</code> 链接——单曲和完整播放列表都支持。'
};

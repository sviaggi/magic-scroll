/**
 * irealpro-engine.js — iReal Pro lead-sheet codec, offloaded from the main
 * app shell.
 *
 * Covers: per-style default tempo lookup, the canonical iReal style list,
 * per-style backing-track arrangement defaults, and the iRealPro URL
 * codec (parse/encode/decode/tokenise) plus chord transpose helpers.
 * Purely data + pure functions — no DOM access — so it's safe to load
 * as a plain global script anywhere before first use, same pattern as
 * chord-engine.js / squeezebox-engine.js / backing-track.js.
 */
// ══════════════════════════════════════════════════════════════════════════
// iREAL PRO — Lead Sheet  Steps 1-2: parse + render
// ══════════════════════════════════════════════════════════════════════════
// ── LEAD-SHEET STYLE → DEFAULT TEMPO ──────────────────────────────────────────
// iReal Pro stores a tempo field in shared charts, but most community charts
// leave it at 0 ("use the style's default"). This table mirrors iReal Pro's
// per-style default tempos so an imported lead sheet with no explicit BPM still
// opens at a musically sensible speed. Keys are lower-cased style names; the
// resolver also tries the text after a "Category: " prefix, and falls back to
// 120 when the style is unknown. (Values are approximations of iReal defaults.)
const _LEAD_STYLE_BPM = {
  // Jazz
  'afro 12/8':100,'ballad double time feel':70,'ballad even':65,'ballad melodic':65,
  'ballad swing':65,'ballad':60,'blue note':140,'bossa nova':140,'bossa/swing':140,
  'doo doo cats':140,'even 8ths':140,'even 8ths open':140,'even 16ths':120,'guitar trio':140,
  'gypsy jazz':220,'latin':150,'latin/swing':150,'long notes':120,'medium swing':140,
  'medium up swing':180,'medium up swing 2':190,'new orleans swing':160,'second line':150,
  'slow swing':90,'swing 2/4':160,'trad jazz':200,'up tempo swing':240,'up tempo swing 2':240,
  // Latin
  'argentina: tango':120,'tango':120,'brazil: bossa acoustic':140,'bossa acoustic':140,
  'brazil: samba':200,'cuba: bolero':120,'bolero':120,'cuba: cha cha cha':120,'cha cha cha':120,
  'cuba: son montuno 2-3':180,'cuba: son montuno 3-2':180,'son montuno 2-3':180,'son montuno 3-2':180,
  // Pop
  'bluegrass':140,'country':120,'disco':120,'funk':100,'glam funk':110,'house':125,
  'reggae':90,'rock':120,'rock 12/8':70,'rnb':90,'shuffle':120,'slow rock':70,
  'smooth':100,'soul':100,'virtual funk':105,
  // Blues
  'chicago shuffle':120,'flat tire':110,'funky':100,'gospel':100,'lucille':120,
  'mo-slo':60,'muddy':80,'nola':110,'shout':130,'slo-mo':60,'stax':110,'texas rock':120,
  // Brazilian
  'afoxe':110,'baiao':100,'bossa ballad':100,'bossa cha':130,'maracatu':120,
  'partido alto':120,'samba':200,'samba brush':200,'samba fast':240,'samba percussion':200,
  // Salsa
  'cuba: afro 6/8':100,'afro 6/8':100,'cuba: comparsa':120,'comparsa':120,'cuba: danzon':120,
  'danzon':120,'cuba: guajira':120,'guajira':120,'cuba: guaracha':180,'guaracha':180,
  'cuba: mambo':190,'mambo':190,'cuba: mozambique':120,'mozambique':120,
  'cuba: rumba guaguanco':120,'rumba guaguanco':120,'cuba: songo':180,'songo':180,
  'cuba: timba':180,'timba':180,'dominican republic: merengue':160,'merengue':160,
  'puerto rico: bomba':120,'bomba':120,'puerto rico: plena':120,'plena':120
};
// Resolve a style name to its default BPM (120 when unknown / unset).
function _styleDefaultBPM(style){
  if(!style) return 120;
  var s=String(style).trim().toLowerCase().replace(/\|+$/,'').trim();
  if(_LEAD_STYLE_BPM[s]) return _LEAD_STYLE_BPM[s];
  var ci=s.indexOf(':');
  if(ci>=0){ var sub=s.slice(ci+1).trim(); if(_LEAD_STYLE_BPM[sub]) return _LEAD_STYLE_BPM[sub]; }
  return 120;
}
window._styleDefaultBPM = _styleDefaultBPM;   // expose for backing-track.js

// Canonical iReal style presets, grouped exactly like iReal Pro's own style
// picker, for the lead sheet edit page's Style dropdown. Names here match
// (case-insensitively) the keys in _LEAD_STYLE_BPM above.
const IREAL_STYLES = [
  { group: 'Jazz', styles: ['Afro 12/8','Ballad','Ballad Double Time Feel','Ballad Even','Ballad Melodic',
    'Ballad Swing','Blue Note','Bossa Nova','Bossa/Swing','Doo Doo Cats','Even 8ths','Even 8ths Open',
    'Even 16ths','Guitar Trio','Gypsy Jazz','Latin','Latin/Swing','Long Notes','Medium Swing',
    'Medium Up Swing','Medium Up Swing 2','New Orleans Swing','Second Line','Slow Swing','Swing 2/4',
    'Trad Jazz','Up Tempo Swing','Up Tempo Swing 2'] },
  { group: 'Latin', styles: ['Argentina: Tango','Brazil: Bossa Acoustic','Brazil: Samba','Cuba: Bolero',
    'Cuba: Cha Cha Cha','Cuba: Son Montuno 2-3','Cuba: Son Montuno 3-2'] },
  { group: 'Pop', styles: ['Bluegrass','Country','Disco','Funk','Glam Funk','House','Reggae','Rock',
    'Rock 12/8','RnB','Shuffle','Slow Rock','Smooth','Soul','Virtual Funk'] },
  { group: 'Blues', styles: ['Chicago Shuffle','Flat Tire','Funky','Gospel','Lucille','Mo-Slo','Muddy',
    'Nola','Shout','Slo-Mo','Stax','Texas Rock'] },
  { group: 'Brazilian', styles: ['Afoxe','Baiao','Bossa Ballad','Bossa Cha','Maracatu','Partido Alto',
    'Samba','Samba Brush','Samba Fast','Samba Percussion'] },
  { group: 'Salsa', styles: ['Cuba: Afro 6/8','Cuba: Comparsa','Cuba: Danzon','Cuba: Guajira',
    'Cuba: Guaracha','Cuba: Mambo','Cuba: Mozambique','Cuba: Rumba Guaguanco','Cuba: Songo','Cuba: Timba',
    'Dominican Republic: Merengue','Puerto Rico: Bomba','Puerto Rico: Plena'] }
];
window.IREAL_STYLES = IREAL_STYLES;

// ── PER-STYLE BACKING-TRACK ARRANGEMENT ─────────────────────────────────────
// Each lead sheet style picks a "feel" for each backing-track instrument
// (a pattern name from backing-track.js's own per-instrument pattern list),
// plus whether guitar plays at all. Unmatched/unset styles fall back to
// GLOBAL_ARRANGEMENT_DEFAULT — today's original arrangement (guitar off).
// Consumed by backing-track.js via window._styleArrangementFor().
const GLOBAL_ARRANGEMENT_DEFAULT = {
  drums:'Ballad', keys:'Comp', bass:'Walking', guitar:{pattern:'Arpeggio', enabled:false}
};
// Fallback per iReal category (used when a style isn't in the override table below).
const _STYLE_ARR_CATEGORY_DEFAULT = {
  jazz:      { drums:'Jazz',       keys:'Comp', bass:'Walking',     guitar:{pattern:'Comp',       enabled:false} },
  latin:     { drums:'Latin',      keys:'Comp', bass:'Root–5',      guitar:{pattern:'Fingerpick', enabled:false} },
  pop:       { drums:'Rock',       keys:'Comp', bass:'Root',        guitar:{pattern:'Strum',      enabled:true } },
  blues:     { drums:'Rock',       keys:'Comp', bass:'Walking',     guitar:{pattern:'Comp',       enabled:true } },
  brazilian: { drums:'Bossa Nova', keys:'Comp', bass:'Root–5',      guitar:{pattern:'Fingerpick', enabled:true } },
  salsa:     { drums:'Latin',      keys:'Comp', bass:'Octave pump', guitar:{pattern:'Strum',      enabled:false} },
};
// Specific overrides (lowercase keys, matching _LEAD_STYLE_BPM's convention)
// for styles where the category default would be musically wrong.
const _STYLE_ARR_OVERRIDES = {
  'ballad':                  { drums:'Ballad', keys:'Ballad roll', bass:'Root–5',  guitar:{pattern:'Fingerpick', enabled:false} },
  'ballad even':             { drums:'Ballad', keys:'Ballad roll', bass:'Root–5',  guitar:{pattern:'Fingerpick', enabled:false} },
  'ballad melodic':          { drums:'Ballad', keys:'Ballad roll', bass:'Root–5',  guitar:{pattern:'Fingerpick', enabled:false} },
  'ballad swing':            { drums:'Ballad', keys:'Ballad roll', bass:'Walking', guitar:{pattern:'Comp',       enabled:false} },
  'ballad double time feel': { drums:'Ballad', keys:'Ballad roll', bass:'Walking', guitar:{pattern:'Comp',       enabled:false} },
  'bossa nova':              { drums:'Bossa Nova', keys:'Comp', bass:'Root–5', guitar:{pattern:'Fingerpick', enabled:true} },
  'bossa/swing':             { drums:'Bossa Nova', keys:'Comp', bass:'Root–5', guitar:{pattern:'Fingerpick', enabled:true} },
  'gypsy jazz':              { drums:'Jazz', keys:'Comp',    bass:'Walking', guitar:{pattern:'Comp',  enabled:true} },
  'guitar trio':             { drums:'Jazz', keys:'Comp',    bass:'Walking', guitar:{pattern:'Comp',  enabled:true} },
  'new orleans swing':       { drums:'Jazz', keys:'Comp',    bass:'Walking', guitar:{pattern:'Strum', enabled:true} },
  'second line':             { drums:'Jazz', keys:'Offbeat', bass:'Root',    guitar:{pattern:'Strum', enabled:true} },
  'trad jazz':               { drums:'Jazz', keys:'Comp',    bass:'Walking', guitar:{pattern:'Strum', enabled:true} },
  'bluegrass':               { drums:'Rock', keys:'Comp', bass:'Root', guitar:{pattern:'Strum', enabled:true} },
  'country':                 { drums:'Rock', keys:'Comp', bass:'Root', guitar:{pattern:'Strum', enabled:true} },
  'reggae':                  { drums:'Rock', keys:'Offbeat', bass:'Root',        guitar:{pattern:'Offbeat', enabled:true} },
  'disco':                   { drums:'Rock', keys:'Comp',    bass:'Octave pump',guitar:{pattern:'Offbeat', enabled:true} },
  'house':                   { drums:'Rock', keys:'Comp',    bass:'Octave pump',guitar:{pattern:'Offbeat', enabled:false} },
  'funk':                    { drums:'Rock', keys:'Offbeat', bass:'Octave pump',guitar:{pattern:'Offbeat', enabled:true} },
  'glam funk':               { drums:'Rock', keys:'Offbeat', bass:'Octave pump',guitar:{pattern:'Offbeat', enabled:true} },
  'virtual funk':            { drums:'Rock', keys:'Offbeat', bass:'Octave pump',guitar:{pattern:'Offbeat', enabled:true} },
  'smooth':                  { drums:'Rock', keys:'Comp', bass:'Root–5', guitar:{pattern:'Comp', enabled:false} },
  'soul':                    { drums:'Rock', keys:'Comp', bass:'Root–5', guitar:{pattern:'Comp', enabled:false} },
  'rnb':                     { drums:'Rock', keys:'Comp', bass:'Root–5', guitar:{pattern:'Comp', enabled:false} },
  'shuffle':                 { drums:'Rock', keys:'Comp', bass:'Walking', guitar:{pattern:'Strum', enabled:true} },
  'slow rock':               { drums:'Rock', keys:'Comp', bass:'Root',    guitar:{pattern:'Strum', enabled:true} },
  'rock 12/8':               { drums:'Ballad', keys:'Comp', bass:'Root', guitar:{pattern:'Arpeggio', enabled:true} },
  'cuba: guajira':           { drums:'Latin', keys:'Comp', bass:'Root–5', guitar:{pattern:'Fingerpick', enabled:true} },
  'guajira':                 { drums:'Latin', keys:'Comp', bass:'Root–5', guitar:{pattern:'Fingerpick', enabled:true} },
  'cuba: bolero':            { drums:'Ballad', keys:'Comp', bass:'Root–5', guitar:{pattern:'Fingerpick', enabled:true} },
  'bolero':                  { drums:'Ballad', keys:'Comp', bass:'Root–5', guitar:{pattern:'Fingerpick', enabled:true} },
};
function _styleArrangementFor(style){
  if(!style) return GLOBAL_ARRANGEMENT_DEFAULT;
  var s=String(style).trim().toLowerCase().replace(/\|+$/,'').trim();
  if(!s) return GLOBAL_ARRANGEMENT_DEFAULT;
  if(_STYLE_ARR_OVERRIDES[s]) return _STYLE_ARR_OVERRIDES[s];
  var ci=s.indexOf(':'), sub=ci>=0?s.slice(ci+1).trim():null;
  if(sub && _STYLE_ARR_OVERRIDES[sub]) return _STYLE_ARR_OVERRIDES[sub];
  for(var i=0;i<IREAL_STYLES.length;i++){
    var grp=IREAL_STYLES[i];
    if(grp.styles.some(function(name){ var n=name.toLowerCase(); return n===s||(sub&&n===sub); })){
      return _STYLE_ARR_CATEGORY_DEFAULT[grp.group.toLowerCase()] || GLOBAL_ARRANGEMENT_DEFAULT;
    }
  }
  return GLOBAL_ARRANGEMENT_DEFAULT;
}
window._styleArrangementFor = _styleArrangementFor;

function parseIRealURL(raw){
  const data=decodeURIComponent(raw.replace(/^irealb:\/\/+/i,''));
  // Songs are separated by '==='. A leading marker or a trailing playlist-name
  // segment isn't a valid song and is dropped by parseIRealSong's field check,
  // so parsing every non-empty segment handles single songs and playlists alike.
  const segs=data.split('===').map(s=>s.trim()).filter(Boolean);
  return segs.map(parseIRealSong).filter(Boolean);
}
// ── iReal Pro ENCODER (inverse of the decoder above) ──────────────────────────
// Serialise an ireal_chart back into iReal Pro's plain music string. The grammar
// mirrors irealTokenise(): prefixes ({ [n *Sec Tnd) precede a bar's chords; the
// terminator is | (bar), } (close-repeat), or Z (final), optionally preceded by
// ] (double-bar section end).
function _irealChartToMusic(chart){
  if(!chart||!chart.bars||!chart.bars.length) return '';
  var parts=[];
  chart.bars.forEach(function(bar){
    if(!bar) return;
    var pre='';
    if(bar.openRepeat) pre+='{';
    if(bar.endingNum)      pre+='['+bar.endingNum;
    else if(bar.sectionStart) pre+='[';
    if(bar.section){ var m={intro:'i',verse:'v'}; pre+='*'+(m[bar.section]||String(bar.section).charAt(0)); }
    if(bar.timeChange){ var ts=String(bar.timeChange).split('/'); pre+='T'+ts[0]+ts[1]; }
    var body=(bar.chords||[]).map(function(ch){
      if(ch.type==='slash')return 'p';
      if(ch.type==='rep1') return 'x';
      if(ch.type==='nc')   return 'n';
      if(ch.type==='chord'){
        var r=(ch.root||'').replace('♭','b').replace('♯','#');
        return r+(ch.qual||'')+(ch.bass?'/'+ch.bass:'');
      }
      return '';
    }).filter(Boolean).join(' ');
    var end = bar.sectionEnd ? ']' : '';
    var term = bar.final ? (end+'Z') : bar.closeRepeat ? (end+'}') : (end+'|');
    parts.push(pre+body+term);
  });
  return parts.join('');
}
// Build a full irealb:// URL for one lead sheet. obfusc50 is an involution, so
// re-running irealDecode obfuscates the plain music string for encoding.
function exportIRealURL(song){
  if(!song) return '';
  var music = _irealChartToMusic(song.ireal_chart);
  var f6 = '1r34LbKcu7' + irealDecode(music);
  var bpm = parseInt((document.getElementById('bt-tempo')||{}).value) || parseInt(song.bpm) || 120;
  var fields = [ song.title||'Untitled', song.artist||'', '', song.style||'',
                 song.key||'', '', f6, '', String(bpm), '0' ];
  return 'irealb://' + encodeURIComponent(fields.join('='));
}
function parseIRealSong(str){
  str=str.trim();if(!str)return null;
  const f=str.split('=');if(f.length<7)return null;
  const title=f[0].trim(),composer=f[1].trim(),style=f[3].trim(),key=f[4].trim();
  const rawC=f[6].trim();
  // Explicit tempo from the link (f[8]) wins; otherwise fall back to the style's
  // default tempo (or 120 if the style is unknown).
  let bpm=parseInt(f[8])||0; if(!bpm) bpm=_styleDefaultBPM(style);
  if(!title||!rawC)return null;
  const _mp='1r34LbKcu7',_pi=rawC.indexOf(_mp);
  const enc=_pi!==-1?rawC.slice(_pi+_mp.length):(rawC.length>10?rawC.slice(10):rawC);
  const dec=irealDecode(enc);const chart=irealTokenise(dec);
  // Smart default play count: songs with internal repeats play once (repeats handle repetition);
  // songs without repeats play 3 times so the form loops meaningfully.
  const hasRepeats=chart.bars.some(b=>b&&b.openRepeat);
  const plays=hasRepeats?1:3;
  return{title,artist:composer,type:'Lead Sheet',_source:'ireal',
         key,style,bpm,plays,tab_content:'',ireal_chart:chart,ireal_raw:dec};
}
function irealDecode(s){
  // iReal Pro obfusc50: swap first 5 ↔ last 5, then positions 10–23 ↔ 39–26
  function obfusc50(str){
    const a=str.split('');
    for(let i=0;i<5;i++){a[49-i]=str[i];a[i]=str[49-i];}
    for(let i=10;i<24;i++){a[49-i]=str[i];a[i]=str[49-i];}
    return a.join('');
  }
  let r='';
  while(s.length>50){const p=s.substring(0,50);s=s.substring(50);r+=s.length<2?p:obfusc50(p);}
  return r+s;
}
function irealTokenise(s){
  const bars=[];let bar=iRB(),pSec=null,pEnd=null,pTim=null,oRep=false,pSecStart=false,i=0;
  function flush(m){if(pSec)bar.section=pSec;if(pEnd)bar.endingNum=pEnd;if(pTim)bar.timeChange=pTim;
    if(pSecStart){bar.sectionStart=true;pSecStart=false;}
    if(m==='Z')bar.final=true;if(oRep){bar.openRepeat=true;oRep=false;}
    if(bar.chords.length||bar.section){bars.push(bar);}
    else if(bars.length){const prev=bars[bars.length-1];if(bar.final)prev.final=true;
      if(bar.closeRepeat)prev.closeRepeat=true;if(bar.sectionEnd)prev.sectionEnd=true;}
    bar=iRB();pSec=pEnd=pTim=null;}
  while(i<s.length){const c=s[i];
    if(/[ \t\r\n]/.test(c)){i++;continue;}
    // Skip iReal text annotations: <anything>
    if(c==='<'){while(i<s.length&&s[i]!=='>'){i++;}if(i<s.length)i++;continue;}
    // L = thin double barline, s = small barline — both act as bar separators
    if(c==='|'||c==='l'||c==='s'){flush('|');i++;continue;}
    if(c===','){i++;continue;}  // comma = visual spacer, not a barline
    if(c==='L'){
      // LZ together = barline + section end; skip both
      flush('|');i++;
      if(i<s.length&&s[i]==='Z'){i++;}
      continue;
    }
    if(c==='Z'){flush('Z');i++;continue;}
    if(c==='{'){oRep=true;i++;continue;}
    if(c==='}'){bar.closeRepeat=true;flush('}');i++;continue;}
    if(c==='['){
      if(i+1<s.length&&/[0-9]/.test(s[i+1])){pEnd=s[i+1];i+=2;}
      else{pSecStart=true;i++;}  // [ without digit = double-bar section start
      continue;
    }
    if(c===']'){
      // ] = double-barline section end (NOT a close-repeat)
      bar.sectionEnd=true;
      i++;continue;
    }
    if(c==='('){i++;continue;}  // skip optional-chord open paren
    if(c===')'){i++;continue;}  // skip optional-chord close paren
    if(c==='*'){const NM={A:'A',B:'B',C:'C',D:'D',i:'intro',v:'verse'};pSec=NM[s[i+1]]||s[i+1]||'?';i+=2;continue;}
    if(c==='T'&&i+2<s.length&&/\d/.test(s[i+1])){pTim=s[i+1]+'/'+s[i+2];i+=3;continue;}
    // "Kcl" = iReal single-bar repeat that ALSO starts a new measure: commit the
    // current bar, then emit a new bar holding a % (repeat-last) so the backing
    // track keeps playing the previous chord. (Plain K is just a spacer.)
    if(c==='K'&&s.substr(i,3)==='Kcl'){flush('|');bar.chords.push({type:'rep1'});flush('|');i+=3;continue;}
    if('QSfYyUKX'.includes(c)){i++;continue;}
    if(c==='x'){bar.chords.push({type:'rep1'});i++;continue;}
    if(c==='n'){bar.chords.push({type:'nc'});i++;continue;}
    if(c==='p'){bar.chords.push({type:'slash'});i++;continue;}
    if(c==='W'){i++;continue;}
    if(/[A-G]/.test(c)){
      let root=c;i++;
      let qual='';
      // qual terminates at spaces, bar chars, structural chars, parens, or uppercase L
      while(i<s.length&&!/[ |lLZ{}\[\]()\r\n*xXnpQSWfYyUKs,]/.test(s[i])){qual+=s[i];i++;}
      // In decoded iReal format, a leading 'b' or '#' in qual is a root accidental
      if(qual.startsWith('b')&&qual.length>1&&!/\d/.test(qual[1])){root+='♭';qual=qual.slice(1);}
      else if(qual.startsWith('b')){root+='♭';qual=qual.slice(1);}
      else if(qual.startsWith('#')){root+='♯';qual=qual.slice(1);}
      let bass='';const sp=qual.indexOf('/');
      if(sp!==-1){bass=qual.slice(sp+1);qual=qual.slice(0,sp);}
      bar.chords.push({type:'chord',root,qual,bass});continue;
    }
    i++;
  }
  if(bar.chords.length||bar.section)bars.push(bar);
  return{bars};
}
function iRB(){return{chords:[],section:null,endingNum:null,timeChange:null,openRepeat:false,closeRepeat:false,sectionStart:false,sectionEnd:false,final:false};}
function irealChordHTML(root,qual,bass){
  // Defensive: old-format songs may omit qual/bass entirely
  qual = qual != null ? qual : '';
  bass = bass != null ? bass : '';
  // root already has \u266d/\u266f embedded by tokenizer (e.g. 'B\u266d', 'E\u266d')
  // bass may still be in raw ASCII form (e.g. 'Bb', 'Ab', 'F#') \u2014 normalise it
  function normNote(n){
    if(!n)return n;
    // already contains unicode accidental
    if(n.includes('\u266d')||n.includes('\u266f'))return n;
    // ASCII post-root flat/sharp (new format): 'Bb' \u2192 'B\u266d'
    if(n.length===2&&n[1]==='b')return n[0]+'\u266d';
    if(n.length===2&&n[1]==='#')return n[0]+'\u266f';
    return n;
  }
  // Root-level flat gets its own class (ls-flat, on top of the bare
  // character already in dr) \u2014 U+266D draws noticeably larger than the
  // surrounding text in most UI/print fonts (unlike U+266F sharp, which
  // already sits close to the right size), so it needs separate sizing.
  // See .ls-flat / .ls-delta CSS (both the live stylesheet and the
  // generated print stylesheet) for the actual correction.
  function wrapFlat(n){ return n && n.includes('\u266d') ? n.replace('\u266d', '<span class="ls-flat">\u266d</span>') : n; }
  const dr=wrapFlat(normNote(root));
  const q=qual.replace(/\^/g,'<span class="ls-q ls-delta">\u25b3</span>')
    .replace(/h/g,'<span class="ls-q">\u00f8</span>')
    .replace(/\bo\b/g,'<span class="ls-q">\u00b0</span>')
    .replace(/-/g,'m').replace(/sus/g,'<span class="ls-q">sus</span>')
    .replace(/add/g,'<span class="ls-q">add</span>')
    .replace(/b([1-9])/g,'<span class="ls-q ls-flat">\u266d$1</span>')
    .replace(/#([1-9])/g,'<span class="ls-q">\u266f$1</span>')
    .replace(/(\d+)/g,'<span class="ls-q">$1</span>')
    .replace(/\+/g,'<span class="ls-q">+</span>');
  const db=bass?'<span class="ls-bs">/'+wrapFlat(normNote(bass))+'</span>':'';
  return`<span class="ls-chord-nm">${dr}${q}${db}</span>`;
}
// Transpose a unicode-accidental root (e.g. 'B♭', 'E♭') by n semitones.
// Always outputs flat-spelled notes (jazz convention).
function transposeIRealRoot(root, n){
  if(!n)return root;
  const ascii=root.replace('♭','b').replace('♯','#');
  const idx=noteIndex(ascii);if(idx===-1)return root;
  const ni=((idx+n)%12+12)%12;
  const note=FLATS[ni]; // e.g. 'Bb','Eb','Ab'
  return note.replace('b','♭').replace('#','♯');
}
// Transpose an ASCII bass note (e.g. 'Bb','Ab') by n semitones — stays ASCII.
function transposeIRealBass(bass,n){
  if(!bass||!n)return bass;
  const idx=noteIndex(bass);if(idx===-1)return bass;
  const ni=((idx+n)%12+12)%12;
  return FLATS[ni];
}
// ── PERMANENT LEAD-SHEET TRANSPOSE ───────────────────────────────────────────
// Rewrites every chord (and the stored key) in the chart by n semitones.
// Mirrors the song editor's edit-tr-up/edit-tr-down (a permanent rewrite of
// the underlying data), as opposed to the reading-view Key/transpose control
// which only shifts the display.
function _lsTransposeChart(song, delta) {
  if (!song || !song.ireal_chart || !Array.isArray(song.ireal_chart.bars)) return;
  song.ireal_chart.bars.forEach(bar => {
    (bar.chords || []).forEach(ch => {
      if (ch.type !== 'chord') return;
      if (ch.root) ch.root = transposeIRealRoot(ch.root, delta);
      if (ch.bass) ch.bass = transposeIRealBass(ch.bass, delta);
    });
  });
  if (song.key) song.key = transposeKey(song.key, delta) || song.key;
  saveSongs();
  _scheduleLsCollabEditBroadcast(song);
  renderIRealSong(song);
  showToast((delta > 0 ? '♯ Transposed up' : '♭ Transposed down') + ' a semitone');
}

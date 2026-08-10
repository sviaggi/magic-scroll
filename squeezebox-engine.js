/**
 * squeezebox-engine.js — Chord diagram rendering for melodeons and Anglo
 * concertinas (button accordions), offloaded from the main app shell.
 *
 * Loaded as a plain (non-module) script, same pattern as chord-engine.js
 * and backing-track.js: declares its functions/consts at top level so the
 * rest of the app can call isSqueezebox(), makeSqueezeboxSVG(), etc.
 * directly, but keeps this ~300-line, rarely-touched subsystem out of the
 * main HTML file so it isn't re-parsed with every edit to the shell.
 */
// ===== SQUEEZEBOX MODULE (injected) =====
// ═══════════════════════════════════════════════════════════════════════════
// SQUEEZEBOX CHORD DIAGRAMS  (button accordion / concertina)
// Bisonoric instruments: every button gives one note on the PUSH (close, red)
// and another on the PULL (open/draw, blue). Rows follow the Richter pattern
// (push = tonic-triad notes ascending; pull = 2nd/4th/6th/7th). For a tuning
// "X/Y", X is the outer/home row a fifth above the inner row Y. Melodeons add
// a left-hand bass/chord block; Anglo concertinas have two 3-row ends plus an
// accidental row (modelled as a Richter row a semitone above the inner row).
// ═══════════════════════════════════════════════════════════════════════════
const _SQ_PC = {C:0,'C#':1,Db:1,D:2,'D#':3,Eb:3,E:4,'E#':5,Fb:4,F:5,'F#':6,Gb:6,G:7,'G#':8,Ab:8,A:9,'A#':10,Bb:10,B:11,'Cb':11,'B#':0};
const _SQ_SHARP = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
const _SQ_FLAT  = ['C','Db','D','Eb','E','F','Gb','G','Ab','A','Bb','B'];
function sqName(pc, flat){ pc=((pc%12)+12)%12; return (flat?_SQ_FLAT:_SQ_SHARP)[pc]; }

// id -> tuning. outer = home row (fifth above inner). bc = special B/C chromatic.
const SQ_TUNINGS = {
  mel_dg:  {kind:'melodeon',   label:'D/G melodeon',   outer:2,  inner:7},
  mel_ad:  {kind:'melodeon',   label:'A/D melodeon',   outer:9,  inner:2},
  mel_cf:  {kind:'melodeon',   label:'C/F melodeon',   outer:0,  inner:5},
  mel_bbeb:{kind:'melodeon',   label:'B♭/E♭ melodeon', outer:10, inner:3, flat:true},
  mel_bc:  {kind:'melodeon',   label:'B/C melodeon',   outer:11, inner:0, bc:true},
  ang_gc:  {kind:'concertina', label:'G/C Anglo',      outer:7,  inner:0},
  ang_dg:  {kind:'concertina', label:'D/G Anglo',      outer:2,  inner:7},
  ang_ad:  {kind:'concertina', label:'A/D Anglo',      outer:9,  inner:2},
  ang_cf:  {kind:'concertina', label:'C/F Anglo',      outer:0,  inner:5},
  ang_bbeb:{kind:'concertina', label:'B♭/E♭ Anglo', outer:10, inner:3, flat:true}
};
const SQUEEZE_IDS = new Set(Object.keys(SQ_TUNINGS));
function isSqueezebox(inst){ return SQUEEZE_IDS.has(inst); }
function shortName(inst){ const t=SQ_TUNINGS[inst]; return t ? ('a '+t.label) : 'this box'; }

const _SQ_QUAL = {
  '':[0,4,7],'maj':[0,4,7],'M':[0,4,7],'m':[0,3,7],'min':[0,3,7],'-':[0,3,7],
  'dim':[0,3,6],'aug':[0,4,8],'+':[0,4,8],
  '7':[0,4,7,10],'maj7':[0,4,7,11],'M7':[0,4,7,11],'m7':[0,3,7,10],'mmaj7':[0,3,7,11],
  '6':[0,4,7,9],'m6':[0,3,7,9],'sus2':[0,2,7],'sus4':[0,5,7],'sus':[0,5,7],
  'dim7':[0,3,6,9],'m7b5':[0,3,6,10],'h7':[0,3,6,10],
  '9':[0,4,7,10,2],'maj9':[0,4,7,11,2],'m9':[0,3,7,10,2],'add9':[0,4,7,2],
  '7b5':[0,4,6,10],'7#5':[0,4,8,10],'5':[0,7]
};

function sqParseChord(name){
  if(!name) return null;
  const m = String(name).match(/^([A-G][b#]?)(.*)$/); if(!m) return null;
  const rootPC = _SQ_PC[m[1]]; if(rootPC==null) return null;
  let q = m[2].split('/')[0].trim();
  q = q.replace(/^Maj/,'maj').replace(/^Major/i,'maj').replace(/^Minor/i,'m').replace(/^Min/i,'m');
  let ivl = _SQ_QUAL[q];
  if(!ivl){
    const order=['mmaj7','maj9','maj7','m7b5','dim7','m9','m7','m6','sus4','sus2','add9','7b5','7#5','min','maj','dim','aug','m','9','6','7','5'];
    for(const k of order){ if(q.startsWith(k)&&_SQ_QUAL[k]){ ivl=_SQ_QUAL[k]; break; } }
  }
  if(!ivl) ivl=_SQ_QUAL[''];
  const flat = m[1].indexOf('b')!==-1;
  return {
    rootPC, thirdPC:(rootPC+ivl[1])%12,
    fifthPC: ivl.length>2?(rootPC+ivl[2])%12:null,
    seventhPC: ivl.length>3?(rootPC+ivl[3])%12:null,
    isMinor: ivl[1]===3, pcs:new Set(ivl.map(i=>(rootPC+i)%12)),
    rootName:m[1], quality:q, flat
  };
}

// Richter row: push ascends tonic triad (0,4,7…); pull ascends 2,5,9,11.
function sqRichter(tonic,n){
  const tri=[0,4,7], dr=[2,5,9,11], out=[];
  for(let i=0;i<n;i++) out.push({p:(tonic+tri[i%3])%12, d:(tonic+dr[i%4])%12});
  return out;
}

function sqLayout(inst){
  const t = SQ_TUNINGS[inst]; if(!t) return null;
  const fl = !!t.flat;
  if(t.kind==='melodeon'){
    let bass;
    if(t.bc){
      bass=[ {bass:{p:0,d:5}, chord:{p:{root:0,min:false}, d:{root:5,min:false}}, pL:'C', dL:'F'},
             {bass:{p:7,d:2}, chord:{p:{root:7,min:false}, d:{root:2,min:false}}, pL:'G', dL:'D'} ];
    } else {
      const innerIV=(t.inner+5)%12, outerV=(t.outer+7)%12;
      bass=[ {bass:{p:t.inner,d:innerIV}, chord:{p:{root:t.inner,min:false}, d:{root:innerIV,min:false}}, pL:sqName(t.inner,fl), dL:sqName(innerIV,fl)},
             {bass:{p:t.outer,d:outerV},  chord:{p:{root:t.outer,min:false}, d:{root:outerV,min:false}},  pL:sqName(t.outer,fl), dL:sqName(outerV,fl)} ];
    }
    return { kind:'melodeon', name:t.label,
      rows:[ {label:sqName(t.outer,fl)+' row (outer)', buttons:sqRichter(t.outer,11)},
             {label:sqName(t.inner,fl)+' row (inner)', buttons:sqRichter(t.inner, t.bc?11:10)} ],
      bass };
  }
  // concertina: outer (home) + inner rows, plus accidental row a semitone above inner
  const inRow=sqRichter(t.inner,10), outRow=sqRichter(t.outer,10), accRow=sqRichter((t.inner+1)%12,10);
  return { kind:'concertina', name:t.label,
    left:[ {label:'acc',buttons:accRow.slice(0,5)}, {label:'out',buttons:outRow.slice(0,5)}, {label:'in',buttons:inRow.slice(0,5)} ],
    right:[ {label:'acc',buttons:accRow.slice(5,10)}, {label:'out',buttons:outRow.slice(5,10)}, {label:'in',buttons:inRow.slice(5,10)} ] };
}

function _sqAllButtons(L){
  const out=[];
  if(L.rows) L.rows.forEach(r=>r.buttons.forEach(b=>out.push(b)));
  if(L.left) L.left.forEach(r=>r.buttons.forEach(b=>out.push(b)));
  if(L.right) L.right.forEach(r=>r.buttons.forEach(b=>out.push(b)));
  return out;
}

function sqAnalyze(inst, chord){
  const L=sqLayout(inst); if(!L||!chord) return null;
  const reach=new Set();
  _sqAllButtons(L).forEach(b=>{ if(chord.pcs.has(b.p)) reach.add(b.p); if(chord.pcs.has(b.d)) reach.add(b.d); });
  if(L.bass) L.bass.forEach(bb=>[bb.bass.p,bb.bass.d].forEach(pc=>{ if(chord.pcs.has(pc)) reach.add(pc); }));
  const tones=[{pc:chord.rootPC,n:'root'},{pc:chord.thirdPC,n:'3rd'}];
  if(chord.fifthPC!=null) tones.push({pc:chord.fifthPC,n:'5th'});
  if(chord.seventhPC!=null) tones.push({pc:chord.seventhPC,n:'7th'});
  const missing=tones.filter(t=>!reach.has(t.pc));
  const rootOK=reach.has(chord.rootPC);
  let warn=null, level='ok';
  if(!rootOK||reach.size===0){ level='none'; warn=`Not playable on ${shortName(inst)} — needs a differently-tuned box`; }
  else if(missing.length){ level='partial'; warn=`Incomplete on ${shortName(inst)}: missing ${missing.map(t=>t.n).join(', ')}`; }
  return { reach, missing, warn, level, full:level==='ok' };
}

// ── RENDERING ────────────────────────────────────────────────────────────────
const SQ_PULL='#2f6fb0', SQ_PUSH='#c0392b', SQ_EMPTY='#ece6db', SQ_EMPTY_STK='#cabfae';
// Empty-button + container styling. Overridden per-render: lead-sheet (compact)
// diagrams use a transparent background and accent-coloured outlines so they sit
// cleanly on any theme; the panel keeps the cream parchment look.
let _SQ_eFill=SQ_EMPTY, _SQ_eStroke=SQ_EMPTY_STK, _SQ_eOp='1';

function _sqHalf(cx,cy,r,color,side){ // 'ul'=push(red) top-left, 'lr'=pull(blue) bottom-right
  const k=0.7071*r;
  const p1=[cx+k,cy-k], p2=[cx-k,cy+k];
  const sweep = side==='ul'?1:0;
  return `<path d="M${p1[0].toFixed(2)} ${p1[1].toFixed(2)} A${r} ${r} 0 0 ${sweep} ${p2[0].toFixed(2)} ${p2[1].toFixed(2)} Z" fill="${color}"/>`;
}

function _sqButton(cx,cy,r,b,chord,noLabel){
  const push = chord.pcs.has(b.p), pull = chord.pcs.has(b.d);
  let svg='', label='', label2='', isRoot=false, is7=false, fill=null;
  if(push&&pull){
    svg += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${SQ_PULL}"/>`;
    svg += _sqHalf(cx,cy,r,SQ_PUSH,'ul');
    label = sqName(b.p, chord.flat); label2 = sqName(b.d, chord.flat);
    isRoot = (b.p===chord.rootPC||b.d===chord.rootPC);
    is7 = (chord.seventhPC!=null && (b.p===chord.seventhPC||b.d===chord.seventhPC));
  } else if(push){
    fill=SQ_PUSH; label=sqName(b.p,chord.flat);
    isRoot=b.p===chord.rootPC; is7=chord.seventhPC!=null&&b.p===chord.seventhPC;
  } else if(pull){
    fill=SQ_PULL; label=sqName(b.d,chord.flat);
    isRoot=b.d===chord.rootPC; is7=chord.seventhPC!=null&&b.d===chord.seventhPC;
  } else {
    return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${_SQ_eFill}" stroke="${_SQ_eStroke}" stroke-opacity="${_SQ_eOp}" stroke-width="0.8"/>`;
  }
  if(fill) svg += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}"/>`;
  if(is7)   svg += `<circle cx="${cx}" cy="${cy}" r="${r+2.2}" fill="none" stroke="#7a5a00" stroke-width="1.4" stroke-dasharray="2 2"/>`;
  if(isRoot)svg += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#1a1a1a" stroke-width="2.2"/>`;
  else      svg += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="rgba(0,0,0,0.25)" stroke-width="0.8"/>`;
  if(noLabel) return svg;
  if(label2){
    svg += `<text x="${cx}" y="${cy-1.5}" text-anchor="middle" font-size="${r*0.78}" font-weight="700" fill="#fff" font-family="sans-serif">${label}</text>`;
    svg += `<text x="${cx}" y="${cy+r*0.78}" text-anchor="middle" font-size="${r*0.78}" font-weight="700" fill="#fff" font-family="sans-serif">${label2}</text>`;
  } else {
    svg += `<text x="${cx}" y="${cy+r*0.34}" text-anchor="middle" font-size="${r*0.86}" font-weight="700" fill="#fff" font-family="sans-serif">${label}</text>`;
  }
  return svg;
}

// compact=true → strip captions/labels/status (for tiny lead-sheet cells)
function makeSqueezeboxSVG(name, inst, scale, compact){
  scale = scale||1;
  const chord = sqParseChord(name); const L = sqLayout(inst);
  if(!chord||!L) return null;
  const A = sqAnalyze(inst, chord);
  const R=11, SP=26, PAD = compact?4:10;
  const labelColor='#6b6157';
  // Lead-sheet (compact): transparent bg + accent outlines so it reads on any theme.
  const boxFill   = compact ? 'none' : '#fbf8f2';
  const boxStroke = compact ? 'var(--c-accent)' : '#e3dccd';
  _SQ_eFill   = compact ? 'none' : SQ_EMPTY;
  _SQ_eStroke = compact ? 'var(--c-accent)' : SQ_EMPTY_STK;
  _SQ_eOp     = compact ? '0.55' : '1';
  const cap = compact ? 0 : 1;            // show captions?
  const noLab = !!compact;                // hide per-button note labels when tiny
  let body='', W, H;

  if(L.kind==='melodeon'){
    const ROWP = compact ? 26 : 42;
    const headY = PAD + 9;
    const bassNoteX  = PAD + R + 2;
    const bassChordX = bassNoteX + SP;
    const rowsStartX = bassChordX + R + (compact?10:22);
    if(cap){
      body += `<text x="${PAD}" y="${headY}" font-size="9" fill="${labelColor}" font-family="sans-serif">Bass (L.H.)</text>`;
      body += `<text x="${rowsStartX}" y="${headY}" font-size="9" fill="${labelColor}" font-family="sans-serif">Melody (R.H.)</text>`;
    }
    const topPad = compact ? PAD : (headY + 11);
    const rowCy = ri => topPad + ri*ROWP + R;
    let maxX = rowsStartX;
    L.rows.forEach((row,ri)=>{
      const indent = ri*(SP/2);
      const cy = rowCy(ri);
      if(cap) body += `<text x="${rowsStartX+indent}" y="${cy-R-3}" font-size="8.5" fill="${labelColor}" font-family="sans-serif">${row.label}</text>`;
      row.buttons.forEach((b,ci)=>{
        const cx = rowsStartX + indent + ci*SP + R;
        body += _sqButton(cx,cy,R,b,chord,noLab);
        if(cx+R>maxX) maxX=cx+R;
      });
    });
    L.bass.forEach((e,i)=>{
      const cy = rowCy(i);
      const bsPush = e.bass.p===chord.rootPC, bsPull = e.bass.d===chord.rootPC;
      if(cap) body += `<text x="${bassNoteX}" y="${cy-R-3}" text-anchor="middle" font-size="7.5" fill="${labelColor}" font-family="sans-serif">${e.pL}/${e.dL}</text>`;
      body += _sqButton(bassNoteX,cy,R, {p: bsPush?chord.rootPC:-1, d: bsPull?chord.rootPC:-1}, chord, noLab);
      const ccx = bassChordX;
      const cMatch = dir => { const c=e.chord[dir]; return c && c.root===chord.rootPC && c.min===chord.isMinor; };
      const cp=cMatch('p'), cd=cMatch('d');
      let cfill=_SQ_eFill;
      if(cp&&cd) cfill=SQ_PULL; else if(cp) cfill=SQ_PUSH; else if(cd) cfill=SQ_PULL;
      body += `<rect x="${ccx-R}" y="${cy-R}" width="${2*R}" height="${2*R}" rx="3" fill="${cfill}" stroke="${_SQ_eStroke}" stroke-opacity="${_SQ_eOp}" stroke-width="0.8"/>`;
      if(cp&&cd) body += _sqHalf(ccx,cy,R-0.5,SQ_PUSH,'ul');
      if((cp||cd) && !noLab){
        const txt = (cp&&cd) ? (e.pL+'/'+e.dL) : (cp?e.pL:e.dL);
        body += `<text x="${ccx}" y="${cy+3}" text-anchor="middle" font-size="${(cp&&cd)?7.5:9}" font-weight="700" fill="#fff" font-family="sans-serif">${txt}</text>`;
      }
    });
    W = maxX + PAD;
    H = topPad + L.rows.length*ROWP + R + (compact?PAD:4);
  } else {
    const topY = compact ? PAD : PAD+18;
    const drawEnd=(groups, x0, title)=>{
      let s = cap ? `<text x="${x0}" y="${PAD+8}" font-size="9" fill="${labelColor}" font-family="sans-serif">${title}</text>` : '';
      groups.forEach((row,ri)=>{
        const cy = topY + ri*SP + R;
        row.buttons.forEach((b,ci)=>{
          const cx = x0 + R + ci*SP + (ri===1? SP*0.5 : ri===0? SP*0.25 : 0);
          s += _sqButton(cx,cy,R,b,chord,noLab);
        });
      });
      return s;
    };
    const endW = 5*SP + SP*0.5 + 2*R;
    const gap = compact?14:24;
    body += drawEnd(L.left,  PAD, 'Left end');
    body += drawEnd(L.right, PAD+endW+gap, 'Right end');
    const bxc=PAD+endW+gap/2;
    body += `<line x1="${bxc}" y1="${topY}" x2="${bxc}" y2="${topY+3*SP}" stroke="${SQ_EMPTY_STK}" stroke-width="1" stroke-dasharray="3 3"/>`;
    W = PAD+endW+gap+endW+PAD;
    H = topY+3*SP+R+(compact?PAD:6);
  }

  let statusSvg='';
  if(cap){
    let status, scol;
    if(A.warn){ status=A.warn; scol = A.level==='none' ? '#b3261e' : '#9a6a00'; }
    else { status='Fully playable on '+shortName(inst); scol='#3a7d33'; }
    statusSvg = `<text x="${PAD}" y="${H+9}" font-size="9.5" font-weight="600" fill="${scol}" font-family="sans-serif">${status}</text>`;
    H += 14;
  }

  return `<svg width="${Math.round(W*scale)}" height="${Math.round(H*scale)}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">`+
         `<rect x="0" y="0" width="${W}" height="${H}" rx="4" fill="${boxFill}" stroke="${boxStroke}" stroke-width="1"/>`+
         body + statusSvg + `</svg>`;
}

// ===== END SQUEEZEBOX MODULE =====

// Static checks for every chapter: node tests/validate.mjs → exits 1 on problems.
import fs from 'node:fs';import vm from 'node:vm';
const html=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');
const scripts=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1]).filter(x=>!x.includes('window.LEX='));
const ctx={state:{f:{},items:[],badges:[],lv:{}},ZID:'',console};vm.createContext(ctx);
vm.runInContext(scripts[0].replace('const CHAPTERS','var CHAPTERS'),ctx);
for(const s of scripts.slice(1,-1))vm.runInContext(s,ctx);
const errs=[];const allWords=new Map();
for(const CH of ctx.CHAPTERS){
 const E=m=>errs.push(`${CH.id}: ${m}`);
 for(const k of ['id','n','title','save','start','make','words','color','place'])if(CH[k]==null)E('missing '+k);
 ctx.state={f:{},items:[],badges:[],lv:{}};const C=CH.make();
 if(C.WORDS.length!==CH.words)E(`words count ${C.WORDS.length} ≠ ${CH.words}`);
 for(const w of C.WORDS){if(allWords.has(w))E(`word "${w}" already taught in ${allWords.get(w)}`);allWords.set(w,CH.id)}
 const walk=(Z,x,y)=>{const c=Z.map[y]&&Z.map[y][x];return !!(c&&Z.legend[c]&&Z.legend[c].walk)};
 const st=CH.start;if(!C.ZONES[st.zone]||!walk(C.ZONES[st.zone],st.x,st.y))E('start not walkable');
 for(const [id,Z] of Object.entries(C.ZONES)){
  const W=Z.map[0].length;Z.map.forEach((r,i)=>{if(r.length!==W)E(`${id} row ${i} len ${r.length}≠${W}`);[...r].forEach(c=>{if(!Z.legend[c])E(`${id} unknown tile char "${c}"`)})});
  if(Z.map.length<10||W<11)E(`${id} map smaller than the 11x10 view`);
  for(const L of Object.values(Z.legend))if(!(L.tile in (C.TILES||{}))&&!['hull','deck','grate','window','console','hydro','bunk','terminal','pipes','engine','airlock','ring','plate','planetWin','crate','stall','lift','tree','lawn','stone','dome','cable','police','cafe','flowers','pond','bench'].includes(L.tile))E(`${id} tile fn missing: ${L.tile}`);
  // a locked door may lead to a room this 교시 doesn't have (학교 앞's shops)
  for(const [k,w] of Object.entries(Z.warps||{})){const [x,y]=k.split(',').map(Number);if(!walk(Z,x,y))E(`${id} warp ${k} not walkable`);const T=C.ZONES[w.to];if(!T){if(!w.lock)E(`${id} warp to unknown ${w.to}`);continue}if(!walk(T,w.x,w.y)||(T.warps||{})[w.x+','+w.y])E(`${id} warp ${k} lands on bad tile ${w.to} ${w.x},${w.y}`)}
  for(const [c,th] of Object.entries(Z.things||{})){ // a line for every tile of a kind
   if(!Z.legend[c])E(`${id} things key "${c}" is not a tile in its legend`);else if(Z.legend[c].walk)E(`${id} things "${c}" is a walkable tile`);
   if(!Z.map.some(r=>r.includes(c)))E(`${id} things "${c}" is not on the map`);
   const vs=[].concat(typeof th==='function'?th(0,0):th).filter(Boolean);
   for(const v of vs){if(typeof v!=='string')E(`${id} things "${c}" gives a non-string`);else if(/[A-Za-z]/.test(v)||v.length>60)E(`${id} things "${c}" line is English or too long: ${v}`)}}
  for(const k of Object.keys(Z.spots||{})){const [x,y]=k.split(',').map(Number);if(walk(Z,x,y))E(`${id} spot ${k} is on a walkable tile`)}
  for(const k of Z.npcs){const n=C.NPC[k];if(!n){E('no npc '+k);continue}if(n.zone!==id)E(`npc ${k} zone ${n.zone}≠${id}`);if(!walk(Z,n.x,n.y)&&!n.proxy&&!n.sit)E(`npc ${k} on unwalkable ${n.x},${n.y}`);if(n.chat&&(!C.NPC[n.chat]||C.NPC[n.chat].zone!==id))E(`npc ${k} chats with ${n.chat}, who isn't in ${id}`)}  // a proxy (e.g. a table) may stand on furniture
 }
 if(!Object.values(C.ZONES).some(Z=>Object.values(Z.legend).some(L=>L.tile==='terminal'||L.term)))E('no review computer anywhere (a terminal tile, or a legend entry with term:1)');
 // review asks a word's own questions; gram:1 ones (척, -대, -다 보니 asked under some word) don't count, so each word needs one that isn't
 {const qs=[...(C.BANK||[]),...Object.entries(C.Q).filter(([k])=>k!=='cafe').flatMap(([,v])=>v)];
  for(const w of C.WORDS)if(!qs.some(q=>q.w===w&&!q.gram))E(`word "${w}" has no question of its own (all gram:1 or none): review can't ask it`)}
 // one tileset: a 교시 draws a school tile its own way only as a declared story variant (VARIANTS), never by redefining it
 if(ctx.SCHOOL_TILES){const S=ctx.SCHOOL_TILES,V=C.VARIANTS||{};
  for(const k of Object.keys(V))if(!(k in S))E(`VARIANTS.${k} is not a school tile: give it its own name in TILES`);
  for(const k of Object.keys(S))if(C.TILES[k]!==S[k]&&C.TILES[k]!==V[k])E(`TILES.${k} redraws the school's tile: declare it in VARIANTS, or give it its own name`)}
 for(const [id,Z] of Object.entries(C.ZONES)){if(Z.floor&&!(Z.floor in C.TILES))E(`${id} floor "${Z.floor}" is not a tile`);
  for(const [c,L] of Object.entries(Z.legend))if(L.floor&&!(L.floor in C.TILES))E(`${id} "${c}" floor "${L.floor}" is not a tile`)}
 // one school (src/school.js): every 교시 has every school zone, same walls, doors and warps; it may only paint props onto floor or wall
 if(ctx.SCHOOL_BASE){const B=ctx.SCHOOL_BASE(),STRUCT=new Set([...ctx.SCHOOL_WALLISH,'building','fence','gymBldg','clock']);
  for(const [id,S] of Object.entries(B)){const Z=C.ZONES[id];if(!Z){E(`school zone ${id} missing`);continue}
   if(Z.map.length!==S.map.length||Z.map[0].length!==S.map[0].length){E(`school ${id} size changed`);continue}
   const painted=new Set(Z.painted||[]);
   Z.map.forEach((row,y)=>[...row].forEach((c,x)=>{const b=S.map[y][x],k=x+','+y;
    if(c===b&&Z.legend[c].tile===S.legend[b].tile)return;
    if(!painted.has(k))E(`school ${id} ${k} is "${c}" but the school has "${b}" (paint it, or change src/school.js)`);
    else if(S.warps[k])E(`school ${id} ${k}: a door can't be painted over`);
    else if(STRUCT.has(S.legend[b].tile)&&Z.legend[c].walk)E(`school ${id} ${k}: a wall can't be painted walkable`)}));
   for(const k of Object.keys(S.warps)){const w=Z.warps[k],s=S.warps[k];if(!w||w.to!==s.to||w.x!==s.x||w.y!==s.y)E(`school ${id} warp ${k} differs from the school's`)}
   for(const k of Object.keys(Z.warps))if(!S.warps[k]&&!(id==='yard'&&/^1[12],13$/.test(k)))E(`school ${id} has an extra warp ${k}`)}}
 const qs=[...Object.values(C.Q).flat(),...(C.BANK||[])];const hasQ=new Set(qs.map(q=>q.w).filter(Boolean));
 for(const q of qs){if(q.w&&!C.WORDS.includes(q.w))E(`question w "${q.w}" not a chapter word`);if(q.opts&&!q.opts.some(o=>o[1]))E('question without a right answer: '+q.ask);if(q.opts)q.opts.filter(o=>!o[1]).forEach(o=>{if(!o[2])E('wrong option without explanation: '+o[0])})}
 const badge=new Set(Object.values(C.NPC).flatMap(n=>n.badge||[]));
 for(const w of C.WORDS){if(!hasQ.has(w))E('no question for '+w);if(!C.DICT[w])E('no DICT for '+w);else for(const k of ['k','e','ex'])if(!C.DICT[w][k])E(`DICT ${w} missing ${k}`);if(!badge.has(w))E('no NPC teaches '+w)}
 // in-character review (C.REVIEW): people use a learned word again in their own voice. Every word: a line by someone who
 // teaches it, and lines from at least two people; the notebook (복습 노트) asks a generic BANK sentence for every word.
 if(C.REVIEW){const ids=new Set(Object.keys(C.NPC)),names=new Set(Object.values(C.NPC).map(n=>n.name));
  const speaks=(r,k)=>[].concat(r.by).some(b=>b===k||b===C.NPC[k].name);
  for(const r of C.REVIEW){const tag=`REVIEW ${r.w} "${r.ask}"`;
   if(!allWords.has(r.w))E(`${tag}: not a word of this or an earlier 교시`);  // earlier 교시' words come back when due (GAME.srs.shared)
   if(!r.by)E(`${tag}: no by`);else for(const b of [].concat(r.by))if(!ids.has(b)&&!names.has(b))E(`${tag}: by "${b}" is no NPC id or name`);
   if(typeof r.ask!=='string'||(r.ask.match(/___/g)||[]).length!==1)E(`${tag}: needs exactly one ___`);
   if(/[A-Za-z]/.test(r.ask)||r.ask.length>52)E(`${tag}: English or longer than 52`);
   if(r.scene||r.gram)E(`${tag}: scene/gram don't apply to review lines`);
   if(!r.opts||r.opts.filter(o=>o[1]).length!==1)E(`${tag}: needs exactly one right option`);
   else r.opts.filter(o=>!o[1]).forEach(o=>{if(!o[2])E(`${tag}: wrong option without explanation: ${o[0]}`)});
   if(r.when&&typeof r.when!=='function')E(`${tag}: when must be a function`)}
  for(const w of C.WORDS){const L=C.REVIEW.filter(r=>r.w===w),teach=Object.keys(C.NPC).filter(k=>(C.NPC[k].badge||[]).includes(w));
   if(!L.some(r=>teach.some(k=>speaks(r,k))))E(`REVIEW: no line for "${w}" by anyone who teaches it (${teach.join(', ')})`);
   const who=new Set(L.flatMap(r=>Object.keys(C.NPC).filter(k=>speaks(r,k)).map(k=>C.NPC[k].name)));
   if(who.size<2)E(`REVIEW: "${w}" is reviewed by ${who.size} person (want 2+)`);
   if(!(C.BANK||[]).some(q=>q.w===w&&!q.scene&&!q.gram))E(`BANK: no generic sentence for "${w}" (the 복습 노트 asks those)`)}}
 // class time (C.CLASS): each subject narrates, and its lines are questions on chapter words, said by someone
 for(const [k,c] of Object.entries(C.CLASS||{})){if(typeof c.say!=='string')E(`CLASS ${k}: no narration`);
  for(const l of c.lines||[]){const tag=`CLASS ${k} ${l.w} "${l.ask}"`;if(!C.WORDS.includes(l.w))E(`${tag}: not a chapter word`);if(!l.who)E(`${tag}: no speaker`);
   if((l.ask.match(/___/g)||[]).length!==1)E(`${tag}: needs exactly one ___`);if(l.ask.length>52)E(`${tag}: longer than 52`);
   if(!l.opts||l.opts.filter(o=>o[1]).length!==1)E(`${tag}: needs exactly one right option`);else l.opts.filter(o=>!o[1]).forEach(o=>{if(!o[2])E(`${tag}: wrong option without explanation: ${o[0]}`)})}}
 const src=CH.make.toString();for(const m of src.matchAll(/\{([^|{}'"`]+)\|([^}'"`]+)\}/g))if(/[가-힣]/.test(m[1])&&!C.DICT[m[2]])E('gloss key missing: '+m[2]);
 if(typeof C.questText()!=='string')E('questText must return a string');
}
// the engine is generated from the shared walk-engine: the copy here must match it
{const shared=new URL('../../walk-engine/engine.js',import.meta.url);if(fs.existsSync(shared)){const mine=fs.readFileSync(new URL('../src/engine.js',import.meta.url),'utf8').replace(/^\/\*[^\n]*\*\/\n/,'');
 if(mine!==fs.readFileSync(shared,'utf8')){errs.push('src/engine.js differs from walk-engine/engine.js — edit walk-engine and run its sync.sh')}}}
// the page's stylesheet: one <style> block, and nothing CSS-like after it in the head (a stray </style> once printed CSS as page text)
{const sh=fs.readFileSync('src/shell.html','utf8'),o=(sh.match(/<style/g)||[]).length,c=(sh.match(/<\/style>/g)||[]).length;
 if(o!==c)errs.push(`src/shell.html: ${o} <style> but ${c} </style>`);
 const head=sh.slice(sh.lastIndexOf('</style>')+8,sh.indexOf('</head>'));if(/[{}]/.test(head.replace(/<[^>]*>/g,'')))errs.push('src/shell.html: CSS-looking text after the last </style> (it would show on the page)')}
// 문화 노트 and 문법 노트 cite their sources the same way: every source has a title and an https link, and every explanation line
// cites at least one of them (numbers into src)
const citations=(kind,k,n)=>{
 if(!Array.isArray(n.src)||!n.src.length)errs.push(`${kind} ${k}: no sources`);
 (n.src||[]).forEach(([t,u],i)=>{if(!t||!/^https:\/\//.test(u||''))errs.push(`${kind} ${k}: source ${i+1} needs a title and an https link`)});
 (n.lines||[]).forEach(([,,s],i)=>{if(!Array.isArray(s)||!s.length||s.some(x=>!(x>=1&&x<=(n.src||[]).length)))errs.push(`${kind} ${k} line ${i+1}: must cite sources 1–${(n.src||[]).length}`)})};
// 문화 노트: every line cites real sources, every source is a link, every culture:'id' a chapter uses exists
{const N=ctx.CULTURE_NOTES||{};
 for(const [k,n] of Object.entries(N)){
  if(!n.t||!Array.isArray(n.lines)||!n.lines.length)errs.push(`culture ${k}: needs a title and lines`);
  (n.lines||[]).forEach(([ko,en],i)=>{if(!ko||!en)errs.push(`culture ${k} line ${i+1}: needs Korean and English`)});
  citations('culture',k,n)}
 for(const f of fs.readdirSync('src/chapters'))for(const m of fs.readFileSync('src/chapters/'+f,'utf8').matchAll(/culture:'([^']+)'/g))if(!N[m[1]])errs.push(`${f}: culture:'${m[1]}' has no note in src/culture.js`)}
// 문법 노트: every note has a title, a few lines and a few examples (Korean and English), its lines cite its sources like a 문화 노트's,
// every grammar:'id' a chapter uses exists, and every note is unlocked by some step (the story line whose grammar it explains)
{const N=ctx.GRAMMAR_NOTES||{},used=new Set();
 for(const f of fs.readdirSync('src/chapters'))for(const m of fs.readFileSync('src/chapters/'+f,'utf8').matchAll(/grammar:'([^']+)'/g)){used.add(m[1]);if(!N[m[1]])errs.push(`${f}: grammar:'${m[1]}' has no note in src/grammar.js`)}
 for(const [k,n] of Object.entries(N)){
  if(!n.t||!Array.isArray(n.lines)||!n.lines.length)errs.push(`grammar ${k}: needs a title and lines`);
  if(!Array.isArray(n.ex)||!n.ex.length)errs.push(`grammar ${k}: needs examples (the game's line first)`);
  if((n.lines||[]).length>4||(n.ex||[]).length>3)errs.push(`grammar ${k}: keep it short (at most 4 lines and 3 examples)`);
  for(const [what,a] of [['line',n.lines||[]],['example',n.ex||[]]])a.forEach(([ko,en],i)=>{if(!ko||!en)errs.push(`grammar ${k} ${what} ${i+1}: needs Korean and English`);else if(/[A-Za-z]/.test(ko))errs.push(`grammar ${k} ${what} ${i+1}: English in the Korean`)});
  citations('grammar',k,n);
  if(!used.has(k))errs.push(`grammar ${k}: no step unlocks it (add grammar:'${k}' to the story line it explains)`)}}
console.log(errs.length?errs.join('\n'):`ok · ${ctx.CHAPTERS.length} chapter(s), ${allWords.size} words`);process.exit(errs.length?1:0);

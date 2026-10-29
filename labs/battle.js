/* 실험 · 단어 배틀 (2교시): collect words and battle with them, Pokémon-style. Debug only (설정 · 개발, or ?lab=battle); never in
   index.html; remove = delete this file and its labs.json entry. Runs in 2교시's replay save from the end of its story.
   A word's move IS its meaning: 얼다 freezes, 놓치다 makes the enemy miss, 재촉하다 acts twice, 곡 heals, 포기하다 finishes a weak
   foe… (the move is described in simple Korean, English behind ?). Casting a move = filling the blank in one of 2교시's own
   sentences for that word (BANK): right, it works; wrong, it fizzles and the reason shows (the chapter's own hint). A plain
   attack needs no check, so a move is a choice. 3 on 3, one out at a time; 교체 swaps (it costs the turn).
   Collecting: 구름 gives three starters; wild words jump out of the library shelves (weaken one, then catch it by finding
   the sentence it belongs in); 찬, 하리 and 다온 in the 방송실 battle with themed teams, and beating one lets you take one of their words.
   A word that casts right gains XP and levels (HP, attack). The box, levels and wins stay in this browser. */
(()=>{
const LAB={},ID='battle',en=(ko,e)=>{(window.LINES_EN=window.LINES_EN||{})[plain(ko)]=e};
const pick=a=>a[Math.random()*a.length|0],shuf=a=>a.map(x=>[Math.random(),x]).sort((p,q)=>p[0]-q[0]).map(p=>p[1]);
const esc=x=>String(x).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
/* ===== moves: what each 2교시 word does (cd: turns before it can be cast again) ===== */
const MOVES={
 '괴롭히다':{n:'괴롭히기',d:'세 턴 동안 상대가 매 턴 조금씩 다쳐요.',e:'The foe takes a little damage every turn for three turns.',fx:(b,u,t)=>{t.st.poison=3}},
 '긴장하다':{n:'긴장',d:'상대가 긴장해서 두 턴 동안 약하게 공격해요.',e:'The foe gets nervous and attacks weakly for two turns.',fx:(b,u,t)=>{t.st.weak=2}},
 '얼다':{n:'얼리기',d:'상대가 한 턴 동안 얼어서 못 움직여요.',e:'The foe freezes and can\'t move for a turn.',fx:(b,u,t)=>{t.st.frozen=1},cd:3},
 '심장':{n:'두근두근',d:'심장이 빨리 뛰어요. 다음 공격이 두 배예요.',e:'Your heart races. Your next attack does double.',fx:(b,u)=>{u.st.double=1}},
 '분위기':{n:'분위기 띄우기',d:'두 턴 동안 우리 편 단어들이 모두 세져요.',e:'For two turns all your words hit harder.',fx:(b)=>{b.me.field=2}},
 '어색하다':{n:'어색한 침묵',d:'분위기가 어색해져서 상대가 반쯤은 아무것도 못 해요.',e:'Things get awkward: half the time the foe can\'t do anything.',fx:(b,u,t)=>{t.st.awk=2}},
 '장난':{n:'장난',d:'무슨 일이 생길지 몰라요! 좋을 수도, 나쁠 수도.',e:'Anything can happen! Good or bad.',fx:(b,u,t)=>{const r=Math.random();if(r<.4)hit(b,u,t,22,'장난이 통했어요!');else if(r<.7){heal(u,15);log(b,'장난치다가 기분이 좋아졌어요.','Messing around cheered it up.')}else{hurt(u,8);log(b,'장난이 실패했어요… 우리가 다쳤어요.','The prank backfired… we got hurt.')}}},
 '놀리다':{n:'놀리기',d:'상대를 놀려서 화나게 해요. 상대가 방어를 못 해요.',e:'Tease the foe into a rage: it drops its guard.',fx:(b,u,t)=>{t.st.open=2;hit(b,u,t,8)}},
 '명찰':{n:'명찰 보기',d:'상대 이름을 알았어요. 다음 공격이 꼭 급소에 맞아요.',e:'You know its name now. Your next attack is a sure critical.',fx:(b,u)=>{u.st.crit=1}},
 '곡':{n:'한 곡',d:'노래 한 곡! 우리 편 단어들이 모두 기운을 차려요.',e:'One song! All your words recover.',fx:(b)=>{b.me.team.forEach(w=>w.hp>0&&heal(w,14))},cd:3},
 '기회':{n:'기회 잡기',d:'좋은 기회! 지금 세게 공격해요.',e:'A good chance! Strike hard now.',fx:(b,u,t)=>hit(b,u,t,26)},
 '놓치다':{n:'놓치게 하기',d:'상대가 다음 공격을 놓쳐요. 빗나가요.',e:'The foe misses its next attack.',fx:(b,u,t)=>{t.st.miss=1}},
 '타이밍':{n:'타이밍',d:'상대가 방금 공격했다면, 딱 맞는 타이밍에 두 배로 받아쳐요.',e:'If the foe just attacked, hit back double at the perfect moment.',fx:(b,u,t)=>hit(b,u,t,b.foeHit?30:12,b.foeHit?'딱 맞는 타이밍!':null)},
 '효과':{n:'효과 한 번 더',d:'방금 쓴 기술의 효과가 한 번 더 나와요.',e:'Your last move\'s effect happens once more.',fx:(b,u,t)=>{const m=b.lastFx;if(m&&m!=='효과')MOVES[m].fx(b,u,t);else log(b,'아무 효과도 없어요.','No effect.')}},
 '포기하다':{n:'포기시키기',d:'상대 체력이 30% 이하면 상대가 포기해요. 아니면 아무 일도 없어요.',e:'If the foe is at 30% HP or less, it gives up. Otherwise nothing happens.',fx:(b,u,t)=>{if(t.hp<=t.max*.3){t.hp=0;log(b,`${t.w}${josa(t.w,'이','가')} 포기했어요!`,`${t.w} gave up!`)}else log(b,'아직 포기 안 해요.','It won\'t give up yet.')}},
 '즐기다':{n:'즐기기',d:'두 턴 동안 매 턴 체력이 조금씩 돌아와요.',e:'Recover a little HP every turn for two turns.',fx:(b,u)=>{u.st.regen=2}},
 '챙기다':{n:'챙기기',d:'쓰러진 우리 편 단어 하나를 챙겨서 다시 일으켜요.',e:'Look after a fallen word and get it back up.',fx:(b,u)=>{const f=b.me.team.find(w=>w.hp<=0);if(f){f.hp=Math.round(f.max/2);log(b,`${f.w}${josa(f.w,'이','가')} 다시 일어났어요!`,`${f.w} got back up!`)}else{heal(u,18);log(b,'다들 괜찮아요. 대신 체력을 챙겼어요.','Everyone\'s fine. Took care of HP instead.')}},cd:4},
 '재촉하다':{n:'재촉하기',d:'빨리빨리! 이번 턴에 한 번 더 공격해요.',e:'Hurry, hurry! Attack once more this turn.',fx:(b,u,t)=>{hit(b,u,t,10);hit(b,u,t,10)}},
 '연락처':{n:'연락하기',d:'다른 단어한테 연락해요. 그 단어의 다음 공격이 두 배예요.',e:'Call another word: its next attack does double.',fx:(b,u)=>{const o=b.me.team.find(w=>w!==u&&w.hp>0);if(o){o.st.double=1;log(b,`${o.w}한테 연락했어요!`,`Called ${o.w}!`)}else log(b,'연락할 단어가 없어요.','No one to call.')}},
 '데려오다':{n:'데려오기',d:'다른 단어를 데려와서 같이 공격해요.',e:'Bring another word along and attack together.',fx:(b,u,t)=>{const o=b.me.team.find(w=>w!==u&&w.hp>0);hit(b,u,t,12);if(o)hit(b,o,t,12,`${o.w}도 같이!`)}},
};
const WORDS=Object.keys(MOVES);
const josa=(w,a,b2)=>{const c=w.charCodeAt(w.length-1);return c>=0xAC00&&c<=0xD7A3&&(c-0xAC00)%28!==0?a:b2};
const TRAINERS={
 '남궁찬':{key:'chan',team:['재촉하다','놀리다','장난'],hi:['배틀? 좋아! 난 빠른 게 좋아.','A battle? Sure! I like fast.'],win:['와… 졌다. 하나 가져가. 다음엔 안 져.','Whoa… I lost. Take one. I won\'t lose next time.'],lose:['내가 이겼다! 또 해!','I win! Again!']},
 '유하리':{key:'hari',team:['곡','긴장하다','얼다'],hi:['…배틀? 음악으로 해도 돼?','…A battle? Can I do it with music?'],win:['…졌네. 괜찮아. 하나 골라.','…I lost. It\'s fine. Pick one.'],lose:['…이겼다. 조금 기뻐.','…I won. I\'m a little happy.']},
 '오다온':{key:'daon',team:['명찰','포기하다','타이밍'],hi:['배틀? 규칙은 지켜. 반칙하면 벌금이야.','A battle? Keep to the rules. Cheat and you\'re fined.'],win:['…인정. 하나 가져가. 규칙은 규칙이니까.','…Fair. Take one. Rules are rules.'],lose:['내가 이겼어. 당연하지.','I won. Obviously.']},
};
const STARTERS=['기회','챙기다','즐기다'];
/* ===== the box (this browser) ===== */
const KEYM='jbl-battle';
const load=()=>{try{return JSON.parse(localStorage.getItem(KEYM)||'null')}catch(e){return null}};
const store=m=>{try{localStorage.setItem(KEYM,JSON.stringify(m))}catch(e){}};
let M=null;
const lvOf=w=>{const x=M.box[w]||{xp:0};return 1+Math.floor(x.xp/3)};
function mon(w,lv,side){const max=40+lv*8;return {w,lv,max,hp:max,atk:8+lv*2,st:{},cd:0,side}}
/* ===== battle state + text ===== */
let B=null,showEn=false;
const log=(b,ko,e)=>{b.log.push([ko,e||''])};
function hurt(m,n){m.hp=Math.max(0,m.hp-Math.round(n))}
function heal(m,n){m.hp=Math.min(m.max,m.hp+Math.round(n))}
function hit(b,u,t,base,note){
 if(u.st.frozen){return}
 if(u.st.miss){u.st.miss=0;log(b,`${u.w}의 공격이 빗나갔어요!`,`${u.w}'s attack missed!`);return}
 let n=base+u.atk/2;if(u.st.weak)n*=.6;if(t.st.open)n*=1.4;if(u.side==='me'&&b.me.field)n*=1.3;
 let crit=u.st.crit||Math.random()<.08;if(crit){n*=1.6;u.st.crit=0}if(u.st.double){n*=2;u.st.double=0}
 hurt(t,n);log(b,(note?note+' ':'')+`${t.w}에게 ${Math.round(n)}!${crit?' 급소!':''}`,`${Math.round(n)} to ${t.w}!${crit?' Critical!':''}`);
}
const meNow=()=>B.me.team[B.me.cur],foeNow=()=>B.foe.team[B.foe.cur];
/* sentence to cast or to catch: one of 2교시's own BANK items for the word (an authored blank with a reason for each wrong option) */
/* every fill-in sentence 2교시 has for the word: its BANK, the teaching questions (Q, by person) and the in-character review lines
   (REVIEW, with who says it and their lead-in), in a shuffled round per word, so one doesn't come back until the others have */
const usable=q=>q&&q.ask&&q.ask.includes('___')&&Array.isArray(q.opts)&&q.opts.some(o=>o[1])&&!q.listen&&!q.gram&&!q.reg;
const rounds={};
function sentenceFor(w){
 if(!rounds[w]||!rounds[w].length){const all=[...(C.BANK||[]),...Object.values(C.Q||{}).flat(),...(C.REVIEW||[])].filter(q=>q.w===w&&usable(q));
  const last=rounds[w]&&rounds[w].last;rounds[w]=shuf(all);if(rounds[w].length>1&&rounds[w][0]===last)rounds[w].push(rounds[w].shift());}
 const q=rounds[w].shift()||null;if(q)rounds[w].last=q;return q;
}
const whoSays=q=>{const by=[].concat(q.by||[])[0],n=by&&C.NPC&&C.NPC[by];return n?n.name:(by||'')};
/* ===== the table ===== */
function css(){if($('btCss'))return;const st=document.createElement('style');st.id='btCss';
 st.textContent=`#btPanel .sheet{gap:10px}
 #btPanel .side{display:grid;grid-template-columns:1fr auto;gap:2px 10px;align-items:center;border:2px solid color-mix(in srgb,var(--ink) 25%,transparent);border-radius:10px;padding:8px 10px}
 #btPanel .side.foe{border-style:dashed}
 #btPanel .side b{font-size:1.35rem;letter-spacing:.02em}#btPanel .side small{font-size:.72rem;opacity:.7}
 #btPanel .hp{grid-column:1/-1;height:8px;border-radius:5px;background:color-mix(in srgb,var(--ink) 15%,transparent);overflow:hidden}
 #btPanel .hp i{display:block;height:100%;background:#4aa66a;transition:width .35s}#btPanel .hp i.low{background:#d0503f}
 #btPanel .chips{grid-column:1/-1;display:flex;gap:4px;flex-wrap:wrap;min-height:0}#btPanel .chips span{font-size:.68rem;border:1px solid currentColor;border-radius:999px;padding:0 6px;opacity:.8}
 #btPanel .bench{font-size:.75rem;opacity:.75}
 #btPanel .log{background:#f1e9d4;color:#2b2720;border-radius:6px;padding:8px 10px;font-size:.92rem;line-height:1.55;display:grid;gap:2px;max-height:9.5em;overflow:auto}
 #btPanel .log .en{opacity:.7;font-size:.8rem}
 #btPanel .acts{display:grid;grid-template-columns:1fr 1fr;gap:6px}
 #btPanel .act{text-align:left;border:2px solid var(--ink);border-radius:9px;background:transparent;color:var(--ink);padding:8px 10px;cursor:pointer;font-family:inherit;display:grid;gap:2px}
 #btPanel .act b{font-size:.95rem}#btPanel .act small{font-size:.76rem;opacity:.8;line-height:1.35}
 #btPanel .act:disabled{opacity:.4;cursor:default}#btPanel .act.main{background:var(--ink);color:var(--hull)}
 #btPanel .q{background:#f1e9d4;color:#2b2720;border-radius:6px;padding:10px 12px;font-size:1.02rem;line-height:1.6;font-weight:500}
 #btPanel .row{display:flex;gap:8px;justify-content:space-between;align-items:center;flex-wrap:wrap}
 #btPanel .box{display:grid;grid-template-columns:repeat(auto-fill,minmax(110px,1fr));gap:6px}
 #btPanel .party{display:grid;grid-template-columns:repeat(3,1fr);gap:6px}#btPanel .pm{border:2px solid color-mix(in srgb,var(--ink) 25%,transparent);border-radius:9px;padding:6px 8px;display:grid;gap:3px}
 #btPanel .pm b{font-size:1rem}#btPanel .pm small{font-size:.68rem;opacity:.75}#btPanel .pm .hp{grid-column:auto}#btPanel .pm.down{opacity:.4}
 #btPanel .lines{display:grid;gap:6px}#btPanel .line{background:#f1e9d4;color:#2b2720;border-color:#c9bea3}#btPanel .line b{font-weight:500;font-size:.95rem;line-height:1.5}#btPanel .line small{opacity:.7}
 #btPanel .moves{font-size:.8rem;opacity:.85}#btPanel .moves summary{cursor:pointer}#btPanel .moves div{margin-top:3px}#btPanel .moves i{opacity:.7}`;
 document.head.appendChild(st)}
let keyBlock=null;
function panel(html){css();let P=$('btPanel');
 if(!P){P=document.createElement('div');P.className='panel';P.id='btPanel';P.innerHTML='<div class="sheet startsheet" role="dialog" aria-label="배틀"></div>';document.body.append(P);
  keyBlock=e=>{if(!(e.target.closest&&e.target.closest('button')))e.stopImmediatePropagation()};addEventListener('keydown',keyBlock,true)}
 P.firstChild.innerHTML=html;return P.firstChild}
function closePanel(){$('btPanel')?.remove();if(keyBlock)removeEventListener('keydown',keyBlock,true);keyBlock=null}
const chips=m=>Object.entries({frozen:'얼음',weak:'긴장',awk:'어색',poison:'괴롭힘',open:'화남',miss:'놓침',regen:'즐김',double:'두 배',crit:'급소'}).filter(([k])=>m.st[k]).map(([,v])=>`<span>${v}</span>`).join('');
function foeHTML(m,team,label){const p=m.hp/m.max;return `<div class="side foe"><span><small>${label}</small><br><b>${esc(m.w)}</b> <small>Lv.${m.lv}</small></span><small>${m.hp}/${m.max}</small>
 <div class="hp"><i class="${p<.3?'low':''}" style="width:${Math.round(p*100)}%"></i></div><div class="chips">${chips(m)}</div>
 ${team.length>1?`<div class="bench" style="grid-column:1/-1">${team.map(w=>w===m?'':(w.hp>0?'●':'○')+' '+esc(w.w)).filter(Boolean).join(' · ')}</div>`:''}</div>`}
const partyHTML=()=>`<div class="party">${B.me.team.map(m=>{const p=m.hp/m.max;return `<div class="pm${m.hp<=0?' down':''}"><b>${esc(m.w)}</b><small>Lv.${m.lv} · ${m.hp}/${m.max}${m.cd>0?` · ${m.cd}턴 쉬어요`:''}</small><div class="hp"><i class="${p<.3?'low':''}" style="width:${Math.round(p*100)}%"></i></div><div class="chips">${chips(m)}</div></div>`}).join('')}</div>`;
const alive=()=>B.me.team.filter(w=>w.hp>0);
const ready=()=>alive().filter(w=>w.cd<=0&&!w.st.frozen);
function dealLines(){B.cards=shuf(ready()).slice(0,3).map(m=>({w:m.w,q:sentenceFor(m.w)})).filter(c=>c.q)}
const lineHTML=(c,i)=>{const who=whoSays(c.q),pre=[].concat(c.q.pre||[]).map(plain).join(' ');
 return `<button class="act line" type="button" data-i="${i}">${who||pre?`<small>${esc(who)}${who&&pre?': ':''}${esc(pre)}</small>`:''}<b>${esc(plain(c.q.ask))}</b></button>`};
function render(){
 const t=foeNow();if(!B.over&&!B.cards)dealLines();
 const box=panel(`<h2>${B.wild?'야생 단어':esc(B.trainer)+'와 배틀'}<button class="btn" type="button" id="btEn" aria-pressed="${showEn}" style="padding:2px 9px;font-size:.8rem">?</button></h2>
  ${foeHTML(t,B.wild?[]:B.foe.team,B.wild?'야생':esc(B.trainer))}
  <div class="log">${B.log.slice(-4).map(([k,e])=>`<div>${esc(k)}${showEn&&e?`<div class="en">${esc(e)}</div>`:''}</div>`).join('')||'…'}</div>
  ${partyHTML()}
  ${B.over?`<div class="row"><span></span><button class="btn" type="button" id="btEnd" style="background:var(--ink);color:var(--hull)">끝</button></div>`:`
  <div class="bench">대사 · 하나를 골라서 말해요</div><div class="lines">${B.cards.map(lineHTML).join('')||'<small>지금 말할 수 있는 대사가 없어요.</small>'}</div>
  <div class="acts"><button class="act" type="button" id="btAtk"><b>기본 공격</b><small>읽지 않고 그냥 공격해요.</small></button>
   ${B.wild?`<button class="act" type="button" id="btCatch" ${t.hp>t.max*.5?'disabled':''}><b>잡기</b><small>${t.hp>t.max*.5?'체력이 반 아래일 때.':'이 단어가 들어갈 문장을 찾으면 잡혀요.'}</small></button>`:`<button class="act" type="button" id="btInfo"><b>단어 보기</b><small>상대 단어의 뜻과 기술</small></button>`}</div>
  <details class="moves"><summary>내 단어 기술</summary>${B.me.team.map(m=>`<div><b>${esc(m.w)}</b> · ${esc(MOVES[m.w].n)} — ${esc(MOVES[m.w].d)}${showEn?` <i>${esc(MOVES[m.w].e)}</i>`:''}</div>`).join('')}</details>`}`);
 $('btEn').onclick=()=>{showEn=!showEn;render()};
 if(B.over){$('btEnd').onclick=finish;return}
 box.querySelectorAll('.line').forEach(b=>b.onclick=()=>sayLine(B.cards[+b.dataset.i]));
 $('btAtk').onclick=()=>{const u=pick(alive());B.me.cur=B.me.team.indexOf(u);hit(B,u,foeNow(),10);endTurn()};
 if($('btCatch'))$('btCatch').onclick=()=>catchIt();
 if($('btInfo'))$('btInfo').onclick=()=>{const d=(C.DICT||{})[t.w];log(B,`${t.w}: ${d?d.k:''} · 기술: ${MOVES[t.w].n} — ${MOVES[t.w].d}`,`${t.w}: ${d?d.e:''} · move: ${MOVES[t.w].e}`);render()};
}
/* saying a line: which of your words fills its blank? (your words, and one look-alike that isn't yours) */
function sayLine(c){
 const conf=((C.CONFUSE||{})[c.w]||[]).filter(x=>!B.me.team.some(m=>m.w===x));
 const choices=shuf([...alive().map(m=>m.w),...conf.slice(0,1)]);
 const who=whoSays(c.q),pre=[].concat(c.q.pre||[]).map(plain).join(' ');
 const box=panel(`<h2>어떤 단어가 들어가요?<span></span></h2>${who||pre?`<div class="bench">${esc(who)}${who&&pre?': ':''}${esc(pre)}</div>`:''}<div class="q">${esc(plain(c.q.ask))}</div>
  <div class="acts">${choices.map((w,i)=>`<button class="act" type="button" data-i="${i}"><b>${esc(w)}</b></button>`).join('')}</div>
  <div class="row"><span></span><button class="btn" type="button" id="btBack">뒤로</button></div>`);
 $('btBack').onclick=()=>render();
 box.querySelectorAll('.act').forEach(b=>b.onclick=()=>{const w=choices[+b.dataset.i];
  const right=plain((c.q.opts.find(o=>o[1])||[c.w])[0]);B.cards=null;
  if(w===c.w){sfx('ok');const u=B.me.team.find(m=>m.w===w);B.me.cur=B.me.team.indexOf(u);
   log(B,`"${plain(c.q.ask).replace('___',right)}" — ${u.w}의 「${MOVES[u.w].n}」!`,`${u.w} used ${MOVES[u.w].n}!`);MOVES[u.w].fx(B,u,foeNow());B.lastFx=u.w;u.cd=MOVES[u.w].cd||2;
   const x=M.box[u.w]||(M.box[u.w]={xp:0});const lv0=lvOf(u.w);x.xp++;if(lvOf(u.w)>lv0)log(B,`${u.w} 레벨 업! Lv.${lvOf(u.w)}`,`${u.w} levelled up!`);store(M)}
  else{sfx('no');const why=(c.q.opts.find(o=>!o[1]&&plain(o[0]).startsWith(w.replace(/다$/,'')))||[])[2];
   log(B,`안 맞아요. 여기는 "${right}" (${c.w}).${why?' '+plain(why):''}`,`Doesn't fit. It's "${right}" (${c.w}).`)}
  endTurn()});
}
/* catching: which sentence does the wild word belong in? */
function catchIt(){
 const t=foeNow(),others=shuf(WORDS.filter(w=>w!==t.w)).slice(0,2);
 const cards=shuf([{w:t.w,q:sentenceFor(t.w)},...others.map(w=>({w,q:sentenceFor(w)}))].filter(c=>c.q));
 const box=panel(`<h2>「${esc(t.w)}」${josa(t.w,'이','가')} 들어갈 문장은?<span></span></h2><div class="lines">${cards.map(lineHTML).join('')}</div>
  <div class="row"><span></span><button class="btn" type="button" id="btBack">뒤로</button></div>`);
 $('btBack').onclick=()=>render();
 box.querySelectorAll('.line').forEach(b=>b.onclick=()=>{const c=cards[+b.dataset.i];B.cards=null;
  if(c.w===t.w){M.box[t.w]=M.box[t.w]||{xp:0};store(M);sfx('badge');log(B,`${t.w}${josa(t.w,'을','를')} 잡았어요!`,`Caught ${t.w}!`);B.over='caught';render()}
  else{log(B,`그 문장엔 "${c.w}"${josa(c.w,'이','가')} 들어가요. ${t.w}${josa(t.w,'이','가')} 빠져나갔어요!`,`That sentence takes "${c.w}". ${t.w} broke free!`);endTurn()}});
}
/* the foe's turn: at one of your words still standing */
function foeTurn(){
 const t=foeNow();if(t.hp<=0)return;B.foeHit=false;const u=pick(alive());if(!u)return;
 if(t.st.frozen){log(B,`${t.w}${josa(t.w,'은','는')} 얼어서 못 움직여요.`,`${t.w} is frozen.`);return}
 if(t.st.awk&&Math.random()<.5){log(B,`어색해서 ${t.w}${josa(t.w,'이','가')} 아무것도 못 했어요.`,`Too awkward: ${t.w} did nothing.`);return}
 if(t.cd<=0&&Math.random()<.4&&MOVES[t.w]){log(B,`${t.w}의 「${MOVES[t.w].n}」!`,`${t.w} used ${MOVES[t.w].n}!`);
  const swapB={me:B.foe,foe:B.me,log:B.log,lastFx:null,foeHit:false};MOVES[t.w].fx(swapB,t,u);t.cd=MOVES[t.w].cd||2}
 else{hit(B,t,u,10);B.foeHit=true}
 if(u.hp<=0)log(B,`${u.w}${josa(u.w,'이','가')} 쓰러졌어요…`,`${u.w} fell…`);
}
function tick(m){
 if(m.st.poison&&m.hp>0){hurt(m,5);log(B,`${m.w}${josa(m.w,'이','가')} 괴로워해요. (-5)`,`${m.w} suffers. (-5)`)}
 if(m.st.regen&&m.hp>0){heal(m,6)}
 for(const k of ['frozen','weak','awk','poison','open','regen'])if(m.st[k])m.st[k]--;
 if(m.cd>0)m.cd--;
}
function nextFoe(){const i=B.foe.team.findIndex(w=>w.hp>0);if(i>=0)B.foe.cur=i;return i>=0}
function endTurn(){
 B.cards=null;
 if(foeNow().hp<=0){log(B,`${foeNow().w}${josa(foeNow().w,'이','가')} 쓰러졌어요!`,`${foeNow().w} fell!`);if(!nextFoe()){B.over='win';render();return}log(B,`${B.trainer}: ${foeNow().w}, 나와!`,`${B.trainer}: ${foeNow().w}, go!`)}
 else foeTurn();
 if(!alive().length){B.over='lose';render();return}
 B.me.team.forEach(tick);tick(foeNow());if(B.me.field)B.me.field--;
 if(foeNow().hp<=0&&!nextFoe()){B.over='win';render();return}
 if(!alive().length){B.over='lose';render();return}
 render();
}
function teamPick(then){
 const owned=Object.keys(M.box);if(owned.length<=3){then(owned);return}
 let sel=owned.slice(0,3);
 const draw=()=>{const box=panel(`<h2>내 단어 고르기 (${sel.length}/3)<span></span></h2>
  <div class="box">${owned.map(w=>`<button class="act" type="button" data-w="${esc(w)}" aria-pressed="${sel.includes(w)}" style="${sel.includes(w)?'background:var(--ink);color:var(--hull)':''}"><b>${esc(w)}</b><small>Lv.${lvOf(w)} · ${esc(MOVES[w].n)}</small></button>`).join('')}</div>
  <div class="row"><button class="btn" type="button" id="btCancel">안 할래</button><button class="btn" type="button" id="btGo" ${sel.length===3?'':'disabled'} style="background:var(--ink);color:var(--hull)">시작</button></div>`);
  box.querySelectorAll('.act').forEach(b=>b.onclick=()=>{const w=b.dataset.w;sel=sel.includes(w)?sel.filter(x=>x!==w):sel.length<3?[...sel,w]:sel;draw()});
  $('btGo').onclick=()=>then(sel);$('btCancel').onclick=closePanel};draw();
}
function startBattle(opts){
 teamPick(team=>{
  B={me:{team:team.map(w=>mon(w,lvOf(w),'me')),cur:0},foe:{team:opts.foe.map(w=>mon(w,opts.lv,'foe')),cur:0},log:[],wild:!!opts.wild,trainer:opts.trainer||'',tk:opts.tk||null,lastFx:null,foeHit:false};
  log(B,opts.wild?`야생 단어 「${opts.foe[0]}」${josa(opts.foe[0],'이','가')} 나타났어요!`:`${opts.trainer}${josa(opts.trainer,'이','가')} 배틀을 걸었어요!`,opts.wild?`A wild "${opts.foe[0]}" appeared!`:`${opts.trainer} wants to battle!`);
  render()});
}
function finish(){
 const b=B;closePanel();B=null;
 if(b.wild){if(b.over==='caught')openDialog('…',[say('…',`「${b.foe.team[0].w}」${josa(b.foe.team[0].w,'을','를')} 일지에 넣었어요. 지금 단어 ${Object.keys(M.box).length}개.`,`Added "${b.foe.team[0].w}". You now have ${Object.keys(M.box).length} words.`)]);return}
 const T=TRAINERS[b.trainer];
 if(b.over==='win'){M.wins[T.key]=(M.wins[T.key]||0)+1;store(M);
  const take=b.foe.team.map(w=>w.w).filter(w=>!M.box[w]);
  openDialog(b.trainer,[{...say(b.trainer,T.win[0],T.win[1]),choose:(take.length?take:['…']).map(w=>[take.length?`「${w}」 — ${MOVES[w].n}`:'이미 다 있어요',()=>{if(take.length){M.box[w]={xp:0};store(M);sfx('badge');toast(`단어 획득: ${w}`)}}])}]);return}
 openDialog(b.trainer,[say(b.trainer,T.lose[0],T.lose[1]),say('백구름','…단어들 좀 쉬게 하고, 다시 해 봐.','…let your words rest, then try again.')]);
}
const say=(who,ko,e)=>{if(e)en(ko,e);return {who,say:ko}};
/* ===== hooks (only while this lab is on, in 2교시's replay) ===== */
const on=()=>!!M&&!!RP&&CH&&CH.id==='ch2'&&window.__labActive===ID;
const facing0=window.facing,talk0=window.talkWith,open0=window.openDialog;
const SHELF=['libShelf','bookWall','bookCart'];
facing=function(){
 if(on()){const [dx,dy]=D[player.dir],L=Z.legend[at(player.x+dx,player.y+dy)]||{};
  if(ZID==='library'&&SHELF.includes(L.tile))return {spot:{steps:[{lab:ID+':wild'}]}}}
 return facing0();
};
openDialog=function(name,steps,opts){
 const l=steps&&steps.length===1&&steps[0]&&steps[0].lab;
 if(l===ID+':wild'&&on()){const wild=WORDS.filter(w=>!M.box[w]);if(!wild.length){return open0('…',[say('…','책장이 조용해요. 단어를 다 모았어요!','The shelves are quiet. You\'ve collected every word!')])}
  const w=pick(wild);return open0('…',[{...say('…','책장에서 뭔가 튀어나왔어요!','Something jumped out of the shelf!'),choose:[['맞서기',()=>startBattle({wild:1,foe:[w],lv:Math.max(1,Math.round(avgLv()))})],['도망가기',null]]}])}
 return open0(name,steps,opts);
};
const avgLv=()=>{const ws=Object.keys(M.box);return ws.reduce((a,w)=>a+lvOf(w),0)/ws.length};
talkWith=function(n){
 if(on()&&n){
  if(TRAINERS[n.name]){const T=TRAINERS[n.name];return open0(n.name,[{...say(n.name,T.hi[0],T.hi[1]),choose:[['배틀!',()=>startBattle({trainer:n.name,tk:T.key,foe:T.team,lv:1+(M.wins[T.key]||0)})],['나중에',null]]}])}
  if(n.name==='백구름')return open0('백구름',[say('백구름',`지금 단어 ${Object.keys(M.box).length}/${WORDS.length}개. 도서관 책장에 야생 단어가 숨어 있어. 찬, 하리, 다온한테 배틀 걸어 봐.`,`You have ${Object.keys(M.box).length}/${WORDS.length} words. Wild words hide in the library shelves. Challenge Chan, Hari or Daon.`)]);
 }
 return talk0(n);
};
LAB.start=()=>{
 loadCps().then(all=>{const L=(all||{}).ch2||[],at=L[L.length-1];if(!at){toast('2교시 장면이 없어요.');return}
  boot('ch2',{force:1,at});window.__labActive=ID;
  M=load()||{box:{},wins:{}};const fresh=!Object.keys(M.box).length;if(fresh){STARTERS.forEach(w=>M.box[w]={xp:0});store(M)}
  const q0=C.questText;C.questText=()=>on()?`단어 ${Object.keys(M.box).length}/${WORDS.length} · 찬 ${M.wins.chan||0}승 · 하리 ${M.wins.hari||0}승 · 다온 ${M.wins.daon||0}승`:q0();
  setTimeout(()=>{loadZone('bcast',5,4,'up');try{updateQuest()}catch(e){}
   open0('백구름',fresh?[say('백구름','단어 배틀 알아? 단어마다 기술이 있어. 뜻이 곧 기술이야.','Know word battles? Every word has a move. Its meaning is the move.'),
    say('백구름','자, 첫 단어 세 개. 기회, 챙기다, 즐기다. 기술을 쓰려면 문장을 맞게 완성해야 해.','Here, your first three words: 기회, 챙기다, 즐기다. To use a move, you have to complete its sentence right.'),
    say('백구름','도서관 책장에 야생 단어가 있어. 찬, 하리, 다온도 배틀 좋아해.','Wild words are in the library shelves. Chan, Hari and Daon like battles too.')]
    :[say('백구름',`다시 왔네. 단어 ${Object.keys(M.box).length}개.`,`You're back. ${Object.keys(M.box).length} words.`)])},500)});
};
LAB.state=()=>({M,B});LAB.moves=MOVES;LAB.sentence=sentenceFor;  // for tests
WALK_LABS[ID]=LAB;
})();

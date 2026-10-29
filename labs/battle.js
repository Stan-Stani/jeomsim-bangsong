/* 실험 · 단어 배틀 (2교시): collect words and battle with them, Pokémon-style. Debug only (설정 · 개발, or ?lab=battle); never in
   index.html; remove = delete this file and its labs.json entry. Runs in 2교시's replay save from the end of its story.
   A word's move IS its meaning: 얼다 freezes, 놓치다 makes the enemy miss, 재촉하다 acts twice, 곡 heals, 포기하다 finishes a weak
   foe… (the move is described in simple Korean, English behind ?). Your three words fight together (the foe's come out one at a
   time). Each turn you pick which of your words to say, then find ITS line among three (four in rematches and vs 구름): fill-in
   sentences from 2교시 (BANK, Q, REVIEW), the others for 2교시 words of the same kind (noun or verb) and never one that could fill
   the same blank (ALT). Right, its move fires; wrong, it fizzles and the right line is shown filled in. Nothing is guessed by
   elimination: every line is a real line for some word. 뜻 보기 shows your word's meaning for some HP.
   What makes it a game:
   - the foe's next action shows ahead (다음: 「얼리기」 → 기회), so choosing the word is the counter-play: 놓치다 (it misses),
     얼다 (it can't move), 어색하다 (it may fumble), 타이밍 right after it used a move;
   - 가로채기: once per foe word, find the line for ITS word first and it loses its turn;
   - right lines in a row fill a combo; at three, 방송부 합동! hits with the whole party (a wrong word resets it);
   - hits shake and float numbers, criticals flash; trainers talk during the fight;
   - collecting: 구름's three starters, wild words in the library shelves (weaken one, then find the sentence it belongs in),
     찬, 하리 and 다온 in the 방송실 (beat one, take a word), a 단어 도감 of all 20 from 구름, and 구름 himself as the champion once
     all three are beaten. Correct lines level a word. The box, levels and wins stay in this browser.
   Starting the lab boots 2교시's replay save at its last checkpoint (overwriting that replay); booting any other chapter turns it off. */
(()=>{
const LAB={},ID='battle',en=(ko,e)=>{(window.LINES_EN=window.LINES_EN||{})[plain(ko)]=e};
const pick=a=>a[Math.random()*a.length|0],shuf=a=>a.map(x=>[Math.random(),x]).sort((p,q)=>p[0]-q[0]).map(p=>p[1]);
const esc=x=>String(x).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const josa=(w,a,b2)=>{const c=w.charCodeAt(w.length-1);return c>=0xAC00&&c<=0xD7A3&&(c-0xAC00)%28!==0?a:b2};
/* ===== moves: what each 2교시 word does (cd: turns before it can be cast again) ===== */
const MOVES={
 '괴롭히다':{n:'괴롭히기',d:'세 턴 동안 상대가 매 턴 조금씩 다쳐요.',e:'The foe takes a little damage every turn for three turns.',fx:(b,u,t)=>{t.st.poison=3}},
 '긴장하다':{n:'긴장',d:'상대가 긴장해서 두 턴 동안 약하게 공격해요.',e:'The foe gets nervous and attacks weakly for two turns.',fx:(b,u,t)=>{t.st.weak=2}},
 '얼다':{n:'얼리기',d:'상대가 한 턴 동안 얼어서 못 움직여요.',e:'The foe freezes and can\'t move for a turn.',fx:(b,u,t)=>{hit(b,u,t,0);t.st.frozen=1},cd:3},
 '심장':{n:'두근두근',d:'심장이 빨리 뛰어요. 우리 편의 다음 공격이 두 배예요.',e:'Hearts race: your side\'s next hit does double.',fx:(b,u)=>{b.me.dbl=1;log(b,'두근두근! 다음 공격이 두 배예요.','Next hit does double.')}},
 '분위기':{n:'분위기 띄우기',d:'두 턴 동안 우리 편 단어들이 모두 세져요.',e:'For two turns all your words hit harder.',fx:(b)=>{b.me.field=2}},
 '어색하다':{n:'어색한 침묵',d:'분위기가 어색해져서 상대가 반쯤은 아무것도 못 해요.',e:'Things get awkward: half the time the foe can\'t do anything.',fx:(b,u,t)=>{t.st.awk=2}},
 '장난':{n:'장난',d:'무슨 일이 생길지 몰라요! 좋을 수도, 나쁠 수도.',e:'Anything can happen! Good or bad.',fx:(b,u,t)=>{const r=Math.random();if(r<.4)hit(b,u,t,22,'장난이 통했어요!');else if(r<.7){heal(u,15);log(b,'장난치다가 기분이 좋아졌어요.','Messing around cheered it up.')}else{hurt(u,8);log(b,'장난이 실패했어요… 우리가 다쳤어요.','The prank backfired… we got hurt.')}}},
 '놀리다':{n:'놀리기',d:'상대를 놀려서 화나게 해요. 상대가 방어를 못 해요.',e:'Tease the foe into a rage: it drops its guard.',fx:(b,u,t)=>{t.st.open=2;hit(b,u,t,8)}},
 '명찰':{n:'명찰 보기',d:'상대 이름을 알았어요. 우리 편의 다음 공격이 꼭 급소에 맞아요.',e:'You know its name now. Your side\'s next attack is a sure critical.',fx:(b)=>{b.me.crit=1;log(b,'이름을 알았어요! 다음 공격은 급소예요.','Got its name! Next hit is a critical.')}},
 '곡':{n:'한 곡',d:'노래 한 곡! 우리 편 단어들이 모두 기운을 차려요.',e:'One song! All your words recover.',fx:(b)=>{b.me.team.forEach(w=>w.hp>0&&heal(w,14))},cd:3},
 '기회':{n:'기회 잡기',d:'좋은 기회! 지금 세게 공격해요.',e:'A good chance! Strike hard now.',fx:(b,u,t)=>hit(b,u,t,26)},
 '놓치다':{n:'놓치게 하기',d:'상대의 다음 행동(공격이나 기술)이 빗나가요.',e:'The foe\'s next action (attack or move) misses.',fx:(b,u,t)=>{hit(b,u,t,0);t.st.miss=1},cd:2},
 '타이밍':{n:'타이밍',d:'상대가 방금 기술을 썼다면, 딱 맞는 타이밍에 세게 받아쳐요.',e:'If the foe just used a move, hit back hard at the perfect moment.',fx:(b,u,t)=>hit(b,u,t,b.foeMoved?30:12,b.foeMoved?'딱 맞는 타이밍!':null)},
 '효과':{n:'효과 한 번 더',d:'방금 쓴 기술의 효과가 한 번 더 나와요.',e:'Your last move\'s effect happens once more.',fx:(b,u,t)=>{const m=b.lastFx;if(m&&m!=='효과')MOVES[m].fx(b,u,t);else log(b,'아무 효과도 없어요.','No effect.')}},
 '포기하다':{n:'포기시키기',d:'상대 체력이 30% 이하면 상대가 포기해요. 아니면 아무 일도 없어요.',e:'If the foe is at 30% HP or less, it gives up. Otherwise nothing happens.',fx:(b,u,t)=>{if(t.hp>t.max*.3)log(b,'아직 포기 안 해요.','It won\'t give up yet.');
  else if(B.wild&&t.side==='foe'){t.hp=1;B.held=1;log(b,`${t.w}${josa(t.w,'이','가')} 포기 직전이에요! 지금 잡아요.`,`${t.w} is about to give up! Catch it now.`)}  // a wild word is caught, never knocked out
  else{t.hp=0;log(b,`${t.w}${josa(t.w,'이','가')} 포기했어요!`,`${t.w} gave up!`)}}},
 '즐기다':{n:'즐기기',d:'두 턴 동안 매 턴 체력이 조금씩 돌아와요.',e:'Recover a little HP every turn for two turns.',fx:(b,u)=>{u.st.regen=2}},
 '챙기다':{n:'챙기기',d:'쓰러진 우리 편 단어 하나를 챙겨서 다시 일으켜요.',e:'Look after a fallen word and get it back up.',fx:(b,u)=>{const f=b.me.team.find(w=>w.hp<=0);if(f){f.hp=Math.round(f.max/2);fxEv(f,f.hp,'heal');log(b,`${f.w}${josa(f.w,'이','가')} 다시 일어났어요!`,`${f.w} got back up!`)}else{heal(u,18);u._cd=1;log(b,'다들 괜찮아요. 대신 체력을 챙겼어요.','Everyone\'s fine. Took care of HP instead.')}},cd:4},  // no one to raise: a small heal, and no long rest
 '재촉하다':{n:'재촉하기',d:'빨리빨리! 이번 턴에 한 번 더 공격해요.',e:'Hurry, hurry! Attack once more this turn.',fx:(b,u,t)=>{hit(b,u,t,10);hit(b,u,t,10)}},
 '연락처':{n:'연락하기',d:'다른 단어한테 연락해요. 그 단어의 다음 공격이 두 배예요.',e:'Call another word: its next attack does double.',fx:(b,u)=>{const o=b.me.team.find(w=>w!==u&&w.hp>0);if(o){o.st.double=1;log(b,`${o.w}한테 연락했어요!`,`Called ${o.w}!`)}else log(b,'연락할 단어가 없어요.','No one to call.')}},
 '데려오다':{n:'데려오기',d:'다른 단어를 데려와서 같이 공격해요.',e:'Bring another word along and attack together.',fx:(b,u,t)=>{const o=b.me.team.find(w=>w!==u&&w.hp>0);hit(b,u,t,12);if(o)hit(b,o,t,12,`${o.w}도 같이!`)}},
};
const WORDS=Object.keys(MOVES);
const NOUN=new Set(['심장','분위기','장난','명찰','곡','기회','타이밍','효과','연락처']);  // a wrong line is for a word of the same kind, so its ending gives nothing away
const ALT=[['괴롭히다','놀리다','장난'],['긴장하다','얼다','어색하다'],['데려오다','챙기다'],['놓치다','포기하다'],['기회','타이밍']];  // could fill each other's blanks
const near=(a,b)=>ALT.some(g=>g.includes(a)&&g.includes(b));
/* ===== people: their teams, and what they say during a fight ===== */
const TRAINERS={
 '남궁찬':{key:'chan',team:['재촉하다','놀리다','장난'],hi:['배틀? 좋아! 난 빠른 게 좋아.','A battle? Sure! I like fast.'],style:'빠르고 장난스러운 단어들',again:['또 졌어? …다음엔 진짜 안 져!','Lost again? …Next time I really won\'t!'],win:['와… 졌다. 하나 가져가. 다음엔 안 져.','Whoa… I lost. Take one. I won\'t lose next time.'],lose:['내가 이겼다! 또 해!','I win! Again!'],
  move:[['빨리빨리! 기다리는 거 싫어!','Faster! I hate waiting!'],['이거 받아라!','Take this!']],fall:[['헐… 벌써?','Huh… already?'],['괜찮아, 아직 남았어!','It\'s fine, I\'ve got more!']],low:['어, 어… 잠깐만!','Wait, wait… hold on!']},
 '유하리':{key:'hari',team:['곡','긴장하다','얼다'],hi:['…배틀? 음악으로 해도 돼?','…A battle? Can I do it with music?'],style:'노래와 떨림의 단어들',again:['…또 졌네. 연습할게.','…lost again. I\'ll practise.'],win:['…졌네. 괜찮아. 하나 골라.','…I lost. It\'s fine. Pick one.'],lose:['…이겼다. 조금 기뻐.','…I won. I\'m a little happy.'],
  move:[['…한 소절만.','…just one line.'],['떨려도 할 거야.','I\'ll do it, even shaking.']],fall:[['…아.','…oh.'],['다음 곡이 있어.','There\'s a next song.']],low:['…마이크 꺼 줘.','…turn the mic off.']},
 '오다온':{key:'daon',team:['명찰','포기하다','타이밍'],hi:['배틀? 규칙은 지켜. 반칙하면 벌금이야.','A battle? Keep to the rules. Cheat and you\'re fined.'],style:'규칙과 끝내기의 단어들',again:['…또? 내 규칙이 문제야.','…Again? My rules are the problem.'],win:['…인정. 하나 가져가. 규칙은 규칙이니까.','…Fair. Take one. Rules are rules.'],lose:['내가 이겼어. 당연하지.','I won. Obviously.'],
  move:[['규칙대로 간다.','By the rules.'],['벌금이야.','That\'s a fine.']],fall:[['…계산 실수.','…a miscalculation.'],['아직 안 끝났어.','It\'s not over.']],low:['이건… 규칙 위반 아니야?','Isn\'t this… against the rules?']},
 '백구름':{key:'gureum',champ:1,team:['심장','효과','타이밍'],hi:['…셋 다 이겼다며. 그럼 이제 나야. 방송부 챔피언전.','…You beat all three, I hear. Then it\'s me now. The broadcast club championship.'],style:'방송부장의 단어들',again:['…역시 챔피언. 또 와.','…the champion, as expected. Come again.'],hi2:['챔피언, 또 왔네. …한 판 더?','Champion, back again? …One more round?'],win:['…내가 졌어. 오늘부터 네가 챔피언이야.','…I lost. From today, you\'re the champion.'],lose:['…아직은 내가 챔피언.','…I\'m still the champion, for now.'],
  move:[['타이밍이 중요해.','Timing matters.'],['…여기서 한 번 더.','…once more, right here.']],fall:[['…좋아.','…good.'],['계속해.','Keep going.']],low:['…진짜 세졌다.','…you really got strong.']},
};
const STARTERS=['기회','챙기다','놓치다'];  // an attack, a rescue and a counter: the intent line means something from the first fight
/* ===== the box (this browser) ===== */
const KEYM='jbl-battle';
const load=()=>{try{return JSON.parse(localStorage.getItem(KEYM)||'null')}catch(e){return null}};
const store=m=>{try{localStorage.setItem(KEYM,JSON.stringify(m))}catch(e){}};
let M=null;
const lvOf=w=>{const x=M.box[w]||{xp:0};return 1+Math.floor(x.xp/3)};
const avgXp=()=>{const xs=Object.values(M.box).map(x=>x.xp||0);return xs.length?Math.round(xs.reduce((a,b)=>a+b,0)/xs.length):0};
function addWord(w){if(!M.box[w])M.box[w]={xp:Math.max(0,avgXp()-3),fresh:1};store(M);try{updateQuest()}catch(e){}}  // a new word joins about a level under your average, so it's worth fielding
function mon(w,lv,side){const max=side==='foe'?44+lv*8:40+lv*8;return {w,lv,max,hp:max,atk:8+lv*2,st:{},cd:0,side}}  // a foe's three words: about 8–10 turns
/* ===== battle state, hits and their show ===== */
let B=null,showEn=false;
const log=(b,ko,e)=>{b.log.push([ko,e||''])};
function fxEv(m,n,kind,crit){if(!B)return;const i=m.side==='foe'?'foe':B.me.team.indexOf(m);B.fx.push({i,n:Math.round(n),kind,crit})}
function hold(t){if(B&&B.wild&&t.side==='foe'&&t.hp<=0){t.hp=1;if(!B.held){B.held=1;log(B,`${t.w}${josa(t.w,'이','가')} 버텼어요! 지금 잡아요.`,`${t.w} held on! Catch it now.`)}}}  // a wild word is caught, never knocked out
function hurt(m,n){n=Math.round(n);m.hp=Math.max(0,m.hp-n);fxEv(m,n,'hurt');hold(m)}
function heal(m,n){const h=Math.min(m.max-m.hp,Math.round(n));m.hp+=h;if(h>0)fxEv(m,h,'heal')}
function hit(b,u,t,base,note){
 if(u.st.frozen){return}
 if(u.st.miss){u.st.miss=0;log(b,`${u.w}의 공격이 빗나갔어요!`,`${u.w}'s attack missed!`);fxEv(t,0,'miss');return}
 const S=u.side==='me'?B.me:B.foe,util=base<=8;  // small and utility hits (놓치기, 얼리기, 놀리기, 기본 공격) don't use up the side's buffs
 let n=base+u.atk/2;if(u.st.weak)n*=.6;if(t.st.open)n*=1.4;if(S.field)n*=1.3;
 let crit=Math.random()<.08;if(!util){if(S.crit){crit=true;S.crit=0}if(u.st.double){n*=2;u.st.double=0}if(S.dbl){n*=2;S.dbl=0}}if(crit)n*=1.6;
 n=Math.round(n);t.hp=Math.max(0,t.hp-n);fxEv(t,n,'hurt',crit);sfx(crit?'star':u.side==='me'?'item':'lock');
 log(b,(note?note+' ':'')+`${t.w}에게 ${n}!${crit?' 급소!':''}`,`${n} to ${t.w}!${crit?' Critical!':''}`);hold(t);
}
const foeNow=()=>B.foe.team[B.foe.cur];
const alive=()=>B.me.team.filter(w=>w.hp>0);
const ready=()=>alive().filter(w=>w.cd<=0&&!w.st.frozen);
const CD=w=>MOVES[w].cd||1;  // counted down at the end of your turn: 1 = ready again next turn; 놓치다 rests one turn, 얼다 and 곡 two, 챙기다 three
/* every fill-in sentence 2교시 has for the word (BANK, Q by person, REVIEW with who says it), in a shuffled round per word */
const usable=q=>q&&q.ask&&q.ask.includes('___')&&Array.isArray(q.opts)&&q.opts.some(o=>o[1])&&!q.listen&&!q.gram&&!q.reg&&plain(q.opts.find(o=>o[1])[0])[0]===q.w[0];  // the answer has to be the word itself
const rounds={};
function sentenceFor(w){
 if(!rounds[w]||!rounds[w].length){const all=[...(C.BANK||[]),...Object.values(C.Q||{}).flat(),...(C.REVIEW||[])].filter(q=>q.w===w&&usable(q));
  const last=rounds[w]&&rounds[w].last;rounds[w]=shuf(all);if(rounds[w].length>1&&rounds[w][0]===last)rounds[w].push(rounds[w].shift());}
 let q=null;for(let k=0;k<rounds[w].length;k++){const c=rounds[w].shift();if(B&&B.used&&B.used.has(c.ask)&&k<rounds[w].length){rounds[w].push(c);continue}q=c;break}  // not twice in one battle while others are left
 if(q){rounds[w].last=q;if(B&&B.used)B.used.add(q.ask)}return q;
}
function askShown(q){  // a blank that swallows a grammar ending shows the ending (1학년 ___지 마세요!)
 const right=plain((q.opts.find(o=>o[1])||[''])[0]),stem=q.w.replace(/다$/,'');
 return right.startsWith(stem)&&right.length-stem.length>=3?plain(q.ask).replace('___','___'+right.slice(stem.length)):plain(q.ask);
}
const whoSays=q=>{const by=[].concat(q.by||[])[0],n=by&&C.NPC&&C.NPC[by];return n?n.name:(by||'')};
function defOf(w){const d=(C.DICT||{})[w]||(typeof carryDict==='function'&&carryDict(w))||((typeof lexLookup==='function'&&lexLookup(w)[0])||[])[1];return d?{k:plain(d.k||'').replace(/\s*예:.*$/,''),e:d.e||''}:null}  // no example: it can be a line's own answer frame (마지막 기회)
/* the foe's next action, decided ahead and shown */
function chooseIntent(){
 const t=foeNow();if(!t||t.hp<=0||B.over)return;
 const target=pick(alive());const useMove=t.cd<=0&&!!MOVES[t.w]&&Math.random()<.45;
 B.intent={move:useMove,target};
}
function intentHTML(){
 const t=foeNow(),I=B.intent;if(!I||B.over||B.swap||t.hp<=0)return '';
 if(t.st.frozen)return `<div class="intent">다음: 얼어서 못 움직여요</div>`;
 const to=I.target&&I.target.hp>0?I.target.w:'?';
 return `<div class="intent">다음: ${I.move?`「${esc(MOVES[t.w].n)}」`:'공격'} → ${esc(to)}${t.st.miss?' · 빗나갈 거예요':''}${t.st.awk?' · 어색해서 못 할 수도':''}</div>`;
}
/* ===== the table ===== */
function css(){if($('btCss'))return;const st=document.createElement('style');st.id='btCss';
 st.textContent=`#btPanel .sheet{gap:9px;position:relative}
 #btPanel .side{position:relative;display:grid;grid-template-columns:1fr auto;gap:2px 10px;align-items:center;border:2px dashed color-mix(in srgb,var(--ink) 30%,transparent);border-radius:10px;padding:8px 10px}
 #btPanel .side b{font-size:1.4rem;letter-spacing:.02em}#btPanel .side small{font-size:.72rem;opacity:.7}
 #btPanel .intent{grid-column:1/-1;font-size:.8rem;font-weight:700;color:#e9952c}
 #btPanel .hp{grid-column:1/-1;height:8px;border-radius:5px;background:color-mix(in srgb,var(--ink) 15%,transparent);overflow:hidden}
 #btPanel .hp i{display:block;height:100%;background:#4aa66a;transition:width .4s}#btPanel .hp i.low{background:#d0503f}
 #btPanel .chips{grid-column:1/-1;display:flex;gap:4px;flex-wrap:wrap}#btPanel .chips span{font-size:.66rem;border:1px solid currentColor;border-radius:999px;padding:0 6px;opacity:.85}
 #btPanel .bench{font-size:.75rem;opacity:.75}
 #btPanel .log{background:#f1e9d4;color:#2b2720;border-radius:6px;padding:7px 10px;font-size:.88rem;line-height:1.5;display:grid;gap:1px;max-height:7.8em;overflow:auto}
 #btPanel .log .en{opacity:.7;font-size:.78rem}#btPanel .log .say{color:#8a4b12;font-weight:700}
 #btPanel .acts{display:grid;grid-template-columns:1fr 1fr;gap:6px}
 #btPanel .act{text-align:left;border:2px solid var(--ink);border-radius:9px;background:transparent;color:var(--ink);padding:8px 10px;cursor:pointer;font-family:inherit;display:grid;gap:2px}
 #btPanel .act b{font-size:.95rem}#btPanel .act small{font-size:.76rem;opacity:.8;line-height:1.35}
 #btPanel .act:disabled{opacity:.4;cursor:default}#btPanel .act.main{background:var(--ink);color:var(--hull)}
 #btPanel .act.combo{background:#e9952c;color:#231503;border-color:#e9952c;grid-column:1/-1;animation:btPulse 1s ease-in-out infinite alternate}
 #btPanel .q{background:#f1e9d4;color:#2b2720;border-radius:6px;padding:10px 12px;font-size:1.02rem;line-height:1.6;font-weight:500}
 #btPanel .row{display:flex;gap:8px;justify-content:space-between;align-items:center;flex-wrap:wrap}
 #btPanel .box{display:grid;grid-template-columns:repeat(auto-fill,minmax(110px,1fr));gap:6px}
 #btPanel .party{display:grid;grid-template-columns:repeat(3,1fr);gap:6px}#btPanel .pm{position:relative;border:2px solid color-mix(in srgb,var(--ink) 25%,transparent);border-radius:9px;padding:6px 8px;display:grid;gap:3px}
 #btPanel .pm b{font-size:1rem}#btPanel .pm small{font-size:.66rem;opacity:.75}#btPanel .pm .hp{grid-column:auto}#btPanel .pm.down{opacity:.35;filter:grayscale(1)}
 #btPanel .pm.aim{border-color:#e9952c}
 #btPanel button.pm{text-align:left;background:transparent;color:var(--ink);font:inherit;cursor:pointer}#btPanel button.pm:not(:disabled){border-color:var(--ink)}#btPanel button.pm:disabled{cursor:default}#btPanel button.pm:disabled:not(.down){opacity:.6}
 #btPanel .lines{display:grid;gap:6px}#btPanel .line{background:#f1e9d4;color:#2b2720;border-color:#c9bea3}#btPanel .line b{font-weight:500;font-size:.95rem;line-height:1.5}#btPanel .line small{opacity:.7}
 #btPanel .act .def{font-size:.74rem;opacity:.85;line-height:1.4;font-weight:400}
 #btPanel .combo-m{display:flex;gap:4px;align-items:center;font-size:.75rem;opacity:.85}#btPanel .combo-m i{width:16px;height:6px;border-radius:3px;background:color-mix(in srgb,var(--ink) 20%,transparent)}#btPanel .combo-m i.on{background:#e9952c}
 #btPanel .moves{font-size:.8rem;opacity:.85}#btPanel .moves summary{cursor:pointer}#btPanel .moves div{margin-top:3px}#btPanel .moves i{opacity:.7}
 #btPanel .float{position:absolute;right:12px;top:4px;font-weight:800;font-size:1.25rem;pointer-events:none;animation:btFloat .9s ease-out forwards}
 #btPanel .float.hurt{color:#d0503f}#btPanel .float.heal{color:#4aa66a}#btPanel .float.miss{color:inherit;opacity:.8}#btPanel .float.block,#btPanel .float.steal{color:#e9952c;font-size:1.1rem}#btPanel .float.crit{font-size:1.6rem;color:#e9952c}
 #btPanel .shake{animation:btShake .35s}#btPanel .glow{animation:btGlow .6s}
 #btPanel .sheet.flash{animation:btFlash .3s}
 #btPanel .reveal{display:grid;gap:8px;justify-items:center;text-align:center;padding:10px 0}#btPanel .reveal .big{font-size:2.6rem;font-weight:800;letter-spacing:.04em;animation:btPop .5s}
 #btPanel .dex{display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:6px}#btPanel .dx{border:2px solid color-mix(in srgb,var(--ink) 25%,transparent);border-radius:9px;padding:7px 9px;display:grid;gap:2px}
 #btPanel .dx b{font-size:1.05rem}#btPanel .dx small{font-size:.72rem;opacity:.8;line-height:1.35}#btPanel .dx.no{opacity:.45;border-style:dashed}
 #btPanel .vs{display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:8px}
 #btPanel .tr{display:flex;align-items:center;gap:8px;min-width:0}#btPanel .tr.foe{justify-content:flex-end}
 #btPanel .tr b{font-size:.95rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
 #btPanel canvas.pf{width:48px;height:48px;image-rendering:pixelated;border-radius:8px;background:color-mix(in srgb,var(--ink) 10%,transparent);flex:none}
 #btPanel .vs .x{font-weight:800;letter-spacing:.08em;opacity:.6}
 #btPanel .balls{display:flex;gap:3px}#btPanel .balls i{width:9px;height:9px;border-radius:50%;background:#d0503f;border:1.5px solid var(--ink)}#btPanel .balls i.out{background:transparent;opacity:.5}
 #btPanel .intro{display:grid;gap:10px;padding:6px 0}#btPanel .intro .row2{display:flex;align-items:center;gap:12px}#btPanel .intro .row2.foe{justify-content:flex-end;text-align:right;animation:btFromR .5s ease-out}
 #btPanel .intro .row2.me{animation:btFromL .5s ease-out}#btPanel .intro canvas.pf{width:96px;height:96px}#btPanel .intro .big2{font-size:1.15rem;font-weight:800;text-align:center}
 #btPanel .faint{animation:btFaint .8s ease-in forwards}#btPanel .enter{animation:btFromR .45s ease-out}
 @keyframes btFaint{0%{transform:none;opacity:1}30%{transform:translateY(-4px)}100%{transform:translateY(26px);opacity:.25;filter:grayscale(1)}}
 @keyframes btFromR{from{transform:translateX(40px);opacity:0}to{transform:none;opacity:1}}
 @keyframes btFromL{from{transform:translateX(-40px);opacity:0}to{transform:none;opacity:1}}
 @keyframes btShake{0%,100%{transform:translateX(0)}20%{transform:translateX(-6px)}40%{transform:translateX(6px)}60%{transform:translateX(-4px)}80%{transform:translateX(3px)}}
 @keyframes btGlow{0%{box-shadow:0 0 0 0 #4aa66a}100%{box-shadow:0 0 0 10px transparent}}
 @keyframes btFloat{0%{opacity:0;transform:translateY(6px)}20%{opacity:1}100%{opacity:0;transform:translateY(-22px)}}
 @keyframes btFlash{0%{box-shadow:inset 0 0 0 999px rgba(233,149,44,.35)}100%{box-shadow:none}}
 @keyframes btPulse{from{filter:brightness(1)}to{filter:brightness(1.18)}}
 @keyframes btPop{0%{transform:scale(.4);opacity:0}70%{transform:scale(1.12);opacity:1}100%{transform:scale(1)}}
 @media (prefers-reduced-motion:reduce){#btPanel *{animation:none!important;transition:none!important}}`;
 document.head.appendChild(st)}
let keyBlock=null,lockT=0;
function panel(html){css();let P=$('btPanel');
 if(!P){P=document.createElement('div');P.className='panel';P.id='btPanel';P.innerHTML='<div class="sheet startsheet" role="dialog" aria-label="배틀"></div>';document.body.append(P);
  keyBlock=e=>e.stopImmediatePropagation();addEventListener('keydown',keyBlock,true);  // the game never sees a key under a battle; a focused button still clicks (that's its default, not a listener)
  P.addEventListener('click',e=>{if(performance.now()<lockT){e.stopImmediatePropagation();e.preventDefault()}},true)}  // a double tap can't land on the next screen's buttons
 lockT=performance.now()+300;P.firstChild.innerHTML=html;return P.firstChild}
function closePanel(){$('btPanel')?.remove();if(keyBlock)removeEventListener('keydown',keyBlock,true);keyBlock=null}
const chips=m=>Object.entries({frozen:'얼음',weak:'긴장',awk:'어색',poison:'괴롭힘',open:'화남',miss:'놓침',regen:'즐김',double:'두 배',crit:'급소'}).filter(([k])=>m.st[k]).map(([,v])=>`<span>${v}</span>`).join('');
const hpBar=m=>{const p=m.hp/m.max;return `<div class="hp"><i class="${p<.3?'low':''}" style="width:${Math.round(p*100)}%"></i></div>`};
function foeHTML(m,team,label){return `<div class="side foe" data-fx="foe"><span><small>${label}</small><br><b>${esc(m.w)}</b> <small>Lv.${m.lv}</small></span><small>${m.hp}/${m.max}</small>
 ${hpBar(m)}<div class="chips">${chips(m)}</div>${intentHTML()}
 ${team.length>1?`<div class="bench" style="grid-column:1/-1">${team.map(w=>w===m?'':(w.hp>0?'●':'○')+' '+esc(w.w)).filter(Boolean).join(' · ')}</div>`:''}</div>`}
const partyHTML=act=>`<div class="party">${B.me.team.map((m,i)=>{const can=act&&ready().includes(m);  // your words are the buttons: tap one to say it
 return `<button type="button" class="pm${m.hp<=0?' down':''}${B.intent&&B.intent.target===m&&!B.over?' aim':''}" data-fx="${i}" data-w="${i}" ${can?'':'disabled'}><b>${esc(m.w)}</b><small>「${esc(MOVES[m.w].n)}」</small><small>Lv.${m.lv} · ${m.hp}/${m.max}${m.cd>0&&m.hp>0?` · ${m.cd}턴 쉬어요`:''}</small>${hpBar(m)}<div class="chips">${chips(m)}</div></button>`}).join('')}</div>`;
function deal(w){  // w's line and B.n-1 lines for other words of its kind, never one that could fill the same blank; the same deal all turn (뒤로 doesn't reshuffle)
 if(B.deal[w])return B.deal[w];
 const q=sentenceFor(w);if(!q)return null;const cards=[{w,q}];
 const fin=x=>josa(x,1,0),kin=shuf(WORDS.filter(x=>x!==w&&NOUN.has(x)===NOUN.has(w)&&!near(x,w)));  // a noun's particle (___이/가, ___예요/이에요) tells its last sound: same-sounding ones first
 for(const x of NOUN.has(w)?[...kin.filter(x=>fin(x)===fin(w)),...kin.filter(x=>fin(x)!==fin(w))]:kin){if(cards.length>=B.n)break;const o=sentenceFor(x);if(o&&!cards.some(c=>c.q.ask===o.ask))cards.push({w:x,q:o})}
 return B.deal[w]=shuf(cards);
}
const rightOf=q=>plain((q.opts.find(o=>o[1])||[q.w])[0]);
const filled=q=>plain(q.ask).replace('___',rightOf(q));
const qt=s=>s.includes('"')?s:`"${s}"`;  // a line that already quotes someone isn't quoted twice
const lineHTML=(c,i)=>{const who=whoSays(c.q),pre=[].concat(c.q.pre||[]).map(plain).join(' ');
 return `<button class="act line" type="button" data-i="${i}">${who||pre?`<small>${esc(who)}${who&&pre?': ':''}${esc(pre)}</small>`:''}<b>${esc(askShown(c.q))}</b></button>`};
const comboHTML=()=>`<div class="combo-m">${B.me.dbl||B.me.crit?`<span>다음 공격 · ${[B.me.dbl?'두 배':'',B.me.crit?'급소':''].filter(Boolean).join(' · ')}</span> `:''}콤보 ${B.combo}/3 ${[0,1,2].map(i=>`<i class="${B.combo>i?'on':''}"></i>`).join('')}</div>`;
const canSteal=()=>!B.wild&&!B.over&&!B.swap&&foeNow().hp>0&&!B.stolen.has(B.foe.cur);
function playFx(box){  // shakes, floating numbers and the crit flash, after the table is drawn
 for(const f of B.fx){const el=box.querySelector(`[data-fx="${f.i}"]`);if(!el)continue;
  el.classList.add(f.kind==='heal'?'glow':'shake');if(f.crit)box.classList.add('flash');
  const s=document.createElement('span');s.className='float '+(f.crit?'crit':f.kind);s.textContent=f.kind==='miss'?'빗나감!':f.kind==='block'?'막았다!':f.kind==='steal'?'가로채기!':f.kind==='heal'?'+'+f.n:'-'+f.n;el.append(s)}
 B.fx=[];
}
const balls=()=>`<span class="balls">${B.foe.team.map(w=>`<i class="${w.hp>0?'':'out'}"></i>`).join('')}</span>`;
const vsHTML=()=>`<div class="vs"><div class="tr"><canvas class="pf" id="btMeFace" width="48" height="48"></canvas><b>나</b></div><span class="x" style="display:grid;justify-items:center;gap:4px">VS<button class="btn" type="button" id="btEn" aria-pressed="${showEn}" style="padding:0 8px;font-size:.75rem;letter-spacing:0">?</button></span>
 <div class="tr foe">${B.wild?'<b>야생 단어</b>':`<span><b>${esc(SHORT[B.trainer]||B.trainer)}</b><br>${balls()}</span><canvas class="pf" id="btFoeFace" width="48" height="48"></canvas>`}</div></div>`;
function faces(box){  // the trainers' portraits, the engine's own (drawPortrait), with a face for the moment
 if(typeof drawPortrait!=='function')return;
 const me=box.querySelector('#btMeFace');if(me&&player&&player.look)try{drawPortrait(me,player.look,B.meFace||'think',false)}catch(e){}
 const fo=box.querySelector('#btFoeFace'),L=!B.wild&&typeof lookFor==='function'&&lookFor(B.trainer);if(fo&&L)try{drawPortrait(fo,L,B.foeFace||'think',false)}catch(e){}
}
function render(){
 const t=foeNow();
 const box=panel(`${vsHTML()}
  ${foeHTML(t,B.wild?[]:B.foe.team,B.wild?'야생':esc(B.trainer))}
  <div class="log">${B.log.slice(Math.max(B.turnStart||0,B.log.length-7)).map(([k,e])=>`<div class="${/^[^:]{2,4}: "/.test(k)?'say':''}">${esc(k)}${showEn&&e?`<div class="en">${esc(e)}</div>`:''}</div>`).join('')||'…'}</div>
  ${B.over?`${partyHTML(false)}<div class="row"><span></span><button class="btn" type="button" id="btEnd" style="background:var(--ink);color:var(--hull)">끝</button></div>`:`
  <div class="row"><span class="bench">내 단어 · 골라서 말해요</span>${comboHTML()}</div>
  ${partyHTML(!B.swap)}
  <div class="acts">${B.combo>=3?`<button class="act combo" type="button" id="btCombo"><b>방송부 합동!</b><small>우리 단어들이 다 같이 공격해요.</small></button>`:''}
   ${canSteal()?`<button class="act" type="button" id="btSteal"><b>가로채기 · 「${esc(t.w)}」</b><small>상대 단어의 대사를 먼저 말하면 상대가 한 턴 쉬어요. 단어마다 한 번.</small></button>`:''}
   <button class="act" type="button" id="btAtk"><b>기본 공격</b><small>읽지 않고 약하게 공격해요. 콤보가 끊겨요.</small></button>
   ${B.wild?`<button class="act" type="button" id="btCatch" ${t.hp>t.max*.5?'disabled':''}><b>잡기</b><small>${t.hp>t.max*.5?'체력이 반 아래일 때.':'이 단어의 문장을 찾으면 잡혀요. 틀리면 도망가요.'}</small></button>
    <button class="act" type="button" id="btRun"><b>도망가기</b><small>책장으로 돌아가요.</small></button>`:`<button class="act" type="button" id="btInfo"><b>단어 보기</b><small>상대 단어의 뜻과 기술</small></button>`}</div>
  <details class="moves"><summary>내 단어 기술</summary>${B.me.team.map(m=>`<div><b>${esc(m.w)}</b> · ${esc(MOVES[m.w].n)} — ${esc(MOVES[m.w].d)}${showEn?` <i>${esc(MOVES[m.w].e)}</i>`:''}</div>`).join('')}</details>`}`);
 playFx(box);faces(box);
 B.me.team.forEach((m,i)=>{if(m.hp<=0&&!B.downShown.has(m)){B.downShown.add(m);box.querySelector(`[data-fx="${i}"]`)?.classList.add('faint')}});
 if(t.hp<=0)box.querySelector('[data-fx="foe"]')?.classList.add('faint');
 if(B.enter){B.enter=false;box.querySelector('[data-fx="foe"]')?.classList.add('enter')}
 $('btEn').onclick=()=>{showEn=!showEn;render()};
 if(B.over){$('btEnd').onclick=finish;return}
 if(B.swap){box.querySelectorAll('.acts .act,.moves').forEach(e=>e.style.visibility='hidden');  // a beat while it falls, then the next one
  const b0=B;setTimeout(()=>{if(B!==b0||!B.swap)return;B.swap=false;nextFoe();trainerSays('fall');log(B,`${B.trainer}: ${foeNow().w}, 나와!`,`${B.trainer}: ${foeNow().w}, go!`);B.foeFace='think';B.enter=true;chooseIntent();render()},1200);return}
 box.querySelectorAll('.party .pm').forEach(b=>b.onclick=()=>{const u=B.me.team[+b.dataset.w];if(ready().includes(u))pickLine(u.w,'say')});
 $('btAtk').onclick=()=>{act();const u=pick(alive());B.me.cur=B.me.team.indexOf(u);B.combo=0;hit(B,u,foeNow(),2);endTurn()};  // weak, and it breaks the combo: reading wins
 if($('btCombo'))$('btCombo').onclick=()=>{act();sfx('bell');log(B,'방송부 합동!','Broadcast club, together!');for(const u of alive())hit(B,u,foeNow(),16);B.combo=0;endTurn()};
 if($('btSteal'))$('btSteal').onclick=()=>pickLine(t.w,'steal');
 if($('btCatch'))$('btCatch').onclick=()=>pickLine(t.w,'catch');
 if($('btRun'))$('btRun').onclick=()=>{act();log(B,'도망갔어요.','Got away.');B.over='ran';render()};
 if($('btInfo'))$('btInfo').onclick=()=>{const d=(C.DICT||{})[t.w];log(B,`${t.w}: ${d?d.k:''} · 기술: ${MOVES[t.w].n} — ${MOVES[t.w].d}`,`${t.w}: ${d?d.e:''} · move: ${MOVES[t.w].e}`);render()};
}
/* 뜻 보기: your word's meaning costs health (about an eighth of your healthiest word's, never its last point) */
const best=()=>alive().sort((a,b)=>b.hp-a.hp)[0];
const defCost=()=>{const m=best();return m?Math.max(8,Math.round(m.max*.12)):0};
const canDef=()=>{const m=best();return !!m&&m.hp>defCost()};
function payForDefs(){const m=best();if(!canDef())return;const n=defCost();m.hp-=n;fxEv(m,n,'hurt');sfx('no');log(B,`뜻을 봤어요. ${m.w} 체력 -${n}`,`Looked up the meaning. ${m.w} -${n} HP`)}
const defHTML=w=>{const d=defOf(w);return d?`<small class="def">${esc(d.k)}${showEn&&d.e?` · ${esc(d.e)}`:''}</small>`:'<small class="def">뜻을 몰라요.</small>'};
const act=()=>{B.turnStartNext=B.log.length;B.meMoved=false};
/* finding a word's line: say (your word), steal (the foe's, 가로채기) or catch (the wild word) — the same reading every time */
function pickLine(w,mode,defs){
 const cards=deal(w);if(!cards){toast('대사가 없어요.');return}
 const t=foeNow(),title=mode==='steal'?`가로채기 · 「${esc(w)}」${josa(w,'이','가')} 들어갈 대사는?`:mode==='catch'?`「${esc(w)}」${josa(w,'이','가')} 들어갈 문장은?`:`「${esc(w)}」${josa(w,'이','가')} 들어갈 대사는?`;
 const box=panel(`<h2>${title}<span></span></h2>${defs?`<div class="bench">${esc(w)}: ${defHTML(w)}</div>`:''}<div class="lines">${cards.map(lineHTML).join('')}</div>
  <div class="row">${defs?'<span></span>':`<button class="btn" type="button" id="btDef" ${canDef()?'':'disabled'}>뜻 보기 · 체력 -${defCost()}</button>`}<button class="btn" type="button" id="btBack">뒤로</button></div>`);
 B.fx=[];
 $('btBack').onclick=()=>render();
 if($('btDef'))$('btDef').onclick=()=>{payForDefs();pickLine(w,mode,true)};
 box.querySelectorAll('.line').forEach(b=>b.onclick=()=>{const c=cards[+b.dataset.i],mine=cards.find(x=>x.w===w);act();
  if(c.w!==w){sfx('no');B.meFace='surprised';B.combo=0;  // wrong: the right line, filled in, is the lesson
   const lesson=`그건 「${c.w}」${josa(c.w,'이','가')} 들어가는 문장이에요. 「${w}」${josa(w,'은','는')} 여기: ${qt(filled(mine.q))}`;
   if(mode==='catch'){log(B,`${lesson} — ${w}${josa(w,'이','가')} 도망갔어요!`,`That one takes "${c.w}". "${w}" goes here: ${filled(mine.q)} — it got away!`);B.over='fled';render();return}
   if(mode==='steal')B.stolen.add(B.foe.cur);
   log(B,`안 맞아요. ${lesson}`,`Doesn't fit. That one takes "${c.w}". "${w}" goes here: ${filled(mine.q)}`);endTurn();return}
  if(mode==='catch'){addWord(w);sfx('badge');log(B,`${qt(filled(c.q))} — ${w}${josa(w,'을','를')} 잡았어요!`,`Caught ${w}!`);B.over='caught';render();return}
  B.combo=Math.min(3,B.combo+1);B.meFace='happy';
  if(mode==='steal'){sfx('star');B.foeFace='surprised';B.stolen.add(B.foe.cur);const u=alive().sort((a,b)=>b.atk-a.atk)[0];  // their line, said first
   log(B,`가로채기! ${qt(filled(c.q))} — ${t.w}${josa(t.w,'이','가')} 할 말을 잃었어요.`,`Intercepted! ${t.w} lost its line.`);fxEv(t,0,'steal');t.st.frozen=1;if(u)hit(B,u,t,14);endTurn();return}
  sfx('ok');const u=B.me.team.find(m=>m.w===w);B.me.cur=B.me.team.indexOf(u);
  log(B,`${qt(filled(c.q))} — ${u.w}의 「${MOVES[u.w].n}」!`,`${u.w} used ${MOVES[u.w].n}!`);
  if(u.st.awk&&Math.random()<.5)log(B,`…어색해서 ${u.w}${josa(u.w,'이','가')} 아무것도 못 했어요.`,`…too awkward: ${u.w} did nothing.`);
  else{MOVES[u.w].fx(B,u,foeNow());B.lastFx=u.w;B.meMoved=true}
  u.cd=u._cd||CD(u.w);delete u._cd;
  const x=M.box[u.w]||(M.box[u.w]={xp:0});const lv0=lvOf(u.w);x.xp++;if(lvOf(u.w)>lv0){sfx('badge');u.lv=lvOf(u.w);u.max+=8;u.hp=Math.min(u.max,u.hp+8);u.atk+=2;fxEv(u,8,'heal');log(B,`${u.w} 레벨 업! Lv.${lvOf(u.w)}`,`${u.w} levelled up!`)}store(M);
  endTurn()});
}
/* the foe's turn: what it announced, at whom it announced (or whoever is still standing) */
const trainerSays=(kind)=>{const T=TRAINERS[B.trainer];if(!T||!T[kind])return;B.said=B.said||new Set();const opts=Array.isArray(T[kind][0])?T[kind].filter(x=>!B.said.has(x[0])):[T[kind]].filter(x=>!B.said.has(x[0]));if(!opts.length)return;const l=pick(opts);B.said.add(l[0]);log(B,`${SHORT[B.trainer]||B.trainer}: "${l[0]}"`,l[1])};
const SHORT={'남궁찬':'찬','유하리':'하리','오다온':'다온','백구름':'구름'};
function foeTurn(){
 const t=foeNow();B.foeMoved=false;if(t.hp<=0)return;const I=B.intent||{move:false};const u=I.target&&I.target.hp>0?I.target:pick(alive());if(!u)return;
 const blocked=(ko,e)=>{log(B,'막았다! '+ko,'Blocked! '+e);fxEv(u,0,'block');sfx('star');B.meFace='happy'};
 if(t.st.frozen){blocked(`${t.w}${josa(t.w,'은','는')} 움직이지 못해요.`,`${t.w} can't move.`);return}
 if(t.st.miss){t.st.miss=0;const n=I.move&&MOVES[t.w]?`「${MOVES[t.w].n}」`:'공격';blocked(`${t.w}의 ${n}${josa(n.replace(/[」]/g,''),'이','가')} 빗나갔어요.`,`${t.w}'s action missed.`);return}
 if(t.st.awk&&Math.random()<.5){blocked(`어색해서 ${t.w}${josa(t.w,'이','가')} 아무것도 못 했어요.`,`Too awkward: ${t.w} did nothing.`);return}
 if(I.move&&t.cd<=0&&MOVES[t.w]){if(!B.wild&&Math.random()<.5)trainerSays('move');log(B,`${t.w}의 「${MOVES[t.w].n}」!`,`${t.w} used ${MOVES[t.w].n}!`);
  const swapB={me:B.foe,foe:B.me,log:B.log,lastFx:B.foe.lastFx,foeMoved:B.meMoved};MOVES[t.w].fx(swapB,t,u);delete t._cd;t.cd=MOVES[t.w].cd||2;B.foe.lastFx=t.w;B.foeMoved=true}  // the foe's 효과 repeats its own last move; its 타이밍 answers your moves
 else hit(B,t,u,10);
 if(u.hp<=0){sfx('door');B.foeFace='happy';log(B,`${u.w}${josa(u.w,'이','가')} 쓰러졌어요…`,`${u.w} fell…`)}
}
function tick(m){
 if(m.st.poison&&m.hp>0){hurt(m,5);log(B,`${m.w}${josa(m.w,'이','가')} 괴로워해요. (-5)`,`${m.w} suffers. (-5)`)}
 if(m.st.regen&&m.hp>0){heal(m,6)}
 for(const k of ['frozen','weak','awk','poison','open','regen'])if(m.st[k])m.st[k]--;
 if(m.cd>0)m.cd--;
}
function nextFoe(){const i=B.foe.team.findIndex(w=>w.hp>0);if(i>=0)B.foe.cur=i;return i>=0}
function foeFell(){sfx('door');log(B,`${foeNow().w}${josa(foeNow().w,'이','가')} 쓰러졌어요!`,`${foeNow().w} fell!`);B.foeFace='surprised';
 if(!B.foe.team.some(w=>w.hp>0)){B.over='win';B.meFace='happy';return true}B.swap=true;return true}  // the next one comes out after the fall (render)
function lost(){B.over='lose';B.meFace='surprised';B.foeFace='happy';
 if(B.wild)log(B,`다들 쓰러졌어요… ${foeNow().w}${josa(foeNow().w,'이','가')} 책장으로 돌아갔어요.`,`Everyone fell… ${foeNow().w} went back into the shelf.`);render()}
function endTurn(){  // your side counts down after your action and the foe's after its own, so what one side puts on the other lasts through the other's next turn
 B.deal={};B.turnStart=B.turnStartNext||0;
 if(foeNow().hp<=0){foeFell();render();return}
 B.me.team.forEach(tick);if(B.me.field)B.me.field--;
 if(!alive().length){lost();return}
 foeTurn();
 if(!alive().length){lost();return}
 tick(foeNow());if(B.foe.field)B.foe.field--;
 if(foeNow().hp<=0){foeFell();render();return}
 if(!B.wild&&!B.lowSaid&&B.foe.team.filter(w=>w.hp>0).length===1&&foeNow().hp<foeNow().max*.3){B.lowSaid=1;trainerSays('low')}
 chooseIntent();render();
}
function teamPick(then,opts){
 const owned=Object.keys(M.box);if(owned.length<=3){then(owned);return}
 const T=opts&&TRAINERS[opts.trainer],vsLine=T?`<div class="bench">상대 · ${esc(SHORT[opts.trainer]||opts.trainer)}: ${esc(T.style||'')} · ${opts.foe.map(w=>'□'.repeat(w.length)).join(' ')}</div>`:opts&&opts.wild?'<div class="bench">상대 · 야생 단어 하나</div>':'';
 let sel=(M.team||[]).filter(w=>M.box[w]);for(const w of owned)if(sel.length<3&&!sel.includes(w))sel.push(w);
 const draw=()=>{const box=panel(`<h2>내 단어 고르기 (${sel.length}/3)<span></span></h2>${vsLine}
  <div class="box">${owned.map(w=>`<button class="act" type="button" data-w="${esc(w)}" aria-pressed="${sel.includes(w)}" style="${sel.includes(w)?'background:var(--ink);color:var(--hull)':''}"><b>${esc(w)}${M.box[w].fresh?' <small>새</small>':''}</b><small>Lv.${lvOf(w)} · ${esc(MOVES[w].n)}</small></button>`).join('')}</div>
  <div class="row"><button class="btn" type="button" id="btCancel">안 할래</button><button class="btn" type="button" id="btGo" ${sel.length===3?'':'disabled'} style="background:var(--ink);color:var(--hull)">시작</button></div>`);
  box.querySelectorAll('.act').forEach(b=>b.onclick=()=>{const w=b.dataset.w;sel=sel.includes(w)?sel.filter(x=>x!==w):sel.length<3?[...sel,w]:sel;draw()});
  $('btGo').onclick=()=>then(sel);$('btCancel').onclick=closePanel};draw();
}
function startBattle(opts){
 teamPick(team=>{
  M.team=team;team.forEach(w=>{if(M.box[w])delete M.box[w].fresh});store(M);
  const myLv=Math.round(team.reduce((a,w)=>a+lvOf(w),0)/team.length);if(opts.scale!=null)opts.lv=Math.max(1,myLv+opts.scale);
  B={me:{team:team.map(w=>mon(w,lvOf(w),'me')),cur:0},foe:{team:opts.foe.map(w=>mon(w,opts.lv,'foe')),cur:0,lastFx:null},log:[],fx:[],combo:0,intent:null,downShown:new Set(),used:new Set(),meFace:'think',foeFace:'happy',wild:!!opts.wild,trainer:opts.trainer||'',lastFx:null,foeMoved:false,meMoved:false,
   deal:{},stolen:new Set(),n:opts.n||3};  // n: lines to choose from (4 in rematches and vs 구름)
  log(B,opts.wild?`야생 단어 「${opts.foe[0]}」${josa(opts.foe[0],'이','가')} 나타났어요!`:`${opts.trainer}${josa(opts.trainer,'이','가')} 배틀을 걸었어요!`,opts.wild?`A wild "${opts.foe[0]}" appeared!`:`${opts.trainer} wants to battle!`);
  chooseIntent();intro()},opts);
}
function intro(){  // like the start of a Pokémon battle: the two of you, then 가자!
 const t=foeNow();sfx('bell');
 const box=panel(`<div class="intro">${B.wild?`<div class="row2 foe"><div><div class="big2">야생 단어 「${esc(t.w)}」${josa(t.w,'이','가')} 나타났어요!</div></div></div>`
  :`<div class="row2 foe"><div><div class="big2">${esc(B.trainer)}${josa(B.trainer,'이','가')} 배틀을 걸어왔어요!</div>${balls()}</div><canvas class="pf" id="btFoeFace" width="48" height="48"></canvas></div>`}
  <div class="row2 me"><canvas class="pf" id="btMeFace" width="48" height="48"></canvas><div><b>나</b><div class="bench">${B.me.team.map(m=>esc(m.w)).join(' · ')}</div></div></div></div>
  <div class="row"><span></span><button class="btn" type="button" id="btGoNow" style="background:var(--ink);color:var(--hull)">가자!</button></div>`);
 faces(box);B.foeFace='think';$('btGoNow').onclick=()=>render();
}
/* a new word: its card, big */
function reveal(w,title,then){
 const d=defOf(w),m=MOVES[w];sfx('badge');
 panel(`<h2>${esc(title)}<span>${Object.keys(M.box).length}/${WORDS.length}</span></h2><div class="reveal"><div class="big">${esc(w)}</div>
  ${d?`<div>${esc(d.k)}</div>${showEn&&d.e?`<small>${esc(d.e)}</small>`:''}`:''}<div class="bench">기술 · 「${esc(m.n)}」 — ${esc(m.d)}</div></div>
  <div class="row"><span></span><button class="btn" type="button" id="btOk" style="background:var(--ink);color:var(--hull)">좋아!</button></div>`);
 $('btOk').onclick=()=>{closePanel();if(then)then()};
}
function finish(){
 const b=B;closePanel();B=null;
 if(b.wild){if(b.over==='caught')reveal(b.foe.team[0].w,'새 단어!');return}  // fled, ran or lost: the battle log already said so
 const T=TRAINERS[b.trainer];
 if(b.over==='win'){M.wins[T.key]=(M.wins[T.key]||0)+1;if(T.champ)M.champ=1;store(M);try{updateQuest()}catch(e){}
  const take=b.foe.team.map(w=>w.w).filter(w=>!M.box[w]);
  const after=T.champ?()=>{sfx('star');toast('방송부 챔피언!')}:null;
  if(!take.length){(M.team||[]).forEach(w=>{if(M.box[w])M.box[w].xp+=2});store(M);toast('내 단어들 경험치 +2');
   open0(b.trainer,[say(b.trainer,T.again[0],T.again[1])]);if(after)after();return}
  M.pending={key:T.key,take};store(M);offer(b.trainer,after);return}
 open0(b.trainer,[say(b.trainer,T.lose[0],T.lose[1]),say('백구름','…단어들 좀 쉬게 하고, 다시 해 봐.','…let your words rest, then try again.')]);
}
/* the reward: kept until you choose, so a reload doesn't lose it (talk to them again) */
function offer(name,after){const T=TRAINERS[name],P=M.pending;
 open0(name,[{...say(name,T.win[0],T.win[1]),choose:P.take.map(w=>[`「${esc(w)}」 — ${esc(MOVES[w].n)}: ${esc(MOVES[w].d)}`,()=>{delete M.pending;addWord(w);reveal(w,'새 단어!',after)}])}])}
/* 단어 도감: all 20, the ones you have with their meaning and move */
function showDex(){
 const have=Object.keys(M.box).length;
 panel(`<h2>단어 도감<span>${have}/${WORDS.length}${M.champ?' · 챔피언':''}</span></h2><div class="dex">${WORDS.map(w=>{const own=!!M.box[w],d=own&&defOf(w);
  return own?`<div class="dx"><b>${esc(w)}</b><small>Lv.${lvOf(w)} · 「${esc(MOVES[w].n)}」</small><small>${esc(d?d.k:'')}</small></div>`:`<div class="dx no"><b>${'□'.repeat(w.length)}</b><small>${w.length}글자 · ？？？</small></div>`}).join('')}</div>
  <div class="row"><span class="bench">도서관 책장에 야생 단어가 있어요.</span><button class="btn" type="button" id="btOk">닫기</button></div>`);
 $('btOk').onclick=closePanel;
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
  const w=pick(wild);return open0('…',[{...say('…','책장에서 뭔가 튀어나왔어요!','Something jumped out of the shelf!'),choose:[['맞서기',()=>startBattle({wild:1,foe:[w],scale:-1})],['도망가기',null]]}])}
 return open0(name,steps,opts);
};
const avgLv=()=>{const ws=Object.keys(M.box);return ws.reduce((a,w)=>a+lvOf(w),0)/ws.length};
function resetAsk(){open0('백구름',[{...say('백구름','…처음부터? 모은 단어랑 레벨, 이긴 기록이 다 없어져.','…From the start? Your words, levels and wins all go.'),
 choose:[['응, 처음부터',()=>{M={box:{},wins:{}};STARTERS.forEach(w=>M.box[w]={xp:0});store(M);try{updateQuest()}catch(e){}sfx('door');
  open0('백구름',[say('백구름','좋아. 다시 세 개부터. 기회, 챙기다, 놓치다.','Okay. Back to three. 기회, 챙기다, 놓치다.')])}],['아니, 그대로',null]]}])}
const beatAll=()=>['chan','hari','daon'].every(k=>(M.wins[k]||0)>0);
talkWith=function(n){
 if(on()&&n){
  if(n.name==='백구름'){const T=TRAINERS['백구름'],opts=[['단어 도감',showDex]];
   if(beatAll())opts.push(['챔피언전!',()=>startBattle({trainer:'백구름',foe:T.team,scale:1+Math.min(2,M.wins.gureum||0),n:4})]);opts.push(['처음부터',resetAsk],['나중에',null]);
   const line=M.champ?say('백구름',T.hi2[0],T.hi2[1]):beatAll()?say('백구름',T.hi[0],T.hi[1]):say('백구름',`단어 ${Object.keys(M.box).length}/${WORDS.length}개. 찬, 하리, 다온을 다 이기면… 나랑 해.`,`${Object.keys(M.box).length}/${WORDS.length} words. Beat Chan, Hari and Daon… then me.`);
   return open0('백구름',[{...line,choose:opts}])}
  if(TRAINERS[n.name]){const T=TRAINERS[n.name];if(M.pending&&M.pending.key===T.key)return offer(n.name,null);
   return open0(n.name,[{...say(n.name,T.hi[0],T.hi[1]),choose:[['배틀!',()=>startBattle({trainer:n.name,foe:T.team,scale:Math.min(2,M.wins[T.key]||0),n:M.wins[T.key]?4:3})],['나중에',null]]}])}
 }
 return talk0(n);
};
LAB.start=()=>{
 loadCps().then(all=>{const L=(all||{}).ch2||[],at=L[L.length-1];if(!at){toast('2교시 장면이 없어요.');return}
  if(!boot.labWrapped){const b0=boot;boot=function(id,rp){if(!(rp&&rp.lab===ID))window.__labActive=null;return b0(id,rp)};boot.labWrapped=1}  // any other boot (another 교시, a normal 2교시 or a scene) turns the lab off
  boot('ch2',{force:1,at,lab:ID});window.__labActive=ID;
  M=load()||{box:{},wins:{}};const fresh=!Object.keys(M.box).length;if(fresh){STARTERS.forEach(w=>M.box[w]={xp:0});store(M)}
  const q0=C.questText;C.questText=()=>on()?`${M.champ?'챔피언 · ':''}단어 ${Object.keys(M.box).length}/${WORDS.length} · 찬 ${M.wins.chan||0}승 · 하리 ${M.wins.hari||0}승 · 다온 ${M.wins.daon||0}승`:q0();
  setTimeout(()=>{loadZone('bcast',5,4,'up');try{updateQuest()}catch(e){}
   open0('백구름',fresh?[say('백구름','단어 배틀 알아? 단어마다 기술이 있어. 뜻이 곧 기술이야.','Know word battles? Every word has a move. Its meaning is the move.'),
    say('백구름','자, 첫 단어 세 개. 기회, 챙기다, 놓치다. 대사를 읽고 맞는 단어를 넣으면 기술이 나가.','Here, your first three words: 기회, 챙기다, 놓치다. Read a line, put in the right word, and its move goes off.'),
    say('백구름','상대가 다음에 뭘 할지 보여. 공격이 오면 「놓치다」로 빗나가게 해.','You can see what the foe will do next. When an attack is coming, make it miss with 놓치다.'),say('백구름','먼저 도서관 책장에서 야생 단어를 잡아 봐. 찬, 하리, 다온은 그다음에.','Catch some wild words in the library shelves first. Chan, Hari and Daon after that.')]
    :[say('백구름',`다시 왔네. 단어 ${Object.keys(M.box).length}개.`,`You're back. ${Object.keys(M.box).length} words.`)])},500)});
};
LAB.state=()=>({M,B});LAB.moves=MOVES;LAB.sentence=sentenceFor;LAB.deal=w=>deal(w);  // for tests
WALK_LABS[ID]=LAB;
})();

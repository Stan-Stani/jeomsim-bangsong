/* 실험 · 방송 덱 (2교시): the broadcast club as a short deck-building run. Debug only (설정 · 개발, or ?lab=deck); never in
   index.html; remove = delete this file and its labs.json entry. Runs in 2교시's replay save from the end of its story.
   A run (about 5 minutes):
   1. 교감 선생님's note: today's rule (no exam talk, no real names, no ads). A letter that breaks it must not go on air.
   2. Two errands for 구름 in the real school (generated: colours, tape labels, battery counts, rooms). Each one done earns a
      card: choose 1 of 3, described only in Korean. An errand you got wrong first slips in a joke card.
   3. On air at the mixer: three letters, each built from what the writer needs (a mood, said in their own words), sometimes
      what they don't want (신나는 건 말고요), sometimes a rule-breaker; the third needs two things. Draw 5 cards, play up to 3
      (or 보류 = hold it back). Listeners = the cards that fit, minus the ones that clash, times a combo (two that fit ×1.5,
      song + sound + DJ line that all fit ×2).
   4. After the show the booth reacts; listeners add to a total kept in this browser that unlocks new cards for the draft and
      club perks (하리, 찬, 다온), and the end card shows what the next unlock is.
   The card's mood is never shown: reading its Korean is the only way to know what it does. */
(()=>{
const LAB={},ID='deck',en=(ko,e)=>{(window.LINES_EN=window.LINES_EN||{})[plain(ko)]=e};
const pick=a=>a[Math.random()*a.length|0],shuf=a=>a.map(x=>[Math.random(),x]).sort((p,q)=>p[0]-q[0]).map(p=>p[1]);
const bat=w=>{const c=w.charCodeAt(w.length-1);return c>=0xAC00&&c<=0xD7A3&&(c-0xAC00)%28!==0},J=(w,a,b)=>w+(bat(w)?a:b);
const esc=x=>String(x).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
/* ===== cards ===== mood: calm · upbeat · comfort · cheer · funny (never shown). kind: 곡 30 · 효과음 15 · 멘트 20 */
const BASE={'곡':30,'효과음':15,'멘트':20};
const CARDS={
 rain:{kind:'곡',name:'「빗소리」',d:'조용한 피아노 곡. 마음이 편해져요.',m:'calm'},
 summer:{kind:'곡',name:'「여름 교실」',d:'다 같이 따라 부르는 신나는 곡.',m:'upbeat'},
 okay:{kind:'곡',name:'「괜찮아」',d:'힘든 친구한테 들려주는 따뜻한 노래.',m:'comfort'},
 run:{kind:'곡',name:'「달려라」',d:'시합 전에 듣는 힘찬 노래.',m:'cheer'},
 clap:{kind:'효과음',name:'박수',d:'짝짝짝! 응원하는 소리.',m:'cheer'},
 laugh:{kind:'효과음',name:'웃음',d:'하하하! 다 같이 웃는 소리.',m:'funny'},
 slow:{kind:'멘트',name:'"천천히 해도 돼요"',d:'"천천히 해도 돼요. 괜찮아요."',m:'comfort'},
 fight:{kind:'멘트',name:'"파이팅!"',d:'"할 수 있어요! 파이팅!"',m:'cheer'},
 dance:{kind:'곡',name:'「점심 댄스」',d:'몸이 저절로 움직이는 댄스 곡.',m:'upbeat'},
 walk:{kind:'곡',name:'「방과 후 산책」',d:'천천히 걷는 느낌의 잔잔한 곡.',m:'calm'},
 silly:{kind:'곡',name:'「바보 같은 노래」',d:'가사가 너무 웃긴 노래.',m:'funny'},
 again:{kind:'곡',name:'「다시 시작」',d:'포기하고 싶을 때 듣는 노래.',m:'cheer'},
 friend:{kind:'곡',name:'「안녕, 친구」',d:'멀어진 친구를 생각하는 노래.',m:'comfort'},
 drops:{kind:'효과음',name:'빗소리',d:'토독토독, 창밖에 비 오는 소리.',m:'calm'},
 bell:{kind:'효과음',name:'점심 종',d:'딩동댕동! 점심시간이 시작되는 소리.',m:'upbeat'},
 cheers:{kind:'효과음',name:'환호',d:'와아아! 관중이 소리 지르는 소리.',m:'upbeat'},
 heart:{kind:'효과음',name:'심장 소리',d:'쿵쿵쿵. 경기 직전, 두근거리는 소리.',m:'cheer'},
 waves:{kind:'효과음',name:'파도 소리',d:'쏴아… 바닷가에 앉아 있는 것 같은 소리.',m:'calm'},
 smile:{kind:'멘트',name:'"웃으면서 끝내요"',d:'"오늘 하루, 웃으면서 끝내요!"',m:'funny'},
 hands:{kind:'멘트',name:'"다 같이 손뼉!"',d:'"다 같이 손뼉 쳐요! 하나, 둘!"',m:'upbeat'},
 rest:{kind:'멘트',name:'"쉬어 가요"',d:'"잠깐 숨 쉬고, 쉬어 가요."',m:'calm'},
 alone:{kind:'멘트',name:'"혼자가 아니에요"',d:'"혼자가 아니에요. 우리가 들을게요."',m:'comfort'},
 joke:{kind:'멘트',name:'"아재 개그"',d:'"세상에서 가장 쉬운 숫자는? 십 오(쉬워)!"',m:'funny'},
 hug:{kind:'멘트',name:'"토닥토닥"',d:'"토닥토닥. 오늘 정말 수고했어요."',m:'comfort'},
 // joke cards: what a misheard errand brings back
 static:{kind:'효과음',name:'고장 난 테이프',d:'치지직… 뭔지 모를 이상한 소리.',m:'none',junk:1},
 fart:{kind:'효과음',name:'방귀 소리',d:'뿡! …이거 누가 넣었어?',m:'funny',junk:1},
 principal:{kind:'곡',name:'교장 선생님 애창곡',d:'1985년 트로트. 교장 선생님이 제일 좋아하는 곡.',m:'none',junk:1},
};
const STARTER=['rain','summer','okay','run','clap','laugh','slow','fight'];
const UNLOCK=['dance','walk','drops','smile','silly','bell','alone','again','cheers','rest','friend','heart','hands','hug','waves','joke'];  // into the draft pool, in this order
const POOL0=6,PER=150;  // 6 open from the start; one more per 150 listeners in total
const PERKS=[[200,'hari','하리','따뜻한 곡과 멘트가 두 배로 통해요.','Warm songs and lines count double.'],[500,'chan','찬','힘찬 효과음에 +15.','+15 on energetic sound effects.'],[900,'daon','다온','규칙을 지켜서 보류하면 +30.','+30 for holding back a rule-breaker.']];
/* ===== letters ===== */
const WANT={
 calm:[['요즘 너무 지쳤어요. 아무 생각 없이 조용히 듣고 싶어요.','I\'m so tired lately. I want to listen quietly without thinking.'],['도서관에서 공부 중이에요. 잔잔한 거 부탁해요.','I\'m studying in the library. Something gentle, please.']],
 upbeat:[['점심시간이잖아요! 다 같이 신나게 놀고 싶어요.','It\'s lunchtime! I want to have fun with everyone.'],['반 분위기가 너무 처졌어요. 확 띄워 주세요!','Our class mood is so flat. Lift it up!']],
 comfort:[['친구랑 싸웠어요. 마음이 너무 아파요.','I fought with a friend. My heart hurts so much.'],['전학 온 지 얼마 안 돼서 좀 외로워요.','I transferred recently, so I\'m a bit lonely.']],
 cheer:[['내일 농구 시합이 있어요. 힘을 주세요!','I have a basketball game tomorrow. Give me strength!'],['오디션이 다음 주예요. 너무 긴장돼요.','The audition is next week. I\'m so nervous.']],
 funny:[['오늘 하루가 너무 길었어요. 그냥 웃고 싶어요.','Today was so long. I just want to laugh.'],['짝꿍이 계속 졸아요 ㅋㅋ 깨워 줄 만한 거 없어요?','My deskmate keeps dozing lol. Anything to wake them up?']],
};
const AVOID={calm:['조용한 건 말고요!','Not something quiet!'],upbeat:['신나는 건 말고요.','Not something upbeat.'],comfort:['위로는 필요 없어요.','I don\'t need comforting.'],cheer:['파이팅 같은 말은 부담돼요.','Words like "fighting" feel like pressure.'],funny:['웃긴 건 지금 싫어요.','I don\'t want anything funny right now.']};
const CLASH={calm:['upbeat','funny'],upbeat:['calm','comfort'],comfort:['funny','upbeat'],cheer:['calm','funny'],funny:['comfort','calm']};  // what a writer may not want
const RULES={
 exam:{note:'오늘은 시험 얘기 금지. 다들 예민해요.',en:'No exam talk today. Everyone\'s on edge.',line:['그리고 내일 수학 시험 범위 좀 방송으로 알려 주세요!','And please announce tomorrow\'s math exam scope on air!'],why:'시험 얘기 금지였잖아…',whyEn:'No exam talk, remember…'},
 names:{note:'오늘은 실명 금지. 이름이 나오면 안 돼요.',en:'No real names today. No names on air.',line:['아, 2학년 4반 김민수한테 꼭 전해 주세요!','Oh, and please make sure Kim Minsu in Grade 2 Class 4 hears this!'],why:'실명 금지였잖아… 민수 이름이 나갔어.',whyEn:'No real names… Minsu\'s name went out.'},
 ads:{note:'오늘은 광고 금지. 가게 홍보는 안 돼요.',en:'No ads today. No promoting shops.',line:['그리고 학교 앞 엄마손 분식 홍보 좀 해 주세요! 우리 엄마 가게예요!','And please promote 엄마손 분식 in front of the school! It\'s my mom\'s shop!'],why:'광고 금지였잖아… 분식집 홍보가 나갔어.',whyEn:'No ads… the snack bar plug went out.'},
};
const FROM=['익명','1학년','2학년 1반','2학년 5반','3학년','비밀 청취자'];
const MOODS=Object.keys(WANT);
function letter(boss,rule){
 const wants=boss?shuf(MOODS).slice(0,2):[pick(MOODS)];
 const avoid=Math.random()<.6||boss?pick(CLASH[wants[0]].filter(m=>!wants.includes(m))):null;
 const parts=wants.map(m=>pick(WANT[m]));if(avoid)parts.push(AVOID[avoid]);
 const breaks=!boss&&Math.random()<.35;if(breaks)parts.push(RULES[rule].line);
 const ko=parts.map(p=>p[0]).join(' '),e=parts.map(p=>p[1]).join(' ');en(ko,e);
 return {ko,en:e,wants,avoid,breaks,from:pick(FROM),boss};
}
/* ===== meta (this browser) ===== */
const MKEY='jbl-deck-meta';
const meta=()=>{try{return JSON.parse(localStorage.getItem(MKEY)||'null')||{total:0,runs:0,best:0}}catch(e){return {total:0,runs:0,best:0}}};
const saveMeta=m=>{try{localStorage.setItem(MKEY,JSON.stringify(m))}catch(e){}};
const poolSize=t=>Math.min(UNLOCK.length,POOL0+Math.floor(t/PER));
const perkOn=(t,id)=>PERKS.some(p=>p[1]===id&&t>=p[0]);
/* ===== the errands (as in 방송부 활동: things in real furniture, generated) ===== */
const PLACES={
 rack:{zone:'bcast',tile:'rack',name:'방송실 선반',en:'the broadcast-room shelf'},cart:{zone:'bcast',tile:'tapeCart',name:'테이프 수레',en:'the tape cart'},
 boxes:{zone:'bcast',tile:'boxes',name:'방송실 상자',en:'the boxes in the broadcast room'},cabinet:{zone:'hall',tile:'cabinet',name:'교무실 캐비닛',en:'the staff-room cabinet'},
 tdesk:{zone:'class',tile:'tdesk',name:'교탁',en:'the teacher\'s desk in our class'},mshelf:{zone:'music',tile:'mShelf',name:'음악실 선반',en:'the music-room shelf'},
};
const COLORS=[['파란색','#3f7fd6','blue'],['빨간색','#d0503f','red'],['초록색','#4aa66a','green'],['노란색','#e0b93a','yellow'],['검은색','#2b2f38','black'],['흰색','#e9e9e6','white']];
const LABELS=[['박수','applause'],['웃음','laughter'],['종소리','bell'],['환호','cheering'],['빗소리','rain'],['발소리','footsteps']];
const COUNTS=[[2,'두','two'],[3,'세','three'],[4,'네','four']];
const sw=c=>`<i style="display:inline-block;width:13px;height:17px;border-radius:2px 5px 2px 2px;background:${c};vertical-align:-3px;margin-right:6px;box-shadow:inset 0 0 0 1.5px rgba(0,0,0,.35)"></i>`;
function look(it){
 if(it.kind==='file')return sw(it.c)+'파일';
 if(it.kind==='tape')return `테이프 「${it.label}」${it.broken?' <small>(끊어짐)</small>':''}`;
 if(it.kind==='cells')return '🔋'.repeat(it.n)+' 건전지';
 if(it.kind==='phones')return `<i style="display:inline-block;width:15px;height:15px;border-radius:50%;border:4px solid ${it.c};border-bottom-color:transparent;vertical-align:-3px;margin-right:6px;box-sizing:border-box"></i>헤드폰`;
}
function errands(items){
 const add=(place,o)=>{const it={id:items.length,place,...o};items.push(it);return it};
 const T={
  file(){const P=pick(['rack','cabinet']),[a,b,c]=shuf(COLORS);const w=add(P,{kind:'file',c:a[1]}),o=add(P,{kind:'file',c:b[1]}),x=add(P,{kind:'file',c:c[1]});
   return {ask:`곡 목록 좀 챙겨 줄래? ${PLACES[P].name}에 있어. ${a[0]} 파일. ${J(b[0],'은','는')} 작년 거라서…`,en:`Could you grab the song list? It's ${PLACES[P].en}. The ${a[2]} file. The ${b[2]} one is last year's…`,
    want:w,wrong:new Map([[o,[`그건 ${J(b[0],'이잖아','잖아')}… 작년 거야. ${a[0]}!`,`That's the ${b[2]} one… last year's. The ${a[2]} one!`]],[x,[`${J(c[0],'은','는')} 시험지 파일이야…`,`The ${c[2]} one is the exam papers…`]]])}},
  tape(){const P=pick(['cart','boxes']),[a,b,c]=shuf(LABELS);const w=add(P,{kind:'tape',label:a[0]}),o=add(P,{kind:'tape',label:b[0]}),x=add(pick(['cart','boxes']),{kind:'tape',label:c[0]}),br=add(P,{kind:'tape',label:a[0],broken:1});
   return {ask:`효과음 테이프… ${PLACES[P].name}에 라벨이 "${a[0]}"${bat(a[0])?'이라고':'라고'} 쓰인 거. "${b[0]}" 말고. 끊어진 건 빼고.`,en:`The sound-effect tape… on ${PLACES[P].en}, the one labelled "${a[1]}". Not "${b[1]}". Not the snapped one.`,
    want:w,wrong:new Map([[o,[`이건 ${J(b[0],'이야','야')}… ${J(a[0],'이','가')} 필요해.`,`This is "${b[1]}"… I need "${a[1]}".`]],[x,[`${J(c[0],'은','는')} 다음 주에 쓸 거야.`,`"${c[1]}" is for next week.`]],[br,['아, 그건 끊어졌어…','Ah, that one\'s snapped…']]])}},
  cells(){const P=pick(['tdesk','boxes']),t=pick(COUNTS.slice(0,2));const w=add(P,{kind:'cells',n:t[0]});const wr=new Map();
   COUNTS.filter(x=>x!==t).forEach(x=>wr.set(add(P,{kind:'cells',n:x[0]}),x[0]>t[0]?[`${x[1]} 개는 너무 많아… ${t[1]} 개만.`,`${x[2]} is too many… just ${t[2]}.`]:[`${x[1]} 개는 모자라…`,`${x[2]} isn't enough…`]));
   return {ask:`건전지… ${PLACES[P].name}에 있는데, ${t[1]} 개짜리만 가져와.`,en:`Batteries… they're ${PLACES[P].en}; just the pack of ${t[2]}.`,want:w,wrong:wr}},
  phones(){const c=pick(COLORS),[P,Q]=shuf(['rack','mshelf','boxes']);const w=add(P,{kind:'phones',c:c[1]}),b=add(Q,{kind:'phones',c:c[1]});
   return {ask:`헤드폰 좀… ${PLACES[P].name}에 있는 거. ${PLACES[Q].name}에 있는 건 소리가 안 나.`,en:`The headphones… the ones ${PLACES[P].en}. The ones ${PLACES[Q].en} have no sound.`,
    want:w,wrong:new Map([[b,[`그건 ${PLACES[Q].name}에 있던 거잖아… 소리 안 나.`,`Those were ${PLACES[Q].en}… no sound.`]]])}},
 };
 return shuf(Object.keys(T)).slice(0,2).map(k=>{const e=T[k]();e.misses=0;en(e.ask,e.en);return e});
}
/* ===== a run ===== */
let R=null;
const say=(who,ko,e,x)=>{if(e)en(ko,e);return {who,say:ko,...(x||{})}};
const whenFree=fn=>{const t=setInterval(()=>{if(!dlg&&!panelOpen()&&!$('deckPanel')){clearInterval(t);setTimeout(fn,200)}},120)};
function newRun(){
 const m=meta(),items=[];
 return {phase:'errand',items,errands:errands(items),ei:0,bag:[],deck:[...STARTER],rule:pick(Object.keys(RULES)),letters:[],li:0,total:0,plays:[],meta:m};
}
const cur=()=>R&&R.errands[R.ei];
function quest(){if(!R)return null;const ru=RULES[R.rule];
 if(R.phase==='errand')return `오늘의 규칙: ${ru.note.split('.')[0]} · 심부름 ${R.ei+1}/${R.errands.length} · 덱 ${R.deck.length}장`;
 if(R.phase==='air')return `방송실 · 믹서 앞에서 방송 시작 · 덱 ${R.deck.length}장`;
 return '방송 끝! · 구름한테 한 번 더?'}
const refresh=()=>{try{updateQuest()}catch(e){}};
function openPlace(key){
 const P=PLACES[key],here=R.items.filter(it=>it.place===key&&!R.bag.includes(it)&&!it.given);
 const first=`${J(P.name,'을','를')} 열어 봤어요.`;en(first,`I looked in ${P.en}.`);
 if(!here.length&&!R.bag.length){openDialog('…',[say('…',`${P.name}… 비어 있어요.`,`${P.en}… it's empty.`)]);return}
 openDialog('…',[{who:'…',say:first,choose:[...here.map(it=>[look(it),()=>{if(R.bag.length>=2){openDialog('…',[say('…','가방이 꽉 찼어요.','The bag is full.')]);return}R.bag.push(it);sfx('item');refresh()}]),...R.bag.map(it=>['내려놓기 · '+look(it),()=>{R.bag=R.bag.filter(x=>x!==it);it.place=key;sfx('item');refresh()}]),['그만 보기',null]]}]);
}
function talkGureum(){
 if(R.phase==='errand'){const E=cur();
  if(!R.bag.length){openDialog('백구름',[say('백구름',E.ask,E.en)]);return}
  openDialog('백구름',[{...say('백구름','가져왔어? 뭐 줄래?','Did you bring it? What will you give me?'),choose:[...R.bag.map(it=>[look(it),()=>give(it)]),['다시 말해 줘',()=>openDialog('백구름',[say('백구름',E.ask,E.en)])],['아직',null]]}]);return}
 if(R.phase==='air'){openDialog('백구름',[say('백구름','믹서 앞으로 가자. 사연이 세 개 왔어.','Let\'s go to the mixer. Three letters came in.')]);return}
 openDialog('백구름',[{...say('백구름','…한 번 더 할래?','…want to go again?'),choose:[['한 번 더',()=>begin()],['나중에',null]]}]);
}
function give(it){
 const E=cur();
 if(it!==E.want){E.misses++;const w=E.wrong.get(it)||['어…? 이건 필요 없는데…','Huh…? I don\'t need this…'];R.bag=R.bag.filter(x=>x!==it);refresh();openDialog('백구름',[say('백구름',w[0],w[1]),say('백구름','이건 제자리에 갖다 놓을게.','I\'ll put this one back where it was.')]);return}
 it.given=1;R.bag=R.bag.filter(x=>x!==it);sfx('ok');refresh();
 whenFree(()=>draft(E.misses>0));
 openDialog('백구름',[say('백구름','고마워… 이거 맞아. 자, 이거 가져가. 방송 때 써.','Thanks… this is it. Here, take this. Use it on air.')]);
}
function draft(misheard){
 const pool=UNLOCK.slice(0,poolSize(R.meta.total)).filter(id=>!R.deck.includes(id));
 let offer=shuf(pool).slice(0,3);if(misheard)offer[2]=pick(['static','fart','principal']);
 const lab=id=>{const c=CARDS[id];return `<b>${c.kind}</b> ${esc(c.name)} — ${esc(c.d)}`};
 openDialog('백구름',[{...say('백구름',misheard?'아, 그리고… 잘못 가져온 것도 하나 섞였어. 골라.':'뭐 가져갈래? 하나만.',misheard?'Oh, and… the wrong thing you brought got mixed in. Pick one.':'Which one will you take? Just one.'),
  choose:offer.map(id=>[lab(id),()=>{R.deck.push(id);toast('덱에 추가: '+CARDS[id].name);next()}])}]);
}
function next(){
 R.ei++;refresh();
 if(R.ei<R.errands.length){const N=cur();whenFree(()=>openDialog('백구름',[say('백구름','하나 더…','One more…'),say('백구름',N.ask,N.en)]));return}
 R.phase='air';R.letters=[letter(false,R.rule),letter(false,R.rule),letter(true,R.rule)];refresh();
 whenFree(()=>openDialog('백구름',[say('백구름','준비 끝! 믹서 앞으로 가자. 오늘 사연은 세 개. 마지막 건 좀 까다로워.','All set! To the mixer. Three letters today. The last one is tricky.')]));
}
/* ===== on air: the card table ===== */
function css(){if($('deckCss'))return;const st=document.createElement('style');st.id='deckCss';
 st.textContent=`#deckPanel .sheet{gap:10px}
 #deckPanel .dl{background:#f1e9d4;color:#2b2720;border-radius:6px;padding:10px 12px;display:grid;gap:6px}
 #deckPanel .dl .fr{display:flex;align-items:center;gap:6px;font-size:.78rem;font-weight:700;opacity:.75}
 #deckPanel .dl .fr button{margin-left:auto}#deckPanel .dl .btn{color:#2b2720;border-color:#2b2720;background:transparent}#deckPanel .dl .btn+.btn{margin-left:0}
 #deckPanel .dl p{margin:0;font-size:1rem;line-height:1.6;font-weight:500}
 #deckPanel .dl .en{font-size:.85rem;opacity:.75}
 #deckPanel .rule{font-size:.8rem;opacity:.8}
 #deckPanel .hand{display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:6px}
 #deckPanel .cd{text-align:left;border:2px solid var(--ink);border-radius:8px;background:transparent;color:var(--ink);padding:7px 8px;cursor:pointer;display:grid;gap:2px;font-family:inherit}
 #deckPanel .cd b{font-size:.92rem}#deckPanel .cd small{font-size:.78rem;opacity:.8;line-height:1.35}
 #deckPanel .cd .k{font-size:.68rem;letter-spacing:.08em;opacity:.65}
 #deckPanel .cd[aria-pressed="true"]{background:var(--ink);color:var(--hull)}
 #deckPanel .row{display:flex;gap:8px;justify-content:flex-end;flex-wrap:wrap}
 #deckPanel .res{display:grid;gap:3px;font-size:.9rem}
 #deckPanel .res .ln{display:flex;justify-content:space-between;gap:8px}
 #deckPanel .res .tot{font-weight:700;border-top:1px solid currentColor;padding-top:4px}
 #deckPanel .up{color:#2f8f5b}#deckPanel .dn{color:#b3412f}
 #deckPanel .meter{height:8px;border-radius:5px;background:color-mix(in srgb,var(--ink) 15%,transparent);overflow:hidden}
 #deckPanel .meter i{display:block;height:100%;background:var(--amber,#E8952B)}`;
 document.head.appendChild(st)}
let keyBlock=null;
function panel(html){
 css();let P=$('deckPanel');
 if(!P){P=document.createElement('div');P.className='panel';P.id='deckPanel';P.innerHTML='<div class="sheet startsheet" role="dialog" aria-label="방송"></div>';document.body.append(P);
  keyBlock=e=>{if(/^(Arrow|Enter| |z|Z|x|X|m|M|w|a|s|d|Escape)/.test(e.key)&&!(e.target.closest&&e.target.closest('button'))){e.stopImmediatePropagation()}};
  addEventListener('keydown',keyBlock,true)}  // the game doesn't walk behind the table
 P.firstChild.innerHTML=html;return P.firstChild;
}
function closePanel(){$('deckPanel')?.remove();if(keyBlock)removeEventListener('keydown',keyBlock,true);keyBlock=null}
let showEn=false;
function onAir(){
 if(R.li===0){sfx('bell');R.pile=shuf(R.deck)}
 const L=R.letters[R.li];if(R.pile.length<5)R.pile=R.pile.concat(shuf(R.deck.filter(id=>!R.pile.includes(id))));
 R.hand=R.pile.splice(0,5);R.sel=[];
 if(!R.hand.some(id=>L.wants.includes(CARDS[id].m))){const k=R.pile.findIndex(id=>L.wants.includes(CARDS[id].m));if(k>=0){R.pile.push(R.hand[4]);R.hand[4]=R.pile.splice(k,1)[0]}}  // a hand always has one that fits, if the deck does
 render();
}
function render(){
 const L=R.letters[R.li],ru=RULES[R.rule];
 const box=panel(`<h2>ON AIR · ${R.li+1}/3${L.boss?' · 까다로운 사연':''}<span style="font-size:.9rem">청취자 ${R.total}</span></h2>
  <div class="rule">오늘의 규칙 · ${esc(ru.note)}</div>
  <div class="dl"><div class="fr">사연 · ${esc(L.from)}<button class="btn" type="button" id="dkSpk" style="padding:2px 8px;font-size:.75rem">듣기</button><button class="btn" type="button" id="dkEn" aria-pressed="${showEn}" style="padding:2px 8px;font-size:.75rem">?</button></div>
   <p>${esc(L.ko)}</p><div class="en" ${showEn?'':'hidden'}>${esc(L.en)}</div></div>
  <div class="hand">${R.hand.map((id,i)=>{const c=CARDS[id];return `<button class="cd" type="button" data-i="${i}" aria-pressed="${R.sel.includes(i)}"><span class="k">${c.kind}</span><b>${esc(c.name)}</b><small>${esc(c.d)}</small></button>`}).join('')}</div>
  <div class="row"><button class="btn" type="button" id="dkHold">보류</button><button class="btn" type="button" id="dkPlay" style="background:var(--ink);color:var(--hull)" ${R.sel.length?'':'disabled'}>방송하기 (${R.sel.length}/3)</button></div>`);
 box.querySelectorAll('.cd').forEach(b=>b.onclick=()=>{const i=+b.dataset.i;R.sel=R.sel.includes(i)?R.sel.filter(x=>x!==i):R.sel.length<3?[...R.sel,i]:R.sel;render()});
 $('dkEn').onclick=()=>{showEn=!showEn;render()};
 $('dkSpk').onclick=()=>{try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(L.ko);u.lang='ko-KR';u.rate=.9;speechSynthesis.speak(u)}catch(e){}};
 $('dkHold').onclick=()=>score(true);$('dkPlay').onclick=()=>score(false);
}
function score(hold){
 const L=R.letters[R.li],t=R.meta.total,ru=RULES[R.rule],lines=[];let pts=0,mult=1,who='백구름',react;
 if(hold){
  if(L.breaks){pts=30+(perkOn(t,'daon')?30:0);lines.push(['규칙 지킴',pts]);react=['잘 봤어. 그대로 나갔으면 큰일 났어.','Good eye. It would have been trouble if that went out.']}
  else{pts=-10;lines.push(['괜히 보류',-10]);react=['이건… 내보내도 됐는데.','This one… we could have aired.']}
 }else{
  const cards=R.sel.map(i=>CARDS[R.hand[i]]);let fit=0;
  for(const c of cards){let v=0;
   if(L.wants.includes(c.m)){v=BASE[c.kind];if(perkOn(t,'hari')&&c.m==='comfort')v*=2;if(perkOn(t,'chan')&&c.kind==='효과음'&&['cheer','upbeat'].includes(c.m))v+=15;fit++}
   else if(c.m===L.avoid||(c.m!=='none'&&L.wants.every(w=>CLASH[w].includes(c.m))))v=-25;
   lines.push([c.kind+' '+c.name,v]);pts+=v}
  const kinds=new Set(cards.filter(c=>L.wants.includes(c.m)).map(c=>c.kind));
  if(fit>=2)mult=1.5;if(kinds.size===3)mult=2;if(L.boss&&L.wants.every(w=>cards.some(c=>c.m===w)))mult+=.5;
  if(L.breaks){pts-=40;lines.push(['규칙 위반: '+ru.note.split('.')[0],-40])}
  const good=pts>0;who=good?'유하리':'백구름';
  react=L.breaks?[ru.why,ru.whyEn]:mult>=2?['완벽해! 노래, 소리, 멘트가 딱 맞았어.','Perfect! The song, sound and line all fit.']:good?['좋았어. 사연 쓴 사람 좋아하겠다.','Nice. The writer will like that.']:fit?['음… 반은 맞았는데.','Hmm… half right.']:['어… 사연이랑 안 맞는 것 같아.','Uh… that doesn\'t seem to fit the letter.'];
  R.hand.forEach((id,i)=>{if(!R.sel.includes(i))R.pile.push(id)});
 }
 const got=Math.round(Math.max(pts,hold?pts:0)*mult);R.total=Math.max(0,R.total+got);R.plays.push({L,got,hold});en(react[0],react[1]);
 sfx(got>0?'ok':'no');
 const box=panel(`<h2>${got>=0?'+':''}${got} 청취자<span style="font-size:.9rem">합계 ${R.total}</span></h2>
  <div class="res">${lines.map(([n,v])=>`<div class="ln"><span>${esc(n)}</span><span class="${v>0?'up':v<0?'dn':''}">${v>0?'+':''}${v}</span></div>`).join('')}
  ${mult>1?`<div class="ln"><span>콤보</span><span class="up">×${mult}</span></div>`:''}<div class="ln tot"><span>이번 사연</span><span>${got}</span></div></div>
  <div class="dl"><div class="fr">${who}</div><p>${esc(react[0])}</p></div>
  <div class="row"><button class="btn" type="button" id="dkNext" style="background:var(--ink);color:var(--hull)">${R.li<2?'다음 사연':'방송 끝'}</button></div>`);
 $('dkNext').onclick=()=>{R.li++;if(R.li<3)onAir();else endShow()};
}
function endShow(){
 const m=R.meta,before=m.total,pb=poolSize(before);m.total+=R.total;m.runs++;m.best=Math.max(m.best,R.total);saveMeta(m);
 const pa=poolSize(m.total),newCards=UNLOCK.slice(pb,pa),nextAt=pa<UNLOCK.length?(pa-POOL0+1)*PER:null,nextCard=pa<UNLOCK.length?CARDS[UNLOCK[pa]]:null;
 const perks=PERKS.filter(p=>before<p[0]&&m.total>=p[0]),nextPerk=PERKS.find(p=>m.total<p[0]);
 const best=R.plays.reduce((a,b)=>b.got>a.got?b:a,R.plays[0]);
 panel(`<h2>OFF AIR · 오늘 청취자 ${R.total}<span style="font-size:.9rem">최고 ${m.best}</span></h2>
  <div class="res"><div class="ln"><span>지금까지 청취자</span><span>${m.total}</span></div>
  ${nextAt?`<div class="meter"><i style="width:${Math.min(100,Math.round((m.total-(nextAt-PER))/PER*100))}%"></i></div><div class="ln"><span>다음 카드까지</span><span>${nextAt-m.total}</span></div>`:''}</div>
  ${newCards.length?`<div class="dl"><div class="fr">새 카드</div><p>${newCards.map(id=>esc(CARDS[id].name)).join(' · ')}</p></div>`:''}
  ${perks.length?`<div class="dl"><div class="fr">방송부원 효과</div><p>${perks.map(p=>`${p[2]}: ${esc(p[3])}`).join('<br>')}</p></div>`:''}
  ${nextCard?`<div class="rule">다음 방송에 새 카드: ${esc(nextCard.name)}${nextPerk?` · ${nextPerk[2]} 효과까지 ${nextPerk[0]-m.total}`:''}</div>`:''}
  <div class="row"><button class="btn" type="button" id="dkDone" style="background:var(--ink);color:var(--hull)">끝</button></div>`);
 $('dkDone').onclick=()=>{closePanel();R.phase='done';refresh();
  const lines=[say('백구름',`오늘 청취자 ${R.total}명. …나쁘지 않았어.`,`${R.total} listeners today. …not bad.`)];
  if(best&&best.got>=60)lines.push(say('유하리','두 번째… 아니, 그 사연 진짜 좋았어. 다들 그 얘기 해.','That one letter was really good. Everyone\'s talking about it.'));
  if(R.plays.some(p=>p.L.breaks&&!p.hold))lines.push(say('오다온','오늘 방송, 교감 선생님이 들으셨어. …내일 각오해.','The vice-principal heard today\'s show. …brace yourself for tomorrow.'));
  else if(R.plays.some(p=>p.L.breaks&&p.hold))lines.push(say('오다온','규칙 지켰더라. …조금 감동했어.','You kept the rule. …I\'m a little impressed.'));
  lines.push(say('남궁찬',R.total>=150?'체육관에서도 다 들었어! 내일도 해!':'점심 먹으면서 들었어. 다음엔 더 신나게!',R.total>=150?'Even the gym heard it! Do it again tomorrow!':'I listened over lunch. Make it livelier next time!'));
  openDialog('방송 끝',lines)};
}
/* ===== hooks (only while this lab's run is on, in 2교시's replay) ===== */
const on=()=>!!R&&!!RP&&CH&&CH.id==='ch2'&&window.__labActive===ID;
const facing0=window.facing,talk0=window.talkWith,open0=window.openDialog;
facing=function(){
 if(on()){const [dx,dy]=D[player.dir],L=Z.legend[at(player.x+dx,player.y+dy)]||{};
  const key=Object.keys(PLACES).find(k=>PLACES[k].zone===ZID&&PLACES[k].tile===L.tile);
  if(key&&R.phase==='errand')return {spot:{steps:[{lab:ID+':'+key}]}};
  if(ZID==='bcast'&&(L.tile==='mixer'||L.tile==='micStand')&&R.phase==='air')return {spot:{steps:[{lab:ID+':air'}]}}}
 return facing0();
};
openDialog=function(name,steps,opts){
 const l=steps&&steps.length===1&&steps[0]&&steps[0].lab;
 if(l&&l.startsWith(ID+':')&&on()){const k=l.slice(ID.length+1);return k==='air'?onAir():openPlace(k)}
 return open0(name,steps,opts);
};
talkWith=function(n){if(on()&&n&&n.name==='백구름')return talkGureum();return talk0(n)};
function begin(){
 R=newRun();refresh();const ru=RULES[R.rule];en(ru.note,ru.en);
 whenFree(()=>openDialog('백구름',[say('교감 선생님 쪽지',ru.note,ru.en),
  say('백구름','오늘 규칙이야. 사연 읽을 때 조심해.','That\'s today\'s rule. Be careful when you read the letters.'),say('백구름',cur().ask,cur().en)]));
}
LAB.start=()=>{
 loadCps().then(all=>{const L=(all||{}).ch2||[],at=L[L.length-1];if(!at){toast('2교시 장면이 없어요.');return}
  boot('ch2',{force:1,at});window.__labActive=ID;
  const q0=C.questText;C.questText=()=>on()?quest():q0();
  setTimeout(()=>{loadZone('bcast',5,4,'up');begin()},500)});
};
LAB.state=()=>R;LAB.cards=CARDS;  // for tests
WALK_LABS[ID]=LAB;
})();

/* 실험 · 눈치 있게 (all 교시): read the room. Something happens around 느티고, one short line, and the taught word in it says what
   kind of thing it is: someone is struggling → 도와주기; someone is doing something wrong → 막기; something good happened →
   축하하기. Five places, one per 교시 (its taught words), then the whole day mixed, where 못/안 flip it ("시험에 못 붙었어요"
   is 도와주기). A miss shows the word's meaning (the chapters' own 사전 entries) right away; three misses and it gets 어색.
   Debug only (설정 · 개발, or ?lab=nunchi); a panel over whatever chapter is open, no save of the game touched; progress in this
   browser (lab-nunchi). Every line is checked against notes/story.md: 하리 is 1학년 (never in 2학년 3반, met in 2교시), 구름 is 2학년,
   태식 the 3학년 who passes, only the 3학년 boys tease 하리. Remove = delete this file and its labs.json entry. */
(()=>{
const ID='nunchi',LAB={};
let keyBlock=null;
function panelBox(){let P=document.getElementById('nunPanel');if(!P){P=document.createElement('div');P.id='nunPanel';P.setAttribute('role','dialog');P.setAttribute('aria-label','눈치 있게');
 P.innerHTML='<div class="wrap" aria-live="polite"></div>';document.body.append(P);keyBlock=e=>e.stopImmediatePropagation();addEventListener('keydown',keyBlock,true)}return P.firstChild}
function closeLab(){cancelAnimationFrame(raf);document.getElementById('nunPanel')?.remove();if(keyBlock)removeEventListener('keydown',keyBlock,true);keyBlock=null;if(window.__labActive===ID)window.__labActive=null}
function css(){if(document.getElementById('nunCss'))return;const st=document.createElement('style');st.id='nunCss';st.textContent="\n\n#nunPanel{\n --bg:#e4e3dc;--paper:#f6efdc;--ink:#1d2129;--muted:#5d6370;--line:#c9bfa6;--card:#fffaf0;--sceneInk:#f6efdc;\n --accent:#e9952c;--good:#3f9a62;--bad:#c2463a;--mark:#f6d27a;--help:#3f8fcf;--stop:#c2463a;--yay:#e2a21c;\n --shadow:0 1px 0 rgba(29,33,41,.12),0 6px 16px -10px rgba(29,33,41,.45);\n --display:'Do Hyeon','Noto Sans KR','Apple SD Gothic Neo',sans-serif;--body:'Noto Sans KR','Apple SD Gothic Neo','Malgun Gothic',sans-serif;\n}\n@media (prefers-color-scheme:dark){:root:not([data-theme=\"light\"]) #nunPanel{--bg:#15181e;--paper:#232831;--ink:#eef0f3;--muted:#a3a9b5;--line:#3a414d;--card:#2b313b;--mark:#7a5b16;\n --shadow:0 1px 0 rgba(0,0,0,.4),0 8px 18px -10px rgba(0,0,0,.8);color-scheme:dark}}\n:root[data-theme=\"dark\"] #nunPanel{--bg:#15181e;--paper:#232831;--ink:#eef0f3;--muted:#a3a9b5;--line:#3a414d;--card:#2b313b;--mark:#7a5b16;\n --shadow:0 1px 0 rgba(0,0,0,.4),0 8px 18px -10px rgba(0,0,0,.8);color-scheme:dark}\n#nunPanel{position:fixed;inset:0;z-index:60;overflow:auto;background:var(--bg);color:var(--ink);font-family:var(--body);font-size:15px;line-height:1.55;\n padding:max(12px,env(safe-area-inset-top,0px)) max(16px,env(safe-area-inset-right,0px)) 28px max(16px,env(safe-area-inset-left,0px))}\n#nunPanel [hidden]{display:none!important}\n#nunPanel .wrap{max-width:440px;margin:0 auto;display:grid;gap:12px}\n#nunPanel .top{display:flex;justify-content:space-between;align-items:center;gap:8px}\n#nunPanel h1{margin:0;font-family:var(--display);font-weight:400;font-size:1.6rem;letter-spacing:.02em}\n#nunPanel .icons{display:flex;gap:6px}\n#nunPanel .ib{font:700 .85rem var(--body);border:2px solid var(--ink);background:transparent;color:var(--ink);border-radius:999px;min-width:34px;height:34px;cursor:pointer;padding:0 8px}\n#nunPanel .ib[aria-pressed=\"true\"]{background:var(--ink);color:var(--bg)}\n#nunPanel .path{display:flex;gap:5px;justify-content:center;flex-wrap:wrap}\n#nunPanel .path span{font-size:.72rem;padding:2px 9px;border-radius:999px;border:1px solid var(--line);color:var(--muted)}\n#nunPanel .path span.now{background:var(--ink);color:var(--bg);border-color:var(--ink)}#nunPanel .path span.won::before{content:\"✓ \"}\n#nunPanel .scene{position:relative;color:var(--sceneInk);border-radius:14px;height:150px;overflow:hidden;background:var(--sbg)}\n#nunPanel .scene .place{position:absolute;left:12px;top:9px;font:700 .74rem var(--body);letter-spacing:.06em;background:rgba(0,0,0,.3);padding:2px 8px;border-radius:6px}\n#nunPanel .scene .pts{position:absolute;right:12px;top:6px;text-align:right;font-variant-numeric:tabular-nums}\n#nunPanel .scene .pts small{display:block;font-size:.66rem;opacity:.8}#nunPanel .scene .pts b{font-family:var(--display);font-weight:400;font-size:1.5rem}\n#nunPanel .awk{position:absolute;left:12px;top:36px;display:flex;gap:4px;align-items:center;font-size:.68rem;opacity:.9}\n#nunPanel .awk i{width:12px;height:12px;border-radius:3px;border:2px solid rgba(255,255,255,.4)}#nunPanel .awk i.on{background:#ff8a7a;border-color:#ff8a7a}\n#nunPanel .floor{position:absolute;left:0;right:0;bottom:0;height:28px;background:rgba(0,0,0,.28)}\n#nunPanel .who{position:absolute;bottom:22px;left:calc(50% - 22px);width:44px;height:76px}\n#nunPanel .who .h{position:absolute;left:8px;top:0;width:28px;height:28px;border-radius:50%;background:#f1c9a0;box-shadow:inset 0 9px 0 var(--hair,#2b2018)}\n#nunPanel .who .b{position:absolute;left:4px;top:28px;width:36px;height:34px;border-radius:10px 10px 4px 4px;background:var(--shirt,#3b5a8c)}\n#nunPanel .who .l{position:absolute;left:10px;top:60px;width:24px;height:16px;background:#2a2d36;border-radius:0 0 4px 4px}\n#nunPanel .who .name{position:absolute;top:-20px;left:50%;transform:translateX(-50%);font-size:.72rem;white-space:nowrap;opacity:.9}\n#nunPanel .who.happy{animation:nun-bounce .5s}#nunPanel .who.sad{animation:nun-shake .4s}\n#nunPanel .pop{position:absolute;left:50%;top:12%;transform:translateX(-50%);font:900 1.15rem var(--body);color:#ffe08a;text-shadow:0 2px 0 rgba(0,0,0,.4);animation:nun-up .9s forwards;pointer-events:none;white-space:nowrap}\n#nunPanel .pop.bad{color:#ff9a8a}\n#nunPanel .ev{background:var(--card);border:2px solid var(--ink);border-radius:14px;padding:12px 14px 10px;box-shadow:var(--shadow);display:grid;gap:6px}\n#nunPanel .ev .tag{font:700 .72rem var(--body);letter-spacing:.1em;color:var(--muted)}\n#nunPanel .ev .ko{font-size:1.38rem;font-weight:500;line-height:1.5;text-wrap:balance}\n#nunPanel .ev mark{background:var(--mark);color:inherit;border-radius:4px;padding:0 2px}\n#nunPanel .quick{height:6px;border-radius:3px;background:color-mix(in srgb,var(--ink) 12%,transparent);overflow:hidden}#nunPanel .quick i{display:block;height:100%;background:var(--accent);width:100%}\n#nunPanel .en{font-size:.84rem;color:var(--muted);line-height:1.45}\n#nunPanel .moves{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}\n#nunPanel .mv{font:inherit;color:var(--ink);background:var(--paper);border:2px solid var(--ink);border-radius:12px;padding:10px 6px 8px;cursor:pointer;display:grid;gap:2px;justify-items:center;box-shadow:var(--shadow);border-top:6px solid var(--c)}\n#nunPanel .mv b{font-family:var(--display);font-weight:400;font-size:1.32rem}#nunPanel .mv small{font-size:.72rem;color:var(--muted);text-align:center;line-height:1.3}\n#nunPanel .mv:disabled{cursor:default;opacity:.45}#nunPanel .mv:active:not(:disabled){transform:translateY(2px)}\n#nunPanel .glyph{width:28px;height:28px;color:var(--c)}\n#nunPanel .res{border-radius:12px;padding:10px 14px;display:grid;gap:7px;border:2px solid;animation:nun-pop .3s ease}\n#nunPanel .res.good{border-color:var(--good);background:color-mix(in srgb,var(--good) 12%,var(--paper))}\n#nunPanel .res.bad{border-color:var(--bad);background:color-mix(in srgb,var(--bad) 12%,var(--paper))}\n#nunPanel .res h2{margin:0;font-family:var(--display);font-weight:400;font-size:1.32rem}\n#nunPanel .def{font-size:.92rem;background:var(--paper);border-radius:8px;padding:8px 10px;border-left:4px solid var(--c)}\n#nunPanel .def b{font-weight:900}\n#nunPanel .wbtn{font:inherit;font-size:.84rem;border:1px solid var(--line);background:var(--paper);color:var(--ink);border-radius:8px;padding:5px 10px;cursor:pointer;justify-self:start}\n#nunPanel .row{display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap}\n#nunPanel .btn{font:700 .95rem var(--body);border:2px solid var(--ink);border-radius:10px;padding:10px 18px;cursor:pointer;background:var(--ink);color:var(--bg)}\n#nunPanel .note{font-size:.8rem;color:var(--muted)}\n#nunPanel .card{background:var(--paper);border-radius:14px;padding:16px;text-align:center;display:grid;gap:8px;justify-items:center}\n#nunPanel .card h2{margin:0;font-family:var(--display);font-weight:400;font-size:2rem}\n#nunPanel .stars{font-size:1.5rem;letter-spacing:.2em;color:var(--accent)}\n#nunPanel .learned{width:100%;display:grid;gap:6px;text-align:left}#nunPanel .learned div{background:var(--card);border-radius:10px;padding:8px 12px;font-size:.88rem;border-left:4px solid var(--c)}#nunPanel .learned b{font-size:.8rem;display:block}\n#nunPanel :focus-visible{outline:3px solid var(--accent);outline-offset:2px}\n@keyframes nun-bounce{40%{transform:translateY(-14px)}}\n@keyframes nun-shake{20%{transform:translateX(-6px)}40%{transform:translateX(6px)}60%{transform:translateX(-4px)}}\n@keyframes nun-up{from{opacity:1;translate:0 0}to{opacity:0;translate:0 -40px}}\n@keyframes nun-pop{from{transform:scale(.97);opacity:0}to{transform:none;opacity:1}}\n#nunPanel .who.nunface{width:60px;height:auto;left:calc(50% - 30px);bottom:32px}#nunPanel .who.nunface canvas{display:block;width:60px;height:60px;image-rendering:pixelated;border-radius:10px;background:rgba(255,255,255,.12)}#nunPanel .ev .ko,#nunPanel .learned,#nunPanel .def{word-break:keep-all}\n@media (prefers-reduced-motion:reduce){#nunPanel *{animation:none!important;transition:none!important}}\n";document.head.appendChild(st)}

/* Read the room (눈치): something happens around school, one short line, and its taught word says what kind of thing it is —
   someone is struggling → 도와주기; someone is doing something wrong → 막기; something good happened → 축하하기.
   Five places, one per 교시's words, then the whole day mixed (with 못/안: "시험에 못 붙었어요" is 도와주기). A miss shows the
   word's meaning right away; three misses and things get 어색. */
const DICT={"가입하다": {"k": "모임이나 동아리에 들어가요.", "e": "to join, sign up"}, "감동": {"k": "좋은 이야기를 듣고 마음이 크게 움직이는 것. 눈물이 날 수도 있어요. (감동하다)", "e": "being moved, touched"}, "고민하다": {"k": "어떻게 할지 몰라서 오래 생각하고 걱정해요.", "e": "to agonize, worry over"}, "광고": {"k": "많은 사람이 알게 물건이나 행사를 보여 주는 것.", "e": "advertisement, ad"}, "괴롭히다": {"k": "남이 싫어하는 일을 계속 해서 힘들게 해요.", "e": "to bully, to torment"}, "기회": {"k": "무엇을 해 볼 수 있는 좋은 때. 놓치면 다시 안 올 수도 있어요.", "e": "chance, opportunity"}, "긴장하다": {"k": "걱정돼서 몸과 마음이 딱딱해져요.", "e": "to be nervous, tense"}, "끼어들다": {"k": "남의 일이나 말 사이에 갑자기 들어와요.", "e": "to butt in, cut in"}, "놀리다": {"k": "남을 보고 웃으면서 기분 나쁘게 해요.", "e": "to tease, to make fun of"}, "놓치다": {"k": "잡아야 하는 것을 못 잡아요. 버스, 기회, 공…", "e": "to miss (a chance, a bus), to let slip"}, "답답하다": {"k": "꽉 막힌 느낌이에요. 창문이 다 닫힌 방처럼요. 일이 잘 안 될 때도 써요.", "e": "to feel stifled, frustrated"}, "당황하다": {"k": "갑자기 놀라서 어떻게 할지 몰라요.", "e": "to be flustered, thrown"}, "댓글": {"k": "인터넷 글 밑에 쓰는 짧은 글.", "e": "(online) comment"}, "데려오다": {"k": "다른 사람과 같이 이쪽으로 와요. \"데리고 와요.\"", "e": "to bring (a person) here"}, "동갑": {"k": "나이가 같아요.", "e": "(being) the same age"}, "목표": {"k": "앞으로 꼭 하고 싶은 일.", "e": "goal, target"}, "무시하다": {"k": "못 본 척, 못 들은 척해요. 또는 사람을 낮게 봐요.", "e": "to ignore; to look down on"}, "벌금": {"k": "규칙을 안 지켜서 내는 돈.", "e": "fine, penalty"}, "붙다": {"k": "떨어지지 않고 딱 있어요. \"벽에 종이가 붙어 있어요.\" 시험에 붙다 = 시험에 안 떨어져요.", "e": "to stick, be posted; to pass (a test)"}, "빡빡하다": {"k": "할 일이 너무 많아서 쉬는 시간이 없어요.", "e": "to be tight, packed (schedule)"}, "뽑다": {"k": "많은 것 중에서 하나를 골라요. 잡아서 빼요(이를 뽑다). 자판기에서 꺼내요.", "e": "to pick, pull out; get (from a machine)"}, "사과하다": {"k": "잘못해서 \"미안해요\"라고 말해요.", "e": "to apologize"}, "사실대로": {"k": "진짜 있었던 일 그대로. 거짓말 없이.", "e": "truthfully, as it happened"}, "생초보": {"k": "아무것도 모르는, 완전 처음 하는 사람.", "e": "complete beginner, total newbie"}, "설레다": {"k": "좋은 일을 기다려서 마음이 두근두근해요.", "e": "to be excited, (heart) to flutter"}, "소문나다": {"k": "많은 사람이 그 이야기를 알게 돼요. \"전학생 왔대!\" → 다들 알아요.", "e": "(word) to get around, to spread"}, "심화반": {"k": "공부를 더 깊고 어렵게 하는 반.", "e": "advanced class"}, "쏘다": {"k": "친구한테 내가 돈을 다 내고 사 줘요. (원래 뜻: 총이나 활을 쏘다)", "e": "to treat (someone to food); to shoot"}, "약속": {"k": "\"꼭 할게\"라고 서로 정한 것. 만날 시간도 약속.", "e": "promise; appointment"}, "어색하다": {"k": "자연스럽지 않고 불편해요. 할 말이 없어요.", "e": "to be awkward"}, "얼다": {"k": "물이 차가워서 얼음이 돼요. 너무 놀라서 몸이 안 움직여도 \"얼었어요\".", "e": "to freeze"}, "엿듣다": {"k": "남의 이야기를 몰래 들어요. 문 뒤에서, 벽 뒤에서. (엿들어요, 엿들었어요)", "e": "to eavesdrop"}, "오해하다": {"k": "말이나 일을 잘못 알아요. 사실과 다르게 생각해요.", "e": "to misunderstand"}, "이루다": {"k": "원하던 일이 진짜가 되게 해요.", "e": "to achieve, to make (a dream) come true"}, "일부러": {"k": "알면서, 하고 싶어서 해요. 실수의 반대.", "e": "on purpose"}, "장난": {"k": "재미로 하는 일. 너무 하면 남이 싫어해요.", "e": "joke, prank, mischief"}, "재촉하다": {"k": "빨리 하라고 자꾸 말해요.", "e": "to hurry (someone), to press"}, "전하다": {"k": "다른 사람의 말이나 물건을 대신 가져다줘요.", "e": "to pass on, to deliver (a message/thing)"}, "절박하다": {"k": "아주 급하고 힘들어서 다른 길이 없어요.", "e": "to be desperate"}, "즐기다": {"k": "무엇을 재미있게 해요.", "e": "to enjoy"}, "창피하다": {"k": "사람들 앞에서 부끄러워요. 얼굴이 빨개져요.", "e": "to be embarrassed"}, "친해지다": {"k": "점점 친구가 돼요.", "e": "to become close (friends)"}, "평가": {"k": "얼마나 잘했는지 보고 점수를 주는 것. 시험도 평가예요.", "e": "evaluation, assessment"}, "포기하다": {"k": "하던 일을 끝까지 안 하고 그만둬요.", "e": "to give up"}, "하필": {"k": "다른 때도 많은데 왜 꼭 지금! (안 좋은 일에 써요)", "e": "of all (times/things)"}, "합격하다": {"k": "시험을 잘 봐서 그 학교에 들어갈 수 있어요. 떨어지다의 반대.", "e": "to pass (an exam), to get accepted"}, "효과": {"k": "무엇을 해서 생기는 좋은 변화.", "e": "effect"}};
// [who, line, marked part, dictionary word, group, English]  groups: help · stop · yay. Lore-checked against notes/story.md:
// 하리 is 1학년 (never in 2학년 3반, first met in 2교시); 구름 2학년 (no 대학); 태식 3학년 (passes later); only the 3학년 boys tease 하리.
const STAGES=[
 {n:'1교시 · 교실',en:'Period 1 · classroom',bg:'#2f4a3b',len:8,quick:7000,host:['오다온','반장으로서 말할게. 다들 잘 봐.','Speaking as class president: everyone, watch closely.'],ev:[
  ['오다온','다온 지우개가 하필 지금 떨어졌어요.','하필','하필','help','Of all times, Daon\'s eraser fell just now.'],
  ['백구름','구름이 나랑 눈이 마주쳐서 당황했어요.','당황했어요','당황하다','help','Gureum\'s eyes met mine and he got flustered.'],
  ['백구름','구름이 당황해서 방송실 구석으로 가요.','당황해서','당황하다','help','Gureum gets flustered and heads to the corner of the broadcast room.'],
  ['남궁찬','찬이 다온 지우개를 일부러 가져갔어요.','일부러','일부러','stop','Chan took Daon\'s eraser on purpose.'],
  ['남궁찬','전학생 얘기가 벌써 다 소문났어요. 찬 때문이에요.','소문났어요','소문나다','stop','The story about the transfer student already got around. It\'s Chan\'s doing.'],
  ['남궁찬','찬이 벌금을 안 내고 도망가요!','벌금을 안 내고','벌금','stop','Chan runs off without paying his fine!'],
  ['남궁찬','찬이 사실대로 말 안 하고 웃기만 해요.','사실대로','사실대로','stop','Chan won\'t say what really happened and just laughs.'],
  ['남궁찬','전학생이랑 찬이 벌써 친해졌어요!','친해졌어요','친해지다','yay','The transfer student and Chan are already close!'],
  ['남궁찬','찬이 바나나우유를 쏜대요!','쏜대요','쏘다','yay','Chan says he\'s treating you to banana milk!'],
  ['백구름','구름이 설레요. 방송부를 다시 할 수 있어요!','설레요','설레다','yay','Gureum is excited. The broadcast club can start again!'],
  ['정 선생님','우리 반은 다 동갑이에요. 금방 친해질 거예요!','동갑','동갑','yay','Our class is all the same age. You\'ll be close in no time!'],
  ['교장','교장 선생님한테 방송부 얘기를 잘 전했어요!','전했어요','전하다','yay','You passed the broadcast club message on to the principal!']]},
 {n:'2교시 · 방송실',en:'Period 2 · broadcast room',bg:'#22262f',len:8,quick:6500,host:['백구름','…방송 시작. 잘 봐.','…Broadcast starting. Watch carefully.'],ev:[
  ['유하리','하리가 마이크 앞에서 긴장했어요.','긴장했어요','긴장하다','help','Hari got nervous in front of the mic.'],
  ['유하리','하리가 얼어 버렸어요!','얼어','얼다','help','Hari froze!'],
  ['','분식집 분위기가 어색해요. 아무도 말을 안 해요.','어색해요','어색하다','help','The mood at the snack bar is awkward. Nobody is talking.'],
  ['유하리','하리가 포기하려고 해요.','포기하려고','포기하다','help','Hari is about to give up.'],
  ['남궁찬','찬이 버스를 놓쳐서 방송에 늦었어요.','놓쳐서','놓치다','help','Chan missed the bus and is late for the broadcast.'],
  ['','3학년 선배들이 하리를 놀려요.','놀려요','놀리다','stop','Some third-years are teasing Hari.'],
  ['','3학년 선배들이 하리를 괴롭혀요.','괴롭혀요','괴롭히다','stop','Some third-years are bullying Hari.'],
  ['남궁찬','찬이 마이크로 계속 장난을 쳐요.','장난','장난','stop','Chan keeps messing around with the mic.'],
  ['오다온','다온이 계속 하리를 재촉해요.','재촉해요','재촉하다','stop','Daon keeps rushing Hari.'],
  ['유하리','하리한테 노래할 기회가 왔어요!','기회','기회','yay','Hari\'s chance to sing has come!'],
  ['','방송 효과가 있어요! 복도가 조용해졌어요.','효과','효과','yay','The broadcast is working! The hallway went quiet.'],
  ['오다온','다온이 하리를 방송실에 데려왔어요!','데려왔어요','데려오다','yay','Daon brought Hari to the broadcast room!'],
  ['','다들 방송을 즐기고 있어요!','즐기고','즐기다','yay','Everyone is enjoying the broadcast!']]},
 {n:'3교시 · 방송실',en:'Period 3 · broadcast room',bg:'#3b3248',len:9,quick:6000,host:['유하리','…오늘은 저도 도울게요.','…Today I\'ll help too.'],ev:[
  ['백구름','구름이 혼자 고민하고 있어요.','고민하고','고민하다','help','Gureum is worrying over something alone.'],
  ['유하리','하리가 사연을 읽기 전에 너무 창피해해요.','창피해해요','창피하다','help','Hari is really embarrassed before reading the story on air.'],
  ['남궁찬','찬이 맞춤법 때문에 너무 답답해해요.','답답해해요','답답하다','help','Chan is really frustrated with spelling.'],
  ['남궁찬','찬이 구름 전화를 듣고 오해했어요.','오해했어요','오해하다','help','Chan overheard Gureum\'s phone call and misunderstood.'],
  ['남궁찬','찬이 독후감을 못 써서 고민해요.','고민해요','고민하다','help','Chan can\'t write his book report and is worrying.'],
  ['남궁찬','찬이 구름 전화를 엿들어요.','엿들어요','엿듣다','stop','Chan is eavesdropping on Gureum\'s phone call.'],
  ['남궁찬','찬이 노래방에서 노래마다 끼어들어요.','끼어들어요','끼어들다','stop','Chan butts into every song at the karaoke room.'],
  ['','학교 SNS에 "방송부 끝났대" 댓글이 많아요.','댓글','댓글','stop','The school social media is full of "the broadcast club is finished" comments.'],
  ['','다섯 명이 다 방송부에 가입했어요!','가입했어요','가입하다','yay','All five have joined the broadcast club!'],
  ['','사연을 듣고 다들 감동했어요.','감동','감동','yay','Everyone was moved by the listener\'s story.'],
  ['','사연 포스터가 게시판에 붙었어요!','붙었어요','붙다','yay','The poster for the stories segment is up on the notice board!'],
  ['남궁찬','찬이 구름한테 사과했어요.','사과했어요','사과하다','yay','Chan apologized to Gureum.'],
  ['','자판기에서 복숭아 주스를 하나 더 뽑았어요!','뽑았어요','뽑다','yay','You got one more peach juice from the vending machine!']]},
 {n:'4교시 · 축제 준비',en:'Period 4 · festival prep',bg:'#2d3f52',len:9,quick:5500,host:['백구름','…다들 꿈이 있지? 나도 있어.','…Everyone has a dream, right? I do too.'],ev:[
  ['백구름','구름이 절박해요. 방송실에서 쫓겨날 것 같아요.','절박해요','절박하다','help','Gureum is desperate. It looks like they\'ll be kicked out of the broadcast room.'],
  ['','우리는 다 생초보라서 회로를 못 고쳐요.','생초보','생초보','help','We\'re all total beginners and can\'t fix the circuit.'],
  ['마태식','태식 선배는 학원 때문에 일정이 너무 빡빡해요.','빡빡해요','빡빡하다','help','Taesik\'s schedule is packed because of cram school.'],
  ['백구름','구름이 부모님이랑 한 약속 때문에 고민해요.','고민해요','고민하다','help','Gureum is worrying about the promise he made his parents.'],
  ['','누가 우리 광고를 다 버렸어요!','광고를 다 버렸어요','광고','stop','Someone threw away all our ads!'],
  ['남궁찬','찬이 약속 시간에 또 늦었어요. 벌금!','또 늦었어요','약속','stop','Chan is late for the meeting time again. Fine!'],
  ['마태식','태식 선배가 대학에 합격했어요!','합격했어요','합격하다','yay','Taesik got into university!'],
  ['교장','교장 선생님이 꿈을 이뤘어요!','이뤘어요','이루다','yay','The principal\'s dream came true!'],
  ['','심화반은 3층 창고로 간대요. 방송실은 그대로!','심화반','심화반','yay','The advanced class is going to the third-floor storeroom. The broadcast room stays!'],
  ['백구름','구름이 평가를 잘 받았어요! 부모님도 좋아해요.','평가를 잘 받았어요','평가','yay','Gureum got a good evaluation! His parents are happy too.'],
  ['','방송부가 목표를 이뤘어요! 축제 생방송 성공!','목표','목표','yay','The broadcast club reached its goal! The festival live broadcast worked!']]},
 {n:'하루 종일',en:'All day',bg:'#4a3a2a',len:10,quick:5000,mix:1,host:['남궁찬','오늘 하루, 끝까지 가 보자!','Let\'s see the whole day through!'],ev:[
  ['남궁찬','찬이 맞춤법 시험에 못 붙었어요.','못 붙었어요','붙다','help','Chan didn\'t pass the spelling test.'],
  ['남궁찬','찬이 아직도 사과를 안 해요.','사과를 안 해요','사과하다','stop','Chan still hasn\'t apologized.'],
  ['유하리','하리가 이제 긴장 안 해요!','긴장 안 해요','긴장하다','yay','Hari doesn\'t get nervous anymore!'],
  ['','3학년 선배들이 이제 하리를 안 놀려요!','안 놀려요','놀리다','yay','The third-years don\'t tease Hari anymore!'],
  ['남궁찬','찬이 다온한테 말할 기회를 또 놓쳤어요.','놓쳤어요','놓치다','help','Chan missed his chance to talk to Daon again.'],
  ['남궁찬','찬이 일부러 구름 방송에 끼어들어요.','일부러','일부러','stop','Chan butts into Gureum\'s broadcast on purpose.'],
  ['마태식','태식 선배가 대학 때문에 고민해요.','고민해요','고민하다','help','Taesik is worrying about university.'],
  ['','이제 아무도 방송부를 무시 안 해요!','무시 안 해요','무시하다','yay','Nobody looks down on the broadcast club anymore!']]},
];

const ACT={help:{ko:'도와주기',sub:'누가 힘들 때',en:'Help: when someone is struggling',ok:'고마워해요!',okE:'They\'re grateful!',c:'var(--help)'},
 stop:{ko:'막기',sub:'누가 나쁜 걸 할 때',en:'Stop it: when someone does something wrong',ok:'그만했어요.',okE:'They stopped.',c:'var(--stop)'},
 yay:{ko:'축하하기',sub:'좋은 일이 생기면',en:'Celebrate: when something good happens',ok:'다 같이 기뻐요!',okE:'Everyone\'s happy!',c:'var(--yay)'}};
const LOOK={'유하리':['#2C3E63','#1F1A1E'],'남궁찬':['#2C3E63','#6B4A2E'],'오다온':['#2C3E63','#2A2024'],'백구름':['#2C3E63','#3B2E2A'],'마태식':['#1E2228','#1C1C1F'],'정 선생님':['#C98F6A','#3A2A28'],'교장':['#7A3E54','#C9C6C2'],'':['#2C3E63','#2b2018']};  // the story bible's uniforms and hair, for anyone this chapter has no portrait of
const KEYP='lab-nunchi';
let P=(()=>{try{return JSON.parse(localStorage.getItem(KEYP))||{done:0,stars:[]}}catch(e){return {done:0,stars:[]}}})();
const save=()=>{try{localStorage.setItem(KEYP,JSON.stringify(P))}catch(e){}};
let S=null,showEn=false,muted=false,raf=0,AC=null,pending=[];
const shuf=a=>{a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[a[i],a[j]]=[a[j],a[i]]}return a};
const esc=x=>String(x).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const en=t=>showEn&&t?`<div class="en">${esc(t)}</div>`:'';
function tone(f,d=.09,type='square',v=.05){if(muted)return;try{AC=AC||new (window.AudioContext||window.webkitAudioContext)();const o=AC.createOscillator(),g=AC.createGain(),t=AC.currentTime;
 o.type=type;o.frequency.setValueAtTime(f,t);g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(g).connect(AC.destination);o.start(t);o.stop(t+d)}catch(e){}}
const sfx={good:()=>{tone(660);setTimeout(()=>tone(880),70)},fast:()=>{tone(660);setTimeout(()=>tone(990),60);setTimeout(()=>tone(1320,.14),120)},bad:()=>tone(150,.2,'sawtooth',.06),
 end:()=>[523,659,784,1046].forEach((f,i)=>setTimeout(()=>tone(f,.16,'triangle',.07),i*120))};
const mk=x=>({who:x[0],ko:x[1],key:x[2],w:x[3],g:x[4],en:x[5]});
function stage(i){const St=STAGES[i];let pool=St.ev.map(mk);if(St.mix)pool=[...pool,...pool,...STAGES.slice(0,i).flatMap(s=>s.ev).map(mk)];  // the whole day: its own lines twice as often, plus everything before
 S={i,St,bag:shuf(pool),pool,left:St.len,pts:0,awk:0,right:0,streak:0,seen:[],cur:null,res:null,phase:'intro',t0:0,def:false};render()}
function next(){if(S.left<=0||S.awk>=3){end();return}
 if(!S.bag.length)S.bag=shuf(S.pool);let e=S.bag.pop();if(S.cur&&e.ko===S.cur.ko&&S.bag.length)e=S.bag.pop();
 S.cur=e;S.res=null;S.def=false;S.phase='read';S.t0=performance.now();S.left--;render();runBar()}
function runBar(){cancelAnimationFrame(raf);const go=()=>{if(!S||S.phase!=='read')return;const left=1-(performance.now()-S.t0)/S.St.quick,b=panelBox().querySelector('.quick i');
 if(b)b.style.width=Math.max(0,left*100)+'%';if(left>0)raf=requestAnimationFrame(go)};raf=requestAnimationFrame(go)}
function choose(g){if(!S||S.phase!=='read')return;const e=S.cur,good=e.g===g,fast=performance.now()-S.t0<S.St.quick;
 if(good){const n=10+(fast?5:0)+Math.min(S.streak,4)*2;S.pts+=n;S.right++;S.streak++;(fast?sfx.fast:sfx.good)();pending.push({good,txt:`마음 +${n}${fast?' 빠르게!':''}`})}
 else{S.awk++;S.streak=0;sfx.bad();pending.push({good,txt:'…어색해졌어요'})}
 if(!S.seen.some(x=>x.ko===e.ko))S.seen.push(e);S.phase='result';S.res={good,pick:g};cancelAnimationFrame(raf);render()}
function end(){const ok=S.awk<3,stars=!ok?0:S.awk===0?3:S.awk===1?2:1;
 if(ok){P.stars[S.i]=Math.max(P.stars[S.i]||0,stars);if(S.i+1>P.done)P.done=S.i+1;save();sfx.end()}S.phase='end';S.stars=stars;render()}
const marked=e=>esc(e.ko).replace(esc(e.key),`<mark>${esc(e.key)}</mark>`);
const glyph={help:'<svg class="glyph" viewBox="0 0 30 30" aria-hidden="true"><path d="M15 25s-9-5.5-9-12a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 6.5-9 12-9 12z" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linejoin="round"/></svg>',
 stop:'<svg class="glyph" viewBox="0 0 30 30" aria-hidden="true"><path d="M10 15V7a2 2 0 0 1 4 0v6M14 13V5a2 2 0 0 1 4 0v8M18 13V7a2 2 0 0 1 4 0v9c0 5-3 9-8 9s-7-3-9-7l-1-3a2 2 0 0 1 3-1l3 3" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
 yay:'<svg class="glyph" viewBox="0 0 30 30" aria-hidden="true"><path d="M15 3l3.2 7 7.6.8-5.7 5.1 1.7 7.5L15 19.6 8.2 23.4l1.7-7.5L4.2 10.8l7.6-.8z" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round"/></svg>'};
const defBox=e=>{const d=DICT[e.w];return d?`<div class="def" style="--c:${ACT[e.g].c}"><b>${esc(e.w)}</b> · ${esc(d.k)}${showEn?`<div class="en">${esc(d.e)}</div>`:''}</div>`:''};
function scene(){const e=S.cur,[shirt,hair]=LOOK[e&&e.who]||LOOK[''];
 return `<div class="scene" style="--sbg:${S.St.bg}"><span class="place">${esc(S.St.n)}</span><div class="pts"><small>친구 마음</small><b>${S.pts}</b></div>
  <div class="awk">어색 ${[0,1,2].map(i=>`<i class="${S.awk>i?'on':''}"></i>`).join('')}</div><div class="floor"></div>
  ${e&&S.phase!=='end'?(lookOf(e.who)?`<div class="who nunface"><span class="name">${esc(short(e.who))}</span><canvas width="48" height="48" aria-hidden="true"></canvas></div>`
   :`<div class="who" style="--shirt:${shirt};--hair:${hair}"><span class="name">${esc(short(e.who)||'친구')}</span><div class="h"></div><div class="b"></div><div class="l"></div></div>`):''}</div>`}
const SHORT={'유하리':'하리','남궁찬':'찬','오다온':'다온','백구름':'구름','마태식':'태식','정 선생님':'정 선생님','교장':'교장 선생님'};
const short=w=>SHORT[w]||w;
function lookOf(who){if(!who||typeof drawPortrait!=='function'||typeof lookFor!=='function')return null;try{return lookFor(who==='교장'?'한복순 교장 선생님':who)||null}catch(e){return null}}
function faces(){const c=panelBox().querySelector('.who.nunface canvas');const L=c&&lookOf(S.cur&&S.cur.who);if(L)try{drawPortrait(c,L,S.res?(S.res.good?'happy':'sad'):'think',false)}catch(e){}}
function playFx(){const b=panelBox().querySelector('.scene');if(!b)return;for(const p of pending){const d=document.createElement('div');d.className='pop'+(p.good?'':' bad');d.textContent=p.txt;b.appendChild(d);setTimeout(()=>d.remove(),900);
  b.querySelector('.who')?.classList.add(p.good?'happy':'sad')}pending=[]}
function render(){const A=panelBox();
 const top=`<div class="top"><h1>눈치 있게!</h1><div class="icons"><button class="ib" id="nun-snd" type="button" aria-pressed="${!muted}" aria-label="소리">♪</button><button class="ib" id="nun-enBtn" type="button" aria-pressed="${showEn}" aria-label="English">?</button><button class="ib" id="nun-close" type="button">닫기</button></div></div>
  <div class="path">${STAGES.map((s,i)=>`<span class="${S&&S.i===i?'now':''}${(P.stars[i]||0)>0?' won':''}">${esc(s.n.split(' · ')[0])}</span>`).join('')}</div>`;
 const legend=`<div class="learned">${Object.entries(ACT).map(([g,a])=>`<div style="--c:${a.c}"><b>${a.ko} · ${esc(a.sub)}</b>${en(a.en)}</div>`).join('')}</div>`;
 if(!S){A.innerHTML=top+`<div class="card"><h2>오늘 무슨 일이?</h2><div>학교에서 무슨 일이 생기면, 읽고 골라요.</div>${en('Something happens at school: read it and choose.')}${legend}
   <button class="btn" id="nun-startB" type="button">${P.done>0&&P.done<STAGES.length?`다음: ${esc(STAGES[P.done].n)}`:'시작'}</button>${P.done>0?'<button class="ib" id="nun-resetB" type="button">처음부터</button>':''}</div>`;hook();return}
 const St=S.St;
 if(S.phase==='intro'){A.innerHTML=top+scene()+`<div class="card"><h2>${esc(St.n)}</h2><div>${esc(St.host[0])}: "${esc(St.host[1])}"</div>${en(St.host[2])}
   <div class="note">${St.len}가지 일 · 어색 세 번이면 끝${St.mix?' · 못, 안도 잘 읽어요!':''}</div>${en(`${St.len} things · three awkward moments and it\'s over${St.mix?' · watch for 못 and 안!':''}`)}<button class="btn" id="nun-goB" type="button">가자!</button></div>`;hook();return}
 if(S.phase==='end'){const ok=S.awk<3,last=S.i===STAGES.length-1;
  A.innerHTML=top+scene()+`<div class="card"><h2>${ok?'잘했어요!':'어색해졌어요…'}</h2>${ok?`<div class="stars">${'★'.repeat(S.stars)}${'☆'.repeat(3-S.stars)}</div>`:''}<div>친구 마음 ${S.pts} · ${S.right}번 잘 읽었어요</div>
   <div class="learned">${Object.entries(ACT).map(([g,a])=>{const xs=S.seen.filter(e=>e.g===g);return xs.length?`<div style="--c:${a.c}"><b>${a.ko}</b>${xs.map(marked).join('<br>')}</div>`:''}).join('')}</div>
   <button class="btn" id="nun-nextB" type="button">${ok?(last?'처음으로':`다음: ${esc(STAGES[S.i+1].n)}`):'다시'}</button></div>`;hook();faces();playFx();return}
 const e=S.cur,reading=S.phase==='read';
 const evh=`<div class="ev"><span class="tag">${reading?`남은 일 ${S.left+1}개`:'방금'}</span><div class="ko">${reading?esc(e.ko):marked(e)}</div>${en(e.en)}${reading?'<div class="quick"><i></i></div>':''}</div>`;
 const moves=`<div class="moves" role="group" aria-label="내가 할 일">${Object.entries(ACT).map(([g,a])=>`<button class="mv" style="--c:${a.c}" type="button" data-g="${g}" ${reading?'':'disabled'}>${glyph[g]}<b>${a.ko}</b><small>${esc(a.sub)}</small>${en(a.en)}</button>`).join('')}</div>`;
 if(reading){A.innerHTML=top+scene()+evh+moves+`<div class="row"><span class="note">${S.streak>1?`연속 ${S.streak}번!`:'빨리 읽으면 마음이 더 와요'}</span><span></span></div>`;hook();faces();playFx();runBar();return}
 const r=S.res,a=ACT[e.g];
 A.innerHTML=top+scene()+evh+`<div class="res ${r.good?'good':'bad'}"><h2>${r.good?`${a.ko}! ${esc(a.ok)}`:`아쉬워요. 여기는 ${a.ko}`}</h2>${r.good?en(a.okE):''}
  ${!r.good||S.def?defBox(e):`<button class="wbtn" id="nun-defBtn" type="button">「${esc(e.w)}」 뜻 보기</button>`}</div>
  <div class="row"><span class="note">${S.awk?`어색 ${S.awk}/3`:''}</span><button class="btn" id="nun-go" type="button">${S.left<=0||S.awk>=3?'끝':'다음'}</button></div>`;hook();faces();playFx();document.getElementById('nun-go').focus({preventScroll:true})}
function hook(){const q=id=>document.getElementById(id);
 q('nun-close').onclick=closeLab;
 q('nun-enBtn').onclick=()=>{showEn=!showEn;render()};q('nun-snd').onclick=()=>{muted=!muted;render()};
 if(q('nun-startB'))q('nun-startB').onclick=()=>stage(Math.min(P.done,STAGES.length-1));
 if(q('nun-resetB'))q('nun-resetB').onclick=()=>{P={done:0,stars:[]};save();render()};
 if(q('nun-goB'))q('nun-goB').onclick=next;if(q('nun-go'))q('nun-go').onclick=next;
 if(q('nun-nextB'))q('nun-nextB').onclick=()=>{if(S.awk<3){if(S.i===STAGES.length-1){S=null;render()}else stage(S.i+1)}else stage(S.i)};
 if(q('nun-defBtn'))q('nun-defBtn').onclick=()=>{S.def=true;render()};
 panelBox().querySelectorAll('.mv:not(:disabled)').forEach(b=>b.onclick=()=>choose(b.dataset.g))}


LAB.start=()=>{css();window.__labActive=ID;S=null;render()};  // the engine brings it back after a reload while it's on
LAB.state=()=>S;LAB.choose=g=>choose(g);LAB.next=()=>next();LAB.stage=i=>stage(i);  // for tests
WALK_LABS[ID]=LAB;
})();

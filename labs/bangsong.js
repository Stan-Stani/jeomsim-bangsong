/* 실험 · 방송부 활동 (2교시): a replayable after-story run in the real school, tried out before it belongs to the game.
   Loaded only from 설정 · 개발 or ?lab=bangsong (walk-engine's lab loader); never part of index.html. Taking it out = deleting
   this file and its labs.json entry.
   A run: 구름 asks for things one by one (generated fresh every run: colours, tape labels, battery counts, whose name tag, which
   room). They sit in real furniture in four rooms (방송실, 교무실, 2학년 3반, 음악실): face it and press A to look inside, pick by
   how things look, carry them back and hand them over. Then the mixer or the mic: three listener 사연 on air, picked by the
   words seen least, a choice each, the booth's reaction and the listener count, and after the show the school reacts.
   It runs in 2교시's replay save from the end of its story (the last 장면), so the real save is never touched. While a run is
   on it wraps facing() (its places) and talkWith() (구름); everything else is the game as it is. */
(()=>{
const LAB={},en=(ko,e)=>{(window.LINES_EN=window.LINES_EN||{})[plain(ko)]=e};
/* ===== data ===== */
const PLACES={
 rack:{zone:'bcast',tile:'rack',name:'방송실 선반',en:'the broadcast-room shelf'},
 sayeon:{zone:'bcast',tile:'sayeon',name:'사연함',en:'the story box'},
 cart:{zone:'bcast',tile:'tapeCart',name:'테이프 수레',en:'the tape cart'},
 boxes:{zone:'bcast',tile:'boxes',name:'방송실 상자',en:'the boxes in the broadcast room'},
 cabinet:{zone:'hall',tile:'cabinet',name:'교무실 캐비닛',en:'the staff-room cabinet'},
 tdesk:{zone:'class',tile:'tdesk',name:'교탁',en:'the teacher\'s desk in our class'},
 lockers:{zone:'class',tile:'lockers',name:'사물함',en:'the lockers in our class'},
 mshelf:{zone:'music',tile:'mShelf',name:'음악실 선반',en:'the music-room shelf'},
};
const COLORS=[['파란색','#3f7fd6','blue'],['빨간색','#d0503f','red'],['초록색','#4aa66a','green'],['노란색','#e0b93a','yellow'],['검은색','#2b2f38','black'],['흰색','#e9e9e6','white']];
const LABELS=[['박수','applause'],['웃음','laughter'],['종소리','bell'],['환호','cheering'],['빗소리','rain'],['발소리','footsteps']];
const COUNTS=[[2,'두','two'],[3,'세','three'],[4,'네','four']];
const PEOPLE=[['하리','유하리','Hari'],['다온','오다온','Daon'],['찬','남궁찬','Chan']];
const LEADS=[['다온이가 빨리 하라고 재촉해서… ','Daon keeps hurrying me, so… '],['방송 타이밍 놓치면 안 돼서… ','We can\'t miss the broadcast timing, so… '],['나 지금 좀 긴장했어… ','I\'m kind of nervous right now… '],['','']];
const FROM=['익명','1학년','2학년 1반','2학년 5반','3학년','비밀 청취자'];
const POOL=[
 {words:['긴장하다','심장','포기하다'],ko:'내일 영어 발표가 있는데 너무 긴장돼요. 심장이 계속 쿵쿵 뛰어요. 그냥 포기할까요?',en:'I have an English presentation tomorrow and I\'m so nervous. My heart keeps pounding. Should I just give up?',
  opts:[{kind:'곡',ko:'「달려라」 + "긴장해도 괜찮아요. 포기하지 마요!"',d:15,who:'유하리',r:['좋다… 나도 음악실에서 얼었었는데. 이 곡 들으면 힘날 거야.','Nice… I froze in the music room too. This song will cheer them up.']},
   {kind:'곡',ko:'「마지막 인사」 — 조용한 이별 노래',d:-10,who:'백구름',r:['분위기가… 좀 어색해졌어. 발표 전에 이별 노래는…','The mood got… a bit awkward. A breakup song before a presentation…']},
   {kind:'답장',ko:'"힘들면 포기해도 돼요! 발표 안 해도 괜찮아요."',d:-10,who:'유하리',r:['음… 포기하라고 하면 안 되지 않아?','Hmm… shouldn\'t we not tell them to give up?']}]},
 {words:['명찰','놀리다','장난','괴롭히다'],ko:'체육관에서 친구들이 제 명찰을 숨기고 놀려요. 매일요. 친구들은 그냥 장난이래요.',en:'In the gym my friends hide my name tag and make fun of me. Every day. They say it\'s just a joke.',
  opts:[{kind:'곡',ko:'웃음 효과음 + "ㅋㅋ 장난이 좀 심하네요!"',d:-20,who:'백구름',r:['이건… 웃을 일이 아니야. 매일이면 괴롭히는 거잖아.','This… isn\'t something to laugh at. Every day — that\'s bullying.'],flag:'mocked'},
   {kind:'답장',ko:'"매일 그러면 장난이 아니에요. 괴롭히는 거예요. 선생님께 꼭 말해요."',d:20,who:'유하리',r:['맞아. 장난이랑 괴롭히는 건 달라.','Right. A joke and bullying are different.'],flag:'helped'},
   {kind:'보류',ko:'방송에 안 내보내기',d:0,who:'백구름',r:['음… 근데 이 사연은 누가 들어 줘야 할 것 같아.','Hmm… but I feel like someone should hear this one.']}]},
 {words:['장난','놀리다','곡'],ko:'짝꿍이 제 필통에 개구리 장난감을 넣었어요. 깜짝 놀랐는데 둘 다 웃었어요 ㅋㅋ 짝꿍한테 신나는 곡 하나 보내요!',en:'My deskmate put a toy frog in my pencil case. I was startled, but we both laughed lol. Sending my deskmate an upbeat song!',
  opts:[{kind:'곡',ko:'「여름 교실」 + "둘 다 웃었으면 됐죠!"',d:15,who:'유하리',r:['ㅋㅋ 이건 진짜 장난이네. 귀엽다.','Haha, this one really is a joke. Cute.']},
   {kind:'답장',ko:'"그건 괴롭히는 거예요! 선생님께 말해요."',d:-10,who:'백구름',r:['어…? 둘 다 웃었다고 했는데… 이건 그냥 장난 같아.','Huh…? They said they both laughed… this seems like just a joke.']},
   {kind:'보류',ko:'방송에 안 내보내기',d:-5,who:'백구름',r:['곡 신청인데… 틀어 줘도 됐을 것 같아.','It was a song request… we could have played it.']}]},
 {words:['곡','타이밍','놓치다','연락처'],ko:'하리 선배 노래 한 곡 더 듣고 싶어요! 지난번엔 타이밍을 놓쳐서 못 들었어요. 그리고 선배 연락처도 알려 주세요!!',en:'I want to hear one more song from Hari! Last time I missed my timing and couldn\'t hear it. And please tell me her contact info too!!',
  opts:[{kind:'곡',ko:'하리의 곡 틀기 + "연락처는 비밀이에요!"',d:15,who:'유하리',r:['…한 곡만이야. 진짜 한 곡만.','…just one song. Really, just one.'],flag:'hariSong'},
   {kind:'곡',ko:'하리의 곡 틀기 + 연락처 읽어 주기',d:-25,who:'유하리',r:['뭐?! 내 번호를 방송에서…?! 구름아, 마이크 꺼!','What?! My number on air…?! Gureum, turn off the mic!'],flag:'leaked'},
   {kind:'보류',ko:'방송에 안 내보내기',d:-5,who:'백구름',r:['듣고 싶어 하는 사람이 많은데… 곡은 틀어도 됐을 것 같아.','Lots of people want to hear it… we could have played the song.']}]},
 {words:['장난'],ko:'속보!! 내일 교장 선생님이 학교 쉰대요!! 다 같이 집에 가요 ㅋㅋㅋ — 진짜임',en:'Breaking news!! The principal says there\'s no school tomorrow!! Let\'s all go home lol — for real',
  opts:[{kind:'곡',ko:'신나는 곡과 함께 읽어 주기',d:-20,who:'백구름',r:['이거… 장난 사연이야. 교장 선생님한테 혼나…','This… is a prank letter. We\'ll get scolded by the principal…'],flag:'prank'},
   {kind:'보류',ko:'방송에 안 내보내기',d:10,who:'백구름',r:['응. 확인 안 된 건 안 읽어. 잘했어.','Yeah. We don\'t read unconfirmed stuff. Good call.']},
   {kind:'답장',ko:'"내일 학교 쉰대요! 다들 축하해요!"',d:-25,who:'유하리',r:['어…? 그거 진짜야? 아무도 그런 말 안 했는데.','Huh…? Is that real? Nobody said that.'],flag:'prank'}]},
 {words:['분위기','어색하다','즐기다','곡'],ko:'점심시간에 반 분위기가 너무 어색해요. 다 같이 즐길 수 있는 곡 틀어 주세요!',en:'The mood in our class at lunch is so awkward. Please play a song we can all enjoy!',
  opts:[{kind:'곡',ko:'「여름 교실」 — 다 같이 아는 신나는 곡',d:15,who:'유하리',r:['이건 다 따라 부를 거야. 분위기 확 바뀌겠다.','Everyone will sing along to this. The mood will totally change.']},
   {kind:'곡',ko:'「빗소리」 — 조용한 피아노 곡',d:-5,who:'백구름',r:['분위기가… 더 조용해졌어.','The mood got… even quieter.']},
   {kind:'곡',ko:'종소리 효과음만 세 번',d:-10,who:'백구름',r:['…종소리는 방송 끝날 때 쓰는 거야.','…the bell is for the end of the broadcast.']}]},
 {words:['얼다','긴장하다','기회'],ko:'어제 노래 대회에서 너무 긴장해서 무대 위에서 얼었어요. 한 소절도 못 불렀어요. 다시 할 기회가 있을까요?',en:'Yesterday at the singing contest I was so nervous I froze on stage. I couldn\'t sing a single line. Will I get another chance?',
  opts:[{kind:'답장',ko:'"얼어도 괜찮아요. 기회는 또 와요. 방송부에서 한 곡 불러 볼래요?"',d:15,who:'유하리',r:['…나도 그랬어. 이 사람, 진짜 와도 돼.','…I was the same. This person can really come.'],flag:'invite'},
   {kind:'곡',ko:'「우승의 노래」 + "우승 축하해요!"',d:-15,who:'백구름',r:['어… 이 사람 우승 못 했어. 얼었다고 했잖아.','Uh… this person didn\'t win. They said they froze.']},
   {kind:'보류',ko:'방송에 안 내보내기',d:-5,who:'유하리',r:['이건 읽어 줘도 됐는데…','We could have read this one…']}]},
 {words:['재촉하다','챙기다'],ko:'아침마다 엄마가 빨리 나가라고 재촉해서 맨날 도시락을 못 챙겨요. 점심에 너무 배고파요 ㅠㅠ',en:'Every morning my mom hurries me out the door, so I never manage to bring my lunchbox. I\'m so hungry at lunch ㅠㅠ',
  opts:[{kind:'답장',ko:'"전날 밤에 가방에 미리 챙겨 두면 어때요?"',d:15,who:'백구름',r:['…좋은 방법이다. 나도 그렇게 해.','…that\'s a good way. I do that too.']},
   {kind:'답장',ko:'"엄마 말 듣지 마세요! 천천히 나가요!"',d:-15,who:'백구름',r:['그러면… 지각할 텐데. 다온이가 벌금 걷어.','Then… they\'ll be late. Daon will collect a fine.']},
   {kind:'곡',ko:'「배고파」 — 웃긴 노래',d:5,who:'유하리',r:['ㅋㅋ 웃기긴 한데… 방법도 알려 주지.','Haha, it\'s funny, but… we could have given a tip too.']}]},
 {words:['데려오다','기회'],ko:'다음 주 체육 대회에 동생을 데려와도 돼요? 동생이 축구를 진짜 좋아해서 형들 경기 볼 기회를 주고 싶어요.',en:'Can I bring my little brother to next week\'s sports day? He really loves soccer, so I want to give him a chance to watch the older kids play.',
  opts:[{kind:'답장',ko:'"좋은 기회네요! 담임 선생님께 먼저 물어봐요."',d:10,who:'백구름',r:['응. 학교 일은 선생님한테 묻는 게 맞아.','Yeah. For school things, asking a teacher is right.']},
   {kind:'답장',ko:'"동생은 데려오면 안 돼요. 시끄러워요."',d:-10,who:'유하리',r:['우리가 정할 일은 아닌데…','That\'s not for us to decide…']},
   {kind:'보류',ko:'방송에 안 내보내기',d:-5,who:'백구름',r:['물어본 건데… 답해 줘도 됐을 것 같아.','They asked a question… we could have answered.']}]},
 {words:['효과'],ko:'선배들이 시험 전에 초콜릿 먹으면 직빵이래요. 진짜 효과 있어요?',en:'The older students say eating chocolate before a test works instantly. Does it really have an effect?',
  opts:[{kind:'답장',ko:'"효과는 잘 모르겠어요. 잠을 잘 자는 게 제일 좋대요!"',d:10,who:'백구름',r:['응… 확인 안 된 건 모른다고 하는 게 맞아.','Yeah… saying we don\'t know about unconfirmed things is right.']},
   {kind:'답장',ko:'"네! 초콜릿 열 개 먹으면 백 점이에요!"',d:-15,who:'백구름',r:['그건… 우리가 지어낸 거잖아.','That\'s… something we made up.'],flag:'madeUp'},
   {kind:'곡',ko:'「초콜릿」 — 달콤한 곡',d:0,who:'유하리',r:['노래는 좋은데… 질문에 답은 안 했네.','Nice song… but we didn\'t answer the question.']}]},
 {words:['타이밍','놓치다','기회','어색하다'],ko:'좋아하는 사람한테 고백하고 싶은데 타이밍을 계속 놓쳐요. 어색해질까 봐 무서워요. 이번 축제가 마지막 기회예요!',en:'I want to confess to someone I like, but I keep missing the timing. I\'m scared it\'ll get awkward. This festival is my last chance!',
  opts:[{kind:'곡',ko:'「용기」 + "마지막 기회, 놓치지 마요!"',d:15,who:'유하리',r:['와… 이 사연 반응 좋겠다.','Wow… this letter will get a great response.']},
   {kind:'답장',ko:'"고백하지 마요. 어색해지면 끝이에요."',d:-10,who:'백구름',r:['너무… 차갑다.','That\'s… too cold.']},
   {kind:'보류',ko:'방송에 안 내보내기',d:-5,who:'유하리',r:['이런 사연이 제일 인기 많은데!','These are the most popular letters!']}]},
 {words:['즐기다','포기하다'],ko:'피아노를 10년 쳤는데 요즘 하나도 재미없어요. 그냥 포기하고 싶어요.',en:'I\'ve played piano for 10 years, but lately it\'s no fun at all. I just want to give up.',
  opts:[{kind:'답장',ko:'"잠깐 쉬어도 괜찮아요. 다시 즐길 수 있을 때까지요."',d:15,who:'유하리',r:['…맞아. 즐기지 못하면 쉬어도 돼.','…right. If you can\'t enjoy it, you can rest.']},
   {kind:'답장',ko:'"10년이나 했는데 포기하면 안 돼요! 매일 연습해요!"',d:-5,who:'백구름',r:['…재미없다고 했는데, 더 하라고 하면…','…they said it\'s no fun, and we tell them to do more…']},
   {kind:'곡',ko:'「빗소리」 — 조용한 피아노 곡',d:5,who:'유하리',r:['피아노 곡이라니… 좀 짓궂다 ㅋㅋ','A piano piece… that\'s a bit cheeky haha']}]},
 {words:['심장','긴장하다'],ko:'체육 시간에 조금만 뛰어도 심장이 너무 빨리 뛰고 가슴이 아파요. 긴장해서 그런 걸까요?',en:'In PE, even if I run a little, my heart beats really fast and my chest hurts. Is it because I\'m nervous?',
  opts:[{kind:'답장',ko:'"보건 선생님께 꼭 가 봐요. 무리하지 마요."',d:15,who:'백구름',r:['응. 아픈 건 선생님한테 가야 해.','Yeah. If it hurts, you have to go to a teacher.']},
   {kind:'답장',ko:'"더 많이 뛰면 괜찮아져요!"',d:-15,who:'유하리',r:['가슴이 아프다고 했잖아… 그건 위험해.','They said their chest hurts… that\'s dangerous.']},
   {kind:'곡',ko:'「달려라」 — 힘이 나는 곡',d:-10,who:'백구름',r:['달리면 아프다는데… 「달려라」는 좀…','Running hurts them… and we play "Run"…']}]},
 {words:['명찰','챙기다'],ko:'체육관에서 명찰을 주웠어요. "2학년 4반 김민수"라고 쓰여 있어요. 방송실에 맡길게요!',en:'I found a name tag in the gym. It says "Grade 2 Class 4, Kim Minsu". I\'ll leave it at the broadcast room!',
  opts:[{kind:'답장',ko:'"2학년 4반 김민수 학생, 방송실에서 명찰 챙겨 가세요!"',d:15,who:'백구름',r:['이런 게 진짜 방송부 일이야.','This is real broadcast club work.']},
   {kind:'곡',ko:'신나는 곡만 틀기',d:-5,who:'백구름',r:['…명찰 주인한테 알려 줘야 하는데.','…we needed to tell the owner.']},
   {kind:'보류',ko:'방송에 안 내보내기',d:-10,who:'유하리',r:['그럼 민수는 명찰을 어떻게 찾아?','Then how will Minsu find the name tag?']}]},
 {words:['재촉하다'],ko:'반장이 벌금 내라고 매일 재촉해요 ㅠㅠ 반장 몰래 이 사연 읽어 주세요. 반장, 조금만 봐줘!',en:'Our class president hurries me every day to pay the fine ㅠㅠ Please read this without the president knowing. President, go easy on me a bit!',
  opts:[{kind:'답장',ko:'웃으면서 읽어 주기 + "반장님, 조금만 봐주세요!"',d:10,who:'유하리',r:['ㅋㅋ 다온이 지금 듣고 있을걸.','Haha, Daon is probably listening right now.'],flag:'daon'},
   {kind:'답장',ko:'"벌금은 꼭 내야죠! 규칙은 규칙이에요."',d:-5,who:'백구름',r:['…다온이 말투네.','…that sounds just like Daon.']},
   {kind:'보류',ko:'방송에 안 내보내기',d:-5,who:'유하리',r:['재밌는 사연인데…','It was a fun letter…']}]},
];
const AFTER=[
 {who:'남궁찬',if:'helped',ko:'아까 그 사연 들었어. 체육관 애들, 내가 좀 볼게.',en:'I heard that letter earlier. The kids in the gym — I\'ll keep an eye on them.'},
 {who:'남궁찬',if:'mocked',ko:'야, 아까 웃음소리… 그 사연 쓴 애, 체육관에서 봤어. 웃는 얼굴 아니던데.',en:'Hey, that laughter earlier… I saw the kid who wrote it in the gym. Didn\'t look like they were laughing.'},
 {who:'남궁찬',if:'*',ko:'점심 먹으면서 들었어. 다음엔 내 신청곡도 틀어 줘.',en:'I listened while eating lunch. Play my request next time.'},
 {who:'오다온',if:'prank',ko:'가짜 사연을 방송하면 어떡해! 방송부도 벌금이야.',en:'How could you air a fake letter! The broadcast club gets fined too.'},
 {who:'오다온',if:'daon',ko:'…누가 보낸 거야? 벌금 두 배야.',en:'…who sent that? Double fine.'},
 {who:'오다온',if:'madeUp',ko:'초콜릿 열 개? 1학년들이 매점에 줄 섰어. 너희 때문에.',en:'Ten chocolates? The first-years are lined up at the snack shop. Because of you.'},
 {who:'오다온',if:'*',ko:'오늘 방송 괜찮았어. …진짜 조금.',en:'Today\'s broadcast was okay. …just a little.'},
 {who:'유하리',if:'leaked',ko:'…모르는 번호로 문자가 서른 개 왔어.',en:'…I got thirty texts from unknown numbers.'},
 {who:'유하리',if:'invite',ko:'그 노래 대회 사연… 진짜 방송실에 왔어. 내일 같이 연습하기로 했어.',en:'The singing-contest letter… they really came to the broadcast room. We\'re practising together tomorrow.'},
 {who:'유하리',if:'hariSong',ko:'…다음에 한 곡 더 불러 줄 수도 있어.',en:'…I might sing one more next time.'},
];
/* ===== helpers ===== */
const bat=w=>{const c=w.charCodeAt(w.length-1);return c>=0xAC00&&c<=0xD7A3&&(c-0xAC00)%28!==0};
const J=(w,a,b)=>w+(bat(w)?a:b);
const pick=a=>a[Math.random()*a.length|0],shuf=a=>a.map(x=>[Math.random(),x]).sort((p,q)=>p[0]-q[0]).map(p=>p[1]);
const sw=(c)=>`<i style="display:inline-block;width:13px;height:17px;border-radius:2px 5px 2px 2px;background:${c};vertical-align:-3px;margin-right:6px;box-shadow:inset 0 0 0 1.5px rgba(0,0,0,.35)"></i>`;
function look(it){
 if(it.kind==='file')return sw(it.c)+'파일';
 if(it.kind==='tape')return `테이프 「${it.label}」${it.broken?' <small>(끊어짐)</small>':''}`;
 if(it.kind==='cells')return '🔋'.repeat(it.n)+' 건전지';
 if(it.kind==='phones')return `<i style="display:inline-block;width:15px;height:15px;border-radius:50%;border:4px solid ${it.c};border-bottom-color:transparent;vertical-align:-3px;margin-right:6px;box-sizing:border-box"></i>헤드폰`;
 if(it.kind==='tag')return `명찰 [${it.text}]`;
 if(it.kind==='note')return `쪽지 · ${it.text}`;
}
const whenFree=fn=>{const t=setInterval(()=>{if(!dlg&&!panelOpen()){clearInterval(t);setTimeout(fn,200)}},120)};
const say=(who,ko,e,extra)=>{if(e)en(ko,e);return {who,say:ko,...(extra||{})}};
/* ===== a run ===== */
let R=null;  // {errands, ei, bag, items, phase:'errand'|'air'|'done', show, si, score, flags}
function plan(){
 const items=[];const add=(place,o)=>{const it={id:items.length,place,...o};items.push(it);return it};
 const T={
  file(){const P=pick(['rack','cabinet']),[a,b,c]=shuf(COLORS);const w=add(P,{kind:'file',c:a[1],name:a[0]+' 파일'}),o=add(P,{kind:'file',c:b[1]}),x=add(P,{kind:'file',c:c[1]});
   return {ask:`곡 목록 좀 챙겨 줄래? ${PLACES[P].name}에 있어. ${a[0]} 파일. ${J(b[0],'은','는')} 작년 거라서…`,en:`Could you grab the song list? It's ${PLACES[P].en}. The ${a[2]} file. The ${b[2]} one is last year's…`,
    want:[w],wrong:new Map([[o,[`그건 ${J(b[0],'이잖아','잖아')}… 작년 거야. ${a[0]}!`,`That's the ${b[2]} one… last year's. The ${a[2]} one!`]],[x,[`${J(c[0],'은','는')} 시험지 파일이야…`,`The ${c[2]} one is the exam papers…`]]])}},
  tape(){const P=pick(['cart','boxes']),[a,b,c]=shuf(LABELS);const w=add(P,{kind:'tape',label:a[0]}),o=add(P,{kind:'tape',label:b[0]}),x=add(pick(['cart','boxes']),{kind:'tape',label:c[0]}),br=add(P,{kind:'tape',label:a[0],broken:1});
   return {ask:`효과음 테이프… ${PLACES[P].name}에 라벨이 "${a[0]}"${bat(a[0])?'이라고':'라고'} 쓰인 거. "${b[0]}" 말고. 끊어진 건 빼고.`,en:`The sound-effect tape… on ${PLACES[P].en}, the one labelled "${a[1]}". Not "${b[1]}". Not the snapped one.`,
    want:[w],wrong:new Map([[o,[`이건 ${J(b[0],'이야','야')}… ${J(a[0],'이','가')} 필요해.`,`This is "${b[1]}"… I need "${a[1]}".`]],[x,[`${J(c[0],'은','는')} 다음 주에 쓸 거야.`,`"${c[1]}" is for next week.`]],[br,['아, 그건 끊어졌어… 소리가 안 나.','Ah, that one\'s snapped… it makes no sound.']]])}},
  cells(){const P=pick(['tdesk','boxes']),t=pick(COUNTS.slice(0,2));const w=add(P,{kind:'cells',n:t[0]});const wr=new Map();
   COUNTS.filter(x=>x!==t).forEach(x=>wr.set(add(P,{kind:'cells',n:x[0]}),x[0]>t[0]?[`${x[1]} 개는 너무 많아… ${t[1]} 개만.`,`${x[2]} is too many… just ${t[2]}.`]:[`${x[1]} 개는 모자라… ${t[1]} 개 필요해.`,`${x[2]} isn't enough… I need ${t[2]}.`]));
   return {ask:`건전지… ${PLACES[P].name}에 있는데, ${t[1]} 개짜리만 가져와. 다 가져오면 다음 방송 때 없어.`,en:`Batteries… they're ${PLACES[P].en}; just bring the pack of ${t[2]}. If you bring them all, there won't be any next time.`,want:[w],wrong:wr}},
  phones(){const c=pick(COLORS),[P,Q]=shuf(['rack','mshelf','boxes']);const w=add(P,{kind:'phones',c:c[1]}),b=add(Q,{kind:'phones',c:c[1]});
   return {ask:`헤드폰 좀… ${PLACES[P].name}에 있는 거. ${PLACES[Q].name}에 있는 건 소리가 안 나.`,en:`The headphones… the ones ${PLACES[P].en}. The ones ${PLACES[Q].en} have no sound.`,
    want:[w],wrong:new Map([[b,[`그건 ${PLACES[Q].name}에 있던 거잖아… 소리 안 나.`,`Those were ${PLACES[Q].en}… no sound.`]]])}},
  pair(){const [p,q,r]=shuf(PEOPLE);const tg=add('lockers',{kind:'tag',text:p[1]}),tq=add('lockers',{kind:'tag',text:q[1]}),tr=add('sayeon',{kind:'tag',text:r[1]});
   const nt=add('sayeon',{kind:'note',text:p[0]+' 010-0000-1234'}),ns=add('sayeon',{kind:'note',text:'신청곡: 봄날의 노래'}),nq=add('sayeon',{kind:'note',text:q[0]+' 010-0000-5678'});
   return {ask:`마지막으로… ${p[0]} 명찰이랑 ${p[0]} 연락처 적힌 쪽지. 명찰은 우리 반 사물함에 있대. 쪽지는 사연함에. 신청곡 쪽지 말고.`,en:`Last thing… ${p[2]}'s name tag and the note with ${p[2]}'s contact. The tag is in our class lockers, apparently. The note's in the story box. Not the song-request note.`,
    want:[tg,nt],wrong:new Map([[tq,[`이건 ${q[0]} 명찰이잖아…`,`That's ${q[2]}'s name tag…`]],[tr,['이 명찰은… 아니야. 이름 봐 봐.','This name tag… no. Look at the name.']],[ns,['이건 신청곡이야. 연락처 적힌 거…','This is a song request. The one with the contact…']],[nq,[`이건 ${q[0]} 연락처야… ${p[0]} 거.`,`This is ${q[2]}'s contact… ${p[2]}'s.`]]])}},
 };
 const errands=[...shuf(['file','tape','cells','phones']).slice(0,3),'pair'].map((k,i,a)=>{const e=T[k]();const L=pick(LEADS);
  e.ask=(i===a.length-1?'':L[0])+e.ask;e.en=(i===a.length-1?'':L[1])+e.en;e.got=new Set();e.misses=0;en(e.ask,e.en);return e});
 return {errands,ei:0,bag:[],items,phase:'errand',score:50,flags:new Set(),tries:0,firsts:0};
}
const cur=()=>R&&R.errands[R.ei];
function quest(){if(!R)return null;
 if(R.phase==='errand')return `심부름 ${R.ei+1}/${R.errands.length} · 가방 ${R.bag.length}/3`;
 if(R.phase==='air')return '방송실 · 믹서나 마이크 앞에서 방송 시작';
 return '방송 끝! · 구름한테 한 번 더?'}
function refresh(){try{updateQuest()}catch(e){}}
/* looking inside a place */
function openPlace(key){
 const P=PLACES[key],here=R.items.filter(it=>it.place===key&&!R.bag.includes(it)&&!it.given);
 const first=`${J(P.name,'을','를')} 열어 봤어요.`;en(first,`I looked in ${P.en}.`);
 if(!here.length){openDialog('…',[say('…',`${P.name}… 비어 있어요.`,`${P.en}… it's empty.`)]);return}
 openDialog('…',[{who:'…',say:first,choose:[...here.map(it=>[look(it),()=>take(it)]),['그만 보기',null]]}]);
}
function take(it){
 if(R.bag.length>=3){openDialog('…',[say('…','가방이 꽉 찼어요. 구름한테 먼저 갖다줘요.','The bag is full. Take things to Gureum first.')]);return}
 R.bag.push(it);sfx('item');toast('가방에 넣었어요: '+look(it).replace(/<[^>]+>/g,'').trim());refresh();
}
/* 구름 */
function talkGureum(){
 if(R.phase==='errand'){const E=cur();
  if(!R.bag.length){openDialog('백구름',[say('백구름',E.ask,E.en)]);return}
  openDialog('백구름',[{...say('백구름','가져왔어? 뭐 줄래?','Did you bring it? What will you give me?'),choose:[...R.bag.map(it=>[look(it),()=>give(it)]),['다시 말해 줘',()=>openDialog('백구름',[say('백구름',E.ask,E.en)])],['아직',null]]}]);return}
 if(R.phase==='air'){openDialog('백구름',[say('백구름','준비 끝! 믹서 앞에서 방송 시작하자.','All set! Let\'s start the broadcast at the mixer.')]);return}
 openDialog('백구름',[{...say('백구름','오늘 고마웠어. …한 번 더 할래?','Thanks for today. …want to do it again?'),choose:[['한 번 더',()=>{R=plan();refresh();whenFree(()=>openDialog('백구름',[say('백구름','좋아. 그럼… '+cur().ask,'Okay. Then… '+cur().en)]))}],['나중에',null]]}]);
}
function give(it){
 const E=cur();R.tries++;
 if(E.want.includes(it)&&!E.got.has(it)){E.got.add(it);it.given=1;R.bag=R.bag.filter(x=>x!==it);sfx('ok');
  if(E.got.size<E.want.length){openDialog('백구름',[say('백구름','응, 이거. …하나 더 있어.','Yeah, this. …there\'s one more.')]);refresh();return}
  if(!E.misses)R.firsts++;R.ei++;refresh();
  if(R.ei<R.errands.length){const N=cur();openDialog('백구름',[say('백구름','고마워… 이거 맞아.','Thanks… this is it.'),say('백구름',N.ask,N.en)]);return}
  R.phase='air';R.show=chooseShow();R.si=0;refresh();
  openDialog('백구름',[say('백구름','됐다… 방송 준비 끝. 믹서 앞으로 가자. 오늘 사연은 세 개야.','Done… the broadcast is ready. Let\'s go to the mixer. Three letters today.')]);return}
 E.misses++;const w=E.wrong.get(it)||['어…? 이건 필요 없는데…','Huh…? I don\'t need this…'];
 openDialog('백구름',[say('백구름',w[0],w[1])]);  // it stays in your bag
}
function labCss(){if(document.getElementById('labCss'))return;const st=document.createElement('style');st.id='labCss';
 st.textContent='body.lab-air #choices{grid-template-columns:1fr!important;display:grid}body.lab-air #choices .choice{width:100%!important;max-width:none!important;text-align:left!important;font-size:.92rem;padding:8px 12px;line-height:1.45}';document.head.appendChild(st)}
/* on air */
const SEEN='jbl-seen-words';
const seen=()=>{try{return JSON.parse(localStorage.getItem(SEEN)||'{}')||{}}catch(e){return {}}};
function chooseShow(){const s=seen();return POOL.map(p=>[p.words.reduce((a,w)=>a+1/(1+(s[w]||0)),0)+Math.random()*.6,p]).sort((a,b)=>b[0]-a[0]).slice(0,3).map(x=>x[1])}
function onAir(){
 if(R.si===0){sfx('bell');toast('ON AIR · 청취자 반응 '+R.score)}
 const S=R.show[R.si];en(S.ko,S.en);
 document.body.classList.add('lab-air');labCss();  // on air: long answers, one per row
 openDialog('사연',[{who:'사연 · '+pick(FROM),say:S.ko},{...say(T('나'),'…어떻게 할까?','…what should I do?'),choose:shuf(S.opts).map(o=>[`<b>${o.kind}</b> · ${o.ko}`,()=>react(S,o)])}]);
}
function react(S,o){
 R.score=Math.max(0,Math.min(100,R.score+o.d));if(o.flag)R.flags.add(o.flag);
 try{const s=seen();S.words.forEach(w=>s[w]=(s[w]||0)+1);localStorage.setItem(SEEN,JSON.stringify(s))}catch(e){}
 openDialog(o.who,[say(o.who,o.r[0],o.r[1])]);toast(`청취자 반응 ${o.d>0?'+':''}${o.d} → ${R.score}`);
 whenFree(()=>{R.si++;if(R.si<R.show.length)onAir();else afterShow()});
}
function afterShow(){
 document.body.classList.remove('lab-air');R.phase='done';refresh();sfx('star');
 const v=R.score>=80?['전교가 들었어! 내일도 하자.','The whole school was listening! Let\'s do it again tomorrow.']:R.score>=55?['괜찮은 방송이었어.','It was a decent broadcast.']:R.score>=35?['…다음엔 사연을 더 잘 읽어 보자.','…next time let\'s read the letters more carefully.']:['…방송실 문 잠그고 숨자.','…let\'s lock the broadcast room door and hide.'];
 const said=new Set(),lines=AFTER.filter(a=>{if(said.has(a.who))return false;if(a.if==='*'||R.flags.has(a.if)){said.add(a.who);return true}return false});
 openDialog('방송 끝',[say('백구름',`OFF AIR. 청취자 반응 ${R.score}. `+v[0],`OFF AIR. Listener response ${R.score}. `+v[1]),
  say('…',`심부름 ${R.errands.length}개 중 한 번에 ${R.firsts}개.`,`${R.firsts} of ${R.errands.length} errands right first time.`),
  ...lines.map(a=>say(a.who,a.ko,a.en))]);
}
/* ===== hooking in (only while a run is on, in 2교시's replay) ===== */
const on=()=>!!R&&!!RP&&CH&&CH.id==='ch2'&&(window.__labActive||'bangsong')==='bangsong';  // one lab at a time
const facing0=window.facing,talk0=window.talkWith,open0=window.openDialog;
facing=function(){  // a lab place (or the mixer, once it's time) is something to press A at, like a spot
 if(on()){const [dx,dy]=D[player.dir],L=Z.legend[at(player.x+dx,player.y+dy)]||{};
  const key=Object.keys(PLACES).find(k=>PLACES[k].zone===ZID&&PLACES[k].tile===L.tile);
  if(key&&R.phase==='errand')return {spot:{steps:[{lab:'place:'+key}]}};
  if(ZID==='bcast'&&(L.tile==='mixer'||L.tile==='micStand')&&R.phase==='air')return {spot:{steps:[{lab:'air'}]}}}
 return facing0();
};
openDialog=function(name,steps,opts){  // interact() opens a spot's steps: a lab step opens the lab's own instead
 const l=steps&&steps.length===1&&steps[0]&&steps[0].lab;
 if(l&&on())return l==='air'?onAir():openPlace(l.slice(6));
 return open0(name,steps,opts);
};
talkWith=function(n){if(on()&&n&&n.name==='백구름')return talkGureum();return talk0(n)};
LAB.start=()=>{
 const go=()=>{
  loadCps().then(all=>{const L=(all||{}).ch2||[];const at=L[L.length-1];
   if(!at){toast('2교시 장면이 없어요.');return}
   boot('ch2',{force:1,at});window.__labActive='bangsong';R=plan();
   const q0=C.questText;C.questText=()=>on()?quest():q0();
   setTimeout(()=>{loadZone('bcast',5,4,'up');refresh();
    openDialog('백구름',[say('백구름','어, 왔어? 오늘 방송 준비 좀 도와줄래? 내가 하나씩 말할게.','Oh, you\'re here? Could you help me get today\'s broadcast ready? I\'ll tell you one thing at a time.'),say('백구름',cur().ask,cur().en)])},500)});
 };
 go();
};
LAB.state=()=>R;  // for tests
WALK_LABS.bangsong=LAB;
})();

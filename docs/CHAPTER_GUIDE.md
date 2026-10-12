# Writing a chapter of 점심 방송

Read first: `CLAUDE.md`, `notes/story.md` (the story bible: cast, chapters, word lists), the header of `src/school.js` (the one
school every 교시 is set in), and an existing 교시 to copy its shape (`src/chapters/ch4.js` uses the most features).
Everything a step or a person can do is listed in the walk-engine README (`../walk-engine/README.md`); this guide covers what a
교시 needs.
You write `src/chapters/chN.js` and `tests/walk/chN.js`, plus definitions for new words in `lexicon/defs.json` and, once the 교시
is translated, its lines' English in `src/lines-en.json`. Never edit `engine.js` (generated) or `index.html` (built). `school.js`
is shared by every 교시: change it only on purpose, never to fit one 교시. If you need an engine feature, stop and report it.

## The learner (design for this person)
- Rusty intermediate Korean (~TOPIK 3). Reads Hangul fluently. Comprehension > production.
- **Korean only** in dialogue, in short simple sentences. English appears only behind a tap: `DICT[...].e` for a word, and the
  whole line's English (`src/lines-en.json`) behind the ? by the speaker.
- Plays on a phone. **No instruction text** ("press A", "go here"): the world explains itself. Locked doors say why, people point
  the way, and the 목표 line (`questText`) names the place + task in a few Korean words.
- Other learners play it too: aids are opt-in, and notes are written for common difficulties, not one person's.
- Known words/grammar: see the list below. Use known words freely around the new ones.
- Typical learner mix-ups make the best wrong options: 상대/상태, 짓다/짖다/지다 (지을↔질), 돌려주다/돌아가다, 받다/맞다, 견디다/참다.
- Sino-Korean links to known words help (`hj` field): e.g. 심화반 ↔ 반장, 합격 ↔ 조합.
- Every wrong option needs a gentle 1–2 sentence Korean explanation that shows the right form, in the speaker's own register.

Known words (selection): 집 학교 도서관 경기장 도장 연구소 카페 사람 선생님 박사 친구 상대 심판 관중 선수 강아지 고양이 배지 기술 공격 방어 상태 회복
시합 경기 규칙 연습 공부 단어 문장 사전 질문 연구 책 핸드폰 의자 탁자 침대 문 주머니 병 열쇠 가방 나무 연못 음식 과일 밥 커피 간식 빨래 반납 연체료
조합 구현 세계 이야기 건강 경고 의견 시간 주말 내일 오늘 처음 마지막 눕다 자다 떨어지다 떨어뜨리다 놓다 넣다 두다 들다 물다 따르다 지키다 빌리다 돌려주다
돌아가다 참다 견디다 개선하다 고치다 어울리다 짓다 짖다 이기다 지다 싸우다 가르치다 배우다 만들다 먹다 낫다 만지다 받다 이해하다 설명하다 저장하다 기억하다
추천하다 결정하다 구경하다 모으다 읽다 피곤하다 강하다 작다 크다 복잡하다 다양하다 자연스럽다 헷갈리다 아프다 무겁다 춥다 맛있다 중립적 어리다 늙다.
Plus every word taught in earlier 교시 (they may appear in dialogue, as distractors and in review lines; never re-taught as badges).
Grammar they use: 해요체, particles, -(으)ㄹ 거예요, -(으)ㄹ 것 같다, -아/어야 돼요, -(으)ㄹ 수 있다, -고 싶다, -(으)ㄴ 적 있다, -(으)면, -지만, -는데, -아/어서, -(으)ㄹ 때, -아/어 주세요.

## Story rules
- The story, cast and places are original and live in `notes/story.md`; follow it. Nothing from the webtoon the words came from (no names, scenes or plot).
- Tone: warm slice-of-life school story with humor; age-appropriate (crushes in the background are fine, nothing sexual); mild teen slang is fine.
- Speech: teachers/adults 해요체 (or 합쇼체 for announcements), friends 반말, younger→older students 해요체.
- Use your 교시's "weave" words from `notes/story.md` naturally in dialogue: they are tappable for a definition even when they aren't badges.

## Shape of a chapter file
```js
CHAPTERS.push({id:'ch5',n:'5교시',title:'…',place:'방송실 · …',words:20,save:'banghu-ch5',color:'#…',  // save keys keep the old banghu- prefix
 migrate:st=>{…},                                         // only when a later change would break existing saves
 start:{zone:'…',x:…,y:…,dir:'down'},introWho:'…',
 make:()=>{
  /* 5교시 · … — story: notes/story.md (5교시). What happened before, and this 교시's plot in a few lines. */
  const WORDS=[…the 20 words from notes/story.md…];
  const DICT={ word:{k:'Korean definition',e:'English',ex:'예문',hj:'漢字 · link to a known word'}, gloss:{k,e} … };
  const CONFUSE={word:['sound-alike','sound-alike']};   // wrong options for listening questions
  const BANK=[ {w,ask,opts}… ];                          // generic example sentences: what the 복습 노트 asks (≥1 per word)
  const Q={ npcKey:[ {w,ask:'… ___ …',opts:[['right',1],['wrong',0,'why, in Korean']]} … ] };  // the teaching questions
  const CLASS={ part:{say,lines:[{w,who,ask,opts}]} };   // optional: practice while time passes (see Review)
  const REVIEW=[ {w,by,ask,opts,pre?,when?} … ];         // in-character review lines (see Review)
  const ITEMS={'item name':'description'};
  const f=()=>state.f; const hasItem=i=>state.items.includes(i);
  const ZONES={...SCHOOL({open:[…],gate:{…},zones:{…}}), town:{…} };  // the school's rooms, plus places outside it
  const NPC={ key:{name,zone,x,y,dir,look,badge,after,talk:()=>[…],script?,again?,status?,pos?,hide?,chat?} };
  const FOLLOW=null | {name,look,when:()=>bool,talk:()=>[…]};
  const INTRO=[{who,say}…]; const DONE=[{expand:()=>wrapUp()},…];
  function questText(){ … return 'place · task'; }
  const VARIANTS={…};                                     // school tiles drawn differently in this 교시, one comment each: why
  const TILES={...SCHOOL_TILES,...VARIANTS, myTile:(X,Y,x,y,t)=>{…}};  // tiles for places outside the school
  const PLAYER=LOOK.player;
  const term={name:'복습 노트북',…};                      // optional: the review spot's name and lines in this 교시
  return {WORDS,DICT,CONFUSE,BANK,Q,REVIEW,CLASS,ITEMS,ZONES,NPC,FOLLOW,INTRO,DONE,questText,TILES,VARIANTS,PLAYER,term};
 }});
```

### Dialogue steps
`{say}` · `{ask:'… ___ …',opts:[[text,1],[text,0,'why']],w}` · `{build:['어절','어절',…],w}` (tap words in order; 3–5 pieces).
Add to any step: `award:[words]` (adds to the 단어 일지; put it on the LAST step of a talk), `give:'item'`, `take:['item']`,
`set:()=>{f().flag=1}`, `who:'speaker'`, `face:'happy'|'sad'|'think'|'surprised'` (the portrait), `when:()=>bool` (skip if false),
`culture:'id'` / `grammar:'id'` (unlock a 문화 노트 / 문법 노트), `finale:1` (on the very last line of the 교시). Walking, turning,
sitting, the phone screen, black time cuts, camera moves and choices are in the walk-engine README.
Gloss markup inside text: `{shown text|DICT key}`, for non-badge words a learner may not know.
Every `ask` and `build` needs `w` (the word it practises). A question that quotes its own scene gets `scene:1` (review never asks it);
one that tests a grammar pattern rather than the word gets `gram:1`.

## Review: people ask in their own words
Review is spaced repetition, and it happens in the story. When a word is due, someone who would naturally say it gets a ? and asks
it in their own voice, about what is going on right then: a classmate in the 1층 hall uses 기회 about the 방송부 poster, another
uses 얼다 about freezing at the mic, 찬 uses 장난 in the 체육관. The answer grades the word. With nothing due, the same
people say those lines as plain talk, the word filled in. The 복습 노트 is the one place that asks the generic `BANK` sentences.

Write these lines in `REVIEW`; they are most of a 교시's review (1교시 has 68, 2교시 107, 3교시 125, 4교시 145):
```js
{w:'벌금',by:'daonSeat',ask:'내일 또 늦으면? 당연히 ___ 오백 원이야.',opts:[['벌금',1],['용돈',0,'용돈은 부모님이 주는 돈이야. 늦으면 내는 건 "벌금".']]},
{w:'반장',by:'jung',pre:['아, 가기 전에 하나만요.'],ask:'내일 늦으면 ___이 또 벌금 걷어요. 하하.',opts:[…]},
{w:'하필',by:'daonSeat',when:()=>!!f().done,ask:'근데 왜 ___ 오늘이야? 네 첫날에.',opts:[…]},
```
- `by`: the NPC key, the character's name (any NPC with that name, e.g. the same person in two rooms), or a list.
- `when`: the moment the line is true (after a scene, before the ending). A line must never mention something that hasn't
  happened yet, or someone who has left. `pre`: lines they say first. `who:'나'`: the player finishes their own sentence.
- Give every word lines from several people across the 교시's moments, so it comes back in different scenes.
- Bring back earlier 교시's words too (progress carries across 교시): 2교시 has 40 such lines, 3교시 61, 4교시 85.
- Wrong options and their explanations are in the speaker's register (반말 between friends) and stay in the scene.
- The engine paces it: someone still teaching teaches first, the first talk with anyone is never a review, and each person asks at
  most once per story beat, so a cast of people with lines matters more than many lines from one person.
- Time passing: `CLASS` parts with `{expand:()=>classTime(CLASS,['수학','국어'])}` narrate a beat (a class, a walk) and have someone
  ask a line with a learned word. `{expand:()=>wrapUp()}` at the start of `DONE` gives one last round before the ending.
- People who quiz you on purpose (매점 이모, 경비 아저씨, 분식집 아저씨) use `quizLine` from `school.js`: their own `REVIEW` line first.

## People
People use the humanoid generator: `look:{hair,skin,shirt,pants,belt?,style?,cap?,coat?,beard?}` (hex colors except flags); a 교시
keeps its cast's looks in a `LOOK` table, students in the school uniform colours. `style`: 'short' | 'long' | 'bob' | 'bald' |
'bun' | 'spiky'. `lashes:1` and `lips:'#hex'` read as feminine. Portraits come from the look; a step's `face:` picks the expression.
`badge:[words]` = words this person teaches; `talk()` = first conversation; `after` = what they say once they've taught you;
`again` = what someone without badges says once you've met (no second introduction). `script()` returns steps for a
state-dependent scene, or `null` to fall back. `status()` overrides the marker. `pos()` → [x,y] after a flag; `hide()` → true
removes them. `chat:'openerId'` makes two people a conversation pair: talking to either plays both, and both count as met.
Repeated small talk: pick at random and never the same line twice in a row (`pickNew` in ch4).

## Places
Every school room comes from `SCHOOL({open, gate, zones})` in `src/school.js`: open the rooms the 교시 uses (yard and the 1층 are
always open; later 교시 keep earlier rooms open), give the 정문 its `gate`, and add per-room people, `spots`, `things`, `locks`,
`legend` entries and `paint` (a few squares for an event, like 4교시's festival stage). Never move a wall, door or warp:
`validate.mjs` checks every 교시's school against `school.js`. A school tile drawn differently in this 교시 goes in `VARIANTS` with
one comment saying why it looks different then.
Places outside the school (분식집, the street, 노래방, 학원) are this 교시's own zones with their own tile names: maps are arrays of
equal-length strings, at least 11×10, every char in `legend` (`{tile, walk:1?, over:1?, floor?}`), `warps:{'x,y':{to,x,y,dir,lock?}}`
(land on a walkable non-warp tile), `spots:{'x,y':'text'}` for single tiles, `things:{char:text|[texts]|fn}` for a tile kind,
`rooms:[[x0,y0,x1,y1,'label']]`. Every object tile must say something when inspected (`coverage.mjs`).
The review spot (the 복습 노트): the `terminal` on the teacher's desk in 2학년 3반 and the 방송실's laptop (a legend entry with
`term:1`); a 교시's `term` gives it its name and lines (4교시: 복습 노트북).

### Tile drawing
`(X,Y,x,y,t)` → draw a 16×16 tile at screen X,Y for map cell x,y at time t (ms). Helpers: `r(x,y,w,h,color)`, `hash(x,y)` (0–99
stable noise), `at(x,y)` (map char), `g` (canvas 2D context), `CAM` (camera px), `state` (save). Objects stand on the floor layer
(zone `floor` or legend `floor`), so object tiles draw no floor. Pixel-art rules: flat colors, 1px detail, light from the top, gentle
animation only (blink, shimmer, drift) via `t`. Keep each tile function short. Check art at 8× with `tools/zoom.mjs`.

## Word lists
Your 교시's 20 teaching words and 2 grammar patterns are fixed in `notes/story.md` (`- N교시 teach: …`, `grammar: …`). Use exactly
those, spelled as given. Weave the grammar into questions (choose the right ending), not only vocabulary.

## Content checklist
- 20 words (from notes/story.md), none taught in earlier 교시 (validator enforces), each with: a DICT entry (k, e, ex, hj where
  Sino-Korean), teaching questions in `Q`, ≥1 `BANK` sentence, at least one teaching person, sound-alikes in `CONFUSE`.
- `REVIEW` lines for every word from several people and moments, plus lines that bring back earlier 교시's words.
- 6–8 quest steps with items/flags; `questText()` covers every state; a finale on the last line (`finale:1`) + `DONE`.
- One or two `build` sentence questions.
- Lines short: at most about 40 Korean characters per `say`, and no box over three lines (`../walk-engine/tools/linecheck.mjs`).
- 문화 노트 / 문법 노트 only with sources, fact-checked and cited (CLAUDE.md).

## Test (all must pass; LOOK at the screenshots)
```
python3 build.py && node tests/validate.mjs   # build.py also reports English entries no longer in the game (CLAUDE.md)
python3 lexicon/extract.py .                  # "0 without a definition"
node tests/coverage.mjs chN                   # 100%
node tests/play.mjs chN                       # plays tests/walk/chN.js with real key presses at phone size; "ERRORS: none"
python3 tests/sheet.py chN                    # contact sheets in tests/shots/chN/: Read every sheet and fix what looks wrong
```
`tests/walk/chN.js` is a JS array of steps in player order (see `tests/walk/ch4.js`): `{intro:1,shot}`,
`{talk:'npcKey',wrong?,shotBefore?,shotChoice?,shotBuild?}`, `{inspect:[zone,x,y],shot?}`, `{look:zone|true}`, `{bump:[zone,'doorChar']}`,
`{walkTo:[zone,x,y],then:'shotName'}`, `{check:()=>bool,msg}`, `{clock:ms}`, `{reviewTour:zone|[zones]}` (with every word due,
each person there who has a `REVIEW` line asks it), `{hearTour:[zones]}` (nothing due: people say their lines as plain talk),
`{panel:1,shot}`, `{talklog:1}`, `{taps:1}`, `{start:1}`, `{chapters:1,shot}`.
Cover every person, every item/flag, the finale, review in character (`reviewTour`) and at the 복습 노트 after `{clock:26*3600e3}`,
and ~10 named screenshots of distinct places/moments.

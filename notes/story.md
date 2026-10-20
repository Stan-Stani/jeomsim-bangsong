# 점심 방송 — story bible

Original story. Only the *word list* comes from the webtoon; no premise, characters, places or plot from it.
Nothing here is a tutoring deal, fake dating, a top-student × delinquent pair, an elite girls' school, or a romance plot.

## 1. Premise

**느티고등학교 (느티고)** — an ordinary co-ed public high school in a quiet 동네, named for the huge 느티나무 in the yard.
The player is a 전학생 who arrives in 2학년 3반 in spring.

On day one a folded note falls out of a borrowed 지우개 sleeve: *"점심시간, 방송실 구석. —복숭아"*.
In that dusty corner the player finds **방송부**, the school broadcast club — one member left (백구름), a dead mixing desk,
and a notice from the 교장: five members by the 축제 and a broadcast on festival day, or the club closes and the room becomes a
심화반 classroom. Teachers now make announcements from the 교무실 PA, so the room looks unneeded; the 학부모회 wants it.

Running goal (4 chapters): rebuild the lunchtime broadcast and go live at the 축제.
Running light mystery: **who is 복숭아?** Notes signed 복숭아 keep turning up at the right moment, with small clues:
an old 1994 방송부 cassette (2교시), a peach 향기 and pre-1988 spelling "했읍니다" (3교시), a 1994 yearbook photo (4교시).
Red herring: 매점 이모 sells 복숭아 주스, and 찬 is sure it's her.
Reveal (4교시 finale): 복숭아 is 교장 **한복순** — 복순 → "복숭아", her nickname as the club's DJ in 1994. She wrote the closure
notice (the 학부모회 wanted the room) and quietly pushed the kids to beat it; she also played day one's "ghost" song on the 교무실 PA.

Tone: warm slice-of-life, small-scale stakes, school humor (late fines, rumor mill, 매점 runs, 롱패딩 seniors).
Crushes may exist in the background (찬 is hopeless about 다온; nobody acts on it). No bullying beyond one teasing scene the player stops.

## 2. Cast

Uniform (all students): navy blazer `shirt:#2C3E63`, grey slacks/skirt `pants:#5A5F6E`, tie shown by `belt`, color by year:
1학년 `#3F7D5A` (green) · 2학년 `#B8433A` (red) · 3학년 `#C9A13A` (gold).

| Name | Role | Personality | Speech |
|---|---|---|---|
| 나 (player) | 2학년 3반 전학생 | silent; reacts via choices | — |
| 백구름 | 2학년, last 방송부 member | shy radio nerd; mumbles in person, smooth DJ voice on the mic | 해요체 to the player at first, 반말 from 2교시; DJ lines ("자, 다음 곡!") |
| 오다온 | 2학년 3반 반장 | rule-lover, runs the 지각 벌금 jar like a bank; secretly soft; bad at math | brisk 반말, short commands ("빨리 와." "벌금 오백 원.") |
| 남궁찬 | 2학년 3반, class clown | rumor machine, 썰 king, gets everything half-wrong, loyal | 반말 + slang (대박, 헉, 진짜, 미친) |
| 유하리 | 1학년, singer | great voice, freezes in front of people, very polite | 해요체 to seniors (선배), 존댓말 always |
| 마태식 | 3학년, ex-로봇부 | gruff, exhausted by 학원 and 대학 pressure, fixes anything | blunt 반말 to juniors, few words |
| 정미숙 선생님 | 담임, 국어 | kind, dry humor, assigns 독후감 as punishment | 해요체 |
| 한복순 교장 선생님 | principal; secretly 복숭아 | formal in public, playful in notes | 해요체 / formal -ㅂ니다 at assembly |
| 매점 이모 | school store (red herring) | gossip-loving, gives free 주스 | 해요체, warm ("학생, 이거 먹어요.") |
| 박 경비 아저씨 | night guard | knows every key, remembers 1994 | 해요체, old-fashioned |

### Sprite looks
```
player   {hair:'#2B2422',skin:'#E6BE9C',shirt:'#2C3E63',pants:'#5A5F6E',belt:'#B8433A',style:'short'}
구름     {hair:'#3B2E2A',skin:'#E2B794',shirt:'#2C3E63',pants:'#5A5F6E',belt:'#B8433A',style:'bob'}
다온     {hair:'#2A2024',skin:'#EBC3A2',shirt:'#2C3E63',pants:'#5A5F6E',belt:'#B8433A',style:'bun',lashes:1,lips:'#C9707A'}
찬       {hair:'#6B4A2E',skin:'#D9A57E',shirt:'#2C3E63',pants:'#5A5F6E',belt:'#B8433A',style:'spiky'}
하리     {hair:'#1F1A1E',skin:'#F0CDAF',shirt:'#2C3E63',pants:'#5A5F6E',belt:'#3F7D5A',style:'long',lashes:1,lips:'#D27C86'}
태식     {hair:'#1C1C1F',skin:'#C89672',shirt:'#1E2228',pants:'#5A5F6E',belt:'#C9A13A',style:'short',coat:1}   // black 롱패딩
정 선생님 {hair:'#3A2A28',skin:'#E6BE9C',shirt:'#C98F6A',pants:'#3E4350',style:'bob',lashes:1,lips:'#B85F68'}
교장     {hair:'#C9C6C2',skin:'#E3B898',shirt:'#7A3E54',pants:'#3A3340',style:'bun',coat:1,lashes:1,lips:'#A8505E'}
매점 이모 {hair:'#4A3A34',skin:'#D9A882',shirt:'#F2E6C8',pants:'#6B5B4B',style:'bun',lashes:1,lips:'#C06A6A'}
경비     {hair:'#8C8C90',skin:'#C9926C',shirt:'#3E5A46',pants:'#33403A',style:'bald',cap:'#3E5A46'}
```

## 3. Chapters

### 1교시 · 전학생 (area 0)
Places: **2학년 3반 교실 (hub, 복습 노트 = 학급 일지 on the teacher's desk)** · 복도/교무실 · 급식실+매점 · 방송실.
Teachers: 정 선생님 (반장, 교장, 종례, 동갑, 평범하다), 다온 (벌금, 걷다, 사실대로, 일부러, 하필), 찬 (소문나다, 설레다, 쏘다, 친해지다),
구름 (구석, 당황하다, 마주치다, 전하다), 다온's desk inspect (지우개, 줍다), 교장 (one line), 매점 이모 (review only, no badge).
Steps:
1. 교무실: 정 선생님 meets you; class is all 동갑; "평범한 반이에요." → flag `metTeacher`.
2. 교실: late on day one (bus). 반장 다온 must 걷다 a 500원 벌금; "사실대로 말해." Pay → flag `paidFine`.
3. Seat next to 다온; her 지우개 drops (하필 now). 줍다 it → a folded note falls out → item `복숭아 쪽지`. 다온: "일부러 넣은 거 아니야."
4. 급식실: 찬 says your arrival already 소문나다 ("전학생이 방송실 귀신 봤대!"); he 쏘다 you a 바나나우유 → item `바나나우유`; 친해지다.
5. 방송실 구석: 구름 hides behind the desk, 당황하다, eyes 마주치다 and he looks away. Give him the 바나나우유. He shows the closure notice → item `폐부 안내문`.
6. 교장실 (in 복도): 전하다 the notice back with "방송부 할 거예요"; 교장: two conditions — 부원 다섯 명 by the 축제, and a broadcast
   on festival day; she'll keep the room until then and decide after hearing it → flag `deal`.
7. 교실, 종례: 정 선생님 announces 축제 date; 찬 and 다온 reluctantly say they'll "구경만" come → flag `crew3`.
Finale idea: 하교 — the dead speaker in the corridor crackles with an old song nobody played. 구름: "…지금 그거, 누가 튼 거예요?" (finale)
Hook: a second note on your shoe locker: "고마워. 다음은 노래. —복숭아"

### 2교시 · 노래 한 곡 (area 1)
Places: **방송실 (hub, 복습 노트 = 구름's old laptop)** · 음악실 · 체육관 · 학교 앞 분식집.
Goal: find a voice for the first test broadcast. 
Teachers: 하리 (긴장하다, 얼다, 심장, 곡, 포기하다), 구름 (기회, 타이밍, 효과, 즐기다, 챙기다), 찬 (장난, 놀리다, 어색하다),
다온 (재촉하다, 연락처, 데려오다, 분위기), two 3학년 teasers (괴롭히다 — one short scene), 정 선생님 (명찰), 놓치다 via 구름.
Steps:
1. 방송실: 구름 hands you a 부원 모집 poster → item `모집 포스터`; "이번 기회 놓치면 끝이에요."
2. 음악실: someone sings behind the door; when you open it, 하리 freezes (얼다), 심장 pounding, and runs — drops her 명찰 → item `하리 명찰`.
3. 정 선생님 reads the 명찰: 1학년 유하리 → points to 체육관.
4. 체육관: two 3학년 boys 놀리다 하리 about singing in the 화장실; it's 장난 to them, 괴롭히다 to her. Choose the right words to stop it → flag `stoodUp`.
5. 분식집: 하리 says she'll 포기하다; 찬's terrible joke makes the 분위기 less 어색하다; 다온 재촉하다 her to try one 곡 → flag `hariMaybe`.
6. 다온 swaps 연락처 with 하리 and promises to 데려오다 her at lunch → item `하리 연락처`.
7. 방송실: 구름 teaches 타이밍 (cue the song, then the mic), 챙기다 water for her; test broadcast — 효과 is instant, the hallway goes quiet.
8. 하리 joins → flag `crew4`.
Finale idea: 하리 on air, voice shaking then steady: "느티고 여러분… 즐겨 주세요." (finale)
Hook: in the 사연함 a cassette labelled "1994 방송부 · 복숭아" with a note: "목소리 좋다. 다음은 이야기."

### 3교시 · 비밀 사연 (area 2)
Places: **방송실 (hub)** · 복도 + 게시판 · 도서관 · 학교 앞 코인 노래방.
Goal: register the club officially and air the first 사연 (listener story) segment; survive a rumor.
Teachers: 정 선생님 (독후감, 맞춤법, 제출하다, 가입하다), 구름 (뽑다, 감동, 고민하다), 찬 (엿듣다, 오해하다, 끼어들다, 답답하다),
다온 (붙다, 무시하다, 사과하다, 눈치), 하리 (창피하다, 향기), 매점 이모 (복숭아 — red herring), 도서부 student (댓글, 비밀).
Steps:
1. 교무실: 가입하다 — five names on the form; 정 선생님 wants it 제출하다 today → item `가입 신청서` (four names; 찬's is missing).
2. 찬 is at the 도서관 writing a punishment 독후감; his 맞춤법 is a disaster. Help fix it (choice questions on spelling) → he signs → flag `signed5`.
3. 복도: the poster for the 사연 segment must 붙다 on the 게시판 → item `사연함` placed.
4. 찬 엿듣다 구름 on the phone ("그만둘까…" — his mother wants one more 학원 after school, so he wonders about quitting the club), 오해하다, and the school SNS fills with 댓글 "방송부 끝났대". 다온 says 무시하다; 구름 hurt.
5. 노래방: whole crew practicing; 찬 끼어들다 every song; player reads the 눈치 and gets 찬 to 사과하다 to 구름; 구름 admits it's a 비밀 he was 고민하다 about (parents want him at one more 학원 after school).
6. 사연함: one letter smells of peach 향기 and is spelled "했읍니다" — 정 선생님: "옛날 맞춤법이에요." 찬: "매점 이모다!" → 매점 이모 laughs, sells 복숭아 주스 to everyone (뽑다 from the 자판기) → item `복숭아 주스`.
7. 하리 reads the first 사연 on air despite feeling 창피하다; the school is 감동 → flag `sayeonAired`.
Finale idea: 구름 on air: "보내 주신 사연, 잘 읽었어요. 복숭아 님, 누구세요?" (finale)
Hook: 교장's PA announcement: the 학부모회 proposes the 방송실 as a 심화반 room; parents and the 운영위원회 will hear the festival
broadcast and the room is decided at a meeting afterwards — and the mixing desk's 회로 (taped up in 2교시) just burned out.

### 4교시 · 축제 생방송 (area 3)
Places: **방송실 (hub)** · 운동장 축제 무대 · 동네 상가 (편의점, 학원 건물) · 교장실.
Goal: fix the desk, advertise, go live at the 축제, save the room; solve 복숭아.
Teachers: 태식 (회로, 기술, 생초보, 빡빡하다), 정 선생님 (상담, 대학, 목표, 평가), 구름 (부모님, 약속, 절박하다), 
상가 shop owners (광고, 동네), 다온 (쫓겨나다, 방법), 교장 (꿈, 이루다, 합격하다, 심화반, 표정).
Steps:
1. 방송실: dead desk, burnt smell; 구름 is 절박하다; 다온: "방법이 있어. 3학년 태식 선배." → flag `needFix`.
2. 교무실: 정 선생님 holds a 상담 with 태식 about 대학 and 목표; he has no time — 학원 schedule 빡빡하다. She sends you to the 학원 building in the 동네.
3. 동네 상가: 하리 and 찬 hang 광고 posters in shops → item `광고 포스터` (3 shops; each owner one line). 편의점 owner hands over a spare fuse → item `부품`.
4. 학원 건물: 태식 between classes; "나 이제 생초보 아니야, 기술 있어." He'll come if you bring the part → he follows (FOLLOW) back to school.
5. 방송실: 태식 fixes the 회로 (build question); 구름 promises his 부모님 he'll keep his 평가 up (약속) → flag `fixed`.
6. 교장실: 교장 explains the 학부모회 ("노래 틀고 떠드는 건 누구나 해요"), the 3층 창고 that would take long to clear, and Monday's
   운영위 meeting: show why the school needs the club, or be 쫓겨나다; a 1994 yearbook on the shelf shows the 방송부 photo — DJ 한복순 "복숭아". Inspect it → flag `clue`.
7. 운동장 무대: live broadcast; 하리 sings, 찬 does the jokes, 다온 runs the clock, 구름 at the mic.
8. 교장 tells the crew she was 복숭아, then names herself on the mic; 1994 alumni among the parents shout "복숭아 언니!", a
   운영위원 nods; the decision is Monday's but her mind is made up. Her 꿈 was to hear this room alive again — it 이루다. Epilogue:
   Monday's 운영위 keeps the room (심화반 gets the cleared 3층 창고); 태식 later 합격하다. Her 표정 when the kids cheer.
Finale idea: 교장 on air: "여기는 느티고 방송부. 삼십 년 만이네요." (finale, last line by 구름: "내일 점심에도 들어 주세요.")
Hook (series): a new note in the 사연함, not in 교장's handwriting: "다음 학기 사연 있어요. —복숭아 2호"

## 3b. Stakes ledger and setups (keep the chapters to this)

The deal has two terms: **M** five registered members, **F** a broadcast on festival day. Lunch broadcasts are practice.
| After | M | F | Room |
|---|---|---|---|
| 1교시 `deal` | 2 willing | open | kept until the festival; decided after hearing it |
| 2교시 `done` | 4 | open ("연습은 연습이에요") | 학부모회 wants it for a 심화반 (background) |
| 3교시 `submitted` | **met** (교장 confirms) | open | — |
| 3교시 `done` | met | open | PA: parents + 운영위 will hear the festival broadcast; meeting after. Desk burns out. |
| 4교시 `fixed` | met | possible again | now they must be good enough |
| 4교시 `done` | met | **met** | 운영위 on Monday keeps it (epilogue) |

Setups → payoffs: 심화반 plan (1교시 notice) → 4교시; teachers' 교무실 PA (1교시 구름) → day-one song confessed in 4교시;
tape repair (2교시) → burnout (3교시); 학부모회 visit (2교시 교장), meeting (3교시) → 4교시; 1994 trophy/cassette/old spelling →
yearbook → reveal. No line may restate a met term as open, or treat the room as already lost.

## 4. Words per chapter

Separator is ` | ` because some entries contain spaces. Spelled exactly as in `src/words.json`.

- 1교시 teach: 반장 | 교장 | 종례 | 소문나다 | 지우개 | 줍다 | 벌금 | 걷다 | 동갑 | 친해지다 | 당황하다 | 평범하다 | 설레다 | 일부러 | 사실대로 | 전하다 | 구석 | 하필 | 마주치다 | 쏘다
- 1교시 grammar: -(으)ㄹ게 | -거든
- 1교시 weave: 선생님 | 친구 | 우리 | 진짜 | 얘기 | 좀 | 그냥 | 결과 | 내일 | 먼저 | 미안 | 갑자기 | 같이 | 놀다 | 늦다 | 다음 | 대화 | 돈 | 바쁘다 | 반 | 버스 | 역시 | 재밌다 | 지겹다 | 학원 | 혹시 | 혼자 | 가까이 | 걱정 | 경례 | 차렷 | 고등학생 | 곧 | 교내 | 그래도 | 그러고 보니 | 근데 | 꼭 | 끝나다 | 내리다 | 다들 | 다시 | 당연히 | 대박 | 등수 | 딱 | 또래 | 망하다 | 모의고사 | 중간고사 | 성적 | 번호 | 사진 | 생각하다 | 수고하다 | 알려주다 | 앞으로 | 약간 | 어쩌면 | 어차피 | 언제든지 | 얼른 | 엄청 | 여기저기 | 요즘 | 웬일 | 인사하다 | 잠깐 | 점심시간 | 제발 | 조용히 | 죄송하다 | 집중하다 | 찾다 | 처음 | 큰일 | 학년 | 항상 | 힘들다 | 자랑스럽다 | 부럽다 | 의외 | 이번 | 분명 | 하교 | -(으)니까 | -아/어 보다 | -자 | -(으)ㄴ데/-는데 | -아/어 주다 | -네 | -잖아

- 2교시 teach: 괴롭히다 | 긴장하다 | 얼다 | 심장 | 분위기 | 어색하다 | 장난 | 놀리다 | 명찰 | 곡 | 기회 | 놓치다 | 타이밍 | 효과 | 포기하다 | 즐기다 | 챙기다 | 재촉하다 | 연락처 | 데려오다
- 2교시 grammar: -(으)ㄹ까(요) | -지 마
- 2교시 weave: 괜찮다 | 긴장 | 하하 | 거기 | 다녀오다 | 부르다 | 언니 | 이거 | 풀리다 | 나가다 | 노래 | 다르다 | 말을 걸다 | 뭐야 | 이름 | 이제 | 화장실 | 고3 | 고맙다 | 교복 | 그나저나 | 그만 | 금방 | 긴장을 풀다 | 끌려오다 | 남자애 | 내내 | 누나 | 당장 | 대답하다 | 동안 | 떨어지다 | 또 | 말도 안 되다 | 맨날 | 물 | 번 | 별로 | 볼 일 | 봐주다 | 부탁드리다 | 사다 | 손 | 쉿 | 시키다 | 싫다 | 아까 | 아직도 | 앞머리 | 얼마나 | 오랜만 | 오히려 | 이런 | 이왕 | 잘 가 | 전화 | 조금 | 직빵 | 터지다 | 편하다 | 필요하다 | 하지만 | 흔하다 | 우르르 | 시야 | 가리다 | -도 | -(으)ㄴ/는/ㄹ 것 같다 | -다니까/-(이)라니까 | -(으)려고 하다 | -기 전에 | -(으)ㄹ 동안 | -아/어야 하다 | -(으)면서

- 3교시 teach: 비밀 | 엿듣다 | 오해하다 | 사과하다 | 독후감 | 맞춤법 | 제출하다 | 댓글 | 눈치 | 고민하다 | 답답하다 | 창피하다 | 무시하다 | 끼어들다 | 향기 | 복숭아 | 가입하다 | 감동 | 붙다 | 뽑다
- 3교시 grammar: -(으)ㄴ 척하다 | -대
- 3교시 weave: 그래서 | 어떡하다 | 어제 | 여보세요 | 전교 | 첫 | 친하다 | 듣다 | 만나다 | 모두 | 사실 | 생각나다 | 슬쩍 | 아침 | 이따 | 있잖아 | 점심 | 톡 | 가끔씩 | 걸리다 | 게다가 | 고개 | 곳 | 공동 | 교시 | 궁금하다 | 귀엽다 | 근처 | 급하다 | 깨지다 | 끄다 | 나중 | 내다 | 노래방 | 누르다 | 느낌 | 다름이 아니라 | 다행이다 | 되게 | 두근거리다 | 드라마 | 딱딱하다 | 뜬금없이 | 마무리하다 | 마음에 들다 | 매번 | 멋대로 | 모범생 | 물어보다 | 반갑다 | 벌써 | 복도 | 부탁하다 | 빨리 | 상황 | 생각 | 성격 | 소문 | 수업 | 수학 | 쉽다 | 슬슬 | 시원하다 | 쓰이다 | 아무것 | 아직 | 앞 | 어떤 | 어떻게든 | 어이없다 | 연락하다 | 옆 | 유명하다 | 이동 | 일단 | 일어나다 | 잊다 | 자꾸 | 잘못 | 장난 아니다 | 정도 | 주 | 주스 | 지난주 | 착하다 | 책 | 천천히 | 쳐다보다 | 틀리다 | -랑 | -는/(으)ㄴ 거야 | -구나 | -(으)ㄹ 리 없다 | -아야겠다 | -(으)러 | -다고 하다

- 4교시 teach: 대학 | 상담 | 심화반 | 평가 | 합격하다 | 목표 | 꿈 | 이루다 | 방법 | 회로 | 기술 | 광고 | 동네 | 부모님 | 약속 | 쫓겨나다 | 절박하다 | 표정 | 생초보 | 빡빡하다
- 4교시 grammar: -(으)면 되다 | -다(가) 보니(까)
- 4교시 weave: 가르치다 | 그렇지만 | 높다 | 대단하다 | 배우다 | 부탁 | 간이 크다 | 건물 | 관심 | 그러니까 | 기초반 | 끝내주다 | 너무하다 | 너희 | 놀라다 | 농담 | 대신 | 도망가다 | 도움 | 돕다 | 드리다 | 목마르다 | 무척 | 뭐든 | 미안하다 | 반대편 | 받다 | 방금 | 볼일 | 살다 | 상관하다 | 상위 | 서로 | 실은 | 쓸데없다 | 아무튼 | 아시다시피 | 열심히 | 요컨대 | 웃기다 | 이상하다 | 이쪽 | 입학 | 적어도 | 제일 | 주변 | 하루 | 한참 | 합격률 | 훨씬 | 무리하다 | 한바탕 | 대강 | 무지 | 쪼그맣다 | 엑 | N보다 | -(으)세요 | -거든(요) | -는 것 같다 | -(으)ㄹ 때(까지) | -게 하다 | -(으)ㄹ 텐데 | -지? | N만 | N부터 | N한테

## 5. Style

- Dialogue is **Korean only**. English lives only in the dictionary (behind a tap).
- Short lines: ≤ 40 characters per `say`. One idea per line.
- Adults and teachers use 해요체 (교장 uses -ㅂ니다 only at assembly/on air). Friends use 반말; 하리 uses 해요체 to 선배s;
  the player's choices follow the person addressed.
- Mild teen slang is fine (대박, 헉, 진짜, 미친, 직빵) — mostly from 찬.
- **No instruction text.** The world explains itself: locked doors say why ("방송실 열쇠는 경비 아저씨가 있어요."), NPCs point the way,
  the 목표 line names place + task in a few Korean words ("음악실 · 노래하는 사람 찾기").
- Mystery notes from 복숭아 are short, warm, a little old-fashioned, never sign-posted as clues.
- Humor is situational (벌금 jar, 찬's rumors, the cursed 바나나우유), never mean.

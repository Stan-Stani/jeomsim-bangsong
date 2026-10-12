# 점심 방송 — school walk-around Korean game (formerly 방과 후)

Source lives in `src/` (`shell.html`, `chapters/chN.js`, `school.js`, `engine.js` — generated from the shared walk-engine); `python3 build.py`
assembles the single-file `index.html`, published by pushing to GitHub Pages (public repo Stan-Stani/jeomsim-bangsong, renamed from banghu on 2026-10-10; save keys still start with `banghu-`).
Never edit `index.html` by hand. Each chapter (교시) is a cartridge with its own save key; never change an existing key or break its saves.

## What the game is
- **Story:** the story, cast and places are original, from `notes/story.md`. Nothing from the webtoon the vocabulary came from: no names, scenes or plot.
- **Vocabulary:** from that webtoon's first four free episodes, one chapter per episode. `tools/build_words.py` builds `src/words.json` from the
  local tallies in `source/`, which is gitignored and never committed: no dialogue, notes, images, or Korean gloss fragments in anything public.
- **Learner:** rusty intermediate (~TOPIK 3) on a phone. Korean only, with English behind ?. No on-screen instruction text.
- **Writing a 교시:** `docs/CHAPTER_GUIDE.md`. Review is in character: each 교시's `REVIEW` lists lines people say in their own
  scenes with a learned word blanked (earlier 교시's words too); the 복습 노트 asks the generic `BANK` sentences.

## Checks before publishing
- `python3 build.py && node tests/validate.mjs`
- Whole-line English (`src/lines-en.json`, behind the ?) is keyed by each line's exact Korean: editing a line, even a particle, drops
  its English with no error. `build.py` runs `../walk-engine/tools/lines_en.py .` and must report `0 English entries no longer in the
  game`; for each edited line, translate it again (`src/lines-todo.json` gives the old line and English as "was"/"was_en"), close and
  faithful like its neighbours, and delete the old entry. New lines need English too once their 교시 is translated.
- `python3 lexicon/extract.py .` must report `0 without a definition` (add to lexicon/defs.json; analyzer misreads → lexicon/fixes.json).
- `node tests/coverage.mjs chN`: every object tile says something when inspected; keep it at 100%.
- `node tests/play.mjs chN` plays `tests/walk/chN.js` with real key presses (400px phone viewport) and must end with `ERRORS: none`.
  One playtest at a time (machine-wide lock); never more than 2 agents playtesting in parallel (this 7 GB machine froze once).
- `python3 tests/sheet.py chN`, then LOOK at every contact sheet.
- Art changes (sprites, tiles, chairs): check them at 8× with `node ../walk-engine/tools/zoom.mjs spec.json out/` (see walk-engine README), not
  only in phone-sized screenshots.

**Engine:** `src/engine.js` is GENERATED from the shared `../walk-engine/engine.js` (one engine for 성실호, 형제, 점심 방송). Edit it there and run `walk-engine/sync.sh`. This game's settings (storage prefix, names, default player) are in `src/game.js`. `validate.mjs` fails if the copy is out of sync.

**School:** every 교시 is set in the one 느티고 of `src/school.js` (운동장 + 체육관, 1층, 2층 with 음악실 and 도서관, 2학년 3반, 급식실 + 매점,
방송실). A chapter calls `SCHOOL({open, gate, zones})` to open rooms, add its people, lines, locks and event props (`paint`); it never redraws
a school map. `validate.mjs` fails if a 교시's walls, doors or warps differ from the school's. Later 교시 keep earlier rooms open.
The school's tiles are one tileset: a 교시 draws a school tile its own way only as a declared story variant in `VARIANTS` (one comment
each: why it looks different then); places outside the school (분식집, street, 노래방, 학원) use their own tile names. Objects stand on the
floor layer (zone `floor`, or legend `floor`), so object tiles draw no floor. `validate.mjs` enforces both. Before an art or layout
refactor, dump every zone (`node ../walk-engine/tools/zonedump.mjs out/`) and diff after (`zonediff.py`): change only what you meant to.

**Playtesters (agents):** a tester who starts mid-story (e.g. only 3교시) gets the story so far in their prompt: who 다온 (반장), 하리,
구름 and 찬 are, the five-member 방송부, 하리's first broadcast, 벌금 jokes. Settled by the owner, so testers needn't report them:
word-order tiles have no instruction text on purpose (only the first tile of the first one ever bobs, after 4 s); the school gate
is mirrored (you walk ↓ out and face ↑ on the street); long walks across the 1층; words above TOPIK 3 (all tappable); a word quizzed
several times in one 교시; review right after a word is taught; the sleeper sits upright; the 1층 south wall has windows and doors.

**문화 노트** (`src/culture.js`): the real-world culture behind a story moment, unlocked by a step's or phone's `culture:'id'`, read in
the journal. Fact-check every line against the sources themselves (open pages that block plain fetches in a real browser), cite each
line by source number, and drop or soften any claim no source supports. `validate.mjs` checks the citations and links.
The **문법 노트** (`src/grammar.js`) follow the same rule (fact-check, cite, soften), and `validate.mjs` checks theirs too.

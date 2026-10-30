# Idea (tabled 2026-10-29): 눈치 moments in the main game

Status: **tabled by the owner** — written down, not started. The lab version exists (`labs/nunchi.js`, ?lab=nunchi).

## The mechanic
Something happens, one short line; the taught word in it says what kind of thing it is, and you answer in kind:
someone struggling → **괜찮아?** · someone doing wrong → **그만해!** · good news → **잘됐다!** (polite forms to seniors).
In the game these are ordinary dialogue replies, not the lab's abstract buttons. A wrong reply gets an in-character reaction
and the word's meaning, as a quiz explanation does now.

## Where it fits (most natural first)
1. **3교시 노래방** — story.md step 5 already says "player reads the 눈치 and gets 찬 to 사과하다 to 구름". A 3–5 beat run that
   *is* the scene: 찬 끼어들다 (그만해!), 구름 고민하다 (괜찮아?), 찬 사과하다 (잘됐다!). Pilot here.
2. **4교시 축제 무대** — the live broadcast as the finale run, reviewing all four 교시' words. Must be no-fail (canon: it succeeds);
   misses cost only crowd reactions.
3. **2교시 체육관** — the stand-up to the 3학년 boys is one 그만해! moment; fine as a plain choice.
4. **Review** — some review questions become 눈치 moments: an NPC describes a situation with a due word, you reply.

## How it could be built
Mostly the existing quiz shape (ask, options, why, review scheduling, English): a quiz entry with no blank whose options are the
three replies, plus a small engine change to allow that. Each scene keeps its canon outcome; the player can't fail the story through it.

## Before doing it
Owner go-ahead per scene and review of the Korean; English in lines-en.json; lexicon extract BEFORE build; playtest. The lab's
lines can't be reused as-is — each must be rewritten for its scene's exact moment and checked against story.md.

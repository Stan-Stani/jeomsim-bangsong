// Playtest: node tests/play.mjs ch1 [walk] [--fast]. The runner is shared by every game: ../walk-engine/tools/play.mjs (usage there).
const {play}=await import('../../walk-engine/tools/play.mjs');
await play(new URL('..',import.meta.url).pathname.replace(/\/$/,''));

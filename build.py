#!/usr/bin/env python3
"""Assemble index.html from src/: shell + chapter registry + chapters (in order) + engine."""
import pathlib,re,sys
root=pathlib.Path(__file__).parent
shell=(root/'src/shell.html').read_text(encoding='utf-8')
chs=sorted((root/'src/chapters').glob('ch*.js'),key=lambda p:int(re.search(r'\d+',p.stem).group()))
if '--chapters' in sys.argv: # publish only finished chapters: --chapters ch1,ch3
    keep=sys.argv[sys.argv.index('--chapters')+1].split(',');chs=[p for p in chs if p.stem in keep]
import json
lexmap=json.loads((root/'src/lexicon-map.json').read_text(encoding='utf-8')) if (root/'src/lexicon-map.json').exists() else {}
defs_p=root/'lexicon/defs.json'
alldefs=json.loads(defs_p.read_text(encoding='utf-8')) if defs_p.exists() else {}
used={l for ls in lexmap.values() for l in ls}
lex={'map':{k:v for k,v in lexmap.items() if any(l in alldefs and alldefs[l] for l in v)},'defs':{l:d for l,d in alldefs.items() if l in used and d}}
parts=['<script>\n/* Tap-a-word dictionary: word as written → dictionary forms, and learner definitions (lexicon/). */\nwindow.LEX='+json.dumps(lex,ensure_ascii=False,separators=(',',':'))+';\n</script>',
 '<script>\n/* Chapters register themselves here; each keeps its own save. */\nconst CHAPTERS=[];\n</script>']
en_p=root/'src/lines-en.json'  # whole-line English behind the dialogue box's ? (walk-engine/tools/lines_en.py lists the lines)
if en_p.exists(): parts.append('<script>\n/* Close English for whole lines, Korean line as written → English (the last aid after word taps). */\nglobalThis.LINES_EN='+json.dumps({k:v for k,v in json.loads(en_p.read_text(encoding='utf-8')).items() if v},ensure_ascii=False,separators=(',',':'))+';\n</script>')
parts.append(f'<script>\n{(root/"src/school.js").read_text(encoding="utf-8")}</script>')  # the school every 교시 is set in
parts+=[f'<script>\n{p.read_text(encoding="utf-8")}</script>' for p in chs]
parts.append(f'<script>\n{(root/"src/game.js").read_text(encoding="utf-8")}</script>')  # this game's settings for the shared engine
parts.append(f'<script>\n{(root/"src/culture.js").read_text(encoding="utf-8")}</script>')  # 문화 노트 (window.CULTURE_NOTES)
parts.append(f'<script>\n{(root/"src/grammar.js").read_text(encoding="utf-8")}</script>')  # 문법 노트 (window.GRAMMAR_NOTES)
parts.append(f'<script>\n{(root/"src/engine.js").read_text(encoding="utf-8")}</script>')
out=pathlib.Path(sys.argv[sys.argv.index('--out')+1]) if '--out' in sys.argv else root/'index.html'
out.write_text(shell.replace('<!--SCRIPTS-->','\n'.join(parts)),encoding='utf-8')
print('built',out.name,'with',len(chs),'chapter(s)')
# Each line's English is keyed by its Korean, so editing a line drops its English silently: report it on every build.
chk=root.parent/'walk-engine/tools/lines_en.py'
if en_p.exists() and chk.exists():
    import subprocess; sys.stdout.flush(); subprocess.run([sys.executable,str(chk),str(root)])

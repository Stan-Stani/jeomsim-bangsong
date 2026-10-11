#!/usr/bin/env python3
"""Tap-any-word dictionary, step 1: map every word players can see to its dictionary form(s).
Usage: extract.py <repo> → writes <repo>/src/lexicon-map.json  {eojeol: [lemma, …]}  and prints lemmas missing from defs.json.
Text comes from every quoted string with Hangul in src/chapters/*.js (and src/school.js, src/culture.js, src/grammar.js) (gloss markup {shown|key} → shown)."""
import json,re,sys,pathlib
from kiwipiepy import Kiwi
repo=pathlib.Path(sys.argv[1]);here=pathlib.Path(__file__).parent
kiwi=Kiwi()
# teach Kiwi the games' own names and glossary terms so 성실호가 stays 성실호 + 가
names=set()
for r in [repo,here.parent]:
    for p in sorted((r/'src/chapters').glob('ch*.js')):
        src=p.read_text(encoding='utf-8')
        for m in re.finditer(r"(?:name|who):'([^']+)'",src):
            for part in re.split(r'[ ()·]+',m.group(1)):
                if len(part)>2 and part.endswith('의'): part=part[:-1]   # 멜로리의 유령 → 멜로리
                if re.fullmatch('[가-힣]{2,}',part): names.add((part,'NNP'))
        for m in re.finditer(r"^\s*'([가-힣 ]{2,})':\{k:",src,flags=re.M):
            w=m.group(1)
            if ' ' not in w: names.add((w,'NNG'))
texts=[]
for p in sorted((repo/'src/chapters').glob('ch*.js'))+[q for q in [repo/'src/school.js',repo/'src/culture.js',repo/'src/grammar.js'] if q.exists()]:  # school.js: the school every 교시 shares; culture.js: 문화 노트; grammar.js: 문법 노트
    src=p.read_text(encoding='utf-8')
    src='\n'.join(l for l in src.split('\n') if '/*nolex*/' not in l)  # pixel-font tables and the like aren't game text
    for m in re.finditer(r"'((?:[^'\\\n]|\\.)*)'|`([^`]*)`|\"((?:[^\"\\\n]|\\.)*)\"",src):
        t=next(g for g in m.groups() if g is not None)
        if re.search('[가-힣]',t): texts.append(re.sub(r'\{([^|}]+)\|[^}]+\}',r'\1',t))
# plus every name in the shared dictionary (English written as "Name — … name/people/creature…"). Every game shares it, so a
# 2-syllable name is taught only when this game writes it with a particle no verb takes (다온이, 하리의, 꼬렛을): else another
# game's name beats a verb (단어 마을's 지나 read 지나서 as 지나, not 지나다; 형제's 세서 took 성실호's "중력이 세서")
_defs=json.loads((here/'defs.json').read_text(encoding='utf-8')) if (here/'defs.json').exists() else {}
_words={re.sub(r'^[^가-힣]+|[^가-힣]+$','',e) for t in texts for e in t.split()}
_NAME_P=('이','의','을','를','한테','에게','께','씨','님','랑','이랑','하고','와','과','아','이가','이는','이도','이를','이의','이한테','이야','이에요','예요')
for w,v in _defs.items():
    if v and ' — ' in (v.get('e') or '') and re.fullmatch('[가-힣]{2,}',w) and (len(w)>2 or any(w+x in _words for x in _NAME_P)): names.add((w,'NNP'))
for w,tag in names: kiwi.add_user_word(w,tag,score=5)
CONTENT={'NNG','NNP','NNB','NR','NP','VV','VA','VX','MAG','MAJ','MM','XR','IC','SL'}
def lemmas(eoj):
    toks=kiwi.tokenize(eoj);out=[];i=0
    while i<len(toks):
        t=toks[i];nxt=toks[i+1] if i+1<len(toks) else None
        if t.tag in ('NNG','XR','NNP') and nxt is not None and nxt.tag in ('XSV','XSA'):   # 도착+하 → 도착하다, 조용+하 → 조용하다
            out.append(t.form+nxt.form+'다');i+=2;continue
        if t.tag in ('VV','VA','VX','VV-R','VA-R','VV-I','VA-I'): out.append(t.form+'다')
        elif t.tag in CONTENT and t.tag!='SL': out.append(t.form)
        i+=1
    out=[l.replace(' ','') for l in out]   # user-dictionary names can come back with a space (벤 사스)
    seen=[];[seen.append(l) for l in out if l not in seen];return seen[:3]
mp={};example={}
for t in texts:
    for eoj in t.split():
        key=re.sub(r'^[^가-힣]+|[^가-힣]+$','',eoj)
        if not key or key in mp or not re.search('[가-힣]',key):continue
        mp[key]=lemmas(key)
        for l in mp[key]: example.setdefault(l,(key,t))
_fix=here/'fixes.json'
if _fix.exists():   # hand fixes for words the analyzer reads wrong
    for k,v in json.loads(_fix.read_text(encoding='utf-8')).items():
        if not k.startswith('_'): mp[k]=v; [example.setdefault(l,(k,k)) for l in v]
(repo/'src/lexicon-map.json').write_text(json.dumps(mp,ensure_ascii=False,separators=(',',':')),encoding='utf-8')
defs=json.loads((here/'defs.json').read_text(encoding='utf-8')) if (here/'defs.json').exists() else {}
used=sorted({l for ls in mp.values() for l in ls})
missing=[l for l in used if l not in defs]
(repo/'src/lexicon-missing.txt').write_text(''.join(f'{l}\t{example[l][0]}\t{example[l][1]}\n' for l in missing),encoding='utf-8')
empty=[e for e,ls in mp.items() if ls and all(defs.get(l) is None for l in ls)]   # every lemma null: the tap falls back to a prefix or "사전에 없는 말이에요"
(repo/'src/lexicon-empty.txt').write_text(''.join(f'{e}\t{",".join(mp[e])}\n' for e in empty),encoding='utf-8')
print(f'{repo.name}: {len(texts)} strings, {len(mp)} distinct words, {len(used)} lemmas, {len(missing)} without a definition · {len(empty)} words tap to an empty entry (src/lexicon-empty.txt; mostly bare particles after a blank)')

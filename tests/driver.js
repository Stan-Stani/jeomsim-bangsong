/* In-page playtest driver. Plays a chapter using ONLY keyboard input (arrows, Z/space, Enter, X), the same
   path a player's key presses take. Reads the screen state to decide what to press, never calls game logic.
   Steps come from tests/walk/<chapter>.js. Screenshots: logs "SHOT:<name>" and waits for the runner. */
window.__play=async function(steps){
 const LOG=[],ERR=[];window.__log=LOG;window.__err=ERR;
 const log=m=>LOG.push(m),check=(c,m)=>{if(!c){ERR.push('ASSERT: '+m);log('!! '+m)}};
 addEventListener('error',e=>ERR.push('onerror: '+e.message+' @'+e.lineno));
 const realNow=Date.now;let skew=0;Date.now=()=>realNow()+skew;
 const wait=ms=>new Promise(r=>setTimeout(r,ms));
 const until=async(fn,ms=1500)=>{const t=performance.now();while(!fn()){if(performance.now()-t>ms)return false;await wait(15)}return true};
 const key=async(k,hold=40)=>{dispatchEvent(new KeyboardEvent('keydown',{key:k,bubbles:true}));await wait(hold);dispatchEvent(new KeyboardEvent('keyup',{key:k,bubbles:true}));await wait(25)};
 const ARROW={up:'ArrowUp',down:'ArrowDown',left:'ArrowLeft',right:'ArrowRight'};
 const shot=async name=>{window.__shotDone=false;console.log('SHOT:'+name);await until(()=>window.__shotDone,8000)};
 let shotN=0;

 async function step(d){ // one tile, by key press (the follower in the way: the first press only faces them, a second one swaps, as a player would)
  let ok=await step1(d);if(!ok){const [dx,dy]=D[d];if(petOn()&&pet.x===player.x+dx&&pet.y===player.y+dy)ok=await step1(d)}return ok;
 }
 async function step1(d){
  await until(()=>!player.moving&&!warping,1500);  // a door still fading in ignores keys, as it does for a player (the screenshots used to hide this wait)
  const x=player.x,y=player.y,z=ZID;
  dispatchEvent(new KeyboardEvent('keydown',{key:ARROW[d],bubbles:true}));
  const moved=await until(()=>player.moving||warping||player.x!==x||player.y!==y,400);
  dispatchEvent(new KeyboardEvent('keyup',{key:ARROW[d],bubbles:true}));
  await until(()=>!player.moving&&!warping,1500);await wait(30);
  return moved&&(player.x!==x||player.y!==y||ZID!==z);
 }
 async function face(d){await key(ARROW[d],60);check(player.dir===d,'could not face '+d)}
 function bfs(goal){
  const k=(x,y)=>x+','+y,seen=new Set([k(player.x,player.y)]),q=[[player.x,player.y,[]]];
  while(q.length){const [x,y,p]=q.shift();if(goal(x,y))return p;
   for(const [d,[dx,dy]] of Object.entries(D)){const nx=x+dx,ny=y+dy,kk=k(nx,ny);if(seen.has(kk))continue;seen.add(kk);
    const w=warpAt(nx,ny);if(w&&w.lock&&w.lock())continue;if(blocked(nx,ny))continue;if(w&&!goal(nx,ny))continue;q.push([nx,ny,[...p,d]])}}
  return null;
 }
 async function walk(path){for(const d of path){const z=ZID;const ok=await step(d);check(ok,`step ${d} failed at ${player.x},${player.y} in ${z}`);if(!ok)return;if(ZID!==z){await wait(250);return}}}
 function zoneRoute(target){ // BFS over the zone graph using warps
  const prev={[ZID]:null},q=[ZID];
  while(q.length){const z=q.shift();if(z===target)break;for(const w of Object.values(C.ZONES[z].warps||{}))if(C.ZONES[w.to]&&!(w.to in prev)){prev[w.to]=z;q.push(w.to)}}
  if(!(target in prev))return null;const r=[];for(let z=target;z!==ZID;z=prev[z])r.unshift(z);return r;
 }
 async function goZone(target){
  const route=zoneRoute(target);check(!!route,`no route ${ZID}→${target}`);if(!route)return;
  for(const next of route){
   const p=bfs((x,y)=>{const w=warpAt(x,y);return !!w&&w.to===next});
   check(!!p,`no path ${ZID}→${next}`);if(!p)return;log(`-- walk ${ZID} → ${next} (${p.length} steps)`);await walk(p);
  }
 }
 async function finishDialog(opts={}){
  const wrongDone=new Set();let guard=0;
  while(dlg&&guard++<300){
   if(typing&&!typing.finished){await key('z');continue}
   const who=$('who').textContent,txt=$('txt').textContent;if(LOG[LOG.length-1]!==`  ${who}: ${txt}`)log(`  ${who}: ${txt}`);
   if(choosing()&&dlg.cur.choose){const bs=choiceBtns();let b=bs[bs.length-1];  // a plain choice (e.g. next chapter?): the last one (stay)…
    if(opts.pick&&opts.pick.length){const p=opts.pick.shift(),hit=bs.find(x=>x.textContent===p)||bs.find(x=>x.textContent.includes(p));  // …or the walk's next pick:[label,…] (a timing moment, a wrong try first)
     check(!!hit,`no choice "${p}" among ${bs.map(x=>x.textContent).join(' / ')}`);if(hit)b=hit}
    log('  ? '+dlg.cur.choose.map(c=>c[0]).join(' / ')+' > '+b.textContent);b.click();await wait(250);continue}
   if(typeof writing==='function'&&writing()){  // 쓰기 문제: type the answer (a wrong option first on a wrong:true walk) and press Enter
    const s=dlg.cur,ci=s.opts.findIndex(o=>o[1]),wi=s.opts.findIndex(o=>!o[1]);let a=s.opts[ci][0],label='> (written) '+a;
    if(opts.wrong&&wi>=0&&!wrongDone.has(s.ask)){wrongDone.add(s.ask);a=s.opts[wi][0];label='> (written, wrong) '+a}
    if(opts.shotChoice&&!shotN++){await shot(opts.shotChoice)}
    const inp=$('writeIn');inp.focus();inp.value=a;log('  '+label);inp.dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',bubbles:true}));await wait(40);continue}
   if(choosing()){
    const s=dlg.cur,btns=choiceBtns();const want=i=>btns.findIndex(b=>+b.dataset.i===i);
    const ci=s.opts.findIndex(o=>o[1]),wi=s.opts.findIndex(o=>!o[1]);
    let target=want(ci),label='> '+s.opts[ci][0];
    if(opts.wrong&&wi>=0&&!wrongDone.has(s.ask)){wrongDone.add(s.ask);target=want(wi);label='> (wrong) '+s.opts[wi][0]}
    if(opts.shotChoice&&!shotN++){await shot(opts.shotChoice)}
    await until(()=>performance.now()-choicesAt>=470,1000);  // like a person: fresh choices ignore keys for 0.45 s (else a wrong:true press is dropped)
    for(let n=0;sel!==target&&n<6;n++)await key('ArrowDown');
    log('  '+label);await key('Enter');await wait(40);continue;
   }
   if(building()){
    const s=dlg.cur;
    if(opts.shotBuild){await shot(opts.shotBuild);opts.shotBuild=null}
    const tiles=()=>tileBtns();
    // the next right tile in whichever accepted order the answer has started (alts: another natural order is fine too)
    const next=()=>{const seq=s.seq||[],o=[s.build,...(s.alts||[])].find(o=>seq.every((w,j)=>o[j]===w))||s.build;return tiles().findIndex(b=>s.build[+b.dataset.i]===o[seq.length])};
    await until(()=>performance.now()-choicesAt>=470,1000);  // like a person: fresh tiles ignore keys for 0.45 s (held walking keys)
    while(building()&&s.got<s.build.length){const t=next();for(let n=0;sel!==t&&n<8;n++)await key('ArrowRight');await key('z');await wait(20)}
    log('  > built: '+s.build.join(' '));continue;
   }
   if(opts.shotSay&&txt.includes(opts.shotSay.text)){await shot(opts.shotSay.name);opts.shotSay=null}
   if(opts.shotTap&&$('txt').querySelector('.w')){ // tap a word → Korean definition, then ? → English
    const w=[...$('txt').querySelectorAll('.w')].sort((a,b)=>b.textContent.length-a.textContent.length)[0];w.click();await wait(150);
    check(!$('gloss').hidden,'tapping a word should open the dictionary');log('  tap '+w.textContent+' → '+$('gloss').textContent.slice(0,60));
    await shot(opts.shotTap+'-ko');$('gloss').querySelector('.q')?.click();await wait(100);check(!$('gloss').querySelector('.en').hidden,'? shows the English');await shot(opts.shotTap+'-en');
    check(getComputedStyle($('gloss').querySelector('.gx')).display!=='none','the definition shows ×');
    await wait(8500);check(!$('gloss').hidden,'the definition stays open until closed');await shot(opts.shotTap+'-stays');
    $('gloss').querySelector('.gx').click();await wait(60);check($('gloss').hidden,'× closes it');opts.shotTap=null;continue}
   await key('z');
  }
  check(guard<300,'dialog did not end');
  await wait(1000);if(dlg)await finishDialog(opts);
 }
 async function reach(goal,label){const p=bfs(goal);check(!!p,'cannot reach '+label);if(!p)return false;await walk(p);return true}
 const dirTo=(x,y)=>x>player.x?'right':x<player.x?'left':y>player.y?'down':'up';
 async function talk(k,opts={}){
  const n=C.NPC[k];check(!!n,'no npc '+k);await goZone(n.zone);
  const [nx,ny]=npcPos(n);
  const next=(x,y)=>Math.abs(x-nx)+Math.abs(y-ny)===1&&!warpAt(x,y);
  const across=(x,y)=>Math.abs(x-nx)+Math.abs(y-ny)===2&&(x===nx||y===ny)&&!warpAt(x,y)&&!!(Z.legend[at((x+nx)/2,(y+ny)/2)]||{}).over;  // someone behind a counter (over:1): across it, as a player talks to them
  if(!await reach(bfs(next)?next:across,k))return;
  await face(dirTo(nx,ny));
  log(`== ${n.name} [${C.questText()}]`);
  check($('btnA').classList.contains('ready'),'A button should glow facing '+k);
  if(opts.shotBefore)await shot(opts.shotBefore);
  await key(' ');await until(()=>!!dlg,800);check(!!dlg,'no dialog from '+k);
  await finishDialog(opts);
 }
 async function inspect(zone,x,y,opts={}){
  await goZone(zone);if(!await reach((a,b)=>Math.abs(a-x)+Math.abs(b-y)===1&&!warpAt(a,b),`${x},${y}`))return;
  await face(dirTo(x,y));log(`== inspect ${zone} ${x},${y}`);await key(' ');await until(()=>!!dlg,800);
  if(opts.shot)await shot(opts.shot);await finishDialog(opts);
 }
 async function bump(zone,ch){ // walk up to a locked door and push against it
  await goZone(zone);const save={};
  for(const [k,w] of Object.entries(Z.warps||{}))if(w.lock){save[k]=w.lock;w.lock=null}
  const p=bfs((x,y)=>at(x,y)===ch);for(const [k,l] of Object.entries(save))Z.warps[k].lock=l;
  check(!!p,'no path to door '+ch);if(!p)return;await walk(p.slice(0,-1));
  await key(ARROW[p[p.length-1]],80);await wait(60);
  check(!$('toast').hidden,'locked door should say why');log('door says: '+$('toast').textContent);
 }

 /* fresh run of this chapter */
 if($('mePanel')&&!$('mePanel').hidden){ // first time ever: make a character, then the intro starts
  check($('meOpts').querySelectorAll('[data-k]').length>=10,'나 꾸미기 shows the options');
  $('meOpts').querySelector('[data-k="style"][data-v="bob"]').click();$('meOpts').querySelector('[data-k="hair"]:nth-child(3)').click();await wait(80);
  await shot('00-make-me');$('meOk').click();await wait(400);check($('mePanel').hidden&&player.look.style==='bob','the chosen look is the player\'s')}
 if(dlg){await key('z');}
 await wait(400);
 for(const s of steps){
  try{
   if(s.intro){log('== intro');await until(()=>!!dlg,1500);if(s.shot)await shot(s.shot);await finishDialog()}
   else if(s.talk)await talk(s.talk,s);
   else if(s.greet){const n=C.NPC[s.greet];await goZone(n.zone);await until(()=>!!dlg,1500);  // a room's greeting: they talk first, as you walk in
    check(!!dlg&&dlg.npc===n,`${s.greet} greets you walking into ${n.zone}`);log(`== ${n.name} greets you [${C.questText()}]`);if(s.shotBefore)await shot(s.shotBefore);await finishDialog(s)}
   else if(s.inspect)await inspect(...s.inspect,s);
   else if(s.bump)await bump(...s.bump);
   else if(s.look){ // walk to the nearest object that says something (things or spots) in that zone, A → its blurb
     if(s.look!==true)await goZone(s.look);const T=Z.things||{},S=Z.spots||{};
     const hit=(x,y)=>!npcAt(x,y)&&at(x,y)!=null&&!(Z.legend[at(x,y)]||{}).walk&&(T[at(x,y)]||S[x+','+y]);let tx,ty;
     const p=bfs((x,y)=>{for(const [dx,dy] of Object.values(D))if(hit(x+dx,y+dy)&&!warpAt(x,y)){tx=x+dx;ty=y+dy;return true}return false});
     check(!!p,"no reachable thing in "+ZID);if(p){await walk(p);await face(dirTo(tx,ty));await wait(80);
      check($('btnA').classList.contains('ready'),'A glows facing a thing');await key(' ');await until(()=>!!dlg,800);
      check(!!dlg,'inspecting a thing opens a blurb');log(`== look ${ZID} ${tx},${ty}`);if(s.shot)await shot(s.shot);await finishDialog()}}
   else if(s.walkTo){await goZone(s.walkTo[0]);await reach((x,y)=>x===s.walkTo[1]&&y===s.walkTo[2],'walkTo');if(s.then)await shot(s.then)}
   else if(s.clock){skew+=s.clock;log(`clock +${s.clock/3600e3}h · due ${dueWords().length}`)}
   else if(s.reviewTour){ // in-character review (C.REVIEW): with every word due, each person here who has a line asks it in their own voice, and it grades
     if(s.carry){for(const ch of CHAPTERS){if(ch===CH)break;const ws=ch.make().WORDS;store.set(ch.save,JSON.stringify({badges:ws,lv:Object.fromEntries(ws.map(w=>[w,{b:1,due:0}]))}))}refreshCarry()}  // carry:1 — as if the earlier 교시 were played: their words come along
     skew+=40*24*3600e3;const zones=s.reviewTour===true?[ZID]:[].concat(s.reviewTour);let asked=null,n=0;
     const real=window.reviewPick;window.reviewPick=p=>(asked=real(p));
     const open=new Set([ZID]),q0=[ZID];while(q0.length){const z=q0.shift();for(const w of Object.values(C.ZONES[z].warps||{}))if(C.ZONES[w.to]&&!(w.lock&&w.lock())&&!open.has(w.to)){open.add(w.to);q0.push(w.to)}}  // zones you can walk to now
     for(const z of zones)for(const [k,p] of Object.entries(C.NPC)){
      if(!open.has(z)||p.zone!==z||(p.hide&&p.hide())||!reviewLines(p).length)continue;
      const own=usual(p);if(!own||own.some(moves)||(p.script&&p.script()))continue;
      if(!p.status)check(status(p)==='review',`${k} has a due line, so shows the review mark`);  // a person's own status rule may hide marks
      asked=null;const lvBefore=JSON.stringify(state.lv);await talk(k,s);
      const q=asked&&asked[asked.length-1];
      check(!!q,`${k} (${p.name}) asks a review line`);if(!q)continue;n++;
      check(q.who!=='…',`${k}: the line is theirs (or a thought), not the narrator's`);
      check(JSON.stringify(state.lv)!==lvBefore,`${k}: answering "${q.w}" grades it`);
      log(`   review by ${p.name}: ${q.w} · ${q.ask}`)}
     window.reviewPick=real;check(n>0||s.none,'review tour: somebody reviewed');log(`review tour: ${n} people`)}
   else if(s.hearTour){ // nothing due: people with a line you haven't heard say it as plain talk, the word filled in, ungraded
     for(const L of Object.values(state.lv)){L.due=Date.now()+1e12;L.beat=null}save();  // nothing due: plain talk, not reviews
     const zones=[].concat(s.hearTour);let n=0;
     const open=new Set([ZID]),q0=[ZID];while(q0.length){const z=q0.shift();for(const w of Object.values(C.ZONES[z].warps||{}))if(C.ZONES[w.to]&&!(w.lock&&w.lock())&&!open.has(w.to)){open.add(w.to);q0.push(w.to)}}
     for(const z of zones)for(const [k,p] of Object.entries(C.NPC)){
      if(!open.has(z)||p.zone!==z||(p.hide&&p.hide())||reviewLines(p).length||!linesFor(p).some(unheard))continue;
      const own=usual(p);if(!own||own.some(moves)||(p.script&&p.script()))continue;
      const h=heard().length,lvBefore=JSON.stringify(state.lv);await talk(k);n++;
      check(heard().length===h+1,`${k} (${p.name}) says a line you hadn't heard`);
      check(JSON.stringify(state.lv)===lvBefore,`${k}: plain talk doesn't grade anything`);
      log(`   heard from ${p.name}: ${heard()[heard().length-1]}`)}
     check(n>0||s.none,'hear tour: somebody had a line you hadn\'t heard');log(`hear tour: ${n} people`)}
   else if(s.pause){await wait(s.pause);if(s.shot)await shot(s.shot)}
   else if(s.check){check(s.check(),s.msg)}
   else if(s.log){log(s.log())}
   else if(s.panel){$('logBtn').click();await wait(200);if(s.shot)await shot(s.shot);check(!$('panel').hidden,'log panel opens');await key('x')}
   else if(s.talklog){$('talkBtn').click();await wait(250);const n=$('talkList').querySelectorAll('.tl').length;check(!$('talkPanel').hidden&&n>5,'conversation log lists '+n+' lines');
     if(s.shot)await shot(s.shot);const w=[...$('talkList').querySelectorAll('.w')].sort((a,b)=>b.textContent.length-a.textContent.length)[0];w.click();await wait(150);
     check(!$('gloss').hidden,'tapping a word in the log opens the dictionary: '+w.textContent);if(s.shot)await shot(s.shot+'-tap');await key('x');await key('x');check($('talkPanel').hidden,'B closes the log')}
   else if(s.start){$('startBtn').click();await wait(200);check(!$('startPanel').hidden,'START opens the menu');
     check($('startPanel').querySelectorAll('.mi').length===11,'menu has 대화 · 사전 · 교시 고르기 · 나 꾸미기 · 읽기 · 소리 · 듣기 문제 · 쓰기 문제 · 음악 · 문제 알리기 · 디버그');if(s.shot)await shot(s.shot);
     await key('x');check($('startPanel').hidden,'B closes the menu');
     $('startBtn').click();await wait(120);$('tapBtn').click();await wait(200);check($('startPanel').hidden&&!$('tapPanel').hidden,'a menu item closes the menu and opens its panel');await key('x');check(!$('startPanel').hidden,'closing it goes back to the menu');await key('x')}
   else if(s.taps){$('tapBtn').click();await wait(250);const rows=[...$('tapList').querySelectorAll('.tp')];
     check(!$('tapPanel').hidden&&rows.length>0,'찾아본 말 lists '+rows.length+' tapped words');log('taps: '+rows.map(r=>r.querySelector('.tph').textContent).join(' | '));
     if(rows[0]){rows[0].click();await wait(80);check(!rows[0].querySelector('.tpe').hidden,'tapping a looked-up word shows its English')}
     if(s.shot)await shot(s.shot);$('tapSortN').click();await wait(120);check($('tapSortN').classList.contains('on'),'sort by count');
     await key('x');check($('tapPanel').hidden,'B closes 찾아본 말')}
   else if(s.chapters){$('chBtn').click();await wait(200);if(s.shot)await shot(s.shot);await key('x')}
   else if(s.shot)await shot(s.shot);
  }catch(e){ERR.push('driver: '+e.message)}
 }
 log('END quest: '+C.questText());
 window.__done=true;console.log('DONE');
};

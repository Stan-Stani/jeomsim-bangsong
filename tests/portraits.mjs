// Gallery of every chapter NPC's talk portrait in all expressions (closed + open mouth) → tests/shots/portraits-<ch>.png
import {spawn} from 'node:child_process';import fs from 'node:fs';import path from 'node:path';import os from 'node:os';
const ch=process.argv[2]||'ch1';const root=path.resolve(path.dirname(new URL(import.meta.url).pathname),'..');
const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'pg-'));fs.copyFileSync(path.join(root,'index.html'),path.join(tmp,'index.html'));
const port=9800+Math.floor(Math.random()*150);
const chrome=spawn('flatpak',['run','--nodevice=all',`--filesystem=${tmp}`,'com.google.Chrome','--headless=new','--mute-audio','--disable-gpu',`--remote-debugging-port=${port}`,`--user-data-dir=${tmp}/prof`,'about:blank'],{stdio:'ignore'});
const reap=()=>{try{spawn('pkill',['-9','-f',`user-data-dir=${tmp}/prof`])}catch(e){}};process.on('exit',reap);
const wait=ms=>new Promise(r=>setTimeout(r,ms));let ws;
for(let i=0;i<60&&!ws;i++){await wait(500);try{const l=await (await fetch(`http://127.0.0.1:${port}/json`)).json();const p=l.find(x=>x.type==='page');if(p)ws=p.webSocketDebuggerUrl}catch(e){}}
const sock=new WebSocket(ws);await new Promise(r=>sock.onopen=r);let id=0;const pend={};sock.onmessage=m=>{const d=JSON.parse(m.data);if(d.id&&pend[d.id]){pend[d.id](d.result||d);delete pend[d.id]}};
const cdp=(m,p={})=>new Promise(r=>{const i=++id;pend[i]=r;sock.send(JSON.stringify({id:i,method:m,params:p}))});
await cdp('Emulation.setDeviceMetricsOverride',{width:1100,height:1400,deviceScaleFactor:1,mobile:false});
await cdp('Page.navigate',{url:`file://${tmp}/index.html?ch=${ch}&f=${process.argv[3]||''}`});await wait(2500);
const r=await cdp('Runtime.evaluate',{expression:`(()=>{const faces=(new URLSearchParams(location.search).get('f')||'idle,happy,sad,surprised,angry,think').split(',');
 const seen=new Set(),npcs=Object.values(C.NPC).filter(n=>n.look&&!seen.has(n.name)&&seen.add(n.name));
 document.body.innerHTML='';document.body.style.cssText='background:#e8e4da;margin:0;padding:8px;font:12px sans-serif';
 for(const n of npcs){const row=document.createElement('div');row.style.cssText='display:flex;align-items:center;gap:6px;margin:2px 0';
  row.append(Object.assign(document.createElement('span'),{textContent:n.name,style:'width:110px'}));
  for(const f of faces)for(const o of [false,true]){const cv=document.createElement('canvas');cv.width=48;cv.height=48;cv.style.cssText='width:120px;height:120px;image-rendering:pixelated;background:#fff';drawPortrait(cv,n.look,f,o);row.append(cv)}
  document.body.append(row)}return npcs.length})()`,returnByValue:true});
await wait(300);const shot=await cdp('Page.captureScreenshot',{format:'png'});fs.mkdirSync(path.join(root,'tests/shots'),{recursive:true});
fs.writeFileSync(path.join(root,`tests/shots/portraits-${ch}.png`),Buffer.from(shot.data,'base64'));console.log('portraits of',r.result?.value,'NPCs → tests/shots/portraits-'+ch+'.png');reap();process.exit(0);

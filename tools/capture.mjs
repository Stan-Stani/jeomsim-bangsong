// Capture what KakaoPage's public viewer shows for a free episode: open it logged out at phone width, scroll one
// screen at a time at a reader's pace, and save each screen. Usage: node tools/capture.mjs <viewerId> <outDir>
// (Reads only pages anyone can open without an account. Screens stay in source/, which is gitignored.)
import {spawn} from 'node:child_process';import fs from 'node:fs';import path from 'node:path';import os from 'node:os';
const [,,vid,out]=process.argv;fs.mkdirSync(out,{recursive:true});
const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'kp-'));const port=9300+Math.floor(Math.random()*500);
const chrome=spawn('flatpak',['run','--nodevice=all',`--filesystem=${tmp}`,'com.google.Chrome','--headless=new','--mute-audio','--disable-gpu','--hide-scrollbars',
 `--remote-debugging-port=${port}`,`--user-data-dir=${tmp}/prof`,'about:blank'],{stdio:'ignore'});
const reap=()=>{try{spawn('pkill',['-9','-f',`user-data-dir=${tmp}/prof`])}catch(e){}};process.on('exit',reap);
const wait=ms=>new Promise(r=>setTimeout(r,ms));
let ws;for(let i=0;i<60&&!ws;i++){await wait(500);try{const l=await (await fetch(`http://127.0.0.1:${port}/json`)).json();const p=l.find(x=>x.type==='page');if(p)ws=p.webSocketDebuggerUrl}catch(e){}}
const sock=new WebSocket(ws);await new Promise(r=>sock.onopen=r);let id=0;const pend={};
sock.onmessage=m=>{const d=JSON.parse(m.data);if(d.id&&pend[d.id]){pend[d.id](d.result||d);delete pend[d.id]}};
const cdp=(method,params={})=>new Promise(r=>{const i=++id;pend[i]=r;sock.send(JSON.stringify({id:i,method,params}))});
const W=480,H=900;
await cdp('Emulation.setDeviceMetricsOverride',{width:W,height:H,deviceScaleFactor:2,mobile:true});
await cdp('Page.enable');await cdp('Page.navigate',{url:`https://page.kakao.com/content/55901018/viewer/${vid}`});await wait(8000);
const ev=async e=>(await cdp('Runtime.evaluate',{expression:e,returnByValue:true})).result?.value;
// the comic is the column of lazy images from page-edge.kakao.com; find its top and bottom
const span=async()=>ev(`(()=>{const im=[...document.images].filter(i=>i.src.includes('page-edge.kakao.com'));if(!im.length)return null;
  const a=im[0].getBoundingClientRect(),b=im[im.length-1].getBoundingClientRect();return {top:a.top+scrollY,bottom:b.bottom+scrollY,n:im.length}})()`);
let s=await span();if(!s){console.error('no comic images found (episode not free without login?)');process.exit(2)}
let y=Math.max(0,s.top),n=0;
while(true){
  await ev(`window.scrollTo(0,${y})`);await wait(1600);  // let lazy images load, at a reading pace
  const shot=await cdp('Page.captureScreenshot',{format:'jpeg',quality:82});
  fs.writeFileSync(path.join(out,`s${String(n).padStart(3,'0')}.jpg`),Buffer.from(shot.data,'base64'));n++;
  s=await span();if(y+H>=s.bottom||n>400)break;y+=H-80;  // 80px overlap so no line is cut in half
}
console.log(`captured ${n} screens of ${s.n} images → ${out}`);sock.close();reap();process.exit(0);

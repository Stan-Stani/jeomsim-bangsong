/* 느티고, one school for every 교시. SCHOOL(spec) gives a 교시 fresh copies of the school's zones — yard (운동장, with the 체육관
   building), hall (1층: 교무실, 교장실, 2학년 3반, 급식실, 방송실, 신발장, stairs up), hall2 (2층: 음악실, 도서관, 3학년 교실, stairs
   down), class (2학년 3반), cafe (급식실 + 매점), bcast (방송실), music (음악실), gym (체육관), library (도서관) — with their maps,
   doors and default inspect lines. The 교시 opens the rooms it uses (others stay locked), adds its people, spots, locks (by the
   room a door leads to) and lines, and may paint a few squares for an event (4교시's festival stage) — but never moves a wall or
   a door: tests/validate.mjs checks every 교시's school against this one. SCHOOL_TILES draws it (a 교시's own tile of the same
   name wins, so its art can differ; the layout can't). Generated from the 1교시–3교시 originals; edit here. */
(function(){
function face(X,Y){const G=ZID==='gym';r(X,Y,16,16,'#EDE3CF');r(X,Y,16,1,'#F8F2E6');r(X,Y+11,16,5,G?'#5A8FB0':'#8FB8A0');r(X,Y+11,16,1,G?'#7AAFD0':'#B1D3BE');r(X,Y+15,16,1,G?'#3E6E90':'#6E9A82')}  /* the 체육관's wainscot is blue */
function cap(X,Y,x,y){r(X,Y,16,16,'#6B6157');r(X,Y,16,1,'#81766A');r(X,Y+15,16,1,'#5A5148');if(hash(x,y)<25)r(X+3+hash(y,x)%9,Y+5+hash(x,y)%6,2,1,'#74695E')}
function woodF(X,Y,x,y){r(X,Y,16,16,'#C99A62');for(let j=3;j<16;j+=4)r(X,Y+j,16,1,'#B5854F');const h=hash(x,y);r(X+(h%12)+2,Y+(h%4)*4,1,3,'#B5854F');r(X+(h*7%13),Y+((h>>2)%4)*4+1,2,1,'#D6AA74')}
function hallF(X,Y,x,y){r(X,Y,16,16,'#C9CCC0');r(X,Y,16,1,'#B9BCB0');r(X,Y,1,16,'#B9BCB0');const h=hash(x,y);r(X+h%13+1,Y+(h>>3)%13+1,1,1,'#A9AD9F');r(X+(h*3)%14+1,Y+(h*7)%14+1,1,1,'#DCDED4')}
function checkF(X,Y,x,y){r(X,Y,16,16,'#D8D2C2');r(X,Y,8,8,'#CBC4B2');r(X+8,Y+8,8,8,'#CBC4B2')}
function oldF(X,Y,x,y){r(X,Y,16,16,'#8E6E4E');for(let j=3;j<16;j+=5)r(X,Y+j,16,1,'#7A5C40');const h=hash(x,y);r(X+h%14,Y+(h>>2)%14,2,1,'#A58A6C');if(h<30)r(X+(h*5)%13,Y+(h*3)%13,1,1,'#B9A488')}
function sandF(X,Y,x,y){r(X,Y,16,16,'#D9BC8C');const h=hash(x,y);r(X+h%14+1,Y+(h>>3)%14+1,1,1,'#C4A574');r(X+(h*3)%14+1,Y+(h*7)%14+1,1,1,'#E8D3AA');if(h<20)r(X+(h*11)%13+1,Y+(h*5)%13+1,2,1,'#BFA06E')}
function bldg(X,Y,x,y){r(X,Y,16,16,'#E9E1D0');if(y===0){r(X,Y+6,16,10,'#E9E1D0');r(X,Y,16,6,'#7E8C8A');r(X,Y,16,1,'#9AA8A6');r(X,Y+6,16,1,'#5F6B6A')}
 else{r(X+3,Y+3,10,9,'#5E7F8E');r(X+4,Y+4,8,7,'#A9D8EC');r(X+8,Y+4,1,7,'#5E7F8E');r(X+5,Y+5,2,1,'#E6F6FC');if(y===3)r(X,Y+14,16,2,'#B9AE98')}}
function blockOrigin(x,y,ch){let ox=x,oy=y;while(at(ox-1,y)===ch)ox--;while(at(x,oy-1)===ch)oy--;return [ox,oy]}
function inTile(X,Y,fn){g.save();g.beginPath();g.rect(X,Y,16,16);g.clip();fn();g.restore()}
const disc=(cx,cy,rad,c)=>{g.fillStyle=c;g.beginPath();g.arc(cx,cy,rad,0,Math.PI*2);g.fill()};
function courtF(X,Y,x,y){r(X,Y,16,16,'#D6A466');for(let j=3;j<16;j+=4)r(X,Y+j,16,1,'#C99556');const h=hash(x,y);r(X+(h%12)+2,Y+(h%4)*4+1,3,1,'#E2B477');
 if(x>=2&&x<=21&&y>=2&&y<=9){const L='#F4F1E6';
  if(y===2)r(X,Y,16,1,L);if(y===9)r(X,Y+15,16,1,L);if(x===2)r(X,Y,1,16,L);if(x===21)r(X+15,Y,1,16,L);if(x===11)r(X+15,Y,1,16,L);if(x===12)r(X,Y,1,16,L);
  if(x>=10&&x<=13&&y>=4&&y<=7)inTile(X,Y,()=>{g.strokeStyle=L;g.lineWidth=1;g.beginPath();g.arc(X-(x-12)*16,Y-(y-6)*16,22,0,Math.PI*2);g.stroke()})}}
function carpetF(X,Y,x,y){r(X,Y,16,16,'#7F9073');r(X,Y,8,8,'#78896C');r(X+8,Y+8,8,8,'#78896C');const h=hash(x,y);if(h<30)r(X+h%14+1,Y+(h>>2)%14+1,1,1,'#8E9F82')}
const STREET={pal:{L:'rgba(60,66,72,.55)',k:'#3C4248',Q:'#6E8FB0',b:'#7E3E2E',B:'#9A4E3A',V:'#C9DCE6',Y:'#F2D27A',d:'#5A4636',
  P:'#9AA0A6',X:'#5E646A',A:'#C9D2D8',a:'#AEB8C0',W:'#E6DCC8',w:'#BDB3A0',S:'#2E9C8E',s:'#F4F1E6',G:'#D8E8EE',e:'#8E979C',
  g:'#8C8F92',m:'#E8E4D8',
  n:'#2B6CB0',o:'#F4F1E6',H:'#F4F6E8',x:'#D9534F',y:'#F2C94C',u:'#E8E4D8',U:'#3E8E5A',p:'#6F757C',t:'#C9CED3',c:'#C0392B'},
 rows:['..........QQ....LPLLAAA...AAAA.....QQ...........................',
       'L.bbbbbbbbQQbb.LLPXLAaALkLAaAALLLwwwQwwwwwwwwwwLLLLLLLLLLLLLLLLL',
       '..BVVBBVVBBVVB...P..WWWWWWWWWWW..WVVWWVVWWVVWW..................',
       '..BBBBBBBBBBBB...P..WVVWVVWVVWW..WWWWWWWWWWWWW..nnoonnnnnn.uUUu.',
       '..BVYBBVVBBYVB...P..SSSSsSSSsSS..WVVWWYVWWVVWW..HHHHHHHHHH..p...',
       '..BBBBBBBBBBBB...P..GGGGGeGGGGG..WWWWWWWWWWWWW..HxyHHyxHHH.tttt.',
       '..BVVBBddBBVVB...P..GGdGGeGGGGG..WVVWWdddWWVVW..HHdHHHHHHH.c..c.',
       'gggmggggggmggggggmggggggmggggggmggggggmggggggmgggggmggggggmggggg']};

/* a name plate on the wall beside a door, spread over the run of plate tiles (2 tiles: room for 3 syllables) */
function roomPlate(X,Y,x,y,text){face(X,Y);const c=at(x,y);let a=x,b=x;while(at(a-1,y)===c)a--;while(at(b+1,y)===c)b++;const L=x===a,R=x===b;
 r(X+(L?2:0),Y+3,16-(L?2:0)-(R?2:0),12,'#8A8E96');r(X+(L?3:0),Y+4,16-(L?3:0)-(R?3:0),10,'#F4F1E6');SIGN_TEXT(X,Y,x,a,b,4,text,'#2F3A44')}
const WALLISH=new Set(['sayeonSlot','wall','board','timetable','sideWin','streetWin','hallWin','classWin','notice','speaker','classDoor','exitDoor','cafDoor','bcDoor','bcSign','classSign','officePlate','princPlate','stairSign','menu','snacks','rack','onair','poster','lockers','shoes','stairs','musicDoor','libDoor','sayeon','staffBoard','portraits','gymWin','hoop','bookWall','libWin']);
const wallish=(x,y)=>{const c=at(x,y);if(c==null)return true;const L=Z.legend[c];return !!L&&WALLISH.has(L.tile)};
/* 학교 앞's shops by column: 문구점 0–6, 분식집 8–13, 편의점 15–20, 코인 노래방 22–27 (brick between; the 학원 from 29) */
const SHOP=x=>x<7?0:x>7&&x<14?1:x>14&&x<21?2:x>21&&x<28?3:-1;
const SHOPC=[['#4F7AA8','#6E96C2','#3A5E86'],['#C8443A','#E0655A','#9A3028'],['#3F8F5A','#5DB070','#2E6E44'],['#6B3FA0','#8A5EC0','#4A2A78']];
const SHOPN=['느티 문구','엄마손 분식','24시 편의점','코인 노래방'];
function paveF(X,Y,x,y){r(X,Y,16,16,'#C9C6BC');r(X,Y,16,1,'#B3B0A6');r(X,Y+8,16,1,'#B3B0A6');r(X+(y%2?4:12),Y,1,8,'#B3B0A6');r(X+(y%2?12:4),Y+8,1,8,'#B3B0A6');
 const h=hash(x,y);if(h<30)r(X+h%13+1,Y+(h>>2)%6+1,2,1,'#D8D5CC')}
/* evening by the 교시's clock (C.clock): street lamps and the 학원's windows light up */
const evening=()=>{const [h]=C.clock?C.clock():[12,30];return h>=5&&h<8};
const TILES={
 wall:(X,Y,x,y)=>{if(!wallish(x,y+1)||(y===MH-1&&!wallish(x,y-1)))face(X,Y);else cap(X,Y,x,y)},
  wood:(X,Y,x,y)=>woodF(X,Y,x,y),
 hallFloor:(X,Y,x,y)=>hallF(X,Y,x,y),
 checkFloor:(X,Y,x,y)=>checkF(X,Y,x,y),
 oldFloor:(X,Y,x,y)=>oldF(X,Y,x,y),
 sand:(X,Y,x,y)=>sandF(X,Y,x,y),
 doorway:(X,Y,x,y)=>{checkF(X,Y,x,y);r(X,Y,2,16,'#A9794A');r(X+14,Y,2,16,'#A9794A');r(X+2,Y,12,2,'#B9BCB0')},
  hallFloor:(X,Y,x,y)=>hallF(X,Y,x,y),
 checkFloor:(X,Y,x,y)=>checkF(X,Y,x,y),
 oldFloor:(X,Y,x,y)=>oldF(X,Y,x,y),
 sand:(X,Y,x,y)=>sandF(X,Y,x,y),
 doorway:(X,Y,x,y)=>{checkF(X,Y,x,y);r(X,Y,2,16,'#A9794A');r(X+14,Y,2,16,'#A9794A');r(X+2,Y,12,2,'#B9BCB0')},
  checkFloor:(X,Y,x,y)=>checkF(X,Y,x,y),
 oldFloor:(X,Y,x,y)=>oldF(X,Y,x,y),
 sand:(X,Y,x,y)=>sandF(X,Y,x,y),
 doorway:(X,Y,x,y)=>{checkF(X,Y,x,y);r(X,Y,2,16,'#A9794A');r(X+14,Y,2,16,'#A9794A');r(X+2,Y,12,2,'#B9BCB0')},
  oldFloor:(X,Y,x,y)=>oldF(X,Y,x,y),
 sand:(X,Y,x,y)=>sandF(X,Y,x,y),
 doorway:(X,Y,x,y)=>{checkF(X,Y,x,y);r(X,Y,2,16,'#A9794A');r(X+14,Y,2,16,'#A9794A');r(X+2,Y,12,2,'#B9BCB0')},
  sand:(X,Y,x,y)=>sandF(X,Y,x,y),
 doorway:(X,Y,x,y)=>{checkF(X,Y,x,y);r(X,Y,2,16,'#A9794A');r(X+14,Y,2,16,'#A9794A');r(X+2,Y,12,2,'#B9BCB0')},
  doorway:(X,Y,x,y)=>{checkF(X,Y,x,y);r(X,Y,2,16,'#A9794A');r(X+14,Y,2,16,'#A9794A');r(X+2,Y,12,2,'#B9BCB0')},
  board:(X,Y,x,y)=>{face(X,Y);const L=at(x-1,y)!=='B',R=at(x+1,y)!=='B';r(X,Y+1,16,11,'#8A5E36');r(X+(L?2:0),Y+2,16-(L?2:0)-(R?2:0),9,'#2F5A46');
  const h=hash(x,y),c='#E3ECE4';if(!L&&!R){r(X+2+h%5,Y+4,6,1,c);r(X+3,Y+7,4+h%6,1,c);if(h%3===0)r(X+10,Y+5,2,2,'#F2C46B')}
  if(L){r(X+4,Y+4,2,1,c);r(X+7,Y+4,3,1,c);r(X+4,Y+6,8,1,'#C9D6CC')}if(R){r(X+3,Y+4,1,5,'#F2A38A');r(X+5,Y+5,6,1,c)}
  r(X,Y+12,16,1,'#B98E58');r(X+3+h%8,Y+11,2,1,'#FFFFFF')},
  timetable:(X,Y)=>{face(X,Y);r(X+3,Y+1,10,9,'#F4F1E6');r(X+3,Y+1,10,2,'#E07A5A');for(let i=0;i<3;i++)r(X+4,Y+4+i*2,8,1,'#C9C2B0');r(X+7,Y+3,1,7,'#C9C2B0')},
  sideWin:(X,Y,x,y,t)=>{cap(X,Y,x,y);r(X+4,Y,8,16,'#EDE3CF');r(X+5,Y,6,16,'#A9D8EC');r(X+6,Y,1,16,'#D6F0FA');r(X+5,Y+15,6,1,'#EDE3CF');
  if(hash(x,y)%3===0){const s=Math.round(Math.sin(t/900+y));r(X+8+s,Y+4,3,3,'#6FA86A')}if(y%4===1)r(X+5,Y,6,4,'#F2E2B0')},
  streetWin:(X,Y,x,y,t)=>{cap(X,Y,x,y);r(X+3,Y,10,16,'#E2D8C2');r(X+4,Y,8,16,'#B4C3C6');  // a wider pane than sideWin: 8px of view
  const v=STREET.east||(STREET.east=ART.rot(STREET.rows,1)),o=(y%4)*16;ART.put(v.slice(o,o+16),STREET.pal,X+4,Y);
  g.fillStyle='rgba(225,240,248,.28)';g.fillRect(X+4,Y,8,16);  /* glass */
  r(X+3,Y,10,2,'#E2D8C2');r(X+3,Y+2,10,1,'#B9AE98');r(X+3,Y,1,16,'#B9AE98');r(X+12,Y,1,16,'#F2EBDD');  /* pane bar at each tile, frame with a lit sill edge */
  r(X+5,Y+4,1,3,'rgba(255,255,255,.55)');r(X+6,Y+3,1,2,'rgba(255,255,255,.55)')},
  desk:(X,Y,x,y)=>{r(X+1,Y+2,14,7,'#E3C08A');r(X+1,Y+2,14,1,'#F0D6A8');r(X+1,Y+8,14,1,'#B98E58');r(X+2,Y+9,1,4,'#6F757C');r(X+13,Y+9,1,4,'#6F757C');
  if(!(C.seatPulled&&C.seatPulled(x,y))){r(X+4,Y+11,8,4,'#4F6F8F');r(X+4,Y+11,8,1,'#6C8DAD')}/* the chair, tucked in */const h=hash(x,y);if(h<40)r(X+3,Y+3,4,4,['#E07A5A','#5A8FB0','#7CB46A'][h%3]);if(h%3===0)r(X+9,Y+5,4,1,'#E8B93A')},
  tdesk:(X,Y,x,y)=>{r(X,Y+3,16,11,'#9C6B3E');r(X,Y+3,16,3,'#B9844F');r(X,Y+3,16,1,'#CF9E66');r(X+2,Y+9,12,1,'#7E5430');r(X+3,Y+1,3,4,'#F2F0EA');r(X+9,Y+3,5,2,'#F4F1E6')},
  lockers:(X,Y,x,y)=>{r(X,Y,16,16,'#8E9BA8');r(X,Y,16,1,'#B3BEC9');const h=hash(x,y);
  [[1,1],[9,1],[1,8],[9,8]].forEach(([a,b],i)=>{r(X+a,Y+b,6,6,'#6E7B88');r(X+a,Y+b,6,1,'#5E6A76');if((h+i)%3===0)r(X+a+1,Y+b+2,4,4,['#E07A5A','#3E5E8C','#7CB46A','#F2C46B'][(h+i)%4]);r(X+a+5,Y+b+3,1,1,'#C9D2DA')})},
  piggy:(X,Y,x,y)=>{r(X+3,Y+10,10,2,'#8E9BA8');r(X+3,Y+10,10,1,'#B3BEC9');r(X+4,Y+12,1,4,'#6F757C');r(X+11,Y+12,1,4,'#6F757C');
  r(X+4,Y+3,8,7,'#F2A0B0');r(X+3,Y+4,10,5,'#F2A0B0');r(X+5,Y+3,4,1,'#F9C9D2');r(X+6,Y+2,4,1,'#8A4A58');r(X+4,Y+2,2,2,'#E07A8E');
  r(X+12,Y+5,3,3,'#E07A8E');r(X+13,Y+6,1,1,'#8A4A58');r(X+10,Y+4,1,1,'#1B1E2B');r(X+5,Y+6,4,2,'#FFFFFF');r(X+4,Y+9,2,1,'#E07A8E');r(X+10,Y+9,2,1,'#E07A8E')},
  classDoor:(X,Y,x,y)=>{face(X,Y);r(X+2,Y+1,12,15,'#A9794A');r(X+2,Y+1,12,1,'#C4925F');r(X+4,Y+3,8,5,'#BFE3F0');r(X+5,Y+4,2,1,'#E6F6FC');r(X+11,Y+10,2,2,'#5A3E26')},
  classWin:(X,Y,x,y)=>{face(X,Y);r(X+1,Y+1,14,9,'#F8F2E6');r(X+2,Y+2,12,7,'#C9D6CC');r(X+3,Y+6,4,2,'#C99A62');r(X+9,Y+6,4,2,'#C99A62');r(X+8,Y+2,1,7,'#F8F2E6')},
  hallWin:(X,Y,x,y,t)=>{face(X,Y);r(X+1,Y+1,14,10,'#F8F2E6');r(X+2,Y+2,12,8,'#A9D8EC');const s=Math.round(Math.sin(t/1100+x));r(X+2,Y+6+s,12,4-s,'#6FA86A');r(X+5,Y+5+s,4,2,'#86BE7C');
  r(X+8,Y+2,1,8,'#F8F2E6');r(X+3,Y+3,2,1,'#E6F6FC');if(ZID==='bcast'){g.fillStyle='rgba(180,170,150,.45)';g.fillRect(X+2,Y+2,12,8)}},
  notice:(X,Y,x,y)=>{face(X,Y);const L=at(x-1,y)!=='N';r(X+(L?1:0),Y+1,L?15:15,10,'#8A5E36');r(X+(L?2:0),Y+2,L?14:14,8,'#C49A6C');
  if(L){r(X+3,Y+3,5,6,'#F4F1E6');r(X+9,Y+4,4,4,'#F2C46B');r(X+5,Y+3,1,1,'#D2533F')}else{r(X+1,Y+3,6,4,'#BFE3F0');r(X+8,Y+3,4,6,'#F4F1E6');r(X+9,Y+8,3,2,'#F4F1E6');r(X+10,Y+3,1,1,'#3A86C8')}},
  speaker:(X,Y,x,y,t)=>{face(X,Y);r(X+4,Y+1,8,7,'#D8D4CA');r(X+4,Y+1,8,1,'#ECE9E1');r(X+4,Y+8,8,1,'#9A968C');for(let i=0;i<3;i++)for(let j=0;j<2;j++)r(X+5+i*2,Y+3+j*2,1,1,'#7A766C');
  if(state.f.done&&!state.f.quiet){const p=Math.floor(t/250)%3;  // sound only during the ending scene; each 교시's first DONE line sets quiet
  r(X+13,Y+3,1,3,p>0?'#E8962A':'#EDE3CF');r(X+14+(p>1?1:0),Y+2,1,5,p>1?'#E8962A':'#EDE3CF');r(X+2,Y+3,1,3,p>0?'#E8962A':'#EDE3CF')}},
  cabinet:(X,Y,x,y)=>{r(X+1,Y+1,14,15,'#9AA3AD');r(X+1,Y+1,14,1,'#B9C1C9');[5,10].forEach(b=>r(X+2,Y+b,12,1,'#7A838D'));[3,8,13].forEach(b=>r(X+7,Y+b,2,1,'#5A626B'))},
  water:(X,Y,x,y)=>{r(X+4,Y+4,8,12,'#F2F0EA');r(X+4,Y+15,8,1,'#C9C6BC');r(X+5,Y,6,5,'#8FC8E8');r(X+6,Y+1,1,3,'#C4E6F6');r(X+6,Y+8,1,2,'#D2533F');r(X+9,Y+8,1,2,'#3A86C8');r(X+5,Y+11,6,1,'#9A968C')},
  plant:(X,Y,x,y)=>{r(X+5,Y+10,6,6,'#B5653A');r(X+5,Y+10,6,1,'#D07E52');r(X+3,Y+3,10,7,'#3F8F4A');r(X+5,Y+1,6,3,'#3F8F4A');r(X+5,Y+3,2,2,'#6CC07A');r(X+10,Y+6,2,2,'#6CC07A')},
  /* the 교무실's desks stand in back-to-back pairs: the north desk's teacher sits above it, so its monitor shows its back */
  odesk:(X,Y,x,y)=>{r(X,Y+4,16,10,'#8C96A0');r(X,Y+4,16,3,'#B9C2CA');r(X,Y+13,16,1,'#6A737C');const h=hash(x,y);
  if(h%2){r(X+4,Y,8,6,'#2B3238');if(at(x,y+1)==='k'){r(X+5,Y,6,1,'#69CFD8');r(X+5,Y+1,6,4,'#4A525C');r(X+5,Y+1,6,1,'#5E6772');r(X+6,Y+2,4,2,'#3E454E')}else r(X+5,Y+1,6,4,'#69CFD8');r(X+7,Y+6,2,1,'#2B3238')}else{r(X+2,Y+3,6,4,'#F4F1E6');r(X+3,Y+2,6,4,'#FFFFFF');r(X+11,Y+2,3,4,'#C8443A')}},
  trophy:(X,Y,x,y)=>{r(X+1,Y,14,16,'#7A5230');r(X+2,Y+1,12,6,'#5A3A20');r(X+2,Y+8,12,6,'#5A3A20');r(X+4,Y+2,4,2,'#E8B93A');r(X+3,Y+2,1,2,'#C9982A');r(X+8,Y+2,1,2,'#C9982A');r(X+5,Y+4,2,1,'#E8B93A');r(X+5,Y+5,2,1,'#C9982A');r(X+4,Y+6,4,1,'#B88A2A');r(X+4,Y+2,1,1,'#F7D98C');r(X+10,Y+3,3,2,'#C9C6C2');r(X+11,Y+5,1,1,'#A8A6A2');r(X+10,Y+6,3,1,'#8E8C88');r(X+10,Y+3,1,1,'#ECEAE6');r(X+13,Y+1,1,3,'#8FA6B4');
  r(X+3,Y+10,2,4,'#3E5E8C');r(X+5,Y+10,2,4,'#B8433A');r(X+7,Y+11,2,3,'#7CB46A');r(X+10,Y+9,3,5,'#F4F1E6')},
  pdesk:(X,Y,x,y)=>{r(X,Y+2,16,12,'#5E3A22');r(X,Y+2,16,3,'#7A4E2E');r(X,Y+2,16,1,'#93623C');r(X,Y+13,16,1,'#432817');
  if(at(x-1,y)==='K'){r(X+4,Y+2,8,2,'#E8B93A');r(X+5,Y+2,6,1,'#F7D98C')}else{r(X+9,Y-2,3,5,'#F4F1E6');r(X+8,Y-3,2,2,'#F2A38A');r(X+11,Y-3,2,2,'#E86D8A');r(X+3,Y+1,5,2,'#F4F1E6')}},
  sofa:(X,Y,x,y)=>{r(X+1,Y+2,14,12,'#2E2A2E');r(X+1,Y+2,14,4,'#4A444A');r(X+1,Y+2,2,12,'#3A353A');r(X+13,Y+2,2,12,'#3A353A');r(X+3,Y+7,10,1,'#5A545A')},
  lowTable:(X,Y,x,y)=>{r(X+2,Y+5,12,7,'#8A5E36');r(X+2,Y+5,12,1,'#A67444');r(X+4,Y+6,3,3,'#F2F0EA');r(X+5,Y+7,1,1,'#7CB46A');r(X+9,Y+7,3,3,'#F2F0EA');r(X+10,Y+8,1,1,'#7CB46A')},
  shoes:(X,Y,x,y)=>{face(X,Y);r(X,Y,16,16,'#B9905E');r(X,Y,16,1,'#D2A970');const h=hash(x,y);
  for(let i=0;i<3;i++)for(let j=0;j<2;j++){r(X+1+j*8,Y+1+i*5,6,4,'#7E5A34');if((h+i+j)%4)r(X+2+j*8,Y+3+i*5,4,2,(h+i)%3?'#F2F0EA':'#5A8FB0')}
  if(state.f.done&&x===2)r(X+3,Y+6,4,3,'#F2A38A')},
  exitDoor:(X,Y,x,y)=>{if(ZID==='bcast')oldF(X,Y,x,y);else checkF(X,Y,x,y);r(X,Y,16,16,'#6E7B88');r(X+1,Y+1,14,15,'#BFE3F0');r(X+2,Y+2,3,1,'#E6F6FC');const L=at(x-1,y)!==at(x,y);r(L?X+15:X,Y,1,16,'#6E7B88');r(L?X+12:X+3,Y+8,1,3,'#3A4046')},
  stairs:(X,Y,x,y)=>{r(X,Y,16,16,'#B8BCB0');for(let j=0;j<16;j+=4){r(X,Y+j,16,1,'#8E9286');r(X,Y+j+1,16,1,'#D2D6CA')}if(at(x-1,y)!=='S')r(X,Y,2,16,'#7A5A3A');if(at(x+1,y)!=='S')r(X+14,Y,2,16,'#7A5A3A')},
  cafDoor:(X,Y,x,y)=>{face(X,Y);const L=at(x-1,y)!==at(x,y);r(X+(L?2:0),Y+2,14,14,'#C27A4A');r(X+(L?2:0),Y+2,14,1,'#D9925E');r(X+(L?5:4),Y+5,6,4,'#BFE3F0');r(L?X+14:X+1,Y+9,1,3,'#5A3E26');if(L)r(X+10,Y,6,2,'#F2C46B');else r(X,Y,6,2,'#F2C46B')},
  bcDoor:(X,Y,x,y)=>{face(X,Y);const c=at(x,y),L=at(x-1,y)!==c,R=at(x+1,y)!==c;
   if(!(L&&R)){r(X+(L?2:0),Y+1,14,15,'#5A3E26');r(X+(L?3:0),Y+2,13,14,'#8E5E3A');r(X+(L?3:0),Y+2,13,1,'#A87448');r(L?X+15:X,Y+2,1,14,'#5A3E26');  /* a leaf of the same wooden door, two tiles wide (the 방송실 from inside) */
    r(X+(L?6:4),Y+3,6,4,'#2B2E36');r(X+(L?7:5),Y+4,2,1,'#5A6478');r(X+(L?6:4),Y+9,6,5,'#7A4E2E');r(L?X+13:X+1,Y+9,2,2,'#E8B93A');return}
   r(X+2,Y+1,12,15,'#5A3E26');r(X+3,Y+2,10,14,'#8E5E3A');r(X+3,Y+2,10,1,'#A87448');
  r(X+5,Y+3,6,4,'#2B2E36');r(X+6,Y+4,2,1,'#5A6478');r(X+5,Y+9,6,5,'#7A4E2E');r(X+6,Y+10,4,3,'#8E5E3A');
  r(X+11,Y+9,2,2,'#E8B93A');r(X+11,Y+9,2,1,'#F7D98C')},
  officePlate:(X,Y,x,y)=>roomPlate(X,Y,x,y,'교무실'),princPlate:(X,Y,x,y)=>roomPlate(X,Y,x,y,'교장실'),  // the two look-alike doors get names
  stairSign:(X,Y,x,y)=>{face(X,Y);r(X+1,Y+1,14,15,'#8A8E96');r(X+2,Y+2,12,13,'#F4F1E6');const c='#2F3A44';  // "2층 ↑": the stairs up are in the bottom wall
   r(X+7,Y+3,2,4,c);r(X+6,Y+4,4,1,c);r(X+5,Y+5,1,1,c);r(X+10,Y+5,1,1,c);SIGN_TEXT(X,Y,x,x,x,7,'2층',c)},
  classSign:(X,Y,x,y)=>{face(X,Y);r(X+2,Y+1,12,9,'#8A8E96');r(X+3,Y+2,10,7,'#F4F1E6');r(X+3,Y+2,10,1,'#3E7A5A');
  const D=['111001111100111','111001111001111'];  // "2" and "3", 3 wide × 5 tall, row by row
  const glyph=(g,ox)=>{for(let i=0;i<15;i++)if(D[g][i]==='1')r(X+ox+i%3,Y+4+(i/3|0),1,1,'#2B3038')};
  glyph(0,3);r(X+7,Y+6,2,1,'#2B3038');glyph(1,10);r(X+7,Y+10,2,1,'#8A8E96')},
  bcSign:(X,Y,x,y,t)=>{face(X,Y);const on=state.f.done&&Math.floor(t/500)%2;
  r(X+2,Y+1,12,9,'#8A8E96');r(X+3,Y+2,10,7,'#F4F1E6');r(X+4,Y+3,8,2,on?'#FF6A5A':'#A8443C');r(X+5,Y+3,6,1,on?'#FFD0C8':'#C45A50');
  r(X+4,Y+6,3,1,'#3E4350');r(X+8,Y+6,4,1,'#3E4350');r(X+7,Y+10,2,1,'#8A8E96')},
  menu:(X,Y,x,y)=>{face(X,Y);r(X+1,Y+1,15,10,'#2F3A44');if(at(x+1,y)!=='M')r(X+15,Y+1,1,10,'#EDE3CF');const L=at(x-1,y)!=='M';r(X+(L?3:1),Y+3,8,1,'#F2C46B');r(X+(L?3:1),Y+5,10,1,'#E3ECE4');r(X+(L?3:1),Y+7,6,1,'#E3ECE4')},
  kitchen:(X,Y,x,y,t)=>{r(X,Y,16,16,'#C9CDC4');r(X+2,Y+5,12,10,'#AEB4B8');r(X+2,Y+5,12,2,'#D3D8DB');r(X+3,Y+6,10,1,'#7A8086');
  const s=Math.round(Math.sin(t/300+x)*2);g.fillStyle='rgba(255,255,255,.55)';g.fillRect(X+6+s,Y+1,2,3);g.fillRect(X+9-s,Y,2,2)},
  serve:(X,Y,x,y)=>{r(X,Y+2,16,13,'#AEB4B8');r(X,Y+2,16,4,'#D3D8DB');r(X,Y+14,16,1,'#7A8086');r(X+2,Y+3,12,2,['#F4F1E6','#E0884A','#C8443A','#7CB46A','#9A5A3A'][x%5]);r(X,Y,16,1,'#E6F2F6')},
  lunchTable:(X,Y,x,y)=>{if(!(C.seatPulledN&&C.seatPulledN(x,y))){r(X+3,Y,4,3,'#B85E44');r(X+9,Y,4,3,'#B85E44')}/* far-side stools, tucked in behind the table */r(X,Y+3,16,8,'#E8E2D2');r(X,Y+3,16,1,'#F6F2E8');r(X,Y+10,16,1,'#B9B2A0');const h=hash(x,y);
  if(h%3){r(X+3,Y+4,10,5,'#9AA8B0');r(X+4,Y+5,3,2,'#F4F1E6');r(X+8,Y+5,2,2,'#C8443A');r(X+10,Y+6,2,2,'#E0884A')}if(!(C.seatPulled&&C.seatPulled(x,y))){r(X+3,Y+12,4,3,'#E07A5A');r(X+9,Y+12,4,3,'#E07A5A')}/* two stools, tucked in */},
  snacks:(X,Y,x,y)=>{face(X,Y);r(X,Y+1,16,14,'#9C6B3E');r(X+1,Y+2,14,5,'#6E4A2A');r(X+1,Y+8,14,5,'#6E4A2A');const h=hash(x,y),C=['#E07A5A','#F2C46B','#5A8FB0','#7CB46A','#E86D8A','#F7D154'];
  for(let i=0;i<4;i++){r(X+2+i*3,Y+3,2,4,C[(h+i)%6]);r(X+2+i*3,Y+9,2,4,i%2?'#F7D154':C[(h+i+2)%6])}},
  shopCounter:(X,Y,x,y)=>{r(X,Y+3,16,11,'#C98F5A');r(X,Y+3,16,3,'#E3B07A');r(X,Y+13,16,1,'#8A5E36');
  if(x%2){r(X+3,Y,3,4,'#F7D154');r(X+7,Y,3,4,'#F7D154');r(X+3,Y,3,1,'#5A8FB0');r(X+7,Y,3,1,'#5A8FB0')}else{r(X+4,Y,8,4,'#3E4350');r(X+5,Y+1,4,1,'#69CFD8')}},
  vending:(X,Y,x,y,t)=>{r(X+1,Y,14,16,'#C8443A');r(X+1,Y,14,1,'#E0655A');r(X+3,Y+2,8,8,'#BFE3F0');for(let i=0;i<3;i++){r(X+4+i*2,Y+3,1,2,'#F2C46B');r(X+4+i*2,Y+6,1,2,'#7CB46A')}
  r(X+12,Y+3,2,1,Math.floor(t/600)%2?'#7CF07A':'#2E5A2E');r(X+3,Y+12,8,2,'#2B2E36')},
  rack:(X,Y,x,y)=>{face(X,Y);r(X,Y+1,16,14,'#6B4A2E');r(X+1,Y+2,14,5,'#3E2A1A');r(X+1,Y+8,14,5,'#3E2A1A');const h=hash(x,y),C=['#E3ECE4','#F2C46B','#E07A5A','#5A8FB0','#B9C1C9'];
  for(let i=0;i<7;i++){r(X+1+i*2,Y+3,1,4,C[(h+i)%5]);r(X+1+i*2,Y+9,1,4,C[(h+i*3)%5])}},
  poster:(X,Y,x,y)=>{face(X,Y);const L=at(x-1,y)!=='O';r(X+(L?1:0),Y+1,L?15:14,12,'#6B4A2E');r(X+(L?2:0),Y+2,L?14:13,10,'#F2BFA0');r(X+(L?2:0),Y+2,L?14:13,1,'#F7D6C0');
  if(L){r(X+7,Y+3,4,5,'#5A5F6E');r(X+8,Y+4,2,3,'#8E94A0');r(X+8,Y+8,2,3,'#5A5F6E')}else{r(X+1,Y+3,9,1,'#C49A6C');r(X+1,Y+5,7,1,'#C49A6C');r(X+1,Y+8,10,1,'#E0A890')}},
  micStand:(X,Y,x,y)=>{r(X+7,Y+6,2,9,'#2B2E36');r(X+4,Y+14,8,2,'#2B2E36');r(X+5,Y,6,7,'#5A5F6E');r(X+6,Y+1,4,4,'#8E94A0');r(X+6,Y+2,4,1,'#6E747E');r(X+6,Y+4,4,1,'#6E747E')},
  oldSofa:(X,Y,x,y)=>{let ox=x,oy=y,ex=x,ey=y;while(at(ox-1,y)==='s')ox--;while(at(x,oy-1)==='s')oy--;while(at(ex+1,y)==='s')ex++;while(at(x,ey+1)==='s')ey++;
  const bx=X-(x-ox)*16,by=Y-(y-oy)*16,W=(ex-ox+1)*16-3,H=(ey-oy+1)*16-2,mid=by+(H/2|0);
  const box=(x0,y0,w,h,c)=>{r(x0+1,y0,w-2,h,c);r(x0,y0+1,w,h-2,c)};   // a rectangle with its corners rounded off
  inTile(X,Y,()=>{ // one old sofa seen from above, its back against the wall on the left
   box(bx+3,by+3,W,H,'rgba(0,0,0,.25)');box(bx,by,W,H,'#2E2438');                              // shadow, outline
   box(bx+1,by+1,9,H-2,'#4E3D5C');r(bx+8,by+2,1,H-4,'#6A5680');                                  // backrest
   box(bx+1,by+1,W-2,7,'#5F4B72');box(bx+1,by+H-8,W-2,7,'#5F4B72');                             // armrests
   r(bx+2,by+2,W-5,1,'#7E6A96');r(bx+2,by+H-7,W-5,1,'#7E6A96');
   const cw=W-12,c1=by+8,c2=mid+1,h1=mid-c1,h2=by+H-8-c2;
   box(bx+10,c1,cw,h1,'#A893C0');box(bx+10,c2,cw,h2,'#A893C0');                                 // two puffy seat cushions
   r(bx+11,c1+1,cw-3,1,'#C4B4D8');r(bx+11,c2+1,cw-3,1,'#C4B4D8');                               // highlights
   r(bx+11,c1+h1-2,cw-2,1,'#8A75A3');r(bx+11,c2+h2-2,cw-2,1,'#8A75A3');                         // underside shading
   r(bx+16,c2+3,5,2,'#E7DDF0');r(bx+14,c2+3,9,1,'#E2D3A6');r(bx+15,c2+5,7,1,'#E2D3A6')})},
  tapeCart:(X,Y,x,y)=>{r(X+1,Y+3,14,11,'#4A4E5A');r(X+1,Y+3,14,1,'#646A78');disc(X+5,Y+7,3,'#22252C');disc(X+11,Y+7,3,'#22252C');disc(X+5,Y+7,1,'#B9C1C9');disc(X+11,Y+7,1,'#B9C1C9');r(X+3,Y+11,10,1,'#8A8E96');r(X+2,Y+14,2,2,'#22252C');r(X+12,Y+14,2,2,'#22252C')},
  boxes:(X,Y,x,y)=>{r(X+1,Y+5,14,10,'#B98E58');r(X+1,Y+5,14,2,'#D2A970');r(X+7,Y+5,2,10,'#E3C99A');r(X+1,Y+14,14,1,'#8A6A40');
  if(hash(x,y)%2){r(X+3,Y,10,6,'#A67E4A');r(X+3,Y,10,1,'#C49A6C');r(X+5,Y+2,5,1,'#4A3424');r(X+5,Y+4,3,1,'#4A3424')}},  // marker writing, not a white label (it read as a second 사연함)
  building:(X,Y,x,y)=>bldg(X,Y,x,y),
 clock:(X,Y,x,y)=>{bldg(X,Y,x,y);r(X,Y,16,16,'#E9E1D0');const cx=at(x-1,y)==='C'?X:X+16,cy=Y+8;inTile(X,Y,()=>{disc(cx,cy,8,'#3E4C5A');disc(cx,cy,7,'#F7F3E8');
  g.fillStyle='#2B2E36';const [h,m]=C.clock?C.clock():[12,30],hr=h+m/60;  /* each 교시 says what time it is now (C.clock: [hour, minute]) */
  const hand=(a,len,w)=>{g.save();g.translate(cx,cy);g.rotate(a);g.fillRect(-w/2,-len,w,len);g.restore()};hand(hr/12*Math.PI*2,4,2);hand(m/60*Math.PI*2,6,1)})},
  entrance:(X,Y,x,y)=>{r(X,Y,16,16,'#E9E1D0');r(X,Y+1,16,13,'#3E5E6E');r(X+1,Y+2,14,11,'#A9D8EC');r(X+2,Y+3,2,1,'#E6F6FC');const L=at(x-1,y)!=='E';r(L?X+15:X,Y+1,1,13,'#3E5E6E');r(L?X+12:X+3,Y+7,1,3,'#2B2E36');r(X,Y+14,16,2,'#C9C2B0')},
  bed:(X,Y,x,y)=>{r(X,Y+2,16,10,'#6E4A2E');r(X,Y+11,16,4,'#B5653A');r(X,Y+11,16,1,'#D07E52');r(X,Y+14,16,1,'#8A4A2A');const h=hash(x,y);
  [[2,4,'#F7D154'],[7,6,'#E86D8A'],[11,3,'#F7D154'],[13,7,'#FFFFFF'],[4,8,'#E86D8A']].forEach(([a,b,c],i)=>{if((h+i)%4){r(X+a,Y+b+1,1,2,'#3E8E3A');r(X+a-1,Y+b,3,1,c);r(X+a,Y+b-1,1,1,c)}})},
  zelkova:(X,Y,x,y,t)=>{const [ox,oy]=blockOrigin(x,y,'Y'),bx=X-(x-ox)*16,by=Y-(y-oy)*16,s=Math.sin(t/1400)*1.2;
  inTile(X,Y,()=>{g.fillStyle='rgba(60,40,20,.18)';g.beginPath();g.ellipse(bx+32,by+58,28,6,0,0,Math.PI*2);g.fill();
   r(bx+27,by+30,10,30,'#6E4A2E');r(bx+29,by+30,3,30,'#8A6040');r(bx+22,by+56,20,4,'#6E4A2E');r(bx+20,by+24,6,3,'#6E4A2E');r(bx+38,by+22,6,3,'#6E4A2E');})},
  zelkovaTop:(X,Y,x,y,t)=>{const [ox,oy]=blockOrigin(x,y,'Y');if(x!==ox||y!==oy)return;  // the canopy: drawn once, over the characters, free to overhang the row above
  const bx=X,by=Y,s=Math.sin(t/1400)*1.2;
   disc(bx+32+s,by+25,27,'#256640');disc(bx+32+s,by+22,27,'#2F7A4E');disc(bx+18+s,by+28,15,'#2F7A4E');disc(bx+46+s,by+28,15,'#2F7A4E');
   disc(bx+28+s,by+16,18,'#3F9460');disc(bx+44+s,by+20,10,'#3F9460');disc(bx+16+s,by+22,9,'#3F9460');
   disc(bx+24+s,by+10,8,'#5DB070');disc(bx+40+s,by+12,6,'#5DB070');disc(bx+14+s,by+18,4,'#5DB070')},
  ybench:(X,Y,x,y)=>{const T=at(x,y-1)!=='n';r(X+4,Y+(T?2:0),9,T?14:12,'#B68350');for(let j=(T?4:2);j<16;j+=4)r(X+4,Y+j,9,1,'#9A6A3C');r(X+3,Y+(T?2:0),1,T?14:12,'#6E4A28');if(!T)r(X+4,Y+12,2,3,'#6E4A28')},
  goal:(X,Y,x,y)=>{const L=at(x-1,y)!=='g';for(let i=2;i<15;i+=3)r(X,Y+i,16,1,'#E6E2D6');for(let i=1;i<16;i+=3)r(X+i,Y+2,1,13,'#E6E2D6');
  r(X,Y+1,16,2,'#F7F7F2');r(L?X+1:X+13,Y+1,2,15,'#F7F7F2')},
  booth:(X,Y,x,y)=>{const T=at(x,y-1)!=='b',L=at(x-1,y)!=='b';
  if(T){r(X,Y+4,16,12,'#E9E1D0');r(X,Y+2,16,4,'#3E5A46');r(X,Y+2,16,1,'#5A7A62');if(L){r(X+4,Y+8,9,6,'#5E7F8E');r(X+5,Y+9,7,4,'#A9D8EC');r(X+6,Y+10,2,1,'#F7F3E8')}}
  else{r(X,Y,16,14,'#E9E1D0');r(X,Y+13,16,1,'#B9AE98');if(!L){r(X+5,Y+2,7,12,'#6E5A44');r(X+10,Y+8,1,1,'#E8B93A')}else{r(X+3,Y+3,6,5,'#5E7F8E');r(X+4,Y+4,4,3,'#A9D8EC')}}},
  fence:(X,Y,x,y)=>{const H=at(x-1,y)==='f'||at(x+1,y)==='f'||at(x-1,y)==='G'||at(x+1,y)==='G';
  if(H){r(X,Y+6,16,2,'#3E5A46');r(X,Y+11,16,2,'#3E5A46');for(let i=1;i<16;i+=4){r(X+i,Y+2,2,13,'#4F7A5E');r(X+i,Y+2,2,1,'#6E9A7A')}}
  else{r(X+7,Y,2,16,'#4F7A5E');r(X+6,Y,1,16,'#3E5A46');for(let j=2;j<16;j+=5)r(X+5,Y+j,6,2,'#3E5A46')}},
  gate:(X,Y,x,y)=>{sandF(X,Y,x,y);r(X,Y+3,16,2,'#2B2E36');r(X,Y+13,16,2,'#2B2E36');for(let i=1;i<16;i+=3)r(X+i,Y+3,1,12,'#3E4350');const L=at(x-1,y)!=='G';r(L?X:X+13,Y,3,16,'#9AA3AD');r(L?X:X+13,Y,3,1,'#C9D2DA')},
  sayeonSlot:(X,Y,x,y)=>{face(X,Y);r(X+3,Y+2,10,8,'#C98F5A');r(X+3,Y+2,10,1,'#E3B07A');r(X+5,Y+3,6,2,'#F4F1E6');r(X+6,Y+4,4,1,'#E86D8A');r(X+5,Y+6,6,2,'#3E2A1A')},  // the 사연함's slot on the 1층 hall wall: letters drop into the box on the 방송실 side
  sayeon:(X,Y,x,y)=>{face(X,Y);r(X+3,Y+1,10,10,'#C98F5A');r(X+3,Y+1,10,2,'#E3B07A');r(X+5,Y+4,6,1,'#3E2A1A');r(X+5,Y+6,6,3,'#F4F1E6');r(X+6,Y+7,4,1,'#E86D8A');
  if(state.f.done){r(X+6,Y+2,4,2,'#2B2E36');r(X+7,Y+2,2,1,'#F2A38A')}},
  notebook:(X,Y,x,y,t)=>{r(X+1,Y+9,14,3,'#6E4A2E');r(X+1,Y+9,14,1,'#8A6040');r(X+2,Y+12,2,4,'#4A3020');r(X+12,Y+12,2,4,'#4A3020');
  r(X+3,Y+1,10,8,'#3A3E48');r(X+4,Y+2,8,6,'#2F5A7A');r(X+5,Y+3,4,1,'#9FD0E8');r(X+5,Y+5,6,1,'#6FA8C8');r(X+2,Y+8,12,2,'#9AA3AD');r(X+3,Y+8,10,1,'#C9D2DA');r(X+10,Y+2,2,2,'#F2A38A');  // the club's laptop (노트북): screen up, keyboard on the desk (1교시's paper 복습 노트 is the class 'terminal')
  const due=state&&dueWords().length>0;if(due){const on=Math.floor(t/350)%2;r(X+11,Y,4,4,on?'#F2C46B':'#E8962A');r(X+12,Y+1,2,2,on?'#FFF3C4':'#F2C46B')}},
  onair:(X,Y,x,y,t)=>{face(X,Y);r(X+2,Y+3,12,6,'#2B2E36');const on=(state.f.done&&Math.floor(t/700)%3===0)||(!!state.f.onAir&&!state.f.done);r(X+3,Y+4,10,4,on?'#E85A4A':'#5A2E2E');r(X+5,Y+5,6,1,on?'#FFD0C8':'#6E3A3A')},
  mixer:(X,Y,x,y,t)=>{r(X,Y+3,16,10,'#3A3E48');r(X,Y+3,16,2,'#535866');r(X,Y+12,16,1,'#22252C');const live=state.f.ready&&!state.f.done;
  for(let i=0;i<4;i++){r(X+2+i*4,Y+6,1,5,'#1E2128');r(X+1+i*4,Y+7+(hash(x+i,y)%3),3,2,'#B9C1C9');r(X+2+i*4,Y+4,1,1,live&&(Math.floor(t/200)+i)%3?'#7CF07A':'#4A2A2A')}r(X+3,Y+3,3,1,'#8A8E96');r(X+10,Y+4,2,1,'#8A8E96');
  if(x===3)r(X+1,Y+9,6,2,'#F2C46B')},
  musicDoor:(X,Y,x,y)=>{face(X,Y);const L=at(x-1,y)!==at(x,y);r(X+(L?2:0),Y+2,14,14,'#A9794A');r(X+(L?2:0),Y+2,14,1,'#C4925F');r(X+(L?5:3),Y+5,6,4,'#BFE3F0');r(X+(L?6:4),Y+6,2,1,'#E6F6FC');
  r(L?X+14:X+1,Y+10,1,3,'#5A3E26');if(L){r(X+10,Y,6,2,'#E86D8A')}else{r(X,Y,6,2,'#E86D8A');r(X+8,Y+12,2,2,'#3E2A1A');r(X+9,Y+9,1,4,'#3E2A1A');r(X+10,Y+9,2,1,'#3E2A1A')}},
  staffBoard:(X,Y,x,y)=>{face(X,Y);const L=at(x-1,y)!=='M',R=at(x+1,y)!=='M',a=L?2:0,w=16-a-(R?2:0);r(X,Y+1,16,11,'#8A5E36');r(X+a,Y+2,w,9,'#F7F3E8');
  for(let i=0;i<5;i++)r(X+a,Y+3+i*2,w,1,'#AEB6C6');const h=hash(x,y);if(L){r(X+4,Y+2,2,9,'#2B2E36');r(X+6,Y+4,1,2,'#2B2E36')}else{r(X+2+h%9,Y+6+(h%3),3,2,'#2B2E36');r(X+4+h%9,Y+2+(h%3),1,5,'#2B2E36');if(h%2)r(X+9,Y+4,2,2,'#2B2E36')}
  r(X,Y+12,16,1,'#B98E58')},
  portraits:(X,Y,x,y)=>{face(X,Y);const wig=at(x-1,y)!=='J';r(X+3,Y+1,10,11,'#C9A13A');r(X+4,Y+2,8,9,'#5A4A3A');r(X+5,Y+3,6,4,wig?'#F4F4F4':'#2B2422');r(X+4,Y+5,2,4,wig?'#F4F4F4':'#5A4A3A');r(X+10,Y+5,2,4,wig?'#F4F4F4':'#5A4A3A');
  r(X+6,Y+5,4,4,'#E6BE9C');r(X+5,Y+9,6,2,'#2C3E63');r(X+7,Y+9,2,1,'#F4F1E6')},
  piano:(X,Y,x,y)=>{const L=at(x-1,y)!=='P',R=at(x+1,y)!=='P';r(X,Y+1,16,13,'#22252C');r(X,Y+1,16,3,'#3A3E48');r(X,Y+1,16,1,'#5A5F6E');
  r(X,Y+9,16,4,'#F4F1E6');[1,3,6,8,10,13].forEach(i=>r(X+i,Y+9,1,2,'#22252C'));if(L)r(X,Y+1,1,13,'#111318');if(R)r(X+15,Y+1,1,13,'#111318');
  if(!L&&!R){r(X+3,Y+2,10,6,'#F7F3E8');for(let i=0;i<3;i++)r(X+4,Y+3+i*2,8,1,'#AEB6C6')}r(X,Y+13,16,1,'#111318')},
  mstand:(X,Y,x,y)=>{r(X+7,Y+8,2,7,'#2B2E36');r(X+4,Y+14,8,2,'#2B2E36');r(X+3,Y+1,10,7,'#F7F3E8');r(X+3,Y+7,10,1,'#2B2E36');r(X+4,Y+3,8,1,'#AEB6C6');r(X+4,Y+5,6,1,'#AEB6C6');r(X+6,Y+4,2,2,'#2B2E36')},
  chair:(X,Y,x,y)=>{r(X+3,Y+3,10,7,'#5A8FB0');r(X+3,Y+3,10,1,'#7AAFD0');r(X+3,Y+10,10,3,'#3E6E90');r(X+3,Y+13,1,3,'#6F757C');r(X+12,Y+13,1,3,'#6F757C');
  if(hash(x,y)<15)r(X+5,Y+5,6,1,'#F4F1E6')},
  drums:(X,Y,x,y)=>{if(at(x-1,y)!=='d'){r(X+4,Y+3,1,10,'#8A8E96');disc(X+4,Y+3,4,'#E8B93A');disc(X+4,Y+3,1,'#F7D98C');disc(X+11,Y+10,4,'#C8443A');disc(X+11,Y+10,3,'#F4F1E6')}
  else{disc(X+7,Y+9,6,'#C8443A');disc(X+7,Y+9,5,'#F4F1E6');r(X+6,Y+8,2,2,'#B8433A');disc(X+13,Y+3,3,'#E8B93A')}},
  gymWin:(X,Y,x,y)=>{face(X,Y);r(X+1,Y+1,14,9,'#F8F2E6');r(X+2,Y+2,12,7,'#BFE3F0');r(X+8,Y+2,1,7,'#F8F2E6');r(X+2,Y+5,12,1,'#F8F2E6');for(let i=2;i<14;i+=3)r(X+i,Y+2,1,7,'rgba(90,95,110,.25)');r(X+3,Y+3,2,1,'#E6F6FC')},
  hoop:(X,Y,x,y)=>{cap(X,Y,x,y);const Lw=x===0;r(Lw?X+9:X+3,Y+1,4,14,'#F4F1E6');r(Lw?X+9:X+3,Y+1,4,1,'#C9C6C2');r(Lw?X+9:X+3,Y+6,4,4,'#D2533F');r(Lw?X+10:X+4,Y+7,2,2,'#F4F1E6');
  r(Lw?X+13:X+1,Y+7,2,2,'#E8762A');r(Lw?X+13:X+1,Y+9,2,4,'#F4F1E6')},
  mat:(X,Y,x,y)=>{const T=at(x,y-1)!=='m',L=at(x-1,y)!=='m';r(X,Y,16,16,'#3E6FA8');if(T)r(X,Y,16,2,'#5A8CC4');if(L)r(X,Y,2,16,'#4A7CB4');r(X,Y+15,16,1,'#2E5A8C');r(X+15,Y,1,16,'#2E5A8C');r(X+6,Y+7,4,1,'#2E5A8C')},
  ballCart:(X,Y,x,y)=>{r(X+1,Y+4,14,10,'#8A8E96');r(X+2,Y+5,12,8,'#5A5F6E');const h=hash(x,y),took=state.f.stoodUp;  // after "선배들이 공을 들고 나갔어요": one ball left
  if(!took)disc(X+5,Y+7,3,h%2?'#E8762A':'#F2F0EA');disc(X+11,Y+8,3,'#E8762A');if(!took)disc(X+8,Y+5,3,h%2?'#F2F0EA':'#E8762A');
  r(X+4,Y+7,3,1,'#9A4A1A');r(X+2,Y+14,2,2,'#2B2E36');r(X+12,Y+14,2,2,'#2B2E36')},
  bleacher:(X,Y,x,y)=>{r(X,Y,16,7,'#C99556');r(X,Y,16,1,'#E2B477');r(X,Y+7,16,1,'#7A5230');r(X,Y+8,16,7,'#B5854F');r(X,Y+8,16,1,'#D6A466');r(X,Y+15,16,1,'#7A5230');
  if(at(x-1,y)!=='b')r(X,Y,1,16,'#7A5230');if(at(x+1,y)!=='b')r(X+15,Y,1,16,'#7A5230');if(hash(x,y)<12)r(X+6,Y+2,3,4,'#5A8FB0')},
  court:(X,Y,x,y)=>courtF(X,Y,x,y),
 doorway:(X,Y,x,y)=>{checkF(X,Y,x,y);r(X,Y,2,16,'#A9794A');r(X+14,Y,2,16,'#A9794A');r(X+2,Y,12,2,'#B9BCB0')},
  mShelf:(X,Y,x,y)=>{r(X,Y+1,16,14,'#8A5E36');r(X+1,Y+2,14,5,'#5A3A20');r(X+1,Y+8,14,6,'#5A3A20');for(let i=0;i<4;i++)r(X+2+i*3,Y+2,1,5,i%2?'#F4F1E6':'#E8D9A8');
  if(at(x-1,y)!=='x'){disc(X+8,Y+11,3,'#E0A060');r(X+8,Y+8,1,3,'#7A5230')}else{disc(X+7,Y+11,3,'#C9A13A');disc(X+7,Y+11,2,'#5A3A20')}},
  libDoor:(X,Y,x,y)=>{face(X,Y);const L=at(x-1,y)!==at(x,y);r(X+(L?2:0),Y+2,14,14,'#4F7FA8');r(X+(L?2:0),Y+2,14,1,'#6E9AC4');r(X+(L?5:4),Y+5,6,4,'#BFE3F0');r(L?X+14:X+1,Y+9,1,3,'#2B3E52');
  if(!L){r(X+4,Y+10,6,4,'#F4F1E6');r(X+5,Y+11,2,2,'#3E5E8C');r(X+7,Y+11,2,2,'#B8433A')}},  /* a little book plaque on the right leaf */
  bookWall:(X,Y,x,y)=>{r(X,Y,16,16,'#6B4A2E');r(X,Y,16,1,'#8A6040');r(X+1,Y+1,14,6,'#3E2A1A');r(X+1,Y+8,14,6,'#3E2A1A');r(X,Y+14,16,2,'#5A3E26');const h=hash(x,y),C=['#B8433A','#3E5E8C','#3F7D5A','#C9A13A','#E3ECE4','#7A3E54'];
  for(let i=0;i<7;i++){const a=(h+i*3)%4;r(X+1+i*2,Y+1+a%2,2,6-a%2,C[(h+i)%6]);r(X+1+i*2,Y+8+(a>>1),2,6-(a>>1),C[(h+i*2+1)%6])}},
  libWin:(X,Y,x,y,t)=>{r(X,Y,16,16,'#E6DCC8');r(X,Y,16,1,'#F4ECDC');const L=at(x-1,y)!=='W';r(X+(L?2:0),Y+2,L?14:14,11,'#F8F2E6');r(X+(L?3:0),Y+3,L?13:13,9,'#A9D8EC');
  const s=Math.round(Math.sin(t/1100+x));r(X+(L?3:0),Y+8+s,13,4-s,'#6FA86A');r(X,Y+13,16,3,'#C9BCA4')},
  readTable:(X,Y,x,y)=>{const L=at(x-1,y)!=='t',R=at(x+1,y)!=='t';r(X,Y+3,16,9,'#D9B07A');r(X,Y+3,16,1,'#EBC995');r(X,Y+11,16,1,'#A67E4A');
  if(L)r(X+1,Y+12,2,4,'#8A6040');if(R)r(X+13,Y+12,2,4,'#8A6040');const h=hash(x,y);if(h%3===0){r(X+3,Y+5,10,5,'#F7F3E8');r(X+8,Y+5,1,5,'#C9BFA8');r(X+4,Y+6,3,1,'#9AA3B5');r(X+9,Y+7,3,1,'#9AA3B5')}else if(h%3===1)r(X+4,Y+5,6,4,['#3E5E8C','#B8433A','#3F7D5A'][h%3]);
   if(live().some(n=>n.x===x&&n.y===y+1&&sitting(n))){r(X+4,Y+6,8,4,'#F7F3EA');r(X+7,Y+6,2,4,'#C9BFA8');r(X+5,Y+7,2,1,'#9AA3B5');r(X+10,Y+8,1,1,'#9AA3B5')}  /* someone sitting here: an open book */},
  /* the librarian sits behind the 대출 desk (north of it), so its monitor shows the room its back, the screen's light over the top edge */
  libDesk:(X,Y,x,y)=>{r(X,Y+3,16,11,'#8A5E36');r(X,Y+3,16,3,'#B9844F');r(X,Y+3,16,1,'#CF9E66');r(X,Y+13,16,1,'#5A3E26');const L=at(x-1,y)!=='K',R=at(x+1,y)!=='K';
  if(!L&&!R){r(X+3,Y-2,10,7,'#2B3238');r(X+4,Y-2,8,1,'#69CFD8');r(X+4,Y-1,8,5,'#4A525C');r(X+4,Y-1,8,1,'#5E6772');r(X+6,Y,4,2,'#3E454E');r(X+7,Y+5,2,1,'#2B3238')}else if(L){r(X+3,Y+1,8,2,'#3E5E8C');r(X+4,Y-1,7,2,'#B8433A');r(X+12,Y+2,2,2,'#C8443A')}else{r(X+3,Y+1,9,4,'#5A3E26');r(X+4,Y+2,7,1,'#1B1E2B')}},
  magRack:(X,Y,x,y)=>{r(X+1,Y+2,14,13,'#7A5230');r(X+1,Y+2,14,1,'#93623C');const h=hash(x,y),C=['#E07A5A','#F2C46B','#5A8FB0','#7CB46A','#F2A3B8'];for(let i=0;i<3;i++){r(X+2+i*4,Y+4,3,5,C[(h+i)%5]);r(X+2+i*4,Y+10,3,4,C[(h+i+2)%5])}},
  /* the computers stand against the 도서관's south wall, so their screens face the students at them (the row above) and the
     room sees the monitors' backs: casing, vent and stand, the screen's light just showing over the top edge */
  pc:(X,Y,x,y,t)=>{r(X,Y+6,16,8,'#B9C2CA');r(X,Y+6,16,2,'#D3D8DB');r(X,Y+13,16,1,'#8C96A0');const on=Math.floor(t/900+x)%5!==0;
   r(X+4,Y,8,1,on?'#69CFD8':'#4FB0BA');r(X+3,Y+1,10,9,'#2B3238');r(X+4,Y+2,8,7,'#4A525C');r(X+4,Y+2,8,1,'#5E6772');r(X+6,Y+4,4,4,'#3E454E');
   r(X+6,Y+5,4,1,'#2B3238');r(X+6,Y+7,4,1,'#2B3238');r(X+7,Y+10,2,2,'#2B3238');r(X+5,Y+11,6,1,'#3A4048');r(X+13,Y+6,2,2,'#EEF1F3')},
  bookCart:(X,Y,x,y)=>{r(X+1,Y+4,14,9,'#8C96A0');r(X+1,Y+4,14,1,'#B9C2CA');const C=['#B8433A','#3E5E8C','#3F7D5A','#C9A13A'];for(let i=0;i<6;i++)r(X+2+i*2,Y+1+(i%2),2,4-(i%2),C[i%4]);r(X+2,Y+13,3,3,'#1B1E2B');r(X+11,Y+13,3,3,'#1B1E2B')},
  carpet:(X,Y,x,y)=>carpetF(X,Y,x,y),
 sidewalk:(X,Y,x,y)=>walkF(X,Y,x,y),
 nrFloor:(X,Y,x,y,t)=>nrF(X,Y,x,y,t),
 doorway:(X,Y,x,y)=>{checkF(X,Y,x,y);r(X,Y,2,16,'#A9794A');r(X+14,Y,2,16,'#A9794A');r(X+2,Y,12,2,'#B9BCB0')},
  libShelf:(X,Y,x,y)=>{const T=at(x,y-1)!=='b',L=at(x-1,y)!=='b';r(X,Y+(T?2:0),16,T?14:13,'#7A5230');if(T)r(X,Y+2,16,2,'#93623C');
  r(X+(L?1:0),Y+(T?5:1),L?15:15,T?8:9,'#4A3220');const h=hash(x,y),C=['#B8433A','#3E5E8C','#3F7D5A','#C9A13A','#E3ECE4','#C97A8E'];for(let i=0;i<7;i++)r(X+(L?2:0)+i*2,Y+(T?6:2)+(h+i)%3,1,(T?7:8)-(h+i)%3,C[(h+i)%6]);
  if(!T)r(X,Y+14,16,2,'#5A3E26')},
 /* the 2층 corridor's own furniture: same art on the hallway floor (the 교무실 and 도서관 versions carry their rooms' floors) */
 hallWater:(X,Y,x,y)=>{r(X+4,Y+4,8,12,'#F2F0EA');r(X+4,Y+15,8,1,'#C9C6BC');r(X+5,Y,6,5,'#8FC8E8');r(X+6,Y+1,1,3,'#C4E6F6');r(X+6,Y+8,1,2,'#D2533F');r(X+9,Y+8,1,2,'#3A86C8');r(X+5,Y+11,6,1,'#9A968C')},
 hallPlant:(X,Y,x,y)=>{r(X+5,Y+10,6,6,'#B5653A');r(X+5,Y+10,6,1,'#D07E52');r(X+3,Y+3,10,7,'#3F8F4A');r(X+5,Y+1,6,3,'#3F8F4A');r(X+5,Y+3,2,2,'#6CC07A');r(X+10,Y+6,2,2,'#6CC07A')},
 studyTable:(X,Y,x,y)=>{const L=at(x-1,y)!=='t',R=at(x+1,y)!=='t';r(X,Y+3,16,9,'#D9B07A');r(X,Y+3,16,1,'#EBC995');r(X,Y+11,16,1,'#A67E4A');
  if(L)r(X+1,Y+12,2,4,'#8A6040');if(R)r(X+13,Y+12,2,4,'#8A6040');const h=hash(x,y);if(h%3===0){r(X+3,Y+5,10,5,'#F7F3E8');r(X+8,Y+5,1,5,'#C9BFA8');r(X+4,Y+6,3,1,'#9AA3B5');r(X+9,Y+7,3,1,'#9AA3B5')}else if(h%3===1)r(X+4,Y+5,6,4,['#3E5E8C','#B8433A','#3F7D5A'][h%3])},
 /* the 체육관's "느티고 화이팅!" banner on its back wall, hung across a row of 'Z' tiles (the wall is drawn under it as its floor):
    hand-drawn 9-pixel Hangul, centred on the cloth */
 gymBanner:(X,Y,x,y)=>{let a=x,b=x;while(at(a-1,y)===at(x,y))a--;while(at(b+1,y)===at(x,y))b++;
  const W=(b-a+1)*16,ox=(x-a)*16,s=(gx,gy,w,h,c)=>{const l=Math.max(gx,ox),rr=Math.min(gx+w,ox+16);if(rr>l)r(X+l-ox,Y+gy,rr-l,h,c)};
  s(0,3,3,1,'#7A5A3A');s(W-3,3,3,1,'#7A5A3A');s(2,2,W-4,13,'#F7F3EA');s(2,2,W-4,1,'#3F7D5A');s(2,14,W-4,1,'#3F7D5A');
  const GL=[['.#.....','.#.....','.#.....','.#.....','.#####.','.......','.......','#######','.......'],['#####.#','#.....#','#.....#','#####.#','#.....#','#.....#','#####.#','......#','......#'],['######.','.....#.','.....#.','.....#.','.......','...#...','...#...','#######','.......'],['.','.','.','.','.','.','.','.','.'],['..#...#.','#####.#.','.###..#.','#...#.##','.###..#.','..#...#.','#####.#.','......#.','......#.'],['......#','.###..#','#...#.#','#...#.#','#...#.#','.###..#','......#','......#','......#'],['#####.#','#.....#','#####.#','#.....#','#####.#','.......','..###..','.#...#.','..###..'],['#','#','#','#','#','#','.','#','.']],GAP=3,tw=GL.reduce((n,g)=>n+g[0].length,0)+GAP*(GL.length-1);
  let gx=Math.floor((W-tw)/2);for(const gl of GL){gl.forEach((row,j)=>{for(let i=0;i<row.length;i++)if(row[i]==='#')s(gx+i,4+j,1,1,'#C8443A')});gx+=gl[0].length+GAP}},
 /* 2학년 3반's computer on the teacher's desk (the 방송실 laptop is notebook) */
 terminal:(X,Y,x,y,t)=>{r(X,Y+3,16,11,'#9C6B3E');r(X,Y+3,16,3,'#B9844F');r(X+2,Y+9,12,1,'#7E5430');
  r(X+2,Y,12,7,'#3E5E8C');r(X+3,Y+1,10,5,'#F7F3E8');r(X+7,Y+1,1,5,'#C9BFA8');r(X+4,Y+2,2,1,'#9AA3B5');r(X+4,Y+4,3,1,'#9AA3B5');r(X+9,Y+2,3,1,'#9AA3B5');r(X+9,Y+4,2,1,'#9AA3B5');
  const due=state&&dueWords().length>0;if(due){const on=Math.floor(t/350)%2;r(X+11,Y,4,4,on?'#F2C46B':'#E8962A');r(X+12,Y+1,2,2,on?'#FFF3C4':'#F2C46B')}},
 /* the 체육관: its own building across the 운동장, green roof, green double doors (J) facing the yard */
 gymBldg:(X,Y,x,y)=>{if(y<=1){r(X,Y,16,16,'#3E7A5A');r(X,Y+(y?13:0),16,y?3:1,y?'#2E5E44':'#5A9A74');for(let i=3;i<16;i+=4)r(X+i,Y,1,y?13:16,'#356A4E')}
  else{r(X,Y,16,16,'#E8E2D4');r(X,Y,16,1,'#F4F0E6');if(y===2){r(X+2,Y+4,12,5,'#5E7F8E');r(X+3,Y+5,10,3,'#A9D8EC');r(X+8,Y+5,1,3,'#5E7F8E')}
   if(y===3&&x>=26&&x<=29){const L=x===26?3:0,R=x===29?3:0;r(X+L,Y+4,16-L-R,7,'#2E5E44');r(X+L+(L?2:0),Y+6,16-L-R-(L||R?2:0),3,'#F4F0E6')}  /* the 체육관 sign over the doors */if(y===4)r(X,Y+14,16,2,'#B9AE98')}},
 gymEntrance:(X,Y,x,y)=>{r(X,Y,16,16,'#E8E2D4');const L=at(x-1,y)!=='J';r(X+(L?2:0),Y+2,14,14,'#3E7A5A');r(X+(L?3:1),Y+3,12,6,'#BFE3F0');
  r(X+(L?14:1),Y+10,1,2,'#F2D27A');r(L?X+15:X,Y+2,1,14,'#2E5E44')},
 /* 학교 앞 (the street outside the 정문, one for every 교시): 문구점, 분식집, 편의점, 코인 노래방, the 학원 building */
 roof:(X,Y,x,y)=>{const s=SHOP(x);if(s<0)return TILES.brick(X,Y,x,y);const [c,l,d]=SHOPC[s];r(X,Y,16,16,c);for(let j=2;j<12;j+=4)r(X,Y+j,16,1,l);r(X,Y+12,16,4,d);
  for(let i=0;i<16;i+=4)r(X+i,Y+12,2,4,'#F4F1E6')},
 sign:(X,Y,x,y,t)=>{const s=SHOP(x);if(s<0)return TILES.brick(X,Y,x,y);const [c,l,d]=SHOPC[s];r(X,Y,16,16,'#E9E1D0');r(X,Y+2,16,11,c);r(X,Y+2,16,1,l);r(X,Y+12,16,1,d);
  if(SHOP(x-1)!==s)r(X,Y+2,1,11,d);if(SHOP(x+1)!==s)r(X+15,Y+2,1,11,d);let x0=x,x1=x;while(x0>0&&SHOP(x0-1)===s)x0--;while(x1<MW-1&&SHOP(x1+1)===s)x1++;
  if(x===x0+1){if(s===0){r(X+3,Y+6,9,3,'#F2C46B');r(X+12,Y+6,2,3,'#F2A38A');r(X+2,Y+7,1,1,'#2B2E36')}else if(s===1){r(X+3,Y+9,10,2,'#2B2E36');r(X+4,Y+5,8,4,'#E8762A');r(X+5,Y+6,3,1,'#F7F3E8');r(X+9,Y+7,2,1,'#F7F3E8')}
   else if(s===2){r(X+3,Y+5,4,6,'#F7F3E8');r(X+9,Y+5,4,6,'#F7F3E8');r(X+4,Y+6,2,2,c);r(X+10,Y+8,2,2,c)}else{const on=Math.floor(t/400)%2;r(X+6,Y+4,4,5,on?'#FFE0FA':'#E86DD8');r(X+7,Y+9,2,3,'#F4F1E6')}}  // the shop's icon (the 노래방's mic blinks)
  else if(x>=x0+2)SIGN_TEXT(X,Y,x,x0+2,x1,3,SHOPN[s],'#F7F3E8')},  // the shop's name, in Hangul you can read
 shopWin:(X,Y,x,y,t)=>{const s=SHOP(x);r(X,Y,16,16,'#E9E1D0');r(X+1,Y+1,14,12,'#3E4350');r(X+2,Y+2,12,10,s===3?'#3A2A52':'#A9D8EC');if(s!==3)r(X+3,Y+3,2,1,'#E6F6FC');const h=hash(x,y);
  if(s===0){r(X+3,Y+7,3,4,'#E86D8A');r(X+7,Y+6,3,5,'#5A8FB0');r(X+11,Y+8,2,3,'#F2C46B')}
  else if(s===1){r(X+3,Y+8,10,3,'#2B2E36');r(X+4,Y+7,8,2,'#D8442A');const w=Math.round(Math.sin(t/400+x)*1.5);g.fillStyle='rgba(255,255,255,.6)';g.fillRect(X+6+w,Y+3,2,3);g.fillRect(X+9-w,Y+4,2,2)}
  else if(s===2){for(let j=0;j<2;j++){r(X+2,Y+6+j*3,12,1,'#8A8E96');for(let i=0;i<4;i++)r(X+3+i*3,Y+4+j*3,2,2,['#E8762A','#F2C46B','#E86D8A','#7CB46A'][(h+i+j)%4])}}
  else{const on=Math.floor(t/350+x)%3;r(X+7,Y+5,2,2,['#E86DD8','#6FE0F2','#F2D86F'][on]);r(X+4,Y+8,1,1,'#F2D86F');r(X+11,Y+4,1,1,'#6FE0F2')}  // neon through the 노래방's dark glass
  r(X,Y+13,16,3,'#B9AE98')},
 shopDoor:(X,Y,x,y)=>{r(X,Y,16,16,'#E9E1D0');r(X+2,Y+1,12,15,'#5A3E26');r(X+3,Y+2,10,14,'#BFE3F0');r(X+4,Y+4,2,6,'#E6F6FC');const [c,,d]=SHOPC[Math.max(0,SHOP(x))];r(X+2,Y+1,12,5,c);
  for(let i=5;i<14;i+=3)r(X+i,Y+1,1,5,d);r(X+11,Y+9,1,3,'#2B2E36')},
 nrDoor:(X,Y,x,y,t)=>{r(X,Y,16,16,'#E9E1D0');r(X+1,Y,14,16,'#2B1E3C');const on=Math.floor(t/300)%2;r(X+1,Y,14,1,on?'#E86DD8':'#6FE0F2');r(X+1,Y,1,16,on?'#6FE0F2':'#E86DD8');r(X+14,Y,1,16,on?'#6FE0F2':'#E86DD8');r(X+4,Y+4,8,8,'#3A2A52');r(X+7,Y+6,2,3,'#F2D86F')},
 brick:(X,Y,x,y)=>{r(X,Y,16,16,'#A8644A');for(let j=3;j<16;j+=4){r(X,Y+j,16,1,'#8E5038');const o=(j>>2)%2?4:0;r(X+o,Y+j-3,1,3,'#8E5038');r(X+o+8,Y+j-3,1,3,'#8E5038')}},
 acad:(X,Y,x,y,t)=>{const A=c=>c==='A'||c==='H';r(X,Y,16,16,'#B9BEC8');r(X,Y,16,1,'#D2D6DE');if(!A(at(x-1,y)))r(X,Y,1,16,'#8E94A0');if(!A(at(x+1,y)))r(X+15,Y,1,16,'#8E94A0');
  if(y===0){let x0=x,x1=x;while(at(x0-1,0)==='A')x0--;while(at(x1+1,0)==='A')x1++;r(X,Y+1,16,11,'#2E5A9A');r(X,Y+1,16,1,'#4A78B8');r(X,Y+11,16,1,'#1E3E6E');SIGN_TEXT(X,Y,x,x0,x1,2,'느티 수학 학원','#F7F3E8');r(X,Y+12,16,1,'#8E94A0')}  // the 학원's name, like the shops'
  else{r(X+2,Y+2,12,9,'#3E4A6E');const on=(hash(x,y)+Math.floor(t/3000))%5,ev=evening();r(X+3,Y+3,10,7,ev?(on?'#F7E7B0':'#8E9AB8'):'#A9D8EC');if(!ev)r(X+4,Y+4,2,1,'#E6F6FC');  // lit windows in the evening, sky in the glass by day
   r(X+8,Y+3,1,7,'#3E4A6E');r(X+3,Y+6,10,1,'#3E4A6E');if(y===2)r(X,Y+13,16,3,'#8E94A0')}},
 acadDoor:(X,Y,x,y)=>{r(X,Y,16,16,'#B9BEC8');r(X+1,Y+1,14,15,'#3E4A5E');r(X+2,Y+2,12,14,'#A9C8E0');r(X+3,Y+3,2,8,'#D8EAF6');const L=at(x-1,y)!=='H';r(L?X+15:X,Y+1,1,15,'#3E4A5E');r(L?X+12:X+3,Y+8,1,3,'#2B2E36')},
 pave:(X,Y,x,y)=>paveF(X,Y,x,y),
 road:(X,Y,x,y,t)=>{r(X,Y,16,16,'#4A4E56');const h=hash(x,y);if(h<40)r(X+h%13+1,Y+(h>>2)%12+2,1,1,'#5A5E66');
  if(y===5){r(X,Y,16,2,'#9A968C');r(X,Y+15,16,1,'#E8B93A')}else{r(X,Y+14,16,2,'#9A968C');r(X,Y,16,1,'#E8B93A')}streetCar(X,Y,x,y,t,5)},
 crosswalk:(X,Y,x,y,t)=>{r(X,Y,16,16,'#4A4E56');for(let i=1;i<16;i+=5)r(X+i,Y,3,16,'#F4F1E6');if(y===5)r(X,Y,16,2,'#9A968C');else r(X,Y+14,16,2,'#9A968C');streetCar(X,Y,x,y,t,5)},
 lamp:(X,Y,x,y)=>{paveF(X,Y,x,y);r(X+7,Y+3,2,12,'#3E4350');r(X+5,Y+14,6,2,'#2B2E36');r(X+4,Y,8,3,'#2B2E36');
  if(evening()){r(X+5,Y+2,6,1,'#FFE58A');g.fillStyle='rgba(255,229,138,.18)';g.fillRect(X+3,Y+3,10,6)}else r(X+5,Y+2,6,1,'#C9CED3')},  // lit only in the evening
 streetTree:(X,Y,x,y,t)=>{paveF(X,Y,x,y);r(X+2,Y+12,12,4,'#8E9286');r(X+3,Y+12,10,1,'#6E4A2E');r(X+7,Y+7,2,6,'#6E4A2E');const s=Math.round(Math.sin(t/1300+x)*1);
  disc(X+8+s,Y+6,6,'#2F7A4E');disc(X+6+s,Y+4,4,'#3F9460');disc(X+10+s,Y+5,3,'#3F9460');disc(X+6+s,Y+3,2,'#5DB070')},
 busStop:(X,Y,x,y)=>{paveF(X,Y,x,y);const L=at(x-1,y)!=='B';r(X,Y+1,16,3,'#3E5E8C');r(X,Y+1,16,1,'#5A7AAC');r(X+(L?1:0),Y+4,L?15:14,7,'#BFE3F0');r(X,Y+11,16,2,'#8A5E36');r(X+1,Y+13,1,3,'#3E4350');r(X+14,Y+13,1,3,'#3E4350');
  if(L){r(X+1,Y+4,1,9,'#3E4350');r(X+3,Y+5,5,4,'#F2C46B')}else r(X+15,Y+4,1,9,'#3E4350')},
 sfence:(X,Y,x,y)=>{paveF(X,Y,x,y);r(X,Y+6,16,2,'#3E5A46');r(X,Y+11,16,2,'#3E5A46');for(let i=1;i<16;i+=4){r(X+i,Y+2,2,13,'#4F7A5E');r(X+i,Y+2,2,1,'#6E9A7A')}},
 sgate:(X,Y,x,y)=>{paveF(X,Y,x,y);r(X,Y+3,16,2,'#2B2E36');r(X,Y+13,16,2,'#2B2E36');const L=at(x-1,y)!=='G';r(L?X:X+13,Y,3,16,'#9AA3AD');r(L?X:X+13,Y,3,1,'#C9D2DA')},
};
/* fresh copies every time: a 교시 may add to them */
const base=()=>({
 yard:{name:'느티고 · 운동장',reg:'SCHOOL YARD',floor:'sand',outdoor:1,
  legend:{'H':{tile:'building'},'C':{tile:'clock'},'E':{tile:'entrance',walk:1},'.':{tile:'sand',walk:1},',':{tile:'stone',walk:1},'*':{tile:'bed'},
   'Y':{tile:'zelkova',front:'zelkovaTop'},'n':{tile:'ybench'},'g':{tile:'goal'},'b':{tile:'booth'},'f':{tile:'fence'},'G':{tile:'gate'},
   'K':{tile:'gymBldg'},'J':{tile:'gymEntrance',walk:1}},
  map:[
"HHHHHHHHHHHHHHHHHHHHHHHHKKKKKKKK",
"HHHHHHHHHHHCCHHHHHHHHHHHKKKKKKKK",
"HHHHHHHHHHHHHHHHHHHHHHHHKKKKKKKK",
"HHHHHHHHHHHEEHHHHHHHHHHHKKKKKKKK",
"f****......,,......****.KKKJJKKK",
"f..........,,..................f",
"f.YYYY.....,,......gg..........f",
"f.YYYY.....,,..................f",
"f.YYYY.n...,,..................f",
"f.YYYY.n...,,..................f",
"f..........,,..................f",
"f..........,,.....bb...........f",
"f..........,,.....bb...........f",
"fffffffffffGGfffffffffffffffffff"],
  rooms:[[1,4,10,12,'운동장 · 느티나무'],[13,4,22,12,'운동장'],[24,5,30,12,'운동장 · 체육관 앞']],
  warps:{'11,3':{to:'hall',x:5,y:8,dir:'up'},'12,3':{to:'hall',x:6,y:8,dir:'up'},'27,4':{to:'gym',x:11,y:11,dir:'up'},'28,4':{to:'gym',x:12,y:11,dir:'up'}},
  things:{'H':['느티고등학교 건물이에요. 창문이 반짝여요.','3층 창문에서 누가 손을 흔들어요.','오래된 건물이지만 깨끗해요.'],
   'C':'학교 시계예요. 똑딱똑딱.',
   '*':['화단에 노란 꽃이 피었어요.','꽃 이름표: "2학년 3반이 심었어요."','벌이 꽃 사이를 날아다녀요.'],
   'Y':['아주 큰 느티나무예요. 학교 이름도 이 나무예요.','나뭇잎 사이로 햇빛이 반짝여요.','나무에 작은 이름표: "오백 살"','바람이 불어요. 나뭇잎이 사락사락.'],
   'n':'나무 벤치예요. 누가 이름을 새겼어요.',
   'g':['축구 골대예요. 그물에 구멍이 있어요.','골대 앞 모래에 발자국이 많아요.'],
   'b':(x,y)=>x===19&&y===12?'경비실 문이에요. 안에서 라디오 소리가 들려요.':x===18&&y===11?'창문에 열쇠가 많이 걸려 있어요.':'경비실이에요. 라디오 소리가 작게 들려요.',  // the booth: big window top left, door bottom right
   'f':['초록색 울타리예요.','울타리 밖에 버스 정류장이 보여요.'],
   'G':'정문이에요. 밖은 학교 앞 길이에요.',
   'K':['체육관 건물이에요. 지붕이 초록색이에요.','체육관 안에서 공 소리가 들려요.']}},

 hall:{name:'느티고 · 1층 복도',reg:'NEUTI HIGH · 1F',floor:'hallFloor',
  legend:{'#':{tile:'wall'},',':{tile:'hallFloor',walk:1},'.':{tile:'checkFloor',walk:1},'D':{tile:'doorway',walk:1},
   'N':{tile:'notice'},'V':{tile:'classWin'},'R':{tile:'classDoor',walk:1},'P':{tile:'speaker'},
   'c':{tile:'cabinet',floor:'checkFloor'},'w':{tile:'water',floor:'checkFloor'},'p':{tile:'plant',floor:'checkFloor'},'k':{tile:'odesk',floor:'checkFloor'},'t':{tile:'trophy',floor:'checkFloor'},'K':{tile:'pdesk',over:1,floor:'checkFloor'},'o':{tile:'sofa',floor:'checkFloor'},'a':{tile:'lowTable',floor:'checkFloor'},
   's':{tile:'shoes'},'E':{tile:'exitDoor',walk:1},'S':{tile:'stairs',walk:1},'W':{tile:'hallWin'},'F':{tile:'cafDoor',walk:1},'Q':{tile:'bcDoor',walk:1},'q':{tile:'bcSign'},'m':{tile:'classSign'},
   'g':{tile:'officePlate'},'j':{tile:'princPlate'},'u':{tile:'stairSign'}},
  map:[
"##################NN#VRm#P##",
"#ccw.pcc#tt...tt#,,,,,,,,,,#",
"#.......#..KK...#,,,,,,,,,,#",
"#kk..kk.#.......#,,,,,,,,,,#",
"#kk..kk.#oao....#,,,,,,,,,,#",
"##ggD######jjD###,,,,,,,,,,#",
"#,,,,,,,,,,,,,,,,,,,,,,,,,,#",
"#,,,,,,,,,,,,,,,,,,,,,,,,,,#",
"#,,,,,,,,,,,,,,,,,,,,,,,,,,#",
"#ssssEE#SSSuWWW#FF#WWWWqQQ##"],
  rooms:[[1,1,7,4,'교무실'],[9,1,15,4,'교장실'],[17,1,26,4,'복도 · 2학년 3반 앞'],[1,5,26,8,'1층 복도'],[15,7,18,8,'1층 복도 · 급식실 앞'],[22,6,26,8,'복도 끝 · 방송실 앞']],
  warps:{'5,9':{to:'yard',x:11,y:4,dir:'down'},'6,9':{to:'yard',x:12,y:4,dir:'down'},'22,0':{to:'class',x:18,y:11,dir:'up'},'16,9':{to:'cafe',x:10,y:1,dir:'down'},'17,9':{to:'cafe',x:11,y:1,dir:'down'},'24,9':{to:'bcast',x:7,y:1,dir:'down'},'25,9':{to:'bcast',x:8,y:1,dir:'down'},'8,9':{to:'hall2',x:8,y:8,dir:'up'},'9,9':{to:'hall2',x:9,y:8,dir:'up'},'10,9':{to:'hall2',x:10,y:8,dir:'up'}},
  things:{'#':(x,y)=>y===0&&x<16?['하얀 벽이에요. 아래쪽은 초록색이에요.','깨끗한 벽이에요. 먼지 하나 없어요.']  // inside the 교무실 and the 교장실: no graffiti there
    :['하얀 벽이에요. 아래쪽은 초록색이에요.','벽에 "복도에서 뛰지 마세요" 종이가 있어요.','누가 벽에 작게 낙서했어요.'],
   'N':['게시판: "축제 다음 달! 반마다 하나씩 준비해요."','게시판: "중간고사 등수는 교무실 앞에."','게시판 구석에 "방송부 부원 모집" 종이가 찢어져 있어요.'],
   'V':['창문으로 2학년 3반 교실이 보여요.','교실 안에서 웃음소리가 들려요.'],
   'P':'낡은 스피커예요. 가끔 지지직 소리가 나요.',
   'c':['서류가 가득한 캐비닛이에요.','서랍에 "모의고사 성적"이라고 쓰여 있어요. 열면 큰일 나요.'],
   'w':'정수기예요. 물이 시원해요.',
   'p':'화분이에요. 잎이 반짝반짝해요.',
   'k':['선생님 책상이에요. 시험지가 높이 쌓였어요.','커피 컵에 "국어"라고 쓰여 있어요.','모니터에 시간표가 떠 있어요.'],
   't':['트로피가 많아요. "1994 방송 대회"도 있어요.','상장과 사진이 가득한 장식장이에요.'],
   'K':'교장 선생님 책상이에요. 이름표가 반짝여요.',
   'o':'까만 소파예요. 아주 푹신해 보여요.',
   'a':'작은 탁자 위에 녹차가 두 잔 있어요.',
   's':['신발장이에요. 실내화가 줄줄이 있어요.','신발장에 이름표가 다 붙어 있어요.'],
   'W':['창밖에 운동장하고 느티나무가 보여요.','창밖에서 새가 짹짹 울어요.'],
   'm':'"2학년 3반" 팻말이에요. 문 옆에 있어요.',
   'q':'"방송실" 팻말이에요. 문 옆에 있어요.',
   'g':'"교무실" 팻말이에요.','j':'"교장실" 팻말이에요.','u':'"2층 ↑" 팻말이에요. 계단으로 올라가요.'}},

 hall2:{name:'느티고 · 2층 복도',reg:'NEUTI HIGH · 2F',floor:'hallFloor',
  legend:{'#':{tile:'wall'},',':{tile:'hallFloor',walk:1},'V':{tile:'classWin'},'R':{tile:'classDoor',walk:1},'U':{tile:'musicDoor',walk:1},
   'L':{tile:'libDoor',walk:1},'N':{tile:'notice'},'P':{tile:'speaker'},'W':{tile:'hallWin'},'S':{tile:'stairs',walk:1},'p':{tile:'hallPlant'},'w':{tile:'hallWater'},'t':{tile:'studyTable'}},
  map:[
"#VUUV##VRV##VRV##NN#VLLV#P##",
"#,,,,,,,,,,,,,,,,,,,,,,,,,,#",
"#,,,,,,,,,,,,,,,,,,,,,,,,,,#",
"#,,,,,,,,,,,,,,,,,,,,,,,,,,#",
"#,,,,,,,,,,,,,tttt,,,,,,,,,#",
"#,,,,,,,,,,,,,,,,,,,,,,,,,,#",
"#,,,,,,,,,,,,,tttt,,,,,,,,,#",
"#,,,,,,,,,,,,,,,,,,,,,,,,,,#",
"#p,,,,,,,,,,,,,,,,,,,,,,,wp#",
"#WWWWWWWSSSWWWWWWWWWWWWWWWW#"],
  rooms:[[1,1,26,8,'2층 복도'],[1,1,6,3,'2층 복도 · 음악실 앞'],[12,3,19,7,'2층 복도 · 자습 책상'],[19,1,26,3,'2층 복도 · 도서관 앞']],
  warps:{'2,0':{to:'music',x:8,y:9,dir:'up'},'3,0':{to:'music',x:9,y:9,dir:'up'},'21,0':{to:'library',x:9,y:10,dir:'up'},'22,0':{to:'library',x:10,y:10,dir:'up'},'8,0':{to:'hall2',x:8,y:1,dir:'down',lock:()=>'3학년 1반이에요. 문이 닫혀 있어요. 선배들 교실이에요.'},'13,0':{to:'hall2',x:13,y:1,dir:'down',lock:()=>'3학년 2반이에요. 문이 닫혀 있어요. 선배들 교실이에요.'},'8,9':{to:'hall',x:8,y:8,dir:'up'},'9,9':{to:'hall',x:9,y:8,dir:'up'},'10,9':{to:'hall',x:10,y:8,dir:'up'}},
  things:{'#':['2층 복도 벽이에요.','벽에 "조용히! 3학년 수업 중" 종이가 있어요.'],
   'V':x=>x<=4?'음악실 창문이에요. 피아노가 보여요.':x>=20?'도서관 창문이에요. 책장이 보여요.':'3학년 교실이에요. 다들 문제집만 봐요.',
   'N':['게시판: "도서관 독후감 대회"','게시판: "음악실은 점심시간에도 열려 있어요."'],
   'P':'스피커예요.',
   'W':['창밖에 운동장하고 느티나무가 보여요.','2층이라 운동장이 다 보여요.'],
   'p':'화분이에요. 누가 물을 너무 많이 줬어요.',
   'w':'정수기예요. 컵이 하나도 없어요.',
   't':['복도 자습 책상이에요. 3학년 선배들 자리예요.','책상 위에 단어장이 펼쳐져 있어요.','누가 책상에 "3학년 화이팅!"이라고 썼어요.']}},

 class:{name:'2학년 3반 교실',reg:'CLASS 2-3',floor:'wood',
  legend:{'#':{tile:'wall'},'.':{tile:'wood',walk:1},'B':{tile:'board'},'J':{tile:'timetable'},'W':{tile:'sideWin'},'k':{tile:'tdesk',over:1},'T':{tile:'terminal'},
   'R':{tile:'classDoor',walk:1},'d':{tile:'desk'},'L':{tile:'lockers'},'b':{tile:'piggy'}},
  map:[
"####BBBBBBBBB##J####",
"W..................#",
"W.......kT.........#",
"W..................#",
"W.dd.dd.dd.dd.dd...#",
"W..................#",
"W.dd.dd.dd.dd.dd...#",
"W..................#",
"W.dd.dd.dd.dd.dd...#",
"W..................#",
"W.dd.dd.dd.dd.dd.b.#",
"W..................#",
"WLLLLLLLLLLLLLLLLLR#",
"####################"],
  rooms:[[1,1,18,3,'2학년 3반 · 교탁 앞'],[1,4,18,11,'2학년 3반 교실']],
  warps:{'18,12':{to:'hall',x:22,y:1,dir:'down'}},
  things:{'#':['교실 벽이에요. 반 사진이 붙어 있어요.','벽에 "2학년 3반"이라고 쓰여 있어요.'],
   'B':x=>x===4?'칠판에 오늘 날짜가 있어요.':x===12?'칠판 구석: "주번: 남궁찬"':['칠판에 "전학생 환영!"이라고 쓰여 있어요.','분필 글씨가 반쯤 지워졌어요.','칠판에 수학 문제가 남아 있어요. 어려워요.'][x%3],
   'J':'시간표예요. 오늘 점심 다음은 수학이에요.',
   'W':['창밖에 학교 뒷산이 보여요.','창문이 열려 있어요. 바람이 시원해요.','창가에 작은 화분이 있어요.'],  // north of the 1층 corridor: no view of the 운동장
   'k':'교탁이에요. 분필하고 출석부가 있어요.',
   'd':['책상 위에 수학 문제집이 있어요.','책상에 작은 낙서: "졸려…"','책상 위에 필통하고 물병이 있어요.','책상 서랍에 과자가 숨어 있어요.'],
   'b':'분홍색 돼지 저금통. 배에 "벌금"이라고 쓰여 있어요.',
   'L':['사물함이에요. 이름표가 다 붙어 있어요.','사물함 하나가 안 닫혀요. 체육복이 보여요.','"오다온" 사물함. 아주 깔끔해요.']}},

 cafe:{name:'급식실',reg:'CAFETERIA',floor:'checkFloor',
  legend:{'#':{tile:'wall'},',':{tile:'checkFloor',walk:1},'D':{tile:'cafDoor',walk:1},'M':{tile:'menu'},'W':{tile:'sideWin'},'h':{tile:'snacks'},
   'k':{tile:'kitchen'},'=':{tile:'serve',over:1},'m':{tile:'shopCounter',over:1},'v':{tile:'vending'},'t':{tile:'lunchTable'}},
  map:[
"#####MM###DD#####hhhhhh#",
"#kkkkkkkk#,,,,,,#,,,,,,#",
"#========#,,,,,,#mmmm,v#",
"W,,,,,,,,,,,,,,,#,,,,,,#",
"W,,,,,,,,,,,,,,,,,,,,,,#",
"W,tttt,,tttt,,tttt,,,,,#",
"W,,,,,,,,,,,,,,,,,,,,,,#",
"W,tttt,,tttt,,tttt,,,,,#",
"W,,,,,,,,,,,,,,,,,,,,,,#",
"W,tttt,,tttt,,tttt,,,,,#",
"W,,,,,,,,,,,,,,,,,,,,,,#",
"########################"],
  rooms:[[1,1,15,10,'급식실'],[17,1,22,4,'매점']],
  warps:{'10,0':{to:'hall',x:16,y:8,dir:'up'},'11,0':{to:'hall',x:17,y:8,dir:'up'}},
  things:{'#':['급식실 벽이에요. 맛있는 냄새가 나요.','벽에 "음식 남기지 마세요!"라고 쓰여 있어요.'],
   'M':'오늘의 메뉴: 밥, 미역국, 불고기, 김치.',
   'W':['창밖에 느티나무가 보여요.','창밖 운동장에서 남자애들이 공을 차요.'],
   'h':['과자하고 빵이 가득해요.','바나나우유가 한 줄 있어요. 인기가 많아요.','복숭아 주스도 있어요. 분홍색이에요.'],
   'k':['큰 솥에서 국이 보글보글 끓어요.','조리실에서 김이 올라와요.'],
   '=':['배식대예요. 불고기 냄새가 좋아요.','김치가 아주 빨개요. 매워 보여요.','밥이 산처럼 쌓였어요.'],
   'm':'매점 계산대예요. 사탕 통이 있어요.',
   'v':'자판기예요. 바나나우유가 인기가 많아요.',
   't':['식판에 밥이 반쯤 남았어요.','긴 식탁이에요. 반찬 냄새가 나요.','누가 우유를 쏟았어요. 하필 여기에.','누가 밥을 다 먹었어요. 식판이 깨끗해요.']}},

 bcast:{name:'방송실',reg:'BROADCAST ROOM',floor:'oldFloor',
  legend:{'#':{tile:'wall'},'.':{tile:'oldFloor',walk:1},'D':{tile:'bcDoor',walk:1},'r':{tile:'rack'},'A':{tile:'onair'},'O':{tile:'poster'},'W':{tile:'streetWin'},
   'M':{tile:'mixer'},'i':{tile:'micStand',over:1},'s':{tile:'oldSofa'},'c':{tile:'tapeCart'},'x':{tile:'boxes'},'T':{tile:'notebook',term:1},'b':{tile:'sayeon'}},
  map:[
"##rrrrADD#OO####",
"#..............W",
"#..MMMM....i...W",
"#..............W",
"#ss.........c..W",
"#ss............W",
"#..............W",
"#.....xx.......W",
"#.....x.....x..W",
"#cx.........xx.#",
"################"],
  rooms:[[1,1,14,6,'방송실'],[11,7,14,9,'방송실 · 구석']],
  warps:{'7,0':{to:'hall',x:24,y:8,dir:'up'},'8,0':{to:'hall',x:25,y:8,dir:'up'}},
  things:{'#':['벽에 먼지가 많아요.','벽에 오래된 사진 자국이 있어요.','구름이 벽을 조금 닦았어요. 거기만 하얘요.'],
   'r':['카세트테이프가 가득해요. 다 옛날 노래예요.','테이프 이름이 다 손글씨예요.','테이프 하나에 "점심 방송 1"이라고 쓰여 있어요.'],
   'A':'"방송 중" 램프예요.',
   'O':['빛바랜 포스터예요. 아주 옛날 거예요.','포스터에 마이크 그림이 있어요.'],
   'W':['창문이 먼지 때문에 뿌예요.','창밖에 학교 앞 길하고 빌라들이 보여요.','창밖 전봇대에 전깃줄이 많아요. 새가 앉아 있어요.','건너편 건물 2층은 학원이에요. 멀리 아파트도 보여요.','길 건너에 편의점이 있어요. 밖에 파라솔하고 테이블이 있어요.'],
   'M':['방송 기계예요. 버튼이 많아요.','버튼 위에 이름표: "노래" "마이크"','기계 위에 먼지가 쌓였어요.'],
   'i':'마이크예요. "아, 아…"',
   's':['낡은 소파예요. 앉으면 먼지가 펑!','소파 밑에 과자 봉지가 있어요.'],
   'c':'옛날 녹음기예요. 테이프가 걸려 있어요.',
   'x':['상자에 "축제 1998"이라고 쓰여 있어요.','상자 안에 전선이 가득해요.','상자가 무거워요. 안 움직여요.']}},

 music:{name:'음악실',reg:'MUSIC ROOM',floor:'wood',
  legend:{'#':{tile:'wall'},'.':{tile:'wood',walk:1},'D':{tile:'musicDoor',walk:1},'M':{tile:'staffBoard'},'J':{tile:'portraits'},'W':{tile:'sideWin'},
   'P':{tile:'piano'},'s':{tile:'mstand'},'h':{tile:'chair'},'d':{tile:'drums'},'x':{tile:'mShelf'}},
  map:[
"####MMMMMM##JJ####",
"W................#",
"W..PPP......s.s..#",
"W................#",
"W..hh.hh.hh.hh...#",
"W................#",
"W..hh.hh.hh.hh...#",
"W................#",
"W.dd.........xx..#",
"W................#",
"########DD########"],
  rooms:[[1,1,16,3,'음악실 · 피아노 앞'],[1,4,16,9,'음악실']],
  warps:{'8,10':{to:'hall2',x:2,y:1,dir:'down'},'9,10':{to:'hall2',x:3,y:1,dir:'down'}},
  things:{'#':['벽에 "조용히! 연습 중"이라고 쓰여 있어요.','벽이 폭신해요. 소리를 먹는 벽이에요.'],
   'M':x=>x===4?'칠판에 높은음자리표가 크게 있어요.':['칠판에 악보가 그려져 있어요.','칠판 구석: "다음 시간 가창 시험"','칠판에 음표가 춤을 추는 것 같아요.'][x%3],
   'J':x=>x===12?'옛날 음악가 사진이에요. 하얀 머리가 길어요.':'옛날 음악가 사진. 눈이 나를 따라와요…',
   'W':['창밖에 학교 뒷산이 보여요.','창문이 조금 열려 있어요. 노래가 밖으로 나갔겠어요.'],  // north of the 2층 corridor: no view of the 운동장
   'P':x=>x===4?'피아노 위에 악보가 펼쳐져 있어요.':['피아노예요. 건반 하나가 안 눌려요.','피아노 뚜껑에 손자국이 있어요. 아직 따뜻해요.'][x%2],
   's':['보면대예요. 악보에 연필로 "숨!"이라고 쓰여 있어요.','보면대가 조금 기울었어요.'],
   'h':['파란 의자예요. 줄이 반듯해요.','의자 위에 누가 리코더를 두고 갔어요.','의자 밑에 작은 머리끈이 떨어져 있어요.'],
   'd':['드럼이에요. 치고 싶지만… 쉿.','심벌이 반짝반짝해요.'],
   'x':['악기 선반이에요. 리코더하고 우쿨렐레가 있어요.','탬버린이 하나 있어요. 방울이 하나 빠졌어요.']}},

 gym:{name:'체육관',reg:'GYM',floor:'court',
  legend:{'#':{tile:'wall'},',':{tile:'court',walk:1},'D':{tile:'exitDoor',walk:1},'W':{tile:'sideWin'},'H':{tile:'hoop'},'m':{tile:'mat'},'o':{tile:'ballCart'},'b':{tile:'bleacher'},'Z':{tile:'gymBanner',floor:'wall'}},
  map:[
"#########ZZZZZZ#########",
"#bbbbbbbb,,,,,,bbbbbbbb#",
"#bbbbbbbb,,,,,,bbbbbbbb#",
"W,,,,,,,,,,,,,,,,,,,,,,W",
"W,,,,,,,,,,,,,,,,,,,,,,W",
"#,,,,,,,,,,,,,,,,,,,,,,#",
"H,,,,,,,,,,,,,,,,,,,,,,H",
"#,,,,,,,,,,,,,,,,,,,,,,#",
"Wmm,,,,,,,,,,,,,,,,,,,,W",
"Wmm,,,,,,,,,,,,,,,,,,ooW",
"W,,,,,,,,,,,,,,,,,,,,,,W",
"#,,,,,,,,,,,,,,,,,,,,,,#",
"###########DD###########"],
  rooms:[[1,1,22,11,'체육관']],
  warps:{'11,12':{to:'yard',x:27,y:5,dir:'down'},'12,12':{to:'yard',x:28,y:5,dir:'down'}},
  things:{'#':['체육관 벽이에요. 공 자국이 많아요.','벽에 "느티고 화이팅!" 현수막이 있어요.'],
   'W':['높은 창문이에요. 햇빛이 길게 들어와요.','창문에 그물이 있어요. 공 때문이에요.'],
   'Z':['"느티고 화이팅!" 현수막이에요. 체육 대회 때 만들었대요.','현수막 글씨가 조금 삐뚤어요. 손으로 썼어요.'],
   'H':['농구 골대예요. 그물이 반쯤 찢어졌어요.','골대가 높아요. 찬은 한 번도 못 넣었대요.'],
   'm':['파란 매트예요. 누우면 바로 잠이 와요.','매트에서 땀 냄새가 나요. 별로예요.'],
   'o':['공 수레예요. 농구공하고 배구공이 가득해요.','공 하나가 바람이 빠졌어요.'],
   'b':['나무 관람석이에요. 계단처럼 높아져요.','관람석에 누가 물병을 두고 갔어요.','관람석 밑에 배드민턴 공이 숨어 있어요.']}},

 library:{name:'도서관',reg:'LIBRARY',floor:'carpet',
  legend:{'#':{tile:'wall'},'.':{tile:'carpet',walk:1},'D':{tile:'libDoor',walk:1},'B':{tile:'bookWall'},'W':{tile:'libWin'},'b':{tile:'libShelf'},
   'K':{tile:'libDesk',over:1},'t':{tile:'readTable'},'n':{tile:'magRack'},'c':{tile:'pc'},'r':{tile:'bookCart'},'p':{tile:'plant'}},
  map:[
"#BBBBBBBBWWBBBBBBBB#",
"#..................#",
"#.bb.bb.bb.........#",
"#.bb.bb.bb...KKK...#",
"#..................#",
"#..................#",
"#.tttt..tttt...nn..#",
"#..................#",
"#.tttt..tttt.......#",
"#..................#",
"#cc.cc..........rp.#",
"#########DD#########"],
  rooms:[[1,1,18,5,'도서관 · 서가'],[1,6,18,10,'도서관 · 열람실']],
  warps:{'9,11':{to:'hall2',x:21,y:1,dir:'down'},'10,11':{to:'hall2',x:22,y:1,dir:'down'}},
  things:{'#':['도서관 벽이에요. "조용히" 종이가 붙어 있어요.','벽에 "이달의 책" 사진이 있어요.'],
   'B':['책이 빽빽해요. 소설 칸이에요.','"맞춤법 사전"이 보여요. 두꺼워요.','역사책 칸이에요. 먼지가 조금 있어요.','시집 칸이에요. 얇은 책이 많아요.'],
   'W':['창밖에 학교 뒷산이 보여요. 나무가 많아요.','창밖이 조용해요. 운동장 소리도 잘 안 들려요.'],  // north windows: the 운동장 and its 느티나무 are on the other side of the building
   'b':['책장이에요. 만화책 칸은 텅 비었어요.','"1990년대 학교 신문" 묶음이 있어요.','책 사이에 누가 쪽지를 끼웠어요. "재밌다!"','과학 잡지가 줄줄이 있어요.'],
   'K':['도서부 책상이에요. 도장이 있어요.','"반납은 여기" 상자예요.'],
   't':['책상 위에 펼친 책이 있어요.','책상에 작은 낙서: "독후감 싫어…"','지우개 가루가 잔뜩 있어요.','누가 수학 문제집을 두고 갔어요.'],
   'n':['잡지 꽂이예요. 패션 잡지, 게임 잡지.','학교 신문이에요. "느티나무, 올해도 건강해요."'],
   'c':['학생용 컴퓨터예요. 학교 앱 게시판이 떠 있어요.','컴퓨터 화면에 "게임 금지" 종이가 붙어 있어요.'],
   'r':'반납 수레예요. 책이 높이 쌓였어요.',
   'p':'화분이에요. 도서부가 매일 물을 줘요.'}},
 /* 학교 앞, outside the 정문 (2교시–4교시; the 정문 opens to it by spec.gate): the shops' doors lead to a 교시's own rooms
    (분식집 bunsik, 코인 노래방 nr, 학원 hagwon), open when the 교시 lists them */
 street:{name:'학교 앞',reg:'IN FRONT OF SCHOOL',outdoor:1,
  legend:{'R':{tile:'roof'},'K':{tile:'sign'},'O':{tile:'shopWin'},'e':{tile:'shopDoor'},'E':{tile:'shopDoor',walk:1},'N':{tile:'nrDoor',walk:1},'h':{tile:'brick'},
   'A':{tile:'acad'},'H':{tile:'acadDoor',walk:1},',':{tile:'pave',walk:1},'r':{tile:'road'},'z':{tile:'crosswalk',walk:1},'l':{tile:'lamp'},'t':{tile:'streetTree'},
   'B':{tile:'busStop'},'f':{tile:'sfence'},'G':{tile:'sgate',walk:1}},
  map:[
"RRRRRRRhRRRRRRhRRRRRRhRRRRRRhAAAAAA",
"KKKKKKKhKKKKKKhKKKKKKhKKKKKKhAAAAAA",
"OOeOOOOhOOEOOOhOOOeOOhOOONOOhAAHHAA",
",,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,",
",t,,,,l,,,,,,,,,,,,,l,,,,,,,,,,,,t,",
"rrrrrrrrrrzzrrrrrrrrrrrrrrrrrrrrrrr",
"rrrrrrrrrrzzrrrrrrrrrrrrrrrrrrrrrrr",
",,,,,,,,,,,,,,,,,,BB,,,,,,,,,,,,,,,",
",t,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,t,",
"ffffffffffGGfffffffffffffffffffffff"],
  rooms:[[0,3,34,4,'동네 상가'],[0,7,34,8,'학교 앞']],
  warps:{'10,9':{to:'yard',x:11,y:12,dir:'up'},'11,9':{to:'yard',x:12,y:12,dir:'up'},'10,2':{to:'bunsik',x:7,y:9,dir:'up'},'25,2':{to:'nr',x:15,y:8,dir:'up'},
   '31,2':{to:'hagwon',x:8,y:8,dir:'up'},'32,2':{to:'hagwon',x:9,y:8,dir:'up'}},
  things:{'R':x=>x<7?'문구점 지붕이에요. 파란색이에요.':x<14?'분식집 지붕이에요. 빨간색이에요.':x<21?'편의점 지붕이에요. 초록색이에요.':'코인 노래방 지붕이에요. 보라색이에요.',
   'K':x=>x<7?'간판: "느티 문구"':x<14?'간판: "엄마손 분식" 떡볶이 그림이 있어요.':x<21?'간판: "24시 편의점"':'"코인 노래방" 간판이 반짝반짝해요.',
   'O':x=>x<7?'문구점 창문. 예쁜 공책하고 펜이 있어요.':x<14?['창문 너머로 떡볶이가 보글보글.','창문에 "떡볶이 삼천 원" 종이.'][x%2]:x<21?'편의점 창문. 컵라면이 줄줄이 있어요.':'창문에 별 스티커가 붙어 있어요.',
   'e':x=>x<7?'문구점 문이에요. "잠깐 은행 다녀올게요"':'편의점 문이에요. 사람이 너무 많아요.',
   'h':['빨간 벽돌 벽이에요.','벽돌 사이에 작은 풀이 자라요.'],
   'A':x=>['학원 건물이에요. 층마다 학원 간판이 있어요.','창문마다 학생들이 보여요. 다 공부 중이에요.','"느티 수학 · 합격률 높은 학원"'][x%3],
   'r':['차가 다니는 길이에요. 횡단보도로 건너요.','학원 버스가 쌩 지나가요.','길에 노란 줄이 있어요.'],
   'l':'가로등이에요. 아직 불이 꺼져 있어요.',
   't':['가로수예요. 잎이 반짝여요.','나무 밑에 고양이가 자고 있어요.'],
   'B':['버스 정류장이에요. "학원가 방향"','정류장 의자예요. 아무도 안 앉아 있어요.'],
   'f':['학교 울타리예요. 안에 느티나무가 보여요.','울타리에 "학생 안전 구역" 표지판.']}}
});

/* cars on the 학교 앞 road (2교시, 3교시; a chapter's road and crosswalk tiles call streetCar with the road's top row): two lanes,
   the upper drives right and the lower left, one car each going round. While you stand on the crosswalk a car waits before it,
   or behind you if it is already past its edge, then drives on when you step off. */
const CARS={};
globalThis.streetCar=function(X,Y,x,y,t,top){
 const lane=y-top;if(lane!==0&&lane!==1)return;
 const W=MW*16+96,k=ZID+lane,zw=i=>(Z.legend[at(i,y)]||{}).tile==='crosswalk';let c=CARS[k];
 if(!c){let z0=1e9,z1=-1;for(let i=0;i<MW;i++)if(zw(i)){z0=Math.min(z0,i*16);z1=Math.max(z1,i*16+16)}c=CARS[k]={cx:(lane?W*.6:W*.1)-48,t,z0,z1}}
 if(c.t!==t){const dt=Math.min(100,Math.max(0,t-c.t)),d=dt/(lane?12:9);c.t=t;
  const on=(Z.legend[at(player.x,player.y)]||{}).tile==='crosswalk',pl=player.x*16;
  if(!lane){const f=c.cx+30;let n=c.cx+d;if(on){const s=f<=c.z0-2?c.z0-2:f<=pl-2?pl-2:null;if(s!==null)n=Math.min(n,Math.max(c.cx,s-30))}c.cx=n>=W-48?n-W:n}
  else{const f=c.cx;let n=c.cx-d;if(on){const s=f>=c.z1+2?c.z1+2:f>=pl+18?pl+18:null;if(s!==null)n=Math.max(n,Math.min(c.cx,s))}c.cx=n<-48?n+W:n}}
 const px=c.cx-x*16;if(px<=-32||px>=16)return;
 inTile(X,Y,()=>{const bx=X+px,col=lane?'#F2C46B':'#D2533F';r(bx,Y+4,30,9,col);r(bx+6,Y+2,16,5,col);r(bx+8,Y+3,5,3,'#BFE3F0');r(bx+15,Y+3,5,3,'#BFE3F0');r(bx+3,Y+12,5,3,'#1B1E2B');r(bx+22,Y+12,5,3,'#1B1E2B');r(lane?bx:bx+28,Y+6,2,2,'#FFF3C4')})};
/* doors to rooms a 교시 hasn't opened */
const CLOSED={hall:'학교 건물이에요.',hall2:'2층 계단이에요. 지금은 올라갈 일이 없어요.',class:'2학년 3반이에요. 지금은 들어갈 일이 없어요.',
 cafe:'급식실 문이 닫혔어요.',bcast:'"방송실". 문이 잠겨 있어요.',music:'음악실이에요. 문이 잠겨 있어요.',gym:'체육관이에요. 문이 잠겨 있어요.',
 library:'도서관이에요. 문이 잠겨 있어요.',yard:'운동장이에요.',
 street:'학교 앞이에요.',bunsik:'분식집이에요. 지금은 들어갈 일이 없어요.',nr:'코인 노래방이에요. 지금은 들어갈 일이 없어요.',hagwon:'학원 건물이에요. 지금은 들어갈 일이 없어요.'};
/* spec: {open:[zone ids the 교시 uses; yard and hall are always open], gate:{to,x,y,dir,lock} (the 정문 leads out),
   zones:{id:{things,spots,npcs,locks:{toZone:fn},legend,paint:[[x,y,'chars']],rooms,dark,slow}}} */
globalThis.SCHOOL=function(spec){
 spec=spec||{};const open=new Set(['yard','hall',...(spec.open||[])]),B=base(),out={};
 for(const id in B){
  const z=B[id],o=(spec.zones||{})[id]||{};
  for(const w of Object.values(z.warps)){const lk=o.locks&&o.locks[w.to];if(lk)w.lock=lk;else if(!open.has(w.to)&&!w.lock)w.lock=()=>CLOSED[w.to]}
  if(id==='yard'&&spec.gate){const g=spec.gate;z.legend.G={tile:'gate',walk:1};delete z.things.G;[11,12].forEach((x,i)=>{z.warps[x+',13']={to:g.to,x:g.x+i,y:g.y,dir:g.dir||'down',lock:g.lock}})}
  if(o.legend)Object.assign(z.legend,o.legend);
  if(o.paint){z.painted=[];for(const [x,y,str] of o.paint){const row=z.map[y];z.map[y]=row.slice(0,x)+str+row.slice(x+str.length);for(let i=0;i<str.length;i++)z.painted.push((x+i)+','+y)}}
  for(const c in z.things)if(!z.map.some(row=>row.includes(c)))delete z.things[c];  /* painted over */
  if(o.rooms)z.rooms=o.rooms;
  z.things={...z.things,...(o.things||{})};z.spots=o.spots||{};z.npcs=o.npcs||[];
  /* a wall tile drawn as its dark top (TILES.wall: the tile below is wall too, e.g. between two rooms or along the edge) isn't the
     painted face that the zone's wall lines describe */
  const wl=z.things['#'];
  if(wl&&z.legend['#']&&z.legend['#'].tile==='wall'){const M=z.map,isW=(x,y)=>{const c=M[y]&&M[y][x];if(c==null)return true;const L=z.legend[c];return !!L&&WALLISH.has(L.tile)};
   z.things['#']=(x,y)=>isW(x,y+1)&&!(y===M.length-1&&!isW(x,y-1))?'두꺼운 회색 벽이에요.':typeof wl==='function'?wl(x,y):wl}
  for(const k of ['dark','slow','outdoor','greet'])if(k in o)z[k]=o[k];
  out[id]=z;
 }
 return out;
};
/* pixel Hangul for shop signs (9 px tall): SIGN_TEXT draws a word centred across a sign spanning tiles x0..x1 — this tile's slice
   of it — so street signs say real words (분식, 편의점…) a learner can read, not Hangul-like squiggles */
const GLYPHS={
 '느':['.#.....','.#.....','.#.....','.#.....','.#####.','.......','.......','#######','.......'],  /*nolex*/
 '티':['#####.#','#.....#','#.....#','#####.#','#.....#','#.....#','#####.#','......#','......#'],  /*nolex*/
 '문':['.#####.','.#...#.','.#####.','.......','#######','...#...','.#.....','.#.....','.#####.'],  /*nolex*/
 '구':['.#####.','.....#.','.....#.','.....#.','.......','#######','...#...','...#...','...#...'],  /*nolex*/
 '엄':['.##...#','#..#..#','#..#.##','.##...#','......#','.......','.#####.','.#...#.','.#####.'],  /*nolex*/
 '마':['####.#.','#..#.#.','#..#.##','####.#.','.....#.','.....#.','.....#.','.....#.','.......'],  /*nolex*/
 '손':['...#...','..#.#..','.#...#.','#.....#','...#...','#######','.#.....','.#.....','.#####.'],  /*nolex*/
 '분':['.#...#.','.#####.','.#...#.','.#####.','#######','...#...','.#.....','.#.....','.#####.'],  /*nolex*/
 '식':['..#...#','..#...#','.#.#..#','#...#.#','......#','.......','######.','.....#.','.....#.'],  /*nolex*/
 '시':['..#...#','..#...#','..#...#','.#.#..#','.#.#..#','#...#.#','......#','......#','......#'],  /*nolex*/
 '편':['#####..#','.#.#..##','.#.#...#','#####.##','.......#','........','.#......','.#......','.#####..'],  /*nolex*/
 '의':['.###..#','#...#.#','#...#.#','.###..#','......#','#####.#','......#','......#','......#'],  /*nolex*/
 '점':['#####.#','..#...#','.#.#.##','#...#.#','......#','.......','.#####.','.#...#.','.#####.'],  /*nolex*/
 '코':['.#####.','.....#.','..####.','.....#.','.......','...#...','...#...','#######','.......'],  /*nolex*/
 '인':['.###..#','#...#.#','#...#.#','.###..#','......#','.......','.#.....','.#.....','.#####.'],  /*nolex*/
 '노':['.#.....','.#.....','.#.....','.#####.','.......','...#...','...#...','#######','.......'],  /*nolex*/
 '래':['####.#.#','...#.#.#','####.###','#....#.#','####.#.#','.....#.#','.....#.#','.....#.#','........'],  /*nolex*/
 '방':['#..#.#.','####.#.','#..#.##','####.#.','.....#.','..###..','.#...#.','.#...#.','..###..'],  /*nolex*/
 '집':['#####.#','..#...#','.#.#..#','#...#.#','......#','.#...#.','.#####.','.#...#.','.#####.'],  /*nolex*/
 '교':['#######','......#','......#','......#','.......','..#.#..','..#.#..','#######','.......'],  /*nolex*/
 '무':['.#####.','.#...#.','.#...#.','.#####.','.......','#######','...#...','...#...','...#...'],  /*nolex*/
 '실':['..#...#','.#.#..#','#...#.#','......#','.#####.','.....#.','.#####.','.#.....','.#####.'],  /*nolex*/
 '장':['#####.#.','..#...#.','.#.#..##','#...#.#.','......#.','..####..','.#....#.','.#....#.','..####..'],  /*nolex*/
 '층':['...#...','#######','..#.#..','.#...#.','#######','.......','..###..','.#...#.','..###..'],  /*nolex*/
 '수':['...#...','..#.#..','.#...#.','#.....#','.......','#######','...#...','...#...','...#...'],  /*nolex*/
 '학':['.##..#.','####.#.','.##..##','#..#.#.','.##..#.','.......','######.','.....#.','.....#.'],  /*nolex*/
 '원':['.###..#','#...#.#','.###..#','.....##','#####.#','..#...#','.#.....','.#.....','.#####.'],  /*nolex*/
 '2':['.###.','#...#','....#','...#.','..#..','.#...','#####','.....','.....'],  /*nolex*/
 '4':['...#.','..##.','.#.#.','#..#.','#####','...#.','...#.','.....','.....']};
globalThis.SIGN_TEXT=(X,Y,x,x0,x1,top,text,c)=>{const gs=[...text].map(ch=>GLYPHS[ch]||null),GAP=2,W=(x1-x0+1)*16,ox=(x-x0)*16;
 const tw=gs.reduce((n,g)=>n+(g?g[0].length:3),0)+GAP*(gs.length-1);let gx=Math.floor((W-tw)/2);
 for(const g of gs){if(g)g.forEach((row,j)=>{for(let i=0;i<row.length;i++)if(row[i]==='#'){const px=gx+i;if(px>=ox&&px<ox+16)r(X+px-ox,Y+top+j,1,1,c)}});gx+=(g?g[0].length:3)+GAP}};
globalThis.SCHOOL_TILES=TILES;globalThis.SCHOOL_WALLISH=[...WALLISH];globalThis.SCHOOL_BASE=base;
})();

/* Someone who quizzes you on purpose ("문제 하나 낼게요": 매점 이모, 경비 아저씨, 분식집 아저씨): a word of yours that's due, graded like a
   review — one of their own C.REVIEW lines (by their id) first, in their voice; else from this 교시 or an earlier one, in the
   notebook's sentence; with nothing due, one of their own general questions (never the one they asked last). A word asked in this
   conversation or the two before it (the notebook's round, someone else's quiz) waits (engine: askedIn[w], talkN). Once per story
   beat each (id): asked again before the story moves on, they only say hello — null, and the caller leaves the quiz out. The
   question is made, and the quiz noted (state.quizAt[id] = beats()), when its step is reached: a script is also asked for status
   marks, and that mustn't use the quiz up. */
function quizLine(fallback,id){
 const at=state.quizAt||{},last=id&&at[id];
 if(last&&last.b===beats())return null;
 return {expand:()=>{
  const fresh=w=>!(askedIn[w]>=talkN-2);
  let q,pre=[];const due=dueWords().filter(fresh);
  const own=id?(C.REVIEW||[]).filter(r=>[].concat(r.by).includes(id)&&known(r.w)&&isDue(r.w)&&fresh(r.w)&&(!r.when||r.when())):[];
  if(own.length){const lo=Math.min(...own.map(r=>lv(r.w).b)),p=own.filter(r=>lv(r.w).b===lo),r=p[Math.random()*p.length|0];  // the weakest word first
   hear(r);pre=says(r.pre||[]);q={...r,review:true};delete q.by;delete q.pre;delete q.when}
  else if(due.length){q={...reviewFor([due[Math.random()*due.length|0]])};delete q.who}  // their voice, not the narrator's
  else{const fb=fallback.filter(o=>(!last||o.ask!==last.ask)&&(!o.w||fresh(o.w))),pool=fb.length?fb:fallback;q={...pool[Math.random()*pool.length|0],old:1}}
  if(id){(state.quizAt||(state.quizAt={}))[id]={b:beats(),ask:q.ask};save()}
  return [...pre,q]}};
}

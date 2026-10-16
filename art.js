const O='#35243d';
export function rect(c,x,y,w,h,color){c.fillStyle=color;c.fillRect(Math.round(x),Math.round(y),w,h)}
export function sprite(c,rows,palette,x,y,s=3,flip=false){c.save();c.translate(Math.round(x)+(flip?rows[0].length*s:0),Math.round(y));if(flip)c.scale(-1,1);rows.forEach((row,yy)=>[...row].forEach((p,xx)=>{if(palette[p])rect(c,xx*s,yy*s,s,s,palette[p])}));c.restore()}
const hero=[
'......OO.......','...OOOOOOOO....','..OHHHHHHHHO...','.OHHHHHHHHHHO..','.OHHHHHHHHHHHO.','.OHHHHHHHHHHHO.','.OHHTTTTTTTTO..','.OHTTSTTTSTTO..','.OHTTSTTTSTTO..','..OTTTPPTTTO...','...OTTTTTTO....','...OORRROO.....','..ORRRRRRRO....','..OTRRRRRTO....','..OTRRRRRTO....','...OPPPPOO.....','...OPPOPPO.....','...OOO.OOO.....'];
// Keep the supplied PNG unchanged; frame its visible artwork when drawing.
const characterImage = typeof Image !== 'undefined' ? new Image() : null;
export const characterReady = characterImage ? new Promise(resolve => {
 characterImage.onload = () => resolve(true);
 characterImage.onerror = () => resolve(false);
 characterImage.src = new URL('./assets/birthday-character.png', import.meta.url).href;
}) : Promise.resolve(false);
export function drawHero(c,x,y,face,walking,time){const bob=walking?Math.sin(time*14)*1.2:0;
 if(characterImage?.complete && characterImage.naturalWidth>0){
  const height=80,scale=height/1463,width=scale*830;
  // Match the first game's sine-wave timing and amplitudes:
  // a small body bounce, an anchored left shoe, and a bobbing right shoe.
  const bodyBob=Math.round(bob);
  const footBob=walking?Math.round(Math.sin(time*14)*3):0;
  c.save();c.imageSmoothingEnabled=false;
  c.translate(Math.round(x+15),Math.round(y+51));
  if(face<0)c.scale(-1,1);
  const drawPart=(sx,sy,sw,sh,dx=0,dy=0)=>c.drawImage(
   characterImage,sx,sy,sw,sh,
   -width/2+(sx-97)*scale+dx,-height+(sy-17)*scale+dy,sw*scale,sh*scale);
  // Animate the shoes rather than lifting the entire leg.
  drawPart(328,1330,182,150,0,0);
  drawPart(510,1330,187,150,0,footBob);
  drawPart(97,17,830,1379,0,bodyBob);
  // Render a cheerful pixel smile over the original neutral mouth.
  c.save();c.translate(0,bodyBob);
  rect(c,-4,-34,7,5,'#ffe0be');
  // Short, bright eyes and a small open smile match the supplied reference.
  rect(c,-8,-38,4,5,'#ffe0be');rect(c,5,-38,4,5,'#ffe0be');
  rect(c,-8,-38,4,3,'#27232b');rect(c,5,-38,4,3,'#27232b');
  rect(c,-6,-37,1,1,'#fffdf5');rect(c,7,-37,1,1,'#fffdf5');
  rect(c,-3,-32,5,1,'#35243d');rect(c,-2,-31,3,1,'#35243d');
  c.globalAlpha=.5;rect(c,-8,-33,2,1,'#ed9e99');rect(c,6,-33,2,1,'#ed9e99');
  c.restore();
  c.restore();return;
 }
sprite(c,hero,{O,H:'#59423f',T:'#e6a476',S:'#302631',P:'#283c46',R:'#873452'},x-5,y-3+bob,3,face<0);if(walking){rect(c,x+5,y+48,9,3,O);rect(c,x+19,y+48+Math.sin(time*14)*3,9,3,O)}}
export function star(c,x,y,color='#fff3b2',s=2){rect(c,x,y-s, s,s*3,color);rect(c,x-s,y,s*3,s,color)}
export function cloud(c,x,y,s=1){c.save();c.translate(x,y);c.scale(s,s);rect(c,0,17,90,12,'#c3edf2');rect(c,8,8,19,13,'#e2f7ef');rect(c,20,0,26,25,'#fffdf0');rect(c,43,8,21,17,'#e2f7ef');rect(c,64,14,19,11,'#f8fbea');rect(c,3,23,86,6,'#bce5eb');c.restore()}
export function gift(c,x,y,t){c.save();c.shadowColor='#ffe898';c.shadowBlur=20+8*Math.sin(t*3);rect(c,x-3,y,58,52,O);rect(c,x,y,52,49,'#e2a650');rect(c,x+4,y+4,44,39,'#f5d97c');rect(c,x-6,y-2,64,14,O);rect(c,x-3,y+1,58,8,'#ffea91');rect(c,x+22,y+1,11,48,'#bd6279');rect(c,x+25,y+2,4,45,'#ec94a0');rect(c,x+9,y-14,16,12,O);rect(c,x+29,y-14,16,12,O);rect(c,x+12,y-11,10,6,'#ee9baa');rect(c,x+32,y-11,10,6,'#ee9baa');rect(c,x+22,y-8,11,8,'#bd6279');c.restore();for(let i=0;i<5;i++){let a=t*.7+i*1.5;star(c,x+25+Math.cos(a)*47,y+20+Math.sin(a*1.2)*42,'#fff6c2',i%2?2:3)}}
const dog=[
'.....OOO..........OOO.....','....OBBBO........OBBBO....','...OBBBBBO......OBBBBBO...','...OBPPBBBOOOOOOBBPPBBO...','...OBPPPBBBBBBBBBPPPBBO..','...OBBBBBBBBBBBBBBBBBBO..','..OBBBBBBBBBBBBBBBBBBBBO.','.OBBBOOBBBBBBBBBOOBBBBBO.','OBCCCBBBBBBBBBBBBBBBBBBO.','OCOCCCCCBBBBBBBBBBBBBBBO.','OCCCOCCCCCCCCBBBBBBBBBBO.','.OCCCCCCCCCCCCBBBBBBBBO..','..OCCCCCCCCCCCBBBBBBBO...','...OCCCCCCCCCBBBBBBBBO...','....OCCCCCCCBBBBBBBBBO...','....OCCCCCCBBBBBBBBBBBO..','....OBCCCCBBBBBBBBBBBBBO.','....OBCCCBBBBBBBBBBBBBBO.','....OBBCCBBBBBBBBBBBBBBO.','....OBBCBBBBBBBBBBBBBBBO.','....OBBCBBBBBBBBBBBBBBBO.','...OBBBCBBBBBBBBBBBBBBBO.','...OBBBBOBBBBBBBBBBBBBO..','...OCCCBOBBBBBBBBBBBBBO..','....OOOO.OOOOOOOOOOOOO...'];
const dragon=[
'.............OOO..............','............ODDDO.............','......OO...ODDDDO.............','.....ODDO..ODDDDO.............','....ODDDDOOODDDDO.............','....ODDDDDDDDDDDOO............','...ODDDDDDDDDDDDDDO...........','..ODDDDDDDDDDDDDDDDO..........','..ODDWWDDDDDWWDDDDDO..........','..ODDOWDDDDDOWDDDDDO..........','..ODDDDDDDDDDDDDDDDO.....OO...','...ODDPDDDDDDPDDDDO....ODDO...','....ODDDDDDDDDDDDO...OODDO....','.....OOOOCCCCOOO...OODDDDO....','.....ODDCCCCCDDO..ODDDDDO.....','..OOODDCCCCCCCDDOODDDDDDO.....','.OPPODDCCCCCCCDDDDDDDDDDO.....','OPPPPODCCCCCCCDDDDDDDDDO......','OPPPPODCCCCCCCDDDDDDDDO.......','.OPPODDDCCCCCDDDDDDDDO........','..OOODDDCCCCDDDDDDDDO.........','.....ODDDCCCDDDDDDDO..........','.....ODDDDDDDDDDDDO...........','......OOODDDDOOOOO............','........OOOOO.................'];
export const cards=[
 {name:'Lion',kind:'LOYAL COMPANION',rarity:'SUPER RARE',color:'#9bc77e',accent:'#5d8d70',number:'001',desc:'This is a ferocious guardian with a big heart. With a little time, you’ll have a companion that will stay by your side through every adventure.',stats:['+ 5 craft','+ 5 awesomeness'],wish:'Every adventure is better with a friend.'},
 {name:'Glow String',kind:'RADIANT DEVICE',rarity:'ULTRA RARE',color:'#b7a5d6',accent:'#7761a1',number:'002',desc:'This little device will harness light and make sure you’re always surrounded by color. A device that will elevate any room it is in.',stats:['+ 10 illumination','+ 10 decor'],wish:'May your next chapter be full of magic.'},
 {name:'Birthday Meal',kind:'ONCE-A-YEAR MAGIC',rarity:'GODLY',color:'#e8aca9',accent:'#b76f88',number:'003',desc:'A birthday wish each time you use this! Endless combinations of great reward. Your tummy will be happy.',stats:['+ 25 health','+ 25 happiness'],wish:'Here’s to all the wishes still coming true.'}
];
export function drawCard(canvas,index){canvas.width=150;canvas.height=210;const c=canvas.getContext('2d');c.imageSmoothingEnabled=false;const a=cards[index];rect(c,0,0,150,210,O);rect(c,4,4,142,202,'#f4de86');rect(c,8,8,134,194,'#fff4c8');rect(c,11,11,128,15,a.accent);c.fillStyle='#fff8d8';c.font='bold 7px monospace';c.fillText(a.rarity,16,21);c.textAlign='right';c.fillText('✦ '+a.number,135,21);c.textAlign='left';rect(c,11,30,128,119,O);rect(c,14,33,122,113,a.color);for(let k=0;k<19;k++){let x=18+(k*37)%114,y=38+(k*23)%100;star(c,x,y,k%3?'#ffface':'#d1f5e1',k%2?1:2)}rect(c,14,128,122,18,'#ffffff22');drawCardIcon(c,index);rect(c,18,144,114,23,O);rect(c,21,147,108,17,'#fff4c9');c.fillStyle=O;c.textAlign='center';c.font='bold '+(index===2?'11':'13')+'px monospace';c.fillText(a.name.toUpperCase(),75,159);c.font='bold 7px monospace';c.fillStyle=a.accent;c.fillText(a.kind,75,177);c.textAlign='left';c.font=(index===1?'7':'8')+'px monospace';c.fillStyle=O;c.fillText(a.stats[0],16,189);c.fillText(a.stats[1],16,200);}
export function drawPack(canvas){canvas.width=100;canvas.height=144;const c=canvas.getContext('2d');rect(c,0,0,100,144,O);rect(c,4,3,92,138,'#ead17f');rect(c,7,12,86,119,'#54416a');rect(c,12,17,76,109,'#77608e');for(let i=0;i<9;i++){rect(c,8+i*10,3,4,8,'#b99f60');rect(c,8+i*10,133,4,8,'#b99f60')}for(let i=0;i<15;i++)star(c,16+(i*23)%70,24+(i*29)%93,'#f5df99',i%3?1:2);rect(c,9,28,82,25,'#392941');c.fillStyle='#fce39d';c.textAlign='center';c.font='bold 14px monospace';c.fillText('BIRTHDAY',50,40);c.font='bold 8px monospace';c.fillText('PACK',50,50);c.save();c.translate(50,84);c.rotate(Math.PI/4);rect(c,-19,-19,38,38,'#ebce77');rect(c,-13,-13,26,26,'#b97b99');c.restore();star(c,47,80,'#fff6d7',7);c.fillStyle='#fff0c3';c.font='bold 7px monospace';c.fillText('3 MAGIC CARDS',50,117)}

export function drawPortal(c,x,y,t){
 c.save();c.shadowColor='#d4a6ff';c.shadowBlur=25+8*Math.sin(t*3);
 // A stepped pixel arch, with a luminous rim and a dark magical center.
 rect(c,x+12,y,32,6,'#e7ceff');rect(c,x+4,y+6,48,8,'#c7a0ef');
 rect(c,x,y+14,56,66,'#ab79d8');rect(c,x+4,y+80,48,8,'#c7a0ef');rect(c,x+12,y+88,32,4,'#e7ceff');
 rect(c,x+12,y+10,32,7,'#8967b9');rect(c,x+7,y+17,42,59,'#654f96');rect(c,x+12,y+76,32,8,'#8967b9');
 rect(c,x+16,y+17,24,59,'#8970b5');rect(c,x+22,y+20,12,54,'#b69dd6');
 c.shadowBlur=0;
 for(let i=0;i<10;i++){const phase=t*1.6+i*.67;const px=x+28+Math.sin(phase)*17,py=y+12+((i*13-t*20)%66+66)%66;star(c,px,py,i%2?'#fff4c6':'#d1f9ed',i%3?1:2);}
 for(let i=0;i<5;i++){const a=t+i*1.3;star(c,x+28+Math.cos(a)*40,y+46+Math.sin(a)*50,'#f4deff',2);}
 rect(c,x-8,y+92,72,4,'#b8d4cb');c.restore();
}

export function drawPixelArrow(c,x,y,direction,color,s=2){
 const pixels=['....X....','....XX...','....XXX..','XXXXXXXX.','XXXXXXXXX','XXXXXXXX.','....XXX..','....XX...','....X....'];
 c.save();c.translate(Math.round(x)+9*s/2,Math.round(y)+9*s/2);
 c.rotate(({right:0,down:Math.PI/2,left:Math.PI,up:-Math.PI/2})[direction]||0);
 sprite(c,pixels,{X:color},-9*s/2,-9*s/2,s);c.restore();
}

// Original canvas pixel icons, styled after the supplied reference photos.
function drawCardIcon(c,index){
 if(index===0){
  const rows=[
   '....OOOOOOOO....................',
   '...OMMMMMMMMO...................',
   '..OMMYYYYYYMMO..................',
   '..OMMYYYYYYMMMO.................',
   '..OMMYMYYMYMMMMOO...............',
   '..OMMYYYYYYMMMMMYYO.............',
   '..OMMYYYYYYMMMMMYYYOO...........',
   '..OMMCCNCCCMMMMMYYYYYOO.........',
   '..OMMMCCCMMMMMMMYYYYYYYOO....OO.',
   '..OMMMMMMMMMMMMMYYYYYYYYYOOOOYMO',
   '..OMMMMMMMMMMMMYYYYYYYYYYYYYYYOO',
   '...OMMMMMMMMMMYYYYYYYYYYYOOOOO..',
   '....OMMMMMMMMYYYYYYYYYYYO.......',
   '....OYYYYYYYYYYYYYYYYYYO........',
   '....OYYYYYYYYYYYYYYYYYYO........',
   '....OOOOYOOOOOOYOOOYOOYO........',
   '......OYOO...OYYO.OYO.YO........',
   '......OYOO...OYYO.OYO.YO........',
   '......OYOO...OYYO.OYO.YO........',
   '......OCCO...OCCO.OCO.CO........',
   '......OOOO...OOOO.OOO.OO........'];
  sprite(c,rows,{O,M:'#925528',Y:'#dca53b',C:'#f9d57f',N:'#241e29'},24,65,3);
 }else if(index===1){
  // A gently curled LED strip with a silver backing and warm light nodes.
  const path=[[37,55],[34,61],[31,67],[28,73],[28,79],[28,85],[31,91],[34,97],[40,103],[46,106],[52,106],[58,103],[64,97],[70,88],[76,79],[82,70],[88,64],[94,61],[100,64],[106,70],[112,76],[115,82],[115,88],[112,94],[109,100],[103,106],[100,112]];
  for(const [x,y] of path)rect(c,x-4,y-2,10,10,O);
  for(const [x,y] of path){rect(c,x-3,y-3,8,8,'#c4c9cb');rect(c,x-3,y-3,4,3,'#f3eee0');}
  for(const i of [1,5,9,13,17,21,25]){const [x,y]=path[i];rect(c,x-7,y-7,16,16,'#facd7933');rect(c,x-5,y-5,12,12,'#d68b46');rect(c,x-4,y-4,10,10,'#ffcd60');rect(c,x-2,y-2,6,6,'#fff4ac');rect(c,x-1,y-1,3,3,'#fffedc');}
 }else{
  // Three separate sides, two taco shells, and a little clementine.
  rect(c,25,64,78,64,O);rect(c,22,61,78,64,'#ac8e6c');
  rect(c,25,58,72,64,'#f8e7c7');rect(c,29,62,64,56,'#bca181');
  rect(c,29,62,35,16,'#b54832');rect(c,29,82,35,14,'#f2c14f');rect(c,29,100,35,18,'#854726');
  for(let i=0;i<12;i++){let x=31+(i*11)%29,y=64+(i*7)%11;rect(c,x,y,4,3,i%3===0?'#688238':i%3===1?'#eb6745':'#d32f25');}
  for(let i=0;i<16;i++)rect(c,30+(i*9)%30,83+(i*7)%10,4,3,i%2?'#ffe895':'#fff4c8');
  for(let i=0;i<18;i++)rect(c,30+(i*13)%30,101+(i*7)%14,4,3,i%3===0?'#e4b482':i%3===1?'#a46a3c':'#593420');
  rect(c,27,78,39,4,'#fff0d5');rect(c,27,96,39,4,'#fff0d5');rect(c,64,60,4,60,'#fff0d5');
  for(const [x,y] of [[70,69],[80,65]]){rect(c,x,y,10,45,'#bf862c');rect(c,x-2,y+4,13,35,'#e8b33f');rect(c,x,y+2,8,37,'#ffe18a');rect(c,x+2,y+5,3,29,'#fff0ad');}
  rect(c,106,105,15,23,'#bc561f');rect(c,101,109,24,15,'#dc6e20');rect(c,104,105,18,20,'#f69728');rect(c,106,107,6,6,'#ffbd49');rect(c,109,102,7,5,'#577139');rect(c,113,100,3,5,'#74934b');
 }
}

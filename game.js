import {BirthdayAudio} from './audio.js';
import {FLOOR,BOX,createPlayer,advance} from './engine.js';
import {rect,star,cloud,gift,drawHero,drawCard,drawPack,drawPortal,drawPixelArrow,characterReady,cards} from './art.js';
const $=id=>document.getElementById(id),world=$('world'),ctx=world.getContext('2d'),overlay=$('overlay');
let player=createPlayer(),state='play',index=-1,time=0,last=0,accumulator=0,camera=0,timer=null,enteredAt=0;
const keys={left:false,right:false,jump:false},touches=new Map();
const PORTAL={x:890,y:256,w:56,h:92};
const canMove=()=>state==='play'||state==='portal';
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
function resize(){world.width=Math.min(960,Math.round(world.clientWidth/world.clientHeight*440));world.height=440;ctx.imageSmoothingEnabled=false;}
new ResizeObserver(resize).observe(world);resize();
function announce(msg){$('announce').textContent=msg;}
const soundtrack=new BirthdayAudio();
function tone(notes=[523,659,784],length=.11){soundtrack.sequence(notes,length)}
function updateSoundButton(){const on=soundtrack.enabled;$('sound').textContent=on?'SOUND ON':'SOUND OFF';$('sound').setAttribute('aria-pressed',on);$('sound').setAttribute('aria-label',on?'Mute music and sound effects':'Enable music and sound effects');}
$('sound').onclick=()=>{soundtrack.setEnabled(!soundtrack.enabled);updateSoundButton()};
const startAudio=e=>{if(!e.target?.closest?.('#sound'))soundtrack.unlock()};
document.addEventListener('pointerdown',startAudio,{capture:true});
document.addEventListener('keydown',startAudio,{capture:true});
document.addEventListener('visibilitychange',()=>soundtrack.setHidden(document.hidden));
updateSoundButton();
function clearKeys(){keys.left=keys.right=keys.jump=false;touches.clear()}
const mappings={ArrowLeft:'left',ArrowRight:'right',ArrowUp:'jump',' ':'jump',a:'left',d:'right',w:'jump',A:'left',D:'right',W:'jump'};
window.addEventListener('keydown',e=>{const k=mappings[e.key];if(canMove()&&k&&!/^(BUTTON|A|INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName)){e.preventDefault();if(k==='jump'){if(!e.repeat){keys.jump=true}}else keys[k]=true}if(e.key==='Escape'&&state!=='exited'){clearTimeout(timer);exitGame()}});
window.addEventListener('keyup',e=>{const k=mappings[e.key];if(k)keys[k]=false});window.addEventListener('blur',clearKeys);document.addEventListener('visibilitychange',()=>{clearKeys();last=0});
document.querySelectorAll('[data-control]').forEach(button=>{button.addEventListener('pointerdown',e=>{if(!canMove())return;e.preventDefault();button.setPointerCapture(e.pointerId);const key=button.dataset.control;touches.set(e.pointerId,key);keys[key]=true});for(const name of ['pointerup','pointercancel','lostpointercapture'])button.addEventListener(name,e=>{const key=touches.get(e.pointerId);touches.delete(e.pointerId);if(key)keys[key]=[...touches.values()].includes(key)})});
function modal(html){overlay.hidden=false;overlay.innerHTML='<div class="modal">'+html+'</div>';$('world-note').hidden=true;$('touch-controls').style.display='none';clearKeys();const first=overlay.querySelector('button');first?.focus({preventScroll:true});}
function unlocked(){showPack();$('hint').textContent='';announce('Birthday gift found! Open the card pack.');}
function showPack(){state='pack';soundtrack.cue('pack');$('chapter').textContent='';modal('<span class="tag pack-label">YOUR BIRTHDAY GIFT</span><button class="pack-view" id="pack" aria-label="Open the birthday card pack"><canvas id="pack-art"></canvas><span class="pack-top"></span></button><div class="actions" style="margin-top:12px"><button class="action" id="open-pack">Open the pack</button></div>');drawPack($('pack-art'));$('pack').onclick=openPack;$('open-pack').onclick=openPack;}
function openPack(){if(state!=='pack')return;state='opening';$('pack').classList.add('ripping');$('pack').disabled=true;$('open-pack').disabled=true;$('open-pack').textContent='A little magic is escaping…';overlay.classList.add('opening-glow');soundtrack.cue('open');timer=setTimeout(()=>{overlay.classList.remove('opening-glow');index=0;showCard()},reduced?120:1250)}
function showCard(){state='cards';const a=cards[index];$('hint').textContent='';modal('<div class="reveal-layout"><button class="card-button" id="card" aria-label="'+(index===2?'Return to the world and find the glowing portal':'Reveal the next card')+'"><canvas class="collectible" id="card-art"></canvas></button><div class="card-info"><span class="tag">'+a.rarity+' · '+(index+1)+' OF 3</span><h2>'+a.name+'</h2><p>'+a.desc+'</p><div class="stats"><span>'+a.stats[0]+'</span><span>'+a.stats[1]+'</span></div><button id="next-card" class="action">'+(index===2?'Return to the adventure <span class="pixel-arrow arrow-right" aria-hidden="true"></span>':'Reveal next card <span class="pixel-arrow arrow-right" aria-hidden="true"></span>')+'</button></div></div>');drawCard($('card-art'),index);soundtrack.cue('card',index);announce(a.rarity+' card '+(index+1)+' of 3: '+a.name+'. '+a.desc);let ready=false;timer=setTimeout(()=>ready=true,300);const next=()=>{if(!ready)return;if(index<2){index++;showCard()}else returnToWorld()};$('card').onclick=next;$('next-card').onclick=next;}
function returnToWorld(){
 clearTimeout(timer);state='portal';clearKeys();player.vx=0;
 overlay.hidden=true;overlay.innerHTML='';$('touch-controls').style.display='';
 $('world-note').hidden=false;$('world-note').innerHTML='<span>ONE LAST LITTLE STEP</span>Begin new adventure';
 $('chapter').textContent='RAY’S BIRTHDAY ADVENTURE';
 $('hint').innerHTML='<kbd aria-label="left arrow"><span class="pixel-arrow arrow-left" aria-hidden="true"></span></kbd><kbd aria-label="right arrow"><span class="pixel-arrow arrow-right" aria-hidden="true"></span></kbd> Move toward the glowing portal <span class="pixel-arrow arrow-right" aria-hidden="true"></span>';
 world.setAttribute('aria-label','All cards collected. Use the right arrow or touch controls to walk into the glowing portal and finish your adventure.');
 world.focus({preventScroll:true});tone([659,784,988],.15);
 announce('All three cards collected! You are back in the world. Walk right into the glowing portal to finish the game.');
}
function enterPortal(){
 if(state!=='portal')return;
 state='entering';enteredAt=time;clearKeys();player.vx=0;
 $('touch-controls').style.display='none';$('world-note').hidden=true;
 $('hint').textContent='Taking a little birthday magic with you…';
 soundtrack.cue('portal');
 announce('You stepped into the birthday portal. Adventure complete!');
 timer=setTimeout(finish,reduced?120:900);
}
function finish(){state='finished';$('chapter').textContent='ADVENTURE COMPLETE — HAPPY BIRTHDAY';$('hint').textContent='';modal('<span class="tag">PORTAL CROSSED · ADVENTURE COMPLETE</span><h2>Happy Birthday!</h2><p>May your next chapter be full of good company,<br>many wonders, and wishes that come true.</p><div class="collection"><canvas id="col0"></canvas><canvas id="col1"></canvas><canvas id="col2"></canvas></div><div class="actions"><button class="action" id="replay">↻ Play again</button><button class="action secondary" id="exit">Exit</button></div>');cards.forEach((_,i)=>drawCard($('col'+i),i));$('replay').onclick=restart;$('exit').onclick=exitGame;tone([523,659,784,1047,784,1047],.13);announce('Happy Birthday! All three cards collected. Play again or exit.');}
function exitGame(){clearTimeout(timer);state='exited';$('hint').textContent='';overlay.classList.remove('opening-glow');$('chapter').textContent='THANKS FOR PLAYING';modal('<div class="big-star">♡</div><span class="tag">ADVENTURE COMPLETE</span><h2>welcome to 25!</h2><p>have the happiest birthday! you’ll do great things this year!</p><div class="actions"><button class="action" id="return">Return to the adventure ↩</button></div>');$('return').onclick=restart;announce('Game exited. You can close this tab or return to the adventure.')}
function restart(){clearTimeout(timer);state='play';index=-1;player=createPlayer();clearKeys();overlay.classList.remove('opening-glow');overlay.hidden=true;overlay.innerHTML='';$('world-note').hidden=false;$('world-note').innerHTML='<span>YOUR QUEST</span>Find the gift.';world.setAttribute('aria-label','Pixel adventure. Use left and right arrows to move, and up arrow or space to jump onto the glowing box on the right.');$('touch-controls').style.display='';$('chapter').textContent='RAY’S BIRTHDAY ADVENTURE';$('hint').innerHTML='<kbd aria-label="left arrow"><span class="pixel-arrow arrow-left" aria-hidden="true"></span></kbd><kbd aria-label="right arrow"><span class="pixel-arrow arrow-right" aria-hidden="true"></span></kbd> Move <i></i><kbd aria-label="up arrow"><span class="pixel-arrow arrow-up" aria-hidden="true"></span></kbd> / <kbd>SPACE</kbd> Jump';world.focus({preventScroll:true});announce('New adventure. Move right and jump onto the glowing box.');}
function hill(x,y,w,h,color){ctx.fillStyle=color;ctx.beginPath();ctx.moveTo(x,y);for(let i=0;i<=w;i+=12){const yy=y-Math.round(Math.sin(i/w*Math.PI)*h/8)*8;ctx.lineTo(x+i,yy)}ctx.lineTo(x+w,y+10);ctx.closePath();ctx.fill()}
function drawWorld(t){const w=world.width;camera=Math.max(0,Math.min(960-w,player.x-w*.28));rect(ctx,0,0,w,440,'#6cd5ed');rect(ctx,0,0,w,102,'#29b6dd');rect(ctx,0,102,w,91,'#4ac7e7');for(let i=0;i<w;i+=12)rect(ctx,i,99+(i%24?0:4),7,7,'#4ac7e7');const drift=reduced?0:(t*2)%140;for(const cl of [[55,43,1],[275,75,.72],[475,32,1.16],[741,78,.8],[1030,39,.8]])cloud(ctx,cl[0]-camera*.25-drift,cl[1],cl[2]);for(let i=0;i<7;i++)hill(i*200-70-camera*.4,302,250,60+(i%3)*14,'#8bc09a');for(let i=0;i<9;i++)hill(i*150-40-camera*.7,328,180,43+(i%2)*23,'#6ca67a');ctx.save();ctx.translate(-camera,0);rect(ctx,0,FLOOR,960,92,'#6d4c49');rect(ctx,0,FLOOR,960,12,'#88b95b');rect(ctx,0,FLOOR+12,960,7,'#3e6b4d');for(let i=0;i<960;i+=8){let r=(i*19)%5;rect(ctx,i,FLOOR+(r===0?16:8),8,r===0?10:9,r===0?'#3e6b4d':'#5d8d49');if(i%32===0)rect(ctx,i,FLOOR-6,4,6,'#7fac57')}
for(let i=0;i<145;i++){let x=(i*71)%960,y=373+(i*31)%65;rect(ctx,x,y,i%3?7:12,5,i%2?'#947059':'#855b4b')}
// Tiny flowers, a trail of stones, and quiet birthday bunting.
for(const x of [26,188,254,407,549,670,910]){let y=FLOOR-8;rect(ctx,x,y,3,8,'#49734c');rect(ctx,x-3,y-5,9,5,x%2?'#f4d1ac':'#fff4bf');rect(ctx,x,y-7,3,9,'#f1bf75')}
for(let i=0;i<8;i++){let x=171+i*73;rect(ctx,x,339,11,4,'#c9c48b')}
rect(ctx,458,286,4,62,'#795649');rect(ctx,441,286,41,20,'#795649');rect(ctx,444,289,35,14,'#eac989');ctx.fillStyle='#694d49';ctx.font='bold 17px monospace';drawPixelArrow(ctx,452,291,'right','#694d49',2);
if(state==='play'){let bob=reduced?0:Math.sin(t*2)*3;ctx.fillStyle='#483248';ctx.font='bold 10px monospace';ctx.textAlign='center';ctx.fillText('A GIFT FOR YOU',824,259+bob);ctx.fillStyle='#fff6cc';drawPixelArrow(ctx,815,266+bob,'down','#fff6cc',2);ctx.textAlign='left'}
ctx.save();ctx.globalAlpha=.18;rect(ctx,player.x-7,FLOOR-3,45,6,'#263d3f');ctx.restore();if(index<2||state==='cards'){gift(ctx,BOX.x,BOX.y,reduced?0:t)}else{rect(ctx,BOX.x-3,BOX.y,58,52,'#35243d');rect(ctx,BOX.x,BOX.y+4,52,44,'#e2a650');rect(ctx,BOX.x+5,BOX.y+7,42,11,'#5e3b51');rect(ctx,BOX.x-3,BOX.y-17,58,11,'#f5d97c');rect(ctx,BOX.x+22,BOX.y+20,10,28,'#bd6279');}
if(['portal','entering','finished'].includes(state)){
 drawPortal(ctx,PORTAL.x,PORTAL.y,reduced?0:t);
 if(state==='portal'){ctx.fillStyle='#483248';ctx.font='bold 9px monospace';ctx.textAlign='center';ctx.fillText('PORTAL TO 25',PORTAL.x+PORTAL.w/2,PORTAL.y-19);ctx.textAlign='left';}
}
if(!['finished','exited'].includes(state)){
 ctx.save();if(state==='entering'){const p=Math.min(1,(time-enteredAt)/.75);ctx.globalAlpha=1-p;ctx.translate(player.x+15,player.y+25);ctx.scale(1-p*.7,1-p*.7);ctx.translate(-player.x-15,-player.y-25);}
 drawHero(ctx,player.x,player.y,player.face,Math.abs(player.vx)>0&&player.grounded,reduced?0:t);ctx.restore();}
ctx.restore();
}
function frame(now){const delta=last?Math.min((now-last)/1000,.08):0;last=now;time+=delta;if(canMove()&&!document.hidden){accumulator+=delta;while(accumulator>=1/120){if(keys.jump&&player.grounded)soundtrack.cue(state==='portal'?'portalJump':'jump');const hit=advance(player,keys,1/120);keys.jump=false;accumulator-=1/120;if(hit&&state==='play'){unlocked();accumulator=0;break}if(state==='portal'&&player.x+player.w>PORTAL.x+12&&player.x<PORTAL.x+PORTAL.w-12&&player.y+player.h>PORTAL.y+12&&player.y<PORTAL.y+PORTAL.h){enterPortal();accumulator=0;break}}}else accumulator=0;drawWorld(time);requestAnimationFrame(frame)}
world.addEventListener('pointerdown',()=>world.focus({preventScroll:true}));
characterReady.then(loaded=>{
 if(!loaded)announce('The custom character image could not load. Using the original character for this session.');
 requestAnimationFrame(frame);
});

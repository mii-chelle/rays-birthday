export const FLOOR=348;
export const BOX={x:798,y:296,w:52,h:52};
export function createPlayer(){return {x:62,y:FLOOR-51,w:30,h:51,vx:0,vy:0,grounded:true,face:1};}
export function advance(p,input,dt){
 const oldBottom=p.y+p.h;
 p.vx=(Number(input.right)-Number(input.left))*205;
 if(p.vx)p.face=Math.sign(p.vx);
 if(input.jump&&p.grounded){p.vy=-440;p.grounded=false;}
 p.vy+=1120*dt;p.x=Math.max(8,Math.min(922,p.x+p.vx*dt));p.y+=p.vy*dt;
 if(p.vy>=0&&oldBottom<=BOX.y+2&&p.y+p.h>=BOX.y&&p.x+p.w>BOX.x&&p.x<BOX.x+BOX.w){p.y=BOX.y-p.h;p.vy=0;p.grounded=true;return true;}
 if(p.x+p.w>BOX.x&&p.x<BOX.x+BOX.w&&p.y+p.h>BOX.y+2&&p.y<BOX.y+BOX.h){p.x=p.vx>0?BOX.x-p.w:p.vx<0?BOX.x+BOX.w:p.x;}
 if(p.y+p.h>=FLOOR){p.y=FLOOR-p.h;p.vy=0;p.grounded=true;}
 return false;
}

// Original procedural soundtrack: no recordings, downloads, or external services.
export class BirthdayAudio {
 constructor(){this.enabled=true;this.context=null;this.timer=null;this.step=0;this.next=0;this.hidden=false;}
 async unlock(){
  if(!this.enabled||this.hidden)return;
  try{
   if(!this.context){
    const Audio=globalThis.AudioContext||globalThis.webkitAudioContext;if(!Audio)return;
    const c=this.context=new Audio();
    this.master=c.createGain();this.master.gain.value=.84;
    const limiter=c.createDynamicsCompressor();this.master.connect(limiter);limiter.connect(c.destination);
    this.music=c.createGain();this.music.gain.value=.36;this.music.connect(this.master);
    this.effects=c.createGain();this.effects.gain.value=.65;this.effects.connect(this.master);
    const reverb=c.createConvolver(),impulse=c.createBuffer(2,c.sampleRate*2.8,c.sampleRate);
    for(let channel=0;channel<2;channel++){const data=impulse.getChannelData(channel);for(let i=0;i<data.length;i++)data[i]=(Math.random()*2-1)*Math.pow(1-i/data.length,3)*.3;}
    reverb.buffer=impulse;const wet=c.createGain();wet.gain.value=.25;
    this.music.connect(reverb);this.effects.connect(reverb);reverb.connect(wet);wet.connect(this.master);
    this.next=c.currentTime+.1;
   }
   await this.context.resume();
   if(!this.enabled||this.hidden){await this.context.suspend();return;}
   if(!this.timer){this.schedule();this.timer=setInterval(()=>this.schedule(),180);}
  }catch{/* Gameplay remains available when audio is unsupported. */}
 }
 setEnabled(value){this.enabled=value;if(value)this.unlock();else this.pause();}
 setHidden(value){this.hidden=value;if(value)this.pause();else this.unlock();}
 pause(){clearInterval(this.timer);this.timer=null;if(this.context)this.context.suspend().catch(()=>{});}
 note(freq,when,duration,volume,bus=this.music,type='sine',attack=.018){
  const c=this.context;if(!c)return;
  const osc=c.createOscillator(),gain=c.createGain();osc.type=type;osc.frequency.value=freq;
  gain.gain.setValueAtTime(.0001,when);gain.gain.exponentialRampToValueAtTime(volume,when+attack);
  gain.gain.exponentialRampToValueAtTime(.0001,when+duration);
  osc.connect(gain);gain.connect(bus);osc.onended=()=>{osc.disconnect();gain.disconnect();};osc.start(when);osc.stop(when+duration+.04);
 }
 schedule(){
  const c=this.context;if(!c||!this.enabled||this.hidden)return;
  if(this.next<c.currentTime)this.next=c.currentTime+.05;
  // A slow 128-second harmonic cycle, with spacious, changing upper notes.
  const chords=[[48,55,59,64],[45,52,59,60],[41,48,55,57],[43,50,57,62],[48,55,60,67],[45,52,57,64],[41,48,57,60],[43,50,55,62]];
  const hz=n=>440*Math.pow(2,(n-69)/12);
  while(this.next<c.currentTime+.7){
   const chord=chords[Math.floor(this.step/8)%chords.length],beat=this.step%8,t=this.next;
   if(beat===0){chord.slice(0,3).forEach((n,i)=>this.note(hz(n),t+i*.08,7,.07,this.music,'sine',.65));}
   if([0,2,3,6].includes(beat)){
    const n=chord[(beat+Math.floor(this.step/8))%4]+12;
    this.note(hz(n),t,3.8,.16);this.note(hz(n)*2,t,1.8,.025);
   }
   if(beat===5&&Math.floor(this.step/8)%2===0)this.note(hz(chord[3]+24),t,4,.055);
   this.step++;this.next+=2;
  }
 }
 sequence(notes,spacing=.12){if(!this.enabled||this.hidden||this.context?.state!=='running')return;const t=this.context.currentTime;notes.forEach((n,i)=>this.note(n,t+i*spacing,.65,.17,this.effects,'sine'));}
 cue(name,index=0){
  if(!this.enabled||this.hidden||this.context?.state!=='running')return;
  const c=this.context,t=c.currentTime;
  if(name==='jump'||name==='portalJump'){
   const o=c.createOscillator(),g=c.createGain();o.type='triangle';o.frequency.setValueAtTime(name==='portalJump'?340:230,t);o.frequency.exponentialRampToValueAtTime(name==='portalJump'?880:510,t+.16);
   g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(.12,t+.015);g.gain.exponentialRampToValueAtTime(.0001,t+.22);o.connect(g);g.connect(this.effects);o.onended=()=>{o.disconnect();g.disconnect();};o.start(t);o.stop(t+.24);return;
  }
  if(name==='pack')this.sequence([392,523.25,659.25,783.99,1046.5],.13);
  if(name==='open')this.sequence([261.63,329.63,392,523.25,783.99,1046.5],.09);
  if(name==='card')this.sequence([[523.25,659.25,783.99],[587.33,739.99,880],[659.25,783.99,1046.5,1318.51]][index],.12);
  if(name==='portal'){
   this.sequence([261.63,392,523.25,783.99,1046.5,1567.98],.14);
   [130.81,196,261.63].forEach(n=>this.note(n,t,2.7,.11,this.effects,'sine',.35));
  }
 }
}

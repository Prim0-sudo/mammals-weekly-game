import {topic} from '../src/topics/mammals.js';
import {GameEngine} from '../src/core/game-engine.js';
import {applyTheme} from '../src/core/theme.js';
import {encounterPlan} from '../src/core/landing-motion.js';
const report=document.querySelector('#report'),results=[],wait=ms=>new Promise(r=>setTimeout(r,ms)),assert=(v,m)=>{if(!v)throw Error(m);};
const originalRAF=window.requestAnimationFrame,originalCancel=window.cancelAnimationFrame,originalMedia=window.matchMedia;
let clock=0,id=0,reduced=false;const pending=new Map(),mediaListeners=new Set();
window.requestAnimationFrame=callback=>{pending.set(++id,callback);return id;};window.cancelAnimationFrame=handle=>pending.delete(handle);
window.matchMedia=query=>query.includes('prefers-reduced-motion')?{get matches(){return reduced;},addEventListener:(type,fn)=>mediaListeners.add(fn),removeEventListener:(type,fn)=>mediaListeners.delete(fn)}:originalMedia(query);
function advance(ms){for(let left=ms;left>0;){const step=Math.min(16,left);left-=step;clock+=step;const calls=[...pending.values()];pending.clear();calls.forEach(fn=>fn(clock));}}
async function ready(){for(let i=0;i<500&&game.landingScene?.element.dataset.motion!=='playing';i++)await wait(10);assert(game.landingScene?.element.dataset.motion==='playing','preload');advance(16);}
async function check(name,fn){try{await fn();results.push('PASS '+name);}catch(e){results.push('FAIL '+name+': '+e.message);}report.textContent=results.join('\n');}
const painting=new Image();painting.src=topic.launch.backgroundImage;await painting.decode();
function capture(name){
 const scene=game.landingScene,source=scene.element.querySelector('.scene-animals canvas'),mask=scene.element.querySelector('.scene-foreground canvas'),g=scene.geometry;
 const c=document.createElement('canvas');c.width=Math.round(g.width/2);c.height=Math.round(g.height/2);const ctx=c.getContext('2d');ctx.scale(.5,.5);
 ctx.drawImage(painting,g.x,g.y,topic.launch.sceneLayout.width*g.scale,topic.launch.sceneLayout.height*g.scale);ctx.drawImage(source,0,0,g.width,g.height);ctx.drawImage(mask,0,0,g.width,g.height);
 const img=new Image();img.src=c.toDataURL('image/jpeg',.6);img.alt=name;img.title=name;img.style.width='25%';document.querySelector('#landing-review').append(img);
}
function exposedPixels(){
 const el=game.landingScene.element,a=el.querySelector('.scene-animals canvas'),b=el.querySelector('.scene-foreground canvas');
 const animal=a.getContext('2d').getImageData(0,0,a.width,a.height).data,mask=b.getContext('2d').getImageData(0,0,b.width,b.height).data;
 let total=0,exposed=0;for(let i=3;i<animal.length;i+=4)if(animal[i]>80){total++;if(mask[i]<240)exposed++;}
 return total?exposed/total:0;
}
applyTheme(topic);const game=new GameEngine(topic);game.init();game.audio.muted=true;
await check('Active atlases preload before visits; one animation owner',async()=>{await ready();assert(pending.size===1,'RAF count');assert(document.querySelectorAll('.landing-scene').length===1,'scene count');assert(game.landingScene.element.dataset.actor==='squirrel-acorn-run','first encounter starts immediately');});
await check('Complete encounter cycle: straight ground travel, stationary look, both directions, and cropped-route omission',async()=>{
 const plan=encounterPlan();let captured=new Set();
 for(let target=0;target<plan.duration;target+=100){
  advance(target-game.landingScene.elapsed);const scene=game.landingScene,el=scene.element;
  const row=plan.encounters.find(e=>target>=e.start&&target<e.start+e.duration);
  if(!row){assert(!el.dataset.actor,'quiet gap');continue;}
  if(el.dataset.skipped){assert(innerWidth/innerHeight<1.3,'unexpected desktop crop: '+el.dataset.skipped+' '+el.dataset.skipReason+' '+JSON.stringify(scene.geometry));continue;}
  assert(el.dataset.kind===row.kind,'encounter '+row.kind+' at '+target);
  if(row.kind!=='bat'&&(target-row.start<100||row.start+row.duration-target<=100))assert(exposedPixels()<.025,'hiding endpoint '+row.kind+' '+exposedPixels());
  if(el.dataset.state==='looking'||el.dataset.state==='paused'){
   const x=el.dataset.x,y=el.dataset.y,frame=el.dataset.frame;advance(16);
   assert(el.dataset.x===x&&el.dataset.y===y,'stationary contact moved');
   if(el.dataset.state==='paused')assert(el.dataset.frame===frame,'paused gait');
  }
  if(row.kind==='mouse')assert(Number(el.dataset.facing)===(row.reverse?-1:1),'mouse facing');
  const key=el.dataset.state+el.dataset.facing;
  if(!captured.has(key)&&target%500===0&&(row.kind==='bat'?Number(el.dataset.x)>100&&Number(el.dataset.x)<scene.geometry.width-100:exposedPixels()>.2)){capture(key);captured.add(key);}
 }
});
await check('Source contact mapping remains exact through layout and fullscreen events',()=>{
 const scene=game.landingScene,before=scene.elapsed;document.dispatchEvent(new Event('fullscreenchange'));
 assert(scene.elapsed===before,'layout reset elapsed');const p=scene.sourceToView(836,470);
 assert(Math.abs(p.x-scene.geometry.width/2)<.001&&Math.abs(p.y-scene.geometry.height/2)<.001,'cover mapping');
});
await check('Simulated hidden document suspends RAF and elapsed time, then resumes',async()=>{
 const descriptor=Object.getOwnPropertyDescriptor(document,'hidden'),scene=game.landingScene,elapsed=scene.elapsed;
 try{Object.defineProperty(document,'hidden',{configurable:true,get:()=>true});document.dispatchEvent(new Event('visibilitychange'));advance(1000);assert(scene.frame===null&&scene.elapsed===elapsed,'hidden ran');}
 finally{if(descriptor)Object.defineProperty(document,'hidden',descriptor);else delete document.hidden;document.dispatchEvent(new Event('visibilitychange'));}advance(32);assert(scene.elapsed>elapsed,'resume');
});
await check('Simulated reduced motion clears animals and stops RAF',()=>{reduced=true;mediaListeners.forEach(fn=>fn());assert(!game.landingScene.element.dataset.actor&&game.landingScene.frame===null,'reduced');reduced=false;mediaListeners.forEach(fn=>fn());assert(game.landingScene.frame!==null,'motion resume');});
await check('Explore and repeated Home navigation cancel old owners and listeners',async()=>{
 for(let i=0;i<12;i++){const old=game.landingScene;document.querySelector('[data-action="launch"]').click();assert(!old.active&&old.frame===null&&!document.querySelector('.landing-scene'),'leave');assert(mediaListeners.size===0,'media leak');game.launch();await ready();assert(pending.size===1&&document.querySelectorAll('.landing-scene').length===1,'return');}
 const old=game.landingScene;game.clean();assert(!old.active&&pending.size===0&&mediaListeners.size===0,'cleanup');
});
window.requestAnimationFrame=originalRAF;window.cancelAnimationFrame=originalCancel;window.matchMedia=originalMedia;
report.textContent=results.join('\n')+'\nDONE '+results.filter(x=>x.startsWith('PASS')).length+'/'+results.length;report.dataset.done='true';

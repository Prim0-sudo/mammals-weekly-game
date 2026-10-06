import {topic} from '../src/topics/mammals.js';
import {GameEngine} from '../src/core/game-engine.js';
import {applyTheme} from '../src/core/theme.js';
import {intersects} from '../src/core/landing-scene.js';
const report=document.querySelector('#report'),results=[],wait=ms=>new Promise(r=>setTimeout(r,ms)),assert=(v,m)=>{if(!v)throw Error(m);};
const originalRAF=window.requestAnimationFrame,originalCancel=window.cancelAnimationFrame,originalMedia=window.matchMedia;
let clock=0,id=0,reduced=false;const pending=new Map(),mediaListeners=new Set();
window.requestAnimationFrame=callback=>{pending.set(++id,callback);return id;};window.cancelAnimationFrame=handle=>pending.delete(handle);
window.matchMedia=query=>query.includes('prefers-reduced-motion')?{get matches(){return reduced;},addEventListener:(type,fn)=>mediaListeners.add(fn),removeEventListener:(type,fn)=>mediaListeners.delete(fn)}:originalMedia(query);
function advance(ms){for(let left=ms;left>0;){const step=Math.min(16,left);left-=step;clock+=step;const calls=[...pending.values()];pending.clear();calls.forEach(fn=>fn(clock));}}
async function ready(){for(let i=0;i<500&&game.landingScene?.element.dataset.motion!=='playing';i++)await wait(10);assert(game.landingScene?.element.dataset.motion==='playing','preload');advance(16);}
async function check(name,fn){try{await fn();results.push('PASS '+name);}catch(e){results.push('FAIL '+name+': '+e.message);}report.textContent=results.join('\n');}
function capture(name){const source=document.querySelector('.landing-animals-canvas'),c=document.createElement('canvas');c.width=640;c.height=360;c.getContext('2d').drawImage(source,0,0,640,360);const img=new Image();img.src=c.toDataURL('image/png');img.alt=name;img.title=name;img.style.width='25%';document.querySelector('#landing-review').append(img);}
applyTheme(topic);const game=new GameEngine(topic);game.init();game.audio.muted=true;
await check('Active atlases preload before visits; one animation owner',async()=>{await ready();assert(pending.size===1,'RAF count');assert(document.querySelectorAll('.landing-scene').length===1,'scene count');assert(!game.landingScene.element.dataset.actor,'early actor');});
await check('Simulated clock visits peek, hedgehog and bat without squirrel runs',async()=>{
 for(const [target,name] of [[7500,'squirrel-idle'],[28000,'hedgehog-walk'],[50000,'bat-flight']]){
  advance(target-game.landingScene.elapsed);const scene=game.landingScene,el=scene.element;assert(el.dataset.actor===name,'actor '+name+' at '+scene.elapsed+' '+JSON.stringify(scene.geometry));capture(name);
  const y=Number(el.dataset.y);assert(!scene.geometry.protected.some(r=>intersects({x:name==='squirrel-idle'?24:0,y,width:name==='squirrel-idle'?Number(el.dataset.size)*.86:scene.geometry.width,height:Number(el.dataset.size)},r)),'control collision '+name);
  if(name!=='squirrel-idle'){const x=Number(el.dataset.x);advance(16);assert(Number(el.dataset.x)>x,'travel not continuous');}
 }
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

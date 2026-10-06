import {landingAssets} from './landing-assets.js';
const schedule=[['squirrel-idle',4500,6000],['hedgehog-walk',20000,8000],['bat-flight',10000,8000]];
export function landingSample(elapsed) {
 const total=schedule.reduce((sum,[,duration,gap])=>sum+duration+gap,0);
 let time=elapsed%total;
 for(const [name,duration,gap] of schedule){if(time<gap)return null;time-=gap;if(time<duration)return {name,time,duration,progress:time/duration};time-=duration;}
 return null;
}
export function poseFrame(durations,time) {
 let remaining=time%durations.reduce((a,b)=>a+b,0);
 for(let i=0;i<durations.length;i++){if(remaining<durations[i])return i;remaining-=durations[i];}
 return 0;
}
export function intersects(a,b){return a.x<b.x+b.width&&a.x+a.width>b.x&&a.y<b.y+b.height&&a.y+a.height>b.y;}
const decoded=new Map();
function loadAtlas(file){if(!decoded.has(file)){const img=new Image();img.src=file;decoded.set(file,img.decode().then(()=>img).catch(error=>{decoded.delete(file);throw error;}));}return decoded.get(file);}
export function coverGeometry(width,height,sourceWidth,sourceHeight) {
 const scale=Math.max(width/sourceWidth,height/sourceHeight);
 return {scale,x:(width-sourceWidth*scale)/2,y:(height-sourceHeight*scale)/2};
}
export function mountLandingScene(root,config,protectedElements=[]) {
 const scene=document.createElement('div');scene.className='landing-scene';scene.setAttribute('aria-hidden','true');
 scene.innerHTML='<div class="scene-layer scene-animals" data-scene-layer="animals"></div><div class="scene-layer scene-effects" data-scene-layer="effects"></div><div class="scene-layer scene-foreground" data-scene-layer="foreground"></div>';
 root.prepend(scene);
 const canvas=document.createElement('canvas');canvas.className='landing-animals-canvas';scene.querySelector('.scene-animals').append(canvas);const ctx=canvas.getContext('2d');
 let destroyed=false,ready=false,raf=null,last=null,elapsed=0,images={};
 const media=matchMedia('(prefers-reduced-motion: reduce)');
 const geometry={};
 function update(){
   if(destroyed)return;
   const box=scene.getBoundingClientRect();
   geometry.width=box.width;geometry.height=box.height;
   const ratio=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(box.width*ratio);canvas.height=Math.round(box.height*ratio);ctx.setTransform(ratio,0,0,ratio,0,0);
   Object.assign(geometry,coverGeometry(box.width,box.height,config.width,config.height));
   // Full control rectangles, plus margin, are used instead of guessed title coordinates.
   geometry.protected=protectedElements.filter(Boolean).map(el=>{const r=el.getBoundingClientRect();return {x:r.left-box.left-24,y:r.top-box.top-24,width:r.width+48,height:r.height+48};});
   scene.dataset.motion=media.matches?'reduced':document.hidden?'suspended':ready?'playing':'loading';
   scene.dispatchEvent(new CustomEvent('scene-layout',{detail:geometry}));
   stop();draw();start();
 }
 function stop(){if(raf!==null)cancelAnimationFrame(raf);raf=null;last=null;}
 function start(){if(!destroyed&&ready&&!media.matches&&!document.hidden&&raf===null)raf=requestAnimationFrame(tick);}
 function draw(){
   ctx.clearRect(0,0,geometry.width,geometry.height);scene.dataset.actor='';
   if(!ready||media.matches)return;
   const sample=landingSample(elapsed);if(!sample||!images[sample.name])return;
   let size=Math.min(sample.name==='bat-flight'?100:128,Math.max(72,geometry.width*.1));
   // Select a continuous edge lane using actual protected control rectangles.
   const top=geometry.protected.reduce((bottom,r)=>r.y<100?Math.max(bottom,r.y+r.height):bottom,0);
   const badgeTop=Math.min(geometry.height,...geometry.protected.filter(r=>r.y>=100).map(r=>r.y));
   const bottom=geometry.protected.reduce((end,r)=>Math.max(end,r.y+r.height),0);
   const bands=[{start:top+4,end:badgeTop-4},{start:bottom+4,end:geometry.height-4}];
   if(sample.name!=='bat-flight')bands.reverse();
   const band=bands.find(b=>b.end-b.start>=48);
   if(!band)return; // Omit a visit rather than overlap a title or control.
   size=Math.min(size,band.end-band.start);
   let y=sample.name==='bat-flight'?band.start:band.end-size;
   let x=-size+(geometry.width+size*2)*sample.progress;
   if(sample.name==='squirrel-idle'){
     const reveal=Math.min(1,sample.time/700,(sample.duration-sample.time)/700);
     x=24-size+size*.86*Math.max(0,reveal);
     const treeY=Math.max(top+4,Math.min(geometry.height-size-4,geometry.height*.47));
     if(!geometry.protected.some(r=>intersects({x:24,y:treeY,width:size*.86,height:size},r)))y=treeY;
   }
   const asset=landingAssets[sample.name],frame=poseFrame(asset.durations,sample.time);
   ctx.save();
   if(sample.name==='squirrel-idle'){ctx.beginPath();ctx.rect(24,0,geometry.width-24,geometry.height);ctx.clip();}
   ctx.drawImage(images[sample.name],(frame%asset.columns)*asset.cell,Math.floor(frame/asset.columns)*asset.cell,asset.cell,asset.cell,x,y,size,size);ctx.restore();
   scene.dataset.actor=sample.name;scene.dataset.frame=String(frame);scene.dataset.x=String(x);scene.dataset.y=String(y);scene.dataset.size=String(size);
 }
 function tick(time){raf=null;if(destroyed||document.hidden||media.matches)return;if(last!==null)elapsed+=Math.min(100,time-last);last=time;draw();start();}
 const observer=new ResizeObserver(update);observer.observe(root);
 for(const el of protectedElements.filter(Boolean))observer.observe(el);
 document.addEventListener('visibilitychange',update);media.addEventListener('change',update);
 update();
 const actors=config.actors||[];
 if(actors.length)Promise.all([...actors.map(async name=>{const image=await loadAtlas(landingAssets[name].file);if(!destroyed)images[name]=image;}),...(config.backgroundImage?[loadAtlas(new URL(config.backgroundImage,document.baseURI).href)]:[])]).then(()=>{if(destroyed)return;ready=true;update();}).catch(()=>{if(!destroyed)scene.dataset.motion='unavailable';});
 return {element:scene,geometry,get active(){return !destroyed;},get frame(){return raf;},get elapsed(){return elapsed;},sourceToView:(x,y)=>({x:geometry.x+x*geometry.scale,y:geometry.y+y*geometry.scale}),destroy(){if(destroyed)return;destroyed=true;stop();observer.disconnect();document.removeEventListener('visibilitychange',update);media.removeEventListener('change',update);images={};scene.remove();}};
}

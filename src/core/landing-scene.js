import {landingAssets} from './landing-assets.js';
import {landingSample,measureRoute,animalState} from './landing-motion.js';
export {landingSample} from './landing-motion.js';
export function poseFrame(durations,time) {
  let remaining=time%durations.reduce((a,b)=>a+b,0);
  for(let i=0;i<durations.length;i++){if(remaining<durations[i])return i;remaining-=durations[i];}
  return 0;
}
export function intersects(a,b){return a.x<b.x+b.width&&a.x+a.width>b.x&&a.y<b.y+b.height&&a.y+a.height>b.y;}
const decoded=new Map();
function loadAtlas(file){
  if(!decoded.has(file)){const img=new Image();img.src=file;decoded.set(file,img.decode().then(()=>img).catch(error=>{decoded.delete(file);throw error;}));}
  return decoded.get(file);
}
export function coverGeometry(width,height,sourceWidth,sourceHeight) {
  const scale=Math.max(width/sourceWidth,height/sourceHeight);
  return {scale,x:(width-sourceWidth*scale)/2,y:(height-sourceHeight*scale)/2};
}
export function mountLandingScene(root,config,protectedElements=[]) {
  const scene=document.createElement('div');scene.className='landing-scene';scene.setAttribute('aria-hidden','true');
  scene.innerHTML='<div class="scene-layer scene-animals"></div><div class="scene-layer scene-foreground"></div><div class="scene-layer scene-debug"></div>';
  root.prepend(scene);
  const makeCanvas=layer=>{const canvas=document.createElement('canvas');canvas.className='landing-animals-canvas';scene.querySelector(layer).append(canvas);return canvas;};
  const canvas=makeCanvas('.scene-animals'),foreground=makeCanvas('.scene-foreground'),overlay=makeCanvas('.scene-debug');
  const ctx=canvas.getContext('2d'),maskCtx=foreground.getContext('2d'),debugCtx=overlay.getContext('2d');
  const query=new URLSearchParams(location.search);
  const debug=['localhost','127.0.0.1'].includes(location.hostname)&&query.has('landingDebug');
  const frozen=debug&&query.has('landingTime');
  const terrain=config.terrain;
  const routes=Object.fromEntries(Object.entries(terrain?.routes||{}).map(([name,segments])=>[name,measureRoute(segments)]));
  const media=matchMedia('(prefers-reduced-motion: reduce)'),geometry={};
  let destroyed=false,ready=false,raf=null,last=null,elapsed=frozen?Math.max(0,Number(query.get('landingTime'))||0):0,images={},background;
  const sourceToView=(x,y)=>({x:geometry.x+x*geometry.scale,y:geometry.y+y*geometry.scale});
  function stop(){if(raf!==null)cancelAnimationFrame(raf);raf=null;last=null;}
  function start(){if(!destroyed&&ready&&!frozen&&!media.matches&&!document.hidden&&raf===null)raf=requestAnimationFrame(tick);}
  function trace(context,points){context.beginPath();points.forEach(([x,y],i)=>i?context.lineTo(x,y):context.moveTo(x,y));context.closePath();}
  function paintMasks(){
    maskCtx.clearRect(0,0,geometry.width,geometry.height);
    if(!ready||!background||!terrain)return;
    maskCtx.save();maskCtx.translate(geometry.x,geometry.y);maskCtx.scale(geometry.scale,geometry.scale);
    for(const mask of terrain.masks){maskCtx.save();trace(maskCtx,mask.points);maskCtx.clip();maskCtx.drawImage(background,0,0,config.width,config.height);maskCtx.restore();}
    maskCtx.restore();
  }
  function routeFits(sample){
    const route=routes[sample.route];if(!route)return false;
    if(sample.kind!=='bat'){
      const hidingPlaces=sample.route==='leftPeek'?['left-rock']:sample.route==='rightPeek'?['right-rock']:['left-rock','right-rock'];
      for(const id of hidingPlaces){
        const mask=terrain.masks.find(item=>item.id===id);if(!mask)continue;
        const xs=mask.points.map(point=>point[0]),ys=mask.points.map(point=>point[1]);
        const corner=sourceToView(Math.min(...xs),Math.min(...ys));
        const visible=intersects({x:corner.x,y:corner.y,width:(Math.max(...xs)-Math.min(...xs))*geometry.scale,height:(Math.max(...ys)-Math.min(...ys))*geometry.scale},{x:0,y:0,width:geometry.width,height:geometry.height});
        if(!visible){scene.dataset.skipReason='cropped hiding place: '+id;return false;}
      }
    }
    const size=(sample.kind==='bat'?100:sample.kind==='mouse'?96:128)*geometry.scale;
    for(const point of route.samples){
      const p=sourceToView(point.x,point.y);
      // Bounds of the painted pose around its foot/chest anchor, excluding transparent atlas padding.
      const top=sample.kind==='bat'?.55:sample.kind==='mouse'?.4:.68;
      const bounds={x:p.x-size*.45,y:p.y-size*top,width:size*.9,height:size*(top+.05)};
      if(geometry.protected.some(control=>{
        // Ground animals pass behind the foreground club badge on their straight lane.
        if(control.shape==='circle'&&sample.kind!=='bat')return false;
        if(!intersects(bounds,control))return false;
        if(control.shape!=='circle')return true;
        const cx=control.x+control.width/2,cy=control.y+control.height/2;
        const nearestX=Math.max(bounds.x,Math.min(cx,bounds.x+bounds.width));
        const nearestY=Math.max(bounds.y,Math.min(cy,bounds.y+bounds.height));
        return Math.hypot(cx-nearestX,cy-nearestY)<control.width/2;
      })){scene.dataset.skipReason='control at '+point.x.toFixed(1)+','+point.y.toFixed(1);return false;}
      // A partially cropped hiding object can conceal entry/exit at the viewport edge.
      if(sample.kind!=='bat'&&bounds.y+bounds.height>geometry.height){scene.dataset.skipReason='crop at '+point.x.toFixed(1)+','+point.y.toFixed(1);return false;}
    }
    return true;
  }
  function paintDebug(state){
    debugCtx.clearRect(0,0,geometry.width,geometry.height);if(!debug||query.get('landingOverlay')==='0'||!terrain)return;
    debugCtx.save();debugCtx.translate(geometry.x,geometry.y);debugCtx.scale(geometry.scale,geometry.scale);debugCtx.lineWidth=2/geometry.scale;
    for(const [name,route] of Object.entries(routes)){
      debugCtx.strokeStyle=name.startsWith('sky')?'#0cc':'#ff36a5';debugCtx.beginPath();route.samples.forEach((p,i)=>i?debugCtx.lineTo(p.x,p.y):debugCtx.moveTo(p.x,p.y));debugCtx.stroke();
      for(const segment of route.segments)for(const [x,y] of segment){debugCtx.fillStyle='#fff';debugCtx.beginPath();debugCtx.arc(x,y,4,0,Math.PI*2);debugCtx.fill();}
      debugCtx.fillStyle='#122d20';debugCtx.font='14px sans-serif';const first=route.samples[0];debugCtx.fillText(name,first.x,first.y-14);
    }
    for(const mask of terrain.masks){trace(debugCtx,mask.points);debugCtx.fillStyle='#ffb00022';debugCtx.fill();debugCtx.strokeStyle='#ffb000';debugCtx.stroke();}
    if(state){debugCtx.strokeStyle='#0ff';debugCtx.beginPath();debugCtx.moveTo(state.x-8,state.y);debugCtx.lineTo(state.x+8,state.y);debugCtx.moveTo(state.x,state.y-8);debugCtx.lineTo(state.x,state.y+8);debugCtx.stroke();}
    debugCtx.restore();
  }
  function draw(){
    ctx.clearRect(0,0,geometry.width,geometry.height);scene.dataset.actor='';scene.dataset.state='hidden';
    if(!ready||media.matches){paintDebug();return;}
    const sample=landingSample(elapsed);
    if(!sample||!routeFits(sample)){scene.dataset.skipped=sample?.route||'';paintDebug();return;}
    scene.dataset.skipped='';
    const state=animalState(sample,routes[sample.route]),asset=landingAssets[state.sequence];
    if(!images[state.sequence])return;
    const strideSpeed=state.sequence==='mouse-run'?80:125;
    // Distance drives the gait clock too, including the squirrel's eased starts/stops.
    const walked=(sample.reverse||state.state==='retreating'?1-state.progress:state.progress)*routes[sample.route].length;
    const poseClock=state.sequence==='bat-flight'?state.poseTime:state.sequence==='mouse-run'?state.poseTime*1.5:walked/strideSpeed*1000;
    let frame=state.walking?poseFrame(asset.durations,poseClock):state.sequence==='squirrel-idle'?poseFrame(asset.durations,state.poseTime):0;
    if(sample.kind==='bat'&&sample.time%3200>2400)frame=3;
    const anchor=terrain.anchors[state.sequence][frame],size=terrain.sizes[state.sequence]*geometry.scale;
    const p=sourceToView(state.x,state.y);
    if(sample.kind!=='bat'){
      ctx.save();ctx.fillStyle='rgba(32,52,20,.2)';ctx.beginPath();
      ctx.ellipse(p.x,p.y+geometry.scale,size*(sample.kind==='mouse'?.2:.25),2.5*geometry.scale,0,0,Math.PI*2);ctx.fill();ctx.restore();
    }
    ctx.save();ctx.translate(p.x,p.y);ctx.rotate(state.tilt);ctx.scale(state.facing,1);
    ctx.drawImage(images[state.sequence],(frame%asset.columns)*asset.cell,Math.floor(frame/asset.columns)*asset.cell,asset.cell,asset.cell,-anchor[0]/asset.cell*size,-anchor[1]/asset.cell*size,size,size);ctx.restore();
    Object.assign(scene.dataset,{actor:state.sequence,kind:sample.kind,state:state.state,frame:String(frame),x:String(p.x),y:String(p.y),size:String(size),facing:String(state.facing),route:sample.route,progress:String(state.progress)});
    paintDebug(state);
  }
  function update(){
    if(destroyed)return;
    const box=scene.getBoundingClientRect(),ratio=Math.min(devicePixelRatio||1,2);
    geometry.width=box.width;geometry.height=box.height;
    for(const target of [canvas,foreground,overlay]){target.width=Math.round(box.width*ratio);target.height=Math.round(box.height*ratio);target.getContext('2d').setTransform(ratio,0,0,ratio,0,0);}
    Object.assign(geometry,coverGeometry(box.width,box.height,config.width,config.height));
    const padding=config.protectedPadding??24;
    const controls=protectedElements.filter(Boolean).flatMap(el=>el.classList.contains('topbar')?[...el.querySelectorAll('button:not([hidden])')]:[el]);
    geometry.protected=controls.map(el=>{const r=el.getBoundingClientRect();return {x:r.left-box.left-padding,y:r.top-box.top-padding,width:r.width+padding*2,height:r.height+padding*2,shape:el.classList.contains('welcome-badge')?'circle':'rectangle'};});
    scene.dataset.motion=media.matches?'reduced':document.hidden?'suspended':ready?'playing':'loading';
    scene.dispatchEvent(new CustomEvent('scene-layout',{detail:geometry}));
    stop();paintMasks();draw();start();
  }
  function tick(time){raf=null;if(destroyed||document.hidden||media.matches)return;if(last!==null)elapsed+=Math.min(100,time-last);last=time;draw();start();}
  const observer=new ResizeObserver(update);observer.observe(scene);for(const el of protectedElements.filter(Boolean))observer.observe(el);
  document.addEventListener('visibilitychange',update);document.addEventListener('fullscreenchange',update);media.addEventListener('change',update);
  update();
  if(terrain&&config.actors?.length)Promise.all([...config.actors.map(async name=>{const image=await loadAtlas(landingAssets[name].file);if(!destroyed)images[name]=image;}),loadAtlas(new URL(config.backgroundImage,document.baseURI).href).then(image=>{background=image;})]).then(()=>{if(destroyed)return;ready=true;update();}).catch(()=>{if(!destroyed)scene.dataset.motion='unavailable';});
  return {element:scene,geometry,get active(){return !destroyed;},get frame(){return raf;},get elapsed(){return elapsed;},sourceToView,destroy(){if(destroyed)return;destroyed=true;stop();observer.disconnect();document.removeEventListener('visibilitychange',update);document.removeEventListener('fullscreenchange',update);media.removeEventListener('change',update);images={};scene.remove();}};
}

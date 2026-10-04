// A single scene owner. Empty layers are intentional: no static animals.
// Future actors must use source-image coordinates and their own heading/frame wrappers.
export function coverGeometry(width,height,sourceWidth,sourceHeight) {
 const scale=Math.max(width/sourceWidth,height/sourceHeight);
 return {scale,x:(width-sourceWidth*scale)/2,y:(height-sourceHeight*scale)/2};
}
export function mountLandingScene(root,config,protectedElements=[]) {
 const scene=document.createElement('div');scene.className='landing-scene';scene.setAttribute('aria-hidden','true');
 scene.innerHTML='<div class="scene-layer scene-animals" data-scene-layer="animals"></div><div class="scene-layer scene-effects" data-scene-layer="effects"></div><div class="scene-layer scene-foreground" data-scene-layer="foreground"></div>';
 root.prepend(scene);
 let destroyed=false;
 const media=matchMedia('(prefers-reduced-motion: reduce)');
 const geometry={};
 function update(){
   if(destroyed)return;
   const box=scene.getBoundingClientRect();
   Object.assign(geometry,coverGeometry(box.width,box.height,config.width,config.height));
   // Full control rectangles, plus margin, are used instead of guessed title coordinates.
   geometry.protected=protectedElements.filter(Boolean).map(el=>{const r=el.getBoundingClientRect();return {x:r.left-box.left-24,y:r.top-box.top-24,width:r.width+48,height:r.height+48};});
   scene.dataset.motion=media.matches?'reduced':document.hidden?'suspended':'ready';
   scene.dispatchEvent(new CustomEvent('scene-layout',{detail:geometry}));
 }
 const observer=new ResizeObserver(update);observer.observe(root);
 for(const el of protectedElements.filter(Boolean))observer.observe(el);
 document.addEventListener('visibilitychange',update);media.addEventListener('change',update);
 update();
 // No RAF or timers until an actual animated actor is supplied.
 return {element:scene,geometry,sourceToView:(x,y)=>({x:geometry.x+x*geometry.scale,y:geometry.y+y*geometry.scale}),destroy(){if(destroyed)return;destroyed=true;observer.disconnect();document.removeEventListener('visibilitychange',update);media.removeEventListener('change',update);scene.remove();}};
}

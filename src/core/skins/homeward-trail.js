import {TRAIL,HOP_MS,ENTRY_MS,distinctLetters,guessedTrailPosition,hopPose,entryPose,escapeDuration,escapePose} from './homeward-motion.js';

const cache = new Map();
const cacheKey = skin => skin.assets.join('|');
export function prepareTrail(skin) {
 const key=cacheKey(skin);
 if(!cache.has(key)) {
  const record={ready:false,images:{}};
  record.promise=Promise.all(Object.entries(skin.frames).map(async ([id,frame])=>{
   const image=new Image(); image.src=frame.file; await image.decode(); record.images[id]=image;
  })).then(()=>{record.ready=true;return record.images;}).catch(error=>{cache.delete(key);throw error;});
  cache.set(key,record);
 }
 return cache.get(key).promise;
}

// One renderer belongs to one spelling render. It never owns guesses or scores.
export class HomewardScene {
 constructor(game,skin,item) {
  this.game=game;this.skin=skin;this.item=item;this.active=true;this.frame=null;this.run=null;
  this.canvas=game.app.querySelector('.homeward-canvas'); this.ctx=this.canvas.getContext('2d');
  this.images=cache.get(cacheKey(skin)).images;
  const s=game.state;
  this.count=distinctLetters(item.name,game.topic).length;
  this.from=guessedTrailPosition(item.name,s.animating?s.guessed.slice(0,-1):s.guessed,game.topic);
  this.to=guessedTrailPosition(item.name,s.guessed,game.topic);
  this.pose={frame:'rabbit-sit-right',...this.from,scale:1};
  if(s.winExitDone)this.pose.hidden=true;
  if(s.spellingStatus==='lost')this.pose={...this.pose,hidden:true,foxX:1455};
  this.visibility=()=>{
   if(document.hidden){this.pause();if(this.run)this.message('Scene paused. Letters are paused.');}
   else if(this.run){this.run.last=null;this.message(this.run.message);this.schedule();}
  };
  this.media=matchMedia('(prefers-reduced-motion: reduce)');
  this.motionChange=()=>{if(this.game.reduced()&&this.run)this.finish();};
  document.addEventListener('visibilitychange',this.visibility);this.media.addEventListener('change',this.motionChange);
  this.draw();
 }
 message(text) {const label=this.game.app.querySelector('.trail-lock');if(label)label.textContent=text;}
 drawSprite(id,x,y,bodyWidth,scale=1,mirror=false) {
  const frame=this.skin.frames[id],image=this.images[id],factor=bodyWidth/frame.torsoSpan*scale;
  this.ctx.save();this.ctx.translate(x,y);if(mirror)this.ctx.scale(-1,1);
  this.ctx.drawImage(image,-frame.anchor[0]*factor,-frame.anchor[1]*factor,frame.width*factor,frame.height*factor);this.ctx.restore();
 }
 draw() {
  if(!this.active)return;
  const ctx=this.ctx,p=this.pose;
  ctx.clearRect(0,0,TRAIL.width,TRAIL.height);
  ctx.drawImage(this.images['woodland-background'],0,0,TRAIL.width,TRAIL.height);
  if(p.foxX!==undefined)this.drawSprite('fox-appear-left',p.foxX,708,215);
  if(!p.hidden)this.drawSprite(p.frame,p.x,p.y,TRAIL.bodyWidth,p.scale,p.mirror);
  if(p.occlude) {
   // Paint the original right entrance lip and ground in front of the entering rabbit.
   // The curved inner edge follows the actual supplied burrow; no alpha fade is used.
   ctx.save();ctx.beginPath();ctx.moveTo(1510,0);ctx.lineTo(1510,477);
   ctx.bezierCurveTo(1550,500,1565,585,1523,621);
   ctx.bezierCurveTo(1503,640,1470,653,1445,660);
   ctx.lineTo(1380,TRAIL.height);ctx.lineTo(TRAIL.width,TRAIL.height);ctx.lineTo(TRAIL.width,0);ctx.closePath();ctx.clip();
   ctx.drawImage(this.images['woodland-background'],0,0,TRAIL.width,TRAIL.height);ctx.restore();
  }
  this.canvas.dataset.pose=p.frame;this.canvas.dataset.rabbitX=String(p.x);
  this.canvas.dataset.rabbitHidden=String(!!p.hidden);this.canvas.dataset.foxX=p.foxX===undefined?'':String(p.foxX);
 }
 pause() {if(this.frame!==null)cancelAnimationFrame(this.frame);this.frame=null;if(this.run)this.run.last=null;}
 schedule() {if(this.active&&this.run&&!document.hidden&&this.frame===null)this.frame=requestAnimationFrame(time=>this.tick(time));}
 tick(time) {
  this.frame=null;if(!this.active||!this.run)return;
  const run=this.run;if(run.last!==null)run.elapsed+=time-run.last;run.last=time;
  this.pose=run.sample(Math.min(run.elapsed,run.duration));this.draw();
  if(run.elapsed>=run.duration)this.finish();else this.schedule();
 }
 finish() {
  if(!this.active||!this.run)return;
  const run=this.run;this.pause();this.run=null;this.pose=run.sample(run.duration);this.draw();
  run.done();
 }
 animate(duration,sample,done,message) {
  if(!this.active||this.run)return;
  this.run={duration,sample,done,message,elapsed:0,last:null};this.message(message);
  if(this.game.reduced())this.finish();else this.schedule();
 }
 hop(done) {this.animate(HOP_MS,t=>hopPose(t,this.from,this.to),done,'Rabbit hopping… Letters are paused.');}
 win(done) {this.animate(HOP_MS+ENTRY_MS,t=>t<=HOP_MS?hopPose(t,this.from,this.to):entryPose(t-HOP_MS),done,'Heading home… Letters are paused.');}
 mistake(final,done) {
  if(final){const duration=escapeDuration(this.to);this.animate(HOP_MS+duration,t=>t<HOP_MS?hopPose(t,this.from,this.to,18):escapePose(t-HOP_MS,this.to,duration),done,'Rabbit escaping… Letters are paused.');}
  else this.animate(HOP_MS,t=>hopPose(t,this.from,this.to,18),done,'Small hop… Letters are paused.');
 }
 destroy() {
  if(!this.active)return;this.active=false;this.pause();this.run=null;
  document.removeEventListener('visibilitychange',this.visibility);this.media.removeEventListener('change',this.motionChange);
 }
}

export const homewardTrail = {
 prepare:prepareTrail,
 isReady:skin=>!!cache.get(cacheKey(skin))?.ready,
 render(skin,stage,esc,finished,status,state) {
  return `<div class="homeward-trail ${status||''}" aria-busy="${state.animating}"><canvas class="homeward-canvas" width="${TRAIL.width}" height="${TRAIL.height}" role="img" aria-label="${status==='won'&&finished?'The rabbit is safely inside its burrow.':status==='lost'?'The rabbit has escaped left. A fox stands on the right.':'A rabbit follows a woodland trail to its burrow on the right.'}"></canvas></div><div class="trail-chances" aria-hidden="true">${Array.from({length:skin.attempts},(_,i)=>`<img class="chance-token ${i<state.misses?'spent':''}" src="${esc(skin.frames['chance-token'].file)}" alt="" draggable="false">`).join('')}</div><p class="trail-lock" role="status">${state.animating?'Letters are paused while the rabbit moves.':status==='won'?'Safe at home!':status==='lost'?'The rabbit got away. Read the word together.':''}</p>`;
 },
 mount(game,skin,item) {game.homewardScene=new HomewardScene(game,skin,item);},
 cancel(game) {game.homewardScene?.destroy();game.homewardScene=null;},
 correct(game,done) {game.homewardScene.hop(done);},
 win(game,done) {game.homewardScene.win(done);},
 mistake(game,stage,final,item,done) {game.state.visualStage=stage;game.homewardScene.mistake(final,done);}
};

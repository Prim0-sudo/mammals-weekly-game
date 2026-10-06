import {topic} from '../src/topics/mammals.js';
import {GameEngine} from '../src/core/game-engine.js';
import {applyTheme} from '../src/core/theme.js';
import {TRAIL,distinctLetters} from '../src/core/skins/homeward-motion.js';
const report=document.getElementById('report'),gallery=document.getElementById('homeward-review'),results=[];
const game=new GameEngine(topic);applyTheme(topic);game.init();game.audio.muted=true;
const assert=(value,text)=>{if(!value)throw Error(text);};
const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
async function until(fn){const end=performance.now()+10000;while(!fn()){if(performance.now()>end)throw Error('Timed out');await wait(8);}}
const q=selector=>document.querySelector(selector);
const qa=selector=>[...document.querySelectorAll(selector)];
async function test(name,fn){try{await fn();results.push('PASS '+name);}catch(error){results.push('FAIL '+name+': '+error.message);}report.textContent=results.join('\n');}
async function word(id){game.start('spelling');game.chooseCategory('all');q('[data-action="all-words"]').click();game.state.items=[topic.items.find(x=>x.id===id)];game.state.index=0;game.state.score=0;game.round();await until(()=>game.homewardScene&&!game.state.animating);}
const idle=()=>until(()=>!game.state.animating);
function capture(label){const figure=document.createElement('figure'),img=document.createElement('img'),caption=document.createElement('figcaption'),sample=document.createElement('canvas');sample.width=836;sample.height=471;sample.getContext('2d').drawImage(q('.homeward-canvas'),0,0,836,471);img.src=sample.toDataURL('image/jpeg',.72);img.alt=label;caption.textContent=label;figure.append(img,caption);gallery.append(figure);}
await test('Decode all 13 assets before enabling input',async()=>{await word('hippopotamus');assert(Object.keys(game.homewardScene.images).length===13,'decoded image count');assert(qa('.chance-token').length===9,'token count');assert(q('.guess-count').textContent==='9 chances left','counter');});
await test('Observe normal sitting → takeoff → airborne → landing → sitting; repeats and rapid input',async()=>{
 capture('Normal hop: sitting before');const start=game.homewardScene.pose.x;game.guess('p');assert(qa('.letter-slot').filter(x=>x.textContent==='P').length===3,'repeats not revealed');game.guess('o');assert(!game.state.guessed.includes('o'),'rapid input accepted');
 for(const [frame,label] of [['rabbit-hop-01-takeoff','takeoff'],['rabbit-hop-02-airborne','airborne'],['rabbit-hop-03-landing','landing']]){await until(()=>q('.homeward-canvas')?.dataset.pose===frame);capture('Normal hop: '+label);}
 await idle();capture('Normal hop: sitting after');const stop=game.homewardScene.pose.x;assert(stop>start,'did not move');game.guess('p');assert(game.homewardScene.pose.x===stop&&!game.state.animating,'repeated guess moved');game.guess('z');await idle();assert(game.homewardScene.pose.x>stop&&game.homewardScene.pose.x<=800&&game.state.misses===1,'incorrect small hop');
});
await test('Observe final normal hop and three entry poses with progressive foreground occlusion',async()=>{
 await word('cat');for(const letter of ['c','a']){game.guess(letter);await idle();}game.guess('t');assert(game.state.score===0&&!q('[data-action="continue"]'),'result appeared before entry');
 for(const [frame,label] of [['rabbit-entry-01-crouch','crouch'],['rabbit-entry-02-rear-quarter','rear quarter'],['rabbit-entry-03-tail','tail']]){await until(()=>q('.homeward-canvas')?.dataset.pose===frame);assert(game.homewardScene.pose.occlude,'missing entrance mask');capture('Normal entry: '+label);}
 await idle();capture('Normal win: inside burrow');assert(game.state.score===1&&game.state.winExitDone&&game.homewardScene.pose.hidden,'win outcome');assert(game.homewardScene.pose.x===TRAIL.home,'winning stop');game.guess('x');assert(game.state.score===1,'duplicate score');
});
await test('Eight misses keep playing; ninth locks immediately, fox comes from right, rabbit escapes fully left',async()=>{
 await word('cat');for(const letter of 'bdefghij'){game.guess(letter);await idle();}assert(!game.state.spellingStatus&&game.state.misses===8,'early loss');assert(game.homewardScene.pose.x>TRAIL.start&&game.homewardScene.pose.x<=800,'wrong-hop progression');capture('Normal loss: eight misses');game.guess('k');assert(game.state.animating&&qa('.letter-key').every(el=>el.disabled),'final input lock');assert(!q('[data-action="continue"]'),'early loss result');game.guess('l');assert(game.state.misses===9,'tenth guess accepted');
 await until(()=>game.homewardScene.pose.foxX<1460);capture('Normal loss: fox on right, rabbit fleeing left');await idle();capture('Normal loss: rabbit completely off left edge');assert(game.state.spellingStatus==='lost'&&game.state.score===0&&game.homewardScene.pose.hidden&&game.homewardScene.pose.foxX===1455,'loss outcome');assert(q('.spelling-word').textContent.toLowerCase()==='cat','answer reveal');
});
await test('Short, repeated and multi-word answers all reach the burrow; simulated reduced motion',async()=>{
 game.reduced=()=>true;
 for(const id of ['cat','hippopotamus','guinea-pig','sea-otter']){await word(id);for(const letter of distinctLetters(game.state.items[0].name,topic))game.guess(letter);assert(game.state.spellingStatus==='won'&&game.state.score===1&&game.homewardScene.pose.hidden,'word '+id);assert(game.homewardScene.to.x===TRAIL.home,'endpoint '+id);assert(game.homewardScene.frame===null,'reduced RAF');}
 await word('cat');for(const letter of 'bdefghijk')game.guess(letter);assert(game.state.spellingStatus==='lost'&&game.homewardScene.frame===null,'reduced loss');game.reduced=()=>false;
});
await test('Restart during hop, entry and escape destroys callbacks; next word resets; repeat navigation leaves one instance',async()=>{
 for(const phase of ['hop','entry','escape']){
  await word('cat');
  if(phase==='hop')game.guess('c');
  if(phase==='entry'){game.reduced=()=>true;game.guess('c');game.guess('a');game.reduced=()=>false;game.guess('t');await until(()=>q('.homeward-canvas').dataset.pose==='rabbit-entry-01-crouch');}
  if(phase==='escape'){game.reduced=()=>true;for(const letter of 'bdefghij')game.guess(letter);game.reduced=()=>false;game.guess('k');}
  const old=game.homewardScene;game.round();await wait(1100);assert(!old.active&&old.frame===null&&!old.run,'old '+phase);assert(game.state.score===0&&game.state.misses===0&&game.state.guessed.length===0,'restart '+phase);assert(qa('.homeward-canvas').length===1,'duplicate scene');
 }
 await word('cat');game.reduced=()=>true;for(const letter of 'cat')game.guess(letter);game.state.items.push(topic.items.find(x=>x.id==='dog'));q('[data-action="continue"]').click();assert(game.state.index===1&&game.state.guessed.length===0&&game.state.misses===0&&game.homewardScene.to.x===TRAIL.start,'next reset');game.reduced=()=>false;
 for(let i=0;i<8;i++){await word('cat');game.guess('c');const old=game.homewardScene;game.menu();assert(!old.active&&old.frame===null&&!old.run&&!game.homewardScene,'exit cleanup');}await wait(500);assert(game.state.screen==='menu','stale navigation');
});
await test('Simulated hidden-document signal pauses RAF and elapsed movement; resume and mid-animation reduced motion',async()=>{
 await word('cat');game.guess('c');await wait(75);const scene=game.homewardScene;
 const descriptor=Object.getOwnPropertyDescriptor(document,'hidden');
 try{Object.defineProperty(document,'hidden',{configurable:true,get:()=>true});document.dispatchEvent(new Event('visibilitychange'));const x=scene.pose.x,elapsed=scene.run.elapsed;await wait(300);assert(scene.frame===null&&scene.pose.x===x&&scene.run.elapsed===elapsed,'hidden animation ran');}
 finally{if(descriptor)Object.defineProperty(document,'hidden',descriptor);else delete document.hidden;document.dispatchEvent(new Event('visibilitychange'));}
 await idle();assert(scene.active===false,'settled scene not replaced');game.guess('a');game.reduced=()=>true;game.homewardScene.motionChange();assert(!game.state.animating,'motion change did not settle');game.reduced=()=>false;
});
await test('Physical keyboard event path uses letter guesses and respects hopping lock',async()=>{
 await word('cat');document.dispatchEvent(new KeyboardEvent('keydown',{key:'c',bubbles:true}));document.dispatchEvent(new KeyboardEvent('keydown',{key:'a',bubbles:true}));assert(game.state.guessed.join('')==='c','keyboard lock');await idle();document.dispatchEvent(new KeyboardEvent('keydown',{key:'c',bubbles:true}));assert(!game.state.animating&&game.state.guessed.length===1,'keyboard repeat');
});
game.clean();report.textContent=results.join('\n')+'\nDONE '+results.filter(x=>x.startsWith('PASS')).length+'/'+results.length;report.dataset.done='true';

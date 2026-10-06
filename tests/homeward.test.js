import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {topic} from '../src/topics/mammals.js';
import {TRAIL,TRAIL_MIDDLE,WRONG_STEP,HOP_MS,ENTRY_MS,distinctLetters,trailPosition,guessedTrailPosition,hopPose,entryPose,escapePose,escapeDuration} from '../src/core/skins/homeward-motion.js';

test('wrong letters make small forward hops capped at midpoint; mixed guesses still reach home',()=>{
 const misses=[...'bdefghijk'];
 for(let i=1;i<=9;i++){const pose=guessedTrailPosition('cat',misses.slice(0,i),topic);assert.ok(pose.x<=TRAIL_MIDDLE);assert.equal(pose.x,Math.min(TRAIL_MIDDLE,TRAIL.start+i*WRONG_STEP));}
 assert.equal(guessedTrailPosition('cat',misses,topic).x,TRAIL_MIDDLE);
 assert.deepEqual(guessedTrailPosition('cat',['b','b'],topic),guessedTrailPosition('cat',['b'],topic));
 for(const item of topic.items){
  const correct=distinctLetters(item.name,topic),wrong=[...topic.text.alphabet].filter(x=>!correct.includes(x)).slice(0,8),guesses=[];
  let previous=TRAIL.start;
  for(let i=0;i<correct.length;i++){
   if(wrong[i]){guesses.push(wrong[i]);const x=guessedTrailPosition(item.name,guesses,topic).x;assert.ok(x>=previous);assert.ok(x<=Math.max(previous,TRAIL_MIDDLE));previous=x;}
   guesses.push(correct[i]);const x=guessedTrailPosition(item.name,guesses,topic).x;assert.ok(x>previous);previous=x;
  }
  assert.equal(previous,TRAIL.home);
 }
 const beyond=guessedTrailPosition('cat',['c','a'],topic);assert.ok(beyond.x>TRAIL_MIDDLE);assert.deepEqual(guessedTrailPosition('cat',['c','a','b'],topic),beyond);
});

test('every word reaches the same burrow with one hop per distinct guessable letter',()=>{
 for(const item of topic.items){const count=distinctLetters(item.name,topic).length;assert.ok(count>0);
  let position=trailPosition(0,count);
  for(let step=1;step<=count;step++){const end=trailPosition(step,count);const pose=hopPose(HOP_MS,position,end);assert.equal(pose.x,end.x);assert.equal(pose.frame,'rabbit-sit-right');position=end;}
  assert.equal(position.x,TRAIL.home);assert.equal(position.y,TRAIL.groundHome);
 }
 assert.deepEqual(distinctLetters('ÉÉ sea-otter!',{...topic,text:{...topic.text,alphabet:'abcdefghijklmnopqrstuvwxyzé'}}),['é','s','e','a','o','t','r']);
 assert.equal(distinctLetters('hippopotamus',topic).length,9);
});
test('hop uses supplied takeoff, flight, landing and the same sitting endpoints',()=>{
 const a=trailPosition(0,3),b=trailPosition(1,3);
 assert.equal(hopPose(0,a,b).frame,'rabbit-sit-right');
 assert.equal(hopPose(90,a,b).frame,'rabbit-hop-01-takeoff');
 assert.equal(hopPose(180,a,b).frame,'rabbit-hop-02-airborne');
 assert.equal(hopPose(270,a,b).frame,'rabbit-hop-03-landing');
 assert.ok(hopPose(180,a,b).y<Math.min(a.y,b.y));
 assert.deepEqual(hopPose(HOP_MS,a,b),{frame:'rabbit-sit-right',x:b.x,y:b.y,scale:1});
});
test('entry uses foreground occlusion and escape ends completely beyond the left edge',()=>{
 for(const time of [0,200,450])assert.equal(entryPose(time).occlude,true);
 assert.equal(entryPose(ENTRY_MS).hidden,true);
 for(const count of [1,3,9,26]){const from=trailPosition(count-1,count),duration=escapeDuration(from);
  const start=escapePose(0,from,duration),end=escapePose(duration,from,duration);
  assert.ok(start.foxX>TRAIL.width);assert.equal(start.mirror,true);assert.equal(end.x,-300);assert.equal(end.foxX,1455);assert.equal(end.hidden,true);
 }
});
test('all 13 supplied originals and delivery assets retain recorded hashes and individual registration',async()=>{
 const audit=JSON.parse(await readFile('docs/homeward-trail-assets.json','utf8'));assert.equal(Object.keys(audit.assets).length,13);
 const hash=b=>createHash('sha256').update(b).digest('hex');
 for(const record of Object.values(audit.assets)){
  assert.equal(hash(await readFile(record.originalFile)),record.originalSha256);
  assert.equal(hash(await readFile(record.file)),record.sha256);
  if(record.anchor){assert.ok(record.torsoSpan>0);assert.ok(record.anchor[0]>=0&&record.anchor[0]<=record.width);}
 }
});

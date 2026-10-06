import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {landingSample,poseFrame,coverGeometry,intersects} from '../src/core/landing-scene.js';
import {encounterPlan,measureRoute,routePoint,animalState} from '../src/core/landing-motion.js';
import {mammalTerrain} from '../src/topics/mammals-landing.js';
test('landing encounters follow each other without gaps and retain independent pose timing',()=>{
 const plan=encounterPlan();assert.equal(landingSample(0).kind,'squirrel-peek');
 for(const [index,row] of plan.encounters.entries()){
  assert.equal(landingSample(row.start+1).kind,row.kind);
  assert.equal(landingSample(row.start+row.duration).kind,plan.encounters[(index+1)%plan.encounters.length].kind);
 }
 assert.equal(plan.encounters.find(row=>row.kind==='mouse').duration,3000);
 assert.ok(plan.encounters.every(row=>row.kind!=='hedgehog'));
 assert.equal(encounterPlan(1).encounters[1].reverse,true);
 assert.equal(poseFrame([120,120,120],119),0);assert.equal(poseFrame([120,120,120],120),1);assert.equal(poseFrame([120,120,120],360),0);
});
test('ground animals follow straight rock-to-rock paths at constant speed',()=>{
 const route=measureRoute(mammalTerrain.routes.mouseRun),points=Array.from({length:101},(_,i)=>routePoint(route,i/100));
 const distances=points.slice(1).map((p,i)=>Math.hypot(p.x-points[i].x,p.y-points[i].y));
 assert.ok(Math.max(...distances)-Math.min(...distances)<.1);assert.ok(Math.max(...points.map(p=>p.y))-Math.min(...points.map(p=>p.y))<1e-9);
 assert.deepEqual(mammalTerrain.routes.mouseRun,mammalTerrain.routes.squirrelRun);
 assert.ok(mammalTerrain.anchors['mouse-run'].every(anchor=>anchor[0]===205&&anchor[1]===246));
});
test('sitting squirrel stays anchored and mouse mirrors its quick return journey',()=>{
 const plan=encounterPlan(),peek=plan.encounters[0],route=measureRoute(mammalTerrain.routes.leftPeek);
 const a=animalState({...peek,time:1800},route),b=animalState({...peek,time:4600},route);
 assert.equal(a.sequence,'squirrel-idle');assert.equal(a.x,b.x);assert.equal(a.y,b.y);assert.equal(a.walking,false);
 assert.equal(animalState({...peek,time:5000},route).facing,-1);
 const mouse=plan.encounters[1],ground=measureRoute(mammalTerrain.routes.mouseRun);
 const forward=animalState({...mouse,time:1500},ground),back=animalState({...mouse,reverse:true,time:1500},ground);
 assert.equal(forward.sequence,'mouse-run');assert.equal(forward.state,'running');assert.equal(forward.tilt,0);
 assert.equal(forward.facing,1);assert.equal(back.facing,-1);assert.equal(forward.x,back.x);
 assert.equal(animalState({...peek,route:'rightPeek',time:1000},measureRoute(mammalTerrain.routes.rightPeek)).facing,-1);
});
test('scene cover geometry and control intersection use complete rectangles',()=>{
 assert.equal(coverGeometry(1672,941,1672,941).scale,1);
 assert.ok(coverGeometry(360,800,1672,941).x<0);
 assert.equal(intersects({x:0,y:0,width:100,height:100},{x:99,y:99,width:20,height:20}),true);
 assert.equal(intersects({x:0,y:0,width:100,height:100},{x:100,y:100,width:20,height:20}),false);
});
test('48 original frames and four aligned atlases retain their audited hashes',async()=>{
 const audit=JSON.parse(await readFile('docs/landing-animation-assets.json','utf8')),hash=bytes=>createHash('sha256').update(bytes).digest('hex');
 assert.equal(Object.keys(audit.sequences).length,4);
 for(const sequence of Object.values(audit.sequences)){
  assert.equal(sequence.frames.length,12);assert.equal(sequence.cell,160);
  assert.equal(hash(await readFile(sequence.file)),sequence.sha256);
  for(const frame of sequence.frames){assert.equal(hash(await readFile(frame.original)),frame.sha256);assert.ok(frame.durationMs>0);assert.ok(frame.alphaBounds);}
 }
});

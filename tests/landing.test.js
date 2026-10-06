import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {landingSample,poseFrame,coverGeometry,intersects} from '../src/core/landing-scene.js';
test('landing visits one animal at a time with quiet gaps and independent pose timing',()=>{
 assert.equal(landingSample(5999),null);
 assert.equal(landingSample(6000).name,'squirrel-idle');
 assert.equal(landingSample(10500),null);
 for(let elapsed=0;elapsed<56500;elapsed+=100)assert.notEqual(landingSample(elapsed)?.name,'squirrel-acorn-run');
 assert.equal(landingSample(29000).name,'hedgehog-walk');
 assert.equal(landingSample(47000).name,'bat-flight');
 assert.equal(poseFrame([120,120,120],119),0);assert.equal(poseFrame([120,120,120],120),1);assert.equal(poseFrame([120,120,120],360),0);
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

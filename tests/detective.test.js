import test from 'node:test';
import assert from 'node:assert/strict';
import { RevealClock, REVEAL_DURATIONS } from '../src/core/detective-clock.js';

test('mosaic reveals all 120 tiles at each selected duration', () => {
 for (const duration of REVEAL_DURATIONS) {
  let now=0;
  const clock=new RevealClock(()=>now,duration);
  clock.resume();
  for(let second=0;second<120;second++) {
    now=(second+1)*duration*1000/120-0.01;
    assert.equal(clock.blocks,second);
    now=(second+1)*duration*1000/120+0.01;
    assert.equal(clock.blocks,second+1);
  }
  now=60000;
  assert.equal(clock.seconds,duration);
  assert.equal(clock.blocks,120);
 }
});

test('pause excludes elapsed time and resume preserves partial seconds', () => {
  let now=0;
  const clock=new RevealClock(()=>now);
  clock.resume(); now=1500; clock.pause();
  now=100000;
  assert.equal(clock.seconds,1.5);
  clock.resume(); clock.resume(); now+=500;
  assert.equal(clock.seconds,2);
  clock.pause(); clock.pause(); now+=90000;
  assert.equal(clock.blocks,5);
});

test('pixel reveal runs for 45 seconds and caps elapsed time', () => {
  let now=0;
  const clock=new RevealClock(()=>now);
  clock.resume(); now=30000;
  assert.equal(clock.seconds,30);
  now=45000;
  assert.equal(clock.seconds,45);
  now=60000;
  assert.equal(clock.seconds,45);
});

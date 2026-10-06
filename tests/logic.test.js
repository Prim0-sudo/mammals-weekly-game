import test from 'node:test';import assert from 'node:assert/strict';
import {topic as t} from '../src/topics/mammals.js';
import {validateTopic} from '../src/core/topic-validator.js';
import {takeSession,restoreSession,makeFlipDeck,wheelTarget,removeWheelItem,letters,eligible} from '../src/core/logic.js';
test('active topic excludes neighbouring fish theme and retains marine mammals',()=>{
 assert.doesNotMatch(JSON.stringify(t),/\b(fish|gills|goldfish|salmon|tuna|shark|ray|seahorse|clownfish|eel)\b/i);
 assert.equal(t.knowledgeQuestions.length,13);assert.equal(t.curriculum.readingPractice.length,15);
 for(const id of ['whale','dolphin','seal','dugong'])assert.ok(t.items.some(item=>item.id===id));
});
test('123 unique, complete entries; one collection, five exact groups',()=>{assert.ok(validateTopic(t));assert.equal(t.items.length,123);assert.deepEqual(t.categories.map(c=>t.items.filter(x=>x.categoryId===c.id).length),[50,23,22,20,8]);for(const x of t.items){assert.equal(x.assetStatus,'supplied');assert.ok(!('level'in x));}});
test('every vocabulary word mapped to objectives and every vocabulary mode',()=>{const mapped=new Set(t.curriculum.coverage.flatMap(x=>x.itemIds));for(const x of t.items)assert.ok(mapped.has(x.id));for(const mode of ['learn','sort','identify','spelling','flip','wheel'])assert.equal(eligible(t,mode).length,123);});
test('short cycles finish without repeats, including final short remainder',()=>{let queue,seen=[];while(seen.length<123){const s=takeSession(t.items,12,queue);seen.push(...s.items.map(x=>x.id));queue=s.remaining;}assert.equal(new Set(seen).size,123);});
test('exit restores unanswered reservation without duplicates',()=>{const s=takeSession(t.items,12);const restored=restoreSession(s.items.slice(1),s.remaining);assert.equal(restored.length,122);assert.deepEqual(restored.slice(0,11),s.items.slice(1));assert.equal(restoreSession(restored,restored).length,122);});
test('all Flip board counts contain real unique pairs',()=>{for(const n of [8,10,20,30]){const deck=makeFlipDeck(t.items,n);assert.equal(deck.length,n*2);for(const id of new Set(deck.map(x=>x.item.id)))assert.equal(deck.filter(x=>x.item.id===id).length,2);}});
test('Wheel boundaries and every item removed exactly once',()=>{for(const n of [1,8,12,13,123]){let remaining=t.items.slice(0,n);for(let i=0;i<n;i++){const id=remaining[0].id;remaining=removeWheelItem(remaining,id);}assert.equal(remaining.length,0);for(let i=0;i<Math.min(n,12);i++){const count=Math.min(n,12);assert.ok(Math.abs((wheelTarget(i,count)+(i+.5)*360/count)%360)<1e-7);}}});
test('spelling keeps repeated letters and ignores spaces; fixed nine chances',()=>{assert.equal(t.modeSkins.spelling.attempts,9);assert.equal(letters('guinea pig',t).join(''),'guineapig');assert.equal(letters('hippopotamus',t).filter(x=>x==='p').length,3);});
test('all supplied assessment phrases and factual exception reachable',()=>{const all=t.curriculum.readingPractice.map(x=>x.text);for(const text of ['The cat has fur.','A big dog ran.','Sit on the rug.'])assert.ok(all.includes(text));assert.ok(all.some(x=>x.includes('platypus lays eggs')));});

import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {topic as t} from '../src/topics/mammals.js';
import {bank} from '../src/topics/bank.js';
import {validateTopic,assetPaths} from '../src/core/topic-validator.js';
validateTopic(t);
if(t.items.length<120 || JSON.stringify(t.items)!==JSON.stringify(bank))throw Error('Bank mismatch');
const covered=new Set(t.curriculum.coverage.flatMap(x=>x.itemIds));
for(const x of t.items)if(!covered.has(x.id))throw Error('Unmapped '+x.id);
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const original=await readFile('docs/curriculum-outline.png');
const other=await Promise.all(assetPaths(t).filter(p=>!t.items.some(x=>x.image===p)).map(async path=>{
 try{const bytes=await readFile(path);return {path,status:'installed-draft',sha256:hash(bytes),bytes:bytes.length};}
 catch(error){if(error.code!=='ENOENT')throw error;return {path,status:'reserved-css-text-fallback',sha256:null};}
}));
const manifest={status:'132 vocabulary images pending approval; one draft background installed; 16 interface slots currently covered by CSS/text.',source:{path:'docs/curriculum-outline.png',sha256:hash(original),bytes:original.length},vocabulary:t.items.map(x=>({id:x.id,name:x.name,category:x.categoryId,path:x.image,alt:x.imageAlt,brief:x.imageAlt,status:x.assetStatus,canvas:'1024x1024',format:'PNG, sRGB, genuine alpha where appropriate',sha256:null})),other};
await mkdir('docs',{recursive:true});
await writeFile('docs/asset-manifest.json',JSON.stringify(manifest,null,2)+'\n');
await writeFile('docs/VOCABULARY.md','# Complete vocabulary collection\n\n132 entries. No year-group assignments. All wording pending teacher review. Every entry is reachable in Meet the Words and All Words; pictures are pending.\n\n'+t.categories.map(c=>'## '+c.label+' ('+t.items.filter(x=>x.categoryId===c.id).length+')\n\n| ID | Word | Definition | Sentence | Origin |\n|---|---|---|---|---|\n'+t.items.filter(x=>x.categoryId===c.id).map(x=>`| ${x.id} | ${x.name} | ${x.definition} | ${x.sentence} | ${x.provenance} |`).join('\n')).join('\n\n')+'\n');
await writeFile('docs/IMAGE-CHECKLIST.md','# Vocabulary image checklist\n\nAll 132 vocabulary images are missing. No generated, stock, insect or improvised animal art is in use. The UI uses explicit missing-picture panels and text matching. Intended paths are ready for supplied artwork. Do not mark an image ready until inspected; update assetStatus and record its original checksum.\n\nSupply separate 1024 × 1024 sRGB PNGs; keep full canvas, generous margins and useful true alpha. Avoid baked-in words. Use a consistent, gentle, scientifically recognisable style. Body/action pictures need the indicated context. Adult review of accuracy is required.\n\n| ID | Category | File | Required picture | Status |\n|---|---|---|---|---|\n'+t.items.map(x=>`| ${x.id} | ${x.categoryId} | ${x.image} | ${x.imageAlt} | Missing |`).join('\n')+'\n');
await writeFile('docs/COVERAGE.md','# Curriculum coverage\n\nSource: supplied mammal screenshot, 30 November–4 December, year unspecified. Source concepts and all drafted extensions need teacher review.\n\n'+t.curriculum.coverage.map(c=>'## '+t.curriculum.objectives.find(o=>o.id===c.objectiveId).label+'\n\nModes: '+c.modeIds.join(', ')+'. Prompts: '+c.promptIds.join(', ')+'.\n\nWords: '+c.itemIds.join(', ')+'.').join('\n\n')+'\n\nAll 132 vocabulary cards contain original example sentences. Meet the Words → Read & talk together contains 16 reachable text-only sentence/discussion cards, including all three supplied assessment phrases. Wheel practises isolated word reading silently. Sort It practises the guide’s subject categories, not a land-only/water-only animal classification.\n');
console.log(`PASS: ${t.items.length} unique words; categories ${t.categories.map(c=>t.items.filter(x=>x.categoryId===c.id).length).join('/')}; ${t.knowledgeQuestions.length} questions; ${t.curriculum.readingPractice.length} reading cards; ${manifest.vocabulary.length} missing vocabulary + ${manifest.other.filter(x=>x.sha256===null).length} reserved UI paths + ${manifest.other.filter(x=>x.sha256!==null).length} installed background.`);

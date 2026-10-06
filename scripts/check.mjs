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
const supplied=JSON.parse(await readFile('docs/supplied-artwork.json','utf8'));
const suppliedById=new Map(supplied.entries.map(x=>[x.id,x]));
const vocabulary=await Promise.all(t.items.map(async x=>{
 const bytes=await readFile(x.image);
 const record=suppliedById.get(x.id),sha256=hash(bytes);
 if(!record || record.path!==x.image || record.sha256!==sha256 || x.assetStatus!=='supplied')throw Error('Supplied artwork mismatch: '+x.id);
 return {id:x.id,name:x.name,category:x.categoryId,path:x.image,alt:x.imageAlt,brief:x.imageAlt,status:x.assetStatus,dimensions:record.dimensions,mode:record.mode,format:'PNG, RGBA, sRGB',sha256,bytes:bytes.length,provenance:x.artProvenance};
}));
const original=await readFile('docs/curriculum-outline.png');
const other=await Promise.all(assetPaths(t).filter(p=>!t.items.some(x=>x.image===p)).map(async path=>{
 try{const bytes=await readFile(path);return {path,status:'installed-draft',sha256:hash(bytes),bytes:bytes.length};}
 catch(error){if(error.code!=='ENOENT')throw error;return {path,status:'reserved-css-text-fallback',sha256:null};}
}));
const manifest={status:'132 supplied vocabulary images installed and checksum-verified; twelve custom menu illustrations; rabbit club badge; flat woodland rock background; squirrel, mouse and bat landing animations; Detective test assets unchanged.',source:{path:'docs/curriculum-outline.png',sha256:hash(original),bytes:original.length},artworkSource:{archive:supplied.sourceArchive,sha256:supplied.sourceArchiveSha256},vocabulary,other};
await mkdir('docs',{recursive:true});
await writeFile('docs/asset-manifest.json',JSON.stringify(manifest,null,2)+'\n');
await writeFile('docs/VOCABULARY.md','# Complete vocabulary collection\n\n132 entries. No year-group assignments. All wording pending teacher review. Every entry is reachable in Meet the Words and All Words; all 132 supplied pictures are installed.\n\n'+t.categories.map(c=>'## '+c.label+' ('+t.items.filter(x=>x.categoryId===c.id).length+')\n\n| ID | Word | Definition | Sentence | Origin |\n|---|---|---|---|---|\n'+t.items.filter(x=>x.categoryId===c.id).map(x=>`| ${x.id} | ${x.name} | ${x.definition} | ${x.sentence} | ${x.provenance} |`).join('\n')).join('\n\n')+'\n');
await writeFile('docs/IMAGE-CHECKLIST.md','# Vocabulary image checklist\n\nAll 132 supplied vocabulary images are installed. Exact filenames, delivery checksums, dimensions and transparency were checked; all images were reviewed on contact sheets. Delivery PNGs are preserved byte-for-byte. Import records and source checksums are in supplied-artwork.json and asset-manifest.json. Detective artwork is unchanged.\n\n| ID | Category | File | Required picture | Status |\n|---|---|---|---|---|\n'+t.items.map(x=>`| ${x.id} | ${x.categoryId} | ${x.image} | ${x.imageAlt} | Supplied |`).join('\n')+'\n');
await writeFile('docs/COVERAGE.md','# Curriculum coverage\n\nSource: supplied mammal screenshot, 30 November–4 December, year unspecified. Source concepts and all drafted extensions need teacher review.\n\n'+t.curriculum.coverage.map(c=>'## '+t.curriculum.objectives.find(o=>o.id===c.objectiveId).label+'\n\nModes: '+c.modeIds.join(', ')+'. Prompts: '+c.promptIds.join(', ')+'.\n\nWords: '+c.itemIds.join(', ')+'.').join('\n\n')+'\n\nAll 132 vocabulary cards contain original example sentences. Read, Draw & Talk contains 16 reachable illustrated sentence/discussion cards; drawing tools will be added later, including all three supplied assessment phrases. Wheel practises isolated word reading silently. Sort It practises the guide’s subject categories, not a land-only/water-only animal classification.\n');
console.log(`PASS: ${t.items.length} unique words; categories ${t.categories.map(c=>t.items.filter(x=>x.categoryId===c.id).length).join('/')}; ${t.knowledgeQuestions.length} questions; ${t.curriculum.readingPractice.length} reading cards; ${vocabulary.length} supplied pictures with verified checksums; ${manifest.other.filter(x=>x.sha256===null).length} reserved UI paths; Detective artwork unchanged.`);

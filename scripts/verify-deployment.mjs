import {readdir,readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {join,relative,extname} from 'node:path';
const base=process.argv[2] || 'https://mammals-weekly-game.pages.dev/';
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
async function files(dir){const entries=await readdir(dir,{withFileTypes:true});return (await Promise.all(entries.map(e=>e.isDirectory()?files(join(dir,e.name)):[join(dir,e.name)]))).flat();}
const results=[];
for(const file of await files('dist')){
 const path=relative('dist',file).replaceAll('\\','/');
 const response=await fetch(new URL(path==='index.html'?'':path,base));
 const remote=Buffer.from(await response.arrayBuffer());
 const local=await readFile(file);
 const text=['.html','.js','.css','.json'].includes(extname(path));
 const comparable=bytes=>text?Buffer.from(bytes.toString('utf8').replaceAll('\r\n','\n')):bytes;
 if(!response.ok || hash(comparable(remote))!==hash(comparable(local)))throw Error(`Deployment mismatch: ${path} (${response.status})`);
 results.push({path,status:response.status,bytes:remote.length,sha256:hash(remote),comparison:text?'text with Git CRLF/LF normalisation':'byte-for-byte'});
}
await writeFile('test-results/deployment-verification.json',JSON.stringify({url:base,verifiedAt:new Date().toISOString(),files:results},null,2)+'\n');
console.log(`PASS: ${results.length} production files match the local build (Git newline normalisation for text; background byte-for-byte).`);

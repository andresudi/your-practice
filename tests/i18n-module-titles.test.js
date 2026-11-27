import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,readdirSync} from 'node:fs';
const modules=JSON.parse(readFileSync(new URL('../src/content/modules.json',import.meta.url)));
const dir=new URL('../src/features/',import.meta.url);
const files=readdirSync(dir,{recursive:true}).filter(file=>file.endsWith('.jsx'));

test('collection names come from the content bundle, so back links follow the language',()=>{
 const found=[];
 for(const file of files){
  const source=readFileSync(new URL(file,dir),'utf8');
  for(const m of modules)if(source.includes(`>${m.title}<`)||source.includes(`'${m.title}'`))found.push(`${file}: ${m.title}`);
 }
 assert.ok(files.length>20);
 assert.deepEqual(found,[]);
});

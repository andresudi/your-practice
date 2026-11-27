import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,readdirSync,statSync,existsSync} from 'node:fs';
import {join} from 'node:path';
const root=new URL('..',import.meta.url).pathname;
function files(dir){return readdirSync(dir).flatMap(n=>{const p=join(dir,n);return statSync(p).isDirectory()?files(p):[p];});}
test('every image the app shows exists and stays light enough for mobile data (QA G3)',()=>{
 const refs=new Set();
 for(const f of files(join(root,'src')).filter(f=>/\.(jsx?|css)$/.test(f)))for(const m of readFileSync(f,'utf8').matchAll(/\/assets\/[\w.-]+\.(?:png|jpe?g|webp|avif|svg)/g))refs.add(m[0]);
 assert.ok(refs.size>0);
 for(const ref of refs){
  const file=join(root,'public',ref);
  assert.ok(existsSync(file),`${ref} is missing`);
  assert.ok(statSync(file).size<=300*1024,`${ref} is ${Math.round(statSync(file).size/1024)} KB`);
 }
});

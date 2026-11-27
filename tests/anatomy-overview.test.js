import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const read=name=>JSON.parse(readFileSync(new URL(`../src/content/${name}.json`,import.meta.url)));

test('every anatomy collection page has a concise multi-sentence introduction',()=>{
 const regions=read('regions').filter(region=>region.kind!=='tradition');
 const lessons=read('lessons').filter(lesson=>['connective-basics','skeleton-basics'].includes(lesson.id));
 assert.equal(regions.length,6);
 assert.equal(lessons.length,2);
 for(const item of [...regions,...lessons]){
  assert.ok(typeof item.overview==='string'&&item.overview.length>=120&&item.overview.length<=400,`${item.id} needs a short overview`);
  assert.ok((item.overview.match(/\. /g)??[]).length>=1,`${item.id} needs more than one sentence`);
 }
});

import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {getTopicSupport} from '../src/domain/topic-support.js';
import {getCoverage} from '../src/domain/coverage.js';
import {validateContent} from '../src/domain/content.js';

const read=name=>JSON.parse(readFileSync(new URL(`../src/content/${name}.json`,import.meta.url)));
const bundle=Object.fromEntries(['modules','topics','sources','lessons','poses','questions','regions'].map(name=>[name,read(name)]));

test('cohort-specific and supervised subjects point to the teacher, not a generic lesson',()=>{
 for(const id of ['M2-T04','M3-T06','M3-T13','M5-T05']){
  const topic=bundle.topics.find(item=>item.id===id);
  assert.ok(topic,`${id} exists`);
  const support=getTopicSupport(topic,bundle.lessons);
  assert.equal(support.kind,'teacher-led',id);
  assert.ok(support.prompt.trim().length>30,id);
  assert.deepEqual(topic.lessonIds,[],id);
 }
 assert.deepEqual(validateContent(bundle).filter(item=>item.severity==='error'),[]);
});

test('coverage totals count only linked published introductions',()=>{
 for(const module of getCoverage(bundle,{})){
  const introductions=bundle.topics.filter(topic=>topic.moduleId===module.moduleId&&getTopicSupport(topic,bundle.lessons).kind==='introduction');
  assert.equal(module.coveredTopics,introductions.length,module.moduleId);
 }
});

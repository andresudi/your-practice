import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {getCoverage} from '../src/domain/coverage.js';

const read=name=>JSON.parse(readFileSync(new URL(`../src/content/${name}.json`,import.meta.url)));
const bundle={modules:read('modules'),topics:read('topics'),lessons:read('lessons')};

test('the existing breathing introduction also covers the respiratory-system topic',()=>{
 const lesson=bundle.lessons.find(item=>item.id==='breathing-basics');
 const topic=bundle.topics.find(item=>item.id==='M2-T13');
 assert.ok(topic.lessonIds.includes(lesson.id));
 assert.ok(lesson.topicIds.includes(topic.id));
 const withoutRespiratoryLink={...bundle,topics:bundle.topics.map(item=>item.id===topic.id?{...item,lessonIds:item.lessonIds.filter(id=>id!==lesson.id)}:item)};
 const anatomyCoverage=items=>getCoverage(items,{}).find(item=>item.moduleId==='M2').coveredTopics;
 assert.equal(anatomyCoverage(bundle),anatomyCoverage(withoutRespiratoryLink)+1);
});

test('school source records expose no outbound URL to the learner app',()=>{
 const sources=read('sources');
 for(const id of ['training-outline','anatomy-outline']){
  const source=sources.find(item=>item.id===id);
  assert.ok(source,`${id} must keep its provenance label`);
  assert.equal(source.url,undefined,`${id} must not ship an outbound URL`);
 }
});

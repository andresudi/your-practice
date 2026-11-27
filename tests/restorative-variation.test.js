import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {validateContent} from '../src/domain/content.js';
import {getTopicSupport} from '../src/domain/topic-support.js';

const read=name=>JSON.parse(readFileSync(new URL(`../src/content/${name}.json`,import.meta.url)));
const bundle=Object.fromEntries(['modules','topics','sources','lessons','poses','questions','regions'].map(name=>[name,read(name)]));

for(const [topicId,lessonId,sourceId] of [
 ['M1-T14','restorative-principles','yj-restorative'],
 ['M2-T12','individual-variation','os-joints']
]){
 test(`${topicId} has a reciprocal source-backed conceptual lesson`,()=>{
  const topic=bundle.topics.find(item=>item.id===topicId);
  const lesson=bundle.lessons.find(item=>item.id===lessonId);
  assert.ok(lesson);
  assert.equal(lesson.publication,'published');
  assert.equal(lesson.instructional,false);
  assert.deepEqual(lesson.topicIds,[topicId]);
  assert.ok(topic.lessonIds.includes(lessonId));
  assert.ok(lesson.sourceIds.includes(sourceId));
  assert.equal(lesson.sections.length,2);
  assert.equal(lesson.review.status,'fact-checked');
  assert.equal(getTopicSupport(topic,bundle.lessons).kind,'introduction');
  const questions=bundle.questions.filter(item=>item.lessonId===lessonId);
  assert.equal(questions.filter(item=>item.kind==='choice').length,1);
  assert.equal(questions.filter(item=>item.kind==='reflection').length,1);
  assert.deepEqual(new Set(lesson.activityIds),new Set(questions.map(item=>item.id)));
 });
}

test('new conceptual lessons pass content validation',()=>{
 assert.deepEqual(validateContent(bundle).filter(item=>item.severity==='error'),[]);
});

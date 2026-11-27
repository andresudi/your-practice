import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {getTopicSupport} from '../src/domain/topic-support.js';
import {validateContent} from '../src/domain/content.js';

const read=name=>JSON.parse(readFileSync(new URL(`../src/content/${name}.json`,import.meta.url)));
const bundle=Object.fromEntries(['modules','topics','sources','lessons','poses','questions','regions'].map(name=>[name,read(name)]));

test('Hatha introduction is tied narrowly to two attributed verses',()=>{
 const lesson=bundle.lessons.find(item=>item.id==='hatha-first-light');
 const topic=bundle.topics.find(item=>item.id==='M4-T02');
 assert.ok(lesson);
 assert.equal(lesson.publication,'published');
 assert.equal(lesson.instructional,false);
 assert.deepEqual(lesson.topicIds,['M4-T02']);
 assert.deepEqual(topic.lessonIds,[lesson.id]);
 assert.ok(lesson.sourceIds.includes('cys-hatha-1'));
 assert.equal(lesson.sections.length,2);
 assert.equal(getTopicSupport(topic,bundle.lessons).kind,'introduction');
 const questions=bundle.questions.filter(item=>item.lessonId===lesson.id);
 assert.equal(questions.filter(item=>item.kind==='choice').length,1);
 assert.equal(questions.filter(item=>item.kind==='reflection').length,1);
 assert.deepEqual(new Set(lesson.activityIds),new Set(questions.map(item=>item.id)));
});

test('interpretation-dependent philosophy topics have specific teacher-led outcomes',()=>{
 for(const id of ['M4-T03','M4-T05','M4-T06','M4-T07']){
  const topic=bundle.topics.find(item=>item.id===id);
  assert.equal(getTopicSupport(topic,bundle.lessons).kind,'teacher-led');
  assert.ok(topic.teacherPrompt?.length>45);
  assert.deepEqual(topic.lessonIds,[]);
 }
 assert.equal(bundle.topics.filter(item=>getTopicSupport(item,bundle.lessons).kind==='planned').length,0);
 assert.deepEqual(validateContent(bundle).filter(item=>item.severity==='error'),[]);
});

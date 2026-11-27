import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {validateContent} from '../src/domain/content.js';
import {getTopicSupport} from '../src/domain/topic-support.js';

const read=name=>JSON.parse(readFileSync(new URL(`../src/content/${name}.json`,import.meta.url)));
const bundle=Object.fromEntries(['modules','topics','sources','lessons','poses','questions','regions'].map(name=>[name,read(name)]));

test('teaching essentials introduces each of the three remaining professional topics',()=>{
 const lesson=bundle.lessons.find(item=>item.id==='teaching-essentials');
 assert.ok(lesson);
 assert.equal(lesson.publication,'published');
 assert.equal(lesson.instructional,false);
 assert.deepEqual(lesson.topicIds,['M3-T10','M3-T11','M3-T12']);
 assert.equal(lesson.sections.length,3);
 assert.ok(lesson.sourceIds.includes('ya-rys200'));
 assert.ok(lesson.sourceIds.includes('ya-code'));
 for(const id of lesson.topicIds){
  const topic=bundle.topics.find(item=>item.id===id);
  assert.deepEqual(topic.lessonIds,['teaching-essentials']);
  assert.equal(getTopicSupport(topic,bundle.lessons).kind,'introduction');
 }
 assert.deepEqual(validateContent(bundle).filter(item=>item.severity==='error'),[]);
});

test('recall checks professional conduct, learning and honest sharing without grading reflection',()=>{
 const lesson=bundle.lessons.find(item=>item.id==='teaching-essentials');
 const questions=bundle.questions.filter(item=>item.lessonId===lesson.id);
 assert.equal(questions.filter(item=>item.kind==='choice').length,3);
 assert.equal(questions.filter(item=>item.kind==='reflection').length,1);
 assert.deepEqual(new Set(lesson.activityIds),new Set(questions.map(item=>item.id)));
});

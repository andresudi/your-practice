import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {validateContent} from '../src/domain/content.js';
import {getTopicSupport} from '../src/domain/topic-support.js';

const read=name=>JSON.parse(readFileSync(new URL(`../src/content/${name}.json`,import.meta.url)));
const bundle=Object.fromEntries(['modules','topics','sources','lessons','poses','questions','regions'].map(name=>[name,read(name)]));

test('the ahimsa introduction has reviewed source evidence and reciprocal topic links',()=>{
 const lesson=bundle.lessons.find(item=>item.id==='ahimsa-in-action');
 assert.equal(lesson?.publication,'published');
 assert.equal(lesson.review?.evidence,'docs/philosophy-source-brief-2026-10-07.md');
 assert.deepEqual(lesson.topicIds,['M4-T01','M4-T04']);
 for(const id of lesson.topicIds){
  const topic=bundle.topics.find(item=>item.id===id);
  assert.ok(topic.lessonIds.includes(lesson.id));
  assert.equal(getTopicSupport(topic,bundle.lessons).kind,'introduction');
 }
 assert.deepEqual(validateContent(bundle).filter(issue=>issue.severity==='error'),[]);
});

test('the ahimsa recall includes a text fact, an ethical distinction and ungraded reflection',()=>{
 const lesson=bundle.lessons.find(item=>item.id==='ahimsa-in-action');
 const questions=bundle.questions.filter(item=>item.lessonId===lesson.id);
 assert.equal(questions.filter(item=>item.kind==='choice').length,2);
 assert.equal(questions.filter(item=>item.kind==='reflection').length,1);
 assert.deepEqual(new Set(lesson.activityIds),new Set(questions.map(item=>item.id)));
});

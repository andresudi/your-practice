import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {validateContent} from '../src/domain/content.js';
import {getTopicSupport} from '../src/domain/topic-support.js';

const read=name=>JSON.parse(readFileSync(new URL(`../src/content/${name}.json`,import.meta.url)));
const bundle=Object.fromEntries(['modules','topics','sources','lessons','poses','questions','regions'].map(name=>[name,read(name)]));

test('benefits and cautions has narrow reciprocal introductory coverage',()=>{
 const lesson=bundle.lessons.find(item=>item.id==='benefits-and-cautions');
 assert.equal(lesson?.publication,'published');
 assert.deepEqual(lesson.topicIds,['M2-T05']);
 assert.equal(lesson.review.evidence,'docs/benefits-safety-source-brief-2026-10-07.md');
 const topic=bundle.topics.find(item=>item.id==='M2-T05');
 assert.ok(topic.lessonIds.includes(lesson.id));
 assert.equal(getTopicSupport(topic,bundle.lessons).kind,'introduction');
 assert.deepEqual(validateContent(bundle).filter(item=>item.severity==='error'),[]);
});

test('benefits recall distinguishes evidence, individual context and reflection',()=>{
 const lesson=bundle.lessons.find(item=>item.id==='benefits-and-cautions');
 const questions=bundle.questions.filter(item=>item.lessonId===lesson.id);
 assert.equal(questions.filter(item=>item.kind==='choice').length,2);
 assert.equal(questions.filter(item=>item.kind==='reflection').length,1);
 assert.deepEqual(new Set(lesson.activityIds),new Set(questions.map(item=>item.id)));
});

import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {resolveRoute} from '../src/app/routes.js';
import {validateContent} from '../src/domain/content.js';
import {getCoverage} from '../src/domain/coverage.js';
import {getTopicSupport} from '../src/domain/topic-support.js';
import {evaluateAnswer,selectQuestions,summarizeAttempt} from '../src/domain/review.js';

const names=['modules','topics','sources','lessons','poses','questions','regions'];
const bundle=Object.fromEntries(names.map(name=>[name,JSON.parse(readFileSync(new URL(`../src/content/${name}.json`,import.meta.url)))]));

test('read-the-room introduces group, pace and individual needs without claiming an assessment',()=>{
 const lesson=bundle.lessons.find(item=>item.id==='read-the-room');
 assert.ok(lesson);
 assert.equal(resolveRoute('/learn/read-the-room',bundle).params.lessonId,lesson.id);
 assert.equal(lesson.publication,'published');
 assert.equal(lesson.instructional,false);
 assert.ok(lesson.sourceIds.includes('ya-rys200'));
 assert.ok(lesson.sourceIds.includes('ya-code'));
 for(const id of ['M3-T02','M3-T03','M3-T05']){
  assert.ok(lesson.topicIds.includes(id));
  const topic=bundle.topics.find(item=>item.id===id);
  assert.ok(topic.lessonIds.includes(lesson.id));
  assert.equal(getTopicSupport(topic,bundle.lessons).kind,'introduction');
 }
 assert.ok(lesson.sections.some(section=>section.id==='individual'));
 const withoutPaceLinks={...bundle,topics:bundle.topics.map(item=>lesson.topicIds.includes(item.id)?{...item,lessonIds:item.lessonIds.filter(id=>id!==lesson.id)}:item)};
 const teachingCoverage=items=>getCoverage(items,{}).find(item=>item.moduleId==='M3').coveredTopics;
 assert.equal(teachingCoverage(bundle),teachingCoverage(withoutPaceLinks)+3);
 assert.deepEqual(validateContent(bundle),[]);
});

test('the teaching check adds an individual-needs concept without grading reflection',()=>{
 const questions=selectQuestions(bundle,['read-the-room']);
 assert.equal(questions.length,4);
 assert.ok(questions.some(question=>question.id==='q-room-individual'));
 const results=questions.map(question=>{
  if(question.kind==='reflection')return evaluateAnswer(question,'I would ask my mentor about transitions.');
  assert.equal(evaluateAnswer(question,question.options.find(option=>option.id!==question.answer).id),'incorrect');
  return evaluateAnswer(question,question.answer);
 });
 assert.deepEqual(summarizeAttempt(results),{graded:3,correct:3,reflections:1});
});

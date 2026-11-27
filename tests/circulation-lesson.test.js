import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {resolveRoute} from '../src/app/routes.js';
import {evaluateAnswer,selectQuestions} from '../src/domain/review.js';
import {validateContent} from '../src/domain/content.js';

const names=['modules','topics','sources','lessons','poses','questions','regions'];
const bundle=Object.fromEntries(names.map(name=>[name,JSON.parse(readFileSync(new URL(`../src/content/${name}.json`,import.meta.url)))]));

test('circulation introduction is reachable and covers its mapped public topic',()=>{
 const lesson=bundle.lessons.find(item=>item.id==='circulation-basics');
 assert.ok(lesson);
 assert.equal(resolveRoute('/learn/follow-the-circulation',bundle).params.lessonId,lesson.id);
 assert.equal(lesson.publication,'published');
 assert.ok(lesson.sourceIds.includes('os-circulation'));
 assert.ok(bundle.topics.find(item=>item.id==='M2-T14').lessonIds.includes(lesson.id));
 assert.deepEqual(validateContent(bundle),[]);
});

test('circulation recall distinguishes the lung and body circuits',()=>{
 const questions=selectQuestions(bundle,['circulation-basics']);
 assert.equal(questions.length,3);
 for(const question of questions){
  assert.equal(evaluateAnswer(question,question.answer),'correct');
  const distractor=question.options.find(option=>option.id!==question.answer);
  assert.equal(evaluateAnswer(question,distractor.id),'incorrect');
 }
});

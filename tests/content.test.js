import test from 'node:test';
import assert from 'node:assert/strict';
import { fixture } from './fixtures/content.js';
import { validateContent } from '../src/domain/content.js';
test('rejects dangling source and topic IDs',()=>{const b=fixture();b.lessons[0].sourceIds=['missing'];b.lessons[0].topicIds=['absent'];const reasons=validateContent(b).map(issue=>issue.reason);assert.ok(reasons.some(reason=>reason.includes('Unknown sources reference')));assert.ok(reasons.some(reason=>reason.includes('Unknown topics reference')));});
test('rejects published unreviewed instruction',()=>{const b=fixture();b.lessons[0].publication='published';assert.ok(validateContent(b).some(x=>x.reason.includes('review')));});
test('valid draft content passes integrity checks',()=>assert.deepEqual(validateContent(fixture()),[]));
test('topic and lesson coverage links must agree in both directions',()=>{
 const missingFromTopic=fixture();missingFromTopic.topics[0].lessonIds=[];
 assert.ok(validateContent(missingFromTopic).some(issue=>issue.reason.includes('Reciprocal')));
 const missingFromLesson=fixture();missingFromLesson.lessons[0].topicIds=[];
 assert.ok(validateContent(missingFromLesson).some(issue=>issue.reason.includes('Reciprocal')));
});

import test from 'node:test';
import assert from 'node:assert/strict';
import {anatomyChecks,checkFeedback} from '../src/features/body/anatomy-checks.js';
test('every anatomy check has its correct answer among its options',()=>{
 for(const [id,c] of Object.entries(anatomyChecks))assert.ok(c.options.includes(c.correct),id);
 assert.deepEqual(Object.keys(anatomyChecks).sort(),['breathing','hip','knee','muscles','nervous','shoulder']);
});
test('a wrong answer names the right one before the explanation (QA G1)',()=>{
 for(const [id,c] of Object.entries(anatomyChecks)){
  const wrong=c.options.find(o=>o!==c.correct);
  const miss=checkFeedback(c,wrong);
  assert.equal(miss.correct,false,id);
  assert.ok(miss.text.startsWith('A useful one to revisit.'),id);
  assert.ok(miss.text.includes(`The answer is “${c.correct}”.`),id);
  const hit=checkFeedback(c,c.correct);
  assert.equal(hit.correct,true,id);
  assert.ok(hit.text.startsWith('That’s it.'),id);
  assert.ok(!hit.text.includes('The answer is'),id);
 }
});

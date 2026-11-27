import test from 'node:test';
import assert from 'node:assert/strict';
import {countLabel} from '../src/domain/plural.js';
test('counts read naturally for one and for many (QA G4: "1 steps", "1 lesson statuses")',()=>{
 assert.equal(countLabel(1,'step'),'1 step');
 assert.equal(countLabel(2,'step'),'2 steps');
 assert.equal(countLabel(0,'review'),'0 reviews');
 assert.equal(countLabel(1,'lesson status','lesson statuses'),'1 lesson status');
 assert.equal(countLabel(3,'lesson status','lesson statuses'),'3 lesson statuses');
});

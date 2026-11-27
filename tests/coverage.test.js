import test from 'node:test';
import assert from 'node:assert/strict';
import { fixture } from './fixtures/content.js';
import { getCoverage } from '../src/domain/coverage.js';
test('does not count draft lessons as coverage',()=>assert.deepEqual(getCoverage(fixture(),{})[0],{moduleId:'M2',totalTopics:1,coveredTopics:0,publishedLessonCount:0,reviewedLessonCount:0}));
test('counts cross linked lessons once',()=>{const b=fixture();b.lessons[0].publication='published';b.topics.push({...b.topics[0],id:'muscle'});b.lessons[0].topicIds.push('muscle');const r=getCoverage(b,{lessonStatuses:{l:'reviewed'}})[0];assert.equal(r.coveredTopics,2);assert.equal(r.publishedLessonCount,1);assert.equal(r.reviewedLessonCount,1);});
test('does not call an empty module complete',()=>{const b=fixture();b.lessons=[];b.topics[0].lessonIds=[];const r=getCoverage(b,{})[0];assert.equal(r.totalTopics,1);assert.equal(r.coveredTopics,0);});

import test from 'node:test';
import assert from 'node:assert/strict';
import {getTopicSupport} from '../src/domain/topic-support.js';
import {validateContent} from '../src/domain/content.js';
import {fixture} from './fixtures/content.js';

test('published introductions take precedence over draft links',()=>{
 const bundle=fixture();
 bundle.lessons.push({...bundle.lessons[0],id:'published',publication:'published'});
 bundle.topics[0].lessonIds=['l','published'];
 assert.equal(getTopicSupport(bundle.topics[0],bundle.lessons).kind,'introduction');
});

test('drafts, teacher-led activities and planned topics remain distinct',()=>{
 const bundle=fixture();
 assert.equal(getTopicSupport(bundle.topics[0],bundle.lessons).kind,'draft');
 bundle.topics[0].lessonIds=[];
 bundle.topics[0].teacherPrompt='Ask your teacher to demonstrate this in class.';
 assert.equal(getTopicSupport(bundle.topics[0],bundle.lessons).kind,'teacher-led');
 delete bundle.topics[0].teacherPrompt;
 assert.equal(getTopicSupport(bundle.topics[0],bundle.lessons).kind,'planned');
});

test('teacher-led prompts cannot disguise an existing lesson link',()=>{
 const bundle=fixture();
 bundle.topics[0].teacherPrompt='Ask your teacher.';
 assert.ok(validateContent(bundle).some(issue=>issue.recordId===bundle.topics[0].id&&issue.reason.includes('Teacher-led')));
});

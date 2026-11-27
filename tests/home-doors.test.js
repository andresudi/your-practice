import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {homeDoors,continueLesson} from '../src/features/study/home-doors.js';
import {mainNav} from '../src/app/main-nav.js';
const read=name=>JSON.parse(readFileSync(new URL(`../src/content/${name}.json`,import.meta.url)));
const bundle={poses:read('poses'),regions:read('regions'),lessons:read('lessons'),modules:read('modules')};

test('Home cards use the header names, order and links',()=>{
 assert.deepEqual(homeDoors(bundle).map(d=>[d.id,d.label,d.href]),mainNav.map(i=>[i.id,i.label,i.href]));
});
test('card counts come from the content, so they stay true as it grows',()=>{
 const published=bundle.lessons.filter(l=>l.publication==='published').length;
 const [study,poses,anatomy]=homeDoors(bundle);
 assert.equal(study.meta,`${bundle.modules.length} areas · ${published} lessons`);
 assert.equal(poses.meta,`${bundle.poses.length} animated poses`);
 assert.equal(anatomy.meta,'8 body topics');
});
test('continue only offers a published lesson the learner actually opened',()=>{
 const published=bundle.lessons.find(l=>l.publication==='published');
 const draft=bundle.lessons.find(l=>l.publication!=='published');
 assert.equal(continueLesson(bundle,{lastLessonId:published.id}),published);
 assert.equal(continueLesson(bundle,{lastLessonId:draft.id}),null);
 assert.equal(continueLesson(bundle,{lastLessonId:'deleted-lesson'}),null);
 assert.equal(continueLesson(bundle,{}),null);
 assert.equal(continueLesson(bundle,undefined),null);
});

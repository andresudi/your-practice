import test from 'node:test';
import assert from 'node:assert/strict';
import {getRevisionStart,getLessonCollection,getReviewReturn} from '../src/domain/study-path.js';

const lessons=[
 {id:'first',slug:'first',publication:'published'},
 {id:'sample',slug:'sample',publication:'draft'},
 {id:'second',slug:'second',publication:'published'}
];

test('revision begins with a marked revisit before recent or first lessons',()=>{
 const state={lastLessonId:'first',lessonStatuses:{second:'revisit'}};
 assert.equal(getRevisionStart(lessons,state).id,'second');
});

test('revision continues a recent published lesson but never sends learners to a draft',()=>{
 assert.equal(getRevisionStart(lessons,{lastLessonId:'second',lessonStatuses:{}}).id,'second');
 assert.equal(getRevisionStart(lessons,{lastLessonId:'sample',lessonStatuses:{}}).id,'first');
});

test('a visual lesson returns to its subject collection',()=>{
 assert.deepEqual(getLessonCollection({primaryModuleId:'M2'},[{id:'M2',slug:'anatomy',title:'Anatomy & physiology'}]),{href:'/study/anatomy',label:'Anatomy & physiology'});
 assert.deepEqual(getLessonCollection({primaryModuleId:'missing'},[]),{href:'/study',label:'Study path'});
});

test('recall returns to its linked pose when started from that pose',()=>{
 const bundle={lessons:[{id:'pose-observation',slug:'observe-a-pose'}],poses:[{id:'warrior-ii',slug:'warrior-ii',englishName:'Warrior II',lessonIds:['pose-observation']}]};
 assert.deepEqual(getReviewReturn(bundle,'pose-observation','warrior-ii'),{href:'/poses/warrior-ii',label:'Warrior II'});
 assert.deepEqual(getReviewReturn(bundle,'pose-observation','unknown'),{href:'/learn/observe-a-pose',label:'lesson'});
});

test('recall ignores an unrelated pose context and keeps a safe study fallback',()=>{
 const bundle={lessons:[{id:'nervous-basics',slug:'meet-your-nervous-system'}],poses:[{id:'tree',slug:'tree',englishName:'Tree',lessonIds:['pose-observation']}]};
 assert.deepEqual(getReviewReturn(bundle,'nervous-basics','tree'),{href:'/learn/meet-your-nervous-system',label:'lesson'});
 assert.deepEqual(getReviewReturn(bundle,'missing','tree'),{href:'/study',label:'study path'});
});

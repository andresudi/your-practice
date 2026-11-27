import test from 'node:test';import assert from 'node:assert/strict';import {selectQuestions,evaluateAnswer,summarizeAttempt,reviewScope} from '../src/domain/review.js';
const choice={id:'q',lessonId:'l',kind:'choice',options:[{id:'a'},{id:'b'}],answer:'b'},label={id:'label',lessonId:'l',kind:'label',answer:'Café pose'},reflection={id:'ref',lessonId:'l',kind:'reflection'};
test('choice grading uses stable option IDs and rejects missing/invalid questions',()=>{assert.equal(evaluateAnswer(choice,'b'),'correct');assert.equal(evaluateAnswer(choice,'a'),'incorrect');for(const [q,a] of [[undefined,'a'],[choice,'c'],[label,5]])assert.throws(()=>evaluateAnswer(q,a));});
test('labels normalize Unicode and whitespace while preserving accents',()=>{assert.equal(evaluateAnswer(label,'  CAFE\u0301    pose '),'correct');assert.equal(evaluateAnswer(label,'Cafe pose'),'incorrect');});
test('reflections never earn a fabricated score',()=>{assert.equal(evaluateAnswer(reflection,'My observation'),'reflection');assert.deepEqual(summarizeAttempt(['reflection']),{graded:0,correct:0,reflections:1});assert.deepEqual(summarizeAttempt([]),{graded:0,correct:0,reflections:0});});
test('mixed sessions count only graded questions in the denominator',()=>assert.deepEqual(summarizeAttempt(['correct','incorrect','reflection']),{graded:2,correct:1,reflections:1}));
test('question selection excludes stale lessons, duplicates and respects empty filters',()=>{const bundle={lessons:[{id:'l'}],questions:[choice,choice,label,{...reflection,lessonId:'missing'}]};assert.deepEqual(selectQuestions(bundle,['l'],5).map(q=>q.id),['q','label']);assert.deepEqual(selectQuestions(bundle,[],5),[]);assert.deepEqual(selectQuestions({lessons:[],questions:[]},[],5),[]);assert.equal(selectQuestions(bundle,['l'],1).length,1);});

const mixedBundle={
 lessons:['a','b','c','d','e','f'].map(id=>({id})),
 questions:['a','b','c','d','e','f'].flatMap(lessonId=>[1,2,3].map(n=>({id:`${lessonId}${n}`,lessonId})))
};
test('a short module review spreads questions across lessons before repeating a lesson',()=>{
 assert.deepEqual(selectQuestions(mixedBundle,['a','b','c','d','e','f']).map(q=>q.id),['a1','b1','c1','d1','e1']);
 assert.deepEqual(selectQuestions(mixedBundle,['a','b']).map(q=>q.id),['a1','b1','a2','b2','a3']);
});
test('completed reviews bring unseen questions forward, including lessons beyond the first five',()=>{
 const attempts=[{questionIds:['a1','b1','c1','d1','e1']}];
 const selected=selectQuestions(mixedBundle,['a','b','c','d','e','f'],5,attempts);
 assert.equal(new Set(selected.map(q=>q.lessonId)).size,5);
 assert.ok(selected.some(q=>q.lessonId==='f'));
 assert.ok(selected.every(q=>!attempts[0].questionIds.includes(q.id)));
});
test('when all questions have been seen, least-used then least-recent questions return first',()=>{
 const attempts=[{questionIds:['a2']},{questionIds:['a1','a3']},{questionIds:['a1','stale']}];
 assert.deepEqual(selectQuestions(mixedBundle,['a'],2,attempts).map(q=>q.id),['a2','a3']);
});
test('selection stays scoped and capped without changing content or history',()=>{
 const before=structuredClone(mixedBundle),attempts=[{questionIds:['b1','a1','a1']}],history=structuredClone(attempts);
 assert.deepEqual(selectQuestions(mixedBundle,['a'],5,attempts).map(q=>q.id),['a2','a3','a1']);
 assert.equal(selectQuestions(mixedBundle,['a','b','c'],20,attempts).length,5);
 assert.deepEqual(selectQuestions(mixedBundle,['a'],0,attempts),[]);
 for(const limit of [-1,1.5,NaN])assert.throws(()=>selectQuestions(mixedBundle,['a'],limit,attempts));
 assert.deepEqual(mixedBundle,before);assert.deepEqual(attempts,history);
});
test('pose-name answers accept 2 for II and 3 for III, but still reject a different number',()=>{
 // QA G2: learners type "warrior 2"; marking it wrong lowered their score.
 const pose={id:'w2',lessonId:'l',kind:'label',answer:'Warrior II'};
 for(const a of ['warrior 2','Warrior II',' WARRIOR  ii '])assert.equal(evaluateAnswer(pose,a),'correct',a);
 for(const a of ['warrior 3','warrior','warrior 22'])assert.equal(evaluateAnswer(pose,a),'incorrect',a);
 assert.equal(evaluateAnswer({...pose,answer:'Warrior III'},'warrior 3'),'correct');
});
test('a recall link to an unknown lesson falls back to every lesson instead of an empty session',()=>{
 // QA G9: /review?lesson=nope showed "All subject areas" with no questions.
 const bundle={lessons:[{id:'a',primaryModuleId:'M1'},{id:'b',primaryModuleId:'M2'}]};
 assert.deepEqual(reviewScope(bundle,{lessonId:'nope'}),{lessonId:null,lessonIds:['a','b']});
 assert.deepEqual(reviewScope(bundle,{lessonId:'b'}),{lessonId:'b',lessonIds:['b']});
 assert.deepEqual(reviewScope(bundle,{moduleId:'M1'}),{lessonId:null,lessonIds:['a']});
 assert.deepEqual(reviewScope(bundle,{lessonId:'nope',moduleId:'M2'}),{lessonId:null,lessonIds:['b']});
});

import test from 'node:test';
import assert from 'node:assert/strict';
import {poseSketchAt,poseSketches} from '../src/features/body/pose-sketch-motion.js';
const distance=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1]);
test('each pose has genuine motion and reaches its existing illustration',()=>{
 for(const id of Object.keys(poseSketches)){
  const first=poseSketchAt(id,0),last=poseSketchAt(id,1);
  assert.notDeepEqual(first,last,id+' must move');
  assert.deepEqual(last,poseSketches[id]);
  assert.deepEqual(poseSketchAt(id,-1),first);
  assert.deepEqual(poseSketchAt(id,2),last);
 }
});
test('animated limbs retain their bone lengths and supporting feet stay grounded',()=>{
 for(const [id,base] of Object.entries(poseSketches)){
  for(const t of [0,.1,.25,.5,.75,.9,1]){
   const p=poseSketchAt(id,t);
   for(const [kind,index] of [['legs',0],['legs',1],['arms',0],['arms',1]]){
    for(let n=0;n<2;n++)assert.ok(Math.abs(distance(p[kind][index][n],p[kind][index][n+1])-distance(base[kind][index][n],base[kind][index][n+1]))<.001,`${id} ${kind} ${index} at ${t}`);
   }
   assert.deepEqual(p.feet[0],base.feet[0]);
   if(id!=='tree')assert.deepEqual(p.feet[1],base.feet[1]);
  }
 }
});
test('cat and cow animate in opposite directions from a shared tabletop silhouette',()=>{
 const catStart=poseSketchAt('cat',0),catEnd=poseSketchAt('cat',1);
 const cowStart=poseSketchAt('cow',0),cowEnd=poseSketchAt('cow',1);
 assert.ok(catStart.head[1]<catEnd.head[1]);
 assert.ok(cowStart.head[1]>cowEnd.head[1]);
 assert.notEqual(catStart.torso,catEnd.torso);
 assert.notEqual(cowStart.torso,cowEnd.torso);
});

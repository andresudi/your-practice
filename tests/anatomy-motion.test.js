import test from 'node:test';
import assert from 'node:assert/strict';
import {jointGeometry,signalAt} from '../src/features/body/anatomy-motion.js';
test('joint illustrations keep segment length constant during movement',()=>{
 for(const joint of ['shoulder','hip','knee'])for(const t of [0,.25,.5,.75,1]){
  const p=jointGeometry(joint,t);
  assert.ok(Math.abs(Math.hypot(p.end[0]-p.pivot[0],p.end[1]-p.pivot[1])-p.length)<.00001);
 }
});
test('flexion changes the knee angle and inputs clamp at both ends',()=>{
 const a=jointGeometry('knee',0),b=jointGeometry('knee',1);
 assert.ok(b.end[0]>a.end[0]);
 assert.deepEqual(jointGeometry('knee',-2),a);
 assert.deepEqual(jointGeometry('knee',2),b);
});
test('signal timeline visits sensation, integration, then response',()=>{
 assert.equal(signalAt(0).stage,0);assert.equal(signalAt(.5).stage,1);assert.equal(signalAt(1).stage,2);
 for(const t of [0,.3,.6,1])assert.ok(signalAt(t).local>=0&&signalAt(t).local<=1);
});

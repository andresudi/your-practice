import test from 'node:test';
import assert from 'node:assert/strict';
import { poseAt, solveKnee, advanceMotion } from '../src/features/body/pose-motion.js';

test('motion clamps endpoints and keeps feet grounded throughout the sequence',()=>{
  assert.deepEqual(poseAt(-1),poseAt(0));
  assert.deepEqual(poseAt(2),poseAt(1));
  for(const t of [0,.2,.5,.8,1]){
    const p=poseAt(t);
    assert.equal(p.leftAnkle[1],.17);
    assert.equal(p.rightAnkle[1],.17);
    assert.ok(p.pelvis[1]>1);
  }
});
test('leg solution preserves bone lengths during reachable bends',()=>{
  const hip=[.22,1.35,0],ankle=[1.2,.17,0];
  const knee=solveKnee(hip,ankle,1.04,.85,1);
  assert.ok(Math.abs(Math.hypot(knee[0]-hip[0],knee[1]-hip[1])-1.04)<1e-6);
  assert.ok(Math.abs(Math.hypot(knee[0]-ankle[0],knee[1]-ankle[1])-.85)<1e-6);
});
test('one-shot playback stops at the endpoint and an explicit loop wraps',()=>{
  assert.deepEqual(advanceMotion(.95,2,10,false),{progress:1,playing:false});
  assert.ok(Math.abs(advanceMotion(.95,2,10,true).progress-.15)<1e-9);
  assert.deepEqual(advanceMotion(.4,0,10,false),{progress:.4,playing:true});
});

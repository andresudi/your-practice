import test from 'node:test';import assert from 'node:assert/strict';import {startMotionLoop} from '../src/features/body/motion-loop.js';
function fakeFrames(){const queue=[];return {raf:f=>{queue.push(f);return queue.length},cancel:()=>{},run(times){for(const t of times)queue.shift()?.(t);},get pending(){return queue.length}};}
test('motion advances even when the page reports itself hidden while frames still arrive',()=>{
 // Embedded browser panes can report document.hidden=true while visible and painting frames; the loop must not freeze there.
 const previous=globalThis.document;globalThis.document={hidden:true};
 try{const frames=fakeFrames(),deltas=[];startMotionLoop(dt=>{deltas.push(dt)},frames);frames.run([0,16,32]);assert.deepEqual(deltas,[.016,.016]);}
 finally{globalThis.document=previous;}
});
test('frame gaps are clamped so a resumed tab does not jump ahead',()=>{const frames=fakeFrames(),deltas=[];startMotionLoop(dt=>{deltas.push(dt)},{...frames,maxDelta:.05});frames.run([0,5000]);assert.deepEqual(deltas,[.05]);});
test('returning false from a step ends the loop, and stop() prevents later steps',()=>{
 const frames=fakeFrames();let calls=0;startMotionLoop(()=>{calls++;return false},frames);frames.run([0,16,32]);assert.equal(calls,1);assert.equal(frames.pending,0);
 const other=fakeFrames();let later=0;const stop=startMotionLoop(()=>{later++},other);other.run([0]);stop();other.run([16]);assert.equal(later,0);
});

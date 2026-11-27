import test from 'node:test';
import assert from 'node:assert/strict';
import SceneBoundary from '../src/features/body/SceneBoundary.js';
test('a rejected animation module selects the fallback and notifies its parent',()=>{let called=0;const fallback='still image';const b=new SceneBoundary({fallback,onFailure:()=>called++,children:'animation'});assert.equal(b.render(),'animation');b.state=SceneBoundary.getDerivedStateFromError(new Error('Chunk unavailable'));assert.equal(b.render(),fallback);b.componentDidCatch();assert.equal(called,1);});

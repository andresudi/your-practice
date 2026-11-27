import test from 'node:test';
import assert from 'node:assert/strict';
import {breathAt,muscleAt} from '../src/features/body/physiology-motion.js';
test('inspiration lowers the diaphragm while expiration restores the dome',()=>{const rest=breathAt(0),full=breathAt(.5),end=breathAt(1);assert.ok(full.diaphragmY>rest.diaphragmY);assert.ok(full.lungScale>rest.lungScale);assert.equal(full.phase,'expiration');assert.equal(end.diaphragmY,rest.diaphragmY);assert.deepEqual(breathAt(-1),rest);assert.deepEqual(breathAt(2),end);});
test('elbow muscle roles change with the named action while forearm length stays constant',()=>{const start=muscleAt(0),bend=muscleAt(.49),extend=muscleAt(.75);assert.equal(start.agonist,'Biceps');assert.equal(extend.agonist,'Triceps');for(const p of [start,bend,extend,muscleAt(1)])assert.ok(Math.abs(Math.hypot(p.wrist[0]-250,p.wrist[1]-240)-120)<1e-8);assert.ok(bend.wrist[1]<start.wrist[1]);});

import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {poseCameos,cameoFor} from '../src/features/body/pose-cameos.js';
const poses=JSON.parse(readFileSync(new URL('../src/content/poses.json',import.meta.url)));

test('every pose has exactly one cameo, and no cameo points at a missing pose',()=>{
 const ids=poses.map(p=>p.id).sort();
 assert.deepEqual(Object.keys(poseCameos).sort(),ids);
 for(const id of ids)assert.equal(cameoFor(id),poseCameos[id]);
 assert.equal(cameoFor('not-a-pose'),null);
});

test('cameo lines stay short and keep away from bodies, ability, scores and beliefs',()=>{
 // Agreed humor boundary (AGENTS.md, 2026-10-09): low-stakes wordplay only.
 const banned=/\b(score|fail|wrong|mistake|fat|thin|weight|flexib|stiff|lazy|clumsy|beginner|old|body|bodies|god|pray|holy|spiritual)/i;
 for(const [id,c] of Object.entries(poseCameos)){
  assert.ok(c.line.trim().length>0&&c.line.length<=34,`${id} line length`);
  assert.doesNotMatch(c.line,banned,`${id} line wording`);
 }
});

test('2D cameos are placed inside the 500 × 460 drawing; Warrior II uses the stage overlay',()=>{
 for(const [id,c] of Object.entries(poseCameos)){
  if(id==='warrior-ii'){assert.equal(c.overlay,true);continue;}
  const [x,y]=c.at;
  assert.ok(x>=20&&x<=480&&y>=20&&y<=440,`${id} position ${c.at}`);
 }
});
import id from '../src/i18n/id.js';
test('every pose has an Indonesian cameo line, short and free of body, ability and score jokes',()=>{
 const banned=/\b(gemuk|kurus|kaku|malas|lemah|gagal|salah|skor|nilai|tubuh|badan|berat|pemula|tuhan|doa|suci)/i;
 for(const poseId of Object.keys(poseCameos)){
  const line=id[`cameo.${poseId}`];
  assert.ok(line&&line.length<=40,`${poseId} needs a short Indonesian line`);
  assert.doesNotMatch(line,banned,`${poseId} Indonesian wording`);
 }
});

import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {poseSketchAt} from '../src/features/body/pose-sketch-motion.js';
import {validateContent} from '../src/domain/content.js';
const read=name=>JSON.parse(readFileSync(new URL(`../src/content/${name}.json`,import.meta.url)));
const content=Object.fromEntries(['modules','topics','sources','lessons','poses','questions','regions'].map(name=>[name,read(name)]));

test('the visual library has 32 independently sourced and illustrated study samples',()=>{
 const ids=new Set(content.poses.map(p=>p.id));
 for(const id of ['easy-pose','savasana','warrior-i','triangle','low-lunge','cobra','childs-pose','standing-forward-bend','extended-side-angle','warrior-iii','eagle','plank','upward-facing-dog','cat','cow','bound-angle','seated-forward-bend','bridge','supine-twist','camel','fish','locust','boat','happy-baby','dolphin','pigeon','crow'])assert.ok(ids.has(id),id);
 assert.equal(content.poses.length,32);
 for(const pose of content.poses){
  assert.match(pose.summary ?? '',/^.{120,360}\.$/,`${pose.id} needs a short explanation`);
  assert.ok((pose.summary.match(/\. /g)??[]).length>=1,`${pose.id} needs more than one sentence`);
 }
 for(const component of ['PoseStudy.jsx','PoseDetail.jsx']){
  const markup=readFileSync(new URL(`../src/features/body/${component}`,import.meta.url),'utf8');
  assert.doesNotMatch(markup,/teacher review pending|Educator review pending/i,`${component} should not show a pending-review label`);
 }
 const assets=JSON.parse(readFileSync(new URL('../content-review/asset-register.json',import.meta.url)));
 assert.deepEqual(validateContent(content),[]);
 for(const pose of content.poses.filter(p=>p.id!=='warrior-ii')){
  assert.ok(poseSketchAt(pose.id,1),`${pose.id} needs artwork`);
  assert.ok(assets.some(asset=>asset.id===pose.illustrationAssetId&&asset.review.status==='unreviewed'),`${pose.id} needs registered draft artwork`);
  assert.ok(pose.sourceIds.length,`${pose.id} needs a reference`);
  assert.equal(pose.observations.length,3,`${pose.id} needs three body-region observations`);
  assert.equal(pose.review.status,'unreviewed');
 }
});

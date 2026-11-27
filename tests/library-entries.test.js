import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {poseEntries,anatomyEntries,poseCategories,filterEntries} from '../src/features/body/library-entries.js';
const read=name=>JSON.parse(readFileSync(new URL(`../src/content/${name}.json`,import.meta.url)));
const bundle={poses:read('poses'),regions:read('regions'),lessons:read('lessons'),modules:read('modules')};

test('the poses page lists every pose and nothing else',()=>{
 const entries=poseEntries(bundle);
 assert.deepEqual(entries.map(e=>e.id),bundle.poses.map(p=>p.id));
 for(const e of entries){assert.equal(e.kind,'pose');assert.match(e.href,/^\/poses\/[a-z-]+$/);}
});

test('the anatomy page lists the eight body topics, no poses and no tradition page',()=>{
 const ids=anatomyEntries(bundle).map(e=>e.id);
 assert.deepEqual(ids,['shoulder','hip','knee','nervous','breathing','muscles','connective-basics','skeleton-basics']);
 const poseIds=new Set(bundle.poses.map(p=>p.id));
 assert.ok(ids.every(id=>!poseIds.has(id)));
 assert.ok(!ids.includes('tradition'));
});

test('every pose belongs to a shape family, so no chip hides a pose',()=>{
 const families=poseCategories(bundle);
 assert.ok(!families.includes(undefined));
 for(const pose of bundle.poses)assert.ok(families.includes(pose.category),`${pose.id} has no family`);
 assert.ok(filterEntries(poseEntries(bundle),{category:'Standing'}).some(e=>e.id==='warrior-ii'));
});

test('search ignores case and stray spaces and matches Sanskrit names and aliases',()=>{
 const poses=poseEntries(bundle);
 assert.deepEqual(filterEntries(poses,{query:' BAKASANA '}).map(e=>e.id),['crow']);
 assert.ok(filterEntries(poses,{query:'vrksasana'}).some(e=>e.id==='tree'));
 assert.ok(filterEntries(anatomyEntries(bundle),{query:'Nervous System'}).some(e=>e.id==='nervous'));
});

test('search accepts everyday spellings: no hyphens, curly or missing apostrophes, extra spaces, word order gaps',()=>{
 const poses=poseEntries(bundle),ids=query=>filterEntries(poses,{query}).map(e=>e.id);
 assert.ok(ids('downward facing dog').includes('downward-dog'));
 assert.ok(ids('downward  dog').includes('downward-dog'));
 assert.ok(ids('child’s pose').includes('childs-pose'));
 assert.ok(ids('childs pose').includes('childs-pose'));
 assert.ok(ids('one legged pigeon').includes('pigeon'));
 assert.ok(filterEntries(anatomyEntries(bundle),{query:'shoulder joint'}).some(e=>e.id==='shoulder'));
});

test('a family chip plus a search with no overlap returns nothing',()=>{
 assert.deepEqual(filterEntries(poseEntries(bundle),{category:'Balance',query:'cobra'}),[]);
 assert.equal(filterEntries(poseEntries(bundle)).length,bundle.poses.length);
});
import id from '../src/i18n/id.js';
test('Indonesian anatomy search finds the skeleton and connective-tissue cards by their Indonesian names too',()=>{
 const labels={region:id['anatomyList.sub.region'],system:id['anatomyList.sub.system'],'connective-basics':{title:id['anatomyList.connective.title'],sub:id['anatomyList.connective.sub']},'skeleton-basics':{title:id['anatomyList.skeleton.title'],sub:id['anatomyList.skeleton.sub']}};
 const entries=anatomyEntries(bundle,labels);
 for(const [query,card] of [['kerangka','skeleton-basics'],['jaringan ikat','connective-basics'],['tulang rawan','connective-basics'],['skeleton','skeleton-basics'],['ligament','connective-basics']])
  assert.ok(filterEntries(entries,{query}).some(e=>e.id===card),`"${query}" should find ${card}`);
});

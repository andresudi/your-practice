import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {localizeContent,overlayProblems} from '../src/i18n/localize-content.js';
import {anatomyChecks,localizeChecks,checkFeedback} from '../src/features/body/anatomy-checks.js';
const read=p=>JSON.parse(readFileSync(new URL(`../src/content/${p}.json`,import.meta.url)));
const bundle={poses:read('poses'),regions:read('regions'),modules:read('modules'),lessons:read('lessons')};
const overlays={poses:read('id/poses'),regions:read('id/regions'),modules:read('id/modules')};

test('missing overlay fields fall back to English, arrays merge item by item, flags say what is translated',()=>{
 const base={poses:[{id:'tree',summary:'EN summary',observations:[{title:'A',text:'a'},{title:'B',text:'b'}]},{id:'cat',summary:'Cat'}]};
 const out=localizeContent(base,{poses:{tree:{summary:'Ringkasan',observations:[{title:'A-id'}]}}});
 assert.equal(out.poses[0].summary,'Ringkasan');
 assert.deepEqual(out.poses[0].observations,[{title:'A-id',text:'a'},{title:'B',text:'b'}]);
 assert.equal(out.poses[0].translated,true);
 assert.equal(out.poses[1].summary,'Cat');
 assert.equal(out.poses[1].translated,false);
 assert.equal(base.poses[0].summary,'EN summary','English bundle is not mutated');
});
test('real overlay files only use ids and fields that exist, and translated region titles stay searchable in English',()=>{
 assert.deepEqual(overlayProblems(bundle,overlays),[]);
 for(const [id,o] of Object.entries(overlays.regions)){
  if(!o.title)continue;
  const english=bundle.regions.find(r=>r.id===id).title.toLowerCase();
  assert.ok((o.searchTerms??'').toLowerCase().includes(english.replace(/^the /,'')),`${id} searchTerms must include "${english}"`);
 }
});
test('Indonesian anatomy checks keep the answer position and still grade within their own language',()=>{
 const localized=localizeChecks(anatomyChecks,read('id/anatomy-checks'));
 for(const [id,check] of Object.entries(localized)){
  const english=anatomyChecks[id];
  assert.equal(check.options.length,english.options.length,id);
  assert.equal(check.options.indexOf(check.correct),english.options.indexOf(english.correct),id);
  assert.equal(checkFeedback(check,check.correct).correct,true,id);
 }
});

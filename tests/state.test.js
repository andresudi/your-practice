import test from 'node:test';import assert from 'node:assert/strict';import {loadState,saveState,exportState,parseImport,emptyState} from '../src/domain/state.js';
const note={id:'n',text:'Namasté 🌿 <script>alert(1)</script>',type:'note',contentRef:'missing-lesson',createdAt:'2026-09-30T00:00:00Z',updatedAt:'2026-09-30T00:00:00Z',answered:false};
test('Unicode and literal HTML round trip with orphaned references preserved',()=>{const s={...emptyState(),notes:[note]};assert.deepEqual(parseImport(exportState(s)),{ok:true,value:s});});
test('malformed saved JSON is not overwritten and remains recoverable',()=>{let writes=0;const r=loadState({getItem:()=>'{broken',setItem:()=>writes++});assert.equal(r.ok,false);assert.equal(r.raw,'{broken');assert.equal(writes,0);});
test('unavailable and quota full storage never reports saved',()=>{assert.equal(loadState({getItem:()=>{throw Error('denied')}}).ok,false);assert.equal(saveState({setItem:()=>{throw Error('full')}},emptyState()).ok,false);});
test('future schema and malformed fields are rejected',()=>{for(const obj of [{...emptyState(),schemaVersion:2},{...emptyState(),notes:[{...note,text:123}]},{...emptyState(),lessonStatuses:{a:'passed'}},{...emptyState(),sequences:[{id:'x',steps:'no'}]},{...emptyState(),attempts:[{id:'x',correct:-1}]}])assert.equal(parseImport(JSON.stringify(obj)).ok,false);assert.equal(parseImport('{invalid').ok,false);});
test('notes and backup have size limits',()=>{assert.equal(parseImport(JSON.stringify({...emptyState(),notes:[{...note,text:'x'.repeat(20001)}]})).ok,false);assert.equal(parseImport(' '.repeat(5*1024*1024+1)).ok,false);});
test('repeated review statuses stay one entry across storage round trip',()=>{const s=emptyState();s.lessonStatuses.a='reviewed';s.lessonStatuses.a='reviewed';let raw;assert.equal(saveState({setItem:(k,v)=>raw=v},s).ok,true);assert.deepEqual(loadState({getItem:()=>raw}).value.lessonStatuses,{a:'reviewed'});});
test('an unsupported backup says progress is unchanged, not notes (Notes was removed)',()=>{
 // QA G5.
 const r=parseImport(JSON.stringify({hello:'world'}));
 assert.equal(r.ok,false);
 assert.match(r.reason,/progress is unchanged/);
 assert.doesNotMatch(r.reason,/notes/i);
});

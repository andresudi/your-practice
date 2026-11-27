import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {messageKeys} from '../src/i18n/messages.js';
import en from '../src/i18n/en.js';
import id from '../src/i18n/id.js';
const literals=file=>[...readFileSync(new URL(`../src/${file}`,import.meta.url),'utf8').matchAll(/'([A-Z][a-z][^'\n]* [^'\n]{5,})'/g)].map(m=>m[1]);
test('every saved-progress and backup message the learner can see has an Indonesian version',()=>{
 const messages=[...literals('domain/state.js'),...literals('App.jsx'),...literals('app/ProgressBackup.jsx')];
 assert.ok(messages.length>=5);
 for(const message of messages){
  const key=messageKeys[message];
  assert.ok(key,`no key for: ${message}`);
  assert.equal(en[key],message);
  assert.ok(id[key],`no Indonesian for ${key}`);
 }
});
import {saveState,emptyState} from '../src/domain/state.js';
import {translateMessage} from '../src/i18n/messages.js';
test('a save that fails (storage full or blocked) is explained in Indonesian, not English',()=>{
 for(const name of ['QuotaExceededError','SecurityError']){
  const storage={getItem:()=>null,setItem(){const error=new Error('blocked');error.name=name;throw error;}};
  const result=saveState(storage,emptyState());
  assert.equal(result.ok,false);
  const text=translateMessage(result.reason,key=>id[key]);
  assert.ok(text&&text!==result.reason,`${name}: still English: ${result.reason}`);
  assert.doesNotMatch(text,/Could not save|Storage is full/);
 }
});

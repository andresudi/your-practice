import test from 'node:test';
import assert from 'node:assert/strict';
import en from '../src/i18n/en.js';
import id from '../src/i18n/id.js';
import {createTranslator,placeholders} from '../src/i18n/translate.js';

test('both word lists have exactly the same keys, none empty, same {placeholders}',()=>{
 assert.deepEqual(Object.keys(id).sort(),Object.keys(en).sort());
 for(const key of Object.keys(en)){
  assert.ok(en[key].trim()&&id[key].trim(),`${key} is empty`);
  assert.deepEqual(placeholders(id[key]),placeholders(en[key]),`${key} placeholders differ`);
 }
});
test('Indonesian text addresses the learner as kamu, never Anda',()=>{
 for(const [key,text] of Object.entries(id))assert.doesNotMatch(text,/\bAnda\b/,key);
});
test('the translator fills placeholders and falls back to English, then to the key',()=>{
 const t=createTranslator({en:{a:'Hi {name}',b:'Only English'},id:{a:'Hai {name}'}});
 assert.equal(t('id','a',{name:'Sari'}),'Hai Sari');
 assert.equal(t('id','b'),'Only English');
 assert.equal(t('id','missing'),'missing');
 assert.equal(t('en','a',{}),'Hi {name}');
});

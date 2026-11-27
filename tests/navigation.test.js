import test from 'node:test';
import assert from 'node:assert/strict';
import {resolveRoute} from '../src/app/routes.js';
import {fixture} from './fixtures/content.js';
test('unknown content IDs and malformed URLs have a missing content view',()=>{for(const url of ['/learn/missing','/poses/missing','/anatomy/no','/study/no','/%zz'])assert.equal(resolveRoute(url,fixture()).page,'not-found');});
test('query and fragment never change route identity',()=>assert.deepEqual(resolveRoute('/study?from=home#modules',fixture()),resolveRoute('/study',fixture())));
test('content deep links resolve slug to canonical ID',()=>assert.deepEqual(resolveRoute('/learn/joint',fixture()),{page:'lesson',params:{lessonId:'l'}}));
test('anatomy has its own collection page while old detail links keep working',()=>{
 for(const url of ['/anatomy','/anatomy/','/anatomy?from=home'])assert.deepEqual(resolveRoute(url,fixture()),{page:'anatomy-index',params:{}});
 const bundle={...fixture(),regions:[{id:'shoulder',slug:'shoulder'}]};
 assert.deepEqual(resolveRoute('/anatomy/shoulder',bundle),{page:'anatomy',params:{regionId:'shoulder'}});
});

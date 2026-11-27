import test from 'node:test';
import assert from 'node:assert/strict';
import {splitLanguage,localizeHref,switchLanguageHref} from '../src/i18n/paths.js';
import {resolveLocalizedRoute} from '../src/app/routes.js';
import {fixture} from './fixtures/content.js';

test('only a leading /id segment selects Indonesian',()=>{
 assert.deepEqual(splitLanguage('/id'),{lang:'id',path:'/'});
 assert.deepEqual(splitLanguage('/id/'),{lang:'id',path:'/'});
 assert.deepEqual(splitLanguage('/id/poses/tree'),{lang:'id',path:'/poses/tree'});
 assert.deepEqual(splitLanguage('/idx'),{lang:'en',path:'/idx'});
 assert.deepEqual(splitLanguage('/poses/id'),{lang:'en',path:'/poses/id'});
 assert.deepEqual(splitLanguage('/'),{lang:'en',path:'/'});
});
test('links stay in the current language and never double the prefix',()=>{
 assert.equal(localizeHref('/poses/tree','id'),'/id/poses/tree');
 assert.equal(localizeHref('/','id'),'/id');
 assert.equal(localizeHref('/?x=1','id'),'/id?x=1');
 assert.equal(localizeHref('/review?lesson=a&from=tree','id'),'/id/review?lesson=a&from=tree');
 assert.equal(localizeHref('/id/poses','id'),'/id/poses');
 assert.equal(localizeHref('/poses/tree','en'),'/poses/tree');
 for(const href of ['https://openstax.org/x','//cdn.example/x','#main','mailto:a@b.c'])assert.equal(localizeHref(href,'id'),href);
});
test('the switch opens the same page in the other language, keeping query and hash',()=>{
 assert.equal(switchLanguageHref({pathname:'/review',search:'?lesson=a&from=tree',hash:'#q'},'id'),'/id/review?lesson=a&from=tree#q');
 assert.equal(switchLanguageHref({pathname:'/id/review',search:'?lesson=a&from=tree',hash:'#q'},'en'),'/review?lesson=a&from=tree#q');
 assert.equal(switchLanguageHref({pathname:'/',search:'',hash:''},'id'),'/id');
 assert.equal(switchLanguageHref({pathname:'/id',search:'',hash:''},'en'),'/');
});
test('localized routes resolve like English ones and report the language',()=>{
 const bundle={...fixture(),regions:[{id:'shoulder',slug:'shoulder'}]};
 assert.deepEqual(resolveLocalizedRoute('/id/anatomy/shoulder',bundle),{page:'anatomy',params:{regionId:'shoulder'},lang:'id'});
 assert.deepEqual(resolveLocalizedRoute('/anatomy/shoulder',bundle),{page:'anatomy',params:{regionId:'shoulder'},lang:'en'});
 assert.deepEqual(resolveLocalizedRoute('/id',bundle),{page:'home',params:{},lang:'id'});
 assert.equal(resolveLocalizedRoute('/id/nope',bundle).page,'not-found');
 assert.equal(resolveLocalizedRoute('/id/nope',bundle).lang,'id');
 assert.equal(resolveLocalizedRoute('/id/learn/joint?from=x',fixture()).params.lessonId,'l');
});
import {languageOptions} from '../src/i18n/paths.js';
test('the header toggle shows both languages and marks the one you are reading',()=>{
 assert.deepEqual(languageOptions({pathname:'/id/poses/tree',search:'?x=1',hash:'#y'},'id'),[
  {lang:'en',label:'EN',name:'English',href:'/poses/tree?x=1#y',current:false},
  {lang:'id',label:'ID',name:'Bahasa Indonesia',href:'/id/poses/tree?x=1#y',current:true},
 ]);
 assert.deepEqual(languageOptions({pathname:'/',search:'',hash:''},'en').map(o=>[o.label,o.href,o.current]),[['EN','/',true],['ID','/id',false]]);
});

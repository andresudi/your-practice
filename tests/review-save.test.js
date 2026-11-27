import test from 'node:test';
import assert from 'node:assert/strict';
import {reviewSaveMessage} from '../src/domain/review.js';
test('failed persistence never describes reflections as saved',()=>{const text=reviewSaveMessage({ok:false,reason:'Storage is full.'},2);assert.ok(!text.includes('saved with your lesson'));assert.match(text,/open tab/);assert.match(text,/Storage is full/);});
test('only confirmed persistence reports a saved reflection',()=>{assert.match(reviewSaveMessage({ok:true},1),/1 reflection saved with your lesson/);assert.match(reviewSaveMessage({ok:true},0),/Review saved/);assert.match(reviewSaveMessage(null,1),/open tab/);});
test('the save message can be shown in Indonesian through a translator',()=>{
 const t=(key,v)=>({'review.saved':'Latihan tersimpan di browser ini.','review.reflections':'{count} refleksi tersimpan bersama pelajaranmu.'})[key].replace('{count}',v?.count);
 assert.equal(reviewSaveMessage({ok:true},0,t),'Latihan tersimpan di browser ini.');
 assert.equal(reviewSaveMessage({ok:true},2,t),'2 refleksi tersimpan bersama pelajaranmu.');
 assert.match(reviewSaveMessage({ok:true},1),/1 reflection saved/);
});
test('a failed save explained in Indonesian keeps the reason and never says saved',()=>{
 const dict={'review.notSaved':'Pekerjaanmu tetap ada di tab ini. {reason} Simpan cadangan lewat “Progres yang tersimpan”.','review.notSavedReason':'Browser ini tidak bisa menyimpannya.'};
 const t=(key,v)=>dict[key].replace('{reason}',v?.reason);
 assert.equal(reviewSaveMessage({ok:false,reason:'Penyimpanan penuh.'},2,t),'Pekerjaanmu tetap ada di tab ini. Penyimpanan penuh. Simpan cadangan lewat “Progres yang tersimpan”.');
 assert.match(reviewSaveMessage(null,1,t),/Browser ini tidak bisa menyimpannya/);
});

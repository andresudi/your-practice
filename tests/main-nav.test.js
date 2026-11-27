import test from 'node:test';
import assert from 'node:assert/strict';
import {mainNav,activeSection} from '../src/app/main-nav.js';

test('the header offers Study path, Poses and Anatomy, in that order',()=>{
 assert.deepEqual(mainNav.map(item=>[item.label,item.href]),[['Study path','/study'],['Poses','/poses'],['Anatomy','/anatomy']]);
});
test('each page highlights at most one section, and Home highlights none',()=>{
 assert.equal(activeSection('lesson'),'study');
 assert.equal(activeSection('pose'),'poses');
 assert.equal(activeSection('anatomy'),'anatomy');
 assert.equal(activeSection('anatomy-index'),'anatomy');
 assert.equal(activeSection('home'),null);
 assert.equal(activeSection('not-found'),null);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import {upsertNote} from '../src/domain/notes.js';
test('saving a stale edit after restore retains the draft alongside restored notes',()=>{const restored=[{id:'restored',text:'Restored note'}],draft={id:'old-edit',text:'Do not lose this text'};assert.deepEqual(upsertNote(restored,draft),[draft,...restored]);assert.equal(restored.length,1);});
test('editing an existing note replaces only that note without duplication',()=>{const notes=[{id:'a',text:'A'},{id:'b',text:'B'}],edit={id:'b',text:'Edited'};assert.deepEqual(upsertNote(notes,edit),[notes[0],edit]);});

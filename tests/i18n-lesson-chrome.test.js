import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,readdirSync} from 'node:fs';
const dir=new URL('../src/features/study/',import.meta.url);
const lessons=readdirSync(dir).filter(file=>file.endsWith('Lesson.jsx'));
// Buttons, links, pills and eyebrows around a lesson are interface text; only the lesson body waits for Phase 2.
const chrome=["'Play'","'Pause'","'Replay'",'>Quick recall <','>Try a quick recall <','>Open rehearsal <','>Quick reflection <','>Open your rehearsal <','>Put the idea into practice.<',"'Next thought'","'Start again'",'>Sample · review pending<',"'YOGA TRADITIONS'","'LEARN THROUGH REFLECTION'",'>My review status<','>Details & progress<'];
test('lesson buttons, recall links and labels come from the word lists, so they follow the language',()=>{
 assert.ok(lessons.length>=12);
 const found=[];
 for(const file of lessons){const source=readFileSync(new URL(file,dir),'utf8');for(const text of chrome)if(source.includes(text))found.push(`${file}: ${text}`);}
 assert.deepEqual(found,[]);
});

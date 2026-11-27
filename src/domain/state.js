export const STORAGE_KEY='your-practice:v1';
export const emptyState=()=>({schemaVersion:1,lastLessonId:null,lessonStatuses:{},attempts:[],notes:[],sequences:[]});
const object=x=>x!==null&&typeof x==='object'&&!Array.isArray(x);
const string=x=>typeof x==='string';
const date=x=>string(x)&&Number.isFinite(Date.parse(x));
const unique=list=>new Set(list.map(x=>x.id)).size===list.length;
const safeKey=x=>!['__proto__','constructor','prototype'].includes(x);
function valid(s){
 if(!object(s)||s.schemaVersion!==1)throw Error('This backup uses an unsupported version. Your current progress is unchanged.');
 if(!(s.lastLessonId===null||string(s.lastLessonId))||!object(s.lessonStatuses)||!Object.entries(s.lessonStatuses).every(([k,v])=>safeKey(k)&&['not-started','reviewed','revisit'].includes(v)))throw Error('The backup contains invalid lesson progress.');
 if(!Array.isArray(s.notes)||!unique(s.notes)||!s.notes.every(n=>object(n)&&string(n.id)&&string(n.text)&&n.text.length<=20000&&['note','teacher-question','feedback','reflection'].includes(n.type)&&(n.contentRef==null||string(n.contentRef))&&typeof n.answered==='boolean'&&date(n.createdAt)&&date(n.updatedAt)))throw Error('Notes must contain valid text, dates, and types (maximum 20,000 characters each).');
 if(!Array.isArray(s.attempts)||!unique(s.attempts)||!s.attempts.every(a=>object(a)&&string(a.id)&&date(a.date)&&Array.isArray(a.questionIds)&&a.questionIds.every(string)&&['graded','correct','reflections'].every(k=>Number.isInteger(a[k])&&a[k]>=0)&&a.correct<=a.graded&&a.graded+a.reflections===a.questionIds.length))throw Error('The backup contains invalid review attempts.');
 if(!Array.isArray(s.sequences)||!unique(s.sequences)||!s.sequences.every(q=>object(q)&&string(q.id)&&string(q.title)&&Array.isArray(q.steps)&&unique(q.steps)&&q.steps.every(t=>object(t)&&string(t.id)&&string(t.poseId)&&string(t.cue)&&t.cue.length<=20000&&Number.isFinite(t.seconds)&&t.seconds>=0&&t.seconds<=86400)))throw Error('The backup contains an invalid rehearsal sequence.');
 return s;
}
export function parseImport(text){try{if(!string(text)||new TextEncoder().encode(text).length>5*1024*1024)throw Error('Backups must be smaller than 5 MiB.');return {ok:true,value:valid(JSON.parse(text))};}catch(e){return {ok:false,reason:e instanceof SyntaxError?'This file is not a valid JSON backup.':e.message};}}
export function exportState(state){valid(state);return JSON.stringify(state,null,2);}
export function loadState(storage){let raw;try{raw=storage.getItem(STORAGE_KEY);if(raw===null)return {ok:true,value:emptyState()};const r=parseImport(raw);return r.ok?r:{...r,raw};}catch{return {ok:false,reason:'Browser storage is unavailable. Keep a downloaded backup of your work.',...(raw===undefined?{}:{raw})};}}
export function saveState(storage,state){try{const text=exportState(state);const checked=parseImport(text);if(!checked.ok)return checked;storage.setItem(STORAGE_KEY,text);return {ok:true,value:state};}catch(e){return {ok:false,reason:`Could not save in this browser. Your changes are kept in this open tab; download a backup. ${e.name==='QuotaExceededError'?'Storage is full.':''}`};}}

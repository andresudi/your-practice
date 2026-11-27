// Writes docs/i18n/review-phase-1.md: every English → Indonesian text of Phase 1, side by side,
// for a human review on a phone. Run: node scripts/i18n-review-sheet.mjs
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import en from '../src/i18n/en.js';
import id from '../src/i18n/id.js';
import {anatomyChecks} from '../src/features/body/anatomy-checks.js';

const json=path=>JSON.parse(readFileSync(new URL(`../src/content/${path}`,import.meta.url)));
const byId=list=>Object.fromEntries(list.map(item=>[item.id,item]));
const base={poses:byId(json('poses.json')),regions:byId(json('regions.json')),modules:byId(json('modules.json')),anatomyChecks};
const overlays={poses:json('id/poses.json'),regions:json('id/regions.json'),modules:json('id/modules.json'),anatomyChecks:json('id/anatomy-checks.json')};

const clean=value=>value===undefined||value===null||value===''?'—':String(value).replace(/\s*\n\s*/g,' ⏎ ');
const item=(key,english,indonesian)=>`**${key}**\n- EN: ${clean(english)}\n- ID: ${clean(indonesian)}\n`;
const used=new Set();
let items=0;
function keys(prefixes){
 const out=[];
 for(const key of Object.keys(en)){
  if(used.has(key)||!prefixes.includes(key.split('.')[0]))continue;
  used.add(key);items++;out.push(item(key,en[key],id[key]));
 }
 return out;
}
// Every translated string inside an overlay value, with its path; arrays and nested objects walked.
function* leaves(value,path,english){
 if(Array.isArray(value))for(let i=0;i<value.length;i++)yield* leaves(value[i],`${path}[${i}]`,english?.[i]);
 else if(value&&typeof value==='object')for(const [key,inner] of Object.entries(value))yield* leaves(inner,`${path}.${key}`,english?.[key]);
 else yield [path,english,value];
}
// One overlay item: one line per translated string.
function overlayItem(collection,itemId){
 const out=[],english=base[collection][itemId]??{},translated=overlays[collection][itemId]??{};
 for(const [field,value] of Object.entries(translated)){
  const note=field==='searchTerms'?'(kata kunci pencarian, tidak tampil di layar)':english[field];
  for(const [label,englishText,text] of leaves(value,`${collection}.${itemId}.${field}`,note)){items++;out.push(item(label,englishText,text));}
 }
 return out;
}
const overlayFields=Object.values(overlays).reduce((sum,collection)=>sum+Object.entries(collection).reduce((n,[itemId,fields])=>n+[...leaves(fields,itemId)].length,0),0);

const sections=[];
const section=(title,...parts)=>sections.push(`## ${title}\n\n${parts.flat(Infinity).join('\n')}`);
section('Navigasi & umum',keys(['nav','lang','site','notFound','shell','footer','app','common','card','scene','check']));
section('Beranda',keys(['home']));
section('Pose',
 '### Halaman daftar pose\n',keys(['poses']),
 ...Object.keys(base.poses).map(poseId=>[`### ${base.poses[poseId].englishName} · ${base.poses[poseId].sanskritName}\n`,overlayItem('poses',poseId),(()=>{const key=`cameo.${poseId}`;used.add(key);items++;return item(key,en[key],id[key]);})()]),
 '### Halaman pose & studio\n',keys(['cameo','pose','studio','poseArt']));
section('Anatomi',
 '### Halaman daftar anatomi\n',keys(['anatomyList']),
 ...Object.keys(overlays.regions).map(regionId=>[`### ${base.regions[regionId]?.title??regionId}\n`,overlayItem('regions',regionId)]),
 '### Cek kecil di tiap halaman anatomi\n',...Object.keys(overlays.anatomyChecks).map(checkId=>overlayItem('anatomyChecks',checkId)),
 '### Penjelajah, lab & tradisi\n',keys(['anatomy','tradition','lab','phys']));
section('Jalur belajar, pelajaran & kuis',
 '### Nama bidang materi\n',...Object.keys(overlays.modules).map(moduleId=>overlayItem('modules',moduleId)),
 '### Tampilan\n',keys(['study','module','lesson','sources','review']));
section('Latihan mengajar',keys(['rehearsal']));
section('Progres & cadangan',keys(['backup','msg']));
// Anything not placed above still gets reviewed.
const rest=Object.keys(en).filter(key=>!used.has(key));
if(rest.length)section('Lain-lain',keys([...new Set(rest.map(key=>key.split('.')[0]))]));

const expected=Object.keys(en).length+overlayFields;
if(items!==expected){console.error(`item count ${items} ≠ ${expected} (keys ${Object.keys(en).length} + overlay fields ${overlayFields})`);process.exit(1);}
const intro=`# Cek terjemahan Indonesia · Fase 1

Ini semua teks Fase 1, Inggris (EN) dan Indonesia (ID) berdampingan. Total **${items}** baris: ${Object.keys(en).length} teks tampilan + ${overlayFields} teks konten (pose, anatomi, nama bidang).

Cara kasih koreksi: kirim **nama kunci** (yang tebal) + teks barunya. Contoh: \`nav.study\` → "Jalur Belajar".

Aturan gaya: pakai "kamu" (bukan "Anda"); istilah ditulis "abduksi (abduction)"; nama pose tetap Inggris + Sanskerta. Teks dengan {kurung kurawal} adalah isian otomatis, biarkan apa adanya. "⏎" artinya ganti baris.

Belum diterjemahkan (Fase 2): isi pelajaran, soal kuis, catatan sumber, daftar cek materi.
`;
mkdirSync(new URL('../docs/i18n/',import.meta.url),{recursive:true});
writeFileSync(new URL('../docs/i18n/review-phase-1.md',import.meta.url),`${intro}\n${sections.join('\n')}`);
console.log(`docs/i18n/review-phase-1.md: ${items} items (keys ${Object.keys(en).length} + overlay fields ${overlayFields})`);

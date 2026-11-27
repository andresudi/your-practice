// Card data for the Poses and Anatomy collection pages, also used for Home's counts.
// Pure functions over a content bundle so tests can pass the JSON directly.
const anatomyLessons={
 'connective-basics':{title:'Connective tissues',sub:'Tendon · ligament · cartilage',terms:'connective tissue tendon ligament cartilage joint'},
 'skeleton-basics':{title:'The skeleton',sub:'Axial · appendicular',terms:'skeleton bones axial appendicular skull ribs spine hip girdle clavicle scapula sacrum'},
};
const regionTerms={shoulder:' joint',hip:' joint',knee:' joint',nervous:' CNS PNS brain spinal cord neurons',breathing:' diaphragm respiratory lungs',muscles:' biceps triceps agonist antagonist'};
// Same rule for query and terms: no accents or apostrophes (straight or curly), other punctuation as spaces.
const normalize=text=>text.normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase().replace(/['’]/g,'').replace(/[^a-z0-9]+/g,' ').trim();

export function poseEntries(bundle){
 return bundle.poses.map(p=>({id:p.id,title:p.englishName,sub:p.sanskritName,terms:[p.englishName,p.sanskritName,...p.aliases,p.searchTerms??''].join(' '),kind:'pose',category:p.category,href:`/poses/${p.slug}`}));
}
export const englishAnatomyLabels={region:'Explore movement',system:'Follow the connections','connective-basics':{title:'Connective tissues',sub:'Tendon · ligament · cartilage'},'skeleton-basics':{title:'The skeleton',sub:'Axial · appendicular'}};
export function anatomyEntries(bundle,labels=englishAnatomyLabels){
 return [
  ...bundle.regions.filter(r=>r.kind!=='tradition').map(r=>({id:r.id,title:r.title,sub:r.kind==='system'?labels.system:labels.region,terms:r.title+(regionTerms[r.id]??'')+(r.searchTerms?' '+r.searchTerms:''),kind:'anatomy',href:`/anatomy/${r.slug}`})),
  // Terms keep the English words and add the shown (possibly Indonesian) title and subtitle.
  ...bundle.lessons.filter(l=>anatomyLessons[l.id]).map(l=>({id:l.id,...anatomyLessons[l.id],title:labels[l.id]?.title??anatomyLessons[l.id].title,sub:labels[l.id]?.sub??anatomyLessons[l.id].sub,terms:[anatomyLessons[l.id].terms,labels[l.id]?.title,labels[l.id]?.sub].filter(Boolean).join(' '),kind:'anatomy',href:`/learn/${l.slug}`})),
 ];
}
export function poseCategories(bundle){return [...new Set(bundle.poses.map(p=>p.category).filter(Boolean))];}
export function filterEntries(entries,{query='',category='all'}={}){
 // Every typed word must appear somewhere in the terms, so "one legged pigeon" finds "One-Legged King Pigeon".
 const words=normalize(query).split(' ').filter(Boolean);
 return entries.filter(e=>{const terms=normalize(e.terms);return (category==='all'||e.category===category)&&words.every(w=>terms.includes(w));});
}

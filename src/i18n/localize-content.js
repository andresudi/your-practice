// Overlays hold only translated fields, keyed by item id. Anything missing stays English.
const extraFields=new Set(['searchTerms']);
function mergeItem(base,overlay){
 if(!overlay)return base;
 const out={...base};
 for(const [key,value] of Object.entries(overlay)){
  out[key]=Array.isArray(value)&&Array.isArray(base[key])
   ?base[key].map((item,i)=>value[i]===undefined?item:typeof item==='object'?{...item,...value[i]}:value[i])
   :value;
 }
 return out;
}
export function localizeContent(bundle,overlays={}){
 const out={...bundle};
 for(const [name,items] of Object.entries(bundle)){
  if(!Array.isArray(items))continue;
  const overlay=overlays[name]??{};
  out[name]=items.map(item=>({...mergeItem(item,overlay[item.id]),translated:Boolean(overlay[item.id])}));
 }
 return out;
}
export function overlayProblems(bundle,overlays){
 const problems=[];
 for(const [name,overlay] of Object.entries(overlays)){
  const items=bundle[name];if(!items){problems.push(`unknown collection ${name}`);continue;}
  for(const [id,fields] of Object.entries(overlay)){
   const item=items.find(i=>i.id===id);if(!item){problems.push(`${name}.${id} does not exist`);continue;}
   for(const field of Object.keys(fields))if(!(field in item)&&!extraFields.has(field))problems.push(`${name}.${id}.${field} is not an English field`);
  }
 }
 return problems;
}

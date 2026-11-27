// Flat dictionaries {key: text}; {name} placeholders. Missing Indonesian falls back to English, then to the key.
export function createTranslator(dictionaries,fallback='en'){
 return (lang,key,values={})=>{
  const text=dictionaries[lang]?.[key]??dictionaries[fallback]?.[key];
  if(text===undefined)return key;
  return text.replace(/\{(\w+)\}/g,(match,name)=>name in values?String(values[name]):match);
 };
}
export const placeholders=text=>[...text.matchAll(/\{(\w+)\}/g)].map(m=>m[1]).sort();

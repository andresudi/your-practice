// Language lives in the URL: a leading /id segment is Indonesian, everything else English.
export function splitLanguage(pathname='/'){
 const match=/^\/id(?=\/|$)/.exec(pathname);
 if(!match)return {lang:'en',path:pathname||'/'};
 return {lang:'id',path:pathname.slice(3)||'/'};
}
// Keep internal links in the current language. External, protocol-relative, hash and mail links pass through.
export function localizeHref(href,lang){
 if(lang!=='id'||typeof href!=='string'||!href.startsWith('/')||href.startsWith('//'))return href;
 if(/^\/id(?=[/?#]|$)/.test(href))return href;
 const rest=href==='/'?'':href.startsWith('/?')||href.startsWith('/#')?href.slice(1):href;
 return '/id'+rest;
}
// The ID/EN switch: same page and query/hash, other language.
export function switchLanguageHref({pathname='/',search='',hash=''},to){
 const {path}=splitLanguage(pathname);
 return (to==='id'?localizeHref(path,'id'):path)+search+hash;
}
// Header toggle: both languages, each linking to this page in that language; `current` marks the one being read.
export function languageOptions(location,current){return [{lang:'en',label:'EN',name:'English'},{lang:'id',label:'ID',name:'Bahasa Indonesia'}].map(o=>({...o,href:switchLanguageHref(location,o.lang),current:o.lang===current}));}

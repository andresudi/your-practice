import {splitLanguage} from '../i18n/paths.js';
export function resolveRoute(url,bundle){
  let parts;try{parts=new URL(url,'https://local.invalid').pathname.split('/').filter(Boolean).map(decodeURIComponent);}catch{return {page:'not-found',params:{}};}
  const [base,slug,...rest]=parts;
  if(rest.length)return {page:'not-found',params:{}};
  const staticRoutes={'':'home',study:'study',poses:'poses',anatomy:'anatomy-index',teaching:'teaching',review:'review'};
  if(!slug&&staticRoutes[base||''])return {page:staticRoutes[base||''],params:{}};
  const lookup={study:['modules','module','moduleId'],learn:['lessons','lesson','lessonId'],poses:['poses','pose','poseId'],anatomy:['regions','anatomy','regionId']};
  if(lookup[base]){const [collection,page,key]=lookup[base];const item=bundle[collection].find(x=>x.slug===slug||x.id===slug);if(item)return {page,params:{[key]:item.id}};}
  return {page:'not-found',params:{}};
}
// resolveRoute stays English-only; this wrapper strips /id and reports the language.
export function resolveLocalizedRoute(url,bundle){
 let parsed;try{parsed=new URL(url,'https://local.invalid');}catch{return {page:'not-found',params:{},lang:'en'};}
 const {lang,path}=splitLanguage(parsed.pathname);
 return {...resolveRoute(path+parsed.search,bundle),lang};
}

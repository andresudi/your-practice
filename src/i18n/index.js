import en from './en.js';
import id from './id.js';
import {createTranslator} from './translate.js';
import {localizeContent} from './localize-content.js';
import {content as englishContent} from '../content/index.js';
import {idOverlays} from '../content/id/index.js';
// Live bindings: App calls setLanguage(route.lang) before rendering, so components always read the current language.
// Never read `content` or call `t` at module load time.
const translate=createTranslator({en,id});
const bundles={en:englishContent,id:localizeContent(englishContent,idOverlays)};
export let lang='en';
export let content=englishContent;
export function setLanguage(next){
 lang=next==='id'?'id':'en';
 content=bundles[lang];
 if(typeof document!=='undefined'){document.documentElement.lang=lang;document.title=translate(lang,'site.title');}
}
export const t=(key,values)=>translate(lang,key,values);

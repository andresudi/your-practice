// Home's three entry cards. Order, names and links come from the header (src/app/main-nav.js).
import {mainNav} from '../../app/main-nav.js';
import {anatomyEntries,poseEntries} from '../body/library-entries.js';
import en from '../../i18n/en.js';
import {createTranslator} from '../../i18n/translate.js';
const englishTranslate=(key,values)=>createTranslator({en})('en',key,values);

export function continueLesson(bundle,state){
 return bundle.lessons.find(l=>l.id===state?.lastLessonId&&l.publication==='published')??null;
}
export function homeDoors(bundle,translate=englishTranslate){
 const counts={modules:bundle.modules.length,lessons:bundle.lessons.filter(l=>l.publication==='published').length,poses:poseEntries(bundle).length,anatomy:anatomyEntries(bundle).length};
 return mainNav.map(item=>({id:item.id,label:translate(`nav.${item.id}`),href:item.href,tagline:translate(`home.door.${item.id}.tagline`),meta:translate(`home.door.${item.id}.meta`,counts),action:translate(`home.door.${item.id}.action`)}));
}

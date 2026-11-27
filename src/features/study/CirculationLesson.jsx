import {moduleTitle} from './module-title.js';
import {lang,t} from '../../i18n/index.js';
import {useState} from 'react';
import {ArrowLeft,ArrowRight,Play,Pause,ArrowCounterClockwise} from '@phosphor-icons/react';
import {Link} from '../../app/Link.jsx';
import {useStudyMotion} from '../body/AnatomyVisual.jsx';
import SourcePanel from './SourcePanel.jsx';
import '../body/body-learning.css';
import './yoga-styles.css';
import './blend-system.css';
import './circulation-lesson.css';

const paths={
 pulmonary:'M230 209 C125 207 125 74 260 74 C395 74 395 207 290 209',
 systemic:'M290 232 C395 230 395 356 260 356 C125 356 125 230 230 232'
};

export function CirculationArt({circuit='pulmonary',progress=1,decorative=false}){
 const pulmonary=circuit==='pulmonary';
 return <svg viewBox="0 0 520 430" className="circulation-art" role={decorative?undefined:'img'} aria-hidden={decorative||undefined} aria-label={pulmonary?'Simplified pulmonary loop: right heart to lungs, then to left heart.':'Simplified systemic loop: left heart to body, then to right heart.'}>
  <circle cx="260" cy="214" r="190" fill="#f7f3e8"/>
  <path d={paths.pulmonary} fill="none" stroke="#e6c8bd" strokeWidth="13" strokeLinecap="round"/>
  <path d={paths.systemic} fill="none" stroke="#cbd9c8" strokeWidth="13" strokeLinecap="round"/>
  <path d={paths[circuit]} pathLength="1" fill="none" stroke={pulmonary?'#b66f64':'#63836e'} strokeWidth="13" strokeLinecap="round" strokeDasharray={`${Math.max(.001,Math.min(1,progress))} 1`}/>
  <g className="circulation-node"><circle cx="260" cy="73" r="39" fill="#eee2d7"/><path d="M254 49 C235 36 222 65 229 82 Q235 96 253 91 L253 54 M266 49 C285 36 298 65 291 82 Q285 96 267 91 L267 54" fill="#d8b3a6"/></g>
  <g className="circulation-node"><circle cx="260" cy="355" r="39" fill="#e0e9dd"/><circle cx="260" cy="355" r="19" fill="#97ad98"/><path d="M241 355 H279 M260 336 V374" stroke="#f5f6ea" strokeWidth="3"/></g>
  <g className="circulation-node"><circle cx="260" cy="220" r="43" fill="#f7eee8" stroke="#d1b8ac" strokeWidth="2"/><path d="M260 245 C235 225 224 209 232 197 C240 184 254 193 260 202 C266 193 280 184 288 197 C296 209 285 225 260 245Z" fill="#bc8276"/><path d="M260 202 V243" stroke="#f5e4dc" strokeWidth="2"/></g>
  {!decorative&&<><text x="260" y="19" textAnchor="middle">LUNGS</text><text x="260" y="412" textAnchor="middle">BODY</text><text x="260" y="282" textAnchor="middle">HEART</text><text x="93" y="207" textAnchor="middle" className="circulation-side">RIGHT SIDE</text><text x="427" y="207" textAnchor="middle" className="circulation-side">LEFT SIDE</text></>}
 </svg>;
}

export default function CirculationLesson({lesson,state,update}){
 const [index,setIndex]=useState(0),motion=useStudyMotion(5);
 const section=lesson.sections[index],playback=motion.playing?'pause':motion.progress>=1?'replay':'play';
 function choose(i){setIndex(i);if(motion.reduced)motion.seek(1);else motion.restart();}
 return <div className="body-learning-page styles-lesson circulation-lesson blend-lesson">
  <Link className="back" href="/study/anatomy" lang={lang}><ArrowLeft/>{moduleTitle('anatomy')}</Link>
  <div className="learning-heading"><div><p className="eyebrow">ANATOMY · TWO CONNECTED LOOPS</p><h1>Follow the flow.</h1></div></div>
  <div className="style-choices" role="group" aria-label="Choose a circulation circuit">{lesson.sections.map((item,i)=><button key={item.id} aria-pressed={i===index} onClick={()=>choose(i)}>{item.heading}</button>)}</div>
  <section className={`circulation-stage circuit-${section.id}`}>
   <div className="circulation-picture"><CirculationArt circuit={section.id} progress={motion.progress}/><button className="style-play" lang={lang} onClick={motion.toggle}>{motion.playing?<Pause weight="fill"/>:motion.progress>=1?<ArrowCounterClockwise/>:<Play weight="fill"/>}{t(`lesson.flow.${playback}`)}</button></div>
   <div className="circulation-copy" aria-live="polite"><p className="eyebrow">0{index+1} / 02 · {section.heading.toUpperCase()} CIRCUIT</p><h2>{section.memory}</h2><p>{section.text}</p><span className="micro">A simplified route · not a heartbeat or breathing timer</span></div>
  </section>
  <div className="visual-lesson-actions"><Link className="button" href={`/review?lesson=${lesson.id}`} lang={lang}>{t('lesson.quickRecall')} <ArrowRight/></Link></div>
  <details className="learning-details"><summary lang={lang}>{t('lesson.details')}</summary><p>{section.detail}</p><p>Arteries carry blood away from the heart; veins return it. This picture omits valves, chambers and most vessels. It does not suggest a yoga practice or health effect.</p><p>This is a general anatomy introduction; your class may explore the system differently.</p><div className="visual-study-status"><label htmlFor="circulation-status" lang={lang}>{t('lesson.status')}</label><select lang={lang} id="circulation-status" value={state.lessonStatuses[lesson.id]||'not-started'} onChange={e=>update({...state,lastLessonId:lesson.id,lessonStatuses:{...state.lessonStatuses,[lesson.id]:e.target.value}})}><option value="not-started">{t('lesson.status.notStarted')}</option><option value="reviewed">{t('lesson.status.reviewed')}</option><option value="revisit">{t('lesson.status.revisit')}</option></select></div><SourcePanel sourceIds={lesson.sourceIds}/></details>
 </div>;
}

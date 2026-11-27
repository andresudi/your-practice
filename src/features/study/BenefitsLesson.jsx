import {moduleTitle} from './module-title.js';
import {lang,t} from '../../i18n/index.js';
import {useState} from 'react';
import {ArrowLeft,ArrowRight,Play,Pause,ArrowCounterClockwise} from '@phosphor-icons/react';
import {Link} from '../../app/Link.jsx';
import {useStudyMotion} from '../body/AnatomyVisual.jsx';
import SourcePanel from './SourcePanel.jsx';
import './blend-system.css';
import './benefits-lesson.css';

export function BenefitsArt({focus='evidence',progress=1}){
 const evidence=focus==='evidence';
 const color=evidence?'#aa86a7':'#748f79';
 const target=evidence?[158,202]:[362,202];
 const path=`M260 320 Q260 245 ${target[0]} ${target[1]}`;
 return <svg className="benefits-art" viewBox="0 0 520 410" role="img" aria-label={`Abstract memory diagram highlighting ${evidence?'research evidence':'individual context'}; it does not assess health or prescribe a pose`}>
  <ellipse cx="260" cy="212" rx="214" ry="174" fill="#f8f0e7"/>
  <ellipse cx="260" cy="376" rx="197" ry="13" fill="#4b6655" opacity=".11"/>
  <path d="M158 202 H362" stroke="#c9d1c6" strokeWidth="9" strokeLinecap="round"/>
  <path d={path} fill="none" stroke="#d9d6cd" strokeWidth="9" strokeLinecap="round"/>
  <path d={path} pathLength="1" fill="none" stroke={color} strokeWidth="9" strokeLinecap="round" strokeDasharray={`${Math.max(.001,progress)} 1`}/>
  <g opacity={evidence?1:.55}><circle cx="158" cy="202" r="65" fill="#e8ddeb"/><circle cx="158" cy="202" r="48" fill="#fffaf4" stroke="#aa86a7" strokeWidth="3"/><path d="M137 218v-25l12-8 13 8 14-8v25l-14 8-13-8z" fill="none" stroke="#aa86a7" strokeWidth="3" strokeLinejoin="round"/><path d="M149 185v25m13-17v25" stroke="#aa86a7" strokeWidth="3"/><text x="158" y="292" textAnchor="middle">POSSIBLE</text></g>
  <g opacity={evidence ? .55 : 1}><circle cx="362" cy="202" r="65" fill="#e0e9de"/><circle cx="362" cy="202" r="48" fill="#fffaf4" stroke="#748f79" strokeWidth="3"/><circle cx="362" cy="190" r="12" fill="#c89580"/><path d="M340 222q22-31 44 0" fill="#748f79"/><text x="362" y="292" textAnchor="middle">PERSON</text></g>
  <g><circle cx="260" cy="323" r="25" fill="#c89580"/><path d="M223 374q4-29 37-29t37 29" fill="#879c81"/></g>
 </svg>;
}

export default function BenefitsLesson({lesson,state,update}){
 const [index,setIndex]=useState(0);
 const motion=useStudyMotion(3.6);
 const section=lesson.sections[index];
 const playback=motion.playing?'pause':motion.progress>=1?'replay':'play';
 function choose(i){setIndex(i);if(motion.reduced)motion.seek(1);else motion.restart();}
 return <div className="body-learning-page benefits-lesson blend-lesson">
  <Link className="back" href="/study/anatomy" lang={lang}><ArrowLeft/>{moduleTitle('anatomy')}</Link>
  <div className="learning-heading"><div><p className="eyebrow">ANATOMY · BENEFITS & CAUTIONS</p><h1>Benefits need context.</h1></div></div>
  <div className="benefits-choices" role="group" aria-label="Choose a focus">{lesson.sections.map((item,i)=><button key={item.id} aria-pressed={index===i} onClick={()=>choose(i)}>{item.heading}</button>)}</div>
  <section className={`benefits-stage focus-${section.id}`}>
   <div className="benefits-picture"><BenefitsArt focus={section.id} progress={motion.progress}/><button className="benefits-play" lang={lang} onClick={motion.toggle}>{motion.playing?<Pause weight="fill"/>:motion.progress>=1?<ArrowCounterClockwise/>:<Play weight="fill"/>}{t(`lesson.motion.${playback}`)}</button></div>
   <div className="benefits-copy" aria-live="polite"><p className="eyebrow">0{index+1} / 02 · {section.heading.toUpperCase()}</p><h2>{section.memory}</h2><p>{section.text}</p><span className="micro">A concept diagram · not a personal safety decision</span></div>
  </section>
  <div className="visual-lesson-actions"><Link className="button" href={`/review?lesson=${lesson.id}`} lang={lang}>{t('lesson.quickRecall')} <ArrowRight/></Link></div>
  <details className="learning-details"><summary lang={lang}>{t('lesson.details')}</summary><p>{section.detail}</p><p>This is a source-backed introduction, not a list of medical contraindications or a personal recommendation. Ask your trainer about the course method.</p><div className="visual-study-status"><label htmlFor="benefits-status" lang={lang}>{t('lesson.status')}</label><select lang={lang} id="benefits-status" value={state.lessonStatuses[lesson.id]||'not-started'} onChange={e=>update({...state,lastLessonId:lesson.id,lessonStatuses:{...state.lessonStatuses,[lesson.id]:e.target.value}})}><option value="not-started">{t('lesson.status.notStarted')}</option><option value="reviewed">{t('lesson.status.reviewed')}</option><option value="revisit">{t('lesson.status.revisit')}</option></select></div><SourcePanel sourceIds={lesson.sourceIds}/></details>
 </div>;
}

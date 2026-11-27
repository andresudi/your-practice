import {moduleTitle} from './module-title.js';
import {lang,t} from '../../i18n/index.js';
import {useState} from 'react';
import {ArrowLeft,ArrowRight,Play,Pause,ArrowCounterClockwise} from '@phosphor-icons/react';
import {Link} from '../../app/Link.jsx';
import {useStudyMotion} from '../body/AnatomyVisual.jsx';
import SourcePanel from './SourcePanel.jsx';
import './blend-system.css';
import './boundaries-lesson.css';

export function BoundariesArt({focus='teach',progress=1}){
 const teach=focus==='teach';
 const path=teach?'M260 323 Q200 278 154 195':'M260 323 Q320 278 366 195';
 const color=teach?'#64846e':'#b8796d';
 return <svg className="boundaries-art" viewBox="0 0 520 410" role="img" aria-label={`Illustrated choice: a yoga teacher ${teach?'stays with teaching within training':'pauses and refers a question outside their qualifications'}. This is a concept, not clinical triage.`}>
  <ellipse cx="260" cy="209" rx="216" ry="177" fill="#f5efe6"/>
  <ellipse cx="260" cy="378" rx="192" ry="12" fill="#3f5f4b" opacity=".12"/>
  <path d="M260 323 Q200 278 154 195 M260 323 Q320 278 366 195" fill="none" stroke="#d8d4ca" strokeWidth="9" strokeLinecap="round"/>
  <path d={path} pathLength="1" fill="none" stroke={color} strokeWidth="9" strokeLinecap="round" strokeDasharray={`${Math.max(.001,progress)} 1`}/>
  <g opacity={teach?1:.5}><circle cx="154" cy="184" r="66" fill="#e0e9dc"/><circle cx="154" cy="184" r="46" fill="#fffaf3" stroke="#64846e" strokeWidth="3"/><path d="M136 192q18-28 36 0 M154 163v34" fill="none" stroke="#64846e" strokeWidth="4" strokeLinecap="round"/><text x="154" y="277" textAnchor="middle">TEACH</text></g>
  <g opacity={teach?.5:1}><circle cx="366" cy="184" r="66" fill="#f0dfd8"/><circle cx="366" cy="184" r="46" fill="#fffaf3" stroke="#b8796d" strokeWidth="3"/><path d="M348 177h36 M348 190h23 M348 203h14" fill="none" stroke="#b8796d" strokeWidth="4" strokeLinecap="round"/><text x="366" y="277" textAnchor="middle">REFER</text></g>
  <g><circle cx="260" cy="312" r="23" fill="#c9917c"/><path d="M225 374q4-31 35-31t35 31" fill="#6e8b77"/></g>
 </svg>;
}

export default function BoundariesLesson({lesson,state,update}){
 const [index,setIndex]=useState(0);
 const motion=useStudyMotion(3.5);
 const section=lesson.sections[index];
 const playback=motion.playing?'pause':motion.progress>=1?'replay':'play';
 function choose(i){setIndex(i);if(motion.reduced)motion.seek(1);else motion.restart();}
 return <div className="body-learning-page boundaries-lesson blend-lesson">
  <Link className="back" href="/study/teaching" lang={lang}><ArrowLeft/>{moduleTitle('teaching')}</Link>
  <div className="learning-heading"><div><p className="eyebrow">TEACHING · PRIORITIES & BOUNDARIES</p><h1>Know your teaching space.</h1></div></div>
  <div className="boundaries-choices" role="group" aria-label="Choose a teaching boundary">{lesson.sections.map((item,i)=><button key={item.id} aria-pressed={index===i} onClick={()=>choose(i)}>{item.heading}</button>)}</div>
  <section className={`boundaries-stage focus-${section.id}`}>
   <div className="boundaries-picture"><BoundariesArt focus={section.id} progress={motion.progress}/><button className="boundaries-play" lang={lang} onClick={motion.toggle}>{motion.playing?<Pause weight="fill"/>:motion.progress>=1?<ArrowCounterClockwise/>:<Play weight="fill"/>}{t(`lesson.motion.${playback}`)}</button></div>
   <div className="boundaries-copy" aria-live="polite"><p className="eyebrow">0{index+1} / 02 · {section.heading.toUpperCase()}</p><h2>{section.memory}</h2><p>{section.text}</p><span className="micro">A boundary reminder · ask your trainer about the course method</span></div>
  </section>
  <div className="visual-lesson-actions"><Link className="button" href={`/review?lesson=${lesson.id}`} lang={lang}>{t('lesson.quickRecall')} <ArrowRight/></Link></div>
  <details className="learning-details"><summary lang={lang}>{t('lesson.details')}</summary><p>{section.detail}</p><p>Yoga Alliance describes a professional scope for its members. Your teacher sets the expectations and assessment for this cohort.</p><div className="visual-study-status"><label htmlFor="boundaries-status" lang={lang}>{t('lesson.status')}</label><select lang={lang} id="boundaries-status" value={state.lessonStatuses[lesson.id]||'not-started'} onChange={e=>update({...state,lastLessonId:lesson.id,lessonStatuses:{...state.lessonStatuses,[lesson.id]:e.target.value}})}><option value="not-started">{t('lesson.status.notStarted')}</option><option value="reviewed">{t('lesson.status.reviewed')}</option><option value="revisit">{t('lesson.status.revisit')}</option></select></div><SourcePanel sourceIds={lesson.sourceIds}/></details>
 </div>;
}

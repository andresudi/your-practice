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
import './teaching-pace-lesson.css';

const clamp=value=>Math.max(0,Math.min(1,value));

export function TeachingPaceArt({mode='group',progress=1,decorative=false}){
 const people=mode==='group';
 const individual=mode==='individual';
 const learners=[
  {x:135,y:294,color:'#c98979'},
  {x:260,y:310,color:'#8d9b77'},
  {x:385,y:294,color:'#a593b2'}
 ];
 const routes=[
  'M255 132 Q147 144 135 257',
  'M260 132 Q260 190 260 270',
  'M265 132 Q373 144 385 257'
 ];
 return <svg viewBox="0 0 520 410" className="teaching-pace-art" role={decorative?undefined:'img'} aria-hidden={decorative||undefined} aria-label={people?'Abstract teacher and three learners, with attention moving across the group.':individual?'Three learners with separate circles: a reminder that individual needs cannot be assumed from appearance.':'Abstract class group and moving circle: a reminder to notice pace, not a timetable.'}>
  <ellipse cx="260" cy="214" rx="215" ry="181" fill={people?'#f5e9d9':individual?'#eee9f2':'#e8eee4'}/>
  <ellipse cx="260" cy="376" rx="198" ry="14" fill="#42594a" opacity=".11"/>
  {people?<>
   {routes.map((d,i)=><g key={d}><path d={d} fill="none" stroke="#d4bfaa" strokeWidth="6" strokeLinecap="round"/><path d={d} pathLength="1" fill="none" stroke={learners[i].color} strokeWidth="6" strokeLinecap="round" strokeDasharray={`${Math.max(.001,clamp(progress*3-i))} 1`}/></g>)}
  </>:individual?<>
   {learners.map(({x,y,color},i)=><g key={x}><circle cx={x} cy={y} r="48" fill="none" stroke="#d8cedc" strokeWidth="5"/><circle cx={x} cy={y} r="48" pathLength="1" fill="none" stroke={color} strokeWidth="5" strokeLinecap="round" strokeDasharray={`${Math.max(.001,clamp(progress*3-i))} 1`} transform={`rotate(-90 ${x} ${y})`}/></g>)}
  </>:<>
   <circle cx="260" cy="222" r="156" fill="none" stroke="#ced8c9" strokeWidth="9"/>
   <circle cx="260" cy="222" r="156" pathLength="1" fill="none" stroke="#728c76" strokeWidth="9" strokeLinecap="round" strokeDasharray={`${Math.max(.001,clamp(progress))} 1`} transform="rotate(-90 260 222)"/>
  </>}
  <g className="teaching-guide"><circle cx="260" cy="94" r="29" fill="#d6a58d"/><path d="M218 164 Q260 131 302 164 L314 218 Q260 241 206 218Z" fill="#6d8973"/><path d="M224 171 L192 205 M296 171 L328 205" stroke="#d6a58d" strokeWidth="13" strokeLinecap="round"/></g>
  {learners.map(({x,y,color},i)=><g key={x} opacity={people||individual?1:.8}><circle cx={x} cy={y} r="25" fill={color}/><path d={`M${x-33} ${y+68} Q${x} ${y+28} ${x+33} ${y+68}Z`} fill={color} opacity=".8"/>{people&&progress*3>i+.65&&<circle cx={x} cy={y} r="36" fill="none" stroke={color} strokeWidth="2" opacity=".55"/>}</g>)}
  {!decorative&&<text x="260" y="26" textAnchor="middle">{people?'NOTICE THE GROUP':individual?'ASK, DON’T ASSUME':'NOTICE THE TIME'}</text>}
 </svg>;
}

export default function TeachingPaceLesson({lesson,state,update}){
 const [index,setIndex]=useState(0);
 const motion=useStudyMotion(4.5);
 const section=lesson.sections[index];
 const playback=motion.playing?'pause':motion.progress>=1?'replay':'play';
 function choose(i){setIndex(i);if(motion.reduced)motion.seek(1);else motion.restart();}
 return <div className="body-learning-page styles-lesson teaching-pace-lesson blend-lesson">
  <Link className="back" href="/study/teaching" lang={lang}><ArrowLeft/>{moduleTitle('teaching')}</Link>
  <div className="learning-heading"><div><p className="eyebrow">TEACHING · PEOPLE, TIME & NEEDS</p><h1>Read the room.</h1></div></div>
  <div className="style-choices" role="group" aria-label="Choose a teaching focus">{lesson.sections.map((item,i)=><button key={item.id} aria-pressed={i===index} onClick={()=>choose(i)}>{item.heading}</button>)}</div>
  <section className={`teaching-pace-stage focus-${section.id}`}>
   <div className="teaching-pace-picture"><TeachingPaceArt mode={section.id} progress={motion.progress}/><button className="style-play" lang={lang} onClick={motion.toggle}>{motion.playing?<Pause weight="fill"/>:motion.progress>=1?<ArrowCounterClockwise/>:<Play weight="fill"/>}{t(`lesson.motion.${playback}`)}</button></div>
   <div className="teaching-pace-copy" aria-live="polite"><p className="eyebrow">0{index+1} / 03 · {section.heading.toUpperCase()}</p><h2>{section.memory}</h2><p>{section.text}</p><span className="micro">A visual reminder · not a class plan</span></div>
  </section>
  <div className="visual-lesson-actions"><Link className="button" href={`/review?lesson=${lesson.id}`} lang={lang}>{t('lesson.quickRecall')} <ArrowRight/></Link><Link className="text-link" href="/teaching" lang={lang}>{t('study.openRehearsal')} <ArrowRight/></Link></div>
  <details className="learning-details"><summary lang={lang}>{t('lesson.details')}</summary><p>{section.detail}</p><p>Yoga Alliance names pace, class management and an accessible environment in RYS 200 Professional Essentials. Your teachers set the actual method and assessment.</p><div className="visual-study-status"><label htmlFor="teaching-pace-status" lang={lang}>{t('lesson.status')}</label><select lang={lang} id="teaching-pace-status" value={state.lessonStatuses[lesson.id]||'not-started'} onChange={e=>update({...state,lastLessonId:lesson.id,lessonStatuses:{...state.lessonStatuses,[lesson.id]:e.target.value}})}><option value="not-started">{t('lesson.status.notStarted')}</option><option value="reviewed">{t('lesson.status.reviewed')}</option><option value="revisit">{t('lesson.status.revisit')}</option></select></div><SourcePanel sourceIds={lesson.sourceIds}/></details>
 </div>;
}

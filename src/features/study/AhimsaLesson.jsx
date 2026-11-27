import {moduleTitle} from './module-title.js';
import {lang,t} from '../../i18n/index.js';
import {useState} from 'react';
import {ArrowLeft,ArrowRight,Play,Pause,ArrowCounterClockwise} from '@phosphor-icons/react';
import {Link} from '../../app/Link.jsx';
import {useStudyMotion} from '../body/AnatomyVisual.jsx';
import SourcePanel from './SourcePanel.jsx';
import './blend-system.css';
import './ahimsa-lesson.css';

const nodes=[
 {id:'text',x:129,y:252,color:'#b38cae',label:'TEXT'},
 {id:'intention',x:260,y:110,color:'#c78b78',label:'NOTICE'},
 {id:'teaching',x:391,y:252,color:'#7c9a7e',label:'ASK'}
];

export function AhimsaArt({focus='text',progress=1}){
 const current=nodes.find(node=>node.id===focus)||nodes[0];
 const line=`M260 292 Q260 208 ${current.x} ${current.y}`;
 return <svg className="ahimsa-art" viewBox="0 0 520 410" role="img" aria-label={`Conceptual illustration: a path from reflection to ${current.label.toLowerCase()}; no practice instruction`}>
  <ellipse cx="260" cy="209" rx="214" ry="174" fill="#f8f0e7"/>
  <ellipse cx="260" cy="374" rx="197" ry="13" fill="#607862" opacity=".12"/>
  <path d={line} fill="none" stroke="#d8d6cc" strokeWidth="8" strokeLinecap="round"/>
  <path d={line} pathLength="1" fill="none" stroke={current.color} strokeWidth="8" strokeLinecap="round" strokeDasharray={`${Math.max(.001,progress)} 1`}/>
  {nodes.map(node=><g key={node.id} opacity={node.id===focus?1:.58}>
   <circle cx={node.x} cy={node.y} r="54" fill={node.color} opacity=".18"/>
   <circle cx={node.x} cy={node.y} r="41" fill="#fffaf4" stroke={node.color} strokeWidth="3"/>
   {node.id==='text'?<g fill="none" stroke={node.color} strokeWidth="3" strokeLinecap="round"><path d={`M${node.x} ${node.y-15}q-14-8-25-3v34q13-5 25 3q12-8 25-3v-34q-12-5-25 3z`}/><path d={`M${node.x} ${node.y-15}v34`}/></g>:node.id==='intention'?<path d={`M${node.x} ${node.y+19}c-25-14-25-35-10-38 7-1 11 3 10 7-1-4 3-8 10-7 15 3 15 24-10 38z`} fill={node.color}/>:<g fill="none" stroke={node.color} strokeWidth="4" strokeLinecap="round"><path d={`M${node.x-20} ${node.y+4}q20-16 40 0M${node.x-17} ${node.y-8}q17-11 34 0`}/><circle cx={node.x} cy={node.y+13} r="4" fill={node.color} stroke="none"/></g>}
   <text x={node.x} y={node.y+77} textAnchor="middle">{node.label}</text>
  </g>)}
  <g className="ahimsa-person"><circle cx="260" cy="303" r="28" fill="#d7a18b"/><path d="M215 365q5-38 45-38t45 38" fill="#809981"/><path d="M229 357q31 17 62 0" fill="none" stroke="#6c856e" strokeWidth="4" strokeLinecap="round"/></g>
 </svg>;
}

export default function AhimsaLesson({lesson,state,update}){
 const [index,setIndex]=useState(0);
 const motion=useStudyMotion(3.8);
 const section=lesson.sections[index];
 const playback=motion.playing?'pause':motion.progress>=1?'replay':'play';
 function choose(i){setIndex(i);if(motion.reduced)motion.seek(1);else motion.restart();}
 return <div className="body-learning-page ahimsa-lesson blend-lesson">
  <Link className="back" href="/study/philosophy" lang={lang}><ArrowLeft/>{moduleTitle('philosophy')}</Link>
  <div className="learning-heading"><div><p className="eyebrow">PHILOSOPHY · ONE TEXT, ONE QUESTION</p><h1>A question of non-harming.</h1></div></div>
  <div className="ahimsa-choices" role="group" aria-label="Choose a reflection focus">{lesson.sections.map((item,i)=><button key={item.id} aria-pressed={index===i} onClick={()=>choose(i)}>{item.heading}</button>)}</div>
  <section className={`ahimsa-stage focus-${section.id}`}>
   <div className="ahimsa-picture"><AhimsaArt focus={section.id} progress={motion.progress}/><button className="ahimsa-play" lang={lang} onClick={motion.toggle}>{motion.playing?<Pause weight="fill"/>:motion.progress>=1?<ArrowCounterClockwise/>:<Play weight="fill"/>}{t(`lesson.motion.${playback}`)}</button></div>
   <div className="ahimsa-copy" aria-live="polite"><p className="eyebrow">0{index+1} / 03 · {section.heading.toUpperCase()}</p><h2>{section.memory}</h2><p>{section.text}</p><span className="micro">A memory picture · not a rule for every situation</span></div>
  </section>
  <div className="visual-lesson-actions"><Link className="button" href={`/review?lesson=${lesson.id}`} lang={lang}>{t('lesson.quickRecall')} <ArrowRight/></Link></div>
  <details className="learning-details"><summary lang={lang}>{t('lesson.details')}</summary><p>{section.detail}</p><p>This introduction covers one passage and a modern teaching comparison. Your teacher's readings and assessment set the course requirements.</p><div className="visual-study-status"><label htmlFor="ahimsa-status" lang={lang}>{t('lesson.status')}</label><select lang={lang} id="ahimsa-status" value={state.lessonStatuses[lesson.id]||'not-started'} onChange={e=>update({...state,lastLessonId:lesson.id,lessonStatuses:{...state.lessonStatuses,[lesson.id]:e.target.value}})}><option value="not-started">{t('lesson.status.notStarted')}</option><option value="reviewed">{t('lesson.status.reviewed')}</option><option value="revisit">{t('lesson.status.revisit')}</option></select></div><SourcePanel sourceIds={lesson.sourceIds}/></details>
 </div>;
}

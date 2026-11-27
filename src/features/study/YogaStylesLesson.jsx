import {moduleTitle} from './module-title.js';
import {lang,t} from '../../i18n/index.js';
import {useState} from 'react';
import {ArrowLeft, ArrowRight, Play, Pause, ArrowCounterClockwise} from '@phosphor-icons/react';
import {Link} from '../../app/Link.jsx';
import {useStudyMotion} from '../body/AnatomyVisual.jsx';
import StudyArt from './StudyArt.jsx';
import SourcePanel from './SourcePanel.jsx';
import './yoga-styles.css';
import './blend-system.css';

// Abstract memory aids: these patterns are neither pose sequences nor breathing timers.
function Rhythm({kind,progress}) {
 const active=Math.min(3,Math.floor(progress*4));
 return <svg viewBox="0 0 440 120" className="style-rhythm" aria-hidden="true">
  {kind==='yin'?<><ellipse cx="220" cy="65" rx="116" ry="27" fill="#d7c7df"/><ellipse cx="220" cy="65" rx={70+progress*35} ry={36+progress*15} fill="none" stroke="#a98cb4" opacity={.8-progress*.5}/><circle cx="220" cy="65" r="12" fill="#83648f"/></>
   :kind==='vinyasa'?<><path d="M40 65 C100 -10 140 140 220 65 S340 -10 400 65" pathLength="1" fill="none" stroke="#ccd5c0" strokeWidth="10" strokeLinecap="round"/><path d="M40 65 C100 -10 140 140 220 65 S340 -10 400 65" pathLength="1" fill="none" stroke="#78916d" strokeWidth="10" strokeLinecap="round" strokeDasharray={`${Math.max(.001,progress)} 1`}/></>
   :<>{kind==='ashtanga'&&<path d="M65 65 H375" stroke="#b7c3ac" strokeWidth="3"/>}{[65,168,272,375].map((x,i)=><g key={x}><circle cx={x} cy="65" r={kind==='hatha'?25:23} fill={i===active?'#819777':'#f9f6ec'} stroke="#adbda2" strokeWidth="2"/>{kind==='ashtanga'&&<text x={x} y="71" textAnchor="middle" fill={i===active?'#fffaf0':'#506344'} fontSize="17">{i+1}</text>}</g>)}</>}
 </svg>;
}

export default function YogaStylesLesson({lesson,state,update}) {
 const [index,setIndex]=useState(0);
 const motion=useStudyMotion(5);
 const section=lesson.sections[index];
 const playback=motion.playing?'pause':motion.progress>=1?'replay':'play';
 function choose(i){setIndex(i);if(motion.reduced)motion.seek(1);else motion.restart();}
 return <div className="body-learning-page styles-lesson blend-lesson">
  <Link className="back" href="/study/practice" lang={lang}><ArrowLeft/>{moduleTitle('practice')}</Link>
  <div className="learning-heading"><div><p className="eyebrow">GET TO KNOW THE STYLES</p><h1>Different rhythms.<br/>A shared practice.</h1></div></div>
  <div className="style-choices" role="group" aria-label="Choose a yoga style">{lesson.sections.map((s,i)=><button key={s.id} aria-pressed={i===index} onClick={()=>choose(i)}>{s.heading}</button>)}</div>
  <section className={`style-stage style-${section.id}`}>
   <div className="style-picture"><StudyArt moduleId="M1"/><Rhythm kind={section.id} progress={motion.progress}/><button className="style-play" lang={lang} onClick={motion.toggle}>{motion.playing?<Pause weight="fill"/>:motion.progress>=1?<ArrowCounterClockwise/>:<Play weight="fill"/>}{t(`pose.${playback}`)}</button></div>
   <div className="style-copy" aria-live="polite"><p className="eyebrow">0{index+1} / 04 · {section.heading}</p><h2>{section.memory}</h2><p>{section.text}</p><span className="micro">Animated memory aid · not a practice timer</span></div>
  </section>
  <div className="visual-lesson-actions"><Link className="button" href="/review?lesson=yoga-styles" lang={lang}>{t('lesson.quickRecall')} <ArrowRight/></Link></div>
  <details className="learning-details"><summary lang={lang}>{t('lesson.details')}</summary><p>{section.detail}</p><p>These four class styles are short introductions. Your teacher’s approach gives each class its context.</p><div className="visual-study-status"><label htmlFor="styles-status" lang={lang}>{t('lesson.status')}</label><select lang={lang} id="styles-status" value={state.lessonStatuses[lesson.id]||'not-started'} onChange={e=>update({...state,lastLessonId:lesson.id,lessonStatuses:{...state.lessonStatuses,[lesson.id]:e.target.value}})}><option value="not-started">{t('lesson.status.notStarted')}</option><option value="reviewed">{t('lesson.status.reviewed')}</option><option value="revisit">{t('lesson.status.revisit')}</option></select></div><SourcePanel sourceIds={['training-outline',section.sourceId]}/></details>
 </div>;
}

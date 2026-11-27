import {moduleTitle} from './module-title.js';
import {lang,t} from '../../i18n/index.js';
import {useState} from 'react';
import {ArrowLeft,ArrowRight,Play,Pause,ArrowCounterClockwise} from '@phosphor-icons/react';
import {Link} from '../../app/Link.jsx';
import {useStudyMotion} from '../body/AnatomyVisual.jsx';
import SkeletonArt from '../body/SkeletonArt.jsx';
import SourcePanel from './SourcePanel.jsx';
import '../body/body-learning.css';
import './yoga-styles.css';
import './skeleton-lesson.css';
import './atlas-concept.css';
import './playful-concept.css';

export default function SkeletonLesson({lesson,state,update}) {
 const [index,setIndex]=useState(0),motion=useStudyMotion(3);
 const section=lesson.sections[index];
 const playback=motion.playing?'pause':motion.progress>=1?'replay':'play';
 function choose(i){setIndex(i);if(motion.reduced)motion.seek(1);else motion.restart();}
 return <div className="body-learning-page styles-lesson skeleton-lesson atlas-skeleton-lesson playful-trial">
  <Link className="back" href="/study/anatomy" lang={lang}><ArrowLeft/>{moduleTitle('anatomy')}</Link>
  <div className="atlas-skeleton-heading"><p className="eyebrow">ANATOMY · THE BODY’S FRAMEWORK</p><h1>See the skeleton <em>in layers.</em></h1><p className="anatomy-overview">{lesson.overview}</p></div>
  <section className={`atlas-skeleton-stage skeleton-${section.id}`} aria-label="Explore the two skeletal divisions">
   <div className="atlas-skeleton-canvas"><SkeletonArt division={section.id} progress={motion.progress}/><span className="atlas-canvas-caption">A simplified map of the body</span></div>
   <div className="atlas-skeleton-guide">
    <p className="eyebrow">CHOOSE A LAYER · 0{index+1} / 02</p>
    <div className="atlas-skeleton-choices" role="group" aria-label="Choose a skeletal division">{lesson.sections.map((s,i)=><button key={s.id} aria-pressed={i===index} onClick={()=>choose(i)}><span>0{i+1}</span>{s.heading}<ArrowRight size={18}/></button>)}</div>
    <div className="atlas-skeleton-copy" aria-live="polite"><h2>{section.memory}</h2><p>{section.text}</p></div>
    <button className="atlas-skeleton-play" lang={lang} onClick={motion.toggle}>{motion.playing?<Pause weight="fill"/>:motion.progress>=1?<ArrowCounterClockwise/>:<Play weight="fill"/>}{t(`lesson.highlight.${playback}`)}</button>
   </div>
  </section>
  <div className="visual-lesson-actions"><Link className="button" href={`/review?lesson=${lesson.id}`} lang={lang}>{t('lesson.tryRecall')} <ArrowRight/></Link><Link className="text-link" href="/learn/what-connects-the-body">What joins the framework? <ArrowRight/></Link></div>
  <details className="learning-details"><summary lang={lang}>{t('lesson.details')}</summary><p>{section.detail}</p><p>A simplified, see-through map of major groups. Small bones, counts and proportions are omitted or simplified; use the linked textbook for full anatomy.</p><p>This skeleton introduction supports anatomy vocabulary; it is not a cohort-specific assessment.</p><div className="visual-study-status"><label htmlFor="skeleton-status" lang={lang}>{t('lesson.status')}</label><select lang={lang} id="skeleton-status" value={state.lessonStatuses[lesson.id]||'not-started'} onChange={e=>update({...state,lastLessonId:lesson.id,lessonStatuses:{...state.lessonStatuses,[lesson.id]:e.target.value}})}><option value="not-started">{t('lesson.status.notStarted')}</option><option value="reviewed">{t('lesson.status.reviewed')}</option><option value="revisit">{t('lesson.status.revisit')}</option></select></div><SourcePanel sourceIds={lesson.sourceIds}/></details>
 </div>;
}

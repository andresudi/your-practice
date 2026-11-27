import {moduleTitle} from './module-title.js';
import {lang,t} from '../../i18n/index.js';
import {useState} from 'react';
import {ArrowLeft,ArrowRight,Play,Pause,ArrowCounterClockwise} from '@phosphor-icons/react';
import {Link} from '../../app/Link.jsx';
import {useStudyMotion} from '../body/AnatomyVisual.jsx';
import ConnectiveArt from '../body/ConnectiveArt.jsx';
import SourcePanel from './SourcePanel.jsx';
import '../body/body-learning.css';
import './yoga-styles.css';
import './connective-lesson.css';
import './blend-system.css';

export default function ConnectiveLesson({lesson,state,update}) {
 const [index,setIndex]=useState(0);
 const motion=useStudyMotion(4);
 const section=lesson.sections[index];
 const playback=motion.playing?'pause':motion.progress>=1?'replay':'play';
 function choose(i){setIndex(i);if(motion.reduced)motion.seek(1);else motion.restart();}
 return <div className="body-learning-page styles-lesson connective-lesson blend-lesson">
  <Link className="back" href="/study/anatomy" lang={lang}><ArrowLeft/>{moduleTitle('anatomy')}</Link>
  <div className="learning-heading"><div><p className="eyebrow">SMALL STRUCTURES · DIFFERENT JOBS</p><h1>What connects<br/>the body?</h1></div></div>
  <p className="anatomy-overview">{lesson.overview}</p>
  <div className="style-choices" role="group" aria-label="Choose a tissue">{lesson.sections.map((s,i)=><button key={s.id} aria-pressed={i===index} onClick={()=>choose(i)}>{s.heading}</button>)}</div>
  <section className={`style-stage tissue-${section.id}`}>
   <div className="style-picture"><ConnectiveArt kind={section.id} progress={motion.progress}/><button className="style-play" lang={lang} onClick={motion.toggle}>{motion.playing?<Pause weight="fill"/>:motion.progress>=1?<ArrowCounterClockwise/>:<Play weight="fill"/>}{t(`pose.${playback}`)}</button></div>
   <div className="style-copy" aria-live="polite"><p className="eyebrow">0{index+1} / 03 · {section.heading}</p><h2>{section.memory}</h2><p>{section.text}</p><span className="micro">Follow the highlight · simplified relationship diagram</span></div>
  </section>
  <div className="visual-lesson-actions"><Link className="button" href={`/review?lesson=${lesson.id}`} lang={lang}>{t('lesson.quickRecall')} <ArrowRight/></Link><Link className="text-link" href="/learn/muscles-work-together">Connect it to muscle roles <ArrowRight/></Link></div>
  <details className="learning-details"><summary lang={lang}>{t('lesson.details')}</summary><p>{section.detail}</p><p>These diagrams show relationships, not the full anatomy of a particular joint. The highlight draws attention to a tissue; it does not show stretching or a movement target.</p><p>This introduction supports anatomy vocabulary. It is not a cohort-specific lesson or practical assessment.</p><div className="visual-study-status"><label htmlFor="connective-status" lang={lang}>{t('lesson.status')}</label><select lang={lang} id="connective-status" value={state.lessonStatuses[lesson.id]||'not-started'} onChange={e=>update({...state,lastLessonId:lesson.id,lessonStatuses:{...state.lessonStatuses,[lesson.id]:e.target.value}})}><option value="not-started">{t('lesson.status.notStarted')}</option><option value="reviewed">{t('lesson.status.reviewed')}</option><option value="revisit">{t('lesson.status.revisit')}</option></select></div><SourcePanel sourceIds={lesson.sourceIds}/></details>
 </div>;
}

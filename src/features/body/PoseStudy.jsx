import {useState} from 'react';
import {ArrowLeft,ArrowRight,Play,Pause,ArrowCounterClockwise} from '@phosphor-icons/react';
import {content,lang,t} from '../../i18n/index.js';
import {Link} from '../../app/Link.jsx';
import SourcePanel from '../study/SourcePanel.jsx';
import PoseArt from './PoseArt.jsx';
import {cameoFor,cameoLine} from './pose-cameos.js';
import {useStudyMotion} from './AnatomyVisual.jsx';
import './pose-study.css';
import '../study/blend-system.css';
export default function PoseStudy({pose}){
 const [region,setRegion]=useState(null),motion=useStudyMotion(6);
 const observation=pose.observations.find(o=>o.regionId===region);
 const finished=!motion.playing&&motion.progress>=1&&!region,cameo=cameoFor(pose.id);
 // A second press clears the label (the buttons are toggles), which brings back the end-of-playback view.
 function chooseRegion(id){setRegion(region===id?null:id);motion.seek(1);}
 function play(){setRegion(null);motion.toggle();}
 return <div className="body-learning-page simple-pose-page blend-pose">
  <Link href="/poses" className="back"><ArrowLeft/>{t('pose.allPoses')}</Link>
  <div className="simple-pose-heading"><h1>{pose.englishName}</h1><p>{pose.sanskritName}</p></div>
  <p className="simple-pose-summary">{pose.summary}</p>
  <p className="pose-observation-prompt">{t('pose.prompt')}</p>
  <section className="simple-pose-stage" aria-label={t('pose.stageLabel',{name:pose.englishName})}>
   <div className="simple-pose-picture"><PoseArt poseId={pose.id} active={region} progress={motion.progress} cameo={finished}/></div>
   <div className="simple-pose-controls">
    <button className="simple-pose-play" onClick={play} aria-label={t(motion.playing?'pose.pauseAria':motion.progress>=1?'pose.replayAria':'pose.playAria')}>{motion.playing?<Pause weight="fill"/>:motion.progress>=1?<ArrowCounterClockwise/>:<Play weight="fill"/>}<span>{t(motion.playing?'pose.pause':motion.progress>=1?'pose.replay':'pose.play')}</span></button>
    <div className="simple-pose-labels" aria-label={t('pose.regionsLabel')}>{pose.regionIds.map(id=><button key={id} aria-pressed={region===id} onClick={()=>chooseRegion(id)}>{content.regions.find(r=>r.id===id).title}</button>)}</div>
   </div>
   <p className="simple-pose-caption" aria-live="polite">{observation?.title||(finished?cameoLine(pose.id,t)??t('pose.encore'):'')}</p>
  </section>
  <details className="learning-details simple-pose-details"><summary>{t('pose.learnMore')}</summary>
   {observation&&<><p>{observation.text}</p><Link className="text-link" href={`/anatomy/${content.regions.find(r=>r.id===region).slug}`}>{t('pose.exploreRegion',{region:lang==='id'?content.regions.find(r=>r.id===region).title.toLowerCase():region})} <ArrowRight/></Link></>}
   <p>{t('pose.note')}</p>
   <div className="learning-links"><Link href="/learn/describe-a-movement">{t('pose.vocab')} <ArrowRight/></Link><Link href={`/teaching?pose=${pose.id}`}>{t('pose.rehearse')} <ArrowRight/></Link></div>
   <SourcePanel sourceIds={pose.sourceIds}/>
  </details>
 </div>;
}

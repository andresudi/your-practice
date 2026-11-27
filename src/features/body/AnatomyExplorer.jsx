import PhysiologyLab from './PhysiologyVisual.jsx';
import {useEffect,useRef,useState} from 'react';
import {ArrowLeft,ArrowRight,BookmarkSimple,Check,Plus} from '@phosphor-icons/react';
import {content,lang,t} from '../../i18n/index.js';
import {idOverlays} from '../../content/id/index.js';
import {Link} from '../../app/Link.jsx';
import SourcePanel from '../study/SourcePanel.jsx';
import TraditionExplorer from './TraditionExplorer.jsx';
import {MovementLab,NervousLab} from './AnatomyVisual.jsx';
import {anatomyChecks,checkFeedback,localizeChecks} from './anatomy-checks.js';
import './body-learning.css';
import '../study/blend-system.css';
export default function AnatomyExplorer({regionId}){
 const region=content.regions.find(r=>r.id===regionId),[answer,setAnswer]=useState(''),[checked,setChecked]=useState(false);
 const tabsRef=useRef(null);
 useEffect(()=>{
  const tabs=tabsRef.current,active=tabs?.querySelector('[aria-current="page"]');
  if(tabs&&active)tabs.scrollLeft+=active.getBoundingClientRect().left-tabs.getBoundingClientRect().left-16;
 },[regionId]);
 if(region.kind==='tradition')return <TraditionExplorer regionId={regionId}/>;
 const questions=lang==='id'?localizeChecks(anatomyChecks,idOverlays.anatomyChecks):anatomyChecks;
 const q=questions[regionId],nervous=regionId==='nervous',physiology=['breathing','muscles'].includes(regionId);
 return <div className="body-learning-page blend-lesson anatomy-explorer"><Link href="/anatomy" className="back"><ArrowLeft/>{t('anatomy.back')}</Link><div className="learning-heading"><div><p className="eyebrow">{t('anatomy.eyebrow')}</p><h1>{physiology?region.heading:nervous?t('anatomy.nervousTitle'):t('anatomy.inMotion',{region:region.title})}</h1></div><span className="pill">{t('anatomy.pill')}</span></div><p className="anatomy-overview">{region.overview}</p><div className="anatomy-tabs" aria-label={t('anatomy.tabsLabel')} ref={tabsRef}>{content.regions.filter(r=>r.kind!=='tradition').map(r=><Link href={`/anatomy/${r.slug}`} key={r.id} aria-current={r.id===regionId?'page':undefined}>{r.title}</Link>)}</div>
 {physiology?<PhysiologyLab kind={regionId}/>:nervous?<NervousLab/>:<MovementLab key={regionId} initialJoint={regionId}/>}
 <div className="learning-after"><section className="mini-recall"><div><p className="eyebrow">{t('anatomy.check')}</p><h2>{q.prompt}</h2></div><div className="recall-options">{q.options.map(option=><button key={option} aria-pressed={answer===option} disabled={checked} onClick={()=>{setAnswer(option);setChecked(true);}}>{option}{checked&&option===q.correct&&<Check size={17}/>}</button>)}</div>{checked&&<p className="recall-feedback" role="status">{checkFeedback(q,answer,t).text} <button onClick={()=>{setAnswer('');setChecked(false);}}>{t('anatomy.tryAgain')}</button></p>}</section><Link className="learning-next" href={`/learn/${region.lessonSlug}`}><span className="eyebrow">{t('anatomy.connect')}</span><h2>{t(physiology?'anatomy.next.physiology':nervous?'anatomy.next.nervous':'anatomy.next.language')}</h2><span className="text-link">{t('anatomy.openLesson')} <ArrowRight/></span></Link></div>
 <div className="learning-links">{!nervous&&!physiology&&<Link href="/poses/warrior-ii">{t('anatomy.noticeWarrior')} <ArrowRight size={18}/></Link>}<Link href={`/review?lesson=${region.lessonId}`}>{t('anatomy.quickRecall')} <ArrowRight size={18}/></Link></div>
 <details className="learning-details"><summary><Plus size={17}/>{t('anatomy.reference')}</summary><p>{t('anatomy.referenceText')}</p><p>{region.detail}</p><a className="text-link" href={region.sourceUrl} target="_blank" rel="noreferrer">{t('anatomy.textbook')} <ArrowRight size={17}/></a><SourcePanel sourceIds={['training-outline',...region.sourceIds]}/></details>
 </div>;
}

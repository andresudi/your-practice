import {ArrowRight} from '@phosphor-icons/react';
import {content,t} from '../../i18n/index.js';
import {countLabel} from '../../domain/plural.js';
import {getCoverage} from '../../domain/coverage.js';
import {getRevisionStart} from '../../domain/study-path.js';
import {Link} from '../../app/Link.jsx';
import StudyArt from './StudyArt.jsx';
import './study-visual.css';
import './blend-system.css';

export default function StudyPath({state}) {
 const coverage=getCoverage(content,state);
 const revisionStart=getRevisionStart(content.lessons,state);
 return <div className="body-learning-page study-map blend-study">
  <div className="learning-heading blend-heading">
   <div>
    <p className="eyebrow">{t('study.eyebrow')}</p>
    <h1>{t('study.title')}</h1>
   </div>
   <nav className="blend-loop" aria-label={t('study.loopLabel')}>{revisionStart&&<Link href={`/learn/${revisionStart.slug}`} aria-label={t('study.continueAria',{title:revisionStart.title})}>{t('study.see')}</Link>}<ArrowRight aria-hidden="true"/><Link href="/review">{t('study.recall')}</Link><ArrowRight aria-hidden="true"/><Link href="/teaching">{t('study.rehearse')}</Link></nav>
  </div>
  <div className="study-map-grid">
   {content.modules.map((module,index)=>{
    const coverageItem=coverage[index];
    const drafts=content.lessons.filter(lesson=>lesson.primaryModuleId===module.id&&lesson.publication==='draft').length;
    return <Link href={`/study/${module.slug}`} className={`study-map-card theme-${module.id}${module.id==='M2'?' map-featured':''}`} key={module.id}>
     <div className="map-art"><span className="map-number">0{index+1}</span><StudyArt moduleId={module.id}/></div>
     <div className="map-card-copy">
      <h2>{module.title}</h2>
      <p>{countLabel(coverageItem.publishedLessonCount,t('study.introductions.one'),t('study.introductions.many'))}{drafts>0?` · ${t('study.samples',{count:drafts})}`:''}</p>
      <span className="map-card-action">{t('study.explore')} <ArrowRight size={20}/></span>
      {coverageItem.reviewedLessonCount>0&&<span className="map-reviewed">{t('study.reviewed',{count:coverageItem.reviewedLessonCount})}</span>}
     </div>
    </Link>;
   })}
   <Link className="study-map-rehearse" href="/teaching">
    <span className="eyebrow">{t('study.roomEyebrow')}</span>
    <h2>{t('study.room1')}<br/><em>{t('study.room2')}</em></h2>
    <span className="button secondary">{t('study.openRehearsal')} <ArrowRight/></span>
   </Link>
  </div>
  <details className="learning-details">
   <summary>{t('study.coverage')}</summary>
   <p>{t('study.coverageText')}</p>
   {coverage.map(item=><p key={item.moduleId}><strong>{content.modules.find(module=>module.id===item.moduleId).title}:</strong> {t('study.coverageRow',{covered:item.coveredTopics,total:item.totalTopics})}</p>)}
  </details>
 </div>;
}

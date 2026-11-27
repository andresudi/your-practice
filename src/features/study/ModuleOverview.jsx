import {ArrowLeft,ArrowRight,CheckCircle} from '@phosphor-icons/react';
import {content,lang,t} from '../../i18n/index.js';
import {getTopicSupport} from '../../domain/topic-support.js';
import {Link} from '../../app/Link.jsx';
import StudyArt from './StudyArt.jsx';
import './study-visual.css';
import './blend-system.css';

export default function ModuleOverview({moduleId,state}) {
 const module=content.modules.find(item=>item.id===moduleId);
 const lessons=content.lessons.filter(item=>item.primaryModuleId===module.id);
 const topics=content.topics.filter(item=>item.moduleId===module.id);
 const firstLesson=lessons.find(item=>item.publication==='published')||lessons[0];
 return <div className="body-learning-page module-visual blend-module">
  <Link className="back" href="/study"><ArrowLeft/>{t('module.back')}</Link>
  <div className={`module-visual-heading theme-${module.id}`}>
   <div>
    <p className="eyebrow">{t('module.eyebrow',{number:'0'+module.id.slice(1)})}</p>
    <h1>{module.title}</h1>
    <p>{module.summary}</p>
    {firstLesson&&<Link className="button module-start" href={`/learn/${firstLesson.slug}`}>{t('module.start')} <ArrowRight/></Link>}
   </div>
   <StudyArt moduleId={module.id}/>
  </div>
  <div className="blend-section-heading"><div><span className="eyebrow">{t('module.stepsEyebrow')}</span><h2>{t('module.stepsTitle')}</h2></div><span>{t('module.available',{count:lessons.length})}</span></div>
  <div className="visual-lesson-list">
   {lessons.map((lesson,index)=><Link className="visual-lesson-row" href={`/learn/${lesson.slug}`} key={lesson.id}>
    <span className="lesson-row-number">{String(index+1).padStart(2,'0')}</span>
    <div><h2 lang={lang==='id'&&!lesson.translated?'en':undefined}>{lesson.title}</h2><p>{t(lesson.publication==='draft'?'module.sample':'module.intro')}{state.lessonStatuses[lesson.id]==='revisit'?t('module.revisit'):''}</p></div>
    {state.lessonStatuses[lesson.id]==='reviewed'?<CheckCircle size={25} aria-label={t('module.reviewedAria')}/>:<ArrowRight size={22}/>}
   </Link>)}
  </div>
  <div className="actions"><Link className="button secondary" href={`/review?module=${module.id}`}>{t('module.recall')} <ArrowRight/></Link>{['M3','M5'].includes(module.id)&&<Link className="button" href="/teaching">{t('module.rehearsal')} <ArrowRight/></Link>}</div>
  <details className="learning-details"><summary>{t('module.checklist')}</summary>{topics.map(topic=>{const english=lang==='id'?'en':undefined,support=getTopicSupport(topic,content.lessons);const label=t(`module.status.${support.kind}`);return support.kind==='teacher-led'?<details className="topic-teacher-prompt" key={topic.id}><summary className="topic-row"><span lang={english}>{topic.title}</span><span className="micro">{label}</span></summary><p lang={english}>{support.prompt}</p></details>:<div className="topic-row" key={topic.id}><span lang={english}>{topic.title}</span><span className="micro">{label}</span></div>})}</details>
 </div>;
}

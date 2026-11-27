import {ArrowRight,ArrowUpRight,Play} from '@phosphor-icons/react';
import {Link} from '../../app/Link.jsx';
import {content,t,lang} from '../../i18n/index.js';
import StudyArt from './StudyArt.jsx';
import PoseArt from '../body/PoseArt.jsx';
import {JointArt} from '../body/AnatomyVisual.jsx';
import {continueLesson,homeDoors} from './home-doors.js';
import './study-visual.css';
import './atlas-concept.css';
import './playful-concept.css';
import './home-doors.css';

const doorArt={study:<StudyArt moduleId="M1"/>,poses:<PoseArt poseId="tree" decorative/>,anatomy:<JointArt joint="shoulder" progress={.6} decorative/>};

export default function Home({state}){
 const doors=homeDoors(content,t);
 const continued=continueLesson(content,state);
 const start=continued||content.lessons.find(item=>item.id==='body-language');
 return <div className="body-learning-page atlas-home playful-trial home-doors-page">
  <section className="atlas-hero" aria-labelledby="atlas-home-title">
   <div className="atlas-hero-copy">
    <p className="eyebrow">{t('home.eyebrow')}</p>
    <h1 id="atlas-home-title">{t('home.title1')}<br/><em>{t('home.title2')}</em></h1>
    <p className="atlas-hero-lead">{t('home.lead')}</p>
    <Link className="atlas-hero-action" href={`/learn/${start.slug}`} aria-label={t(continued?'home.continueAria':'home.startAria',{title:start.title})}><Play weight="fill" size={18}/> {t(continued?'home.continue':'home.start')} <ArrowUpRight size={20}/></Link>
    <p className="atlas-hero-aside">{t('home.aside')}</p>
   </div>
   <div className="atlas-hero-figure"><img src="/assets/warrior-ii-playful.webp" alt=""/></div>
  </section>
  <nav className="home-doors" aria-label={t('home.doorsLabel')}>{doors.map(door=><Link key={door.id} className={`home-door door-${door.id}`} href={door.href}><span className="home-door-art" aria-hidden="true">{doorArt[door.id]}</span><span className="home-door-tagline">{door.tagline}</span><span className="home-door-label">{door.label}</span><span className="home-door-meta">{door.meta}</span><span className="home-door-action">{door.action} <ArrowRight size={18}/></span></Link>)}</nav>
  <div className="home-continue">{continued&&<Link href={`/learn/${continued.slug}`}>{t('home.pickUp')} <strong lang={lang==='id'&&!continued.translated?'en':undefined}>{continued.title}</strong> <ArrowRight size={17}/></Link>}<Link href="/review">{t('home.quickRecall')} <ArrowRight size={17}/></Link></div>
 </div>;
}

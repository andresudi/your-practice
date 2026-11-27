import {moduleTitle} from './module-title.js';
import {lang,t} from '../../i18n/index.js';
import {useEffect,useState} from 'react';
import {ArrowLeft,ArrowRight,Play,Pause,ArrowCounterClockwise} from '@phosphor-icons/react';
import {Link} from '../../app/Link.jsx';
import {useStudyMotion} from '../body/AnatomyVisual.jsx';
import SourcePanel from './SourcePanel.jsx';
import './blend-system.css';
import './concept-pair-lesson.css';

export function ConceptPairArt({kind,focus,progress=1}){
 const show=Math.max(.001,progress);
 if(kind==='hatha')return <svg className="concept-pair-art" viewBox="0 0 520 410" role="img" aria-label={focus==='ladder'?'Abstract book and ladder recalling the image in Haṭha Pradīpikā chapter 1 verse 1':'Abstract book and first step recalling that āsana is introduced in chapter 1 verse 17'}>
  <ellipse cx="260" cy="204" rx="212" ry="168" fill="#f5efe7"/>
  <ellipse cx="260" cy="376" rx="183" ry="12" fill="#445d4b" opacity=".12"/>
  <path d="M125 257 Q192 223 260 254 Q328 223 395 257 V337 Q329 307 260 338 Q191 307 125 337Z" fill="#fffaf4" stroke="#9f8da3" strokeWidth="4" strokeLinejoin="round"/>
  <path d="M260 254V338 M147 279q49-12 93 3m-93 18q49-12 93 3m40-21q49-15 93-3m-93 24q49-15 93-3" fill="none" stroke="#c6b7c9" strokeWidth="3" strokeLinecap="round"/>
  {focus==='ladder'?<g fill="none" stroke="#78937d" strokeWidth="7" strokeLinecap="round"><path d="M217 245 244 87 M291 245 264 87"/><path d="M221 219H287 M226 190H282 M231 161H277 M236 132H272" pathLength="1" strokeDasharray={`${show} 1`}/></g>:<g><path d="M169 216h184" stroke="#d9d2c9" strokeWidth="7" strokeLinecap="round"/><path d="M169 216h184" pathLength="1" stroke="#b77e72" strokeWidth="7" strokeLinecap="round" strokeDasharray={`${show} 1`}/><circle cx="173" cy="193" r="18" fill="#d6b6a6"/><text x="173" y="199" textAnchor="middle">1</text><circle cx="260" cy="193" r="10" fill="#ded7e0"/><circle cx="347" cy="193" r="10" fill="#ded7e0"/></g>}
  <text x="260" y="365" textAnchor="middle">{focus==='ladder'?'VERSE 1 · AN IMAGE':'VERSE 17 · AN OPENING'}</text>
 </svg>;
 if(kind==='teaching'){
  const targets={prepare:[145,183],learn:[260,118],share:[375,183]};
  const target=targets[focus]||targets.prepare;
  return <svg className="concept-pair-art" viewBox="0 0 520 410" role="img" aria-label={`Abstract teacher learning diagram highlighting ${focus}: preparation, feedback and honest communication`}>
   <ellipse cx="260" cy="205" rx="212" ry="169" fill="#f7efe8"/>
   <ellipse cx="260" cy="376" rx="183" ry="12" fill="#445d4b" opacity=".12"/>
   <path d="M260 295 Q200 242 145 183 M260 295V118 M260 295 Q320 242 375 183" fill="none" stroke="#d4d9cf" strokeWidth="7" strokeLinecap="round"/>
   <path d={`M260 295 Q260 215 ${target[0]} ${target[1]}`} pathLength="1" fill="none" stroke="#bc8b79" strokeWidth="8" strokeLinecap="round" strokeDasharray={`${show} 1`}/>
   <g opacity={focus==='prepare'?1:.5}><circle cx="145" cy="183" r="54" fill="#dce8dd"/><rect x="124" y="159" width="42" height="45" rx="7" fill="#fffaf4" stroke="#6e8f77" strokeWidth="3"/><path d="m132 181 8 8 17-20" fill="none" stroke="#6e8f77" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/></g>
   <g opacity={focus==='learn'?1:.5}><circle cx="260" cy="118" r="54" fill="#e7dce9"/><path d="M237 126a25 25 0 0 1 42-25m0 11a25 25 0 0 1-42 25" fill="none" stroke="#987c9d" strokeWidth="5" strokeLinecap="round"/><path d="m276 92 6 10-12 2m-29 37-5-11 12-1" fill="none" stroke="#987c9d" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/></g>
   <g opacity={focus==='share'?1:.5}><circle cx="375" cy="183" r="54" fill="#f0dfd4"/><path d="M350 181h15l25-13v31l-25-13h-15z" fill="#fffaf4" stroke="#b27c68" strokeWidth="3" strokeLinejoin="round"/><path d="M363 190l4 12" stroke="#b27c68" strokeWidth="4" strokeLinecap="round"/></g>
   <circle cx="260" cy="297" r="23" fill="#c68e7a"/><path d="M222 360q5-38 38-38t38 38" fill="#7b987f"/>
   <text x="145" y="252" textAnchor="middle">PREPARE</text><text x="260" y="54" textAnchor="middle">LEARN</text><text x="375" y="252" textAnchor="middle">SHARE</text>
  </svg>;
 }
 if(kind==='restorative')return <svg className="concept-pair-art" viewBox="0 0 520 410" role="img" aria-label={focus==='support'?'Abstract illustration of a soft shape resting on layered supports; not a pose setup':'Abstract illustration of a soft shape with quiet space around it; not a pose setup'}>
  <ellipse cx="260" cy="205" rx="212" ry="169" fill="#f8f1e8"/>
  <ellipse cx="260" cy="373" rx="180" ry="12" fill="#445d4b" opacity=".12"/>
  <path d="M108 309 Q260 331 412 309" fill="none" stroke="#b9c8b4" strokeWidth="15" strokeLinecap="round"/>
  <rect x="150" y="267" width="220" height="40" rx="20" fill="#b6c6ad"/>
  <rect x="185" y="229" width="150" height="40" rx="20" fill="#d8bbad" opacity={focus==='support'?1:.55}/>
  <path d="M170 198 Q260 121 350 198 Q332 237 260 239 Q188 237 170 198Z" fill="#e5dbe6" stroke="#9a7f9d" strokeWidth="3"/>
  <path d="M190 204 Q260 235 330 204" fill="none" stroke="#9a7f9d" strokeWidth="3" opacity=".7"/>
  {focus==='support'?<path d="M186 286 H334" pathLength="1" fill="none" stroke="#527260" strokeWidth="8" strokeLinecap="round" strokeDasharray={`${show} 1`}/>:<g fill="none" stroke="#a084a5" strokeWidth="4" strokeLinecap="round" opacity={show}><path d="M140 143q-13-8 0-17t0-17"/><path d="M380 143q-13-8 0-17t0-17"/><path d="M260 97q-13-8 0-17t0-17"/></g>}
  <circle cx="260" cy="179" r="8" fill="#bf8e83" opacity={show}/>
 </svg>;
 const person=focus==='person';
 return <svg className="concept-pair-art" viewBox="0 0 520 410" role="img" aria-label={person?'Two abstract joint paths with different spans, reminding us that a diagram cannot assess an individual':'Abstract joint and movement arc showing how structure shapes available movement; not a personal range measurement'}>
  <ellipse cx="260" cy="205" rx="212" ry="169" fill="#f0eee8"/>
  <ellipse cx="260" cy="376" rx="184" ry="12" fill="#445d4b" opacity=".12"/>
  <path d="M120 300 H400" stroke="#d7d5cc" strokeWidth="4" strokeLinecap="round"/>
  <g transform={person?'translate(140 0)':'translate(260 0)'}>
   <circle cy="218" r="54" fill="#dee9dc"/><circle cy="218" r="26" fill="#fcf8f1" stroke="#5c806b" strokeWidth="5"/>
   <path d="M0 192V122" stroke="#7e9b87" strokeWidth="22" strokeLinecap="round"/>
   <path d="M0 244V315" stroke="#7e9b87" strokeWidth="22" strokeLinecap="round"/>
   <path d="M-74 206a76 76 0 0 1 74-65" pathLength="1" fill="none" stroke="#c88f7b" strokeWidth="8" strokeLinecap="round" strokeDasharray={`${show} 1`}/>
  </g>
  {person&&<g transform="translate(380 0)">
   <circle cy="218" r="54" fill="#e9e0ea"/><circle cy="218" r="26" fill="#fcf8f1" stroke="#9c81a0" strokeWidth="5"/>
   <path d="M0 192V122" stroke="#a898aa" strokeWidth="22" strokeLinecap="round"/>
   <path d="M0 244V315" stroke="#a898aa" strokeWidth="22" strokeLinecap="round"/>
   <path d="M-59 173a76 76 0 0 1 59-32" pathLength="1" fill="none" stroke="#c88f7b" strokeWidth="8" strokeLinecap="round" strokeDasharray={`${show} 1`}/>
  </g>}
  <text x={person?140:260} y="355" textAnchor="middle">{person?'START A':'JOINT'}</text>
  {person&&<text x="380" y="355" textAnchor="middle">START B</text>}
 </svg>;
}

export default function ConceptPairLesson({lesson,state,update}){
 const [index,setIndex]=useState(0);
 const motion=useStudyMotion(3.6);
 useEffect(()=>{if(motion.reduced)motion.seek(1);},[motion.reduced]);
 const restorative=lesson.id==='restorative-principles';
 const teaching=lesson.id==='teaching-essentials';
 const hatha=lesson.id==='hatha-first-light';
 const section=lesson.sections[index];
 const playback=motion.playing?'pause':motion.progress>=1?'replay':'play';
 function choose(i){setIndex(i);if(motion.reduced)motion.seek(1);else motion.restart();}
 return <div className="body-learning-page concept-pair-lesson blend-lesson">
  <Link className="back" href={restorative?'/study/practice':teaching?'/study/teaching':hatha?'/study/philosophy':'/study/anatomy'} lang={lang}><ArrowLeft/>{moduleTitle(restorative?'practice':teaching?'teaching':hatha?'philosophy':'anatomy')}</Link>
  <div className="learning-heading"><div><p className="eyebrow">{restorative?'PRACTICE · RESTORATIVE':teaching?'TEACHING · GROWTH':hatha?'PHILOSOPHY · TEXT':'ANATOMY · INDIVIDUAL VARIATION'}</p><h1>{lesson.title}.</h1></div></div>
  <div className="concept-pair-choices" role="group" aria-label="Choose a concept">{lesson.sections.map((item,i)=><button key={item.id} aria-pressed={index===i} onClick={()=>choose(i)}>{item.heading}</button>)}</div>
  <section className={`concept-pair-stage focus-${section.id}`}>
   <div className="concept-pair-picture"><ConceptPairArt kind={restorative?'restorative':teaching?'teaching':hatha?'hatha':'variation'} focus={section.id} progress={motion.progress}/>{!motion.reduced&&<button className="concept-pair-play" lang={lang} onClick={motion.toggle}>{motion.playing?<Pause weight="fill"/>:motion.progress>=1?<ArrowCounterClockwise/>:<Play weight="fill"/>}{t(`lesson.motion.${playback}`)}</button>}</div>
   <div className="concept-pair-copy" aria-live="polite"><p className="eyebrow">0{index+1} / 0{lesson.sections.length} · {section.heading.toUpperCase()}</p><h2>{section.memory}</h2><p>{section.text}</p><span className="micro">{hatha?'One translation · ask your trainer about the assigned text':'Concept drawing · ask your trainer for the course method'}</span></div>
  </section>
  <div className="visual-lesson-actions"><Link className="button" href={`/review?lesson=${lesson.id}`} lang={lang}>{t('lesson.quickRecall')} <ArrowRight/></Link></div>
  <details className="learning-details"><summary lang={lang}>{t('lesson.details')}</summary><p>{section.detail}</p><div className="visual-study-status"><label htmlFor="concept-pair-status" lang={lang}>{t('lesson.status')}</label><select lang={lang} id="concept-pair-status" value={state.lessonStatuses[lesson.id]||'not-started'} onChange={e=>update({...state,lastLessonId:lesson.id,lessonStatuses:{...state.lessonStatuses,[lesson.id]:e.target.value}})}><option value="not-started">{t('lesson.status.notStarted')}</option><option value="reviewed">{t('lesson.status.reviewed')}</option><option value="revisit">{t('lesson.status.revisit')}</option></select></div><SourcePanel sourceIds={lesson.sourceIds}/></details>
 </div>;
}

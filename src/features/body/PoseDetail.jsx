import PoseStudy from './PoseStudy.jsx';
import SceneBoundary from './SceneBoundary.js';
import {lazy,Suspense,useEffect,useRef,useState} from 'react';
import {ArrowLeft,ArrowRight,ArrowCounterClockwise,Play,Pause,Repeat,HandSwipeLeft,Scan,FlowerLotus,BookmarkSimple,Plus,Minus,Check,Image as ImageIcon} from '@phosphor-icons/react';
import {content,t} from '../../i18n/index.js';
import {Link} from '../../app/Link.jsx';
import SourcePanel from '../study/SourcePanel.jsx';
const PoseScene=lazy(()=>import('./PoseScene.jsx'));
import {advanceMotion,poseAt} from './pose-motion.js';
import {startMotionLoop} from './motion-loop.js';
import {cameoFor,cameoLine} from './pose-cameos.js';
import {WarriorFlag} from './PoseCameo.jsx';
import './pose-studio.css';
import '../study/blend-system.css';

const stages=[{title:'Arrive',time:0,caption:'Begin with stillness.'},{title:'Open',time:.48,caption:'Notice the whole shape.'},{title:'Warrior II',time:1,caption:'Find the connections.'}];
const regions={shoulder:{title:'Shoulder',word:'Reach',text:'Arms away from the midline: abduction.',lesson:'describe-a-movement'},hip:{title:'Hip',word:'Connect',text:'Where the trunk meets the lower limb.',lesson:'read-the-body'},knee:{title:'Knee',word:'Bend',text:'A smaller angle at the knee: flexion.',lesson:'describe-a-movement'}};

export default function PoseDetail({poseId}){const pose=content.poses.find(p=>p.id===poseId);return poseId==='warrior-ii'?<WarriorStudio poseId={poseId}/>:<PoseStudy pose={pose}/>;}
function WarriorStudio({poseId}){
 const pose=content.poses.find(p=>p.id===poseId);
 // Stage and body-area words are translated at render time (module constants hold only structure).
 const stagesT=stages.map((s,i)=>({...s,title:t(`studio.stage.${i}.title`),caption:t(`studio.stage.${i}.caption`)}));
 const regionsT=Object.fromEntries(Object.entries(regions).map(([id,r])=>[id,{...r,title:t(`studio.region.${id}.title`),word:t(`studio.region.${id}.word`),text:t(`studio.region.${id}.text`)}]));
 const [reducedMotion,setReducedMotion]=useState(()=>window.matchMedia('(prefers-reduced-motion: reduce)').matches);
 const [progress,setProgress]=useState(reducedMotion?1:0),[playing,setPlaying]=useState(!reducedMotion),[loop,setLoop]=useState(false),[speed,setSpeed]=useState(1),[view,setView]=useState('motion'),[selected,setSelected]=useState('shoulder'),[cameraView,setCameraView]=useState('front'),[ready,setReady]=useState(false),[failed,setFailed]=useState(false),[thumbnails,setThumbnails]=useState([]),[learnMore,setLearnMore]=useState(false);
 const markerRefs=useRef({}),progressRef=useRef(progress);progressRef.current=progress;
 useEffect(()=>{const media=window.matchMedia('(prefers-reduced-motion: reduce)');const change=()=>{setReducedMotion(media.matches);if(media.matches)setPlaying(false)};media.addEventListener('change',change);return()=>media.removeEventListener('change',change)},[]);
 useEffect(()=>{
   if(!playing||!ready||failed)return;
   return startMotionLoop(dt=>{const next=advanceMotion(progressRef.current,dt,9/speed,loop);progressRef.current=next.progress;setProgress(next.progress);if(!next.playing){setPlaying(false);return false;}},{maxDelta:.06});
 },[playing,ready,failed,speed,loop]);
 const stage=poseAt(progress).stage,bodyMap=view==='body',illustrated=view==='illustration'||failed,finished=!playing&&progress>=.999;
 function seek(value){setPlaying(false);setProgress(value);progressRef.current=value;}
 function play(){if(progress>=.999){setProgress(0);progressRef.current=0;}setView('motion');setPlaying(!playing);}
 function chooseRegion(id){setSelected(id);setView('body');seek(1);}
 function changeView(next){setView(next);if(next!=='motion')seek(1);}
 const region=regionsT[selected];
 return <div className="motion-page blend-studio">
  <div className="studio-heading"><Link className="studio-back" href="/poses" aria-label={t('studio.back')}><ArrowLeft size={20}/><span>{t('pose.allPoses')}</span></Link><div><p className="eyebrow">{t('studio.eyebrow')}</p><h1>{t('studio.title')}</h1></div><span className="studio-badge"><FlowerLotus size={16}/>{t('studio.badge')}</span></div>
  <p className="warrior-pose-summary">{pose.summary}</p>
  <p className="pose-observation-prompt studio-observation-prompt">{t('studio.prompt')}</p>
  <section className={`motion-stage ${bodyMap?'body-mode':''} ${illustrated?'illustration-mode':''}`} aria-label={t('studio.stageLabel')}>
   <div className="studio-mode-switch" aria-label={t('studio.modeLabel')}>
    <button aria-pressed={view==='motion'} onClick={()=>changeView('motion')}><Play size={15} weight={view==='motion'?'fill':'regular'}/>{t('studio.motion')}</button>
    <button aria-pressed={bodyMap} onClick={()=>changeView('body')}><Scan size={17}/>{t('studio.bodyMap')}</button>
    <button className="illustration-switch" aria-label={t('studio.showIllustration')} aria-pressed={view==='illustration'} onClick={()=>changeView('illustration')}><ImageIcon size={18}/></button>
   </div>
   <span className="scene-edition">{t('studio.edition')}</span>
   <div className="pose-identity"><span className="pose-category">{t('studio.category')}</span><h2>{pose.englishName}</h2><p>{pose.sanskritName}</p><span className="pose-name-rule"/><span className="stage-caption" key={stage}>{stagesT[stage].caption}</span></div>
   <div className="scene-viewport">
    {!failed&&<SceneBoundary fallback={null} onFailure={()=>{setFailed(true);setPlaying(false)}}><Suspense fallback={<img className="studio-illustration" src="/assets/warrior-ii.webp" alt={t('studio.loading')}/>}><PoseScene progress={progress} playing={playing} bodyMap={bodyMap} selected={selected} reducedMotion={reducedMotion} cameraView={cameraView} markerRefs={markerRefs} onReady={()=>setReady(true)} onFailure={()=>{setFailed(true);setPlaying(false)}} onThumbnails={setThumbnails} onOrbitStart={()=>setCameraView('free')}/></Suspense></SceneBoundary>}
    {finished&&!illustrated&&!bodyMap&&<WarriorFlag/>}
    {illustrated&&<img className="studio-illustration" src="/assets/warrior-ii.webp" alt={t('studio.illustrationAlt')}/>}
    {!illustrated&&bodyMap&&Object.entries(regionsT).map(([id,r])=><button key={id} ref={el=>markerRefs.current[id]=el} className={`scene-hotspot ${selected===id?'chosen':''}`} aria-label={t('studio.exploreRegion',{region:r.title})} aria-pressed={selected===id} onClick={()=>chooseRegion(id)}><span className="hotspot-core"/><span className="hotspot-label">{r.title}</span></button>)}
   </div>
   {bodyMap?<aside className="body-insight" key={selected} aria-live="polite"><span className="eyebrow">{region.title.toUpperCase()}</span><h3>{region.word}.</h3><p>{region.text}</p><Link href={`/learn/${region.lesson}`} className="insight-link" aria-label={t('studio.learnMoreRegion',{region:region.title.toLowerCase()})}><ArrowRight size={20}/></Link></aside>:<div className="scene-whisper"><span className="whisper-dot"/>{playing?t('studio.whisper.moving'):illustrated?t('studio.whisper.illustration'):finished?cameoLine('warrior-ii',t):t('studio.whisper.idle')}</div>}
   {!illustrated&&<div className="camera-tools" aria-label={t('studio.viewLabel')}><span><HandSwipeLeft size={16}/>{t('studio.drag')}</span><button className={cameraView==='front'?'selected':''} aria-pressed={cameraView==='front'} onClick={()=>setCameraView('front')}>{t('studio.front')}</button><button className={cameraView==='angle'?'selected':''} aria-pressed={cameraView==='angle'} onClick={()=>setCameraView('angle')}>{t('studio.angle')}</button><button aria-label={t('studio.left')} onClick={()=>setCameraView('left')}><ArrowCounterClockwise size={17}/></button></div>}
   {illustrated?<div className="still-toolbar"><ImageIcon size={17}/><span>{t(failed?'studio.failed':'studio.illustrationView')}</span>{!failed&&<button onClick={()=>{setView('motion');setProgress(0);progressRef.current=0;setPlaying(true)}}>{t('studio.exploreMotion')} <ArrowRight size={16}/></button>}</div>:<div className="playback-toolbar">
    <button className="main-play" onClick={play} disabled={!ready} aria-label={t(playing?'studio.pauseAria':progress>=.999?'studio.replayAria':'studio.playAria')}>{playing?<Pause weight="fill" size={18}/>:<Play weight="fill" size={18}/>}</button>
    <span className="playback-label">{t(playing?'studio.inMotion':progress>=.999?'studio.playAgain':'studio.slowly')}</span>
    <label className="sr-only" htmlFor="motion-progress">{t('studio.progress')}</label><input id="motion-progress" type="range" min="0" max="1" step=".001" value={progress} onChange={e=>seek(Number(e.target.value))} style={{'--played':`${progress*100}%`}}/>
    <span className="playback-time">{String(Math.round(progress*9)).padStart(2,'0')}<small> / 09</small></span>
    <label className="sr-only" htmlFor="motion-speed">{t('studio.speed')}</label><select id="motion-speed" value={speed} onChange={e=>setSpeed(Number(e.target.value))}><option value="0.5">0.5×</option><option value="1">1×</option><option value="1.5">1.5×</option></select>
    <button className={`loop-control ${loop?'on':''}`} aria-label={t('studio.loop')} aria-pressed={loop} onClick={()=>setLoop(!loop)}><Repeat size={20}/></button>
   </div>}
  </section>
  <div className="studio-bottom">
   <div className="pose-moments" aria-label={t('studio.stagesLabel')}>{stagesT.map((s,i)=><button className={`pose-moment ${stage===i?'current':''}`} key={s.title} aria-pressed={stage===i} onClick={()=>{setView('motion');seek(s.time)}}><div className="moment-image">{thumbnails[i]&&<img src={thumbnails[i]} alt={t('studio.stageAlt',{stage:s.title})}/>}</div><div><span className="moment-index">0{i+1}</span><h3>{s.title}</h3></div><ArrowRight className="moment-arrow" size={17}/></button>)}</div>
   <div className="region-chips" aria-label={t('studio.chipsLabel')}>{Object.entries(regionsT).map(([id,r])=><button key={id} className={bodyMap&&selected===id?'selected':''} aria-pressed={bodyMap&&selected===id} onClick={()=>chooseRegion(id)}>{bodyMap&&selected===id?<Check size={14}/>:<Plus size={14}/>} {r.title}</button>)}</div>
  </div>
  <div className="studio-actions"><button className="more-button" aria-expanded={learnMore} onClick={()=>setLearnMore(!learnMore)}>{learnMore?<Minus size={17}/>:<Plus size={17}/>}{t('studio.more')}</button><Link className="studio-review" href={`/review?lesson=pose-observation&from=${pose.id}`}>{t('studio.recall')} <ArrowRight size={17}/></Link></div>
  {learnMore&&<div className="studio-context"><p>{t('studio.context')}</p><div className="actions"><Link className="text-link" href="/learn/observe-a-pose">{t('studio.readLesson')} <ArrowRight/></Link><Link className="text-link" href={`/teaching?pose=${pose.id}`}>{t('pose.rehearse')} <Plus/></Link></div><SourcePanel sourceIds={pose.sourceIds}/></div>}
  {reducedMotion&&<p className="reduced-motion-note">{t('studio.reduced')}</p>}
 </div>;
}

import {useEffect,useId,useRef,useState} from 'react';
import {Play,Pause,ArrowCounterClockwise} from '@phosphor-icons/react';
import {jointGeometry,signalAt} from './anatomy-motion.js';
import {startMotionLoop} from './motion-loop.js';
import {lang,t} from '../../i18n/index.js';

export function useStudyMotion(duration=7){
 const [reduced,setReduced]=useState(()=>matchMedia('(prefers-reduced-motion: reduce)').matches);
 const [progress,setProgress]=useState(reduced?1:0),[playing,setPlaying]=useState(!reduced);
 const current=useRef(progress);current.current=progress;
 useEffect(()=>{const m=matchMedia('(prefers-reduced-motion: reduce)');const f=()=>{setReduced(m.matches);if(m.matches)setPlaying(false);};m.addEventListener('change',f);return()=>m.removeEventListener('change',f);},[]);
 useEffect(()=>{if(!playing)return;return startMotionLoop(dt=>{const n=Math.min(1,current.current+dt/duration);current.current=n;setProgress(n);if(n===1){setPlaying(false);return false;}});},[playing,duration]);
 return {progress,playing,reduced,seek(n){setPlaying(false);current.current=n;setProgress(n);},restart(){current.current=0;setProgress(0);setPlaying(true);},toggle(){if(current.current>=1){current.current=0;setProgress(0);}setPlaying(p=>!p);}};
}
export function BodySilhouette(){return <g fill="#e2d4c3" stroke="#c5b7a8" strokeWidth="1.3"><ellipse cx="250" cy="74" rx="30" ry="38"/><path d="M235 109 L235 125 Q203 127 191 155 L167 257 Q164 274 175 278 Q185 279 191 262 L218 186 L222 247 Q208 272 218 297 L215 401 Q214 420 230 421 Q241 421 242 401 L250 306 L258 401 Q259 421 271 421 Q287 420 285 401 L282 297 Q292 272 278 247 L282 186 L309 262 Q315 279 325 278 Q336 274 333 257 L309 155 Q297 127 265 125 L265 109 Z"/></g>;}
export function JointArt({joint='shoulder',progress=.6,decorative=false}){
 const p=jointGeometry(joint,progress),knee=joint==='knee';
 return <svg viewBox="0 0 500 460" className="anatomy-svg" role={decorative?undefined:'img'} aria-hidden={decorative||undefined} aria-label={t(knee?'lab.joint.ariaKnee':'lab.joint.ariaLimb',{joint:t(`lab.jointName.${joint}`)})}>
  <circle cx="250" cy="230" r="181" fill={knee?'#eee0d6':'#e5e9de'}/><circle cx="250" cy="230" r="201" fill="none" stroke="#d7d5c8"/>
  {joint==='shoulder'&&<><path d="M210 155 L210 317 Q250 332 290 317 L290 155 Q250 121 210 155" fill="#c78e79" opacity=".5"/><ellipse cx="250" cy="82" rx="29" ry="35" fill="#dfbaa1"/><path d="M250 117 V145" stroke="#dfbaa1" strokeWidth="25"/></>}
  {joint==='hip'&&<><path d="M209 119 Q250 102 291 119 L285 218 Q250 250 215 218 Z" fill="#c78e79" opacity=".55"/><path d="M231 240 L217 385" stroke="#bdc9b4" strokeWidth="34" strokeLinecap="round"/></>}
  {knee&&<path d="M250 80 L250 230" stroke="#a8b69f" strokeWidth="36" strokeLinecap="round"/>}
  <path d={`M${p.pivot[0]} ${p.pivot[1]} L${p.pivot[0]} ${p.pivot[1]+p.length}`} stroke="#aeb4a4" strokeWidth="3" strokeDasharray="5 7"/>
  <path d={`M${p.pivot.join(' ')} L${p.end.join(' ')}`} stroke={knee?'#c78e79':'#8d9f81'} strokeWidth="34" strokeLinecap="round"/>
  <path d={`M${p.pivot.join(' ')} L${p.end.join(' ')}`} stroke="#f6f1e5" strokeWidth="7" strokeLinecap="round"/>
  <circle cx={p.pivot[0]} cy={p.pivot[1]} r="24" fill="#e9dfed" stroke="#9a80a4" strokeWidth="2"/><circle cx={p.pivot[0]} cy={p.pivot[1]} r="7" fill="#8a6d96"/>
  <circle cx={p.end[0]} cy={p.end[1]} r="8" fill="#f6f1e5"/>
  {!decorative&&<><text x="250" y="442" textAnchor="middle" className="diagram-caption">{knee?t('lab.caption.sideKnee'):t('lab.caption.front',{joint:t(`lab.jointName.${joint}`).toUpperCase()})}</text><text x="74" y="35" className="diagram-caption">{t('lab.schematic')}</text></>}
 </svg>;
}
export function MovementLab({initialJoint='shoulder',chooseJoint=false}){
 const [joint,setJoint]=useState(initialJoint),motion=useStudyMotion(),id=useId();
 const outward=motion.progress<=.5,amount=outward?motion.progress*2:(1-motion.progress)*2;
 const term=t(joint==='knee'?(outward?'lab.term.flexion':'lab.term.extension'):(outward?'lab.term.abduction':'lab.term.adduction'));
 const description=t(joint==='knee'?(outward?'lab.desc.kneeBend':'lab.desc.kneeStraight'):(outward?'lab.desc.away':'lab.desc.toward'));
 return <div lang={lang} className="visual-lab">
  {chooseJoint&&<div className="lab-tabs" aria-label={t('lab.jointTabs')}>{['shoulder','hip','knee'].map(j=><button key={j} aria-pressed={joint===j} onClick={()=>{setJoint(j);motion.seek(.25);}}>{t(`lab.jointName.${j}`)}</button>)}</div>}
  <div className="lab-art"><JointArt joint={joint} progress={amount}/><div className="diagram-word"><span className="eyebrow">{t(joint==='knee'?'lab.eyebrow.bend':'lab.eyebrow.away')}</span><h2>{term}</h2><p>{description}</p></div></div>
  <div className="lab-playback"><button aria-label={t(motion.playing?'lab.pauseMovement':'lab.playMovement')} onClick={motion.toggle}>{motion.playing?<Pause weight="fill"/>:motion.progress===1?<ArrowCounterClockwise/>:<Play weight="fill"/>}</button><label className="sr-only" htmlFor={id}>{t('lab.movementProgress')}</label><input id={id} type="range" min="0" max="1" step=".001" value={motion.progress} onChange={e=>motion.seek(Number(e.target.value))}/><span>{t('lab.moveToExplore')}</span></div>
  <p className="lab-footnote">{t('lab.footnoteMovement')}</p>
 </div>;
}
// Words for these are looked up at render time (module constants must not hold translated text).
const nervePart=part=>({title:t(`lab.nerve.${part}.title`),subtitle:t(`lab.nerve.${part}.subtitle`),text:t(`lab.nerve.${part}.text`)});
const signalSteps=()=>[0,1,2].map(i=>({title:t(`lab.signal.${i}.title`),text:t(`lab.signal.${i}.text`)}));
export function NerveArt({part='cns',trace=null,decorative=false}){
 const active=trace===null?null:signalAt(trace),stroke=part==='pns'?'#b67b65':'#9a879f';
 let dot=null;if(active){const t=active.local;dot=active.stage===0?[321-71*t,265-180*t]:active.stage===1?[250+Math.sin(t*Math.PI*2)*12,78+Math.cos(t*Math.PI*2)*12]:[250+71*t,85+180*t];}
 return <svg viewBox="0 0 500 460" className="anatomy-svg" role={decorative?undefined:'img'} aria-hidden={decorative||undefined} aria-label={t('lab.nerveAria')}>
  <circle cx="250" cy="230" r="193" fill="#e9e1ed" opacity=".6"/><BodySilhouette/>
  <g fill="none" stroke={stroke} strokeWidth={part==='pns'?3.5:2} opacity={part==='pns'?1:.4} strokeLinecap="round">
   <path d="M250 135 L210 153 L192 213 L179 266 M250 135 L290 153 L308 213 L321 266 M250 245 L229 287 L230 403 M250 245 L271 287 L271 403"/>
   {[156,176,196,216].map(y=><path key={y} d={`M250 ${y} L218 ${y+10} M250 ${y} L282 ${y+10}`}/>)}
   {[156,176,196,216].map(y=><g key={y}><circle cx="244" cy={y} r="3" fill={stroke}/><circle cx="256" cy={y} r="3" fill={stroke}/></g>)}
  </g>
  <g stroke="#80668f" fill="#b29abd" opacity={part==='cns'?1:.35}><path d="M250 61 C239 43 215 60 224 75 C211 91 232 109 246 96 L250 99 L254 96 C268 109 289 91 276 75 C285 60 261 43 250 61Z" strokeWidth="2"/><path d="M250 64 V99 M235 63 Q252 70 235 80 M265 63 Q248 70 265 80" fill="none" strokeWidth="2"/><path d="M250 101 V242" strokeWidth="6" strokeLinecap="round"/></g>
  {dot&&<><circle cx={dot[0]} cy={dot[1]} r="16" fill="#f9edc3" opacity=".5"/><circle cx={dot[0]} cy={dot[1]} r="6" fill="#8b6129" stroke="#fff8e1" strokeWidth="2"/></>}
  {!decorative&&<text x="250" y="444" textAnchor="middle" className="diagram-caption">{t(trace===null?'lab.caption.bodyMap':'lab.caption.signal')}</text>}
 </svg>;
}
export function NervousLab(){const [part,setPart]=useState('cns'),[tracing,setTracing]=useState(false),motion=useStudyMotion(9);const signals=signalSteps(),item=tracing?signals[signalAt(motion.progress).stage]:nervePart(part);return <div lang={lang} className="visual-lab nervous-lab"><div className="lab-tabs"><button aria-pressed={!tracing&&part==='cns'} onClick={()=>{setTracing(false);setPart('cns');}}>{t('lab.tab.cns')}</button><button aria-pressed={!tracing&&part==='pns'} onClick={()=>{setTracing(false);setPart('pns');}}>{t('lab.tab.pns')}</button><button aria-pressed={tracing} onClick={()=>{setTracing(true);if(motion.reduced)motion.seek(0);else motion.restart();}}>{t('lab.tab.signal')}</button></div><div className="lab-art"><NerveArt part={part} trace={tracing?motion.progress:null}/><div className="diagram-word"><span className="eyebrow">{t(tracing?'lab.eyebrow.does':'lab.eyebrow.organised')}</span><h2>{item.title}</h2>{item.subtitle&&<span className="nerve-subtitle">{item.subtitle}</span>}<p>{item.text}</p></div></div>{tracing?<><div className="signal-steps">{signals.map((s,i)=><button key={s.title} aria-pressed={signalAt(motion.progress).stage===i} onClick={()=>motion.seek((i+.5)/3)}><span>0{i+1}</span>{s.title}</button>)}</div><div className="lab-playback"><button onClick={motion.toggle} aria-label={t(motion.playing?'lab.pauseSignal':'lab.playSignal')}>{motion.playing?<Pause weight="fill"/>:<Play weight="fill"/>}</button><label className="sr-only" htmlFor="signal-progress">{t('lab.signalProgress')}</label><input id="signal-progress" type="range" min="0" max="1" step=".001" value={motion.progress} onChange={e=>motion.seek(Number(e.target.value))}/><span>{t('lab.followSignal')}</span></div></>:<div className="nerve-legend"><i className="cns-dot"/>{t('lab.legend.cns')}<i className="pns-dot"/>{t('lab.legend.pns')}</div>}<p className="lab-footnote">{t('lab.footnoteNerve')}</p></div>;}
export function DirectionLab(){const [pair,setPair]=useState('distance');return <div lang={lang} className="visual-lab"><div className="lab-tabs"><button aria-pressed={pair==='distance'} onClick={()=>setPair('distance')}>{t('lab.dir.distance')}</button><button aria-pressed={pair==='midline'} onClick={()=>setPair('midline')}>{t('lab.dir.midline')}</button></div><div className="lab-art"><svg className="anatomy-svg" viewBox="0 0 500 460" role="img" aria-label={t(pair==='distance'?'lab.dir.ariaDistance':'lab.dir.ariaMidline')}><circle cx="250" cy="230" r="193" fill="#e5e9de"/><BodySilhouette/><path d="M250 30 V425" stroke="#a5b297" strokeWidth="1.5" strokeDasharray="5 7"/>{pair==='distance'?<><circle cx="307" cy="218" r="8" fill="#826b91"/><circle cx="320" cy="260" r="8" fill="#b47962"/><path d="M307 218 H354 M320 260 H354" stroke="#89927e"/><text x="365" y="221" className="diagram-label">{t('lab.dir.elbow')}</text><text x="365" y="264" className="diagram-label">{t('lab.dir.wrist')}</text><path d="M193 259 L207 204 M205 216 L207 204 L196 212" fill="none" stroke="#826b91" strokeWidth="3"/></>:<><path d="M254 190 H349 M340 183 L349 190 L340 197 M246 218 H285 M255 211 L246 218 L255 225" fill="none" stroke="#826b91" strokeWidth="3"/><text x="350" y="173" className="diagram-label" textAnchor="middle">{t('lab.dir.lateral')}</text><text x="329" y="238" className="diagram-label" textAnchor="middle">{t('lab.dir.medial')}</text></>}<text x="250" y="444" textAnchor="middle" className="diagram-caption">{t('lab.dir.caption')}</text></svg><div className="diagram-word"><span className="eyebrow">{t('lab.dir.eyebrow')}</span><h2>{t(pair==='distance'?'lab.dir.h2Distance':'lab.dir.h2Midline')}</h2><p>{t(pair==='distance'?'lab.dir.pDistance':'lab.dir.pMidline')}</p></div></div></div>;}

import {useId} from 'react';
import {Play,Pause} from '@phosphor-icons/react';
import {useStudyMotion} from './AnatomyVisual.jsx';
import {breathAt,muscleAt} from './physiology-motion.js';
import {lang,t} from '../../i18n/index.js';
export function BreathArt({progress=.3,decorative=false}){
 const b=breathAt(progress);
 return <svg viewBox="0 0 500 420" className="anatomy-svg" role={decorative?undefined:'img'} aria-hidden={decorative||undefined} aria-label={t('phys.breathAria',{phase:t(`lab.phase.${b.phase}`),action:t(b.phase==='inspiration'?'phys.breath.in':'phys.breath.out')})}>
 <circle cx="250" cy="205" r="174" fill="#e4e9df"/><circle cx="250" cy="205" r="190" fill="none" stroke="#ced7c5"/>
 <path d="M219 70 Q158 81 146 145 L140 317 Q250 355 360 317 L354 145 Q342 81 281 70" fill="#e4d5c3" opacity=".55"/>
 <g transform={`translate(250 130) scale(${b.lungScale}) translate(-250 -130)`}>
 <path d="M236 131 C202 101 169 159 168 230 Q165 271 231 268Z" fill="#acb8a1" stroke="#7f9578" strokeWidth="2"/>
 <path d="M264 131 C298 101 331 159 332 230 Q335 271 269 268Z" fill="#c2b2cf" stroke="#9c84af" strokeWidth="2"/>
 </g><path d="M250 77 V167 M250 144 L213 185 M250 144 L287 185" fill="none" stroke="#faf6ec" strokeWidth="13" strokeLinecap="round"/>
 <path d={`M155 318 Q250 ${b.diaphragmY-60} 345 318`} fill="none" stroke="#bd806b" strokeWidth="12" strokeLinecap="round"/>
 {!decorative&&<><path d={`M380 260 V${b.phase==='inspiration'?306:223} l-6 ${b.phase==='inspiration'?-9:9} m6 ${b.phase==='inspiration'?9:-9} l6 ${b.phase==='inspiration'?-9:9}`} fill="none" stroke="#9d6656" strokeWidth="3"/><text x="250" y="370" textAnchor="middle" className="diagram-label">{t('phys.diaphragm')}</text><path d="M250 350 V327" stroke="#9d6656"/><text x="250" y="405" textAnchor="middle" className="diagram-caption">{t('phys.breathCaption')}</text></>}
 </svg>;
}
export function MuscleArt({progress=.25,decorative=false}){
 const m=muscleAt(progress);
 return <svg viewBox="0 0 500 420" className="anatomy-svg" role={decorative?undefined:'img'} aria-hidden={decorative||undefined} aria-label={t('phys.muscleAria',{phase:t(`lab.muscle.${m.phase}`).toLowerCase(),agonist:m.agonist,antagonist:m.antagonist})}>
 <circle cx="250" cy="205" r="174" fill="#eee0d6"/><circle cx="250" cy="205" r="190" fill="none" stroke="#d8c8ba"/>
 <path d="M250 95 L250 240" stroke="#dec3ac" strokeWidth="58" strokeLinecap="round"/>
 <path d={`M250 240 L${m.wrist.join(' ')}`} stroke="#dec3ac" strokeWidth="43" strokeLinecap="round"/>
 <path d="M250 95 L250 240" stroke="#faf5e9" strokeWidth="9" strokeLinecap="round"/><path d={`M250 240 L${m.wrist.join(' ')}`} stroke="#faf5e9" strokeWidth="8" strokeLinecap="round"/>
 <ellipse cx="274" cy={162+m.amount*10} rx={12+m.amount*7} ry={61-m.amount*12} fill={m.agonist==='Biceps'?'#b97862':'#dab8a7'}/><ellipse cx="224" cy="167" rx="13" ry="61" fill={m.agonist==='Triceps'?'#8d739f':'#cbb8d4'}/>
 <circle cx="250" cy="240" r="15" fill="#fbf6e9" stroke="#ac9985" strokeWidth="3"/>
 {!decorative&&<><text x="321" y="134" className="diagram-label">Biceps</text><path d="M294 145 L317 132" stroke="#af705b"/><text x="113" y="170" className="diagram-label">Triceps</text><path d="M177 167 H205" stroke="#8d739f"/><text x="250" y="405" textAnchor="middle" className="diagram-caption">{t('phys.muscleCaption')}</text></>}
 </svg>;
}
export default function PhysiologyLab({kind}){
 const motion=useStudyMotion(10),id=useId(),breath=kind==='breathing',b=breathAt(motion.progress),m=muscleAt(motion.progress);
 const first=motion.progress<.5;
 return <div lang={lang} className="visual-lab physiology-lab"><div className="lab-tabs" aria-label={t(breath?'phys.tabsBreath':'phys.tabsMuscle')}>{(breath?[t('phys.airIn'),t('phys.airOut')]:[t('phys.elbowFlex'),t('phys.elbowExt')]).map((label,i)=><button key={label} aria-pressed={first===(i===0)} onClick={()=>motion.seek(i===0?.25:.75)}>{label}</button>)}</div><div className="lab-art">{breath?<BreathArt progress={motion.progress}/>:<MuscleArt progress={motion.progress}/>}<div className="diagram-word"><span className="eyebrow">{t(breath?'phys.eyebrowBreath':'phys.eyebrowMuscle')}</span><h2>{breath?t(first?'phys.expand':'phys.recoil'):t(`lab.muscle.${m.phase}`)+'.'}</h2><p>{breath?t(first?'phys.pIn':'phys.pOut'):t('phys.pMuscle',{agonist:m.agonist,antagonist:m.antagonist})}</p>{!breath&&<p className="micro">{t('phys.micro')}</p>}</div></div><div className="lab-playback"><button aria-label={t(motion.playing?'phys.pause':'phys.play')} onClick={motion.toggle}>{motion.playing?<Pause weight="fill"/>:<Play weight="fill"/>}</button><label className="sr-only" htmlFor={id}>{t('phys.progress')}</label><input id={id} type="range" min="0" max="1" step=".001" value={motion.progress} onChange={e=>motion.seek(Number(e.target.value))}/><span>{breath?t(`lab.phase.${b.phase}`):t(`lab.muscle.${m.phase}`)}</span></div><p className="lab-footnote">{t(breath?'phys.footBreath':'phys.footMuscle')}</p></div>;
}

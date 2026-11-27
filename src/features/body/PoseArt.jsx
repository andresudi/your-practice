import {poseSketchAt} from './pose-sketch-motion.js';
import PoseCameo from './PoseCameo.jsx';
import {t} from '../../i18n/index.js';
const points=path=>path.map(p=>p.join(',')).join(' ');
export default function PoseArt({poseId,active=null,decorative=false,mirror=false,progress=1,cameo=false}){
 if(poseId==='warrior-ii')return <img className="pose-art-image" src="/assets/warrior-ii.webp" alt={decorative?'':t('poseArt.warriorAlt')}/>;
 const s=poseSketchAt(poseId,progress);if(!s)return null;
 const ground=poseId==='easy-pose'?378:402;
 return <svg className="pose-study-art" viewBox="0 0 500 460" role={decorative?undefined:'img'} aria-hidden={decorative||undefined} aria-label={active?t('poseArt.labelActive',{name:poseId.replaceAll('-',' '),region:active}):t('poseArt.label',{name:poseId.replaceAll('-',' ')})}>
 <circle cx="250" cy="229" r="177" fill="#e6dfea"/><circle cx="250" cy="229" r="193" fill="none" stroke="#cfc2d5"/><path d={`M67 ${ground} H423 L452 ${ground+19} H40Z`} fill="#a1ae94"/><ellipse cx="250" cy={ground+12} rx="146" ry="9" fill="#75836b" opacity=".12"/>
 {cameo&&<PoseCameo poseId={poseId} layer="behind"/>}
 <g transform={mirror?'translate(500 0) scale(-1 1)':undefined}>
 {s.legs.map((p,i)=><polyline key={i} points={points(p)} stroke={i?'#6d866e':'#82967b'} strokeWidth="30" strokeLinejoin="round" strokeLinecap="round" fill="none"/>)}
 {s.feet.map((p,i)=><polyline key={i} points={points(p)} stroke="#e3b294" strokeWidth="15" strokeLinecap="round" fill="none"/>)}
 <polyline points={points(s.neck)} stroke="#e3b294" strokeWidth="20" strokeLinecap="round" fill="none"/>
 <path d={s.torso} fill="#c0836d"/><path d={s.torso} fill="none" stroke="#ae7363" strokeWidth="1"/>
 {s.arms.map((p,i)=><polyline key={i} points={points(p)} stroke={i?'#edbea2':'#ddb093'} strokeWidth="17" strokeLinejoin="round" strokeLinecap="round" fill="none"/>)}
 <g transform={`translate(${s.head.join(' ')}) rotate(${s.headTurn||0})`}><ellipse cx="-2" cy="-1" rx="29" ry="36" fill="#7d608e"/><ellipse cx="2" cy="4" rx="23" ry="29" fill="#efbea1"/><path d="M-23 -4 Q-27 -42 9 -32 Q29 -21 24 -6 Q4 -7 1 -23 Q-1 -5 -23 -4" fill="#866597"/><circle cx="-14" cy="-33" r="13" fill="#866597"/><path d="M-10 6 q4 4 8 0 M7 6 q4 4 8 0 M-2 19 q5 4 9 -1" stroke="#865b55" strokeWidth="1.4" fill="none" strokeLinecap="round"/><ellipse cx="-12" cy="15" rx="4" ry="2.5" fill="#d89388"/><ellipse cx="15" cy="15" rx="4" ry="2.5" fill="#d89388"/></g>
 {active&&s.markers[active]&&<g className="pose-focus-marker" key={active} transform={`translate(${s.markers[active].join(' ')})`}><circle r="27" fill="#fffaf0" opacity=".68"/><circle r="18" fill="none" stroke="#785989" strokeWidth="2"/><circle r="5" fill="#785989"/></g>}
 </g>
 {cameo&&<PoseCameo poseId={poseId} layer="front"/>}</svg>;
}

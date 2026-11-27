import {ArrowRight,ArrowUpRight,FlowerLotus,Play} from '@phosphor-icons/react';
import {Link} from '../../app/Link.jsx';
import {t} from '../../i18n/index.js';
import PoseArt from './PoseArt.jsx';
import SkeletonArt from './SkeletonArt.jsx';
import ConnectiveArt from './ConnectiveArt.jsx';
import {BreathArt,MuscleArt} from './PhysiologyVisual.jsx';
import {JointArt,NerveArt} from './AnatomyVisual.jsx';

function CardArt({entry}){
 const id=entry.id;
 if(id==='warrior-ii')return <img src="/assets/warrior-ii-playful.webp" alt=""/>;
 if(entry.kind==='pose')return <PoseArt poseId={id} decorative/>;
 if(id==='skeleton-basics')return <SkeletonArt decorative/>;
 if(id==='connective-basics')return <ConnectiveArt kind="ligament" decorative/>;
 if(id==='breathing')return <BreathArt decorative/>;
 if(id==='muscles')return <MuscleArt decorative/>;
 if(id==='nervous')return <NerveArt decorative part="pns"/>;
 return <JointArt joint={id} progress={.6} decorative/>;
}
export default function LibraryCard({entry}){
 return <Link className={`body-visual-card card-${entry.id}`} href={entry.href}><div className="body-card-art"><CardArt entry={entry}/><span className="body-card-tag">{entry.kind==='pose'?<>{entry.id==='warrior-ii'?<Play weight="fill" size={12}/>:<FlowerLotus size={12}/>} {entry.id==='warrior-ii'?t('card.studio'):t('card.animated')}</>:t('card.anatomy')}</span><span className="card-open"><ArrowUpRight size={20}/></span></div><div className="body-card-label"><div><h2>{entry.title}</h2><p>{entry.sub}</p></div><ArrowRight size={21}/></div></Link>;
}

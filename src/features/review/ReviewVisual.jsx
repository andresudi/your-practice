import StudyArt from '../study/StudyArt.jsx';
import {t} from '../../i18n/index.js';
import SkeletonArt from '../body/SkeletonArt.jsx';
import ConnectiveArt from '../body/ConnectiveArt.jsx';
import {NerveArt,JointArt} from '../body/AnatomyVisual.jsx';
import {BreathArt,MuscleArt} from '../body/PhysiologyVisual.jsx';
import {CirculationArt} from '../study/CirculationLesson.jsx';

/** Reuse lesson imagery as a compact visual prompt; text and controls stay usable without it. */
export default function ReviewVisual({lesson}) {
 let art;
 switch (lesson.id) {
  case 'pose-observation':
   art=<img src="/assets/warrior-ii-playful.webp" alt={t('review.visualAlt')}/>;
   break;
  case 'skeleton-basics':
   art=<SkeletonArt decorative/>;
   break;
  case 'connective-basics':
   art=<ConnectiveArt kind="ligament" decorative/>;
   break;
  case 'nervous-basics':
   art=<NerveArt part="cns" decorative/>;
   break;
  case 'movement-words':
   art=<JointArt joint="knee" progress={.6} decorative/>;
   break;
  case 'breathing-basics':
   art=<BreathArt decorative/>;
   break;
  case 'muscle-roles':
   art=<MuscleArt decorative/>;
   break;
  case 'circulation-basics':
   art=<CirculationArt circuit="pulmonary" decorative/>;
   break;
  default:
   art=<StudyArt moduleId={lesson.primaryModuleId}/>;
 }
 return <div className={`review-question-art review-art-${lesson.primaryModuleId}`}>{art}</div>;
}

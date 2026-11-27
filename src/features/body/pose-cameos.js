// End-of-playback cameos: one small visual pun per pose, drawn by PoseCameo.jsx.
// `at` is the cameo's anchor in the 500 × 460 pose drawing, chosen to sit in the
// figure's empty space at progress 1. `behind` draws it under the figure.
// Humor boundary: wordplay on the pose name only, never bodies, ability or scores.
export const poseCameos={
 'warrior-ii':{line:'Flag planted. Mat claimed.',overlay:true},
 'warrior-i':{line:'Rise and shine.',at:[92,150],behind:true},
 'warrior-iii':{line:'Cleared for takeoff.',at:[150,92]},
 mountain:{line:'Some light weather up top.',at:[392,100]},
 chair:{line:'Chair not included.',at:[200,402],behind:true},
 tree:{line:'New neighbour moved in.',at:[256,34]},
 'downward-dog':{line:'A very good student.',at:[282,402]},
 'upward-facing-dog':{line:'Someone’s waiting for a throw.',at:[428,402]},
 cat:{line:'Approved by the cat.',at:[86,402]},
 cow:{line:'Moo-ving right along.',at:[78,402]},
 cobra:{line:'Hiss-terically calm.',at:[426,402]},
 eagle:{line:'Fly-by inspection.',at:[392,118]},
 'easy-pose':{line:'Tea’s ready.',at:[396,378]},
 savasana:{line:'The hardest pose: doing nothing.',at:[150,282]},
 'childs-pose':{line:'Nap buddy on duty.',at:[252,330]},
 'standing-forward-bend':{line:'Stopped to smell the flowers.',at:[378,402]},
 'seated-forward-bend':{line:'Folding is contagious.',at:[140,150]},
 triangle:{line:'Ting!',at:[104,132]},
 'extended-side-angle':{line:'Geometry class, but calmer.',at:[418,160]},
 plank:{line:'Level confirmed.',at:[262,236]},
 'low-lunge':{line:'Moonrise.',at:[96,108],behind:true},
 'bound-angle':{line:'Butterfly approved.',at:[386,140]},
 bridge:{line:'Smooth sailing below.',at:[294,398]},
 'supine-twist':{line:'A sweet little twist.',at:[380,196]},
 camel:{line:'Hump day.',at:[404,402]},
 fish:{line:'Something’s fishy here.',at:[352,282]},
 locust:{line:'Hop on in.',at:[428,402]},
 boat:{line:'Ahoy, captain.',at:[104,400]},
 'happy-baby':{line:'Rattle approved.',at:[364,300]},
 dolphin:{line:'Making a splash.',at:[112,172]},
 pigeon:{line:'Will pose for crumbs.',at:[412,402]},
 crow:{line:'Two crows, one mat.',at:[122,402]},
};
export function cameoFor(poseId){return poseCameos[poseId]??null;}
// Translated line when the translator has one (key cameo.<poseId>), otherwise the English line.
export function cameoLine(poseId,translate){
 const english=cameoFor(poseId)?.line??null;
 if(!translate)return english;
 const key=`cameo.${poseId}`,text=translate(key);
 return text===key?english:text;
}

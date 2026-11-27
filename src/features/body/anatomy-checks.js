// "One small check" questions on the anatomy explorers.
export const anatomyChecks={
 breathing:{prompt:'During quiet inspiration, the diaphragm…',options:['Contracts and descends','Relaxes and rises'],correct:'Contracts and descends',why:'This helps enlarge the chest cavity.'},
 muscles:{prompt:'A muscle with the opposing action is an…',options:['Antagonist','Agonist'],correct:'Antagonist',why:'Roles depend on which action you are describing.'},
 shoulder:{prompt:'An arm moves out to the side. What is that movement?',options:['Abduction','Adduction'],correct:'Abduction',why:'Abduction moves the limb away from the body’s midline.'},
 hip:{prompt:'A leg moves back toward the midline. What is that movement?',options:['Abduction','Adduction'],correct:'Adduction',why:'Adduction brings the limb toward the body’s midline.'},
 knee:{prompt:'Bending the knee is called…',options:['Flexion','Extension'],correct:'Flexion',why:'Flexion decreases the angle between the bones at the knee.'},
 nervous:{prompt:'Which pair belongs to the CNS?',options:['Brain + spinal cord','Peripheral nerves + ganglia'],correct:'Brain + spinal cord',why:'The brain and spinal cord form the central nervous system.'},
};
// A miss names the right answer first; otherwise the explanation can read as praise for the wrong choice.
export function checkFeedback(check,answer,translate){
 const correct=answer===check.correct;
 const lead=correct?(translate?.('check.right')??'That’s it.'):(translate?.('check.miss',{answer:check.correct})??`A useful one to revisit. The answer is “${check.correct}”.`);
 return {correct,text:`${lead} ${check.why}`};
}
// Overlay {regionId:{prompt,options,correct,why}} from content/id/anatomy-checks.json; missing parts stay English.
export function localizeChecks(checks,overlay={}){
 return Object.fromEntries(Object.entries(checks).map(([id,check])=>[id,{...check,...(overlay[id]??{})}]));
}

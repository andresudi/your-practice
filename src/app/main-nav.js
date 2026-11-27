// Header links. Home's cards (src/features/study/home-doors.js) reuse this order and wording.
export const mainNav=[
 {id:'study',label:'Study path',href:'/study',pages:['study','module','lesson','review','teaching']},
 {id:'poses',label:'Poses',href:'/poses',pages:['poses','pose']},
 {id:'anatomy',label:'Anatomy',href:'/anatomy',pages:['anatomy-index','anatomy']},
];
export function activeSection(page){return mainNav.find(item=>item.pages.includes(page))?.id??null;}

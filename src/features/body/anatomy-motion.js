const clamp=n=>Math.min(1,Math.max(0,n));
// Schematic geometry for vocabulary study; the slider is not a range-of-motion target.
export function jointGeometry(joint,progress){
 const t=clamp(progress);
 const pivot=joint==='shoulder'?[290,150]:joint==='hip'?[250,235]:[250,230];
 const length=joint==='shoulder'?155:145;
 const angle=joint==='knee'?Math.PI/2-t*1.35:Math.PI/2-t*1.25;
 return {pivot,length,end:[pivot[0]+Math.cos(angle)*length,pivot[1]+Math.sin(angle)*length],angle};
}
export function signalAt(progress){const t=clamp(progress),stage=Math.min(2,Math.floor(t*3));return {stage,local:clamp(t*3-stage)};}

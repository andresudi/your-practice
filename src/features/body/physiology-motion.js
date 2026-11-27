const clamp=t=>Math.max(0,Math.min(1,t));
export function breathAt(progress){const t=clamp(progress),amount=(1-Math.cos(t*2*Math.PI))/2;return {phase:t<.5?'inspiration':'expiration',amount,diaphragmY:275+amount*35,lungScale:1+amount*.13};}
export function muscleAt(progress){const t=clamp(progress),amount=(1-Math.cos(t*2*Math.PI))/2,angle=Math.PI/2-amount*2.3;return {amount,phase:t<.5?'Flexion':'Extension',agonist:t<.5?'Biceps':'Triceps',antagonist:t<.5?'Triceps':'Biceps',wrist:[250+Math.cos(angle)*120,240+Math.sin(angle)*120]};}

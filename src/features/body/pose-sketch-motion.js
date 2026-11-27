import {additionalPoseSketches} from './pose-sketches-additional.js';

export const poseSketches={
 mountain:{head:[250,81],neck:[[250,110],[250,135]],torso:'M222 136 Q250 125 278 136 L268 231 Q250 243 232 231Z',arms:[[[224,146],[207,200],[200,262]],[[276,146],[293,200],[300,262]]],legs:[[[237,236],[232,314],[227,398]],[[263,236],[268,314],[273,398]]],feet:[[[227,398],[211,403]],[[273,398],[289,403]]],markers:{shoulder:[222,145],hip:[239,236],knee:[232,314]}},
 tree:{head:[246,78],neck:[[246,108],[246,133]],torso:'M218 136 Q246 124 274 136 L265 231 Q246 243 229 231Z',arms:[[[222,144],[206,199],[246,166]],[[270,144],[286,199],[250,166]]],legs:[[[237,236],[233,314],[227,398]],[[258,235],[322,286],[243,275]]],feet:[[[227,398],[209,403]],[[243,275],[239,254]]],markers:{shoulder:[270,145],hip:[258,235],knee:[322,286]}},
 chair:{head:[273,114],neck:[[266,141],[257,160]],torso:'M237 154 Q261 151 277 174 L233 271 Q206 284 194 262Z',arms:[[[244,164],[279,111],[305,50]],[[267,175],[305,120],[330,57]]],legs:[[[211,269],[288,315],[260,397]],[[230,272],[305,316],[282,397]]],feet:[[[260,397],[290,404]],[[282,397],[312,404]]],markers:{shoulder:[267,175],hip:[230,272],knee:[305,316]}},
 'downward-dog':{head:[185,290],headTurn:-35,neck:[[191,260],[194,275]],torso:'M171 248 L258 148 Q280 142 294 166 L210 270Z',arms:[[[181,259],[132,320],[91,394]],[[208,266],[156,325],[114,394]]],legs:[[[271,161],[329,270],[373,391]],[[286,169],[350,273],[394,391]]],feet:[[[373,391],[350,403]],[[394,391],[373,403]]],markers:{shoulder:[208,266],hip:[279,164],knee:[350,273]}},
 'easy-pose':{head:[250,152],neck:[[250,182],[250,210]],torso:'M220 210 Q250 202 280 210 L272 307 Q250 318 228 307Z',arms:[[[224,225],[202,280],[202,330]],[[276,225],[298,280],[298,330]]],legs:[[[235,312],[180,343],[245,370]],[[265,312],[320,343],[255,370]]],feet:[[[245,370],[275,375]],[[255,370],[225,375]]],markers:{shoulder:[224,225],hip:[235,312],knee:[180,343]}},
 savasana:{head:[117,343],headTurn:-80,neck:[[145,350],[163,350]],torso:'M162 335 Q225 330 280 345 L280 375 Q220 377 162 365Z',arms:[[[185,347],[180,380],[205,390]],[[205,347],[225,380],[245,390]]],legs:[[[275,358],[335,371],[400,389]],[[270,367],[325,382],[388,393]]],feet:[[[400,389],[425,392]],[[388,393],[415,396]]],markers:{shoulder:[183,348],hip:[275,360],knee:[335,371]}},
 'warrior-i':{head:[250,92],neck:[[250,122],[250,143]],torso:'M221 146 Q250 130 278 147 L269 244 Q250 257 229 244Z',arms:[[[228,155],[207,108],[195,58]],[[270,155],[291,108],[304,58]]],legs:[[[238,244],[175,314],[171,396]],[[263,244],[322,313],[375,393]]],feet:[[[171,396],[145,402]],[[375,393],[399,401]]],markers:{shoulder:[270,155],hip:[263,244],knee:[175,314]}},
 triangle:{head:[355,149],headTurn:-20,neck:[[327,171],[309,190]],torso:'M289 179 Q314 167 333 183 L279 265 Q258 270 246 250Z',arms:[[[320,180],[360,120],[380,63]],[[300,195],[280,275],[258,381]]],legs:[[[250,256],[190,326],[163,395]],[[270,256],[336,325],[390,395]]],feet:[[[163,395],[139,402]],[[390,395],[414,402]]],markers:{shoulder:[320,180],hip:[261,256],knee:[336,325]}},
 'low-lunge':{head:[250,95],neck:[[250,124],[250,145]],torso:'M221 147 Q250 134 279 149 L267 247 Q250 257 231 248Z',arms:[[[227,155],[209,111],[198,61]],[[273,155],[291,111],[302,61]]],legs:[[[236,250],[170,316],[175,395]],[[264,250],[310,390],[385,394]]],feet:[[[175,395],[149,403]],[[385,394],[411,402]]],markers:{shoulder:[273,155],hip:[264,250],knee:[170,316]}},
 cobra:{head:[345,225],headTurn:-20,neck:[[320,247],[300,267]],torso:'M178 365 Q235 365 293 273 L318 289 Q283 377 191 385Z',arms:[[[295,284],[305,334],[305,392]],[[280,296],[268,342],[268,392]]],legs:[[[190,375],[145,384],[95,394]],[[209,379],[166,387],[121,396]]],feet:[[[95,394],[75,402]],[[121,396],[101,404]]],markers:{shoulder:[295,284],hip:[190,375],knee:[145,384]}},
 'childs-pose':{head:[352,345],headTurn:60,neck:[[331,351],[310,360]],torso:'M215 328 Q260 324 326 345 L316 371 Q260 365 215 353Z',arms:[[[317,355],[366,379],[420,394]],[[305,361],[350,387],[405,398]]],legs:[[[220,345],[179,376],[124,394]],[[239,350],[197,384],[146,396]]],feet:[[[124,394],[95,403]],[[146,396],[122,403]]],markers:{shoulder:[317,355],hip:[220,345],knee:[179,376]}},
 ...additionalPoseSketches
};

const clamp=t=>Math.max(0,Math.min(1,Number.isFinite(t)?t:1));
const mix=(a,b,t)=>a+(b-a)*t;
const point=(a,b,t)=>a.map((n,i)=>mix(n,b[i],t));
const move=(p,d)=>p.map((n,i)=>n+d[i]);
const length=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1]);
// Two fixed-length segments. Only illustrative, reachable endpoints are used.
function bend(base,start,end){
 const a=length(base[0],base[1]),b=length(base[1],base[2]);
 const dx=end[0]-start[0],dy=end[1]-start[1],d=Math.hypot(dx,dy),ux=dx/d,uy=dy/d;
 const along=(a*a-b*b+d*d)/(2*d),height=Math.sqrt(Math.max(0,a*a-along*along));
 const cross=(base[1][0]-base[0][0])*(base[2][1]-base[0][1])-(base[1][1]-base[0][1])*(base[2][0]-base[0][0]);
 const side=cross>0?-1:1;
 return [start,[start[0]+ux*along-uy*height*side,start[1]+uy*along+ux*height*side],end];
}
function rotate(limb,angle){const root=limb[0],c=Math.cos(angle),s=Math.sin(angle);return limb.map(p=>{const x=p[0]-root[0],y=p[1]-root[1];return [root[0]+x*c-y*s,root[1]+x*s+y*c];});}
function movePath(path,delta){let index=0;return path.replace(/-?\d+(?:\.\d+)?/g,n=>String(Number(n)+delta[index++%2]));}
function blendPath(from,to,t){const values=[...from.matchAll(/-?\d+(?:\.\d+)?/g)].map(match=>Number(match[0]));let index=0;return to.replace(/-?\d+(?:\.\d+)?/g,n=>String(mix(values[index++],Number(n),t)));}
/** Small illustrative movements, not a reviewed entry/exit or physical practice sequence. */
export function poseSketchAt(id,progress=1){
 const base=poseSketches[id];if(!base)return null;
 const t=clamp(progress);if(t===1)return base;
 const remaining=1-t*t*(3-2*t),out=structuredClone(base);
 const shift=id==='chair'?[22*remaining,-20*remaining]:id==='downward-dog'?[-10*remaining,18*remaining]:[0,0];
 if(id==='chair'||id==='downward-dog'){
  out.head=move(base.head,shift);out.neck=base.neck.map(p=>move(p,shift));out.torso=movePath(base.torso,shift);
  out.legs=base.legs.map(limb=>bend(limb,move(limb[0],shift),limb[2]));
  out.arms=id==='downward-dog'?base.arms.map(limb=>bend(limb,move(limb[0],shift),limb[2])):base.arms.map(limb=>limb.map(p=>move(p,shift)));
 }
 if(id==='mountain')out.arms=base.arms.map((limb,i)=>rotate(limb,(i?-1:1)*remaining*.45));
 if(id==='tree'){
  const ankle=point(base.legs[1][2],[263,392],remaining);
  out.legs[1]=bend(base.legs[1],base.legs[1][0],ankle);
  const footAngle=mix(Math.atan2(-21,-4),0,remaining),footLength=length(base.feet[1][0],base.feet[1][1]);
  out.feet[1]=[ankle,[ankle[0]+Math.cos(footAngle)*footLength,ankle[1]+Math.sin(footAngle)*footLength]];
  out.arms=base.arms.map((limb,i)=>bend(limb,limb[0],point(limb[2],i?[287,239]:[206,239],remaining)));
 }
 if(id==='cat'||id==='cow'){
  const neutralTorso='M185 303 Q254 311 332 303 L320 333 Q252 335 196 340Z';
  const neutralNeck=[[349,290],[326,301]],eased=1-remaining;
  out.head=point([373,300],base.head,eased);
  out.headTurn=(base.headTurn||0)*eased;
  out.neck=base.neck.map((p,i)=>point(neutralNeck[i],p,eased));
  out.torso=blendPath(neutralTorso,base.torso,eased);
 }
 if(['easy-pose','savasana','warrior-i','triangle','low-lunge','cobra','childs-pose'].includes(id)||additionalPoseSketches[id]){
  const amplitude=['cat','cow'].includes(id)?0:['plank','upward-facing-dog','dolphin','crow'].includes(id)?.07:id==='savasana'?.1:.16;
  if(amplitude)out.arms=base.arms.map((limb,i)=>rotate(limb,(i?1:-1)*remaining*amplitude));
 }
 out.markers.shoulder=move(base.markers.shoulder,shift);
 out.markers.hip=move(base.markers.hip,shift);
 const kneeIndex=id==='mountain'?0:1;
 out.markers.knee=out.legs[kneeIndex][1];
 return out;
}

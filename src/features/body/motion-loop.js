// Drives an animation from requestAnimationFrame. `step(seconds)` receives the
// clamped time since the previous frame; returning false ends the loop.
// No document.hidden check: browsers already pause frames for truly hidden tabs,
// and some embedded panes report hidden while visible, which froze every figure.
export function startMotionLoop(step,{raf=globalThis.requestAnimationFrame,cancel=globalThis.cancelAnimationFrame,maxDelta=.05}={}){
 let frame,last=null,stopped=false;
 function tick(time){
  if(stopped)return;
  if(last!==null&&step(Math.min(maxDelta,(time-last)/1000))===false){stopped=true;return;}
  last=time;frame=raf(tick);
 }
 frame=raf(tick);
 return()=>{stopped=true;cancel(frame);};
}

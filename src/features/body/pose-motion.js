const clamp = (n, min=0, max=1) => Math.min(max, Math.max(min, n));
const smooth = t => { t=clamp(t); return t*t*(3-2*t); };
const lerp = (a,b,t) => a+(b-a)*t;

/** A schematic animation for design review, not a validated movement protocol. */
export function poseAt(progress) {
  const t=clamp(progress), open=smooth(t/.48), settle=smooth((t-.48)/.52);
  return {
    pelvis:[0,lerp(lerp(2.04,1.6,open),1.35,settle),0],
    leftAnkle:[lerp(lerp(-.26,-1.38,open),-1.69,settle),.17,0],
    rightAnkle:[lerp(lerp(.26,1.38,open),1.2,settle),.17,0],
    armAngle:lerp(-1.44,0,open),
    headTurn:lerp(.05,1.1,settle),
    frontFootTurn:lerp(0,Math.PI/2,open),
    stage:t<.26?0:t<.72?1:2,
  };
}

/** Planar two-bone inverse kinematics; clamps the solve near full extension. */
export function solveKnee(hip,ankle,thigh,shin,side) {
  const dx=ankle[0]-hip[0],dy=ankle[1]-hip[1];
  const raw=Math.hypot(dx,dy),d=clamp(raw,Math.abs(thigh-shin)+.00001,thigh+shin-.00001);
  const a=(thigh*thigh-shin*shin+d*d)/(2*d),h=Math.sqrt(Math.max(0,thigh*thigh-a*a));
  const ux=dx/raw,uy=dy/raw;
  return [hip[0]+ux*a-uy*h*side,hip[1]+uy*a+ux*h*side,hip[2]];
}

export function advanceMotion(progress,deltaSeconds,duration,loop) {
  const next=progress+Math.max(0,deltaSeconds)/duration;
  if(next>=1) return loop?{progress:next%1,playing:true}:{progress:1,playing:false};
  return {progress:next,playing:true};
}

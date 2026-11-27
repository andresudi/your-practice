import {useEffect,useRef} from 'react';
import {t} from '../../i18n/index.js';
import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';
import {poseAt,solveKnee} from './pose-motion.js';

const v = a => new THREE.Vector3(...a);
const Y = new THREE.Vector3(0,1,0);

function makeCharacter() {
  const group=new THREE.Group();
  const materials={
    skin:new THREE.MeshStandardMaterial({color:'#e2a88b',roughness:.88}),
    top:new THREE.MeshStandardMaterial({color:'#b87661',roughness:1}),
    pants:new THREE.MeshStandardMaterial({color:'#627e68',roughness:1}),
    hair:new THREE.MeshStandardMaterial({color:'#635071',roughness:.9}),
    dark:new THREE.MeshStandardMaterial({color:'#4c3943',roughness:1}),
    blush:new THREE.MeshStandardMaterial({color:'#c98077',roughness:1}),
  };
  function ellipsoid(parent,position,scale,material){
    const mesh=new THREE.Mesh(new THREE.SphereGeometry(1,32,24),material);
    mesh.position.fromArray(position);mesh.scale.fromArray(scale);mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);return mesh;
  }
  function segment(radius1,radius2,material){
    const mesh=new THREE.Mesh(new THREE.CylinderGeometry(radius1,radius2,1,24),material);mesh.castShadow=true;mesh.receiveShadow=true;group.add(mesh);
    return (a,b)=>{const av=v(a),bv=v(b);mesh.position.copy(av).add(bv).multiplyScalar(.5);const direction=bv.sub(av);mesh.scale.y=direction.length();mesh.quaternion.setFromUnitVectors(Y,direction.normalize());};
  }
  const hips=ellipsoid(group,[0,0,0],[.37,.29,.22],materials.pants);
  const waist=ellipsoid(group,[0,0,0],[.295,.3,.19],materials.skin);
  const torso=new THREE.Mesh(new THREE.LatheGeometry([
    [0,0],[.29,0],[.31,.07],[.315,.17],[.29,.27],[.3,.43],[.35,.62],[.39,.74],[.385,.82],[.32,.89],[.23,.93],[0,.94]
  ].map(p=>new THREE.Vector2(...p)),40),materials.top);
  torso.scale.z=.58;torso.castShadow=true;torso.receiveShadow=true;group.add(torso);
  const neck=ellipsoid(group,[0,0,0],[.105,.20,.105],materials.skin);
  const head=new THREE.Group();group.add(head);
  ellipsoid(head,[0,.02,-.045],[.26,.345,.25],materials.hair);
  ellipsoid(head,[0,-.005,.07],[.232,.295,.205],materials.skin);
  ellipsoid(head,[-.205,-.015,.035],[.047,.077,.045],materials.skin);
  ellipsoid(head,[.205,-.015,.035],[.047,.077,.045],materials.skin);
  const fringe=ellipsoid(head,[-.115,.225,.13],[.20,.13,.15],materials.hair);fringe.rotation.z=.48;
  ellipsoid(head,[.05,.32,-.12],[.17,.17,.16],materials.hair);
  ellipsoid(head,[.04,.42,-.16],[.11,.10,.10],materials.hair);
  ellipsoid(head,[0,-.035,.274],[.036,.039,.035],materials.skin);
  for(const x of [-.091,.091]){
    const points=[new THREE.Vector3(x-.036,.044,.25),new THREE.Vector3(x,.029,.265),new THREE.Vector3(x+.036,.044,.25)];
    const eye=new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points),12,.009,5,false),materials.dark);head.add(eye);
    ellipsoid(head,[x*1.34,-.061,.244],[.036,.019,.008],materials.blush);
  }
  const smile=new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([v([-.043,-.128,.245]),v([0,-.141,.259]),v([.043,-.128,.245])]),12,.007,5,false),materials.blush);head.add(smile);
  const limbs=[];
  for(const sign of [-1,1]){
    const shoulder=ellipsoid(group,[0,0,0],[.12,.13,.115],materials.skin);
    const elbow=ellipsoid(group,[0,0,0],[.085,.085,.085],materials.skin);
    const wrist=ellipsoid(group,[0,0,0],[.062,.065,.059],materials.skin);
    const hand=ellipsoid(group,[0,0,0],[.075,.145,.037],materials.skin);
    const upperArm=segment(.09,.12,materials.skin),forearm=segment(.058,.086,materials.skin);
    const knee=ellipsoid(group,[0,0,0],[.142,.142,.142],materials.pants);
    const thigh=segment(.14,.185,materials.pants),shin=segment(.08,.141,materials.pants);
    const ankle=ellipsoid(group,[0,0,0],[.075,.095,.078],materials.skin);
    const foot=ellipsoid(group,[0,0,0],[.11,.077,.25],materials.skin);
    limbs.push({sign,shoulder,elbow,wrist,hand,upperArm,forearm,knee,thigh,shin,ankle,foot});
  }
  function apply(progress,breathe=0){
    const p=poseAt(progress),y=p.pelvis[1],lift=breathe*.008;
    hips.position.set(0,y,0);waist.position.set(0,y+.32,0);torso.position.set(0,y+.37+lift,0);torso.scale.y=1+breathe*.004;
    neck.position.set(0,y+1.33+lift,0);head.position.set(0,y+1.65+lift,.018);head.rotation.y=p.headTurn;
    const positions={};
    for(const limb of limbs){
      const s=limb.sign;
      const shoulder=[s*.38,y+1.1+lift,0],elbow=[shoulder[0]+s*Math.cos(p.armAngle)*.58,shoulder[1]+Math.sin(p.armAngle)*.58,.008];
      const wrist=[elbow[0]+s*Math.cos(p.armAngle+.015)*.57,elbow[1]+Math.sin(p.armAngle+.015)*.57,.017];
      const hand=[wrist[0]+s*Math.cos(p.armAngle)*.11,wrist[1]+Math.sin(p.armAngle)*.11,.017];
      limb.shoulder.position.fromArray(shoulder);limb.elbow.position.fromArray(elbow);limb.wrist.position.fromArray(wrist);limb.hand.position.fromArray(hand);
      limb.hand.quaternion.setFromUnitVectors(Y,v([s*Math.cos(p.armAngle),Math.sin(p.armAngle),0]));limb.hand.rotation.y=.15;
      limb.upperArm(shoulder,elbow);limb.forearm(elbow,wrist);
      const hip=[s*.21,y,0],ankle=s<0?p.leftAnkle:p.rightAnkle,knee=solveKnee(hip,ankle,1.04,.85,s);
      limb.knee.position.fromArray(knee);limb.thigh(hip,knee);limb.shin(knee,[ankle[0],ankle[1]+.04,ankle[2]]);limb.ankle.position.fromArray(ankle);
      const turn=s>0?p.frontFootTurn:-.18;
      limb.foot.position.set(ankle[0]+Math.sin(turn)*.105,.092,Math.cos(turn)*.105);limb.foot.rotation.y=turn;
      if(s>0){positions.shoulder=shoulder;positions.hip=hip;positions.knee=knee;}
    }
    return positions;
  }
  return {group,apply};
}

export default function PoseScene({progress,playing,bodyMap,selected,reducedMotion,cameraView,onReady,onFailure,onThumbnails,onOrbitStart,markerRefs}){
 const host=useRef(null),latest=useRef({});
 latest.current={progress,playing,bodyMap,selected,reducedMotion,cameraView,onReady,onFailure,onThumbnails,onOrbitStart};
 useEffect(()=>{
  const element=host.current;
  let renderer;
  try{renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,powerPreference:'low-power'});}catch{latest.current.onFailure();return;}
  renderer.setPixelRatio(Math.min(devicePixelRatio,1.75));
  renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.08;
  renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFShadowMap;
  renderer.domElement.setAttribute('aria-hidden','true');element.appendChild(renderer.domElement);
  const scene=new THREE.Scene();
  const camera=new THREE.PerspectiveCamera(35,1,.1,50);camera.position.set(.25,3.7,8.8);
  const controls=new OrbitControls(camera,renderer.domElement);controls.target.set(0,1.65,0);controls.enablePan=false;controls.enableZoom=false;controls.enableDamping=true;controls.dampingFactor=.08;controls.minAzimuthAngle=-.65;controls.maxAzimuthAngle=.65;controls.minPolarAngle=1.16;controls.maxPolarAngle=1.48;controls.rotateSpeed=.6;
  scene.add(new THREE.HemisphereLight('#fffaf1','#c5cbb6',2.1));
  const key=new THREE.DirectionalLight('#fff7ed',3.0);key.position.set(-3,7,5);key.castShadow=true;key.shadow.mapSize.set(2048,2048);key.shadow.camera.left=-4;key.shadow.camera.right=4;key.shadow.camera.top=5;key.shadow.camera.bottom=-4;key.shadow.bias=-.0004;key.shadow.normalBias=.02;key.shadow.radius=4;scene.add(key);
  const rim=new THREE.DirectionalLight('#e4d2f2',1.6);rim.position.set(3,3,-3);scene.add(rim);
  const floor=new THREE.Mesh(new THREE.PlaneGeometry(100,100),new THREE.ShadowMaterial({opacity:.12}));floor.rotation.x=-Math.PI/2;floor.position.y=-.035;floor.receiveShadow=true;scene.add(floor);
  const mat=new THREE.Mesh(new RoundedBoxGeometry(4.2,.04,1.5,5,.09),new THREE.MeshStandardMaterial({color:'#9baa97',roughness:1}));mat.position.y=.014;mat.receiveShadow=true;scene.add(mat);
  const halo=new THREE.Mesh(new THREE.CircleGeometry(2.27,96),new THREE.MeshBasicMaterial({color:'#e9e1e9',transparent:true,opacity:.68,depthWrite:false}));halo.position.set(0,2,-1.25);scene.add(halo);
  const ring=new THREE.Mesh(new THREE.TorusGeometry(2.33,.006,8,100),new THREE.MeshBasicMaterial({color:'#cdbed3',transparent:true,opacity:.65}));ring.position.copy(halo.position);scene.add(ring);
  const groundRing=new THREE.Mesh(new THREE.RingGeometry(2.63,2.639,120),new THREE.MeshBasicMaterial({color:'#cdd4c6',side:THREE.DoubleSide,transparent:true,opacity:.7}));groundRing.rotation.x=-Math.PI/2;groundRing.position.y=-.028;scene.add(groundRing);
  const character=makeCharacter();scene.add(character.group);
  const highlights={};
  for(const id of ['shoulder','hip','knee']){
    const mesh=new THREE.Mesh(new THREE.SphereGeometry(.19,24,16),new THREE.MeshBasicMaterial({color:'#bba0cc',transparent:true,opacity:.22,depthTest:false,depthWrite:false}));mesh.renderOrder=3;scene.add(mesh);highlights[id]=mesh;
  }
  const particleGeometry=new THREE.BufferGeometry();const positions=new Float32Array(24*3);
  for(let i=0;i<24;i++){const angle=i*2.39996;positions[i*3]=Math.cos(angle)*(1.9+(i%4)*.27);positions[i*3+1]=.7+(i%8)*.42;positions[i*3+2]=-.5+Math.sin(angle)*.8;}
  particleGeometry.setAttribute('position',new THREE.BufferAttribute(positions,3));
  const particles=new THREE.Points(particleGeometry,new THREE.PointsMaterial({color:'#b8abbe',size:.019,transparent:true,opacity:.5,depthWrite:false}));scene.add(particles);
  let width=1,height=1,frame=0,clock=0,previous=performance.now(),lastCamera='front',alive=true;
  function resize(){const box=element.getBoundingClientRect();width=box.width;height=box.height;renderer.setSize(width,height);camera.aspect=width/height;camera.fov=width<600?38:33;camera.position.z=width<600?8.4:8.8;camera.updateProjectionMatrix();}
  const observer=new ResizeObserver(resize);observer.observe(element);resize();controls.update();
  const orbitStart=()=>latest.current.onOrbitStart();
  controls.addEventListener('start',orbitStart);
  const images=[];
  renderer.setSize(320,240,false);camera.aspect=4/3;camera.fov=36;camera.position.set(.3,3.65,8.9);camera.updateProjectionMatrix();controls.update();
  for(const phase of [0,.48,1]){character.apply(phase);Object.values(highlights).forEach(m=>m.visible=false);renderer.render(scene,camera);images.push(renderer.domElement.toDataURL('image/png'));}
  latest.current.onThumbnails(images);resize();
  function animate(time){
    if(!alive)return;frame=requestAnimationFrame(animate);
    const props=latest.current,delta=Math.min(.05,(time-previous)/1000);previous=time;
    if(props.playing&&!props.reducedMotion)clock+=delta;
    if(props.cameraView!==lastCamera&&props.cameraView!=='free'){lastCamera=props.cameraView;const angle=lastCamera==='angle'?.43:lastCamera==='left'?-.43:0;camera.position.set(Math.sin(angle)*8.8,3.7,Math.cos(angle)*8.8);controls.target.set(0,1.65,0);}
    if(props.cameraView==='free')lastCamera='free';
    controls.enableDamping=!props.reducedMotion;controls.update();
    const jointPositions=character.apply(props.progress,Math.sin(clock*1.8));
    halo.scale.setScalar(1+(props.reducedMotion?0:Math.sin(clock*.7)*.018));particles.rotation.y=clock*.025;
    for(const [id,point] of Object.entries(jointPositions)){
      const m=highlights[id];m.position.fromArray(point);m.visible=props.bodyMap;m.material.opacity=id===props.selected ? .3 : .12;m.scale.setScalar(id===props.selected?1.12+Math.sin(clock*3)*.08:.85);
      const el=markerRefs.current[id];
      if(el){const projected=v(point).project(camera);el.style.left=`${(projected.x*.5+.5)*width}px`;el.style.top=`${(-projected.y*.5+.5)*height}px`;}
    }
    renderer.render(scene,camera);
  }
  const lost=e=>{e.preventDefault();latest.current.onFailure();};renderer.domElement.addEventListener('webglcontextlost',lost);
  frame=requestAnimationFrame(animate);latest.current.onReady();
  return()=>{alive=false;cancelAnimationFrame(frame);observer.disconnect();controls.removeEventListener('start',orbitStart);controls.dispose();renderer.domElement.removeEventListener('webglcontextlost',lost);const geometries=new Set(),materials=new Set();scene.traverse(obj=>{if(obj.geometry)geometries.add(obj.geometry);if(obj.material)(Array.isArray(obj.material)?obj.material:[obj.material]).forEach(m=>materials.add(m));});geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());renderer.dispose();renderer.domElement.remove();};
 },[]);
 return <div ref={host} className="pose-webgl" role="img" aria-label={t('scene.label')}/>;
}

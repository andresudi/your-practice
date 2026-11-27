/** Choose a published starting lesson for a short personal revision loop. */
export function getRevisionStart(lessons,state={}){
 const available=lessons.filter(lesson=>lesson.publication==='published');
 return available.find(lesson=>state.lessonStatuses?.[lesson.id]==='revisit')
  ||available.find(lesson=>lesson.id===state.lastLessonId)
  ||available.find(lesson=>state.lessonStatuses?.[lesson.id]!=='reviewed')
  ||available[0]
  ||null;
}

/** Keep a lesson's back link tied to the collection that owns it. */
export function getLessonCollection(lesson,modules){
 const module=modules.find(item=>item.id===lesson.primaryModuleId);
 return module?{href:`/study/${module.slug}`,label:module.title}:{href:'/study',label:'Study path'};
}

/** A pose-origin review can return to that pose; other reviews return to their lesson. */
export function getReviewReturn(bundle,lessonId,fromPoseId){
 const lesson=bundle.lessons.find(item=>item.id===lessonId);
 const pose=bundle.poses.find(item=>item.id===fromPoseId&&item.lessonIds.includes(lessonId));
 if(lesson&&pose)return {href:`/poses/${pose.slug}`,label:pose.englishName};
 return lesson?{href:`/learn/${lesson.slug}`,label:'lesson'}:{href:'/study',label:'study path'};
}

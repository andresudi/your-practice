/** Coverage counts published lessons only; personal review is a separate status. */
export function getCoverage(bundle,state={}){
  return bundle.modules.map(module=>{
    const topics=bundle.topics.filter(t=>t.moduleId===module.id);
    const lessons=bundle.lessons.filter(l=>l.publication==='published'&&(l.primaryModuleId===module.id||topics.some(t=>t.lessonIds.includes(l.id))));
    const ids=new Set(lessons.map(l=>l.id));
    return {moduleId:module.id,totalTopics:topics.length,coveredTopics:topics.filter(t=>t.lessonIds.some(id=>ids.has(id))).length,publishedLessonCount:ids.size,reviewedLessonCount:[...ids].filter(id=>state.lessonStatuses?.[id]==='reviewed').length};
  });
}

/** Classifies the support currently available for one public-outline topic. */
export function getTopicSupport(topic,lessons){
 const linked=topic.lessonIds.map(id=>lessons.find(lesson=>lesson.id===id)).filter(Boolean);
 if(linked.some(lesson=>lesson.publication==='published'))return {kind:'introduction'};
 if(linked.length)return {kind:'draft'};
 if(topic.teacherPrompt)return {kind:'teacher-led',prompt:topic.teacherPrompt};
 return {kind:'planned'};
}

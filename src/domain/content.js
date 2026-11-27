/** Check references and publication evidence; this does not certify expertise. */
export function validateContent(bundle) {
  const issues=[];
  const error=(recordId,reason)=>issues.push({severity:'error',recordId,reason});
  const collections=['modules','topics','sources','lessons','poses','questions','regions'];
  const ids={};
  for(const name of collections){ ids[name]=new Set();for(const item of bundle[name]||[]){if(!item.id||ids[name].has(item.id))error(item.id,`Duplicate or missing ${name} ID`);ids[name].add(item.id);} }
  const topicsById=new Map(bundle.topics.map(item=>[item.id,item]));
  const lessonsById=new Map(bundle.lessons.map(item=>[item.id,item]));
  const refs=(item,key,target)=>{for(const id of item[key]||[])if(!ids[target].has(id))error(item.id,`Unknown ${target} reference: ${id}`);};
  for(const topic of bundle.topics){if(!ids.modules.has(topic.moduleId))error(topic.id,'Unknown module');refs(topic,'sourceIds','sources');refs(topic,'lessonIds','lessons');if(topic.teacherPrompt!==undefined&&(topic.lessonIds?.length||typeof topic.teacherPrompt!=='string'||!topic.teacherPrompt.trim()))error(topic.id,'Teacher-led prompt must be nonempty and have no lesson link');for(const id of topic.lessonIds||[]){const lesson=lessonsById.get(id);if(lesson&&!lesson.topicIds?.includes(topic.id))error(topic.id,`Reciprocal lesson link missing: ${id}`);}}
  for(const lesson of bundle.lessons){
    if(!ids.modules.has(lesson.primaryModuleId))error(lesson.id,'Unknown primary module');
    for(const [key,target] of [['topicIds','topics'],['sourceIds','sources'],['activityIds','questions'],['relatedPoseIds','poses']])refs(lesson,key,target);
    for(const id of lesson.topicIds||[]){const topic=topicsById.get(id);if(topic&&!topic.lessonIds?.includes(lesson.id))error(lesson.id,`Reciprocal topic link missing: ${id}`);}
    if(lesson.publication==='published'){
      const r=lesson.review;
      if(!r||!['fact-checked','educator-reviewed'].includes(r.status)||!r.reviewer||!r.date||!r.evidence)error(lesson.id,'Published lesson needs review evidence');
      if(lesson.instructional&&r?.status!=='educator-reviewed')error(lesson.id,'Practical instruction needs educator review');
      if(!lesson.sourceIds?.length)error(lesson.id,'Published lesson needs sources');
    }
  }
  for(const pose of bundle.poses){refs(pose,'sourceIds','sources');refs(pose,'regionIds','regions');refs(pose,'lessonIds','lessons');}
  for(const q of bundle.questions){if(!ids.lessons.has(q.lessonId))error(q.id,'Unknown lesson');refs(q,'sourceIds','sources');if(!['choice','label','reflection'].includes(q.kind))error(q.id,'Invalid question kind');if(q.kind==='choice'&&!q.options?.some(o=>o.id===q.answer))error(q.id,'Answer must match option');if(q.kind==='label'&&typeof q.answer!=='string')error(q.id,'Label needs answer');}
  return issues;
}

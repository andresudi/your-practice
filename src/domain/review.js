// Keep sessions broad and short; completed attempts determine exposure, not scores.
export function selectQuestions(bundle, lessonIds, limit = 5, attempts = []) {
  if (!Number.isInteger(limit) || limit < 0) throw Error('Invalid question limit');
  const validIds = new Set(bundle.lessons.map(lesson => lesson.id));
  const ids = new Set(lessonIds.filter(id => validIds.has(id)));
  const seen = new Set();
  const candidates = bundle.questions.filter(question => {
    if (!ids.has(question.lessonId) || seen.has(question.id)) return false;
    seen.add(question.id);
    return true;
  });
  const byId = new Map(candidates.map(question => [question.id, question]));
  const contentOrder = new Map(candidates.map((question, index) => [question.id, index]));
  const exposure = new Map(), lastSeen = new Map(), lessonExposure = new Map();
  attempts.forEach((attempt, index) => {
    for (const id of new Set(attempt.questionIds)) {
      const question = byId.get(id);
      if (!question) continue;
      exposure.set(id, (exposure.get(id) || 0) + 1);
      lastSeen.set(id, index);
      lessonExposure.set(question.lessonId, (lessonExposure.get(question.lessonId) || 0) + 1);
    }
  });
  const selected = [], selectedPerLesson = new Map();
  // Re-sort a private array after each pick so every eligible lesson gets a turn.
  while (candidates.length && selected.length < Math.min(5, limit)) {
    candidates.sort((a, b) =>
      (selectedPerLesson.get(a.lessonId) || 0) - (selectedPerLesson.get(b.lessonId) || 0) ||
      (exposure.get(a.id) || 0) - (exposure.get(b.id) || 0) ||
      (lessonExposure.get(a.lessonId) || 0) - (lessonExposure.get(b.lessonId) || 0) ||
      (lastSeen.get(a.id) ?? -1) - (lastSeen.get(b.id) ?? -1) ||
      contentOrder.get(a.id) - contentOrder.get(b.id)
    );
    const question = candidates.shift();
    selected.push(question);
    selectedPerLesson.set(question.lessonId, (selectedPerLesson.get(question.lessonId) || 0) + 1);
  }
  return selected;
}
const normalize=x=>x.normalize('NFKC').trim().replace(/\s+/gu,' ').toLocaleLowerCase('en');
// Pose names use Roman numerals; learners often type digits ("warrior 2"). Only whole-word I–IV are mapped.
const numerals={i:'1',ii:'2',iii:'3',iv:'4'};
const normalizeLabel=x=>normalize(x).replace(/(^| )(iv|iii|ii|i)(?= |$)/g,(m,space,n)=>space+numerals[n]);
export function evaluateAnswer(question,answer){if(!question||!['choice','label','reflection'].includes(question.kind)||typeof answer!=='string'||!answer.trim())throw Error('Choose or write an answer first.');if(question.kind==='reflection')return 'reflection';if(question.kind==='choice'){if(!question.options?.some(o=>o.id===answer)||!question.options.some(o=>o.id===question.answer))throw Error('This option is unavailable.');return question.answer===answer?'correct':'incorrect';}if(typeof question.answer!=='string')throw Error('Question answer is unavailable.');return normalizeLabel(answer)===normalizeLabel(question.answer)?'correct':'incorrect';}
export function summarizeAttempt(results){if(results.some(r=>!['correct','incorrect','reflection'].includes(r)))throw Error('Invalid result');return {graded:results.filter(r=>r!=='reflection').length,correct:results.filter(r=>r==='correct').length,reflections:results.filter(r=>r==='reflection').length};}

export function reviewSaveMessage(result,reflections,translate){
 if(result?.ok&&translate)return reflections?translate('review.reflections',{count:reflections}):translate('review.saved');
 if(!result?.ok&&translate)return translate('review.notSaved',{reason:result?.reason||translate('review.notSavedReason')});
 if(!result?.ok)return `Your work is kept in this open tab. ${result?.reason||'It could not be saved in this browser.'} Use “Your saved progress” at the bottom of the page to export a backup.`;
 return reflections?`${reflections} reflection${reflections===1?'':'s'} saved with your lesson.`:'Review saved on this browser.';
}

// Which lessons a recall session draws from. An unknown ?lesson= falls back to the module or all lessons.
export function reviewScope(bundle,{lessonId=null,moduleId=null}={}){
 if(lessonId&&bundle.lessons.some(l=>l.id===lessonId))return {lessonId,lessonIds:[lessonId]};
 return {lessonId:null,lessonIds:bundle.lessons.filter(l=>!moduleId||l.primaryModuleId===moduleId).map(l=>l.id)};
}

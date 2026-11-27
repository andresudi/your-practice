import {useState} from 'react';
import {countLabel} from '../domain/plural.js';
import {exportState,parseImport} from '../domain/state.js';
import {download} from './download.js';
import {t} from '../i18n/index.js';
import {translateMessage} from '../i18n/messages.js';

export default function ProgressBackup({state,restore}){
  const [candidate,setCandidate]=useState(null),[message,setMessage]=useState('');
  async function choose(e){
    setCandidate(null);
    const file=e.target.files?.[0];
    if(!file)return;
    try{
      if(file.size>5*1024*1024){setMessage('Choose a backup smaller than 5 MiB.');return;}
      const result=parseImport(await file.text());
      if(result.ok){setCandidate(result.value);setMessage('Backup checked.');}
      else setMessage(result.reason);
    }catch{setMessage('Could not read the backup. Your progress is unchanged.');}
    finally{e.target.value='';}
  }
  return <details className="progress-backup"><summary>{t('backup.summary')}</summary>
    <p>{t('backup.intro')}</p>
    <div className="actions"><button className="text-button" onClick={()=>download(exportState(state),'yoga-fieldbook-backup.json')}>{t('backup.export')}</button><label className="text-button file-label">{t('backup.restore')}<input type="file" accept="application/json,.json" aria-label={t('backup.chooseFile')} onChange={choose}/></label></div>
    {candidate&&<div className="restore-panel"><p>{t('backup.confirm',{statuses:countLabel(Object.keys(candidate.lessonStatuses).length,t('backup.status.one'),t('backup.status.many')),reviews:countLabel(candidate.attempts.length,t('backup.review.one'),t('backup.review.many')),rehearsals:countLabel(candidate.sequences.length,t('backup.rehearsal.one'),t('backup.rehearsal.many'))})}</p><div className="actions"><button className="button small" onClick={()=>{const result=restore(candidate);setMessage(result.ok?'Progress restored.':result.reason);if(result.ok)setCandidate(null);}}>{t('backup.replace')}</button><button className="text-button" onClick={()=>setCandidate(null)}>{t('backup.cancel')}</button></div></div>}
    <p role="status">{message&&translateMessage(message,t)}</p>
  </details>;
}

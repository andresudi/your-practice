import './pose-study.css';
import {useState} from 'react';
import {ArrowRight,MagnifyingGlass} from '@phosphor-icons/react';
import {content,t} from '../../i18n/index.js';
import {Link} from '../../app/Link.jsx';
import LibraryCard from './LibraryCard.jsx';
import {filterEntries,poseCategories,poseEntries} from './library-entries.js';
import './body-learning.css';
import '../study/blend-system.css';

export default function PoseLibrary(){
 const entries=poseEntries(content),families=poseCategories(content);
 const[query,setQuery]=useState(''),[family,setFamily]=useState('all');
 const matches=filterEntries(entries,{query,category:family});
 return <div className="body-learning-page collection-page blend-collection"><div className="learning-heading"><div><p className="eyebrow">{t('poses.eyebrow')}</p><h1>{t('poses.title')}</h1><p className="blend-intro">{t('poses.intro',{count:entries.length})}</p></div></div>
 <div className="collection-toolbar"><div className="lab-tabs" aria-label={t('poses.familyLabel')}>{[['all',t('poses.family.all')],...families.map(f=>[f,t(`poses.family.${f}`)])].map(([id,title])=><button key={id} aria-pressed={family===id} onClick={()=>setFamily(id)}>{title}</button>)}</div><div className="collection-search"><MagnifyingGlass size={20}/><label className="sr-only" htmlFor="pose-search">{t('poses.searchLabel')}</label><input id="pose-search" placeholder={t('poses.searchPlaceholder')} value={query} onChange={e=>setQuery(e.target.value)}/></div></div>
 <div className={`body-card-grid${matches.length===1?' single-result':''}`}>{matches.map(e=><LibraryCard key={e.id} entry={e}/>)}</div>
 {!matches.length&&<div className="empty"><h2>{t('common.noMatch')}</h2><p>{t('poses.emptyText')}</p><button className="button secondary" onClick={()=>{setQuery('');setFamily('all');document.getElementById('pose-search')?.focus();}}>{t('poses.showAll')}</button></div>}
 <details className="learning-details"><summary>{t('common.aboutCollection')}</summary><p>{t('poses.aboutText')}</p><Link className="text-link" href="/anatomy">{t('poses.aboutLink')} <ArrowRight size={17}/></Link></details></div>;
}

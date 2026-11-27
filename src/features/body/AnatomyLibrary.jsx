import {useState} from 'react';
import {ArrowRight,FlowerLotus,MagnifyingGlass} from '@phosphor-icons/react';
import {content,t} from '../../i18n/index.js';
import {Link} from '../../app/Link.jsx';
import LibraryCard from './LibraryCard.jsx';
import {anatomyEntries,filterEntries} from './library-entries.js';
import './pose-study.css';
import './body-learning.css';
import '../study/blend-system.css';

export default function AnatomyLibrary(){
 const entries=anatomyEntries(content,{region:t('anatomyList.sub.region'),system:t('anatomyList.sub.system'),'connective-basics':{title:t('anatomyList.connective.title'),sub:t('anatomyList.connective.sub')},'skeleton-basics':{title:t('anatomyList.skeleton.title'),sub:t('anatomyList.skeleton.sub')}});
 const[query,setQuery]=useState('');
 const matches=filterEntries(entries,{query});
 return <div className="body-learning-page collection-page blend-collection"><div className="learning-heading"><div><p className="eyebrow">{t('anatomyList.eyebrow')}</p><h1>{t('anatomyList.title')}</h1><p className="blend-intro">{t('anatomyList.intro',{count:entries.length})}</p></div></div>
 <div className="collection-toolbar"><div className="collection-search"><MagnifyingGlass size={20}/><label className="sr-only" htmlFor="anatomy-search">{t('anatomyList.searchLabel')}</label><input id="anatomy-search" placeholder={t('anatomyList.searchPlaceholder')} value={query} onChange={e=>setQuery(e.target.value)}/></div></div>
 <div className={`body-card-grid${matches.length===1?' single-result':''}`}>{matches.map(e=><LibraryCard key={e.id} entry={e}/>)}</div>
 {!matches.length&&<div className="empty"><h2>{t('common.noMatch')}</h2><p>{t('anatomyList.emptyText')}</p><button className="button secondary" onClick={()=>{setQuery('');document.getElementById('anatomy-search')?.focus();}}>{t('anatomyList.showAll')}</button></div>}
 <div className="collection-bottom"><Link href="/learn/read-the-body"><span className="eyebrow">{t('anatomyList.readBodyEyebrow')}</span><h2>{t('anatomyList.readBodyTitle')}</h2><ArrowRight/></Link><Link href="/anatomy/yoga-traditions"><FlowerLotus size={24}/><div><span className="eyebrow">{t('anatomyList.traditionsEyebrow')}</span><h2>{t('anatomyList.traditionsTitle')}</h2></div><ArrowRight/></Link></div>
 <details className="learning-details"><summary>{t('common.aboutCollection')}</summary><p>{t('anatomyList.aboutText')}</p><Link className="text-link" href="/poses">{t('anatomyList.aboutLink')} <ArrowRight size={17}/></Link></details></div>;
}

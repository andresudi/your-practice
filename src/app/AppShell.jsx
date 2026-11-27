import ProgressBackup from './ProgressBackup.jsx';
import {Link} from './Link.jsx';
import {activeSection,mainNav} from './main-nav.js';
import {lang,t} from '../i18n/index.js';
import {languageOptions} from '../i18n/paths.js';
export default function AppShell({children,route,state,restore}){
const current=activeSection(route.page);
return <><a className="skip" href="#main">{t('shell.skip')}</a><header className="site-header"><Link href="/" className="brand" aria-label={t('shell.home')}><img src="/brand-mark.svg" alt=""/><span>Yoga Fieldbook</span></Link><nav aria-label={t('nav.label')}>{mainNav.map(item=><Link key={item.id} className={current===item.id?'active':''} aria-current={current===item.id?'page':undefined} href={item.href}>{t(`nav.${item.id}`)}</Link>)}<span className="lang-toggle" role="group" aria-label={t('lang.group')}>{languageOptions(location,lang).map(o=><Link key={o.lang} className={o.current?'current':''} localize={false} href={o.href} hrefLang={o.lang} lang={o.lang} aria-label={o.name} aria-current={o.current?'true':undefined}>{o.label}</Link>)}</span></nav></header><main id="main" tabIndex="-1">{children}</main><footer><span>{t('footer.tagline')}</span><span>{t('footer.independent')}</span><ProgressBackup state={state} restore={restore}/></footer></>;
}

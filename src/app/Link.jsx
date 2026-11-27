import {navigate} from './navigation.js';
import {lang} from '../i18n/index.js';
import {localizeHref} from '../i18n/paths.js';
// Internal links stay in the current language; pass localize={false} for the ID/EN switch.
export function Link({href,children,onClick,localize=true,...props}){const target=localize?localizeHref(href,lang):href;return <a href={target} {...props} onClick={e=>{onClick?.(e);if(!e.defaultPrevented&&e.button===0&&!e.metaKey&&!e.ctrlKey&&!e.shiftKey&&!e.altKey&&target.startsWith('/')){e.preventDefault();navigate(target);}}}>{children}</a>}

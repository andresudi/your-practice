// A collection's name in the current language. Call it while rendering, never at module load.
import {content} from '../../i18n/index.js';
export const moduleTitle=slug=>content.modules.find(m=>m.slug===slug)?.title??slug;

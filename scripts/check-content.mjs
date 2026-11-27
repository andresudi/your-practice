import {readFile} from 'node:fs/promises';
import {validateContent} from '../src/domain/content.js';
import {getCoverage} from '../src/domain/coverage.js';
const bundle={};for(const name of ['modules','topics','sources','lessons','poses','questions','regions'])bundle[name]=JSON.parse(await readFile(new URL(`../src/content/${name}.json`,import.meta.url),'utf8'));
const issues=validateContent(bundle);console.log(JSON.stringify({issues,coverage:getCoverage(bundle,{})},null,2));if(issues.some(x=>x.severity==='error'))process.exitCode=1;

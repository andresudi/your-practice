/** Original, see-through regional map. Small bones/counts and anatomical proportions are simplified. */
export default function SkeletonArt({division='axial',progress=1,decorative=false}) {
 const axial=division==='axial';
 const appearance=selected=>({fill:selected?(axial?'#8ba785':'#c99680'):'#cbd1c5',stroke:selected?(axial?'#3f654b':'#965e4e'):'#87998a',strokeWidth:2,opacity:selected?.45+.55*progress:.8});
 return <svg viewBox="0 0 460 520" className="anatomy-svg skeleton-art" role={decorative?undefined:'img'} aria-hidden={decorative||undefined} aria-label={decorative?undefined:axial?'Axial skeleton highlighted: skull, rib cage and vertebral column, including the sacrum.':'Appendicular skeleton highlighted: limbs, shoulder girdles and hip bones. The central sacrum is not highlighted.'}>
  <ellipse cx="230" cy="260" rx="162" ry="232" fill={axial?'#e5ecdf':'#f0e5dc'}/>
  <ellipse cx="230" cy="260" rx="179" ry="247" fill="none" stroke="#b5c4b5"/>
  <g className="skeleton-appendicular" {...appearance(!axial)} strokeLinejoin="round" strokeLinecap="round">
   <path d="M178 120 L205 132 L189 171 L173 138Z M282 120 L255 132 L271 171 L287 138Z"/>
   <path d="M179 125 Q200 113 223 126 M281 125 Q260 113 237 126" fill="none" strokeWidth="7"/>
   {[false,true].map(mirror=><g key={String(mirror)} transform={mirror?'translate(460 0) scale(-1 1)':undefined}>
    <path d="M173 138 Q181 132 184 142 L166 224 Q160 232 155 223Z"/>
    <path d="M156 235 L149 295 M166 235 L156 296" fill="none" strokeWidth="5"/>
    <path d="M148 300 L158 303 L157 320 L140 316Z"/>
    <path d="M141 305 L133 311 M141 316 L132 332 M147 319 L141 337 M152 320 L149 337 M157 318 L157 333" fill="none" strokeWidth="3"/>
    <path d="M216 271 Q190 253 176 266 Q168 284 185 301 L199 313 L222 319 L221 308 L205 301 Q217 286 216 271Z"/>
    <path d="M192 307 Q186 316 195 323 L203 389 Q207 397 214 390 L207 323 Q201 308 192 307Z"/>
    <ellipse cx="209" cy="398" rx="8" ry="7"/>
    <path d="M204 412 L201 474 M216 411 L212 473" fill="none" strokeWidth="6"/>
    <path d="M200 478 L213 477 L216 489 L192 492 L188 486Z"/>
   </g>)}
  </g>
  <g className="skeleton-axial" {...appearance(axial)} strokeLinejoin="round" strokeLinecap="round">
   <path d="M208 39 Q230 25 252 39 Q265 54 254 77 L248 87 H212 L206 77 Q195 54 208 39Z"/>
   <path d="M211 86 L216 94 H244 L249 86" fill="none" strokeWidth="5"/>
   <ellipse cx="219" cy="61" rx="5" ry="6" fill="#f4f1e6" stroke="none"/><ellipse cx="241" cy="61" rx="5" ry="6" fill="#f4f1e6" stroke="none"/>
   <path d="M230 66 L227 75 H233Z" fill="#f4f1e6" stroke="none"/>
   {Array.from({length:17},(_,i)=><rect key={i} x={i<3?225:222} y={101+i*10} width={i<3?10:16} height="7" rx="2"/>)}
   {[0,1,2,3,4,5].map(i=><path key={i} d={`M225 ${139+i*13} Q${180-i} ${124+i*12} 179 ${148+i*12} Q180 ${165+i*12} 224 ${150+i*13} M235 ${139+i*13} Q${280+i} ${124+i*12} 281 ${148+i*12} Q280 ${165+i*12} 236 ${150+i*13}`} fill="none" strokeWidth="4"/>)}
   <rect x="226" y="130" width="8" height="62" rx="3"/>
   <path d="M218 274 Q230 269 242 274 L236 295 L230 306 L224 295Z"/>
   <path d="M230 307 V314" fill="none" strokeWidth="4"/>
  </g>
  {!decorative&&<g className="skeleton-labels">{axial?<>
   <text x="338" y="64">Skull</text><path d="M265 61 H327"/>
   <text x="53" y="182">Rib cage</text><path d="M121 178 H174"/>
   <text x="313" y="249">Spine</text><path d="M243 245 H302"/>
   <text x="313" y="296">Sacrum</text><path d="M244 285 L302 292"/>
  </>:<>
   <text x="313" y="104">Clavicle +</text><text x="313" y="123">scapula</text><path d="M286 123 L305 112"/>
   <text x="55" y="271">Limbs</text><path d="M107 268 H145"/>
   <text x="313" y="288">Hip bones</text><path d="M288 280 L305 284"/>
  </>}</g>}
 </svg>;
}

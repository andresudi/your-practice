/** Original relationship diagrams, not anatomical sections or tissue-stretch simulations. */
export default function ConnectiveArt({kind='tendon',progress=1,decorative=false}) {
 const descriptions={
  tendon:'A tendon attaches the illustrated muscle to bone.',
  ligament:'A ligament connects the two illustrated bones beside a joint.',
  cartilage:'Articular cartilage covers the facing bone surfaces, with joint space between them.'
 };
 const trace={pathLength:1,strokeDasharray:'1',strokeDashoffset:1-progress};
 const bone='#f8efdb',outline='#c0ae92';
 return <svg viewBox="0 0 500 400" className="anatomy-svg connective-art" role={decorative?undefined:'img'} aria-hidden={decorative||undefined} aria-label={decorative?undefined:descriptions[kind]}>
  <circle cx="250" cy="200" r="170" fill={kind==='ligament'?'#e8e0ed':'#e3e9dc'}/>
  <circle cx="250" cy="200" r="185" fill="none" stroke="#cbd2c2"/>
  {kind==='tendon'?<>
   <path d="M303 204 Q308 181 331 190 L408 190 Q423 179 430 192 Q436 202 426 211 Q436 223 426 231 Q415 237 407 223 L331 223 Q308 233 303 211Z" fill={bone} stroke={outline} strokeWidth="2"/>
   <path d="M180 204 Q242 196 319 205" fill="none" stroke="#ded5b9" strokeWidth="18" strokeLinecap="round"/>
   <path className="tissue-highlight" d="M180 204 Q242 196 319 205" fill="none" stroke="#9a805b" strokeWidth="10" strokeLinecap="round" {...trace}/>
   <path d="M66 204 Q138 119 216 204 Q138 287 66 204Z" fill="#c9917a" stroke="#b67b65" strokeWidth="2"/>
   <path d="M84 204 Q144 163 202 204 M84 204 H202 M84 204 Q144 245 202 204" fill="none" stroke="#e7b7a0" strokeWidth="2"/>
   {!decorative&&<g className="tissue-labels"><text x="141" y="117" textAnchor="middle">Muscle</text><path d="M141 128 V155"/><text x="269" y="285" textAnchor="middle">Tendon</text><path d="M269 263 V218"/><text x="375" y="148" textAnchor="middle">Bone</text><path d="M375 160 V183"/></g>}
  </>:<>
   <path d="M218 65 H282 L280 158 Q307 175 298 198 Q274 210 250 202 Q226 210 202 198 Q193 175 220 158Z" fill={bone} stroke={outline} strokeWidth="2"/>
   <path d="M202 238 Q226 226 250 234 Q274 226 298 238 Q307 261 280 278 L282 340 H218 L220 278 Q193 261 202 238Z" fill={bone} stroke={outline} strokeWidth="2"/>
   {kind==='ligament'?<>
    <path d="M281 164 Q328 215 281 280" fill="none" stroke="#d1c1db" strokeWidth="22" strokeLinecap="round"/>
    <path className="tissue-highlight" d="M281 164 Q328 215 281 280" fill="none" stroke="#8d729e" strokeWidth="12" strokeLinecap="round" {...trace}/>
    {!decorative&&<g className="tissue-labels"><text x="132" y="120" textAnchor="middle">Bone</text><path d="M156 122 H211"/><text x="132" y="309" textAnchor="middle">Bone</text><path d="M156 305 H211"/><text x="361" y="211" textAnchor="middle">Ligament</text><path d="M336 219 L309 224"/></g>}
   </>:<>
    <path d="M198 152 Q158 218 198 284 M302 152 Q342 218 302 284" fill="none" stroke="#b3bda7" strokeWidth="2" strokeDasharray="5 7"/>
    <path d="M205 199 Q226 213 250 206 Q274 213 295 199 M205 237 Q226 223 250 230 Q274 223 295 237" fill="none" stroke="#c0cbb6" strokeWidth="12" strokeLinecap="round"/>
    <path className="tissue-highlight" d="M205 199 Q226 213 250 206 Q274 213 295 199 M205 237 Q226 223 250 230 Q274 223 295 237" fill="none" stroke="#6f886a" strokeWidth="8" strokeLinecap="round" {...trace}/>
    {!decorative&&<g className="tissue-labels"><text x="114" y="189" textAnchor="middle">Cartilage</text><path d="M157 188 L204 201 M157 195 L204 236"/><text x="365" y="255" textAnchor="middle">Joint space</text><path d="M329 246 L286 218"/><text x="250" y="104" textAnchor="middle">Bone</text><text x="250" y="313" textAnchor="middle">Bone</text></g>}
   </>}
  </>}
 </svg>;
}

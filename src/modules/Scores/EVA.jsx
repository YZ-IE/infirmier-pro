import { useState } from 'react';
import { T, s } from '../../theme.js';
const C = T.score;
const getColor = n => n===0?'#22c55e':n<=3?'#86efac':n<=6?'#f59e0b':n<=8?'#f97316':'#ef4444';
const getLabel = n => n===0?'Pas de douleur':n<=3?'Douleur légère':n<=6?'Douleur modérée':n<=8?'Douleur intense':'Douleur insupportable';
const FACES = ['😊','🙂','😐','😟','😣','😭'];
export default function EVA() {
  const [score, setScore] = useState(null);
  const [type, setType] = useState('EN');
  return (
    <div style={{padding:'14px'}}>
      <div style={{display:'flex',gap:7,marginBottom:14}}>
        {[['EN','Numérique (EN)'],['EVA','Visuelle (EVA)'],['FLACC','FLACC (enfant/non-comm.)']].map(([id,lbl])=>(
          <button key={id} onClick={()=>{setType(id);setScore(null);}} style={{...s.btn(type===id?C:T.muted),flex:1,fontSize:11,padding:'7px 4px',background:type===id?C+'22':T.surface,borderColor:type===id?C:T.border,color:type===id?C:T.muted}}>{lbl}</button>
        ))}
      </div>
      {type==='EN' && (
        <div style={s.card}>
          <div style={{color:C,fontSize:13,marginBottom:14}}>Demander au patient : "De 0 à 10, quelle note donnez-vous à votre douleur ?"</div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(11,1fr)',gap:4,marginBottom:14}}>
            {Array.from({length:11},(_,i)=>(
              <button key={i} onClick={()=>setScore(i)} style={{background:score===i?getColor(i)+'44':T.bg,border:`1.5px solid ${score===i?getColor(i):T.border}`,borderRadius:6,padding:'8px 2px',cursor:'pointer',color:score===i?getColor(i):T.muted,fontWeight:700,fontSize:13,fontFamily:'monospace'}}>{i}</button>
            ))}
          </div>
          {score!==null && (
            <div style={{...s.result(getColor(score)),textAlign:'center',animation:'fadeIn 0.3s ease'}}>
              <div style={{fontSize:36}}>{FACES[Math.min(5,Math.floor(score/2))]}</div>
              <div style={{color:getColor(score),fontSize:22,fontWeight:700}}>{score}/10</div>
              <div style={{color:getColor(score),fontSize:14}}>{getLabel(score)}</div>
              <div style={{color:T.muted,fontSize:12,marginTop:6}}>
                {score===0?'Pas d\'antalgique nécessaire':score<=3?'Palier 1 : Paracétamol, AINS':score<=6?'Palier 2 : Tramadol, Codéine':'Palier 3 : Morphine, Opioïdes forts'}
              </div>
            </div>
          )}
        </div>
      )}
      {type==='EVA' && (
        <div style={s.card}>
          <div style={{color:C,fontSize:13,marginBottom:10}}>Le patient positionne un curseur sur une réglette de 0 à 100 mm.</div>
          <div style={{marginBottom:14}}>
            <label style={s.label}>VALEUR EN MM (0-100)</label>
            <input type="range" min="0" max="100" value={score||0} onChange={e=>setScore(parseInt(e.target.value))} style={{width:'100%',accentColor:C}}/>
            <div style={{display:'flex',justifyContent:'space-between',color:T.muted,fontSize:11,marginTop:4}}><span>Pas de douleur</span><span>Douleur insupportable</span></div>
          </div>
          {score!==null && (
            <div style={{...s.result(getColor(Math.round(score/10))),textAlign:'center'}}>
              <div style={{color:getColor(Math.round(score/10)),fontSize:22,fontWeight:700}}>{score} mm</div>
              <div style={{color:getColor(Math.round(score/10)),fontSize:14}}>{getLabel(Math.round(score/10))}</div>
            </div>
          )}
        </div>
      )}
      {type==='FLACC' && (
        <div style={{...s.card}}>
          <div style={{color:C,fontSize:12,marginBottom:12}}>Échelle comportementale pour patient non communicant (nourrisson, sédaté)</div>
          {[
            {cat:'Visage',opts:['0 - Aucune expression particulière','1 - Grimaces occasionnelles','2 - Mâchoires crispées, menton tremblant']},
            {cat:'Jambes',opts:['0 - Position normale ou détendue','1 - Agitation, tension','2 - Jambes repliées ou tendues']},
            {cat:'Activité',opts:['0 - Allongé calmement, position normale','1 - Se tortille, se balance','2 - Arc de cercle, rigide']},
            {cat:'Cris',opts:['0 - Pas de pleurs','1 - Gémissements, plaintes','2 - Pleurs continus, cris']},
            {cat:'Consolabilité',opts:['0 - Content, détendu','1 - Réconforté par contact','2 - Difficile à consoler']},
          ].map((item,i)=>(
            <div key={i} style={{marginBottom:12,paddingBottom:12,borderBottom:i<4?'1px solid #334155':'none'}}>
              <div style={{color:C,fontFamily:'monospace',fontSize:12,marginBottom:6}}>{item.cat}</div>
              {item.opts.map((opt,j)=>(
                <div key={j} style={{color:T.muted,fontSize:12,marginBottom:3}}>• {opt}</div>
              ))}
            </div>
          ))}
          <div style={{color:T.muted,fontSize:12,marginTop:6}}>Score 0-2: Pas de douleur · 3-5: Modérée · 6-10: Sévère</div>
        </div>
      )}
    </div>
  );
}

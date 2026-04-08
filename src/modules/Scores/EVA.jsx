import { useState } from 'react';
import { T, s } from '../../theme.js';
const C = T.score;

const getColor = n => n===0?'#22c55e':n<=3?'#86efac':n<=6?'#f59e0b':n<=8?'#f97316':'#ef4444';
const getLabel = n => n===0?'Pas de douleur':n<=3?'Douleur légère':n<=6?'Douleur modérée':n<=8?'Douleur intense':'Douleur insupportable';
const getPalier = n => n===0?'Pas d\'antalgique nécessaire':n<=3?'Palier 1 — Paracétamol, AINS':n<=6?'Palier 2 — Tramadol, Codéine':'Palier 3 — Morphine, Opioïdes forts';
const SMILEYS = ['😊','😊','🙂','🙂','😐','😐','😟','😟','😣','😣','😭'];

export default function EVA() {
  const [score, setScore] = useState(null);
  const [type, setType] = useState('EN');
  const [flacc, setFlacc] = useState({});
  const flaccTotal = Object.values(flacc).reduce((a,b)=>a+b,0);
  const flaccDone = Object.keys(flacc).length === 5;

  return (
    <div style={{padding:'14px'}}>
      <div style={{display:'flex',gap:7,marginBottom:14}}>
        {[['EN','Numérique'],['EVA','Analogique'],['FACES','Visages'],['FLACC','FLACC']].map(([id,lbl])=>(
          <button key={id} onClick={()=>{setType(id);setScore(null);}} style={{flex:1,fontSize:11,padding:'7px 4px',background:type===id?C+'22':T.surface,border:`1px solid ${type===id?C:T.border}`,borderRadius:7,color:type===id?C:T.muted,fontWeight:700,cursor:'pointer'}}>{lbl}</button>
        ))}
      </div>

      {type==='EN' && (
        <div style={s.card}>
          <div style={{color:C,fontSize:13,marginBottom:14}}>"De 0 à 10, quelle note donnez-vous à votre douleur ?"</div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(11,1fr)',gap:3,marginBottom:8}}>
            {SMILEYS.map((em,i)=>(
              <button key={i} onClick={()=>setScore(i)} style={{background:score===i?getColor(i)+'33':'transparent',border:`1.5px solid ${score===i?getColor(i):'transparent'}`,borderRadius:8,padding:'4px 1px',cursor:'pointer',fontSize:score===i?22:16,transition:'all 0.15s',transform:score===i?'scale(1.2)':'scale(1)'}}>{em}</button>
            ))}
          </div>
          <div style={{height:8,borderRadius:20,background:'linear-gradient(to right,#22c55e,#86efac,#f59e0b,#f97316,#ef4444)',marginBottom:8,position:'relative'}}>
            {score!==null && <div style={{position:'absolute',top:-4,left:`${score*10}%`,transform:'translateX(-50%)',width:16,height:16,background:'white',border:`3px solid ${getColor(score)}`,borderRadius:'50%',transition:'left 0.2s'}}/>}
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(11,1fr)',gap:3,marginBottom:10}}>
            {Array.from({length:11},(_,i)=>(
              <button key={i} onClick={()=>setScore(i)} style={{background:score===i?getColor(i)+'44':T.bg,border:`1.5px solid ${score===i?getColor(i):T.border}`,borderRadius:6,padding:'8px 2px',cursor:'pointer',color:score===i?getColor(i):T.muted,fontWeight:700,fontSize:13,fontFamily:'monospace'}}>{i}</button>
            ))}
          </div>
          <div style={{display:'flex',justifyContent:'space-between',color:T.muted,fontSize:11,marginBottom:10}}>
            <span>😊 Pas de douleur</span><span>😭 Insupportable</span>
          </div>
          {score!==null && (
            <div style={{...s.result(getColor(score)),textAlign:'center',animation:'fadeIn 0.3s ease'}}>
              <div style={{fontSize:50}}>{SMILEYS[score]}</div>
              <div style={{color:getColor(score),fontSize:28,fontWeight:700,marginTop:4}}>{score}/10</div>
              <div style={{color:getColor(score),fontSize:15,fontWeight:600,marginTop:2}}>{getLabel(score)}</div>
              <div style={{color:T.muted,fontSize:13,marginTop:6}}>→ {getPalier(score)}</div>
            </div>
          )}
        </div>
      )}

      {type==='EVA' && (
        <div style={s.card}>
          <div style={{color:C,fontSize:13,marginBottom:12}}>Le patient positionne le curseur sur la réglette.</div>
          <div style={{display:'flex',justifyContent:'space-between',fontSize:28,marginBottom:4}}>
            <span>😊</span><span>😟</span><span>😭</span>
          </div>
          <div style={{height:8,borderRadius:20,background:'linear-gradient(to right,#22c55e,#f59e0b,#ef4444)',marginBottom:8}}/>
          <input type="range" min="0" max="100" value={score||0} onChange={e=>setScore(parseInt(e.target.value))} style={{width:'100%',accentColor:C}}/>
          <div style={{display:'flex',justifyContent:'space-between',color:T.muted,fontSize:11,marginBottom:14}}>
            <span>0 mm</span><span>100 mm</span>
          </div>
          {score!==null && (
            <div style={{...s.result(getColor(Math.round(score/10))),textAlign:'center'}}>
              <div style={{fontSize:44}}>{SMILEYS[Math.round(score/10)]}</div>
              <div style={{color:getColor(Math.round(score/10)),fontSize:24,fontWeight:700}}>{score} mm</div>
              <div style={{color:getColor(Math.round(score/10)),fontSize:14}}>{getLabel(Math.round(score/10))}</div>
              <div style={{color:T.muted,fontSize:12,marginTop:6}}>→ {getPalier(Math.round(score/10))}</div>
            </div>
          )}
        </div>
      )}

      {type==='FACES' && (
        <div style={s.card}>
          <div style={{color:C,fontSize:13,marginBottom:4}}>Wong-Baker FACES — Pointer le visage qui correspond.</div>
          <div style={{color:T.muted,fontSize:11,marginBottom:16}}>Enfants &gt; 3 ans · Personnes âgées · Barrière linguistique</div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(6,1fr)',gap:6,marginBottom:14}}>
            {[{i:0,em:'😊',v:'0',l:'Pas mal'},{i:2,em:'🙂',v:'2',l:'Un peu'},{i:4,em:'😐',v:'4',l:'Plus'},{i:6,em:'😟',v:'6',l:'Encore'},{i:8,em:'😣',v:'8',l:'Beaucoup'},{i:10,em:'😭',v:'10',l:'Max'}].map(f=>(
              <div key={f.i} onClick={()=>setScore(f.i)} style={{textAlign:'center',cursor:'pointer',padding:'8px 4px',borderRadius:10,background:score===f.i?getColor(f.i)+'33':T.bg,border:`1.5px solid ${score===f.i?getColor(f.i):T.border}`,transform:score===f.i?'scale(1.1)':'scale(1)',transition:'all 0.15s'}}>
                <div style={{fontSize:score===f.i?30:24,marginBottom:3}}>{f.em}</div>
                <div style={{color:getColor(f.i),fontFamily:'monospace',fontWeight:700,fontSize:13}}>{f.v}</div>
                <div style={{color:T.muted,fontSize:9}}>{f.l}</div>
              </div>
            ))}
          </div>
          {score!==null && (
            <div style={{...s.result(getColor(score)),textAlign:'center',animation:'fadeIn 0.3s ease'}}>
              <div style={{fontSize:50}}>{SMILEYS[score]}</div>
              <div style={{color:getColor(score),fontSize:26,fontWeight:700,marginTop:4}}>{score}/10</div>
              <div style={{color:getColor(score),fontSize:14}}>{getLabel(score)}</div>
              <div style={{color:T.muted,fontSize:12,marginTop:6}}>→ {getPalier(score)}</div>
            </div>
          )}
        </div>
      )}

      {type==='FLACC' && (
        <div>
          <div style={{...s.card,background:C+'11',border:`1px solid ${C}33`,marginBottom:14}}>
            <div style={{color:C,fontWeight:700,fontSize:13}}>FLACC — Patient non-verbal</div>
            <div style={{color:T.muted,fontSize:12,marginTop:3}}>Nourrisson · Sédaté · Non-communicant · Score /10</div>
          </div>
          {[
            {id:'F',cat:'F — Visage',opts:['Aucune expression','Grimaces occasionnelles','Mâchoires crispées, menton tremblant']},
            {id:'L',cat:'L — Jambes',opts:['Position normale / détendue','Agitation, tension','Jambes repliées ou tendues']},
            {id:'A',cat:'A — Activité',opts:['Allongé calmement','Se tortille, se balance','Arc de cercle, rigide']},
            {id:'C',cat:'C — Cris',opts:['Pas de pleurs','Gémissements, plaintes','Pleurs continus, cris']},
            {id:'Co',cat:'C — Consolabilité',opts:['Content, détendu','Réconforté par contact','Difficile à consoler']},
          ].map(item=>(
            <div key={item.id} style={s.card}>
              <div style={{color:C,fontFamily:'monospace',fontSize:12,letterSpacing:1,marginBottom:8}}>{item.cat}</div>
              {item.opts.map((opt,j)=>(
                <button key={j} onClick={()=>setFlacc(p=>({...p,[item.id]:j}))} style={{display:'flex',justifyContent:'space-between',alignItems:'center',width:'100%',background:flacc[item.id]===j?C+'22':T.bg,border:`1px solid ${flacc[item.id]===j?C:T.border}`,borderRadius:7,padding:'9px 12px',marginBottom:5,cursor:'pointer',textAlign:'left'}}>
                  <span style={{color:flacc[item.id]===j?C:T.text,fontSize:13}}>{opt}</span>
                  <span style={{color:C,fontFamily:'monospace',fontSize:14,fontWeight:700}}>{j}</span>
                </button>
              ))}
            </div>
          ))}
          <div style={{...s.result(flaccDone?getColor(flaccTotal):'#475569'),textAlign:'center',animation:'fadeIn 0.3s ease'}}>
            <div style={{fontSize:44}}>{flaccDone?SMILEYS[flaccTotal]:'🤔'}</div>
            <div style={{color:flaccDone?getColor(flaccTotal):T.muted,fontSize:28,fontWeight:700,marginTop:4}}>{flaccDone?flaccTotal:'?'}/10</div>
            <div style={{color:flaccDone?getColor(flaccTotal):T.muted,fontSize:14,marginTop:4}}>{flaccDone?getLabel(flaccTotal):'Compléter les 5 critères'}</div>
            {flaccDone && <div style={{color:T.muted,fontSize:12,marginTop:6}}>→ {getPalier(flaccTotal)}</div>}
          </div>
        </div>
      )}
    </div>
  );
}

import { useState } from 'react';
import { T, s } from '../../theme.js';
const C = T.score;
const ITEMS = [
  { key:'etat_general', label:'État physique général',
    opts:[{v:4,l:'Bon'},{v:3,l:'Passable'},{v:2,l:'Mauvais'},{v:1,l:'Très mauvais'}] },
  { key:'etat_mental', label:'État mental',
    opts:[{v:4,l:'Alerte'},{v:3,l:'Apathique'},{v:2,l:'Confus'},{v:1,l:'Stupeur/Coma'}] },
  { key:'activite', label:'Activité',
    opts:[{v:4,l:'Ambulatoire'},{v:3,l:'Se lève avec aide'},{v:2,l:'En fauteuil'},{v:1,l:'Alité'}] },
  { key:'mobilite', label:'Mobilité',
    opts:[{v:4,l:'Complète'},{v:3,l:'Légèrement limitée'},{v:2,l:'Très limitée'},{v:1,l:'Immobile'}] },
  { key:'incontinence', label:'Incontinence',
    opts:[{v:4,l:'Aucune'},{v:3,l:'Occasionnelle'},{v:2,l:'Urinaire habituelle'},{v:1,l:'Totale (urine + selles)'}] },
];
const getColor = t => t>=18?'#22c55e':t>=14?'#f59e0b':t>=10?'#f97316':'#ef4444';
const getRisk  = t => t>=18?'Risque faible':t>=14?'Risque modéré':t>=10?'Risque élevé':'Risque très élevé';
export default function Norton() {
  const [sel, setSel] = useState({});
  const vals = Object.values(sel);
  const total = vals.reduce((a,b)=>a+b,0);
  const done = vals.length === ITEMS.length;
  return (
    <div style={{padding:'14px'}}>
      {ITEMS.map(item=>(
        <div key={item.key} style={s.card}>
          <div style={{color:C,fontFamily:'monospace',fontSize:12,marginBottom:10}}>{item.label}</div>
          {item.opts.map(opt=>(
            <button key={opt.v} onClick={()=>setSel(p=>({...p,[item.key]:opt.v}))}
              style={{display:'flex',justifyContent:'space-between',alignItems:'center',width:'100%',
                background:sel[item.key]===opt.v?C+'22':T.bg,
                border:`1px solid ${sel[item.key]===opt.v?C:T.border}`,
                borderRadius:7,padding:'8px 12px',marginBottom:5,cursor:'pointer',textAlign:'left'}}>
              <span style={{color:sel[item.key]===opt.v?C:T.text,fontSize:13}}>{opt.l}</span>
              <span style={{color:C,fontFamily:'monospace',fontWeight:700}}>{opt.v}</span>
            </button>
          ))}
        </div>
      ))}
      <div style={{...s.result(done?getColor(total):'#475569'),textAlign:'center'}}>
        <div style={{color:done?getColor(total):T.muted,fontSize:28,fontWeight:700}}>{done?total:'?'}/20</div>
        <div style={{color:done?getColor(total):T.muted,fontSize:15,fontWeight:600,marginTop:4}}>{done?getRisk(total):'Compléter le score'}</div>
        {done&&<div style={{color:T.muted,fontSize:12,marginTop:8}}>
          {total<=14?'→ Matelas anti-escarre · Effleurages · Changements de position /2h':'→ Surveillance standard · Mobilisation régulière'}
        </div>}
      </div>
      <div style={{...s.card,marginTop:10}}>
        <div style={{color:C,fontFamily:'monospace',fontSize:11,letterSpacing:2,marginBottom:8}}>PRÉVENTION ESCARRES</div>
        {[['≥ 18','Risque faible — Surveillance standard'],['14-17','Risque modéré — Matelas mousse haute résilience'],['10-13','Risque élevé — Matelas à air alterné · Effleurages /2h'],['< 10','Risque très élevé — Matelas dynamique · Repositionnement /2h · Peau nue']].map(([sc,act])=>(
          <div key={sc} style={{display:'flex',gap:10,marginBottom:6}}>
            <span style={{color:C,fontFamily:'monospace',fontSize:11,minWidth:42}}>{sc}</span>
            <span style={{color:T.muted,fontSize:12}}>{act}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

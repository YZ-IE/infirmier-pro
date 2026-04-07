import { useState } from 'react';
import { T, s } from '../../theme.js';
const C = T.score;
const ITEMS = {
  Y:{label:'Ouverture des yeux',opts:[{v:4,l:'Spontanée'},{v:3,l:'À la voix'},{v:2,l:'À la douleur'},{v:1,l:'Absente'}]},
  V:{label:'Réponse verbale',opts:[{v:5,l:'Orientée'},{v:4,l:'Confuse'},{v:3,l:'Mots inappropriés'},{v:2,l:'Sons incompréhensibles'},{v:1,l:'Absente'}]},
  M:{label:'Réponse motrice',opts:[{v:6,l:'Obéit aux ordres'},{v:5,l:'Localise la douleur'},{v:4,l:'Retrait en flexion'},{v:3,l:'Flexion stéréotypée'},{v:2,l:'Extension stéréotypée'},{v:1,l:'Absente'}]},
};
const getColor = score => score >= 13 ? '#22c55e' : score >= 9 ? '#f59e0b' : '#ef4444';
const getLabel = score => score >= 13 ? 'Conscient (léger)' : score >= 9 ? 'Obnubilé (modéré)' : score >= 6 ? 'Comateux (sévère)' : 'Coma profond';
export default function Glasgow() {
  const [sel, setSel] = useState({Y:null,V:null,M:null});
  const total = Object.values(sel).reduce((a,b) => a + (b||0), 0);
  const done = Object.values(sel).every(v=>v!==null);
  return (
    <div style={{padding:'14px'}}>
      {Object.entries(ITEMS).map(([key,item])=>(
        <div key={key} style={s.card}>
          <div style={{color:C,fontFamily:'monospace',fontSize:12,letterSpacing:1,marginBottom:10}}>{item.label}</div>
          {item.opts.map(opt=>(
            <button key={opt.v} onClick={()=>setSel(p=>({...p,[key]:opt.v}))} style={{display:'flex',justifyContent:'space-between',alignItems:'center',width:'100%',background:sel[key]===opt.v?C+'22':T.bg,border:`1px solid ${sel[key]===opt.v?C:T.border}`,borderRadius:7,padding:'9px 12px',marginBottom:6,cursor:'pointer',textAlign:'left'}}>
              <span style={{color:sel[key]===opt.v?C:T.text,fontSize:13}}>{opt.l}</span>
              <span style={{color:C,fontFamily:'monospace',fontSize:14,fontWeight:700}}>{opt.v}</span>
            </button>
          ))}
        </div>
      ))}
      <div style={{...s.result(done?getColor(total):'#475569'),textAlign:'center',animation:'fadeIn 0.3s ease'}}>
        <div style={{color:done?getColor(total):T.muted,fontSize:28,fontWeight:700}}>{done?total:'?'}/15</div>
        <div style={{color:done?getColor(total):T.muted,fontSize:14,fontWeight:600,marginTop:4}}>{done?getLabel(total):'Compléter le score'}</div>
        {done && (
          <div style={{color:T.muted,fontSize:12,marginTop:6}}>
            Yeux: {sel.Y} · Verbal: {sel.V} · Moteur: {sel.M}
          </div>
        )}
        {done && total <= 8 && <div style={{color:'#ef4444',fontSize:13,fontWeight:700,marginTop:6}}>⚠️ Protection des voies aériennes à envisager</div>}
      </div>
      <div style={{...s.card,marginTop:10}}>
        <div style={{color:C,fontFamily:'monospace',fontSize:11,letterSpacing:2,marginBottom:8}}>INTERPRÉTATION</div>
        {[['15','Normal'],['13-14','Lésion légère'],['9-12','Lésion modérée'],['≤ 8','Lésion sévère — Intubation à discuter'],['3','Coma profond · Pronostic sévère']].map(([score,label])=>(
          <div key={score} style={{display:'flex',gap:10,marginBottom:5}}>
            <span style={{color:C,fontFamily:'monospace',fontSize:12,minWidth:40}}>{score}</span>
            <span style={{color:T.muted,fontSize:13}}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

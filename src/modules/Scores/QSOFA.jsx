import { useState } from 'react';
import { T, s } from '../../theme.js';
const C = T.score;
export default function QSOFA() {
  const [sel,setSel]=useState({resp:null,mental:null,pa:null});
  const score=Object.values(sel).filter(v=>v===true).length;
  const done=Object.values(sel).every(v=>v!==null);
  return (
    <div style={{padding:'14px'}}>
      <div style={{...s.card,background:'#1a1a2e',border:`1px solid ${C}44`}}>
        <div style={{color:C,fontWeight:700,fontSize:14,marginBottom:6}}>Score qSOFA — Dépistage Sepsis</div>
        <div style={{color:T.muted,fontSize:13}}>1 point par critère présent · Score ≥ 2 = risque élevé de mauvaise évolution</div>
      </div>
      {[
        {key:'resp',icon:'🫁',label:'Fréquence respiratoire ≥ 22/min',detail:'Compter sur 1 minute'},
        {key:'mental',icon:'🧠',label:'Altération de la conscience',detail:'Glasgow < 15 ou confusion, agitation, somnolence'},
        {key:'pa',icon:'💉',label:'Pression artérielle systolique ≤ 100 mmHg',detail:'Mesure au brassard'},
      ].map(item=>(
        <div key={item.key} style={s.card}>
          <div style={{display:'flex',gap:12,alignItems:'flex-start',marginBottom:10}}>
            <span style={{fontSize:24}}>{item.icon}</span>
            <div><div style={{color:T.text,fontWeight:700,fontSize:14}}>{item.label}</div>
            <div style={{color:T.muted,fontSize:12,marginTop:2}}>{item.detail}</div></div>
          </div>
          <div style={{display:'flex',gap:8}}>
            <button onClick={()=>setSel(p=>({...p,[item.key]:true}))} style={{...s.btn('#ef4444'),flex:1,background:sel[item.key]===true?'#ef444422':T.surface,borderColor:sel[item.key]===true?'#ef4444':T.border,color:sel[item.key]===true?'#ef4444':T.muted}}>✓ Présent (+1)</button>
            <button onClick={()=>setSel(p=>({...p,[item.key]:false}))} style={{...s.btn('#22c55e'),flex:1,background:sel[item.key]===false?'#22c55e22':T.surface,borderColor:sel[item.key]===false?'#22c55e':T.border,color:sel[item.key]===false?'#22c55e':T.muted}}>✗ Absent (0)</button>
          </div>
        </div>
      ))}
      {done&&(
        <div style={{...s.result(score>=2?'#ef4444':'#22c55e'),textAlign:'center',animation:'fadeIn 0.3s'}}>
          <div style={{color:score>=2?'#ef4444':'#22c55e',fontSize:28,fontWeight:700}}>qSOFA : {score}/3</div>
          <div style={{color:score>=2?'#ef4444':'#22c55e',fontSize:15,marginTop:4}}>{score>=2?'🚨 SEPSIS PROBABLE':'Surveillance'}</div>
          {score>=2&&<div style={{color:T.muted,fontSize:12,marginTop:6}}>→ Bundle Sepsis 1h · Hémocultures · ATB · Lactates · Médecin en urgence</div>}
        </div>
      )}
    </div>
  );
}

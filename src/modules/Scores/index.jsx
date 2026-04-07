import { useState } from 'react';
import { T, s } from '../../theme.js';
const C = T.score;
import Glasgow from './Glasgow.jsx';
import EVA from './EVA.jsx';
import Norton from './Norton.jsx';
import Morse from './Morse.jsx';
import QSOFA from './QSOFA.jsx';
import MMSE from './MMSE.jsx';
import Braden from './Braden.jsx';
import NAS from './NAS.jsx';

const SCORES = [
  {id:'glasgow',icon:'🧠',label:'Glasgow (GCS)',desc:'Évaluation de la conscience'},
  {id:'eva',icon:'😣',label:'Douleur (EVA/EN)',desc:'Évaluation de la douleur'},
  {id:'norton',icon:'🛏',label:'Norton',desc:'Risque d\'escarre'},
  {id:'braden',icon:'🛌',label:'Braden',desc:'Risque d\'escarres (détaillé)'},
  {id:'morse',icon:'⚠️',label:'Morse',desc:'Risque de chute'},
  {id:'qsofa',icon:'🦠',label:'qSOFA',desc:'Dépistage sepsis'},
  {id:'mmse',icon:'📝',label:'MMS / MMSE',desc:'Évaluation cognitive'},
  {id:'nas',icon:'🩺',label:'NAS',desc:'Charge en soins infirmiers'},
];

export default function Scores({ onBack }) {
  const [score, setScore] = useState(null);
  const map = {glasgow:<Glasgow/>,eva:<EVA/>,norton:<Norton/>,braden:<Braden/>,morse:<Morse/>,qsofa:<QSOFA/>,mmse:<MMSE/>,nas:<NAS/>};
  if (score) return (
    <div style={{minHeight:'100vh',background:T.bg,color:T.text}}>
      <div style={{background:T.scoreDim,borderBottom:`1px solid ${C}44`,padding:'12px 16px',display:'flex',alignItems:'center',gap:10,position:'sticky',top:0,zIndex:10}}>
        <button onClick={()=>setScore(null)} style={{background:'none',border:'none',color:C,fontSize:20,cursor:'pointer'}}>←</button>
        <span style={{color:T.text,fontWeight:700,fontSize:16}}>{SCORES.find(s=>s.id===score)?.label}</span>
      </div>
      <div style={{paddingBottom:40}}>{map[score]}</div>
    </div>
  );
  return (
    <div style={{minHeight:'100vh',background:T.bg}}>
      <div style={{background:T.scoreDim,borderBottom:`1px solid ${C}44`,padding:'14px 16px',display:'flex',alignItems:'center',gap:12,position:'sticky',top:0,zIndex:10}}>
        <button onClick={onBack} style={{background:'none',border:'none',color:C,fontSize:20,cursor:'pointer'}}>←</button>
        <div><div style={{color:C,fontFamily:'monospace',fontSize:10,letterSpacing:3}}>MODULE</div>
        <div style={{color:T.text,fontWeight:700,fontSize:18}}>📊 Scores cliniques</div></div>
      </div>
      <div style={{padding:'14px',display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
        {SCORES.map(sc=>(
          <div key={sc.id} onClick={()=>setScore(sc.id)} style={{background:T.surface,border:`1px solid ${C}33`,borderRadius:10,padding:'14px 12px',cursor:'pointer'}}>
            <div style={{fontSize:24,marginBottom:7}}>{sc.icon}</div>
            <div style={{color:C,fontWeight:700,fontSize:13,marginBottom:3}}>{sc.label}</div>
            <div style={{color:T.muted,fontSize:11}}>{sc.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

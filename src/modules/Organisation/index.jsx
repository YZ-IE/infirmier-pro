import { useState } from 'react';
import { T, s } from '../../theme.js';
const C = T.orga;
import SBAR from './SBAR.jsx';
import NormesBio from './NormesBio.jsx';
import Transmissions from './Transmissions.jsx';
import ChecklistMedoc from './ChecklistMedoc.jsx';

const TOOLS = [
  {id:'sbar',    icon:'📢', label:'SBAR',                   desc:'Outil de transmission structurée'},
  {id:'normes',  icon:'🔬', label:'Normes biologiques',       desc:'Valeurs de référence biologiques'},
  {id:'trans',   icon:'📋', label:'Transmissions ciblées',    desc:'Données · Liens · Actions'},
  {id:'medoc',   icon:'✅', label:'Checklist médicaments',    desc:'5B · Vérification double · Traçabilité'},
];

export default function Organisation({ onBack }) {
  const [tool,setTool]=useState(null);
  const map={sbar:<SBAR/>,normes:<NormesBio/>,trans:<Transmissions/>,medoc:<ChecklistMedoc/>};
  if(tool) return (
    <div style={{minHeight:'100vh',background:T.bg,color:T.text}}>
      <div style={{background:T.orgaDim,borderBottom:`1px solid ${C}44`,padding:'12px 16px',display:'flex',alignItems:'center',gap:10,position:'sticky',top:0,zIndex:10}}>
        <button onClick={()=>setTool(null)} style={{background:'none',border:'none',color:C,fontSize:20,cursor:'pointer'}}>←</button>
        <span style={{color:T.text,fontWeight:700,fontSize:16}}>{TOOLS.find(t=>t.id===tool)?.label}</span>
      </div>
      <div style={{paddingBottom:40}}>{map[tool]}</div>
    </div>
  );
  return (
    <div style={{minHeight:'100vh',background:T.bg}}>
      <div style={{background:T.orgaDim,borderBottom:`1px solid ${C}44`,padding:'14px 16px',display:'flex',alignItems:'center',gap:12,position:'sticky',top:0,zIndex:10}}>
        <button onClick={onBack} style={{background:'none',border:'none',color:C,fontSize:20,cursor:'pointer'}}>←</button>
        <div><div style={{color:C,fontFamily:'monospace',fontSize:10,letterSpacing:3}}>MODULE</div>
        <div style={{color:T.text,fontWeight:700,fontSize:18}}>📋 Organisation</div></div>
      </div>
      <div style={{padding:'14px',display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
        {TOOLS.map(t=>(
          <div key={t.id} onClick={()=>setTool(t.id)} style={{background:T.surface,border:`1px solid ${C}33`,borderRadius:10,padding:'14px 12px',cursor:'pointer'}}>
            <div style={{fontSize:24,marginBottom:7}}>{t.icon}</div>
            <div style={{color:C,fontWeight:700,fontSize:13,marginBottom:3}}>{t.label}</div>
            <div style={{color:T.muted,fontSize:11}}>{t.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

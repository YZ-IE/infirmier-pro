import { MedicalDisclaimer } from '../../components/MedicalDisclaimer.jsx';
import { useState } from 'react';
import { T, s } from '../../theme.js';
const C = T.score;
const ITEMS = [
  { key:'monitoring', label:'Monitorage et contrôle', pts:4.5, desc:'Surveillance des constantes, scope' },
  { key:'labos', label:'Examens biologiques', pts:4.3, desc:'Prélèvements, acheminement, résultats' },
  { key:'medocs', label:'Administration médicaments IV', pts:5.6, desc:'Préparation, vérification, administration' },
  { key:'hygiene', label:'Hygiène', pts:7.15, desc:'Soins de nursing complets' },
  { key:'mobilisation', label:'Mobilisation et positionnement', pts:5.5, desc:'Changements de position, aide aux transferts' },
  { key:'support_resp', label:'Support ventilatoire', pts:1.72, desc:'O₂, VNI, aspiration' },
  { key:'soins_respi', label:'Soins respiratoires', pts:4.4, desc:'Kinésithérapie, aérosols, aspirations' },
  { key:'drain_art', label:'Soins artériels', pts:1.7, desc:'Cathéter artériel, PVC' },
  { key:'diureses', label:'Diurèses, drains', pts:1.3, desc:'Bilan entrées/sorties, soins de drains' },
  { key:'mobili_active', label:'Mobilisation active', pts:2.0, desc:'Physiothérapie, kinésithérapie active' },
  { key:'support_famille', label:'Support famille/patient', pts:4.0, desc:'Soutien psychologique, information' },
  { key:'taches_admin', label:'Tâches administratives', pts:6.5, desc:'Dossier, transmissions, coordination' },
  { key:'urgences', label:'Interventions en urgence', pts:7.67, desc:'RCP, interventions non planifiées' },
];
export default function NAS() {
  const [sel,setSel]=useState({});
  const total=Object.values(sel).reduce((a,b)=>a+b,0);
  const getColor=t=>t<50?'#22c55e':t<80?'#f59e0b':'#ef4444';
  const getLabel=t=>t<50?'Charge légère':t<80?'Charge modérée':'Charge lourde (>1 infirmier)';
  return (
    <div style={{padding:'14px'}}>
      <MedicalDisclaimer level="standard" />
      <div style={{...s.card,background:'#1a1a2e'}}>
        <div style={{color:C,fontWeight:700,marginBottom:4}}>Nursing Activities Score</div>
        <div style={{color:T.muted,fontSize:12}}>Évalue la charge en soins infirmiers sur 24h · Score 100% = 1 infirmier à temps plein</div>
      </div>
      {ITEMS.map(item=>(
        <button key={item.key} onClick={()=>setSel(p=>p[item.key]?Object.fromEntries(Object.entries(p).filter(([k])=>k!==item.key)):{...p,[item.key]:item.pts})}
          style={{display:'flex',alignItems:'center',gap:12,width:'100%',background:sel[item.key]?C+'18':T.surface,border:`1px solid ${sel[item.key]?C:T.border}`,borderRadius:9,padding:'11px 14px',marginBottom:8,cursor:'pointer',textAlign:'left'}}>
          <div style={{width:22,height:22,borderRadius:5,background:sel[item.key]?C:'transparent',border:`2px solid ${sel[item.key]?C:T.border}`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,color:'#fff',fontSize:13}}>
            {sel[item.key]?'✓':''}
          </div>
          <div style={{flex:1}}>
            <div style={{color:sel[item.key]?C:T.text,fontSize:13,fontWeight:600}}>{item.label}</div>
            <div style={{color:T.muted,fontSize:11,marginTop:2}}>{item.desc}</div>
          </div>
          <span style={{color:C,fontFamily:'monospace',fontSize:13,fontWeight:700}}>{item.pts}%</span>
        </button>
      ))}
      <div style={{...s.result(getColor(total)),textAlign:'center',marginTop:8}}>
        <div style={{color:getColor(total),fontSize:28,fontWeight:700}}>{Math.round(total)}%</div>
        <div style={{color:getColor(total),fontSize:14,marginTop:4}}>{getLabel(total)}</div>
        <div style={{color:T.muted,fontSize:12,marginTop:6}}>
          {total>100?`⚠️ Nécessite ${Math.ceil(total/100)} infirmiers pour ce patient`:`= ${Math.round(total)}% d\'un infirmier à temps plein`}
        </div>
      </div>
    </div>
  );
}

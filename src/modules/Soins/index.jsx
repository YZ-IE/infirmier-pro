import { useState } from 'react';
import { T, s } from '../../theme.js';
import StarButton from '../shared/StarButton.jsx';

const C   = T.soins || '#06b6d4';
const MOD = 'soins';

import Pansements    from './Pansements.jsx';
import PiccMidline   from './PiccMidline.jsx';
import PAC           from './PAC.jsx';
import KTA           from './KTA.jsx';
import Dialyse       from './Dialyse.jsx';
import Timers        from './Timers.jsx';
import ChecklistPreOp from './ChecklistPreOp.jsx';

const SOINS_LIST = [
  { id:'timers',      icon:'⏱',  label:'Timers de soins',           sub:'Antiseptiques · Perfusions · Chronomètres simultanés', badge:'NOUVEAU' },
  { id:'checklistop', icon:'✅', label:'Checklist bloc opératoire', sub:'OMS Sign In · Time Out · Sign Out',                    badge:'NOUVEAU' },
  { id:'pansements',  icon:'🩹', label:'Pansements',                sub:'Tableau décisionnel par stade · Types · Règles cliniques' },
  { id:'piccmidline', icon:'🩸', label:'Piccline / Midline',        sub:'Indications · Pose · Entretien · Surveillance · Comparatif' },
  { id:'pac',         icon:'🔵', label:'PAC — Chambre implantable', sub:'Ponction · Déponction · Aiguille Huber · Complications' },
  { id:'kta',         icon:'🔴', label:'KTA — Cathéter artériel',   sub:'PAI · Prélèvements GDS · Sécurité · Test d\'Allen' },
  { id:'dialyse',     icon:'🫀', label:'Dialyse',                   sub:'HD · DP · EERC — Principes · Accès vasculaires · Surveillance' },
];

const MAP = {
  timers:      <Timers />,
  checklistop: <ChecklistPreOp />,
  pansements:  <Pansements />,
  piccmidline: <PiccMidline />,
  pac:         <PAC />,
  kta:         <KTA />,
  dialyse:     <Dialyse />,
};

export default function Soins({ onBack, initialTool = null, onFavChange }) {
  const [outil, setOutil] = useState(initialTool);

  if (outil) return (
    <div style={{ minHeight:'100vh', background:T.bg, color:T.text }}>
      <div style={{ background:T.soinsDim, borderBottom:`1px solid ${C}44`, padding:'12px 16px', display:'flex', alignItems:'center', gap:10, position:'sticky', top:0, zIndex:10 }}>
        <button onClick={() => setOutil(null)} style={{ background:'none', border:'none', color:C, fontSize:20, cursor:'pointer' }}>←</button>
        <span style={{ color:T.text, fontWeight:700, fontSize:16 }}>{SOINS_LIST.find(o => o.id === outil)?.label}</span>
      </div>
      <div style={{ paddingBottom:40 }}>{MAP[outil]}</div>
    </div>
  );

  return (
    <div style={{ minHeight:'100vh', background:T.bg }}>
      <div style={{ background:T.soinsDim, borderBottom:`1px solid ${C}44`, padding:'14px 16px', display:'flex', alignItems:'center', gap:12, position:'sticky', top:0, zIndex:10 }}>
        <button onClick={onBack} style={{ background:'none', border:'none', color:C, fontSize:20, cursor:'pointer' }}>←</button>
        <div>
          <div style={{ color:C, fontFamily:'monospace', fontSize:10, letterSpacing:3 }}>MODULE</div>
          <div style={{ color:T.text, fontWeight:700, fontSize:18 }}>💉 Soins</div>
        </div>
      </div>
      <div style={{ padding:'14px' }}>
        {SOINS_LIST.map(o => (
          <div key={o.id} style={{ ...s.card, display:'flex', alignItems:'center', gap:14 }}>
            <span style={{ fontSize:28 }}>{o.icon}</span>
            <div style={{ flex:1, cursor:'pointer' }} onClick={() => setOutil(o.id)}>
              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:2 }}>
                <span style={{ color:T.text, fontWeight:700, fontSize:14 }}>{o.label}</span>
                {o.badge && <span style={{ background:C+'22', color:C, fontSize:9, fontFamily:'monospace', padding:'2px 7px', borderRadius:10 }}>{o.badge}</span>}
              </div>
              <div style={{ color:T.muted, fontSize:12 }}>{o.sub}</div>
            </div>
            <StarButton mod={MOD} toolId={o.id} label={o.label} icon={o.icon} color={C} onFavChange={onFavChange} />
            <span onClick={() => setOutil(o.id)} style={{ color:T.muted, cursor:'pointer' }}>›</span>
          </div>
        ))}
      </div>
    </div>
  );
}

import { useState } from 'react';
import { T, s } from '../../theme.js';
import StarButton from '../shared/StarButton.jsx';

const C   = T.orga;
const MOD = 'orga';

import SBAR           from './SBAR.jsx';
import Transmissions  from './Transmissions.jsx';
import PlanningJournee from './PlanningJournee.jsx';
import NormesBio      from './NormesBio.jsx';
import ChecklistMedoc from './ChecklistMedoc.jsx';

const OUTILS = [
  { id:'planning',      icon:'📅', label:'Planning de la journée',        sub:'Tâches horodatées · Catégories · Priorités · Progression' },
  { id:'sbar',          icon:'📢', label:'SBAR — Transmission structurée', sub:'Communication urgente avec le médecin · Relèves · Transferts' },
  { id:'transmissions', icon:'📝', label:'Transmissions ciblées (DLA)',    sub:'Donnée → Lien → Action · Historique 24h' },
  { id:'normes',        icon:'🔬', label:'Normes biologiques',             sub:'Hémato · Biochimie · GDS · Enzymes · Alertes' },
  { id:'medoc',         icon:'💊', label:'Checklist 5B — Médicaments',     sub:'Bon médicament · Bonne dose · Bonne voie · Bon patient · Bon moment' },
];

const MAP = {
  planning:      <PlanningJournee />,
  sbar:          <SBAR />,
  transmissions: <Transmissions />,
  normes:        <NormesBio />,
  medoc:         <ChecklistMedoc />,
};

export default function Organisation({ onBack, initialTool = null, onFavChange }) {
  const [outil, setOutil] = useState(initialTool);

  if (outil) return (
    <div style={{ minHeight:'100vh', background:T.bg, color:T.text }}>
      <div style={{ background:T.orgaDim, borderBottom:`1px solid ${C}44`, padding:'12px 16px', display:'flex', alignItems:'center', gap:10, position:'sticky', top:0, zIndex:10 }}>
        <button onClick={() => setOutil(null)} style={{ background:'none', border:'none', color:C, fontSize:20, cursor:'pointer' }}>←</button>
        <span style={{ color:T.text, fontWeight:700, fontSize:16 }}>
          {OUTILS.find(o => o.id === outil)?.icon} {OUTILS.find(o => o.id === outil)?.label}
        </span>
      </div>
      <div style={{ paddingBottom:40 }}>{MAP[outil]}</div>
    </div>
  );

  return (
    <div style={{ minHeight:'100vh', background:T.bg }}>
      <div style={{ background:T.orgaDim, borderBottom:`1px solid ${C}44`, padding:'14px 16px', display:'flex', alignItems:'center', gap:12, position:'sticky', top:0, zIndex:10 }}>
        <button onClick={onBack} style={{ background:'none', border:'none', color:C, fontSize:20, cursor:'pointer' }}>←</button>
        <div>
          <div style={{ color:C, fontFamily:'monospace', fontSize:10, letterSpacing:3 }}>MODULE</div>
          <div style={{ color:T.text, fontWeight:700, fontSize:18 }}>🗂️ Organisation</div>
        </div>
      </div>
      <div style={{ padding:'14px' }}>
        <div style={{ background:C+'18', border:`1px solid ${C}44`, borderRadius:8, padding:'10px 14px', marginBottom:14 }}>
          <div style={{ color:C, fontWeight:700, fontSize:13 }}>📋 Outils de coordination</div>
          <div style={{ color:T.muted, fontSize:12, marginTop:3 }}>Planning, transmissions, normes et sécurité médicamenteuse.</div>
        </div>
        {OUTILS.map(o => (
          <div key={o.id} style={{ ...s.card, display:'flex', alignItems:'center', gap:14 }}>
            <span style={{ fontSize:28 }}>{o.icon}</span>
            <div onClick={() => setOutil(o.id)} style={{ flex:1, cursor:'pointer' }}>
              <div style={{ color:T.text, fontWeight:700, fontSize:14, marginBottom:2 }}>{o.label}</div>
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

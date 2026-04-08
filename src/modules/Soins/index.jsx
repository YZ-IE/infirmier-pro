import { useState } from 'react';
import { T, s } from '../../theme.js';
const C = T.soins || '#06b6d4';

import Pansements from './Pansements.jsx';
import PiccMidline from './PiccMidline.jsx';
import PAC from './PAC.jsx';
import KTA from './KTA.jsx';
import Dialyse from './Dialyse.jsx';
import Timers from './Timers.jsx';

const SOINS_LIST = [
  { id: 'timers',    icon: '⏱', label: 'Timers de soins', sub: 'Antiseptiques · Perfusions · Chronomètres simultanés', badge: 'NOUVEAU' },
  { id: 'pansements', icon: '🩹', label: 'Pansements', sub: 'Tableau décisionnel par stade · Types · Règles cliniques' },
  { id: 'piccmidline', icon: '🩸', label: 'Piccline / Midline', sub: 'Indications · Pose · Entretien · Surveillance · Comparatif' },
  { id: 'pac', icon: '🔵', label: 'PAC — Chambre implantable', sub: 'Ponction · Déponction · Aiguille Huber · Complications' },
  { id: 'kta', icon: '🔴', label: 'KTA — Cathéter artériel', sub: 'PAI · Prélèvements GDS · Sécurité · Test d\'Allen' },
  { id: 'dialyse', icon: '🫀', label: 'Dialyse', sub: 'HD · DP · EERC — Principes · Accès vasculaires · Surveillance' },
];

const MAP = {
  timers:     <Timers />,
  pansements: <Pansements />,
  piccmidline: <PiccMidline />,
  pac: <PAC />,
  kta: <KTA />,
  dialyse: <Dialyse />,
};

export default function Soins({ onBack }) {
  const [soin, setSoin] = useState(null);

  if (soin) return (
    <div style={{ minHeight: '100vh', background: T.bg, color: T.text }}>
      <div style={{ background: '#0c1a2e', borderBottom: `1px solid ${C}44`, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10, position: 'sticky', top: 0, zIndex: 10 }}>
        <button onClick={() => setSoin(null)} style={{ background: 'none', border: 'none', color: C, fontSize: 20, cursor: 'pointer' }}>←</button>
        <span style={{ color: T.text, fontWeight: 700, fontSize: 16 }}>
          {SOINS_LIST.find(s => s.id === soin)?.icon} {SOINS_LIST.find(s => s.id === soin)?.label}
        </span>
      </div>
      <div style={{ paddingBottom: 40 }}>{MAP[soin]}</div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: T.bg }}>
      <div style={{ background: '#0c1a2e', borderBottom: `1px solid ${C}44`, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12, position: 'sticky', top: 0, zIndex: 10 }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', color: C, fontSize: 20, cursor: 'pointer' }}>←</button>
        <div>
          <div style={{ color: C, fontFamily: 'monospace', fontSize: 10, letterSpacing: 3 }}>MODULE</div>
          <div style={{ color: T.text, fontWeight: 700, fontSize: 18 }}>🩺 Soins infirmiers</div>
        </div>
      </div>
      <div style={{ padding: '14px' }}>
        <div style={{ background: C + '18', border: `1px solid ${C}44`, borderRadius: 8, padding: '10px 14px', marginBottom: 14 }}>
          <div style={{ color: C, fontWeight: 700, fontSize: 13 }}>📚 Protocoles & Techniques</div>
          <div style={{ color: T.muted, fontSize: 12, marginTop: 3 }}>Fiches cliniques pratiques pour les soins infirmiers courants et spécialisés.</div>
        </div>
        {SOINS_LIST.map(item => (
          <div key={item.id} onClick={() => setSoin(item.id)}
            style={{ ...s.card, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14, border: `1px solid ${item.badge ? C + '66' : T.border}` }}>
            <span style={{ fontSize: 28 }}>{item.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                <span style={{ color: T.text, fontWeight: 700, fontSize: 14 }}>{item.label}</span>
                {item.badge && <span style={{ background: C + '22', color: C, fontSize: 9, fontFamily: 'monospace', padding: '2px 7px', borderRadius: 10 }}>{item.badge}</span>}
              </div>
              <div style={{ color: T.muted, fontSize: 12 }}>{item.sub}</div>
            </div>
            <span style={{ color: T.muted }}>›</span>
          </div>
        ))}
      </div>
    </div>
  );
}

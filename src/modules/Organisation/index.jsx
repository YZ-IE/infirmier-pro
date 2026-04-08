import { useState } from 'react';
import { T, s } from '../../theme.js';
const C = T.orga;

import SBAR          from './SBAR.jsx';
import Transmissions from './Transmissions.jsx';
import PlanningJournee from './PlanningJournee.jsx';
import NormesBio     from './NormesBio.jsx';

const OUTILS = [
  {
    id: 'planning',
    icon: '📅',
    label: 'Planning de la journée',
    sub: 'Tâches horodatées · Catégories · Priorités · Progression',
    badge: 'NOUVEAU',
  },
  {
    id: 'sbar',
    icon: '📢',
    label: 'SBAR — Transmission structurée',
    sub: 'Communication urgente avec le médecin · Relèves · Transferts',
    badge: null,
  },
  {
    id: 'transmissions',
    icon: '📝',
    label: 'Transmissions ciblées (DLA)',
    sub: 'Donnée → Lien → Action · Historique 24h',
    badge: null,
  },
  {
    id: 'normes',
    icon: '🔬',
    label: 'Normes biologiques',
    sub: 'Hémato · Biochimie · GDS · Enzymes · Alertes',
    badge: null,
  },
];

const MAP = {
  planning:      <PlanningJournee />,
  sbar:          <SBAR />,
  transmissions: <Transmissions />,
  normes:        <NormesBio />,
};

export default function Organisation({ onBack }) {
  const [outil, setOutil] = useState(null);

  if (outil) return (
    <div style={{ minHeight: '100vh', background: T.bg, color: T.text }}>
      <div style={{
        background: T.orgaDim,
        borderBottom: `1px solid ${C}44`,
        padding: '12px 16px',
        display: 'flex', alignItems: 'center', gap: 10,
        position: 'sticky', top: 0, zIndex: 10,
      }}>
        <button onClick={() => setOutil(null)}
          style={{ background: 'none', border: 'none', color: C, fontSize: 20, cursor: 'pointer' }}>←</button>
        <span style={{ color: T.text, fontWeight: 700, fontSize: 16 }}>
          {OUTILS.find(o => o.id === outil)?.icon} {OUTILS.find(o => o.id === outil)?.label}
        </span>
      </div>
      <div style={{ paddingBottom: 40 }}>{MAP[outil]}</div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: T.bg }}>
      <div style={{
        background: T.orgaDim,
        borderBottom: `1px solid ${C}44`,
        padding: '14px 16px',
        display: 'flex', alignItems: 'center', gap: 12,
        position: 'sticky', top: 0, zIndex: 10,
      }}>
        <button onClick={onBack}
          style={{ background: 'none', border: 'none', color: C, fontSize: 20, cursor: 'pointer' }}>←</button>
        <div>
          <div style={{ color: C, fontFamily: 'monospace', fontSize: 10, letterSpacing: 3 }}>MODULE</div>
          <div style={{ color: T.text, fontWeight: 700, fontSize: 18 }}>🗂️ Organisation</div>
        </div>
      </div>

      <div style={{ padding: '14px' }}>
        <div style={{ background: C + '18', border: `1px solid ${C}44`, borderRadius: 8, padding: '10px 14px', marginBottom: 14 }}>
          <div style={{ color: C, fontWeight: 700, fontSize: 13 }}>📋 Outils de coordination</div>
          <div style={{ color: T.muted, fontSize: 12, marginTop: 3 }}>
            Planning, transmissions, normes biologiques et communications structurées.
          </div>
        </div>

        {OUTILS.map(o => (
          <div key={o.id} onClick={() => setOutil(o.id)}
            style={{ ...s.card, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14 }}>
            <span style={{ fontSize: 28 }}>{o.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                <span style={{ color: T.text, fontWeight: 700, fontSize: 14 }}>{o.label}</span>
                {o.badge && (
                  <span style={{
                    background: C + '22', color: C,
                    fontSize: 9, fontFamily: 'monospace',
                    padding: '2px 7px', borderRadius: 10,
                  }}>{o.badge}</span>
                )}
              </div>
              <div style={{ color: T.muted, fontSize: 12 }}>{o.sub}</div>
            </div>
            <span style={{ color: T.muted }}>›</span>
          </div>
        ))}
      </div>
    </div>
  );
}

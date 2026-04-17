import { ClinicalSource } from '../../components/ClinicalSource.jsx';
import { MedicalDisclaimer } from '../../components/MedicalDisclaimer.jsx';
import { useState } from 'react';
import { T, s } from '../../theme.js';
const C = T.score;

const ITEMS = [
  {
    label: 'Fréquence respiratoire (/min)',
    options: [
      { label: '≤ 8', score: 3 },
      { label: '9–11', score: 1 },
      { label: '12–20', score: 0 },
      { label: '21–24', score: 2 },
      { label: '≥ 25', score: 3 },
    ],
  },
  {
    label: 'SpO₂ — Échelle 1 (pas d\'O₂ ou oxygénodépendant)',
    options: [
      { label: '≥ 96%', score: 0 },
      { label: '94–95%', score: 1 },
      { label: '92–93%', score: 2 },
      { label: '≤ 91%', score: 3 },
    ],
  },
  {
    label: 'Oxygène supplémentaire',
    options: [
      { label: 'Non', score: 0 },
      { label: 'Oui', score: 2 },
    ],
  },
  {
    label: 'Pression artérielle systolique (mmHg)',
    options: [
      { label: '≤ 90', score: 3 },
      { label: '91–100', score: 2 },
      { label: '101–110', score: 1 },
      { label: '111–219', score: 0 },
      { label: '≥ 220', score: 3 },
    ],
  },
  {
    label: 'Fréquence cardiaque (/min)',
    options: [
      { label: '≤ 40', score: 3 },
      { label: '41–50', score: 1 },
      { label: '51–90', score: 0 },
      { label: '91–110', score: 1 },
      { label: '111–130', score: 2 },
      { label: '≥ 131', score: 3 },
    ],
  },
  {
    label: 'Niveau de conscience (AVPU)',
    options: [
      { label: 'A — Alerte', score: 0 },
      { label: 'C — Confus (nouveau)', score: 3 },
      { label: 'V — Répond à la voix', score: 3 },
      { label: 'P/U — Douleur/Inconscient', score: 3 },
    ],
  },
  {
    label: 'Température (°C)',
    options: [
      { label: '≤ 35,0', score: 3 },
      { label: '35,1–36,0', score: 1 },
      { label: '36,1–38,0', score: 0 },
      { label: '38,1–39,0', score: 1 },
      { label: '≥ 39,1', score: 2 },
    ],
  },
];

function interp(total) {
  if (total === 0) return { label: 'Risque faible — Surveillance standard', color: '#22c55e', freq: 'Toutes les 12h' };
  if (total <= 4) return { label: 'Risque faible', color: '#22c55e', freq: 'Surveillance minimum toutes les 4-6h' };
  if (total <= 6) return { label: 'Risque modéré — Appel médecin', color: '#f59e0b', freq: 'Surveillance toutes les 1-2h' };
  return { label: 'Risque élevé — URGENCE — Appel équipe réanimation', color: '#ef4444', freq: 'Surveillance continue' };
}

export default function NEWS2() {
  const [vals, setVals] = useState({});
  const total = Object.values(vals).reduce((a, b) => a + b, 0);
  const filled = Object.keys(vals).length === ITEMS.length;
  const { label, color, freq } = interp(total);

  return (
    <div style={{ padding: '14px' }}>
      <MedicalDisclaimer level="standard" />
      <div style={{ ...s.card, background: '#1e1b4b' }}>
        <div style={{ color: C, fontWeight: 700, marginBottom: 4 }}>Score NEWS2</div>
        <div style={{ color: T.muted, fontSize: 12 }}>National Early Warning Score 2 — Dépistage précoce de la détérioration clinique</div>
      </div>
      {ITEMS.map((item, i) => (
        <div key={i} style={s.card}>
          <div style={{ color: C, fontFamily: 'monospace', fontSize: 11, letterSpacing: 1, marginBottom: 8 }}>{item.label}</div>
          {item.options.map((opt, j) => (
            <button key={j} onClick={() => setVals(v => ({ ...v, [i]: opt.score }))} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              width: '100%', padding: '9px 12px', marginBottom: 5, borderRadius: 7,
              background: vals[i] === opt.score ? (opt.score === 0 ? '#22c55e22' : opt.score >= 3 ? '#ef444422' : '#f59e0b22') : T.bg,
              border: `1px solid ${vals[i] === opt.score ? (opt.score === 0 ? '#22c55e' : opt.score >= 3 ? '#ef4444' : '#f59e0b') : '#334155'}`,
              color: vals[i] === opt.score ? (opt.score === 0 ? '#22c55e' : opt.score >= 3 ? '#ef4444' : '#f59e0b') : T.muted,
              cursor: 'pointer', fontSize: 13, textAlign: 'left'
            }}>
              <span>{opt.label}</span>
              <span style={{ fontFamily: 'monospace', fontWeight: 700 }}>{opt.score}</span>
            </button>
          ))}
        </div>
      ))}
      <div style={{ ...s.result(filled ? color : C), textAlign: 'center' }}>
        <div style={{ color: filled ? color : T.muted, fontSize: 28, fontWeight: 700 }}>{filled ? total : '—'}</div>
        <div style={{ color: filled ? color : T.muted, fontSize: 14, marginTop: 4 }}>{filled ? label : 'Remplissez tous les critères'}</div>
        {filled && <div style={{ color: T.muted, fontSize: 12, marginTop: 6 }}>{freq}</div>}
      </div>
      <ClinicalSource sourceKey="NEWS2" />
    </div>
  );
}

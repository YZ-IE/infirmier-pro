import { MedicalDisclaimer } from '../../components/MedicalDisclaimer.jsx';
import { useState } from 'react';
import { T, s } from '../../theme.js';
const C = T.score;

const ITEMS = [
  {
    label: 'Respiration — PaO₂/FiO₂ (mmHg)',
    options: [
      { label: '≥ 400', score: 0 },
      { label: '300–399', score: 1 },
      { label: '200–299', score: 2 },
      { label: '100–199 + VM', score: 3 },
      { label: '< 100 + VM', score: 4 },
    ],
  },
  {
    label: 'Coagulation — Plaquettes (×10³/µL)',
    options: [
      { label: '≥ 150', score: 0 },
      { label: '100–149', score: 1 },
      { label: '50–99', score: 2 },
      { label: '20–49', score: 3 },
      { label: '< 20', score: 4 },
    ],
  },
  {
    label: 'Foie — Bilirubine (µmol/L)',
    options: [
      { label: '< 20', score: 0 },
      { label: '20–32', score: 1 },
      { label: '33–101', score: 2 },
      { label: '102–204', score: 3 },
      { label: '> 204', score: 4 },
    ],
  },
  {
    label: 'Cardiovasculaire — Vasopresseurs',
    options: [
      { label: 'PAM ≥ 70 sans amine', score: 0 },
      { label: 'PAM < 70 sans amine', score: 1 },
      { label: 'Dopamine ≤ 5 ou Dobutamine', score: 2 },
      { label: 'Dopamine > 5 ou Noradrénaline ≤ 0,1 µg/kg/min', score: 3 },
      { label: 'Dopamine > 15 ou Noradrénaline > 0,1 µg/kg/min', score: 4 },
    ],
  },
  {
    label: 'Neurologique — Score de Glasgow',
    options: [
      { label: '15', score: 0 },
      { label: '13–14', score: 1 },
      { label: '10–12', score: 2 },
      { label: '6–9', score: 3 },
      { label: '< 6', score: 4 },
    ],
  },
  {
    label: 'Rénal — Créatinine (µmol/L) ou diurèse',
    options: [
      { label: '< 110', score: 0 },
      { label: '110–170', score: 1 },
      { label: '171–299', score: 2 },
      { label: '300–440 ou diurèse < 500 ml/j', score: 3 },
      { label: '> 440 ou diurèse < 200 ml/j', score: 4 },
    ],
  },
];

function interp(total) {
  if (total <= 1) return { label: 'Mortalité < 10%', color: '#22c55e' };
  if (total <= 3) return { label: 'Mortalité < 10%', color: '#22c55e' };
  if (total <= 6) return { label: 'Mortalité ~10%', color: '#eab308' };
  if (total <= 9) return { label: 'Mortalité ~15-20%', color: '#f97316' };
  if (total <= 12) return { label: 'Mortalité ~40-50%', color: '#ef4444' };
  return { label: 'Mortalité > 80%', color: '#dc2626' };
}

export default function SOFA() {
  const [vals, setVals] = useState({});
  const total = Object.values(vals).reduce((a, b) => a + b, 0);
  const filled = Object.keys(vals).length === ITEMS.length;
  const { label, color } = interp(total);

  return (
    <div style={{ padding: '14px' }}>
      <MedicalDisclaimer level="standard" />
      <div style={{ ...s.card, background: '#1e1b4b' }}>
        <div style={{ color: C, fontWeight: 700, marginBottom: 4 }}>Score SOFA</div>
        <div style={{ color: T.muted, fontSize: 12 }}>Sequential Organ Failure Assessment — Évaluation de la défaillance multi-organe en réanimation</div>
      </div>
      {ITEMS.map((item, i) => (
        <div key={i} style={s.card}>
          <div style={{ color: C, fontFamily: 'monospace', fontSize: 11, letterSpacing: 1, marginBottom: 8 }}>{item.label}</div>
          {item.options.map((opt, j) => (
            <button key={j} onClick={() => setVals(v => ({ ...v, [i]: opt.score }))} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              width: '100%', padding: '9px 12px', marginBottom: 5, borderRadius: 7,
              background: vals[i] === opt.score ? C + '22' : T.bg,
              border: `1px solid ${vals[i] === opt.score ? C : '#334155'}`,
              color: vals[i] === opt.score ? C : T.muted,
              cursor: 'pointer', fontSize: 13, textAlign: 'left'
            }}>
              <span>{opt.label}</span>
              <span style={{ fontFamily: 'monospace', fontWeight: 700 }}>{opt.score}</span>
            </button>
          ))}
        </div>
      ))}
      <div style={{ ...s.result(filled ? color : C), textAlign: 'center', animation: 'fadeIn 0.3s' }}>
        <div style={{ color: filled ? color : T.muted, fontSize: 28, fontWeight: 700 }}>{filled ? total : '—'} / 24</div>
        <div style={{ color: filled ? color : T.muted, fontSize: 14, marginTop: 4 }}>{filled ? label : 'Remplissez tous les critères'}</div>
        {filled && total >= 2 && <div style={{ color: '#f87171', fontSize: 12, marginTop: 8 }}>⚠️ SOFA ≥ 2 = Sepsis — Alerter le médecin</div>}
      </div>
    </div>
  );
}

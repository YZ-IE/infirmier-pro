import { useState } from 'react';
import { T, s } from '../../theme.js';
const C = T.score;

// ── Interprétation GDS ──────────────────────────────────────────────────────
function interpret({ pH, pao2, paco2, hco3 }) {
  const results = [];

  // 1. Trouble acido-basique primaire
  const acidose = pH < 7.35;
  const alcalose = pH > 7.45;
  const normal = !acidose && !alcalose;

  if (normal) {
    results.push({ label: 'pH normal', color: '#22c55e', icon: '✅' });
  }

  // Trouble respiratoire
  const respAcidose = acidose && paco2 > 45;
  const respAlcalose = alcalose && paco2 < 35;
  // Trouble métabolique
  const metaAcidose = acidose && hco3 < 22;
  const metaAlcalose = alcalose && hco3 > 26;

  if (respAcidose) results.push({ label: 'Acidose respiratoire', color: '#ef4444', icon: '🔴', detail: 'PaCO₂ ↑ · Hypoventilation (BPCO, dépression SNC, obésité)' });
  if (respAlcalose) results.push({ label: 'Alcalose respiratoire', color: '#f59e0b', icon: '🟡', detail: 'PaCO₂ ↓ · Hyperventilation (anxiété, hypoxémie, sepsis)' });
  if (metaAcidose) results.push({ label: 'Acidose métabolique', color: '#ef4444', icon: '🔴', detail: 'HCO₃ ↓ · Diarrhée, IR, acidocétose, intoxication' });
  if (metaAlcalose) results.push({ label: 'Alcalose métabolique', color: '#f59e0b', icon: '🟡', detail: 'HCO₃ ↑ · Vomissements, diurétiques, hypokaliémie' });

  // 2. Compensation
  if (respAcidose) {
    const compHco3Expected = 24 + 0.1 * (paco2 - 40);
    const compensated = Math.abs(hco3 - compHco3Expected) < 3;
    results.push({ label: compensated ? 'Compensation métabolique adéquate' : 'Compensation métabolique insuffisante', color: compensated ? '#22c55e' : '#94a3b8', icon: compensated ? '✅' : 'ℹ️' });
  }
  if (metaAcidose) {
    const compPaco2Expected = 1.5 * hco3 + 8;
    const compensated = Math.abs(paco2 - compPaco2Expected) < 2;
    results.push({ label: compensated ? 'Compensation respiratoire (formule de Winter)' : 'Pas de compensation complète', color: compensated ? '#22c55e' : '#94a3b8', icon: compensated ? '✅' : 'ℹ️' });
  }

  // 3. Oxygénation
  if (pao2 < 60) results.push({ label: 'Hypoxémie sévère', color: '#ef4444', icon: '⚠️', detail: 'PaO₂ < 60 mmHg · Assistance ventilatoire à envisager' });
  else if (pao2 < 80) results.push({ label: 'Hypoxémie modérée', color: '#f59e0b', icon: '⚠️', detail: 'PaO₂ 60-80 mmHg · Oxygénothérapie à optimiser' });
  else results.push({ label: 'Oxygénation normale', color: '#22c55e', icon: '✅' });

  // 4. Trou anionique (si acidose méta)
  if (metaAcidose) {
    const ta = 140 - (104 + hco3);
    const elevated = ta > 12;
    results.push({
      label: `Trou anionique : ${ta.toFixed(0)} mEq/L`,
      color: elevated ? '#ef4444' : '#22c55e',
      icon: elevated ? '🔴' : '✅',
      detail: elevated
        ? 'TA élevé → Lactates, céto-acidose, IR, intoxication (MUDPILES)'
        : 'TA normal → Perte de HCO₃ (diarrhée, acidose hyperchlorémique)',
    });
  }

  if (results.length === 1 && normal) {
    results.push({ label: 'Gaz du sang dans les normes', color: '#22c55e', icon: '✅', detail: 'pH 7.35–7.45 · PaCO₂ 35–45 · HCO₃ 22–26 · PaO₂ 80–100' });
  }

  return results;
}

const NORMES = [
  { p: 'pH',    n: '7.35 – 7.45', u: '' },
  { p: 'PaO₂',  n: '80 – 100',    u: 'mmHg' },
  { p: 'PaCO₂', n: '35 – 45',     u: 'mmHg' },
  { p: 'HCO₃',  n: '22 – 26',     u: 'mEq/L' },
];

export default function GDS() {
  const [vals, setVals] = useState({ pH: '', pao2: '', paco2: '', hco3: '' });
  const set = (k, v) => setVals(p => ({ ...p, [k]: v }));

  const allFilled = Object.values(vals).every(v => v !== '' && !isNaN(parseFloat(v)));
  const parsed = allFilled ? { pH: parseFloat(vals.pH), pao2: parseFloat(vals.pao2), paco2: parseFloat(vals.paco2), hco3: parseFloat(vals.hco3) } : null;
  const results = parsed ? interpret(parsed) : [];

  const fields = [
    { key: 'pH',    label: 'pH artériel',   min: 6.8, max: 7.8, step: 0.01, normal: '7.35–7.45' },
    { key: 'pao2',  label: 'PaO₂ (mmHg)',   min: 20,  max: 600, step: 1,    normal: '80–100' },
    { key: 'paco2', label: 'PaCO₂ (mmHg)',  min: 10,  max: 100, step: 1,    normal: '35–45' },
    { key: 'hco3',  label: 'HCO₃ (mEq/L)', min: 5,   max: 50,  step: 0.1,  normal: '22–26' },
  ];

  return (
    <div style={{ padding: '14px' }}>
      {/* Valeurs normales */}
      <div style={{ ...s.card, background: C + '11', border: `1px solid ${C}33`, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginBottom: 14 }}>
        {NORMES.map(n => (
          <div key={n.p} style={{ textAlign: 'center' }}>
            <div style={{ color: C, fontFamily: 'monospace', fontSize: 12, fontWeight: 700 }}>{n.p}</div>
            <div style={{ color: T.text, fontSize: 12 }}>{n.n} {n.u}</div>
          </div>
        ))}
      </div>

      {/* Saisie */}
      {fields.map(f => (
        <div key={f.key} style={s.card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ ...s.label, marginBottom: 0 }}>{f.label}</span>
            <span style={{ color: T.muted, fontSize: 11 }}>N: {f.normal}</span>
          </div>
          <input
            type="number"
            step={f.step}
            min={f.min}
            max={f.max}
            value={vals[f.key]}
            onChange={e => set(f.key, e.target.value)}
            placeholder={f.normal}
            style={{ ...s.input, fontSize: 18, fontWeight: 700, textAlign: 'center' }}
          />
        </div>
      ))}

      {/* Résultats */}
      {allFilled && (
        <div style={{ marginTop: 4, animation: 'fadeIn 0.3s ease' }}>
          <div style={{ color: C, fontFamily: 'monospace', fontSize: 11, letterSpacing: 2, marginBottom: 10 }}>▸ INTERPRÉTATION</div>
          {results.map((r, i) => (
            <div key={i} style={{ background: r.color + '18', border: `1px solid ${r.color}44`, borderRadius: 10, padding: '12px 14px', marginBottom: 8 }}>
              <div style={{ color: r.color, fontWeight: 700, fontSize: 14 }}>{r.icon} {r.label}</div>
              {r.detail && <div style={{ color: T.muted, fontSize: 12, marginTop: 4 }}>{r.detail}</div>}
            </div>
          ))}
          <button onClick={() => setVals({ pH: '', pao2: '', paco2: '', hco3: '' })}
            style={{ ...s.btn('#64748b'), width: '100%', marginTop: 6, padding: '10px' }}>
            🔄 Réinitialiser
          </button>
        </div>
      )}

      {!allFilled && (
        <div style={{ textAlign: 'center', color: T.muted, fontSize: 13, padding: '20px 0' }}>
          Renseigner les 4 valeurs pour obtenir l'interprétation
        </div>
      )}

      {/* Aide-mémoire */}
      <div style={{ ...s.card, marginTop: 10 }}>
        <div style={{ color: C, fontFamily: 'monospace', fontSize: 11, letterSpacing: 2, marginBottom: 8 }}>AIDE-MÉMOIRE</div>
        {[
          ['Acidose respir.', 'pH↓ · PaCO₂↑ · compensation HCO₃↑'],
          ['Alcalose respir.', 'pH↑ · PaCO₂↓ · compensation HCO₃↓'],
          ['Acidose méta.', 'pH↓ · HCO₃↓ · compensation PaCO₂↓'],
          ['Alcalose méta.', 'pH↑ · HCO₃↑ · compensation PaCO₂↑'],
        ].map(([t, d]) => (
          <div key={t} style={{ display: 'flex', gap: 10, marginBottom: 6 }}>
            <span style={{ color: C, fontSize: 12, minWidth: 120, fontFamily: 'monospace' }}>{t}</span>
            <span style={{ color: T.muted, fontSize: 12 }}>{d}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

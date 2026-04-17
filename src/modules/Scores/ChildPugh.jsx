import { MedicalDisclaimer } from '../../components/MedicalDisclaimer.jsx';
import { useState } from 'react';
import { T, s } from '../../theme.js';
const C = T.score;

const CP_ITEMS = [
  { id: 'bili',   label: 'Bilirubine (µmol/L)', opts: [{ v: 1, l: '< 34' }, { v: 2, l: '34 – 51' }, { v: 3, l: '> 51' }] },
  { id: 'alb',    label: 'Albumine (g/L)',       opts: [{ v: 1, l: '> 35' }, { v: 2, l: '28 – 35' }, { v: 3, l: '< 28' }] },
  { id: 'tp',     label: 'TP / INR',             opts: [{ v: 1, l: 'TP > 70% / INR < 1.7' }, { v: 2, l: 'TP 40–70% / INR 1.7–2.3' }, { v: 3, l: 'TP < 40% / INR > 2.3' }] },
  { id: 'ascite', label: 'Ascite',               opts: [{ v: 1, l: 'Absente' }, { v: 2, l: 'Modérée (contrôlée)' }, { v: 3, l: 'Réfractaire' }] },
  { id: 'enceph', label: 'Encéphalopathie',       opts: [{ v: 1, l: 'Absente' }, { v: 2, l: 'Grade 1–2' }, { v: 3, l: 'Grade 3–4' }] },
];

export default function ChildPugh() {
  const [mode, setMode] = useState('cp');
  const [sel, setSel] = useState({});
  // MELD
  const [bili, setBili] = useState('');
  const [creat, setCreat] = useState('');
  const [inr, setInr] = useState('');
  const [dialyse, setDialyse] = useState(false);

  const cpTotal = CP_ITEMS.reduce((a, it) => a + (sel[it.id] || 0), 0);
  const cpDone = CP_ITEMS.every(it => sel[it.id]);
  const cpClass = cpTotal <= 6 ? ['A', '#22c55e', '1–2 ans : 85–100%'] : cpTotal <= 9 ? ['B', '#f59e0b', '1–2 ans : 60–80%'] : ['C', '#ef4444', '1–2 ans : 35–45%'];

  const calcMELD = () => {
    let b = parseFloat(bili) / 17.1; // µmol/L → mg/dL
    let c = parseFloat(creat) / 88.4; // µmol/L → mg/dL
    let i = parseFloat(inr);
    if (dialyse) c = 4.0;
    b = Math.max(b, 1); c = Math.max(c, 1); i = Math.max(i, 1);
    b = Math.min(b, 40); c = Math.min(c, 4);
    const meld = Math.round(9.57 * Math.log(c) + 3.78 * Math.log(b) + 11.2 * Math.log(i) + 6.43);
    return Math.max(6, meld);
  };
  const meldValid = bili && creat && inr && !isNaN(parseFloat(bili)) && !isNaN(parseFloat(creat)) && !isNaN(parseFloat(inr));
  const meldScore = meldValid ? calcMELD() : null;
  const meldRisk = !meldScore ? null : meldScore < 10 ? ['Mortalité 3 mois < 2%', '#22c55e'] : meldScore < 20 ? ['Mortalité 3 mois ~6%', '#f59e0b'] : meldScore < 30 ? ['Mortalité 3 mois ~20%', '#f97316'] : ['Mortalité 3 mois > 50%', '#ef4444'];

  return (
    <div style={{ padding: '14px' }}>
      <MedicalDisclaimer level="standard" />
      <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
        {[['cp', '🫀 Child-Pugh'], ['meld', '🧬 MELD']].map(([m, l]) => (
          <button key={m} onClick={() => setMode(m)}
            style={{ flex: 1, padding: '10px', borderRadius: 8, border: `1px solid ${mode === m ? C : T.border}`, background: mode === m ? C + '22' : T.surface, color: mode === m ? C : T.muted, fontWeight: 700, cursor: 'pointer' }}>
            {l}
          </button>
        ))}
      </div>

      {mode === 'cp' && (
        <>
          <div style={{ ...s.card, background: C + '11', border: `1px solid ${C}33`, marginBottom: 14 }}>
            <div style={{ color: C, fontWeight: 700, fontSize: 13 }}>Child-Pugh — Cirrhose hépatique</div>
            <div style={{ color: T.muted, fontSize: 12, marginTop: 3 }}>Score /15 · Classe A (5–6) · B (7–9) · C (10–15)</div>
          </div>
          {CP_ITEMS.map(item => (
            <div key={item.id} style={s.card}>
              <div style={{ color: C, fontFamily: 'monospace', fontSize: 12, letterSpacing: 1, marginBottom: 8 }}>{item.label}</div>
              {item.opts.map(opt => (
                <button key={opt.v} onClick={() => setSel(p => ({ ...p, [item.id]: opt.v }))}
                  style={{ display: 'flex', justifyContent: 'space-between', width: '100%', background: sel[item.id] === opt.v ? C + '22' : T.bg, border: `1px solid ${sel[item.id] === opt.v ? C : T.border}`, borderRadius: 7, padding: '9px 12px', marginBottom: 5, cursor: 'pointer', textAlign: 'left' }}>
                  <span style={{ color: sel[item.id] === opt.v ? C : T.text, fontSize: 13 }}>{opt.l}</span>
                  <span style={{ color: C, fontFamily: 'monospace', fontSize: 14, fontWeight: 700 }}>{opt.v}</span>
                </button>
              ))}
            </div>
          ))}
          <div style={{ ...s.result(cpDone ? cpClass[1] : '#475569'), textAlign: 'center' }}>
            <div style={{ color: cpDone ? cpClass[1] : T.muted, fontSize: 36, fontWeight: 700 }}>{cpDone ? cpTotal : '?'}/15</div>
            <div style={{ color: cpDone ? cpClass[1] : T.muted, fontSize: 18, fontWeight: 700, marginTop: 4 }}>{cpDone ? `Classe ${cpClass[0]}` : 'Compléter'}</div>
            {cpDone && <div style={{ color: T.muted, fontSize: 13, marginTop: 6 }}>Survie {cpClass[2]}</div>}
          </div>
          {cpDone && cpTotal >= 10 && (
            <div style={{ background: '#ef444418', border: '1px solid #ef444444', borderRadius: 10, padding: '12px 14px', marginTop: 10 }}>
              <div style={{ color: '#ef4444', fontWeight: 700, fontSize: 13 }}>⚠️ Classe C — Évaluation greffe hépatique</div>
              <div style={{ color: T.muted, fontSize: 12, marginTop: 4 }}>Transplantation hépatique à discuter en RCP · MELD à calculer</div>
            </div>
          )}
        </>
      )}

      {mode === 'meld' && (
        <>
          <div style={{ ...s.card, background: C + '11', border: `1px solid ${C}33`, marginBottom: 14 }}>
            <div style={{ color: C, fontWeight: 700, fontSize: 13 }}>MELD — Model for End-Stage Liver Disease</div>
            <div style={{ color: T.muted, fontSize: 12, marginTop: 3 }}>Priorisation greffe · Mortalité à 3 mois · Score 6–40</div>
          </div>
          {[['bili', 'Bilirubine (µmol/L)', setBili, bili], ['creat', 'Créatinine (µmol/L)', setCreat, creat], ['inr', 'INR', setInr, inr]].map(([id, label, setter, val]) => (
            <div key={id} style={s.card}>
              <label style={s.label}>{label}</label>
              <input type="number" step="0.1" value={val} onChange={e => setter(e.target.value)}
                style={{ ...s.input, fontSize: 18, fontWeight: 700, textAlign: 'center' }} />
            </div>
          ))}
          <div onClick={() => setDialyse(p => !p)}
            style={{ ...s.card, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: dialyse ? C + '18' : T.surface, border: `1px solid ${dialyse ? C : T.border}` }}>
            <span style={{ color: dialyse ? C : T.text, fontSize: 13 }}>Dialyse rénale (≥ 2×/sem.)</span>
            <span style={{ color: C, fontSize: 18 }}>{dialyse ? '✅' : '☐'}</span>
          </div>
          {meldScore && (
            <div style={{ ...s.result(meldRisk[1]), textAlign: 'center', marginTop: 10 }}>
              <div style={{ color: meldRisk[1], fontSize: 36, fontWeight: 700 }}>{meldScore}</div>
              <div style={{ color: meldRisk[1], fontSize: 14, fontWeight: 700, marginTop: 4 }}>{meldRisk[0]}</div>
              {meldScore >= 15 && <div style={{ color: T.muted, fontSize: 12, marginTop: 6 }}>MELD ≥ 15 → Bénéfice de la transplantation</div>}
            </div>
          )}
        </>
      )}
    </div>
  );
}

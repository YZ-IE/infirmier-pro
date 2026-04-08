import { useState } from 'react';
import { T, s } from '../../theme.js';
const C = T.score;

const RANKIN = [
  { v: 0, l: 'Aucun symptôme', detail: 'Pas de déficit neurologique' },
  { v: 1, l: 'Symptômes mineurs', detail: 'Pas de gêne dans les activités habituelles' },
  { v: 2, l: 'Handicap léger', detail: 'Incapable d\'effectuer toutes les activités — autonome sans aide' },
  { v: 3, l: 'Handicap modéré', detail: 'Nécessite une aide mais marche seul' },
  { v: 4, l: 'Handicap modéré-sévère', detail: 'Incapable de marcher seul · dépendant pour soins corporels' },
  { v: 5, l: 'Handicap sévère', detail: 'Grabataire · incontinent · soins permanents' },
  { v: 6, l: 'Décès', detail: '' },
];

const RANKIN_COL = ['#22c55e','#86efac','#f59e0b','#f97316','#ef4444','#ef4444','#64748b'];

export default function RankinCockcroft() {
  const [mode, setMode] = useState('rankin');
  const [rankin, setRankin] = useState(null);
  const [poids, setPoids] = useState('');
  const [age, setAge] = useState('');
  const [creat, setCreat] = useState('');
  const [sexe, setSexe] = useState('H');

  const calcCock = () => {
    const p = parseFloat(poids), a = parseFloat(age), c = parseFloat(creat);
    if (!p || !a || !c) return null;
    const raw = ((140 - a) * p) / (0.81 * c);
    return sexe === 'F' ? raw * 0.85 : raw;
  };
  const cock = calcCock();
  const cockStade = !cock ? null : cock >= 90 ? ['Stade 1 — Normal ou augmenté', '#22c55e'] : cock >= 60 ? ['Stade 2 — Légèrement diminuée', '#86efac'] : cock >= 30 ? ['Stade 3 — Modérément diminuée', '#f59e0b'] : cock >= 15 ? ['Stade 4 — Sévèrement diminuée', '#f97316'] : ['Stade 5 — Insuffisance rénale terminale', '#ef4444'];

  return (
    <div style={{ padding: '14px' }}>
      <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
        {[['rankin', '🧠 Rankin modifié'], ['cock', '🫘 Cockcroft IR']].map(([m, l]) => (
          <button key={m} onClick={() => setMode(m)}
            style={{ flex: 1, padding: '10px', borderRadius: 8, border: `1px solid ${mode === m ? C : T.border}`, background: mode === m ? C + '22' : T.surface, color: mode === m ? C : T.muted, fontWeight: 700, cursor: 'pointer', fontSize: 12 }}>
            {l}
          </button>
        ))}
      </div>

      {mode === 'rankin' && (
        <>
          <div style={{ ...s.card, background: C + '11', border: `1px solid ${C}33`, marginBottom: 14 }}>
            <div style={{ color: C, fontWeight: 700, fontSize: 13 }}>Rankin modifié — Séquelles AVC</div>
            <div style={{ color: T.muted, fontSize: 12, marginTop: 3 }}>Score 0–6 · Évaluation du handicap fonctionnel résiduel</div>
          </div>
          {RANKIN.map(r => (
            <div key={r.v} onClick={() => setRankin(r.v)}
              style={{ ...s.card, cursor: 'pointer', display: 'flex', gap: 14, alignItems: 'flex-start', background: rankin === r.v ? RANKIN_COL[r.v] + '18' : T.surface, border: `1px solid ${rankin === r.v ? RANKIN_COL[r.v] : T.border}` }}>
              <div style={{ width: 36, height: 36, borderRadius: 18, background: RANKIN_COL[r.v] + '33', border: `2px solid ${RANKIN_COL[r.v]}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: RANKIN_COL[r.v], fontWeight: 700, fontSize: 16, flexShrink: 0 }}>{r.v}</div>
              <div>
                <div style={{ color: rankin === r.v ? RANKIN_COL[r.v] : T.text, fontWeight: 700, fontSize: 14 }}>{r.l}</div>
                {r.detail && <div style={{ color: T.muted, fontSize: 12, marginTop: 3 }}>{r.detail}</div>}
              </div>
            </div>
          ))}
          {rankin !== null && (
            <div style={{ ...s.result(RANKIN_COL[rankin]), textAlign: 'center', marginTop: 4 }}>
              <div style={{ color: RANKIN_COL[rankin], fontSize: 36, fontWeight: 700 }}>{rankin}/6</div>
              <div style={{ color: RANKIN_COL[rankin], fontSize: 15, fontWeight: 700, marginTop: 4 }}>{RANKIN[rankin].l}</div>
              {rankin >= 3 && <div style={{ color: T.muted, fontSize: 12, marginTop: 6 }}>Rééducation · Évaluation autonomie · Adaptation du logement</div>}
            </div>
          )}
        </>
      )}

      {mode === 'cock' && (
        <>
          <div style={{ ...s.card, background: C + '11', border: `1px solid ${C}33`, marginBottom: 14 }}>
            <div style={{ color: C, fontWeight: 700, fontSize: 13 }}>Cockcroft-Gault — Clairance de la créatinine</div>
            <div style={{ color: T.muted, fontSize: 12, marginTop: 3 }}>Estimation du DFG · Ajustement des doses médicamenteuses</div>
          </div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
            {[['H', '♂ Homme'], ['F', '♀ Femme']].map(([v, l]) => (
              <button key={v} onClick={() => setSexe(v)}
                style={{ flex: 1, padding: '10px', borderRadius: 8, border: `1px solid ${sexe === v ? C : T.border}`, background: sexe === v ? C + '22' : T.surface, color: sexe === v ? C : T.muted, fontWeight: 700, cursor: 'pointer' }}>
                {l}
              </button>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 14 }}>
            {[['age', 'Âge (ans)', age, setAge], ['poids', 'Poids (kg)', poids, setPoids], ['creat', 'Créat. (µmol/L)', creat, setCreat]].map(([id, label, val, setter]) => (
              <div key={id} style={s.card}>
                <label style={s.label}>{label}</label>
                <input type="number" value={val} onChange={e => setter(e.target.value)}
                  style={{ ...s.input, textAlign: 'center', fontSize: 16, fontWeight: 700 }} />
              </div>
            ))}
          </div>
          {cock && (
            <>
              <div style={{ ...s.result(cockStade[1]), textAlign: 'center', marginBottom: 10 }}>
                <div style={{ color: cockStade[1], fontSize: 32, fontWeight: 700 }}>{cock.toFixed(0)} mL/min</div>
                <div style={{ color: cockStade[1], fontSize: 14, fontWeight: 700, marginTop: 4 }}>{cockStade[0]}</div>
              </div>
              <div style={s.card}>
                <div style={{ color: C, fontFamily: 'monospace', fontSize: 11, letterSpacing: 2, marginBottom: 10 }}>AJUSTEMENT DOSES COURANTES</div>
                {[
                  ['Metformine', cock >= 60 ? '✅ Dose normale' : cock >= 30 ? '⚠️ Réduire 50%' : '🚫 Contre-indiquée'],
                  ['HBPM (Lovenox)', cock >= 30 ? '✅ Dose normale' : '⚠️ HNF préférable · RCP'],
                  ['Dabigatran', cock >= 50 ? '✅ Dose normale' : cock >= 30 ? '⚠️ Réduire dose' : '🚫 Contre-indiqué'],
                  ['Amoxicilline', cock >= 30 ? '✅ Dose normale' : '⚠️ Intervalles prolongés'],
                  ['Digoxine', cock >= 50 ? '✅ Surveiller' : '⚠️ Réduire dose · doser taux'],
                  ['Morphine', cock >= 30 ? '✅ Dose normale' : '⚠️ Espacer les prises'],
                ].map(([med, rec]) => (
                  <div key={med} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, gap: 10 }}>
                    <span style={{ color: T.text, fontSize: 13 }}>{med}</span>
                    <span style={{ color: rec.startsWith('✅') ? '#22c55e' : rec.startsWith('⚠️') ? '#f59e0b' : '#ef4444', fontSize: 12, textAlign: 'right', flex: 1 }}>{rec}</span>
                  </div>
                ))}
                <div style={{ color: '#64748b', fontSize: 11, marginTop: 6 }}>⚠️ Toujours vérifier le RCP du médicament</div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

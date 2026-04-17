import { ClinicalSource } from '../../components/ClinicalSource.jsx';
import { MedicalDisclaimer } from '../../components/MedicalDisclaimer.jsx';
import { useState } from 'react';
import { T, s } from '../../theme.js';
const C = T.score;

const TVP_ITEMS = [
  { id: 'cancer',    l: 'Cancer actif (traitement < 6 mois ou palliatif)',     v: 1 },
  { id: 'paralysie', l: 'Paralysie, parésie ou immobilisation plâtrée jambe',  v: 1 },
  { id: 'alite',     l: 'Alitement > 3j ou chirurgie < 12 semaines',           v: 1 },
  { id: 'trajet',    l: 'Trajet du système veineux profond douloureux',        v: 1 },
  { id: 'jambe',     l: 'Jambe entière gonflée',                               v: 1 },
  { id: 'mollet',    l: 'Mollet > 3 cm par rapport au côté sain',             v: 1 },
  { id: 'oedeme',    l: 'Œdème prenant le godet (côté symptomatique)',         v: 1 },
  { id: 'colvein',   l: 'Veines superficielles collatérales non variqueuses',  v: 1 },
  { id: 'autre',     l: 'Diagnostic alternatif aussi probable ou plus probable', v: -2 },
];

const EP_ITEMS = [
  { id: 'tvp',      l: 'Signes cliniques de TVP',                            v: 3 },
  { id: 'altdg',    l: 'EP plus probable qu\'un autre diagnostic',           v: 3 },
  { id: 'fc',       l: 'FC > 100 bpm',                                       v: 1.5 },
  { id: 'immob',    l: 'Immobilisation > 3j ou chirurgie < 4 semaines',      v: 1.5 },
  { id: 'atcd',     l: 'ATCD TVP ou EP',                                     v: 1.5 },
  { id: 'hemopt',   l: 'Hémoptysie',                                         v: 1 },
  { id: 'cancerEP', l: 'Cancer (traitement < 6 mois ou palliatif)',          v: 1 },
];

export default function Wells() {
  const [mode, setMode] = useState('tvp');
  const [sel, setSel] = useState({});

  const items = mode === 'tvp' ? TVP_ITEMS : EP_ITEMS;
  const total = items.reduce((a, it) => a + (sel[it.id] ? it.v : 0), 0);

  const tvpRisk = total <= 0 ? ['Faible probabilité', '#22c55e', 'D-Dimères suffisants'] : total <= 2 ? ['Probabilité intermédiaire', '#f59e0b', 'D-Dimères + écho-Doppler'] : ['Forte probabilité', '#ef4444', 'Écho-Doppler en urgence'];
  const epRisk  = total < 2  ? ['Faible probabilité', '#22c55e', 'D-Dimères (ELISA) suffisants'] : total <= 6 ? ['Probabilité intermédiaire', '#f59e0b', 'D-Dimères + Angio-TDM'] : ['Forte probabilité', '#ef4444', 'Angio-TDM thoracique en urgence'];
  const [risk, col, action] = mode === 'tvp' ? tvpRisk : epRisk;

  const toggle = id => setSel(p => ({ ...p, [id]: !p[id] }));

  return (
    <div style={{ padding: '14px' }}>
      <MedicalDisclaimer level="standard" />
      {/* Mode TVP / EP */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
        {[['tvp', '🦵 TVP'], ['ep', '🫁 EP']].map(([m, l]) => (
          <button key={m} onClick={() => { setMode(m); setSel({}); }}
            style={{ flex: 1, padding: '10px', borderRadius: 8, border: `1px solid ${mode === m ? C : T.border}`, background: mode === m ? C + '22' : T.surface, color: mode === m ? C : T.muted, fontWeight: 700, cursor: 'pointer' }}>
            {l}
          </button>
        ))}
      </div>

      <div style={{ ...s.card, background: C + '11', border: `1px solid ${C}33`, marginBottom: 14 }}>
        <div style={{ color: C, fontWeight: 700, fontSize: 13 }}>Score de Wells — {mode === 'tvp' ? 'Thrombose Veineuse Profonde' : 'Embolie Pulmonaire'}</div>
        <div style={{ color: T.muted, fontSize: 12, marginTop: 3 }}>Cocher les critères présents</div>
      </div>

      {items.map(it => (
        <div key={it.id} onClick={() => toggle(it.id)} style={{ ...s.card, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: sel[it.id] ? C + '18' : T.surface, border: `1px solid ${sel[it.id] ? C : T.border}` }}>
          <span style={{ color: sel[it.id] ? C : T.text, fontSize: 13, flex: 1, paddingRight: 8 }}>{it.l}</span>
          <span style={{ color: C, fontFamily: 'monospace', fontWeight: 700, fontSize: 14, minWidth: 32, textAlign: 'right' }}>{it.v > 0 ? '+' : ''}{it.v}</span>
        </div>
      ))}

      <div style={{ ...s.result(col), textAlign: 'center', animation: 'fadeIn 0.3s ease' }}>
        <div style={{ color: col, fontSize: 32, fontWeight: 700 }}>{total}</div>
        <div style={{ color: col, fontSize: 15, fontWeight: 700, marginTop: 4 }}>{risk}</div>
        <div style={{ color: T.muted, fontSize: 13, marginTop: 6 }}>→ {action}</div>
      </div>

      <div style={{ ...s.card, marginTop: 10 }}>
        <div style={{ color: C, fontFamily: 'monospace', fontSize: 11, letterSpacing: 2, marginBottom: 8 }}>{mode === 'tvp' ? 'TVP' : 'EP'} · INTERPRÉTATION</div>
        {(mode === 'tvp'
          ? [['≤ 0', 'Faible', 'D-Dimères'], ['1–2', 'Intermédiaire', 'D-Dimères + Doppler'], ['≥ 3', 'Forte', 'Doppler urgent']]
          : [['< 2', 'Faible', 'D-Dimères ELISA'], ['2–6', 'Intermédiaire', 'D-Dimères + TDM'], ['> 6', 'Forte', 'Angio-TDM urgent']]
        ).map(([sc, r, a]) => (
          <div key={sc} style={{ display: 'flex', gap: 8, marginBottom: 5, fontSize: 12 }}>
            <span style={{ color: C, fontFamily: 'monospace', minWidth: 40 }}>{sc}</span>
            <span style={{ color: T.text, minWidth: 80 }}>{r}</span>
            <span style={{ color: T.muted }}>{a}</span>
          </div>
        ))}
      </div>
      <ClinicalSource sourceKey="WELLS_TVP" />
    </div>
  );
}

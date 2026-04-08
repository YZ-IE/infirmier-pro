import { useState } from 'react';
import { T, s } from '../../theme.js';
const C = T.score;

const ITEMS = [
  {
    id: 'nausees', label: 'Nausées / Vomissements',
    opts: [{ v: 0, l: 'Absents' }, { v: 1, l: 'Légères nausées, pas de vomissements' }, { v: 4, l: 'Nausées intermittentes avec haut-le-cœur' }, { v: 7, l: 'Vomissements constants' }],
  },
  {
    id: 'tremblements', label: 'Tremblements (bras tendus)',
    opts: [{ v: 0, l: 'Absents' }, { v: 1, l: 'Non visibles, palpables' }, { v: 4, l: 'Modérés, bras tendus' }, { v: 7, l: 'Sévères, même au repos' }],
  },
  {
    id: 'sueurs', label: 'Sueurs paroxystiques',
    opts: [{ v: 0, l: 'Absentes' }, { v: 1, l: 'Légèrement humide' }, { v: 4, l: 'Sueurs en perles sur le front' }, { v: 7, l: 'Sueurs profuses' }],
  },
  {
    id: 'anxiete', label: 'Anxiété',
    opts: [{ v: 0, l: 'Aucune' }, { v: 1, l: 'Légèrement anxieux' }, { v: 4, l: 'Modérément anxieux ou surveillant' }, { v: 7, l: 'Panique aiguë — délire / crise' }],
  },
  {
    id: 'agitation', label: 'Agitation',
    opts: [{ v: 0, l: 'Normal' }, { v: 1, l: 'Légèrement agité' }, { v: 4, l: 'Modérément agité' }, { v: 7, l: 'Agitation continue' }],
  },
  {
    id: 'perceptuelles', label: 'Troubles perceptuels (hallucinations)',
    opts: [{ v: 0, l: 'Absents' }, { v: 1, l: 'Très légèrement conscient' }, { v: 2, l: 'Légèrement (sensitives)' }, { v: 3, l: 'Modérément (sensitives)' }, { v: 4, l: 'Hallucinations modérément sévères' }, { v: 5, l: 'Hallucinations sévères' }, { v: 6, l: 'Terreurs extrêmes' }, { v: 7, l: 'Hallucinations permanentes' }],
  },
  {
    id: 'cephalees', label: 'Céphalées / Pesanteur crânienne',
    opts: [{ v: 0, l: 'Absentes' }, { v: 1, l: 'Très légères' }, { v: 2, l: 'Légères' }, { v: 3, l: 'Modérées' }, { v: 4, l: 'Modérément sévères' }, { v: 5, l: 'Sévères' }, { v: 6, l: 'Très sévères' }, { v: 7, l: 'Extrêmes' }],
  },
  {
    id: 'orientation', label: 'Orientation et trouble de la conscience',
    opts: [{ v: 0, l: 'Orienté — Fait les séries correctement' }, { v: 1, l: 'Incertain de la date (± 2j)' }, { v: 2, l: 'Date erronée (> 2j)' }, { v: 3, l: 'Désorienté au lieu / aux personnes' }, { v: 4, l: 'Désorientation permanente' }],
  },
];

const getSeverity = n =>
  n < 8  ? ['Sevrage léger', '#22c55e', 'Surveillance, hydratation, vitamines B1'] :
  n < 15 ? ['Sevrage modéré', '#f59e0b', 'Benzodiazépines à envisager, surveillance rapprochée'] :
  n < 20 ? ['Sevrage sévère', '#f97316', 'Benzodiazépines IV, surveillance continue'] :
           ['Sevrage très sévère', '#ef4444', '⚠️ Urgence — Risque de convulsions / delirium tremens'];

export default function CIWA() {
  const [sel, setSel] = useState({});
  const filled = Object.keys(sel).length;
  const total = Object.values(sel).reduce((a, b) => a + b, 0);
  const done = filled === ITEMS.length;
  const [label, col, action] = done ? getSeverity(total) : ['', C, ''];

  return (
    <div style={{ padding: '14px' }}>
      <div style={{ ...s.card, background: '#ef444411', border: '1px solid #ef444433', marginBottom: 14 }}>
        <div style={{ color: '#ef4444', fontWeight: 700, fontSize: 13 }}>CIWA-Ar — Sevrage alcool</div>
        <div style={{ color: T.muted, fontSize: 12, marginTop: 3 }}>Clinical Institute Withdrawal Assessment · Score max : 67 · {filled}/{ITEMS.length} items</div>
        <div style={{ color: T.muted, fontSize: 11, marginTop: 4 }}>⏱ À répéter toutes les 1–4h selon sévérité</div>
      </div>

      {ITEMS.map(item => (
        <div key={item.id} style={s.card}>
          <div style={{ color: C, fontFamily: 'monospace', fontSize: 12, letterSpacing: 1, marginBottom: 8 }}>{item.label}</div>
          {item.opts.map(opt => (
            <button key={opt.v} onClick={() => setSel(p => ({ ...p, [item.id]: opt.v }))}
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', background: sel[item.id] === opt.v ? C + '22' : T.bg, border: `1px solid ${sel[item.id] === opt.v ? C : T.border}`, borderRadius: 7, padding: '9px 12px', marginBottom: 5, cursor: 'pointer', textAlign: 'left' }}>
              <span style={{ color: sel[item.id] === opt.v ? C : T.text, fontSize: 13 }}>{opt.l}</span>
              <span style={{ color: C, fontFamily: 'monospace', fontSize: 14, fontWeight: 700 }}>{opt.v}</span>
            </button>
          ))}
        </div>
      ))}

      <div style={{ ...s.result(done ? col : '#475569'), textAlign: 'center', animation: 'fadeIn 0.3s ease' }}>
        <div style={{ color: done ? col : T.muted, fontSize: 32, fontWeight: 700 }}>{done ? total : '?'}<span style={{ fontSize: 16 }}>/67</span></div>
        <div style={{ color: done ? col : T.muted, fontSize: 14, fontWeight: 700, marginTop: 4 }}>{done ? label : 'Compléter le score'}</div>
        {done && <div style={{ color: T.muted, fontSize: 12, marginTop: 6 }}>→ {action}</div>}
      </div>

      {done && total >= 15 && (
        <div style={{ background: '#ef444418', border: '1px solid #ef444444', borderRadius: 10, padding: '12px 14px', marginTop: 10 }}>
          <div style={{ color: '#ef4444', fontWeight: 700, fontSize: 13, marginBottom: 6 }}>⚠️ Points d'alerte</div>
          {[
            'Convulsions généralisées : 12–48h après l\'arrêt',
            'Delirium tremens : 48–72h · mortalité 5–15% non traité',
            'Benzodiazépines : Diazépam ou Lorazépam selon prescription',
            'Vitamines B1 (Thiamine) systématiques avant resucrage',
          ].map((a, i) => <div key={i} style={{ color: T.muted, fontSize: 12, marginBottom: 4 }}>• {a}</div>)}
        </div>
      )}
    </div>
  );
}

import { useState } from 'react';
import { T, s } from '../../theme.js';
const C = T.score;

const ITEMS = [
  { id: '1a', label: '1a · Niveau de conscience', opts: [{ v: 0, l: 'Alerte' }, { v: 1, l: 'Somnolent (stimulable)' }, { v: 2, l: 'Obnubilé (stimulations répétées)' }, { v: 3, l: 'Coma / aréactif' }] },
  { id: '1b', label: '1b · Questions (mois, âge)', opts: [{ v: 0, l: '2 réponses correctes' }, { v: 1, l: '1 réponse correcte' }, { v: 2, l: '0 réponse correcte' }] },
  { id: '1c', label: '1c · Ordres (fermer yeux, poing)', opts: [{ v: 0, l: '2 ordres effectués' }, { v: 1, l: '1 ordre effectué' }, { v: 2, l: '0 ordre effectué' }] },
  { id: '2', label: '2 · Oculomotricité', opts: [{ v: 0, l: 'Normale' }, { v: 1, l: 'Paralysie partielle' }, { v: 2, l: 'Déviation forcée' }] },
  { id: '3', label: '3 · Champ visuel', opts: [{ v: 0, l: 'Normal' }, { v: 1, l: 'Hémianopsie partielle' }, { v: 2, l: 'Hémianopsie complète' }, { v: 3, l: 'Cécité bilatérale' }] },
  { id: '4', label: '4 · Paralysie faciale', opts: [{ v: 0, l: 'Normale' }, { v: 1, l: 'Mineure' }, { v: 2, l: 'Partielle' }, { v: 3, l: 'Complète' }] },
  { id: '5a', label: '5a · Motricité bras gauche (tenu 10s)', opts: [{ v: 0, l: 'Pas de chute' }, { v: 1, l: 'Chute < 10s' }, { v: 2, l: 'Effort contre pesanteur' }, { v: 3, l: 'Pas d\'effort contre pesanteur' }, { v: 4, l: 'Aucun mouvement' }] },
  { id: '5b', label: '5b · Motricité bras droit (tenu 10s)', opts: [{ v: 0, l: 'Pas de chute' }, { v: 1, l: 'Chute < 10s' }, { v: 2, l: 'Effort contre pesanteur' }, { v: 3, l: 'Pas d\'effort contre pesanteur' }, { v: 4, l: 'Aucun mouvement' }] },
  { id: '6a', label: '6a · Motricité jambe gauche (tenu 5s)', opts: [{ v: 0, l: 'Pas de chute' }, { v: 1, l: 'Chute < 5s' }, { v: 2, l: 'Effort contre pesanteur' }, { v: 3, l: 'Pas d\'effort contre pesanteur' }, { v: 4, l: 'Aucun mouvement' }] },
  { id: '6b', label: '6b · Motricité jambe droite (tenu 5s)', opts: [{ v: 0, l: 'Pas de chute' }, { v: 1, l: 'Chute < 5s' }, { v: 2, l: 'Effort contre pesanteur' }, { v: 3, l: 'Pas d\'effort contre pesanteur' }, { v: 4, l: 'Aucun mouvement' }] },
  { id: '7', label: '7 · Ataxie des membres', opts: [{ v: 0, l: 'Absente' }, { v: 1, l: '1 membre' }, { v: 2, l: '2 membres' }] },
  { id: '8', label: '8 · Sensibilité', opts: [{ v: 0, l: 'Normale' }, { v: 1, l: 'Hypoesthésie légère' }, { v: 2, l: 'Anesthésie / severe' }] },
  { id: '9', label: '9 · Langage (aphasie)', opts: [{ v: 0, l: 'Normal' }, { v: 1, l: 'Légère / modérée' }, { v: 2, l: 'Sévère (expression très limitée)' }, { v: 3, l: 'Mutisme / globale' }] },
  { id: '10', label: '10 · Dysarthrie', opts: [{ v: 0, l: 'Normale' }, { v: 1, l: 'Légère à modérée' }, { v: 2, l: 'Sévère / anarthrie' }] },
  { id: '11', label: '11 · Extinction / négligence', opts: [{ v: 0, l: 'Aucune' }, { v: 1, l: 'Extinction d\'une modalité' }, { v: 2, l: 'Hémiasomatognosie sévère' }] },
];

const getSeverity = n => n === 0 ? ['Normal', '#22c55e'] : n <= 4 ? ['AVC mineur', '#22c55e'] : n <= 15 ? ['AVC modéré', '#f59e0b'] : n <= 20 ? ['AVC modéré-sévère', '#f97316'] : ['AVC sévère', '#ef4444'];

export default function NIHSS() {
  const [sel, setSel] = useState({});
  const filled = Object.keys(sel).length;
  const total = Object.values(sel).reduce((a, b) => a + b, 0);
  const done = filled === ITEMS.length;
  const [sev, col] = done ? getSeverity(total) : ['', C];

  return (
    <div style={{ padding: '14px' }}>
      <div style={{ ...s.card, background: C + '11', border: `1px solid ${C}33`, marginBottom: 14 }}>
        <div style={{ color: C, fontWeight: 700, fontSize: 13 }}>NIHSS — National Institutes of Health Stroke Scale</div>
        <div style={{ color: T.muted, fontSize: 12, marginTop: 3 }}>Score 0–42 · Évaluation neuro post-AVC · {filled}/{ITEMS.length} items</div>
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
        <div style={{ color: done ? col : T.muted, fontSize: 32, fontWeight: 700 }}>{done ? total : '?'}<span style={{ fontSize: 16 }}>/42</span></div>
        <div style={{ color: done ? col : T.muted, fontSize: 15, fontWeight: 600, marginTop: 4 }}>{done ? sev : 'Compléter le score'}</div>
        {done && total >= 6 && <div style={{ color: '#f59e0b', fontSize: 12, marginTop: 6 }}>⚠️ Seuil thrombolyse : discuter avec neurologue</div>}
      </div>

      <div style={{ ...s.card, marginTop: 10 }}>
        <div style={{ color: C, fontFamily: 'monospace', fontSize: 11, letterSpacing: 2, marginBottom: 8 }}>INTERPRÉTATION</div>
        {[['0', 'Normal'], ['1–4', 'AVC mineur'], ['5–15', 'AVC modéré'], ['16–20', 'AVC modéré-sévère'], ['21–42', 'AVC sévère']].map(([sc, lb]) => (
          <div key={sc} style={{ display: 'flex', gap: 10, marginBottom: 5 }}>
            <span style={{ color: C, fontFamily: 'monospace', fontSize: 12, minWidth: 50 }}>{sc}</span>
            <span style={{ color: T.muted, fontSize: 13 }}>{lb}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

import { MedicalDisclaimer } from '../../components/MedicalDisclaimer.jsx';
import { useState } from 'react';
import { T, s } from '../../theme.js';
const C = T.score;

const ITEMS = [
  {
    id: 'facial',
    label: 'Expression faciale',
    options: [
      { score: 0, label: 'Détendu', desc: 'Aucune tension musculaire observée' },
      { score: 1, label: 'Tendu',   desc: 'Froncement des sourcils, sourcils abaissés, orbites tendues' },
      { score: 2, label: 'Grimace', desc: 'Tous les mouvements faciaux précédents + yeux fermés fort' },
    ],
  },
  {
    id: 'mouvements',
    label: 'Mouvements corporels',
    options: [
      { score: 0, label: 'Absence', desc: 'Ne bouge pas du tout (ne signifie pas nécessairement absence de douleur)' },
      { score: 1, label: 'Protection', desc: 'Mouvements lents et prudents, touche ou gratte la zone douloureuse' },
      { score: 2, label: 'Agitation', desc: 'Tire sur les tubes, tente de se lever, bouge les extrémités / frappe' },
    ],
  },
  {
    id: 'tension',
    label: 'Tension musculaire (flexion/extension passive)',
    options: [
      { score: 0, label: 'Détendu', desc: 'Pas de résistance aux mouvements passifs' },
      { score: 1, label: 'Tendu/Rigide', desc: 'Résistance aux mouvements passifs' },
      { score: 2, label: 'Très tendu/Rigide', desc: 'Forte résistance aux mouvements passifs, impossibilité de les terminer' },
    ],
  },
  {
    id: 'ventilation',
    label: 'Compliance ventilatoire (ventilé) / Vocalisation (non ventilé)',
    options: [
      { score: 0, label: 'Tolérance ventilateur / Voix normale', desc: 'Alarmes absentes, tolérance au ventilateur · Ou : parle normalement / ne fait aucun son' },
      { score: 1, label: 'Alarmes intermittentes / Soupirs', desc: 'Alarmes s\'arrêtent spontanément · Ou : soupirs, gémissements' },
      { score: 2, label: 'Désynchronisation / Cris', desc: 'Désynchronisation avec le ventilateur · Ou : pleure, crie' },
    ],
  },
];

function getInterp(total) {
  if (total === 0) return { text: 'Pas de douleur détectable', color: '#22c55e' };
  if (total <= 2)  return { text: 'Douleur légère — Réévaluer après analgésie', color: '#fbbf24' };
  if (total <= 4)  return { text: 'Douleur modérée — Analgésie recommandée', color: '#f97316' };
  return           { text: 'Douleur sévère — Analgésie urgente', color: '#ef4444' };
}

export default function CPOT() {
  const [scores, setScores] = useState({});

  const setScore = (id, val) => setScores(p => ({ ...p, [id]: val }));

  const completed = Object.keys(scores).length === ITEMS.length;
  const total     = Object.values(scores).reduce((a, b) => a + b, 0);
  const interp    = completed ? getInterp(total) : null;

  return (
    <div style={{ padding: '14px', paddingBottom: 40 }}>
      <MedicalDisclaimer level="standard" />
      {/* Intro */}
      <div style={{ ...s.card, background: T.scoreDim, marginBottom: 14 }}>
        <div style={{ color: C, fontWeight: 700, fontSize: 15, marginBottom: 4 }}>CPOT — Critical-Care Pain Observation Tool</div>
        <div style={{ color: T.muted, fontSize: 12, lineHeight: 1.5 }}>
          Évaluation de la douleur chez les patients non communicants (intubés, inconscients). Score de 0 à 8. Seuil d'intervention : ≥ 3.
        </div>
      </div>

      {/* Score total */}
      {completed && interp && (
        <div style={{ ...s.result(interp.color), marginBottom: 14, animation: 'fadeIn 0.3s ease' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 52, height: 52, borderRadius: 12, background: interp.color + '33', border: `2px solid ${interp.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: interp.color, fontWeight: 700, fontSize: 26 }}>{total}</div>
            <div>
              <div style={{ color: interp.color, fontWeight: 700, fontSize: 16 }}>CPOT = {total}/8</div>
              <div style={{ color: T.muted, fontSize: 12, marginTop: 2 }}>{interp.text}</div>
            </div>
          </div>
          {total >= 3 && (
            <div style={{ marginTop: 8, color: '#f97316', fontSize: 12, fontFamily: 'monospace' }}>
              ⚠️ Score ≥ 3 : traitement antalgique recommandé · Réévaluer dans 30 min
            </div>
          )}
        </div>
      )}

      {/* Items */}
      {ITEMS.map(item => (
        <div key={item.id} style={{ ...s.card, marginBottom: 10 }}>
          <div style={{ color: C, fontWeight: 700, fontSize: 13, marginBottom: 10 }}>
            {item.label}
            {scores[item.id] !== undefined && (
              <span style={{ marginLeft: 8, background: C + '33', color: C, fontSize: 11, padding: '2px 8px', borderRadius: 8, fontFamily: 'monospace' }}>
                Score : {scores[item.id]}
              </span>
            )}
          </div>
          {item.options.map(opt => (
            <div key={opt.score} onClick={() => setScore(item.id, opt.score)} style={{
              display: 'flex', alignItems: 'flex-start', gap: 10,
              padding: '8px 10px', marginBottom: 6, borderRadius: 7, cursor: 'pointer',
              background: scores[item.id] === opt.score ? C + '22' : T.bg,
              border: `1px solid ${scores[item.id] === opt.score ? C : T.border}`,
            }}>
              <div style={{
                width: 24, height: 24, borderRadius: 6, flexShrink: 0,
                background: scores[item.id] === opt.score ? C : 'transparent',
                border: `2px solid ${scores[item.id] === opt.score ? C : T.border}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: scores[item.id] === opt.score ? '#fff' : T.muted,
                fontSize: 12, fontWeight: 700,
              }}>{opt.score}</div>
              <div>
                <div style={{ color: scores[item.id] === opt.score ? C : T.text, fontWeight: 600, fontSize: 13 }}>{opt.label}</div>
                <div style={{ color: T.muted, fontSize: 11, lineHeight: 1.4, marginTop: 2 }}>{opt.desc}</div>
              </div>
            </div>
          ))}
        </div>
      ))}

      {!completed && (
        <div style={{ color: T.muted, fontSize: 12, textAlign: 'center', padding: '10px', fontFamily: 'monospace' }}>
          Évaluez les {ITEMS.length} items pour obtenir le score total
        </div>
      )}

      {/* Bouton reset */}
      {completed && (
        <button onClick={() => setScores({})} style={{ ...s.btn(T.muted), width: '100%', marginTop: 8 }}>
          ↺ Réinitialiser
        </button>
      )}

      {/* Référence */}
      <div style={{ ...s.card, marginTop: 14 }}>
        <div style={{ color: C, fontFamily: 'monospace', fontSize: 11, letterSpacing: 2, marginBottom: 8 }}>INTERPRÉTATION</div>
        {[
          ['0', 'Pas de douleur détectable', '#22c55e'],
          ['1–2', 'Douleur légère', '#fbbf24'],
          ['3–4', 'Douleur modérée — Seuil d\'intervention', '#f97316'],
          ['5–8', 'Douleur sévère', '#ef4444'],
        ].map(([score, text, color]) => (
          <div key={score} style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 7, paddingBottom: 7, borderBottom: '1px solid #1e293b' }}>
            <div style={{ width: 36, height: 24, borderRadius: 6, background: color + '22', border: `1px solid ${color}`, color, fontFamily: 'monospace', fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{score}</div>
            <div style={{ color: T.muted, fontSize: 12 }}>{text}</div>
          </div>
        ))}
        <div style={{ color: T.muted, fontSize: 11, marginTop: 4 }}>
          Gélinas C. et al. (2006) · ICU pain assessment in patients unable to self-report
        </div>
      </div>
    </div>
  );
}

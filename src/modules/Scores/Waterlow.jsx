import { useState } from 'react';
import { T, s } from '../../theme.js';
const C = T.score;

const ITEMS = [
  {
    label: 'Corpulence (poids/taille)',
    options: [{ label: 'Moyen', score: 0 }, { label: 'Au-dessus de la moyenne', score: 1 }, { label: 'Obèse', score: 2 }, { label: 'En-dessous de la moyenne', score: 3 }],
  },
  {
    label: 'Type de peau / Zone à risque',
    options: [{ label: 'Saine', score: 0 }, { label: 'Papier de soie / Sèche', score: 1 }, { label: 'Œdémateuse', score: 1 }, { label: 'Froide / Moite', score: 2 }, { label: 'Décolorée', score: 2 }, { label: 'Lésée', score: 3 }],
  },
  {
    label: 'Sexe / Âge',
    options: [{ label: 'Homme', score: 1 }, { label: 'Femme', score: 2 }, { label: '14–49 ans', score: 1 }, { label: '50–64 ans', score: 2 }, { label: '65–74 ans', score: 3 }, { label: '75–80 ans', score: 4 }, { label: '> 80 ans', score: 5 }],
  },
  {
    label: 'Continence',
    options: [{ label: 'Continent', score: 0 }, { label: 'Sonde urinaire / Incontinence urinaire', score: 1 }, { label: 'Incontinence urinaire intermittente', score: 2 }, { label: 'Incontinence fécale + urinaire', score: 3 }],
  },
  {
    label: 'Mobilité',
    options: [{ label: 'Pleinement mobile', score: 0 }, { label: 'Agité / Impatient', score: 1 }, { label: 'Apathique', score: 2 }, { label: 'Limité / Restreint', score: 3 }, { label: 'Inerte', score: 4 }, { label: 'En traction', score: 5 }],
  },
  {
    label: 'Appétit / Alimentation',
    options: [{ label: 'Normal', score: 0 }, { label: 'Pauvre', score: 1 }, { label: 'Sonde naso-gastrique / Liquides IV', score: 2 }, { label: 'Anorexie / Anorexie', score: 3 }],
  },
  {
    label: 'Facteurs spéciaux',
    options: [{ label: 'Aucun', score: 0 }, { label: 'Déficit neurologique (ex : diabète, SEP)', score: 4 }, { label: 'Chirurgie majeure / Traumatisme', score: 5 }, { label: 'Médicaments : stéroïdes, cytotoxiques, AINS', score: 4 }, { label: 'Insuffisance cardiaque terminale / cachexie', score: 8 }],
  },
];

function interp(total) {
  if (total < 10) return { label: 'Risque faible', color: '#22c55e' };
  if (total < 15) return { label: 'Risque élevé', color: '#f59e0b' };
  if (total < 20) return { label: 'Risque très élevé', color: '#f97316' };
  return { label: 'Risque extrême', color: '#ef4444' };
}

export default function Waterlow() {
  const [vals, setVals] = useState({});
  const total = Object.values(vals).reduce((a, b) => a + b, 0);
  const filled = Object.keys(vals).length === ITEMS.length;
  const { label, color } = interp(total);

  return (
    <div style={{ padding: '14px' }}>
      <div style={{ ...s.card, background: '#1e1b4b' }}>
        <div style={{ color: C, fontWeight: 700, marginBottom: 4 }}>Score de Waterlow</div>
        <div style={{ color: T.muted, fontSize: 12 }}>Évaluation du risque d'escarres — Plus sensible que Norton pour les patients chirurgicaux</div>
      </div>
      {ITEMS.map((item, i) => (
        <div key={i} style={s.card}>
          <div style={{ color: C, fontFamily: 'monospace', fontSize: 11, letterSpacing: 1, marginBottom: 8 }}>{item.label}</div>
          {item.options.map((opt, j) => (
            <button key={j} onClick={() => setVals(v => ({ ...v, [i]: opt.score }))} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              width: '100%', padding: '8px 12px', marginBottom: 5, borderRadius: 7,
              background: vals[i] === opt.score ? C + '22' : T.bg,
              border: `1px solid ${vals[i] === opt.score ? C : '#334155'}`,
              color: vals[i] === opt.score ? C : T.muted,
              cursor: 'pointer', fontSize: 12, textAlign: 'left'
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
        {filled && total >= 10 && <div style={{ color: T.muted, fontSize: 12, marginTop: 6 }}>Matelas adapté · Repositionnement régulier · Nutrition optimisée</div>}
      </div>
    </div>
  );
}

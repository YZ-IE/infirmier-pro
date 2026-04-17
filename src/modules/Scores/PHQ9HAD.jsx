import { MedicalDisclaimer } from '../../components/MedicalDisclaimer.jsx';
import { useState } from 'react';
import { T, s } from '../../theme.js';
const C = T.score;

const PHQ9_ITEMS = [
  'Peu d\'intérêt ou de plaisir à faire les choses',
  'Se sentir triste, déprimé(e) ou désespéré(e)',
  'Difficultés à s\'endormir, rester endormi(e) ou dormir trop',
  'Se sentir fatigué(e) ou manquer d\'énergie',
  'Peu d\'appétit ou manger trop',
  'Mauvaise image de soi — se sentir nul(le) ou avoir déçu sa famille',
  'Difficultés à se concentrer (lecture, TV...)',
  'Bouger ou parler si lentement que les autres le remarquent — ou être si agité(e)',
  'Pensées que vous seriez mieux mort(e) ou de vous faire du mal',
];

const PHQ9_OPTS = ['Jamais','Plusieurs jours','Plus de la moitié du temps','Presque tous les jours'];

const HAD_A = [
  { q: 'Je me sens tendu(e) ou énervé(e)', opts: ['Jamais','De temps en temps','Souvent','La plupart du temps'] },
  { q: 'J\'ai une sensation de peur comme si quelque chose d\'horrible allait m\'arriver', opts: ['Pas du tout','Un peu mais cela ne m\'inquiète pas','Oui, mais ce n\'est pas trop grave','Oui, très nettement'] },
  { q: 'Je me fais du souci', opts: ['Très occasionnellement','Occasionnellement','Assez souvent','Très souvent'] },
  { q: 'Je peux rester tranquillement assis(e) sans me sentir nerveux(se)', opts: ['Oui, c\'est sûr','Oui, en général','Rarement','Jamais'] },
  { q: 'J\'ai des sensations de peur et j\'ai l\'estomac noué', opts: ['Jamais','Parfois','Assez souvent','Très souvent'] },
  { q: 'J\'ai la bougeotte et n\'arrive pas à tenir en place', opts: ['Pas du tout','Peu','Assez','Beaucoup'] },
  { q: 'J\'ai des sensations soudaines de panique', opts: ['Jamais','Pas très souvent','Assez souvent','Vraiment souvent'] },
];

const HAD_D = [
  { q: 'Je prends plaisir aux mêmes choses qu\'autrefois', opts: ['Autant qu\'avant','Pas autant','Un peu seulement','Presque plus'] },
  { q: 'Je ris facilement et vois le bon côté des choses', opts: ['Autant que d\'habitude','Plus autant','Vraiment moins','Plus du tout'] },
  { q: 'Je suis de bonne humeur', opts: ['La plupart du temps','Assez souvent','Rarement','Jamais'] },
  { q: 'J\'ai l\'impression de fonctionner au ralenti', opts: ['Jamais','Parfois','Très souvent','Presque toujours'] },
  { q: 'Je me m\'intéresse plus à mon apparence', opts: ['J\'y prête autant attention','Je n\'y accorde pas autant d\'attention','Je n\'y accorde plus beaucoup','Plus du tout'] },
  { q: 'Je me réjouis d\'avance à l\'idée de faire certaines choses', opts: ['Autant qu\'avant','Moins qu\'avant','Bien moins qu\'avant','Presque jamais'] },
  { q: 'Je peux apprécier un bon livre ou une bonne émission radio/TV', opts: ['Souvent','Parfois','Rarement','Très rarement'] },
];

export default function PHQ9HAD() {
  const [mode, setMode] = useState('phq9');
  const [sel, setSel] = useState({});

  const toggle = (id, v) => setSel(p => ({ ...p, [id]: v }));

  // PHQ-9
  const phqTotal = PHQ9_ITEMS.reduce((a, _, i) => a + (sel[`p${i}`] || 0), 0);
  const phqDone = PHQ9_ITEMS.every((_, i) => sel[`p${i}`] !== undefined);
  const phqRisk = phqTotal < 5 ? ['Pas de dépression', '#22c55e'] : phqTotal < 10 ? ['Dépression légère', '#86efac'] : phqTotal < 15 ? ['Dépression modérée', '#f59e0b'] : phqTotal < 20 ? ['Dépression modérément sévère', '#f97316'] : ['Dépression sévère', '#ef4444'];

  // HAD
  const hadA = HAD_A.reduce((a, _, i) => a + (sel[`ha${i}`] || 0), 0);
  const hadD = HAD_D.reduce((a, _, i) => a + (sel[`hd${i}`] || 0), 0);
  const hadADone = HAD_A.every((_, i) => sel[`ha${i}`] !== undefined);
  const hadDDone = HAD_D.every((_, i) => sel[`hd${i}`] !== undefined);
  const hadScore = (sc) => sc <= 7 ? ['Absent', '#22c55e'] : sc <= 10 ? ['Douteux', '#f59e0b'] : ['Certain', '#ef4444'];

  return (
    <div style={{ padding: '14px' }}>
      <MedicalDisclaimer level="standard" />
      <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
        {[['phq9', '📋 PHQ-9'], ['had', '🧩 HAD']].map(([m, l]) => (
          <button key={m} onClick={() => { setMode(m); setSel({}); }}
            style={{ flex: 1, padding: '10px', borderRadius: 8, border: `1px solid ${mode === m ? C : T.border}`, background: mode === m ? C + '22' : T.surface, color: mode === m ? C : T.muted, fontWeight: 700, cursor: 'pointer' }}>
            {l}
          </button>
        ))}
      </div>

      {mode === 'phq9' && (
        <>
          <div style={{ ...s.card, background: C + '11', border: `1px solid ${C}33`, marginBottom: 14 }}>
            <div style={{ color: C, fontWeight: 700, fontSize: 13 }}>PHQ-9 — Dépression</div>
            <div style={{ color: T.muted, fontSize: 12, marginTop: 3 }}>Patient Health Questionnaire · Au cours des 2 dernières semaines</div>
          </div>
          {PHQ9_ITEMS.map((q, i) => (
            <div key={i} style={{ ...s.card, borderLeft: i === 8 ? '3px solid #ef4444' : undefined }}>
              {i === 8 && <div style={{ color: '#ef4444', fontSize: 11, fontFamily: 'monospace', marginBottom: 4 }}>⚠️ ITEM SUICIDAIRE</div>}
              <div style={{ color: T.text, fontSize: 13, marginBottom: 10 }}>{i + 1}. {q}</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 5 }}>
                {PHQ9_OPTS.map((opt, j) => (
                  <button key={j} onClick={() => toggle(`p${i}`, j)}
                    style={{ background: sel[`p${i}`] === j ? C + '22' : T.bg, border: `1px solid ${sel[`p${i}`] === j ? C : T.border}`, borderRadius: 7, padding: '8px 10px', cursor: 'pointer', textAlign: 'left' }}>
                    <span style={{ color: sel[`p${i}`] === j ? C : T.muted, fontSize: 12 }}>{opt}</span>
                    <span style={{ color: C, fontFamily: 'monospace', fontSize: 12, float: 'right' }}>{j}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
          {sel['p8'] > 0 && (
            <div style={{ background: '#ef444418', border: '1px solid #ef444444', borderRadius: 10, padding: '12px 14px', marginBottom: 10 }}>
              <div style={{ color: '#ef4444', fontWeight: 700 }}>⚠️ Item suicidaire positif</div>
              <div style={{ color: T.muted, fontSize: 12, marginTop: 4 }}>Évaluation psychiatrique urgente à envisager · Ne pas laisser le patient seul</div>
            </div>
          )}
          <div style={{ ...s.result(phqDone ? phqRisk[1] : '#475569'), textAlign: 'center' }}>
            <div style={{ color: phqDone ? phqRisk[1] : T.muted, fontSize: 32, fontWeight: 700 }}>{phqDone ? phqTotal : '?'}/27</div>
            <div style={{ color: phqDone ? phqRisk[1] : T.muted, fontSize: 14, fontWeight: 700, marginTop: 4 }}>{phqDone ? phqRisk[0] : 'Compléter'}</div>
          </div>
          <div style={{ ...s.card, marginTop: 10 }}>
            <div style={{ color: C, fontFamily: 'monospace', fontSize: 11, letterSpacing: 2, marginBottom: 8 }}>SEUILS PHQ-9</div>
            {[['0–4','Pas de dépression'],['5–9','Légère'],['10–14','Modérée'],['15–19','Modérément sévère'],['20–27','Sévère']].map(([sc,lb])=>(
              <div key={sc} style={{display:'flex',gap:10,marginBottom:5,fontSize:12}}>
                <span style={{color:C,fontFamily:'monospace',minWidth:50}}>{sc}</span>
                <span style={{color:T.muted}}>{lb}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {mode === 'had' && (
        <>
          <div style={{ ...s.card, background: C + '11', border: `1px solid ${C}33`, marginBottom: 14 }}>
            <div style={{ color: C, fontWeight: 700, fontSize: 13 }}>HAD — Anxiété & Dépression</div>
            <div style={{ color: T.muted, fontSize: 12, marginTop: 3 }}>Hospital Anxiety and Depression Scale · 7 items chacun · /21</div>
          </div>

          <div style={{ color: C, fontFamily: 'monospace', fontSize: 11, letterSpacing: 2, margin: '0 0 8px' }}>ANXIÉTÉ (A)</div>
          {HAD_A.map((item, i) => (
            <div key={i} style={s.card}>
              <div style={{ color: T.text, fontSize: 13, marginBottom: 10 }}>{item.q}</div>
              {item.opts.map((opt, j) => (
                <button key={j} onClick={() => toggle(`ha${i}`, j)}
                  style={{ display: 'flex', justifyContent: 'space-between', width: '100%', background: sel[`ha${i}`] === j ? C + '22' : T.bg, border: `1px solid ${sel[`ha${i}`] === j ? C : T.border}`, borderRadius: 7, padding: '8px 12px', marginBottom: 5, cursor: 'pointer', textAlign: 'left' }}>
                  <span style={{ color: sel[`ha${i}`] === j ? C : T.muted, fontSize: 13 }}>{opt}</span>
                  <span style={{ color: C, fontFamily: 'monospace', fontSize: 13 }}>{j}</span>
                </button>
              ))}
            </div>
          ))}

          <div style={{ color: '#f59e0b', fontFamily: 'monospace', fontSize: 11, letterSpacing: 2, margin: '10px 0 8px' }}>DÉPRESSION (D)</div>
          {HAD_D.map((item, i) => (
            <div key={i} style={s.card}>
              <div style={{ color: T.text, fontSize: 13, marginBottom: 10 }}>{item.q}</div>
              {item.opts.map((opt, j) => (
                <button key={j} onClick={() => toggle(`hd${i}`, j)}
                  style={{ display: 'flex', justifyContent: 'space-between', width: '100%', background: sel[`hd${i}`] === j ? '#f59e0b22' : T.bg, border: `1px solid ${sel[`hd${i}`] === j ? '#f59e0b' : T.border}`, borderRadius: 7, padding: '8px 12px', marginBottom: 5, cursor: 'pointer', textAlign: 'left' }}>
                  <span style={{ color: sel[`hd${i}`] === j ? '#f59e0b' : T.muted, fontSize: 13 }}>{opt}</span>
                  <span style={{ color: '#f59e0b', fontFamily: 'monospace', fontSize: 13 }}>{j}</span>
                </button>
              ))}
            </div>
          ))}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 10 }}>
            {[[hadA, hadADone, 'Anxiété', C], [hadD, hadDDone, 'Dépression', '#f59e0b']].map(([sc, done, lb, col]) => {
              const [risk, rcol] = hadScore(sc);
              return (
                <div key={lb} style={{ ...s.result(done ? rcol : '#475569'), textAlign: 'center' }}>
                  <div style={{ color: col, fontFamily: 'monospace', fontSize: 11, marginBottom: 4 }}>{lb}</div>
                  <div style={{ color: done ? rcol : T.muted, fontSize: 26, fontWeight: 700 }}>{done ? sc : '?'}/21</div>
                  <div style={{ color: done ? rcol : T.muted, fontSize: 12, marginTop: 2 }}>{done ? risk : '—'}</div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

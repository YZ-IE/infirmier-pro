import { useState } from 'react';
import { T, s } from '../../theme.js';
const C = T.iatr;

// Source : Infostab / base compatibilités IV hospitalières
const DRUGS = [
  'NaCl 0,9%','G5%','Morphine','Midazolam','Noradrénaline','Adrénaline',
  'Dobutamine','Dopamine','Amiodarone','Furosémide','Héparine','Potassium',
  'Vancomycine','Propofol','Sufentanil','Kétamine','Oméprazole','Pantoprazole',
  'Magnésium','Paracétamol','Métoclopramide','Ondansétron','Acide valproïque',
  'Phénytoïne','Insuline','Nicardipine','Labetalol','Clonidine',
];

// C=Compatible, I=Incompatible, V=Variable
const COMPAT = {
  'Morphine+Midazolam':'C','Morphine+Noradrénaline':'C','Morphine+Amiodarone':'I',
  'Morphine+Furosémide':'I','Morphine+Héparine':'C','Morphine+Potassium':'C',
  'Morphine+Vancomycine':'C','Morphine+Sufentanil':'C','Morphine+Kétamine':'C',
  'Morphine+Propofol':'I','Morphine+Métoclopramide':'C','Morphine+Ondansétron':'C',
  'Morphine+Insuline':'C','Morphine+Clonidine':'C','Morphine+Dobutamine':'C',
  'Midazolam+Noradrénaline':'C','Midazolam+Amiodarone':'I','Midazolam+Furosémide':'I',
  'Midazolam+Héparine':'C','Midazolam+Potassium':'C','Midazolam+Sufentanil':'C',
  'Midazolam+Kétamine':'C','Midazolam+Propofol':'I','Midazolam+Ondansétron':'C',
  'Midazolam+Dobutamine':'C','Midazolam+Dopamine':'C','Midazolam+Insuline':'C',
  'Noradrénaline+Amiodarone':'V','Noradrénaline+Furosémide':'I','Noradrénaline+Héparine':'C',
  'Noradrénaline+Potassium':'C','Noradrénaline+Vancomycine':'C','Noradrénaline+Dobutamine':'C',
  'Noradrénaline+Dopamine':'C','Noradrénaline+Insuline':'C','Noradrénaline+Nicardipine':'C',
  'Noradrénaline+Propofol':'I','Noradrénaline+Sufentanil':'C','Noradrénaline+Midazolam':'C',
  'Adrénaline+Dobutamine':'C','Adrénaline+Noradrénaline':'C','Adrénaline+Héparine':'C',
  'Adrénaline+Furosémide':'I','Adrénaline+Amiodarone':'V','Adrénaline+Insuline':'C',
  'Dobutamine+Dopamine':'C','Dobutamine+Héparine':'C','Dobutamine+Furosémide':'I',
  'Dobutamine+Potassium':'C','Dobutamine+Insuline':'C','Dobutamine+Amiodarone':'V',
  'Dopamine+Héparine':'C','Dopamine+Furosémide':'I','Dopamine+Potassium':'C',
  'Dopamine+Insuline':'C','Dopamine+Amiodarone':'V',
  'Amiodarone+Furosémide':'I','Amiodarone+Héparine':'I','Amiodarone+Potassium':'I',
  'Amiodarone+Insuline':'V','Amiodarone+Nicardipine':'I',
  'Furosémide+Héparine':'C','Furosémide+Potassium':'I','Furosémide+Vancomycine':'I',
  'Furosémide+Paracétamol':'I','Furosémide+Métoclopramide':'I','Furosémide+Ondansétron':'I',
  'Furosémide+Oméprazole':'I','Furosémide+Magnésium':'I',
  'Héparine+Potassium':'C','Héparine+Vancomycine':'I','Potassium+Vancomycine':'C',
  'Héparine+Insuline':'C','Héparine+Paracétamol':'C','Héparine+Morphine':'C',
  'Héparine+Ondansétron':'C','Héparine+Métoclopramide':'C',
  'Propofol+Sufentanil':'C','Propofol+Midazolam':'I','Propofol+Kétamine':'V',
  'Sufentanil+Midazolam':'C','Sufentanil+Kétamine':'C','Sufentanil+Clonidine':'C',
  'Oméprazole+Pantoprazole':'C','Oméprazole+Midazolam':'I',
  'Pantoprazole+Morphine':'C','Pantoprazole+Midazolam':'C',
  'Magnésium+Potassium':'C','Magnésium+Insuline':'C',
  'Paracétamol+Morphine':'C','Paracétamol+Ondansétron':'C','Paracétamol+Métoclopramide':'C',
  'Ondansétron+Métoclopramide':'C','Ondansétron+Potassium':'C',
  'Phénytoïne+NaCl 0,9%':'C','Phénytoïne+G5%':'I',
  'Acide valproïque+NaCl 0,9%':'C','Acide valproïque+G5%':'C',
  'Nicardipine+NaCl 0,9%':'C','Nicardipine+G5%':'C',
  'Labetalol+NaCl 0,9%':'C','Labetalol+G5%':'C',
  'Clonidine+NaCl 0,9%':'C','Clonidine+G5%':'C',
  'Insuline+NaCl 0,9%':'C','Insuline+G5%':'I',
  'Kétamine+NaCl 0,9%':'C','Kétamine+G5%':'C',
  'Vancomycine+NaCl 0,9%':'C','Vancomycine+G5%':'C',
};

const COL = { C: '#22c55e', I: '#ef4444', V: '#f59e0b' };
const LAB = { C: '✓ Compatible', I: '✗ Incompatible', V: '⚠ Variable' };

function getCompat(a, b) {
  if (a === b) return null;
  return COMPAT[`${a}+${b}`] || COMPAT[`${b}+${a}`] || null;
}

const PAIRS_CRIT = [
  { a: 'Amiodarone', b: 'Héparine', stat: 'I', note: 'Précipitation immédiate. Voies séparées obligatoires.' },
  { a: 'Furosémide', b: 'Noradrénaline', stat: 'I', note: 'Incompatibles. Voies séparées.' },
  { a: 'Furosémide', b: 'Vancomycine', stat: 'I', note: 'Précipitation. Ne jamais mélanger.' },
  { a: 'Morphine', b: 'Amiodarone', stat: 'I', note: 'Incompatibles. Voies séparées.' },
  { a: 'Héparine', b: 'Vancomycine', stat: 'I', note: 'Précipitation. Rincer abondamment la voie.' },
  { a: 'Furosémide', b: 'Potassium', stat: 'I', note: 'Risque de précipitation.' },
  { a: 'Propofol', b: 'Midazolam', stat: 'I', note: 'Incompatibles en Y. Voies séparées.' },
  { a: 'Amiodarone', b: 'Potassium', stat: 'I', note: 'Incompatibles. Ne pas associer sur même voie.' },
  { a: 'Phénytoïne', b: 'G5%', stat: 'I', note: 'Précipitation en solution glucosée. NaCl 0,9% uniquement.' },
  { a: 'Insuline', b: 'G5%', stat: 'I', note: 'Incompatibles. Utiliser NaCl 0,9%.' },
  { a: 'Furosémide', b: 'Oméprazole', stat: 'I', note: 'Précipitation. Voies séparées.' },
  { a: 'Furosémide', b: 'Magnésium', stat: 'I', note: 'Incompatibles.' },
  { a: 'Noradrénaline', b: 'Amiodarone', stat: 'V', note: 'Variable selon concentration. Surveiller trouble visible.' },
  { a: 'Morphine', b: 'Midazolam', stat: 'C', note: 'Compatible en Y. Association fréquente soins continus.' },
  { a: 'Sufentanil', b: 'Midazolam', stat: 'C', note: 'Compatible. Association courante en réanimation.' },
  { a: 'Potassium', b: 'NaCl 0,9%', stat: 'C', note: 'Compatible. Concentration max 40 mEq/L en périphérique.' },
  { a: 'Paracétamol', b: 'Morphine', stat: 'C', note: 'Compatible en Y. Analgésie multimodale.' },
];

export default function CompatibilitesIV({ onBack }) {
  const [tab, setTab] = useState('check');
  const [d1, setD1] = useState('');
  const [d2, setD2] = useState('');
  const [search, setSearch] = useState('');

  const res = d1 && d2 && d1 !== d2 ? getCompat(d1, d2) : null;

  const filteredCrit = PAIRS_CRIT.filter(p =>
    !search || p.a.toLowerCase().includes(search.toLowerCase()) || p.b.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ minHeight: '100vh', background: T.bg, paddingBottom: 40 }}>
      <div style={{ background: T.iatrDim, borderBottom: `1px solid ${C}44`, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12, position: 'sticky', top: 0, zIndex: 10 }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', color: C, fontSize: 20, cursor: 'pointer' }}>←</button>
        <div>
          <div style={{ color: T.text, fontWeight: 700, fontSize: 17 }}>🔗 Compatibilités IV en Y</div>
          <div style={{ color: T.muted, fontSize: 10, fontFamily: 'monospace' }}>{DRUGS.length} produits · Source Infostab</div>
        </div>
      </div>

      <div style={{ padding: '14px' }}>
        <div style={{ display: 'flex', gap: 7, marginBottom: 14 }}>
          {[['check', 'Vérifier 2 produits'], ['crit', 'Associations critiques']].map(([id, lbl]) => (
            <button key={id} onClick={() => setTab(id)} style={{ ...s.btn(tab === id ? C : T.muted), flex: 1, background: tab === id ? C + '22' : T.surface, borderColor: tab === id ? C : T.border, color: tab === id ? C : T.muted }}>{lbl}</button>
          ))}
        </div>

        {tab === 'check' && (
          <div style={s.card}>
            <div style={{ marginBottom: 10 }}>
              <label style={s.label}>PRODUIT 1</label>
              <select value={d1} onChange={e => setD1(e.target.value)} style={{ ...s.input, background: T.bg }}>
                <option value="">-- Choisir --</option>
                {DRUGS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={s.label}>PRODUIT 2</label>
              <select value={d2} onChange={e => setD2(e.target.value)} style={{ ...s.input, background: T.bg }}>
                <option value="">-- Choisir --</option>
                {DRUGS.filter(d => d !== d1).map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            {res ? (
              <div style={{ background: COL[res] + '18', border: `1px solid ${COL[res]}44`, borderRadius: 10, padding: '16px', textAlign: 'center', animation: 'fadeIn 0.3s ease' }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>{res === 'C' ? '✅' : res === 'I' ? '❌' : '⚠️'}</div>
                <div style={{ color: COL[res], fontSize: 18, fontWeight: 700 }}>{LAB[res]}</div>
                <div style={{ color: T.muted, fontSize: 13, marginTop: 6 }}>{d1} + {d2}</div>
                {res === 'V' && <div style={{ color: '#f59e0b', fontSize: 12, marginTop: 8 }}>Vérifier avec le pharmacien selon les concentrations utilisées</div>}
              </div>
            ) : d1 && d2 ? (
              <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8, padding: '12px', textAlign: 'center', color: T.muted, fontSize: 13 }}>
                Données non disponibles — consulter Infostab ou le pharmacien
              </div>
            ) : (
              <div style={{ textAlign: 'center', color: T.muted, fontSize: 13, padding: '20px' }}>Sélectionner deux produits</div>
            )}
            <div style={{ marginTop: 12, background: '#1e293b', border: '1px solid #334155', borderRadius: 8, padding: '10px 14px' }}>
              <div style={{ color: '#64748b', fontSize: 11, fontFamily: 'monospace' }}>
                ℹ️ Rincer systématiquement la voie entre deux médicaments incompatibles. En cas de doute : Infostab.fr ou pharmacien.
              </div>
            </div>
          </div>
        )}

        {tab === 'crit' && (
          <div>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Filtrer…" style={{ ...s.input, marginBottom: 12 }} />
            {filteredCrit.map((p, i) => (
              <div key={i} style={{ background: COL[p.stat] + '11', border: `1px solid ${COL[p.stat]}33`, borderLeft: `3px solid ${COL[p.stat]}`, borderRadius: 8, padding: '12px', marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                  <span style={{ color: T.text, fontWeight: 700, fontSize: 13 }}>{p.a} + {p.b}</span>
                  <span style={{ color: COL[p.stat], fontSize: 11, fontFamily: 'monospace' }}>{LAB[p.stat]}</span>
                </div>
                <div style={{ color: T.muted, fontSize: 12, lineHeight: 1.5 }}>{p.note}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

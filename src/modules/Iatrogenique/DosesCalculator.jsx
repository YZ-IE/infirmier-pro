import { MedicalDisclaimer } from '../../components/MedicalDisclaimer.jsx';
import { useState } from 'react';
import { T, s } from '../../theme.js';

const C = T.iatr;

// ─── Unités & conversions ──────────────────────────────────────────────────
const DOSE_UNITS = [
  { id: 'g',     label: 'g',     toMg: 1000 },
  { id: 'mg',    label: 'mg',    toMg: 1 },
  { id: 'mcg',   label: 'µg',    toMg: 0.001 },
  { id: 'gamma', label: 'gamma (µg)', toMg: 0.001 },
  { id: 'ng',    label: 'ng',    toMg: 0.000001 },
  { id: 'UI',    label: 'UI',    toMg: null }, // unité propre
  { id: 'mEq',   label: 'mEq',   toMg: null },
];

const TIME_UNITS = [
  { id: 's',   label: 's',   toMin: 1/60 },
  { id: 'min', label: 'min', toMin: 1 },
  { id: 'h',   label: 'h',   toMin: 60 },
  { id: 'j',   label: 'j',   toMin: 1440 },
];

const MODES = [
  { id: 'prescription', label: '💊 Prescription libre',   desc: 'Ex : 2g de méropénem sur 4h' },
  { id: 'dkg',          label: '⚖️ Dose par poids',       desc: 'mg/kg, µg/kg, UI/kg…' },
  { id: 'dm2',          label: '📐 Dose par surface m²',  desc: 'Chimiothérapie' },
  { id: 'dmin',         label: '⏱ Débit µg/kg/min',      desc: 'Dopamine, Dobutamine…' },
  { id: 'pct',          label: '🧪 Solution %',           desc: 'NaCl 0,9% · G5%…' },
  { id: 'ui',           label: '💉 UI/kg',                desc: 'Insuline, Héparine…' },
];

function round3(n) { return Math.round(n * 1000) / 1000; }
function round2(n) { return Math.round(n * 100) / 100; }
function bsa(w, h) { return Math.sqrt((w * h) / 3600); }

// ─── Sélecteur d'unité compact ─────────────────────────────────────────────
function UnitSelector({ options, value, onChange }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 6 }}>
      <MedicalDisclaimer level="calcul" />
      {options.map(u => (
        <button key={u.id} onClick={() => onChange(u.id)} style={{
          background: value === u.id ? C + '33' : T.surface,
          border: `1px solid ${value === u.id ? C : '#334155'}`,
          color: value === u.id ? C : T.muted,
          borderRadius: 6, padding: '4px 10px', fontSize: 12,
          cursor: 'pointer', fontFamily: 'system-ui'
        }}>{u.label}</button>
      ))}
    </div>
  );
}

// ─── Mode Prescription libre ───────────────────────────────────────────────
function PrescriptionMode() {
  const [dose, setDose] = useState('');
  const [doseUnit, setDoseUnit] = useState('g');
  const [vol, setVol] = useState('');
  const [duree, setDuree] = useState('');
  const [dureeUnit, setDureeUnit] = useState('h');
  const [result, setResult] = useState(null);
  const [err, setErr] = useState('');

  const calc = () => {
    setErr(''); setResult(null);
    const d = parseFloat(dose), v = parseFloat(vol), dur = parseFloat(duree);
    if (!d || !v || !dur) { setErr('Remplissez tous les champs'); return; }

    const du = DOSE_UNITS.find(u => u.id === doseUnit);
    const tu = TIME_UNITS.find(u => u.id === dureeUnit);
    const dureeMin = dur * tu.toMin;
    const dureeH = dureeMin / 60;

    // Débit ml/h
    const debitMlH = round2(v / dureeH);
    const debitMlMin = round3(v / dureeMin);

    // Concentration (si unité convertible en mg)
    let concLines = [];
    if (du.toMg !== null) {
      const doseMg = d * du.toMg;
      const concMgMl = round3(doseMg / v);
      concLines = [
        `Concentration : ${concMgMl} mg/ml`,
        `Dose totale : ${doseMg >= 1000 ? round2(doseMg/1000)+'g' : doseMg+'mg'} (${d} ${du.label})`,
      ];
    } else {
      concLines = [`Dose totale : ${d} ${du.label} dans ${v} ml`];
    }

    setResult({
      main: `Débit : ${debitMlH} ml/h`,
      details: [
        ...concLines,
        `Volume : ${v} ml sur ${dur} ${tu.label}`,
        `Débit : ${debitMlH} ml/h (${debitMlMin} ml/min)`,
      ]
    });
  };

  return (
    <div style={s.card}>
      <div style={{ color: C, fontFamily: 'monospace', fontSize: 11, marginBottom: 10, letterSpacing: 1 }}>
        Ex : 2g méropénem sur 4h dans 100ml → débit en ml/h
      </div>

      <div style={{ marginBottom: 12 }}>
        <label style={s.label}>DOSE PRESCRITE</label>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input type="number" value={dose} onChange={e => setDose(e.target.value)}
            placeholder="Ex : 2" style={{ ...s.input, flex: 1 }} />
        </div>
        <UnitSelector options={DOSE_UNITS} value={doseUnit} onChange={setDoseUnit} />
      </div>

      <div style={{ marginBottom: 12 }}>
        <label style={s.label}>VOLUME DE DILUTION (ml)</label>
        <input type="number" value={vol} onChange={e => setVol(e.target.value)}
          placeholder="Ex : 100" style={s.input} />
      </div>

      <div style={{ marginBottom: 14 }}>
        <label style={s.label}>DURÉE DE PASSAGE</label>
        <input type="number" value={duree} onChange={e => setDuree(e.target.value)}
          placeholder="Ex : 4" style={s.input} />
        <UnitSelector options={TIME_UNITS} value={dureeUnit} onChange={setDureeUnit} />
      </div>

      <button onClick={calc} style={{ ...s.btn(C), width: '100%', padding: '12px' }}>CALCULER</button>

      {err && <div style={{ color: '#f87171', fontSize: 13, marginTop: 10, padding: '8px 12px', background: '#450a0a', borderRadius: 7 }}>⚠️ {err}</div>}

      {result && (
        <div style={{ ...s.result(C), animation: 'fadeIn 0.3s ease', marginTop: 12 }}>
          <div style={{ color: C, fontSize: 20, fontWeight: 700, marginBottom: 8 }}>{result.main}</div>
          {result.details.map((d, i) => (
            <div key={i} style={{ color: T.muted, fontSize: 13, fontFamily: 'monospace', marginBottom: 3 }}>{d}</div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Calculs classiques ─────────────────────────────────────────────────────
export default function DosesCalculator({ onBack }) {
  const [mode, setMode] = useState('prescription');
  const [vals, setVals] = useState({});
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  // unités pour mode dkg
  const [dkgUnit, setDkgUnit] = useState('mg');

  const set = (k, v) => { setVals(p => ({ ...p, [k]: v })); setResult(null); setError(''); };

  const calc = () => {
    setError(''); setResult(null);
    const v = vals;
    try {
      if (mode === 'dkg') {
        const dose = parseFloat(v.dose), weight = parseFloat(v.weight);
        if (!dose || !weight) { setError('Remplissez tous les champs'); return; }
        const du = DOSE_UNITS.find(u => u.id === dkgUnit);
        const total = round2(dose * weight);
        const doseMax = v.doseMax ? parseFloat(v.doseMax) : null;
        setResult({
          main: `Dose totale : ${total} ${du.label}`,
          details: [
            `${dose} ${du.label}/kg × ${weight} kg`,
            doseMax ? `Dose max : ${doseMax} ${du.label}/kg → ${round2(doseMax * weight)} ${du.label}` : null,
            doseMax && total > doseMax * weight ? '⚠️ DÉPASSE LA DOSE MAXIMALE !' : null,
          ].filter(Boolean),
          alert: doseMax && total > doseMax * weight
        });
      } else if (mode === 'dm2') {
        const dose = parseFloat(v.dose), weight = parseFloat(v.weight), height = parseFloat(v.height);
        if (!dose || !weight || !height) { setError('Remplissez tous les champs'); return; }
        const surface = round2(bsa(weight, height));
        const total = round2(dose * surface);
        setResult({
          main: `Dose totale : ${total} mg`,
          details: [`Surface corporelle : ${surface} m² (Mosteller)`, `${dose} mg/m² × ${surface} m²`],
        });
      } else if (mode === 'dmin') {
        const dose = parseFloat(v.dose), weight = parseFloat(v.weight), conc = parseFloat(v.conc);
        if (!dose || !weight || !conc) { setError('Remplissez tous les champs'); return; }
        const debitMlH = round2((dose * weight * 60) / (conc * 1000));
        setResult({
          main: `Débit : ${debitMlH} ml/h`,
          details: [
            `${dose} µg/kg/min × ${weight} kg × 60 min`,
            `÷ (${conc} mg/ml × 1000) = ${debitMlH} ml/h`,
            `Soit ${round3(debitMlH / 60)} ml/min`,
          ],
        });
      } else if (mode === 'pct') {
        const pct = parseFloat(v.pct), vol = parseFloat(v.vol);
        if (!pct || !vol) { setError('Remplissez tous les champs'); return; }
        const mg = round2((pct / 100) * vol * 1000);
        setResult({
          main: `${round2(mg / 1000)} g (${mg} mg) dans ${vol} ml`,
          details: [`Solution à ${pct}% = ${pct * 10} mg/ml`, `${vol} ml × ${pct * 10} mg/ml = ${mg} mg`],
        });
      } else if (mode === 'ui') {
        const dose = parseFloat(v.dose), weight = parseFloat(v.weight);
        if (!dose || !weight) { setError('Remplissez tous les champs'); return; }
        setResult({
          main: `Dose totale : ${round2(dose * weight)} UI`,
          details: [`${dose} UI/kg × ${weight} kg`],
        });
      }
    } catch { setError('Erreur de calcul'); }
  };

  return (
    <div style={{ minHeight: '100vh', background: T.bg, paddingBottom: 40 }}>
      <div style={{ background: T.iatrDim, borderBottom: `1px solid ${C}44`, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12, position: 'sticky', top: 0, zIndex: 10 }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', color: C, fontSize: 20, cursor: 'pointer' }}>←</button>
        <div style={{ color: T.text, fontWeight: 700, fontSize: 17 }}>🧮 Calcul de doses</div>
      </div>

      <div style={{ padding: '14px' }}>
        {/* Sélecteur de mode */}
        <div style={{ marginBottom: 14 }}>
          <label style={s.label}>TYPE DE CALCUL</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
            {MODES.map(m => (
              <button key={m.id} onClick={() => { setMode(m.id); setVals({}); setResult(null); setError(''); }} style={{
                ...s.btn(mode === m.id ? C : T.muted),
                padding: '9px 12px', fontSize: 13, textAlign: 'left',
                background: mode === m.id ? C + '22' : T.surface,
                borderColor: mode === m.id ? C : T.border,
                color: mode === m.id ? C : T.muted,
                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
              }}>
                <span style={{ fontWeight: 600 }}>{m.label}</span>
                <span style={{ fontSize: 11, opacity: 0.7 }}>{m.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Mode prescription libre */}
        {mode === 'prescription' && <PrescriptionMode />}

        {/* Modes classiques */}
        {mode !== 'prescription' && (
          <div style={s.card}>
            {['dkg', 'dm2', 'dmin', 'ui'].includes(mode) && (
              <div style={{ marginBottom: 10 }}>
                <label style={s.label}>POIDS DU PATIENT (kg)</label>
                <input type="number" value={vals.weight || ''} onChange={e => set('weight', e.target.value)} placeholder="Ex : 70" style={s.input} />
              </div>
            )}
            {mode === 'dm2' && (
              <div style={{ marginBottom: 10 }}>
                <label style={s.label}>TAILLE DU PATIENT (cm)</label>
                <input type="number" value={vals.height || ''} onChange={e => set('height', e.target.value)} placeholder="Ex : 170" style={s.input} />
              </div>
            )}
            {mode === 'dkg' && (
              <>
                <div style={{ marginBottom: 10 }}>
                  <label style={s.label}>DOSE PRESCRITE</label>
                  <input type="number" value={vals.dose || ''} onChange={e => set('dose', e.target.value)} placeholder="Ex : 15" style={s.input} />
                  <UnitSelector options={DOSE_UNITS.filter(u => u.toMg !== null)} value={dkgUnit} onChange={setDkgUnit} />
                </div>
                <div style={{ marginBottom: 10 }}>
                  <label style={s.label}>DOSE MAXIMUM (même unité/kg) — optionnel</label>
                  <input type="number" value={vals.doseMax || ''} onChange={e => set('doseMax', e.target.value)} placeholder="Ex : 60" style={s.input} />
                </div>
              </>
            )}
            {mode === 'dm2' && (
              <div style={{ marginBottom: 10 }}>
                <label style={s.label}>DOSE PRESCRITE (mg/m²)</label>
                <input type="number" value={vals.dose || ''} onChange={e => set('dose', e.target.value)} placeholder="Ex : 50" style={s.input} />
              </div>
            )}
            {mode === 'dmin' && (
              <>
                <div style={{ marginBottom: 10 }}>
                  <label style={s.label}>DOSE (µg/kg/min)</label>
                  <input type="number" value={vals.dose || ''} onChange={e => set('dose', e.target.value)} placeholder="Ex : 5" style={s.input} />
                </div>
                <div style={{ marginBottom: 10 }}>
                  <label style={s.label}>CONCENTRATION DE LA SOLUTION (mg/ml)</label>
                  <input type="number" value={vals.conc || ''} onChange={e => set('conc', e.target.value)} placeholder="Ex : 1" style={s.input} />
                </div>
              </>
            )}
            {mode === 'pct' && (
              <>
                <div style={{ marginBottom: 10 }}>
                  <label style={s.label}>CONCENTRATION (%)</label>
                  <input type="number" step="0.1" value={vals.pct || ''} onChange={e => set('pct', e.target.value)} placeholder="Ex : 0.9" style={s.input} />
                </div>
                <div style={{ marginBottom: 10 }}>
                  <label style={s.label}>VOLUME (ml)</label>
                  <input type="number" value={vals.vol || ''} onChange={e => set('vol', e.target.value)} placeholder="Ex : 500" style={s.input} />
                </div>
              </>
            )}
            {mode === 'ui' && (
              <div style={{ marginBottom: 10 }}>
                <label style={s.label}>DOSE (UI/kg)</label>
                <input type="number" value={vals.dose || ''} onChange={e => set('dose', e.target.value)} placeholder="Ex : 100" style={s.input} />
              </div>
            )}

            <button onClick={calc} style={{ ...s.btn(C), width: '100%', marginTop: 4, padding: '12px' }}>CALCULER</button>

            {error && <div style={{ color: '#f87171', fontSize: 13, marginTop: 10, padding: '8px 12px', background: '#450a0a', borderRadius: 7 }}>⚠️ {error}</div>}

            {result && (
              <div style={{ ...s.result(result.alert ? '#f97316' : C), animation: 'fadeIn 0.3s ease' }}>
                <div style={{ color: result.alert ? '#f97316' : C, fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{result.main}</div>
                {result.details.map((d, i) => (
                  <div key={i} style={{ color: d.includes('⚠️') ? '#f87171' : T.muted, fontSize: 13, fontFamily: 'monospace', marginBottom: 3 }}>{d}</div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Aide-mémoire */}
        <div style={{ ...s.card, marginTop: 6 }}>
          <div style={{ color: C, fontFamily: 'monospace', fontSize: 11, letterSpacing: 2, marginBottom: 10 }}>AIDE-MÉMOIRE</div>
          {[
            ['Paracétamol', '15 mg/kg/prise · max 60 mg/kg/j · max 4 g/j'],
            ['Morphine', '0,1 mg/kg IV · titration 2-3 mg/5min adulte'],
            ['Amoxicilline', '25-50 mg/kg/j en 3 prises'],
            ['Gentamycine', '3-5 mg/kg/j en 1 injection IV'],
            ['Héparine', '80 UI/kg bolus puis 18 UI/kg/h'],
            ['Insuline rapide', 'Selon protocole · 0,1 UI/kg/h en CAD'],
          ].map(([drug, dose], i) => (
            <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 8, paddingBottom: 8, borderBottom: i < 5 ? '1px solid #334155' : 'none' }}>
              <span style={{ color: C, fontWeight: 700, fontSize: 13, minWidth: 110 }}>{drug}</span>
              <span style={{ color: T.muted, fontSize: 12, lineHeight: 1.4 }}>{dose}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

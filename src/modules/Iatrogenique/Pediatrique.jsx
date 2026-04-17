import { MedicalDisclaimer } from '../../components/MedicalDisclaimer.jsx';
import { useState } from 'react';
import { T, s } from '../../theme.js';
const C = T.iatr;

// Taille sonde d'intubation selon âge
function tailleIOT(age) {
  // Nourrissons (< 1 an) : 3.5 sans ballonnet
  if (age < 1) return { di: '3.5', ballonnet: 'Sans ballonnet', prof: '10–12 cm' };
  if (age < 2) return { di: '4.0', ballonnet: 'Sans ballonnet', prof: '12 cm' };
  // Enfant > 2 ans : (âge/4) + 4
  const di = (age / 4 + 4).toFixed(1);
  const diSuiv = (age / 4 + 4.5).toFixed(1);
  const prof = Math.round(age / 2 + 12);
  return { di, diSuiv, ballonnet: 'Avec ballonnet possible', prof: `${prof} cm` };
}

// Sonde nasogastrique
function tailleNG(age) {
  if (age < 1) return '6–8 Fr';
  if (age < 3) return '8 Fr';
  if (age < 6) return '10 Fr';
  if (age < 12) return '12 Fr';
  return '14–16 Fr';
}

// Poids estimé selon âge (formule APLS)
function poidsEstime(age) {
  if (age < 1) return null;
  if (age < 10) return (2 * age + 8);
  return (3 * age + 7);
}

// Médicaments pédiatriques urgents
const MEDOCS = [
  { id: 'adr',     label: 'Adrénaline (ACR)',           dose: 0.01,  unit: 'mg/kg',  doseMin: null, doseMax: 1,    route: 'IV/IO', note: 'Répéter toutes les 3–5 min' },
  { id: 'amiod',   label: 'Amiodarone (FV/TV)',          dose: 5,     unit: 'mg/kg',  doseMin: null, doseMax: 300,  route: 'IV/IO', note: 'Max 300 mg · Diluer G5%' },
  { id: 'atrop',   label: 'Atropine (bradycardie)',       dose: 0.02,  unit: 'mg/kg',  doseMin: 0.1,  doseMax: 0.5,  route: 'IV/IO', note: 'Dose min 0.1 mg' },
  { id: 'diaz',    label: 'Diazépam (convulsions)',       dose: 0.3,   unit: 'mg/kg',  doseMin: null, doseMax: 10,   route: 'IV/rectal', note: 'Intra-rectal : 0.5 mg/kg' },
  { id: 'morph',   label: 'Morphine (analgésie)',         dose: 0.1,   unit: 'mg/kg',  doseMin: null, doseMax: 5,    route: 'IV lente', note: 'Diluer · Titrer' },
  { id: 'parace',  label: 'Paracétamol IV',               dose: 15,    unit: 'mg/kg',  doseMin: null, doseMax: 1000, route: 'IV 15 min', note: 'Toutes 6h · Max 60 mg/kg/j' },
  { id: 'ibu',     label: 'Ibuprofène PO',                dose: 10,    unit: 'mg/kg',  doseMin: null, doseMax: 400,  route: 'PO',    note: 'Toutes 8h · avec nourriture' },
  { id: 'gluc',    label: 'Glucose 10% (hypoglycémie)',   dose: 2,     unit: 'mL/kg',  doseMin: null, doseMax: null, route: 'IV lente', note: '= 0.2 g/kg de glucose' },
  { id: 'nacl',    label: 'NaCl 0.9% (remplissage)',      dose: 20,    unit: 'mL/kg',  doseMin: null, doseMax: null, route: 'IV rapide', note: 'Répéter si besoin · max 60 mL/kg' },
  { id: 'ketam',   label: 'Kétamine (sédation)',          dose: 1.5,   unit: 'mg/kg',  doseMin: null, doseMax: 100,  route: 'IV lente', note: 'Atropine préalable recommandée' },
  { id: 'cetiriz', label: 'Cétirizine PO (allergie)',     dose: 0.25,  unit: 'mg/kg',  doseMin: null, doseMax: 10,   route: 'PO',    note: '1×/j · > 6 mois' },
];

export default function Pediatrique({ onBack }) {
  const [poidsMode, setPoidsMode] = useState('reel'); // 'reel' | 'age'
  const [poids, setPoids] = useState('');
  const [age, setAge] = useState('');
  const [sel, setSel] = useState(null);

  const ageN = parseFloat(age);
  const poidsEstime_ = ageN > 0 ? poidsEstime(ageN) : null;
  const poidsCalc = poidsMode === 'reel' ? parseFloat(poids) : poidsEstime_;
  const valid = poidsCalc > 0;

  const calcDose = (m) => {
    const raw = poidsCalc * m.dose;
    const dose = m.doseMax ? Math.min(raw, m.doseMax) : raw;
    const doseFinal = m.doseMin ? Math.max(dose, m.doseMin) : dose;
    return doseFinal.toFixed(m.unit.startsWith('mL') ? 1 : 2);
  };

  const iotData = ageN > 0 ? tailleIOT(ageN) : null;
  const ngData = ageN > 0 ? tailleNG(ageN) : null;

  return (
    <div style={{ padding: '14px' }}>
      <MedicalDisclaimer level="calcul" />
      <div style={{ ...s.card, background: '#ef444411', border: '1px solid #ef444433', marginBottom: 14 }}>
        <div style={{ color: '#ef4444', fontWeight: 700, fontSize: 13 }}>👶 Calculateur Pédiatrique</div>
        <div style={{ color: T.muted, fontSize: 12, marginTop: 3 }}>Doses mg/kg · Matériel · Taille sonde IOT/NGS</div>
        <div style={{ color: '#f59e0b', fontSize: 11, marginTop: 4 }}>⚠️ Toujours vérifier avec le prescripteur et les protocoles de l'établissement</div>
      </div>

      {/* Poids */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
        {[['reel', '⚖️ Poids réel'], ['age', '🎂 Estimer par l\'âge']].map(([v, l]) => (
          <button key={v} onClick={() => setPoidsMode(v)}
            style={{ flex: 1, padding: '10px', borderRadius: 8, border: `1px solid ${poidsMode === v ? C : T.border}`, background: poidsMode === v ? C + '22' : T.surface, color: poidsMode === v ? C : T.muted, fontWeight: 700, cursor: 'pointer', fontSize: 12 }}>
            {l}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
        {poidsMode === 'reel' ? (
          <div style={{ ...s.card, gridColumn: '1/-1' }}>
            <label style={s.label}>Poids (kg)</label>
            <input type="number" step="0.1" value={poids} onChange={e => setPoids(e.target.value)} placeholder="Ex: 18.5"
              style={{ ...s.input, fontSize: 22, fontWeight: 700, textAlign: 'center' }} />
          </div>
        ) : (
          <>
            <div style={s.card}>
              <label style={s.label}>Âge (années)</label>
              <input type="number" step="0.5" value={age} onChange={e => setAge(e.target.value)} placeholder="Ex: 4"
                style={{ ...s.input, fontSize: 18, fontWeight: 700, textAlign: 'center' }} />
            </div>
            <div style={s.card}>
              <label style={s.label}>Poids estimé (APLS)</label>
              <div style={{ ...s.input, fontSize: 22, fontWeight: 700, textAlign: 'center', color: C, background: C + '11', border: `1px solid ${C}44` }}>
                {poidsEstime_ ? `${poidsEstime_} kg` : '—'}
              </div>
            </div>
          </>
        )}
        {poidsMode === 'age' && (
          <div style={{ gridColumn: '1/-1', display: 'flex', gap: 8 }}>
            <input type="number" step="0.1" value={poids} onChange={e => setPoids(e.target.value)} placeholder="Surcharger le poids estimé (kg)"
              style={{ ...s.input, flex: 1 }} />
          </div>
        )}
      </div>

      {/* Matériel selon âge */}
      {iotData && ageN > 0 && (
        <div style={{ ...s.card, border: `1px solid ${C}44`, marginBottom: 14 }}>
          <div style={{ color: C, fontFamily: 'monospace', fontSize: 11, letterSpacing: 2, marginBottom: 10 }}>MATÉRIEL (âge {ageN} ans)</div>
          {[
            ['🫁 IOT — Diamètre interne', iotData.di + ' mm' + (iotData.diSuiv ? ` (ou ${iotData.diSuiv})` : '')],
            ['🫁 IOT — Ballonnet', iotData.ballonnet],
            ['🫁 IOT — Profondeur', iotData.prof + ' aux lèvres'],
            ['🧪 Sonde NG', ngData],
            ['💊 Formule poids (APLS)', poidsEstime_ ? `${poidsEstime_} kg` : 'N/A'],
          ].map(([l, v]) => (
            <div key={l} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, gap: 8 }}>
              <span style={{ color: T.muted, fontSize: 12 }}>{l}</span>
              <span style={{ color: T.text, fontWeight: 700, fontSize: 12, textAlign: 'right' }}>{v}</span>
            </div>
          ))}
        </div>
      )}

      {/* Médicaments */}
      {valid && (
        <>
          <div style={{ color: C, fontFamily: 'monospace', fontSize: 11, letterSpacing: 2, marginBottom: 8 }}>MÉDICAMENTS · POIDS : {poidsCalc.toFixed(1)} kg</div>
          {MEDOCS.map(m => (
            <div key={m.id} onClick={() => setSel(sel === m.id ? null : m.id)}
              style={{ ...s.card, cursor: 'pointer', border: `1px solid ${sel === m.id ? C : T.border}`, background: sel === m.id ? C + '11' : T.surface, marginBottom: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: sel === m.id ? C : T.text, fontWeight: 700, fontSize: 13 }}>{m.label}</span>
                <span style={{ color: C, fontFamily: 'monospace', fontWeight: 700, fontSize: 16 }}>{calcDose(m)} {m.unit.replace('mg/kg', 'mg').replace('mL/kg', 'mL')}</span>
              </div>
              {sel === m.id && (
                <div style={{ marginTop: 8, borderTop: `1px solid ${C}33`, paddingTop: 8 }}>
                  <div style={{ display: 'flex', gap: 16, marginBottom: 6 }}>
                    <div><span style={{ color: T.muted, fontSize: 11 }}>Dose : </span><span style={{ color: T.text, fontSize: 12 }}>{m.dose} {m.unit}</span></div>
                    <div><span style={{ color: T.muted, fontSize: 11 }}>Voie : </span><span style={{ color: T.text, fontSize: 12 }}>{m.route}</span></div>
                  </div>
                  {m.doseMax && <div style={{ color: T.muted, fontSize: 11 }}>Dose max : {m.doseMax} {m.unit.split('/')[0]}</div>}
                  <div style={{ color: '#f59e0b', fontSize: 12, marginTop: 4 }}>ℹ️ {m.note}</div>
                </div>
              )}
            </div>
          ))}
        </>
      )}

      {!valid && (
        <div style={{ textAlign: 'center', color: T.muted, fontSize: 13, padding: '20px 0' }}>
          Renseigner le poids ou l'âge pour calculer les doses
        </div>
      )}
    </div>
  );
}

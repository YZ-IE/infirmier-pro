import { MedicalDisclaimer } from '../../components/MedicalDisclaimer.jsx';
import { useState } from 'react';
import { T, s } from '../../theme.js';
const C = T.score;

// Facteurs démographiques
const DEM = [
  { id: 'sex', label: 'Sexe féminin', v: -10, info: 'Points retirés si femme' },
  { id: 'ehpad', label: 'Vie en institution (EHPAD)', v: 10 },
];

// Comorbidités
const COMORBID = [
  { id: 'neuro',    label: 'Maladie neurologique',         v: 10 },
  { id: 'ic',       label: 'Insuffisance cardiaque',        v: 10 },
  { id: 'renale',   label: 'Insuffisance rénale',           v: 10 },
  { id: 'hepatique',label: 'Insuffisance hépatique',        v: 10 },
  { id: 'cancer',   label: 'Néoplasie active',              v: 30 },
];

// Examen clinique
const CLINIQUE = [
  { id: 'confus',  label: 'Altération de l\'état mental',  v: 20 },
  { id: 'tachyp',  label: 'FR ≥ 30/min',                  v: 20 },
  { id: 'hypo',    label: 'PA systolique < 90 mmHg',       v: 20 },
  { id: 'temp',    label: 'T° < 35°C ou ≥ 40°C',          v: 15 },
  { id: 'tachy',   label: 'FC ≥ 125 bpm',                  v: 10 },
];

// Biologie / Radio
const BIO = [
  { id: 'ph',     label: 'pH artériel < 7.35',             v: 30 },
  { id: 'uree',   label: 'Urée > 11 mmol/L',              v: 20 },
  { id: 'na',     label: 'Natrémie < 130 mmol/L',         v: 20 },
  { id: 'glyc',   label: 'Glycémie > 14 mmol/L',          v: 10 },
  { id: 'hema',   label: 'Hématocrite < 30%',              v: 10 },
  { id: 'pao2',   label: 'PaO₂ < 60 mmHg',                v: 10 },
  { id: 'pleur',  label: 'Épanchement pleural',            v: 10 },
];

const GROUPS = [
  { title: 'Démographie', items: DEM },
  { title: 'Comorbidités', items: COMORBID },
  { title: 'Examen clinique', items: CLINIQUE },
  { title: 'Biologie / Radiologie', items: BIO },
];

const getClass = (age, score) => {
  // Classes I ne peuvent pas être calculées sans l'algo complet — on utilise score uniquement
  if (score <= 70) return ['Classe II', '#22c55e', 'Mortalité < 1%', 'Traitement ambulatoire possible'];
  if (score <= 90) return ['Classe III', '#22c55e', 'Mortalité 1–3%', 'Hospitalisation courte à envisager'];
  if (score <= 130) return ['Classe IV', '#f59e0b', 'Mortalité 8–9%', 'Hospitalisation recommandée'];
  return ['Classe V', '#ef4444', 'Mortalité 27–31%', '⚠️ Hospitalisation urgente / Réanimation'];
};

export default function PSI() {
  const [age, setAge] = useState('');
  const [sel, setSel] = useState({});

  const toggle = id => setSel(p => ({ ...p, [id]: !p[id] }));

  const allItems = [...DEM, ...COMORBID, ...CLINIQUE, ...BIO];
  const baseScore = parseInt(age) || 0;
  const bonusScore = allItems.reduce((a, it) => a + (sel[it.id] ? it.v : 0), 0);
  const total = baseScore + bonusScore;
  const hasAge = age !== '' && !isNaN(parseInt(age));
  const [cls, col, mort, rec] = hasAge ? getClass(parseInt(age), total) : ['', C, '', ''];

  return (
    <div style={{ padding: '14px' }}>
      <MedicalDisclaimer level="standard" />
      <div style={{ ...s.card, background: C + '11', border: `1px solid ${C}33`, marginBottom: 14 }}>
        <div style={{ color: C, fontWeight: 700, fontSize: 13 }}>PSI / Score PORT — Pneumonie communautaire</div>
        <div style={{ color: T.muted, fontSize: 12, marginTop: 3 }}>Pneumonia Severity Index · Évaluation de la sévérité et décision d'hospitalisation</div>
      </div>

      {/* Âge */}
      <div style={s.card}>
        <label style={{ ...s.label }}>Âge (années) — Score de base = âge</label>
        <input type="number" min="1" max="120" value={age} onChange={e => setAge(e.target.value)}
          placeholder="Ex: 72"
          style={{ ...s.input, fontSize: 18, fontWeight: 700, textAlign: 'center' }} />
      </div>

      {GROUPS.map(g => (
        <div key={g.title}>
          <div style={{ color: C, fontFamily: 'monospace', fontSize: 11, letterSpacing: 2, margin: '12px 0 6px' }}>{g.title.toUpperCase()}</div>
          {g.items.map(it => (
            <div key={it.id} onClick={() => toggle(it.id)}
              style={{ ...s.card, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6, background: sel[it.id] ? C + '18' : T.surface, border: `1px solid ${sel[it.id] ? C : T.border}` }}>
              <span style={{ color: sel[it.id] ? C : T.text, fontSize: 13, flex: 1 }}>{it.label}</span>
              <span style={{ color: C, fontFamily: 'monospace', fontWeight: 700, minWidth: 36, textAlign: 'right' }}>+{Math.abs(it.v)}</span>
            </div>
          ))}
        </div>
      ))}

      {hasAge && (
        <div style={{ ...s.result(col), textAlign: 'center', marginTop: 14, animation: 'fadeIn 0.3s ease' }}>
          <div style={{ color: col, fontSize: 32, fontWeight: 700 }}>{total} pts</div>
          <div style={{ color: col, fontSize: 16, fontWeight: 700, marginTop: 4 }}>{cls}</div>
          <div style={{ color: T.muted, fontSize: 13, marginTop: 4 }}>{mort}</div>
          <div style={{ color: T.text, fontSize: 13, marginTop: 6 }}>→ {rec}</div>
        </div>
      )}

      <div style={{ ...s.card, marginTop: 12 }}>
        <div style={{ color: C, fontFamily: 'monospace', fontSize: 11, letterSpacing: 2, marginBottom: 8 }}>CLASSES DE RISQUE</div>
        {[['≤ 70', 'II', '< 1%', 'Ambulatoire'], ['71–90', 'III', '1–3%', 'Hospit. courte'], ['91–130', 'IV', '8–9%', 'Hospitalisation'], ['> 130', 'V', '27–31%', 'Réa / Urgence']].map(([sc, c, m, r]) => (
          <div key={sc} style={{ display: 'flex', gap: 8, marginBottom: 5, fontSize: 12 }}>
            <span style={{ color: C, fontFamily: 'monospace', minWidth: 50 }}>{sc}</span>
            <span style={{ color: T.text, minWidth: 25 }}>{c}</span>
            <span style={{ color: '#f59e0b', minWidth: 55 }}>{m}</span>
            <span style={{ color: T.muted }}>{r}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

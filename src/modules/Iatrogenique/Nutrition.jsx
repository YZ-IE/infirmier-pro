import { MedicalDisclaimer } from '../../components/MedicalDisclaimer.jsx';
import { useState } from 'react';
import { T, s } from '../../theme.js';
const C = T.iatr;

export default function Nutrition({ onBack }) {
  const [form, setForm] = useState({ poids: '', taille: '', age: '', sexe: 'H', activite: '1.2', stress: '1.0', voie: 'enterale' });
  const [result, setResult] = useState(null);

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const calc = () => {
    const p = parseFloat(form.poids);
    const t = parseFloat(form.taille);
    const a = parseFloat(form.age);
    const fa = parseFloat(form.activite);
    const fs = parseFloat(form.stress);
    if (!p || !t || !a) return;

    // Harris-Benedict révisé (Mifflin-St Jeor, plus précis)
    let MB;
    if (form.sexe === 'H') {
      MB = 10 * p + 6.25 * t - 5 * a + 5;
    } else {
      MB = 10 * p + 6.25 * t - 5 * a - 161;
    }
    const DET = Math.round(MB * fa * fs);

    // IMC
    const imc = (p / ((t / 100) ** 2)).toFixed(1);

    // Protéines
    let proMin, proMax;
    if (fs >= 1.4) { proMin = p * 1.5; proMax = p * 2.0; }
    else if (fs >= 1.2) { proMin = p * 1.2; proMax = p * 1.5; }
    else { proMin = p * 0.8; proMax = p * 1.2; }

    // Glucides / lipides (distribution calorique)
    const kcalNonProt = DET - (proMax * 4); // protéines = 4 kcal/g
    const glucoses = Math.round(kcalNonProt * 0.6 / 4); // g/j, 60% non-prot en glucides
    const lipides = Math.round(kcalNonProt * 0.4 / 9);  // g/j, 40% en lipides

    // Eau
    const eau = Math.round(p * 30);

    // Osmolarité estimée (nutrition parentérale)
    // Formule approx : [Glc(g) × 5 + AA(g) × 10 + Na × 2] / volume(L)
    const vol = eau / 1000;
    const osmo = Math.round((glucoses * 5 + proMax * 10) / vol);

    setResult({ MB: Math.round(MB), DET, imc, proMin: Math.round(proMin), proMax: Math.round(proMax), glucoses, lipides, eau, osmo, vol });
  };

  const ACTIVITE = [
    { v: '1.2', l: 'Alité / Sédentaire' },
    { v: '1.375', l: 'Légèrement actif' },
    { v: '1.55', l: 'Modérément actif' },
    { v: '1.725', l: 'Très actif' },
  ];
  const STRESS = [
    { v: '1.0', l: 'Aucun stress métabolique' },
    { v: '1.1', l: 'Stress léger (infection bénigne)' },
    { v: '1.2', l: 'Stress modéré (chirurgie, trauma)' },
    { v: '1.4', l: 'Stress sévère (brûlures > 30%, sepsis)' },
    { v: '1.6', l: 'Stress majeur (polytrauma, grands brûlés)' },
  ];

  return (
    <div style={{ padding: '14px' }}>
      <MedicalDisclaimer level="calcul" />
      <div style={{ ...s.card, background: C + '11', border: `1px solid ${C}33`, marginBottom: 14 }}>
        <div style={{ color: C, fontWeight: 700, fontSize: 13 }}>🥗 Calculateur Nutrition Parentérale / Entérale</div>
        <div style={{ color: T.muted, fontSize: 12, marginTop: 3 }}>Harris-Benedict révisé (Mifflin-St Jeor) · Apports calorico-protéiques · Osmolarité</div>
      </div>

      {/* Sexe */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
        {[['H', '♂ Homme'], ['F', '♀ Femme']].map(([v, l]) => (
          <button key={v} onClick={() => set('sexe', v)}
            style={{ flex: 1, padding: '10px', borderRadius: 8, border: `1px solid ${form.sexe === v ? C : T.border}`, background: form.sexe === v ? C + '22' : T.surface, color: form.sexe === v ? C : T.muted, fontWeight: 700, cursor: 'pointer' }}>
            {l}
          </button>
        ))}
      </div>

      {/* Mesures */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 10 }}>
        {[['poids', 'Poids (kg)', '70'], ['taille', 'Taille (cm)', '170'], ['age', 'Âge (ans)', '50']].map(([k, l, ph]) => (
          <div key={k} style={s.card}>
            <label style={s.label}>{l}</label>
            <input type="number" value={form[k]} onChange={e => set(k, e.target.value)} placeholder={ph}
              style={{ ...s.input, textAlign: 'center', fontSize: 16, fontWeight: 700 }} />
          </div>
        ))}
      </div>

      {/* Activité */}
      <div style={s.card}>
        <label style={s.label}>Facteur d'activité</label>
        {ACTIVITE.map(a => (
          <button key={a.v} onClick={() => set('activite', a.v)}
            style={{ display: 'flex', justifyContent: 'space-between', width: '100%', background: form.activite === a.v ? C + '22' : T.bg, border: `1px solid ${form.activite === a.v ? C : T.border}`, borderRadius: 7, padding: '9px 12px', marginBottom: 5, cursor: 'pointer', textAlign: 'left' }}>
            <span style={{ color: form.activite === a.v ? C : T.text, fontSize: 13 }}>{a.l}</span>
            <span style={{ color: C, fontFamily: 'monospace', fontSize: 13 }}>× {a.v}</span>
          </button>
        ))}
      </div>

      {/* Stress */}
      <div style={s.card}>
        <label style={s.label}>Facteur de stress métabolique</label>
        {STRESS.map(a => (
          <button key={a.v} onClick={() => set('stress', a.v)}
            style={{ display: 'flex', justifyContent: 'space-between', width: '100%', background: form.stress === a.v ? C + '22' : T.bg, border: `1px solid ${form.stress === a.v ? C : T.border}`, borderRadius: 7, padding: '9px 12px', marginBottom: 5, cursor: 'pointer', textAlign: 'left' }}>
            <span style={{ color: form.stress === a.v ? C : T.text, fontSize: 13 }}>{a.l}</span>
            <span style={{ color: C, fontFamily: 'monospace', fontSize: 13 }}>× {a.v}</span>
          </button>
        ))}
      </div>

      {/* Voie */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
        {[['enterale', '🍼 Entérale'], ['parenterale', '💉 Parentérale']].map(([v, l]) => (
          <button key={v} onClick={() => set('voie', v)}
            style={{ flex: 1, padding: '10px', borderRadius: 8, border: `1px solid ${form.voie === v ? C : T.border}`, background: form.voie === v ? C + '22' : T.surface, color: form.voie === v ? C : T.muted, fontWeight: 700, cursor: 'pointer', fontSize: 13 }}>
            {l}
          </button>
        ))}
      </div>

      <button onClick={calc} style={{ ...s.btn(C), width: '100%', padding: '14px', fontSize: 15, fontWeight: 700, marginBottom: 14 }}>
        Calculer les apports nutritionnels
      </button>

      {result && (
        <div style={{ animation: 'fadeIn 0.3s ease' }}>
          {/* Résultats principaux */}
          <div style={{ background: C + '18', border: `1px solid ${C}44`, borderRadius: 12, padding: '16px', marginBottom: 10 }}>
            <div style={{ color: C, fontFamily: 'monospace', fontSize: 11, letterSpacing: 2, marginBottom: 12 }}>▸ BESOINS CALCULÉS</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {[
                ['IMC', `${result.imc} kg/m²`],
                ['Métabolisme de base', `${result.MB} kcal/j`],
                ['Dépense énergétique totale', `${result.DET} kcal/j`],
                ['Eau', `${result.eau} mL/j`],
                ['Protéines', `${result.proMin}–${result.proMax} g/j`],
                ['Glucides', `${result.glucoses} g/j`],
                ['Lipides', `${result.lipides} g/j`],
              ].map(([l, v]) => (
                <div key={l} style={{ background: T.bg, borderRadius: 8, padding: '10px 12px' }}>
                  <div style={{ color: T.muted, fontSize: 11, marginBottom: 3 }}>{l}</div>
                  <div style={{ color: T.text, fontWeight: 700, fontSize: 15 }}>{v}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Osmolarité (parentérale) */}
          {form.voie === 'parenterale' && (
            <div style={{ ...s.card, border: `1px solid ${result.osmo > 800 ? '#f59e0b' : '#22c55e'}44` }}>
              <div style={{ color: result.osmo > 800 ? '#f59e0b' : '#22c55e', fontWeight: 700, fontSize: 14 }}>
                Osmolarité estimée : {result.osmo} mOsm/L
              </div>
              <div style={{ color: T.muted, fontSize: 12, marginTop: 4 }}>
                {result.osmo > 900 ? '⚠️ Osmolarité > 900 → Voie centrale obligatoire (PICC ou VVC)' : result.osmo > 800 ? '⚠️ Osmolarité > 800 → Voie centrale préférable' : '✅ Osmolarité compatible voie périphérique (< 800 mOsm/L)'}
              </div>
            </div>
          )}

          {/* Conseils */}
          <div style={{ ...s.card, marginTop: 4 }}>
            <div style={{ color: C, fontFamily: 'monospace', fontSize: 11, letterSpacing: 2, marginBottom: 8 }}>POINTS CLINIQUES</div>
            {(form.voie === 'enterale' ? [
              'Débuter à 20 mL/h, augmenter de 20 mL/h toutes les 8h si toléré',
              'Vérifier résidu gastrique toutes les 4–6h (arrêt si > 250 mL)',
              'Rincer la sonde : 30 mL eau avant/après chaque administration médicament',
              'Positionner tête de lit à 30–45° pendant et 1h après le débit',
            ] : [
              'Contrôle glycémique strict : objectif 6–10 mmol/L',
              'Phosphate, potassium, magnésium à monitorer (syndrome de renutrition)',
              'Vitamine B1 (Thiamine) systématique avant resucrage chez dénutris',
              'Bilan entrées/sorties quotidien, pesée si possible',
            ]).map((c, i) => <div key={i} style={{ color: T.muted, fontSize: 12, marginBottom: 5 }}>• {c}</div>)}
          </div>
        </div>
      )}
    </div>
  );
}

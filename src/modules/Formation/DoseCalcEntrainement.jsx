/**
 * DoseCalcEntrainement.jsx — Formation
 * Entraînement au calcul de dose avec 3 niveaux de difficulté
 */

import { useState } from 'react';
import { T, s } from '../../theme.js';
const C = T.form;

// ─── Exercices par niveau ────────────────────────────────────────────────────

const EXERCISES = {
  facile: [
    {
      enonce: 'Paracétamol 1 g à administrer. Disponible : comprimés de 500 mg.',
      question: 'Combien de comprimés administrer ?',
      calcul: '1000 mg ÷ 500 mg = 2 comprimés',
      reponse: 2, unite: 'comprimé(s)',
      indice: 'Divise la dose prescrite par la dose d\'un comprimé.',
    },
    {
      enonce: 'Amoxicilline 250 mg/5 mL. Prescrire 500 mg.',
      question: 'Quel volume administrer (mL) ?',
      calcul: '500 mg × 5 mL ÷ 250 mg = 10 mL',
      reponse: 10, unite: 'mL',
      indice: 'Règle de trois : dose voulue × volume dispo ÷ dose disponible.',
    },
    {
      enonce: 'Doliprane sirop 300 mg/5 mL. Prescrire 150 mg.',
      question: 'Quel volume administrer (mL) ?',
      calcul: '150 × 5 ÷ 300 = 2,5 mL',
      reponse: 2.5, unite: 'mL',
      indice: 'Dose voulue × volume total ÷ dose totale.',
    },
    {
      enonce: 'Métoclopramide 10 mg/2 mL (solution injectable). Prescrire 5 mg.',
      question: 'Quel volume prélever (mL) ?',
      calcul: '5 × 2 ÷ 10 = 1 mL',
      reponse: 1, unite: 'mL',
      indice: 'Même règle de trois.',
    },
    {
      enonce: 'Furosémide 20 mg/2 mL. Prescrire 40 mg IV.',
      question: 'Quel volume prélever (mL) ?',
      calcul: '40 × 2 ÷ 20 = 4 mL',
      reponse: 4, unite: 'mL',
      indice: 'Dose voulue × volume stock ÷ dose stock.',
    },
    {
      enonce: 'Prednisolone comprimés 5 mg. Prescrire 20 mg.',
      question: 'Combien de comprimés ?',
      calcul: '20 ÷ 5 = 4 comprimés',
      reponse: 4, unite: 'comprimé(s)',
      indice: 'Division simple.',
    },
    {
      enonce: 'Tramadol 100 mg/2 mL. Prescrire 50 mg IM.',
      question: 'Quel volume prélever (mL) ?',
      calcul: '50 × 2 ÷ 100 = 1 mL',
      reponse: 1, unite: 'mL',
      indice: 'Règle de trois.',
    },
    {
      enonce: 'Morphine 10 mg/mL. Prescrire 5 mg IV lente.',
      question: 'Quel volume prélever (mL) ?',
      calcul: '5 ÷ 10 = 0,5 mL',
      reponse: 0.5, unite: 'mL',
      indice: 'Dose voulue ÷ concentration.',
    },
  ],

  intermediaire: [
    {
      enonce: 'Patient de 70 kg. Gentamicine 3 mg/kg/j en 1 injection IV.',
      question: 'Quelle dose totale administrer (mg) ?',
      calcul: '70 × 3 = 210 mg',
      reponse: 210, unite: 'mg',
      indice: 'Poids × dose/kg.',
    },
    {
      enonce: 'Gentamicine 40 mg/mL. Dose calculée : 210 mg.',
      question: 'Quel volume prélever (mL) ?',
      calcul: '210 ÷ 40 = 5,25 mL',
      reponse: 5.25, unite: 'mL',
      indice: 'Dose voulue ÷ concentration.',
    },
    {
      enonce: 'Héparine en SAP : 25 000 UI dans 50 mL de NaCl 0,9%. Prescrire 1 500 UI/h.',
      question: 'Quel débit programmer (mL/h) ?',
      calcul: '1500 × 50 ÷ 25000 = 3 mL/h',
      reponse: 3, unite: 'mL/h',
      indice: 'Dose/h × volume total ÷ dose totale.',
    },
    {
      enonce: 'Noradrénaline : 4 mg dans 40 mL. Prescrire 0,1 mcg/kg/min. Patient 80 kg.',
      question: 'Quel débit programmer (mL/h) ?',
      calcul: '0,1 mcg/kg/min × 80 kg = 8 mcg/min = 480 mcg/h = 0,48 mg/h\nConc : 4 mg/40 mL = 0,1 mg/mL\n0,48 ÷ 0,1 = 4,8 mL/h',
      reponse: 4.8, unite: 'mL/h',
      indice: 'Dose/min × poids → dose/h → dose/h ÷ concentration.',
    },
    {
      enonce: 'Potassium IV : 1 g/h max autorisé. Disponible : KCl 10% (1 g/10 mL).',
      question: 'Débit max en mL/h ?',
      calcul: '1 g/h ÷ (1 g/10 mL) = 10 mL/h',
      reponse: 10, unite: 'mL/h',
      indice: 'Débit voulu (g/h) ÷ concentration (g/mL).',
    },
    {
      enonce: 'Patient 60 kg. Dobutamine 5 mcg/kg/min. Seringue : 250 mg dans 50 mL.',
      question: 'Débit à programmer (mL/h) ?',
      calcul: '5 × 60 = 300 mcg/min = 18 000 mcg/h = 18 mg/h\nConc : 250/50 = 5 mg/mL\n18 ÷ 5 = 3,6 mL/h',
      reponse: 3.6, unite: 'mL/h',
      indice: 'Dose/min × poids → dose/h (mcg→mg) → ÷ concentration.',
    },
    {
      enonce: 'Soluté glucosé 500 mL à passer en 4h en perfusion (macrogouttes, 20 gtt/mL).',
      question: 'Débit en gouttes/min ?',
      calcul: '500 ÷ 4 = 125 mL/h\n125 × 20 ÷ 60 = 41,7 → 42 gtt/min',
      reponse: 42, unite: 'gtt/min',
      indice: 'mL/h × facteur de gouttes ÷ 60.',
    },
    {
      enonce: 'Amoxicilline 1 g IV à reconstituer dans 100 mL de G5% en 30 min.',
      question: 'Débit de la perfusion (mL/h) ?',
      calcul: '100 mL ÷ 0,5 h = 200 mL/h',
      reponse: 200, unite: 'mL/h',
      indice: 'Volume ÷ durée (en heures).',
    },
  ],

  difficile: [
    {
      enonce: 'Insuline Actrapid : 50 UI dans 50 mL de NaCl 0,9% (1 UI/mL). Glycémie à 18 mmol/L. Protocole : > 15 mmol/L → 6 UI/h.',
      question: 'Quel débit programmer (mL/h) ?',
      calcul: 'Concentration = 1 UI/mL\n6 UI/h ÷ 1 UI/mL = 6 mL/h',
      reponse: 6, unite: 'mL/h',
      indice: 'Identifier la tranche du protocole, puis dose ÷ concentration.',
    },
    {
      enonce: 'Morphine SAP : 60 mg dans 60 mL (1 mg/mL). Patient 55 kg. Prescrire 0,05 mg/kg/h.',
      question: 'Débit (mL/h) ?',
      calcul: '0,05 × 55 = 2,75 mg/h\n2,75 ÷ 1 = 2,75 mL/h',
      reponse: 2.75, unite: 'mL/h',
      indice: 'Dose/kg/h × poids → dose/h → ÷ concentration.',
    },
    {
      enonce: 'Vancomycine : taux résiduel 15 mg/L voulu. Dose de charge 25 mg/kg. Patient 72 kg.',
      question: 'Dose de charge totale (mg) ?',
      calcul: '25 × 72 = 1800 mg',
      reponse: 1800, unite: 'mg',
      indice: 'Dose/kg × poids.',
    },
    {
      enonce: 'Vancomycine 500 mg/10 mL disponible. Dose calculée 1800 mg.',
      question: 'Volume total à préparer (mL) ?',
      calcul: '1800 ÷ 500 × 10 = 36 mL',
      reponse: 36, unite: 'mL',
      indice: 'Dose voulue ÷ dose stock × volume stock.',
    },
    {
      enonce: 'Propofol 1% (10 mg/mL). Induction : 2 mg/kg chez patient 85 kg. Entretien : 6 mg/kg/h.',
      question: 'Dose d\'induction totale (mg) ?',
      calcul: '2 × 85 = 170 mg',
      reponse: 170, unite: 'mg',
      indice: 'Dose/kg × poids.',
    },
    {
      enonce: 'Propofol 1% (10 mg/mL). Entretien : 6 mg/kg/h. Patient 85 kg.',
      question: 'Débit d\'entretien (mL/h) ?',
      calcul: '6 × 85 = 510 mg/h\n510 ÷ 10 = 51 mL/h',
      reponse: 51, unite: 'mL/h',
      indice: 'Dose/h × poids → ÷ concentration.',
    },
    {
      enonce: 'Transfusion 1 culot de 300 mL à passer en 1h30. Macrogouttes (20 gtt/mL).',
      question: 'Débit en gouttes/min ?',
      calcul: '300 ÷ 1,5 h = 200 mL/h\n200 × 20 ÷ 60 = 66,7 → 67 gtt/min',
      reponse: 67, unite: 'gtt/min',
      indice: 'Volume ÷ durée (h) → mL/h × 20 ÷ 60.',
    },
    {
      enonce: 'Naloxone IV : 0,4 mg/mL. Dose initiale 2 mcg/kg. Patient 90 kg.',
      question: 'Volume à injecter (mL) ?',
      calcul: '2 mcg × 90 = 180 mcg = 0,18 mg\n0,18 ÷ 0,4 = 0,45 mL',
      reponse: 0.45, unite: 'mL',
      indice: 'Dose/kg × poids → conversion mcg→mg → ÷ concentration.',
    },
  ],
};

const NIVEAU_CONFIG = {
  facile:        { label: 'Débutant',    color: '#22c55e', icon: '🌱', desc: 'Règle de trois simple, doses fixes' },
  intermediaire: { label: 'Intermédiaire', color: '#f97316', icon: '⚡', desc: 'Doses/kg, SAP, débits de perfusion' },
  difficile:     { label: 'Avancé',      color: '#f43f5e', icon: '🔥', desc: 'Catécholamines, poids, protocoles' },
};

function shuffle(arr) { return [...arr].sort(() => Math.random() - 0.5); }

function round2(n) { return Math.round(n * 100) / 100; }

function isCorrect(input, expected) {
  const val = parseFloat(String(input).replace(',', '.'));
  if (isNaN(val)) return false;
  return Math.abs(val - expected) < 0.1;
}

// ─── Écran d'entraînement ─────────────────────────────────────────────────────

function Entrainement({ niveau, onBack }) {
  const cfg       = NIVEAU_CONFIG[niveau];
  const [exos]    = useState(() => shuffle(EXERCISES[niveau]));
  const [idx,     setIdx]     = useState(0);
  const [input,   setInput]   = useState('');
  const [result,  setResult]  = useState(null); // null | 'correct' | 'wrong'
  const [score,   setScore]   = useState(0);
  const [showHint,setShowHint]= useState(false);
  const [done,    setDone]    = useState(false);

  const ex = exos[idx];

  function handleCheck() {
    const ok = isCorrect(input, ex.reponse);
    setResult(ok ? 'correct' : 'wrong');
    if (ok) setScore(s => s + 1);
  }

  function handleNext() {
    if (idx < exos.length - 1) { setIdx(i => i + 1); setInput(''); setResult(null); setShowHint(false); }
    else setDone(true);
  }

  if (done) return (
    <div style={{ padding: 16 }}>
      <div style={{ ...s.result(score / exos.length >= 0.7 ? cfg.color : '#ef4444'), textAlign: 'center' }}>
        <div style={{ fontSize: 44, marginBottom: 10 }}>{score / exos.length >= 0.8 ? '🏆' : score / exos.length >= 0.6 ? '👍' : '📚'}</div>
        <div style={{ color: cfg.color, fontSize: 30, fontWeight: 700 }}>{score}/{exos.length}</div>
        <div style={{ color: T.muted, fontSize: 14, marginTop: 4 }}>{Math.round(score / exos.length * 100)}% de bonnes réponses</div>
        <div style={{ color: T.muted, fontSize: 13, marginTop: 6 }}>
          {score === exos.length ? 'Parfait !' : score / exos.length >= 0.8 ? 'Excellent !' : score / exos.length >= 0.6 ? 'Bien, continuez !' : 'Révisez les formules clés.'}
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
          <button onClick={() => { setIdx(0); setInput(''); setResult(null); setScore(0); setDone(false); setShowHint(false); }}
            style={{ ...s.btn(cfg.color), flex: 1, padding: '10px' }}>Recommencer</button>
          <button onClick={onBack} style={{ ...s.btn(T.muted), flex: 1, padding: '10px' }}>Changer de niveau</button>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ padding: 16 }}>
      {/* Progression */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
        <span style={{ color: T.muted, fontFamily: 'monospace', fontSize: 12 }}>Question {idx + 1}/{exos.length}</span>
        <span style={{ color: cfg.color, fontFamily: 'monospace', fontSize: 12 }}>Score {score}</span>
      </div>
      <div style={{ background: T.border, borderRadius: 4, height: 4, marginBottom: 16 }}>
        <div style={{ background: cfg.color, height: 4, borderRadius: 4, width: `${idx / exos.length * 100}%`, transition: 'width 0.3s' }} />
      </div>

      {/* Énoncé */}
      <div style={{ ...s.card, marginBottom: 12 }}>
        <div style={{ color: T.muted, fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>Énoncé</div>
        <div style={{ color: T.text, fontSize: 14, lineHeight: 1.6 }}>{ex.enonce}</div>
      </div>

      {/* Question */}
      <div style={{ color: T.text, fontSize: 15, fontWeight: 700, marginBottom: 12, lineHeight: 1.5 }}>
        {ex.question}
      </div>

      {/* Saisie */}
      {result === null && (
        <>
          <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
            <input
              type="number"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && input) handleCheck(); }}
              placeholder="Votre réponse…"
              inputMode="decimal"
              style={{ ...s.input, flex: 1, boxSizing: 'border-box', fontSize: 18, textAlign: 'center', fontWeight: 700 }}
            />
            <span style={{ display: 'flex', alignItems: 'center', color: T.muted, fontSize: 14, flexShrink: 0 }}>{ex.unite}</span>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={handleCheck} disabled={!input}
              style={{ ...s.btn(cfg.color), flex: 2, padding: '12px', fontSize: 15, fontWeight: 700, opacity: input ? 1 : 0.4 }}>
              Vérifier
            </button>
            <button onClick={() => setShowHint(h => !h)}
              style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10, color: T.muted, fontSize: 14, padding: '12px', cursor: 'pointer', flex: 1 }}>
              💡 Indice
            </button>
          </div>
          {showHint && (
            <div style={{ background: '#fbbf2418', border: '1px solid #fbbf2444', borderRadius: 9, padding: '10px 12px', marginTop: 10, color: '#fbbf24', fontSize: 13 }}>
              💡 {ex.indice}
            </div>
          )}
        </>
      )}

      {/* Résultat */}
      {result !== null && (
        <div style={{ background: result === 'correct' ? cfg.color + '18' : '#ef444418', border: `1px solid ${result === 'correct' ? cfg.color : '#ef4444'}44`, borderRadius: 9, padding: '14px 14px', marginTop: 4, animation: 'fadeIn 0.3s' }}>
          <div style={{ color: result === 'correct' ? cfg.color : '#ef4444', fontWeight: 700, fontSize: 15, marginBottom: 8 }}>
            {result === 'correct' ? `✓ Correct ! ${round2(ex.reponse)} ${ex.unite}` : `✗ La bonne réponse est ${round2(ex.reponse)} ${ex.unite}`}
          </div>
          <div style={{ color: T.muted, fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>Calcul</div>
          <div style={{ color: T.text, fontSize: 13, lineHeight: 1.7, fontFamily: 'monospace', background: T.bg, borderRadius: 7, padding: '8px 10px', marginBottom: 12, whiteSpace: 'pre-line' }}>
            {ex.calcul}
          </div>
          <button onClick={handleNext} style={{ ...s.btn(cfg.color), padding: '10px 20px' }}>
            {idx < exos.length - 1 ? 'Suivant →' : 'Résultats'}
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Composant principal ──────────────────────────────────────────────────────

export default function DoseCalcEntrainement() {
  const [niveau, setNiveau] = useState(null);

  if (niveau) return <Entrainement niveau={niveau} onBack={() => setNiveau(null)} />;

  return (
    <div style={{ padding: 16 }}>
      <div style={{ color: T.text, fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Choisissez votre niveau</div>
      <div style={{ color: T.muted, fontSize: 13, marginBottom: 20 }}>
        Formule universelle : <span style={{ color: C, fontFamily: 'monospace' }}>Dose voulue × Volume stock ÷ Dose stock</span>
      </div>

      {Object.entries(NIVEAU_CONFIG).map(([id, cfg]) => (
        <div key={id} onClick={() => setNiveau(id)}
          style={{ background: T.surface, border: `1px solid ${cfg.color}44`, borderLeft: `3px solid ${cfg.color}`, borderRadius: 12, padding: '16px 16px', marginBottom: 12, cursor: 'pointer', WebkitTapHighlightColor: 'transparent' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 28 }}>{cfg.icon}</span>
            <div>
              <div style={{ color: cfg.color, fontWeight: 700, fontSize: 15 }}>{cfg.label}</div>
              <div style={{ color: T.muted, fontSize: 12, marginTop: 2 }}>{cfg.desc}</div>
              <div style={{ color: T.muted, fontSize: 11, marginTop: 4 }}>{EXERCISES[id].length} exercices</div>
            </div>
          </div>
        </div>
      ))}

      {/* Rappel des formules */}
      <div style={{ ...s.card, marginTop: 8 }}>
        <div style={{ color: C, fontSize: 12, fontWeight: 700, marginBottom: 10 }}>📐 Formules clés</div>
        {[
          { label: 'Dose injectable', formula: 'Dose voulue × V stock ÷ Dose stock' },
          { label: 'Débit SAP (mL/h)', formula: 'Dose/h × V total ÷ Dose totale' },
          { label: 'Dose/kg', formula: 'Dose prescrite × Poids (kg)' },
          { label: 'Gouttes/min', formula: 'mL/h × 20 (macro) ÷ 60' },
          { label: 'mL/h → mcg/min', formula: 'mL/h × concentration ÷ 60' },
        ].map(f => (
          <div key={f.label} style={{ display: 'flex', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
            <span style={{ color: T.muted, fontSize: 12, minWidth: 130, flexShrink: 0 }}>{f.label}</span>
            <span style={{ color: T.text, fontSize: 12, fontFamily: 'monospace', background: T.bg, borderRadius: 5, padding: '2px 7px' }}>{f.formula}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

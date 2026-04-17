import { MedicalDisclaimer } from '../../components/MedicalDisclaimer.jsx';
import { useState } from 'react';
import { T, s } from '../../theme.js';
const C = T.score;

export default function CAM() {
  const [vals, setVals] = useState({});
  const toggle = (k) => setVals(v => ({ ...v, [k]: !v[k] }));

  const positif = vals.debut && vals.attention && (vals.conscience || vals.pensee);

  const CRITERES = [
    { key: 'debut', label: '1. Début soudain et fluctuation', desc: 'Changement aigu du statut mental avec fluctuation dans la journée (alternance agitation/somnolence)', required: true },
    { key: 'attention', label: '2. Inattention', desc: 'Difficulté à maintenir l\'attention, distractibilité, répétition des questions nécessaire', required: true },
    { key: 'pensee', label: '3. Pensée désorganisée', desc: 'Discours incohérent, idées illogiques, conversation difficile à suivre', required: false },
    { key: 'conscience', label: '4. Altération de la conscience', desc: 'Somnolent, stuporeux, hyper-vigilant ou comateux (tout sauf alerte et calme)', required: false },
  ];

  return (
    <div style={{ padding: '14px' }}>
      <MedicalDisclaimer level="standard" />
      <div style={{ ...s.card, background: '#1e1b4b' }}>
        <div style={{ color: C, fontWeight: 700, marginBottom: 4 }}>CAM — Confusion Assessment Method</div>
        <div style={{ color: T.muted, fontSize: 12 }}>Dépistage du syndrome confusionnel (délirium). Critères 1+2+3 ou 1+2+4 requis.</div>
      </div>
      {CRITERES.map((c) => (
        <div key={c.key} onClick={() => toggle(c.key)} style={{
          ...s.card, cursor: 'pointer',
          borderLeft: `3px solid ${vals[c.key] ? C : '#334155'}`,
          background: vals[c.key] ? C + '11' : T.surface
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ flex: 1 }}>
              <div style={{ color: vals[c.key] ? C : T.text, fontWeight: 700, fontSize: 13, marginBottom: 4 }}>
                {c.label} {c.required && <span style={{ color: '#ef4444', fontSize: 10 }}>OBLIGATOIRE</span>}
              </div>
              <div style={{ color: T.muted, fontSize: 12, lineHeight: 1.5 }}>{c.desc}</div>
            </div>
            <div style={{
              width: 24, height: 24, borderRadius: '50%', flexShrink: 0, marginLeft: 12,
              background: vals[c.key] ? C : 'transparent',
              border: `2px solid ${vals[c.key] ? C : '#475569'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontSize: 14
            }}>{vals[c.key] ? '✓' : ''}</div>
          </div>
        </div>
      ))}

      {(vals.debut !== undefined || vals.attention !== undefined) && (
        <div style={{ ...s.result(positif ? '#ef4444' : '#22c55e'), textAlign: 'center', animation: 'fadeIn 0.3s' }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>{positif ? '⚠️' : '✅'}</div>
          <div style={{ color: positif ? '#ef4444' : '#22c55e', fontSize: 18, fontWeight: 700 }}>
            {positif ? 'DÉLIRIUM PROBABLE' : 'Pas de délirium détecté'}
          </div>
          {positif && (
            <div style={{ color: T.muted, fontSize: 13, marginTop: 8, lineHeight: 1.6 }}>
              Prévenir le médecin · Rechercher la cause (infection, médicaments, douleur, rétention urinaire…) · Mesures non-pharmacologiques : orientation temporo-spatiale, présence famille, lumière naturelle
            </div>
          )}
        </div>
      )}

      <div style={{ ...s.card, marginTop: 6, background: '#1e1b4b' }}>
        <div style={{ color: C, fontFamily: 'monospace', fontSize: 11, marginBottom: 8 }}>FACTEURS PRÉCIPITANTS FRÉQUENTS</div>
        {['Infection (urinaire, pulmonaire)', 'Douleur non traitée', 'Rétention urinaire / fécalome', 'Médicaments (benzodiazépines, anticholinergiques)', 'Déshydratation / troubles ioniques', 'Privation de sommeil', 'Immobilisation prolongée', 'Changement d\'environnement'].map((f, i) => (
          <div key={i} style={{ color: T.muted, fontSize: 12, paddingBottom: 5, marginBottom: 5, borderBottom: i < 7 ? '1px solid #1e293b' : 'none' }}>• {f}</div>
        ))}
      </div>
    </div>
  );
}

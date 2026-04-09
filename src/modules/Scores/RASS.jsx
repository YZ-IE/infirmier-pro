import { useState } from 'react';
import { T, s } from '../../theme.js';
const C = T.score;

const LEVELS = [
  { score: +4, label: 'Combatif',         desc: 'Violent, danger immédiat pour l\'équipe',                     color: '#ef4444' },
  { score: +3, label: 'Très agité',       desc: 'Arrache cathéters/tubes, agressif',                          color: '#f97316' },
  { score: +2, label: 'Agité',            desc: 'Mouvements fréquents non intentionnels, lutte contre le ventilateur', color: '#fb923c' },
  { score: +1, label: 'Anxieux',          desc: 'Anxieux mais sans mouvements agressifs ou vigoureux',         color: '#fbbf24' },
  {  score: 0, label: 'Éveillé et calme', desc: 'État normal',                                                 color: '#22c55e' },
  { score: -1, label: 'Somnolent',        desc: 'Non totalement éveillé, mais maintien d\'éveil (> 10 s) à la voix', color: '#34d399' },
  { score: -2, label: 'Sédation légère',  desc: 'Réveille brièvement (< 10 s) à la voix avec contact visuel',  color: '#06b6d4' },
  { score: -3, label: 'Sédation modérée', desc: 'Mouvements ou ouverture des yeux à la voix, sans contact visuel', color: '#60a5fa' },
  { score: -4, label: 'Sédation profonde','desc': 'Pas de réponse à la voix, mais mouvements ou ouverture des yeux à la stimulation physique', color: '#818cf8' },
  { score: -5, label: 'Non éveillable',   desc: 'Pas de réponse à la voix ni à la stimulation physique',       color: '#a78bfa' },
];

function getInterp(score) {
  if (score === 0)               return { text: 'Éveillé et calme — Cible habituelle en réa', color: '#22c55e' };
  if (score >= 1 && score <= 4)  return { text: 'Agitation — Évaluer la douleur, l\'inconfort, le délire', color: '#ef4444' };
  if (score === -1 || score === -2) return { text: 'Sédation légère — Cible possible selon protocole', color: '#06b6d4' };
  if (score === -3)              return { text: 'Sédation modérée — Vérifier objectif médical', color: '#60a5fa' };
  if (score <= -4)               return { text: 'Sédation profonde — Réévaluation recommandée', color: '#818cf8' };
  return { text: '', color: C };
}

export default function RASS() {
  const [selected, setSelected] = useState(null);

  const interp = selected !== null ? getInterp(selected) : null;

  return (
    <div style={{ padding: '14px', paddingBottom: 40 }}>
      {/* Info */}
      <div style={{ ...s.card, background: T.scoreDim, marginBottom: 14 }}>
        <div style={{ color: C, fontWeight: 700, fontSize: 15, marginBottom: 4 }}>RASS — Richmond Agitation-Sedation Scale</div>
        <div style={{ color: T.muted, fontSize: 12, lineHeight: 1.5 }}>
          Évaluation de la sédation et de l'agitation en soins intensifs. Évaluation en 3 étapes : observer → stimulation vocale → stimulation physique.
        </div>
      </div>

      {/* Procédure d'évaluation */}
      <div style={{ ...s.card, marginBottom: 14 }}>
        <div style={{ color: C, fontFamily: 'monospace', fontSize: 11, letterSpacing: 2, marginBottom: 10 }}>PROCÉDURE</div>
        {[
          ['1', 'Observer', 'Le patient est-il combatif, agité ou calme ? → +1 à +4 ou 0'],
          ['2', 'Stimulation vocale', 'Appeler le patient par son nom, demander d\'ouvrir les yeux → -1 à -3'],
          ['3', 'Stimulation physique', 'Secouer l\'épaule ou frotter le sternum → -4 ou -5'],
        ].map(([n, step, detail]) => (
          <div key={n} style={{ display: 'flex', gap: 12, marginBottom: 10 }}>
            <div style={{ width: 24, height: 24, borderRadius: '50%', background: C + '33', border: `1px solid ${C}`, color: C, fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{n}</div>
            <div>
              <div style={{ color: C, fontWeight: 700, fontSize: 13 }}>{step}</div>
              <div style={{ color: T.muted, fontSize: 12 }}>{detail}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Échelle */}
      <div style={{ color: C, fontFamily: 'monospace', fontSize: 11, letterSpacing: 2, marginBottom: 8 }}>SÉLECTIONNER LE SCORE OBSERVÉ</div>
      {LEVELS.map(lvl => (
        <div key={lvl.score} onClick={() => setSelected(lvl.score)} style={{
          ...s.card,
          marginBottom: 6,
          borderLeft: `4px solid ${lvl.color}`,
          background: selected === lvl.score ? lvl.color + '22' : T.surface,
          cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <div style={{
            width: 38, height: 38, borderRadius: 8,
            background: selected === lvl.score ? lvl.color : lvl.color + '22',
            border: `2px solid ${lvl.color}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: selected === lvl.score ? '#fff' : lvl.color,
            fontWeight: 700, fontSize: 16, flexShrink: 0,
          }}>
            {lvl.score > 0 ? '+' + lvl.score : lvl.score}
          </div>
          <div>
            <div style={{ color: selected === lvl.score ? lvl.color : T.text, fontWeight: 700, fontSize: 14 }}>{lvl.label}</div>
            <div style={{ color: T.muted, fontSize: 11, lineHeight: 1.4 }}>{lvl.desc}</div>
          </div>
        </div>
      ))}

      {/* Résultat */}
      {selected !== null && interp && (
        <div style={{ ...s.result(interp.color), animation: 'fadeIn 0.3s ease', marginTop: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
            <div style={{ width: 48, height: 48, borderRadius: 10, background: interp.color + '33', border: `2px solid ${interp.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: interp.color, fontWeight: 700, fontSize: 22 }}>
              {selected > 0 ? '+' + selected : selected}
            </div>
            <div>
              <div style={{ color: interp.color, fontWeight: 700, fontSize: 16 }}>RASS {selected > 0 ? '+' + selected : selected}</div>
              <div style={{ color: T.muted, fontSize: 12 }}>{LEVELS.find(l => l.score === selected)?.label}</div>
            </div>
          </div>
          <div style={{ color: interp.color, fontSize: 13 }}>{interp.text}</div>
          <div style={{ color: T.muted, fontSize: 11, marginTop: 8 }}>
            Objectif habituel en réa : RASS -2 à 0 · Protocole d'analgésie-sédation-délire (ASD)
          </div>
        </div>
      )}

      {/* Cibles communes */}
      <div style={{ ...s.card, marginTop: 14 }}>
        <div style={{ color: C, fontFamily: 'monospace', fontSize: 11, letterSpacing: 2, marginBottom: 10 }}>CIBLES USUELLES</div>
        {[
          ['Ventilation mécanique', 'RASS -2 à -1 (sédation légère)'],
          ['Syndrome de sevrage', 'RASS 0 à -1'],
          ['Procédure douloureuse', 'RASS 0 (éveillé, analgésie adaptée)'],
          ['SDRA sévère', 'RASS -3 à -5 selon protocole'],
          ['HTAI', 'Selon protocole neurochirurgical'],
        ].map(([ctx, cible]) => (
          <div key={ctx} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7, paddingBottom: 7, borderBottom: '1px solid #1e293b', alignItems: 'flex-start', gap: 10 }}>
            <span style={{ color: T.muted, fontSize: 12 }}>{ctx}</span>
            <span style={{ color: C, fontSize: 12, fontFamily: 'monospace', textAlign: 'right' }}>{cible}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

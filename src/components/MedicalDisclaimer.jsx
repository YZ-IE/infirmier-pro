/**
 * MedicalDisclaimer.jsx
 * Conformité MDR Intended Purpose / Déontologie infirmière / CSP R.4311
 * level="calcul"   → rouge, modules dose/opioïdes/pédiatrie
 * level="standard" → jaune, scores et protocoles
 */
export function MedicalDisclaimer({ level = 'standard' }) {
  if (level === 'calcul') return (
    <div style={{ background:'#1f0a0a', border:'1px solid #ef4444', borderRadius:8,
      padding:'10px 14px', marginBottom:14, display:'flex', gap:10, alignItems:'flex-start' }}>
      <span style={{ fontSize:15, flexShrink:0 }}>🚨</span>
      <span style={{ color:'#fca5a5', fontSize:12, lineHeight:1.6 }}>
        Outil de vérification — Tout résultat doit être confronté à la prescription médicale avant administration. En cas de doute, consulter le médecin ou le pharmacien.
      </span>
    </div>
  );
  return (
    <div style={{ background:'#1c1410', border:'1px solid #92400e', borderRadius:8,
      padding:'10px 14px', marginBottom:14, display:'flex', gap:10, alignItems:'flex-start' }}>
      <span style={{ fontSize:15, flexShrink:0 }}>⚠️</span>
      <span style={{ color:'#fcd34d', fontSize:12, lineHeight:1.6 }}>
        Outil d'aide à l'exercice professionnel — Ne se substitue pas au jugement clinique ni à la prescription médicale. Toujours vérifier avec les protocoles de l'établissement.
      </span>
    </div>
  );
}

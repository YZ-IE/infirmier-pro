/**
 * ClinicalSource.jsx — Affiche la source et date d'un contenu clinique.
 * Conformité MDR art. 10.
 */
import { CLINICAL_SOURCES } from '../clinicalVersion.js';

export function ClinicalSource({ sourceKey }) {
  const src = CLINICAL_SOURCES[sourceKey];
  if (!src) return null;
  return (
    <div style={{ borderTop:'1px solid #1e293b', marginTop:16, paddingTop:10,
      display:'flex', alignItems:'flex-start', gap:6 }}>
      <span style={{ fontSize:11, color:'#475569', flexShrink:0 }}>📚</span>
      <div>
        <div style={{ fontSize:10, color:'#475569', lineHeight:1.5 }}>
          {src.ref} · Rév. {src.updated}
        </div>
        {src.note && <div style={{ fontSize:10, color:'#f59e0b', marginTop:2 }}>⚠️ {src.note}</div>}
      </div>
    </div>
  );
}

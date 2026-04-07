import { useState } from 'react';
import { T, s } from '../../theme.js';
const C = T.orga;
const CINQ_B = [
  {b:'Bon médicament',icon:'💊',checks:['Nom DCI et spécialité vérifiés','Correspondance ordonnance ↔ médicament préparé']},
  {b:'Bonne dose',icon:'⚖️',checks:['Dose calculée et vérifiée','Unité correcte (mg, µg, UI, mEq)','Dilution conforme à la fiche technique']},
  {b:'Bonne voie',icon:'💉',checks:['Voie prescrite (IV, SC, IM, PO, inhalée…)','Compatibilité voie/médicament vérifiée']},
  {b:'Bon patient',icon:'👤',checks:['Identité vérifiée (nom + date naissance)','Bracelet d\'identification contrôlé','Allergies vérifiées']},
  {b:'Bon moment',icon:'⏰',checks:['Heure de la prescription respectée','Intervalle entre doses respecté','Jeûne requis respecté (si applicable)']},
];
export default function ChecklistMedoc() {
  const [checked,setChecked]=useState({});
  const toggle=(key)=>setChecked(p=>({...p,[key]:!p[key]}));
  const total=Object.values(checked).filter(Boolean).length;
  const max=CINQ_B.reduce((a,b)=>a+b.checks.length,0);
  return (
    <div style={{padding:'14px'}}>
      <div style={{...s.card,background:'#052e16'}}>
        <div style={{color:C,fontWeight:700,fontSize:15,marginBottom:4}}>Règle des 5B</div>
        <div style={{color:T.muted,fontSize:12}}>Vérification systématique avant toute administration médicamenteuse</div>
        <div style={{background:C+'33',borderRadius:8,padding:'8px 12px',marginTop:10,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <span style={{color:C,fontFamily:'monospace',fontSize:13}}>Progression</span>
          <span style={{color:C,fontFamily:'monospace',fontWeight:700}}>{total}/{max}</span>
        </div>
      </div>
      {CINQ_B.map((b,bi)=>(
        <div key={bi} style={{...s.card,borderLeft:`3px solid ${C}`}}>
          <div style={{display:'flex',gap:10,alignItems:'center',marginBottom:10}}>
            <span style={{fontSize:22}}>{b.icon}</span>
            <div style={{color:C,fontWeight:700,fontSize:15}}>{b.b}</div>
          </div>
          {b.checks.map((check,ci)=>{
            const key=`${bi}-${ci}`;
            return (
              <button key={ci} onClick={()=>toggle(key)} style={{display:'flex',alignItems:'center',gap:10,width:'100%',background:checked[key]?C+'18':T.bg,border:`1px solid ${checked[key]?C:T.border}`,borderRadius:7,padding:'9px 12px',marginBottom:6,cursor:'pointer',textAlign:'left'}}>
                <div style={{width:22,height:22,borderRadius:5,background:checked[key]?C:'transparent',border:`2px solid ${checked[key]?C:T.border}`,display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontSize:13,flexShrink:0}}>{checked[key]?'✓':''}</div>
                <span style={{color:checked[key]?C:T.text,fontSize:13}}>{check}</span>
              </button>
            );
          })}
        </div>
      ))}
      {total===max&&(
        <div style={{...s.result(C),textAlign:'center',animation:'fadeIn 0.3s'}}>
          <div style={{fontSize:32}}>✅</div>
          <div style={{color:C,fontSize:16,fontWeight:700}}>Toutes les vérifications effectuées</div>
          <div style={{color:T.muted,fontSize:12,marginTop:4}}>Administration sécurisée · Tracer dans le dossier</div>
        </div>
      )}
    </div>
  );
}

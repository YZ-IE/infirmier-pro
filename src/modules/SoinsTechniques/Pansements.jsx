import { useState } from 'react';
import { T, s } from '../../theme.js';
const C = T.soins;
const TYPES = [
  { id:'simple', label:'Plaie simple / Cicatrice', color:'#22c55e',
    steps:['Nettoyer avec sérum physiologique (haut en bas)','Sécher par tamponnement','Antisepsie si plaie souillée (Bétadine ou Chlorhexidine)','Pansement adapté : compresse + Mépilex® ou Tegaderm®','Surveillance : chaleur, rougeur, écoulement, odeur'] },
  { id:'escarre', label:'Escarre', color:'#f59e0b',
    extra:[
      {stade:'Stade I — Érythème',color:'#f59e0b',ttt:'Protection cutanée · Acide gras hyperoxygénés · Matelas anti-escarre'},
      {stade:'Stade II — Phlyctène / Peau ouverte',color:'#f97316',ttt:'Hydrocolloïde (Duoderm®) ou Hydrocellulaire · Changer /3-5j'},
      {stade:'Stade III — Plaie profonde',color:'#ef4444',ttt:'Nettoyage NaCl · Détersion si nécrose · Alginate ou Aquacel® · Avis IDE spécialisé'},
      {stade:'Stade IV — Atteinte osseuse',color:'#dc2626',ttt:'⚠️ Chirurgien + IDE spécialisé · VAC therapy · Antibiotiques si ostéite'},
    ] },
  { id:'vac', label:'Thérapie VAC (TPN)', color:'#8b5cf6',
    steps:['Vérifier prescription · Mesures de la plaie (longueur × largeur × profondeur)','Nettoyer la plaie au NaCl 0,9%','Découper la mousse aux dimensions exactes (ne pas laisser de contact peau saine)','Poser la mousse dans la cavité · Recouvrir de film adhésif transparent','Connecter le drain à la pompe VAC · Vérifier l\'étanchéité','Paramétrer la pression selon prescription (généralement -125 mmHg)','Changer le pansement toutes 48-72h (ou selon prescription)','Mesurer et photographier la plaie à chaque change'] },
  { id:'brulure', label:'Brûlure', color:'#f97316',
    steps:['Refroidir 15-20 min à l\'eau tiède 15°C (NE PAS glacer)','Évaluer : surface (règle des 9), profondeur, localisation','1er degré : crème hydratante · Pas de pansement','2e degré superficiel : Tulle gras + compresse absorbante','2e degré profond / 3e degré : Avis chirurgien brûlologue URGENT','Prévenir le choc : VVP + remplissage · Antalgiques','Ne jamais percer les phlyctènes · Ne pas appliquer de glace'] },
];
export default function Pansements() {
  const [type,setType]=useState('simple');
  const current=TYPES.find(t=>t.id===type);
  return (
    <div style={{padding:'14px'}}>
      <div style={{display:'flex',flexWrap:'wrap',gap:7,marginBottom:14}}>
        {TYPES.map(t=>(
          <button key={t.id} onClick={()=>setType(t.id)} style={{...s.btn(type===t.id?t.color:T.muted),background:type===t.id?t.color+'22':T.surface,borderColor:type===t.id?t.color:T.border,color:type===t.id?t.color:T.muted,fontSize:12,padding:'8px 12px'}}>{t.label}</button>
        ))}
      </div>
      {type==='escarre' ? (
        <div>
          {current.extra.map((e,i)=>(
            <div key={i} style={{...s.card,borderLeft:`3px solid ${e.color}`,marginBottom:10}}>
              <div style={{color:e.color,fontWeight:700,fontSize:14,marginBottom:8}}>{e.stade}</div>
              <div style={{color:T.text,fontSize:13,lineHeight:1.5}}>{e.ttt}</div>
            </div>
          ))}
          <div style={{...s.card}}>
            <div style={{color:C,fontFamily:'monospace',fontSize:11,marginBottom:8}}>PRINCIPE GÉNÉRAL</div>
            {['Détersion mécanique si nécrose (bistouri, curette)','Milieu humide = cicatrisation optimale','Changer selon l\'exsudat, pas de calendrier fixe','Tracer : dimensions, aspect, traitement','Signaler toute aggravation au médecin'].map((l,i)=><div key={i} style={{color:T.muted,fontSize:13,marginBottom:4}}>• {l}</div>)}
          </div>
        </div>
      ) : (
        <div style={s.card}>
          <div style={{color:current.color,fontFamily:'monospace',fontSize:11,letterSpacing:2,marginBottom:12}}>PROCÉDURE</div>
          {current.steps.map((step,i)=>(
            <div key={i} style={{display:'flex',gap:10,marginBottom:9}}>
              <div style={{background:current.color+'33',border:`1px solid ${current.color}`,borderRadius:'50%',width:24,height:24,display:'flex',alignItems:'center',justifyContent:'center',color:current.color,fontWeight:700,fontSize:11,flexShrink:0}}>{i+1}</div>
              <div style={{color:T.text,fontSize:13,lineHeight:1.4,paddingTop:2}}>{step}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

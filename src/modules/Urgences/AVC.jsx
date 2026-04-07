import { useState } from 'react';
import { T, s } from '../../theme.js';
const C = T.urg;

export default function AVC() {
  const [fast, setFast] = useState({F:null,A:null,S:null});
  const score = Object.values(fast).filter(v=>v===true).length;

  return (
    <div style={{padding:'14px'}}>
      <div style={{background:'#2e1065',border:'1px solid #8b5cf644',borderRadius:8,padding:'10px 14px',marginBottom:14}}>
        <div style={{color:'#a78bfa',fontWeight:700,fontSize:13}}>⏰ LE TEMPS C&apos;EST DU CERVEAU</div>
        <div style={{color:T.muted,fontSize:12,marginTop:3}}>2 millions de neurones meurent par minute · Objectif : thrombolyse &lt; 4h30</div>
      </div>

      {/* TEST FAST */}
      <div style={s.card}>
        <div style={{color:C,fontFamily:'monospace',fontSize:11,letterSpacing:2,marginBottom:12}}>TEST FAST — ÉVALUATION RAPIDE</div>
        {[
          {key:'F',letter:'F',title:'Face — Asymétrie faciale',desc:'Demander de sourire. Un côté tombe ?',oui:'Asymétrie présente',non:'Symétrique'},
          {key:'A',letter:'A',title:'Arms — Déficit moteur',desc:'Lever les 2 bras. L\'un chute ?',oui:'Chute d\'un bras',non:'Symétrique'},
          {key:'S',letter:'S',title:'Speech — Troubles du langage',desc:'Dire une phrase. Dysarthrie/Aphasie ?',oui:'Langage anormal',non:'Normal'},
        ].map(item=>(
          <div key={item.key} style={{marginBottom:12,paddingBottom:12,borderBottom:'1px solid #334155'}}>
            <div style={{display:'flex',gap:10,alignItems:'flex-start',marginBottom:8}}>
              <div style={{background:fast[item.key]===true?'#ef444433':fast[item.key]===false?'#22c55e33':'#334155',border:`1px solid ${fast[item.key]===true?'#ef4444':fast[item.key]===false?'#22c55e':'#475569'}`,borderRadius:8,width:36,height:36,display:'flex',alignItems:'center',justifyContent:'center',color:fast[item.key]===true?'#ef4444':fast[item.key]===false?'#22c55e':T.muted,fontWeight:700,fontSize:18,flexShrink:0}}>{item.letter}</div>
              <div><div style={{color:T.text,fontWeight:700,fontSize:14}}>{item.title}</div>
              <div style={{color:T.muted,fontSize:12}}>{item.desc}</div></div>
            </div>
            <div style={{display:'flex',gap:7}}>
              <button onClick={()=>setFast(p=>({...p,[item.key]:true}))} style={{...s.btn('#ef4444'),flex:1,background:fast[item.key]===true?'#ef444433':T.surface,borderColor:fast[item.key]===true?'#ef4444':T.border,color:fast[item.key]===true?'#ef4444':T.muted,fontSize:12}}>⚠️ {item.oui}</button>
              <button onClick={()=>setFast(p=>({...p,[item.key]:false}))} style={{...s.btn('#22c55e'),flex:1,background:fast[item.key]===false?'#22c55e33':T.surface,borderColor:fast[item.key]===false?'#22c55e':T.border,color:fast[item.key]===false?'#22c55e':T.muted,fontSize:12}}>✓ {item.non}</button>
            </div>
          </div>
        ))}
        {Object.values(fast).some(v=>v!==null) && (
          <div style={{background:score>0?'#450a0a':'#052e16',border:`1px solid ${score>0?'#ef4444':'#22c55e'}44`,borderRadius:8,padding:'12px',textAlign:'center',animation:'fadeIn 0.3s ease'}}>
            <div style={{color:score>0?'#ef4444':'#22c55e',fontSize:16,fontWeight:700}}>
              {score>0?'🚨 AVC PROBABLE — ALERTER EN URGENCE':'✓ Test FAST négatif'}
            </div>
            <div style={{color:T.muted,fontSize:12,marginTop:4}}>
              {score>0?'Appeler le 15 immédiatement · Préciser heure de début des symptômes':'Surveiller et réévaluer'}
            </div>
          </div>
        )}
      </div>

      {/* Conduite à tenir */}
      <div style={s.card}>
        <div style={{color:C,fontFamily:'monospace',fontSize:11,letterSpacing:2,marginBottom:10}}>CONDUITE À TENIR</div>
        {[
          ['1. ALERTER','Médecin + SAMU 15 · Préciser heure exacte de début · Ne pas donner à manger/boire'],
          ['2. SCOPE','FC · PA aux 2 bras · SpO₂ · Glycémie capillaire · ECG 12D'],
          ['3. VVP','G18 minimum · NaCl 0,9% · Prélèvements : NFS, coag, bilan hépatique, groupe'],
          ['4. NEURO','Glasgow · Pupilles · Déficit moteur · NIHSS si formé'],
          ['5. CI THROMBOLYSE','PA > 185/110 · Chirurgie < 14j · Anticoag · Glycémie < 0,5 ou > 4 g/L'],
          ['6. IMAGERIE','Scanner cérébral en urgence (< 25 min) · IRM si disponible'],
        ].map(([titre,contenu],i)=>(
          <div key={i} style={{marginBottom:10,paddingBottom:10,borderBottom:i<5?'1px solid #334155':'none'}}>
            <div style={{color:C,fontFamily:'monospace',fontSize:12,marginBottom:3}}>{titre}</div>
            <div style={{color:T.text,fontSize:13,lineHeight:1.5}}>{contenu}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

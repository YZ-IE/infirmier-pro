import { MedicalDisclaimer } from '../../components/MedicalDisclaimer.jsx';
import { useState } from 'react';
import { T, s } from '../../theme.js';
const C = T.score;
const SECTIONS = [
  { key:'orientation_temps', label:'Orientation temporelle', max:5,
    items:['Quelle année sommes-nous ?','Quelle saison ?','Quel mois ?','Quel jour de la semaine ?','Quelle date ?'] },
  { key:'orientation_lieu', label:'Orientation spatiale', max:5,
    items:['Dans quel pays ?','Dans quelle région ?','Dans quelle ville ?','Dans quel établissement ?','À quel étage ?'] },
  { key:'apprentissage', label:'Apprentissage (3 mots)', max:3,
    items:['Citron','Clé','Ballon'], note:'Dire les 3 mots clairement, 1 point par mot répété immédiatement' },
  { key:'attention', label:'Attention et calcul', max:5,
    items:['100-7=93','93-7=86','86-7=79','79-7=72','72-7=65'], note:'Ou épeler MONDE à l\'envers : E-D-N-O-M' },
  { key:'rappel', label:'Rappel différé (3 mots)', max:3,
    items:['Rappel Citron','Rappel Clé','Rappel Ballon'], note:'Les mêmes 3 mots qu\'à l\'apprentissage' },
  { key:'langage1', label:'Langage — Dénomination', max:2, items:['Montre cette montre','Nommez ce crayon'] },
  { key:'langage2', label:'Répétition', max:1, items:['"Pas de si, ni de et, ni de mais"'] },
  { key:'langage3', label:'Ordre en 3 étapes', max:3, items:['Prenez ce papier','Pliez-le en deux','Posez-le par terre'] },
  { key:'langage4', label:'Lecture et écriture', max:2, items:['Lire et exécuter : FERMEZ LES YEUX','Écrire une phrase spontanée'] },
  { key:'construction', label:'Construction visuo-spatiale', max:1, items:['Copier les 2 pentagones entrelacés'] },
];
const getColor = t => t>=24?'#22c55e':t>=18?'#f59e0b':'#ef4444';
const getLabel = t => t>=24?'Normal ou MCI léger':t>=18?'Démence légère à modérée':'Démence sévère';
export default function MMSE() {
  const [scores,setScores]=useState({});
  const [showNote,setShowNote]=useState({});
  const total=Object.values(scores).reduce((a,b)=>a+b,0);
  const done=Object.keys(scores).length===SECTIONS.length;
  return (
    <div style={{padding:'14px'}}>
      <MedicalDisclaimer level="standard" />
      <div style={{...s.card,background:'#1a1a2e'}}>
        <div style={{color:C,fontWeight:700,marginBottom:4}}>Mini Mental State Examination</div>
        <div style={{color:T.muted,fontSize:12}}>Score total : 30 points · Seuil pathologique : &lt; 24 (selon âge et niveau scolaire)</div>
      </div>
      {SECTIONS.map(sec=>(
        <div key={sec.key} style={s.card}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
            <div style={{color:C,fontFamily:'monospace',fontSize:12}}>{sec.label}</div>
            <span style={{color:C,fontFamily:'monospace',fontSize:13}}>/{sec.max}</span>
          </div>
          {sec.note&&<div style={{color:T.muted,fontSize:11,marginBottom:8,fontStyle:'italic'}}>{sec.note}</div>}
          <div style={{color:T.muted,fontSize:12,marginBottom:10}}>
            {sec.items.map((it,i)=><div key={i} style={{marginBottom:2}}>• {it}</div>)}
          </div>
          <div style={{display:'flex',gap:6}}>
            {Array.from({length:sec.max+1},(_,i)=>(
              <button key={i} onClick={()=>setScores(p=>({...p,[sec.key]:i}))}
                style={{flex:1,background:scores[sec.key]===i?C+'33':T.bg,border:`1.5px solid ${scores[sec.key]===i?C:T.border}`,borderRadius:7,padding:'7px 2px',cursor:'pointer',color:scores[sec.key]===i?C:T.muted,fontFamily:'monospace',fontSize:13,fontWeight:700}}>{i}</button>
            ))}
          </div>
        </div>
      ))}
      <div style={{...s.result(done?getColor(total):'#475569'),textAlign:'center'}}>
        <div style={{color:done?getColor(total):T.muted,fontSize:28,fontWeight:700}}>{done?`${total}/30`:'?/30'}</div>
        <div style={{color:done?getColor(total):T.muted,fontSize:15,fontWeight:600,marginTop:4}}>{done?getLabel(total):'Compléter'}</div>
        {done&&<div style={{color:T.muted,fontSize:12,marginTop:6}}>
          {total<24?'→ Évaluation gériatrique spécialisée recommandée':'→ Réévaluer si plaintes cognitives'}
        </div>}
      </div>
    </div>
  );
}

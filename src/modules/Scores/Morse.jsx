import { useState } from 'react';
import { T, s } from '../../theme.js';
const C = T.score;
const ITEMS = [
  { key:'atcd', label:'Antécédents de chutes (3 derniers mois)', opts:[{v:25,l:'Oui'},{v:0,l:'Non'}] },
  { key:'diag', label:'Diagnostic secondaire (≥ 2 maladies)', opts:[{v:15,l:'Oui'},{v:0,l:'Non'}] },
  { key:'aide', label:'Aide à la marche',
    opts:[{v:0,l:'Aucune / Alité / Aide soignant'},{v:15,l:'Béquilles / Canne / Cadre'},{v:30,l:'S\'appuie sur les meubles'}] },
  { key:'perf', label:'Perfusion IV / Héparine',
    opts:[{v:20,l:'Oui'},{v:0,l:'Non'}] },
  { key:'demarche', label:'Démarche / Transfert',
    opts:[{v:0,l:'Normale / Alité / Immobile'},{v:10,l:'Faible'},{v:20,l:'Altérée'}] },
  { key:'mental', label:'État mental',
    opts:[{v:0,l:'Orienté dans ses capacités'},{v:15,l:'Surestime ses capacités / Oublie ses limites'}] },
];
const getColor = t => t<25?'#22c55e':t<=50?'#f59e0b':'#ef4444';
const getRisk  = t => t<25?'Risque faible':t<=50?'Risque modéré':'Risque élevé';
export default function Morse() {
  const [sel,setSel]=useState({});
  const vals=Object.values(sel);
  const total=vals.reduce((a,b)=>a+b,0);
  const done=vals.length===ITEMS.length;
  return (
    <div style={{padding:'14px'}}>
      {ITEMS.map(item=>(
        <div key={item.key} style={s.card}>
          <div style={{color:C,fontFamily:'monospace',fontSize:12,marginBottom:10}}>{item.label}</div>
          {item.opts.map(opt=>(
            <button key={opt.v} onClick={()=>setSel(p=>({...p,[item.key]:opt.v}))}
              style={{display:'flex',justifyContent:'space-between',width:'100%',background:sel[item.key]===opt.v?C+'22':T.bg,border:`1px solid ${sel[item.key]===opt.v?C:T.border}`,borderRadius:7,padding:'8px 12px',marginBottom:5,cursor:'pointer',textAlign:'left'}}>
              <span style={{color:sel[item.key]===opt.v?C:T.text,fontSize:13}}>{opt.l}</span>
              <span style={{color:C,fontFamily:'monospace',fontWeight:700}}>{opt.v}</span>
            </button>
          ))}
        </div>
      ))}
      <div style={{...s.result(done?getColor(total):'#475569'),textAlign:'center'}}>
        <div style={{color:done?getColor(total):T.muted,fontSize:28,fontWeight:700}}>{done?total:'?'}</div>
        <div style={{color:done?getColor(total):T.muted,fontSize:15,fontWeight:600,marginTop:4}}>{done?getRisk(total):'Compléter'}</div>
      </div>
      {done&&(
        <div style={s.card}>
          <div style={{color:C,fontFamily:'monospace',fontSize:11,letterSpacing:2,marginBottom:8}}>MESURES PRÉVENTIVES</div>
          {total>=25&&[
            '🔔 Sonnette à portée de main','🛏 Lit en position basse','💡 Éclairage nocturne','🚻 Accès facilité aux toilettes',
            total>=51?'Bracelet de risque de chute':'',
            total>=51?'Surveillance rapprochee':''
          ].filter(Boolean).map((m,i)=><div key={i} style={{color:T.text,fontSize:13,marginBottom:4}}>• {m}</div>)}
          {total<25&&<div style={{color:T.muted,fontSize:13}}>Mesures standard · Informer le patient</div>}
        </div>
      )}
      <div style={{...s.card}}>
        <div style={{color:C,fontFamily:'monospace',fontSize:11,letterSpacing:2,marginBottom:8}}>SEUILS</div>
        {[['0-24','Risque faible — Soins standards'],['25-50','Risque modéré — Mesures préventives standards'],['≥ 51','Risque élevé — Protocole chute · Surveillance++']].map(([sc,act])=>(
          <div key={sc} style={{display:'flex',gap:10,marginBottom:5}}>
            <span style={{color:C,fontFamily:'monospace',fontSize:11,minWidth:50}}>{sc}</span>
            <span style={{color:T.muted,fontSize:12}}>{act}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

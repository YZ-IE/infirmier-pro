import { useState } from 'react';
import { T, s } from '../../theme.js';
const C = T.score;
const ITEMS = [
  { key:'perception', label:'Perception sensorielle',
    opts:[{v:1,l:'Totalement limitée'},{v:2,l:'Très limitée'},{v:3,l:'Légèrement limitée'},{v:4,l:'Aucune altération'}] },
  { key:'humidite', label:'Humidité cutanée',
    opts:[{v:1,l:'Constamment humide'},{v:2,l:'Très humide'},{v:3,l:'Parfois humide'},{v:4,l:'Rarement humide'}] },
  { key:'activite', label:'Activité',
    opts:[{v:1,l:'Alité'},{v:2,l:'Confiné au fauteuil'},{v:3,l:'Marche occasionnellement'},{v:4,l:'Marche fréquemment'}] },
  { key:'mobilite', label:'Mobilité',
    opts:[{v:1,l:'Complètement immobile'},{v:2,l:'Très limitée'},{v:3,l:'Légèrement limitée'},{v:4,l:'Aucune limitation'}] },
  { key:'nutrition', label:'Alimentation',
    opts:[{v:1,l:'Très pauvre'},{v:2,l:'Probablement inadéquate'},{v:3,l:'Adéquate'},{v:4,l:'Excellente'}] },
  { key:'friction', label:'Friction et cisaillement',
    opts:[{v:1,l:'Problème'},{v:2,l:'Problème potentiel'},{v:3,l:'Pas de problème apparent'}] },
];
const getColor = t => t>=19?'#22c55e':t>=15?'#f59e0b':t>=13?'#f97316':'#ef4444';
const getRisk  = t => t>=19?'Pas de risque':t>=15?'Risque faible':t>=13?'Risque modéré':'Risque élevé';
export default function Braden() {
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
        <div style={{color:done?getColor(total):T.muted,fontSize:28,fontWeight:700}}>{done?`${total}/23`:'?/23'}</div>
        <div style={{color:done?getColor(total):T.muted,fontSize:15,fontWeight:600,marginTop:4}}>{done?getRisk(total):'Compléter'}</div>
        {done&&total<=18&&<div style={{color:T.muted,fontSize:12,marginTop:6}}>→ Protocole prévention escarre · Matelas adapté · Repositionnement /2h</div>}
      </div>
    </div>
  );
}

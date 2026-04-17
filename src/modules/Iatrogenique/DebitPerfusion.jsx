import { MedicalDisclaimer } from '../../components/MedicalDisclaimer.jsx';
import { useState } from 'react';
import { T, s } from '../../theme.js';
const C = T.iatr;
const r2 = n => Math.round(n*100)/100;

export default function DebitPerfusion({ onBack }) {
  const [mode, setMode] = useState('vh'); // vh=volume/heure, gmin=gouttes/min, dur=durée
  const [v, setV] = useState({});
  const [res, setRes] = useState(null);
  const set = (k,val) => { setV(p=>({...p,[k]:val})); setRes(null); };

  const calc = () => {
    const vol = parseFloat(v.vol), dur = parseFloat(v.dur), debit = parseFloat(v.debit), fac = parseFloat(v.facteur)||20;
    if (mode==='vh') {
      if(!vol||!dur){setRes({err:'Remplissez volume et durée'});return;}
      const mlh = r2(vol/dur);
      const gmin = r2((mlh*fac)/60);
      setRes({ main:`${mlh} ml/h`, subs:[`${gmin} gouttes/min (facteur ${fac})`, `Durée : ${dur}h pour ${vol} ml`] });
    } else if (mode==='gmin') {
      if(!debit||!fac){setRes({err:'Remplissez tous les champs'});return;}
      const mlh = r2((debit*60)/fac);
      const mlmin = r2(mlh/60);
      setRes({ main:`${mlh} ml/h`, subs:[`${mlmin} ml/min`, `Facteur de goutte : ${fac}`] });
    } else {
      if(!vol||!debit){setRes({err:'Remplissez volume et débit'});return;}
      const h = r2(vol/debit);
      const hh = Math.floor(h), mm = Math.round((h-hh)*60);
      setRes({ main:`${hh}h${mm.toString().padStart(2,'0')}`, subs:[`${vol} ml à ${debit} ml/h`, `Fin estimée dans ${hh}h${mm>0?mm+'min':''}`] });
    }
  };

  return (
    <div style={{minHeight:'100vh',background:T.bg,paddingBottom:40}}>
      <MedicalDisclaimer level="calcul" />
      <div style={{background:T.iatrDim,borderBottom:`1px solid ${C}44`,padding:'14px 16px',display:'flex',alignItems:'center',gap:12,position:'sticky',top:0,zIndex:10}}>
        <button onClick={onBack} style={{background:'none',border:'none',color:C,fontSize:20,cursor:'pointer'}}>←</button>
        <div style={{color:T.text,fontWeight:700,fontSize:17}}>💧 Débit de perfusion</div>
      </div>
      <div style={{padding:'14px'}}>
        <div style={{display:'flex',gap:7,marginBottom:14}}>
          {[['vh','Calculer ml/h'],['gmin','Calculer gouttes/min'],['dur','Calculer durée']].map(([id,lbl])=>(
            <button key={id} onClick={()=>{setMode(id);setV({});setRes(null);}} style={{...s.btn(mode===id?C:T.muted),flex:1,fontSize:11,padding:'8px 6px',background:mode===id?C+'22':T.surface,borderColor:mode===id?C:T.border,color:mode===id?C:T.muted}}>{lbl}</button>
          ))}
        </div>
        <div style={s.card}>
          {(mode==='vh'||mode==='dur') && (
            <div style={{marginBottom:10}}>
              <label style={s.label}>VOLUME (ml)</label>
              <input type="number" value={v.vol||''} onChange={e=>set('vol',e.target.value)} placeholder="Ex : 500" style={s.input}/>
            </div>
          )}
          {(mode==='vh') && (
            <div style={{marginBottom:10}}>
              <label style={s.label}>DURÉE (heures)</label>
              <input type="number" step="0.5" value={v.dur||''} onChange={e=>set('dur',e.target.value)} placeholder="Ex : 8" style={s.input}/>
            </div>
          )}
          {(mode==='vh'||mode==='gmin') && (
            <div style={{marginBottom:10}}>
              <label style={s.label}>FACTEUR DE GOUTTE (gouttes/ml)</label>
              <div style={{display:'flex',gap:7}}>
                {[10,15,20,60].map(f=>(
                  <button key={f} onClick={()=>set('facteur',f)} style={{...s.btn(v.facteur===f||(!v.facteur&&f===20)?C:T.muted),flex:1,padding:'8px 4px',fontSize:12,background:(v.facteur===f||(!v.facteur&&f===20))?C+'22':T.surface,borderColor:(v.facteur===f||(!v.facteur&&f===20))?C:T.border,color:(v.facteur===f||(!v.facteur&&f===20))?C:T.muted}}>{f}</button>
                ))}
              </div>
              <div style={{color:T.muted,fontSize:11,marginTop:5}}>Standard=20 · Microgoutteur=60 · Sang=10 ou 15</div>
            </div>
          )}
          {(mode==='gmin') && (
            <div style={{marginBottom:10}}>
              <label style={s.label}>DÉBIT EN GOUTTES/MIN</label>
              <input type="number" value={v.debit||''} onChange={e=>set('debit',e.target.value)} placeholder="Ex : 30" style={s.input}/>
            </div>
          )}
          {(mode==='dur') && (
            <div style={{marginBottom:10}}>
              <label style={s.label}>DÉBIT (ml/h)</label>
              <input type="number" value={v.debit||''} onChange={e=>set('debit',e.target.value)} placeholder="Ex : 100" style={s.input}/>
            </div>
          )}
          <button onClick={calc} style={{...s.btn(C),width:'100%',marginTop:4,padding:'12px'}}>CALCULER</button>
          {res?.err && <div style={{color:'#f87171',fontSize:13,marginTop:10,padding:'8px 12px',background:'#450a0a',borderRadius:7}}>⚠️ {res.err}</div>}
          {res && !res.err && (
            <div style={{...s.result(C),animation:'fadeIn 0.3s ease'}}>
              <div style={{color:C,fontSize:22,fontWeight:700,marginBottom:8}}>{res.main}</div>
              {res.subs.map((d,i)=><div key={i} style={{color:T.muted,fontSize:13,fontFamily:'monospace',marginBottom:3}}>{d}</div>)}
            </div>
          )}
        </div>
        {/* Table de référence */}
        <div style={s.card}>
          <div style={{color:C,fontFamily:'monospace',fontSize:11,letterSpacing:2,marginBottom:10}}>TABLE RAPIDE — FACTEUR 20</div>
          <div style={{overflowX:'auto'}}>
            <table style={{width:'100%',borderCollapse:'collapse',fontSize:12}}>
              <thead>
                <tr>{['ml/h','gouttes/min','500ml en','1000ml en'].map(h=><th key={h} style={{color:T.muted,fontFamily:'monospace',fontSize:10,padding:'6px 8px',textAlign:'left',borderBottom:'1px solid #334155'}}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {[[50,'17','10h','20h'],[100,'33','5h','10h'],[125,'42','4h','8h'],[150,'50','3h20','6h40'],[200,'67','2h30','5h'],[250,'83','2h','4h']].map(([mlh,gmin,d500,d1000])=>(
                  <tr key={mlh}>
                    {[mlh,gmin,d500,d1000].map((v,i)=><td key={i} style={{color:i===0?C:T.text,fontFamily:'monospace',padding:'6px 8px',borderBottom:'1px solid #1e293b'}}>{v}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

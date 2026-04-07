import { useState } from 'react';
import { T, s } from '../../theme.js';
const C = T.iatr;
const r2 = n => Math.round(n*100)/100;
const r3 = n => Math.round(n*1000)/1000;

const MEDOCS_SAP = [
  { name:'Morphine', std:'1 mg/ml', prep:'50 mg dans 50 ml NaCl 0,9%', unit:'mg/h', tipMin:0.5, tipMax:10 },
  { name:'Noradrénaline', std:'0,1 mg/ml', prep:'5 mg dans 50 ml G5% ou NaCl', unit:'mg/h', tipMin:0.01, tipMax:2 },
  { name:'Adrénaline', std:'0,1 mg/ml', prep:'5 mg dans 50 ml NaCl 0,9%', unit:'mg/h', tipMin:0.01, tipMax:1 },
  { name:'Amiodarone', std:'6 mg/ml', prep:'300 mg dans 50 ml G5%', unit:'mg/h', tipMin:30, tipMax:150 },
  { name:'Héparine', std:'1000 UI/ml', prep:'25000 UI dans 25 ml NaCl', unit:'UI/h', tipMin:500, tipMax:2500 },
  { name:'Insuline', std:'1 UI/ml', prep:'50 UI dans 50 ml NaCl 0,9%', unit:'UI/h', tipMin:1, tipMax:10 },
  { name:'Dopamine', std:'3,2 mg/ml', prep:'160 mg dans 50 ml NaCl', unit:'µg/kg/min', tipMin:2, tipMax:20 },
  { name:'Dobutamine', std:'4 mg/ml', prep:'200 mg dans 50 ml NaCl', unit:'µg/kg/min', tipMin:2, tipMax:20 },
  { name:'Midazolam', std:'1 mg/ml', prep:'50 mg dans 50 ml NaCl', unit:'mg/h', tipMin:1, tipMax:10 },
  { name:'Propofol', std:'10 mg/ml', prep:'Prêt à l\'emploi', unit:'mg/kg/h', tipMin:0.5, tipMax:4 },
  { name:'Furosémide', std:'2 mg/ml', prep:'100 mg dans 50 ml NaCl', unit:'mg/h', tipMin:5, tipMax:40 },
  { name:'Ketamine', std:'1 mg/ml', prep:'50 mg dans 50 ml NaCl', unit:'mg/kg/h', tipMin:0.1, tipMax:0.5 },
];

export default function SeringueSAP({ onBack }) {
  const [tab, setTab] = useState('calc'); // calc | fiches
  const [drug, setDrug] = useState('');
  const [v, setV] = useState({});
  const [res, setRes] = useState(null);
  const set = (k,val) => { setV(p=>({...p,[k]:val})); setRes(null); };

  const calc = () => {
    const masse = parseFloat(v.masse), vol = parseFloat(v.vol), conc = parseFloat(v.conc), debit = parseFloat(v.debit), dur = parseFloat(v.dur);
    if (!masse || !vol) { setRes({err:'Remplissez masse médicament et volume'}); return; }
    const concentration = r3(masse / vol);
    let results = [`Concentration : ${concentration} mg/ml`];
    if (debit) {
      const debitMlH = r2(debit / concentration);
      const duree = v.durTotal ? r2(vol / debitMlH) : null;
      results.push(`Pour ${debit} mg/h → débit : ${debitMlH} ml/h`);
      if (duree) results.push(`Durée totale de la seringue : ${Math.floor(duree)}h${Math.round((duree%1)*60)}min`);
    }
    if (dur) {
      const debitCalc = r2(vol / dur);
      const doseH = r2(debitCalc * concentration);
      results.push(`Sur ${dur}h → débit : ${debitCalc} ml/h (${doseH} mg/h)`);
    }
    setRes({ main:`Concentration : ${concentration} mg/ml`, details: results.slice(1) });
  };

  const selectedDrug = MEDOCS_SAP.find(m => m.name === drug);

  return (
    <div style={{minHeight:'100vh',background:T.bg,paddingBottom:40}}>
      <div style={{background:T.iatrDim,borderBottom:`1px solid ${C}44`,padding:'14px 16px',display:'flex',alignItems:'center',gap:12,position:'sticky',top:0,zIndex:10}}>
        <button onClick={onBack} style={{background:'none',border:'none',color:C,fontSize:20,cursor:'pointer'}}>←</button>
        <div style={{color:T.text,fontWeight:700,fontSize:17}}>⏱ Seringue auto-pousseuse</div>
      </div>
      <div style={{padding:'14px'}}>
        <div style={{display:'flex',gap:7,marginBottom:14}}>
          {[['calc','Calculateur'],['fiches','Fiches standards']].map(([id,lbl])=>(
            <button key={id} onClick={()=>setTab(id)} style={{...s.btn(tab===id?C:T.muted),flex:1,background:tab===id?C+'22':T.surface,borderColor:tab===id?C:T.border,color:tab===id?C:T.muted}}>{lbl}</button>
          ))}
        </div>

        {tab==='calc' && (
          <div style={s.card}>
            <div style={{marginBottom:10}}>
              <label style={s.label}>MÉDICAMENT (sélection rapide)</label>
              <select value={drug} onChange={e=>{setDrug(e.target.value);setV({});setRes(null);}} style={{...s.input,background:T.bg}}>
                <option value="">-- Choisir ou saisir manuellement --</option>
                {MEDOCS_SAP.map(m=><option key={m.name} value={m.name}>{m.name} — {m.std}</option>)}
              </select>
            </div>
            {selectedDrug && (
              <div style={{background:C+'11',border:`1px solid ${C}33`,borderRadius:7,padding:'8px 12px',marginBottom:12,fontSize:12,color:T.muted}}>
                📋 Prépa standard : {selectedDrug.prep}<br/>
                Plage usuelle : {selectedDrug.tipMin}–{selectedDrug.tipMax} {selectedDrug.unit}
              </div>
            )}
            <div style={{marginBottom:10}}>
              <label style={s.label}>MASSE DE MÉDICAMENT (mg)</label>
              <input type="number" value={v.masse||''} onChange={e=>set('masse',e.target.value)} placeholder="Ex : 50" style={s.input}/>
            </div>
            <div style={{marginBottom:10}}>
              <label style={s.label}>VOLUME TOTAL DE LA SERINGUE (ml)</label>
              <div style={{display:'flex',gap:7,marginBottom:6}}>
                {[20,50,60].map(vol=>(
                  <button key={vol} onClick={()=>set('vol',vol)} style={{...s.btn(v.vol===vol?C:T.muted),flex:1,background:v.vol===vol?C+'22':T.surface,borderColor:v.vol===vol?C:T.border,color:v.vol===vol?C:T.muted}}>{vol} ml</button>
                ))}
              </div>
              <input type="number" value={v.vol||''} onChange={e=>set('vol',e.target.value)} placeholder="Ou saisir volume" style={s.input}/>
            </div>
            <div style={{marginBottom:10}}>
              <label style={s.label}>DOSE SOUHAITÉE (mg/h) — optionnel</label>
              <input type="number" step="0.1" value={v.debit||''} onChange={e=>set('debit',e.target.value)} placeholder="Ex : 2" style={s.input}/>
            </div>
            <div style={{marginBottom:10}}>
              <label style={s.label}>DURÉE SOUHAITÉE (h) — optionnel</label>
              <input type="number" step="0.5" value={v.dur||''} onChange={e=>set('dur',e.target.value)} placeholder="Ex : 12" style={s.input}/>
            </div>
            <button onClick={calc} style={{...s.btn(C),width:'100%',padding:'12px'}}>CALCULER</button>
            {res?.err && <div style={{color:'#f87171',fontSize:13,marginTop:10,padding:'8px 12px',background:'#450a0a',borderRadius:7}}>⚠️ {res.err}</div>}
            {res && !res.err && (
              <div style={{...s.result(C),animation:'fadeIn 0.3s ease'}}>
                <div style={{color:C,fontSize:20,fontWeight:700,marginBottom:8}}>{res.main}</div>
                {res.details.map((d,i)=><div key={i} style={{color:T.muted,fontSize:13,fontFamily:'monospace',marginBottom:4}}>{d}</div>)}
              </div>
            )}
          </div>
        )}

        {tab==='fiches' && (
          <div>
            {MEDOCS_SAP.map(m=>(
              <div key={m.name} style={s.card}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:8}}>
                  <div style={{color:C,fontWeight:700,fontSize:15}}>{m.name}</div>
                  <span style={s.tag(C)}>{m.std}</span>
                </div>
                <div style={{color:T.muted,fontSize:13,marginBottom:4}}>📋 {m.prep}</div>
                <div style={{color:T.text,fontSize:12}}>Plage : <span style={{color:C,fontFamily:'monospace'}}>{m.tipMin}–{m.tipMax} {m.unit}</span></div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

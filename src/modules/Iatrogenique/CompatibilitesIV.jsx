import { useState } from 'react';
import { T, s } from '../../theme.js';
const C = T.iatr;

// Matrice de compatibilité en Y : C=Compatible, I=Incompatible, V=Variable/À vérifier
const DRUGS = ['NaCl 0,9%','G5%','Morphine','Midazolam','Noradrénaline','Amiodarone','Furosémide','Héparine','Potassium','Vancomycine'];
const COMPAT = {
  'Morphine+Midazolam':'C','Morphine+Noradrénaline':'C','Morphine+Amiodarone':'I',
  'Morphine+Furosémide':'I','Morphine+Héparine':'C','Morphine+Potassium':'C',
  'Morphine+Vancomycine':'C','Midazolam+Noradrénaline':'C','Midazolam+Amiodarone':'I',
  'Midazolam+Furosémide':'I','Midazolam+Héparine':'C','Midazolam+Potassium':'C',
  'Noradrénaline+Amiodarone':'V','Noradrénaline+Furosémide':'I','Noradrénaline+Héparine':'C',
  'Noradrénaline+Potassium':'C','Noradrénaline+Vancomycine':'C',
  'Amiodarone+Furosémide':'I','Amiodarone+Héparine':'I','Amiodarone+Potassium':'I',
  'Furosémide+Héparine':'C','Furosémide+Potassium':'I','Furosémide+Vancomycine':'I',
  'Héparine+Potassium':'C','Héparine+Vancomycine':'I','Potassium+Vancomycine':'C',
};
const COL = {C:'#22c55e',I:'#ef4444',V:'#f59e0b'};
const LAB = {C:'✓ Compatible',I:'✗ Incompatible',V:'⚠ Variable'};

function getCompat(a, b) {
  if(a===b) return null;
  return COMPAT[`${a}+${b}`] || COMPAT[`${b}+${a}`] || null;
}

export default function CompatibilitesIV({ onBack }) {
  const [tab, setTab] = useState('check');
  const [d1, setD1] = useState('');
  const [d2, setD2] = useState('');

  const res = d1 && d2 && d1!==d2 ? getCompat(d1,d2) : null;

  const PAIRS_CRIT = [
    {a:'Amiodarone',b:'Héparine',stat:'I',note:'Précipitation immédiate. Rincer la voie entre les deux.'},
    {a:'Furosémide',b:'Noradrénaline',stat:'I',note:'Incompatibles. Voies séparées obligatoires.'},
    {a:'Furosémide',b:'Vancomycine',stat:'I',note:'Précipitation. Ne jamais mélanger.'},
    {a:'Morphine',b:'Amiodarone',stat:'I',note:'Incompatibles. Voies séparées.'},
    {a:'Héparine',b:'Vancomycine',stat:'I',note:'Précipitation. Rincer abondamment.'},
    {a:'Furosémide',b:'Potassium',stat:'I',note:'Risque de précipitation.'},
    {a:'Noradrénaline',b:'Amiodarone',stat:'V',note:'Variable selon concentration. Surveiller trouble.'},
    {a:'Morphine',b:'Midazolam',stat:'C',note:'Compatible en Y. Association fréquente en soins continus.'},
    {a:'Morphine',b:'Héparine',stat:'C',note:'Compatible. Surveillance recommandée.'},
    {a:'Potassium',b:'NaCl 0,9%',stat:'C',note:'Compatible. Concentration max 40 mEq/L en périphérique.'},
  ];

  return (
    <div style={{minHeight:'100vh',background:T.bg,paddingBottom:40}}>
      <div style={{background:T.iatrDim,borderBottom:`1px solid ${C}44`,padding:'14px 16px',display:'flex',alignItems:'center',gap:12,position:'sticky',top:0,zIndex:10}}>
        <button onClick={onBack} style={{background:'none',border:'none',color:C,fontSize:20,cursor:'pointer'}}>←</button>
        <div style={{color:T.text,fontWeight:700,fontSize:17}}>🔗 Compatibilités IV en Y</div>
      </div>
      <div style={{padding:'14px'}}>
        <div style={{display:'flex',gap:7,marginBottom:14}}>
          {[['check','Vérifier 2 produits'],['crit','Associations critiques']].map(([id,lbl])=>(
            <button key={id} onClick={()=>setTab(id)} style={{...s.btn(tab===id?C:T.muted),flex:1,background:tab===id?C+'22':T.surface,borderColor:tab===id?C:T.border,color:tab===id?C:T.muted}}>{lbl}</button>
          ))}
        </div>

        {tab==='check' && (
          <div style={s.card}>
            <div style={{marginBottom:10}}>
              <label style={s.label}>PRODUIT 1</label>
              <select value={d1} onChange={e=>setD1(e.target.value)} style={{...s.input,background:T.bg}}>
                <option value="">-- Choisir --</option>
                {DRUGS.map(d=><option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div style={{marginBottom:14}}>
              <label style={s.label}>PRODUIT 2</label>
              <select value={d2} onChange={e=>setD2(e.target.value)} style={{...s.input,background:T.bg}}>
                <option value="">-- Choisir --</option>
                {DRUGS.filter(d=>d!==d1).map(d=><option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            {res ? (
              <div style={{background:COL[res]+'18',border:`1px solid ${COL[res]}44`,borderRadius:10,padding:'16px',textAlign:'center',animation:'fadeIn 0.3s ease'}}>
                <div style={{fontSize:32,marginBottom:8}}>{res==='C'?'✅':res==='I'?'❌':'⚠️'}</div>
                <div style={{color:COL[res],fontSize:18,fontWeight:700}}>{LAB[res]}</div>
                <div style={{color:T.muted,fontSize:13,marginTop:6}}>{d1} + {d2}</div>
                {res==='V' && <div style={{color:T.yellow,fontSize:12,marginTop:8}}>Vérifier avec le pharmacien selon les concentrations</div>}
              </div>
            ) : d1 && d2 ? (
              <div style={{background:'#1e293b',border:'1px solid #334155',borderRadius:8,padding:'12px',textAlign:'center',color:T.muted,fontSize:13}}>
                Données non disponibles — consulter le pharmacien
              </div>
            ) : (
              <div style={{textAlign:'center',color:T.muted,fontSize:13,padding:'20px'}}>Sélectionner deux produits</div>
            )}
          </div>
        )}

        {tab==='crit' && (
          <div>
            {PAIRS_CRIT.map((p,i)=>(
              <div key={i} style={{background:COL[p.stat]+'11',border:`1px solid ${COL[p.stat]}33`,borderLeft:`3px solid ${COL[p.stat]}`,borderRadius:8,padding:'12px',marginBottom:10}}>
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:5}}>
                  <span style={{color:T.text,fontWeight:700,fontSize:13}}>{p.a} + {p.b}</span>
                  <span style={{color:COL[p.stat],fontSize:11,fontFamily:'monospace'}}>{LAB[p.stat]}</span>
                </div>
                <div style={{color:T.muted,fontSize:12,lineHeight:1.5}}>{p.note}</div>
              </div>
            ))}
            <div style={{background:'#1e293b',border:'1px solid #334155',borderRadius:8,padding:'12px',marginTop:6}}>
              <div style={{color:T.muted,fontSize:11,fontFamily:'monospace',lineHeight:1.6}}>
                ℹ️ Cette liste est non exhaustive. En cas de doute, consulter le pharmacien ou la base Thériaque. Rincer systématiquement la voie entre deux médicaments incompatibles.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

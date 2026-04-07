import { useState } from 'react';
import { T, s } from '../../theme.js';
const C = T.iatr;

const DB = [
  {a:'Warfarine',b:'AINS',niv:'CI',msg:'Majoration du risque hémorragique. Association contre-indiquée.'},
  {a:'Warfarine',b:'Amiodarone',niv:'MAJEUR',msg:'Augmentation de l\'effet anticoagulant. Surveillance INR rapprochée.'},
  {a:'Warfarine',b:'Fluconazole',niv:'MAJEUR',msg:'Inhibition du métabolisme de la warfarine. Risque hémorragique.'},
  {a:'IMAO',b:'Tramadol',niv:'CI',msg:'Risque de syndrome sérotoninergique grave. Contre-indication absolue.'},
  {a:'IMAO',b:'Morphine',niv:'CI',msg:'Interaction sérotoninergique sévère. Contre-indication.'},
  {a:'Metformine',b:'Produit de contraste iodé',niv:'CI',msg:'Arrêt 48h avant injection. Risque d\'acidose lactique.'},
  {a:'Metformine',b:'Alcool',niv:'MAJEUR',msg:'Risque d\'acidose lactique. Éviter la consommation d\'alcool.'},
  {a:'Digoxine',b:'Amiodarone',niv:'MAJEUR',msg:'Augmentation de la digoxinémie. Risque de surdosage.'},
  {a:'Digoxine',b:'Hypokaliémie',niv:'MAJEUR',msg:'L\'hypokaliémie potentialise la toxicité de la digoxine.'},
  {a:'AINS',b:'IEC',niv:'MODÉRÉ',msg:'Réduction de l\'effet antihypertenseur. Risque rénal.'},
  {a:'AINS',b:'Diurétiques',niv:'MODÉRÉ',msg:'Réduction de l\'effet diurétique. Risque rénal.'},
  {a:'Morphine',b:'Benzodiazépines',niv:'MAJEUR',msg:'Dépression respiratoire additive. Risque vital. Surveillance++.'},
  {a:'Morphine',b:'Alcool',niv:'CI',msg:'Potentialisation de la dépression du SNC. Contre-indiqué.'},
  {a:'Héparine',b:'AINS',niv:'MAJEUR',msg:'Majoration du risque hémorragique.'},
  {a:'Amiodarone',b:'Simvastatine',niv:'MAJEUR',msg:'Risque de myopathie et rhabdomyolyse. Réduire dose statine.'},
  {a:'Clopidogrel',b:'IPP (oméprazole)',niv:'MODÉRÉ',msg:'Réduction de l\'effet antiplaquettaire. Préférer pantoprazole.'},
  {a:'Furosémide',b:'Aminoglycosides',niv:'MAJEUR',msg:'Risque ototoxique et néphrotoxique additif.'},
  {a:'Lithium',b:'AINS',niv:'MAJEUR',msg:'Augmentation de la lithiémie. Risque de toxicité.'},
  {a:'Lithium',b:'IEC',niv:'MAJEUR',msg:'Augmentation de la lithiémie. Surveillance rapprochée.'},
  {a:'Ciprofloxacine',b:'Antiacides',niv:'MODÉRÉ',msg:'Réduction de l\'absorption. Espacer de 2h.'},
  {a:'Tramadol',b:'Antidépresseurs ISRS',niv:'MAJEUR',msg:'Risque de syndrome sérotoninergique.'},
  {a:'Potassium IV',b:'Diurétiques épargneurs K+',niv:'MAJEUR',msg:'Risque d\'hyperkaliémie potentiellement fatal.'},
  {a:'Insuline',b:'Bêta-bloquants',niv:'MODÉRÉ',msg:'Masquage des signes d\'hypoglycémie. Surveiller glycémie.'},
  {a:'Acenocoumarol',b:'Paracétamol',niv:'MODÉRÉ',msg:'Augmentation effet anticoagulant si dose > 2g/j.'},
  {a:'Hydroxyzine',b:'Alcool',niv:'MAJEUR',msg:'Potentialisation de la sédation. Éviter.'},
];

const NIVEAUX = {CI:'#dc2626',MAJEUR:'#f97316',MODÉRÉ:'#eab308',FAIBLE:'#22c55e'};

export default function Interactions({ onBack }) {
  const [drug1, setDrug1] = useState('');
  const [drug2, setDrug2] = useState('');
  const [results, setResults] = useState(null);
  const [tab, setTab] = useState('check');

  const check = () => {
    if (!drug1.trim()) { setResults([]); return; }
    const d1 = drug1.trim().toLowerCase();
    const d2 = drug2.trim().toLowerCase();
    const found = DB.filter(i =>
      (i.a.toLowerCase().includes(d1) || i.b.toLowerCase().includes(d1)) &&
      (!d2 || i.a.toLowerCase().includes(d2) || i.b.toLowerCase().includes(d2))
    );
    setResults(found);
  };

  return (
    <div style={{minHeight:'100vh',background:T.bg,paddingBottom:40}}>
      <div style={{background:T.iatrDim,borderBottom:`1px solid ${C}44`,padding:'14px 16px',display:'flex',alignItems:'center',gap:12,position:'sticky',top:0,zIndex:10}}>
        <button onClick={onBack} style={{background:'none',border:'none',color:C,fontSize:20,cursor:'pointer'}}>←</button>
        <div style={{color:T.text,fontWeight:700,fontSize:17}}>⚠️ Interactions médicamenteuses</div>
      </div>
      <div style={{padding:'14px'}}>
        <div style={{display:'flex',gap:7,marginBottom:14}}>
          {[['check','Vérifier'],['all','Base complète']].map(([id,lbl])=>(
            <button key={id} onClick={()=>setTab(id)} style={{...s.btn(tab===id?C:T.muted),flex:1,background:tab===id?C+'22':T.surface,borderColor:tab===id?C:T.border,color:tab===id?C:T.muted}}>{lbl}</button>
          ))}
        </div>

        {tab==='check' && (
          <div style={s.card}>
            <div style={{marginBottom:10}}>
              <label style={s.label}>MÉDICAMENT 1</label>
              <input value={drug1} onChange={e=>{setDrug1(e.target.value);setResults(null);}} onKeyDown={e=>e.key==='Enter'&&check()} placeholder="Ex : Warfarine" style={s.input}/>
            </div>
            <div style={{marginBottom:12}}>
              <label style={s.label}>MÉDICAMENT 2 — optionnel</label>
              <input value={drug2} onChange={e=>{setDrug2(e.target.value);setResults(null);}} onKeyDown={e=>e.key==='Enter'&&check()} placeholder="Ex : Amiodarone" style={s.input}/>
            </div>
            <button onClick={check} style={{...s.btn(C),width:'100%',padding:'12px'}}>VÉRIFIER</button>
            {results !== null && (
              <div style={{marginTop:14,animation:'fadeIn 0.3s ease'}}>
                {results.length === 0 ? (
                  <div style={{...s.result('#22c55e'),textAlign:'center'}}>
                    <div style={{color:'#22c55e',fontSize:16,fontWeight:700}}>✓ Aucune interaction connue</div>
                    <div style={{color:T.muted,fontSize:12,marginTop:4}}>Dans notre base de données</div>
                  </div>
                ) : results.map((r,i) => (
                  <div key={i} style={{background:NIVEAUX[r.niv]+'18',border:`1px solid ${NIVEAUX[r.niv]}44`,borderLeft:`3px solid ${NIVEAUX[r.niv]}`,borderRadius:8,padding:'12px',marginBottom:10}}>
                    <div style={{display:'flex',justifyContent:'space-between',marginBottom:6}}>
                      <span style={{color:T.text,fontWeight:700,fontSize:13}}>{r.a} + {r.b}</span>
                      <span style={{background:NIVEAUX[r.niv]+'33',color:NIVEAUX[r.niv],fontSize:10,fontFamily:'monospace',padding:'2px 8px',borderRadius:10}}>{r.niv}</span>
                    </div>
                    <div style={{color:T.muted,fontSize:13,lineHeight:1.5}}>{r.msg}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab==='all' && (
          <div>
            {Object.entries(NIVEAUX).map(([niv,col])=>(
              <div key={niv} style={{marginBottom:4}}>
                <div style={{color:col,fontFamily:'monospace',fontSize:11,letterSpacing:2,margin:'14px 0 8px'}}>{niv === 'CI' ? '🚫 CONTRE-INDICATION' : niv === 'MAJEUR' ? '🔴 INTERACTION MAJEURE' : niv === 'MODÉRÉ' ? '🟡 MODÉRÉE' : '🟢 FAIBLE'}</div>
                {DB.filter(r=>r.niv===niv).map((r,i)=>(
                  <div key={i} style={{background:col+'11',border:`1px solid ${col}22`,borderLeft:`2px solid ${col}`,borderRadius:7,padding:'10px 12px',marginBottom:8}}>
                    <div style={{color:T.text,fontWeight:600,fontSize:13,marginBottom:4}}>{r.a} ↔ {r.b}</div>
                    <div style={{color:T.muted,fontSize:12,lineHeight:1.5}}>{r.msg}</div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

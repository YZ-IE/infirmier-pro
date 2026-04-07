import { useState } from 'react';
import { T, s } from '../../theme.js';
const C = T.iatr;

const ANTIBIOS = [
  { name:'Amoxicilline 1g', dilu:'10 ml eau PPI', conc:'100 mg/ml', admin:'IVL 30 min', compat:'NaCl 0,9% · G5%', stable:'Utiliser immédiatement', note:'Ne pas mélanger avec aminoglycosides' },
  { name:'Amoxicilline-Acide clavulanique 1g', dilu:'20 ml eau PPI', conc:'50 mg/ml', admin:'IVL 30 min', compat:'NaCl 0,9%', stable:'1h à température ambiante', note:'Incompatible avec G5%' },
  { name:'Pipéracilline-Tazobactam 4g', dilu:'20 ml eau PPI puis 250 ml NaCl', conc:'16 mg/ml', admin:'IVL 30 min', compat:'NaCl 0,9% · G5%', stable:'12h réfrigérateur', note:'Voie dédiée recommandée' },
  { name:'Céfazoline 1g', dilu:'10 ml eau PPI', conc:'100 mg/ml', admin:'IVL 15-30 min', compat:'NaCl 0,9% · G5%', stable:'24h réfrigérateur', note:'' },
  { name:'Céftriaxone 1g', dilu:'10 ml eau PPI', conc:'100 mg/ml', admin:'IVL 30 min', compat:'NaCl 0,9%', stable:'6h température ambiante', note:'Incompatible avec calcium IV' },
  { name:'Céftriaxone 2g', dilu:'20 ml eau PPI', conc:'100 mg/ml', admin:'IVL 30 min', compat:'NaCl 0,9%', stable:'6h température ambiante', note:'Incompatible avec calcium IV' },
  { name:'Céfotaxime 1g', dilu:'10 ml eau PPI', conc:'100 mg/ml', admin:'IVL 20 min', compat:'NaCl 0,9% · G5%', stable:'24h réfrigérateur', note:'' },
  { name:'Méropénème 1g', dilu:'20 ml eau PPI', conc:'50 mg/ml', admin:'IVL 15-30 min', compat:'NaCl 0,9%', stable:'3h température ambiante', note:'Stabilité courte - préparer extemporanément' },
  { name:'Imipénème 500mg', dilu:'100 ml NaCl 0,9%', conc:'5 mg/ml', admin:'IVL 30-60 min', compat:'NaCl 0,9%', stable:'4h température ambiante', note:'Ne pas dépasser 5 mg/ml' },
  { name:'Vancomycine 500mg', dilu:'10 ml eau PPI puis 100-250 ml', conc:'2-5 mg/ml', admin:'IVL ≥ 60 min', compat:'NaCl 0,9% · G5%', stable:'24h réfrigérateur', note:'⚠️ Perfusion lente - RED MAN syndrome si trop rapide' },
  { name:'Gentamycine 160mg', dilu:'100 ml NaCl 0,9%', conc:'1,6 mg/ml', admin:'IVL 30 min', compat:'NaCl 0,9% · G5%', stable:'24h réfrigérateur', note:'⚠️ Dosage unique quotidien - incompatible pénicillines' },
  { name:'Métronidazole 500mg', dilu:'Prêt à l\'emploi 100 ml', conc:'5 mg/ml', admin:'IVL 30-60 min', compat:'NaCl 0,9%', stable:'24h température ambiante', note:'Protéger de la lumière' },
  { name:'Fluconazole 200mg', dilu:'Prêt à l\'emploi 100 ml', conc:'2 mg/ml', admin:'IVL max 10 ml/min', compat:'NaCl 0,9% · G5%', stable:'24h réfrigérateur', note:'' },
  { name:'Aciclovir 250mg', dilu:'10 ml eau PPI puis 50-100 ml', conc:'5 mg/ml max', admin:'IVL 60 min', compat:'NaCl 0,9%', stable:'12h température ambiante', note:'⚠️ Ne pas dépasser 5 mg/ml - risque cristallisation' },
];

export default function Reconstitution({ onBack }) {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);

  const filtered = ANTIBIOS.filter(a => a.name.toLowerCase().includes(search.toLowerCase()));

  if (selected) return (
    <div style={{minHeight:'100vh',background:T.bg,paddingBottom:40}}>
      <div style={{background:T.iatrDim,borderBottom:`1px solid ${C}44`,padding:'14px 16px',display:'flex',alignItems:'center',gap:12,position:'sticky',top:0,zIndex:10}}>
        <button onClick={()=>setSelected(null)} style={{background:'none',border:'none',color:C,fontSize:20,cursor:'pointer'}}>←</button>
        <div style={{color:T.text,fontWeight:700,fontSize:16}}>{selected.name}</div>
      </div>
      <div style={{padding:'14px'}}>
        {[
          ['💧 Dilution initiale', selected.dilu],
          ['📊 Concentration finale', selected.conc],
          ['⏱ Mode d\'administration', selected.admin],
          ['🔗 Solvants compatibles', selected.compat],
          ['⏰ Stabilité', selected.stable],
        ].map(([label, val])=>(
          <div key={label} style={{...s.card,display:'flex',gap:12,alignItems:'flex-start'}}>
            <div style={{minWidth:170}}>
              <div style={{color:C,fontSize:12,fontFamily:'monospace',fontWeight:700}}>{label}</div>
            </div>
            <div style={{color:T.text,fontSize:14,flex:1}}>{val}</div>
          </div>
        ))}
        {selected.note && (
          <div style={{background:'#431407',border:`1px solid ${T.urg}44`,borderRadius:8,padding:'12px 14px'}}>
            <div style={{color:T.urg,fontWeight:700,fontSize:13,marginBottom:4}}>⚠️ Note importante</div>
            <div style={{color:T.text,fontSize:13,lineHeight:1.5}}>{selected.note}</div>
          </div>
        )}
        <div style={{...s.card,marginTop:10,background:'#0c3a4a',border:`1px solid ${T.soins}33`}}>
          <div style={{color:T.soins,fontSize:12,fontFamily:'monospace',marginBottom:6}}>PROCÉDURE DE RECONSTITUTION</div>
          <ol style={{color:T.muted,fontSize:13,paddingLeft:18,lineHeight:2.2}}>
            <li>Vérifier la prescription et l&apos;identité du patient</li>
            <li>Contrôler la date de péremption</li>
            <li>Reconstituer avec {selected.dilu}</li>
            <li>Agiter doucement jusqu&apos;à dissolution complète</li>
            <li>Vérifier l&apos;absence de particules</li>
            <li>Étiqueter : nom, dose, date/heure, opérateur</li>
            <li>Administrer selon {selected.admin}</li>
          </ol>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{minHeight:'100vh',background:T.bg,paddingBottom:40}}>
      <div style={{background:T.iatrDim,borderBottom:`1px solid ${C}44`,padding:'14px 16px',display:'flex',alignItems:'center',gap:12,position:'sticky',top:0,zIndex:10}}>
        <button onClick={onBack} style={{background:'none',border:'none',color:C,fontSize:20,cursor:'pointer'}}>←</button>
        <div style={{color:T.text,fontWeight:700,fontSize:17}}>🧪 Reconstitution antibiotiques</div>
      </div>
      <div style={{padding:'14px'}}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Rechercher un antibiotique..." style={{...s.input,marginBottom:14}}/>
        {filtered.map(a=>(
          <div key={a.name} onClick={()=>setSelected(a)} style={{...s.card,cursor:'pointer',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <div>
              <div style={{color:C,fontWeight:700,fontSize:14,marginBottom:3}}>{a.name}</div>
              <div style={{color:T.muted,fontSize:12}}>{a.admin} · {a.conc}</div>
            </div>
            <span style={{color:T.muted,fontSize:18}}>›</span>
          </div>
        ))}
      </div>
    </div>
  );
}

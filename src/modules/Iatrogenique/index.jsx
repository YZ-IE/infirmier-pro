import { useState } from 'react';
import { T, s } from '../../theme.js';
import DosesCalculator from './DosesCalculator.jsx';
import DebitPerfusion from './DebitPerfusion.jsx';
import SeringueSAP from './SeringueSAP.jsx';
import Interactions from './Interactions.jsx';
import Reconstitution from './Reconstitution.jsx';
import CompatibilitesIV from './CompatibilitesIV.jsx';
import Nutrition from './Nutrition.jsx';
import Pediatrique from './Pediatrique.jsx';
import OpioidConverter from './OpioidConverter.jsx';

const TOOLS = [
  { id:'doses',  icon:'🧮', label:'Calcul de doses',              desc:'Dose/kg · Dose/m²· Dose/h' },
  { id:'debit',  icon:'💧', label:'Débit de perfusion',           desc:'ml/h · gouttes/min · durée' },
  { id:'sap',    icon:'⏱', label:'Seringue auto-pousseuse',       desc:'Concentration · Débit · Durée' },
  { id:'inter',  icon:'⚠️', label:'Interactions médicamenteuses', desc:'Vérification rapide' },
  { id:'recon',  icon:'🧪', label:'Reconstitution antibiotiques', desc:'Fiches de dilution' },
  { id:'compat', icon:'🔗', label:'Compatibilités IV en Y',       desc:'Tableau de compatibilité' },
  { id:'nutri',  icon:'🥗', label:'Nutrition parentérale/entérale', desc:'Harris-Benedict · Protéines · Osmolarité', badge:'NOUVEAU' },
  { id:'pedia',  icon:'👶', label:'Calculateur pédiatrique',      desc:'Doses mg/kg · IOT · Matériel', badge:'NOUVEAU' },
  { id:'opio',   icon:'💊', label:'Convertisseur opioïdes',       desc:'Rotation · Équianalgésie · Fentanyl patch', badge:'NOUVEAU' },
];

export default function Iatrogenique({ onBack }) {
  const [tool, setTool] = useState(null);

  if (tool === 'doses')  return <DosesCalculator  onBack={() => setTool(null)} />;
  if (tool === 'debit')  return <DebitPerfusion   onBack={() => setTool(null)} />;
  if (tool === 'sap')    return <SeringueSAP      onBack={() => setTool(null)} />;
  if (tool === 'inter')  return <Interactions     onBack={() => setTool(null)} />;
  if (tool === 'recon')  return <Reconstitution   onBack={() => setTool(null)} />;
  if (tool === 'compat') return <CompatibilitesIV onBack={() => setTool(null)} />;
  if (tool === 'nutri')  return <Nutrition        onBack={() => setTool(null)} />;
  if (tool === 'pedia')  return <Pediatrique      onBack={() => setTool(null)} />;
  if (tool === 'opio')   return <OpioidConverter  onBack={() => setTool(null)} />;

  return (
    <div style={{ minHeight:'100vh', background:T.bg }}>
      <div style={{ background:T.iatrDim, borderBottom:`1px solid ${T.iatr}44`, padding:'14px 16px', display:'flex', alignItems:'center', gap:12, position:'sticky', top:0, zIndex:10 }}>
        <button onClick={onBack} style={{ background:'none', border:'none', color:T.iatr, fontSize:20, cursor:'pointer' }}>←</button>
        <div>
          <div style={{ color:T.iatr, fontFamily:'monospace', fontSize:10, letterSpacing:3 }}>MODULE</div>
          <div style={{ color:T.text, fontWeight:700, fontSize:18 }}>💊 Iatrogénie</div>
        </div>
      </div>
      <div style={{ padding:'14px', display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
        {TOOLS.map(t => (
          <div key={t.id} onClick={() => setTool(t.id)} style={{
            background:T.surface, border:`1px solid ${t.badge ? T.iatr + '66' : T.iatr + '33'}`, borderRadius:10,
            padding:'14px 12px', cursor:'pointer', position:'relative'
          }}>
            {t.badge && <span style={{ position:'absolute', top:8, right:8, background:T.iatr+'22', color:T.iatr, fontSize:8, fontFamily:'monospace', padding:'2px 6px', borderRadius:8 }}>{t.badge}</span>}
            <div style={{ fontSize:24, marginBottom:7 }}>{t.icon}</div>
            <div style={{ color:T.iatr, fontWeight:700, fontSize:13, marginBottom:3 }}>{t.label}</div>
            <div style={{ color:T.muted, fontSize:11 }}>{t.desc}</div>
          </div>
        ))}
      </div>
      <div style={{ margin:'0 14px', background:T.iatrDim, border:`1px solid ${T.iatr}33`, borderRadius:8, padding:'10px 14px' }}>
        <div style={{ color:T.iatr, fontSize:11, fontFamily:'monospace' }}>⚠️ Toujours vérifier la prescription médicale avant toute administration. Ces calculs sont une aide, non un substitut au jugement clinique.</div>
      </div>
    </div>
  );
}

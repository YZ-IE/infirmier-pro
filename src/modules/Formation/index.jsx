import { useState } from 'react';
import { T, s } from '../../theme.js';
import StarButton from '../shared/StarButton.jsx';

const C   = T.form;
const MOD = 'form';

import Quiz               from './Quiz.jsx';
import CasCliniques       from './CasCliniques.jsx';
import Lexique            from './Lexique.jsx';
import DoseCalcEntrainement from './DoseCalcEntrainement.jsx';

const TOOLS = [
  { id:'quiz',   icon:'🎯', label:'Quiz clinique',    desc:'QCM · 5 thèmes · Score · Explications' },
  { id:'cas',    icon:'📖', label:'Cas cliniques',    desc:'Situations réelles · Raisonnement IDE' },
  { id:'dose',   icon:'💉', label:'Calcul de dose',   desc:'Entraînement · 3 niveaux de difficulté' },
  { id:'lexique',icon:'📚', label:'Lexique médical',  desc:'Abréviations · Définitions' },
];

const map = {
  quiz:    <Quiz />,
  cas:     <CasCliniques />,
  dose:    <DoseCalcEntrainement />,
  lexique: <Lexique />,
};

export default function Formation({ onBack, initialTool = null, onFavChange }) {
  const [tool, setTool] = useState(initialTool);

  if (tool) return (
    <div style={{ minHeight:'100vh', background:T.bg, color:T.text }}>
      <div style={{ background:T.formDim, borderBottom:`1px solid ${C}44`, padding:'12px 16px', display:'flex', alignItems:'center', gap:10, position:'sticky', top:0, zIndex:10 }}>
        <button onClick={() => setTool(null)} style={{ background:'none', border:'none', color:C, fontSize:20, cursor:'pointer' }}>←</button>
        <span style={{ color:T.text, fontWeight:700, fontSize:16 }}>{TOOLS.find(t => t.id === tool)?.label}</span>
      </div>
      <div style={{ paddingBottom:40 }}>{map[tool]}</div>
    </div>
  );

  return (
    <div style={{ minHeight:'100vh', background:T.bg }}>
      <div style={{ background:T.formDim, borderBottom:`1px solid ${C}44`, padding:'14px 16px', display:'flex', alignItems:'center', gap:12, position:'sticky', top:0, zIndex:10 }}>
        <button onClick={onBack} style={{ background:'none', border:'none', color:C, fontSize:20, cursor:'pointer' }}>←</button>
        <div>
          <div style={{ color:C, fontFamily:'monospace', fontSize:10, letterSpacing:3 }}>MODULE</div>
          <div style={{ color:T.text, fontWeight:700, fontSize:18 }}>🎓 Formation</div>
        </div>
      </div>
      <div style={{ padding:'14px', display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
        {TOOLS.map(t => (
          <div key={t.id} style={{ background:T.surface, border:`1px solid ${C}33`, borderRadius:10, padding:'14px 12px', position:'relative' }}>
            <div style={{ position:'absolute', top:6, left:6 }}>
              <StarButton mod={MOD} toolId={t.id} label={t.label} icon={t.icon} color={C} onFavChange={onFavChange} />
            </div>
            <div onClick={() => setTool(t.id)} style={{ cursor:'pointer', paddingTop:18 }}>
              <div style={{ fontSize:24, marginBottom:7 }}>{t.icon}</div>
              <div style={{ color:C, fontWeight:700, fontSize:13, marginBottom:3 }}>{t.label}</div>
              <div style={{ color:T.muted, fontSize:11 }}>{t.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

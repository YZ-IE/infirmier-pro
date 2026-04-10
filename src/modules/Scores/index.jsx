import { useState } from 'react';
import { T } from '../../theme.js';
import StarButton from '../shared/StarButton.jsx';

const C   = T.score;
const MOD = 'score';

import Glasgow        from './Glasgow.jsx';
import EVA            from './EVA.jsx';
import Norton         from './Norton.jsx';
import Morse          from './Morse.jsx';
import QSOFA          from './QSOFA.jsx';
import MMSE           from './MMSE.jsx';
import Braden         from './Braden.jsx';
import NAS            from './NAS.jsx';
import SOFA           from './SOFA.jsx';
import NEWS2          from './NEWS2.jsx';
import CAM            from './CAM.jsx';
import Waterlow       from './Waterlow.jsx';
import GDS            from './GDS.jsx';
import NIHSS          from './NIHSS.jsx';
import Wells          from './Wells.jsx';
import CIWA           from './CIWA.jsx';
import PSI            from './PSI.jsx';
import PHQ9HAD        from './PHQ9HAD.jsx';
import ChildPugh      from './ChildPugh.jsx';
import RankinCockcroft from './RankinCockcroft.jsx';
import RASS           from './RASS.jsx';
import CPOT           from './CPOT.jsx';

const SCORES = [
  { id:'glasgow',   icon:'🧠', label:'Glasgow (GCS)',            desc:'Évaluation de la conscience' },
  { id:'eva',       icon:'😊', label:'Douleur (EVA/EN/Faces)',   desc:'Smileys · Numérique · Analogique · FLACC' },
  { id:'rass',      icon:'💤', label:'RASS — Sédation/Agitation', desc:'Richmond · Réanimation · Ventilation', badge:'NOUVEAU' },
  { id:'cpot',      icon:'😣', label:'CPOT — Douleur réa',       desc:'Patient non communicant · Intubé',       badge:'NOUVEAU' },
  { id:'gds',       icon:'🫁', label:'GDS — Gaz du sang',        desc:'pH · PaO₂ · PaCO₂ · HCO₃',             badge:'NOUVEAU' },
  { id:'nihss',     icon:'🩻', label:'NIHSS — AVC',              desc:'Évaluation neurologique post-AVC',        badge:'NOUVEAU' },
  { id:'wells',     icon:'🩸', label:'Wells TVP / EP',            desc:'Probabilité embolie · TVP',               badge:'NOUVEAU' },
  { id:'ciwa',      icon:'🍺', label:'CIWA-Ar — Sevrage alcool', desc:'Sévérité du sevrage éthylique',           badge:'NOUVEAU' },
  { id:'psi',       icon:'🌬', label:'PSI / PORT — Pneumonie',   desc:'Sévérité · Décision hospit.',             badge:'NOUVEAU' },
  { id:'phq9',      icon:'🧩', label:'PHQ-9 · HAD',              desc:'Dépression · Anxiété',                    badge:'NOUVEAU' },
  { id:'childpugh', icon:'🫀', label:'Child-Pugh · MELD',        desc:'Cirrhose · Greffe hépatique',             badge:'NOUVEAU' },
  { id:'rankin',    icon:'🦯', label:'Rankin · Cockcroft',        desc:'Séquelles AVC · Clairance IR',            badge:'NOUVEAU' },
  { id:'qsofa',     icon:'🦠', label:'qSOFA',                    desc:'Dépistage rapide sepsis' },
  { id:'sofa',      icon:'🏥', label:'SOFA',                     desc:'Défaillance multi-organe réa' },
  { id:'news2',     icon:'📈', label:'NEWS2',                    desc:'Détérioration clinique précoce' },
  { id:'cam',       icon:'🌀', label:'CAM — Délirium',           desc:'Syndrome confusionnel' },
  { id:'norton',    icon:'🛏', label:'Norton',                   desc:'Risque d\'escarre' },
  { id:'braden',    icon:'🛌', label:'Braden',                   desc:'Risque d\'escarres (détaillé)' },
  { id:'waterlow',  icon:'💧', label:'Waterlow',                 desc:'Risque d\'escarres (chirurgie)' },
  { id:'morse',     icon:'⚠️', label:'Morse',                   desc:'Risque de chute' },
  { id:'mmse',      icon:'📝', label:'MMS / MMSE',               desc:'Évaluation cognitive' },
  { id:'nas',       icon:'🩺', label:'NAS',                      desc:'Charge en soins infirmiers' },
];

const map = {
  glasgow:<Glasgow/>, eva:<EVA/>, norton:<Norton/>, braden:<Braden/>,
  morse:<Morse/>, qsofa:<QSOFA/>, mmse:<MMSE/>, nas:<NAS/>,
  sofa:<SOFA/>, news2:<NEWS2/>, cam:<CAM/>, waterlow:<Waterlow/>,
  gds:<GDS/>, nihss:<NIHSS/>, wells:<Wells/>, ciwa:<CIWA/>,
  psi:<PSI/>, phq9:<PHQ9HAD/>, childpugh:<ChildPugh/>,
  rankin:<RankinCockcroft/>, rass:<RASS/>, cpot:<CPOT/>,
};

export default function Scores({ onBack, initialTool = null, onFavChange }) {
  const [score, setScore] = useState(initialTool);

  if (score) return (
    <div style={{ minHeight:'100vh', background:T.bg, color:T.text }}>
      <div style={{ background:T.scoreDim, borderBottom:`1px solid ${C}44`, padding:'12px 16px', display:'flex', alignItems:'center', gap:10, position:'sticky', top:0, zIndex:10 }}>
        <button onClick={() => setScore(null)} style={{ background:'none', border:'none', color:C, fontSize:20, cursor:'pointer' }}>←</button>
        <span style={{ color:T.text, fontWeight:700, fontSize:16 }}>{SCORES.find(s => s.id === score)?.label}</span>
      </div>
      <div style={{ paddingBottom:40 }}>{map[score]}</div>
    </div>
  );

  return (
    <div style={{ minHeight:'100vh', background:T.bg }}>
      <div style={{ background:T.scoreDim, borderBottom:`1px solid ${C}44`, padding:'14px 16px', display:'flex', alignItems:'center', gap:12, position:'sticky', top:0, zIndex:10 }}>
        <button onClick={onBack} style={{ background:'none', border:'none', color:C, fontSize:20, cursor:'pointer' }}>←</button>
        <div>
          <div style={{ color:C, fontFamily:'monospace', fontSize:10, letterSpacing:3 }}>MODULE</div>
          <div style={{ color:T.text, fontWeight:700, fontSize:18 }}>📊 Scores cliniques</div>
        </div>
      </div>
      <div style={{ padding:'14px', display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
        {SCORES.map(sc => (
          <div key={sc.id} style={{ background:T.surface, border:`1px solid ${sc.badge ? C+'66' : C+'33'}`, borderRadius:10, padding:'14px 12px', position:'relative' }}>
            {sc.badge && <span style={{ position:'absolute', top:8, right:8, background:C+'22', color:C, fontSize:8, fontFamily:'monospace', padding:'2px 6px', borderRadius:8 }}>{sc.badge}</span>}
            <div style={{ position:'absolute', top:6, left:6 }}>
              <StarButton mod={MOD} toolId={sc.id} label={sc.label} icon={sc.icon} color={C} onFavChange={onFavChange} />
            </div>
            <div onClick={() => setScore(sc.id)} style={{ cursor:'pointer', paddingTop:18 }}>
              <div style={{ fontSize:24, marginBottom:7 }}>{sc.icon}</div>
              <div style={{ color:C, fontWeight:700, fontSize:13, marginBottom:3 }}>{sc.label}</div>
              <div style={{ color:T.muted, fontSize:11 }}>{sc.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

import { useState } from 'react';
import { T, s } from '../../theme.js';
import StarButton from '../shared/StarButton.jsx';

const C = T.urg;
const MOD = 'urg';

const PROTOS = [
  { id:'rcp',   icon:'❤️',  label:'Arrêt Cardio-Respiratoire',       sub:'RCP adulte · ACLS',                          urgent:true },
  { id:'avc',   icon:'🧠',  label:'AVC / Accident Vasculaire Cérébral', sub:'FAST · Thrombolyse',                       urgent:true },
  { id:'ana',   icon:'💉',  label:'Anaphylaxie / Choc allergique',    sub:'Adrénaline · Conduite',                      urgent:true },
  { id:'sep',   icon:'🦠',  label:'Sepsis & Choc septique',           sub:'qSOFA · Bundle 1h',                          urgent:true },
  { id:'cho',   icon:'🩸',  label:'États de choc',                    sub:'Hypovolémique · Cardiogénique · Distributif', urgent:true },
  { id:'det',   icon:'🫁',  label:'Détresse respiratoire',            sub:'SDRA · OAP · Bronchospasme',                 urgent:true },
  { id:'oap',   icon:'💧',  label:'OAP — Œdème Aigu du Poumon',       sub:'LMNOP · Furosémide · VNI',                   urgent:true },
  { id:'hk',    icon:'⚡',  label:'Hyperkaliémie',                    sub:'ECG · Calcium · Insuline-Glucose',           urgent:true },
  { id:'intox', icon:'☠️',  label:'Intoxications — Antidotes',        sub:'Naloxone · Flumazénil · NAC…',              urgent:true },
  { id:'hyp',   icon:'💊',  label:'Hypoglycémie sévère',              sub:'Resucrage · Glucagon · G30%',                urgent:false },
  { id:'epi',   icon:'⚡',  label:'Crise convulsive / Épilepsie',     sub:'Diazépam · Clonazépam',                      urgent:false },
];

import RCP         from './RCP.jsx';
import AVC         from './AVC.jsx';
import Anaphylaxie from './Anaphylaxie.jsx';
import Sepsis      from './Sepsis.jsx';
import ChocEtats   from './ChocEtats.jsx';
import DetressResp from './DetressResp.jsx';
import Hypoglycemie from './Hypoglycemie.jsx';
import Convulsions from './Convulsions.jsx';
import OAP         from './OAP.jsx';
import Hyperkaliemie from './Hyperkaliemie.jsx';
import Intoxication from './Intoxication.jsx';

const map = { rcp:<RCP/>, avc:<AVC/>, ana:<Anaphylaxie/>, sep:<Sepsis/>, cho:<ChocEtats/>, det:<DetressResp/>, hyp:<Hypoglycemie/>, epi:<Convulsions/>, oap:<OAP/>, hk:<Hyperkaliemie/>, intox:<Intoxication/> };

export default function Urgences({ onBack, initialTool = null, onFavChange }) {
  const [proto, setProto] = useState(initialTool);

  if (proto) return (
    <div style={{ minHeight:'100vh', background:T.bg, color:T.text }}>
      <div style={{ background:'#431407', borderBottom:`1px solid ${C}44`, padding:'12px 16px', display:'flex', alignItems:'center', gap:10, position:'sticky', top:0, zIndex:10 }}>
        <button onClick={() => setProto(null)} style={{ background:'none', border:'none', color:C, fontSize:20, cursor:'pointer' }}>←</button>
        <span style={{ color:T.text, fontWeight:700, fontSize:16 }}>{PROTOS.find(p => p.id === proto)?.label}</span>
      </div>
      <div style={{ paddingBottom:40 }}>{map[proto]}</div>
    </div>
  );

  return (
    <div style={{ minHeight:'100vh', background:T.bg }}>
      <div style={{ background:'#431407', borderBottom:`1px solid ${C}44`, padding:'14px 16px', display:'flex', alignItems:'center', gap:12, position:'sticky', top:0, zIndex:10 }}>
        <button onClick={onBack} style={{ background:'none', border:'none', color:C, fontSize:20, cursor:'pointer' }}>←</button>
        <div>
          <div style={{ color:C, fontFamily:'monospace', fontSize:10, letterSpacing:3 }}>MODULE</div>
          <div style={{ color:T.text, fontWeight:700, fontSize:18 }}>🚨 Urgences</div>
        </div>
      </div>
      <div style={{ padding:'14px' }}>
        <div style={{ background:C+'18', border:`1px solid ${C}44`, borderRadius:8, padding:'10px 14px', marginBottom:14 }}>
          <div style={{ color:C, fontWeight:700, fontSize:13 }}>⚠️ Protocoles d'urgence</div>
          <div style={{ color:T.muted, fontSize:12, marginTop:3 }}>En cas d'urgence réelle, appeler le médecin et le 15/18 en priorité.</div>
        </div>
        {PROTOS.map(p => (
          <div key={p.id} style={{ ...s.card, display:'flex', alignItems:'center', gap:14, borderColor:p.urgent ? C+'44' : T.border }}>
            <span style={{ fontSize:28 }}>{p.icon}</span>
            <div style={{ flex:1, cursor:'pointer' }} onClick={() => setProto(p.id)}>
              <div style={{ color:p.urgent ? C : T.text, fontWeight:700, fontSize:14, marginBottom:2 }}>{p.label}</div>
              <div style={{ color:T.muted, fontSize:12 }}>{p.sub}</div>
            </div>
            {p.urgent && <span style={{ background:C+'22', color:C, fontSize:9, fontFamily:'monospace', padding:'2px 7px', borderRadius:10 }}>URGENT</span>}
            <StarButton mod={MOD} toolId={p.id} label={p.label} icon={p.icon} color={C} onFavChange={onFavChange} />
            <span onClick={() => setProto(p.id)} style={{ color:T.muted, cursor:'pointer' }}>›</span>
          </div>
        ))}
      </div>
    </div>
  );
}

import { useState } from 'react';
import { T, s } from '../../theme.js';
const C = T.form;
const CAS = [
  { titre:'M. Dupont, 78 ans — Douleur thoracique',
    context:'M. Dupont, 78 ans, est hospitalisé en cardiologie pour surveillance post-stent. À 14h, il sonne et se plaint d\'une douleur thoracique oppressive 7/10, irradiant dans le bras gauche. Il transpire. FC 98 bpm, PA 95/60 mmHg, SpO₂ 93%.',
    questions:[
      {q:'Quelle est votre 1ère action ?',good:'Appel médecin URGENT + scope',bad:['Donner un antalgique','Mesurer à nouveau la PA','Rassurer le patient et observer']},
      {q:'Quel examen réalisez-vous en priorité ?',good:'ECG 12 dérivations immédiat',bad:['Bilan biologique','Radio thorax','Écho cardiaque']},
      {q:'Quelle position adoptez-vous ?',good:'Demi-assise (position antalgique)',bad:['Décubitus dorsal strict','Trendelenburg','Décubitus latéral gauche']},
    ],
    conclusion:'Ce tableau évoque un SCA. Les priorités : ECG immédiat, appel médecin, VVP G16, bilan : troponine Hs, NFS, TP/TCA, groupe. Préparer l\'aspirine 250 mg et anticoagulation selon prescription.',
  },
  { titre:'Mme Martin, 65 ans — Fièvre et frissons',
    context:'Mme Martin, 65 ans, diabétique, revient de salle de bain tremblante. T° 39,8°C, FC 118/min, FR 24/min, PA 88/55 mmHg, SpO₂ 95%, légèrement confuse (GCS 14).',
    questions:[
      {q:'Quel score calculez-vous en priorité ?',good:'qSOFA (FR ≥ 22, confusion, PAS ≤ 100) = 3/3',bad:['Score de Norton','Glasgow seul','Score Morse']},
      {q:'Quels prélèvements en urgence ?',good:'Hémocultures x2 + lactates + bilan biologique complet',bad:['ECBU seul','NFS seule','Attendre la baisse de température']},
      {q:'Dans quel délai les ATB doivent-ils être administrés ?',good:'Dans l\'heure qui suit (bundle sepsis 1h)',bad:['Dans les 6 heures','Après les résultats d\'hémocultures','Après l\'antibiogramme']},
    ],
    conclusion:'Sepsis grave avec dysfonction d\'organe. Bundle 1h : hémocultures, ATB spectre large, lactates, remplissage NaCl 30 ml/kg si hypotension, noradrénaline si nécessaire. Score qSOFA = 3/3.',
  },
  { titre:'M. Leroy, 55 ans — Sous Warfarine',
    context:'M. Leroy reçoit de la Warfarine pour FA. INR du jour : 4,8. Aucun saignement visible. Il prend du Paracétamol 2g/j depuis 2 semaines pour douleurs lombaires.',
    questions:[
      {q:'Quelle est la cause probable de la surdosage ?',good:'Potentialisation de la Warfarine par Paracétamol > 2g/j',bad:['Erreur de dose de Warfarine','Alimentation riche en vitamine K','Sous-dosage chronique']},
      {q:'INR 4,8 sans saignement : quelle conduite ?',good:'Arrêt ou adaptation Warfarine + contrôle INR sous 24-48h selon protocole médecin',bad:['Injecter Vitamine K immédiatement','Poursuivre le traitement normalement','Transfusion PFC d\'emblée']},
      {q:'Quels signes vous alerteraient immédiatement ?',good:'Hématurie, épistaxis, hématome, sang dans les selles (méléna), céphalées intenses',bad:['Légère fatigue','Prise de poids de 500g','Légère toux']},
    ],
    conclusion:'Interaction Warfarine-Paracétamol (> 2g/j). Prévenir le médecin. Surveiller tout signe de saignement. L\'antidote est la Vitamine K (délai d\'action 6-24h) ou le PPSB en urgence si saignement grave.',
  },
];
export default function CasCliniques() {
  const [cas,setCas]=useState(null);
  const [etape,setEtape]=useState(0);
  const [reponses,setReponses]=useState([]);
  const [done,setDone]=useState(false);
  if(!cas) return (
    <div style={{padding:'14px'}}>
      <div style={{...s.card,background:'#1e1a03'}}>
        <div style={{color:C,fontWeight:700,marginBottom:4}}>Cas cliniques interactifs</div>
        <div style={{color:T.muted,fontSize:12}}>Choisissez un cas et répondez aux questions de raisonnement clinique</div>
      </div>
      {CAS.map((c,i)=>(
        <div key={i} onClick={()=>{setCas(c);setEtape(0);setReponses([]);setDone(false);}} style={{...s.card,cursor:'pointer',borderLeft:`3px solid ${C}`}}>
          <div style={{color:C,fontWeight:700,fontSize:14,marginBottom:4}}>{c.titre}</div>
          <div style={{color:T.muted,fontSize:12,lineHeight:1.5}}>{c.context.slice(0,100)}…</div>
        </div>
      ))}
    </div>
  );
  const q=cas.questions[etape];
  const score=reponses.filter(Boolean).length;
  if(done) return (
    <div style={{padding:'14px'}}>
      <div style={{...s.result(score===cas.questions.length?C:'#f59e0b'),textAlign:'center'}}>
        <div style={{color:C,fontSize:24,fontWeight:700}}>{score}/{cas.questions.length} bonnes réponses</div>
      </div>
      <div style={s.card}>
        <div style={{color:C,fontFamily:'monospace',fontSize:11,letterSpacing:2,marginBottom:10}}>CONCLUSION</div>
        <div style={{color:T.text,fontSize:13,lineHeight:1.7}}>{cas.conclusion}</div>
      </div>
      <button onClick={()=>setCas(null)} style={{...s.btn(C),width:'100%',padding:'12px'}}>← Autres cas</button>
    </div>
  );
  return (
    <div style={{padding:'14px'}}>
      <div style={s.card}>
        <div style={{color:C,fontFamily:'monospace',fontSize:11,letterSpacing:2,marginBottom:8}}>SITUATION CLINIQUE</div>
        <div style={{color:T.text,fontSize:13,lineHeight:1.7}}>{cas.context}</div>
      </div>
      <div style={{...s.card,borderLeft:`3px solid ${C}`}}>
        <div style={{color:T.muted,fontFamily:'monospace',fontSize:11,marginBottom:10}}>Question {etape+1}/{cas.questions.length}</div>
        <div style={{color:T.text,fontWeight:700,fontSize:14,marginBottom:14}}>{q.q}</div>
        <button onClick={()=>{setReponses(p=>[...p,true]);etape<cas.questions.length-1?setEtape(e=>e+1):setDone(true);}} style={{...s.btn(C),width:'100%',padding:'11px',marginBottom:8,textAlign:'left',fontSize:13}}>✓ {q.good}</button>
        {q.bad.map((b,i)=>(
          <button key={i} onClick={()=>{setReponses(p=>[...p,false]);etape<cas.questions.length-1?setEtape(e=>e+1):setDone(true);}} style={{...s.btn(T.muted),width:'100%',padding:'11px',marginBottom:6,textAlign:'left',fontSize:13,background:T.surface}}>✗ {b}</button>
        ))}
      </div>
    </div>
  );
}

import { useState } from 'react';
import { T, s } from '../../theme.js';
const C = T.form;
const QUESTIONS = [
  {q:'Quel est le premier traitement de l\'anaphylaxie ?',opts:['Corticoïdes IV','Antihistaminiques','Adrénaline IM 0,5 mg','Bronchodilatateurs'],rep:2,expl:'L\'adrénaline IM est le seul traitement de première intention de l\'anaphylaxie. Elle doit être administrée immédiatement, sans attendre les autres traitements.'},
  {q:'Quel est le seuil de Glasgow indiquant une protection des VAS à envisager ?',opts:['Glasgow ≤ 12','Glasgow ≤ 10','Glasgow ≤ 8','Glasgow ≤ 6'],rep:2,expl:'Un Glasgow ≤ 8 indique une altération sévère de la conscience. La protection des voies aériennes (intubation) est à discuter.'},
  {q:'L\'ordre de remplissage des tubes est :',opts:['EDTA → Citrate → Sec','Citrate → Sec → Héparine → EDTA','Héparine → Citrate → EDTA → Sec','Sec → EDTA → Citrate → Héparine'],rep:1,expl:'L\'ordre correct est : (hémocultures) → Citrate (bleu) → Sec/Gel (rouge/or) → Héparine (vert) → EDTA (violet) → Fluorure (gris). Ceci évite la contamination croisée des anticoagulants.'},
  {q:'Combien de temps faut-il maintenir la désinfection cutanée avant une ponction ?',opts:['10 secondes','30 secondes friction + 30 s séchage','15 secondes','1 minute'],rep:1,expl:'La désinfection en 4 temps : nettoyage, rinçage, antisepsie (30s friction), séchage (30s). Le séchage est essentiel : l\'alcool humide dilue l\'antiseptique.'},
  {q:'Un qSOFA ≥ 2 indique :',opts:['Une pneumonie confirmée','Un risque élevé de mauvaise évolution (sepsis)','Un arrêt cardiaque imminent','Une insuffisance rénale aiguë'],rep:1,expl:'Le qSOFA ≥ 2 (parmi FR ≥ 22/min, conscience altérée, PAS ≤ 100 mmHg) signe un risque élevé de mauvaise évolution d\'une infection. Il déclenche le bundle sepsis.'},
  {q:'Le bundle sepsis 1h comprend :',opts:['Hémocultures + ATB + Lactates','ATB + Corticoïdes + Oxygène','Remplissage + ATB + Héparine','Hémocultures + Corticoïdes + Vasopresseurs'],rep:0,expl:'Le bundle 1h inclut : hémocultures, antibiotiques dans l\'heure, mesure des lactates, remplissage si hypotension ou lactates > 4, et vasopresseurs si nécessaire.'},
  {q:'Quel calibre de VVP pour une transfusion rapide ?',opts:['G22','G20','G18','G16 ou G14'],rep:3,expl:'Pour une transfusion rapide ou un état de choc, un G16 minimum (210 ml/min) voire G14 (330 ml/min) est nécessaire. Un G22 (36 ml/min) est inadapté aux urgences.'},
  {q:'Score Norton ≤ 13 correspond à :',opts:['Risque faible d\'escarre','Risque modéré','Risque élevé','Risque très élevé'],rep:2,expl:'Norton : ≥ 18 = faible · 14-17 = modéré · 10-13 = élevé · < 10 = très élevé. Un score ≤ 13 nécessite un matelas à air alterné et des repositionnements toutes les 2h.'},
  {q:'L\'hypokaliémie potentialise la toxicité de :',opts:['Paracétamol','Warfarine','Digoxine','Morphine'],rep:2,expl:'L\'hypokaliémie potentialise fortement la toxicité de la digoxine. Une kaliémie < 3,5 mmol/L augmente le risque d\'arythmies chez les patients sous digitaliques.'},
  {q:'La position de sécurité après un AVC est :',opts:['Trendelenburg','Décubitus ventral','Proclive 30° + tête en position neutre','Décubitus latéral strict'],rep:2,expl:'Après un AVC ischémique, la position proclive à 30° améliore la pression de perfusion cérébrale. En revanche, la tête trop surélevée peut réduire le débit cérébral.'},
  {q:'Le sondage urinaire chez la femme adulte utilise :',opts:['CH 10-12','CH 14-16','CH 18-20','CH 22-24'],rep:1,expl:'Chez la femme adulte, la sonde CH 14-16 est standard. CH 12-14 chez la femme âgée avec urètre atrophié. Des calibres plus grands sont rarement nécessaires.'},
  {q:'L\'antidote de l\'héparine non fractionnée est :',opts:['Vitamine K','Sulfate de protamine','Flumazénil','Naloxone'],rep:1,expl:'Le sulfate de protamine neutralise l\'héparine non fractionnée : 1 mg pour 100 UI d\'héparine, en IV lente. La vitamine K antagonise les AVK (warfarine). La naloxone est l\'antidote des opioïdes.'},
];
function shuffle(arr) { return [...arr].sort(() => Math.random() - 0.5); }
export default function Quiz() {
  const [questions] = useState(() => shuffle(QUESTIONS));
  const [idx,setIdx]=useState(0);
  const [answered,setAnswered]=useState(null);
  const [score,setScore]=useState(0);
  const [done,setDone]=useState(false);
  const q=questions[idx];
  const handleAnswer=(i)=>{
    if(answered!==null) return;
    setAnswered(i);
    if(i===q.rep) setScore(s=>s+1);
  };
  const next=()=>{
    if(idx<questions.length-1){setIdx(i=>i+1);setAnswered(null);}
    else setDone(true);
  };
  if(done) return (
    <div style={{padding:'14px'}}>
      <div style={{...s.result(score/questions.length>=0.7?C:'#ef4444'),textAlign:'center',animation:'fadeIn 0.3s'}}>
        <div style={{fontSize:40,marginBottom:10}}>{score/questions.length>=0.8?'🏆':score/questions.length>=0.6?'👍':'📚'}</div>
        <div style={{color:C,fontSize:28,fontWeight:700}}>{score}/{questions.length}</div>
        <div style={{color:T.muted,fontSize:14,marginTop:4}}>{Math.round(score/questions.length*100)}% de bonnes réponses</div>
        <div style={{color:T.muted,fontSize:13,marginTop:8}}>{score===questions.length?'Parfait !':score/questions.length>=0.8?'Très bien !':score/questions.length>=0.6?'Bien, continuez !':'Révisez les thèmes concernés'}</div>
        <button onClick={()=>{setIdx(0);setAnswered(null);setScore(0);setDone(false);}} style={{...s.btn(C),marginTop:16,padding:'10px 24px'}}>Recommencer</button>
      </div>
    </div>
  );
  return (
    <div style={{padding:'14px'}}>
      <div style={{display:'flex',justifyContent:'space-between',marginBottom:14}}>
        <span style={{color:T.muted,fontFamily:'monospace',fontSize:12}}>Question {idx+1}/{questions.length}</span>
        <span style={{color:C,fontFamily:'monospace',fontSize:12}}>Score : {score}</span>
      </div>
      <div style={{background:'#1e293b',borderRadius:4,height:4,marginBottom:16}}>
        <div style={{background:C,height:4,borderRadius:4,width:`${((idx)/(questions.length))*100}%`,transition:'width 0.3s'}}/>
      </div>
      <div style={s.card}>
        <div style={{color:T.text,fontSize:15,fontWeight:600,lineHeight:1.5,marginBottom:16}}>{q.q}</div>
        {q.opts.map((opt,i)=>{
          const isCorrect=i===q.rep, isSelected=answered===i;
          let bg=T.bg, borderColor=T.border, textColor=T.text;
          if(answered!==null){if(isCorrect){bg=C+'22';borderColor=C;textColor=C;}else if(isSelected){bg='#ef444422';borderColor='#ef4444';textColor='#ef4444';}else{textColor=T.muted;}}
          return (
            <button key={i} onClick={()=>handleAnswer(i)} style={{display:'flex',gap:10,alignItems:'center',width:'100%',background:bg,border:`1px solid ${borderColor}`,borderRadius:8,padding:'10px 12px',marginBottom:8,cursor:answered!==null?'default':'pointer',textAlign:'left',transition:'all 0.2s'}}>
              <div style={{width:24,height:24,borderRadius:'50%',background:borderColor+'33',border:`1.5px solid ${borderColor}`,display:'flex',alignItems:'center',justifyContent:'center',color:textColor,fontSize:12,fontWeight:700,flexShrink:0}}>{String.fromCharCode(65+i)}</div>
              <span style={{color:textColor,fontSize:13}}>{opt}</span>
            </button>
          );
        })}
        {answered!==null&&(
          <div style={{background:answered===q.rep?C+'18':'#ef444418',border:`1px solid ${answered===q.rep?C:'#ef4444'}44`,borderRadius:8,padding:'12px',marginTop:8,animation:'fadeIn 0.3s'}}>
            <div style={{color:answered===q.rep?C:'#ef4444',fontWeight:700,fontSize:13,marginBottom:5}}>
              {answered===q.rep?'✓ Bonne réponse !':'✗ Incorrect'}
            </div>
            <div style={{color:T.muted,fontSize:13,lineHeight:1.6}}>{q.expl}</div>
            <button onClick={next} style={{...s.btn(C),marginTop:10,padding:'8px 20px'}}>
              {idx<questions.length-1?'Question suivante →':'Voir les résultats'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

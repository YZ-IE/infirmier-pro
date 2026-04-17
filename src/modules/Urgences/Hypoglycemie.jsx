import { MedicalDisclaimer } from '../../components/MedicalDisclaimer.jsx';
import { T, s } from '../../theme.js';
const C = T.urg;
export default function Hypoglycemie() {
  return (
    <div style={{padding:'14px'}}>
      <MedicalDisclaimer level="standard" />
      <div style={{background:'#2a1a00',border:`1px solid ${T.form}44`,borderRadius:8,padding:'10px 14px',marginBottom:14}}>
        <div style={{color:T.form,fontWeight:700}}>Hypoglycémie sévère : glycémie &lt; 0,50 g/L (2,8 mmol/L)</div>
      </div>
      {[
        {title:'Patient CONSCIENT',color:'#22c55e',content:['Sucre en morceau : 3 morceaux ou 15g','Jus de fruit : 150 ml · Soda : 150 ml','Attendre 15 min · Resucrer si besoin','Collation pain + fromage après correction','Surveiller glycémie 30 min puis 1h']},
        {title:'Patient INCONSCIENT',color:'#ef4444',content:['NE PAS donner per os (fausse route)','G30% IV : 50-100 ml (1-2 ampoules) à passer rapidement','OU Glucagon IM/SC : 1 mg (adulte)','Récupération 10-15 min · Resucrer ensuite','Appeler le médecin · Rechercher la cause']},
        {title:'Surveillance post-correction',color:C,content:['Glycémie à 30 min, 1h, 2h','Rechercher facteur déclenchant (repas sauté, exercice, erreur insuline)','Adapter traitement si récidive','Éducation patient sur signes précoces','Prévenir médecin si glycémie réfractaire']},
      ].map((sec,i)=>(
        <div key={i} style={{...s.card,borderLeft:`3px solid ${sec.color}`}}>
          <div style={{color:sec.color,fontWeight:700,fontSize:14,marginBottom:8}}>{sec.title}</div>
          {sec.content.map((line,j)=><div key={j} style={{color:T.text,fontSize:13,marginBottom:3}}>• {line}</div>)}
        </div>
      ))}
    </div>
  );
}

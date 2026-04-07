import { T, s } from '../../theme.js';
const C = T.urg;
export default function DetressResp() {
  return (
    <div style={{padding:'14px'}}>
      {[
        {title:'OAP — Œdème Aigu du Poumon',color:'#8b5cf6',content:['Position assise jambes pendantes','O₂ haut débit (VNI si SpO₂ < 90%)','Furosémide IV : 40-80 mg selon prescription','Dérivés nitrés si PA > 100 mmHg (Risordan)','Scope · PA · SpO₂ · ECG · Prélèvements','Préparer VNI (PEP 5 cmH₂O, FiO₂ 40%)']},
        {title:'Bronchospasme / Asthme',color:'#06b6d4',content:['Salbutamol nébulisé : 5 mg (répétable)','O₂ pour maintenir SpO₂ > 94%','Corticoïdes : Méthylprednisolone 1 mg/kg IV','Si grave : Adrénaline SC 0,5 mg','Surveillance DEP, FR, tirage, SpO₂','Préparer intubation si aggravation']},
        {title:'SDRA — Syndrome de détresse resp. aiguë',color:'#ef4444',content:['O₂ · VNI ou intubation (prescription)','Position proclive 30°','Restriction hydrique modérée','Proning si prescrit (décubitus ventral)','Aspiration trachéale si intubé','Surveillance gazométrie, compliance']},
        {title:'Signes de gravité — APPELER EN URGENCE',color:'#f97316',content:['SpO₂ < 88% sous O₂','FR > 35/min ou < 8/min','Cyanose · Tirage important','Silence auscultatoire','Bradycardie ou trouble du rythme','Confusion · Épuisement']},
      ].map((sec,i)=>(
        <div key={i} style={{...s.card,borderLeft:`3px solid ${sec.color}`,marginBottom:10}}>
          <div style={{color:sec.color,fontWeight:700,fontSize:14,marginBottom:8}}>{sec.title}</div>
          {sec.content.map((line,j)=><div key={j} style={{color:T.text,fontSize:13,marginBottom:3}}>• {line}</div>)}
        </div>
      ))}
    </div>
  );
}

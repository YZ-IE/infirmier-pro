import { ClinicalSource } from '../../components/ClinicalSource.jsx';
import { MedicalDisclaimer } from '../../components/MedicalDisclaimer.jsx';
import { T, s } from '../../theme.js';
const C = T.urg;
export default function Anaphylaxie() {
  return (
    <div style={{padding:'14px'}}>
      <MedicalDisclaimer level="standard" />
      <div style={{background:'#450a0a',border:`1px solid ${C}44`,borderRadius:8,padding:'10px 14px',marginBottom:14}}>
        <div style={{color:'#ef4444',fontWeight:700}}>🚨 ADRÉNALINE = TRAITEMENT DE 1ère INTENTION</div>
        <div style={{color:T.muted,fontSize:12,marginTop:2}}>Ne jamais attendre pour injecter l&apos;adrénaline</div>
      </div>
      {[
        {title:'1. RECONNAÎTRE',color:'#f59e0b',content:['Urticaire généralisée · Angio-œdème','Bronchospasme · Stridor laryngé','Hypotension · Tachycardie','Troubles digestifs · Perte de conscience']},
        {title:'2. ADRÉNALINE IM',color:'#ef4444',content:['Adulte : 0,5 mg IM (face antérolatérale cuisse)','Enfant : 0,01 mg/kg IM (max 0,5 mg)','Auto-injecteur : Jext®/Anapen® (cuisse, directement)','Répéter si besoin après 5-15 min']},
        {title:'3. POSITION',color:C,content:['Allonger jambes surélevées (sauf dyspnée)','Assis si détresse respiratoire dominante','Ne pas lever si hypotension']},
        {title:'4. APPEL & O₂',color:C,content:['Appeler le 15 immédiatement','O₂ haut débit au masque 15 L/min','Scope · SaO₂ · PA · ECG']},
        {title:'5. VVP + REMPLISSAGE',color:C,content:['2 VVP G16 minimum','NaCl 0,9% : 500-1000 ml rapide si hypotension','Adrénaline IV si choc réfractaire : 0,1-1 mg/h SAP']},
        {title:'6. TRAITEMENTS 2e LIGNE',color:'#6366f1',content:['Corticoïdes : Méthylprednisolone 1-2 mg/kg IV (prévention rebond)','Antihistaminiques : Phénergan 25-50 mg IV lent','Salbutamol nébulisé si bronchospasme : 5 mg','Ne pas retarder l\'adrénaline pour ces traitements']},
      ].map((step,i)=>(
        <div key={i} style={{...s.card,borderLeft:`3px solid ${step.color}`,marginBottom:8}}>
          <div style={{color:step.color,fontWeight:700,fontSize:14,marginBottom:8}}>{step.title}</div>
          {step.content.map((line,j)=><div key={j} style={{color:T.text,fontSize:13,padding:'2px 0'}}>• {line}</div>)}
        </div>
      ))}
      <ClinicalSource sourceKey="ANAPHYLAXIE" />
    </div>
  );
}

import { ClinicalSource } from '../../components/ClinicalSource.jsx';
import { MedicalDisclaimer } from '../../components/MedicalDisclaimer.jsx';
import { useState } from 'react';
import { T, s } from '../../theme.js';
const C = T.urg;

export default function RCP() {
  const [phase, setPhase] = useState('bls'); // bls=basique, acls=avancé, drugs=médicaments

  const BLS = [
    {num:1,title:'SÉCURITÉ',color:'#22c55e',steps:['Sécuriser la zone','Se protéger (gants)','Évaluer les dangers environnants']},
    {num:2,title:'ÉVALUATION',color:C,steps:['Appeler : "Ça va ?"','Secouer les épaules doucement','Si pas de réponse → ALERTE']},
    {num:3,title:'ALERTE',color:C,steps:['Appeler le 15 (SAMU) ou 18 (SDIS)','Demander défibrillateur','Ne pas laisser la victime seule si possible']},
    {num:4,title:'LIBÉRER LES VOIES',color:C,steps:['Basculer tête en arrière','Soulever le menton','Retirer corps étranger visible']},
    {num:5,title:'ÉVALUER LA RESPIRATION',color:C,steps:['Regarder le thorax','Écouter','Sentir — max 10 secondes','Gasps = arrêt cardiaque !']},
    {num:6,title:'MCE — 30 COMPRESSIONS',color:'#ef4444',steps:['Talon de la main sur sternum','Dépression 5-6 cm','Fréquence : 100-120/min','Bras tendus, épaules au-dessus','Relâchement complet entre compressions']},
    {num:7,title:'2 INSUFFLATIONS',color:'#f97316',steps:['Maintenir bascule tête','Pincer les narines','Souffler 1 seconde','Voir le thorax se soulever','Si impossible : compressions seules']},
    {num:8,title:'CONTINUER 30:2',color:'#ef4444',steps:['Alterner 30 compressions / 2 insufflations','Changer de sauveteur toutes les 2 min','Ne pas interrompre plus de 10 secondes','Utiliser DAE dès disponible']},
  ];

  const DRUGS_RCP = [
    {drug:'Adrénaline',dose:'1 mg IV/IO',timing:'Dès que voie disponible, puis toutes les 3-5 min',note:'Diluée dans 20 ml NaCl 0,9% + flush'},
    {drug:'Amiodarone',dose:'300 mg IV/IO en bolus',timing:'Après 3e choc si FV/TV réfractaire',note:'Diluer dans 20 ml G5%. 2e dose 150 mg si nécessaire'},
    {drug:'Bicarbonate Na',dose:'1 mEq/kg IV',timing:'Arrêt prolongé > 15 min ou hyperkaliémie',note:'Après ROSC si pH < 7,1'},
    {drug:'Atropine',dose:'Non recommandée en routine',timing:'—',note:'Peut être utilisée pour bradycardie post-ROSC'},
    {drug:'Magnésium',dose:'2 g IV en 10 min',timing:'Torsades de pointes',note:'Dilué dans 10 ml G5%'},
    {drug:'Calcium gluconate',dose:'1 g IV lent',timing:'Hyperkaliémie / Hypocalcémie / Toxicité anti-calciques',note:'Voie dédiée'},
  ];

  return (
    <div style={{padding:'14px'}}>
      <MedicalDisclaimer level="standard" />
      <div style={{background:'#450a0a',border:`1px solid ${C}44`,borderRadius:8,padding:'10px 14px',marginBottom:14,textAlign:'center'}}>
        <div style={{color:'#ef4444',fontWeight:700,fontSize:14}}>🚨 ARRÊT CARDIO-RESPIRATOIRE</div>
        <div style={{color:T.muted,fontSize:12,marginTop:2}}>Appeler le 15 · Demander le chariot d&apos;urgence et le DEA</div>
      </div>

      <div style={{display:'flex',gap:7,marginBottom:14}}>
        {[['bls','BLS Basique'],['acls','ACLS Avancé'],['drugs','Médicaments']].map(([id,lbl])=>(
          <button key={id} onClick={()=>setPhase(id)} style={{...s.btn(phase===id?C:T.muted),flex:1,fontSize:11,padding:'8px 4px',background:phase===id?C+'22':T.surface,borderColor:phase===id?C:T.border,color:phase===id?C:T.muted}}>{lbl}</button>
        ))}
      </div>

      {phase==='bls' && BLS.map((step,i)=>(
        <div key={i} style={{...s.card,borderLeft:`3px solid ${step.color}`,marginBottom:8}}>
          <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:7}}>
            <div style={{background:step.color+'33',border:`1px solid ${step.color}`,borderRadius:'50%',width:28,height:28,display:'flex',alignItems:'center',justifyContent:'center',color:step.color,fontWeight:700,fontSize:13,flexShrink:0}}>{step.num}</div>
            <div style={{color:step.color,fontWeight:700,fontSize:14}}>{step.title}</div>
          </div>
          {step.steps.map((st,j)=><div key={j} style={{color:T.text,fontSize:13,padding:'3px 0',borderBottom:j<step.steps.length-1?'1px solid #334155':'none'}}>• {st}</div>)}
        </div>
      ))}

      {phase==='acls' && (
        <div>
          <div style={{...s.card,borderLeft:`3px solid ${C}`}}>
            <div style={{color:C,fontWeight:700,fontSize:14,marginBottom:10}}>Algorithme ACLS simplifié</div>
            {[
              ['Rythme choquable ?','FV / TV sans pouls → Choc 200J biphasique → MCE 2min → Adrénaline 1mg → Choc si nécessaire'],
              ['Rythme non choquable ?','Asystolie / DEM → MCE continu → Adrénaline 1mg dès que possible → Toutes les 3-5 min'],
              ['Causes réversibles (4H-4T)','Hypoxie · Hypovolémie · Hypo/Hyperkaliémie · Hypothermie\nTamponnade · Pneumo-T · Thrombose coronaire · Thrombose pulmonaire'],
              ['Post-ROSC (retour circulation)','O₂ pour SpO₂ 94-98% · PA systolique > 90 mmHg · Hypothermie thérapeutique si comateux · ECG 12D'],
            ].map(([titre, contenu],i)=>(
              <div key={i} style={{marginBottom:12,paddingBottom:12,borderBottom:i<3?'1px solid #334155':'none'}}>
                <div style={{color:C,fontFamily:'monospace',fontSize:12,marginBottom:4}}>{titre}</div>
                <div style={{color:T.text,fontSize:13,lineHeight:1.6,whiteSpace:'pre-wrap'}}>{contenu}</div>
              </div>
            ))}
          </div>
          <div style={{...s.card,background:'#0c3a4a',border:`1px solid ${T.soins}33`}}>
            <div style={{color:T.soins,fontFamily:'monospace',fontSize:11,marginBottom:8}}>ACCÈS VASCULAIRE</div>
            <div style={{color:T.muted,fontSize:13,lineHeight:1.8}}>
              1️⃣ VVP en premier (antécubital ou jugulaire externe)<br/>
              2️⃣ Voie IO si VVP impossible (tibia proximal, humérus)<br/>
              3️⃣ KTC en dernier recours (ne pas retarder les chocs)
            </div>
          </div>
        </div>
      )}

      {phase==='drugs' && DRUGS_RCP.map((d,i)=>(
        <div key={i} style={{...s.card,borderLeft:`3px solid ${C}`}}>
          <div style={{display:'flex',justifyContent:'space-between',marginBottom:6}}>
            <span style={{color:C,fontWeight:700,fontSize:14}}>{d.drug}</span>
            <span style={{color:T.text,fontFamily:'monospace',fontSize:12}}>{d.dose}</span>
          </div>
          <div style={{color:T.muted,fontSize:12,marginBottom:4}}>⏱ {d.timing}</div>
          <div style={{color:T.text,fontSize:12,fontFamily:'monospace'}}>📋 {d.note}</div>
        </div>
      ))}
      <ClinicalSource sourceKey="RCP" />
    </div>
  );
}

import { useState } from 'react';
import { T, s } from '../../theme.js';
const C = T.soins;
const TUBES = [
  {couleur:'🟡',nom:'Citrate (bleu clair)',usage:'Coagulation : TP, TCA, Fibrinogène, D-dimères',anticoag:'Citrate de sodium 3,2%',volume:'2,7 ou 4,5 ml',note:'Remplir exactement au trait (ratio sang/anticoag crucial)',ordre:1},
  {couleur:'🔴',nom:'Sec (rouge / moucheté)',usage:'Biochimie, sérologies, enzymes cardiaques',anticoag:'Aucun (± activateur coagulation)',volume:'5-10 ml',note:'Attendre 30 min avant centrifugation',ordre:2},
  {couleur:'🟠',nom:'Gel + Activateur (or / jaune)',usage:'Biochimie, hormones, sérologies',anticoag:'Gel séparateur',volume:'5-8 ml',note:'Retourner 5x après prélèvement',ordre:3},
  {couleur:'🟢',nom:'Hépariné (vert)',usage:'Ionogramme, gazométrie, ammoniémie',anticoag:'Héparine de lithium',volume:'4-6 ml',note:'Retourner 8-10x · Traitement rapide pour ionogramme',ordre:4},
  {couleur:'🟣',nom:'EDTA (violet / lavande)',usage:'NFS, groupage, HbA1c, réticulocytes',anticoag:'EDTA K3',volume:'2-4 ml',note:'Retourner 8-10x · Ne pas secouer',ordre:5},
  {couleur:'🩶',nom:'Fluorure (gris)',usage:'Glycémie, lactates (arrêt glycolyse)',anticoag:'Fluorure de sodium',volume:'2 ml',note:'Retourner 8-10x · Traitement rapide (30 min)',ordre:6},
];
const ORDER_RULE = 'Hémocultures → Citrate (bleu) → Sec/Gel (rouge/or) → Héparine (vert) → EDTA (violet) → Fluorure (gris)';
export default function PrelevementsSang() {
  const [tab,setTab]=useState('tubes');
  return (
    <div style={{padding:'14px'}}>
      <div style={{display:'flex',gap:7,marginBottom:14}}>
        {[['tubes','Tubes & Analyses'],['ordre','Ordre de prélèvement'],['technique','Technique']].map(([id,lbl])=>(
          <button key={id} onClick={()=>setTab(id)} style={{...s.btn(tab===id?C:T.muted),flex:1,fontSize:11,padding:'8px 4px',background:tab===id?C+'22':T.surface,borderColor:tab===id?C:T.border,color:tab===id?C:T.muted}}>{lbl}</button>
        ))}
      </div>
      {tab==='tubes'&&(
        <div>
          {TUBES.map(t=>(
            <div key={t.nom} style={{...s.card,marginBottom:8}}>
              <div style={{display:'flex',gap:10,alignItems:'center',marginBottom:7}}>
                <span style={{fontSize:22}}>{t.couleur}</span>
                <div>
                  <div style={{color:C,fontWeight:700,fontSize:13}}>{t.nom}</div>
                  <div style={{color:T.muted,fontSize:11}}>{t.volume} · Ordre {t.ordre}</div>
                </div>
              </div>
              <div style={{color:T.text,fontSize:13,marginBottom:4}}>{t.usage}</div>
              <div style={{color:T.muted,fontSize:12,fontStyle:'italic'}}>{t.note}</div>
            </div>
          ))}
        </div>
      )}
      {tab==='ordre'&&(
        <div>
          <div style={s.card}>
            <div style={{color:C,fontFamily:'monospace',fontSize:11,letterSpacing:2,marginBottom:12}}>ORDRE DE REMPLISSAGE</div>
            <div style={{color:T.muted,fontSize:12,marginBottom:14,lineHeight:1.6}}>Respecter l&apos;ordre pour éviter la contamination croisée des anticoagulants</div>
            {TUBES.sort((a,b)=>a.ordre-b.ordre).map((t,i)=>(
              <div key={t.nom} style={{display:'flex',gap:12,alignItems:'center',marginBottom:10,paddingBottom:10,borderBottom:i<TUBES.length-1?'1px solid #334155':'none'}}>
                <div style={{background:C+'33',border:`1px solid ${C}`,borderRadius:'50%',width:28,height:28,display:'flex',alignItems:'center',justifyContent:'center',color:C,fontWeight:700,flexShrink:0}}>{t.ordre}</div>
                <div>
                  <div style={{fontSize:20}}>{t.couleur}</div>
                </div>
                <div>
                  <div style={{color:T.text,fontSize:13,fontWeight:600}}>{t.nom}</div>
                  <div style={{color:T.muted,fontSize:11}}>{t.usage.split(',')[0]}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{background:'#0c3a4a',border:`1px solid ${C}33`,borderRadius:8,padding:'10px 14px'}}>
            <div style={{color:C,fontSize:12,fontFamily:'monospace',marginBottom:4}}>MÉMO</div>
            <div style={{color:T.text,fontSize:12,lineHeight:1.6}}>{ORDER_RULE}</div>
          </div>
        </div>
      )}
      {tab==='technique'&&(
        <div>
          <div style={s.card}>
            <div style={{color:C,fontFamily:'monospace',fontSize:11,letterSpacing:2,marginBottom:10}}>PROCÉDURE DE PRÉLÈVEMENT</div>
            {[
              'Vérifier prescription + identité (bracelet + demander nom/date naissance)','Matériel : garrot, aiguille G20-G21, corps de pompe, tubes, compresses, étiquettes',
              'Poser le garrot 10 cm au-dessus · Maximum 1 minute (risque hémolyse)','Palper et choisir la veine · Désinfecter 30s · Sécher 30s',
              'Ponction veine à 15-30° biseau vers le haut','Vérifier reflux → brancher les tubes dans l\'ordre',
              'Retourner chaque tube selon nombre recommandé (pas de secousse vigoureuse)','Relâcher garrot · Retirer aiguille · Comprimer sans frotter (risque hémolyse)',
              'Étiqueter immédiatement au chevet du patient','Acheminer selon délais (gazométrie glace immédiate, certains tubes réfrigérés)',
            ].map((step,i)=>(
              <div key={i} style={{display:'flex',gap:10,marginBottom:8}}>
                <div style={{background:C+'33',border:`1px solid ${C}`,borderRadius:'50%',width:24,height:24,display:'flex',alignItems:'center',justifyContent:'center',color:C,fontWeight:700,fontSize:11,flexShrink:0}}>{i+1}</div>
                <div style={{color:T.text,fontSize:13,lineHeight:1.4,paddingTop:2}}>{step}</div>
              </div>
            ))}
          </div>
          <div style={{...s.card,borderLeft:`3px solid ${T.iatr}`}}>
            <div style={{color:T.iatr,fontWeight:700,fontSize:13,marginBottom:8}}>⚠️ Causes d&apos;hémolyse à éviter</div>
            {['Garrot posé trop longtemps (> 1 min)','Secouer vigoureusement les tubes','Aiguille trop fine (< G22) ou trop grande pression','Prélèvement sur cathéter (1er ml jeté)','Tube sous-rempli ou sur-rempli','Température extrême lors du transport'].map((l,i)=>(
              <div key={i} style={{color:T.muted,fontSize:13,marginBottom:4}}>• {l}</div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

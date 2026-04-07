import { T, s } from '../../theme.js';
const C = T.soins;
export default function Sondage() {
  return (
    <div style={{padding:'14px'}}>
      <div style={{background:'#431407',border:`1px solid #f9730044`,borderRadius:8,padding:'10px 14px',marginBottom:14}}>
        <div style={{color:'#f97316',fontWeight:700,fontSize:13}}>⚠️ Geste aseptique strict — Risque d&apos;infection urinaire (EBLSE)</div>
      </div>
      <div style={s.card}>
        <div style={{color:C,fontFamily:'monospace',fontSize:11,letterSpacing:2,marginBottom:10}}>CHOIX DE LA SONDE</div>
        {[['Femme adulte','CH 14-16 (12-14 si ménopause)'],['Homme adulte','CH 16-18 (Tiemann si obstacle)'],['Enfant','CH selon âge : CH 6-10'],['Drainage prolongé','Sonde à ballonnet 2 voies (Foley)'],['Irrigation vésicale','Sonde à ballonnet 3 voies']].map(([type,taille])=>(
          <div key={type} style={{display:'flex',gap:10,marginBottom:7,paddingBottom:7,borderBottom:'1px solid #334155'}}>
            <span style={{color:C,minWidth:130,fontSize:13}}>{type}</span>
            <span style={{color:T.text,fontSize:13}}>{taille}</span>
          </div>
        ))}
      </div>
      <div style={s.card}>
        <div style={{color:C,fontFamily:'monospace',fontSize:11,letterSpacing:2,marginBottom:10}}>PROCÉDURE (ASEPSIE STRICTE)</div>
        {[
          'Vérifier prescription + identité + allergies (latex, antiseptiques)','Informer et installer : décubitus dorsal, champ sous les fesses',
          'Ouvrir le kit stérile sans contaminer · Enfiler gants stériles',
          'FEMME : Nettoyer vulve en essuyant de avant en arrière (5 mouvements)','HOMME : Décalotter, nettoyer le méat, tenir le pénis à 90°',
          'Introduire la sonde avec gel lidocaïne · FEMME : 5-7 cm · HOMME : 15-20 cm',
          'Vérifier le reflux d\'urine · Gonfler le ballonnet (10 ml eau stérile)','Raccorder au système de drainage clos · Fixer à la cuisse',
          'Étiqueter : date, heure, opérateur · Tracer dans le dossier',
        ].map((step,i)=>(
          <div key={i} style={{display:'flex',gap:10,marginBottom:8}}>
            <div style={{background:C+'33',border:`1px solid ${C}`,borderRadius:'50%',width:24,height:24,display:'flex',alignItems:'center',justifyContent:'center',color:C,fontWeight:700,fontSize:11,flexShrink:0}}>{i+1}</div>
            <div style={{color:T.text,fontSize:13,lineHeight:1.4,paddingTop:2}}>{step}</div>
          </div>
        ))}
      </div>
      <div style={s.card}>
        <div style={{color:C,fontFamily:'monospace',fontSize:11,letterSpacing:2,marginBottom:8}}>SURVEILLANCE QUOTIDIENNE</div>
        {['Bilan entrées/sorties toutes les 8h','Aspect des urines : couleur, turbidité, hématurie','Soin méat 2x/j : nettoyage eau + savon','Éviter les coudures, maintenir le sac sous la vessie','Changer la sonde selon protocole (silicone : 4-6 semaines)','Retrait dès que possible (risque EBLSE par jour de sondage)'].map((line,i)=>(
          <div key={i} style={{color:T.muted,fontSize:13,marginBottom:4}}>• {line}</div>
        ))}
      </div>
    </div>
  );
}

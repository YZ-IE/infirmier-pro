import { T, s } from '../../theme.js';
const C = T.soins;
export default function PoseNGS() {
  return (
    <div style={{padding:'14px'}}>
      <div style={{...s.card}}>
        <div style={{color:C,fontFamily:'monospace',fontSize:11,letterSpacing:2,marginBottom:10}}>MESURE DE LA SONDE</div>
        <div style={{color:T.muted,fontSize:13,lineHeight:1.7}}>
          Méthode NEX : Nez → Oreille → Xyphoïde<br/>
          Adulte : généralement 55-65 cm<br/>
          Marquer à la sonde avec du sparadrap
        </div>
      </div>
      <div style={s.card}>
        <div style={{color:C,fontFamily:'monospace',fontSize:11,letterSpacing:2,marginBottom:10}}>PROCÉDURE</div>
        {['Patient semi-assis à 45° ou assis si possible','Lubrifier la sonde avec gel hydrosoluble (lidocaïne si disponible)','Introduire par la narine la plus dégagée · Diriger vers le bas',
          'À l\'oropharynx : demander d\'avaler · Avancer doucement lors des déglutitions','Ne pas forcer si résistance · Retirer et réessayer · Changer de narine si nécessaire',
          'Stopper à la marque · Vérifier la position AVANT tout usage'
        ].map((step,i)=>(
          <div key={i} style={{display:'flex',gap:10,marginBottom:8}}>
            <div style={{background:C+'33',border:`1px solid ${C}`,borderRadius:'50%',width:24,height:24,display:'flex',alignItems:'center',justifyContent:'center',color:C,fontWeight:700,fontSize:11,flexShrink:0}}>{i+1}</div>
            <div style={{color:T.text,fontSize:13,lineHeight:1.4,paddingTop:2}}>{step}</div>
          </div>
        ))}
      </div>
      <div style={{...s.card,borderLeft:`3px solid #ef4444`}}>
        <div style={{color:'#ef4444',fontWeight:700,fontSize:13,marginBottom:8}}>VÉRIFICATION DE POSITION — OBLIGATOIRE</div>
        {[
          ['Radiographie thoracique','Seule méthode fiable à 100% · Extrémité sous le diaphragme'],
          ['Aspiration gastrique','pH ≤ 5 = probablement gastrique (attention si IPP ou alcalose)'],
          ['Méthode CO₂','Capnomètre : absence CO₂ = dans estomac (pas dans poumon)'],
          ['Insufflation air','Non recommandée seule (peu fiable) · Bruit de gargouillis non suffisant'],
        ].map(([met,detail])=>(
          <div key={met} style={{marginBottom:9,paddingBottom:9,borderBottom:'1px solid #334155'}}>
            <div style={{color:T.text,fontWeight:600,fontSize:13,marginBottom:2}}>{met}</div>
            <div style={{color:T.muted,fontSize:12}}>{detail}</div>
          </div>
        ))}
        <div style={{color:'#ef4444',fontSize:12,marginTop:4}}>⚠️ Ne jamais administrer sans vérification de position — risque de pneumopathie d&apos;inhalation</div>
      </div>
      <div style={s.card}>
        <div style={{color:C,fontFamily:'monospace',fontSize:11,letterSpacing:2,marginBottom:8}}>SURVEILLANCE</div>
        {['Marquer le repère narine et vérifier à chaque prise en charge','Vérifier position avant chaque administration','Rincer avec 20 ml eau avant et après chaque utilisation','Soins de narine quotidiens : nettoyage + fixer sans tirer','Changer la sonde selon protocole (PVC : 7j, Silicone : 30j)'].map((l,i)=>(
          <div key={i} style={{color:T.muted,fontSize:13,marginBottom:4}}>• {l}</div>
        ))}
      </div>
    </div>
  );
}

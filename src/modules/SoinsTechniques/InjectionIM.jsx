import { T, s } from '../../theme.js';
const C = T.soins;
export default function InjectionIM() {
  return (
    <div style={{padding:'14px'}}>
      {[
        { title:'Sites d\'injection IM', color:C, items:[
          ['Deltoïde (épaule)','Volumes ≤ 1 ml · Muscle accessible · Éviter si petit volume musculaire'],
          ['Vastus lateralis (cuisse)','Site universel · Enfants, nourrissons, personnes âgées · Volume ≤ 5 ml'],
          ['Ventroglutéal','Site le plus sûr IM · Volume ≤ 5 ml · Pas de risque nerf sciatique'],
          ['Dorsoglutéal (fesse)','À éviter (risque nerf sciatique) · Quadrant supéro-externe si nécessaire'],
        ]},
        { title:'Volumes maximaux par site', color:'#f59e0b', items:[
          ['Deltoïde','1 ml adulte · 0,5 ml enfant'],
          ['Vastus lateralis','5 ml adulte · 1-3 ml enfant · 0,5-1 ml nourrisson'],
          ['Ventroglutéal','5 ml adulte'],
          ['Dorsoglutéal','5 ml adulte (déconseillé)'],
        ]},
        { title:'Technique d\'injection IM', color:C, items:[
          ['Matériel','Seringue + aiguille IM verte G21 (38 mm) ou blanche G19 (40 mm)'],
          ['Désinfection','Friction antiseptique 30s + séchage 30s'],
          ['Angle','90° perpendiculaire à la peau'],
          ['Aspiration','Avant injection : aspirer pour vérifier absence de vaisseau'],
          ['Injection','Lente (1 ml / 10 sec) · Retrait rapide'],
          ['Massage','Leger massage sauf médicaments spécifiques (héparine, insuline)'],
        ]},
      ].map((sec,i)=>(
        <div key={i} style={{...s.card,marginBottom:10}}>
          <div style={{color:sec.color,fontFamily:'monospace',fontSize:11,letterSpacing:2,marginBottom:10}}>{sec.title}</div>
          {sec.items.map(([titre,detail])=>(
            <div key={titre} style={{marginBottom:8,paddingBottom:8,borderBottom:'1px solid #1e293b'}}>
              <div style={{color:sec.color,fontSize:13,fontWeight:600,marginBottom:3}}>{titre}</div>
              <div style={{color:T.muted,fontSize:12}}>{detail}</div>
            </div>
          ))}
        </div>
      ))}
      <div style={{...s.card,borderLeft:`3px solid ${T.iatr}`}}>
        <div style={{color:T.iatr,fontFamily:'monospace',fontSize:11,marginBottom:8}}>INJECTION SOUS-CUTANÉE (SC)</div>
        {[['Sites SC','Abdomen (éviter ombilic) · Face externe cuisse · Face externe bras'],['Aiguille','G26 orange (8 mm) ou G25 (16 mm)'],['Angle','45° ou 90° si pli cutané maintenu'],['Volume','Max 1-1,5 ml · Aspiration NON recommandée pour héparine/insuline'],['Rotation','Rotation systématique des sites (lipodystrophies)']].map(([t,d])=>(
          <div key={t} style={{display:'flex',gap:10,marginBottom:6}}>
            <span style={{color:T.iatr,fontSize:12,minWidth:80}}>{t}</span>
            <span style={{color:T.muted,fontSize:12}}>{d}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

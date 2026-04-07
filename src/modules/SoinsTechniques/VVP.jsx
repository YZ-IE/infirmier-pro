import { T, s } from '../../theme.js';
const C = T.soins;
const CALIBRES = [
  {g:'G14',color:'#f97316',diam:'2,1 mm',debit:'330 ml/min',usage:'Trauma, chirurgie majeure, transfusion rapide'},
  {g:'G16',color:'#94a3b8',diam:'1,7 mm',debit:'210 ml/min',usage:'Choc, transfusion, remplissage rapide'},
  {g:'G18',color:'#22c55e',diam:'1,3 mm',debit:'96 ml/min',usage:'Standard urgence, transfusion, produits visqueux'},
  {g:'G20',color:'#f59e0b',diam:'1,1 mm',debit:'61 ml/min',usage:'Soins courants, antibiotiques, adulte standard'},
  {g:'G22',color:'#60a5fa',diam:'0,9 mm',debit:'36 ml/min',usage:'Veines fragiles, personnes âgées, enfants'},
  {g:'G24',color:'#c084fc',diam:'0,7 mm',debit:'24 ml/min',usage:'Nouveau-nés, prématurés, veines très fines'},
];
const SITES = [
  {site:'Pli du coude (antécubital)',pref:'⭐⭐⭐',note:'Meilleur débit · Gêne à la flexion'},
  {site:'Avant-bras (céphalique/basilique)',pref:'⭐⭐⭐',note:'Confort maximal · Site privilégié'},
  {site:'Dos de la main',pref:'⭐⭐',note:'Accessible · Douloureux · Veines fines'},
  {site:'Jugulaire externe',pref:'⭐⭐',note:'Urgence si autres inaccessibles · Médecin requis'},
  {site:'Pied / cheville',pref:'⭐',note:'Dernier recours · Risque thrombose · Immobilisant'},
];
export default function VVP() {
  return (
    <div style={{padding:'14px'}}>
      {/* Choix du calibre */}
      <div style={s.card}>
        <div style={{color:C,fontFamily:'monospace',fontSize:11,letterSpacing:2,marginBottom:12}}>CHOIX DU CALIBRE</div>
        {CALIBRES.map(c=>(
          <div key={c.g} style={{display:'flex',gap:10,alignItems:'center',marginBottom:9,paddingBottom:9,borderBottom:'1px solid #1e293b'}}>
            <div style={{background:c.color+'33',border:`2px solid ${c.color}`,borderRadius:6,padding:'4px 8px',fontFamily:'monospace',fontWeight:700,fontSize:13,color:c.color,minWidth:44,textAlign:'center'}}>{c.g}</div>
            <div style={{flex:1}}>
              <div style={{color:T.text,fontSize:12,fontWeight:600}}>{c.usage}</div>
              <div style={{color:T.muted,fontSize:11}}>{c.diam} · {c.debit}</div>
            </div>
          </div>
        ))}
      </div>
      {/* Sites de ponction */}
      <div style={s.card}>
        <div style={{color:C,fontFamily:'monospace',fontSize:11,letterSpacing:2,marginBottom:10}}>SITES DE PONCTION</div>
        {SITES.map(st=>(
          <div key={st.site} style={{marginBottom:9,paddingBottom:9,borderBottom:'1px solid #1e293b'}}>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:3}}>
              <span style={{color:T.text,fontSize:13,fontWeight:600}}>{st.site}</span>
              <span style={{fontSize:12}}>{st.pref}</span>
            </div>
            <div style={{color:T.muted,fontSize:12}}>{st.note}</div>
          </div>
        ))}
      </div>
      {/* Procédure */}
      <div style={s.card}>
        <div style={{color:C,fontFamily:'monospace',fontSize:11,letterSpacing:2,marginBottom:10}}>PROCÉDURE DE POSE</div>
        {[
          'Vérifier prescription · Hygiène des mains · EPI','Choisir cathéter adapté + garrot + compresses + antiseptique',
          'Poser le garrot 10 cm au-dessus du site · Palper la veine','Désinfecter : friction 30s + séchage 30s (sans recontaminer)',
          'Cathéter à 15-30° biseau vers le haut · Avancer jusqu\'au reflux','Avancer le cathéter sur la veine · Retirer le mandrin · Relâcher garrot',
          'Connecter la tubulure · Vérifier le passage (reflux, absence douleur)','Fixer avec film transparent stérile · Dater et signer',
          'Jeter l\'aiguille dans le DASRI sans recapuchonner','Tracer dans le dossier : date, site, calibre, opérateur',
        ].map((step,i)=>(
          <div key={i} style={{display:'flex',gap:10,marginBottom:8}}>
            <div style={{background:C+'33',border:`1px solid ${C}`,borderRadius:'50%',width:24,height:24,display:'flex',alignItems:'center',justifyContent:'center',color:C,fontWeight:700,fontSize:11,flexShrink:0}}>{i+1}</div>
            <div style={{color:T.text,fontSize:13,lineHeight:1.4,paddingTop:2}}>{step}</div>
          </div>
        ))}
      </div>
      {/* Surveillance */}
      <div style={{background:'#0c3a4a',border:`1px solid ${C}33`,borderRadius:8,padding:'12px 14px'}}>
        <div style={{color:C,fontFamily:'monospace',fontSize:11,marginBottom:8}}>SURVEILLANCE ET CHANGEMENT</div>
        {['Inspecter le site 2x/jour : rougeur, œdème, douleur, fuite','Changer le site toutes les 72-96h (ou si signes d\'inflammation)','Purger la tubulure toutes les 24h','Documenter tout signe de phlébite (grade I à IV)'].map((line,i)=>(
          <div key={i} style={{color:T.muted,fontSize:13,marginBottom:4}}>• {line}</div>
        ))}
      </div>
    </div>
  );
}

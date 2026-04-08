import { useState, useEffect } from 'react';
import { T } from './theme.js';
import Iatrogenique from './modules/Iatrogenique/index.jsx';
import Urgences from './modules/Urgences/index.jsx';
import Scores from './modules/Scores/index.jsx';
import Soins from './modules/Soins/index.jsx';
import Organisation from './modules/Organisation/index.jsx';
import Formation from './modules/Formation/index.jsx';
import ECG from './modules/ECG/index.jsx';
import AideMemoire from './modules/AideMemoire/index.jsx';

const MODULES = [
  { id:'iatr',  label:'Iatrogénie',   icon:'💊', color:T.iatr,  desc:'Doses · Débits · SAP · Interactions · Opioïdes' },
  { id:'urg',   label:'Urgences',     icon:'🚨', color:T.urg,   desc:'RCP · AVC · Anaphylaxie · Sepsis' },
  { id:'score', label:'Scores',       icon:'📊', color:T.score, desc:'Glasgow · EVA · GDS · NIHSS · Wells · PHQ-9' },
  { id:'ecg',   label:'ECG',          icon:'💓', color:'#00e676', desc:'Rythmes · Tracés interactifs · Quiz · Assistant IA', badge:'NOUVEAU' },
  { id:'soins', label:'Soins',        icon:'💉', color:T.soins, desc:'Pansements · PAC · Piccline · Dialyse · Timers' },
  { id:'orga',  label:'Organisation', icon:'📋', color:T.orga,  desc:'Planning · SBAR · Transmissions' },
  { id:'form',  label:'Formation',    icon:'🎓', color:T.form,  desc:'Quiz · Cas cliniques · Assistant IA' },
  { id: 'aidemem', label: 'Aide-Mémoire', color: '#6366f1', icon: '📋' },
];

// Index de recherche globale : (terme → module + sous-section)
const SEARCH_INDEX = [
  // Scores
  { q:['glasgow','gcs','conscience','coma'], mod:'score', label:'Glasgow (GCS)' },
  { q:['gds','gaz du sang','ph','pao2','paco2','hco3','acidose','alcalose','oxygène'], mod:'score', label:'GDS — Gaz du sang' },
  { q:['nihss','avc','stroke','neurologique','déficit'], mod:'score', label:'NIHSS — AVC' },
  { q:['wells','tvp','ep','embolie','thrombose','phlébite'], mod:'score', label:'Wells TVP / EP' },
  { q:['ciwa','sevrage','alcool','éthylique','delirium tremens'], mod:'score', label:'CIWA-Ar — Sevrage alcool' },
  { q:['psi','port','pneumonie','pneumopathie'], mod:'score', label:'PSI/PORT — Pneumonie' },
  { q:['eva','douleur','en','echelle'], mod:'score', label:'Douleur EVA/EN' },
  { q:['qsofa','sepsis','infection'], mod:'score', label:'qSOFA' },
  { q:['sofa','réanimation','défaillance'], mod:'score', label:'SOFA' },
  { q:['news2','détérioration','monitoring'], mod:'score', label:'NEWS2' },
  { q:['braden','norton','escarre','escarres'], mod:'score', label:'Braden / Norton — Escarres' },
  { q:['morse','chute','risque chute'], mod:'score', label:'Morse — Chute' },
  { q:['mmse','cognitif','démence','alzheimer'], mod:'score', label:'MMSE — Cognitif' },
  { q:['cam','délirium','confusion'], mod:'score', label:'CAM — Délirium' },
  // Iatrogénie
  { q:['dose','doses','calcul','mg/kg'], mod:'iatr', label:'Calcul de doses' },
  { q:['débit','perfusion','gouttes','ml/h'], mod:'iatr', label:'Débit de perfusion' },
  { q:['sap','seringue','autopousseuse'], mod:'iatr', label:'Seringue auto-pousseuse' },
  { q:['interaction','médicament','médicamenteux'], mod:'iatr', label:'Interactions médicamenteuses' },
  { q:['reconstitution','antibiotique','dilution'], mod:'iatr', label:'Reconstitution antibiotiques' },
  { q:['compatibilité','iv','perfusion y'], mod:'iatr', label:'Compatibilités IV en Y' },
  { q:['nutrition','parentérale','entérale','harris','calories','protéines','osmolarité'], mod:'iatr', label:'Nutrition parentérale/entérale' },
  { q:['pédiatrique','pédiatrie','enfant','nourrisson','mg/kg','imc','intubation enfant'], mod:'iatr', label:'Calculateur pédiatrique' },
  // Urgences
  { q:['rcp','arrêt cardiaque','réanimation','acr'], mod:'urg', label:'RCP' },
  { q:['anaphylaxie','allergie','choc allergique','adrénaline'], mod:'urg', label:'Anaphylaxie' },
  { q:['sepsis','choc septique'], mod:'urg', label:'Sepsis' },
  { q:['avc','stroke','hémiplégie'], mod:'urg', label:'AVC' },
  { q:['hypoglycémie','glycémie','sucre'], mod:'urg', label:'Hypoglycémie' },
  { q:['convulsion','épilepsie','état de mal'], mod:'urg', label:'Convulsions' },
  { q:['oap','oedème pulmonaire','détresse respiratoire'], mod:'urg', label:'OAP / Détresse respiratoire' },
  // Soins
  { q:['timer','chrono','temps','antiseptique','durée perfusion'], mod:'soins', label:'Timers de soins' },
  { q:['pansement','plaie','escarre','cicatrice'], mod:'soins', label:'Pansements' },
  { q:['piccline','midline','voie centrale','picc'], mod:'soins', label:'Piccline / Midline' },
  { q:['pac','chambre implantable','port-à-cath'], mod:'soins', label:'PAC — Chambre implantable' },
  { q:['kta','cathéter artériel','pai'], mod:'soins', label:'KTA — Cathéter artériel' },
  { q:['dialyse','hémodialyse','rein','eerc'], mod:'soins', label:'Dialyse' },
  // Organisation
  { q:['sbar','transmission','relève','communication'], mod:'orga', label:'SBAR' },
  { q:['planning','journée','tâche','horaire'], mod:'orga', label:'Planning de la journée' },
  { q:['transmissions','ciblées','dla'], mod:'orga', label:'Transmissions ciblées' },
  { q:['normes','biologie','bio','labo'], mod:'orga', label:'Normes biologiques' },
];

function globalSearch(query) {
  if (!query || query.length < 2) return [];
  const q = query.toLowerCase().trim();
  return SEARCH_INDEX.filter(entry =>
    entry.q.some(kw => kw.includes(q) || q.includes(kw))
  ).slice(0, 6);
}

export default function App() {
  const [active, setActive] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    let handler = null;
    const setup = async () => {
      try {
        const { App: CapApp } = await import('@capacitor/app');
        handler = await CapApp.addListener('backButton', () => {
          if (active !== null) { setActive(null); }
          else { CapApp.exitApp(); }
        });
      } catch {}
    };
    setup();
    return () => { if (handler) handler.remove(); };
  }, [active]);

  const renderModule = () => {
    switch(active) {
      case 'iatr':  return <Iatrogenique onBack={() => setActive(null)} />;
      case 'urg':   return <Urgences     onBack={() => setActive(null)} />;
      case 'score': return <Scores       onBack={() => setActive(null)} />;
      case 'ecg':   return <ECG          onBack={() => setActive(null)} />;
      case 'soins': return <Soins        onBack={() => setActive(null)} />;
      case 'orga':  return <Organisation onBack={() => setActive(null)} />;
      case 'form':  return <Formation    onBack={() => setActive(null)} />;
      case 'aidemem': return <AideMemoire  onBack={() => setActive(null)} />;
      default: return null;
    }
  };

  if (active) return (
    <div style={{ minHeight:'100vh', background:T.bg, color:T.text }}>
      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}} @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}`}</style>
      {renderModule()}
    </div>
  );

  const results = globalSearch(search);

  return (
    <div style={{ minHeight:'100vh', background:T.bg, color:T.text, fontFamily:'system-ui,sans-serif' }}>
      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}} @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}`}</style>

      {/* Header */}
      <div style={{ background:'#1e293b', borderBottom:'1px solid #334155', padding:'16px 18px', position:'sticky', top:0, zIndex:10 }}>
        <div style={{ fontSize:10, color:'#64748b', fontFamily:'monospace', letterSpacing:3, marginBottom:2 }}>INFIRMIER PRO</div>
        <div style={{ fontSize:22, fontWeight:700, color:T.text }}>Soins Généraux <span style={{color:'#6366f1'}}>●</span></div>

        {/* Barre de recherche */}
        <div style={{ marginTop:10, position:'relative' }}>
          <span style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', fontSize:16, color:'#64748b' }}>🔍</span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher : GDS, pédiatrie, NIHSS, timer…"
            style={{ width:'100%', background:'#0f172a', border:'1px solid #334155', borderRadius:10, padding:'10px 12px 10px 38px', color:T.text, fontSize:14, outline:'none', boxSizing:'border-box', fontFamily:'inherit' }}
          />
          {search && (
            <button onClick={() => setSearch('')}
              style={{ position:'absolute', right:10, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', color:'#64748b', cursor:'pointer', fontSize:18 }}>×</button>
          )}
        </div>

        {/* Résultats de recherche */}
        {search.length >= 2 && (
          <div style={{ marginTop:8, background:'#0f172a', border:'1px solid #334155', borderRadius:10, overflow:'hidden', animation:'fadeIn 0.2s ease' }}>
            {results.length === 0 ? (
              <div style={{ padding:'12px 14px', color:'#64748b', fontSize:13 }}>Aucun résultat pour « {search} »</div>
            ) : results.map((r, i) => {
              const mod = MODULES.find(m => m.id === r.mod);
              return (
                <div key={i} onClick={() => { setActive(r.mod); setSearch(''); }}
                  style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 14px', borderBottom: i < results.length-1 ? '1px solid #1e293b' : 'none', cursor:'pointer' }}>
                  <span style={{ fontSize:18 }}>{mod?.icon}</span>
                  <div>
                    <div style={{ color:mod?.color, fontWeight:700, fontSize:13 }}>{r.label}</div>
                    <div style={{ color:'#64748b', fontSize:11 }}>{mod?.label}</div>
                  </div>
                  <span style={{ color:'#334155', marginLeft:'auto' }}>›</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Grid modules */}
      <div style={{ padding:'16px 14px 80px' }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
          {MODULES.map(m => (
            <div key={m.id} onClick={() => setActive(m.id)} style={{
              background:'#1e293b', border:`1px solid ${m.badge ? m.color+'88' : m.color+'44'}`,
              borderRadius:12, padding:'16px 14px', cursor:'pointer',
              transition:'all 0.2s', boxShadow:`0 0 16px ${m.color}11`, position:'relative'
            }}>
              {m.badge && <span style={{position:'absolute',top:8,right:8,background:m.color+'22',color:m.color,fontSize:8,fontFamily:'monospace',padding:'2px 6px',borderRadius:8}}>{m.badge}</span>}
              <div style={{ fontSize:28, marginBottom:8 }}>{m.icon}</div>
              <div style={{ color:m.color, fontWeight:700, fontSize:14, marginBottom:4 }}>{m.label}</div>
              <div style={{ color:T.muted, fontSize:11, lineHeight:1.5 }}>{m.desc}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop:20, background:'#1e293b', border:'1px solid #334155', borderRadius:10, padding:'12px 16px', textAlign:'center' }}>
          <div style={{ color:'#64748b', fontSize:11, fontFamily:'monospace' }}>⚕️ Usage professionnel uniquement · Toujours vérifier avec le prescripteur</div>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { T } from './theme.js';
import { loadFavs, toggleFav } from './favorites.js';
import Iatrogenique from './modules/Iatrogenique/index.jsx';
import Urgences     from './modules/Urgences/index.jsx';
import Scores       from './modules/Scores/index.jsx';
import Soins        from './modules/Soins/index.jsx';
import Organisation from './modules/Organisation/index.jsx';
import Formation    from './modules/Formation/index.jsx';
import ECG          from './modules/ECG/index.jsx';
import AideMemoire  from './modules/AideMemoire/index.jsx';
import Medicaments  from './modules/Medicaments/index.jsx';

const MODULES = [
  { id:'iatr',    label:'Iatrogénie',   icon:'💊', color:T.iatr,    desc:'Doses · Débits · SAP · Interactions · Opioïdes' },
  { id:'urg',     label:'Urgences',     icon:'🚨', color:T.urg,     desc:'RCP · AVC · Anaphylaxie · Sepsis' },
  { id:'score',   label:'Scores',       icon:'📊', color:T.score,   desc:'Glasgow · EVA · GDS · NIHSS · RASS · CPOT' },
  { id:'ecg',     label:'ECG',          icon:'💓', color:'#00e676', desc:'Rythmes · Tracés interactifs · Quiz', badge:'NOUVEAU' },
  { id:'soins',   label:'Soins',        icon:'💉', color:T.soins,   desc:'Pansements · PAC · Piccline · Dialyse · Timers' },
  { id:'orga',    label:'Organisation', icon:'📋', color:T.orga,    desc:'Planning · SBAR · Transmissions · 5B' },
  { id:'form',    label:'Formation',    icon:'🎓', color:T.form,    desc:'Quiz · Cas cliniques · Lexique · Entraînement' },
  { id:'meds',    label:'Médicaments',  icon:'💉', color:'#e879f9', desc:'Fiches · Posologies · Indications · Surveillance', badge:'NOUVEAU' },
  { id:'aidemem', label:'Aide-Mémoire', icon:'🗒️', color:'#6366f1', desc:'Notes patients chiffrées · Services · Soins' },
];

// ─── Recherche floue ──────────────────────────────────────────────────────────
const SEARCH_INDEX = [
  { q:['glasgow','gcs','conscience','coma'],                         mod:'score', label:'Glasgow (GCS)' },
  { q:['gds','gaz du sang','ph','pao2','paco2','acidose'],           mod:'score', label:'GDS — Gaz du sang' },
  { q:['nihss','avc','stroke','neurologique'],                       mod:'score', label:'NIHSS — AVC' },
  { q:['wells','tvp','ep','embolie','thrombose'],                    mod:'score', label:'Wells TVP / EP' },
  { q:['ciwa','sevrage','alcool','delirium tremens'],                mod:'score', label:'CIWA-Ar — Sevrage alcool' },
  { q:['psi','port','pneumonie','pneumopathie'],                     mod:'score', label:'PSI/PORT — Pneumonie' },
  { q:['eva','douleur','en','echelle','flacc'],                      mod:'score', label:'Douleur EVA/EN' },
  { q:['rass','sédation','agitation','richmond'],                    mod:'score', label:'RASS — Sédation' },
  { q:['cpot','douleur réanimation','non verbal','inconscient'],     mod:'score', label:'CPOT — Douleur réa' },
  { q:['qsofa','sepsis','infection'],                                mod:'score', label:'qSOFA' },
  { q:['sofa','réanimation','défaillance'],                          mod:'score', label:'SOFA' },
  { q:['news2','détérioration','monitoring'],                        mod:'score', label:'NEWS2' },
  { q:['braden','norton','waterlow','escarre'],                      mod:'score', label:'Braden / Norton / Waterlow' },
  { q:['morse','chute'],                                             mod:'score', label:'Morse — Chute' },
  { q:['mmse','cognitif','démence','alzheimer'],                     mod:'score', label:'MMSE' },
  { q:['cam','délirium','confusion'],                                mod:'score', label:'CAM — Délirium' },
  { q:['dose','doses','calcul','mg/kg'],                             mod:'iatr',  label:'Calcul de doses' },
  { q:['débit','perfusion','gouttes','ml/h'],                        mod:'iatr',  label:'Débit de perfusion' },
  { q:['sap','seringue','autopousseuse'],                            mod:'iatr',  label:'Seringue auto-pousseuse' },
  { q:['interaction','médicament','médicamenteux'],                  mod:'iatr',  label:'Interactions médicamenteuses' },
  { q:['reconstitution','antibiotique','dilution'],                  mod:'iatr',  label:'Reconstitution antibiotiques' },
  { q:['compatibilité','iv','perfusion y'],                          mod:'iatr',  label:'Compatibilités IV en Y' },
  { q:['nutrition','parentérale','entérale','harris','calories'],    mod:'iatr',  label:'Nutrition parentérale/entérale' },
  { q:['pédiatrique','pédiatrie','enfant','nourrisson'],             mod:'iatr',  label:'Calculateur pédiatrique' },
  { q:['rcp','arrêt cardiaque','réanimation','acr'],                 mod:'urg',   label:'RCP' },
  { q:['anaphylaxie','allergie','choc allergique'],                  mod:'urg',   label:'Anaphylaxie' },
  { q:['sepsis','choc septique'],                                    mod:'urg',   label:'Sepsis' },
  { q:['avc','stroke','hémiplégie'],                                 mod:'urg',   label:'AVC' },
  { q:['hypoglycémie','glycémie','sucre'],                           mod:'urg',   label:'Hypoglycémie' },
  { q:['convulsion','épilepsie'],                                    mod:'urg',   label:'Convulsions' },
  { q:['oap','oedème pulmonaire','détresse respiratoire'],           mod:'urg',   label:'OAP' },
  { q:['timer','chrono','antiseptique'],                             mod:'soins', label:'Timers de soins' },
  { q:['pansement','plaie','escarre','cicatrice'],                   mod:'soins', label:'Pansements' },
  { q:['piccline','midline','voie centrale'],                        mod:'soins', label:'Piccline / Midline' },
  { q:['pac','chambre implantable'],                                 mod:'soins', label:'PAC — Chambre implantable' },
  { q:['kta','cathéter artériel'],                                   mod:'soins', label:'KTA — Cathéter artériel' },
  { q:['dialyse','hémodialyse','rein'],                              mod:'soins', label:'Dialyse' },
  { q:['sbar','transmission','relève'],                              mod:'orga',  label:'SBAR' },
  { q:['planning','journée','tâche','horaire'],                      mod:'orga',  label:'Planning de la journée' },
  { q:['transmissions','ciblées','dla'],                             mod:'orga',  label:'Transmissions ciblées' },
  { q:['normes','biologie','bio','labo'],                            mod:'orga',  label:'Normes biologiques' },
  { q:['5b','cinq b','checklist médicament'],                        mod:'orga',  label:'Checklist 5B médicaments' },
  { q:['morphine','opioïde','antalgique'],                           mod:'meds',  label:'Morphine' },
  { q:['adrénaline','epinephrine','anaphylaxie'],                    mod:'meds',  label:'Adrénaline' },
  { q:['noradrénaline','vasopresseur','choc'],                       mod:'meds',  label:'Noradrénaline' },
  { q:['furosémide','diurétique','lasix'],                           mod:'meds',  label:'Furosémide' },
  { q:['midazolam','sédatif','hypnovel'],                            mod:'meds',  label:'Midazolam' },
  { q:['héparine','anticoagulant'],                                  mod:'meds',  label:'Héparine' },
  { q:['insuline','diabète','glycémie'],                             mod:'meds',  label:'Insuline' },
  { q:['paracétamol','doliprane','antipyrétique'],                   mod:'meds',  label:'Paracétamol' },
  { q:['médicament','fiche','posologie','surveillance ide'],         mod:'meds',  label:'Fiches médicaments' },
];

function normalize(str) {
  return str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}
function fuzzyMatch(haystack, needle) {
  const h = normalize(haystack), n = normalize(needle);
  if (h.includes(n)) return true;
  if (n.length >= 5) {
    for (let i = 0; i < n.length - 2; i++) {
      if (h.includes(n.slice(0, i) + n.slice(i + 1))) return true;
    }
  }
  return false;
}
function globalSearch(query) {
  if (!query || query.length < 2) return [];
  return SEARCH_INDEX.filter(e => e.q.some(kw => fuzzyMatch(kw, query) || fuzzyMatch(query, kw))).slice(0, 6);
}

export default function App() {
  const [active,      setActive]      = useState(null);
  const [initialTool, setInitialTool] = useState(null);
  const [search,      setSearch]      = useState('');
  const [favs,        setFavs]        = useState(loadFavs);

  useEffect(() => {
    let handler = null;
    const setup = async () => {
      try {
        const { App: CapApp } = await import('@capacitor/app');
        handler = await CapApp.addListener('backButton', () => {
          if (active !== null) { setActive(null); setInitialTool(null); }
          else { CapApp.exitApp(); }
        });
      } catch {}
    };
    setup();
    return () => { if (handler) handler.remove(); };
  }, [active]);

  function openModule(mod, toolId = null) {
    setActive(mod);
    setInitialTool(toolId);
  }

  function handleBack() {
    setActive(null);
    setInitialTool(null);
  }

  function handleFavChange() {
    setFavs(loadFavs());
  }

  const renderModule = () => {
    const props = { onBack: handleBack, initialTool, onFavChange: handleFavChange };
    switch (active) {
      case 'iatr':    return <Iatrogenique {...props} />;
      case 'urg':     return <Urgences     {...props} />;
      case 'score':   return <Scores       {...props} />;
      case 'ecg':     return <ECG          onBack={handleBack} />;
      case 'soins':   return <Soins        {...props} />;
      case 'orga':    return <Organisation {...props} />;
      case 'form':    return <Formation    {...props} />;
      case 'meds':    return <Medicaments  {...props} />;
      case 'aidemem': return <AideMemoire  onBack={handleBack} />;
      default: return null;
    }
  };

  if (active) return (
    <div style={{ minHeight:'100vh', background:T.bg, color:T.text }}>
      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}`}</style>
      {renderModule()}
    </div>
  );

  const results = globalSearch(search);

  return (
    <div style={{ minHeight:'100vh', background:T.bg, color:T.text, fontFamily:'system-ui,sans-serif' }}>
      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}`}</style>

      {/* Header */}
      <div style={{ background:'#1e293b', borderBottom:'1px solid #334155', padding:'16px 18px', position:'sticky', top:0, zIndex:10 }}>
        <div style={{ fontSize:10, color:'#64748b', fontFamily:'monospace', letterSpacing:3, marginBottom:2 }}>INFIRMIER PRO</div>
        <div style={{ fontSize:22, fontWeight:700, color:T.text }}>Soins Généraux <span style={{color:'#6366f1'}}>●</span></div>
        <div style={{ marginTop:10, position:'relative' }}>
          <span style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', fontSize:16, color:'#64748b' }}>🔍</span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher : GDS, RASS, morphine, timer…"
            style={{ width:'100%', background:'#0f172a', border:'1px solid #334155', borderRadius:10, padding:'10px 12px 10px 38px', color:T.text, fontSize:14, outline:'none', boxSizing:'border-box', fontFamily:'inherit' }}
          />
          {search && <button onClick={() => setSearch('')} style={{ position:'absolute', right:10, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', color:'#64748b', cursor:'pointer', fontSize:18 }}>×</button>}
        </div>
        {search.length >= 2 && (
          <div style={{ marginTop:8, background:'#0f172a', border:'1px solid #334155', borderRadius:10, overflow:'hidden', animation:'fadeIn 0.2s ease' }}>
            {results.length === 0
              ? <div style={{ padding:'12px 14px', color:'#64748b', fontSize:13 }}>Aucun résultat</div>
              : results.map((r, i) => {
                  const mod = MODULES.find(m => m.id === r.mod);
                  return (
                    <div key={i} onClick={() => { openModule(r.mod); setSearch(''); }}
                      style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 14px', borderBottom: i < results.length-1 ? '1px solid #1e293b' : 'none', cursor:'pointer' }}>
                      <span style={{ fontSize:18 }}>{mod?.icon}</span>
                      <div>
                        <div style={{ color:mod?.color, fontWeight:700, fontSize:13 }}>{r.label}</div>
                        <div style={{ color:'#64748b', fontSize:11 }}>{mod?.label}</div>
                      </div>
                      <span style={{ color:'#334155', marginLeft:'auto' }}>›</span>
                    </div>
                  );
                })
            }
          </div>
        )}
      </div>

      <div style={{ padding:'16px 14px 80px' }}>

        {/* Section Favoris */}
        {favs.length > 0 && (
          <>
            <div style={{ color:'#64748b', fontFamily:'monospace', fontSize:10, letterSpacing:2, marginBottom:8 }}>⭐ FAVORIS</div>
            <div style={{ display:'flex', flexDirection:'column', gap:8, marginBottom:16 }}>
              {favs.map((fav, i) => {
                const mod = MODULES.find(m => m.id === fav.mod);
                return (
                  <div key={i} onClick={() => openModule(fav.mod, fav.toolId)} style={{
                    background:'#1e293b', border:`1px solid ${fav.color}44`,
                    borderLeft:`4px solid ${fav.color}`,
                    borderRadius:10, padding:'10px 14px', cursor:'pointer',
                    display:'flex', alignItems:'center', gap:12,
                  }}>
                    <span style={{ fontSize:20 }}>{fav.icon}</span>
                    <div style={{ flex:1 }}>
                      <div style={{ color:fav.color, fontWeight:700, fontSize:13 }}>{fav.label}</div>
                      <div style={{ color:'#64748b', fontSize:11 }}>{mod?.label}</div>
                    </div>
                    <button onClick={e => { e.stopPropagation(); setFavs(toggleFav(fav)); }} style={{ background:'none', border:'none', color:'#fbbf24', fontSize:16, cursor:'pointer' }}>⭐</button>
                  </div>
                );
              })}
            </div>
            <div style={{ borderTop:'1px solid #1e293b', marginBottom:16 }} />
          </>
        )}

        {/* Grid modules */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
          {MODULES.map(m => (
            <div key={m.id} onClick={() => openModule(m.id)} style={{
              background:'#1e293b', border:`1px solid ${m.badge ? m.color+'88' : m.color+'44'}`,
              borderRadius:12, padding:'16px 14px', cursor:'pointer',
              boxShadow:`0 0 16px ${m.color}11`, position:'relative',
            }}>
              {m.badge && <span style={{position:'absolute',top:8,right:8,background:m.color+'22',color:m.color,fontSize:8,fontFamily:'monospace',padding:'2px 6px',borderRadius:8}}>{m.badge}</span>}
              <div style={{ fontSize:28, marginBottom:8 }}>{m.icon}</div>
              <div style={{ color:m.color, fontWeight:700, fontSize:14, marginBottom:4 }}>{m.label}</div>
              <div style={{ color:'#64748b', fontSize:11, lineHeight:1.5 }}>{m.desc}</div>
            </div>
          ))}
        </div>

        <div style={{ marginTop:20, background:'#1e293b', border:'1px solid #334155', borderRadius:10, padding:'12px 16px', textAlign:'center' }}>
          <div style={{ color:'#64748b', fontSize:11, fontFamily:'monospace' }}>⚕️ Usage professionnel · Toujours vérifier avec le prescripteur</div>
        </div>
      </div>
    </div>
  );
}

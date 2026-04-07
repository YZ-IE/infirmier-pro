import { useState, useEffect } from 'react';
import { T } from './theme.js';
import Iatrogenique from './modules/Iatrogenique/index.jsx';
import Urgences from './modules/Urgences/index.jsx';
import Scores from './modules/Scores/index.jsx';
import SoinsTechniques from './modules/SoinsTechniques/index.jsx';
import Organisation from './modules/Organisation/index.jsx';
import Formation from './modules/Formation/index.jsx';

const MODULES = [
  { id:'iatr',  label:'Iatrogénie',   icon:'💊', color:T.iatr,  desc:'Doses · Débits · SAP · Interactions' },
  { id:'urg',   label:'Urgences',     icon:'🚨', color:T.urg,   desc:'RCP · AVC · Anaphylaxie · Sepsis' },
  { id:'score', label:'Scores',       icon:'📊', color:T.score, desc:'Glasgow · EVA · Norton · qSOFA' },
  { id:'soins', label:'Soins',        icon:'💉', color:T.soins, desc:'VVP · Sondage · Pansements · IV' },
  { id:'orga',  label:'Organisation', icon:'📋', color:T.orga,  desc:'SBAR · Transmissions · Normes bio' },
  { id:'form',  label:'Formation',    icon:'🎓', color:T.form,  desc:'Quiz · Cas cliniques · Assistant IA' },
];

export default function App() {
  const [active, setActive] = useState(null);

  // Interception du bouton retour Android (Capacitor)
  useEffect(() => {
    let handler = null;
    const setup = async () => {
      try {
        const { App: CapApp } = await import('@capacitor/app');
        handler = await CapApp.addListener('backButton', () => {
          if (active !== null) {
            setActive(null);
          } else {
            CapApp.exitApp();
          }
        });
      } catch {
        // Mode web : rien à faire, les boutons ← dans l'UI gèrent la navigation
      }
    };
    setup();
    return () => { if (handler) handler.remove(); };
  }, [active]);

  const renderModule = () => {
    switch(active) {
      case 'iatr':  return <Iatrogenique onBack={() => setActive(null)} />;
      case 'urg':   return <Urgences     onBack={() => setActive(null)} />;
      case 'score': return <Scores       onBack={() => setActive(null)} />;
      case 'soins': return <SoinsTechniques onBack={() => setActive(null)} />;
      case 'orga':  return <Organisation onBack={() => setActive(null)} />;
      case 'form':  return <Formation    onBack={() => setActive(null)} />;
      default: return null;
    }
  };

  if (active) return (
    <div style={{ minHeight:'100vh', background:T.bg, color:T.text }}>
      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}} @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}`}</style>
      {renderModule()}
    </div>
  );

  return (
    <div style={{ minHeight:'100vh', background:T.bg, color:T.text, fontFamily:'system-ui,sans-serif' }}>
      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}} @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}`}</style>
      {/* Header */}
      <div style={{ background:'#1e293b', borderBottom:'1px solid #334155', padding:'16px 18px', position:'sticky', top:0, zIndex:10 }}>
        <div style={{ fontSize:10, color:'#64748b', fontFamily:'monospace', letterSpacing:3, marginBottom:2 }}>INFIRMIER PRO</div>
        <div style={{ fontSize:22, fontWeight:700, color:T.text }}>Soins Généraux <span style={{color:'#6366f1'}}>●</span></div>
        <div style={{ fontSize:12, color:T.muted, marginTop:2 }}>Assistant clinique de poche</div>
      </div>
      {/* Grid */}
      <div style={{ padding:'16px 14px 80px' }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
          {MODULES.map(m => (
            <div key={m.id} onClick={() => setActive(m.id)} style={{
              background:'#1e293b', border:`1px solid ${m.color}44`,
              borderRadius:12, padding:'16px 14px', cursor:'pointer',
              transition:'all 0.2s', boxShadow:`0 0 16px ${m.color}11`
            }}>
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

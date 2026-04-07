import { useState } from 'react';
import { T, s } from '../../theme.js';
const C = T.urg;

const ANTIDOTES = [
  { toxique: 'Opioïdes (Morphine, Codéine, Fentanyl)', antidote: 'Naloxone (Narcan)', dose: '0,4-2 mg IV/IM/SC · Répéter toutes les 2-3 min si nécessaire · Perfusion continue possible', signes: 'Myosis bilatéral, bradypnée, somnolence, coma' },
  { toxique: 'Benzodiazépines', antidote: 'Flumazénil (Anexate)', dose: '0,2 mg IV lent · Répéter 0,1 mg/min jusqu\'à réponse · Max 1 mg', signes: 'Sédation, amnésie, dépression respiratoire modérée · ⚠️ Attention convulsions au réveil' },
  { toxique: 'Paracétamol', antidote: 'N-Acétylcystéine (Fluimucil)', dose: 'Perfusion IV selon protocole poids/heure · Efficace si < 10h post-ingestion', signes: 'Phase 1 (0-24h) : nausées · Phase 2-3 : cytolyse hépatique · Dosage paracétamolémie obligatoire' },
  { toxique: 'Anticoagulants AVK (Warfarine)', antidote: 'Vitamine K + PPSB si hémorragie', dose: 'Vitamine K 10 mg IV lent (délai 6-24h) · PPSB si urgence hémorragique', signes: 'INR élevé · Saignements' },
  { toxique: 'Héparine', antidote: 'Sulfate de protamine', dose: '1 mg pour 100 UI HNF · IV lente en 10 min · Max 50 mg', signes: 'TCA allongé · Saignements' },
  { toxique: 'Organophosphorés / Carbamates (pesticides)', antidote: 'Atropine + Pralidoxime', dose: 'Atropine 2-4 mg IV toutes les 5-10 min · Pralidoxime 1-2 g IV si < 6h', signes: 'SLUDGE : Salivation, Larmoiement, Urination, Diarrhée, crampes Gastro, Emesis · Bradycardie, myosis, bronchospasme' },
  { toxique: 'Bêta-bloquants', antidote: 'Glucagon + Insuline-Glucose (HDI)', dose: 'Glucagon 5-10 mg IV puis 1-5 mg/h · HDI : insuline 1 UI/kg + G10%', signes: 'Bradycardie, hypotension, BAV, bronchospasme' },
  { toxique: 'Digitaliques (Digoxine)', antidote: 'Anticorps anti-digitale (Digidot)', dose: '1 flacon pour 0,5 mg digoxine ingérée (calcul selon digoxinémie)', signes: 'BAV, bradycardie, troubles du rythme, nausées, troubles visuels (halos colorés)' },
  { toxique: 'Cyanures / Fumées incendie', antidote: 'Hydroxocobalamine (Cyanokit)', dose: '5 g IV en 15 min · Peut être répété', signes: 'Céphalées, dyspnée, coma, acidose lactique sévère · Coloration rouge des urines après antidote' },
  { toxique: 'Méthanol / Éthylène glycol', antidote: 'Éthanol ou Fomépizole', dose: 'Fomépizole 15 mg/kg IV puis 10 mg/kg/12h · Dialyse si sévère', signes: 'Acidose métabolique, troubles visuels (méthanol), insuffisance rénale (éthylène glycol)' },
  { toxique: 'Insuline / Hypoglycémiants', antidote: 'Glucose IV + Glucagon', dose: 'G30% 50 ml IVD · Glucagon 1 mg IM/SC si voie veineuse impossible', signes: 'Glycémie < 0,6 g/L · Sueurs, tremblements, convulsions, coma' },
];

export default function Intoxication() {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);

  const filtered = ANTIDOTES.filter(a =>
    a.toxique.toLowerCase().includes(search.toLowerCase()) ||
    a.antidote.toLowerCase().includes(search.toLowerCase())
  );

  if (selected) return (
    <div style={{ padding: '14px' }}>
      <button onClick={() => setSelected(null)} style={{ ...s.btn(C), marginBottom: 14 }}>← Retour</button>
      <div style={{ background: C+'18', border: `1px solid ${C}44`, borderRadius: 10, padding: '12px 14px', marginBottom: 14 }}>
        <div style={{ color: C, fontWeight: 700, fontSize: 14 }}>{selected.toxique}</div>
        <div style={{ color: '#22c55e', fontWeight: 700, fontSize: 13, marginTop: 4 }}>Antidote : {selected.antidote}</div>
      </div>
      {[
        { label: '💊 Posologie antidote', val: selected.dose, color: '#22c55e' },
        { label: '🔍 Signes cliniques / orientation', val: selected.signes, color: '#f59e0b' },
      ].map(({ label, val, color }) => (
        <div key={label} style={{ ...s.card, borderLeft: `3px solid ${color}` }}>
          <div style={{ color, fontFamily: 'monospace', fontSize: 11, marginBottom: 8 }}>{label}</div>
          <div style={{ color: T.text, fontSize: 13, lineHeight: 1.6 }}>{val}</div>
        </div>
      ))}
      <div style={{ ...s.card, background: '#431407', border: `1px solid ${C}44` }}>
        <div style={{ color: C, fontWeight: 700, fontSize: 12, marginBottom: 8 }}>⚠️ TOUJOURS</div>
        {['Appeler le 15 (SAMU) ou le centre antipoison (0 800 59 59 59)', 'Voie veineuse + scope + ECG', 'Recueillir emballages / flacons du toxique', 'Heure d\'ingestion + quantité estimée', 'Éviter le vomissement provoqué (contre-indiqué)', 'Charbon activé si < 1h et patient conscient (selon prescription)'].map((item, i) => (
          <div key={i} style={{ color: T.text, fontSize: 12, marginBottom: 5 }}>• {item}</div>
        ))}
      </div>
    </div>
  );

  return (
    <div style={{ padding: '14px' }}>
      <div style={{ background: C+'18', border: `1px solid ${C}44`, borderRadius: 10, padding: '12px 14px', marginBottom: 14 }}>
        <div style={{ color: C, fontWeight: 700, fontSize: 14 }}>☠️ Intoxications — Antidotes</div>
        <div style={{ color: T.muted, fontSize: 12, marginTop: 4 }}>Centre antipoison : 0 800 59 59 59 (gratuit)</div>
      </div>
      <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher un toxique ou antidote…" style={{ ...s.input, marginBottom: 12 }} />
      {filtered.map((a, i) => (
        <div key={i} onClick={() => setSelected(a)} style={{ ...s.card, cursor: 'pointer' }}>
          <div style={{ color: C, fontWeight: 700, fontSize: 13, marginBottom: 3 }}>{a.toxique}</div>
          <div style={{ color: '#22c55e', fontSize: 12 }}>→ {a.antidote}</div>
        </div>
      ))}
    </div>
  );
}

import { useState } from 'react';
import { T, s } from '../../theme.js';
const C = T.iatr;

// Source : RCP / fiches de reconstitution hospitalières / Infostab
const MEDOCS = [
  // ─── PÉNICILLINES ───
  { cat:'Pénicillines', name:'Amoxicilline 1g', dilu:'10 ml eau PPI', conc:'100 mg/ml', admin:'IVL 30 min', compat:'NaCl 0,9% · G5%', stable:'Utiliser immédiatement', note:'Ne pas mélanger avec aminoglycosides' },
  { cat:'Pénicillines', name:'Amoxicilline-Ac. clavulanique 1g', dilu:'20 ml eau PPI', conc:'50 mg/ml', admin:'IVL 30 min', compat:'NaCl 0,9%', stable:'1h à température ambiante', note:'Incompatible G5%. Rincer la voie avant/après.' },
  { cat:'Pénicillines', name:'Pipéracilline-Tazobactam 4g', dilu:'20 ml eau PPI puis 250 ml NaCl', conc:'16 mg/ml', admin:'IVL 30 min (ou 4h en perfusion prolongée)', compat:'NaCl 0,9% · G5%', stable:'12h réfrigérateur · 24h si perfusion prolongée', note:'Voie dédiée recommandée. Incompatible aminoglycosides.' },
  { cat:'Pénicillines', name:'Oxacilline 1g', dilu:'10 ml eau PPI', conc:'100 mg/ml', admin:'IVL 30-60 min', compat:'NaCl 0,9% · G5%', stable:'6h température ambiante', note:'Peut être administrée en IM.' },
  // ─── CÉPHALOSPORINES ───
  { cat:'Céphalosporines', name:'Céfazoline 1g', dilu:'10 ml eau PPI', conc:'100 mg/ml', admin:'IVL 15-30 min', compat:'NaCl 0,9% · G5%', stable:'24h réfrigérateur', note:'' },
  { cat:'Céphalosporines', name:'Ceftriaxone 1g', dilu:'10 ml eau PPI', conc:'100 mg/ml', admin:'IVL 30 min', compat:'NaCl 0,9%', stable:'6h température ambiante', note:'⚠️ Incompatible calcium IV (même voie). Incompatible lactate de Ringer.' },
  { cat:'Céphalosporines', name:'Ceftriaxone 2g', dilu:'20 ml eau PPI', conc:'100 mg/ml', admin:'IVL 30 min', compat:'NaCl 0,9%', stable:'6h température ambiante', note:'⚠️ Incompatible calcium IV. Voie dédiée.' },
  { cat:'Céphalosporines', name:'Céfotaxime 1g', dilu:'10 ml eau PPI', conc:'100 mg/ml', admin:'IVL 20 min', compat:'NaCl 0,9% · G5%', stable:'24h réfrigérateur', note:'' },
  { cat:'Céphalosporines', name:'Céftazidime 1g', dilu:'10 ml eau PPI', conc:'100 mg/ml', admin:'IVL 20-30 min', compat:'NaCl 0,9% · G5%', stable:'24h réfrigérateur', note:'Activité anti-Pseudomonas. Incompatible vancomycine.' },
  { cat:'Céphalosporines', name:'Céfépime 2g', dilu:'10 ml eau PPI puis 100 ml', conc:'20 mg/ml', admin:'IVL 30 min', compat:'NaCl 0,9% · G5%', stable:'24h réfrigérateur', note:'Spectre élargi. Surveiller neurotoxicité.' },
  // ─── CARBAPÉNÈMES ───
  { cat:'Carbapénèmes', name:'Méropénème 1g', dilu:'20 ml eau PPI', conc:'50 mg/ml', admin:'IVL 15-30 min (ou 3h perfusion prolongée)', compat:'NaCl 0,9%', stable:'3h température ambiante · 8h réfrigérateur', note:'Préparer extemporanément. Incompatible G5%.' },
  { cat:'Carbapénèmes', name:'Méropénème 2g', dilu:'40 ml eau PPI', conc:'50 mg/ml', admin:'IVL 30 min (ou 3h perfusion prolongée)', compat:'NaCl 0,9%', stable:'3h température ambiante', note:'⚠️ Stabilité courte. Préparer extemporanément.' },
  { cat:'Carbapénèmes', name:'Imipénème 500mg', dilu:'100 ml NaCl 0,9%', conc:'5 mg/ml', admin:'IVL 30-60 min', compat:'NaCl 0,9%', stable:'4h température ambiante', note:'Ne pas dépasser 5 mg/ml. Risque convulsions.' },
  { cat:'Carbapénèmes', name:'Ertapénème 1g', dilu:'10 ml eau PPI puis 50 ml NaCl', conc:'20 mg/ml', admin:'IVL 30 min', compat:'NaCl 0,9%', stable:'6h température ambiante', note:'1 injection/j. Incompatible G5%.' },
  // ─── GLYCOPEPTIDES ───
  { cat:'Glycopeptides', name:'Vancomycine 500mg', dilu:'10 ml eau PPI puis 100-250 ml', conc:'2-5 mg/ml', admin:'IVL ≥ 60 min (max 10 mg/min)', compat:'NaCl 0,9% · G5%', stable:'24h réfrigérateur', note:'⚠️ Red Man Syndrome si perfusion trop rapide. Voie dédiée. Surveiller vancocinémie.' },
  { cat:'Glycopeptides', name:'Vancomycine 1g', dilu:'20 ml eau PPI puis 250 ml', conc:'4 mg/ml', admin:'IVL ≥ 90 min', compat:'NaCl 0,9% · G5%', stable:'24h réfrigérateur', note:'⚠️ Perfusion lente obligatoire. Néphrotoxique.' },
  { cat:'Glycopeptides', name:'Teicoplanine 400mg', dilu:'3 ml eau PPI', conc:'133 mg/ml', admin:'IVL 30 min ou IM', compat:'NaCl 0,9% · G5%', stable:'24h réfrigérateur', note:'Dose de charge J1 : 3 injections à H0, H12, H24.' },
  { cat:'Glycopeptides', name:'Dalbavancine 1,5g', dilu:'250 ml G5%', conc:'6 mg/ml', admin:'IVL 30 min', compat:'G5%', stable:'Utiliser immédiatement après dilution', note:'1 seule injection. Incompatible NaCl. Rincer voie.' },
  // ─── AMINOGLYCOSIDES ───
  { cat:'Aminoglycosides', name:'Gentamycine 160mg', dilu:'100 ml NaCl 0,9%', conc:'1,6 mg/ml', admin:'IVL 30 min', compat:'NaCl 0,9% · G5%', stable:'24h réfrigérateur', note:'⚠️ Dosage unique quotidien (DUJ). Incompatible pénicillines même voie. Surveiller fonction rénale.' },
  { cat:'Aminoglycosides', name:'Amikacine 1g', dilu:'200 ml NaCl 0,9%', conc:'5 mg/ml', admin:'IVL 30-60 min', compat:'NaCl 0,9% · G5%', stable:'24h réfrigérateur', note:'DUJ. Néphrotoxique et ototoxique. Surveiller taux résiduels.' },
  { cat:'Aminoglycosides', name:'Tobramycine 80mg', dilu:'100 ml NaCl 0,9%', conc:'0,8 mg/ml', admin:'IVL 30 min', compat:'NaCl 0,9% · G5%', stable:'24h réfrigérateur', note:'DUJ. Surveiller fonction rénale.' },
  // ─── ANTIFONGIQUES ───
  { cat:'Antifongiques', name:'Fluconazole 200mg', dilu:'Prêt à l\'emploi 100 ml', conc:'2 mg/ml', admin:'IVL max 10 ml/min', compat:'NaCl 0,9% · G5%', stable:'24h réfrigérateur', note:'' },
  { cat:'Antifongiques', name:'Fluconazole 400mg', dilu:'Prêt à l\'emploi 200 ml', conc:'2 mg/ml', admin:'IVL max 10 ml/min (20 min min)', compat:'NaCl 0,9% · G5%', stable:'24h réfrigérateur', note:'Surveiller bilan hépatique.' },
  { cat:'Antifongiques', name:'Caspofongine 50mg', dilu:'10,8 ml eau PPI puis 250 ml NaCl', conc:'0,2 mg/ml', admin:'IVL 60 min', compat:'NaCl 0,9%', stable:'24h réfrigérateur', note:'⚠️ Incompatible G5%. Ne pas mélanger avec autres médicaments.' },
  { cat:'Antifongiques', name:'Amphotéricine B liposomale 50mg', dilu:'12 ml eau PPI puis G5%', conc:'1-2 mg/ml', admin:'IVL 30-60 min', compat:'G5% uniquement', stable:'6h température ambiante', note:'⚠️ Incompatible NaCl (précipitation). Filtre 1µm obligatoire.' },
  // ─── ANTIVIRAUX ───
  { cat:'Antiviraux', name:'Aciclovir 250mg', dilu:'10 ml eau PPI puis 50-100 ml', conc:'5 mg/ml max', admin:'IVL 60 min', compat:'NaCl 0,9%', stable:'12h température ambiante', note:'⚠️ Ne pas dépasser 5 mg/ml. Cristallisation si trop concentré. Hyperhydratation recommandée.' },
  { cat:'Antiviraux', name:'Ganciclovir 500mg', dilu:'10 ml eau PPI puis 100 ml', conc:'5 mg/ml', admin:'IVL 60 min', compat:'NaCl 0,9% · G5%', stable:'12h température ambiante', note:'⚠️ Cytotoxique. Précautions de manipulation. Néphrotoxique.' },
  // ─── AUTRES ANTI-INFECTIEUX ───
  { cat:'Autres anti-infectieux', name:'Métronidazole 500mg', dilu:'Prêt à l\'emploi 100 ml', conc:'5 mg/ml', admin:'IVL 30-60 min', compat:'NaCl 0,9%', stable:'24h température ambiante', note:'Protéger de la lumière.' },
  { cat:'Autres anti-infectieux', name:'Colistiméthate 1MUI', dilu:'10 ml eau PPI', conc:'100 000 UI/ml', admin:'IVL 30 min (ou nébulisation)', compat:'NaCl 0,9%', stable:'24h réfrigérateur', note:'⚠️ Antibiotique de dernier recours. Surveiller fonction rénale.' },
  { cat:'Autres anti-infectieux', name:'Linézolide 600mg', dilu:'Prêt à l\'emploi 300 ml', conc:'2 mg/ml', admin:'IVL 30-120 min', compat:'NaCl 0,9% · G5%', stable:'Selon péremption fabricant', note:'Incompatible amphotéricine. IMAO faible : interactions sérotonine.' },
];

const CATS = [...new Set(MEDOCS.map(m => m.cat))];

export default function Reconstitution({ onBack }) {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [catFilter, setCatFilter] = useState('Tous');

  const filtered = MEDOCS.filter(a =>
    a.name.toLowerCase().includes(search.toLowerCase()) &&
    (catFilter === 'Tous' || a.cat === catFilter)
  );

  if (selected) return (
    <div style={{ minHeight: '100vh', background: T.bg, paddingBottom: 40 }}>
      <div style={{ background: T.iatrDim, borderBottom: `1px solid ${C}44`, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12, position: 'sticky', top: 0, zIndex: 10 }}>
        <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', color: C, fontSize: 20, cursor: 'pointer' }}>←</button>
        <div>
          <div style={{ color: T.text, fontWeight: 700, fontSize: 16 }}>{selected.name}</div>
          <div style={{ color: C, fontSize: 11, fontFamily: 'monospace' }}>{selected.cat}</div>
        </div>
      </div>
      <div style={{ padding: '14px' }}>
        {[
          ['💧 Dilution initiale', selected.dilu],
          ['📊 Concentration finale', selected.conc],
          ['⏱ Administration', selected.admin],
          ['🔗 Solvants compatibles', selected.compat],
          ['⏰ Stabilité', selected.stable],
        ].map(([label, val]) => (
          <div key={label} style={{ ...s.card, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <div style={{ minWidth: 160 }}>
              <div style={{ color: C, fontSize: 12, fontFamily: 'monospace', fontWeight: 700 }}>{label}</div>
            </div>
            <div style={{ color: T.text, fontSize: 14, flex: 1 }}>{val}</div>
          </div>
        ))}
        {selected.note && (
          <div style={{ background: '#431407', border: `1px solid ${T.urg}44`, borderRadius: 8, padding: '12px 14px' }}>
            <div style={{ color: T.urg, fontWeight: 700, fontSize: 13, marginBottom: 4 }}>⚠️ Note importante</div>
            <div style={{ color: T.text, fontSize: 13, lineHeight: 1.5 }}>{selected.note}</div>
          </div>
        )}
        <div style={{ ...s.card, marginTop: 10, background: '#0c3a4a', border: `1px solid ${T.soins}33` }}>
          <div style={{ color: T.soins, fontSize: 12, fontFamily: 'monospace', marginBottom: 6 }}>PROCÉDURE</div>
          <ol style={{ color: T.muted, fontSize: 13, paddingLeft: 18, lineHeight: 2.2 }}>
            <li>Vérifier prescription + identité patient</li>
            <li>Contrôler date de péremption</li>
            <li>Reconstituer avec {selected.dilu}</li>
            <li>Agiter doucement jusqu'à dissolution</li>
            <li>Vérifier absence de particules / limpidité</li>
            <li>Étiqueter : nom, dose, date/heure, opérateur</li>
            <li>Administrer : {selected.admin}</li>
          </ol>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: T.bg, paddingBottom: 40 }}>
      <div style={{ background: T.iatrDim, borderBottom: `1px solid ${C}44`, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12, position: 'sticky', top: 0, zIndex: 10 }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', color: C, fontSize: 20, cursor: 'pointer' }}>←</button>
        <div>
          <div style={{ color: T.text, fontWeight: 700, fontSize: 17 }}>🧪 Reconstitution</div>
          <div style={{ color: T.muted, fontSize: 10, fontFamily: 'monospace' }}>{MEDOCS.length} médicaments · RCP / Infostab</div>
        </div>
      </div>
      <div style={{ padding: '14px' }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher…" style={{ ...s.input, marginBottom: 10 }} />
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
          {['Tous', ...CATS].map(cat => (
            <button key={cat} onClick={() => setCatFilter(cat)} style={{
              background: catFilter === cat ? C + '22' : T.surface,
              border: `1px solid ${catFilter === cat ? C : '#334155'}`,
              color: catFilter === cat ? C : T.muted,
              borderRadius: 20, padding: '4px 12px', fontSize: 11, cursor: 'pointer'
            }}>{cat}</button>
          ))}
        </div>
        {filtered.map(a => (
          <div key={a.name} onClick={() => setSelected(a)} style={{ ...s.card, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ color: C, fontWeight: 700, fontSize: 14, marginBottom: 3 }}>{a.name}</div>
              <div style={{ color: T.muted, fontSize: 12 }}>{a.admin} · {a.conc}</div>
              <div style={{ color: '#475569', fontSize: 11 }}>{a.cat}</div>
            </div>
            <span style={{ color: T.muted, fontSize: 18 }}>›</span>
          </div>
        ))}
        {filtered.length === 0 && <div style={{ color: T.muted, textAlign: 'center', padding: 20, fontSize: 13 }}>Aucun résultat</div>}
      </div>
    </div>
  );
}

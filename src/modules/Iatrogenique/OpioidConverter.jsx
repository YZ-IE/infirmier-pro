import { useState } from 'react';
import { T, s } from '../../theme.js';
const C = T.iatr;

// Ratios d'équianalgésie (en mg équivalent morphine orale)
const OPIOIDS = [
  { id: 'morph_po',  label: 'Morphine orale',        ratio: 1,    unit: 'mg', route: 'PO' },
  { id: 'morph_iv',  label: 'Morphine IV/SC',         ratio: 0.5,  unit: 'mg', route: 'IV/SC', note: '1 mg IV = 2 mg PO' },
  { id: 'morph_peri',label: 'Morphine péridurale',    ratio: 0.1,  unit: 'mg', route: 'Péri', note: '1 mg péri = 10 mg PO' },
  { id: 'oxy_po',    label: 'Oxycodone orale',        ratio: 0.5,  unit: 'mg', route: 'PO', note: '10 mg oxy = 20 mg morph PO' },
  { id: 'oxy_iv',    label: 'Oxycodone IV',           ratio: 0.33, unit: 'mg', route: 'IV', note: '10 mg oxy IV = 30 mg morph PO' },
  { id: 'hyd',       label: 'Hydromorphone (Sophidone)', ratio: 0.143, unit: 'mg', route: 'PO', note: '4 mg hydro = 28 mg morph PO' },
  { id: 'fent_patch',label: 'Fentanyl patch (µg/h)',  ratio: null, unit: 'µg/h', route: 'TD', note: 'µg/h × 2.4 = mg morph/24h' },
  { id: 'fent_iv',   label: 'Fentanyl IV (µg)',       ratio: 0.01, unit: 'µg', route: 'IV', note: '100 µg = 1 mg morph IV = 2 mg PO' },
  { id: 'trama_po',  label: 'Tramadol oral',          ratio: 0.1,  unit: 'mg', route: 'PO', note: '100 mg = 10 mg morph PO' },
  { id: 'codeine',   label: 'Codéine orale',          ratio: 0.1,  unit: 'mg', route: 'PO', note: '100 mg = 10 mg morph PO' },
  { id: 'bup_patch', label: 'Buprénorphine patch (µg/h)', ratio: null, unit: 'µg/h', route: 'TD', note: 'µg/h × 0.8 ≈ mg morph/24h' },
];

function toMorphPO(drug, dose) {
  if (!drug || !dose) return null;
  const d = parseFloat(dose);
  if (isNaN(d) || d <= 0) return null;
  if (drug.id === 'fent_patch') return d * 2.4;
  if (drug.id === 'bup_patch') return d * 0.8;
  return d / drug.ratio;
}

function fromMorphPO(drug, morphPO) {
  if (!drug || !morphPO) return null;
  if (drug.id === 'fent_patch') return (morphPO / 2.4).toFixed(1);
  if (drug.id === 'bup_patch') return (morphPO / 0.8).toFixed(1);
  return (morphPO * drug.ratio).toFixed(1);
}

export default function OpioidConverter() {
  const [fromDrug, setFromDrug] = useState(null);
  const [dose, setDose] = useState('');
  const [step, setStep] = useState(1);

  const morphPO = toMorphPO(fromDrug, dose);

  return (
    <div style={{ padding: '14px' }}>
      <div style={{ background: '#ef444418', border: '1px solid #ef444444', borderRadius: 10, padding: '12px 14px', marginBottom: 14 }}>
        <div style={{ color: '#ef4444', fontWeight: 700, fontSize: 13 }}>⚠️ Convertisseur opioïdes</div>
        <div style={{ color: T.muted, fontSize: 12, marginTop: 3 }}>Ratios d'équianalgésie approximatifs · Toujours débuter à 50–75% de la dose calculée · Adapter selon réponse clinique et tolérance · Prescription médicale obligatoire</div>
      </div>

      {step === 1 && (
        <>
          <div style={{ color: C, fontFamily: 'monospace', fontSize: 11, letterSpacing: 2, marginBottom: 10 }}>1 — OPIOÏDE DE DÉPART</div>
          {OPIOIDS.map(d => (
            <div key={d.id} onClick={() => { setFromDrug(d); setDose(''); setStep(2); }}
              style={{ ...s.card, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ color: T.text, fontWeight: 700, fontSize: 13 }}>{d.label}</div>
                <div style={{ color: T.muted, fontSize: 11, marginTop: 2 }}>{d.route}{d.note ? ` · ${d.note}` : ''}</div>
              </div>
              <span style={{ color: T.muted }}>›</span>
            </div>
          ))}
        </>
      )}

      {step === 2 && fromDrug && (
        <>
          <div style={{ color: C, fontFamily: 'monospace', fontSize: 11, letterSpacing: 2, marginBottom: 10 }}>2 — DOSE SUR 24H</div>
          <div style={{ ...s.card, border: `1px solid ${C}44` }}>
            <div style={{ color: C, fontWeight: 700, fontSize: 14, marginBottom: 10 }}>{fromDrug.label} ({fromDrug.route})</div>
            <label style={s.label}>Dose totale sur 24h ({fromDrug.unit})</label>
            <input type="number" step="0.5" value={dose} onChange={e => setDose(e.target.value)} placeholder="Ex: 60"
              style={{ ...s.input, fontSize: 22, fontWeight: 700, textAlign: 'center', marginBottom: 10 }} />
            {fromDrug.note && <div style={{ color: T.muted, fontSize: 12 }}>ℹ️ {fromDrug.note}</div>}
          </div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
            <button onClick={() => setStep(1)} style={{ ...s.btn('#64748b'), flex: 1, padding: '10px' }}>← Retour</button>
            <button onClick={() => setStep(3)} disabled={!morphPO}
              style={{ ...s.btn(C), flex: 2, padding: '10px', opacity: !morphPO ? 0.4 : 1 }}>Calculer →</button>
          </div>
        </>
      )}

      {step === 3 && morphPO && (
        <>
          <div style={{ background: C + '18', border: `1px solid ${C}44`, borderRadius: 12, padding: '14px', marginBottom: 14 }}>
            <div style={{ color: C, fontFamily: 'monospace', fontSize: 11, letterSpacing: 2, marginBottom: 8 }}>ÉQUIVALENCE</div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: T.muted, fontSize: 13 }}>{fromDrug.label} {dose} {fromDrug.unit}/24h</div>
              <div style={{ color: C, fontSize: 14, margin: '6px 0' }}>≡</div>
              <div style={{ color: T.text, fontSize: 24, fontWeight: 700 }}>{morphPO.toFixed(1)} mg</div>
              <div style={{ color: C, fontSize: 13, marginTop: 2 }}>Morphine orale équivalente / 24h</div>
            </div>
          </div>

          <div style={{ color: C, fontFamily: 'monospace', fontSize: 11, letterSpacing: 2, marginBottom: 10 }}>CONVERSIONS VERS</div>
          {OPIOIDS.filter(d => d.id !== fromDrug.id).map(d => {
            const conv = fromMorphPO(d, morphPO);
            return (
              <div key={d.id} style={{ ...s.card, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ color: T.text, fontSize: 13, fontWeight: 700 }}>{d.label}</div>
                  <div style={{ color: T.muted, fontSize: 11 }}>{d.route}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: C, fontFamily: 'monospace', fontWeight: 700, fontSize: 16 }}>{conv} {d.unit}</div>
                  <div style={{ color: T.muted, fontSize: 10 }}>/ 24h</div>
                </div>
              </div>
            );
          })}

          <div style={{ ...s.card, background: '#f59e0b11', border: '1px solid #f59e0b33', marginTop: 6 }}>
            <div style={{ color: '#f59e0b', fontWeight: 700, fontSize: 13, marginBottom: 6 }}>💡 Règles de rotation</div>
            {[
              'Débuter à 50–75% de la dose équianalgésique calculée',
              'Prescrire systématiquement des interdoses (1/6 de la dose/24h)',
              'Réévaluer à 24–48h et titrer selon EVA',
              'Fentanyl patch : délai d\'action 12–24h, changer toutes les 72h',
            ].map((r, i) => <div key={i} style={{ color: T.muted, fontSize: 12, marginBottom: 4 }}>• {r}</div>)}
          </div>

          <button onClick={() => { setStep(1); setFromDrug(null); setDose(''); }}
            style={{ ...s.btn('#64748b'), width: '100%', padding: '12px', marginTop: 10 }}>
            🔄 Nouvelle conversion
          </button>
        </>
      )}
    </div>
  );
}

import { MedicalDisclaimer } from '../../components/MedicalDisclaimer.jsx';
import { T, s } from '../../theme.js';
const C = T.urg;
export default function Hyperkaliemie() {
  return (
    <div style={{ padding: '14px' }}>
      <MedicalDisclaimer level="standard" />
      <div style={{ background: C+'18', border: `1px solid ${C}44`, borderRadius: 10, padding: '12px 14px', marginBottom: 14 }}>
        <div style={{ color: C, fontWeight: 700, fontSize: 14 }}>⚡ Hyperkaliémie — Urgence vitale si K⁺ &gt; 6,5 mmol/L</div>
        <div style={{ color: T.muted, fontSize: 12, marginTop: 4 }}>Appeler le médecin immédiatement · Scope · ECG en urgence</div>
      </div>

      {[
        { titre: '1. ECG — Signes de gravité', couleur: '#ef4444', items: ['Ondes T amples et pointues (premier signe)', 'Élargissement QRS > 120 ms', 'Onde P aplanie ou absente', 'Sinusoïde → Fibrillation ventriculaire', '⚠️ Tout ECG anormal = URGENCE VITALE'] },
        { titre: '2. Traitement — Par ordre de priorité', couleur: C, items: [
          'Gluconate de calcium 10% — 10 ml IV lent 2-3 min (protection cardiaque immédiate)',
          'Bicarbonate de sodium 8,4% — 50 ml IV si acidose',
          'Insuline-Glucose : 10 UI insuline rapide + G30% 125 ml IV (transfert K⁺ intracellulaire)',
          'Salbutamol 10-20 mg nébulisation (transfert K⁺)',
          'Kayexalate (résine échangeuse) ou dialyse si insuffisance rénale',
          'Furosémide IV si diurèse conservée',
        ]},
        { titre: '3. Causes à rechercher', couleur: '#8b5cf6', items: ['Insuffisance rénale aiguë ou chronique', 'IEC / ARA2 / Spironolactone', 'AINS', 'Apports en potassium excessifs (nutrition, KCl)', 'Lyse cellulaire (hémolyse, rhabdomyolyse)', 'Insuffisance surrénalienne'] },
        { titre: '4. Surveillance', couleur: '#22c55e', items: ['Scope continu', 'Kaliémie de contrôle 1-2h après traitement', 'Diurèse horaire', 'ECG de contrôle', 'Glycémie si insuline administrée'] },
      ].map(({ titre, couleur, items }) => (
        <div key={titre} style={{ ...s.card, borderLeft: `3px solid ${couleur}` }}>
          <div style={{ color: couleur, fontWeight: 700, fontSize: 13, marginBottom: 10 }}>{titre}</div>
          {items.map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 7 }}>
              <span style={{ color: couleur, flexShrink: 0 }}>›</span>
              <span style={{ color: T.text, fontSize: 13, lineHeight: 1.5 }}>{item}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

import { ClinicalSource } from '../../components/ClinicalSource.jsx';
import { useState } from 'react';
import { T, s } from '../../theme.js';
const C = T.iatr;

// Source : Thésaurus ANSM interactions médicamenteuses + Vidal
const DB = [
  // ─── ANTICOAGULANTS ───
  {a:'Warfarine',b:'AINS',niv:'CI',msg:'Majoration du risque hémorragique. Association contre-indiquée.'},
  {a:'Warfarine',b:'Aspirine',niv:'CI',msg:'Risque hémorragique majeur. CI sauf faible dose aspirine sous surveillance stricte.'},
  {a:'Warfarine',b:'Amiodarone',niv:'MAJEUR',msg:'Inhibition du métabolisme CYP2C9. Augmentation INR. Surveillance rapprochée.'},
  {a:'Warfarine',b:'Fluconazole',niv:'MAJEUR',msg:'Inhibition CYP2C9. Doublement possible de l\'INR. Risque hémorragique.'},
  {a:'Warfarine',b:'Ciprofloxacine',niv:'MAJEUR',msg:'Augmentation de l\'effet anticoagulant. Surveiller INR.'},
  {a:'Warfarine',b:'Métronidazole',niv:'MAJEUR',msg:'Inhibition CYP2C9. Augmentation INR significative.'},
  {a:'Warfarine',b:'Paracétamol',niv:'MODÉRÉ',msg:'Potentialisation si dose > 2g/j pendant > 3 jours. Surveiller INR.'},
  {a:'Warfarine',b:'Oméprazole',niv:'MODÉRÉ',msg:'Légère augmentation de l\'INR possible. Surveillance.'},
  {a:'Warfarine',b:'Millepertuis',niv:'CI',msg:'Inducteur enzymatique puissant. Réduction majeure de l\'effet anticoagulant.'},
  {a:'Acenocoumarol',b:'Paracétamol',niv:'MODÉRÉ',msg:'Augmentation effet anticoagulant si dose > 2g/j.'},
  {a:'Héparine',b:'AINS',niv:'MAJEUR',msg:'Majoration du risque hémorragique.'},
  {a:'Héparine',b:'Aspirine',niv:'MAJEUR',msg:'Risque hémorragique additif. Surveillance.'},
  {a:'HBPM',b:'AINS',niv:'MAJEUR',msg:'Majoration du risque hémorragique.'},
  {a:'Rivaroxaban',b:'Kétoconazole',niv:'CI',msg:'Inhibition CYP3A4 et P-gp. Augmentation majeure exposition. CI.'},
  {a:'Rivaroxaban',b:'AINS',niv:'MAJEUR',msg:'Risque hémorragique additif. Éviter l\'association.'},
  {a:'Apixaban',b:'Clarithromycine',niv:'MAJEUR',msg:'Inhibition CYP3A4. Augmentation exposition apixaban.'},
  // ─── IMAO ───
  {a:'IMAO',b:'Tramadol',niv:'CI',msg:'Syndrome sérotoninergique grave. Contre-indication absolue.'},
  {a:'IMAO',b:'Morphine',niv:'CI',msg:'Interaction sérotoninergique sévère. Contre-indication.'},
  {a:'IMAO',b:'ISRS',niv:'CI',msg:'Syndrome sérotoninergique potentiellement fatal.'},
  {a:'IMAO',b:'Triptans',niv:'CI',msg:'Syndrome sérotoninergique. CI absolue.'},
  {a:'IMAO',b:'Adrénaline',niv:'CI',msg:'Crise hypertensive. Contre-indiqué.'},
  // ─── ANTIDIABÉTIQUES ───
  {a:'Metformine',b:'Produit de contraste iodé',niv:'CI',msg:'Arrêt 48h avant injection. Risque acidose lactique. Reprendre 48h après si fonction rénale normale.'},
  {a:'Metformine',b:'Alcool',niv:'MAJEUR',msg:'Risque d\'acidose lactique. Éviter consommation alcool.'},
  {a:'Insuline',b:'Bêta-bloquants',niv:'MODÉRÉ',msg:'Masquage signes hypoglycémie (tachycardie). Surveiller glycémie rapprochée.'},
  {a:'Insuline',b:'Corticoïdes',niv:'MODÉRÉ',msg:'Hyperglycémie induite. Adaptation posologie insuline nécessaire.'},
  {a:'Sulfamides hypoglycémiants',b:'Fluconazole',niv:'MAJEUR',msg:'Inhibition CYP2C9. Risque hypoglycémie sévère.'},
  {a:'Sulfamides hypoglycémiants',b:'AINS',niv:'MODÉRÉ',msg:'Potentialisation de l\'effet hypoglycémiant.'},
  // ─── DIGOXINE ───
  {a:'Digoxine',b:'Amiodarone',niv:'MAJEUR',msg:'Augmentation digoxinémie. Réduire dose digoxine de 50%. Surveiller ECG.'},
  {a:'Digoxine',b:'Hypokaliémie',niv:'MAJEUR',msg:'L\'hypokaliémie potentialise la toxicité de la digoxine. Corriger K+.'},
  {a:'Digoxine',b:'Clarithromycine',niv:'MAJEUR',msg:'Augmentation digoxinémie par inhibition P-gp intestinale.'},
  {a:'Digoxine',b:'Vérapamil',niv:'MAJEUR',msg:'Augmentation de la digoxinémie. Bradycardie additive. Surveillance.'},
  {a:'Digoxine',b:'Furosémide',niv:'MODÉRÉ',msg:'Hypokaliémie induite potentialisant la toxicité de la digoxine.'},
  // ─── AINS ───
  {a:'AINS',b:'IEC',niv:'MODÉRÉ',msg:'Réduction effet antihypertenseur. Risque insuffisance rénale aiguë (triple whammy).'},
  {a:'AINS',b:'Diurétiques',niv:'MODÉRÉ',msg:'Réduction effet diurétique. Risque rénal. Surveiller fonction rénale.'},
  {a:'AINS',b:'IRC',niv:'CI',msg:'Contre-indiqués en insuffisance rénale chronique. Dégradation irréversible.'},
  {a:'AINS',b:'Lithium',niv:'MAJEUR',msg:'Augmentation lithiémie. Risque toxicité lithium.'},
  {a:'AINS',b:'Méthotrexate',niv:'MAJEUR',msg:'Réduction élimination rénale méthotrexate. Toxicité majorée.'},
  // ─── OPIOÏDES ───
  {a:'Morphine',b:'Benzodiazépines',niv:'MAJEUR',msg:'Dépression respiratoire additive. Risque vital. Surveillance rapprochée++.'},
  {a:'Morphine',b:'Alcool',niv:'CI',msg:'Potentialisation dépression SNC. Contre-indiqué.'},
  {a:'Morphine',b:'Gabapentine',niv:'MAJEUR',msg:'Dépression respiratoire additive. Vigilance++.'},
  {a:'Tramadol',b:'ISRS',niv:'MAJEUR',msg:'Risque syndrome sérotoninergique. Surveillance.'},
  {a:'Tramadol',b:'Benzodiazépines',niv:'MAJEUR',msg:'Dépression respiratoire additive.'},
  {a:'Tramadol',b:'Carbamazépine',niv:'MODÉRÉ',msg:'Induction enzymatique. Réduction effet tramadol.'},
  // ─── ANTIBIOTIQUES ───
  {a:'Furosémide',b:'Aminoglycosides',niv:'MAJEUR',msg:'Risque ototoxique et néphrotoxique additif. Surveiller audition et fonction rénale.'},
  {a:'Ciprofloxacine',b:'Antiacides',niv:'MODÉRÉ',msg:'Réduction absorption ciprofloxacine. Espacer de 2h.'},
  {a:'Ciprofloxacine',b:'Théophylline',niv:'MAJEUR',msg:'Augmentation théophyllinémie. Risque convulsions, troubles cardiaques.'},
  {a:'Clarithromycine',b:'Statines',niv:'MAJEUR',msg:'Inhibition CYP3A4. Risque rhabdomyolyse. Suspendre statine.'},
  {a:'Métronidazole',b:'Alcool',niv:'CI',msg:'Effet antabuse (flush, nausées, palpitations). CI absolue pendant et 48h après.'},
  {a:'Rifampicine',b:'Contraceptifs oraux',niv:'CI',msg:'Inducteur enzymatique puissant. Inefficacité contraceptive.'},
  {a:'Rifampicine',b:'Warfarine',niv:'MAJEUR',msg:'Induction CYP. Réduction majeure effet anticoagulant.'},
  {a:'Vancomycine',b:'Aminoglycosides',niv:'MAJEUR',msg:'Néphrotoxicité et ototoxicité additives. Éviter si possible.'},
  {a:'Triméthoprime',b:'Méthotrexate',niv:'MAJEUR',msg:'Risque toxicité hématologique additive.'},
  // ─── AMIODARONE ───
  {a:'Amiodarone',b:'Simvastatine',niv:'MAJEUR',msg:'Risque myopathie et rhabdomyolyse. Dose simvastatine max 20mg/j.'},
  {a:'Amiodarone',b:'Bêta-bloquants',niv:'MODÉRÉ',msg:'Bradycardie et bloc auriculo-ventriculaire. Surveillance ECG.'},
  {a:'Amiodarone',b:'Phénytoïne',niv:'MAJEUR',msg:'Augmentation phénytoïnémie. Toxicité neurologique.'},
  // ─── PSYCHOTROPES ───
  {a:'Clopidogrel',b:'Oméprazole',niv:'MODÉRÉ',msg:'Réduction effet antiplaquettaire. Préférer pantoprazole.'},
  {a:'Lithium',b:'AINS',niv:'MAJEUR',msg:'Augmentation lithiémie. Risque de toxicité (confusion, tremblements).'},
  {a:'Lithium',b:'IEC',niv:'MAJEUR',msg:'Augmentation lithiémie. Surveillance rapprochée.'},
  {a:'Lithium',b:'Diurétiques thiazidiques',niv:'MAJEUR',msg:'Augmentation lithiémie par réduction excrétion rénale.'},
  {a:'Hydroxyzine',b:'Alcool',niv:'MAJEUR',msg:'Potentialisation de la sédation.'},
  {a:'Haloperidol',b:'Lithium',niv:'MODÉRÉ',msg:'Risque syndrome neuroleptique malin. Surveillance.'},
  // ─── CARDIOLOGIE ───
  {a:'Potassium IV',b:'Diurétiques épargneurs K+',niv:'MAJEUR',msg:'Risque hyperkaliémie potentiellement fatal.'},
  {a:'IEC',b:'Diurétiques épargneurs K+',niv:'MODÉRÉ',msg:'Risque hyperkaliémie. Surveiller kaliémie.'},
  {a:'IEC',b:'AINS',niv:'MODÉRÉ',msg:'Triple whammy. Risque insuffisance rénale aiguë.'},
  {a:'Bêta-bloquants',b:'Vérapamil',niv:'CI',msg:'Bloc auriculo-ventriculaire complet. Arrêt cardiaque. CI.'},
  {a:'Bêta-bloquants',b:'Diltiazem',niv:'MAJEUR',msg:'Bradycardie et troubles de conduction. Surveillance ECG.'},
  // ─── NEUROLOGIE ───
  {a:'Carbamazépine',b:'Contraceptifs oraux',niv:'CI',msg:'Inducteur enzymatique. Inefficacité contraceptive.'},
  {a:'Carbamazépine',b:'Warfarine',niv:'MAJEUR',msg:'Induction enzymatique. Réduction effet anticoagulant.'},
  {a:'Phénytoïne',b:'Warfarine',niv:'MAJEUR',msg:'Interaction complexe bidirectionnelle. Surveillance INR.'},
  {a:'Valproate',b:'Carbamazépine',niv:'MODÉRÉ',msg:'Interactions complexes. Surveiller taux plasmatiques.'},
  // ─── IMMUNOSUPPRESSEURS ───
  {a:'Ciclosporine',b:'AINS',niv:'MAJEUR',msg:'Néphrotoxicité additive. Surveillance fonction rénale.'},
  {a:'Ciclosporine',b:'Fluconazole',niv:'MAJEUR',msg:'Augmentation cyclosporinémie. Surveillance.'},
  {a:'Méthotrexate',b:'AINS',niv:'MAJEUR',msg:'Réduction élimination méthotrexate. Toxicité hématologique.'},
  {a:'Méthotrexate',b:'Triméthoprime',niv:'MAJEUR',msg:'Toxicité hématologique additive.'},
];

const NIVEAUX = { CI: '#dc2626', MAJEUR: '#f97316', MODÉRÉ: '#eab308', FAIBLE: '#22c55e' };
const NIV_LABELS = {
  CI: '🚫 CONTRE-INDICATION',
  MAJEUR: '🔴 MAJEURE',
  MODÉRÉ: '🟡 MODÉRÉE',
  FAIBLE: '🟢 FAIBLE'
};

export default function Interactions({ onBack }) {
  const [drug1, setDrug1] = useState('');
  const [drug2, setDrug2] = useState('');
  const [results, setResults] = useState(null);
  const [tab, setTab] = useState('check');

  const check = () => {
    if (!drug1.trim()) { setResults([]); return; }
    const d1 = drug1.trim().toLowerCase();
    const d2 = drug2.trim().toLowerCase();
    const found = DB.filter(i =>
      (i.a.toLowerCase().includes(d1) || i.b.toLowerCase().includes(d1)) &&
      (!d2 || i.a.toLowerCase().includes(d2) || i.b.toLowerCase().includes(d2))
    );
    setResults(found);
  };

  return (
    <div style={{ minHeight: '100vh', background: T.bg, paddingBottom: 40 }}>
      <div style={{ background: T.iatrDim, borderBottom: `1px solid ${C}44`, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12, position: 'sticky', top: 0, zIndex: 10 }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', color: C, fontSize: 20, cursor: 'pointer' }}>←</button>
        <div>
          <div style={{ color: T.text, fontWeight: 700, fontSize: 17 }}>⚠️ Interactions médicamenteuses</div>
          <div style={{ color: T.muted, fontSize: 10, fontFamily: 'monospace' }}>Source : Thésaurus ANSM · Vidal</div>
        </div>
      </div>

      <div style={{ padding: '14px' }}>
        <div style={{ display: 'flex', gap: 7, marginBottom: 14 }}>
          {[['check', 'Vérifier'], ['all', 'Base complète']].map(([id, lbl]) => (
            <button key={id} onClick={() => setTab(id)} style={{ ...s.btn(tab === id ? C : T.muted), flex: 1, background: tab === id ? C + '22' : T.surface, borderColor: tab === id ? C : T.border, color: tab === id ? C : T.muted }}>{lbl}</button>
          ))}
        </div>

        {tab === 'check' && (
          <div style={s.card}>
            <div style={{ marginBottom: 10 }}>
              <label style={s.label}>MÉDICAMENT 1</label>
              <input value={drug1} onChange={e => { setDrug1(e.target.value); setResults(null); }} onKeyDown={e => e.key === 'Enter' && check()} placeholder="Ex : Warfarine, Morphine, AINS…" style={s.input} />
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={s.label}>MÉDICAMENT 2 — optionnel</label>
              <input value={drug2} onChange={e => { setDrug2(e.target.value); setResults(null); }} onKeyDown={e => e.key === 'Enter' && check()} placeholder="Ex : Amiodarone" style={s.input} />
            </div>
            <button onClick={check} style={{ ...s.btn(C), width: '100%', padding: '12px' }}>VÉRIFIER</button>

            {results !== null && (
              <div style={{ marginTop: 14, animation: 'fadeIn 0.3s ease' }}>
                {results.length === 0 ? (
                  <div style={{ ...s.result('#22c55e'), textAlign: 'center' }}>
                    <div style={{ color: '#22c55e', fontSize: 16, fontWeight: 700 }}>✓ Aucune interaction connue</div>
                    <div style={{ color: T.muted, fontSize: 12, marginTop: 4 }}>Dans notre base — consulter le pharmacien en cas de doute</div>
                  </div>
                ) : results.map((r, i) => (
                  <div key={i} style={{ background: NIVEAUX[r.niv] + '18', border: `1px solid ${NIVEAUX[r.niv]}44`, borderLeft: `3px solid ${NIVEAUX[r.niv]}`, borderRadius: 8, padding: '12px', marginBottom: 10 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ color: T.text, fontWeight: 700, fontSize: 13 }}>{r.a} + {r.b}</span>
                      <span style={{ background: NIVEAUX[r.niv] + '33', color: NIVEAUX[r.niv], fontSize: 10, fontFamily: 'monospace', padding: '2px 8px', borderRadius: 10 }}>{r.niv}</span>
                    </div>
                    <div style={{ color: T.muted, fontSize: 13, lineHeight: 1.5 }}>{r.msg}</div>
                  </div>
                ))}
              </div>
            )}

            <div style={{ marginTop: 14, background: '#1e293b', border: '1px solid #334155', borderRadius: 8, padding: '10px 14px' }}>
              <div style={{ color: '#64748b', fontSize: 11, fontFamily: 'monospace' }}>⚠️ Base non exhaustive. En cas de doute, consulter le pharmacien ou Thériaque/Vidal.</div>
            </div>
          </div>
        )}

        {tab === 'all' && (
          <div>
            {Object.entries(NIVEAUX).map(([niv, col]) => (
              <div key={niv} style={{ marginBottom: 4 }}>
                <div style={{ color: col, fontFamily: 'monospace', fontSize: 11, letterSpacing: 2, margin: '14px 0 8px' }}>{NIV_LABELS[niv]} ({DB.filter(r => r.niv === niv).length})</div>
                {DB.filter(r => r.niv === niv).map((r, i) => (
                  <div key={i} style={{ background: col + '11', border: `1px solid ${col}22`, borderLeft: `2px solid ${col}`, borderRadius: 7, padding: '10px 12px', marginBottom: 8 }}>
                    <div style={{ color: T.text, fontWeight: 600, fontSize: 13, marginBottom: 4 }}>{r.a} ↔ {r.b}</div>
                    <div style={{ color: T.muted, fontSize: 12, lineHeight: 1.5 }}>{r.msg}</div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
      <ClinicalSource sourceKey="INTERACTIONS" />
    </div>
  );
}

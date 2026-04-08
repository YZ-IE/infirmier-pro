import { useState } from 'react';
import { T, s } from '../../theme.js';
const C = T.soins || '#06b6d4';

// ── Illustrations SVG contextuelles par stade ────────────────────────────────
const WoundIllustration = ({ id, color }) => {
  const size = 72;
  const illustrations = {
    infecte: (
      <svg width={size} height={size} viewBox="0 0 72 72">
        <circle cx="36" cy="36" r="28" fill="#450a0a" stroke="#ef4444" strokeWidth="2"/>
        <ellipse cx="36" cy="36" rx="18" ry="14" fill="#7f1d1d"/>
        <circle cx="28" cy="30" r="4" fill="#ef4444" opacity="0.7"/>
        <circle cx="44" cy="34" r="3" fill="#ef4444" opacity="0.6"/>
        <circle cx="34" cy="42" r="3.5" fill="#dc2626" opacity="0.8"/>
        {/* Bactéries stylisées */}
        <ellipse cx="26" cy="28" rx="3" ry="1.5" fill="#fca5a5" opacity="0.9" transform="rotate(-20 26 28)"/>
        <ellipse cx="44" cy="32" rx="3" ry="1.5" fill="#fca5a5" opacity="0.9" transform="rotate(15 44 32)"/>
        <ellipse cx="38" cy="44" rx="3" ry="1.5" fill="#fca5a5" opacity="0.9"/>
        <text x="36" y="64" textAnchor="middle" fill="#ef4444" fontSize="8" fontFamily="monospace">INFECTÉ</text>
      </svg>
    ),
    necrose_sec: (
      <svg width={size} height={size} viewBox="0 0 72 72">
        <circle cx="36" cy="36" r="28" fill="#1c1917" stroke="#78716c" strokeWidth="2"/>
        <ellipse cx="36" cy="36" rx="18" ry="14" fill="#44403c"/>
        {/* Texture craquelée */}
        <path d="M24 30 L32 36 L28 44" stroke="#292524" strokeWidth="2" fill="none"/>
        <path d="M40 28 L44 38 L38 44" stroke="#292524" strokeWidth="2" fill="none"/>
        <path d="M28 32 L36 28 L44 34" stroke="#1c1917" strokeWidth="1.5" fill="none"/>
        <ellipse cx="36" cy="36" rx="18" ry="14" fill="none" stroke="#78716c" strokeWidth="1" strokeDasharray="3,2"/>
        <text x="36" y="64" textAnchor="middle" fill="#78716c" fontSize="7" fontFamily="monospace">NÉCROSE SÈCHE</text>
      </svg>
    ),
    necrose_hum: (
      <svg width={size} height={size} viewBox="0 0 72 72">
        <circle cx="36" cy="36" r="28" fill="#1c1507" stroke="#a16207" strokeWidth="2"/>
        <ellipse cx="36" cy="36" rx="18" ry="14" fill="#713f12"/>
        {/* Gouttes d'exsudat */}
        <ellipse cx="30" cy="34" rx="4" ry="5" fill="#a16207" opacity="0.8"/>
        <ellipse cx="42" cy="36" rx="3" ry="4" fill="#92400e" opacity="0.7"/>
        <ellipse cx="36" cy="40" rx="3.5" ry="4.5" fill="#b45309" opacity="0.8"/>
        <text x="36" y="64" textAnchor="middle" fill="#a16207" fontSize="7" fontFamily="monospace">NÉCROSE HUMIDE</text>
      </svg>
    ),
    fibrine_sec: (
      <svg width={size} height={size} viewBox="0 0 72 72">
        <circle cx="36" cy="36" r="28" fill="#1c1507" stroke="#ca8a04" strokeWidth="2"/>
        <ellipse cx="36" cy="36" rx="18" ry="13" fill="#854d0e"/>
        {/* Fibrine stylisée - filaments */}
        <path d="M22 32 Q30 28 38 34 Q46 38 50 34" stroke="#fbbf24" strokeWidth="1.5" fill="none" opacity="0.7"/>
        <path d="M24 38 Q32 34 40 38 Q46 42 50 38" stroke="#f59e0b" strokeWidth="1.5" fill="none" opacity="0.6"/>
        <path d="M26 36 Q34 30 42 36" stroke="#fbbf24" strokeWidth="1" fill="none" opacity="0.5"/>
        <text x="36" y="64" textAnchor="middle" fill="#ca8a04" fontSize="7" fontFamily="monospace">FIBRINE SÈCHE</text>
      </svg>
    ),
    fibrine_mod: (
      <svg width={size} height={size} viewBox="0 0 72 72">
        <circle cx="36" cy="36" r="28" fill="#1c1007" stroke="#d97706" strokeWidth="2"/>
        <ellipse cx="36" cy="36" rx="18" ry="13" fill="#92400e"/>
        <path d="M22 32 Q30 28 38 34 Q46 38 50 34" stroke="#fbbf24" strokeWidth="1.5" fill="none" opacity="0.8"/>
        <path d="M24 38 Q32 34 40 38 Q46 42 50 38" stroke="#f59e0b" strokeWidth="1.5" fill="none" opacity="0.7"/>
        {/* Exsudat */}
        <ellipse cx="33" cy="40" rx="3" ry="4" fill="#d97706" opacity="0.6"/>
        <ellipse cx="42" cy="37" rx="2.5" ry="3.5" fill="#b45309" opacity="0.5"/>
        <text x="36" y="64" textAnchor="middle" fill="#d97706" fontSize="7" fontFamily="monospace">FIBRINE MOD.</text>
      </svg>
    ),
    fibrine_abon: (
      <svg width={size} height={size} viewBox="0 0 72 72">
        <circle cx="36" cy="36" r="28" fill="#1c0a07" stroke="#ea580c" strokeWidth="2"/>
        <ellipse cx="36" cy="36" rx="18" ry="13" fill="#9a3412"/>
        <path d="M22 32 Q30 28 38 34 Q46 38 50 34" stroke="#fbbf24" strokeWidth="2" fill="none" opacity="0.8"/>
        <path d="M24 38 Q32 34 40 38 Q46 42 50 38" stroke="#f59e0b" strokeWidth="2" fill="none" opacity="0.7"/>
        {/* Exsudat abondant */}
        <ellipse cx="30" cy="38" rx="4" ry="5.5" fill="#ea580c" opacity="0.6"/>
        <ellipse cx="42" cy="36" rx="3.5" ry="5" fill="#c2410c" opacity="0.6"/>
        <ellipse cx="36" cy="43" rx="3" ry="4" fill="#ea580c" opacity="0.5"/>
        <text x="36" y="64" textAnchor="middle" fill="#ea580c" fontSize="7" fontFamily="monospace">FIBRINE +++</text>
      </svg>
    ),
    bourgeon_peu: (
      <svg width={size} height={size} viewBox="0 0 72 72">
        <circle cx="36" cy="36" r="28" fill="#052e16" stroke="#16a34a" strokeWidth="2"/>
        <ellipse cx="36" cy="36" rx="18" ry="13" fill="#14532d"/>
        {/* Tissu de granulation - petits nodules */}
        {[[28,32],[34,28],[41,31],[38,38],[29,40],[44,37],[36,44]].map(([cx,cy],i) => (
          <circle key={i} cx={cx} cy={cy} r="3.5" fill="#16a34a" opacity="0.7"/>
        ))}
        {/* Vaisseaux */}
        <path d="M24 36 Q36 30 48 36" stroke="#dc2626" strokeWidth="1" fill="none" opacity="0.4"/>
        <text x="36" y="64" textAnchor="middle" fill="#16a34a" fontSize="7" fontFamily="monospace">BOURGEON +</text>
      </svg>
    ),
    bourgeon_abon: (
      <svg width={size} height={size} viewBox="0 0 72 72">
        <circle cx="36" cy="36" r="28" fill="#052e16" stroke="#15803d" strokeWidth="2"/>
        <ellipse cx="36" cy="36" rx="18" ry="13" fill="#166534"/>
        {[[26,30],[31,26],[37,28],[43,30],[46,36],[43,42],[37,44],[30,42],[24,37],[28,35],[40,34],[35,38]].map(([cx,cy],i) => (
          <circle key={i} cx={cx} cy={cy} r="3.5" fill="#22c55e" opacity="0.65"/>
        ))}
        {/* Exsudat */}
        <ellipse cx="33" cy="42" rx="3" ry="4" fill="#15803d" opacity="0.5"/>
        <ellipse cx="42" cy="39" rx="2.5" ry="3.5" fill="#166534" opacity="0.4"/>
        <path d="M24 36 Q36 30 48 36" stroke="#dc2626" strokeWidth="1.5" fill="none" opacity="0.5"/>
        <text x="36" y="64" textAnchor="middle" fill="#22c55e" fontSize="7" fontFamily="monospace">BOURGEON +++</text>
      </svg>
    ),
    epith: (
      <svg width={size} height={size} viewBox="0 0 72 72">
        <circle cx="36" cy="36" r="28" fill="#0c1a2e" stroke="#0ea5e9" strokeWidth="2"/>
        {/* Peau refermée avec cicatrice */}
        <ellipse cx="36" cy="36" rx="20" ry="15" fill="#075985"/>
        {/* Épithélium en progression depuis les bords */}
        <path d="M18 36 Q20 28 28 30 Q36 32 36 36 Q36 32 44 30 Q52 28 54 36" fill="#0ea5e9" opacity="0.5"/>
        <path d="M18 36 Q20 44 28 42 Q36 40 36 36 Q36 40 44 42 Q52 44 54 36" fill="#0ea5e9" opacity="0.5"/>
        {/* Cicatrice centrale fine */}
        <path d="M28 36 Q36 34 44 36" stroke="#7dd3fc" strokeWidth="1.5" fill="none" opacity="0.8"/>
        {/* Étincelles de régénération */}
        <circle cx="24" cy="32" r="2" fill="#38bdf8" opacity="0.6"/>
        <circle cx="48" cy="32" r="2" fill="#38bdf8" opacity="0.6"/>
        <circle cx="24" cy="40" r="2" fill="#38bdf8" opacity="0.6"/>
        <circle cx="48" cy="40" r="2" fill="#38bdf8" opacity="0.6"/>
        <text x="36" y="64" textAnchor="middle" fill="#0ea5e9" fontSize="7" fontFamily="monospace">ÉPITHÉLIALISATION</text>
      </svg>
    ),
  };
  return illustrations[id] || null;
};

// ── Données depuis Sources_pansements.pdf ────────────────────────────────────
const PHASES = [
  {
    id: 'infecte',
    label: 'INFECTÉ',
    color: '#ef4444',
    icon: '🦠',
    desc: 'Tous niveaux d\'exsudat',
    action: 'Antisepsie',
    pansements: [
      { nom: 'Argent (Ag)', ex: 'Mepilex Ag, Aquacel Ag', detail: 'Argent ionique bactéricide large spectre. Ne pas utiliser >14j en continu.' },
      { nom: 'Miel médical (Medihoney)', ex: 'Medihoney, L-Mesitran', detail: 'Actif osmotique + H₂O₂ → antibactérien. Ramollit la fibrine. Odeur forte normale.' },
      { nom: 'PHMB (Polyhexaméthylène biguanide)', ex: 'Kerlix AMD, Suprasorb X+PHMB', detail: 'Antiseptique non cytotoxique. Compatible avec cicatrisation.' },
    ],
    freq: 'TLJ (toutes les 24h)',
    bgColor: '#450a0a',
    images: ['🦠','🔴'],
  },
  {
    id: 'necrose_sec',
    label: 'NÉCROSE — Sèche',
    color: '#78716c',
    icon: '🪨',
    desc: 'Exsudat : sec / absent',
    action: 'Hydrater pour ramollir',
    pansements: [
      { nom: 'Hydrogel', ex: 'Purilon, Intrasite, Askina Gel', detail: '>80% eau. Ramollit la nécrose sèche par réhydratation. Appliquer généreusement. Couvrir d\'un film.' },
      { nom: 'Film semi-perméable (couverture)', ex: 'Tegaderm, Opsite', detail: 'Utilisé en 2ème couche pour maintenir l\'humidité du gel. Seul il est inadapté ici.' },
      { nom: 'Hydrocolloïde (si nécrose fine)', ex: 'Comfeel, Duoderm', detail: 'Maintient un milieu humide favorisant l\'autolyse. Éviter si suspicion d\'infection.' },
    ],
    freq: 'TLJ',
    bgColor: '#1c1917',
    images: ['🪨','💧'],
  },
  {
    id: 'necrose_hum',
    label: 'NÉCROSE — Humide',
    color: '#a16207',
    icon: '💧',
    desc: 'Exsudat : modéré à abondant',
    action: 'Détersion + absorption',
    pansements: [
      { nom: 'Alginate de calcium', ex: 'Algostéril, Seasorb, Melgisorb', detail: 'Très haute absorption. Forme un gel au contact des exsudats → favorise la détersion. Hémostase. Humidifier avant retrait si sec.' },
      { nom: 'Hydrofibre (CMC)', ex: 'Aquacel, Versiva XC', detail: 'Gélification verticale (anti-macération des berges). Haute absorption. Forme un gel cohésif.' },
    ],
    freq: 'TLJ',
    bgColor: '#1c1507',
    images: ['💧','🟫'],
  },
  {
    id: 'fibrine_sec',
    label: 'FIBRINE — Sèche',
    color: '#ca8a04',
    icon: '🟡',
    desc: 'Exsudat : peu ou absent',
    action: 'Détersion / Ramollissement',
    pansements: [
      { nom: 'Hydrogel', ex: 'Purilon, Intrasite Gel', detail: 'Réhydrate la fibrine sèche et favorise l\'autolyse. Couvrir d\'un film ou compresse.' },
      { nom: 'Film semi-perméable', ex: 'Tegaderm, Opsite', detail: 'Couverture légère maintenant l\'humidité. Transparent → surveillance aisée.' },
    ],
    freq: 'TLJ',
    bgColor: '#1c1507',
    images: ['🟡','🔶'],
  },
  {
    id: 'fibrine_mod',
    label: 'FIBRINE — Modérée',
    color: '#d97706',
    icon: '🟠',
    desc: 'Exsudat : + à ++',
    action: 'Absorber + détersion',
    pansements: [
      { nom: 'Alginate de calcium', ex: 'Algostéril, Melgisorb', detail: 'Absorption modérée à élevée. Déterse la fibrine. Hémostase. Réhydrater avant retrait si collé.' },
      { nom: 'Hydrofibre', ex: 'Aquacel Extra, Durafiber', detail: 'Gélification verticale → protège les berges. Haute capacité d\'absorption.' },
    ],
    freq: 'TLJ',
    bgColor: '#1c1007',
    images: ['🟠','💦'],
  },
  {
    id: 'fibrine_abon',
    label: 'FIBRINE — Abondante',
    color: '#ea580c',
    icon: '🔶',
    desc: 'Exsudat : +++',
    action: 'Pomper (absorber max)',
    pansements: [
      { nom: 'Super-absorbant', ex: 'Zetuvit Plus, Eclypse, Kerramax', detail: 'Capacité d\'absorption extrême. Évite les fuites, protège la peau péri-lésionnelle. Pour plaies très exsudatives.' },
      { nom: 'Irrigo-détersif', ex: 'Prontosan gel, Octenilin gel', detail: 'Détersion + antisepsie locale douce. Utilisé en lavage ou compresse imprégnée.' },
    ],
    freq: 'TLJ',
    bgColor: '#1c0a07',
    images: ['🔶','💦'],
  },
  {
    id: 'bourgeon_peu',
    label: 'BOURGEONNEMENT',
    color: '#16a34a',
    icon: '🌱',
    desc: 'Exsudat : + (faible)',
    action: 'Protéger le tissu fragile',
    pansements: [
      { nom: 'Interface silicone (atraumatique)', ex: 'Mepitel, Urgotul, Physiotulle', detail: 'Contact doux non adhérent → retrait sans traumatisme ni douleur. Idéal bourgeonnement fragile.' },
      { nom: 'Tulle gras', ex: 'Jelonet, Adaptic', detail: 'Classique. Non adhérent. Peu absorbant → associer compresse si exsudat.' },
      { nom: 'Mousse (fine)', ex: 'Mepilex Lite, Biatain Silicone Lite', detail: 'Protection + légère absorption. Silicone en contact → atraumatique.' },
    ],
    freq: '2 à 3 jours',
    bgColor: '#052e16',
    images: ['🌱','💚'],
  },
  {
    id: 'bourgeon_abon',
    label: 'BOURGEONNEMENT',
    color: '#15803d',
    icon: '🌿',
    desc: 'Exsudat : ++ à +++',
    action: 'Absorber + protéger',
    pansements: [
      { nom: 'Hydrocellulaire / Mousse', ex: 'Mepilex, Biatain, Allevyn', detail: 'Absorption verticale importante. Anti-macération. Mousse polyuréthane. Nombreuses déclinaisons (border, lite, concave, sacrum, talon...).' },
      { nom: 'Super-absorbant', ex: 'Zetuvit Plus, Eclypse Border', detail: 'Pour exsudats très importants. Évite les changements trop fréquents.' },
    ],
    freq: '2 à 3 jours',
    bgColor: '#052e16',
    images: ['🌿','💦'],
  },
  {
    id: 'epith',
    label: 'ÉPITHÉLIALISATION',
    color: '#0ea5e9',
    icon: '✨',
    desc: 'Exsudat : +/- (minime)',
    action: 'Protéger la cicatrice naissante',
    pansements: [
      { nom: 'Hydrocolloïde mince', ex: 'Duoderm Thin, Comfeel Plus Transparent', detail: 'Maintient milieu humide optimal. Transparent pour surveillance. Change tous 3-4j si tient bien.' },
      { nom: 'Interface silicone', ex: 'Mepitel One, Urgotul Duo', detail: 'Contact doux. Atraumatique. Protège l\'épithélium néoformé fragile.' },
      { nom: 'Film semi-perméable', ex: 'Tegaderm, Opsite Flexigrid', detail: 'Protection légère imperméable à l\'eau. Pour petites plaies en épithélialisation avancée.' },
    ],
    freq: '3 à 4 jours',
    bgColor: '#0c1a2e',
    images: ['✨','🔵'],
  },
];

const PROPRIETES = [
  { nom: 'Hydrogel', prop: '>80% eau — Réhydrate et ramollit', usage: 'Nécrose sèche, fibrine sèche', icon: '💧' },
  { nom: 'Alginate / Hydrofibre', prop: 'Absorption max + Hémostase', usage: 'Nécrose humide, fibrine modérée', icon: '🧽' },
  { nom: 'Hydrocellulaire (Mousse)', prop: 'Absorption verticale — anti-macération', usage: 'Bourgeonnement exsudatif', icon: '🟩' },
  { nom: 'Super-absorbant', prop: 'Capacité extrême — fuites évitées', usage: 'Exsudats +++ quelle que soit la phase', icon: '🔵' },
  { nom: 'Charbon actif', prop: 'Neutralise les odeurs', usage: 'Plaies nécrotiques malodorantes', icon: '⚫' },
  { nom: 'Interface silicone', prop: 'Atraumatique — retrait sans douleur', usage: 'Peau fragile, bourgeonnement', icon: '🌸' },
  { nom: 'Argent (Ag)', prop: 'Bactéricide large spectre', usage: 'Plaies infectées ou à risque', icon: '⚡' },
  { nom: 'Miel médical', prop: 'Antibactérien osmotique + détersion', usage: 'Infection, fibrine résistante', icon: '🍯' },
  { nom: 'Film semi-perméable', prop: 'Transparent, imperméable, fin', usage: 'Couverture, épithélialisation', icon: '🪟' },
];

const REGLES = [
  { regle: 'Plaie chronique', action: 'Nettoyage Eau + Savon doux ou Sérum physiologique', icon: '🚿' },
  { regle: 'Antiseptique utilisé', action: '⚠️ Rinçage OBLIGATOIRE → cytotoxique pour les cellules', icon: '⚠️' },
  { regle: 'Escarre', action: 'DÉCHARGE de l\'appui = PRIORITÉ N°1 avant tout pansement', icon: '🛏️' },
  { regle: 'Ulcère veineux', action: 'Compression par bandes = INDISPENSABLE', icon: '🩹' },
  { regle: 'Pied diabétique', action: 'NO occlusion totale → Danger infectieux', icon: '🚫' },
  { regle: 'Retrait adhésif', action: 'Traction parallèle à la peau (jamais perpendiculaire)', icon: '↔️' },
];

const CLASSIFICATION = [
  { classe: 'Classe I', ex: 'Compresses, tulles simples', remb: 'Inscription liste + tarif fixé' },
  { classe: 'Classe II', ex: 'Pansements actifs (hydrocolloïdes, alginates...)', remb: 'Prescription médicale nécessaire' },
  { classe: 'Classe III', ex: 'Argent, résorbables', remb: 'Prescription + protocole validé' },
];

export default function Pansements() {
  const [vue, setVue] = useState('tableau'); // 'tableau' | 'proprietes' | 'regles' | 'lppr'
  const [phaseOpen, setPhaseOpen] = useState(null);

  const tabs = [
    { id: 'tableau',    label: 'Tableau décisionnel', icon: '📊' },
    { id: 'proprietes', label: 'Propriétés DM',       icon: '🔬' },
    { id: 'regles',     label: 'Règles cliniques',    icon: '📏' },
    { id: 'lppr',       label: 'LPPR / Légal',        icon: '⚖️' },
  ];

  return (
    <div style={{ padding: '14px' }}>
      {/* Infos anatomie peau */}
      <div style={{ ...s.card, background: '#0c1a2e', marginBottom: 10 }}>
        <div style={{ color: C, fontWeight: 700, marginBottom: 4 }}>🩻 Rappel — Structure de la peau</div>
        <div style={{ color: T.muted, fontSize: 12, lineHeight: 1.6 }}>
          <b style={{ color: T.text }}>3 couches :</b> Épiderme (5 ss-couches) · Derme (collagène + nerfs) · Hypoderme (tissu gras){'\n'}
          <b style={{ color: T.text }}>Thermorégulation :</b> 32–36°C · <b style={{ color: T.text }}>Élasticité</b> → plasticité cutanée
        </div>
      </div>

      {/* Phases de cicatrisation */}
      <div style={{ ...s.card, background: '#0c1a2e', marginBottom: 12 }}>
        <div style={{ color: C, fontWeight: 700, marginBottom: 8 }}>🔄 Phases de cicatrisation</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
          {[
            { phase: 'J0', label: 'Hémostase', detail: 'Caillot fibrine', color: '#ef4444' },
            { phase: 'J0–21', label: 'Inflammation', detail: 'Macrophages / nettoyage', color: '#f97316' },
            { phase: 'J3–21', label: 'Bourgeonnement', detail: 'Angiogenèse / fibroblastes', color: '#22c55e' },
            { phase: 'Final', label: 'Épithélialisation', detail: 'Fermeture cutanée', color: '#0ea5e9' },
          ].map(p => (
            <div key={p.phase} style={{ background: '#0f172a', borderRadius: 8, padding: '8px 10px', borderLeft: `3px solid ${p.color}` }}>
              <div style={{ color: p.color, fontFamily: 'monospace', fontSize: 10, marginBottom: 2 }}>{p.phase}</div>
              <div style={{ color: T.text, fontWeight: 600, fontSize: 12 }}>{p.label}</div>
              <div style={{ color: T.muted, fontSize: 11 }}>{p.detail}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Onglets */}
      <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4, marginBottom: 12 }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setVue(t.id)}
            style={{ ...s.btn(vue === t.id ? C : '#334155'), padding: '7px 11px', fontSize: 11, whiteSpace: 'nowrap', flexShrink: 0 }}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* ── Tableau décisionnel ── */}
      {vue === 'tableau' && (
        <div>
          <div style={{ color: T.muted, fontSize: 12, marginBottom: 10 }}>
            Sélectionner le stade de la plaie pour voir les pansements adaptés.
          </div>
          {PHASES.map(p => (
            <div key={p.id}>
              <div onClick={() => setPhaseOpen(phaseOpen === p.id ? null : p.id)}
                style={{ ...s.card, background: p.bgColor, borderLeft: `4px solid ${p.color}`, cursor: 'pointer', marginBottom: phaseOpen === p.id ? 0 : undefined }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{ fontSize: 20 }}>{p.icon}</span>
                      <span style={{ color: p.color, fontWeight: 700, fontSize: 14 }}>{p.label}</span>
                    </div>
                    <div style={{ color: T.muted, fontSize: 11 }}>Exsudat : <b style={{ color: T.text }}>{p.desc.split(':')[1]?.trim()}</b></div>
                    <div style={{ color: p.color, fontSize: 11, fontFamily: 'monospace', marginTop: 2 }}>
                      Action : {p.action}
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                    <span style={{ background: p.color + '22', color: p.color, fontSize: 9, fontFamily: 'monospace', padding: '2px 7px', borderRadius: 10 }}>
                      {p.freq}
                    </span>
                    <span style={{ color: T.muted, fontSize: 16 }}>{phaseOpen === p.id ? '▲' : '▼'}</span>
                  </div>
                </div>
              </div>
              {phaseOpen === p.id && (
                <div style={{ background: '#0f172a', border: `1px solid ${p.color}44`, borderTop: 'none', borderRadius: '0 0 10px 10px', padding: '12px', marginBottom: 10 }}>
                  {/* Illustration contextuelle */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12, padding: '10px', background: '#0a0f1a', borderRadius: 10 }}>
                    <WoundIllustration id={p.id} color={p.color} />
                    <div>
                      <div style={{ color: p.color, fontWeight: 700, fontSize: 12, marginBottom: 3 }}>Aspect clinique — {p.label}</div>
                      <div style={{ color: T.muted, fontSize: 11, lineHeight: 1.5 }}>{p.desc}</div>
                      <div style={{ color: p.color, fontSize: 11, fontFamily: 'monospace', marginTop: 4 }}>🎯 {p.action}</div>
                    </div>
                  </div>
                  {p.pansements.map((pm, i) => (
                    <div key={i} style={{ background: '#1e293b', borderRadius: 8, padding: '10px 12px', marginBottom: 8, borderLeft: `3px solid ${p.color}88` }}>
                      <div style={{ color: T.text, fontWeight: 700, fontSize: 13, marginBottom: 2 }}>{pm.nom}</div>
                      <div style={{ color: p.color, fontSize: 11, marginBottom: 4, fontStyle: 'italic' }}>Ex : {pm.ex}</div>
                      <div style={{ color: T.muted, fontSize: 12, lineHeight: 1.5 }}>{pm.detail}</div>
                    </div>
                  ))}
                  <div style={{ color: T.muted, fontSize: 11, marginTop: 4, fontFamily: 'monospace' }}>
                    🕐 Fréquence de change : {p.freq}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── Propriétés DM ── */}
      {vue === 'proprietes' && (
        <div>
          {PROPRIETES.map((p, i) => (
            <div key={i} style={{ ...s.card }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <span style={{ fontSize: 24, flexShrink: 0 }}>{p.icon}</span>
                <div>
                  <div style={{ color: T.text, fontWeight: 700, fontSize: 13, marginBottom: 2 }}>{p.nom}</div>
                  <div style={{ color: C, fontSize: 12, marginBottom: 4 }}>{p.prop}</div>
                  <div style={{ color: T.muted, fontSize: 11 }}>Indiqué : {p.usage}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Règles cliniques ── */}
      {vue === 'regles' && (
        <div>
          {REGLES.map((r, i) => (
            <div key={i} style={{ ...s.card, borderLeft: '3px solid #f59e0b' }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <span style={{ fontSize: 22, flexShrink: 0 }}>{r.icon}</span>
                <div>
                  <div style={{ color: '#f59e0b', fontWeight: 700, fontSize: 12, marginBottom: 3, fontFamily: 'monospace' }}>
                    IF {r.regle}
                  </div>
                  <div style={{ color: T.text, fontSize: 13 }}>→ {r.action}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── LPPR ── */}
      {vue === 'lppr' && (
        <div>
          <div style={{ ...s.card, background: '#0c1a2e', borderLeft: '3px solid #a78bfa' }}>
            <div style={{ color: '#a78bfa', fontWeight: 700, marginBottom: 6 }}>⚖️ Classification LPPR des pansements</div>
            <div style={{ color: T.muted, fontSize: 12, lineHeight: 1.6 }}>
              Liste des Produits et Prestations Remboursables — pansements remboursables sur prescription médicale.
            </div>
          </div>
          {CLASSIFICATION.map((c, i) => (
            <div key={i} style={{ ...s.card, borderLeft: '3px solid #a78bfa' }}>
              <div style={{ color: '#a78bfa', fontWeight: 700, fontFamily: 'monospace', fontSize: 12, marginBottom: 4 }}>{c.classe}</div>
              <div style={{ color: T.text, fontSize: 13, marginBottom: 4 }}>{c.ex}</div>
              <div style={{ color: T.muted, fontSize: 12 }}>{c.remb}</div>
            </div>
          ))}
          <div style={{ ...s.card, background: '#1c0a07', borderLeft: '3px solid #ef4444' }}>
            <div style={{ color: '#ef4444', fontWeight: 700, fontSize: 12, marginBottom: 4 }}>⚠️ Rappel réglementaire</div>
            <div style={{ color: T.muted, fontSize: 12, lineHeight: 1.5 }}>
              Les pansements de classe II et III nécessitent une ordonnance médicale.
              La pose et le choix clinique relèvent du rôle propre infirmier (art. R.4311-5 CSP) mais la prescription médicale reste obligatoire pour le remboursement.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

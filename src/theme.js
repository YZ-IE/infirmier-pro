// ─── Thème global Infirmier ─────────────────────────────────────────────────
// Palette sombre professionnelle médicale
// ⚠️ Ce fichier est la FUSION de l'ancien et du nouveau thème.
// Ne pas supprimer les clés héritées (surface2, border2, *Dim, s.result, s.tag)
// car elles sont utilisées par les anciens modules non mis à jour.

export const T = {
  // Fond & surfaces
  bg:       '#0a0f1a',   // Fond principal (mis à jour)
  surface:  '#111827',   // Surface cartes  (mis à jour)
  surface2: '#1e293b',   // Surface secondaire (héritage — ne pas supprimer)
  border:   '#1e293b',   // Bordures
  border2:  '#475569',   // Bordures secondaires (héritage — ne pas supprimer)

  // Textes
  text:     '#f1f5f9',
  muted:    '#64748b',

  // Couleurs modules
  iatr:     '#f43f5e',   // Iatrogénique  — rose/rouge
  urg:      '#f97316',   // Urgences      — orange
  score:    '#a78bfa',   // Scores        — violet
  soins:    '#06b6d4',   // Soins         — cyan
  orga:     '#22c55e',   // Organisation  — vert
  form:     '#fbbf24',   // Formation     — ambre
  ia:       '#38bdf8',   // IA / Formation — bleu ciel

  // Fonds sombres par module (tous conservés)
  iatrDim:  '#1a0a12',
  urgDim:   '#431407',
  scoreDim: '#13102a',
  soinsDim: '#0c1a2e',
  orgaDim:  '#052e16',
  formDim:  '#451a03',
  iaDim:    '#0c1e2e',
};

// ─── Styles communs ──────────────────────────────────────────────────────────
// Toutes les clés sont conservées pour compatibilité avec les anciens modules.
export const s = {
  card: {
    background: '#111827',
    border: '1px solid #1e293b',
    borderRadius: 12,
    padding: '14px',
    marginBottom: 10,
  },
  label: {
    display: 'block',
    color: '#94a3b8',
    fontSize: 11,
    fontFamily: 'monospace',
    letterSpacing: 1,
    marginBottom: 5,
    textTransform: 'uppercase',
  },
  input: {
    width: '100%',
    background: '#0f172a',
    border: '1px solid #334155',
    borderRadius: 8,
    padding: '9px 12px',
    color: '#f1f5f9',
    fontSize: 13,
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
  },
  // Héritage — utilisé par Glasgow, EVA, Norton, Morse, QSOFA, MMSE, Braden, NAS, etc.
  result: (color) => ({
    background: color + '18',
    border: `1px solid ${color}44`,
    borderRadius: 8,
    padding: '12px 16px',
    marginTop: 12,
  }),
  // Héritage — utilisé par plusieurs modules Iatrogenique et Scores
  tag: (color) => ({
    background: color + '22',
    border: `1px solid ${color}44`,
    color,
    padding: '3px 10px',
    borderRadius: 20,
    fontSize: 11,
    fontFamily: 'monospace',
  }),
  btn: (color) => ({
    background: color + '22',
    border: `1px solid ${color}66`,
    color: color,
    borderRadius: 8,
    padding: '8px 14px',
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: 'inherit',
    transition: 'all 0.15s',
  }),
};

/**
 * templates.js — Aide-Mémoire
 * Templates de spécialités avec champs pré-configurés
 *
 * Types :  'text' | 'select' | 'boolean' | 'number'
 * Persistance :
 *   true  → par séjour (conservé jusqu'à la sortie du patient)
 *   false → journalier (réinitialisé chaque jour ou sur demande)
 * Catégories :
 *   'flag' | 'info' | 'observation' | 'constante'
 */

export const SPECIALTIES = [
  { id: 'traumato',  label: '🦴 Traumatologie', color: '#f97316' },
  { id: 'neuro',     label: '🧠 Neurologie',     color: '#a78bfa' },
  { id: 'chirurgie', label: '🔪 Chirurgie',       color: '#06b6d4' },
  { id: 'medecine',  label: '🫀 Médecine',        color: '#22c55e' },
  { id: 'pediatrie', label: '👶 Pédiatrie',       color: '#fbbf24' },
  { id: 'custom',    label: '⚙️ Personnalisé',    color: '#64748b' },
];

const COMMON_FLAGS = [
  { id: 'allergie',  label: '⚠️ Allergie',       type: 'text',    persistent: true,  category: 'flag' },
  { id: 'chute',     label: '🔴 Risque chute',    type: 'boolean', persistent: true,  category: 'flag' },
  { id: 'isolement', label: '🟡 Isolement',        type: 'select',  persistent: true,  category: 'flag',
    options: ['Contact', 'Gouttelettes', 'Air', 'Protecteur'] },
  { id: 'npo',       label: '🚫 À jeun (NPO)',    type: 'boolean', persistent: false, category: 'flag' },
  { id: 'douleur',   label: '💊 Antalgie',         type: 'select',  persistent: false, category: 'flag',
    options: ['Palier 1', 'Palier 2', 'Palier 3 LP', 'Palier 3 sb'] },
];

export const TEMPLATES = {
  traumato: { fields: [
    ...COMMON_FLAGS,
    { id: 'j_postop',  label: 'J post-op',        type: 'number',  persistent: false, category: 'info' },
    { id: 'rdv_chir',  label: 'RDV Chirurgie',     type: 'text',    persistent: true,  category: 'info' },
    { id: 'appui',     label: 'Appui',              type: 'select',  persistent: true,  category: 'observation',
      options: ['Total', 'Partiel', 'Non autorisé', 'À préciser'] },
    { id: 'zimmer',    label: 'Zimmer / Attelle',   type: 'text',    persistent: true,  category: 'observation' },
    { id: 'avq',       label: 'AVQ / Soins',        type: 'select',  persistent: false, category: 'observation',
      options: ['Autonome', 'Aide partielle', 'Aide totale'] },
    { id: 'hbpm',      label: 'HBPM',               type: 'boolean', persistent: true,  category: 'observation' },
    { id: 'pst',       label: 'Pansement',           type: 'boolean', persistent: false, category: 'observation' },
    { id: 'constantes',label: 'Constantes',          type: 'text',    persistent: false, category: 'constante' },
  ]},

  neuro: { fields: [
    ...COMMON_FLAGS,
    { id: 'fausses_routes', label: '⚡ Fausses routes', type: 'boolean', persistent: true,  category: 'flag' },
    { id: 'cognition',      label: 'Troubles cognitifs', type: 'boolean', persistent: true,  category: 'flag' },
    { id: 'const_freq',     label: 'Fréquence constantes', type: 'select', persistent: true, category: 'constante',
      options: ['1×/jour', '3×/jour', 'Toutes les 4h', 'Continue'] },
    { id: 'continence',     label: 'Continence',          type: 'select',  persistent: false, category: 'observation',
      options: ['Continent', 'Incontinent', 'Protection', 'Sondage'] },
    { id: 'motricite',      label: 'Mobilité',             type: 'select',  persistent: false, category: 'observation',
      options: ['Autonome', 'Aide humaine', 'Fauteuil', 'Alité'] },
    { id: 'contention',     label: 'Contention',           type: 'boolean', persistent: false, category: 'observation' },
    { id: 'regime',         label: 'Régime',               type: 'select',  persistent: true,  category: 'observation',
      options: ['Normal', 'Haché fin', 'Mixé', 'Liquide épaissi', 'NE'] },
    { id: 'constantes',     label: 'Constantes',           type: 'text',    persistent: false, category: 'constante' },
  ]},

  chirurgie: { fields: [
    ...COMMON_FLAGS,
    { id: 'stomie',   label: '🩺 Stomie',          type: 'boolean', persistent: true,  category: 'flag' },
    { id: 'j_postop', label: 'J post-op',           type: 'number',  persistent: false, category: 'info' },
    { id: 'rdv_chir', label: 'RDV Chirurgie',        type: 'text',    persistent: true,  category: 'info' },
    { id: 'appui',    label: 'Appui',                type: 'select',  persistent: false, category: 'observation',
      options: ['Total', 'Partiel', 'Non autorisé'] },
    { id: 'drain',    label: 'Drain',                type: 'text',    persistent: false, category: 'observation' },
    { id: 'transit',  label: 'Reprise transit',      type: 'select',  persistent: false, category: 'observation',
      options: ['Non', 'Gaz', 'Selles'] },
    { id: 'avq',      label: 'AVQ / Soins',          type: 'select',  persistent: false, category: 'observation',
      options: ['Autonome', 'Aide partielle', 'Aide totale'] },
    { id: 'pst',      label: 'Pansement',             type: 'boolean', persistent: false, category: 'observation' },
    { id: 'constantes',label: 'Constantes',           type: 'text',    persistent: false, category: 'constante' },
  ]},

  medecine: { fields: [
    ...COMMON_FLAGS,
    { id: 'rdv_ext',    label: 'RDV / Examens',          type: 'text',    persistent: true,  category: 'info' },
    { id: 'bilan_bio',  label: 'Bilan bio à récupérer',  type: 'text',    persistent: false, category: 'info' },
    { id: 'oxygenation',label: 'Oxygénothérapie',        type: 'text',    persistent: false, category: 'observation' },
    { id: 'diurese',    label: 'Diurèse surveillée',     type: 'boolean', persistent: false, category: 'observation' },
    { id: 'poids',      label: 'Poids (kg)',              type: 'number',  persistent: false, category: 'constante' },
    { id: 'constantes', label: 'Constantes',              type: 'text',    persistent: false, category: 'constante' },
  ]},

  pediatrie: { fields: [
    ...COMMON_FLAGS,
    { id: 'poids',        label: 'Poids (kg)',          type: 'number',  persistent: true,  category: 'info' },
    { id: 'flacc',        label: 'Douleur FLACC /10',   type: 'number',  persistent: false, category: 'constante' },
    { id: 'alimentation', label: 'Alimentation',         type: 'select',  persistent: false, category: 'observation',
      options: ['Sein', 'Biberon', 'Mixte', 'NGT', 'Autonome'] },
    { id: 'accompagnant', label: 'Accompagnant présent', type: 'boolean', persistent: false, category: 'observation' },
    { id: 'avq',          label: 'AVQ / Soins',          type: 'select',  persistent: false, category: 'observation',
      options: ['Parent', 'Aide IDE', 'Autonome'] },
    { id: 'constantes',   label: 'Constantes',           type: 'text',    persistent: false, category: 'constante' },
  ]},

  custom: { fields: [...COMMON_FLAGS] },
};

/** Retourne les champs d'un template (copie pour éviter les mutations) */
export function getTemplateFields(specialtyId) {
  const tpl = TEMPLATES[specialtyId] || TEMPLATES.custom;
  return tpl.fields.map(f => ({
    ...f,
    options: f.options ? [...f.options] : undefined,
  }));
}

/** Retourne la spécialité par id */
export function getSpecialty(id) {
  return SPECIALTIES.find(s => s.id === id) || SPECIALTIES[SPECIALTIES.length - 1];
}

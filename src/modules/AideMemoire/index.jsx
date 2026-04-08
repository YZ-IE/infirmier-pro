/**
 * index.jsx — Module Aide-Mémoire
 * Point d'entrée : gestion du PIN et navigation entre tous les écrans
 *
 * ── Intégration dans App.jsx ──────────────────────────────────────────────────
 * 1. Import :
 *    import AideMemoire from './modules/AideMemoire/index.jsx';
 *
 * 2. Dans const MODULES (ou équivalent) :
 *    { id: 'aidemem', label: 'Aide-Mémoire', color: '#6366f1', icon: '📋' }
 *
 * 3. Dans renderModule() :
 *    if (mod === 'aidemem') return <AideMemoire onBack={goHome} />;
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useState, useEffect } from 'react';
import { T } from '../../theme.js';
import { isPinSet } from './crypto.js';

import PinScreen      from './PinScreen.jsx';
import ServicesScreen from './ServicesScreen.jsx';
import ServiceView    from './ServiceView.jsx';
import PatientSheet   from './PatientSheet.jsx';
import QuickEntry     from './QuickEntry.jsx';

// Couleur identitaire — Indigo
const ACCENT = '#6366f1';

/**
 * État de navigation :
 *  'pin'      → PinScreen (création ou vérification)
 *  'services' → ServicesScreen (liste des services)
 *  'service'  → ServiceView (vue d'un service)
 *  'patient'  → PatientSheet (fiche patient)
 *  'quick'    → QuickEntry (saisie rapide)
 */
const INITIAL_NAV = {
  screen:     'pin',
  service:    null,
  patientId:  null,
  refreshKey: 0,    // incrémenté pour forcer le rechargement de ServiceView
};

export default function AideMemoire({ onBack }) {
  const [cryptoKey, setCryptoKey] = useState(null);
  const [pinExists, setPinExists] = useState(null); // null = init en cours
  const [nav,       setNav]       = useState(INITIAL_NAV);

  // ─── Vérification PIN au montage ─────────────────────────────────────────

  useEffect(() => {
    isPinSet().then(setPinExists);
  }, []);

  // ─── Helpers navigation ───────────────────────────────────────────────────

  function goTo(screen, extras = {}) {
    setNav(prev => ({ ...prev, screen, ...extras }));
  }

  function goBack() {
    setNav(prev => {
      switch (prev.screen) {
        case 'patient':
        case 'quick':
          return { ...prev, screen: 'service', refreshKey: prev.refreshKey + 1 };
        case 'service':
          return { ...prev, screen: 'services', service: null };
        case 'services':
          // Verrouiller et quitter le module
          setCryptoKey(null);
          onBack();
          return INITIAL_NAV;
        default:
          setCryptoKey(null);
          onBack();
          return INITIAL_NAV;
      }
    });
  }

  // ─── Chargement initial ───────────────────────────────────────────────────

  if (pinExists === null) {
    return (
      <div style={{ background: T.bg, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ color: T.muted, fontSize: 14 }}>Chargement…</span>
      </div>
    );
  }

  // ─── PIN ─────────────────────────────────────────────────────────────────

  if (!cryptoKey || nav.screen === 'pin') {
    return (
      <PinScreen
        pinExists={pinExists}
        accentColor={ACCENT}
        onUnlocked={key => {
          setCryptoKey(key);
          goTo('services');
        }}
        onBack={onBack}
      />
    );
  }

  // ─── Services ────────────────────────────────────────────────────────────

  if (nav.screen === 'services') {
    return (
      <ServicesScreen
        cryptoKey={cryptoKey}
        accentColor={ACCENT}
        onBack={goBack}
        onSelectService={service => goTo('service', { service, patientId: null })}
      />
    );
  }

  // ─── Vue service ──────────────────────────────────────────────────────────

  if (nav.screen === 'service' && nav.service) {
    return (
      <ServiceView
        service={nav.service}
        cryptoKey={cryptoKey}
        accentColor={ACCENT}
        refreshKey={nav.refreshKey}
        onBack={goBack}
        onSelectPatient={patientId => goTo('patient', { patientId })}
        onQuickEntry={() => goTo('quick')}
      />
    );
  }

  // ─── Fiche patient ────────────────────────────────────────────────────────

  if (nav.screen === 'patient' && nav.service && nav.patientId) {
    return (
      <PatientSheet
        patientId={nav.patientId}
        service={nav.service}
        cryptoKey={cryptoKey}
        accentColor={ACCENT}
        onBack={goBack}
      />
    );
  }

  // ─── Saisie rapide ────────────────────────────────────────────────────────

  if (nav.screen === 'quick' && nav.service) {
    return (
      <QuickEntry
        service={nav.service}
        cryptoKey={cryptoKey}
        accentColor={ACCENT}
        onBack={goBack}
      />
    );
  }

  // Fallback de sécurité
  return null;
}

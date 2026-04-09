/**
 * index.jsx — Module Aide-Mémoire v4 fix
 * Screens : pin · services · service · patient · quick · dayoverview
 */

import { useState, useEffect } from 'react';
import { T } from '../../theme.js';
import { isPinSet, secureGet, secureSet } from './crypto.js';

import PinScreen      from './PinScreen.jsx';
import ServicesScreen from './ServicesScreen.jsx';
import ServiceView    from './ServiceView.jsx';
import PatientSheet   from './PatientSheet.jsx';
import QuickEntry     from './QuickEntry.jsx';
import DayOverview    from './DayOverview.jsx';

const ACCENT = '#6366f1';

const INITIAL_NAV = {
  screen:     'pin',
  service:    null,
  patientId:  null,
  refreshKey: 0,
};

export default function AideMemoire({ onBack }) {
  const [cryptoKey, setCryptoKey] = useState(null);
  const [pinExists, setPinExists] = useState(null);
  const [nav,       setNav]       = useState(INITIAL_NAV);

  useEffect(() => { isPinSet().then(setPinExists); }, []);

  function goTo(screen, extras = {}) {
    setNav(prev => ({ ...prev, screen, ...extras }));
  }

  function goBack() {
    setNav(prev => {
      switch (prev.screen) {
        case 'patient':
        case 'quick':
        case 'dayoverview':
          return { ...prev, screen: 'service', refreshKey: prev.refreshKey + 1 };
        case 'service':
          return { ...prev, screen: 'services', service: null };
        case 'services':
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

  async function handleServiceUpdate(updatedService) {
    setNav(prev => ({ ...prev, service: updatedService }));
    try {
      const services = await secureGet('services', cryptoKey) || [];
      const next     = services.map(s => s.id === updatedService.id ? updatedService : s);
      await secureSet('services', next, cryptoKey);
    } catch (e) {
      console.error('[AideMemoire] handleServiceUpdate error:', e);
    }
  }

  // ── Chargement ──────────────────────────────────────────────────────────────

  if (pinExists === null) {
    return (
      <div style={{ background: T.bg, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ color: T.muted, fontSize: 14 }}>Chargement…</span>
      </div>
    );
  }

  // ── PIN ─────────────────────────────────────────────────────────────────────

  if (!cryptoKey || nav.screen === 'pin') {
    return (
      <PinScreen
        pinExists={pinExists}
        accentColor={ACCENT}
        onUnlocked={key => { setCryptoKey(key); goTo('services'); }}
        onBack={onBack}
      />
    );
  }

  // ── Services ────────────────────────────────────────────────────────────────

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

  // ── Vue service ──────────────────────────────────────────────────────────────

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
        onDayOverview={() => goTo('dayoverview')}
        onServiceUpdate={handleServiceUpdate}
      />
    );
  }

  // ── Fiche patient ─────────────────────────────────────────────────────────────

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

  // ── Saisie rapide ────────────────────────────────────────────────────────────

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

  // ── Vue du jour ──────────────────────────────────────────────────────────────

  if (nav.screen === 'dayoverview' && nav.service) {
    return (
      <DayOverview
        service={nav.service}
        cryptoKey={cryptoKey}
        onBack={goBack}
      />
    );
  }

  return null;
}

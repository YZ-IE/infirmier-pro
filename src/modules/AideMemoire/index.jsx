/**
 * index.jsx — Module Aide-Mémoire v4 fix3
 * Écrans : pin · services · service · patient · quick · dayoverview · transfer
 * Correctifs CNIL/ANSSI :
 *   · Timeout session 5 min d'inactivité → verrouillage auto
 *   · Avertissement 1 min avant expiration
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { T } from '../../theme.js';
import { isPinSet, secureGet, secureSet, SEC } from './crypto.js';

import PinScreen      from './PinScreen.jsx';
import ServicesScreen from './ServicesScreen.jsx';
import ServiceView    from './ServiceView.jsx';
import PatientSheet   from './PatientSheet.jsx';
import QuickEntry     from './QuickEntry.jsx';
import DayOverview    from './DayOverview.jsx';
import SecureTransfer from './SecureTransfer.jsx';

const ACCENT = '#6366f1';

const INITIAL_NAV = { screen: 'pin', service: null, patientId: null, refreshKey: 0 };

export default function AideMemoire({ onBack }) {
  const [cryptoKey, setCryptoKey] = useState(null);
  const [pinExists, setPinExists] = useState(null);
  const [nav,       setNav]       = useState(INITIAL_NAV);
  const [warnExpiry,setWarnExpiry]= useState(false);

  const timerRef     = useRef(null);
  const warnTimerRef = useRef(null);

  useEffect(() => { isPinSet().then(setPinExists); }, []);

  // ── Timeout session ANSSI (5 min d'inactivité) ───────────────────────────────
  const resetSessionTimer = useCallback(() => {
    clearTimeout(timerRef.current);
    clearTimeout(warnTimerRef.current);
    setWarnExpiry(false);

    if (!cryptoKey) return; // ne démarre que si connecté

    // Avertissement 1 min avant
    warnTimerRef.current = setTimeout(() => setWarnExpiry(true), SEC.SESSION_TIMEOUT - SEC.WARN_BEFORE);

    // Verrouillage effectif
    timerRef.current = setTimeout(() => {
      setCryptoKey(null);
      setNav(INITIAL_NAV);
      setWarnExpiry(false);
    }, SEC.SESSION_TIMEOUT);
  }, [cryptoKey]);

  useEffect(() => {
    if (!cryptoKey) return;
    const events = ['click', 'keydown', 'touchstart', 'scroll'];
    events.forEach(e => window.addEventListener(e, resetSessionTimer, { passive: true }));
    resetSessionTimer();
    return () => {
      events.forEach(e => window.removeEventListener(e, resetSessionTimer));
      clearTimeout(timerRef.current);
      clearTimeout(warnTimerRef.current);
    };
  }, [cryptoKey, resetSessionTimer]);

  // ── Navigation ───────────────────────────────────────────────────────────────

  function goTo(screen, extras = {}) { setNav(prev => ({ ...prev, screen, ...extras })); }

  function goBack() {
    setNav(prev => {
      switch (prev.screen) {
        case 'patient':
        case 'quick':
        case 'dayoverview':
        case 'transfer':
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
      await secureSet('services', services.map(sv => sv.id === updatedService.id ? updatedService : sv), cryptoKey);
    } catch (e) { console.error('[AideMemoire] handleServiceUpdate error:', e); }
  }

  // ── Chargement initial ───────────────────────────────────────────────────────

  if (pinExists === null) {
    return (
      <div style={{ background: T.bg, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ color: T.muted, fontSize: 14 }}>Chargement…</span>
      </div>
    );
  }

  // ── PIN ──────────────────────────────────────────────────────────────────────

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

  // ── Bandeau d'avertissement timeout ─────────────────────────────────────────

  const TimeoutBanner = warnExpiry ? (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000, background: '#f97316', color: '#000', textAlign: 'center', padding: '8px 16px', fontSize: 13, fontWeight: 600 }}>
      ⏱ Session expire dans moins d'1 min — Touchez l'écran pour continuer
    </div>
  ) : null;

  // ── Services ─────────────────────────────────────────────────────────────────

  if (nav.screen === 'services') return (
    <>
      {TimeoutBanner}
      <ServicesScreen cryptoKey={cryptoKey} accentColor={ACCENT} onBack={goBack} onSelectService={service => goTo('service', { service, patientId: null })} />
    </>
  );

  // ── Vue service ──────────────────────────────────────────────────────────────

  if (nav.screen === 'service' && nav.service) return (
    <>
      {TimeoutBanner}
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
        onTransfer={() => goTo('transfer')}
      />
    </>
  );

  // ── Fiche patient ────────────────────────────────────────────────────────────

  if (nav.screen === 'patient' && nav.service && nav.patientId) return (
    <>
      {TimeoutBanner}
      <PatientSheet patientId={nav.patientId} service={nav.service} cryptoKey={cryptoKey} accentColor={ACCENT} onBack={goBack} />
    </>
  );

  // ── Saisie rapide ────────────────────────────────────────────────────────────

  if (nav.screen === 'quick' && nav.service) return (
    <>
      {TimeoutBanner}
      <QuickEntry service={nav.service} cryptoKey={cryptoKey} accentColor={ACCENT} onBack={goBack} />
    </>
  );

  // ── Vue du jour ──────────────────────────────────────────────────────────────

  if (nav.screen === 'dayoverview' && nav.service) return (
    <>
      {TimeoutBanner}
      <DayOverview service={nav.service} cryptoKey={cryptoKey} onBack={goBack} />
    </>
  );

  // ── Transfert sécurisé ───────────────────────────────────────────────────────

  if (nav.screen === 'transfer' && nav.service) return (
    <>
      {TimeoutBanner}
      <SecureTransfer service={nav.service} cryptoKey={cryptoKey} onBack={goBack} />
    </>
  );

  return null;
}

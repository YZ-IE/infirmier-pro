/**
 * PinScreen.jsx — Aide-Mémoire
 * Correctifs CNIL/ANSSI :
 *   · Verrouillage après 5 tentatives → 15 min
 *   · Compte à rebours visible
 *   · Avertissement tentatives restantes
 */

import { useState, useEffect } from 'react';
import { T } from '../../theme.js';
import { createPin, verifyPin, isLockedOut, getLockoutRemaining, recordFailure, clearLockout, getFailures } from './crypto.js';

const PIN_LENGTH = 4;
const NUMPAD     = [1, 2, 3, 4, 5, 6, 7, 8, 9, null, 0, '⌫'];

const TITLES = {
  create:  'Créer votre PIN',
  confirm: 'Confirmer le PIN',
  verify:  'Déverrouiller',
};
const SUBTITLES = {
  create:  'Protège vos données patients',
  confirm: 'Saisissez à nouveau votre PIN',
  verify:  'Saisir votre PIN',
};

export default function PinScreen({ pinExists, accentColor, onUnlocked, onBack }) {
  const C = accentColor;

  const [step,      setStep]      = useState(pinExists ? 'verify' : 'create');
  const [pin,       setPin]       = useState('');
  const [firstPin,  setFirstPin]  = useState('');
  const [error,     setError]     = useState('');
  const [loading,   setLoading]   = useState(false);
  const [locked,    setLocked]    = useState(() => isLockedOut());
  const [countdown, setCountdown] = useState(() => getLockoutRemaining());
  const [failures,  setFailures]  = useState(() => getFailures());

  // ── Compte à rebours de verrouillage ────────────────────────────────────────
  useEffect(() => {
    if (!locked) return;
    const id = setInterval(() => {
      const rem = getLockoutRemaining();
      setCountdown(rem);
      if (rem <= 0) { clearLockout(); setLocked(false); setError(''); setFailures(0); }
    }, 1000);
    return () => clearInterval(id);
  }, [locked]);

  function handleDigit(digit) {
    if (loading || locked || pin.length >= PIN_LENGTH) return;
    setError('');
    const next = pin + String(digit);
    setPin(next);
    if (next.length === PIN_LENGTH) setTimeout(() => handleComplete(next), 120);
  }

  function handleDelete() {
    if (loading || locked) return;
    setError('');
    setPin(p => p.slice(0, -1));
  }

  async function handleComplete(fullPin) {
    setLoading(true);
    try {
      if (step === 'create') {
        setFirstPin(fullPin); setPin(''); setStep('confirm');
      } else if (step === 'confirm') {
        if (fullPin !== firstPin) {
          setError('PINs différents — recommencez'); setPin(''); setFirstPin(''); setStep('create');
        } else {
          const key = await createPin(fullPin); onUnlocked(key);
        }
      } else {
        // verify
        const key = await verifyPin(fullPin);
        if (key) {
          onUnlocked(key);
        } else {
          const { locked: nowLocked, failures: f } = recordFailure();
          setFailures(f);
          if (nowLocked) {
            setLocked(true); setCountdown(getLockoutRemaining());
            setError('');
          } else {
            const remaining = 5 - f;
            setError(remaining > 0 ? `PIN incorrect — ${remaining} tentative${remaining > 1 ? 's' : ''} restante${remaining > 1 ? 's' : ''}` : 'PIN incorrect');
          }
          setPin('');
        }
      }
    } catch (e) {
      setError('Erreur inattendue'); setPin('');
      console.error('[AideMemoire] PIN error:', e);
    } finally { setLoading(false); }
  }

  // ── Écran verrouillé ────────────────────────────────────────────────────────
  if (locked) {
    const min = Math.floor(countdown / 60);
    const sec = String(countdown % 60).padStart(2, '0');
    return (
      <div style={{ background: T.bg, minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, boxSizing: 'border-box' }}>
        <button onClick={onBack} style={{ position: 'absolute', top: 20, left: 16, background: 'none', border: 'none', color: T.muted, fontSize: 24, cursor: 'pointer', padding: 8 }}>←</button>
        <div style={{ fontSize: 52, marginBottom: 16 }}>🔒</div>
        <div style={{ color: '#f43f5e', fontSize: 18, fontWeight: 700, marginBottom: 8, textAlign: 'center' }}>Application verrouillée</div>
        <div style={{ color: T.muted, fontSize: 13, marginBottom: 24, textAlign: 'center' }}>
          {failures} tentatives incorrectes — limite atteinte
        </div>
        <div style={{ background: '#f43f5e22', border: '1px solid #f43f5e44', borderRadius: 12, padding: '18px 32px', textAlign: 'center', marginBottom: 16 }}>
          <div style={{ color: T.muted, fontSize: 12, marginBottom: 6 }}>Déverrouillage dans</div>
          <div style={{ color: '#f43f5e', fontSize: 36, fontWeight: 700, fontFamily: 'monospace' }}>{min}:{sec}</div>
        </div>
        <div style={{ color: T.muted, fontSize: 11, textAlign: 'center', background: T.surface, borderRadius: 8, padding: '10px 16px', maxWidth: 280 }}>
          ⚠️ Cet événement est enregistré conformément aux exigences de traçabilité.
        </div>
      </div>
    );
  }

  // ── Écran PIN normal ────────────────────────────────────────────────────────
  return (
    <div style={{ background: T.bg, minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, position: 'relative', boxSizing: 'border-box' }}>
      <button onClick={onBack} style={{ position: 'absolute', top: 20, left: 16, background: 'none', border: 'none', color: T.muted, fontSize: 24, cursor: 'pointer', padding: 8 }}>←</button>

      <div style={{ fontSize: 48, marginBottom: 16, userSelect: 'none' }}>🔐</div>
      <div style={{ color: T.text, fontSize: 20, fontWeight: 700, marginBottom: 6, textAlign: 'center' }}>{TITLES[step]}</div>
      <div style={{ color: T.muted, fontSize: 14, marginBottom: step === 'verify' && failures > 0 ? 8 : 32, textAlign: 'center' }}>{SUBTITLES[step]}</div>

      {/* Avertissement tentatives restantes */}
      {step === 'verify' && failures > 0 && (
        <div style={{ background: '#f9731622', border: '1px solid #f9731644', borderRadius: 8, padding: '6px 16px', marginBottom: 18, fontSize: 12, color: '#f97316', textAlign: 'center' }}>
          ⚠️ {failures} tentative{failures > 1 ? 's' : ''} incorrecte{failures > 1 ? 's' : ''} — verrouillage après {5 - failures} de plus
        </div>
      )}

      {/* Points PIN */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
        {Array.from({ length: PIN_LENGTH }, (_, i) => (
          <div key={i} style={{ width: 16, height: 16, borderRadius: '50%', background: i < pin.length ? C : 'transparent', border: `2px solid ${i < pin.length ? C : T.border}`, transition: 'all 0.12s' }} />
        ))}
      </div>

      <div style={{ height: 28, display: 'flex', alignItems: 'center', marginBottom: 12 }}>
        {error && <span style={{ color: '#f43f5e', fontSize: 13 }}>{error}</span>}
      </div>

      {/* Pavé numérique */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, width: 240 }}>
        {NUMPAD.map((key, i) => {
          if (key === null) return <div key={i} />;
          const isDel = key === '⌫';
          return (
            <button key={i} disabled={loading} onClick={() => isDel ? handleDelete() : handleDigit(key)}
              style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, color: isDel ? T.muted : T.text, fontSize: isDel ? 20 : 22, fontWeight: 500, height: 64, cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: loading ? 0.5 : 1, WebkitTapHighlightColor: 'transparent' }}>
              {key}
            </button>
          );
        })}
      </div>

      <div style={{ color: T.muted, fontSize: 11, marginTop: 40, textAlign: 'center', lineHeight: 1.6 }}>
        🔒 Données chiffrées · Secret professionnel
      </div>
    </div>
  );
}

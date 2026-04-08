/**
 * PinScreen.jsx — Aide-Mémoire
 * Écran de création / vérification du PIN (4 chiffres)
 */

import { useState } from 'react';
import { T } from '../../theme.js';
import { createPin, verifyPin } from './crypto.js';

const PIN_LENGTH = 4;
const NUMPAD = [1, 2, 3, 4, 5, 6, 7, 8, 9, null, 0, '⌫'];

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

  const [step,     setStep]     = useState(pinExists ? 'verify' : 'create');
  const [pin,      setPin]      = useState('');
  const [firstPin, setFirstPin] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  function handleDigit(digit) {
    if (loading || pin.length >= PIN_LENGTH) return;
    setError('');
    const next = pin + String(digit);
    setPin(next);
    if (next.length === PIN_LENGTH) {
      setTimeout(() => handleComplete(next), 120);
    }
  }

  function handleDelete() {
    if (loading) return;
    setError('');
    setPin(p => p.slice(0, -1));
  }

  async function handleComplete(fullPin) {
    setLoading(true);
    try {
      if (step === 'create') {
        setFirstPin(fullPin);
        setPin('');
        setStep('confirm');
      } else if (step === 'confirm') {
        if (fullPin !== firstPin) {
          setError('PINs différents — recommencez');
          setPin(''); setFirstPin(''); setStep('create');
        } else {
          const key = await createPin(fullPin);
          onUnlocked(key);
        }
      } else {
        const key = await verifyPin(fullPin);
        if (key) { onUnlocked(key); }
        else { setError('PIN incorrect'); setPin(''); }
      }
    } catch (e) {
      setError('Erreur inattendue');
      setPin('');
      console.error('[AideMemoire] PIN error:', e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      background: T.bg, minHeight: '100vh',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: 24, position: 'relative', boxSizing: 'border-box',
    }}>
      <button
        onClick={onBack}
        style={{ position: 'absolute', top: 20, left: 16, background: 'none', border: 'none', color: T.muted, fontSize: 24, cursor: 'pointer', padding: 8 }}
      >←</button>

      <div style={{ fontSize: 48, marginBottom: 16, userSelect: 'none' }}>🔐</div>
      <div style={{ color: T.text, fontSize: 20, fontWeight: 700, marginBottom: 6, textAlign: 'center' }}>{TITLES[step]}</div>
      <div style={{ color: T.muted, fontSize: 14, marginBottom: 32, textAlign: 'center' }}>{SUBTITLES[step]}</div>

      {/* Points PIN */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
        {Array.from({ length: PIN_LENGTH }, (_, i) => (
          <div key={i} style={{
            width: 16, height: 16, borderRadius: '50%',
            background:   i < pin.length ? C : 'transparent',
            border:       `2px solid ${i < pin.length ? C : T.border}`,
            transition:   'all 0.12s',
          }} />
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
            <button
              key={i}
              disabled={loading}
              onClick={() => isDel ? handleDelete() : handleDigit(key)}
              style={{
                background:   T.surface,
                border:       `1px solid ${T.border}`,
                borderRadius: 12,
                color:        isDel ? T.muted : T.text,
                fontSize:     isDel ? 20 : 22,
                fontWeight:   500,
                height:       64,
                cursor:       loading ? 'not-allowed' : 'pointer',
                display:      'flex', alignItems: 'center', justifyContent: 'center',
                opacity:      loading ? 0.5 : 1,
                WebkitTapHighlightColor: 'transparent',
              }}
            >{key}</button>
          );
        })}
      </div>

      <div style={{ color: T.muted, fontSize: 11, marginTop: 40, textAlign: 'center', lineHeight: 1.6 }}>
        🔒 Données chiffrées · Secret professionnel
      </div>
    </div>
  );
}

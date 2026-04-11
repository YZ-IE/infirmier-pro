/**
 * SecureTransfer.jsx — Aide-Mémoire
 * Transfert chiffré local entre deux appareils InfirmierPro
 *
 * Protocole (zéro réseau, conforme CNIL/ANSSI) :
 *   EXPORT : données JSON → AES-256-GCM éphémère → blob base64 (presse-papier)
 *            + code 8 chiffres affiché à l'écran (canal verbal séparé)
 *   IMPORT : coller le blob + entrer le code → déchiffrement → fusion
 *
 * Le blob chiffré peut transiter par n'importe quel canal (presse-papier,
 * NFC, USB, Bluetooth…). Sans le code vocal, il est illisible.
 */

import { useState, useEffect } from 'react';
import { T, s } from '../../theme.js';
import { secureGet, secureSet, encryptForTransfer, decryptFromTransfer, generateTransferKey } from './crypto.js';
import { todayStr } from './utils.jsx';

const ACCENT = '#6366f1';

// ─── Onglets ──────────────────────────────────────────────────────────────────
const TABS = [
  { id: 'export', label: '📤 Exporter', desc: 'Envoyer vers un autre appareil' },
  { id: 'import', label: '📥 Importer', desc: 'Recevoir depuis un autre appareil' },
];

// ─── Composant principal ──────────────────────────────────────────────────────

export default function SecureTransfer({ service, cryptoKey, onBack }) {
  const [tab,      setTab]      = useState('export');
  const [busy,     setBusy]     = useState(false);
  const [error,    setError]    = useState('');
  const [success,  setSuccess]  = useState('');

  // Export
  const [blob,   setBlob]   = useState('');
  const [code,   setCode]   = useState('');
  const [copied, setCopied] = useState(false);

  // Import
  const [pastedBlob, setPastedBlob] = useState('');
  const [inputCode,  setInputCode]  = useState('');
  const [preview,    setPreview]    = useState(null);
  const [confirmed,  setConfirmed]  = useState(false);

  const today = todayStr();

  function reset() {
    setError(''); setSuccess('');
    setBlob(''); setCode(''); setCopied(false);
    setPastedBlob(''); setInputCode(''); setPreview(null); setConfirmed(false);
  }

  // ── EXPORT ──────────────────────────────────────────────────────────────────
  async function handleExport() {
    setBusy(true); setError(''); setBlob(''); setCode('');
    try {
      const [patients, daily] = await Promise.all([
        secureGet(`patients_${service.id}`, cryptoKey),
        secureGet(`daily_${service.id}_${today}`, cryptoKey),
      ]);
      const payload = {
        exportedAt: Date.now(),
        service:    { id: service.id, name: service.name, specialty: service.specialty, fields: service.fields, bedRooms: service.bedRooms, bedConfig: service.bedConfig, bedCount: service.bedCount },
        patients:   patients || [],
        daily:      daily    || {},
      };
      const { key, code: generatedCode } = await generateTransferKey();
      const b64 = await encryptForTransfer(key, payload);
      setBlob(b64);
      setCode(generatedCode);
    } catch (e) {
      setError('Erreur lors de la génération : ' + e.message);
    } finally { setBusy(false); }
  }

  async function copyBlob() {
    try {
      await navigator.clipboard.writeText(blob);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch { setError('Impossible de copier — sélectionnez et copiez manuellement'); }
  }

  // ── IMPORT ──────────────────────────────────────────────────────────────────
  async function handleDecrypt() {
    if (!pastedBlob.trim() || inputCode.replace(/\s/g, '').length !== 8) {
      setError('Collez le blob et entrez le code 8 chiffres');
      return;
    }
    setBusy(true); setError(''); setPreview(null);
    try {
      const payload = await decryptFromTransfer(pastedBlob.trim(), inputCode);
      setPreview(payload);
    } catch (e) {
      setError('Déchiffrement impossible. Vérifiez le code ou le blob.');
    } finally { setBusy(false); }
  }

  async function handleImport() {
    if (!preview || !confirmed) return;
    setBusy(true); setError('');
    try {
      // Fusion : on écrase les données du service cible
      await secureSet(`patients_${service.id}`, preview.patients, cryptoKey);
      await secureSet(`daily_${service.id}_${today}`,  preview.daily,    cryptoKey);
      setSuccess(`✅ Import réussi — ${preview.patients.length} patient(s) importé(s)`);
      setPreview(null); setPastedBlob(''); setInputCode(''); setConfirmed(false);
    } catch (e) {
      setError('Erreur lors de l\'import : ' + e.message);
    } finally { setBusy(false); }
  }

  // ── Rendu ────────────────────────────────────────────────────────────────────

  return (
    <div style={{ background: T.bg, minHeight: '100vh', boxSizing: 'border-box' }}>

      {/* Header */}
      <div style={{ padding: '12px 16px', background: T.bg, borderBottom: `1px solid ${T.border}`, position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <button onClick={onBack} style={{ background: 'none', border: 'none', color: T.muted, fontSize: 22, cursor: 'pointer', padding: 4 }}>←</button>
          <div>
            <div style={{ color: T.text, fontSize: 16, fontWeight: 700 }}>🔐 Transfert sécurisé</div>
            <div style={{ color: T.muted, fontSize: 12 }}>{service.name} · Strictement local</div>
          </div>
        </div>

        {/* Onglets */}
        <div style={{ display: 'flex', gap: 8 }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => { setTab(t.id); reset(); }}
              style={{ flex: 1, background: tab === t.id ? ACCENT + '22' : T.surface, border: `1px solid ${tab === t.id ? ACCENT : T.border}`, borderRadius: 8, color: tab === t.id ? ACCENT : T.muted, fontSize: 13, fontWeight: tab === t.id ? 700 : 400, padding: '8px 4px', cursor: 'pointer' }}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: '16px 16px 60px' }}>

        {/* Bandeau info sécurité */}
        <div style={{ background: '#0c1a2e', border: '1px solid #1e3a5f', borderRadius: 10, padding: '10px 14px', marginBottom: 16 }}>
          <div style={{ color: '#60a5fa', fontSize: 12, fontWeight: 700, marginBottom: 4 }}>🔒 Protocole de sécurité</div>
          <div style={{ color: T.muted, fontSize: 11, lineHeight: 1.5 }}>
            Les données sont chiffrées AES-256 avant tout transfert. Un code à 8 chiffres séparé est requis pour déchiffrer. Aucune donnée lisible ne transite.
          </div>
        </div>

        {/* Messages */}
        {error   && <div style={{ background: '#f43f5e22', border: '1px solid #f43f5e44', borderRadius: 8, padding: '10px 14px', marginBottom: 14, color: '#f43f5e', fontSize: 13 }}>{error}</div>}
        {success && <div style={{ background: '#22c55e22', border: '1px solid #22c55e44', borderRadius: 8, padding: '10px 14px', marginBottom: 14, color: '#22c55e', fontSize: 13 }}>{success}</div>}

        {/* ════ EXPORT ════ */}
        {tab === 'export' && (
          <>
            <div style={{ ...cardStyle, marginBottom: 16 }}>
              <div style={{ color: T.muted, fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>Étape 1 — Générer le paquet chiffré</div>
              <div style={{ color: T.text, fontSize: 13, marginBottom: 14, lineHeight: 1.5 }}>
                Génère un fichier chiffré de vos données patients du jour + un code secret à communiquer verbalement à votre collègue.
              </div>
              <button onClick={handleExport} disabled={busy}
                style={{ ...s.btn(ACCENT), width: '100%', padding: '13px', fontSize: 15, fontWeight: 700, opacity: busy ? 0.5 : 1 }}>
                {busy ? 'Chiffrement…' : '🔐 Générer le paquet chiffré'}
              </button>
            </div>

            {blob && (
              <>
                {/* Code secret */}
                <div style={{ background: '#052e16', border: '1px solid #22c55e44', borderRadius: 12, padding: '16px', marginBottom: 16, textAlign: 'center' }}>
                  <div style={{ color: '#22c55e', fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
                    🔑 Code secret — à dire verbalement à votre collègue
                  </div>
                  <div style={{ color: '#22c55e', fontSize: 38, fontWeight: 800, fontFamily: 'monospace', letterSpacing: 6 }}>
                    {code}
                  </div>
                  <div style={{ color: '#4ade80', fontSize: 11, marginTop: 8 }}>
                    ⚠️ Ne pas transmettre ce code via le même canal que le paquet chiffré
                  </div>
                </div>

                {/* Blob */}
                <div style={{ ...cardStyle, marginBottom: 16 }}>
                  <div style={{ color: T.muted, fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>Étape 2 — Copier le paquet chiffré</div>
                  <div style={{ background: T.bg, border: `1px solid ${T.border}`, borderRadius: 8, padding: '10px 12px', marginBottom: 12, fontFamily: 'monospace', fontSize: 10, color: T.muted, wordBreak: 'break-all', maxHeight: 80, overflowY: 'auto' }}>
                    {blob.slice(0, 120)}…
                  </div>
                  <button onClick={copyBlob}
                    style={{ ...s.btn(copied ? '#22c55e' : ACCENT), width: '100%', padding: '12px', fontSize: 14, fontWeight: 700 }}>
                    {copied ? '✅ Copié dans le presse-papier !' : '📋 Copier le paquet chiffré'}
                  </button>
                  <div style={{ color: T.muted, fontSize: 11, marginTop: 10, textAlign: 'center' }}>
                    Votre collègue colle ce texte dans l'onglet Import
                  </div>
                </div>

                <div style={{ background: '#1a0a12', border: '1px solid #f43f5e33', borderRadius: 10, padding: '10px 14px' }}>
                  <div style={{ color: '#f43f5e', fontSize: 12, fontWeight: 700, marginBottom: 4 }}>⚠️ Rappel secret professionnel</div>
                  <div style={{ color: T.muted, fontSize: 11, lineHeight: 1.5 }}>
                    Le paquet chiffré peut transiter via presse-papier, NFC ou Bluetooth. Communiquez le code uniquement de vive voix ou par canal sécurisé séparé.
                  </div>
                </div>
              </>
            )}
          </>
        )}

        {/* ════ IMPORT ════ */}
        {tab === 'import' && !preview && (
          <>
            <div style={{ ...cardStyle, marginBottom: 16 }}>
              <div style={{ color: T.muted, fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>Étape 1 — Coller le paquet chiffré</div>
              <textarea
                value={pastedBlob}
                onChange={e => setPastedBlob(e.target.value)}
                placeholder="Collez ici le texte copié depuis l'autre appareil…"
                rows={4}
                style={{ ...s.input, width: '100%', boxSizing: 'border-box', resize: 'none', fontFamily: 'monospace', fontSize: 11, lineHeight: 1.4 }}
              />
            </div>

            <div style={{ ...cardStyle, marginBottom: 16 }}>
              <div style={{ color: T.muted, fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>Étape 2 — Code secret (8 chiffres)</div>
              <input
                value={inputCode}
                onChange={e => setInputCode(e.target.value.replace(/[^\d\s]/g, ''))}
                placeholder="Ex : 1234 5678"
                maxLength={9}
                inputMode="numeric"
                style={{ ...s.input, width: '100%', boxSizing: 'border-box', fontFamily: 'monospace', fontSize: 22, textAlign: 'center', letterSpacing: 4 }}
              />
              <div style={{ color: T.muted, fontSize: 11, marginTop: 8, textAlign: 'center' }}>
                Code communiqué verbalement par votre collègue
              </div>
            </div>

            <button onClick={handleDecrypt} disabled={busy || !pastedBlob.trim() || inputCode.replace(/\s/g, '').length !== 8}
              style={{ ...s.btn(ACCENT), width: '100%', padding: '13px', fontSize: 15, fontWeight: 700, opacity: (pastedBlob.trim() && inputCode.replace(/\s/g, '').length === 8 && !busy) ? 1 : 0.4 }}>
              {busy ? 'Déchiffrement…' : '🔓 Déchiffrer et prévisualiser'}
            </button>
          </>
        )}

        {/* ── Prévisualisation avant import ── */}
        {tab === 'import' && preview && (
          <>
            <div style={{ background: '#052e16', border: '1px solid #22c55e44', borderRadius: 12, padding: '14px', marginBottom: 16 }}>
              <div style={{ color: '#22c55e', fontSize: 13, fontWeight: 700, marginBottom: 8 }}>✅ Déchiffrement réussi — Aperçu</div>
              <div style={{ color: T.muted, fontSize: 12, marginBottom: 4 }}>Service : <span style={{ color: T.text }}>{preview.service?.name}</span></div>
              <div style={{ color: T.muted, fontSize: 12, marginBottom: 4 }}>Patients : <span style={{ color: T.text }}>{preview.patients?.length || 0}</span></div>
              <div style={{ color: T.muted, fontSize: 12, marginBottom: 12 }}>Exporté le : <span style={{ color: T.text }}>{preview.exportedAt ? new Date(preview.exportedAt).toLocaleString('fr-FR') : '—'}</span></div>

              {/* Liste patients */}
              {(preview.patients || []).slice(0, 5).map(p => (
                <div key={p.id} style={{ background: T.surface, borderRadius: 8, padding: '6px 10px', marginBottom: 6, fontSize: 12 }}>
                  <span style={{ color: T.muted }}>Lit {p.bedNumber} </span>
                  <span style={{ color: T.text, fontWeight: 700 }}>{p.initials}</span>
                  <span style={{ color: T.muted }}> {p.gender} {p.age}a</span>
                  {p.admissionReason && <span style={{ color: T.muted }}> — {p.admissionReason.slice(0, 30)}</span>}
                </div>
              ))}
              {(preview.patients || []).length > 5 && (
                <div style={{ color: T.muted, fontSize: 11, textAlign: 'center' }}>… et {preview.patients.length - 5} autre(s)</div>
              )}
            </div>

            {/* Avertissement écrasement */}
            <div style={{ background: '#1a0a12', border: '1px solid #f43f5e33', borderRadius: 10, padding: '12px 14px', marginBottom: 16 }}>
              <div style={{ color: '#f43f5e', fontSize: 12, fontWeight: 700, marginBottom: 6 }}>⚠️ Attention — Écrasement des données locales</div>
              <div style={{ color: T.muted, fontSize: 12, lineHeight: 1.5, marginBottom: 10 }}>
                Cet import va <strong style={{ color: T.text }}>remplacer</strong> les patients et soins du jour de <em>{service.name}</em> par les données importées. L'action est irréversible.
              </div>
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer' }}>
                <input type="checkbox" checked={confirmed} onChange={e => setConfirmed(e.target.checked)}
                  style={{ width: 18, height: 18, marginTop: 1, flexShrink: 0 }} />
                <span style={{ color: T.text, fontSize: 12 }}>
                  Je confirme vouloir remplacer les données locales par celles importées
                </span>
              </label>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => { setPreview(null); setPastedBlob(''); setInputCode(''); setConfirmed(false); }}
                style={{ flex: 1, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 8, color: T.muted, fontSize: 14, padding: '12px', cursor: 'pointer' }}>
                Annuler
              </button>
              <button onClick={handleImport} disabled={!confirmed || busy}
                style={{ ...s.btn(confirmed ? '#22c55e' : T.muted), flex: 2, padding: '12px', fontSize: 14, fontWeight: 700, opacity: (confirmed && !busy) ? 1 : 0.4 }}>
                {busy ? 'Import…' : '✅ Confirmer l\'import'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const cardStyle = {
  background:   '#111827',
  border:       '1px solid #1e293b',
  borderRadius: 12,
  padding:      '14px',
};

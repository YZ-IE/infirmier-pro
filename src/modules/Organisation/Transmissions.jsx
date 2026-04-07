import { useState, useEffect } from 'react';
import { T, s } from '../../theme.js';
const C = T.orga;

const STORAGE_KEY = 'transmissions_v1';
const TTL_MS = 24 * 60 * 60 * 1000;

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const items = JSON.parse(raw);
    const now = Date.now();
    return items.filter(item => now - item.timestamp < TTL_MS);
  } catch { return []; }
}

function saveToStorage(items) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); } catch {}
}

function fmtOne(h) {
  const lines = [`[${h.heure}] ${h.patient || 'Patient'}`];
  if (h.donnee) lines.push(`DONNÉE : ${h.donnee}`);
  if (h.lien)   lines.push(`LIEN : ${h.lien}`);
  if (h.action) lines.push(`ACTION : ${h.action}`);
  return lines.join('\n');
}

export default function Transmissions() {
  const [v, setV] = useState({ patient: '', donnee: '', lien: '', action: '' });
  const [hist, setHist] = useState(() => loadFromStorage());
  const [copied, setCopied] = useState(null);

  useEffect(() => {
    const cleaned = loadFromStorage();
    if (cleaned.length !== hist.length) { setHist(cleaned); saveToStorage(cleaned); }
  }, []);

  const set = (k, val) => setV(p => ({ ...p, [k]: val }));

  const save = () => {
    if (!v.donnee.trim()) return;
    const now = new Date();
    const heure = `${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}`;
    const entry = { ...v, heure, timestamp: Date.now() };
    const next = [entry, ...hist];
    setHist(next); saveToStorage(next);
    setV(p => ({ ...p, donnee: '', lien: '', action: '' }));
  };

  const del = (i) => {
    const next = hist.filter((_, idx) => idx !== i);
    setHist(next); saveToStorage(next);
  };

  const copy = async (text, key) => {
    try { await navigator.clipboard.writeText(text); setCopied(key); setTimeout(() => setCopied(null), 2000); } catch {}
  };

  return (
    <div style={{ padding: '14px' }}>

      {/* Avertissement RGPD */}
      <div style={{ background: '#451a03', border: '1px solid #f59e0b88', borderRadius: 10, padding: '11px 14px', marginBottom: 12 }}>
        <div style={{ color: '#f59e0b', fontWeight: 700, fontSize: 12, marginBottom: 4 }}>⚠️ ANONYMISATION — RESPONSABILITÉ UTILISATEUR</div>
        <div style={{ color: '#fbbf24', fontSize: 11, lineHeight: 1.6 }}>
          L'anonymisation des données patient relève de votre responsabilité et peut être exigée par la loi (RGPD, Code de la santé publique, secret médical). Préférez les initiales, numéro de chambre ou un identifiant interne plutôt que le nom complet.
        </div>
      </div>

      <div style={{ ...s.card, background: '#052e16' }}>
        <div style={{ color: C, fontWeight: 700, marginBottom: 4 }}>Transmissions ciblées — Modèle DLA</div>
        <div style={{ color: T.muted, fontSize: 12 }}>Donnée → Lien (interprétation) → Action réalisée ou prévue</div>
        <div style={{ color: '#475569', fontSize: 11, marginTop: 4 }}>📦 Conservées 24h · Stockage local sur cet appareil</div>
      </div>

      <div style={s.card}>
        <div style={{ marginBottom: 10 }}>
          <label style={s.label}>PATIENT (initiales / chambre — anonymisé)</label>
          <input value={v.patient} onChange={e => set('patient', e.target.value)} placeholder="Ex : Chambre 12 · M.D. · Dossier #4521" style={s.input} />
        </div>
        <div style={{ marginBottom: 10 }}>
          <label style={{ ...s.label, color: C }}>D — DONNÉE (Observation objective ou subjective)</label>
          <textarea value={v.donnee} onChange={e => set('donnee', e.target.value)} placeholder="Ex: SpO₂ 88% sous 2L O₂. FR 28/min. Tirage intercostal." style={{ ...s.input, minHeight: 80, resize: 'vertical' }} />
        </div>
        <div style={{ marginBottom: 10 }}>
          <label style={{ ...s.label, color: '#22c55e' }}>L — LIEN (Interprétation, hypothèse infirmière)</label>
          <textarea value={v.lien} onChange={e => set('lien', e.target.value)} placeholder="Ex: Détresse respiratoire aiguë, probable décompensation cardiaque." style={{ ...s.input, minHeight: 70, resize: 'vertical' }} />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label style={{ ...s.label, color: '#f59e0b' }}>A — ACTION (Ce que j'ai fait / prescrit / prévu)</label>
          <textarea value={v.action} onChange={e => set('action', e.target.value)} placeholder="Ex: O₂ porté à 6L/min. Médecin prévenu 14h30. Scope branché." style={{ ...s.input, minHeight: 70, resize: 'vertical' }} />
        </div>
        <button onClick={save} style={{ ...s.btn(C), width: '100%', padding: '11px' }}>ENREGISTRER LA TRANSMISSION</button>
      </div>

      {hist.length > 0 && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '14px 0 8px' }}>
            <div style={{ color: C, fontFamily: 'monospace', fontSize: 11, letterSpacing: 2 }}>TRANSMISSIONS ({hist.length})</div>
            <button onClick={() => copy(hist.map(fmtOne).join('\n\n---\n\n'), 'all')}
              style={{ ...s.btn(copied === 'all' ? '#22c55e' : C), padding: '6px 12px', fontSize: 11 }}>
              {copied === 'all' ? '✓ Copié !' : '📋 Tout copier'}
            </button>
          </div>

          {hist.map((h, i) => {
            const heuresRest = Math.max(0, Math.ceil((TTL_MS - (Date.now() - h.timestamp)) / 3600000));
            return (
              <div key={i} style={{ ...s.card, borderLeft: `3px solid ${C}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <span style={{ color: C, fontWeight: 700, fontSize: 13 }}>{h.patient || 'Patient'}</span>
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                    <span style={{ color: T.muted, fontFamily: 'monospace', fontSize: 12 }}>{h.heure}</span>
                    <button onClick={() => copy(fmtOne(h), `one_${i}`)} style={{
                      ...s.btn(copied === `one_${i}` ? '#22c55e' : '#64748b'),
                      padding: '3px 8px', fontSize: 11
                    }}>{copied === `one_${i}` ? '✓' : '📋'}</button>
                    <button onClick={() => del(i)} style={{
                      background: 'none', border: '1px solid #334155', color: '#64748b',
                      borderRadius: 6, padding: '3px 8px', fontSize: 11, cursor: 'pointer'
                    }}>✕</button>
                  </div>
                </div>
                {h.donnee && <><span style={{ color: C, fontSize: 11, fontFamily: 'monospace' }}>DONNÉE </span><div style={{ color: T.text, fontSize: 13, marginBottom: 5 }}>{h.donnee}</div></>}
                {h.lien && <><span style={{ color: '#22c55e', fontSize: 11, fontFamily: 'monospace' }}>LIEN </span><div style={{ color: T.text, fontSize: 13, marginBottom: 5 }}>{h.lien}</div></>}
                {h.action && <><span style={{ color: '#f59e0b', fontSize: 11, fontFamily: 'monospace' }}>ACTION </span><div style={{ color: T.text, fontSize: 13 }}>{h.action}</div></>}
                <div style={{ color: '#475569', fontSize: 10, fontFamily: 'monospace', marginTop: 8 }}>🕐 Expire dans ~{heuresRest}h</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

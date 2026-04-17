/**
 * Transmissions.jsx — v2
 * Chiffrement AES-256-GCM via clé de session en mémoire (RGPD art. 32 / ANSSI).
 * La clé n'est jamais persistée — données inaccessibles après fermeture = by design.
 */
import { useState, useEffect, useRef } from 'react';
import { T, s } from '../../theme.js';
const C = T.orga;

const STORAGE_KEY = 'transmissions_v2';
const TTL_MS = 24 * 60 * 60 * 1000;

async function genKey() {
  return crypto.subtle.generateKey({ name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']);
}
async function enc(key, entry) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ct = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key,
    new TextEncoder().encode(JSON.stringify(entry)));
  return { iv: btoa(String.fromCharCode(...iv)), ct: btoa(String.fromCharCode(...new Uint8Array(ct))), ts: entry.timestamp };
}
async function dec(key, blob) {
  try {
    const iv = Uint8Array.from(atob(blob.iv), c => c.charCodeAt(0));
    const ct = Uint8Array.from(atob(blob.ct), c => c.charCodeAt(0));
    const pt = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, ct);
    return JSON.parse(new TextDecoder().decode(pt));
  } catch { return null; }
}
function loadBlobs() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const now = Date.now();
    return JSON.parse(raw).filter(b => now - b.ts < TTL_MS);
  } catch { return []; }
}
function saveBlobs(blobs) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(blobs)); } catch {}
}
function fmt(h) {
  const lines = [`[${h.heure}] ${h.patient || 'Patient'}`];
  if (h.donnee) lines.push(`DONNÉE : ${h.donnee}`);
  if (h.lien)   lines.push(`LIEN : ${h.lien}`);
  if (h.action) lines.push(`ACTION : ${h.action}`);
  return lines.join('\n');
}

export default function Transmissions() {
  const keyRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [v, setV] = useState({ patient: '', donnee: '', lien: '', action: '' });
  const [hist, setHist] = useState([]);
  const [copied, setCopied] = useState(null);

  useEffect(() => {
    (async () => {
      const key = await genKey(); keyRef.current = key;
      const blobs = loadBlobs();
      const entries = (await Promise.all(blobs.map(b => dec(key, b)))).filter(Boolean);
      setHist(entries); setReady(true);
    })();
  }, []);

  const set = (k, val) => setV(p => ({ ...p, [k]: val }));

  const save = async () => {
    if (!v.donnee.trim() || !keyRef.current) return;
    const now = new Date();
    const heure = `${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}`;
    const entry = { ...v, heure, timestamp: Date.now() };
    const next = [entry, ...hist]; setHist(next);
    saveBlobs(await Promise.all(next.map(e => enc(keyRef.current, e))));
    setV(p => ({ ...p, donnee: '', lien: '', action: '' }));
  };

  const del = async (i) => {
    const next = hist.filter((_, idx) => idx !== i); setHist(next);
    saveBlobs(await Promise.all(next.map(e => enc(keyRef.current, e))));
  };

  const copy = async (text, key) => {
    try { await navigator.clipboard.writeText(text); setCopied(key); setTimeout(() => setCopied(null), 2000); } catch {}
  };

  if (!ready) return <div style={{ padding: 14, color: T.muted, fontSize: 13 }}>Initialisation…</div>;

  return (
    <div style={{ padding: '14px' }}>
      <div style={{ background: '#0c2210', border: '1px solid #22c55e44', borderRadius: 10, padding: '10px 14px', marginBottom: 12 }}>
        <div style={{ color: '#22c55e', fontWeight: 700, fontSize: 12, marginBottom: 3 }}>🔒 Chiffré AES-256-GCM — clé de session</div>
        <div style={{ color: '#86efac', fontSize: 11, lineHeight: 1.5 }}>Données inaccessibles après fermeture · Utiliser initiales ou n° de chambre</div>
      </div>
      <div style={{ ...s.card, background: '#052e16' }}>
        <div style={{ color: C, fontWeight: 700, marginBottom: 4 }}>Transmissions ciblées — Modèle DLA</div>
        <div style={{ color: T.muted, fontSize: 12 }}>Donnée → Lien → Action</div>
        <div style={{ color: '#475569', fontSize: 11, marginTop: 4 }}>📦 24h · 🔒 AES-256-GCM · Local</div>
      </div>
      <div style={s.card}>
        <div style={{ marginBottom: 10 }}>
          <label style={s.label}>PATIENT (initiales / chambre)</label>
          <input value={v.patient} onChange={e => set('patient', e.target.value)} placeholder="Ex : Chambre 12 · M.D." style={s.input} />
        </div>
        <div style={{ marginBottom: 10 }}>
          <label style={{ ...s.label, color: C }}>D — DONNÉE</label>
          <textarea value={v.donnee} onChange={e => set('donnee', e.target.value)} placeholder="Ex: SpO₂ 88% sous 2L O₂. FR 28/min." style={{ ...s.input, minHeight: 80, resize: 'vertical' }} />
        </div>
        <div style={{ marginBottom: 10 }}>
          <label style={{ ...s.label, color: '#22c55e' }}>L — LIEN</label>
          <textarea value={v.lien} onChange={e => set('lien', e.target.value)} placeholder="Ex: Détresse respiratoire aiguë." style={{ ...s.input, minHeight: 60, resize: 'vertical' }} />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label style={{ ...s.label, color: '#f59e0b' }}>A — ACTION</label>
          <textarea value={v.action} onChange={e => set('action', e.target.value)} placeholder="Ex: O₂ porté à 6L/min. Médecin prévenu." style={{ ...s.input, minHeight: 60, resize: 'vertical' }} />
        </div>
        <button onClick={save} style={{ ...s.btn(C), width: '100%', padding: '11px' }}>ENREGISTRER</button>
      </div>
      {hist.length > 0 && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '14px 0 8px' }}>
            <div style={{ color: C, fontFamily: 'monospace', fontSize: 11, letterSpacing: 2 }}>TRANSMISSIONS ({hist.length})</div>
            <button onClick={() => copy(hist.map(fmt).join('\n\n---\n\n'), 'all')}
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
                  <div style={{ display: 'flex', gap: 6 }}>
                    <span style={{ color: T.muted, fontFamily: 'monospace', fontSize: 12 }}>{h.heure}</span>
                    <button onClick={() => copy(fmt(h), `one_${i}`)} style={{ ...s.btn(copied===`one_${i}`?'#22c55e':'#64748b'), padding: '3px 8px', fontSize: 11 }}>{copied===`one_${i}`?'✓':'📋'}</button>
                    <button onClick={() => del(i)} style={{ background:'none', border:'1px solid #334155', color:'#64748b', borderRadius:6, padding:'3px 8px', fontSize:11, cursor:'pointer' }}>✕</button>
                  </div>
                </div>
                {h.donnee && <><span style={{ color:C, fontSize:11, fontFamily:'monospace' }}>DONNÉE </span><div style={{ color:T.text, fontSize:13, marginBottom:4 }}>{h.donnee}</div></>}
                {h.lien   && <><span style={{ color:'#22c55e', fontSize:11, fontFamily:'monospace' }}>LIEN </span><div style={{ color:T.text, fontSize:13, marginBottom:4 }}>{h.lien}</div></>}
                {h.action && <><span style={{ color:'#f59e0b', fontSize:11, fontFamily:'monospace' }}>ACTION </span><div style={{ color:T.text, fontSize:13 }}>{h.action}</div></>}
                <div style={{ color:'#475569', fontSize:10, fontFamily:'monospace', marginTop:6 }}>🕐 ~{heuresRest}h · 🔒 Chiffré</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

import { useState, useEffect } from 'react';
import { T, s } from '../../theme.js';
const C = T.orga;

const STORAGE_KEY = 'sbar_v1';
const TTL_MS = 24 * 60 * 60 * 1000;

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const saved = JSON.parse(raw);
    if (Date.now() - saved.timestamp > TTL_MS) return null;
    return saved.v;
  } catch { return null; }
}

function save(v) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ v, timestamp: Date.now() })); } catch {}
}

const FIELDS = [
  { key:'S', label:'S — SITUATION', color: C, placeholder:'Qui êtes-vous ? Quel patient ? Quel problème ?\nEx: "IDE Dupont, cardiologie. M. Martin, 72 ans ch.12, douleur thoracique intense à 8/10 depuis 20 min."' },
  { key:'B', label:'B — BACKGROUND (Contexte)', color:'#22c55e', placeholder:'Antécédents, motif hospitalisation, traitements\nEx: "Hospitalisé J3 pour FA. Sous anticoagulants. Coronaropathie connue."' },
  { key:'A', label:'A — ASSESSMENT (Évaluation)', color:'#f59e0b', placeholder:'Vos observations cliniques actuelles\nEx: "PA 90/60, FC 110 irrégulière, SpO₂ 94%, pâle, sudoreux. ECG : sus-décalage ST V2-V4."' },
  { key:'R', label:'R — RECOMMENDATION', color:'#f97316', placeholder:'Ce dont vous avez besoin\nEx: "Venez l\'examiner en urgence. Dois-je préparer un accès veineux ?"' },
];

export default function SBAR() {
  const [v, setV] = useState(() => load() || { S:'', B:'', A:'', R:'' });
  const [shown, setShown] = useState(false);
  const [copied, setCopied] = useState(false);

  const set = (k, val) => { const nv = { ...v, [k]: val }; setV(nv); save(nv); };

  const fullText = FIELDS.map(f => `${f.label}\n${v[f.key] || '(Non renseigné)'}`).join('\n\n');

  const copy = async () => {
    try { await navigator.clipboard.writeText(fullText); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch {}
  };

  const reset = () => {
    const empty = { S:'', B:'', A:'', R:'' };
    setV(empty); save(empty); setShown(false);
  };

  return (
    <div style={{ padding: '14px' }}>
      <div style={{ ...s.card, background: '#052e16' }}>
        <div style={{ color: C, fontWeight: 700, marginBottom: 4 }}>Outil SBAR — Transmission structurée</div>
        <div style={{ color: T.muted, fontSize: 12 }}>Pour toute communication urgente avec le médecin, relèves ou transferts.</div>
        <div style={{ color: '#475569', fontSize: 11, marginTop: 4 }}>📦 Sauvegardé automatiquement 24h</div>
      </div>

      {FIELDS.map(f => (
        <div key={f.key} style={{ ...s.card, borderLeft: `3px solid ${f.color}` }}>
          <label style={{ ...s.label, color: f.color, fontSize: 13 }}>{f.label}</label>
          <textarea value={v[f.key]} onChange={e => set(f.key, e.target.value)} placeholder={f.placeholder}
            style={{ ...s.input, minHeight: 90, resize: 'vertical', lineHeight: 1.5 }} />
        </div>
      ))}

      <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
        <button onClick={() => setShown(true)} style={{ ...s.btn(C), flex: 2, padding: '12px' }}>GÉNÉRER</button>
        <button onClick={copy} style={{ ...s.btn(copied ? '#22c55e' : '#64748b'), flex: 1, padding: '12px' }}>{copied ? '✓ Copié' : '📋 Copier'}</button>
        <button onClick={reset} style={{ ...s.btn('#64748b'), flex: 1, padding: '12px' }}>Effacer</button>
      </div>

      {shown && (
        <div style={{ background: '#052e16', border: `1px solid ${C}44`, borderRadius: 10, padding: '16px', animation: 'fadeIn 0.3s' }}>
          <div style={{ color: C, fontFamily: 'monospace', fontSize: 11, letterSpacing: 2, marginBottom: 12 }}>📢 TRANSMISSION SBAR</div>
          {FIELDS.map(f => (
            <div key={f.key} style={{ marginBottom: 12 }}>
              <div style={{ color: f.color, fontWeight: 700, fontSize: 13, marginBottom: 4 }}>{f.label}</div>
              <div style={{ color: T.text, fontSize: 13, lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{v[f.key] || <em style={{ color: T.muted }}>Non renseigné</em>}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

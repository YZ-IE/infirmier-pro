/**
 * CalcHistory.jsx — Historique des calculs (partagé Iatrogénie)
 * Stockage localStorage, TTL 24h, max 8 entrées par outil
 */
import { useState, useEffect } from 'react';
import { T, s } from '../../theme.js';

const TTL_MS = 24 * 60 * 60 * 1000; // 24h

export function saveCalcEntry(toolKey, entry) {
  try {
    const raw = localStorage.getItem('calc_hist_' + toolKey);
    let list = raw ? JSON.parse(raw) : [];
    const now = Date.now();
    // Purge TTL
    list = list.filter(e => now - e.ts < TTL_MS);
    // Ajouter nouvelle entrée
    list.unshift({ ...entry, ts: now });
    // Max 8
    list = list.slice(0, 8);
    localStorage.setItem('calc_hist_' + toolKey, JSON.stringify(list));
  } catch {}
}

export function loadCalcHistory(toolKey) {
  try {
    const raw = localStorage.getItem('calc_hist_' + toolKey);
    if (!raw) return [];
    const now = Date.now();
    return JSON.parse(raw).filter(e => now - e.ts < TTL_MS);
  } catch { return []; }
}

export default function CalcHistory({ toolKey, color, onRestore }) {
  const C = color;
  const [history, setHistory] = useState([]);
  const [open,    setOpen]    = useState(false);

  useEffect(() => {
    setHistory(loadCalcHistory(toolKey));
  }, [toolKey, open]);

  if (history.length === 0) return null;

  function formatAgo(ts) {
    const diff = Date.now() - ts;
    const min  = Math.floor(diff / 60000);
    if (min < 1)  return 'à l\'instant';
    if (min < 60) return `il y a ${min} min`;
    const h = Math.floor(min / 60);
    return `il y a ${h}h`;
  }

  return (
    <div style={{ marginTop: 10 }}>
      <button onClick={() => setOpen(o => !o)} style={{
        ...s.btn(C), width:'100%', fontSize:12, padding:'8px 12px',
        display:'flex', alignItems:'center', justifyContent:'space-between',
        background: open ? C + '22' : T.surface, borderColor: open ? C : T.border,
      }}>
        <span>🕐 Historique ({history.length})</span>
        <span style={{ fontSize:10 }}>{open ? '▲ Masquer' : '▼ Afficher'}</span>
      </button>

      {open && (
        <div style={{ marginTop:6, animation:'fadeIn 0.2s ease' }}>
          {history.map((e, i) => (
            <div key={i} style={{
              ...s.card, marginBottom:6, padding:'10px 12px',
              borderLeft: `3px solid ${C}88`,
              cursor: onRestore ? 'pointer' : 'default',
            }} onClick={() => onRestore && onRestore(e)}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                <div style={{ color: C, fontWeight:700, fontSize:14 }}>{e.main}</div>
                <div style={{ color: T.muted, fontSize:10, fontFamily:'monospace', whiteSpace:'nowrap', marginLeft:8 }}>
                  {formatAgo(e.ts)}
                </div>
              </div>
              {e.label && <div style={{ color: T.muted, fontSize:11, marginTop:3 }}>{e.label}</div>}
              {onRestore && <div style={{ color: C + '88', fontSize:10, marginTop:4 }}>↩ Appuyer pour restaurer</div>}
            </div>
          ))}
          <button onClick={() => {
            localStorage.removeItem('calc_hist_' + toolKey);
            setHistory([]);
          }} style={{ ...s.btn('#ef4444'), width:'100%', fontSize:11, padding:'6px', marginTop:4 }}>
            🗑 Effacer l'historique
          </button>
        </div>
      )}
    </div>
  );
}

import { useState, useEffect, useRef } from 'react';
import { T, s } from '../../theme.js';
const C = T.soins;

// ── Presets de timers médicaux ───────────────────────────────────────────────
const PRESETS = [
  { id: 'frotte', label: 'Friction SHA', icon: '🤲', duration: 30, color: '#22c55e', tip: 'Couvrir toute la surface des mains' },
  { id: 'betadine', label: 'Bétadine (séchage)', icon: '🟠', duration: 30, color: '#f59e0b', tip: 'Laisser sécher avant geste' },
  { id: 'chlorhex', label: 'Chlorhexidine (séchage)', icon: '🟡', duration: 60, color: '#f59e0b', tip: 'Ne pas rincer, séchage naturel' },
  { id: 'alcool', label: 'Alcool 70° (peau)', icon: '💧', duration: 30, color: '#38bdf8', tip: 'Séchage spontané avant ponction' },
  { id: 'perf60', label: 'Perfusion 60 min', icon: '💊', duration: 3600, color: C, tip: 'Surveiller point de ponction' },
  { id: 'perf30', label: 'Perfusion 30 min', icon: '💉', duration: 1800, color: C, tip: 'Antibiotiques fréquents' },
  { id: 'perf15', label: 'Perfusion 15 min', icon: '⚡', duration: 900, color: '#f97316', tip: 'Perfusion rapide · surveillance accrue' },
  { id: 'compresse', label: 'Compresse humide', icon: '🩹', duration: 600, color: '#a78bfa', tip: '10 min puis réévaluer' },
  { id: 'glace', label: 'Cryothérapie (glace)', icon: '🧊', duration: 900, color: '#38bdf8', tip: 'Max 20 min · protéger la peau' },
  { id: 'perf_custom', label: 'Chrono personnalisé', icon: '⏱', duration: 0, color: '#64748b', tip: 'Entrez une durée manuelle' },
];

function fmt(sec) {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function TimerWidget({ preset, onRemove }) {
  const [remaining, setRemaining] = useState(preset.duration);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const [customDur, setCustomDur] = useState('');
  const [label, setLabel] = useState(preset.label);
  const iRef = useRef(null);

  const duration = preset.id === 'perf_custom' ? (parseInt(customDur) * 60 || 0) : preset.duration;

  useEffect(() => {
    if (running && remaining > 0) {
      iRef.current = setInterval(() => {
        setRemaining(r => {
          if (r <= 1) {
            clearInterval(iRef.current);
            setRunning(false);
            setDone(true);
            // Vibration si disponible
            try { navigator.vibrate?.([200, 100, 200, 100, 200]); } catch {}
            return 0;
          }
          return r - 1;
        });
      }, 1000);
    }
    return () => clearInterval(iRef.current);
  }, [running]);

  const start = () => {
    if (done) { setDone(false); setRemaining(duration); }
    setRunning(true);
  };
  const pause = () => { setRunning(false); clearInterval(iRef.current); };
  const reset = () => { setRunning(false); setDone(false); clearInterval(iRef.current); setRemaining(duration); };

  const pct = duration > 0 ? Math.round((1 - remaining / duration) * 100) : 0;
  const color = done ? '#22c55e' : preset.color;

  return (
    <div style={{ ...s.card, border: `1px solid ${color}44`, background: done ? color + '18' : T.surface, animation: done ? 'blink 0.5s ease 3' : 'none', marginBottom: 10 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={{ fontSize: 22 }}>{preset.icon}</span>
          <div>
            {preset.id === 'perf_custom'
              ? <input value={label} onChange={e => setLabel(e.target.value)} style={{ ...s.input, padding: '4px 8px', fontSize: 13, fontWeight: 700, width: 140 }} />
              : <div style={{ color: T.text, fontWeight: 700, fontSize: 14 }}>{label}</div>
            }
            <div style={{ color: T.muted, fontSize: 11, marginTop: 2 }}>{preset.tip}</div>
          </div>
        </div>
        <button onClick={onRemove} style={{ background: 'none', border: 'none', color: T.muted, cursor: 'pointer', fontSize: 18 }}>×</button>
      </div>

      {/* Durée custom */}
      {preset.id === 'perf_custom' && !running && !done && (
        <div style={{ marginBottom: 10 }}>
          <input type="number" value={customDur} onChange={e => setCustomDur(e.target.value)} placeholder="Durée en minutes"
            style={{ ...s.input, textAlign: 'center', fontSize: 15 }} />
        </div>
      )}

      {/* Affichage temps */}
      <div style={{ textAlign: 'center', margin: '10px 0' }}>
        <div style={{ color: done ? color : color, fontSize: 40, fontWeight: 700, fontFamily: 'monospace', letterSpacing: 2 }}>
          {done ? '✓ TERMINÉ' : fmt(remaining)}
        </div>
        {duration > 0 && !done && (
          <div style={{ background: T.bg, borderRadius: 20, height: 6, marginTop: 8, overflow: 'hidden' }}>
            <div style={{ background: color, height: '100%', width: `${pct}%`, borderRadius: 20, transition: 'width 1s linear' }} />
          </div>
        )}
      </div>

      {/* Contrôles */}
      <div style={{ display: 'flex', gap: 8 }}>
        {!running ? (
          <button onClick={start} disabled={preset.id === 'perf_custom' && !customDur}
            style={{ ...s.btn(color), flex: 2, padding: '10px', opacity: preset.id === 'perf_custom' && !customDur ? 0.4 : 1 }}>
            {done ? '↺ Relancer' : remaining < duration && remaining > 0 ? '▶ Reprendre' : '▶ Démarrer'}
          </button>
        ) : (
          <button onClick={pause} style={{ ...s.btn('#f59e0b'), flex: 2, padding: '10px' }}>⏸ Pause</button>
        )}
        <button onClick={reset} style={{ ...s.btn('#475569'), flex: 1, padding: '10px' }}>↺</button>
      </div>
    </div>
  );
}

export default function Timers() {
  const [active, setActive] = useState([]);

  const add = preset => {
    setActive(p => [...p, { ...preset, key: Date.now() + Math.random() }]);
  };

  return (
    <div style={{ padding: '14px' }}>
      <div style={{ ...s.card, background: C + '11', border: `1px solid ${C}33`, marginBottom: 14 }}>
        <div style={{ color: C, fontWeight: 700, fontSize: 13 }}>⏱ Timers de soins</div>
        <div style={{ color: T.muted, fontSize: 12, marginTop: 3 }}>Chronomètres antiseptiques, perfusions, soins · Plusieurs timers simultanés possibles</div>
      </div>

      {/* Timers actifs */}
      {active.length > 0 && (
        <>
          <div style={{ color: C, fontFamily: 'monospace', fontSize: 11, letterSpacing: 2, marginBottom: 8 }}>TIMERS ACTIFS</div>
          {active.map((t, i) => (
            <TimerWidget key={t.key} preset={t} onRemove={() => setActive(p => p.filter((_, j) => j !== i))} />
          ))}
        </>
      )}

      {/* Presets */}
      <div style={{ color: C, fontFamily: 'monospace', fontSize: 11, letterSpacing: 2, margin: '14px 0 8px' }}>AJOUTER UN TIMER</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        {PRESETS.map(p => (
          <div key={p.id} onClick={() => add(p)}
            style={{ background: T.surface, border: `1px solid ${p.color}44`, borderRadius: 10, padding: '12px', cursor: 'pointer' }}>
            <div style={{ fontSize: 22, marginBottom: 5 }}>{p.icon}</div>
            <div style={{ color: p.color, fontWeight: 700, fontSize: 12, marginBottom: 2 }}>{p.label}</div>
            <div style={{ color: T.muted, fontSize: 11 }}>
              {p.duration === 0 ? 'Durée libre' : p.duration < 60 ? `${p.duration}s` : p.duration < 3600 ? `${p.duration / 60} min` : `${p.duration / 3600}h`}
            </div>
          </div>
        ))}
      </div>

      <div style={{ ...s.card, marginTop: 14, background: '#f59e0b11', border: '1px solid #f59e0b33' }}>
        <div style={{ color: '#f59e0b', fontSize: 11, fontFamily: 'monospace' }}>
          💡 Vibration activée à la fin du timer si votre appareil le supporte · Ne pas fermer l'application
        </div>
      </div>
    </div>
  );
}

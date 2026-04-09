/**
 * DayOverview.jsx — Aide-Mémoire v4 fix
 * Vue journalière : événements, RDV, soins planifiés de tous les patients
 */

import { useState, useEffect, useCallback } from 'react';
import { T } from '../../theme.js';
import { secureGet } from './crypto.js';
import { todayStr } from './utils.jsx';
import { getSpecialty } from './templates.js';

// Couleurs et emojis des soins (dupliqués ici pour éviter la dépendance circulaire)
const CARE_META = {
  constantes_vitales: { emoji: '📊', color: '#06b6d4' },
  antalgie:           { emoji: '💊', color: '#f43f5e' },
  bilan:              { emoji: '🧪', color: '#a78bfa' },
  diurese:            { emoji: '💧', color: '#06b6d4' },
  ecg:                { emoji: '📈', color: '#a78bfa' },
  hgt:                { emoji: '🩸', color: '#f97316' },
  injection:          { emoji: '💉', color: '#a78bfa' },
  pansement:          { emoji: '🩹', color: '#06b6d4' },
  perfusion:          { emoji: '🫙', color: '#22c55e' },
  poids:              { emoji: '⚖️', color: '#22c55e' },
  autre:              { emoji: '📋', color: '#64748b' },
};
function careMeta(type) { return CARE_META[type] || CARE_META.autre; }

// Helpers lits compatibles bedSlots et ancienne structure bedConfig
function resolveSlot(service, bedNumber) {
  // Nouvelle structure : bedSlots
  if (service.bedSlots) {
    const slot = service.bedSlots.find(s => s.slotIndex === bedNumber);
    if (slot) return { label: slot.label || String(bedNumber), icon: slot.icon };
  }
  // Ancienne structure : bedConfig
  if (service.bedConfig?.[bedNumber]) {
    const cfg = service.bedConfig[bedNumber];
    return { label: cfg.label || String(bedNumber), icon: cfg.icon || null };
  }
  return { label: String(bedNumber), icon: null };
}

function slotDisplay(service, bedNumber) {
  const { label, icon } = resolveSlot(service, bedNumber);
  const ico = icon === 'door' ? '🚪' : icon === 'window' ? '🪟' : '🛏';
  return `${ico} ${label}`;
}

// ─── Composant ────────────────────────────────────────────────────────────────

export default function DayOverview({ service, cryptoKey, onBack }) {
  const sp    = getSpecialty(service.specialty);
  const today = todayStr();

  const [patients,  setPatients]  = useState([]);
  const [dailyData, setDailyData] = useState({});
  const [loading,   setLoading]   = useState(true);
  const [tab,       setTab]       = useState('soins');

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [pts, daily] = await Promise.all([
        secureGet(`patients_${service.id}`, cryptoKey),
        secureGet(`daily_${service.id}_${today}`, cryptoKey),
      ]);
      const present = (pts || []).filter(p => p.present);
      present.sort((a, b) => a.bedNumber - b.bedNumber);
      setPatients(present);
      setDailyData(daily || {});
    } catch (e) {
      console.error('[DayOverview] loadData error:', e);
    } finally {
      setLoading(false);
    }
  }, [service.id, cryptoKey, today]);

  useEffect(() => { loadData(); }, [loadData]);

  if (loading) return (
    <div style={{ background: T.bg, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ color: T.muted, fontSize: 14 }}>Chargement…</span>
    </div>
  );

  // ── Agrégation ──────────────────────────────────────────────────────────────

  const allEvents = [];
  const allRdv    = [];
  const allCare   = [];

  for (const p of patients) {
    const daily = dailyData[p.id] || {};

    // Événements
    for (const ev of (daily.events || [])) {
      allEvents.push({ ...ev, patient: p });
    }

    // RDV : champs info persistants avec valeur
    const infoFields = [...(service.fields || []), ...(p.customFields || [])].filter(f => f.category === 'info');
    for (const f of infoFields) {
      const v = f.persistent ? (p.fieldValues || {})[f.id] : (daily.fieldValues || {})[f.id];
      if (v && v !== false && v !== '') allRdv.push({ field: f, value: v, patient: p });
    }

    // Soins
    for (const e of (daily.careEntries || [])) {
      allCare.push({ ...e, patient: p });
    }
  }

  allEvents.sort((a, b) => (a.time || '').localeCompare(b.time || ''));
  allCare.sort((a, b) => (a.plannedTime || '').localeCompare(b.plannedTime || ''));

  const tabs = [
    { id: 'soins',  label: 'Soins',       emoji: '💊', count: allCare.length   },
    { id: 'events', label: 'Événements',  emoji: '📝', count: allEvents.length  },
    { id: 'rdv',    label: 'RDV / Infos', emoji: '📅', count: allRdv.length     },
  ];

  return (
    <div style={{ background: T.bg, minHeight: '100vh', boxSizing: 'border-box' }}>

      {/* Header */}
      <div style={{ padding: '14px 16px 0', background: T.bg, position: 'sticky', top: 0, zIndex: 10, borderBottom: `1px solid ${T.border}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <button onClick={onBack} style={{ background: 'none', border: 'none', color: T.muted, fontSize: 22, cursor: 'pointer', padding: 4 }}>←</button>
          <div style={{ flex: 1 }}>
            <div style={{ color: T.text, fontSize: 17, fontWeight: 700 }}>Vue du jour</div>
            <div style={{ color: T.muted, fontSize: 12 }}>
              {service.name} · {patients.length} patients · {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: '2-digit', month: 'long' })}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 0 }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              style={{
                flex: 1, background: tab === t.id ? '#6366f122' : 'transparent',
                border: 'none', borderBottom: `2px solid ${tab === t.id ? '#6366f1' : 'transparent'}`,
                color: tab === t.id ? '#6366f1' : T.muted,
                fontSize: 12, fontWeight: tab === t.id ? 700 : 400,
                padding: '8px 4px', cursor: 'pointer',
                WebkitTapHighlightColor: 'transparent',
              }}>
              {t.emoji} {t.label}
              {t.count > 0 && (
                <span style={{ marginLeft: 4, background: tab === t.id ? '#6366f1' : T.muted, color: '#fff', borderRadius: 10, fontSize: 10, padding: '1px 5px' }}>
                  {t.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Contenu */}
      <div style={{ padding: '14px 16px 60px' }}>

        {/* ── Soins ── */}
        {tab === 'soins' && (
          allCare.length === 0 ? <Empty text="Aucun soin programmé aujourd'hui" /> : (
            <div>
              {allCare.map((entry, i) => {
                const { emoji, color } = careMeta(entry.type);
                return (
                  <div key={entry.id || i} style={{
                    display: 'flex', gap: 10, alignItems: 'flex-start',
                    background: T.surface, border: `1px solid ${entry.done ? T.border : color + '44'}`,
                    borderLeft: `3px solid ${entry.done ? '#22c55e' : color}`,
                    borderRadius: 9, padding: '10px 12px', marginBottom: 8,
                    opacity: entry.done ? 0.7 : 1,
                  }}>
                    <div style={{ textAlign: 'center', minWidth: 42, flexShrink: 0 }}>
                      <div style={{ color: color, fontSize: 12, fontWeight: 700 }}>{entry.plannedTime}</div>
                      <div style={{ fontSize: 18 }}>{emoji}</div>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                        <span style={{ color: T.text, fontSize: 13, fontWeight: 600, textDecoration: entry.done ? 'line-through' : 'none' }}>
                          {entry.label}
                        </span>
                        {entry.done && <span style={{ color: '#22c55e', fontSize: 11 }}>✓ {entry.doneTime}</span>}
                      </div>
                      {entry.doneValue && (
                        <span style={{ background: '#22c55e22', color: '#22c55e', fontSize: 11, borderRadius: 4, padding: '1px 7px', fontWeight: 700 }}>
                          {entry.doneValue}
                        </span>
                      )}
                      <div style={{ marginTop: 4, display: 'flex', gap: 5, alignItems: 'center' }}>
                        <span style={{ color: sp.color, fontSize: 11, fontWeight: 700 }}>{slotDisplay(service, entry.patient.bedNumber)}</span>
                        <span style={{ color: T.muted, fontSize: 11 }}>· {entry.patient.initials} {entry.patient.gender} {entry.patient.age}a</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )
        )}

        {/* ── Événements ── */}
        {tab === 'events' && (
          allEvents.length === 0 ? <Empty text="Aucun événement enregistré aujourd'hui" /> : (
            <div>
              {allEvents.map((ev, i) => (
                <div key={ev.id || i} style={{
                  display: 'flex', gap: 10, alignItems: 'flex-start',
                  background: T.surface, border: `1px solid ${T.border}`,
                  borderLeft: `3px solid ${sp.color}`,
                  borderRadius: 9, padding: '10px 12px', marginBottom: 8,
                }}>
                  <span style={{ color: '#22c55e', fontSize: 12, fontWeight: 700, minWidth: 38, marginTop: 1 }}>{ev.time}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ color: T.text, fontSize: 13 }}>{ev.text}</div>
                    <div style={{ marginTop: 4, display: 'flex', gap: 5 }}>
                      <span style={{ color: sp.color, fontSize: 11, fontWeight: 700 }}>{slotDisplay(service, ev.patient.bedNumber)}</span>
                      <span style={{ color: T.muted, fontSize: 11 }}>· {ev.patient.initials}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        )}

        {/* ── RDV ── */}
        {tab === 'rdv' && (
          allRdv.length === 0 ? <Empty text="Aucun RDV ou information planifiée" /> : (
            <div>
              {patients.map(p => {
                const rdvs = allRdv.filter(r => r.patient.id === p.id);
                if (!rdvs.length) return null;
                return (
                  <div key={p.id} style={{ marginBottom: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                      <span style={{ color: sp.color, fontSize: 13, fontWeight: 700 }}>{slotDisplay(service, p.bedNumber)}</span>
                      <span style={{ color: T.text, fontSize: 14, fontWeight: 700 }}>{p.initials}</span>
                      <span style={{ color: T.muted, fontSize: 12 }}>{p.gender} {p.age}a</span>
                    </div>
                    {rdvs.map(({ field, value }) => (
                      <div key={field.id} style={{
                        display: 'flex', gap: 10,
                        background: T.surface, border: `1px solid ${T.border}`,
                        borderRadius: 8, padding: '9px 12px', marginBottom: 6, marginLeft: 4,
                      }}>
                        <span style={{ color: T.muted, fontSize: 12, minWidth: 100, flexShrink: 0 }}>{field.label}</span>
                        <span style={{ color: T.text, fontSize: 13, fontWeight: 600 }}>{String(value)}</span>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          )
        )}
      </div>
    </div>
  );
}

function Empty({ text }) {
  return (
    <div style={{ textAlign: 'center', marginTop: 60 }}>
      <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
      <div style={{ color: T.muted, fontSize: 14 }}>{text}</div>
    </div>
  );
}

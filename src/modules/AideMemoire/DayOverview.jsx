/**
 * DayOverview.jsx — Aide-Mémoire v4 fix2
 * Source unique de vérité chambre : computeSlots() importé de ServiceView
 * (suppression de resolveSlot/slotDisplay locaux)
 */

import { useState, useEffect, useCallback } from 'react';
import { T } from '../../theme.js';
import { secureGet } from './crypto.js';
import { todayStr } from './utils.jsx';
import { getSpecialty } from './templates.js';
import { computeSlots } from './ServiceView.jsx';

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

// ── Helpers slot (via computeSlots — source unique) ────────────────────────────

function buildSlotMap(service) {
  const slots = computeSlots(service);
  const map   = {};
  for (const sl of slots) map[sl.slotIndex] = sl;
  return map;
}

function slotLabel(slotMap, bedNumber) {
  const sl  = slotMap[bedNumber];
  if (!sl) return `🛏 ${bedNumber}`;
  const ico = sl.icon === 'door' ? '🚪' : sl.icon === 'window' ? '🪟' : '🛏';
  return `${ico} ${sl.roomLabel}${sl.icon ? ' ' + ico : ''}`.trim();
  // roomLabel + icône si double
}

function slotDisplay(slotMap, bedNumber) {
  const sl = slotMap[bedNumber];
  if (!sl) return `🛏 ${bedNumber}`;
  const ico = sl.icon === 'door' ? '🚪' : sl.icon === 'window' ? '🪟' : '🛏';
  return sl.icon ? `${sl.roomLabel} ${ico}` : `${ico} ${sl.roomLabel}`;
}

// ─── Composant ────────────────────────────────────────────────────────────────

export default function DayOverview({ service, cryptoKey, onBack }) {
  const sp      = getSpecialty(service.specialty);
  const today   = todayStr();
  const slotMap = buildSlotMap(service);

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
    } finally { setLoading(false); }
  }, [service.id, cryptoKey, today]);

  useEffect(() => { loadData(); }, [loadData]);

  if (loading) return (
    <div style={{ background: T.bg, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ color: T.muted, fontSize: 14 }}>Chargement…</span>
    </div>
  );

  // ── Données agrégées ────────────────────────────────────────────────────────

  const careEntries = [];
  const allEvents   = [];
  const allRdv      = [];

  for (const p of patients) {
    const d = dailyData[p.id] || {};
    for (const e of (d.careEntries || [])) {
      careEntries.push({ ...e, patient: p });
    }
    for (const ev of (d.events || [])) {
      allEvents.push({ ...ev, patient: p });
    }
    for (const rdv of (d.rdv || [])) {
      allRdv.push({ ...rdv, patient: p });
    }
  }

  const carePending = careEntries.filter(e => !e.done);
  const careDone    = careEntries.filter(e =>  e.done);
  carePending.sort((a, b) => (a.plannedTime || '').localeCompare(b.plannedTime || ''));
  allRdv.sort((a, b) => (a.time || '').localeCompare(b.time || ''));

  const tabs = [
    { id: 'soins',  label: `Soins (${carePending.length})` },
    { id: 'events', label: `Événements (${allEvents.length})` },
    { id: 'rdv',    label: `RDV (${allRdv.length})` },
    { id: 'recap',  label: 'Récap' },
  ];

  return (
    <div style={{ background: T.bg, minHeight: '100vh', boxSizing: 'border-box' }}>

      {/* Header */}
      <div style={{ padding: '12px 16px 0', position: 'sticky', top: 0, background: T.bg, zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <button onClick={onBack} style={{ background: 'none', border: 'none', color: T.muted, fontSize: 22, cursor: 'pointer', padding: 4 }}>←</button>
          <div>
            <div style={{ color: T.text, fontSize: 16, fontWeight: 700 }}>{service.name}</div>
            <div style={{ color: T.muted, fontSize: 12 }}>📅 {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: '2-digit', month: 'long' })}</div>
          </div>
        </div>

        {/* Onglets */}
        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 10, borderBottom: `1px solid ${T.border}` }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              style={{ background: tab === t.id ? sp.color + '22' : T.surface, border: `1px solid ${tab === t.id ? sp.color : T.border}`, borderRadius: 16, color: tab === t.id ? sp.color : T.muted, fontSize: 12, padding: '5px 10px', cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0 }}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: '12px 16px 60px' }}>

        {/* ── Soins ── */}
        {tab === 'soins' && (
          <>
            {carePending.length === 0 && (
              <div style={{ color: T.muted, textAlign: 'center', padding: '40px 20px', fontSize: 13 }}>
                ✅ Aucun soin en attente
              </div>
            )}
            {carePending.map((e, i) => {
              const m = careMeta(e.type);
              return (
                <div key={i} style={{ background: T.surface, border: `1px solid ${m.color}44`, borderLeft: `3px solid ${m.color}`, borderRadius: 10, padding: '10px 12px', marginBottom: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 18 }}>{m.emoji}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ color: T.text, fontSize: 13, fontWeight: 600 }}>{e.label}</div>
                      <div style={{ color: sp.color, fontSize: 11, fontWeight: 700, marginTop: 1 }}>{slotDisplay(slotMap, e.patient.bedNumber)} — {e.patient.initials}</div>
                    </div>
                    {e.plannedTime && (
                      <span style={{ color: T.muted, fontFamily: 'monospace', fontSize: 12, flexShrink: 0 }}>{e.plannedTime}</span>
                    )}
                  </div>
                  {e.note && <div style={{ color: T.muted, fontSize: 11, marginTop: 6, marginLeft: 26 }}>{e.note}</div>}
                </div>
              );
            })}
            {careDone.length > 0 && (
              <div style={{ color: T.muted, fontSize: 12, marginTop: 20, marginBottom: 8 }}>
                ✅ Soins effectués ({careDone.length})
              </div>
            )}
            {careDone.map((e, i) => {
              const m = careMeta(e.type);
              return (
                <div key={i} style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10, padding: '8px 12px', marginBottom: 6, opacity: 0.5 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 16 }}>{m.emoji}</span>
                    <div style={{ flex: 1 }}>
                      <span style={{ color: T.muted, fontSize: 12, textDecoration: 'line-through' }}>{e.label}</span>
                      <span style={{ color: T.muted, fontSize: 11, marginLeft: 6 }}>{slotDisplay(slotMap, e.patient.bedNumber)}</span>
                    </div>
                    {e.doneTime && <span style={{ color: T.muted, fontSize: 11 }}>{e.doneTime}</span>}
                  </div>
                </div>
              );
            })}
          </>
        )}

        {/* ── Événements ── */}
        {tab === 'events' && (
          <>
            {allEvents.length === 0 && (
              <div style={{ color: T.muted, textAlign: 'center', padding: '40px 20px', fontSize: 13 }}>Aucun événement aujourd'hui</div>
            )}
            {[...allEvents].reverse().map((ev, i) => (
              <div key={i} style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10, padding: '10px 12px', marginBottom: 8 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                  <span style={{ color: T.muted, fontFamily: 'monospace', fontSize: 11, marginTop: 2, flexShrink: 0 }}>{ev.time}</span>
                  <div style={{ flex: 1 }}>
                    <span style={{ color: sp.color, fontSize: 11, fontWeight: 700 }}>{slotDisplay(slotMap, ev.patient.bedNumber)} — {ev.patient.initials}</span>
                    <div style={{ color: T.text, fontSize: 13, marginTop: 2 }}>{ev.text}</div>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}

        {/* ── RDV ── */}
        {tab === 'rdv' && (
          <>
            {allRdv.length === 0 && (
              <div style={{ color: T.muted, textAlign: 'center', padding: '40px 20px', fontSize: 13 }}>Aucun rendez-vous planifié</div>
            )}
            {allRdv.map((rdv, i) => (
              <div key={i} style={{ background: T.surface, border: `1px solid ${T.border}`, borderLeft: `3px solid ${sp.color}`, borderRadius: 10, padding: '10px 12px', marginBottom: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ color: sp.color, fontSize: 16 }}>📅</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: T.text, fontSize: 13, fontWeight: 600 }}>{rdv.label || rdv.text}</div>
                    <div style={{ color: sp.color, fontSize: 11, marginTop: 1 }}>{slotDisplay(slotMap, rdv.patient.bedNumber)} — {rdv.patient.initials}</div>
                  </div>
                  {rdv.time && <span style={{ color: T.muted, fontFamily: 'monospace', fontSize: 12 }}>{rdv.time}</span>}
                </div>
              </div>
            ))}
          </>
        )}

        {/* ── Récapitulatif ── */}
        {tab === 'recap' && (
          <>
            {patients.map(p => {
              const d        = dailyData[p.id] || {};
              const pending  = (d.careEntries || []).filter(e => !e.done).length;
              const done     = (d.careEntries || []).filter(e =>  e.done).length;
              const evCount  = (d.events || []).length;
              return (
                <div key={p.id} style={{ background: T.surface, border: `1px solid ${T.border}`, borderLeft: `3px solid ${sp.color}`, borderRadius: 10, padding: '10px 12px', marginBottom: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ color: sp.color, fontSize: 13, fontWeight: 700, minWidth: 72 }}>{slotDisplay(slotMap, p.bedNumber)}</span>
                    <span style={{ color: T.text, fontSize: 14, fontWeight: 700 }}>{p.initials}</span>
                    <span style={{ color: T.muted, fontSize: 12 }}>{p.gender} {p.age}a</span>
                  </div>
                  {p.admissionReason && (
                    <div style={{ color: T.muted, fontSize: 12, marginBottom: 4, marginLeft: 80 }}>{p.admissionReason}</div>
                  )}
                  <div style={{ display: 'flex', gap: 8, marginLeft: 80, flexWrap: 'wrap' }}>
                    {done > 0     && <span style={{ background: '#22c55e22', color: '#22c55e', fontSize: 10, borderRadius: 8, padding: '2px 8px' }}>✅ {done} soin{done > 1 ? 's' : ''}</span>}
                    {pending > 0  && <span style={{ background: '#f9731622', color: '#f97316', fontSize: 10, borderRadius: 8, padding: '2px 8px' }}>⏳ {pending} à faire</span>}
                    {evCount > 0  && <span style={{ background: '#6366f122', color: '#6366f1', fontSize: 10, borderRadius: 8, padding: '2px 8px' }}>📝 {evCount} évén.</span>}
                  </div>
                </div>
              );
            })}
            {patients.length === 0 && (
              <div style={{ color: T.muted, textAlign: 'center', padding: '40px 20px', fontSize: 13 }}>Aucun patient présent</div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

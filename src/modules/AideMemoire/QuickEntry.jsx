/**
 * QuickEntry.jsx — Aide-Mémoire
 * Saisie rapide à la prise de poste
 * Fix : labels chambre via computeSlots() (source unique de vérité)
 */

import { useState, useEffect, useCallback } from 'react';
import { T, s } from '../../theme.js';
import { secureGet, secureSet } from './crypto.js';
import { getSpecialty } from './templates.js';
import { todayStr, timeStr, genId, activeFlagsEmoji, FieldInput } from './utils.jsx';
import { computeSlots } from './ServiceView.jsx';

function buildSlotMap(service) {
  const map = {};
  for (const sl of computeSlots(service)) map[sl.slotIndex] = sl;
  return map;
}

function slotDisplay(slotMap, bedNumber) {
  const sl  = slotMap[bedNumber];
  if (!sl) return `🛏 ${bedNumber}`;
  const ico = sl.icon === 'door' ? '🚪' : sl.icon === 'window' ? '🪟' : '🛏';
  return sl.icon ? `${sl.roomLabel} ${ico}` : `${ico} ${sl.roomLabel}`;
}

export default function QuickEntry({ service, cryptoKey, accentColor, onBack }) {
  const C       = accentColor;
  const sp      = getSpecialty(service.specialty);
  const slotMap = buildSlotMap(service);

  const [patients,     setPatients]     = useState([]);
  const [dailyData,    setDailyData]    = useState({});
  const [loading,      setLoading]      = useState(true);
  const [eventInputs,  setEventInputs]  = useState({});

  const today = todayStr();

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [pts, daily] = await Promise.all([
        secureGet(`patients_${service.id}`, cryptoKey),
        secureGet(`daily_${service.id}_${today}`, cryptoKey),
      ]);
      setPatients((pts || []).filter(p => p.present));
      setDailyData(daily || {});
    } finally { setLoading(false); }
  }, [service.id, cryptoKey, today]);

  useEffect(() => { loadData(); }, [loadData]);

  async function saveDailyField(patientId, fieldId, value) {
    const entry   = dailyData[patientId] || { fieldValues: {}, events: [], observations: '' };
    const next    = { ...entry, fieldValues: { ...entry.fieldValues, [fieldId]: value } };
    const nextAll = { ...dailyData, [patientId]: next };
    setDailyData(nextAll);
    await secureSet(`daily_${service.id}_${today}`, nextAll, cryptoKey);
  }

  async function addQuickEvent(patientId) {
    const text = (eventInputs[patientId] || '').trim();
    if (!text) return;
    const event   = { id: genId(), time: timeStr(), text };
    const entry   = dailyData[patientId] || { fieldValues: {}, events: [], observations: '' };
    const next    = { ...entry, events: [...(entry.events || []), event] };
    const nextAll = { ...dailyData, [patientId]: next };
    setDailyData(nextAll);
    setEventInputs(prev => ({ ...prev, [patientId]: '' }));
    await secureSet(`daily_${service.id}_${today}`, nextAll, cryptoKey);
  }

  if (loading) return (
    <div style={{ background: T.bg, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ color: T.muted, fontSize: 14 }}>Chargement…</span>
    </div>
  );

  const constFields    = service.fields.filter(f => f.category === 'constante');
  const sortedPatients = [...patients].sort((a, b) => a.bedNumber - b.bedNumber);

  return (
    <div style={{ background: T.bg, minHeight: '100vh', boxSizing: 'border-box' }}>

      {/* Header */}
      <div style={{ padding: '14px 16px 12px', background: T.bg, position: 'sticky', top: 0, zIndex: 10, borderBottom: `1px solid ${T.border}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button onClick={onBack} style={{ background: 'none', border: 'none', color: T.muted, fontSize: 22, cursor: 'pointer', padding: 4 }}>←</button>
          <div>
            <div style={{ color: T.text, fontSize: 16, fontWeight: 700 }}>⚡ Saisie rapide</div>
            <div style={{ color: T.muted, fontSize: 12 }}>
              {service.name} · {sortedPatients.length} patients · {new Date().toLocaleDateString('fr-FR', { weekday: 'short', day: '2-digit', month: 'short' })}
            </div>
          </div>
        </div>
      </div>

      {/* Patients */}
      <div style={{ padding: '10px 16px 60px' }}>

        {sortedPatients.length === 0 && (
          <div style={{ textAlign: 'center', marginTop: 60 }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🛏</div>
            <div style={{ color: T.muted, fontSize: 14 }}>Aucun patient présent dans ce service</div>
          </div>
        )}

        {sortedPatients.map(patient => {
          const daily     = dailyData[patient.id] || { fieldValues: {}, events: [], observations: '' };
          const flagEmoji = activeFlagsEmoji(service.fields, patient.fieldValues, daily.fieldValues);
          const events    = daily.events || [];
          // Label chambre via computeSlots (source unique)
          const chambre   = slotDisplay(slotMap, patient.bedNumber);

          return (
            <div key={patient.id} style={{ background: T.surface, border: `1px solid ${T.border}`, borderLeft: `3px solid ${sp.color}`, borderRadius: 12, padding: '14px 14px 12px', marginBottom: 12 }}>

              {/* En-tête patient */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <span style={{ color: sp.color, fontSize: 12, fontWeight: 700, minWidth: 60 }}>{chambre}</span>
                <span style={{ color: T.text, fontSize: 15, fontWeight: 800 }}>{patient.initials}</span>
                <span style={{ color: T.muted, fontSize: 12 }}>{patient.gender} {patient.age}a</span>
                {flagEmoji.length > 0 && (
                  <div style={{ marginLeft: 'auto', display: 'flex', gap: 3 }}>
                    {flagEmoji.map((e, i) => <span key={i} style={{ fontSize: 15 }}>{e}</span>)}
                  </div>
                )}
              </div>

              {patient.admissionReason && (
                <div style={{ color: T.muted, fontSize: 11, marginBottom: 10, marginLeft: 68, fontStyle: 'italic' }}>
                  {patient.admissionReason.length > 60 ? patient.admissionReason.slice(0, 60) + '…' : patient.admissionReason}
                </div>
              )}

              {/* Constantes */}
              {constFields.length > 0 && (
                <div style={{ marginBottom: 10 }}>
                  <div style={{ color: T.muted, fontSize: 11, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>Constantes</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
                    {constFields.map(f => (
                      <div key={f.id} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ color: T.muted, fontSize: 11 }}>{f.label}:</span>
                        <FieldInput field={f} value={f.persistent ? patient.fieldValues[f.id] : daily.fieldValues[f.id]}
                          onChange={v => saveDailyField(patient.id, f.id, v)} accentColor="#06b6d4" compact />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Événements du jour */}
              {events.length > 0 && (
                <div style={{ marginBottom: 8 }}>
                  {events.map(ev => (
                    <div key={ev.id} style={{ display: 'flex', gap: 6, marginBottom: 3 }}>
                      <span style={{ color: '#22c55e', fontSize: 11, fontWeight: 700, minWidth: 38 }}>{ev.time}</span>
                      <span style={{ color: T.text, fontSize: 12 }}>{ev.text}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Saisie rapide */}
              <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                <input value={eventInputs[patient.id] || ''}
                  onChange={e => setEventInputs(prev => ({ ...prev, [patient.id]: e.target.value }))}
                  onKeyDown={e => { if (e.key === 'Enter') addQuickEvent(patient.id); }}
                  placeholder="Événement rapide…"
                  style={{ ...s.input, flex: 1, boxSizing: 'border-box', fontSize: 13 }} />
                <button onClick={() => addQuickEvent(patient.id)} disabled={!(eventInputs[patient.id] || '').trim()}
                  style={{ background: '#22c55e33', border: '1px solid #22c55e44', borderRadius: 8, color: '#22c55e', fontSize: 18, width: 36, height: 36, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, opacity: (eventInputs[patient.id] || '').trim() ? 1 : 0.35 }}>+</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

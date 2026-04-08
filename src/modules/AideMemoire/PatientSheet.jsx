/**
 * PatientSheet.jsx — Aide-Mémoire
 * Fiche complète d'un patient : séjour, flags, observations, constantes, événements
 */

import { useState, useEffect, useCallback } from 'react';
import { T, s } from '../../theme.js';
import { secureGet, secureSet } from './crypto.js';
import { todayStr, timeStr, genId, isFlagActive, FieldInput } from './utils.jsx';
import { getSpecialty } from './templates.js';

// ─── Helpers visuels ──────────────────────────────────────────────────────────

function Section({ title, color, children }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ ...s.label, color: color || T.muted, marginBottom: 10, paddingLeft: 8, borderLeft: `3px solid ${color || T.border}` }}>
        {title}
      </div>
      {children}
    </div>
  );
}

function FieldRow({ field, value, onChange, accentColor }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ color: T.muted, fontSize: 12, marginBottom: 5 }}>{field.label}</div>
      <FieldInput field={field} value={value} onChange={onChange} accentColor={accentColor} />
    </div>
  );
}

// ─── Composant principal ──────────────────────────────────────────────────────

export default function PatientSheet({ patientId, service, cryptoKey, accentColor, onBack }) {
  const C  = accentColor;
  const sp = getSpecialty(service.specialty);

  const [patient,      setPatient]      = useState(null);
  const [dailyEntry,   setDailyEntry]   = useState({ fieldValues: {}, events: [], observations: '' });
  const [loading,      setLoading]      = useState(true);
  const [newEvent,     setNewEvent]     = useState('');
  const [confirmExit,  setConfirmExit]  = useState(false);
  const [saving,       setSaving]       = useState(false);

  const today = todayStr();

  // ─── Chargement ─────────────────────────────────────────────────────────

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const pts   = await secureGet(`patients_${service.id}`, cryptoKey) || [];
      const found = pts.find(p => p.id === patientId);
      if (!found) { onBack(); return; }
      setPatient(found);

      const daily = await secureGet(`daily_${service.id}_${today}`, cryptoKey) || {};
      setDailyEntry(daily[patientId] || { fieldValues: {}, events: [], observations: '' });
    } finally {
      setLoading(false);
    }
  }, [patientId, service.id, cryptoKey, today]);

  useEffect(() => { loadData(); }, [loadData]);

  // ─── Sauvegarde persistent ────────────────────────────────────────────────

  async function savePersistentField(fieldId, value) {
    const pts     = await secureGet(`patients_${service.id}`, cryptoKey) || [];
    const updated = pts.map(p =>
      p.id === patientId
        ? { ...p, fieldValues: { ...p.fieldValues, [fieldId]: value } }
        : p
    );
    const found = updated.find(p => p.id === patientId);
    if (found) setPatient(found);
    await secureSet(`patients_${service.id}`, updated, cryptoKey);
  }

  // ─── Sauvegarde journalière ───────────────────────────────────────────────

  async function saveDailyField(fieldId, value) {
    const daily = await secureGet(`daily_${service.id}_${today}`, cryptoKey) || {};
    const entry = daily[patientId] || { fieldValues: {}, events: [], observations: '' };
    const next  = { ...entry, fieldValues: { ...entry.fieldValues, [fieldId]: value } };
    const nextDaily = { ...daily, [patientId]: next };
    setDailyEntry(next);
    await secureSet(`daily_${service.id}_${today}`, nextDaily, cryptoKey);
  }

  async function saveDailyObservations(text) {
    const daily     = await secureGet(`daily_${service.id}_${today}`, cryptoKey) || {};
    const entry     = daily[patientId] || { fieldValues: {}, events: [], observations: '' };
    const next      = { ...entry, observations: text };
    const nextDaily = { ...daily, [patientId]: next };
    setDailyEntry(next);
    await secureSet(`daily_${service.id}_${today}`, nextDaily, cryptoKey);
  }

  // ─── Événements ──────────────────────────────────────────────────────────

  async function addEvent() {
    const text = newEvent.trim();
    if (!text) return;
    const event     = { id: genId(), time: timeStr(), text };
    const daily     = await secureGet(`daily_${service.id}_${today}`, cryptoKey) || {};
    const entry     = daily[patientId] || { fieldValues: {}, events: [], observations: '' };
    const next      = { ...entry, events: [...(entry.events || []), event] };
    const nextDaily = { ...daily, [patientId]: next };
    setDailyEntry(next);
    setNewEvent('');
    await secureSet(`daily_${service.id}_${today}`, nextDaily, cryptoKey);
  }

  async function removeEvent(eventId) {
    const daily     = await secureGet(`daily_${service.id}_${today}`, cryptoKey) || {};
    const entry     = daily[patientId] || { fieldValues: {}, events: [], observations: '' };
    const next      = { ...entry, events: (entry.events || []).filter(e => e.id !== eventId) };
    const nextDaily = { ...daily, [patientId]: next };
    setDailyEntry(next);
    await secureSet(`daily_${service.id}_${today}`, nextDaily, cryptoKey);
  }

  // ─── Sortie patient ───────────────────────────────────────────────────────

  async function handleDischarge() {
    setSaving(true);
    try {
      const pts     = await secureGet(`patients_${service.id}`, cryptoKey) || [];
      const updated = pts.map(p =>
        p.id === patientId ? { ...p, present: false, dischargedAt: Date.now() } : p
      );
      await secureSet(`patients_${service.id}`, updated, cryptoKey);
      onBack();
    } finally {
      setSaving(false);
      setConfirmExit(false);
    }
  }

  // ─── Rendu ───────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div style={{ background: T.bg, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ color: T.muted, fontSize: 14 }}>Chargement…</span>
      </div>
    );
  }

  if (!patient) return null;

  // Groupes de champs par catégorie
  const flagFields  = service.fields.filter(f => f.category === 'flag');
  const infoFields  = service.fields.filter(f => f.category === 'info');
  const obsFields   = service.fields.filter(f => f.category === 'observation');
  const constFields = service.fields.filter(f => f.category === 'constante');

  // Flags actifs pour le header
  const activeFlags = flagFields.filter(f => {
    const v = f.persistent ? patient.fieldValues[f.id] : dailyEntry.fieldValues[f.id];
    return isFlagActive(f, v);
  });

  return (
    <div style={{ background: T.bg, minHeight: '100vh', boxSizing: 'border-box' }}>

      {/* ── Header fixe ── */}
      <div style={{ padding: '14px 16px 10px', background: T.bg, position: 'sticky', top: 0, zIndex: 10, borderBottom: `1px solid ${T.border}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <button onClick={onBack} style={{ background: 'none', border: 'none', color: T.muted, fontSize: 22, cursor: 'pointer', padding: 4 }}>←</button>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <span style={{ color: T.text, fontSize: 20, fontWeight: 800 }}>{patient.initials}</span>
              <span style={{ color: T.muted, fontSize: 14 }}>{patient.gender} · {patient.age} ans · Lit {patient.bedNumber}</span>
            </div>
          </div>
          {/* Badge spécialité */}
          <span style={{ background: sp.color + '22', border: `1px solid ${sp.color}44`, borderRadius: 6, color: sp.color, fontSize: 11, padding: '3px 8px', fontWeight: 700 }}>
            {sp.label.split(' ')[0]}
          </span>
        </div>

        {/* Flags actifs */}
        {activeFlags.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, paddingBottom: 4 }}>
            {activeFlags.map(f => {
              const v = f.persistent ? patient.fieldValues[f.id] : dailyEntry.fieldValues[f.id];
              const label = f.type === 'text' ? `${f.label}: ${v}` : f.type === 'select' ? `${f.label.split(' ')[0]} ${v}` : f.label;
              return (
                <span key={f.id} style={{ background: '#f43f5e22', border: '1px solid #f43f5e44', borderRadius: 6, color: '#f43f5e', fontSize: 11, padding: '2px 8px', fontWeight: 600 }}>
                  {label}
                </span>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Corps scrollable ── */}
      <div style={{ padding: '16px 16px 80px' }}>

        {/* Séjour */}
        <Section title="SÉJOUR" color={sp.color}>
          <div style={{ marginBottom: 12 }}>
            <div style={{ color: T.muted, fontSize: 12, marginBottom: 5 }}>Motif d'hospitalisation</div>
            <div style={{ color: T.text, fontSize: 14, background: T.surface, borderRadius: 8, padding: '8px 12px', border: `1px solid ${T.border}` }}>
              {patient.admissionReason || <span style={{ color: T.muted }}>—</span>}
            </div>
          </div>
          <div style={{ marginBottom: 12 }}>
            <div style={{ color: T.muted, fontSize: 12, marginBottom: 5 }}>ATCD / Particularités</div>
            <div style={{ color: T.text, fontSize: 14, background: T.surface, borderRadius: 8, padding: '8px 12px', border: `1px solid ${T.border}` }}>
              {patient.atcd || <span style={{ color: T.muted }}>—</span>}
            </div>
          </div>
          {infoFields.filter(f => f.persistent).map(f => (
            <FieldRow key={f.id} field={f} accentColor={C}
              value={patient.fieldValues[f.id]}
              onChange={v => savePersistentField(f.id, v)} />
          ))}
          {infoFields.filter(f => !f.persistent).map(f => (
            <FieldRow key={f.id} field={f} accentColor={C}
              value={dailyEntry.fieldValues[f.id]}
              onChange={v => saveDailyField(f.id, v)} />
          ))}
        </Section>

        {/* Flags */}
        <Section title="ALERTES / RISQUES" color="#f43f5e">
          {flagFields.map(f => (
            <FieldRow key={f.id} field={f} accentColor="#f43f5e"
              value={f.persistent ? patient.fieldValues[f.id] : dailyEntry.fieldValues[f.id]}
              onChange={v => f.persistent ? savePersistentField(f.id, v) : saveDailyField(f.id, v)} />
          ))}
        </Section>

        {/* Observations */}
        {obsFields.length > 0 && (
          <Section title="OBSERVATIONS" color={C}>
            {obsFields.map(f => (
              <FieldRow key={f.id} field={f} accentColor={C}
                value={f.persistent ? patient.fieldValues[f.id] : dailyEntry.fieldValues[f.id]}
                onChange={v => f.persistent ? savePersistentField(f.id, v) : saveDailyField(f.id, v)} />
            ))}
            <div>
              <div style={{ color: T.muted, fontSize: 12, marginBottom: 5 }}>Notes libres du jour</div>
              <textarea
                value={dailyEntry.observations}
                onChange={e => saveDailyObservations(e.target.value)}
                placeholder="Observations, transmissions…"
                rows={3}
                style={{ ...s.input, width: '100%', boxSizing: 'border-box', resize: 'vertical', fontFamily: 'inherit', fontSize: 14 }}
              />
            </div>
          </Section>
        )}

        {/* Constantes */}
        {constFields.length > 0 && (
          <Section title="CONSTANTES" color="#06b6d4">
            {constFields.map(f => (
              <FieldRow key={f.id} field={f} accentColor="#06b6d4"
                value={f.persistent ? patient.fieldValues[f.id] : dailyEntry.fieldValues[f.id]}
                onChange={v => f.persistent ? savePersistentField(f.id, v) : saveDailyField(f.id, v)} />
            ))}
          </Section>
        )}

        {/* Événements du jour */}
        <Section title="ÉVÉNEMENTS DU JOUR" color="#22c55e">
          {(dailyEntry.events || []).length === 0 && (
            <div style={{ color: T.muted, fontSize: 13, marginBottom: 10, fontStyle: 'italic' }}>Aucun événement enregistré</div>
          )}
          {(dailyEntry.events || []).map(ev => (
            <div key={ev.id} style={{
              display: 'flex', alignItems: 'flex-start', gap: 8,
              background: T.surface, border: `1px solid ${T.border}`,
              borderRadius: 8, padding: '8px 10px', marginBottom: 6,
            }}>
              <span style={{ color: '#22c55e', fontSize: 11, fontWeight: 700, minWidth: 38, marginTop: 1 }}>{ev.time}</span>
              <span style={{ color: T.text, fontSize: 13, flex: 1 }}>{ev.text}</span>
              <button onClick={() => removeEvent(ev.id)}
                style={{ background: 'none', border: 'none', color: T.muted, fontSize: 16, cursor: 'pointer', padding: 0, lineHeight: 1, flexShrink: 0 }}>×</button>
            </div>
          ))}
          {/* Ajout événement */}
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <input
              value={newEvent}
              onChange={e => setNewEvent(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') addEvent(); }}
              placeholder="Nouvel événement…"
              style={{ ...s.input, flex: 1, boxSizing: 'border-box', fontSize: 14 }}
            />
            <button onClick={addEvent} disabled={!newEvent.trim()}
              style={{ ...s.btn('#22c55e'), padding: '0 14px', fontSize: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: newEvent.trim() ? 1 : 0.4 }}>+</button>
          </div>
        </Section>

        {/* Sortie patient */}
        <div style={{ marginTop: 16, paddingTop: 16, borderTop: `1px solid ${T.border}` }}>
          {!confirmExit ? (
            <button onClick={() => setConfirmExit(true)}
              style={{ width: '100%', background: 'transparent', border: `1px solid #f43f5e44`, borderRadius: 10, color: '#f43f5e', padding: '12px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
              🚪 Sortie du patient
            </button>
          ) : (
            <div style={{ background: '#f43f5e11', border: '1px solid #f43f5e33', borderRadius: 10, padding: 14 }}>
              <div style={{ color: T.text, fontSize: 14, marginBottom: 12, textAlign: 'center' }}>
                Confirmer la sortie de <strong>{patient.initials}</strong> (Lit {patient.bedNumber}) ?
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={() => setConfirmExit(false)}
                  style={{ flex: 1, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 8, color: T.text, padding: '10px', fontSize: 14, cursor: 'pointer' }}>
                  Annuler
                </button>
                <button onClick={handleDischarge} disabled={saving}
                  style={{ flex: 1, background: '#f43f5e', border: 'none', borderRadius: 8, color: '#fff', padding: '10px', fontSize: 14, fontWeight: 700, cursor: 'pointer', opacity: saving ? 0.6 : 1 }}>
                  {saving ? 'Enregistrement…' : 'Confirmer'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

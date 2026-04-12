/**
 * DayOverview.jsx — Aide-Mémoire v5
 * Vue journalière INTERACTIVE :
 *   · Soins : cocher/décocher, modal de validation avec valeur, ajouter, supprimer
 *   · Événements : ajouter horodaté, supprimer
 *   · RDV/Infos : éditer les valeurs de champs
 * Source unique pour les labels chambre : computeSlots()
 */

import { useState, useEffect, useCallback } from 'react';
import { T, s } from '../../theme.js';
import { secureGet, secureSet } from './crypto.js';
import { todayStr, timeStr, genId } from './utils.jsx';
import { getSpecialty } from './templates.js';
import { computeSlots } from './ServiceView.jsx';

// ─── Méta-données soins (identiques à CareSchedule) ──────────────────────────

const CARE_TYPES = [
  { id: 'constantes_vitales', label: 'Constantes vitales', emoji: '📊', color: '#06b6d4', grouped: true,
    subFields: [
      { key: 'ta',   label: 'TA (mmHg)',  placeholder: 'Ex: 120/80' },
      { key: 'spo2', label: 'SpO2 (%)',   placeholder: 'Ex: 98'     },
      { key: 'temp', label: 'T° (°C)',    placeholder: 'Ex: 37.2'   },
      { key: 'fc',   label: 'FC (bpm)',   placeholder: 'Ex: 72'     },
    ],
  },
  { id: 'antalgie',  label: 'Antalgie',       emoji: '💊', color: '#f43f5e', grouped: false },
  { id: 'bilan',     label: 'Bilan sanguin',  emoji: '🧪', color: '#a78bfa', grouped: false, valueLabel: 'Tubes / Note',    valuePlaceholder: 'Ex: NFS CRP' },
  { id: 'diurese',   label: 'Diurèse',       emoji: '💧', color: '#06b6d4', grouped: false, valueLabel: 'Volume (mL)',     valuePlaceholder: 'Ex: 350'     },
  { id: 'ecg',       label: 'ECG',           emoji: '📈', color: '#a78bfa', grouped: false, valueLabel: 'Résultat',        valuePlaceholder: 'Ex: RS FC 72'},
  { id: 'hgt',       label: 'Glycémie (HGT)',emoji: '🩸', color: '#f97316', grouped: false, valueLabel: 'Glycémie (g/L)', valuePlaceholder: 'Ex: 1.2'     },
  { id: 'injection', label: 'Injection',      emoji: '💉', color: '#a78bfa', grouped: false },
  { id: 'pansement', label: 'Pansement',      emoji: '🩹', color: '#06b6d4', grouped: false },
  { id: 'perfusion', label: 'Perfusion',      emoji: '🫙', color: '#22c55e', grouped: false },
  { id: 'poids',     label: 'Poids',          emoji: '⚖️', color: '#22c55e', grouped: false, valueLabel: 'Poids (kg)',     valuePlaceholder: 'Ex: 68'      },
  { id: 'autre',     label: 'Autre',          emoji: '📋', color: '#64748b', grouped: false },
];
function getCT(id) { return CARE_TYPES.find(t => t.id === id) || CARE_TYPES[CARE_TYPES.length - 1]; }

// ─── Helpers slots ────────────────────────────────────────────────────────────

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

// ─── Modal validation soin ────────────────────────────────────────────────────

function ValidationModal({ entry, onValidate, onClose }) {
  const ct = getCT(entry.type);
  const [doneTime,     setDoneTime]     = useState(timeStr());
  const [value,        setValue]        = useState('');
  const [subVals,      setSubVals]      = useState({});
  const [confirmEmpty, setConfirmEmpty] = useState(false);

  function hasValue() {
    return ct.grouped
      ? Object.values(subVals).some(v => v?.trim())
      : value.trim().length > 0;
  }
  function buildValue() {
    if (ct.grouped) {
      const parts = (ct.subFields || []).filter(sf => subVals[sf.key]?.trim()).map(sf => `${sf.label.split(' ')[0]}: ${subVals[sf.key]}`);
      return parts.join(' | ');
    }
    return value.trim();
  }
  function handleValidate() {
    if (!hasValue() && !confirmEmpty) { setConfirmEmpty(true); return; }
    onValidate(entry.id, doneTime, buildValue());
    onClose();
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'flex-end', zIndex: 200 }}>
      <div style={{ background: T.surface, borderRadius: '16px 16px 0 0', padding: '22px 20px 44px', width: '100%', boxSizing: 'border-box', maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <div style={{ color: T.text, fontSize: 17, fontWeight: 700 }}>{ct.emoji} {entry.label}</div>
            <div style={{ color: T.muted, fontSize: 12 }}>{entry.patient.initials} · Prévu {entry.plannedTime}</div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: T.muted, fontSize: 26, cursor: 'pointer', lineHeight: 1 }}>×</button>
        </div>

        <div style={{ marginBottom: 14 }}>
          <div style={{ color: T.muted, fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>Heure de réalisation</div>
          <input type="time" value={doneTime} onChange={e => setDoneTime(e.target.value)}
            style={{ ...s.input, width: 130, boxSizing: 'border-box' }} />
        </div>

        {ct.grouped && (
          <div style={{ marginBottom: 14 }}>
            <div style={{ color: T.muted, fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>Valeurs</div>
            {ct.subFields.map(sf => (
              <div key={sf.key} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <span style={{ color: T.muted, fontSize: 12, minWidth: 80 }}>{sf.label}</span>
                <input value={subVals[sf.key] || ''} onChange={e => setSubVals(v => ({ ...v, [sf.key]: e.target.value }))}
                  placeholder={sf.placeholder} style={{ ...s.input, flex: 1, boxSizing: 'border-box' }} />
              </div>
            ))}
          </div>
        )}

        {!ct.grouped && ct.valueLabel && (
          <div style={{ marginBottom: 14 }}>
            <div style={{ color: T.muted, fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>{ct.valueLabel}</div>
            <input value={value} onChange={e => setValue(e.target.value)} placeholder={ct.valuePlaceholder}
              style={{ ...s.input, width: '100%', boxSizing: 'border-box' }} />
          </div>
        )}

        {confirmEmpty && (
          <div style={{ background: '#f9731622', border: '1px solid #f9731644', borderRadius: 8, padding: '8px 12px', marginBottom: 14, color: '#f97316', fontSize: 12 }}>
            ⚠️ Aucune valeur saisie — Confirmer quand même ?
          </div>
        )}

        <button onClick={handleValidate}
          style={{ ...s.btn('#22c55e'), width: '100%', padding: '13px', fontSize: 15, fontWeight: 700 }}>
          ✅ Valider le soin
        </button>
      </div>
    </div>
  );
}

// ─── Modal ajout soin ─────────────────────────────────────────────────────────

function AddCareModal({ onAdd, onClose }) {
  const [type,        setType]        = useState('constantes_vitales');
  const [label,       setLabel]       = useState('');
  const [plannedTime, setPlannedTime] = useState(timeStr());
  const [note,        setNote]        = useState('');
  const ct = getCT(type);

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'flex-end', zIndex: 200 }}>
      <div style={{ background: T.surface, borderRadius: '16px 16px 0 0', padding: '22px 20px 44px', width: '100%', boxSizing: 'border-box', maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <span style={{ color: T.text, fontSize: 17, fontWeight: 700 }}>Ajouter un soin</span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: T.muted, fontSize: 26, cursor: 'pointer', lineHeight: 1 }}>×</button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 220, overflowY: 'auto', marginBottom: 14 }}>
          {CARE_TYPES.map(ct => {
            const active = type === ct.id;
            return (
              <button key={ct.id} onClick={() => { setType(ct.id); setLabel(''); }}
                style={{ display: 'flex', alignItems: 'center', gap: 10, background: active ? ct.color + '22' : T.bg, border: `1px solid ${active ? ct.color : T.border}`, borderLeft: `3px solid ${active ? ct.color : 'transparent'}`, borderRadius: 8, color: active ? ct.color : T.text, fontSize: 14, fontWeight: active ? 700 : 400, padding: '9px 12px', cursor: 'pointer', textAlign: 'left', WebkitTapHighlightColor: 'transparent' }}>
                <span style={{ fontSize: 18, flexShrink: 0 }}>{ct.emoji}</span>
                <span style={{ flex: 1 }}>{ct.label}</span>
              </button>
            );
          })}
        </div>

        <div style={{ marginBottom: 10 }}>
          <div style={{ color: T.muted, fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 5 }}>Libellé (optionnel)</div>
          <input value={label} onChange={e => setLabel(e.target.value)} placeholder={ct.label}
            style={{ ...s.input, width: '100%', boxSizing: 'border-box' }} />
        </div>
        <div style={{ marginBottom: 10 }}>
          <div style={{ color: T.muted, fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 5 }}>Heure planifiée</div>
          <input type="time" value={plannedTime} onChange={e => setPlannedTime(e.target.value)}
            style={{ ...s.input, width: 130, boxSizing: 'border-box' }} />
        </div>
        <div style={{ marginBottom: 18 }}>
          <div style={{ color: T.muted, fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 5 }}>Note (optionnel)</div>
          <input value={note} onChange={e => setNote(e.target.value)} placeholder="Contexte, précisions…"
            style={{ ...s.input, width: '100%', boxSizing: 'border-box' }} />
        </div>
        <button onClick={() => { onAdd({ type, label: label.trim() || ct.label, plannedTime, note: note.trim() }); onClose(); }}
          style={{ width: '100%', padding: '14px', fontSize: 15, fontWeight: 700, background: ct.color, border: 'none', borderRadius: 10, color: '#fff', cursor: 'pointer' }}>
          {ct.emoji} Ajouter
        </button>
      </div>
    </div>
  );
}

// ─── Composant principal ──────────────────────────────────────────────────────

export default function DayOverview({ service, cryptoKey, onBack }) {
  const sp      = getSpecialty(service.specialty);
  const today   = todayStr();
  const slotMap = buildSlotMap(service);

  const [patients,   setPatients]   = useState([]);
  const [dailyData,  setDailyData]  = useState({});
  const [loading,    setLoading]    = useState(true);
  const [tab,        setTab]        = useState('soins');

  // Modaux soins
  const [validating, setValidating] = useState(null); // careEntry + patient
  const [addCare,    setAddCare]    = useState(null); // patientId

  // Ajout événement
  const [eventInputs, setEventInputs] = useState({});

  // Sélection patient pour soin
  const [selectPatient, setSelectPatient] = useState(false);
  const [pendingCareAdd, setPendingCareAdd] = useState(false);

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

  // ── Sauvegarde ────────────────────────────────────────────────────────────
  async function saveDailyData(next) {
    setDailyData(next);
    await secureSet(`daily_${service.id}_${today}`, next, cryptoKey);
  }

  function getEntry(patientId) {
    return dailyData[patientId] || { fieldValues: {}, events: [], careEntries: [], observations: '' };
  }

  // ── Soins ─────────────────────────────────────────────────────────────────
  async function handleValidate(patientId, careId, doneTime, doneValue) {
    const entry    = getEntry(patientId);
    const nextCare = (entry.careEntries || []).map(e =>
      e.id === careId ? { ...e, done: true, doneTime, doneValue } : e
    );
    await saveDailyData({ ...dailyData, [patientId]: { ...entry, careEntries: nextCare } });
  }

  async function handleUndo(patientId, careId) {
    const entry    = getEntry(patientId);
    const nextCare = (entry.careEntries || []).map(e =>
      e.id === careId ? { ...e, done: false, doneTime: null, doneValue: null } : e
    );
    await saveDailyData({ ...dailyData, [patientId]: { ...entry, careEntries: nextCare } });
  }

  async function handleDeleteCare(patientId, careId) {
    const entry    = getEntry(patientId);
    const nextCare = (entry.careEntries || []).filter(e => e.id !== careId);
    await saveDailyData({ ...dailyData, [patientId]: { ...entry, careEntries: nextCare } });
  }

  async function handleAddCare(patientId, careData) {
    const entry    = getEntry(patientId);
    const newEntry = { id: genId(), ...careData, done: false, doneTime: null, doneValue: null };
    const nextCare = [...(entry.careEntries || []), newEntry];
    await saveDailyData({ ...dailyData, [patientId]: { ...entry, careEntries: nextCare } });
  }

  // ── Événements ────────────────────────────────────────────────────────────
  async function handleAddEvent(patientId) {
    const text = (eventInputs[patientId] || '').trim();
    if (!text) return;
    const event = { id: genId(), time: timeStr(), text };
    const entry = getEntry(patientId);
    const next  = { ...entry, events: [...(entry.events || []), event] };
    await saveDailyData({ ...dailyData, [patientId]: next });
    setEventInputs(prev => ({ ...prev, [patientId]: '' }));
  }

  async function handleDeleteEvent(patientId, eventId) {
    const entry = getEntry(patientId);
    const next  = { ...entry, events: (entry.events || []).filter(e => e.id !== eventId) };
    await saveDailyData({ ...dailyData, [patientId]: next });
  }

  // ── RDV/Infos — édition valeur ────────────────────────────────────────────
  async function handleFieldChange(patientId, fieldId, value, persistent, pts) {
    if (persistent) {
      // Champ persistant → écrire dans patients
      const nextPts = pts.map(p =>
        p.id === patientId ? { ...p, fieldValues: { ...(p.fieldValues || {}), [fieldId]: value } } : p
      );
      setPatients(nextPts);
      await secureSet(`patients_${service.id}`, nextPts, cryptoKey);
    } else {
      // Champ journalier
      const entry = getEntry(patientId);
      const next  = { ...entry, fieldValues: { ...(entry.fieldValues || {}), [fieldId]: value } };
      await saveDailyData({ ...dailyData, [patientId]: next });
    }
  }

  if (loading) return (
    <div style={{ background: T.bg, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ color: T.muted, fontSize: 14 }}>Chargement…</span>
    </div>
  );

  // ── Agrégation ────────────────────────────────────────────────────────────
  const allCare   = [];
  const allEvents = [];
  const allRdv    = [];

  for (const p of patients) {
    const d = dailyData[p.id] || {};
    for (const e of (d.careEntries || [])) allCare.push({ ...e, patient: p });
    for (const ev of (d.events     || [])) allEvents.push({ ...ev, patient: p });
    const infoFields = [...(service.fields || []), ...(p.customFields || [])].filter(f => f.category === 'info');
    for (const f of infoFields) {
      const v = f.persistent ? (p.fieldValues || {})[f.id] : (d.fieldValues || {})[f.id];
      if (v !== undefined && v !== null && v !== '') allRdv.push({ field: f, value: v, patient: p });
    }
  }

  allCare.sort((a, b)   => (a.plannedTime || '').localeCompare(b.plannedTime || ''));
  allEvents.sort((a, b) => (a.time || '').localeCompare(b.time || ''));

  const carePending = allCare.filter(e => !e.done);
  const careDone    = allCare.filter(e =>  e.done);

  const tabs = [
    { id: 'soins',  label: 'Soins',      emoji: '💊', badge: carePending.length },
    { id: 'events', label: 'Événements', emoji: '📝', badge: allEvents.length   },
    { id: 'rdv',    label: 'RDV/Infos',  emoji: '📅', badge: allRdv.length      },
    { id: 'recap',  label: 'Récap',      emoji: '📋', badge: 0                  },
  ];

  return (
    <div style={{ background: T.bg, minHeight: '100vh', boxSizing: 'border-box' }}>

      {/* Header */}
      <div style={{ padding: '12px 16px 0', background: T.bg, position: 'sticky', top: 0, zIndex: 10, borderBottom: `1px solid ${T.border}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <button onClick={onBack} style={{ background: 'none', border: 'none', color: T.muted, fontSize: 22, cursor: 'pointer', padding: 4 }}>←</button>
          <div style={{ flex: 1 }}>
            <div style={{ color: T.text, fontSize: 16, fontWeight: 700 }}>Vue du jour</div>
            <div style={{ color: T.muted, fontSize: 12 }}>
              {service.name} · {patients.length} patients · {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: '2-digit', month: 'long' })}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 0 }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              style={{ flex: 1, background: tab === t.id ? sp.color + '15' : 'transparent', border: 'none', borderBottom: `2px solid ${tab === t.id ? sp.color : 'transparent'}`, color: tab === t.id ? sp.color : T.muted, fontSize: 12, fontWeight: tab === t.id ? 700 : 400, padding: '8px 4px', cursor: 'pointer', WebkitTapHighlightColor: 'transparent' }}>
              {t.emoji} {t.label}
              {t.badge > 0 && <span style={{ marginLeft: 4, background: tab === t.id ? sp.color : T.muted, color: '#fff', borderRadius: 10, fontSize: 10, padding: '1px 5px' }}>{t.badge}</span>}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: '12px 16px 80px' }}>

        {/* ════ SOINS ════ */}
        {tab === 'soins' && (
          <>
            {/* Bouton ajouter soin — choisir patient */}
            {patients.length > 0 && (
              <div style={{ marginBottom: 14 }}>
                {!selectPatient ? (
                  <button onClick={() => setSelectPatient(true)}
                    style={{ ...s.btn(sp.color), width: '100%', padding: '10px', fontSize: 14, fontWeight: 700 }}>
                    + Ajouter un soin
                  </button>
                ) : (
                  <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10, padding: '12px' }}>
                    <div style={{ color: T.muted, fontSize: 12, marginBottom: 8 }}>Pour quel patient ?</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {patients.map(p => (
                        <button key={p.id}
                          onClick={() => { setAddCare(p.id); setSelectPatient(false); }}
                          style={{ background: sp.color + '22', border: `1px solid ${sp.color}44`, borderRadius: 8, color: sp.color, fontSize: 13, fontWeight: 700, padding: '6px 12px', cursor: 'pointer' }}>
                          {slotDisplay(slotMap, p.bedNumber)} {p.initials}
                        </button>
                      ))}
                      <button onClick={() => setSelectPatient(false)}
                        style={{ background: 'none', border: `1px solid ${T.border}`, borderRadius: 8, color: T.muted, fontSize: 13, padding: '6px 12px', cursor: 'pointer' }}>
                        Annuler
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {allCare.length === 0 && (
              <Empty text="Aucun soin programmé aujourd'hui" />
            )}

            {/* Soins à faire */}
            {carePending.map((entry, i) => {
              const ct = getCT(entry.type);
              return (
                <div key={entry.id || i} style={{ background: T.surface, border: `1px solid ${ct.color}44`, borderLeft: `3px solid ${ct.color}`, borderRadius: 9, padding: '10px 12px', marginBottom: 8, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  {/* Checkbox */}
                  <button
                    onClick={() => setValidating({ ...entry, patient: entry.patient })}
                    style={{ width: 26, height: 26, borderRadius: 7, flexShrink: 0, marginTop: 1, border: `2px solid ${ct.color}`, background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', WebkitTapHighlightColor: 'transparent' }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: 16 }}>{ct.emoji}</span>
                      <span style={{ color: T.text, fontSize: 13, fontWeight: 600 }}>{entry.label}</span>
                      <span style={{ color: ct.color, fontSize: 12, fontWeight: 700, marginLeft: 'auto', flexShrink: 0 }}>🕐 {entry.plannedTime}</span>
                    </div>
                    {entry.note && <div style={{ color: T.muted, fontSize: 11, marginTop: 2, fontStyle: 'italic' }}>{entry.note}</div>}
                    <div style={{ marginTop: 4, display: 'flex', gap: 5, alignItems: 'center' }}>
                      <span style={{ color: sp.color, fontSize: 11, fontWeight: 700 }}>{slotDisplay(slotMap, entry.patient.bedNumber)}</span>
                      <span style={{ color: T.muted, fontSize: 11 }}>· {entry.patient.initials}</span>
                    </div>
                  </div>
                  <button onClick={() => handleDeleteCare(entry.patient.id, entry.id)}
                    style={{ background: 'none', border: 'none', color: T.muted, fontSize: 16, cursor: 'pointer', flexShrink: 0, padding: 2 }}>🗑</button>
                </div>
              );
            })}

            {/* Soins effectués */}
            {careDone.length > 0 && (
              <>
                <div style={{ color: T.muted, fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5, margin: '16px 0 8px' }}>
                  Réalisés ({careDone.length})
                </div>
                {careDone.map((entry, i) => {
                  const ct = getCT(entry.type);
                  return (
                    <div key={entry.id || i} style={{ background: T.surface, border: `1px solid ${T.border}`, borderLeft: '3px solid #22c55e', borderRadius: 9, padding: '10px 12px', marginBottom: 8, opacity: 0.75, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                      {/* Décocher */}
                      <button onClick={() => handleUndo(entry.patient.id, entry.id)}
                        style={{ width: 26, height: 26, borderRadius: 7, flexShrink: 0, marginTop: 1, border: '2px solid #22c55e', background: '#22c55e', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 14, WebkitTapHighlightColor: 'transparent' }}>
                        ✓
                      </button>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span style={{ fontSize: 15 }}>{ct.emoji}</span>
                          <span style={{ color: T.muted, fontSize: 13, textDecoration: 'line-through' }}>{entry.label}</span>
                          <span style={{ color: '#22c55e', fontSize: 11, marginLeft: 'auto' }}>✓ {entry.doneTime}</span>
                        </div>
                        {entry.doneValue && (
                          <span style={{ background: '#22c55e22', color: '#22c55e', fontSize: 11, borderRadius: 4, padding: '1px 7px', fontWeight: 700, marginTop: 3, display: 'inline-block' }}>
                            {entry.doneValue}
                          </span>
                        )}
                        <div style={{ marginTop: 4, display: 'flex', gap: 5 }}>
                          <span style={{ color: sp.color, fontSize: 11, fontWeight: 700 }}>{slotDisplay(slotMap, entry.patient.bedNumber)}</span>
                          <span style={{ color: T.muted, fontSize: 11 }}>· {entry.patient.initials}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </>
            )}
          </>
        )}

        {/* ════ ÉVÉNEMENTS ════ */}
        {tab === 'events' && (
          <>
            {patients.map(p => {
              const d      = dailyData[p.id] || {};
              const events = d.events || [];
              return (
                <div key={p.id} style={{ marginBottom: 16 }}>
                  {/* En-tête patient */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8, padding: '6px 10px', background: T.surface, borderRadius: 8, border: `1px solid ${T.border}`, borderLeft: `3px solid ${sp.color}` }}>
                    <span style={{ color: sp.color, fontSize: 12, fontWeight: 700 }}>{slotDisplay(slotMap, p.bedNumber)}</span>
                    <span style={{ color: T.text, fontSize: 13, fontWeight: 700 }}>{p.initials}</span>
                    <span style={{ color: T.muted, fontSize: 11 }}>{p.gender} {p.age}a</span>
                  </div>

                  {/* Liste événements */}
                  {events.map(ev => (
                    <div key={ev.id} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', background: T.surface, border: `1px solid ${T.border}`, borderRadius: 8, padding: '8px 10px', marginBottom: 6, marginLeft: 8 }}>
                      <span style={{ color: '#22c55e', fontSize: 11, fontWeight: 700, minWidth: 38, marginTop: 2 }}>{ev.time}</span>
                      <span style={{ color: T.text, fontSize: 13, flex: 1 }}>{ev.text}</span>
                      <button onClick={() => handleDeleteEvent(p.id, ev.id)}
                        style={{ background: 'none', border: 'none', color: T.muted, fontSize: 14, cursor: 'pointer', flexShrink: 0, padding: 0 }}>🗑</button>
                    </div>
                  ))}

                  {/* Ajout rapide */}
                  <div style={{ display: 'flex', gap: 8, marginLeft: 8 }}>
                    <input
                      value={eventInputs[p.id] || ''}
                      onChange={e => setEventInputs(prev => ({ ...prev, [p.id]: e.target.value }))}
                      onKeyDown={e => { if (e.key === 'Enter') handleAddEvent(p.id); }}
                      placeholder="Ajouter un événement…"
                      style={{ ...s.input, flex: 1, boxSizing: 'border-box', fontSize: 13 }}
                    />
                    <button onClick={() => handleAddEvent(p.id)} disabled={!(eventInputs[p.id] || '').trim()}
                      style={{ background: '#22c55e33', border: '1px solid #22c55e44', borderRadius: 8, color: '#22c55e', fontSize: 18, width: 36, height: 36, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, opacity: (eventInputs[p.id] || '').trim() ? 1 : 0.35 }}>+</button>
                  </div>
                </div>
              );
            })}
            {patients.length === 0 && <Empty text="Aucun patient présent" />}
          </>
        )}

        {/* ════ RDV / INFOS ════ */}
        {tab === 'rdv' && (
          <>
            {patients.map(p => {
              const d          = dailyData[p.id] || {};
              const infoFields = [...(service.fields || []), ...(p.customFields || [])].filter(f => f.category === 'info');
              if (!infoFields.length) return null;
              return (
                <div key={p.id} style={{ marginBottom: 18 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                    <span style={{ color: sp.color, fontSize: 13, fontWeight: 700 }}>{slotDisplay(slotMap, p.bedNumber)}</span>
                    <span style={{ color: T.text, fontSize: 14, fontWeight: 700 }}>{p.initials}</span>
                    <span style={{ color: T.muted, fontSize: 12 }}>{p.gender} {p.age}a</span>
                  </div>
                  {infoFields.map(f => {
                    const val = f.persistent ? (p.fieldValues || {})[f.id] : (d.fieldValues || {})[f.id];
                    return (
                      <div key={f.id} style={{ display: 'flex', alignItems: 'center', gap: 8, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 8, padding: '8px 12px', marginBottom: 6, marginLeft: 4 }}>
                        <span style={{ color: T.muted, fontSize: 12, minWidth: 100, flexShrink: 0 }}>{f.label}</span>
                        <input
                          value={val || ''}
                          onChange={e => handleFieldChange(p.id, f.id, e.target.value, f.persistent, patients)}
                          placeholder="—"
                          style={{ ...s.input, flex: 1, boxSizing: 'border-box', fontSize: 13, padding: '6px 10px' }}
                        />
                      </div>
                    );
                  })}
                </div>
              );
            })}
            {patients.length === 0 && <Empty text="Aucun patient présent" />}
          </>
        )}

        {/* ════ RÉCAP ════ */}
        {tab === 'recap' && (
          <>
            {patients.map(p => {
              const d       = dailyData[p.id] || {};
              const pending = (d.careEntries || []).filter(e => !e.done).length;
              const done    = (d.careEntries || []).filter(e =>  e.done).length;
              const evCount = (d.events || []).length;
              return (
                <div key={p.id} style={{ background: T.surface, border: `1px solid ${T.border}`, borderLeft: `3px solid ${sp.color}`, borderRadius: 10, padding: '10px 12px', marginBottom: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ color: sp.color, fontSize: 13, fontWeight: 700, minWidth: 70 }}>{slotDisplay(slotMap, p.bedNumber)}</span>
                    <span style={{ color: T.text, fontSize: 14, fontWeight: 700 }}>{p.initials}</span>
                    <span style={{ color: T.muted, fontSize: 12 }}>{p.gender} {p.age}a</span>
                  </div>
                  {p.admissionReason && <div style={{ color: T.muted, fontSize: 12, marginBottom: 6, marginLeft: 78 }}>{p.admissionReason}</div>}
                  <div style={{ display: 'flex', gap: 6, marginLeft: 78, flexWrap: 'wrap' }}>
                    {done    > 0 && <span style={{ background: '#22c55e22', color: '#22c55e', fontSize: 10, borderRadius: 8, padding: '2px 8px' }}>✅ {done} soin{done > 1 ? 's' : ''}</span>}
                    {pending > 0 && <span style={{ background: '#f9731622', color: '#f97316', fontSize: 10, borderRadius: 8, padding: '2px 8px' }}>⏳ {pending} à faire</span>}
                    {evCount > 0 && <span style={{ background: '#6366f122', color: '#6366f1', fontSize: 10, borderRadius: 8, padding: '2px 8px' }}>📝 {evCount} évén.</span>}
                  </div>
                </div>
              );
            })}
            {patients.length === 0 && <Empty text="Aucun patient présent" />}
          </>
        )}
      </div>

      {/* Modaux */}
      {validating && (
        <ValidationModal
          entry={validating}
          onValidate={(id, doneTime, doneValue) => handleValidate(validating.patient.id, id, doneTime, doneValue)}
          onClose={() => setValidating(null)}
        />
      )}
      {addCare && (
        <AddCareModal
          onAdd={care => handleAddCare(addCare, care)}
          onClose={() => setAddCare(null)}
        />
      )}
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

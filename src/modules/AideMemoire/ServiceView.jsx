/**
 * ServiceView.jsx — Aide-Mémoire v4 fix3
 * Correctifs CNIL :
 *   · doExport() : avertissement obligatoire avant navigator.share()
 *   · Bouton transfert sécurisé (🔄) → SecureTransfer
 */

import { useState, useEffect, useCallback } from 'react';
import { T, s } from '../../theme.js';
import { secureGet, secureSet, verifyPin } from './crypto.js';
import { getSpecialty } from './templates.js';
import { todayStr, genId, isFlagActive, activeFlagsEmoji } from './utils.jsx';

const SURVEILLANCE_TYPES = new Set(['constantes_vitales','hgt','bilan','diurese','ecg','poids']);

// ── computeSlots — source unique de vérité ────────────────────────────────────
// Priorité : bedRooms → bedConfig non-vide → bedCount

export function computeSlots(service) {
  if (service.bedRooms && service.bedRooms.length > 0) {
    const slots = [];
    let idx = 1;
    for (const room of service.bedRooms) {
      const isDouble = room.iconA || room.iconB;
      if (isDouble) {
        slots.push({ slotIndex: idx++, roomLabel: room.label, icon: room.iconA || null });
        slots.push({ slotIndex: idx++, roomLabel: room.label, icon: room.iconB || null });
      } else {
        slots.push({ slotIndex: idx++, roomLabel: room.label, icon: null });
      }
    }
    return slots;
  }
  if (service.bedConfig && Object.keys(service.bedConfig).length > 0) {
    return Object.entries(service.bedConfig)
      .map(([num, cfg]) => ({ slotIndex: Number(num), roomLabel: cfg.label || String(num), icon: cfg.icon || null }))
      .sort((a, b) => a.slotIndex - b.slotIndex);
  }
  const count = service.bedCount || 20;
  return Array.from({ length: count }, (_, i) => ({ slotIndex: i + 1, roomLabel: String(i + 1), icon: null }));
}

function slotIcon(icon) {
  if (icon === 'door')   return '🚪';
  if (icon === 'window') return '🪟';
  return '🛏';
}

function slotLabel(slot) {
  return slot.icon ? `${slot.roomLabel} ${slotIcon(slot.icon)}` : slot.roomLabel;
}

// ── Modal PIN export ──────────────────────────────────────────────────────────

const NUMPAD = [1, 2, 3, 4, 5, 6, 7, 8, 9, null, 0, '⌫'];

function PinExportModal({ onConfirm, onClose }) {
  const [pin,  setPin]  = useState('');
  const [error,setError]= useState('');
  const [busy, setBusy] = useState(false);

  async function handleDigit(d) {
    if (busy || pin.length >= 4) return;
    const next = pin + String(d);
    setPin(next);
    if (next.length === 4) {
      setBusy(true);
      const key = await verifyPin(next);
      if (key) { onConfirm(); onClose(); }
      else { setError('PIN incorrect'); setPin(''); }
      setBusy(false);
    }
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.82)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 }}>
      <div style={{ background: T.surface, borderRadius: 16, padding: '28px 24px', width: 280, boxSizing: 'border-box', textAlign: 'center' }}>
        <div style={{ fontSize: 36, marginBottom: 12 }}>🔐</div>
        <div style={{ color: T.text, fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Confirmer l'export</div>
        <div style={{ color: T.muted, fontSize: 13, marginBottom: 20 }}>Saisir votre PIN</div>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginBottom: 14 }}>
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} style={{ width: 14, height: 14, borderRadius: '50%', background: i < pin.length ? '#6366f1' : 'transparent', border: `2px solid ${i < pin.length ? '#6366f1' : T.border}` }} />
          ))}
        </div>
        <div style={{ height: 22, marginBottom: 10 }}>
          {error && <span style={{ color: '#f43f5e', fontSize: 13 }}>{error}</span>}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 16 }}>
          {NUMPAD.map((k, i) => {
            if (k === null) return <div key={i} />;
            return (
              <button key={i} onClick={() => k === '⌫' ? setPin(p => p.slice(0, -1)) : handleDigit(k)} disabled={busy}
                style={{ background: T.bg, border: `1px solid ${T.border}`, borderRadius: 10, color: k === '⌫' ? T.muted : T.text, fontSize: k === '⌫' ? 18 : 20, height: 52, cursor: 'pointer', WebkitTapHighlightColor: 'transparent' }}>
                {k}
              </button>
            );
          })}
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: T.muted, fontSize: 14, cursor: 'pointer' }}>Annuler</button>
      </div>
    </div>
  );
}

// ── Modal avertissement export CNIL ──────────────────────────────────────────

function ExportWarningModal({ serviceName, onConfirm, onClose }) {
  const [accepted, setAccepted] = useState(false);
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.82)', display: 'flex', alignItems: 'flex-end', zIndex: 200 }}>
      <div style={{ background: T.surface, borderRadius: '16px 16px 0 0', padding: '24px 20px 44px', width: '100%', boxSizing: 'border-box' }}>
        <div style={{ fontSize: 32, textAlign: 'center', marginBottom: 12 }}>⚠️</div>
        <div style={{ color: T.text, fontSize: 16, fontWeight: 700, marginBottom: 8, textAlign: 'center' }}>Export — Données de santé</div>

        <div style={{ background: '#1a0a12', border: '1px solid #f43f5e33', borderRadius: 10, padding: '12px 14px', marginBottom: 16 }}>
          <div style={{ color: '#f43f5e', fontSize: 12, fontWeight: 700, marginBottom: 6 }}>Secret professionnel (art. R.4311-5 CSP)</div>
          <div style={{ color: T.muted, fontSize: 12, lineHeight: 1.6 }}>
            Cet export contient des données de santé pseudonymisées du service <strong style={{ color: T.text }}>{serviceName}</strong>.{'\n\n'}
            Ces données sont soumises au secret professionnel. Elles ne doivent être transmises que via des canaux sécurisés (MSSanté, messagerie professionnelle) et uniquement à des professionnels habilités.
          </div>
        </div>

        <div style={{ background: '#0c1a2e', border: '1px solid #1e3a5f', borderRadius: 10, padding: '10px 14px', marginBottom: 16 }}>
          <div style={{ color: '#60a5fa', fontSize: 12, marginBottom: 4 }}>💡 Alternative recommandée</div>
          <div style={{ color: T.muted, fontSize: 12 }}>
            Utilisez le <strong style={{ color: T.text }}>Transfert sécurisé 🔄</strong> pour envoyer les données à un collègue via un canal chiffré de bout en bout, sans exposer les données en clair.
          </div>
        </div>

        <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 20, cursor: 'pointer' }}>
          <input type="checkbox" checked={accepted} onChange={e => setAccepted(e.target.checked)}
            style={{ width: 18, height: 18, marginTop: 1, flexShrink: 0 }} />
          <span style={{ color: T.text, fontSize: 12 }}>
            Je confirme que ce partage est nécessaire et sera limité aux professionnels habilités
          </span>
        </label>

        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onClose} style={{ flex: 1, background: T.bg, border: `1px solid ${T.border}`, borderRadius: 8, color: T.muted, fontSize: 14, padding: '12px', cursor: 'pointer' }}>Annuler</button>
          <button onClick={onConfirm} disabled={!accepted}
            style={{ ...s.btn(accepted ? '#f97316' : T.muted), flex: 2, padding: '12px', fontSize: 14, fontWeight: 700, opacity: accepted ? 1 : 0.4 }}>
            Exporter quand même
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Modal config chambres ─────────────────────────────────────────────────────

function BedsConfigModal({ service, onSave, onClose }) {
  const initRooms = () => {
    if (service.bedRooms && service.bedRooms.length > 0) return service.bedRooms.map(r => ({ ...r }));
    return Array.from({ length: service.bedCount || 10 }, (_, i) => ({ id: String(i + 1), label: String(i + 1), iconA: null, iconB: null }));
  };

  const [rooms,    setRooms]    = useState(initRooms);
  const [fromRoom, setFromRoom] = useState('');
  const [toRoom,   setToRoom]   = useState('');

  function applyRange() {
    const from = Number(fromRoom), to = Number(toRoom);
    if (!from || !to || to < from) return;
    const next = [];
    for (let r = from; r <= to; r++) next.push({ id: String(r), label: String(r), iconA: 'door', iconB: 'window' });
    setRooms(next);
  }

  function updateRoom(idx, field, value) { setRooms(prev => prev.map((r, i) => i === idx ? { ...r, [field]: value } : r)); }
  function addRoom() { const last = rooms[rooms.length - 1]; setRooms(prev => [...prev, { id: genId(), label: last ? String(Number(last.label) + 1 || rooms.length + 1) : '1', iconA: null, iconB: null }]); }
  function removeRoom(idx) { setRooms(prev => prev.filter((_, i) => i !== idx)); }

  const totalSlots = rooms.reduce((acc, r) => acc + ((r.iconA || r.iconB) ? 2 : 1), 0);

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.72)', display: 'flex', alignItems: 'flex-end', zIndex: 150 }}>
      <div style={{ background: T.surface, borderRadius: '16px 16px 0 0', padding: '20px 20px 44px', width: '100%', boxSizing: 'border-box', maxHeight: '92vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div>
            <div style={{ color: T.text, fontSize: 17, fontWeight: 700 }}>⚙️ Chambres</div>
            <div style={{ color: T.muted, fontSize: 12, marginTop: 2 }}>{rooms.length} chambre(s) → {totalSlots} lit(s)</div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: T.muted, fontSize: 26, cursor: 'pointer', lineHeight: 1 }}>×</button>
        </div>

        {/* Génération rapide */}
        <div style={{ background: T.bg, borderRadius: 10, padding: '12px 14px', marginBottom: 16 }}>
          <div style={{ color: T.muted, fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>⚡ Génération rapide (doubles)</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <span style={{ color: T.muted, fontSize: 13 }}>Ch.</span>
            <input type="number" value={fromRoom} onChange={e => setFromRoom(e.target.value)} inputMode="numeric" placeholder="101"
              style={{ ...s.input, width: 60, boxSizing: 'border-box', textAlign: 'center' }} />
            <span style={{ color: T.muted, fontSize: 13 }}>à</span>
            <input type="number" value={toRoom} onChange={e => setToRoom(e.target.value)} inputMode="numeric" placeholder="115"
              style={{ ...s.input, width: 60, boxSizing: 'border-box', textAlign: 'center' }} />
            <button onClick={applyRange} style={{ ...s.btn('#6366f1'), padding: '8px 12px', fontSize: 13, fontWeight: 700 }}>Générer</button>
          </div>
          <div style={{ color: T.muted, fontSize: 11 }}>🚪 + 🪟 auto · Retirez une icône = lit A seul · Aucune icône = chambre seule</div>
        </div>

        {rooms.map((room, idx) => {
          const isDouble = room.iconA || room.iconB;
          return (
            <div key={room.id || idx} style={{ marginBottom: 10, background: T.bg, borderRadius: 10, padding: '10px 12px', border: `1px solid ${isDouble ? '#6366f122' : T.border}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <span style={{ color: T.muted, fontSize: 11 }}>Ch.</span>
                <input value={room.label} onChange={e => updateRoom(idx, 'label', e.target.value)} maxLength={8}
                  style={{ ...s.input, width: 70, boxSizing: 'border-box', fontSize: 14, fontWeight: 700 }} />
                <span style={{ color: T.muted, fontSize: 11, marginLeft: 'auto' }}>{isDouble ? '🛏🛏 double' : '🛏 seule'}</span>
                <button onClick={() => removeRoom(idx)} style={{ background: 'none', border: 'none', color: T.muted, fontSize: 16, cursor: 'pointer', padding: 0 }}>🗑</button>
              </div>
              {[['iconA', 'Lit A'], ['iconB', 'Lit B']].map(([field, label]) => (
                <div key={field} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: field === 'iconA' ? 6 : 0 }}>
                  <span style={{ color: T.muted, fontSize: 12, minWidth: 44 }}>{label}</span>
                  {[null, 'door', 'window'].map(icon => {
                    const emoji  = icon === 'door' ? '🚪' : icon === 'window' ? '🪟' : '🛏';
                    const active = room[field] === icon;
                    return (
                      <button key={String(icon)} onClick={() => updateRoom(idx, field, icon)}
                        style={{ background: active ? '#6366f133' : T.surface, border: `1px solid ${active ? '#6366f1' : T.border}`, borderRadius: 7, fontSize: 18, width: 38, height: 38, cursor: 'pointer', WebkitTapHighlightColor: 'transparent' }}>
                        {emoji}
                      </button>
                    );
                  })}
                  {field === 'iconB' && !isDouble && <span style={{ color: T.muted, fontSize: 10, fontStyle: 'italic' }}>ignoré</span>}
                </div>
              ))}
            </div>
          );
        })}

        <button onClick={addRoom}
          style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', background: T.bg, border: `1px dashed ${T.border}`, borderRadius: 9, color: T.muted, fontSize: 14, padding: '10px 12px', cursor: 'pointer', marginBottom: 14, WebkitTapHighlightColor: 'transparent' }}>
          <span style={{ fontSize: 18 }}>+</span><span>Ajouter une chambre</span>
        </button>

        <button onClick={() => { onSave(rooms); onClose(); }}
          style={{ ...s.btn('#6366f1'), width: '100%', padding: '13px', fontSize: 15, fontWeight: 700 }}>
          Enregistrer ({totalSlots} lit{totalSlots > 1 ? 's' : ''})
        </button>
      </div>
    </div>
  );
}

// ── Composant principal ───────────────────────────────────────────────────────

export default function ServiceView({ service, cryptoKey, accentColor, onSelectPatient, onQuickEntry, onDayOverview, onBack, onServiceUpdate, onTransfer, refreshKey }) {
  const C  = accentColor;
  const sp = getSpecialty(service.specialty);

  const [patients,       setPatients]       = useState([]);
  const [dailyData,      setDailyData]      = useState({});
  const [loading,        setLoading]        = useState(true);
  const [addBed,         setAddBed]         = useState(null);
  const [addForm,        setAddForm]        = useState({ initials: '', age: '', gender: 'M', reason: '', atcd: '' });
  const [saving,         setSaving]         = useState(false);
  const [confirmReset,   setConfirmReset]   = useState(false);
  const [showBedsCfg,    setShowBedsCfg]    = useState(false);
  const [showPinExport,  setShowPinExport]  = useState(false);
  const [showExpWarn,    setShowExpWarn]    = useState(false);

  const today = todayStr();

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [pts, daily] = await Promise.all([
        secureGet(`patients_${service.id}`, cryptoKey),
        secureGet(`daily_${service.id}_${today}`, cryptoKey),
      ]);
      setPatients(pts || []);
      setDailyData(daily || {});
    } finally { setLoading(false); }
  }, [service.id, cryptoKey, today]);

  useEffect(() => { loadData(); }, [loadData, refreshKey]);

  async function savePatients(next) { setPatients(next); await secureSet(`patients_${service.id}`, next, cryptoKey); }
  async function saveDailyData(next) { setDailyData(next); await secureSet(`daily_${service.id}_${today}`, next, cryptoKey); }

  async function handleDailyReset() {
    const next = {};
    for (const [pid, entry] of Object.entries(dailyData)) {
      next[pid] = { ...entry, careEntries: (entry.careEntries || []).filter(e => SURVEILLANCE_TYPES.has(e.type)).map(e => ({ ...e, done: false, doneTime: null, doneValue: null })) };
    }
    await saveDailyData(next); setConfirmReset(false);
  }

  async function handleBedsSave(rooms) { await onServiceUpdate({ ...service, bedRooms: rooms }); }

  async function handleAddPatient() {
    if (!addForm.initials.trim() || !addForm.age) return;
    setSaving(true);
    try {
      const p = { id: genId(), serviceId: service.id, bedNumber: addBed, initials: addForm.initials.trim().toUpperCase(), age: Number(addForm.age), gender: addForm.gender, admissionReason: addForm.reason.trim(), atcd: addForm.atcd.trim(), fieldValues: {}, customFields: [], present: true, admittedAt: Date.now() };
      await savePatients([...patients, p]);
      setAddBed(null); setAddForm({ initials: '', age: '', gender: 'M', reason: '', atcd: '' });
    } finally { setSaving(false); }
  }

  // Export texte — avec avertissement obligatoire (CNIL)
  function doExport() {
    const present = patients.filter(p => p.present);
    const slots   = computeSlots(service);
    const lines   = [
      `AIDE-MÉMOIRE — ${service.name}`,
      new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' }),
      '─'.repeat(42),
    ];
    for (const slot of slots) {
      const p   = present.find(pt => pt.bedNumber === slot.slotIndex);
      const ico = slotIcon(slot.icon);
      const lbl = slotLabel(slot);
      if (!p) { lines.push(`${ico} ${lbl} : Libre`); continue; }
      const daily = dailyData[p.id] || {};
      const flags = [...(service.fields || []), ...(p.customFields || [])]
        .filter(f => f.category === 'flag')
        .filter(f => isFlagActive(f, f.persistent ? p.fieldValues?.[f.id] : daily.fieldValues?.[f.id]))
        .map(f => f.label).join(' · ');
      lines.push(`${ico} ${lbl} : ${p.initials} ${p.gender} ${p.age}a${flags ? '  [' + flags + ']' : ''}`);
      if (p.admissionReason) lines.push(`      ${p.admissionReason}`);
      const pending = (daily.careEntries || []).filter(e => !e.done);
      if (pending.length) lines.push(`      ⏳ ${pending.map(e => `${e.label} ${e.plannedTime}`).join(' | ')}`);
      lines.push('');
    }
    const text = lines.join('\n');
    if (navigator.share) navigator.share({ title: `Aide-Mémoire ${service.name}`, text }).catch(() => {});
    else if (navigator.clipboard) navigator.clipboard.writeText(text).then(() => alert('📋 Copié'));
  }

  if (loading) return (
    <div style={{ background: T.bg, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ color: T.muted, fontSize: 14 }}>Chargement…</span>
    </div>
  );

  const slots      = computeSlots(service);
  const presentPts = patients.filter(p => p.present);

  return (
    <div style={{ background: T.bg, minHeight: '100vh', boxSizing: 'border-box' }}>

      {/* Header */}
      <div style={{ padding: '14px 16px 0', background: T.bg, position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
          <button onClick={onBack} style={{ background: 'none', border: 'none', color: T.muted, fontSize: 22, cursor: 'pointer', padding: 4 }}>←</button>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ color: T.text, fontSize: 17, fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{service.name}</div>
            <div style={{ color: T.muted, fontSize: 12 }}>{sp.label} · {presentPts.length}/{slots.length} lits</div>
          </div>
          {[
            { icon: '⚙️', fn: () => setShowBedsCfg(true),   col: T.muted, bg: T.surface },
            { icon: '📋', fn: onDayOverview,                 col: T.muted, bg: T.surface },
            { icon: '⚡', fn: onQuickEntry,                  col: C,       bg: C + '22'  },
            { icon: '🔄', fn: onTransfer,                    col: '#6366f1', bg: '#6366f122', title: 'Transfert sécurisé' },
            { icon: '⬆',  fn: () => setShowPinExport(true), col: T.muted, bg: T.surface, title: 'Export texte' },
          ].map((b, i) => (
            <button key={i} onClick={b.fn} title={b.title}
              style={{ background: b.bg, border: `1px solid ${T.border}`, borderRadius: 8, color: b.col, fontSize: 16, padding: '6px 9px', cursor: 'pointer', flexShrink: 0 }}>
              {b.icon}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 10, borderBottom: `1px solid ${T.border}`, marginBottom: 4 }}>
          <span style={{ color: T.muted, fontSize: 12 }}>📅 {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: '2-digit', month: 'long' })}</span>
          {!confirmReset ? (
            <button onClick={() => setConfirmReset(true)} style={{ background: 'none', border: 'none', color: T.muted, fontSize: 12, cursor: 'pointer' }}>🔄 Reset soins</button>
          ) : (
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <button onClick={() => setConfirmReset(false)} style={{ background: 'none', border: 'none', color: T.muted, fontSize: 12, cursor: 'pointer' }}>Annuler</button>
              <button onClick={handleDailyReset} style={{ background: '#f43f5e22', border: '1px solid #f43f5e44', borderRadius: 6, color: '#f43f5e', fontSize: 12, padding: '3px 8px', cursor: 'pointer' }}>Confirmer</button>
            </div>
          )}
        </div>
      </div>

      {/* Liste des lits */}
      <div style={{ padding: '8px 16px 60px' }}>
        {slots.map(slot => {
          const patient = presentPts.find(p => p.bedNumber === slot.slotIndex);
          const ico     = slotIcon(slot.icon);
          const lbl     = slotLabel(slot);

          if (!patient) return (
            <div key={slot.slotIndex} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', marginBottom: 6, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10, opacity: 0.55 }}>
              <span style={{ color: T.muted, fontSize: 13, minWidth: 72, fontWeight: 600 }}>{ico} {lbl}</span>
              <span style={{ color: T.muted, fontSize: 13, flex: 1 }}>Libre</span>
              <button onClick={() => setAddBed(slot.slotIndex)}
                style={{ background: C + '22', border: `1px solid ${C}44`, borderRadius: 6, color: C, fontSize: 18, width: 30, height: 30, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>+</button>
            </div>
          );

          const daily       = dailyData[patient.id] || {};
          const allFields   = [...(service.fields || []), ...(patient.customFields || [])];
          const flagEmoji   = activeFlagsEmoji(allFields, patient.fieldValues || {}, daily.fieldValues || {});
          const pendingCare = (daily.careEntries || []).filter(e => !e.done).length;
          const keyFields   = (service.fields || []).filter(f => f.category === 'info' && f.persistent).slice(0, 2);

          return (
            <div key={slot.slotIndex} onClick={() => onSelectPatient(patient.id)}
              style={{ padding: '11px 14px', marginBottom: 6, background: T.surface, border: `1px solid ${T.border}`, borderLeft: `3px solid ${sp.color}`, borderRadius: 10, cursor: 'pointer', WebkitTapHighlightColor: 'transparent' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ color: T.muted, fontSize: 12, minWidth: 72, fontWeight: 600 }}>{ico} {lbl}</span>
                <span style={{ color: T.text, fontSize: 15, fontWeight: 700 }}>{patient.initials}</span>
                <span style={{ color: T.muted, fontSize: 12 }}>{patient.gender} {patient.age}a</span>
                <div style={{ marginLeft: 'auto', display: 'flex', gap: 4, alignItems: 'center', flexShrink: 0 }}>
                  {pendingCare > 0 && <span style={{ background: '#f9731622', color: '#f97316', fontSize: 10, borderRadius: 10, padding: '1px 6px', fontWeight: 700 }}>💊×{pendingCare}</span>}
                  {flagEmoji.map((e, i) => <span key={i} style={{ fontSize: 15 }}>{e}</span>)}
                </div>
              </div>
              {patient.admissionReason && (
                <div style={{ color: T.muted, fontSize: 12, marginTop: 3, marginLeft: 80 }}>
                  {patient.admissionReason.length > 50 ? patient.admissionReason.slice(0, 50) + '…' : patient.admissionReason}
                </div>
              )}
              {keyFields.some(f => (patient.fieldValues || {})[f.id]) && (
                <div style={{ display: 'flex', gap: 6, marginTop: 4, marginLeft: 80, flexWrap: 'wrap' }}>
                  {keyFields.map(f => { const v = (patient.fieldValues || {})[f.id]; if (!v && v !== true) return null; return <span key={f.id} style={{ color: C, fontSize: 11, background: C + '11', borderRadius: 4, padding: '1px 6px' }}>{f.label}: {String(v)}</span>; })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Modal ajout patient */}
      {addBed !== null && (() => {
        const slot = computeSlots(service).find(sl => sl.slotIndex === addBed);
        const lbl  = slot ? slotLabel(slot) : String(addBed);
        return (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.72)', display: 'flex', alignItems: 'flex-end', zIndex: 100 }}>
            <div style={{ background: T.surface, borderRadius: '16px 16px 0 0', padding: '24px 20px 44px', width: '100%', boxSizing: 'border-box', maxHeight: '88vh', overflowY: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <span style={{ color: T.text, fontSize: 17, fontWeight: 700 }}>Nouveau patient — {slotIcon(slot?.icon)} Ch.{lbl}</span>
                <button onClick={() => setAddBed(null)} style={{ background: 'none', border: 'none', color: T.muted, fontSize: 26, cursor: 'pointer', lineHeight: 1 }}>×</button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ display: 'flex', gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ ...s.label, color: T.muted, marginBottom: 6 }}>INITIALES</div>
                    <input value={addForm.initials} onChange={e => setAddForm(f => ({ ...f, initials: e.target.value }))} placeholder="Ex : M.D" maxLength={5} style={{ ...s.input, width: '100%', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <div style={{ ...s.label, color: T.muted, marginBottom: 6 }}>SEXE</div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      {['M', 'F'].map(g => (
                        <button key={g} onClick={() => setAddForm(f => ({ ...f, gender: g }))} style={{ background: addForm.gender === g ? C + '33' : T.bg, border: `1px solid ${addForm.gender === g ? C : T.border}`, borderRadius: 8, color: addForm.gender === g ? C : T.muted, fontWeight: 700, fontSize: 15, width: 44, height: 44, cursor: 'pointer' }}>{g}</button>
                      ))}
                    </div>
                  </div>
                </div>
                <div>
                  <div style={{ ...s.label, color: T.muted, marginBottom: 6 }}>ÂGE</div>
                  <input type="number" value={addForm.age} onChange={e => setAddForm(f => ({ ...f, age: e.target.value }))} inputMode="numeric" placeholder="Âge" style={{ ...s.input, width: 100, boxSizing: 'border-box' }} />
                </div>
                <div>
                  <div style={{ ...s.label, color: T.muted, marginBottom: 6 }}>MOTIF</div>
                  <input value={addForm.reason} onChange={e => setAddForm(f => ({ ...f, reason: e.target.value }))} placeholder="Ex : PTG Gche J25…" style={{ ...s.input, width: '100%', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <div style={{ ...s.label, color: T.muted, marginBottom: 6 }}>ATCD</div>
                  <input value={addForm.atcd} onChange={e => setAddForm(f => ({ ...f, atcd: e.target.value }))} placeholder="Ex : HTA, diabète…" style={{ ...s.input, width: '100%', boxSizing: 'border-box' }} />
                </div>
                <button onClick={handleAddPatient} disabled={!addForm.initials.trim() || !addForm.age || saving}
                  style={{ ...s.btn(C), width: '100%', padding: '14px', fontSize: 15, fontWeight: 700, opacity: (addForm.initials.trim() && addForm.age && !saving) ? 1 : 0.4 }}>
                  {saving ? 'Enregistrement…' : 'Ajouter le patient'}
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {showBedsCfg  && <BedsConfigModal    service={service}  onSave={handleBedsSave}  onClose={() => setShowBedsCfg(false)} />}
      {showPinExport && <PinExportModal     onConfirm={() => setShowExpWarn(true)}       onClose={() => setShowPinExport(false)} />}
      {showExpWarn  && <ExportWarningModal  serviceName={service.name} onConfirm={() => { doExport(); setShowExpWarn(false); }} onClose={() => setShowExpWarn(false)} />}
    </div>
  );
}

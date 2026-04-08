/**
 * ServiceView.jsx — Aide-Mémoire
 * Vue d'un service : liste des lits, résumé patient, ajout/sortie, export
 */

import { useState, useEffect, useCallback } from 'react';
import { T, s } from '../../theme.js';
import { secureGet, secureSet } from './crypto.js';
import { getSpecialty } from './templates.js';
import { todayStr, genId, isFlagActive, activeFlagsEmoji } from './utils.jsx';

export default function ServiceView({ service, cryptoKey, accentColor, onSelectPatient, onQuickEntry, onBack, refreshKey }) {
  const C  = accentColor;
  const sp = getSpecialty(service.specialty);

  const [patients,      setPatients]      = useState([]);
  const [dailyData,     setDailyData]     = useState({});
  const [loading,       setLoading]       = useState(true);
  const [addBed,        setAddBed]        = useState(null);
  const [addForm,       setAddForm]       = useState({ initials: '', age: '', gender: 'M', reason: '', atcd: '' });
  const [saving,        setSaving]        = useState(false);
  const [confirmReset,  setConfirmReset]  = useState(false);

  const today = todayStr();

  // ─── Chargement ─────────────────────────────────────────────────────────

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [pts, daily] = await Promise.all([
        secureGet(`patients_${service.id}`, cryptoKey),
        secureGet(`daily_${service.id}_${today}`, cryptoKey),
      ]);
      setPatients(pts || []);
      setDailyData(daily || {});
    } finally {
      setLoading(false);
    }
  }, [service.id, cryptoKey, today]);

  useEffect(() => { loadData(); }, [loadData, refreshKey]);

  // ─── Persistance ─────────────────────────────────────────────────────────

  async function savePatients(next) {
    setPatients(next);
    await secureSet(`patients_${service.id}`, next, cryptoKey);
  }

  async function saveDailyData(next) {
    setDailyData(next);
    await secureSet(`daily_${service.id}_${today}`, next, cryptoKey);
  }

  // ─── Ajouter un patient ──────────────────────────────────────────────────

  async function handleAddPatient() {
    if (!addForm.initials.trim() || !addForm.age) return;
    setSaving(true);
    try {
      const newPatient = {
        id:            genId(),
        serviceId:     service.id,
        bedNumber:     addBed,
        initials:      addForm.initials.trim().toUpperCase(),
        age:           Number(addForm.age),
        gender:        addForm.gender,
        admissionReason: addForm.reason.trim(),
        atcd:          addForm.atcd.trim(),
        fieldValues:   {},  // persistent field values
        present:       true,
        admittedAt:    Date.now(),
      };
      await savePatients([...patients, newPatient]);
      setAddBed(null);
      setAddForm({ initials: '', age: '', gender: 'M', reason: '', atcd: '' });
    } finally {
      setSaving(false);
    }
  }

  // ─── Reset journalier ─────────────────────────────────────────────────────

  async function handleDailyReset() {
    await saveDailyData({});
    setConfirmReset(false);
  }

  // ─── Export texte ─────────────────────────────────────────────────────────

  function handleExport() {
    const present = patients.filter(p => p.present);
    const lines   = [
      `AIDE-MÉMOIRE — ${service.name}`,
      new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' }),
      '─'.repeat(42),
    ];

    for (let bed = 1; bed <= service.bedCount; bed++) {
      const patient = present.find(p => p.bedNumber === bed);
      if (!patient) { lines.push(`Lit ${String(bed).padStart(3, ' ')} : Libre`); continue; }

      const daily = dailyData[patient.id] || {};
      const flags = service.fields
        .filter(f => f.category === 'flag')
        .filter(f => isFlagActive(f, f.persistent ? patient.fieldValues[f.id] : daily.fieldValues?.[f.id]))
        .map(f => f.label).join(' · ');

      lines.push(`Lit ${String(bed).padStart(3, ' ')} : ${patient.initials} ${patient.gender} ${patient.age}a${flags ? '  [' + flags + ']' : ''}`);
      if (patient.admissionReason) lines.push(`          ${patient.admissionReason}`);

      // Key field values
      service.fields
        .filter(f => f.category === 'observation')
        .forEach(f => {
          const v = f.persistent ? patient.fieldValues[f.id] : daily.fieldValues?.[f.id];
          if (v && v !== false && v !== '') lines.push(`          ${f.label}: ${v}`);
        });

      if (daily.observations) lines.push(`          Obs: ${daily.observations}`);
      lines.push('');
    }

    const text = lines.join('\n');
    if (navigator.share) {
      navigator.share({ title: `Aide-Mémoire ${service.name}`, text }).catch(() => {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => alert('📋 Copié dans le presse-papiers'));
    }
  }

  // ─── Affichage ───────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div style={{ background: T.bg, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ color: T.muted, fontSize: 14 }}>Chargement…</span>
      </div>
    );
  }

  const presentPatients = patients.filter(p => p.present);
  const beds = Array.from({ length: service.bedCount }, (_, i) => ({
    num:     i + 1,
    patient: presentPatients.find(p => p.bedNumber === i + 1) || null,
  }));

  return (
    <div style={{ background: T.bg, minHeight: '100vh', boxSizing: 'border-box' }}>

      {/* ── Header fixe ── */}
      <div style={{ padding: '16px 16px 0', background: T.bg, position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <button onClick={onBack} style={{ background: 'none', border: 'none', color: T.muted, fontSize: 22, cursor: 'pointer', padding: 4 }}>←</button>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ color: T.text, fontSize: 17, fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{service.name}</div>
            <div style={{ color: T.muted, fontSize: 12 }}>
              {sp.label} · {presentPatients.length}/{service.bedCount} lits
            </div>
          </div>
          <button onClick={onQuickEntry} title="Saisie rapide"
            style={{ background: C + '22', border: `1px solid ${C}44`, borderRadius: 8, color: C, fontSize: 18, padding: '6px 10px', cursor: 'pointer' }}>⚡</button>
          <button onClick={handleExport} title="Exporter"
            style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 8, color: T.muted, fontSize: 18, padding: '6px 10px', cursor: 'pointer' }}>⬆</button>
        </div>

        {/* Date + Reset journalier */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 12, borderBottom: `1px solid ${T.border}`, marginBottom: 4 }}>
          <span style={{ color: T.muted, fontSize: 12 }}>
            📅 {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: '2-digit', month: 'long' })}
          </span>
          {!confirmReset ? (
            <button onClick={() => setConfirmReset(true)}
              style={{ background: 'none', border: 'none', color: T.muted, fontSize: 12, cursor: 'pointer', padding: '2px 0' }}>
              🔄 Reset journalier
            </button>
          ) : (
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <button onClick={() => setConfirmReset(false)}
                style={{ background: 'none', border: 'none', color: T.muted, fontSize: 12, cursor: 'pointer' }}>Annuler</button>
              <button onClick={handleDailyReset}
                style={{ background: '#f43f5e22', border: '1px solid #f43f5e44', borderRadius: 6, color: '#f43f5e', fontSize: 12, padding: '3px 8px', cursor: 'pointer' }}>
                Confirmer
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Liste des lits ── */}
      <div style={{ padding: '8px 16px 60px' }}>
        {beds.map(({ num, patient }) => {

          // ── Lit libre ──
          if (!patient) {
            return (
              <div key={num} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '9px 12px', marginBottom: 6,
                background: T.surface, border: `1px solid ${T.border}`,
                borderRadius: 10, opacity: 0.55,
              }}>
                <span style={{ color: T.muted, fontSize: 13, minWidth: 52, fontWeight: 600 }}>🛏 {num}</span>
                <span style={{ color: T.muted, fontSize: 13, flex: 1 }}>Libre</span>
                <button onClick={() => setAddBed(num)}
                  style={{ background: C + '22', border: `1px solid ${C}44`, borderRadius: 6, color: C, fontSize: 18, width: 30, height: 30, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>+</button>
              </div>
            );
          }

          // ── Lit occupé ──
          const daily     = dailyData[patient.id] || {};
          const flagEmoji = activeFlagsEmoji(service.fields, patient.fieldValues, daily.fieldValues);

          // 2 champs clés persistants
          const keyFields = service.fields
            .filter(f => f.category === 'observation' && f.persistent)
            .slice(0, 2);

          return (
            <div key={num} onClick={() => onSelectPatient(patient.id)}
              style={{
                padding: '11px 14px', marginBottom: 6,
                background: T.surface,
                border: `1px solid ${T.border}`,
                borderLeft: `3px solid ${sp.color}`,
                borderRadius: 10,
                cursor: 'pointer',
                WebkitTapHighlightColor: 'transparent',
              }}>
              {/* Ligne 1 : numéro + initiales + sexe/âge + flags */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ color: T.muted, fontSize: 12, minWidth: 46, fontWeight: 600 }}>🛏 {num}</span>
                <span style={{ color: T.text, fontSize: 15, fontWeight: 700 }}>{patient.initials}</span>
                <span style={{ color: T.muted, fontSize: 12 }}>{patient.gender} {patient.age}a</span>
                {flagEmoji.length > 0 && (
                  <div style={{ marginLeft: 'auto', display: 'flex', gap: 3, flexShrink: 0 }}>
                    {flagEmoji.map((e, i) => <span key={i} style={{ fontSize: 15 }}>{e}</span>)}
                  </div>
                )}
              </div>

              {/* Ligne 2 : motif abrégé */}
              {patient.admissionReason ? (
                <div style={{ color: T.muted, fontSize: 12, marginTop: 3, marginLeft: 54 }}>
                  {patient.admissionReason.length > 55
                    ? patient.admissionReason.slice(0, 55) + '…'
                    : patient.admissionReason}
                </div>
              ) : null}

              {/* Ligne 3 : valeurs clés */}
              {keyFields.some(f => patient.fieldValues[f.id]) && (
                <div style={{ display: 'flex', gap: 6, marginTop: 4, marginLeft: 54, flexWrap: 'wrap' }}>
                  {keyFields.map(f => {
                    const v = patient.fieldValues[f.id];
                    if (!v && v !== true) return null;
                    return (
                      <span key={f.id} style={{ color: C, fontSize: 11, background: C + '11', borderRadius: 4, padding: '1px 6px' }}>
                        {f.label}: {String(v)}
                      </span>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Modal ajout patient (bottom sheet) ── */}
      {addBed !== null && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.72)', display: 'flex', alignItems: 'flex-end', zIndex: 100 }}>
          <div style={{ background: T.surface, borderRadius: '16px 16px 0 0', padding: '24px 20px 44px', width: '100%', boxSizing: 'border-box', maxHeight: '88vh', overflowY: 'auto' }}>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <span style={{ color: T.text, fontSize: 17, fontWeight: 700 }}>Nouveau patient — Lit {addBed}</span>
              <button onClick={() => setAddBed(null)} style={{ background: 'none', border: 'none', color: T.muted, fontSize: 26, cursor: 'pointer', lineHeight: 1 }}>×</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

              {/* Initiales + Sexe */}
              <div style={{ display: 'flex', gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ ...s.label, color: T.muted, marginBottom: 6 }}>INITIALES</div>
                  <input value={addForm.initials}
                    onChange={e => setAddForm(f => ({ ...f, initials: e.target.value }))}
                    placeholder="Ex : M.D" maxLength={5}
                    style={{ ...s.input, width: '100%', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <div style={{ ...s.label, color: T.muted, marginBottom: 6 }}>SEXE</div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {['M', 'F'].map(g => (
                      <button key={g} onClick={() => setAddForm(f => ({ ...f, gender: g }))} style={{
                        background:   addForm.gender === g ? C + '33' : T.bg,
                        border:       `1px solid ${addForm.gender === g ? C : T.border}`,
                        borderRadius: 8, color: addForm.gender === g ? C : T.muted,
                        fontWeight: 700, fontSize: 15, width: 44, height: 44, cursor: 'pointer',
                      }}>{g}</button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Âge */}
              <div>
                <div style={{ ...s.label, color: T.muted, marginBottom: 6 }}>ÂGE</div>
                <input type="number" value={addForm.age}
                  onChange={e => setAddForm(f => ({ ...f, age: e.target.value }))}
                  inputMode="numeric" placeholder="Âge"
                  style={{ ...s.input, width: 100, boxSizing: 'border-box' }} />
              </div>

              {/* Motif */}
              <div>
                <div style={{ ...s.label, color: T.muted, marginBottom: 6 }}>MOTIF D'HOSPITALISATION</div>
                <input value={addForm.reason}
                  onChange={e => setAddForm(f => ({ ...f, reason: e.target.value }))}
                  placeholder="Ex : PTG Gche, opéré le 19/02 J25…"
                  style={{ ...s.input, width: '100%', boxSizing: 'border-box' }} />
              </div>

              {/* ATCD */}
              <div>
                <div style={{ ...s.label, color: T.muted, marginBottom: 6 }}>ATCD / PARTICULARITÉS</div>
                <input value={addForm.atcd}
                  onChange={e => setAddForm(f => ({ ...f, atcd: e.target.value }))}
                  placeholder="Ex : HTA, diabète type 2…"
                  style={{ ...s.input, width: '100%', boxSizing: 'border-box' }} />
              </div>

              <button onClick={handleAddPatient} disabled={!addForm.initials.trim() || !addForm.age || saving}
                style={{ ...s.btn(C), width: '100%', padding: '14px', fontSize: 15, fontWeight: 700, marginTop: 4, opacity: (addForm.initials.trim() && addForm.age && !saving) ? 1 : 0.4 }}>
                {saving ? 'Enregistrement…' : 'Ajouter le patient'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

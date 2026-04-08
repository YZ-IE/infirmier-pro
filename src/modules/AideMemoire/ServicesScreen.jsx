/**
 * ServicesScreen.jsx — Aide-Mémoire
 * Liste des services + création d'un nouveau service
 */

import { useState, useEffect } from 'react';
import { T, s } from '../../theme.js';
import { secureGet, secureSet } from './crypto.js';
import { SPECIALTIES, getTemplateFields, getSpecialty } from './templates.js';
import { formatDateFR } from './utils.jsx';

export default function ServicesScreen({ cryptoKey, accentColor, onBack, onSelectService }) {
  const C = accentColor;

  const [services, setServices] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [view,     setView]     = useState('list'); // 'list' | 'create'
  const [form,     setForm]     = useState({ name: '', specialty: 'traumato', bedCount: 20 });
  const [saving,   setSaving]   = useState(false);

  useEffect(() => {
    secureGet('services', cryptoKey)
      .then(data => setServices(data || []))
      .finally(() => setLoading(false));
  }, []);

  async function persistServices(next) {
    setServices(next);
    await secureSet('services', next, cryptoKey);
  }

  async function handleCreate() {
    const name = form.name.trim();
    if (!name) return;
    setSaving(true);
    try {
      const newService = {
        id:        Date.now().toString(),
        name,
        specialty: form.specialty,
        bedCount:  Number(form.bedCount),
        fields:    getTemplateFields(form.specialty),
        createdAt: Date.now(),
      };
      await persistServices([...services, newService]);
      setForm({ name: '', specialty: 'traumato', bedCount: 20 });
      setView('list');
    } finally {
      setSaving(false);
    }
  }

  // ─── Chargement ─────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div style={{ background: T.bg, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ color: T.muted, fontSize: 14 }}>Chargement…</span>
      </div>
    );
  }

  // ─── Formulaire création ─────────────────────────────────────────────────

  if (view === 'create') {
    const sp           = getSpecialty(form.specialty);
    const previewFields = getTemplateFields(form.specialty);

    return (
      <div style={{ background: T.bg, minHeight: '100vh', padding: '20px 20px 50px', boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
          <button onClick={() => setView('list')} style={{ background: 'none', border: 'none', color: T.muted, fontSize: 22, cursor: 'pointer', padding: 4 }}>←</button>
          <span style={{ color: T.text, fontSize: 18, fontWeight: 700 }}>Nouveau service</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Nom */}
          <div>
            <div style={{ ...s.label, color: T.muted, marginBottom: 8 }}>NOM DU SERVICE</div>
            <input
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="Ex : Traumatologie A"
              maxLength={40}
              style={{ ...s.input, width: '100%', boxSizing: 'border-box' }}
            />
          </div>

          {/* Spécialité */}
          <div>
            <div style={{ ...s.label, color: T.muted, marginBottom: 10 }}>SPÉCIALITÉ</div>
            {SPECIALTIES.map(item => {
              const active = form.specialty === item.id;
              return (
                <button key={item.id} onClick={() => setForm(f => ({ ...f, specialty: item.id }))} style={{
                  display: 'block', width: '100%', marginBottom: 8,
                  background:   active ? item.color + '22' : T.surface,
                  border:       `1px solid ${active ? item.color : T.border}`,
                  borderRadius: 10,
                  color:        active ? item.color : T.text,
                  padding:      '12px 16px', textAlign: 'left',
                  fontSize: 15, fontWeight: active ? 700 : 400,
                  cursor: 'pointer', transition: 'all 0.15s',
                  WebkitTapHighlightColor: 'transparent',
                }}>{item.label}</button>
              );
            })}
          </div>

          {/* Nombre de lits */}
          <div>
            <div style={{ ...s.label, color: T.muted, marginBottom: 10 }}>NOMBRE DE LITS</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              <button onClick={() => setForm(f => ({ ...f, bedCount: Math.max(1, f.bedCount - 1) }))}
                style={{ ...s.btn(C), width: 48, height: 48, fontSize: 24, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
              <span style={{ color: T.text, fontSize: 26, fontWeight: 700, minWidth: 50, textAlign: 'center' }}>{form.bedCount}</span>
              <button onClick={() => setForm(f => ({ ...f, bedCount: Math.min(60, f.bedCount + 1) }))}
                style={{ ...s.btn(C), width: 48, height: 48, fontSize: 24, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
            </div>
          </div>

          {/* Aperçu champs */}
          <div style={{ ...s.card, padding: 14 }}>
            <div style={{ ...s.label, color: T.muted, marginBottom: 10 }}>CHAMPS PRÉ-CONFIGURÉS ({previewFields.length})</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {previewFields.map(f => (
                <span key={f.id} style={{ background: sp.color + '1a', border: `1px solid ${sp.color}44`, borderRadius: 6, color: sp.color, fontSize: 12, padding: '3px 8px' }}>
                  {f.label}
                </span>
              ))}
            </div>
            <div style={{ color: T.muted, fontSize: 12, marginTop: 8 }}>Personnalisable après création</div>
          </div>

          <button onClick={handleCreate} disabled={!form.name.trim() || saving}
            style={{ ...s.btn(C), width: '100%', padding: '15px', fontSize: 16, fontWeight: 700, marginTop: 4, opacity: form.name.trim() && !saving ? 1 : 0.4 }}>
            {saving ? 'Enregistrement…' : 'Créer le service'}
          </button>
        </div>
      </div>
    );
  }

  // ─── Liste des services ──────────────────────────────────────────────────

  return (
    <div style={{ background: T.bg, minHeight: '100vh', padding: '20px 20px 50px', boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={onBack} style={{ background: 'none', border: 'none', color: T.muted, fontSize: 22, cursor: 'pointer', padding: 4 }}>←</button>
          <div>
            <div style={{ color: T.text, fontSize: 18, fontWeight: 700 }}>Aide-Mémoire</div>
            <div style={{ color: T.muted, fontSize: 11 }}>🔒 Données chiffrées · Secret professionnel</div>
          </div>
        </div>
        <button onClick={() => setView('create')}
          style={{ ...s.btn(C), width: 40, height: 40, padding: 0, fontSize: 22, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
      </div>

      {/* Date */}
      <div style={{ ...s.card, padding: '10px 14px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 16 }}>📅</span>
        <span style={{ color: T.text, fontSize: 14, fontWeight: 600 }}>
          {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}
        </span>
      </div>

      {services.length === 0 ? (
        <div style={{ textAlign: 'center', marginTop: 80 }}>
          <div style={{ fontSize: 52, marginBottom: 16 }}>🏥</div>
          <div style={{ color: T.text, fontSize: 16, fontWeight: 600, marginBottom: 8 }}>Aucun service configuré</div>
          <div style={{ color: T.muted, fontSize: 14 }}>Appuyez sur + pour commencer</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {services.map(service => {
            const sp = getSpecialty(service.specialty);
            return (
              <div key={service.id} onClick={() => onSelectService(service)}
                style={{
                  background: T.surface, border: `1px solid ${T.border}`,
                  borderLeft: `3px solid ${sp.color}`,
                  borderRadius: 12, padding: '14px 16px',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14,
                  WebkitTapHighlightColor: 'transparent',
                }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 10,
                  background: sp.color + '22', border: `1px solid ${sp.color}44`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 22, flexShrink: 0,
                }}>{sp.label.split(' ')[0]}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ color: T.text, fontSize: 16, fontWeight: 700, marginBottom: 2 }}>{service.name}</div>
                  <div style={{ color: T.muted, fontSize: 13 }}>
                    {sp.label.slice(sp.label.indexOf(' ') + 1)} · {service.bedCount} lits
                  </div>
                  <div style={{ color: T.muted, fontSize: 11, marginTop: 2 }}>Depuis le {formatDateFR(service.createdAt)}</div>
                </div>
                <span style={{ color: T.muted, fontSize: 20, flexShrink: 0 }}>›</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

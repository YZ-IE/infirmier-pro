import { useState, useRef, useEffect } from 'react';
import { T, s } from '../../theme.js';
const C = T.ia;

const API_KEY_STORAGE = 'claude_api_key_v1';

const SUGGESTIONS = [
  'Comment calculer un débit de perfusion ?',
  'Expliquez le mécanisme du sepsis',
  'Quels sont les signes d\'hypokaliémie ?',
  'Comment reconnaître un OAP ?',
  'Différence entre tachycardie sinusale et FA ?',
  'Comment préparer une seringue de morphine ?',
  'Quand appeler le médecin en urgence ?',
  'Expliquez la règle des 5B',
];

async function askClaude(messages, apiKey) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      system: `Tu es un expert en soins infirmiers de soins généraux. Tu aides des infirmier(e)s à approfondir leurs connaissances cliniques. Tes réponses sont pratiques, pédagogiques et orientées terrain. Tu utilises les termes médicaux français appropriés. Réponds toujours en français. Sois concis mais complet. Mets en avant les points critiques de sécurité patient.`,
      messages,
    }),
  });
  const d = await res.json();
  if (d.error) throw new Error(d.error.message);
  return d.content?.find(b => b.type === 'text')?.text || 'Erreur de réponse.';
}

function ConfigScreen({ onSave }) {
  const [key, setKey] = useState('');
  const [step, setStep] = useState('form'); // 'form' | 'tuto'

  if (step === 'tuto') return (
    <div style={{ padding: '14px' }}>
      <button onClick={() => setStep('form')} style={{ ...s.btn(C), marginBottom: 14 }}>← Retour</button>
      <div style={{ ...s.card, background: '#1e1b4b' }}>
        <div style={{ color: C, fontWeight: 700, fontSize: 15, marginBottom: 12 }}>📖 Comment obtenir une clé API Claude</div>

        {[
          { num: '1', titre: 'Créer un compte Anthropic', desc: 'Aller sur console.anthropic.com → Cliquer sur "Sign Up" → Créer un compte avec votre email' },
          { num: '2', titre: 'Accéder aux clés API', desc: 'Dans le menu de gauche → "API Keys" → Cliquer sur "Create Key"' },
          { num: '3', titre: 'Nommer et créer la clé', desc: 'Donner un nom (ex: "Infirmier Pro") → Cliquer "Create Key" → Copier la clé affichée (commence par "sk-ant-...")' },
          { num: '4', titre: 'Ajouter des crédits', desc: 'Menu "Billing" → Ajouter une carte bancaire → Acheter des crédits (5$ suffisent pour des milliers de questions)' },
          { num: '5', titre: 'Coller la clé dans l\'appli', desc: 'Revenir ici → Coller votre clé dans le champ → Sauvegarder' },
        ].map(({ num, titre, desc }) => (
          <div key={num} style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: C + '33', border: `1px solid ${C}`, color: C, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13, flexShrink: 0 }}>{num}</div>
            <div>
              <div style={{ color: C, fontWeight: 700, fontSize: 13, marginBottom: 4 }}>{titre}</div>
              <div style={{ color: T.muted, fontSize: 12, lineHeight: 1.6 }}>{desc}</div>
            </div>
          </div>
        ))}

        <div style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 8, padding: '10px 14px', marginTop: 8 }}>
          <div style={{ color: '#64748b', fontSize: 11, lineHeight: 1.6 }}>
            🔒 Votre clé est stockée uniquement sur cet appareil (localStorage). Elle n'est jamais envoyée ailleurs qu'à Anthropic directement. Anthropic facture à l'usage (~0,003$ par question).
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ padding: '14px' }}>
      <div style={{ ...s.card, background: '#1e1b4b' }}>
        <div style={{ color: C, fontWeight: 700, fontSize: 15, marginBottom: 8 }}>🤖 Assistant IA Clinique</div>
        <div style={{ color: T.muted, fontSize: 13, lineHeight: 1.6 }}>
          Posez vos questions cliniques à Claude (IA d'Anthropic). Nécessite une clé API personnelle.
        </div>
      </div>

      <div style={s.card}>
        <label style={s.label}>CLEF API CLAUDE (sk-ant-...)</label>
        <input
          value={key}
          onChange={e => setKey(e.target.value)}
          placeholder="sk-ant-api03-..."
          type="password"
          style={{ ...s.input, marginBottom: 12 }}
        />
        <button onClick={() => { if (key.trim()) { localStorage.setItem(API_KEY_STORAGE, key.trim()); onSave(key.trim()); } }}
          disabled={!key.trim()}
          style={{ ...s.btn(C), width: '100%', padding: '12px', opacity: key.trim() ? 1 : 0.4 }}>
          SAUVEGARDER ET DÉMARRER
        </button>
      </div>

      <button onClick={() => setStep('tuto')} style={{ ...s.btn('#64748b'), width: '100%', padding: '12px' }}>
        📖 Comment obtenir une clé API ?
      </button>

      <div style={{ ...s.card, marginTop: 8, background: '#1e1b4b' }}>
        <div style={{ color: '#64748b', fontSize: 11, lineHeight: 1.6 }}>
          🔒 Clé stockée localement sur cet appareil uniquement · Jamais transmise à un tiers · Seul Anthropic la reçoit lors de chaque question
        </div>
      </div>
    </div>
  );
}

export default function AssistantIA() {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem(API_KEY_STORAGE) || '');
  const [messages, setMessages] = useState([{ role: 'assistant', text: 'Bonjour ! Je suis votre assistant clinique. Posez-moi vos questions sur les soins infirmiers : pharmacologie, procédures, scores, urgences… Je suis là pour vous aider à mieux soigner.' }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, loading]);

  if (!apiKey || showConfig) return (
    <ConfigScreen onSave={(k) => { setApiKey(k); setShowConfig(false); }} />
  );

  const send = async (text) => {
    if (!text.trim() || loading) return;
    const userMsg = { role: 'user', text };
    const newMsgs = [...messages, userMsg];
    setMessages(newMsgs); setInput(''); setLoading(true);
    try {
      const history = newMsgs.map(m => ({ role: m.role === 'assistant' ? 'assistant' : 'user', content: m.text }));
      const reply = await askClaude(history, apiKey);
      setMessages(p => [...p, { role: 'assistant', text: reply }]);
    } catch (e) {
      const msg = e.message?.includes('401') ? 'Clé API invalide ou expirée. Vérifiez votre clé dans les paramètres.' : 'Erreur de connexion. Vérifiez votre accès internet.';
      setMessages(p => [...p, { role: 'assistant', text: msg }]);
    }
    setLoading(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)', padding: '14px', paddingBottom: 0 }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
        <button onClick={() => setShowConfig(true)} style={{ ...s.btn('#64748b'), padding: '4px 10px', fontSize: 11 }}>⚙️ Clé API</button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10, paddingBottom: 12 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
            <div style={{ maxWidth: '86%', padding: '10px 14px', borderRadius: 12, background: m.role === 'user' ? T.iaDim : T.surface, border: `1px solid ${m.role === 'user' ? C + '44' : T.border}`, color: T.text, fontSize: 13.5, lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
              {m.role === 'assistant' && <div style={{ color: C, fontFamily: 'monospace', fontSize: 10, letterSpacing: 2, marginBottom: 5 }}>◈ ASSISTANT CLINIQUE</div>}
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: 'flex' }}>
            <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, padding: '10px 14px' }}>
              <span style={{ color: C, fontFamily: 'monospace', fontSize: 12 }}>◈ Analyse<span style={{ animation: 'blink 1s infinite' }}> ...</span></span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {messages.length === 1 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
          {SUGGESTIONS.map((sg, i) => (
            <button key={i} onClick={() => send(sg)} style={{ background: T.surface, border: `1px solid ${T.border}`, color: T.muted, borderRadius: 20, padding: '5px 11px', fontSize: 11, fontFamily: 'monospace', cursor: 'pointer' }}>{sg}</button>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', gap: 8, paddingBottom: 14 }}>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send(input)} placeholder="Posez votre question clinique..." style={{ ...s.input, flex: 1 }} />
        <button onClick={() => send(input)} disabled={!input.trim() || loading} style={{ ...s.btn(C), padding: '10px 16px', opacity: !input.trim() || loading ? 0.4 : 1 }}>↑</button>
      </div>
    </div>
  );
}

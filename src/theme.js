export const T = {
  bg: '#0f172a',
  surface: '#1e293b',
  surface2: '#334155',
  border: '#334155',
  border2: '#475569',
  text: '#f1f5f9',
  muted: '#94a3b8',
  // modules
  iatr: '#ef4444',    iatrDim: '#450a0a',
  urg:  '#f97316',    urgDim:  '#431407',
  score:'#8b5cf6',    scoreDim:'#2e1065',
  soins:'#06b6d4',    soinsDim:'#0c3a4a',
  orga: '#10b981',    orgaDim: '#052e16',
  form: '#f59e0b',    formDim: '#451a03',
  ia:   '#6366f1',    iaDim:   '#1e1b4b',
};
export const s = {
  card: { background: '#1e293b', border: '1px solid #334155', borderRadius: 10, padding: '14px 16px', marginBottom: 10 },
  input: { background: '#0f172a', border: '1px solid #334155', borderRadius: 8, padding: '10px 13px', color: '#f1f5f9', fontSize: 14, width: '100%', outline: 'none', fontFamily: 'system-ui' },
  btn: (color) => ({ background: color+'22', border: `1px solid ${color}`, color, borderRadius: 8, padding: '10px 16px', cursor: 'pointer', fontFamily: 'system-ui', fontSize: 13, fontWeight: 600 }),
  label: { color: '#94a3b8', fontSize: 12, fontFamily: 'monospace', letterSpacing: 1, marginBottom: 6, display: 'block' },
  result: (color) => ({ background: color+'18', border: `1px solid ${color}44`, borderRadius: 8, padding: '12px 16px', marginTop: 12 }),
  tag: (color) => ({ background: color+'22', border: `1px solid ${color}44`, color, padding: '3px 10px', borderRadius: 20, fontSize: 11, fontFamily: 'monospace' }),
};

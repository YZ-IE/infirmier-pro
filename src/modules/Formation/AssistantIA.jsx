import { useState, useRef, useEffect } from 'react';
import { T, s } from '../../theme.js';
const C = T.form;
const SUGGESTIONS = [
  'Comment calculer un débit de perfusion ?','Expliquez le mécanisme du sepsis','Quels sont les signes d\'hypokaliémie ?',
  'Comment reconnaître un OAP ?','Différence entre tachycardie sinusale et FA ?','Comment préparer une seringue de morphine ?',
  'Quand appeler le médecin en urgence ?','Expliquez la règle des 5B',
];
async function askClaude(messages) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'anthropic-dangerous-direct-browser-access': 'true' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514', max_tokens: 1000,
      system: `Tu es un expert en soins infirmiers de soins généraux. Tu aides des infirmier(e)s à approfondir leurs connaissances cliniques. Tes réponses sont pratiques, pédagogiques et orientées terrain. Tu utilises les termes médicaux français appropriés. Réponds toujours en français. Sois concis mais complet. Mets en avant les points critiques de sécurité patient.`,
      messages
    })
  });
  const d = await res.json();
  return d.content?.find(b=>b.type==='text')?.text || 'Erreur de réponse.';
}
export default function AssistantIA() {
  const [messages,setMessages]=useState([{role:'assistant',text:'Bonjour ! Je suis votre assistant clinique. Posez-moi vos questions sur les soins infirmiers : pharmacologie, procédures, scores, urgences, organisation… Je suis là pour vous aider à mieux soigner.'}]);
  const [input,setInput]=useState('');
  const [loading,setLoading]=useState(false);
  const bottomRef=useRef(null);
  useEffect(()=>{bottomRef.current?.scrollIntoView({behavior:'smooth'});},[messages,loading]);
  const send=async(text)=>{
    if(!text.trim()||loading) return;
    const userMsg={role:'user',text};
    const newMsgs=[...messages,userMsg];
    setMessages(newMsgs);setInput('');setLoading(true);
    try {
      const history=newMsgs.map(m=>({role:m.role==='assistant'?'assistant':'user',content:m.text}));
      const reply=await askClaude(history);
      setMessages(p=>[...p,{role:'assistant',text:reply}]);
    } catch {
      setMessages(p=>[...p,{role:'assistant',text:"Erreur de connexion. Vérifiez votre accès internet et votre clé API."}]);
    }
    setLoading(false);
  };
  return (
    <div style={{display:'flex',flexDirection:'column',height:'calc(100vh - 120px)',padding:'14px',paddingBottom:0}}>
      <div style={{flex:1,overflowY:'auto',display:'flex',flexDirection:'column',gap:10,paddingBottom:12}}>
        {messages.map((m,i)=>(
          <div key={i} style={{display:'flex',justifyContent:m.role==='user'?'flex-end':'flex-start'}}>
            <div style={{maxWidth:'86%',padding:'10px 14px',borderRadius:12,background:m.role==='user'?T.formDim:T.surface,border:`1px solid ${m.role==='user'?C+'44':T.border}`,color:T.text,fontSize:13.5,lineHeight:1.7,whiteSpace:'pre-wrap'}}>
              {m.role==='assistant'&&<div style={{color:C,fontFamily:'monospace',fontSize:10,letterSpacing:2,marginBottom:5}}>◈ ASSISTANT CLINIQUE</div>}
              {m.text}
            </div>
          </div>
        ))}
        {loading&&<div style={{display:'flex'}}><div style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:12,padding:'10px 14px'}}><span style={{color:C,fontFamily:'monospace',fontSize:12}}>◈ Analyse<span style={{animation:'blink 1s infinite'}}> ...</span></span></div></div>}
        <div ref={bottomRef}/>
      </div>
      {messages.length===1&&(
        <div style={{display:'flex',flexWrap:'wrap',gap:6,marginBottom:10}}>
          {SUGGESTIONS.map((sg,i)=>(
            <button key={i} onClick={()=>send(sg)} style={{background:T.surface,border:`1px solid ${T.border}`,color:T.muted,borderRadius:20,padding:'5px 11px',fontSize:11,fontFamily:'monospace',cursor:'pointer'}}>{sg}</button>
          ))}
        </div>
      )}
      <div style={{display:'flex',gap:8,paddingBottom:14}}>
        <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send(input)} placeholder="Posez votre question clinique..." style={{...s.input,flex:1}}/>
        <button onClick={()=>send(input)} disabled={!input.trim()||loading} style={{...s.btn(C),padding:'10px 16px',opacity:!input.trim()||loading?0.4:1}}>↑</button>
      </div>
    </div>
  );
}

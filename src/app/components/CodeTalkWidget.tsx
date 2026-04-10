// @ts-nocheck
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, MessageCircle } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

const DUMMY_MESSAGES = [
  { id:1, from:'system', text:'안녕하세요! CodeGame 채팅입니다. 개발자들과 자유롭게 대화해보세요 👋' },
];

export default function CodeTalkWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState(DUMMY_MESSAGES);
  const [input, setInput] = useState('');
  const { accentColor } = useTheme();
  const { user, profile } = useAuth();

  const send = () => {
    if (!input.trim()) return;
    setMessages(p => [...p, {
      id: Date.now(),
      from: 'me',
      text: input.trim(),
      nick: profile?.nickname || '나'
    }]);
    setInput('');
  };

  return (
    <div style={{ position:'fixed', bottom:24, right:24, zIndex:999 }}>
      {/* 채팅창 */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity:0, scale:0.85, y:20, originX:1, originY:1 }}
            animate={{ opacity:1, scale:1, y:0 }}
            exit={{ opacity:0, scale:0.85, y:20 }}
            transition={{ type:'spring', damping:22, stiffness:280 }}
            style={{
              position:'absolute', bottom:64, right:0,
              width:320, height:460, borderRadius:20,
              background:'linear-gradient(160deg, #0a0f1e 0%, #060914 100%)',
              border:`1px solid ${accentColor}25`,
              boxShadow:`0 24px 60px rgba(0,0,0,0.8), 0 0 0 1px ${accentColor}10`,
              display:'flex', flexDirection:'column', overflow:'hidden'
            }}>

            {/* 헤더 */}
            <div style={{ padding:'14px 16px', borderBottom:`1px solid rgba(255,255,255,0.07)`,
              display:'flex', alignItems:'center', justifyContent:'space-between',
              background:`linear-gradient(135deg, ${accentColor}12, transparent)` }}>
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <div style={{ width:32, height:32, borderRadius:'50%',
                  background:`linear-gradient(135deg, ${accentColor}, #00d4ff)`,
                  display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <MessageCircle style={{ width:16, height:16, color:'#000' }} />
                </div>
                <div>
                  <div style={{ fontSize:13, fontWeight:700, color:'rgba(255,255,255,0.9)',
                    fontFamily:'Sora,sans-serif' }}>CodeTalk</div>
                  <div style={{ fontSize:10, color:accentColor, fontFamily:'JetBrains Mono,monospace' }}>
                    ● 온라인
                  </div>
                </div>
              </div>
              <button onClick={() => setOpen(false)}
                style={{ background:'none', border:'none', cursor:'pointer',
                  color:'rgba(255,255,255,0.4)', padding:4 }}>
                <X style={{ width:18, height:18 }} />
              </button>
            </div>

            {/* 메시지 */}
            <div style={{ flex:1, overflowY:'auto', padding:'12px 14px',
              display:'flex', flexDirection:'column', gap:10 }}>
              {messages.map(msg => (
                <div key={msg.id}
                  style={{ display:'flex', flexDirection:'column',
                    alignItems: msg.from==='me' ? 'flex-end' : 'flex-start' }}>
                  {msg.from !== 'system' && msg.from !== 'me' && (
                    <div style={{ fontSize:9, color:'rgba(255,255,255,0.3)',
                      marginBottom:3, fontFamily:'JetBrains Mono,monospace' }}>
                      {msg.nick}
                    </div>
                  )}
                  <div style={{
                    maxWidth:'80%', padding:'8px 12px', borderRadius: msg.from==='me'
                      ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                    background: msg.from==='me'
                      ? `linear-gradient(135deg, ${accentColor}, #00d4ff)`
                      : msg.from==='system'
                      ? 'rgba(255,255,255,0.05)'
                      : 'rgba(255,255,255,0.08)',
                    color: msg.from==='me' ? '#000' : 'rgba(255,255,255,0.85)',
                    fontSize:12, fontFamily:'Sora,sans-serif', lineHeight:1.5
                  }}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* 입력 */}
            {user ? (
              <div style={{ padding:'10px 12px', borderTop:'1px solid rgba(255,255,255,0.07)',
                display:'flex', gap:8, alignItems:'center' }}>
                <input
                  value={input} onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key==='Enter' && send()}
                  placeholder="메시지 입력..."
                  style={{ flex:1, background:'rgba(255,255,255,0.06)',
                    border:'1px solid rgba(255,255,255,0.1)', borderRadius:10,
                    padding:'8px 12px', color:'rgba(255,255,255,0.9)',
                    fontSize:12, fontFamily:'Sora,sans-serif', outline:'none' }} />
                <button onClick={send}
                  style={{ width:34, height:34, borderRadius:10,
                    background:`linear-gradient(135deg,${accentColor},#00d4ff)`,
                    border:'none', cursor:'pointer', display:'flex',
                    alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <Send style={{ width:15, height:15, color:'#000' }} />
                </button>
              </div>
            ) : (
              <div style={{ padding:'12px 14px', borderTop:'1px solid rgba(255,255,255,0.07)',
                textAlign:'center', fontSize:11, color:'rgba(255,255,255,0.4)',
                fontFamily:'Sora,sans-serif' }}>
                채팅하려면 <a href="/codegame-main/login" style={{ color:accentColor }}>로그인</a>이 필요해요
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Talk 버튼 */}
      <motion.button
        onClick={() => setOpen(p => !p)}
        whileHover={{ scale:1.05 }}
        whileTap={{ scale:0.95 }}
        style={{
          width:52, height:52, borderRadius:'50%',
          background:`linear-gradient(135deg, ${accentColor}, #00d4ff)`,
          border:'none', cursor:'pointer',
          display:'flex', alignItems:'center', justifyContent:'center',
          boxShadow:`0 4px 20px ${accentColor}50`,
          position:'relative'
        }}>
        <AnimatePresence mode="wait">
          {open
            ? <motion.div key="x" initial={{rotate:-90,opacity:0}} animate={{rotate:0,opacity:1}} exit={{rotate:90,opacity:0}}>
                <X style={{ width:22, height:22, color:'#000' }} />
              </motion.div>
            : <motion.div key="msg" initial={{scale:0.8,opacity:0}} animate={{scale:1,opacity:1}} exit={{scale:0.8,opacity:0}}>
                <MessageCircle style={{ width:22, height:22, color:'#000' }} />
              </motion.div>
          }
        </AnimatePresence>
        {!open && (
          <motion.div
            animate={{ scale:[1,1.5,1], opacity:[0.6,0,0.6] }}
            transition={{ duration:2, repeat:Infinity }}
            style={{ position:'absolute', inset:-4, borderRadius:'50%',
              border:`2px solid ${accentColor}`, pointerEvents:'none' }} />
        )}
      </motion.button>
    </div>
  );
}

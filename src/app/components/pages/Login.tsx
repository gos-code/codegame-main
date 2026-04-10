// @ts-nocheck
import { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

const ACCENT_COLORS = [
  '#00f5c4','#00d4ff','#7c3aed','#ec4899',
  '#f59e0b','#10b981','#3b82f6','#ef4444','#8b5cf6','#06b6d4'
];
const BG_COLORS = [
  '#ffffff','#03040b','#0a0010','#000a0a',
  '#0a0500','#00000f','#0f0a00','#030010','#000a05','#050050'
];

export default function Login() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const { accentColor, setAccentColor, bgColor, setBgColor } = useTheme();
  const nav = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr(''); setLoading(true);
    try {
      if (isSignUp) {
        if (!nickname.trim()) { setErr('닉네임을 입력해주세요'); setLoading(false); return; }
        await register(email, password, nickname);
      } else {
        await login(email, password);
      }
      nav('/');
    } catch (e) {
      const msgs = {
        'auth/user-not-found': '등록되지 않은 이메일이에요',
        'auth/wrong-password': '비밀번호가 틀렸어요',
        'auth/email-already-in-use': '이미 사용 중인 이메일이에요',
        'auth/weak-password': '비밀번호는 6자 이상이에요',
        'auth/invalid-credential': '이메일 또는 비밀번호가 틀렸어요',
      };
      setErr(msgs[e.code] || '로그인에 실패했어요');
    }
    setLoading(false);
  };

  const isDarkBg = bgColor !== '#ffffff' && bgColor !== '#f0f4f8';

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center',
      padding:'24px', position:'relative', overflow:'hidden', background: bgColor,
      transition:'background 0.3s' }}>

      {/* 배경 글로우 */}
      <div style={{ position:'absolute', top:'20%', left:'25%', width:400, height:400,
        borderRadius:'50%', filter:'blur(80px)', opacity:0.12,
        background: accentColor, pointerEvents:'none' }} />
      <div style={{ position:'absolute', bottom:'20%', right:'20%', width:320, height:320,
        borderRadius:'50%', filter:'blur(80px)', opacity:0.08,
        background:'#7c3aed', pointerEvents:'none' }} />

      <div style={{ position:'relative', width:'100%', maxWidth:400 }}>

        {/* 로고 */}
        <motion.div initial={{ opacity:0, y:-20 }} animate={{ opacity:1, y:0 }}
          style={{ textAlign:'center', marginBottom:32 }}>
          <div style={{ fontSize:40, fontWeight:900, letterSpacing:'0.08em', marginBottom:6,
            fontFamily:'Orbitron, monospace', color: accentColor,
            textShadow:`0 0 40px ${accentColor}60` }}>
            CodeGame
          </div>
          <p style={{ fontSize:13, fontFamily:'Sora, sans-serif', fontWeight:300,
            color: isDarkBg ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.45)' }}>
            {isSignUp ? '새로운 계정을 만들어보세요' : '다시 만나서 반갑습니다'}
          </p>
        </motion.div>

        {/* 카드 */}
        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
          transition={{ delay:0.1 }}
          style={{ borderRadius:20, padding:'28px 32px',
            background: isDarkBg ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.85)',
            border: isDarkBg ? `1px solid ${accentColor}25` : '1px solid rgba(0,0,0,0.08)',
            backdropFilter:'blur(30px)',
            boxShadow: isDarkBg ? `0 24px 60px rgba(0,0,0,0.7)` : '0 8px 30px rgba(0,0,0,0.1)' }}>

          {/* 탭 */}
          <div style={{ display:'flex', gap:6, marginBottom:22, padding:4, borderRadius:12,
            background: isDarkBg ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)' }}>
            {['로그인','회원가입'].map((t,i) => (
              <button key={t} onClick={() => setIsSignUp(i===1)}
                style={{ flex:1, padding:'10px 0', borderRadius:9, fontSize:13,
                  fontFamily:'Sora, sans-serif', fontWeight:600, border:'none', cursor:'pointer',
                  transition:'all 0.2s',
                  background: (i===0)===!isSignUp ? accentColor : 'transparent',
                  color: (i===0)===!isSignUp ? '#000' : isDarkBg ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.45)' }}>
                {t}
              </button>
            ))}
          </div>

          {/* 폼 */}
          <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:12 }}>
            {isSignUp && (
              <div style={{ position:'relative' }}>
                <User style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)',
                  width:16, height:16, color: isDarkBg ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)' }} />
                <input value={nickname} onChange={e=>setNickname(e.target.value)}
                  placeholder="닉네임" required
                  style={{ width:'100%', paddingLeft:42, paddingRight:16, paddingTop:13, paddingBottom:13,
                    borderRadius:12, fontSize:13, fontFamily:'Sora, sans-serif', outline:'none',
                    background: isDarkBg ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)',
                    border: `1px solid ${isDarkBg ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                    color: isDarkBg ? 'rgba(255,255,255,0.9)' : '#0f172a' }} />
              </div>
            )}
            <div style={{ position:'relative' }}>
              <Mail style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)',
                width:16, height:16, color: isDarkBg ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)' }} />
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)}
                placeholder="이메일" required
                style={{ width:'100%', paddingLeft:42, paddingRight:16, paddingTop:13, paddingBottom:13,
                  borderRadius:12, fontSize:13, fontFamily:'Sora, sans-serif', outline:'none',
                  background: isDarkBg ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)',
                  border: `1px solid ${isDarkBg ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                  color: isDarkBg ? 'rgba(255,255,255,0.9)' : '#0f172a' }} />
            </div>
            <div style={{ position:'relative' }}>
              <Lock style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)',
                width:16, height:16, color: isDarkBg ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)' }} />
              <input type={showPw?'text':'password'} value={password} onChange={e=>setPassword(e.target.value)}
                placeholder="비밀번호" required
                style={{ width:'100%', paddingLeft:42, paddingRight:44, paddingTop:13, paddingBottom:13,
                  borderRadius:12, fontSize:13, fontFamily:'Sora, sans-serif', outline:'none',
                  background: isDarkBg ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)',
                  border: `1px solid ${isDarkBg ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                  color: isDarkBg ? 'rgba(255,255,255,0.9)' : '#0f172a' }} />
              <button type="button" onClick={()=>setShowPw(!showPw)}
                style={{ position:'absolute', right:14, top:'50%', transform:'translateY(-50%)',
                  background:'none', border:'none', cursor:'pointer', padding:0,
                  color: isDarkBg ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)' }}>
                {showPw ? <EyeOff style={{width:16,height:16}} /> : <Eye style={{width:16,height:16}} />}
              </button>
            </div>

            {err && (
              <div style={{ fontSize:12, padding:'10px 14px', borderRadius:10,
                background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.25)',
                color:'#f87171', fontFamily:'Sora, sans-serif' }}>
                {err}
              </div>
            )}

            <button type="submit" disabled={loading}
              style={{ padding:'14px', borderRadius:12, fontSize:13, fontWeight:700,
                fontFamily:'Sora, sans-serif', border:'none', cursor:'pointer', marginTop:4,
                background:`linear-gradient(135deg, ${accentColor}, #00d4ff)`, color:'#000',
                opacity: loading ? 0.7 : 1, transition:'all 0.2s' }}>
              {loading ? '처리 중...' : isSignUp ? '무료로 시작하기' : '로그인'}
            </button>
          </form>

          {/* 색상 커스터마이징 */}
          <div style={{ marginTop:20, paddingTop:18,
            borderTop:`1px solid ${isDarkBg?'rgba(255,255,255,0.08)':'rgba(0,0,0,0.08)'}` }}>
            <p style={{ fontSize:10, marginBottom:8, letterSpacing:'0.12em',
              fontFamily:'JetBrains Mono, monospace',
              color: isDarkBg?'rgba(255,255,255,0.3)':'rgba(0,0,0,0.35)' }}>ACCENT COLOR</p>
            <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:12 }}>
              {ACCENT_COLORS.map(c => (
                <button key={c} onClick={()=>setAccentColor(c)}
                  style={{ width:22, height:22, borderRadius:'50%', background:c, border:'none',
                    cursor:'pointer', transition:'transform 0.15s',
                    outline: accentColor===c ? '2px solid white' : 'none',
                    outlineOffset:2, transform: accentColor===c?'scale(1.2)':'scale(1)' }} />
              ))}
            </div>
            <p style={{ fontSize:10, marginBottom:8, letterSpacing:'0.12em',
              fontFamily:'JetBrains Mono, monospace',
              color: isDarkBg?'rgba(255,255,255,0.3)':'rgba(0,0,0,0.35)' }}>BG COLOR</p>
            <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
              {BG_COLORS.map(c => (
                <button key={c} onClick={()=>setBgColor(c)}
                  style={{ width:22, height:22, borderRadius:'50%', background:c, border:'none',
                    cursor:'pointer', transition:'transform 0.15s',
                    outline: bgColor===c ? `2px solid ${accentColor}` : '1px solid rgba(128,128,128,0.3)',
                    outlineOffset:2, transform: bgColor===c?'scale(1.2)':'scale(1)' }} />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

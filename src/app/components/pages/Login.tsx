import { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

const ACCENT_COLORS = ['#00f5c4','#00d4ff','#7c3aed','#ec4899','#f59e0b','#10b981','#3b82f6','#ef4444','#8b5cf6','#06b6d4'];
const BG_COLORS = ['#03040b','#0a0010','#000a0a','#0a0500','#00000f','#0f0a00','#030010','#000a05','#0a0003','#050050'];

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

  const handleSubmit = async (e: React.FormEvent) => {
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
    } catch (e: any) {
      const msg: Record<string,string> = {
        'auth/user-not-found': '등록되지 않은 이메일이에요',
        'auth/wrong-password': '비밀번호가 틀렸어요',
        'auth/email-already-in-use': '이미 사용 중인 이메일이에요',
        'auth/weak-password': '비밀번호는 6자 이상이어야 해요',
        'auth/invalid-credential': '이메일 또는 비밀번호가 틀렸어요',
      };
      setErr(msg[e.code] || e.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-6 relative overflow-hidden"
      style={{ background: bgColor }}>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-15"
          style={{ background: accentColor }} />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl opacity-10"
          style={{ background: '#7c3aed' }} />
      </div>
      <div className="relative w-full max-w-md">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <div className="text-4xl font-black tracking-wider mb-2"
            style={{ color: accentColor, fontFamily: "Orbitron, monospace", textShadow: `0 0 30px ${accentColor}80` }}>
            CodeGame
          </div>
          <p className="text-white/50 text-sm" style={{ fontFamily: "Sora, sans-serif" }}>
            {isSignUp ? "새로운 계정을 만들어보세요" : "다시 만나서 반갑습니다"}
          </p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="rounded-2xl p-8 border"
          style={{ background: "rgba(255,255,255,0.04)", borderColor: accentColor+"30",
            backdropFilter: "blur(30px)", boxShadow: "0 32px 80px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.05)" }}>
          <div className="flex gap-2 mb-6 p-1 rounded-xl" style={{ background: "rgba(255,255,255,0.05)" }}>
            {["로그인","회원가입"].map((t, i) => (
              <button key={t} onClick={() => setIsSignUp(i===1)}
                className="flex-1 py-2.5 rounded-lg text-sm font-medium transition-all"
                style={{ background: (i===0)===!isSignUp ? accentColor : "transparent",
                  color: (i===0)===!isSignUp ? "#000" : "rgba(255,255,255,0.5)",
                  fontFamily: "Sora, sans-serif" }}>{t}</button>
            ))}
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input value={nickname} onChange={e=>setNickname(e.target.value)} placeholder="닉네임" required
                  className="w-full pl-11 pr-4 py-3 rounded-xl text-sm text-white placeholder-white/25 outline-none"
                  style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", fontFamily:"Sora, sans-serif" }} />
              </div>
            )}
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="이메일" required
                className="w-full pl-11 pr-4 py-3 rounded-xl text-sm text-white placeholder-white/25 outline-none"
                style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", fontFamily:"Sora, sans-serif" }} />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input type={showPw?"text":"password"} value={password} onChange={e=>setPassword(e.target.value)} placeholder="비밀번호" required
                className="w-full pl-11 pr-11 py-3 rounded-xl text-sm text-white placeholder-white/25 outline-none"
                style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", fontFamily:"Sora, sans-serif" }} />
              <button type="button" onClick={()=>setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30">
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {err && (
              <div className="text-sm px-4 py-3 rounded-xl"
                style={{ background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.3)", color:"#f87171", fontFamily:"Sora, sans-serif" }}>
                {err}
              </div>
            )}
            <button type="submit" disabled={loading}
              className="w-full py-3.5 rounded-xl text-sm font-semibold transition-all"
              style={{ background:`linear-gradient(135deg, ${accentColor}, #00d4ff)`, color:"#000",
                fontFamily:"Sora, sans-serif", opacity: loading ? 0.7 : 1 }}>
              {loading ? "처리 중..." : isSignUp ? "무료로 시작하기" : "로그인"}
            </button>
          </form>
          <div className="mt-6 pt-6" style={{ borderTop:"1px solid rgba(255,255,255,0.07)" }}>
            <p className="text-xs text-white/30 mb-3" style={{ fontFamily:"JetBrains Mono, monospace" }}>ACCENT COLOR</p>
            <div className="flex gap-2 flex-wrap mb-3">
              {ACCENT_COLORS.map(c => (
                <button key={c} onClick={()=>setAccentColor(c)}
                  className="w-6 h-6 rounded-full transition-transform"
                  style={{ background:c, outline: accentColor===c?"2px solid white":"none", outlineOffset:"2px",
                    transform: accentColor===c?"scale(1.2)":"scale(1)" }} />
              ))}
            </div>
            <p className="text-xs text-white/30 mb-3" style={{ fontFamily:"JetBrains Mono, monospace" }}>BG COLOR</p>
            <div className="flex gap-2 flex-wrap">
              {BG_COLORS.map(c => (
                <button key={c} onClick={()=>setBgColor(c)}
                  className="w-6 h-6 rounded-full transition-transform border border-white/20"
                  style={{ background:c, outline: bgColor===c?"2px solid white":"none", outlineOffset:"2px",
                    transform: bgColor===c?"scale(1.2)":"scale(1)" }} />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

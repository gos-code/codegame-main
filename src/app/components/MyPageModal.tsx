import { AnimatePresence, motion } from 'motion/react';
import { X, Settings, Palette, Music, Play, Pause, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

const ACCENT_COLORS = ['#00f5c4','#00d4ff','#7c3aed','#ec4899','#f59e0b','#10b981','#3b82f6','#ef4444','#8b5cf6','#06b6d4'];
const BG_COLORS = ['#03040b','#0a0010','#000a0a','#0a0500','#00000f','#0f0a00','#030010','#000a05','#0a0003','#050050'];

interface Props { isOpen: boolean; onClose: () => void; }

export default function MyPageModal({ isOpen, onClose }: Props) {
  const { accentColor, setAccentColor, bgColor, setBgColor } = useTheme();
  const { user, profile, isAdmin } = useAuth();
  const [isPlaying, setIsPlaying] = useState(false);

  if (!user) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center md:justify-end md:pr-6 md:pt-20">
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose} />

          <motion.div
            initial={{ opacity:0, y:60, scale:0.95 }}
            animate={{ opacity:1, y:0, scale:1 }}
            exit={{ opacity:0, y:60, scale:0.95 }}
            transition={{ type:'spring', damping:25, stiffness:300 }}
            className="relative w-full md:w-80 rounded-t-2xl md:rounded-2xl overflow-hidden"
            style={{ background: bgColor, border:`1px solid ${accentColor}20`,
              boxShadow:`0 -20px 60px rgba(0,0,0,0.8), 0 0 0 1px ${accentColor}10` }}>

            {/* 헤더 */}
            <div className="px-5 pt-5 pb-4 flex items-center justify-between"
              style={{ borderBottom:`1px solid rgba(255,255,255,0.07)` }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold"
                  style={{ background:`linear-gradient(135deg,${accentColor},#00d4ff)`, color:'#000',
                    fontFamily:'Orbitron,monospace', boxShadow:`0 0 16px ${accentColor}40` }}>
                  {(profile?.nickname||'U')[0].toUpperCase()}
                </div>
                <div>
                  <div className="text-sm font-semibold text-white/90" style={{ fontFamily:'Sora,sans-serif' }}>
                    {profile?.nickname || user.email}
                  </div>
                  <div className="text-xs font-mono" style={{ color: accentColor }}>
                    LV.{String(profile?.level||1).padStart(2,'0')} · XP {profile?.xp||0}
                  </div>
                </div>
              </div>
              <button onClick={onClose} className="text-white/30 hover:text-white/60 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 통계 */}
            <div className="grid grid-cols-3 gap-2 px-5 py-4">
              {[
                { label:'판매', value: profile?.totalUploads||0 },
                { label:'XP', value: profile?.xp||0 },
                { label:'레벨', value: profile?.level||1 },
              ].map(s => (
                <div key={s.label} className="text-center rounded-xl py-3"
                  style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.07)' }}>
                  <div className="text-lg font-bold" style={{ color:accentColor, fontFamily:'Orbitron,monospace' }}>
                    {s.value}
                  </div>
                  <div className="text-xs text-white/30 mt-0.5" style={{ fontFamily:'Sora,sans-serif' }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* 음악 플레이어 */}
            <div className="mx-5 mb-4 rounded-xl p-4"
              style={{ background:'rgba(255,255,255,0.03)', border:`1px solid rgba(255,255,255,0.07)` }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
                  style={{ background:`rgba(255,255,255,0.05)` }}>🎵</div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-white/80 truncate" style={{ fontFamily:'Sora,sans-serif' }}>
                    Lo-fi Coding Beats
                  </div>
                  <div className="text-xs text-white/30" style={{ fontFamily:'JetBrains Mono,monospace' }}>CodeMusic</div>
                </div>
                <button onClick={() => setIsPlaying(!isPlaying)}
                  className="w-8 h-8 rounded-full flex items-center justify-center transition-transform hover:scale-110"
                  style={{ background: accentColor }}>
                  {isPlaying
                    ? <Pause className="w-4 h-4 text-black" fill="black" />
                    : <Play className="w-4 h-4 text-black ml-0.5" fill="black" />}
                </button>
              </div>
            </div>

            {/* 테마 커스터마이징 */}
            <div className="mx-5 mb-4">
              <p className="text-xs text-white/30 mb-2" style={{ fontFamily:'JetBrains Mono,monospace' }}>ACCENT</p>
              <div className="flex gap-2 flex-wrap mb-3">
                {ACCENT_COLORS.map(c => (
                  <button key={c} onClick={() => setAccentColor(c)}
                    className="w-6 h-6 rounded-full transition-transform"
                    style={{ background:c, outline: accentColor===c?'2px solid white':'none',
                      outlineOffset:'2px', transform: accentColor===c?'scale(1.15)':'scale(1)' }} />
                ))}
              </div>
              <p className="text-xs text-white/30 mb-2" style={{ fontFamily:'JetBrains Mono,monospace' }}>BACKGROUND</p>
              <div className="flex gap-2 flex-wrap">
                {BG_COLORS.map(c => (
                  <button key={c} onClick={() => setBgColor(c)}
                    className="w-6 h-6 rounded-full transition-transform border border-white/20"
                    style={{ background:c, outline: bgColor===c?'2px solid white':'none',
                      outlineOffset:'2px', transform: bgColor===c?'scale(1.15)':'scale(1)' }} />
                ))}
              </div>
            </div>

            {/* 하단 링크 */}
            <div className="mx-5 mb-5 space-y-2">
              <Link to="/mypage" onClick={onClose}
                className="flex items-center justify-between px-4 py-3 rounded-xl transition-all"
                style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.07)' }}>
                <span className="text-sm text-white/70" style={{ fontFamily:'Sora,sans-serif' }}>상세 마이페이지</span>
                <ChevronRight className="w-4 h-4 text-white/30" />
              </Link>
              {isAdmin && (
                <Link to="/mypage?tab=admin" onClick={onClose}
                  className="flex items-center justify-between px-4 py-3 rounded-xl transition-all"
                  style={{ background:'rgba(245,158,11,0.06)', border:'1px solid rgba(245,158,11,0.2)' }}>
                  <span className="text-sm" style={{ color:'#f59e0b', fontFamily:'Sora,sans-serif' }}>관리자 패널</span>
                  <ChevronRight className="w-4 h-4" style={{ color:'#f59e0b' }} />
                </Link>
              )}
            </div>

            <div className="flex justify-center pb-4">
              <div className="w-24 h-1 rounded-full bg-white/10" />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

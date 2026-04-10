import { Link, useNavigate, useLocation } from 'react-router';
import { Search, Sun, Moon, LogOut, User, Gamepad2, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import MyPageModal from './MyPageModal';

export default function Header() {
  const { theme, toggleTheme, accentColor } = useTheme();
  const { user, profile, logout } = useAuth();
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const nav = useNavigate();
  const loc = useLocation();

  const links = [
    { to: '/marketplace', label: '마켓플레이스' },
    { to: '/sell', label: '판매하기' },
    { to: '/requests', label: '요청하기' },
    { to: '/guide', label: '가이드' },
    { to: '/community', label: '커뮤니티' },
    { to: '/contact', label: '기업 문의' },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) nav(`/marketplace?q=${encodeURIComponent(search.trim())}`);
  };

  return (
    <>
      {/* HUD 바 */}
      <div className="fixed top-0 left-0 right-0 z-50 h-6 flex items-center justify-between px-6"
        style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255,255,255,0.06)', fontFamily: 'JetBrains Mono, monospace' }}>
        <div className="flex items-center gap-3 text-xs">
          <span className="font-bold" style={{ color: accentColor }}>LV.{String(profile?.level||1).padStart(2,'0')}</span>
          <div className="w-16 h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.1)' }}>
            <div className="h-full rounded-full" style={{ background: accentColor,
              width: `${((profile?.xp||0)%100)}%` }} />
          </div>
          <span className="text-white/30 text-xs">XP {profile?.xp||0}</span>
        </div>
        <div className="flex items-center gap-4 text-xs text-white/30">
          <span><span style={{ color: accentColor }}>●</span> LIVE</span>
          <span>💾 ASSETS</span>
          <span>⚡ DEVS</span>
        </div>
      </div>

      {/* 메인 NAV */}
      <header className="fixed top-6 left-0 right-0 z-40"
        style={{ background: 'rgba(3,4,11,0.75)', backdropFilter: 'blur(40px)',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          boxShadow: `0 1px 0 ${accentColor}15, 0 8px 32px rgba(0,0,0,0.4)` }}>
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          {/* 로고 */}
          <Link to="/" className="text-lg font-black tracking-wider"
            style={{ color: accentColor, fontFamily: 'Orbitron, monospace',
              textShadow: `0 0 20px ${accentColor}60` }}>
            CodeGame
          </Link>

          {/* 데스크탑 링크 */}
          <nav className="hidden md:flex items-center gap-6">
            {links.map(l => (
              <Link key={l.to} to={l.to}
                className="text-xs transition-all"
                style={{
                  color: loc.pathname.startsWith(l.to) ? accentColor : 'rgba(255,255,255,0.5)',
                  fontFamily: 'Sora, sans-serif', fontWeight: 400,
                  borderBottom: loc.pathname.startsWith(l.to) ? `1px solid ${accentColor}` : '1px solid transparent',
                  paddingBottom: '2px'
                }}>
                {l.label}
              </Link>
            ))}
            <Link to="/dev-garden"
              className="text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all"
              style={{ background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.3)',
                color: '#a78bff', fontFamily: 'Sora, sans-serif' }}>
              <Gamepad2 className="w-3 h-3" />Dev Garden
            </Link>
          </nav>

          {/* 우측 액션 */}
          <div className="flex items-center gap-2">
            <form onSubmit={handleSearch} className="hidden md:flex items-center gap-2 rounded-lg px-3 py-1.5"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <Search className="w-3.5 h-3.5 text-white/30" />
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="검색"
                className="bg-transparent outline-none text-xs text-white placeholder-white/25 w-28"
                style={{ fontFamily: 'Sora, sans-serif' }} />
            </form>

            <button onClick={toggleTheme} className="p-2 rounded-lg text-white/40 hover:text-white/70 transition-colors"
              style={{ background: 'rgba(255,255,255,0.05)' }}>
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {user ? (
              <>
                <button onClick={() => setShowModal(true)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-all"
                  style={{ background: `linear-gradient(135deg, ${accentColor}, #00d4ff)`, color: '#000',
                    fontFamily: 'Orbitron, monospace', boxShadow: `0 0 12px ${accentColor}40` }}>
                  {(profile?.nickname || user.email || 'U')[0].toUpperCase()}
                </button>
                <button onClick={logout} className="p-2 rounded-lg text-white/30 hover:text-red-400 transition-colors"
                  style={{ background: 'rgba(255,255,255,0.05)' }}>
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                <Link to="/login"
                  className="px-4 py-1.5 rounded-lg text-xs transition-all"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                    color: 'rgba(255,255,255,0.7)', fontFamily: 'Sora, sans-serif' }}>
                  로그인
                </Link>
                <Link to="/login"
                  className="px-4 py-1.5 rounded-lg text-xs font-semibold transition-all"
                  style={{ background: `linear-gradient(135deg, ${accentColor}, #00d4ff)`,
                    color: '#000', fontFamily: 'Sora, sans-serif' }}>
                  무료 시작
                </Link>
              </>
            )}
            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 text-white/50">
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* 모바일 메뉴 */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div initial={{ height:0, opacity:0 }} animate={{ height:'auto', opacity:1 }}
              exit={{ height:0, opacity:0 }}
              className="md:hidden overflow-hidden"
              style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="px-6 py-4 flex flex-col gap-3">
                {links.map(l => (
                  <Link key={l.to} to={l.to} onClick={() => setMenuOpen(false)}
                    className="text-sm py-2" style={{ color:'rgba(255,255,255,0.7)', fontFamily:'Sora, sans-serif' }}>
                    {l.label}
                  </Link>
                ))}
                <Link to="/dev-garden" onClick={() => setMenuOpen(false)}
                  className="text-sm py-2" style={{ color:'#a78bff', fontFamily:'Sora, sans-serif' }}>
                  Dev Garden
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <MyPageModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </>
  );
}

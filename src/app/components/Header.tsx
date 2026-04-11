// @ts-nocheck
import { Link, useNavigate, useLocation } from 'react-router';
import { Search, Sun, Moon, LogOut, Gamepad2, Menu, X } from 'lucide-react';
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
  const isDark = theme === 'dark';

  const links = [
    { to: '/marketplace', label: '마켓플레이스' },
    { to: '/sell', label: '판매하기' },
    { to: '/requests', label: '요청하기' },
    { to: '/guide', label: '가이드' },
    { to: '/community', label: '커뮤니티' },
    { to: '/contact', label: '기업 문의' },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) nav(`/marketplace?q=${encodeURIComponent(search.trim())}`);
  };

  const accent = isDark ? (accentColor || '#00f5c4') : '#0f172a';

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50"
        style={{ backgroundColor: 'var(--background)', borderBottom: '1px solid var(--border)',
          backdropFilter: 'blur(12px)' }}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

          {/* 로고 */}
          <div className="flex items-center gap-10">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: accent }}>
                <Gamepad2 className="w-4 h-4" style={{ color: isDark ? '#000' : '#fff' }} />
              </div>
              <span className="text-lg font-bold tracking-tight"
                style={{ fontFamily: 'Sora, sans-serif', color: 'var(--foreground)' }}>
                CodeGame
              </span>
            </Link>

            {/* 데스크탑 메뉴 */}
            <nav className="hidden md:flex items-center gap-6">
              {links.map(l => {
                const isActive = loc.pathname.startsWith(l.to);
                return (
                  <Link key={l.to} to={l.to}
                    className="text-sm transition-all"
                    style={{
                      color: isActive ? 'var(--foreground)' : 'var(--muted)',
                      fontFamily: 'Sora, sans-serif',
                      fontWeight: isActive ? 600 : 400,
                      borderBottom: isActive ? `2px solid ${accent}` : '2px solid transparent',
                      paddingBottom: '2px'
                    }}>
                    {l.label}
                  </Link>
                );
              })}
              {/* Dev Garden */}
              <Link to="/dev-garden"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all"
                style={{ background: isDark ? 'rgba(124,58,237,0.12)' : 'rgba(124,58,237,0.08)',
                  border: '1px solid rgba(124,58,237,0.25)', color: '#7c3aed',
                  fontFamily: 'Sora, sans-serif' }}>
                <Gamepad2 className="w-3.5 h-3.5" />Dev Garden
              </Link>
            </nav>
          </div>

          {/* 우측 영역 */}
          <div className="flex items-center gap-3">
            {/* 검색 */}
            <form onSubmit={handleSearch} className="hidden lg:flex items-center px-3 py-2 rounded-lg gap-2"
              style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
              <Search className="w-3.5 h-3.5" style={{ color: 'var(--muted)' }} />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="검색" className="bg-transparent border-none outline-none text-sm w-32"
                style={{ color: 'var(--foreground)', fontFamily: 'Sora, sans-serif' }} />
            </form>

            {/* 테마 토글 */}
            <button onClick={toggleTheme}
              className="p-2 rounded-lg transition-colors"
              style={{ background: 'var(--card)', border: '1px solid var(--border)',
                color: 'var(--foreground)' }}>
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {user ? (
              <div className="flex items-center gap-2">
                <button onClick={() => setShowModal(true)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg transition-all"
                  style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ background: `linear-gradient(135deg, ${accent}, #00d4ff)`,
                      color: isDark ? '#000' : '#fff', fontFamily: 'Orbitron, monospace' }}>
                    {(profile?.nickname || user.email || 'U')[0].toUpperCase()}
                  </div>
                  <span className="hidden sm:block text-sm font-medium"
                    style={{ color: 'var(--foreground)', fontFamily: 'Sora, sans-serif' }}>
                    {profile?.nickname || '사용자'}
                  </span>
                </button>
                <button onClick={() => logout().then(() => nav('/'))}
                  className="p-2 rounded-lg transition-colors"
                  style={{ background: 'var(--card)', border: '1px solid var(--border)',
                    color: 'var(--muted)' }}>
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login"
                  className="text-sm font-medium px-3 py-2 rounded-lg transition-all"
                  style={{ color: 'var(--muted)', fontFamily: 'Sora, sans-serif' }}>
                  로그인
                </Link>
                <Link to="/login?mode=signup"
                  className="px-4 py-2 rounded-lg text-sm font-semibold transition-all"
                  style={{ background: accent, color: isDark ? '#000' : '#fff',
                    fontFamily: 'Sora, sans-serif' }}>
                  무료 시작
                </Link>
              </div>
            )}

            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2"
              style={{ color: 'var(--foreground)' }}>
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* 모바일 메뉴 */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div initial={{ height:0, opacity:0 }} animate={{ height:'auto', opacity:1 }}
              exit={{ height:0, opacity:0 }} className="md:hidden overflow-hidden"
              style={{ backgroundColor: 'var(--background)', borderTop: '1px solid var(--border)' }}>
              <div className="px-6 py-4 flex flex-col gap-1">
                {links.map(l => (
                  <Link key={l.to} to={l.to} onClick={() => setMenuOpen(false)}
                    className="text-sm py-2.5 px-3 rounded-lg"
                    style={{ color: 'var(--foreground)', fontFamily: 'Sora, sans-serif' }}>
                    {l.label}
                  </Link>
                ))}
                <Link to="/dev-garden" onClick={() => setMenuOpen(false)}
                  className="text-sm py-2.5 px-3 rounded-lg"
                  style={{ color: '#7c3aed', fontFamily: 'Sora, sans-serif' }}>
                  🎮 Dev Garden
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <MyPageModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </>
  );
}

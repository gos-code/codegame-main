// @ts-nocheck
import { Link, useNavigate, useLocation } from 'react-router';
import { Search, Sun, Moon, LogOut, User, Gamepad2, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import MyPageModal from './MyPageModal';

export default function Header() {
  const { theme, toggleTheme } = useTheme(); // accentColor 제거 (CSS 변수 사용)
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
      <div className="fixed top-0 left-0 right-0 z-50 transition-colors duration-300"
           style={{ backgroundColor: 'var(--background)', borderBottom: '1px solid var(--border)' }}>
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          
          <div className="flex items-center gap-12">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                   style={{ backgroundColor: 'var(--primary)' }}>
                <Gamepad2 className="w-5 h-5" style={{ color: 'var(--primary-foreground)' }} />
              </div>
              <span className="text-xl font-bold tracking-tighter" 
                    style={{ fontFamily: 'Orbitron, sans-serif', color: 'var(--primary)' }}>
                CodeGame
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-8">
              {links.map(l => (
                <Link key={l.to} to={l.to} 
                      className={`text-sm font-medium transition-colors hover:opacity-100 ${loc.pathname === l.to ? 'opacity-100' : 'opacity-60'}`}
                      style={{ color: 'var(--foreground)' }}>
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <form onSubmit={handleSearch} className="hidden lg:flex items-center px-4 py-2 rounded-full transition-all"
                  style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
              <Search className="w-4 h-4 opacity-40" />
              <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                placeholder="검색" className="bg-transparent border-none outline-none px-3 text-sm w-40 focus:w-60 transition-all" />
            </form>

            <button onClick={toggleTheme} className="p-2 rounded-lg hover:bg-opacity-10 transition-colors"
                    style={{ backgroundColor: 'var(--card)', color: 'var(--foreground)' }}>
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {user ? (
              <div className="flex items-center gap-3 pl-3" style={{ borderLeft: '1px solid var(--border)' }}>
                <button onClick={() => setShowModal(true)} className="flex items-center gap-3 group">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-semibold leading-none">{profile?.nickname || '사용자'}</p>
                    <p className="text-[10px] opacity-50 mt-1">Lv.{profile?.level || 1}</p>
                  </div>
                  <div className="w-10 h-10 rounded-full overflow-hidden border-2 transition-transform group-hover:scale-105"
                       style={{ borderColor: 'var(--cg-accent)' }}>
                    <img src={profile?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`} alt="avatar" />
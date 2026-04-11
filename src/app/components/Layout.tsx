// @ts-nocheck
import { Outlet, useLocation } from 'react-router';
import { useEffect } from 'react';
import { useMusic } from '../contexts/MusicContext';
import Header from './Header';
import CodeTalkWidget from './CodeTalkWidget';

export default function Layout() {
  const loc = useLocation();
  const { play, isPlaying } = useMusic();
  useEffect(() => {
    const handler = () => { if (!isPlaying) play(); };
    document.addEventListener('click', handler, { once: true });
    return () => document.removeEventListener('click', handler);
  }, [isPlaying]);
  const hideHeader = loc.pathname === '/login';

  return (
    <div className="min-h-screen" style={{ background:'var(--background)', color:'var(--foreground)' }}>
      {!hideHeader && <Header />}
      <main style={{ paddingTop: hideHeader ? 0 : '64px', minHeight:'100vh',
        background:'var(--background)', color:'var(--foreground)' }}>
        <Outlet />
      </main>
      <CodeTalkWidget />
    </div>
  );
}

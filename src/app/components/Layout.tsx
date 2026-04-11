// @ts-nocheck
import { Outlet, useLocation } from 'react-router';
import { useEffect, useRef } from 'react';
import { useMusic } from '../contexts/MusicContext';
import Header from './Header';
import CodeTalkWidget from './CodeTalkWidget';

export default function Layout() {
  const loc = useLocation();
  const { play } = useMusic();
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    const handler = () => {
      if (startedRef.current) return;
      startedRef.current = true;
      play();
    };
    document.addEventListener('click', handler, { once: true });
    document.addEventListener('keydown', handler, { once: true });
    document.addEventListener('touchstart', handler, { once: true });
    return () => {
      document.removeEventListener('click', handler);
      document.removeEventListener('keydown', handler);
      document.removeEventListener('touchstart', handler);
    };
  }, [play]);

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

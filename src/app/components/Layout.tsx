// @ts-nocheck
import { Outlet, useLocation } from 'react-router';
import Header from './Header';

export default function Layout() {
  const loc = useLocation();
  const hideHeader = loc.pathname === '/login';
  return (
    <div className="min-h-screen" style={{ background: 'var(--background)' }}>
      {!hideHeader && <Header />}
      <main style={{ paddingTop: hideHeader ? 0 : '64px', minHeight: '100vh',
        background: 'var(--background)', color: 'var(--foreground)' }}>
        <Outlet />
      </main>
    </div>
  );
}

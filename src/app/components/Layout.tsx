import { Outlet, useLocation } from 'react-router';
import Header from './Header';

export default function Layout() {
  const loc = useLocation();
  const hideHeader = loc.pathname === '/login';

  return (
    <div
      className="min-h-screen transition-colors duration-300"
      style={{
        background: 'var(--background)',
        color: 'var(--foreground)',
      }}
    >
      {!hideHeader && <Header />}

      <main
        className="transition-colors duration-300"
        style={{
          paddingTop: hideHeader ? 0 : '80px',
          minHeight: '100vh',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
import { Outlet, useLocation } from 'react-router';
import Header from './Header';

export default function Layout() {
  const loc = useLocation();
  const hideHeader = loc.pathname === '/login';

  return (
    <div className="min-h-screen" style={{ fontFamily: 'Sora, sans-serif' }}>
      {!hideHeader && <Header />}
      <main style={{ paddingTop: hideHeader ? 0 : '80px' }}>
        <Outlet />
      </main>
    </div>
  );
}

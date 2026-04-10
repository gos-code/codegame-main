import { Outlet, useLocation } from 'react-router';
import Header from './Header';

export default function Layout() {
  const loc = useLocation();
  const hideHeader = loc.pathname === '/login';

  return (
    // style={{ fontFamily: 'Sora, sans-serif' }} 대신 CSS 변수 사용
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {!hideHeader && <Header />}
      <main style={{ paddingTop: hideHeader ? 0 : '80px' }}>
        <Outlet />
      </main>
    </div>
  );
}
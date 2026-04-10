import { Outlet, useLocation } from 'react-router';
import Header from './Header';

export default function Layout() {
  const loc = useLocation();
  const hideHeader = loc.pathname === '/login';

  return (
    /* 여기서 bg-background와 text-foreground를 넣어줘야 하위 모든 페이지에 적용됩니다 */
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {!hideHeader && <Header />}
      <main style={{ paddingTop: hideHeader ? 0 : '80px' }} className="bg-background text-foreground">
        <Outlet />
      </main>
    </div>
  );
}
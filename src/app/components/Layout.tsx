import { Outlet, useLocation } from 'react-router';
import Header from './Header';

export default function Layout() {
  const loc = useLocation();
  const hideHeader = loc.pathname === '/login';

  return (
    /* 최상위 컨테이너에 테마 색상 강제 적용 */
    <div className="min-h-screen bg-background text-foreground transition-none">
      {!hideHeader && <Header />}
      <main 
        className="min-h-screen bg-background text-foreground"
        style={{ paddingTop: hideHeader ? 0 : '80px' }}
      >
        <Outlet />
      </main>
    </div>
  );
}
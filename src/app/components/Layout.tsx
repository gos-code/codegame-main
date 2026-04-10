import { Outlet, useLocation } from 'react-router';
import Header from './Header';

export default function Layout() {
  const loc = useLocation();
  const hideHeader = loc.pathname === '/login';

  return (
    /* 기존의 style={{ fontFamily: 'Sora, sans-serif' }}를 지우고 
       CSS 변수(theme.css)를 사용하도록 클래스를 적용했습니다.
    */
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {!hideHeader && <Header />}
      <main style={{ paddingTop: hideHeader ? 0 : '80px' }}>
        <Outlet />
      </main>
    </div>
  );
}
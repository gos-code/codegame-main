import { Outlet, useLocation } from 'react-router';
import Header from './Header';

export default function Layout() {
  const loc = useLocation();
  const hideHeader = loc.pathname === '/login';

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-accent/30">
      {!hideHeader && <Header />}
      <main 
        className="bg-background text-foreground transition-colors duration-300"
        style={{ paddingTop: hideHeader ? 0 : '80px' }}
      >
        <Outlet />
      </main>
    </div>
  );
}
// @ts-nocheck
import { createBrowserRouter, RouterProvider } from 'react-router';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { MusicProvider } from './contexts/MusicContext';
import Layout from './components/Layout';
import Home from './components/pages/Home';
import Marketplace from './components/pages/Marketplace';
import Login from './components/pages/Login';
import MyPage from './components/pages/MyPage';
import Community from './components/pages/Community';
import Guide from './components/pages/Guide';
import Requests from './components/pages/Requests';
import Contact from './components/pages/Contact';
import Sell from './components/pages/Sell';
import ProductDetail from './components/pages/ProductDetail';
import NotFound from './components/pages/NotFound';
import SellerProfile from './components/pages/SellerProfile';
import DevGardenTitle from './components/pages/DevGardenTitle';
import { CharacterCustomization } from './components/pages/CharacterCustomization';
import { CityPage } from './components/pages/CityPage';

// vite.config.ts의 base: '/codegame-main/' 와 일치시킴
const router = createBrowserRouter(
  [
    {
      path: '/',
      Component: Layout,
      children: [
        { index: true, Component: Home },
        { path: 'marketplace', Component: Marketplace },
        { path: 'marketplace/:id', Component: ProductDetail },
        { path: 'sell', Component: Sell },
        { path: 'login', Component: Login },
        { path: 'mypage', Component: MyPage },
        { path: 'community', Component: Community },
        { path: 'guide', Component: Guide },
        { path: 'requests', Component: Requests },
        { path: 'contact', Component: Contact },
      { path: 'seller/:uid', Component: SellerProfile },
        { path: '*', Component: NotFound },
      ],
    },
    {
      path: '/dev-garden',
      children: [
        { index: true, Component: DevGardenTitle },
        { path: 'customization', Component: CharacterCustomization },
        { path: 'city', Component: CityPage },
      ],
    },
  ],
  { basename: '/codegame-main' }
);

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <MusicProvider>
          <RouterProvider router={router} />
        </MusicProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

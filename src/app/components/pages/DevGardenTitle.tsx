// @ts-nocheck
import { useEffect } from 'react';
import { TitleScreen } from '../TitleScreen';

export default function DevGardenTitle() {
  useEffect(() => {
    document.body.classList.add('dev-garden-page');
    document.documentElement.style.background = '#000';
    document.body.style.background = '#000';
    const root = document.getElementById('root');
    if (root) root.style.background = '#000';
    return () => {
      document.body.classList.remove('dev-garden-page');
      document.documentElement.style.background = '';
      document.body.style.background = '';
      if (root) root.style.background = '';
    };
  }, []);

  return (
    <div style={{ background: '#000', minHeight: '100vh', width: '100%' }}>
      <TitleScreen />
    </div>
  );
}

// @ts-nocheck
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

type Theme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() =>
    (localStorage.getItem('cg_theme') as Theme) || 'dark'
  );

  useEffect(() => {
    localStorage.setItem('cg_theme', theme);
    const root = window.document.documentElement;
    
    // 클래스 완전 초기화 후 현재 테마만 정확히 주입
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    
    // 브라우저 렌더링 엔진에 현재 테마 알림
    root.style.setProperty('color-scheme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
}
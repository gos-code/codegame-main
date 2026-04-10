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
    const root = document.documentElement;
    
    // 1. 기존 클래스 제거 후 현재 테마만 추가
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    
    // 2. CSS 변수 충돌 방지를 위해 인라인 스타일 강제 제거
    root.style.removeProperty('--background');
    root.style.removeProperty('--foreground');
    root.style.removeProperty('--cg-bg');
  }, [theme]);

  const toggleTheme = () => setTheme(p => p === 'dark' ? 'light' : 'dark');

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
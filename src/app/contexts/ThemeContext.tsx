// @ts-nocheck
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

type Theme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  accentColor: string;
  setAccentColor: (c: string) => void;
  bgColor: string;
  setBgColor: (c: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() =>
    (localStorage.getItem('cg_theme') as Theme) || 'dark'
  );
  const [accentColor, setAccentColorState] = useState(
    localStorage.getItem('cg_accent') || '#00f5c4'
  );
  const [bgColor, setBgColorState] = useState(
    localStorage.getItem('cg_bg') || '#03040b'
  );

  // 1. 테마(다크/라이트) 클래스 제어
  useEffect(() => {
    localStorage.setItem('cg_theme', theme);
    const root = document.documentElement;
    
    // 기존 클래스 제거 후 현재 테마 추가
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    
    // 라이트 모드일 때 인라인으로 박힌 배경색 스타일이 있으면 제거 (CSS 변수가 우선되도록)
    if (theme === 'light') {
      root.style.removeProperty('--background');
    }
  }, [theme]);

  // 2. 포인트 컬러 제어
  useEffect(() => {
    localStorage.setItem('cg_accent', accentColor);
    document.documentElement.style.setProperty('--cg-accent', accentColor);
  }, [accentColor]);

  // 3. 배경색 제어 (다크모드일 때만 커스텀 배경 적용)
  useEffect(() => {
    localStorage.setItem('cg_bg', bgColor);
    if (theme === 'dark') {
      document.documentElement.style.setProperty('--background', bgColor);
      document.documentElement.style.setProperty('--cg-bg', bgColor);
    }
  }, [bgColor, theme]);

  const toggleTheme = () => setTheme(p => p === 'dark' ? 'light' : 'dark');
  const setAccentColor = (c: string) => setAccentColorState(c);
  const setBgColor = (c: string) => setBgColorState(c);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, accentColor, setAccentColor, bgColor, setBgColor }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
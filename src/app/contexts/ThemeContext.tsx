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

  useEffect(() => {
    localStorage.setItem('cg_theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.classList.toggle('light', theme === 'light');
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('cg_accent', accentColor);
    document.documentElement.style.setProperty('--cg-accent', accentColor);
  }, [accentColor]);

  useEffect(() => {
    localStorage.setItem('cg_bg', bgColor);
    document.documentElement.style.setProperty('--cg-bg', bgColor);
  }, [bgColor]);

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

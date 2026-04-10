// @ts-nocheck
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

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
  const [theme, setTheme] = useState<Theme>('dark');
  const [accentColor, setAccentColorState] = useState('#00f5c4');
  const [bgColor, setBgColorState] = useState('#03040b');

  useEffect(() => {
    const savedTheme = localStorage.getItem('cg_theme') as Theme | null;
    const savedAccent = localStorage.getItem('cg_accent');
    const savedBg = localStorage.getItem('cg_bg');
    if (savedTheme) setTheme(savedTheme);
    if (savedAccent) setAccentColorState(savedAccent);
    if (savedBg) setBgColorState(savedBg);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    root.style.colorScheme = theme;
    localStorage.setItem('cg_theme', theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.style.setProperty('--cg-accent', accentColor);
    localStorage.setItem('cg_accent', accentColor);
  }, [accentColor]);

  useEffect(() => {
    document.documentElement.style.setProperty('--cg-bg', bgColor);
    localStorage.setItem('cg_bg', bgColor);
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

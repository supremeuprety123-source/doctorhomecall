import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useSiteSettings } from '../hooks/useData';

interface ThemeContextType {
  darkMode: boolean;
  toggleDarkMode: () => void;
  primaryColor: string;
  accentColor: string;
}

const ThemeContext = createContext<ThemeContextType>({
  darkMode: false,
  toggleDarkMode: () => {},
  primaryColor: '#0d9488',
  accentColor: '#f59e0b',
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { settings } = useSiteSettings();
  const [darkMode, setDarkMode] = useState(false);

  const primaryColor = settings.primary_color || '#0d9488';
  const accentColor = settings.accent_color || '#f59e0b';

  useEffect(() => {
    const saved = localStorage.getItem('darkMode');
    if (saved === 'true') setDarkMode(true);
    else if (settings.dark_mode === 'true') setDarkMode(true);
  }, [settings.dark_mode]);

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('darkMode', String(darkMode));
  }, [darkMode]);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--color-primary', primaryColor);
    root.style.setProperty('--color-accent', accentColor);

    // Generate shades
    root.style.setProperty('--color-primary-light', adjustColor(primaryColor, 40));
    root.style.setProperty('--color-primary-dark', adjustColor(primaryColor, -30));
    root.style.setProperty('--color-primary-50', adjustColor(primaryColor, 90));
    root.style.setProperty('--color-primary-100', adjustColor(primaryColor, 75));
    root.style.setProperty('--color-primary-600', adjustColor(primaryColor, -10));
    root.style.setProperty('--color-primary-700', adjustColor(primaryColor, -25));
    root.style.setProperty('--color-primary-800', adjustColor(primaryColor, -40));
    root.style.setProperty('--color-primary-900', adjustColor(primaryColor, -55));
    root.style.setProperty('--color-primary-950', adjustColor(primaryColor, -65));
    root.style.setProperty('--color-accent-light', adjustColor(accentColor, 30));
    root.style.setProperty('--color-accent-dark', adjustColor(accentColor, -20));
  }, [primaryColor, accentColor]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode, primaryColor, accentColor }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

function adjustColor(hex: string, amount: number): string {
  hex = hex.replace('#', '');
  if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
  const num = parseInt(hex, 16);
  let r = Math.min(255, Math.max(0, ((num >> 16) & 0xff) + amount));
  let g = Math.min(255, Math.max(0, ((num >> 8) & 0xff) + amount));
  let b = Math.min(255, Math.max(0, (num & 0xff) + amount));
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

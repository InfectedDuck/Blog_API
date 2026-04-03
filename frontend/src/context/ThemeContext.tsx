'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { updateUserProfile } from '../lib/api';
import { useAuth } from './AuthContext';

interface ThemeContextType {
  darkMode: boolean;
  accentColor: string;
  toggleDarkMode: () => void;
  setAccentColor: (color: string) => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

const ACCENT_COLORS: Record<string, Record<string, string>> = {
  pink: { accent: '#FFE4E6', 'accent-dark': '#FBC4C8' },
  blue: { accent: '#DBEAFE', 'accent-dark': '#BFDBFE' },
  lavender: { accent: '#EDE9FE', 'accent-dark': '#DDD6FE' },
  mint: { accent: '#D1FAE5', 'accent-dark': '#A7F3D0' },
};

function applyTheme(dark: boolean, accent: string) {
  const root = document.documentElement;
  if (dark) {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
  const colors = ACCENT_COLORS[accent] || ACCENT_COLORS.lavender;
  root.style.setProperty('--color-accent', colors.accent);
  root.style.setProperty('--color-accent-dark', colors['accent-dark']);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [darkMode, setDarkMode] = useState(false);
  const [accentColor, setAccentColorState] = useState('lavender');

  // Sync from user or localStorage on mount/user change
  useEffect(() => {
    if (user) {
      setDarkMode(user.darkMode ?? false);
      setAccentColorState(user.accentColor ?? 'lavender');
      applyTheme(user.darkMode ?? false, user.accentColor ?? 'lavender');
    } else {
      const savedDark = localStorage.getItem('darkMode') === 'true';
      const savedAccent = localStorage.getItem('accentColor') || 'lavender';
      setDarkMode(savedDark);
      setAccentColorState(savedAccent);
      applyTheme(savedDark, savedAccent);
    }
  }, [user]);

  const toggleDarkMode = useCallback(() => {
    setDarkMode((prev) => {
      const next = !prev;
      localStorage.setItem('darkMode', String(next));
      applyTheme(next, accentColor);
      if (user) updateUserProfile({ darkMode: next }).catch(() => {});
      return next;
    });
  }, [accentColor, user]);

  const setAccentColor = useCallback((color: string) => {
    setAccentColorState(color);
    localStorage.setItem('accentColor', color);
    applyTheme(darkMode, color);
    if (user) updateUserProfile({ accentColor: color }).catch(() => {});
  }, [darkMode, user]);

  return (
    <ThemeContext.Provider value={{ darkMode, accentColor, toggleDarkMode, setAccentColor }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}

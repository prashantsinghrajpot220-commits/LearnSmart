import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Colors } from '../constants/theme';

type ThemeMode = 'light' | 'dark' | 'mature';

interface ThemeContextType {
  theme: ThemeMode;
  colors: typeof Colors.light;
  setTheme: (mode: ThemeMode) => void;
  toggleTheme: () => void;
  isDark: boolean;
  isMature: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = '@learnsmart_theme';

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<ThemeMode>('light');

  useEffect(() => {
    const loadTheme = () => {
      try {
        const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
        if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark' || savedTheme === 'mature')) {
          setThemeState(savedTheme as ThemeMode);
        } else {
          // Default to light on web
          setThemeState('light');
        }
      } catch (error) {
        console.error('Failed to load theme', error);
        setThemeState('light');
      }
    };
    loadTheme();
  }, []);

  const setTheme = useCallback((mode: ThemeMode) => {
    setThemeState(mode);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, mode);
    } catch (error) {
      console.error('Failed to save theme', error);
    }
  }, []);

  const toggleTheme = useCallback(() => {
    const nextTheme: Record<ThemeMode, ThemeMode> = {
      light: 'dark',
      dark: 'mature',
      mature: 'light',
    };
    setTheme(nextTheme[theme]);
  }, [theme, setTheme]);

  const value: ThemeContextType = {
    theme,
    colors: Colors[theme],
    setTheme,
    toggleTheme,
    isDark: theme === 'dark',
    isMature: theme === 'mature',
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
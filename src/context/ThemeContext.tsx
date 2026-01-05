import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Colors } from '../constants/theme';

export type ThemeMode = 'light' | 'dark' | 'mature';

export type ThemeColors = typeof Colors.light;

interface ThemeContextType {
  theme: ThemeMode;
  colors: ThemeColors;
  setTheme: (mode: ThemeMode) => void;
  toggleTheme: () => void;
  isDark: boolean;
  isMature: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = '@learnsmart_theme';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>('light');

  useEffect(() => {
    const loadTheme = () => {
      try {
        const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
        if (savedTheme === 'light' || savedTheme === 'dark' || savedTheme === 'mature') {
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

  const value = {
    theme,
    colors: Colors[theme],
    setTheme,
    toggleTheme,
    isDark: theme === 'dark',
    isMature: theme === 'mature',
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
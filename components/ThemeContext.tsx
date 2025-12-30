import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '@/constants/theme';

type ThemeMode = 'light' | 'dark';

export type ThemeColors = typeof Colors.light & {
  matureCardBackground?: string;
};

interface ThemeContextType {
  theme: ThemeMode;
  colors: ThemeColors;
  setTheme: (mode: ThemeMode) => void;
  toggleTheme: () => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = '@learnsmart_theme';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [theme, setThemeState] = useState<ThemeMode>('light');

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (savedTheme === 'light' || savedTheme === 'dark') {
          setThemeState(savedTheme);
        } else if (systemColorScheme) {
          setThemeState(systemColorScheme);
        }
      } catch (error) {
        console.error('Failed to load theme', error);
      }
    };
    loadTheme();
  }, [systemColorScheme]);

  const setTheme = useCallback(async (mode: ThemeMode) => {
    setThemeState(mode);
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
    } catch (error) {
      console.error('Failed to save theme', error);
    }
  }, []);

  const toggleTheme = useCallback(() => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  }, [theme, setTheme]);

  const value = {
    theme,
    colors: Colors[theme],
    setTheme,
    toggleTheme,
    isDark: theme === 'dark',
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

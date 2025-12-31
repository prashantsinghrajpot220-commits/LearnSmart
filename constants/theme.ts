export const Colors = {
  light: {
    primary: '#9CAF88',
    primaryDark: '#7A9268',
    background: '#F5F1E8',
    text: '#2C2C2C',
    textSecondary: '#6B6B6B',
    cardBackground: '#FFFFFF',
    secondary: '#CCCCCC',
    white: '#FFFFFF',
    lightGray: '#E8E8E8',
    charcoal: '#36454F',
    shadow: '#2C2C2C',
    error: '#DC2626',
    // 12+ Corporate theme - darker, more serious
    maturePrimary: '#4A6741',
    matureText: '#1A1A1A',
    matureCardBackground: '#F8F8F8',
  },
  dark: {
    primary: '#9CAF88', // Sage Green
    primaryDark: '#7A9268',
    background: '#2D2D2D', // Dark Charcoal
    text: '#F5F1E8', // Light Sand text
    textSecondary: '#AAAAAA',
    cardBackground: '#3D3D3D',
    secondary: '#555555',
    white: '#FFFFFF',
    lightGray: '#404040',
    charcoal: '#F5F1E8',
    shadow: '#000000',
    error: '#EF4444',
    // 12+ Corporate theme
    maturePrimary: '#5D7A51',
    matureText: '#F5F1E8',
    matureCardBackground: '#353535',
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
};

export const FontSizes = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 40,
};

export const FontWeights = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};

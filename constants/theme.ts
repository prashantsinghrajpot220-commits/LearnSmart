import { Colors as NewColors } from './colors';
import { Spacing as NewSpacing } from './spacing';

export const Colors = NewColors;

export const Spacing = NewSpacing;

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const FontSizes = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 20,
  xl: 24,
  '2xl': 28,
  xxl: 32,
  xxxl: 40,
};

export const FontWeights = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};

/**
 * Design tokens — Color
 * Dual-palette: Dark and Light theme (single source of truth).
 */

export const darkColors = {
  // Primary — Splitwise teal-green
  primary: '#1CC29F',
  primaryDark: '#138D74',
  primaryLight: 'rgba(28, 194, 159, 0.18)',

  // Semantic balance
  credit: '#20D9B2', // you are owed
  debt: '#FF6B6B', // you owe
  neutral: '#94A3B8',
  debtLight: 'rgba(255, 107, 107, 0.18)',

  // Surfaces — sleek dark navy / charcoal
  background: '#12161E',
  surface: '#1A202C',
  surfaceAlt: '#242D3D',
  border: '#2D3748',

  // Text
  textPrimary: '#F8FAFC',
  textSecondary: '#94A3B8',
  textOnPrimary: '#FFFFFF',

  // Status
  error: '#FF6B6B',
  warning: '#FBBF24',
  success: '#20D9B2',

  // Misc
  divider: '#262F3F',
  overlay: 'rgba(0, 0, 0, 0.75)',
};

export const lightColors = {
  // Primary — Splitwise teal-green matching dark theme
  primary: '#1CC29F',
  primaryDark: '#138D74',
  primaryLight: 'rgba(28, 194, 159, 0.14)',

  // Semantic balance
  credit: '#059669', // emerald-600
  debt: '#E11D48', // rose-600
  neutral: '#64748B',
  debtLight: 'rgba(225, 29, 72, 0.12)',

  // Surfaces — crisp clean light surfaces
  background: '#F8FAFC', // slate-50
  surface: '#FFFFFF', // pure white
  surfaceAlt: '#F1F5F9', // slate-100
  border: '#E2E8F0', // slate-200

  // Text
  textPrimary: '#0F172A', // slate-900
  textSecondary: '#64748B', // slate-500
  textOnPrimary: '#FFFFFF',

  // Status
  error: '#E11D48',
  warning: '#D97706',
  success: '#059669',

  // Misc
  divider: '#E2E8F0',
  overlay: 'rgba(15, 23, 42, 0.55)',
};

export type ColorPalette = typeof darkColors;
export type ColorToken = keyof ColorPalette;

/**
 * Mutable live color palette for backward-compatible static StyleSheet imports.
 * Updated synchronously whenever theme mode changes.
 */
export const colors: ColorPalette = { ...darkColors };

export function setGlobalThemeColors(mode: 'dark' | 'light') {
  Object.assign(colors, mode === 'light' ? lightColors : darkColors);
}

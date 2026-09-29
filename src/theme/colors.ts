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
  credit: '#20D9B2',
  creditLight: 'rgba(32, 217, 178, 0.16)',
  debt: '#FF6B6B',
  debtLight: 'rgba(255, 107, 107, 0.18)',
  neutral: '#94A3B8',
  neutralLight: 'rgba(148, 163, 184, 0.16)',
  settlement: '#2ED573',
  settlementLight: 'rgba(46, 213, 115, 0.16)',

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

  // Universal base colors
  white: '#FFFFFF',
  black: '#000000',
  shadow: '#000000',

  // Accent colors
  purple: '#8B5CF6',
  purpleLight: 'rgba(139, 92, 246, 0.16)',
  indigo: '#6366F1',
  indigoLight: 'rgba(99, 102, 241, 0.16)',
  blue: '#38BDF8',
  blueLight: 'rgba(56, 189, 248, 0.16)',
  gold: '#F59E0B',
  goldLight: 'rgba(245, 158, 11, 0.14)',

  // Surfaces & controls
  sheetSurface: '#161A22',
  switchTrackOff: '#334155',

  // Misc
  divider: '#262F3F',
  overlay: 'rgba(0, 0, 0, 0.75)',
  backdrop: 'rgba(0, 0, 0, 0.65)',

  transparent: 'transparent',
};

export const lightColors = {
  // Primary — Splitwise teal-green matching dark theme
  primary: '#1CC29F',
  primaryDark: '#138D74',
  primaryLight: 'rgba(28, 194, 159, 0.14)',

  // Semantic balance
  credit: '#059669',
  creditLight: 'rgba(5, 150, 105, 0.14)',
  debt: '#E11D48',
  debtLight: 'rgba(225, 29, 72, 0.12)',
  neutral: '#64748B',
  neutralLight: 'rgba(100, 116, 139, 0.14)',
  settlement: '#16A34A',
  settlementLight: 'rgba(22, 163, 74, 0.14)',

  // Surfaces — crisp clean light surfaces
  background: '#F8FAFC',
  surface: '#FFFFFF',
  surfaceAlt: '#F1F5F9',
  border: '#E2E8F0',

  // Text
  textPrimary: '#0F172A',
  textSecondary: '#64748B',
  textOnPrimary: '#FFFFFF',

  // Status
  error: '#E11D48',
  warning: '#D97706',
  success: '#059669',

  // Universal base colors
  white: '#FFFFFF',
  black: '#000000',
  shadow: '#000000',

  // Accent colors
  purple: '#8B5CF6',
  purpleLight: 'rgba(139, 92, 246, 0.12)',
  indigo: '#6366F1',
  indigoLight: 'rgba(99, 102, 241, 0.12)',
  blue: '#0284C7',
  blueLight: 'rgba(2, 132, 199, 0.14)',
  gold: '#D97706',
  goldLight: 'rgba(217, 119, 6, 0.14)',

  // Surfaces & controls
  sheetSurface: '#FFFFFF',
  switchTrackOff: '#CBD5E1',

  // Misc
  divider: '#E2E8F0',
  overlay: 'rgba(15, 23, 42, 0.55)',
  backdrop: 'rgba(0, 0, 0, 0.65)',

  transparent: 'transparent',
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

/**
 * Convert any hex color or rgb string to an rgba string with custom opacity.
 */
export function hexToRgba(color: string, alpha: number): string {
  if (color.startsWith('rgb')) {
    return color.replace(
      /rgba?\(([^,\)]+),([^,\)]+),([^,\)]+)(?:,[^\)]+)?\)/,
      `rgba($1,$2,$3, ${alpha})`,
    );
  }
  const cleanHex = color.replace('#', '');
  let r = 0;
  let g = 0;
  let b = 0;
  if (cleanHex.length === 3) {
    r = parseInt(cleanHex[0] + cleanHex[0], 16);
    g = parseInt(cleanHex[1] + cleanHex[1], 16);
    b = parseInt(cleanHex[2] + cleanHex[2], 16);
  } else if (cleanHex.length >= 6) {
    r = parseInt(cleanHex.substring(0, 2), 16);
    g = parseInt(cleanHex.substring(2, 4), 16);
    b = parseInt(cleanHex.substring(4, 6), 16);
  }
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

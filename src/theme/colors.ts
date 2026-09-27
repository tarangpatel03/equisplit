/**
 * Design tokens — Color
 * Dark theme palette (single source of truth).
 * Raw values for StyleSheet usage (no Tailwind/NativeWind).
 */

export const colors = {
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
} as const;

// Type helpers
export type ColorPalette = typeof colors;
export type ColorToken = keyof ColorPalette;


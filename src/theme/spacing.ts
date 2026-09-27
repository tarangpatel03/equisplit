/**
 * Design tokens — Spacing
 * 4px base unit scale, consistent across platforms.
 * Raw values for StyleSheet usage (no Tailwind/NativeWind).
 */

export const spacing = {
  // Base unit: 4px
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  7: 28,
  8: 32,
  9: 36,
  10: 40,
  11: 44,
  12: 48,
} as const;

// Semantic spacing aliases for common patterns
export const space = {
  none: spacing[0],
  xs: spacing[1],
  sm: spacing[2],
  md: spacing[4],
  lg: spacing[6],
  xl: spacing[8],
  '2xl': spacing[12],
} as const;

export type SpacingToken = keyof typeof spacing;
export type SemanticSpace = keyof typeof space;

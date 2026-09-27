/**
 * Design tokens — Border Radius
 * Consistent corner radius scale.
 */

export const borderRadius = {
  none: 0,
  xs: 2,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 24,
  full: 9999,
} as const;

// Semantic radius aliases
export const radius = {
  none: borderRadius.none,
  xs: borderRadius.xs,
  sm: borderRadius.sm,
  md: borderRadius.md,
  lg: borderRadius.lg,
  xl: borderRadius.xl,
  '2xl': borderRadius['2xl'],
  full: borderRadius.full,
} as const;

export type BorderRadiusToken = keyof typeof borderRadius;
export type SemanticRadius = keyof typeof radius;

/**
 * Design tokens — Index
 * Single entry point for all design tokens.
 */

export * from './colors';
export * from './spacing';
export * from './typography';
export * from './borderRadius';
export * from './useAppTheme';

// Token registry for programmatic access
import {
  borderRadius,
  BorderRadiusToken,
  radius,
  SemanticRadius,
} from './borderRadius';
import { ColorPalette, colors } from './colors';
import { SemanticSpace, space, spacing, SpacingToken } from './spacing';
import { fontFamily, fonts, fontWeight, resolveFontFamily } from './typography';

export const tokens = {
  colors,
  spacing,
  space,
  fonts,
  fontFamily,
  fontWeight,
  resolveFontFamily,
  borderRadius,
  radius,
} as const;

// Theme shape for TypeScript
export type Theme = typeof tokens;

export default tokens;

// Re-export types
export type {
  ColorPalette,
  SpacingToken,
  SemanticSpace,
  BorderRadiusToken,
  SemanticRadius,
};

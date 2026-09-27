/**
 * Design tokens — Typography
 * Custom font families: Manrope (default), IBM Plex Sans (numeric).
 * Each weight maps to its exact .ttf filename (required by Android).
 */

/** Font file names (without extension), matching assets/fonts/*.ttf. */
export const fonts = {
  manrope: {
    light: 'Manrope-Light',
    regular: 'Manrope-Regular',
    medium: 'Manrope-Medium',
    semiBold: 'Manrope-SemiBold',
    bold: 'Manrope-Bold',
  },
  ibmPlexSans: {
    light: 'IBMPlexSans-Light',
    regular: 'IBMPlexSans-Regular',
    medium: 'IBMPlexSans-Medium',
    semiBold: 'IBMPlexSans-SemiBold',
    bold: 'IBMPlexSans-Bold',
  },
} as const;

const MANROPE_WEIGHT_MAP: Record<string, string> = {
  '300': fonts.manrope.light,
  '400': fonts.manrope.regular,
  normal: fonts.manrope.regular,
  '500': fonts.manrope.medium,
  '600': fonts.manrope.semiBold,
  '700': fonts.manrope.bold,
  bold: fonts.manrope.bold,
};

const IBM_PLEX_WEIGHT_MAP: Record<string, string> = {
  '300': fonts.ibmPlexSans.light,
  '400': fonts.ibmPlexSans.regular,
  normal: fonts.ibmPlexSans.regular,
  '500': fonts.ibmPlexSans.medium,
  '600': fonts.ibmPlexSans.semiBold,
  '700': fonts.ibmPlexSans.bold,
  bold: fonts.ibmPlexSans.bold,
};

/**
 * Resolve the correct font file name for the given weight.
 * @param weight - CSS-style font weight ('300'–'700', 'normal', 'bold').
 * @param numeric - When true, returns IBM Plex Sans; otherwise Manrope.
 */
export function resolveFontFamily(
  weight: string = '400',
  numeric: boolean = false,
): string {
  const map = numeric ? IBM_PLEX_WEIGHT_MAP : MANROPE_WEIGHT_MAP;
  return (
    map[weight] ??
    (numeric ? fonts.ibmPlexSans.regular : fonts.manrope.regular)
  );
}

// Named semantic roles (kept for token registry compatibility)
export const fontFamily = {
  system: {
    sans: fonts.manrope.regular,
    mono: 'monospace',
    rounded: fonts.manrope.regular,
  },
  heading: fonts.manrope.bold,
  body: fonts.manrope.regular,
  caption: fonts.manrope.regular,
  button: fonts.manrope.semiBold,
  input: fonts.manrope.regular,
  display: fonts.manrope.bold,
  numeric: fonts.ibmPlexSans.regular,
} as const;

// Font weights
export const fontWeight = {
  thin: '100',
  extralight: '200',
  light: '300',
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  extrabold: '800',
  black: '900',
} as const;


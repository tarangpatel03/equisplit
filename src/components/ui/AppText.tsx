import { FC, ReactNode } from 'react';
import { StyleSheet, Text, TextProps, TextStyle } from 'react-native';

import { colors, resolveFontFamily } from '@/theme';

type Props = TextProps & {
  /** Force numeric font (IBM Plex Sans). Auto-detected from children if not set. */
  numeric?: boolean;
};

/** Extract plain text from React children for numeric detection. */
function extractText(children: ReactNode): string {
  if (typeof children === 'string') return children;
  if (typeof children === 'number') return String(children);
  if (Array.isArray(children)) return children.map(extractText).join('');
  return '';
}

/**
 * Check if text content is primarily numeric.
 * Matches digits, currency symbols (₹$€£¥), math operators (+−-), decimals,
 * commas, colons, and percent signs.
 */
function isNumericContent(children: ReactNode): boolean {
  const text = extractText(children);
  if (!text) return false;

  const stripped = text.replace(/\s/g, '');
  if (stripped.length === 0) return false;

  // Must contain at least one digit
  if (!/\d/.test(stripped)) return false;

  // Count non-numeric characters
  const nonNumeric = stripped.replace(/[0-9₹$€£¥+\-.,:%]/g, '');
  return nonNumeric.length / stripped.length < 0.3;
}

export const AppText: FC<Props> = ({ children, style, numeric, ...rest }) => {
  const flatStyle = StyleSheet.flatten(style) as TextStyle | undefined;
  const weight = String(flatStyle?.fontWeight ?? '400');

  const useNumericFont = numeric ?? isNumericContent(children);
  const fontFamily = resolveFontFamily(weight, useNumericFont);

  return (
    <Text
      {...rest}
      style={[styles.text, style, { fontFamily, fontWeight: undefined }]}
    >
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    color: colors.textPrimary,
  },
});

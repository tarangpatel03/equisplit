import { StyleSheet } from 'react-native';

import { colors, radius, space } from '@/theme';

export const styles = StyleSheet.create({
  container: {
    padding: space.md,
  },
  appInfoSection: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: space.md,
    marginBottom: space.lg,
    gap: space.xs,
  },
  appLogo: {
    width: 44,
    height: 44,
    borderRadius: radius.sm,
    marginBottom: 4,
  },
  appName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: -0.2,
  },
  appVersion: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  appTagline: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 2,
  },
});

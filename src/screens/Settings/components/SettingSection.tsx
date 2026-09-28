import React, { FC, ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { colors, radius, space, useAppTheme } from '@/theme';

type Props = {
  title?: string;
  children: ReactNode;
};

export const SettingSection: FC<Props> = ({ title, children }) => {
  const { colors: themeColors } = useAppTheme();

  return (
    <View style={styles.container}>
      {title ? (
        <AppText style={[styles.title, { color: themeColors.textSecondary }]}>
          {title}
        </AppText>
      ) : null}
      <View
        style={[
          styles.card,
          {
            backgroundColor: themeColors.surface,
            borderColor: themeColors.border,
          },
        ]}
      >
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: space.lg,
  },
  title: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: space.xs + 2,
    marginLeft: space.xs,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
});

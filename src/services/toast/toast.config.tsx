import React, { FC } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import { CircleAlert, CircleCheck, Info } from 'lucide-react-native';

import { AppText } from '@/components/ui/AppText';
import { colors, hexToRgba, radius, space } from '@/theme';
import { normalize } from '@/utils';

type ToastType = 'success' | 'error' | 'info';

type ToastVariantConfig = {
  accent: string;
  badgeBg: string;
  borderColor: string;
  Icon: FC<{ size?: number; color?: string; strokeWidth?: number }>;
};

const VARIANT_CONFIG: Record<ToastType, ToastVariantConfig> = {
  success: {
    accent: colors.credit,
    badgeBg: colors.primaryLight,
    borderColor: hexToRgba(colors.credit, 0.28),
    Icon: CircleCheck,
  },
  error: {
    accent: colors.error,
    badgeBg: colors.debtLight,
    borderColor: hexToRgba(colors.error, 0.28),
    Icon: CircleAlert,
  },
  info: {
    accent: colors.blue,
    badgeBg: colors.blueLight,
    borderColor: hexToRgba(colors.blue, 0.28),
    Icon: Info,
  },
};

type BaseToastProps = {
  text1?: string;
  text2?: string;
  type: ToastType;
};

const BaseToast: FC<BaseToastProps> = ({ text1, text2, type }) => {
  const { width } = useWindowDimensions();
  const config = VARIANT_CONFIG[type] ?? VARIANT_CONFIG.info;
  const { Icon } = config;

  return (
    <View
      style={[
        styles.container,
        {
          width: width - space.md * 2,
          borderColor: config.borderColor,
        },
      ]}
    >
      {/* Left status accent strip */}
      <View style={[styles.accentStrip, { backgroundColor: config.accent }]} />

      <View style={styles.body}>
        {/* Themed Icon Capsule */}
        <View style={[styles.iconCapsule, { backgroundColor: config.badgeBg }]}>
          <Icon size={normalize(18)} color={config.accent} strokeWidth={2.4} />
        </View>

        {/* Text Content */}
        <View style={styles.textContainer}>
          {Boolean(text1) && (
            <AppText style={styles.title} numberOfLines={2}>
              {text1}
            </AppText>
          )}
          {Boolean(text2) && (
            <AppText style={styles.subtitle} numberOfLines={2}>
              {text2}
            </AppText>
          )}
        </View>
      </View>
    </View>
  );
};

export let bottomInset = 0;

export const setToastBottomInset = (value: number) => {
  bottomInset = value;
};

export const toastConfig = {
  success: (props: any) => <BaseToast {...props} type={'success'} />,
  error: (props: any) => <BaseToast {...props} type={'error'} />,
  info: (props: any) => <BaseToast {...props} type={'info'} />,
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    borderWidth: 1,
    overflow: 'hidden',
    alignSelf: 'center',

    // Android elevation
    elevation: 8,

    // iOS shadow
    shadowColor: colors.shadow,
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },
  accentStrip: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
  },
  body: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: normalize(12),
    paddingHorizontal: space.md,
    paddingLeft: space.md + 4,
    gap: space.md,
  },
  iconCapsule: {
    width: normalize(34),
    height: normalize(34),
    borderRadius: normalize(17),
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: normalize(14),
    fontWeight: '600',
    color: colors.textPrimary,
    lineHeight: normalize(19),
  },
  subtitle: {
    fontSize: normalize(12),
    color: colors.textSecondary,
    marginTop: 2,
    lineHeight: normalize(16),
  },
});
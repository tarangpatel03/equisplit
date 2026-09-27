import React from 'react';
import { StyleSheet, View } from 'react-native';

import { normalize } from '@/utils';
import { AppText } from '@/components/ui/AppText';

const toastColors = {
  success: {
    primary: '#22C55E',
    background: '#052E1B',
    text: '#86EFAC',
  },
  error: {
    primary: '#EF4444',
    background: '#2B0B0B',
    text: '#FCA5A5',
  },
  info: {
    primary: '#3B82F6',
    background: '#0A1A33',
    text: '#93C5FD',
  },
};

const BaseToast = ({
  text1,
  type,
}: {
  text1: string;
  type: 'success' | 'error' | 'info';
}) => {
  const getStyle = () => {
    switch (type) {
      case 'success':
        return styles.successContainer;
      case 'error':
        return styles.errorContainer;
      case 'info':
        return styles.infoContainer;
      default:
        break;
    }
  };

  const getTextStyle = () => {
    switch (type) {
      case 'success':
        return styles.successText;
      case 'error':
        return styles.errorText;
      case 'info':
        return styles.infoText;
      default:
        break;
    }
  };

  return (
    <View style={[styles.container, getStyle()]}>
      <View style={styles.content}>
        <AppText style={[styles.text, getTextStyle()]}>{text1}</AppText>
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
    width: '90%',
    borderRadius: 12,
    padding: normalize(12),
    borderLeftWidth: 4,
    alignSelf: 'center',

    // Android elevation
    elevation: 4,

    // iOS shadow
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontSize: normalize(14),
    fontWeight: '500',
  },
  successContainer: {
    backgroundColor: toastColors.success.background,
    borderLeftColor: toastColors.success.primary,
  },
  errorContainer: {
    backgroundColor: toastColors.error.background,
    borderLeftColor: toastColors.error.primary,
  },
  infoContainer: {
    backgroundColor: toastColors.info.background,
    borderLeftColor: toastColors.info.primary,
  },
  successText: {
    color: toastColors.success.text,
  },
  errorText: {
    color: toastColors.error.text,
  },
  infoText: {
    color: toastColors.info.text,
  },
});

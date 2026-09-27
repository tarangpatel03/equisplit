import Toast from 'react-native-toast-message';

import { normalize } from '@/utils';

import { bottomInset } from './toast.config';

export const showSuccessToast = (message: string) => {
  Toast.show({
    type: 'success',
    text1: message,
    position: 'bottom',
    bottomOffset: bottomInset + 16,
    visibilityTime: 1500,
    text1Style: {
      fontWeight: '400',
      fontSize: normalize(16),
    },
  });
};

export const showInfoToast = (message: string) => {
  Toast.show({
    type: 'info',
    text1: message,
    position: 'bottom',
    bottomOffset: bottomInset + 16,
    visibilityTime: 1500,
    text1Style: {
      fontWeight: '400',
      fontSize: normalize(16),
    },
  });
};

export const showErrorToast = (message: string) => {
  Toast.show({
    type: 'error',
    text1: message,
    position: 'bottom',
    bottomOffset: bottomInset + 16,
    visibilityTime: 1500,
    text1Style: {
      fontWeight: '400',
      fontSize: normalize(16),
    },
  });
};

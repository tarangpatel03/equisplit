import Toast from 'react-native-toast-message';

import { bottomInset } from './toast.config';

export const showSuccessToast = (message: string, subtitle?: string) => {
  Toast.show({
    type: 'success',
    text1: message,
    text2: subtitle,
    position: 'bottom',
    bottomOffset: bottomInset + 20,
    visibilityTime: 2000,
  });
};

export const showInfoToast = (message: string, subtitle?: string) => {
  Toast.show({
    type: 'info',
    text1: message,
    text2: subtitle,
    position: 'bottom',
    bottomOffset: bottomInset + 20,
    visibilityTime: 2000,
  });
};

export const showErrorToast = (message: string, subtitle?: string) => {
  Toast.show({
    type: 'error',
    text1: message,
    text2: subtitle,
    position: 'bottom',
    bottomOffset: bottomInset + 20,
    visibilityTime: 2500,
  });
};
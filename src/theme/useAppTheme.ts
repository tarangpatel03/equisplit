import { useSelector } from 'react-redux';

import { RootState } from '@/store/store';
import { ColorPalette, darkColors, lightColors } from './colors';

export function useAppTheme(): {
  mode: 'dark' | 'light';
  isDark: boolean;
  colors: ColorPalette;
} {
  const mode = useSelector((s: RootState) => s.theme?.mode ?? 'dark');
  const isDark = mode === 'dark';

  return {
    mode,
    isDark,
    colors: isDark ? darkColors : lightColors,
  };
}

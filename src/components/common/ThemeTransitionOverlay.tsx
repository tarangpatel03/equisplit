import { memo, useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet } from 'react-native';

import { darkColors, lightColors } from '@/theme';

type TransitionCallback = () => void;
type TransitionHandler = (
  targetMode: 'dark' | 'light',
  onApply: TransitionCallback,
) => void;

let activeHandler: TransitionHandler | null = null;

export function registerThemeTransition(handler: TransitionHandler | null) {
  activeHandler = handler;
}

export function executeThemeTransition(
  targetMode: 'dark' | 'light',
  onApply: TransitionCallback,
) {
  if (activeHandler) {
    activeHandler(targetMode, onApply);
  } else {
    onApply();
  }
}

/**
 * Full-screen hardware-accelerated transition overlay that smoothly cross-fades
 * between dark and light themes when the user switches themes, preventing abrupt color snaps.
 */
export const ThemeTransitionOverlay = memo(() => {
  const [overlayColor, setOverlayColor] = useState<string>('transparent');
  const [visible, setVisible] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    registerThemeTransition((targetMode, onApply) => {
      const targetBg =
        targetMode === 'dark' ? darkColors.background : lightColors.background;

      setOverlayColor(targetBg);
      setVisible(true);
      fadeAnim.setValue(0);

      // Phase 1: Smoothly fade in target theme background (0 -> 1)
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        easing: Easing.inOut(Easing.cubic),
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (!finished) return;

        // Phase 2: Under full cover, apply the theme change synchronously
        onApply();

        // Phase 3: Smoothly dissolve out to reveal the new theme components (1 -> 0)
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 260,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }).start(() => {
          setVisible(false);
        });
      });
    });

    return () => {
      registerThemeTransition(null);
    };
  }, [fadeAnim]);

  if (!visible) return null;

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.overlay,
        {
          backgroundColor: overlayColor,
          opacity: fadeAnim,
        },
      ]}
    />
  );
});

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    zIndex: 999999,
    elevation: 999999,
  },
});

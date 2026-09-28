import { memo, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, View } from 'react-native';
import { Plus, Users, Wallet } from 'lucide-react-native';

import { colors, radius, space } from '@/theme';

type Props = {
  onSelectPersonal: () => void;
  onSelectGroup: () => void;
};

// Distinct semantic accent colors for the two actions
const ACTION_COLORS = {
  group: colors.primary, // #1CC29F Splitwise teal for group splits
  personal: '#8B5CF6', // Vibrant purple for personal wallet/expenses
};

export const HomeSpeedDialFab = memo(
  ({ onSelectPersonal, onSelectGroup }: Props) => {
    const [isOpen, setIsOpen] = useState(false);
    const animValue = useRef(new Animated.Value(0)).current;

    const toggleOpen = () => {
      const nextOpen = !isOpen;
      setIsOpen(nextOpen);

      if (nextOpen) {
        Animated.spring(animValue, {
          toValue: 1,
          friction: 6,
          tension: 48,
          useNativeDriver: true,
        }).start();
      } else {
        Animated.timing(animValue, {
          toValue: 0,
          duration: 180,
          useNativeDriver: true,
        }).start();
      }
    };

    const handleClose = () => {
      setIsOpen(false);
      Animated.timing(animValue, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }).start();
    };

    const handlePressPersonal = () => {
      handleClose();
      onSelectPersonal();
    };

    const handlePressGroup = () => {
      handleClose();
      onSelectGroup();
    };

    // Interpolations for main FAB rotation (+ into ×)
    const plusRotation = animValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '45deg'],
    });

    // Interpolations for TOP button (Group expense — pops upward)
    const topTranslateY = animValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, -68],
    });
    const topScale = animValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0.3, 1],
    });
    const topOpacity = animValue.interpolate({
      inputRange: [0, 0.3, 1],
      outputRange: [0, 0, 1],
    });

    // Interpolations for LEFT button (Personal expense — pops leftward)
    const leftTranslateX = animValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, -68],
    });
    const leftScale = animValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0.3, 1],
    });
    const leftOpacity = animValue.interpolate({
      inputRange: [0, 0.3, 1],
      outputRange: [0, 0, 1],
    });

    return (
      <>
        {/* Semi-transparent Backdrop when open to dismiss on outside tap */}
        {isOpen && <Pressable style={styles.backdrop} onPress={handleClose} />}

        <View style={styles.container} pointerEvents="box-none">
          {/* Top Button: Group Expense (Teal with Users icon) */}
          <Animated.View
            style={[
              styles.actionItemTop,
              {
                opacity: topOpacity,
                transform: [{ translateY: topTranslateY }, { scale: topScale }],
              },
            ]}
            pointerEvents={isOpen ? 'auto' : 'none'}
          >
            <Pressable
              style={({ pressed }) => [
                styles.subFabCircle,
                styles.groupFab,
                pressed && styles.subFabPressed,
              ]}
              onPress={handlePressGroup}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel="Add group expense"
            >
              <Users size={22} color={colors.textOnPrimary} strokeWidth={2.4} />
            </Pressable>
          </Animated.View>

          {/* Left Button: Personal Expense (Purple with Wallet icon) */}
          <Animated.View
            style={[
              styles.actionItemLeft,
              {
                opacity: leftOpacity,
                transform: [
                  { translateX: leftTranslateX },
                  { scale: leftScale },
                ],
              },
            ]}
            pointerEvents={isOpen ? 'auto' : 'none'}
          >
            <Pressable
              style={({ pressed }) => [
                styles.subFabCircle,
                styles.personalFab,
                pressed && styles.subFabPressed,
              ]}
              onPress={handlePressPersonal}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel="Add personal expense"
            >
              <Wallet
                size={21}
                color={colors.textOnPrimary}
                strokeWidth={2.4}
              />
            </Pressable>
          </Animated.View>

          {/* Main FAB (+ button that rotates into ×) */}
          <Pressable
            style={({ pressed }) => [
              styles.mainFab,
              pressed && styles.mainFabPressed,
            ]}
            onPress={toggleOpen}
            hitSlop={6}
            accessibilityRole="button"
            accessibilityLabel={isOpen ? 'Close menu' : 'Add expense options'}
          >
            <Animated.View style={{ transform: [{ rotate: plusRotation }] }}>
              <Plus size={26} color={colors.textOnPrimary} strokeWidth={2.8} />
            </Animated.View>
          </Pressable>
        </View>
      </>
    );
  },
);

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(18, 22, 30, 0.45)',
    zIndex: 90,
  },
  container: {
    position: 'absolute',
    bottom: space.xl,
    right: space.md,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
  },
  mainFab: {
    width: 56,
    height: 56,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 8,
  },
  mainFabPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.95 }],
  },
  actionItemTop: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    right: 4,
  },
  actionItemLeft: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    bottom: 4,
  },
  subFabCircle: {
    width: 48,
    height: 48,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.22)',
  },
  subFabPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.93 }],
  },
  groupFab: {
    backgroundColor: ACTION_COLORS.group,
  },
  personalFab: {
    backgroundColor: ACTION_COLORS.personal,
  },
});

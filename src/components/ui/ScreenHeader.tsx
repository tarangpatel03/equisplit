import { Image, Pressable, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { assets } from '@/assets';
import { navigateBack } from '@/navigation/navigation.service';
import { colors, radius, space } from '@/theme';

import { AppText } from './AppText';

export const ScreenHeader = ({
  screenTitle,
  rightAction,
  showBackButton,
}: {
  screenTitle: string;
  rightAction?: React.ReactNode;
  showBackButton?: boolean;
}) => {
  const navigation = useNavigation();
  const canGoBack = (() => {
    if (showBackButton !== undefined) {
      return showBackButton;
    }
    try {
      const state = navigation.getState();
      if (state?.type === 'tab') {
        return false;
      }
      return navigation.canGoBack();
    } catch {
      return false;
    }
  })();

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigateBack();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.leftContainer}>
        {canGoBack && (
          <Pressable
            style={styles.backButton}
            onPress={handleBack}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Image source={assets.icons.ic_back} style={styles.backIcon} />
          </Pressable>
        )}
        <Image
          source={assets.icons.ic_app_logo}
          style={styles.appLogo}
          resizeMode="contain"
        />
        <AppText style={styles.headerText} numberOfLines={1}>
          {screenTitle}
        </AppText>
      </View>
      {rightAction ? (
        <View style={styles.rightActionContainer}>{rightAction}</View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: space.md,
    paddingVertical: space.sm + 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs + 3,
    flex: 1,
  },
  backButton: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 2,
  },
  backIcon: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
    tintColor: colors.primary,
  },
  appLogo: {
    width: 26,
    height: 26,
    borderRadius: radius.xs,
  },
  headerText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: -0.2,
    flexShrink: 1,
  },
  rightActionContainer: {
    minWidth: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: space.sm,
  },
});

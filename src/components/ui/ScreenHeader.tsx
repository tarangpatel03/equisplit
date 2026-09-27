import { Image, Pressable, StyleSheet, View } from 'react-native';

import { assets } from '@/assets';
import { navigateBack } from '@/navigation/navigation.service';
import { colors } from '@/theme';
import { normalize } from '@/utils/normalize';

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
  return (
    <View style={styles.container}>
      {showBackButton ? (
        <Pressable style={styles.backButton} onPress={navigateBack} hitSlop={8}>
          <Image source={assets.icons.ic_back} style={styles.backIcon} />
        </Pressable>
      ) : (
        <View style={styles.backIcon} />
      )}
      <AppText style={styles.headerText}>{screenTitle}</AppText>
      {rightAction ? (
        <View style={styles.rightActionContainer}>{rightAction}</View>
      ) : (
        <View style={styles.backIcon} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: normalize(12),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  backButton: {
    width: normalize(28),
    height: normalize(28),
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    fontSize: normalize(18),
    fontWeight: '700',
    color: colors.textPrimary,
  },
  backIcon: {
    width: normalize(16),
    height: normalize(16),
    resizeMode: 'contain',
  },
  rightActionContainer: {
    minWidth: normalize(28),
    height: normalize(28),
    alignItems: 'center',
    justifyContent: 'center',
  },
});

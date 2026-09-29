import { FC } from 'react';
import { View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { AppText } from '@/components/ui/AppText';

import { styles } from '../styles';
import { OnboardingSlide } from '../types';

type Props = {
  slide: OnboardingSlide;
};

export const SlideItem: FC<Props> = ({ slide }) => {
  const { Icon, gradientColors, badge, title, description } = slide;

  return (
    <View style={styles.slideItem}>
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.iconCard}
      >
        <Icon size={44} color="#FFFFFF" strokeWidth={2.2} />
      </LinearGradient>

      <View style={styles.badge}>
        <AppText style={styles.badgeText}>{badge}</AppText>
      </View>

      <AppText style={styles.title}>{title}</AppText>
      <AppText style={styles.description}>{description}</AppText>
    </View>
  );
};

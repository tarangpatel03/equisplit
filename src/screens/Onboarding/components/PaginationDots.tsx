import { FC } from 'react';
import { Pressable, View } from 'react-native';

import { styles } from '../styles';

type Props = {
  total: number;
  currentIndex: number;
  onDotPress?: (index: number) => void;
};

export const PaginationDots: FC<Props> = ({
  total,
  currentIndex,
  onDotPress,
}) => {
  return (
    <View style={styles.dotsContainer}>
      {Array.from({ length: total }).map((_, index) => {
        const isActive = index === currentIndex;
        return (
          <Pressable
            key={`dot-${index}`}
            onPress={() => onDotPress?.(index)}
            hitSlop={8}
            style={[
              styles.dot,
              isActive ? styles.dotActive : styles.dotInactive,
            ]}
          />
        );
      })}
    </View>
  );
};

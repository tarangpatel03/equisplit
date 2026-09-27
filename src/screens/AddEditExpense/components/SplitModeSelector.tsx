import { FC } from 'react';
import { Pressable, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { SplitMode } from '@/types';

import { styles } from '../styles';

type Props = {
  selectedMode: SplitMode;
  onSelectMode: (mode: SplitMode) => void;
};

const MODES: { key: SplitMode; label: string }[] = [
  { key: 'equally', label: 'Equally' },
  { key: 'shares', label: 'Shares' },
  { key: 'perItem', label: 'Per Item' },
  { key: 'amount', label: 'Amount' },
];

export const SplitModeSelector: FC<Props> = ({
  selectedMode,
  onSelectMode,
}) => {
  return (
    <View style={styles.modeContainer}>
      {MODES.map(item => {
        const isActive = selectedMode === item.key;
        return (
          <Pressable
            key={item.key}
            style={[styles.modeTab, isActive && styles.modeTabActive]}
            onPress={() => onSelectMode(item.key)}
          >
            <AppText
              style={[styles.modeTabText, isActive && styles.modeTabTextActive]}
            >
              {item.label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
};

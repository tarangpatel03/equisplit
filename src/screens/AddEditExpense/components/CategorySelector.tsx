import { FC } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { useSelector } from 'react-redux';

import { CategoryIcon } from '@/components/common';
import { AppText } from '@/components/ui/AppText';
import { RootState } from '@/store/store';
import { ExpenseCategory } from '@/types';

import { styles } from '../styles';

type Props = {
  selectedCategoryId: string;
  onSelectCategory: (category: ExpenseCategory) => void;
};

export const CategorySelector: FC<Props> = ({
  selectedCategoryId,
  onSelectCategory,
}) => {
  const categories = useSelector((s: RootState) => s.categories.categories);

  return (
    <View style={styles.categoryContainer}>
      <AppText style={styles.categoryLabel}>{'Category'}</AppText>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryScroll}
      >
        {categories.map(cat => {
          const isActive = selectedCategoryId === cat.id;
          return (
            <Pressable
              key={cat.id}
              style={[
                styles.categoryChip,
                isActive && styles.categoryChipActive,
              ]}
              onPress={() => onSelectCategory(cat)}
            >
              <CategoryIcon
                iconKey={cat.iconKey}
                size={18}
                color={cat.color}
                strokeWidth={2}
              />
              <AppText
                style={[
                  styles.categoryText,
                  isActive && styles.categoryTextActive,
                ]}
              >
                {cat.name}
              </AppText>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
};

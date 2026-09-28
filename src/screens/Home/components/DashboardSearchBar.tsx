import { FC, memo } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { Search, X } from 'lucide-react-native';

import { AppText } from '@/components/ui/AppText';
import { colors, radius, space, useAppTheme } from '@/theme';
import { ExpenseCategory } from '@/types';

type Props = {
  searchQuery: string;
  onChangeSearch: (query: string) => void;
  selectedCategoryId: string | null;
  onSelectCategory: (catId: string | null) => void;
  categories: ExpenseCategory[];
};

export const DashboardSearchBar: FC<Props> = memo(
  ({
    searchQuery,
    onChangeSearch,
    selectedCategoryId,
    onSelectCategory,
    categories,
  }) => {
    const { colors: themeColors } = useAppTheme();

    return (
      <View style={styles.container}>
        {/* Search Input Bar */}
        <View
          style={[
            styles.inputBox,
            {
              backgroundColor: themeColors.surface,
              borderColor: themeColors.border,
            },
          ]}
        >
          <Search size={16} color={themeColors.textSecondary} strokeWidth={2.2} />
          <TextInput
            style={[styles.input, { color: themeColors.textPrimary }]}
            placeholder="Search by title, note, or payer..."
            placeholderTextColor={themeColors.textSecondary}
            value={searchQuery}
            onChangeText={onChangeSearch}
            returnKeyType="search"
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <Pressable
              onPress={() => onChangeSearch('')}
              hitSlop={8}
              style={styles.clearBtn}
            >
              <X size={14} color={themeColors.textSecondary} />
            </Pressable>
          )}
        </View>

        {/* Category Filter Chips */}
        {categories.length > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryScroll}
          >
            {/* "All" Chip */}
            <Pressable
              style={[
                styles.categoryChip,
                {
                  backgroundColor: themeColors.surface,
                  borderColor: themeColors.border,
                },
                selectedCategoryId === null && {
                  backgroundColor: themeColors.primaryLight,
                  borderColor: themeColors.primary,
                },
              ]}
              onPress={() => onSelectCategory(null)}
            >
              <AppText
                style={[
                  styles.categoryChipText,
                  { color: themeColors.textSecondary },
                  selectedCategoryId === null && {
                    color: themeColors.primary,
                    fontWeight: '700',
                  },
                ]}
              >
                {'All'}
              </AppText>
            </Pressable>

            {/* Individual Category Chips */}
            {categories.map(cat => {
              const isSelected = selectedCategoryId === cat.id;
              return (
                <Pressable
                  key={cat.id}
                  style={[
                    styles.categoryChip,
                    {
                      backgroundColor: themeColors.surface,
                      borderColor: themeColors.border,
                    },
                    isSelected && {
                      backgroundColor: themeColors.primaryLight,
                      borderColor: themeColors.primary,
                    },
                  ]}
                  onPress={() =>
                    onSelectCategory(isSelected ? null : cat.id)
                  }
                >
                  <View
                    style={[styles.colorDot, { backgroundColor: cat.color }]}
                  />
                  <AppText
                    style={[
                      styles.categoryChipText,
                      { color: themeColors.textSecondary },
                      isSelected && {
                        color: themeColors.primary,
                        fontWeight: '700',
                      },
                    ]}
                  >
                    {cat.name}
                  </AppText>
                </Pressable>
              );
            })}
          </ScrollView>
        )}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: space.md,
    marginBottom: space.xs + 2,
    gap: space.xs + 2,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs + 4,
    backgroundColor: colors.surface,
    borderRadius: radius.full,
    paddingHorizontal: space.md,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  input: {
    flex: 1,
    fontSize: 13,
    color: colors.textPrimary,
    paddingVertical: 0,
  },
  clearBtn: {
    padding: 2,
  },
  categoryScroll: {
    gap: space.xs,
    paddingVertical: 2,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: space.sm + 2,
    paddingVertical: 5,
    borderRadius: radius.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryChipActive: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  colorDot: {
    width: 7,
    height: 7,
    borderRadius: radius.full,
  },
  categoryChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  categoryChipTextActive: {
    color: colors.primary,
    fontWeight: '700',
  },
});

import { FC } from 'react';
import { FlatList, Modal, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';

import { CategoryIcon } from '@/components/common';
import { AppText } from '@/components/ui/AppText';
import { getCategoryBgColor, getCategoryById } from '@/config';
import { RootState } from '@/store/store';
import { colors, radius, space, useAppTheme } from '@/theme';
import { ExpenseCategory } from '@/types';

type Props = {
  visible: boolean;
  selectedCategoryId: string;
  onSelectCategory: (category: ExpenseCategory) => void;
  onClose: () => void;
};

export const CategoryModal: FC<Props> = ({
  visible,
  selectedCategoryId,
  onSelectCategory,
  onClose,
}) => {
  const { colors: themeColors } = useAppTheme();
  const insets = useSafeAreaInsets();
  const categories = useSelector((s: RootState) => s.categories.categories);

  const selectedCategory = getCategoryById(selectedCategoryId, categories);

  const handleSelect = (cat: ExpenseCategory) => {
    onSelectCategory(cat);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />

        <View
          style={[
            styles.sheet,
            {
              backgroundColor: themeColors.surface,
              borderTopColor: themeColors.border,
              paddingBottom: Math.max(insets.bottom, space.md),
            },
          ]}
        >
          {/* Top Handle */}
          <View
            style={[styles.handleBar, { backgroundColor: themeColors.border }]}
          />

          {/* Header Row */}
          <View style={styles.header}>
            <Pressable
              onPress={onClose}
              hitSlop={10}
              style={[
                styles.closeBtn,
                { backgroundColor: themeColors.surfaceAlt },
              ]}
            >
              <AppText
                style={[styles.closeText, { color: themeColors.textSecondary }]}
              >
                {'✕'}
              </AppText>
            </Pressable>
            <View style={styles.titleContainer}>
              <AppText
                style={[styles.title, { color: themeColors.textPrimary }]}
              >
                {'Select Category'}
              </AppText>
              <AppText
                style={[styles.subtitle, { color: themeColors.textSecondary }]}
              >
                {selectedCategory
                  ? selectedCategory.name
                  : 'No category selected'}
              </AppText>
            </View>
            <View style={styles.closePlaceholder} />
          </View>

          {/* Categories List */}
          <FlatList
            data={categories}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => {
              const isSelected = item.id === selectedCategoryId;
              return (
                <Pressable
                  style={({ pressed }) => [
                    styles.itemRow,
                    isSelected && [
                      styles.itemRowSelected,
                      { backgroundColor: themeColors.surfaceAlt },
                    ],
                    pressed && styles.itemRowPressed,
                  ]}
                  onPress={() => handleSelect(item)}
                >
                  <View
                    style={[
                      styles.itemIconContainer,
                      {
                        backgroundColor: getCategoryBgColor(item.color, 0.16),
                      },
                    ]}
                  >
                    <CategoryIcon
                      iconKey={item.iconKey}
                      size={22}
                      color={item.color}
                      strokeWidth={2}
                    />
                  </View>
                  <AppText
                    style={[
                      styles.itemName,
                      { color: themeColors.textPrimary },
                      isSelected && styles.itemNameSelected,
                    ]}
                  >
                    {item.name}
                  </AppText>
                </Pressable>
              );
            }}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <AppText
                  style={[
                    styles.emptyText,
                    { color: themeColors.textSecondary },
                  ]}
                >
                  {'No categories found'}
                </AppText>
              </View>
            }
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'flex-end',
  },
  backdrop: {
    flex: 1,
  },
  sheet: {
    backgroundColor: '#161A22',
    borderTopLeftRadius: radius['2xl'],
    borderTopRightRadius: radius['2xl'],
    borderWidth: 1,
    borderColor: colors.border,
    maxHeight: '80%',
    borderTopWidth: 1,
    width: '100%',
    alignSelf: 'center',
    paddingTop: space.sm,
  },
  handleBar: {
    width: 36,
    height: 4,
    borderRadius: radius.full,
    backgroundColor: colors.border,
    alignSelf: 'center',
    marginBottom: space.xs,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: space.md,
    paddingVertical: space.xs,
    position: 'relative',
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  titleContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  closePlaceholder: {
    width: 32,
    height: 32,
  },
  listContent: {
    paddingHorizontal: space.md,
    paddingTop: space.sm,
    paddingBottom: space.md,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: space.sm + 2,
    paddingHorizontal: space.sm,
    borderRadius: radius.md,
    marginBottom: 2,
  },
  itemRowSelected: {
    backgroundColor: colors.surfaceAlt,
  },
  itemRowPressed: {
    opacity: 0.7,
  },
  itemIconContainer: {
    width: 40,
    height: 40,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: space.sm,
  },
  itemIcon: {
    width: 26,
    height: 26,
  },
  itemName: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  itemNameSelected: {
    fontWeight: '700',
    color: colors.primary,
  },
  checkmark: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
    marginLeft: space.xs,
  },
  emptyContainer: {
    paddingVertical: space.xl,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
});

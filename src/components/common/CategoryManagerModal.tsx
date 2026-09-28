import { FC, useState } from 'react';
import { FlatList, Modal, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';

import { Trash2 } from 'lucide-react-native';

import { AppText } from '@/components/ui/AppText';
import { OTHERS_CATEGORY_ID, getCategoryBgColor } from '@/config';
import {
  addCategory as addCategoryDb,
  deleteCategory as deleteCategoryDb,
  getExpenses,
  getPersonalExpenses,
  updateCategory as updateCategoryDb,
} from '@/services/database';
import {
  showInfoToast,
  showSuccessToast,
} from '@/services/toast/toast.service';
import {
  addCategory,
  deleteCategory,
  updateCategory,
} from '@/store/categorySlice';
import { setExpenses } from '@/store/expenseSlice';
import { setPersonalExpenses } from '@/store/personalExpenseSlice';
import { colors, radius, space, useAppTheme } from '@/theme';
import { ExpenseCategory } from '@/types';

import { AppConfirmDialog } from './AppConfirmDialog';
import { CategoryFormModal } from './CategoryFormModal';
import { CategoryIcon } from './CategoryIcon';
import { RootState } from '@/store/store';

type Props = {
  visible: boolean;
  onClose: () => void;
};

export const CategoryManagerModal: FC<Props> = ({ visible, onClose }) => {
  const { colors: themeColors } = useAppTheme();
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const categories = useSelector((s: RootState) => s.categories.categories);

  const [formVisible, setFormVisible] = useState(false);
  const [editingCategory, setEditingCategory] =
    useState<ExpenseCategory | null>(null);
  const [categoryToDelete, setCategoryToDelete] =
    useState<ExpenseCategory | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setFormVisible(true);
  };

  const handleOpenEdit = (cat: ExpenseCategory) => {
    setEditingCategory(cat);
    setFormVisible(true);
  };

  const handleSaveCategory = async (cat: ExpenseCategory) => {
    if (editingCategory) {
      await updateCategoryDb(cat);
      dispatch(updateCategory(cat));
      showSuccessToast(`Updated "${cat.name}"`);
    } else {
      await addCategoryDb(cat);
      dispatch(addCategory(cat));
      showSuccessToast(`Added "${cat.name}"`);
    }
  };

  const handleDeletePress = (category: ExpenseCategory) => {
    if (category.id === OTHERS_CATEGORY_ID) {
      showInfoToast(
        '"Other Expenses" is the default fallback category and cannot be deleted.',
      );
      return;
    }
    setCategoryToDelete(category);
  };

  const handleConfirmDelete = async () => {
    if (!categoryToDelete) return;
    setDeleting(true);
    try {
      await deleteCategoryDb(categoryToDelete.id);
      dispatch(deleteCategory(categoryToDelete.id));

      // Reload both group and personal expenses to reflect reassigned category_id to 'others'
      const [updatedExpenses, updatedPersonal] = await Promise.all([
        getExpenses(),
        getPersonalExpenses(),
      ]);
      dispatch(setExpenses(updatedExpenses));
      dispatch(setPersonalExpenses(updatedPersonal));

      showSuccessToast(
        `Deleted "${categoryToDelete.name}". Expenses moved to Other Expenses.`,
      );
      setCategoryToDelete(null);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
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
              style={[
                styles.handleBar,
                { backgroundColor: themeColors.border },
              ]}
            />

            {/* Header */}
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
                  style={[
                    styles.closeText,
                    { color: themeColors.textSecondary },
                  ]}
                >
                  {'✕'}
                </AppText>
              </Pressable>
              <AppText
                style={[styles.title, { color: themeColors.textPrimary }]}
              >
                {'Manage Categories'}
              </AppText>
              <Pressable
                onPress={handleOpenAdd}
                hitSlop={8}
                style={({ pressed }) => [
                  styles.addHeaderBtn,
                  pressed && styles.addHeaderBtnPressed,
                ]}
              >
                <AppText style={styles.addHeaderBtnText}>{'+ Add'}</AppText>
              </Pressable>
            </View>

            {/* Categories List */}
            <FlatList
              data={categories}
              keyExtractor={item => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContent}
              renderItem={({ item }) => {
                const isDefault = Boolean(item.isDefault);

                return (
                  <View
                    style={[
                      styles.itemCard,
                      {
                        backgroundColor: themeColors.surface,
                        borderColor: themeColors.border,
                      },
                    ]}
                  >
                    <View
                      style={[
                        styles.itemAvatar,
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

                    <View style={styles.itemInfo}>
                      <AppText
                        style={[
                          styles.itemName,
                          { color: themeColors.textPrimary },
                        ]}
                        numberOfLines={1}
                      >
                        {item.name}
                      </AppText>
                      {isDefault ? (
                        <View
                          style={[
                            styles.defaultBadge,
                            { backgroundColor: themeColors.surfaceAlt },
                          ]}
                        >
                          <AppText
                            style={[
                              styles.defaultBadgeText,
                              { color: themeColors.textSecondary },
                            ]}
                          >
                            {'Default'}
                          </AppText>
                        </View>
                      ) : (
                        <AppText
                          style={[
                            styles.customBadgeText,
                            { color: themeColors.primary },
                          ]}
                        >
                          {'Custom'}
                        </AppText>
                      )}
                    </View>

                    <View style={styles.itemActions}>
                      <Pressable
                        style={({ pressed }) => [
                          styles.actionBtn,
                          { backgroundColor: themeColors.surfaceAlt },
                          pressed && styles.actionBtnPressed,
                        ]}
                        onPress={() => handleOpenEdit(item)}
                        hitSlop={6}
                      >
                        <AppText
                          style={[
                            styles.editBtnText,
                            { color: themeColors.textPrimary },
                          ]}
                        >
                          {'Edit'}
                        </AppText>
                      </Pressable>

                      <Pressable
                        style={({ pressed }) => [
                          styles.deleteBtn,
                          item.id === OTHERS_CATEGORY_ID && [
                            styles.deleteBtnDisabled,
                            { backgroundColor: themeColors.surfaceAlt },
                          ],
                          pressed && styles.deleteBtnPressed,
                        ]}
                        onPress={() => handleDeletePress(item)}
                        hitSlop={6}
                        accessibilityLabel={`Delete ${item.name}`}
                      >
                        <Trash2
                          size={15}
                          color={
                            item.id === OTHERS_CATEGORY_ID
                              ? themeColors.textTertiary
                              : themeColors.error
                          }
                          strokeWidth={2.2}
                        />
                      </Pressable>
                    </View>
                  </View>
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

      {/* Add / Edit Form Modal */}
      <CategoryFormModal
        visible={formVisible}
        categoryToEdit={editingCategory}
        existingCategories={categories}
        onSave={handleSaveCategory}
        onClose={() => setFormVisible(false)}
      />

      {/* Delete Confirmation */}
      <AppConfirmDialog
        visible={Boolean(categoryToDelete)}
        title="Delete Category"
        message={`Are you sure you want to delete "${categoryToDelete?.name}"? Any expenses in this category will be reassigned to "Other Expenses".`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        loading={deleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setCategoryToDelete(null)}
      />
    </>
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
    borderTopLeftRadius: radius['2xl'],
    borderTopRightRadius: radius['2xl'],
    borderTopWidth: 1,
    maxHeight: '85%',
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
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  addHeaderBtn: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingHorizontal: space.sm + 4,
    paddingVertical: 6,
  },
  addHeaderBtnPressed: {
    opacity: 0.8,
  },
  addHeaderBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  listContent: {
    paddingHorizontal: space.md,
    paddingTop: space.sm,
    paddingBottom: space.md,
    gap: space.xs + 2,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: space.sm + 2,
  },
  itemAvatar: {
    width: 44,
    height: 44,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: space.sm,
  },
  itemInfo: {
    flex: 1,
    marginRight: space.sm,
    gap: 3,
  },
  itemName: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  defaultBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.sm,
    paddingHorizontal: 6,
    paddingVertical: 1,
  },
  defaultBadgeText: {
    fontSize: 11,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  customBadgeText: {
    fontSize: 11,
    fontWeight: '500',
    color: colors.primary,
  },
  itemActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs,
  },
  actionBtn: {
    paddingHorizontal: space.sm,
    paddingVertical: 6,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceAlt,
  },
  actionBtnPressed: {
    opacity: 0.7,
  },
  editBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  deleteBtn: {
    width: 32,
    height: 32,
    borderRadius: radius.md,
    backgroundColor: 'rgba(255, 107, 107, 0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteBtnDisabled: {
    backgroundColor: colors.surfaceAlt,
    opacity: 0.5,
  },
  deleteBtnPressed: {
    opacity: 0.7,
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

import { FC, useEffect, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppButton } from '@/components/ui/AppButton';
import { AppText } from '@/components/ui/AppText';
import {
  CATEGORY_ICON_KEYS,
  CATEGORY_PALETTE,
  CategoryIconKey,
  getCategoryBgColor,
} from '@/config';
import { colors, radius, space, useAppTheme } from '@/theme';
import { ExpenseCategory } from '@/types';

import { CategoryIcon } from './CategoryIcon';

type Props = {
  visible: boolean;
  categoryToEdit?: ExpenseCategory | null;
  existingCategories?: ExpenseCategory[];
  onSave: (category: ExpenseCategory) => void;
  onClose: () => void;
};

export const CategoryFormModal: FC<Props> = ({
  visible,
  categoryToEdit,
  existingCategories = [],
  onSave,
  onClose,
}) => {
  const { colors: themeColors } = useAppTheme();
  const insets = useSafeAreaInsets();
  const [name, setName] = useState('');
  const [selectedIconKey, setSelectedIconKey] =
    useState<CategoryIconKey>('other');
  const [selectedColor, setSelectedColor] = useState<string>(
    CATEGORY_PALETTE[0],
  );
  const [nameError, setNameError] = useState('');

  const isEditing = Boolean(categoryToEdit);

  useEffect(() => {
    if (categoryToEdit) {
      setName(categoryToEdit.name);
      setSelectedIconKey(
        (categoryToEdit.iconKey as CategoryIconKey) || 'other',
      );
      setSelectedColor(categoryToEdit.color || CATEGORY_PALETTE[0]);
      setNameError('');
    } else {
      setName('');
      setSelectedIconKey('other');
      setSelectedColor(CATEGORY_PALETTE[0]);
      setNameError('');
    }
  }, [categoryToEdit, visible]);

  const handleSave = () => {
    const trimmed = name.trim();
    if (!trimmed) {
      setNameError('Category name is required');
      return;
    }

    // Check duplicate name among other categories
    const isDuplicate = existingCategories.some(
      c =>
        c.name.toLowerCase() === trimmed.toLowerCase() &&
        c.id !== categoryToEdit?.id,
    );

    if (isDuplicate) {
      setNameError('A category with this name already exists');
      return;
    }

    const newCategory: ExpenseCategory = {
      id: categoryToEdit?.id ?? `cat_${Date.now()}`,
      name: trimmed,
      iconKey: selectedIconKey,
      color: selectedColor,
      isDefault: categoryToEdit?.isDefault ?? false,
      createdAt: categoryToEdit?.createdAt ?? Date.now(),
    };

    onSave(newCategory);
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
                style={[styles.closeText, { color: themeColors.textSecondary }]}
              >
                {'✕'}
              </AppText>
            </Pressable>
            <AppText style={[styles.title, { color: themeColors.textPrimary }]}>
              {isEditing ? 'Edit Category' : 'New Category'}
            </AppText>
            <View style={styles.headerSpacer} />
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollBody}
          >
            {/* Live Preview Card */}
            <View
              style={[
                styles.previewContainer,
                {
                  backgroundColor: themeColors.surface,
                  borderColor: themeColors.border,
                },
              ]}
            >
              <View
                style={[
                  styles.previewAvatar,
                  { backgroundColor: getCategoryBgColor(selectedColor, 0.18) },
                ]}
              >
                <CategoryIcon
                  iconKey={selectedIconKey}
                  size={32}
                  color={selectedColor}
                  strokeWidth={2.2}
                />
              </View>
              <AppText
                style={[styles.previewName, { color: themeColors.textPrimary }]}
                numberOfLines={1}
              >
                {name.trim() || 'Category Name'}
              </AppText>
            </View>

            {/* Name Input */}
            <View style={styles.inputGroup}>
              <AppText
                style={[
                  styles.fieldLabel,
                  { color: themeColors.textSecondary },
                ]}
              >
                {'Name'}
              </AppText>
              <TextInput
                style={[
                  styles.textInput,
                  {
                    backgroundColor: themeColors.surface,
                    borderColor: themeColors.border,
                    color: themeColors.textPrimary,
                  },
                  Boolean(nameError) && [
                    styles.textInputError,
                    { borderColor: themeColors.error },
                  ],
                ]}
                placeholder="e.g. Subscriptions, Fitness, Pets"
                placeholderTextColor={themeColors.textSecondary}
                value={name}
                onChangeText={val => {
                  setName(val);
                  if (nameError) setNameError('');
                }}
                autoCapitalize="words"
                autoCorrect={false}
              />
              {nameError ? (
                <AppText
                  style={[styles.errorText, { color: themeColors.error }]}
                >
                  {nameError}
                </AppText>
              ) : null}
            </View>

            {/* Icon Picker */}
            <View style={styles.inputGroup}>
              <AppText
                style={[
                  styles.fieldLabel,
                  { color: themeColors.textSecondary },
                ]}
              >
                {'Choose Icon'}
              </AppText>
              <View style={styles.iconGrid}>
                {CATEGORY_ICON_KEYS.map(key => {
                  const isSelected = selectedIconKey === key;
                  return (
                    <Pressable
                      key={key}
                      style={[
                        styles.iconChip,
                        {
                          backgroundColor: themeColors.surface,
                          borderColor: themeColors.border,
                        },
                        isSelected && [
                          styles.iconChipSelected,
                          {
                            borderColor: selectedColor,
                            backgroundColor: getCategoryBgColor(
                              selectedColor,
                              0.18,
                            ),
                          },
                        ],
                      ]}
                      onPress={() => setSelectedIconKey(key)}
                    >
                      <CategoryIcon
                        iconKey={key}
                        size={21}
                        color={
                          isSelected ? selectedColor : themeColors.textSecondary
                        }
                        strokeWidth={2}
                      />
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* Color Palette Picker */}
            <View style={styles.inputGroup}>
              <AppText
                style={[
                  styles.fieldLabel,
                  { color: themeColors.textSecondary },
                ]}
              >
                {'Choose Color'}
              </AppText>
              <View style={styles.colorPaletteRow}>
                {CATEGORY_PALETTE.map(c => {
                  const isSelected =
                    selectedColor.toLowerCase() === c.toLowerCase();
                  return (
                    <Pressable
                      key={c}
                      style={[
                        styles.colorCircle,
                        { backgroundColor: c },
                        isSelected && styles.colorCircleSelected,
                      ]}
                      onPress={() => setSelectedColor(c)}
                    >
                      {isSelected ? (
                        <AppText style={styles.checkMark}>{'✓'}</AppText>
                      ) : null}
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* Save Button */}
            <View style={styles.btnRow}>
              <AppButton
                label={isEditing ? 'Update Category' : 'Save Category'}
                variant="primary"
                onPress={handleSave}
                fullWidth
              />
            </View>
          </ScrollView>
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
    borderTopLeftRadius: radius['2xl'],
    borderTopRightRadius: radius['2xl'],
    borderTopWidth: 1,
    maxHeight: '85%',
    maxWidth: 600,
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
  headerSpacer: {
    width: 32,
  },
  scrollBody: {
    paddingHorizontal: space.md,
    paddingTop: space.sm,
    paddingBottom: space.lg,
  },
  previewContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: space.md,
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: space.md,
  },
  previewAvatar: {
    width: 58,
    height: 58,
    borderRadius: radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: space.xs,
  },
  previewName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  inputGroup: {
    marginBottom: space.md,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: space.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  textInput: {
    height: 48,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: space.md,
    fontSize: 15,
    color: colors.textPrimary,
  },
  textInputError: {
    borderColor: colors.error,
  },
  errorText: {
    fontSize: 12,
    color: colors.error,
    marginTop: 4,
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space.sm,
  },
  iconChip: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconChipSelected: {
    borderWidth: 1.5,
  },
  colorPaletteRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space.sm,
    marginTop: 2,
  },
  colorCircle: {
    width: 36,
    height: 36,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorCircleSelected: {
    borderWidth: 3,
    borderColor: '#FFFFFF',
    transform: [{ scale: 1.1 }],
  },
  checkMark: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  btnRow: {
    marginTop: space.sm,
  },
});

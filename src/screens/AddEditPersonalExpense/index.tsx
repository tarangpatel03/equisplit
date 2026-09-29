import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  View,
} from 'react-native';
import { TrendingDown, TrendingUp } from 'lucide-react-native';

import { assets } from '@/assets';
import {
  AppDatePicker,
  CategoryIcon,
  CategoryModal,
} from '@/components/common';
import { AppButton } from '@/components/ui/AppButton';
import { AppInput } from '@/components/ui/AppInput';
import { AppScreen } from '@/components/ui/AppScreen';
import { AppText } from '@/components/ui/AppText';
import { getCategoryBgColor, getCategoryById } from '@/config';
import { useCurrency } from '@/hooks';
import { useAppTheme } from '@/theme';

import { useAddEditPersonalExpense } from './hooks/useAddEditPersonalExpense';
import { styles } from './styles';

export const AddEditPersonalExpenseScreen = () => {
  const { colors: themeColors } = useAppTheme();
  const { currencySymbol } = useCurrency();
  const {
    isEdit,
    type,
    setType,
    title,
    amountStr,
    categoryId,
    date,
    note,
    setNote,
    titleError,
    amountError,
    categories,
    categoryModalVisible,
    setCategoryModalVisible,
    isDatePickerVisible,
    setIsDatePickerVisible,
    saving,
    handleTitleChange,
    handleAmountChange,
    handleSelectCategory,
    handleDateConfirm,
    handleSave,
  } = useAddEditPersonalExpense();

  const selectedCategory = getCategoryById(categoryId, categories);
  const isIncome = type === 'income';

  return (
    <AppScreen
      screenTitle={
        isEdit
          ? isIncome
            ? 'Edit Income'
            : 'Edit Personal Expense'
          : isIncome
          ? 'Add Income'
          : 'Add Personal Expense'
      }
      showBackButton
      preset="fixed"
      safeAreaEdges={['top', 'bottom']}
      keyboardAvoiding={false}
      dismissKeyboardOnTouch={false}
    >
      <KeyboardAvoidingView
        style={styles.flex1}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.flex1}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled
        >
          {/* Expense vs Income Type Switcher */}
          <View
            style={[
              styles.typeSwitcher,
              {
                backgroundColor: themeColors.surfaceAlt,
                borderColor: themeColors.border,
              },
            ]}
          >
            <Pressable
              style={[
                styles.typeTab,
                !isIncome && [
                  styles.typeTabExpenseActive,
                  { backgroundColor: themeColors.debtLight },
                ],
              ]}
              onPress={() => setType('expense')}
            >
              <TrendingDown
                size={16}
                color={!isIncome ? themeColors.debt : themeColors.textSecondary}
              />
              <AppText
                style={[
                  styles.typeLabel,
                  { color: themeColors.textSecondary },
                  !isIncome && [
                    styles.typeLabelExpenseActive,
                    { color: themeColors.debt },
                  ],
                ]}
              >
                {'Expense (Outflow)'}
              </AppText>
            </Pressable>

            <Pressable
              style={[
                styles.typeTab,
                isIncome && [
                  styles.typeTabIncomeActive,
                  { backgroundColor: themeColors.primaryLight },
                ],
              ]}
              onPress={() => setType('income')}
            >
              <TrendingUp
                size={16}
                color={
                  isIncome ? themeColors.credit : themeColors.textSecondary
                }
              />
              <AppText
                style={[
                  styles.typeLabel,
                  { color: themeColors.textSecondary },
                  isIncome && [
                    styles.typeLabelIncomeActive,
                    { color: themeColors.credit },
                  ],
                ]}
              >
                {'Income (Inflow)'}
              </AppText>
            </Pressable>
          </View>

          {/* Title Row with Category Icon on Left */}
          <View style={styles.titleSection}>
            <AppText
              style={[styles.titleLabel, { color: themeColors.textSecondary }]}
            >
              {isIncome ? 'Income Source' : 'Expense Title'}
            </AppText>
            <View style={styles.titleRow}>
              <Pressable
                style={({ pressed }) => [
                  styles.titleCategoryBtn,
                  {
                    backgroundColor: getCategoryBgColor(
                      selectedCategory.color,
                      0.16,
                    ),
                  },
                  pressed && styles.titleCategoryBtnPressed,
                ]}
                onPress={() => setCategoryModalVisible(true)}
                accessibilityLabel={`Category: ${selectedCategory.name}`}
                hitSlop={6}
              >
                <CategoryIcon
                  iconKey={selectedCategory.iconKey}
                  size={24}
                  color={selectedCategory.color}
                  strokeWidth={2}
                />
              </Pressable>

              <View style={styles.titleInputFlex}>
                <AppInput
                  placeholder={
                    isIncome
                      ? 'e.g. Salary, Freelance, Gift'
                      : 'e.g. Coffee, Groceries, Gym'
                  }
                  value={title}
                  onChangeText={handleTitleChange}
                  error={titleError}
                  containerStyle={styles.titleInputContainer}
                />
              </View>
            </View>
          </View>

          {/* Amount Input */}
          <AppInput
            label="Amount"
            placeholder="0.00"
            value={amountStr}
            onChangeText={handleAmountChange}
            keyboardType="decimal-pad"
            error={amountError}
            prefix={
              <View style={styles.amountPrefixContainer}>
                <AppText
                  style={[
                    styles.amountPrefixText,
                    {
                      color: isIncome
                        ? themeColors.credit
                        : themeColors.primary,
                    },
                  ]}
                >
                  {currencySymbol}
                </AppText>
              </View>
            }
          />

          {/* Date Selector */}
          <View style={styles.dateContainer}>
            <AppText
              style={[styles.dateLabel, { color: themeColors.textSecondary }]}
            >
              {'Date'}
            </AppText>
            <Pressable
              style={[
                styles.dateButton,
                {
                  backgroundColor: themeColors.surface,
                  borderColor: themeColors.border,
                },
              ]}
              onPress={() => setIsDatePickerVisible(true)}
            >
              <Image
                source={assets.icons.ic_calendar}
                style={[
                  styles.calendarIcon,
                  { tintColor: themeColors.primary },
                ]}
                resizeMode="contain"
              />
              <AppText
                style={[styles.dateText, { color: themeColors.textPrimary }]}
              >
                {date.toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </AppText>
            </Pressable>
          </View>

          {/* Notes (Optional) */}
          <AppInput
            label="Notes (Optional)"
            placeholder="Add any extra notes or memo..."
            value={note}
            onChangeText={setNote}
            multiline
            numberOfLines={3}
            style={styles.noteInput}
            containerStyle={styles.noteContainer}
          />
        </ScrollView>

        {/* Persistent Save Button */}
        <View
          style={[
            styles.bottomBar,
            {
              backgroundColor: themeColors.surface,
              borderTopColor: themeColors.border,
            },
          ]}
        >
          <AppButton
            label={
              isEdit
                ? isIncome
                  ? 'Update Income'
                  : 'Update Expense'
                : isIncome
                ? 'Save Income'
                : 'Save Expense'
            }
            loading={saving}
            fullWidth
            onPress={handleSave}
          />
        </View>
      </KeyboardAvoidingView>

      {/* Date Picker Modal */}
      <AppDatePicker
        visible={isDatePickerVisible}
        value={date}
        onConfirm={handleDateConfirm}
        onCancel={() => setIsDatePickerVisible(false)}
      />

      {/* Category Selection Modal */}
      <CategoryModal
        visible={categoryModalVisible}
        selectedCategoryId={categoryId}
        onSelectCategory={handleSelectCategory}
        onClose={() => setCategoryModalVisible(false)}
      />
    </AppScreen>
  );
};

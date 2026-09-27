import { FC, useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';

import { assets } from '@/assets';
import { AppDatePicker, CategoryIcon } from '@/components/common';
import { AppButton } from '@/components/ui/AppButton';
import { AppInput } from '@/components/ui/AppInput';
import { AppScreen } from '@/components/ui/AppScreen';
import { AppText } from '@/components/ui/AppText';
import { getCategoryBgColor, getCategoryById } from '@/config';
import { RootState } from '@/store/store';

import { AmountSplit } from './components/AmountSplit';
import { CategoryModal } from './components/CategoryModal';
import { EquallySplit } from './components/EquallySplit';
import { PayerSection } from './components/PayerSection';
import { PerItemSplit } from './components/PerItemSplit';
import { SharesSplit } from './components/SharesSplit';
import { SplitModeSelector } from './components/SplitModeSelector';
import { useAddEditExpense } from './hooks/useAddEditExpense';
import { styles } from './styles';
import { BottomTabRoutes, RootRoutes } from '@/navigation/routes';
import { NavType } from '@/navigation/navigation.service';

export const AddEditExpenseScreen: FC = () => {
  const navigation = useNavigation<NavType>();
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const categories = useSelector((s: RootState) => s.categories.categories);

  const {
    members,
    isEdit,
    title,
    titleError,
    totalAmountStr,
    amountError,
    parsedTotalAmount,
    splitMode,
    categoryId,
    payerContributions,
    equalParticipantIds,
    memberShares,
    memberAmounts,
    items,
    saving,
    handleTitleChange,
    handleSelectCategory,
    handleTotalAmountChange,
    handleSelectSinglePayer,
    handlePayerAmountChange,
    handleSelectMode,
    handleToggleEqualMember,
    handleSelectAllEqual,
    handleDeselectAllEqual,
    handleShareChange,
    handleStepperChange,
    handleMemberAmountChange,
    handleAddItem,
    handleDeleteItem,
    handleItemNameChange,
    handleItemCostChange,
    handleToggleItemMember,
    handleSave,
    date,
    isDatePickerVisible,
    setIsDatePickerVisible,
    handleDateConfirm,
  } = useAddEditExpense();

  // If no members are in the group, prompt the user to add members on Home
  if (members.length === 0) {
    return (
      <AppScreen
        screenTitle={isEdit ? 'Edit Expense' : 'Add Expense'}
        showBackButton
      >
        <View style={styles.emptyContainer}>
          <Image
            source={assets.icons.ic_members_filled}
            style={styles.emptyIcon}
          />
          <AppText style={styles.emptyTitle}>{'No Group Members'}</AppText>
          <AppText style={styles.emptySubtitle}>
            {
              'You need to add at least one member to your group before adding an expense.'
            }
          </AppText>
          <AppButton
            label="Add Members"
            variant="ghost"
            onPress={() =>
              navigation.navigate(RootRoutes.MainTabs, {
                screen: BottomTabRoutes.Members,
              })
            }
          />
        </View>
      </AppScreen>
    );
  }
  const selectedCategory = getCategoryById(categoryId, categories);

  return (
    <AppScreen
      screenTitle={isEdit ? 'Edit Expense' : 'Add Expense'}
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
          {/* Title Row with Category Icon on Left */}
          <View style={styles.titleSection}>
            <AppText style={styles.titleLabel}>{'Expense Title'}</AppText>
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
                  placeholder="e.g. Dinner, Groceries, Flight"
                  value={title}
                  onChangeText={handleTitleChange}
                  error={titleError}
                  containerStyle={styles.titleInputContainer}
                />
              </View>
            </View>
          </View>

          {/* Total Amount Input */}
          <AppInput
            label="Total Amount"
            placeholder="0.00"
            value={totalAmountStr}
            onChangeText={handleTotalAmountChange}
            keyboardType="decimal-pad"
            editable={splitMode !== 'perItem'}
            error={amountError}
            prefix={
              <View style={styles.amountPrefixContainer}>
                <AppText style={styles.amountPrefixText}>{'₹'}</AppText>
              </View>
            }
            suffix={
              splitMode === 'perItem' ? (
                <AppText style={styles.subText}>{' (from items)'}</AppText>
              ) : null
            }
          />

          {/* Date Selector */}
          <View style={styles.dateContainer}>
            <AppText style={styles.dateLabel}>{'Date'}</AppText>
            <Pressable
              style={styles.dateButton}
              onPress={() => setIsDatePickerVisible(true)}
            >
              <Image
                source={assets.icons.ic_calendar}
                style={styles.calendarIcon}
                resizeMode="contain"
              />
              <AppText style={styles.dateText}>
                {date.toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </AppText>
            </Pressable>
          </View>

          {/* Payers Section */}
          <PayerSection
            members={members}
            payerContributions={payerContributions}
            totalAmount={parsedTotalAmount}
            onPayerAmountChange={handlePayerAmountChange}
            onSelectSinglePayer={handleSelectSinglePayer}
          />

          {/* Split Mode Selector */}
          <AppText style={styles.sectionTitle}>{'Split Method'}</AppText>
          <SplitModeSelector
            selectedMode={splitMode}
            onSelectMode={handleSelectMode}
          />

          {/* Mode-specific Split Breakdown */}
          {splitMode === 'equally' && (
            <EquallySplit
              members={members}
              selectedMemberIds={equalParticipantIds}
              totalAmount={parsedTotalAmount}
              onToggleMember={handleToggleEqualMember}
              onSelectAll={handleSelectAllEqual}
              onDeselectAll={handleDeselectAllEqual}
            />
          )}

          {splitMode === 'shares' && (
            <SharesSplit
              members={members}
              memberShares={memberShares}
              totalAmount={parsedTotalAmount}
              onShareChange={handleShareChange}
              onStepperChange={handleStepperChange}
            />
          )}

          {splitMode === 'amount' && (
            <AmountSplit
              members={members}
              memberAmounts={memberAmounts}
              totalAmount={parsedTotalAmount}
              onAmountChange={handleMemberAmountChange}
            />
          )}

          {splitMode === 'perItem' && (
            <PerItemSplit
              members={members}
              items={items}
              onAddItem={handleAddItem}
              onDeleteItem={handleDeleteItem}
              onItemNameChange={handleItemNameChange}
              onItemCostChange={handleItemCostChange}
              onToggleItemMember={handleToggleItemMember}
            />
          )}
        </ScrollView>

        {/* Persistent Save Button */}
        <View style={styles.bottomBar}>
          <AppButton
            label={isEdit ? 'Update Expense' : 'Save Expense'}
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

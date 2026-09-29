import { useCallback, useEffect, useState } from 'react';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';

import {
  addPersonalExpense as addPersonalExpenseDb,
  updatePersonalExpense as updatePersonalExpenseDb,
} from '@/services/database';
import { showSuccessToast } from '@/services/toast/toast.service';
import {
  addPersonalExpense,
  updatePersonalExpense,
} from '@/store/personalExpenseSlice';
import { RootState } from '@/store/store';
import { ExpenseCategory, PersonalExpense, PersonalExpenseType } from '@/types';
import { RootRouteParams } from '@/types/navigation.types';

export function useAddEditPersonalExpense() {
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<RootRouteParams, 'AddEditPersonalExpense'>>();
  const dispatch = useDispatch();

  const personalExpenseId = route.params?.personalExpenseId;
  const isEdit = Boolean(personalExpenseId);

  const categories = useSelector((s: RootState) => s.categories.categories);
  const personalExpenses = useSelector(
    (s: RootState) => s.personalExpenses.personalExpenses,
  );

  const existingExpense = personalExpenses.find(e => e.id === personalExpenseId);

  const defaultCategory = categories[0]?.id || 'general';

  const [type, setType] = useState<PersonalExpenseType>(
    existingExpense?.type || 'expense',
  );
  const [title, setTitle] = useState(existingExpense?.title || '');
  const [amountStr, setAmountStr] = useState(
    existingExpense ? existingExpense.amount.toString() : '',
  );
  const [categoryId, setCategoryId] = useState(
    existingExpense?.categoryId || defaultCategory,
  );
  const [date, setDate] = useState<Date>(
    existingExpense ? new Date(existingExpense.date) : new Date(),
  );
  const [note, setNote] = useState(existingExpense?.note || '');

  const [titleError, setTitleError] = useState<string | undefined>();
  const [amountError, setAmountError] = useState<string | undefined>();
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (existingExpense) {
      setType(existingExpense.type || 'expense');
      setTitle(existingExpense.title);
      setAmountStr(existingExpense.amount.toString());
      setCategoryId(existingExpense.categoryId);
      setDate(new Date(existingExpense.date));
      setNote(existingExpense.note || '');
    }
  }, [existingExpense]);

  const handleTitleChange = useCallback((val: string) => {
    setTitle(val);
    if (val.trim()) {
      setTitleError(undefined);
    }
  }, []);

  const handleAmountChange = useCallback((val: string) => {
    // Sanitize numeric input (allow only digits and at most one decimal point)
    const sanitized = val.replace(/[^0-9.]/g, '');
    const parts = sanitized.split('.');
    const clean = parts.length > 2 ? `${parts[0]}.${parts.slice(1).join('')}` : sanitized;
    setAmountStr(clean);
    if (parseFloat(clean) > 0) {
      setAmountError(undefined);
    }
  }, []);

  const handleSelectCategory = useCallback((cat: ExpenseCategory) => {
    setCategoryId(cat.id);
  }, []);

  const handleDateConfirm = useCallback((selectedDate: Date) => {
    setDate(selectedDate);
    setIsDatePickerVisible(false);
  }, []);

  const handleSave = useCallback(async () => {
    let hasError = false;
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setTitleError('Please enter an expense title');
      hasError = true;
    }

    const parsedAmount = parseFloat(amountStr);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setAmountError('Please enter a valid amount greater than ₹0');
      hasError = true;
    }

    if (hasError) return;

    setSaving(true);
    try {
      const now = Date.now();
      const expense: PersonalExpense = {
        id: isEdit && existingExpense ? existingExpense.id : now.toString(),
        title: trimmedTitle,
        amount: Math.round(parsedAmount * 100) / 100,
        type,
        categoryId,
        date: date.getTime(),
        note: note.trim() || undefined,
        createdAt: isEdit && existingExpense ? existingExpense.createdAt : now,
        updatedAt: now,
      };

      if (isEdit) {
        await updatePersonalExpenseDb(expense);
        dispatch(updatePersonalExpense(expense));
        showSuccessToast('Personal record updated');
      } else {
        await addPersonalExpenseDb(expense);
        dispatch(addPersonalExpense(expense));
        showSuccessToast(
          type === 'income' ? 'Income added' : 'Personal expense added',
        );
      }

      navigation.goBack();
    } catch (err) {
      console.error('[AddEditPersonalExpense] Save failed:', err);
    } finally {
      setSaving(false);
    }
  }, [
    title,
    amountStr,
    type,
    categoryId,
    date,
    note,
    isEdit,
    existingExpense,
    dispatch,
    navigation,
  ]);

  return {
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
  };
}

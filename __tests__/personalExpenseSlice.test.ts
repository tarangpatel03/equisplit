import personalExpenseReducer, {
  setPersonalExpenses,
  addPersonalExpense,
  updatePersonalExpense,
  deletePersonalExpense,
} from '../src/store/personalExpenseSlice';
import { PersonalExpense } from '../src/types';

describe('personalExpenseSlice', () => {
  const initialItem: PersonalExpense = {
    id: 'exp-1',
    title: 'Morning Coffee',
    amount: 4.5,
    categoryId: 'food',
    date: 1700000000000,
    note: 'Espresso',
    createdAt: 1700000000000,
    updatedAt: 1700000000000,
  };

  it('handles setPersonalExpenses', () => {
    const state = personalExpenseReducer(
      undefined,
      setPersonalExpenses([initialItem]),
    );
    expect(state.personalExpenses).toHaveLength(1);
    expect(state.personalExpenses[0].title).toBe('Morning Coffee');
  });

  it('handles addPersonalExpense by prepending', () => {
    const existingState = {
      personalExpenses: [initialItem],
      loading: false,
      error: null,
    };
    const newItem: PersonalExpense = {
      id: 'exp-2',
      title: 'Groceries',
      amount: 42.0,
      categoryId: 'food',
      date: 1700001000000,
      createdAt: 1700001000000,
      updatedAt: 1700001000000,
    };

    const state = personalExpenseReducer(existingState, addPersonalExpense(newItem));
    expect(state.personalExpenses).toHaveLength(2);
    expect(state.personalExpenses[0].id).toBe('exp-2');
  });

  it('handles updatePersonalExpense', () => {
    const existingState = {
      personalExpenses: [initialItem],
      loading: false,
      error: null,
    };
    const updated = {
      ...initialItem,
      amount: 5.5,
      note: 'Double Espresso',
    };

    const state = personalExpenseReducer(existingState, updatePersonalExpense(updated));
    expect(state.personalExpenses[0].amount).toBe(5.5);
    expect(state.personalExpenses[0].note).toBe('Double Espresso');
  });

  it('handles deletePersonalExpense', () => {
    const existingState = {
      personalExpenses: [initialItem],
      loading: false,
      error: null,
    };

    const state = personalExpenseReducer(
      existingState,
      deletePersonalExpense('exp-1'),
    );
    expect(state.personalExpenses).toHaveLength(0);
  });
});

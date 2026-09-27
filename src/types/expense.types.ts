/**
 * Expense domain types.
 * Shared across the DB service, Redux slices, and screens.
 */

export type SplitMode = 'equally' | 'shares' | 'perItem' | 'amount';

/** A person in the fixed session group. */
export type Member = {
  id: string;
  name: string;
};

/** One person's payment contribution toward an expense. */
export type PayerContribution = {
  memberId: string;
  amount: number;
};

/** One participant's computed share of an expense. */
export type ParticipantShare = {
  memberId: string;
  /** Final owed amount (computed from rawValue + splitMode). */
  share: number;
  /**
   * Raw user input:
   * - equally: unused (share = total / count)
   * - shares: number of shares
   * - perItem: not stored here (derived from items)
   * - amount: direct manual amount
   */
  rawValue?: number;
};

/** A single line item in a perItem split. */
export type ExpenseItem = {
  name: string;
  cost: number;
  /** memberIds of people this item is assigned to. */
  assignedTo: string[];
};

/** Category specification for classifying expenses. */
export type ExpenseCategory = {
  id: string;
  name: string;
  iconKey: string;
  color: string;
  isDefault?: boolean;
  createdAt?: number;
};

export type Expense = {
  id: string;
  title: string;
  totalAmount: number;
  splitMode: SplitMode;
  /** Category identifier (e.g. 'general', 'food', 'transport'). Defaults to 'general'. */
  categoryId?: string;
  /** One or more people who paid (amounts must sum to totalAmount). */
  payers: PayerContribution[];
  /** Each participant's owed share. */
  participants: ParticipantShare[];
  /** Only present when splitMode === 'perItem'. */
  items?: ExpenseItem[];
  createdAt: number;
  updatedAt: number;
};

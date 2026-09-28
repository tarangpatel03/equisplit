/**
 * Balance computation utilities.
 *
 * For each member:
 *   net = Σ(amounts they paid) − Σ(shares they owe)
 *   positive  → they are owed (credit)
 *   negative  → they owe (debt)
 */

import { Expense, Member } from '@/types';

export type BalanceMap = Record<string, number>;

export function computeBalances(
  members: Member[],
  expenses: Expense[],
): BalanceMap {
  const balances: BalanceMap = {};

  for (const m of members) {
    balances[m.id] = 0;
  }

  for (const expense of expenses) {
    // Credit payers
    for (const payer of expense.payers) {
      if (balances[payer.memberId] !== undefined) {
        balances[payer.memberId] += payer.amount;
      }
    }
    // Debit participants
    for (const participant of expense.participants) {
      if (balances[participant.memberId] !== undefined) {
        balances[participant.memberId] -= participant.share;
      }
    }
  }

  return balances;
}

export type PairwiseBreakdown = {
  otherMemberId: string;
  otherMemberName: string;
  amount: number; // positive = other member owes this member, negative = this member owes other member
};

export type MemberBalanceDetail = {
  member: Member;
  netBalance: number;
  status: 'to pay' | 'gets back' | 'settled';
  breakdowns: PairwiseBreakdown[];
};

/**
 * Simplified settlement: a single directed transfer from debtor → creditor.
 */
type Settlement = {
  from: string; // debtor memberId
  to: string; // creditor memberId
  amount: number;
};

/**
 * Greedy debt simplification.
 *
 * Given net balances for every member, produces the minimum set of
 * settlements that zeros all balances. The algorithm repeatedly pairs
 * the largest debtor with the largest creditor and transfers
 * `min(|debt|, credit)`.
 */
function simplifyDebts(balanceMap: BalanceMap): Settlement[] {
  // Build mutable lists of creditors (+) and debtors (−).
  const creditors: { id: string; amount: number }[] = [];
  const debtors: { id: string; amount: number }[] = [];

  for (const [id, net] of Object.entries(balanceMap)) {
    const rounded = Math.round(net * 100) / 100;
    if (rounded > 0.005) {
      creditors.push({ id, amount: rounded });
    } else if (rounded < -0.005) {
      debtors.push({ id, amount: Math.abs(rounded) });
    }
  }

  // Sort descending so the largest values come first.
  creditors.sort((a, b) => b.amount - a.amount);
  debtors.sort((a, b) => b.amount - a.amount);

  const settlements: Settlement[] = [];
  let ci = 0;
  let di = 0;

  while (ci < creditors.length && di < debtors.length) {
    const transfer = Math.min(debtors[di].amount, creditors[ci].amount);
    const rounded = Math.round(transfer * 100) / 100;

    if (rounded >= 0.01) {
      settlements.push({
        from: debtors[di].id,
        to: creditors[ci].id,
        amount: rounded,
      });
    }

    debtors[di].amount -= transfer;
    creditors[ci].amount -= transfer;

    if (debtors[di].amount < 0.005) di++;
    if (creditors[ci].amount < 0.005) ci++;
  }

  return settlements;
}

export function computePairwiseBalances(
  members: Member[],
  expenses: Expense[],
): MemberBalanceDetail[] {
  const memberMap = new Map<string, Member>();
  for (const m of members) {
    memberMap.set(m.id, m);
  }

  const overallBalances = computeBalances(members, expenses);
  const settlements = simplifyDebts(overallBalances);

  return members.map(member => {
    const net = Math.round((overallBalances[member.id] ?? 0) * 100) / 100;
    const status: 'to pay' | 'gets back' | 'settled' =
      net > 0.005 ? 'gets back' : net < -0.005 ? 'to pay' : 'settled';

    const breakdowns: PairwiseBreakdown[] = [];

    for (const s of settlements) {
      if (s.from === member.id) {
        // This member owes someone → negative breakdown
        const other = memberMap.get(s.to);
        if (other) {
          breakdowns.push({
            otherMemberId: other.id,
            otherMemberName: other.name,
            amount: -s.amount, // negative = this member owes other
          });
        }
      } else if (s.to === member.id) {
        // Someone owes this member → positive breakdown
        const other = memberMap.get(s.from);
        if (other) {
          breakdowns.push({
            otherMemberId: other.id,
            otherMemberName: other.name,
            amount: s.amount, // positive = other owes this member
          });
        }
      }
    }

    return {
      member,
      netBalance: net,
      status,
      breakdowns,
    };
  });
}

/**
 * Formats a clean, readable text summary of all member balances and simplified
 * pairwise debts suitable for sharing via WhatsApp, SMS, or copying to clipboard.
 */
export function generateBalanceSummaryText(
  members: Member[],
  expenses: Expense[],
): string {
  if (members.length === 0) {
    return 'EquiSplit: No members in group.';
  }

  const balances = computeBalances(members, expenses);
  const settlements = simplifyDebts(balances);
  const memberMap = new Map<string, Member>();
  for (const m of members) {
    memberMap.set(m.id, m);
  }

  const lines: string[] = [
    '📊 EquiSplit - Group Balance Summary',
    '────────────────────────────────',
    '',
    '👥 Member Net Balances:',
  ];

  for (const m of members) {
    const net = Math.round((balances[m.id] ?? 0) * 100) / 100;
    const sign = net > 0 ? '+' : '';
    const status =
      net > 0.005 ? '(gets back)' : net < -0.005 ? '(owes)' : '(settled)';
    const tag = m.isPrimary ? ' (You)' : '';
    lines.push(`• ${m.name}${tag}: ${sign}₹${net.toFixed(2)} ${status}`);
  }

  lines.push('');
  lines.push('🤝 Who Owes Whom (Simplified):');

  if (settlements.length === 0) {
    lines.push('• All settled up! No outstanding balances.');
  } else {
    for (const s of settlements) {
      const fromMember = memberMap.get(s.from);
      const toMember = memberMap.get(s.to);
      const fromName = fromMember ? (fromMember.isPrimary ? 'You' : fromMember.name) : 'Unknown';
      const toName = toMember ? (toMember.isPrimary ? 'You' : toMember.name) : 'Unknown';
      lines.push(`• ${fromName} owes ${toName} ₹${s.amount.toFixed(2)}`);
    }
  }

  lines.push('');
  lines.push('Shared via EquiSplit');

  return lines.join('\n');
}

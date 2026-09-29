import { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';

import { RootState } from '@/store/store';
import { CurrencyInfo, findCurrency, formatCurrency } from '@/utils';

export function useCurrency() {
  const currencyCode = useSelector(
    (state: RootState) => state.currency?.selectedCurrencyCode ?? 'INR',
  );
  const currency: CurrencyInfo = useMemo(
    () => findCurrency(currencyCode),
    [currencyCode],
  );

  const format = useCallback(
    (amount: number) => {
      return formatCurrency(amount, currency.code);
    },
    [currency.code],
  );

  return {
    currency,
    currencyCode: currency.code,
    currencySymbol: currency.symbol,
    formatCurrency: format,
  };
}

import {
  CurrencyInfo,
  DEFAULT_CURRENCY,
  findCurrency,
  SUPPORTED_CURRENCIES,
} from '@/config/currency.config';

export type { CurrencyInfo };
export {
  DEFAULT_CURRENCY,
  findCurrency,
  SUPPORTED_CURRENCIES,
};

/**
 * Format a number with currency symbol and 2 decimal places.
 * Example: formatCurrency(1250, '$') -> '$1,250.00'
 */
export function formatCurrency(
  amount: number,
  currencyCodeOrSymbol: string = 'INR',
): string {
  const currency = findCurrency(currencyCodeOrSymbol);
  const symbol =
    currencyCodeOrSymbol === currency.code
      ? currency.symbol
      : currencyCodeOrSymbol;

  const formattedValue = Math.abs(amount).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const sign = amount < 0 ? '-' : '';
  return `${sign}${symbol}${formattedValue}`;
}

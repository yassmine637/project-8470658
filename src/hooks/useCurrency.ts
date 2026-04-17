import { useState, useCallback } from 'react';

export type Currency = 'TND' | 'EUR' | 'USD' | 'GBP' | 'CHF' | 'SAR' | 'AED' | 'JPY' | 'CNY' | 'BRL' | 'AUD' | 'CAD' | 'RUB';

export interface CurrencyInfo {
  code: Currency;
  symbol: string;
  flag: string;
  rate: number; // rate relative to TND (1 TND = X currency)
}

export const CURRENCIES: Record<Currency, CurrencyInfo> = {
  TND: { code: 'TND', symbol: 'TND', flag: '🇹🇳', rate: 1 },
  EUR: { code: 'EUR', symbol: '€', flag: '🇪🇺', rate: 0.29 },
  USD: { code: 'USD', symbol: '$', flag: '🇺🇸', rate: 0.32 },
  GBP: { code: 'GBP', symbol: '£', flag: '🇬🇧', rate: 0.25 },
  CHF: { code: 'CHF', symbol: 'CHF', flag: '🇨🇭', rate: 0.29 },
  SAR: { code: 'SAR', symbol: 'SAR', flag: '🇸🇦', rate: 1.20 },
  AED: { code: 'AED', symbol: 'AED', flag: '🇦🇪', rate: 1.18 },
  JPY: { code: 'JPY', symbol: '¥', flag: '🇯🇵', rate: 48.5 },
  CNY: { code: 'CNY', symbol: '¥', flag: '🇨🇳', rate: 2.32 },
  BRL: { code: 'BRL', symbol: 'R$', flag: '🇧🇷', rate: 1.85 },
  AUD: { code: 'AUD', symbol: 'A$', flag: '🇦🇺', rate: 0.49 },
  CAD: { code: 'CAD', symbol: 'CA$', flag: '🇨🇦', rate: 0.44 },
  RUB: { code: 'RUB', symbol: '₽', flag: '🇷🇺', rate: 29.5 },
};

// Map country phone dial code + name → currency
export const COUNTRY_CURRENCY_MAP: Record<string, Currency> = {
  'Tunisia': 'TND',
  'France': 'EUR',
  'Belgium': 'EUR',
  'Germany': 'EUR',
  'Italy': 'EUR',
  'Spain': 'EUR',
  'Netherlands': 'EUR',
  'Switzerland': 'CHF',
  'United Kingdom': 'GBP',
  'United States': 'USD',
  'Canada': 'CAD',
  'Australia': 'AUD',
  'Japan': 'JPY',
  'China': 'CNY',
  'Russia': 'RUB',
  'Brazil': 'BRL',
  'Saudi Arabia': 'SAR',
  'UAE': 'AED',
  'Qatar': 'AED',
  'Kuwait': 'AED',
  'Bahrain': 'AED',
  'Oman': 'AED',
  'Jordan': 'USD',
  'Lebanon': 'USD',
  'Morocco': 'EUR',
  'Algeria': 'EUR',
  'Libya': 'USD',
  'Egypt': 'USD',
};

export function getCurrencyForCountry(countryName: string): Currency {
  return COUNTRY_CURRENCY_MAP[countryName] ?? 'TND';
}

export function useCurrency(initialCurrency: Currency = 'TND') {
  const [currency, setCurrency] = useState<Currency>(initialCurrency);

  const currencyInfo = CURRENCIES[currency] ?? CURRENCIES.TND;

  const format = useCallback(
    (amountTND: number): string => {
      const info = CURRENCIES[currency] ?? CURRENCIES.TND;
      if (info.code === 'TND') return `${amountTND}`;
      const converted = Math.round(amountTND * info.rate * 100) / 100;
      return converted.toFixed(2);
    },
    [currency],
  );

  return { currency, setCurrency, currencyInfo, format, currencies: CURRENCIES };
}

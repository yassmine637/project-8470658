import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Currency, CURRENCIES, CurrencyInfo } from '@/hooks/useCurrency';

interface CurrencyContextValue {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  currencyInfo: CurrencyInfo;
  format: (amountTND: number) => string;
  currencies: typeof CURRENCIES;
}

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState<Currency>('TND');
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

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, currencyInfo, format, currencies: CURRENCIES }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrencyCtx(): CurrencyContextValue {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error('useCurrencyCtx must be used within CurrencyProvider');
  return ctx;
}

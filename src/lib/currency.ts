// Currency utilities for the Expense Tracker app

export interface Currency {
  code: string;
  name: string;
  symbol: string;
  locale: string;
}

// Popular currencies with their symbols and locale codes
export const POPULAR_CURRENCIES: Currency[] = [
  { code: 'USD', name: 'US Dollar', symbol: '$', locale: 'en-US' },
  { code: 'EUR', name: 'Euro', symbol: '€', locale: 'de-DE' },
  { code: 'GBP', name: 'British Pound', symbol: '£', locale: 'en-GB' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', locale: 'ja-JP' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', locale: 'en-IN' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', locale: 'en-CA' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', locale: 'en-AU' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', locale: 'de-CH' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', locale: 'zh-CN' },
  { code: 'SEK', name: 'Swedish Krona', symbol: 'kr', locale: 'sv-SE' },
  { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$', locale: 'en-NZ' },
  { code: 'MXN', name: 'Mexican Peso', symbol: '$', locale: 'es-MX' },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', locale: 'en-SG' },
  { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$', locale: 'en-HK' },
  { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr', locale: 'no-NO' },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R', locale: 'en-ZA' },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', locale: 'pt-BR' },
  { code: 'KRW', name: 'South Korean Won', symbol: '₩', locale: 'ko-KR' },
  { code: 'PLN', name: 'Polish Zloty', symbol: 'zł', locale: 'pl-PL' },
  { code: 'THB', name: 'Thai Baht', symbol: '฿', locale: 'th-TH' },
];

// Get currency by code
export const getCurrencyByCode = (code: string): Currency | undefined => {
  return POPULAR_CURRENCIES.find(currency => currency.code === code);
};

// Format amount using Intl.NumberFormat
export const formatCurrency = (amount: number, currencyCode: string = 'USD'): string => {
  const currency = getCurrencyByCode(currencyCode);
  const locale = currency?.locale || 'en-US';

  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch (error) {
    // Fallback formatting if currency is not supported
    const symbol = currency?.symbol || currencyCode;
    return `${symbol}${amount.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
};

// Get currency symbol only
export const getCurrencySymbol = (currencyCode: string = 'USD'): string => {
  const currency = getCurrencyByCode(currencyCode);
  return currency?.symbol || currencyCode;
};

// Exchange rate API integration (using exchangerate.host - free tier)
export const getExchangeRates = async (baseCurrency: string = 'USD'): Promise<Record<string, number> | null> => {
  try {
    const response = await fetch(`https://api.exchangerate.host/latest?base=${baseCurrency}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch exchange rates');
    }
    
    const data = await response.json();
    return data.rates;
  } catch (error) {
    console.error('Error fetching exchange rates:', error);
    return null;
  }
};

// Convert amount from one currency to another
export const convertCurrency = async (
  amount: number, 
  fromCurrency: string, 
  toCurrency: string
): Promise<number | null> => {
  if (fromCurrency === toCurrency) {
    return amount;
  }

  try {
    const response = await fetch(
      `https://api.exchangerate.host/convert?from=${fromCurrency}&to=${toCurrency}&amount=${amount}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to convert currency');
    }
    
    const data = await response.json();
    return data.result;
  } catch (error) {
    console.error('Error converting currency:', error);
    return null;
  }
};
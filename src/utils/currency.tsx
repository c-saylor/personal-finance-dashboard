// utils/currency.ts
export const currencySymbols: { [key: string]: string } = {
    USD: '$',
    EUR: '€',
    JPY: '¥',
    GBP: '£',
  };
  
  /**
   * Returns the symbol for a given currency code
   * Defaults to the code itself if symbol is not defined
   */
  export const getCurrencySymbol = (currencyCode: string): string => {
    return currencySymbols[currencyCode] || currencyCode;
  };
  
export enum AccountType {
  Cash = "cash",
  Bank = "bank",
}

export enum Currency {
  PLN = "PLN",
  EUR = "EUR",
  USD = "USD",
}

export const CurrencySymbols = {
  [Currency.PLN]: "zł",
  [Currency.EUR]: "€",
  [Currency.USD]: "$",
};

export interface Account {
  id: string;
  name: string;
  balance: number;
  currency: Currency;
  type: AccountType;
}

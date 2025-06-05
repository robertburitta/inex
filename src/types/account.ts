export enum AccountType {
  Cash = "cash",
  Bank = "bank",
}

export interface Account {
  id: string;
  name: string;
  balance: number;
  currency: string;
  type: AccountType;
}

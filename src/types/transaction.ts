export enum TransactionType {
  Income = "income",
  Expense = "expense",
}

export interface Transaction {
  id: string;
  type: TransactionType;
  name: string;
  amount: number;
  date: string;
  category: string;
  account: string;
  description?: string;
}

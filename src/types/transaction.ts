import { Timestamp } from "firebase/firestore";

export enum TransactionType {
  Income = "income",
  Expense = "expense",
}

export interface Transaction {
  id: string;
  type: TransactionType;
  name: string;
  amount: number;
  date: Timestamp;
  category: string;
  account: string;
  description?: string;
}

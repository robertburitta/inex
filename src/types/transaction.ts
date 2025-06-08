import { Timestamp } from "firebase/firestore";
import { Currency } from "./account";

export enum TransactionType {
  Income = "income",
  Expense = "expense",
}

export interface Transaction {
  id: string;
  type: TransactionType;
  name: string;
  amount: number;
  currency: Currency;
  date: Timestamp;
  category: string;
  account: string;
  description?: string;
}

import { Currency } from "@/types/account";
import { TransactionType } from "@/types/transaction";

export const getTransactionType = (type: TransactionType) => {
  return type === TransactionType.Income ? "Przychód" : "Wydatek";
};

export const formatBalance = (balance: number, currency: Currency) =>
  new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: currency,
  }).format(balance);

export const formatDate = (date: Date) =>
  new Intl.DateTimeFormat("pl-PL", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  }).format(date);

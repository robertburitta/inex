import { TransactionType } from "@/types/transaction";

export const getTransactionType = (type: TransactionType) => {
  return type === TransactionType.Income ? "Przychód" : "Wydatek";
};

export const formatBalance = (balance: number) =>
  new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: "PLN",
  }).format(balance);

export const formatDate = (date: Date) =>
  new Intl.DateTimeFormat("pl-PL", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  }).format(date);

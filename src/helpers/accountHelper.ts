import { AccountType } from "@/types/account";

export const getAccountType = (type: AccountType) => {
  return type === AccountType.Bank ? "Konto bankowe" : "Gotówka";
};

export const getAccountIcon = (type: AccountType) => {
  switch (type) {
    case AccountType.Bank:
      return "🏦";
    case AccountType.Cash:
      return "💵";
    default:
      return "📊";
  }
};

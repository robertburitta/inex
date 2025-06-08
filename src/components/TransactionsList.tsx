"use client";

import { getAccountType } from "@/helpers/accountHelper";
import { formatBalance, formatDate } from "@/helpers/transactionHelper";
import React from "react";
import * as Icons from "@heroicons/react/24/outline";
import { Account } from "@/types/account";
import { Category } from "@/types/category";
import { Transaction, TransactionType } from "@/types/transaction";

interface TransactionsListProps {
  transactions: Transaction[];
  categories: Category[];
  accounts: Account[];
}

const TransactionsList: React.FC<TransactionsListProps> = ({ transactions, categories, accounts }) => {
  const getCategoryIcon = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId);
    const Icon = category ? Icons[`${category.icon}Icon` as keyof typeof Icons] : Icons.TagIcon;
    return Icon;
  };

  const getCategoryColor = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId);
    return category?.color || "#FFFFFF";
  };

  const getAccount = (accountId: string) => {
    const account = accounts.find((a) => a.id === accountId);
    return account ?? ({ name: "Nieznane konto" } as Account);
  };

  return (
    <div className="space-y-4">
      {transactions.length === 0 ? (
        <p className="text-center text-gray-500">Nie dodano jeszcze żadnych transakcji</p>
      ) : (
        transactions
          .sort((a, b) => b.date.toDate().getTime() - a.date.toDate().getTime())
          .map((transaction) => {
            const CategoryIcon = getCategoryIcon(transaction.category);
            const categoryColor = getCategoryColor(transaction.category);
            const account = getAccount(transaction.account);

            return (
              <div
                key={transaction.id}
                className="flex items-center justify-between rounded-lg p-4 shadow"
                style={{ backgroundColor: `${categoryColor}20` }}
              >
                <div className="flex items-center space-x-4">
                  <div className="rounded-full p-2">
                    <CategoryIcon
                      className="h-8 w-8"
                      style={{ color: categoryColor }}
                    />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{transaction.name}</h3>
                    <div className="flex flex-col items-start space-x-2 text-sm text-gray-500 sm:flex-row sm:items-center">
                      <span>{formatDate(transaction.date.toDate())}</span>
                      <span className="hidden sm:block">•</span>
                      <span>
                        {account.name} {account.type && `(${getAccountType(account.type)})`}
                      </span>
                    </div>
                    {transaction.description && (
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <span>Opis: {transaction.description}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className={`font-medium ${transaction.type === TransactionType.Income ? "text-green-600" : "text-red-600"}`}>
                    {transaction.type === TransactionType.Income ? "+" : "-"}
                    {formatBalance(transaction.amount, transaction.currency)}
                  </span>
                </div>
              </div>
            );
          })
      )}
    </div>
  );
};

export default TransactionsList;

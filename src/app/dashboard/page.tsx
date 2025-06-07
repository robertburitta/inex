"use client";

import { formatBalance } from "@/helpers/transactionHelper";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { PlusIcon } from "@heroicons/react/24/outline";
import { useAuth } from "@/contexts/AuthContext";
import { accountService } from "@/services/accountService";
import { categoryService } from "@/services/categoryService";
import { transactionService } from "@/services/transactionService";
import { Account } from "@/types/account";
import { Category } from "@/types/category";
import { Transaction, TransactionType } from "@/types/transaction";
import AddTransactionModal from "@/components/AddTransactionModal";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Loader from "@/components/Loader";
import TransactionsList from "@/components/TransactionsList";

export default function Dashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [fetching, setFetching] = useState({
    transactions: true,
    categories: true,
    accounts: true,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = useCallback(async () => {
    if (!user) return;

    try {
      setFetching((prev) => ({ ...prev, transactions: true }));
      setError(null);
      const monthUserTransactions = await transactionService.getMonthUserTransactions(user.uid);
      setTransactions(monthUserTransactions);
    } catch (err) {
      console.error("Błąd pobierania transakcji:", err);
      setError("Nie udało się pobrać transakcji");
    } finally {
      setFetching((prev) => ({ ...prev, transactions: false }));
    }
  }, [user]);

  const fetchCategories = useCallback(async () => {
    if (!user) return;

    try {
      setFetching((prev) => ({ ...prev, categories: true }));
      setError(null);
      const userCategories = await categoryService.getUserCategories(user.uid);
      const defaultCategories = await categoryService.getDefaultCategories();
      setCategories([...userCategories, ...defaultCategories]);
    } catch (err) {
      console.error("Błąd pobierania kategorii:", err);
      setError("Nie udało się pobrać kategorii");
    } finally {
      setFetching((prev) => ({ ...prev, categories: false }));
    }
  }, [user]);

  const fetchAccounts = useCallback(async () => {
    if (!user) return;

    try {
      setFetching((prev) => ({ ...prev, accounts: true }));
      setError(null);
      const userAccounts = await accountService.getUserAccounts(user.uid);
      setAccounts(userAccounts);
    } catch (err) {
      console.error("Błąd pobierania kont:", err);
      setError("Nie udało się pobrać kont");
    } finally {
      setFetching((prev) => ({ ...prev, accounts: false }));
    }
  }, [user]);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  if (loading || fetching.transactions || fetching.categories || fetching.accounts) {
    return <Loader />;
  }

  const totalIncome = transactions.filter((t) => t.type === TransactionType.Income).reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions.filter((t) => t.type === TransactionType.Expense).reduce((sum, t) => sum + t.amount, 0);
  const balance = accounts.reduce((sum, account) => sum + account.balance, 0);

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Header />

      <main className="mx-auto w-full max-w-7xl flex-grow px-4 py-10 sm:px-6 lg:px-8">
        {error && <div className="mb-8 rounded-lg bg-red-100 p-4 text-sm text-red-700">{error}</div>}

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Card
            icon={
              <svg
                className="h-6 w-6 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            }
            title="Aktualne saldo (wszystkie konta)"
            value={formatBalance(balance)}
            transition={{ delay: 0 * 0.05, duration: 0.3 }}
          />
          <Card
            icon={
              <svg
                className="h-6 w-6 text-green-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            }
            title={`Przychody (${new Date().toLocaleDateString("pl-PL", { month: "long" })})`}
            value={formatBalance(totalIncome)}
            transition={{ delay: 1 * 0.05, duration: 0.3 }}
          />
          <Card
            icon={
              <svg
                className="h-6 w-6 text-red-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 12H4"
                />
              </svg>
            }
            title={`Wydatki (${new Date().toLocaleDateString("pl-PL", { month: "long" })})`}
            value={formatBalance(totalExpenses)}
            transition={{ delay: 2 * 0.05, duration: 0.3 }}
          />
        </div>

        <div className="mt-8 flex items-center justify-between">
          <h2 className="text-xl font-medium text-gray-900">Ostatnie transakcje</h2>
          <Button
            variant="blue"
            type="button"
            onClick={() => setIsModalOpen(true)}
          >
            <PlusIcon className="h-5 w-5" />
            Dodaj transakcję
          </Button>
        </div>

        <div className="mt-4 overflow-hidden bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <TransactionsList
              userId={user?.uid}
              categories={categories}
              accounts={accounts}
            />
          </div>
        </div>
      </main>

      <Footer />

      {user && (
        <AddTransactionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          userId={user?.uid}
          onTransactionAdded={() => {
            fetchTransactions();
            fetchAccounts();
          }}
          categories={categories}
          accounts={accounts}
        />
      )}
    </div>
  );
}

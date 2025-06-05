"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Loader from "@/components/Loader";
import { accountService } from "@/services/accountService";
import { categoryService } from "@/services/categoryService";
import { Account } from "@/types/account";
import { Category } from "@/types/category";
import Card from "@/components/Card";
import AddTransactionModal from "@/components/AddTransactionModal";
import Button from "@/components/Button";
import { PlusIcon } from "@heroicons/react/24/outline";
import { transactionService } from "@/services/transactionService";
import { Transaction } from "@/types/transaction";

export default function Dashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = useCallback(async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      setError(null);
      const userTransactions = await transactionService.getTransactions(
        user.uid
      );
      setTransactions(userTransactions);
    } catch (err) {
      console.error("Błąd pobierania transakcji:", err);
      setError("Nie udało się pobrać transakcji");
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    let cancelled = false;
    if (user) {
      (async () => {
        setIsLoading(true);
        const userAccounts = await accountService.getUserAccounts(user.uid);
        const defaultCategories = await categoryService.getDefaultCategories();
        const userCategories = await categoryService.getUserCategories(
          user.uid
        );
        if (!cancelled) {
          setAccounts(userAccounts);
          setCategories([...userCategories, ...defaultCategories]);
        }
        setIsLoading(false);
      })();
    }
    return () => {
      cancelled = true;
    };
  }, [user]);

  if (loading || isLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-red-600 mb-4">
                Wystąpił błąd
              </h2>
              <p className="text-gray-600 mb-4">{error}</p>
              <Button variant="blue" onClick={() => window.location.reload()}>
                Spróbuj ponownie
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);

  const formatBalance = (balance: number) =>
    new Intl.NumberFormat("pl-PL", {
      style: "currency",
      currency: "PLN",
    }).format(balance);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-grow w-full max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
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
            value={formatBalance(totalBalance)}
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
            title="Przychody (miesiąc)"
            value={"0,00 PLN"}
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
            title="Wydatki (miesiąc)"
            value={"0,00 PLN"}
            transition={{ delay: 2 * 0.05, duration: 0.3 }}
          />
        </div>

        <div className="flex justify-between items-center mt-8">
          <h2 className="text-xl font-medium text-gray-900">
            Ostatnie transakcje
          </h2>
          <Button
            variant="blue"
            type="button"
            onClick={() => setIsModalOpen(true)}
          >
            <PlusIcon className="h-5 w-5" />
            Dodaj transakcję
          </Button>
        </div>

        <div className="mt-4 bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            {transactions.map((transaction) => (
              <p key={transaction.id}>{transaction.name}</p>
            ))}
            {transactions.length === 0 && (
              <p className="text-gray-500 text-center">
                Nie dodano jeszcze żadnych transakcji
              </p>
            )}
          </div>
        </div>
      </main>

      <Footer />

      {user && (
        <AddTransactionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          userId={user?.uid}
          onTransactionAdded={fetchTransactions}
          categories={categories}
          accounts={accounts}
        />
      )}
    </div>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { PlusIcon } from "@heroicons/react/24/outline";
import { useAuth } from "@/contexts/AuthContext";
import { accountService } from "@/services/accountService";
import { categoryService } from "@/services/categoryService";
import { transactionService } from "@/services/transactionService";
import { Account } from "@/types/account";
import { Category } from "@/types/category";
import { Transaction } from "@/types/transaction";
import AddTransactionModal from "@/components/AddTransactionModal";
import Button from "@/components/Button";
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
      const userTransactions = await transactionService.getAllUserTransactions(user.uid);
      setTransactions(userTransactions);
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

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Header />

      <main className="mx-auto w-full max-w-7xl flex-grow px-4 py-10 sm:px-6 lg:px-8">
        {error && <div className="mb-8 rounded-lg bg-red-100 p-4 text-sm text-red-700">{error}</div>}

        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Transakcje</h1>
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
              transactions={transactions}
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

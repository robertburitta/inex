"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Loader from "@/components/Loader";
import { accountService } from "@/services/accountService";
import { Account } from "@/types/account";
import Card from "@/components/Card";

export default function Dashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
        if (!cancelled) setAccounts(userAccounts);
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

        {/* Przyciski akcji */}
        <div className="mt-8 flex flex-wrap gap-4">
          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
            Dodaj przychód
          </button>
          <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
            Dodaj wydatek
          </button>
        </div>

        {/* Tabela ostatnich transakcji */}
        <div className="mt-10">
          <h2 className="text-lg font-medium text-gray-900">
            Ostatnie transakcje
          </h2>
          <div className="mt-4 bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <p className="text-gray-500 text-center">Brak transakcji</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

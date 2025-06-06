"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { PencilIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useAuth } from "@/contexts/AuthContext";
import { accountService } from "@/services/accountService";
import { Account, AccountType } from "@/types/account";
import AddAccountModal from "@/components/AddAccountModal";
import Button from "@/components/Button";
import Card from "@/components/Card";
import DeleteAccountModal from "@/components/DeleteAccountModal";
import EditAccountModal from "@/components/EditAccountModal";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Loader from "@/components/Loader";

export default function AccountsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editAccount, setEditAccount] = useState<Account | null>(null);
  const [deleteAccount, setDeleteAccount] = useState<Account | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    let cancelled = false;
    if (user) {
      (async () => {
        try {
          setIsLoading(true);
          setError(null);
          const userAccounts = await accountService.getUserAccounts(user.uid);
          if (!cancelled) {
            setAccounts(userAccounts);
          }
        } catch (err) {
          console.error("Błąd pobierania kont:", err);
          if (!cancelled) {
            setError("Nie udało się pobrać listy kont");
          }
        } finally {
          if (!cancelled) {
            setIsLoading(false);
          }
        }
      })();
    }
    return () => {
      cancelled = true;
    };
  }, [user]);

  if (loading || isLoading) {
    return <Loader />;
  }

  const getAccountIcon = (type: AccountType) => {
    switch (type) {
      case AccountType.Bank:
        return "🏦";
      case AccountType.Cash:
        return "💵";
      default:
        return "📊";
    }
  };

  const formatBalance = (balance: number) => {
    return new Intl.NumberFormat("pl-PL", {
      style: "currency",
      currency: "PLN",
    }).format(balance);
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Header />

      <main className="mx-auto w-full max-w-7xl flex-grow px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Moje konta</h1>
          <Button
            variant="blue"
            type="button"
            onClick={() => setShowAddModal(true)}
          >
            <PlusIcon className="h-5 w-5" />
            Dodaj konto
          </Button>
        </div>

        {error && <div className="mb-4 rounded-lg bg-red-100 p-4 text-sm text-red-700">{error}</div>}

        {accounts.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg bg-white py-12 text-center shadow">
            <div className="mb-4 text-6xl">🏦</div>
            <h3 className="mb-2 text-lg font-medium text-gray-900">Nie masz jeszcze żadnych kont</h3>
            <p className="mb-6 text-gray-500">Dodaj swoje pierwsze konto, aby rozpocząć zarządzanie finansami</p>
            <Button
              variant="blue"
              onClick={() => setShowAddModal(true)}
            >
              <PlusIcon className="mr-2 h-5 w-5" />
              Dodaj pierwsze konto
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {accounts.map((account, i) => (
              <Card
                key={account.id}
                icon={<span>{getAccountIcon(account.type)}</span>}
                title={account.name}
                value={
                  <>
                    <span className="text-2xl font-semibold text-gray-900">{formatBalance(account.balance)}</span>
                    <span className="mt-1 block text-xs text-gray-500">
                      {account.type === AccountType.Bank ? "Konto bankowe" : "Gotówka"}
                    </span>
                  </>
                }
                transition={{ delay: i * 0.05, duration: 0.3 }}
                variant="extended"
              >
                <div className="ml-auto flex gap-2">
                  <button
                    title="Edytuj"
                    onClick={() => {
                      setEditAccount(account);
                      setShowEditModal(true);
                    }}
                    className="rounded-full p-2 text-blue-600 hover:bg-blue-100"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    title="Usuń"
                    onClick={() => {
                      setDeleteAccount(account);
                      setShowDeleteModal(true);
                    }}
                    className="rounded-full p-2 text-red-600 hover:bg-red-100"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>

      <Footer />

      {user && (
        <>
          <AddAccountModal
            isOpen={showAddModal}
            onClose={() => setShowAddModal(false)}
            userId={user.uid}
            onAccountAdded={() => setAccounts([...accounts])}
          />
          <EditAccountModal
            isOpen={showEditModal}
            onClose={() => setShowEditModal(false)}
            account={editAccount}
            userId={user.uid}
            onAccountUpdated={() => setAccounts([...accounts])}
          />
          <DeleteAccountModal
            isOpen={showDeleteModal}
            onClose={() => setShowDeleteModal(false)}
            account={deleteAccount}
            userId={user.uid}
            onAccountDeleted={() => setAccounts([...accounts])}
          />
        </>
      )}
    </div>
  );
}

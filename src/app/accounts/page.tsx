"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Loader from "@/components/Loader";
import { PlusIcon, TrashIcon, PencilIcon } from "@heroicons/react/24/outline";
import { accountService } from "@/services/accountService";
import { Account, AccountType } from "@/types/account";
import Card from "@/components/Card";
import Button from "@/components/Button";
import AddAccountModal from "@/components/AddAccountModal";
import EditAccountModal from "@/components/EditAccountModal";
import DeleteAccountModal from "@/components/DeleteAccountModal";

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
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-grow w-full max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
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

        {error && (
          <div className="mb-4 p-4 text-sm text-red-700 bg-red-100 rounded-lg">
            {error}
          </div>
        )}

        {accounts.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-12 bg-white rounded-lg shadow">
            <div className="text-6xl mb-4">🏦</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nie masz jeszcze żadnych kont
            </h3>
            <p className="text-gray-500 mb-6">
              Dodaj swoje pierwsze konto, aby rozpocząć zarządzanie finansami
            </p>
            <Button variant="blue" onClick={() => setShowAddModal(true)}>
              <PlusIcon className="h-5 w-5 mr-2" />
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
                    <span className="text-2xl font-semibold text-gray-900">
                      {formatBalance(account.balance)}
                    </span>
                    <span className="block text-xs text-gray-500 mt-1">
                      {account.type === AccountType.Bank
                        ? "Konto bankowe"
                        : "Gotówka"}
                    </span>
                  </>
                }
                transition={{ delay: i * 0.05, duration: 0.3 }}
                variant="extended"
              >
                <div className="flex gap-2 ml-auto">
                  <button
                    title="Edytuj"
                    onClick={() => {
                      setEditAccount(account);
                      setShowEditModal(true);
                    }}
                    className="p-2 rounded-full hover:bg-blue-100 text-blue-600"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    title="Usuń"
                    onClick={() => {
                      setDeleteAccount(account);
                      setShowDeleteModal(true);
                    }}
                    className="p-2 rounded-full hover:bg-red-100 text-red-600"
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

"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Loader from "@/components/Loader";
import { PlusIcon, TrashIcon, PencilIcon } from "@heroicons/react/24/outline";
import Modal from "@/components/Modal";
import FormInput from "@/components/FormInput";
import FormSelect from "@/components/FormSelect";
import { accountService } from "@/services/accountService";
import { Account } from "@/types/account";
import Card from "@/components/Card";

export default function AccountsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newAccount, setNewAccount] = useState({
    name: "",
    type: "bank" as "bank" | "cash",
    balance: 0,
  });
  const [showEditModal, setShowEditModal] = useState(false);
  const [editAccount, setEditAccount] = useState<Account | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<{
    open: boolean;
    account: Account | null;
  }>({ open: false, account: null });

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  // Pobieranie kont z bazy danych
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

  const handleAddAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setError(null);
      const accountId = await accountService.addAccount(user.uid, {
        name: newAccount.name,
        balance: newAccount.balance,
        currency: "PLN",
        type: newAccount.type,
      });

      const newAccountWithId: Account = {
        id: accountId,
        name: newAccount.name,
        balance: newAccount.balance,
        currency: "PLN",
        type: newAccount.type,
      };

      setAccounts([...accounts, newAccountWithId]);
      setNewAccount({ name: "", type: "bank", balance: 0 });
      setShowAddModal(false);
    } catch (err) {
      console.error("Błąd dodawania konta:", err);
      setError("Nie udało się dodać konta");
    }
  };

  const handleEditAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !editAccount) return;
    try {
      setError(null);
      await accountService.updateAccount(user.uid, editAccount.id, {
        name: editAccount.name,
        balance: editAccount.balance,
        currency: editAccount.currency,
        type: editAccount.type,
      });
      setAccounts(
        accounts.map((acc) => (acc.id === editAccount.id ? editAccount : acc))
      );
      setShowEditModal(false);
      setEditAccount(null);
    } catch (err) {
      console.error("Błąd edycji konta:", err);
      setError("Nie udało się zaktualizować konta");
    }
  };

  const handleDeleteAccount = async () => {
    if (!user || !showDeleteModal.account) return;
    try {
      setError(null);
      await accountService.deleteAccount(user.uid, showDeleteModal.account.id);
      setAccounts(
        accounts.filter((acc) => acc.id !== showDeleteModal.account!.id)
      );
      setShowDeleteModal({ open: false, account: null });
    } catch (err) {
      console.error("Błąd usuwania konta:", err);
      setError("Nie udało się usunąć konta");
    }
  };

  if (loading || isLoading) {
    return <Loader />;
  }

  const getAccountIcon = (type: Account["type"]) => {
    switch (type) {
      case "bank":
        return "🏦";
      case "cash":
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
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Dodaj konto
          </button>
        </div>

        {error && (
          <div className="mb-4 p-4 text-sm text-red-700 bg-red-100 rounded-lg">
            {error}
          </div>
        )}

        {accounts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <div className="text-6xl mb-4">🏦</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nie masz jeszcze żadnych kont
            </h3>
            <p className="text-gray-500 mb-6">
              Dodaj swoje pierwsze konto, aby rozpocząć zarządzanie finansami
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Dodaj pierwsze konto
            </button>
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
                      {account.type === "bank" ? "Konto bankowe" : "Gotówka"}
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
                    onClick={() => setShowDeleteModal({ open: true, account })}
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

      {/* Modal dodawania konta */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Dodaj nowe konto"
      >
        <form onSubmit={handleAddAccount} className="space-y-4">
          <FormInput
            label="Nazwa konta"
            id="name"
            value={newAccount.name}
            onChange={(e) =>
              setNewAccount({ ...newAccount, name: e.target.value })
            }
            required
          />
          <FormSelect
            label="Typ konta"
            id="type"
            value={newAccount.type}
            onChange={(e) =>
              setNewAccount({
                ...newAccount,
                type: e.target.value as "bank" | "cash",
              })
            }
          >
            <option value="bank">Konto bankowe</option>
            <option value="cash">Gotówka</option>
          </FormSelect>
          <FormInput
            label="Saldo początkowe"
            id="balance"
            type="number"
            step="0.01"
            value={newAccount.balance}
            onChange={(e) =>
              setNewAccount({
                ...newAccount,
                balance: parseFloat(e.target.value) || 0,
              })
            }
            required
          />
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Anuluj
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Dodaj konto
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal edycji konta */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditAccount(null);
        }}
        title="Edytuj konto"
      >
        <form onSubmit={handleEditAccount} className="space-y-4">
          <FormInput
            label="Nazwa konta"
            id="edit-name"
            value={editAccount?.name || ""}
            onChange={(e) =>
              setEditAccount(
                editAccount ? { ...editAccount, name: e.target.value } : null
              )
            }
            required
          />
          <FormSelect
            label="Typ konta"
            id="edit-type"
            value={editAccount?.type || "bank"}
            onChange={(e) =>
              setEditAccount(
                editAccount
                  ? { ...editAccount, type: e.target.value as "bank" | "cash" }
                  : null
              )
            }
          >
            <option value="bank">Konto bankowe</option>
            <option value="cash">Gotówka</option>
          </FormSelect>
          <FormInput
            label="Saldo"
            id="edit-balance"
            type="number"
            step="0.01"
            value={editAccount?.balance ?? 0}
            onChange={(e) =>
              setEditAccount(
                editAccount
                  ? { ...editAccount, balance: parseFloat(e.target.value) || 0 }
                  : null
              )
            }
            required
          />
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={() => {
                setShowEditModal(false);
                setEditAccount(null);
              }}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Anuluj
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Zapisz zmiany
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal potwierdzenia usunięcia */}
      <Modal
        isOpen={showDeleteModal.open}
        onClose={() => setShowDeleteModal({ open: false, account: null })}
        title="Usuń konto"
      >
        <p className="mb-6">
          Czy na pewno chcesz usunąć to konto? Tej operacji nie można cofnąć.
        </p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={() => setShowDeleteModal({ open: false, account: null })}
            className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
          >
            Anuluj
          </button>
          <button
            onClick={handleDeleteAccount}
            className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
          >
            Usuń
          </button>
        </div>
      </Modal>
    </div>
  );
}

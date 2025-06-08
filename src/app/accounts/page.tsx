"use client";

import { getAccountIcon, getAccountType } from "@/helpers/accountHelper";
import { formatBalance } from "@/helpers/transactionHelper";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { FunnelIcon, MagnifyingGlassIcon, PencilIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useAuth } from "@/contexts/AuthContext";
import { accountService } from "@/services/accountService";
import { Account, AccountType, Currency } from "@/types/account";
import AddAccountModal from "@/components/AddAccountModal";
import Button from "@/components/Button";
import Card from "@/components/Card";
import DeleteAccountModal from "@/components/DeleteAccountModal";
import EditAccountModal from "@/components/EditAccountModal";
import Footer from "@/components/Footer";
import FormInput from "@/components/FormInput";
import FormSelect from "@/components/FormSelect";
import Header from "@/components/Header";
import Loader from "@/components/Loader";

type FilterType = {
  search: string;
  type: AccountType | "";
  minAmount: string;
  maxAmount: string;
  currency: string;
};

export default function AccountsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editAccount, setEditAccount] = useState<Account | null>(null);
  const [deleteAccount, setDeleteAccount] = useState<Account | null>(null);
  const searchParams = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterType>({
    search: searchParams.get("search") || "",
    type: (searchParams.get("type") as AccountType) || "",
    currency: searchParams.get("currency") || "",
    minAmount: searchParams.get("minAmount") || "",
    maxAmount: searchParams.get("maxAmount") || "",
  });

  const fetchAccounts = useCallback(async () => {
    if (!user) return;

    try {
      setFetching(true);
      setError(null);
      const userAccounts = await accountService.getUserAccounts(user.uid);
      setAccounts(userAccounts);
    } catch (err) {
      console.error("Błąd pobierania kont:", err);
      setError("Nie udało się pobrać kont");
    } finally {
      setFetching(false);
    }
  }, [user]);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  const handleFilterChange = (field: keyof FilterType, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
    const params = new URLSearchParams(window.location.search);
    if (value === "") {
      params.delete(field);
    } else {
      params.set(field, value);
    }
    router.push(`/accounts?${params.toString()}`, { scroll: false });
  };

  const resetFilters = () => {
    setFilters({
      search: "",
      type: "",
      currency: "",
      minAmount: "",
      maxAmount: "",
    });
    router.push("/accounts", { scroll: false });
  };

  const filteredAccounts = accounts.filter((account) => {
    const matchesSearch = account.name.toLowerCase().includes(filters.search.toLowerCase());
    const matchesType = filters.type === "" || account.type === filters.type;
    const matchesCurrency = !filters.currency || account.currency === filters.currency;
    const minAmount = filters.minAmount ? parseFloat(filters.minAmount) : -Infinity;
    const maxAmount = filters.maxAmount ? parseFloat(filters.maxAmount) : Infinity;
    const matchesAmount = account.balance >= minAmount && account.balance <= maxAmount;

    return matchesSearch && matchesType && matchesCurrency && matchesAmount;
  });

  if (loading || fetching) {
    return <Loader />;
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Header />

      <main className="mx-auto w-full max-w-7xl flex-grow px-4 py-10 sm:px-6 lg:px-8">
        {error && <div className="mb-8 rounded-lg bg-red-100 p-4 text-sm text-red-700">{error}</div>}

        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Moje konta</h1>
          <div className="flex gap-4">
            <Button
              variant="gray"
              onClick={() => setShowFilters(!showFilters)}
            >
              <FunnelIcon className="h-5 w-5" />
              Filtry
            </Button>
            <Button
              variant="blue"
              type="button"
              onClick={() => setShowAddModal(true)}
            >
              <PlusIcon className="h-5 w-5" />
              Dodaj konto
            </Button>
          </div>
        </div>

        {showFilters && (
          <div className="mb-8 overflow-hidden rounded-lg bg-white p-4 shadow">
            <div className="grid grid-cols-1 items-end gap-4 sm:grid-cols-2 lg:grid-cols-5">
              <FormInput
                id="name"
                label="Nazwa konta"
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                placeHolder={
                  <>
                    <MagnifyingGlassIcon className="mr-1 h-5 w-5" />
                    Szukaj po nazwie...
                  </>
                }
              />

              <FormSelect
                id="type"
                label="Typ konta"
                value={filters.type}
                onChange={(e) => handleFilterChange("type", e.target.value)}
              >
                <option value="">Wszystkie typy</option>
                {Object.values(AccountType).map((type) => (
                  <option
                    key={type}
                    value={type}
                  >
                    {getAccountType(type)}
                  </option>
                ))}
              </FormSelect>

              <FormSelect
                id="currency"
                label="Waluta"
                value={filters.currency}
                onChange={(e) => handleFilterChange("currency", e.target.value)}
              >
                <option value="">Wszystkie waluty</option>
                {Object.values(Currency).map((currency) => (
                  <option
                    key={currency}
                    value={currency}
                  >
                    {currency}
                  </option>
                ))}
              </FormSelect>

              <div className="flex gap-2">
                <FormInput
                  id="minAmount"
                  label="Min. kwota"
                  type="number"
                  value={filters.minAmount}
                  onChange={(e) => handleFilterChange("minAmount", e.target.value)}
                />

                <FormInput
                  id="maxAmount"
                  label="Max. kwota"
                  type="number"
                  value={filters.maxAmount}
                  onChange={(e) => handleFilterChange("maxAmount", e.target.value)}
                />
              </div>

              <Button
                variant="gray"
                onClick={resetFilters}
              >
                Resetuj filtry
              </Button>
            </div>
          </div>
        )}

        {filteredAccounts.length === 0 ? (
          Object.values(filters).every((filter) => filter === "") ? (
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
            <div className="flex flex-col items-center justify-center rounded-lg bg-white py-12 text-center shadow">
              <h3 className="mb-2 text-lg font-medium text-gray-900">Nie znaleziono kont</h3>
              <p className="text-gray-500">Spróbuj zmienić kryteria wyszukiwania lub dodaj nowe konto</p>
            </div>
          )
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredAccounts.map((account, i) => (
              <Card
                key={account.id}
                icon={<span>{getAccountIcon(account.type)}</span>}
                title={account.name}
                value={
                  <>
                    <span className="text-2xl font-semibold text-gray-900">{formatBalance(account.balance, account.currency)}</span>
                    <span className="mt-1 block text-xs text-gray-500">{getAccountType(account.type)}</span>
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
            onAccountAdded={fetchAccounts}
          />
          <EditAccountModal
            isOpen={showEditModal}
            onClose={() => setShowEditModal(false)}
            account={editAccount}
            userId={user.uid}
            onAccountUpdated={fetchAccounts}
          />
          <DeleteAccountModal
            isOpen={showDeleteModal}
            onClose={() => setShowDeleteModal(false)}
            account={deleteAccount}
            userId={user.uid}
            onAccountDeleted={fetchAccounts}
          />
        </>
      )}
    </div>
  );
}

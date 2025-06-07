"use client";

import { getTransactionType } from "@/helpers/transactionHelper";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import * as Icons from "@heroicons/react/24/outline";
import { useAuth } from "@/contexts/AuthContext";
import { categoryService } from "@/services/categoryService";
import { Category } from "@/types/category";
import { TransactionType } from "@/types/transaction";
import AddCategoryModal from "@/components/AddCategoryModal";
import Button from "@/components/Button";
import DeleteCategoryModal from "@/components/DeleteCategoryModal";
import EditCategoryModal from "@/components/EditCategoryModal";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Loader from "@/components/Loader";

export default function CategoriesPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editCategory, setEditCategory] = useState<Category | null>(null);
  const [deleteCategory, setDeleteCategory] = useState<Category | null>(null);

  const fetchCategories = useCallback(async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      setError(null);
      const defaultCategories = await categoryService.getDefaultCategories();
      const userCategories = await categoryService.getUserCategories(user.uid);
      setCategories([...userCategories, ...defaultCategories]);
    } catch (err) {
      console.error("Błąd pobierania kategorii:", err);
      setError("Nie udało się pobrać kategorii");
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
    fetchCategories();
  }, [fetchCategories]);

  if (loading || isLoading) {
    return <Loader />;
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Header />

      <main className="mx-auto w-full max-w-7xl flex-grow px-4 py-10 sm:px-6 lg:px-8">
        {error && <div className="mb-8 rounded-lg bg-red-100 p-4 text-sm text-red-700">{error}</div>}

        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Kategorie</h1>
          <Button
            variant="blue"
            onClick={() => setShowAddModal(true)}
          >
            <Icons.PlusIcon className="h-5 w-5" />
            Dodaj kategorię
          </Button>
        </div>

        {error && <div className="relative mb-4 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}

        <div className="overflow-hidden rounded-lg bg-white shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">Ikona</th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">Nazwa</th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">Typ</th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">Kolor</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {categories.map((category) => {
                const CategoryIcon = Icons[`${category.icon}Icon` as keyof typeof Icons];
                return (
                  <tr key={category.id}>
                    <td className="px-6 py-4 text-2xl whitespace-nowrap">
                      <CategoryIcon className="h-6 w-6" />
                    </td>
                    <td className="px-6 py-4 font-medium whitespace-nowrap text-gray-900">{category.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={category.type === TransactionType.Expense ? "text-red-600" : "text-green-600"}>
                        {getTransactionType(category.type)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className="inline-block h-6 w-6 rounded-full border"
                        style={{ backgroundColor: category.color }}
                      ></span>
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      {!category.isDefault && (
                        <>
                          <button
                            onClick={() => {
                              setEditCategory(category);
                              setShowEditModal(true);
                            }}
                            className="mr-4 text-blue-600 hover:text-blue-800"
                            title="Edytuj kategorię"
                          >
                            <Icons.PencilIcon className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => {
                              setDeleteCategory(category);
                              setShowDeleteModal(true);
                            }}
                            className="text-red-600 hover:text-red-800"
                            title="Usuń kategorię"
                          >
                            <Icons.TrashIcon className="h-5 w-5" />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </main>

      <Footer />

      {user && (
        <>
          <AddCategoryModal
            isOpen={showAddModal}
            onClose={() => setShowAddModal(false)}
            userId={user.uid}
            onCategoryAdded={fetchCategories}
          />
          <EditCategoryModal
            isOpen={showEditModal}
            onClose={() => setShowEditModal(false)}
            category={editCategory}
            userId={user.uid}
            onCategoryUpdated={fetchCategories}
          />
          <DeleteCategoryModal
            isOpen={showDeleteModal}
            onClose={() => setShowDeleteModal(false)}
            category={deleteCategory}
            userId={user.uid}
            onCategoryDeleted={fetchCategories}
          />
        </>
      )}
    </div>
  );
}

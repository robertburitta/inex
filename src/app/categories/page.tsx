"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { categoryService } from "@/services/categoryService";
import { Category } from "@/types/category";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Button from "@/components/Button";
import Loader from "@/components/Loader";
import * as Icons from "@heroicons/react/24/outline";
import AddCategoryModal from "@/components/AddCategoryModal";
import EditCategoryModal from "@/components/EditCategoryModal";
import DeleteCategoryModal from "@/components/DeleteCategoryModal";
import { TransactionType } from "@/types/transaction";

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

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-grow max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Kategorie</h1>
          <Button variant="blue" onClick={() => setShowAddModal(true)}>
            <Icons.PlusIcon className="h-5 w-5" />
            Dodaj kategorię
          </Button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded relative text-sm mb-4">
            {error}
          </div>
        )}

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ikona
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nazwa
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Typ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kolor
                </th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {categories.map((category) => {
                const CategoryIcon =
                  Icons[`${category.icon}Icon` as keyof typeof Icons];
                return (
                  <tr key={category.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-2xl">
                      <CategoryIcon className="h-6 w-6" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                      {category.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={
                          category.type === TransactionType.Expense
                            ? "text-red-600"
                            : "text-green-600"
                        }
                      >
                        {category.type === TransactionType.Expense
                          ? "Wydatek"
                          : "Przychód"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className="inline-block w-6 h-6 rounded-full border"
                        style={{ backgroundColor: category.color }}
                      ></span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      {!category.isDefault && (
                        <>
                          <button
                            onClick={() => {
                              setEditCategory(category);
                              setShowEditModal(true);
                            }}
                            className="text-blue-600 hover:text-blue-800 mr-4"
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

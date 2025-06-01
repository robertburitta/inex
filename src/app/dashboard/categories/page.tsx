"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { categoryService } from "@/services/categoryService";
import { Category, DEFAULT_CATEGORIES } from "@/types/category";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Loader from "@/components/Loader";
import FormInput from "@/components/FormInput";
import FormSelect from "@/components/FormSelect";
import Modal from "@/components/Modal";

export default function CategoriesPage() {
  const { user } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState<{
    open: boolean;
    categoryId: string | null;
  }>({ open: false, categoryId: null });
  const [newCategory, setNewCategory] = useState({
    name: "",
    type: "expense" as "expense" | "income",
    color: "#000000",
    icon: "📦",
  });
  const [defaultCategories, setDefaultCategories] = useState<Category[]>([]);

  useEffect(() => {
    let cancelled = false;
    if (user) {
      (async () => {
        setLoading(true);
        setError(null);
        // Pobierz domyślne kategorie
        const defaults = await categoryService.getDefaultCategories();
        if (!cancelled) setDefaultCategories(defaults);
        // Pobierz kategorie użytkownika
        const userCategories = await categoryService.getUserCategories(
          user.uid
        );
        if (!cancelled) setCategories(userCategories);
        setLoading(false);
      })();
    }
    return () => {
      cancelled = true;
    };
  }, [user]);

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.name.trim()) return;

    try {
      const categoryId = await categoryService.addCategory(user!.uid, {
        ...newCategory,
      });
      setCategories([
        ...categories,
        { id: categoryId, ...newCategory, isDefault: false },
      ]);
      setNewCategory({
        name: "",
        type: "expense",
        color: "#000000",
        icon: "📦",
      });
      setShowAddModal(false);
    } catch (err) {
      setError("Nie udało się dodać kategorii");
      console.error("Błąd dodawania kategorii:", err);
    }
  };

  const handleDeleteCategory = async () => {
    if (!showDeleteModal.categoryId) return;
    try {
      await categoryService.deleteCategory(
        user!.uid,
        showDeleteModal.categoryId
      );
      setCategories(
        categories.filter((cat) => cat.id !== showDeleteModal.categoryId)
      );
      setShowDeleteModal({ open: false, categoryId: null });
    } catch (err) {
      setError("Nie udało się usunąć kategorii");
      console.error("Błąd usuwania kategorii:", err);
    }
  };

  const allCategories = [...defaultCategories, ...categories];

  if (loading) {
    return <Loader />;
  }

  async function seedDefaultCategories() {
    const defaultRef = collection(db, "categories-default");
    for (const cat of DEFAULT_CATEGORIES) {
      await addDoc(defaultRef, cat);
    }
    console.log("Domyślne kategorie zostały dodane!");
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-grow max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Kategorie</h1>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Dodaj kategorię
          </button>
          {/* <button onClick={() => seedDefaultCategories()}>Seed</button> */}
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
              {allCategories.map((category) => (
                <tr key={category.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-2xl">
                    {category.icon}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                    {category.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={
                        category.type === "expense"
                          ? "text-red-600"
                          : "text-green-600"
                      }
                    >
                      {category.type === "expense" ? "Wydatek" : "Przychód"}
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
                      <button
                        onClick={() =>
                          setShowDeleteModal({
                            open: true,
                            categoryId: category.id,
                          })
                        }
                        className="text-red-600 hover:text-red-800"
                        title="Usuń kategorię"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal dodawania kategorii */}
        <Modal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          title="Dodaj kategorię"
        >
          <form onSubmit={handleAddCategory} className="space-y-4">
            <FormInput
              label="Nazwa kategorii"
              id="name"
              value={newCategory.name}
              onChange={(e) =>
                setNewCategory({ ...newCategory, name: e.target.value })
              }
              required
            />
            <FormSelect
              label="Typ"
              id="type"
              value={newCategory.type}
              onChange={(e) =>
                setNewCategory({
                  ...newCategory,
                  type: e.target.value as "expense" | "income",
                })
              }
            >
              <option value="expense">Wydatek</option>
              <option value="income">Przychód</option>
            </FormSelect>
            <div className="flex flex-col sm:flex-row gap-4">
              <FormInput
                label="Kolor"
                id="color"
                type="color"
                value={newCategory.color}
                onChange={(e) =>
                  setNewCategory({ ...newCategory, color: e.target.value })
                }
                className="sm:w-1/2"
              />
              <FormInput
                label="Ikona"
                id="icon"
                value={newCategory.icon}
                onChange={(e) =>
                  setNewCategory({ ...newCategory, icon: e.target.value })
                }
                placeholder="np. 🏠"
                className="sm:w-1/2"
              />
            </div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Dodaj kategorię
            </button>
          </form>
        </Modal>

        {/* Modal potwierdzenia usuwania */}
        <Modal
          isOpen={showDeleteModal.open}
          onClose={() => setShowDeleteModal({ open: false, categoryId: null })}
          title="Usuń kategorię"
        >
          <p className="mb-6">
            Czy na pewno chcesz usunąć tę kategorię? Tej operacji nie można
            cofnąć.
          </p>
          <div className="flex justify-end space-x-4">
            <button
              onClick={() =>
                setShowDeleteModal({ open: false, categoryId: null })
              }
              className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
            >
              Anuluj
            </button>
            <button
              onClick={handleDeleteCategory}
              className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
            >
              Usuń
            </button>
          </div>
        </Modal>
      </main>
      <Footer />
    </div>
  );
}

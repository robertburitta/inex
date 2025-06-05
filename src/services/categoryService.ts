import {
  collection,
  doc,
  getDocs,
  addDoc,
  deleteDoc,
  query,
  orderBy,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Category } from "@/types/category";

export const categoryService = {
  async getDefaultCategories(): Promise<Category[]> {
    const defaultRef = collection(db, "categories-default");
    const q = query(defaultRef, orderBy("name"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as Category)
    );
  },

  async getUserCategories(userId: string): Promise<Category[]> {
    const userRef = collection(db, "users", userId, "categories");
    const q = query(userRef, orderBy("name"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as Category)
    );
  },

  async addCategory(
    userId: string,
    category: Omit<Category, "id" | "userId" | "isDefault">
  ): Promise<string> {
    const userRef = collection(db, "users", userId, "categories");
    const docRef = await addDoc(userRef, {
      ...category,
      isDefault: false,
    });
    return docRef.id;
  },

  async updateCategory(userId: string, category: Category): Promise<void> {
    const categoryRef = doc(db, "users", userId, "categories", category.id);
    await updateDoc(categoryRef, {
      name: category.name,
      type: category.type,
      color: category.color,
      icon: category.icon,
      isDefault: category.isDefault,
    });
  },

  async deleteCategory(userId: string, categoryId: string): Promise<void> {
    const categoryRef = doc(db, "users", userId, "categories", categoryId);
    await deleteDoc(categoryRef);
  },
};

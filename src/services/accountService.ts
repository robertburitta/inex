import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { Account } from "@/types/account";

export const accountService = {
  // Pobierz wszystkie konta użytkownika
  async getUserAccounts(userId: string): Promise<Account[]> {
    const accountsRef = collection(db, "users", userId, "accounts");
    const querySnapshot = await getDocs(accountsRef);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Account[];
  },

  // Dodaj nowe konto
  async addAccount(
    userId: string,
    account: Omit<Account, "id">
  ): Promise<string> {
    const accountsRef = collection(db, "users", userId, "accounts");
    const docRef = await addDoc(accountsRef, account);
    return docRef.id;
  },

  // Aktualizuj konto
  async updateAccount(
    userId: string,
    accountId: string,
    data: Partial<Omit<Account, "id">>
  ): Promise<void> {
    const accountRef = doc(db, "users", userId, "accounts", accountId);
    await updateDoc(accountRef, data);
  },

  // Usuń konto
  async deleteAccount(userId: string, accountId: string): Promise<void> {
    const accountRef = doc(db, "users", userId, "accounts", accountId);
    await deleteDoc(accountRef);
  },
};

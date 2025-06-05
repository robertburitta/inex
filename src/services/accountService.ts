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
  async getUserAccounts(userId: string): Promise<Account[]> {
    const accountsRef = collection(db, "users", userId, "accounts");
    const querySnapshot = await getDocs(accountsRef);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Account[];
  },

  async addAccount(
    userId: string,
    account: Omit<Account, "id">
  ): Promise<string> {
    const accountsRef = collection(db, "users", userId, "accounts");
    const docRef = await addDoc(accountsRef, account);
    return docRef.id;
  },

  async updateAccount(
    userId: string,
    accountId: string,
    account: Partial<Account>
  ): Promise<void> {
    const accountRef = doc(db, "users", userId, "accounts", accountId);
    await updateDoc(accountRef, account);
  },

  async deleteAccount(userId: string, accountId: string): Promise<void> {
    const accountRef = doc(db, "users", userId, "accounts", accountId);
    await deleteDoc(accountRef);
  },
};

import { db } from "@/lib/firebase";
import { Transaction } from "@/types/transaction";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
} from "firebase/firestore";

export const transactionService = {
  async getTransactions(userId: string): Promise<Transaction[]> {
    const transactionsRef = collection(db, "users", userId, "transactions");
    const querySnapshot = await getDocs(transactionsRef);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Transaction[];
  },

  async addTransaction(
    userId: string,
    transaction: Omit<Transaction, "id">
  ): Promise<void> {
    const transactionsRef = collection(db, "users", userId, "transactions");
    await addDoc(transactionsRef, transaction);
  },

  async updateTransaction(
    userId: string,
    transactionId: string,
    transaction: Partial<Transaction>
  ): Promise<void> {
    const transactionRef = doc(
      db,
      "users",
      userId,
      "transactions",
      transactionId
    );
    await updateDoc(transactionRef, transaction);
  },

  async deleteTransaction(
    userId: string,
    transactionId: string
  ): Promise<void> {
    const transactionRef = doc(
      db,
      "users",
      userId,
      "transactions",
      transactionId
    );
    await deleteDoc(transactionRef);
  },
};

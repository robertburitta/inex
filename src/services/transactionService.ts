import { addDoc, collection, deleteDoc, doc, getDocs, limit, orderBy, query, updateDoc, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Transaction, TransactionType } from "@/types/transaction";
import { accountService } from "./accountService";

export const transactionService = {
  async getLastUserTransactions(userId: string): Promise<Transaction[]> {
    const transactionsRef = collection(db, "users", userId, "transactions");
    const querySnapshot = await getDocs(query(transactionsRef, orderBy("date", "desc"), limit(10)));
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Transaction[];
  },

  async getMonthUserTransactions(userId: string): Promise<Transaction[]> {
    const currentDate = new Date();
    const transactionsRef = collection(db, "users", userId, "transactions");
    const querySnapshot = await getDocs(
      query(
        transactionsRef,
        where("date", ">=", new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)),
        where("date", "<", new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)),
      ),
    );
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Transaction[];
  },

  async getAllUserTransactions(userId: string): Promise<Transaction[]> {
    const transactionsRef = collection(db, "users", userId, "transactions");
    const querySnapshot = await getDocs(transactionsRef);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Transaction[];
  },

  async addTransaction(userId: string, transaction: Omit<Transaction, "id">): Promise<void> {
    const transactionsRef = collection(db, "users", userId, "transactions");
    await addDoc(transactionsRef, transaction);
    const account = await accountService.getUserAccount(userId, transaction.account);
    await accountService.updateAccount(userId, transaction.account, {
      balance: account.balance + (transaction.type === TransactionType.Expense ? -transaction.amount : transaction.amount),
    });
  },

  async updateTransaction(userId: string, transactionId: string, transaction: Partial<Transaction>): Promise<void> {
    const transactionRef = doc(db, "users", userId, "transactions", transactionId);
    await updateDoc(transactionRef, transaction);
  },

  async deleteTransaction(userId: string, transactionId: string): Promise<void> {
    const transactionRef = doc(db, "users", userId, "transactions", transactionId);
    await deleteDoc(transactionRef);
  },
};

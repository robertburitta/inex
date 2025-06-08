import { getAccountType } from "@/helpers/accountHelper";
import { getTransactionType } from "@/helpers/transactionHelper";
import { Timestamp } from "firebase/firestore";
import React, { useState } from "react";
import { transactionService } from "@/services/transactionService";
import { Account, Currency } from "@/types/account";
import { Category } from "@/types/category";
import { Transaction, TransactionType } from "@/types/transaction";
import Button from "./Button";
import FormInput from "./FormInput";
import FormSelect from "./FormSelect";
import Modal from "./Modal";

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  categories: Category[];
  accounts: Account[];
  onTransactionAdded: () => void;
}

const AddTransactionModal: React.FC<AddTransactionModalProps> = ({ isOpen, onClose, userId, categories, accounts, onTransactionAdded }) => {
  const [newTransaction, setNewTransaction] = useState<Omit<Transaction, "id">>({
    name: "",
    type: TransactionType.Expense,
    amount: 0,
    currency: Currency.PLN,
    date: Timestamp.fromDate(new Date()),
    category: "",
    account: "",
    description: "",
  });

  const handleAddTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await transactionService.addTransaction(userId, newTransaction);
      setNewTransaction({
        name: "",
        type: TransactionType.Expense,
        amount: 0,
        currency: Currency.PLN,
        date: Timestamp.fromDate(new Date()),
        category: "",
        account: "",
        description: "",
      });
      onTransactionAdded();
      onClose();
    } catch (error) {
      console.error("Błąd podczas dodawania transakcji:", error);
    }
  };

  const filteredCategories = categories.filter((cat) => cat.type === newTransaction.type);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Dodaj nową transakcję"
    >
      <form
        onSubmit={handleAddTransaction}
        className="space-y-4"
      >
        <FormSelect
          label="Typ transakcji"
          id="type"
          value={newTransaction.type}
          onChange={(e) => setNewTransaction({ ...newTransaction, type: e.target.value as TransactionType })}
          required
        >
          {Object.values(TransactionType).map((type) => (
            <option
              key={type}
              value={type}
            >
              {getTransactionType(type)}
            </option>
          ))}
        </FormSelect>
        <FormInput
          label="Nazwa"
          id="name"
          type="text"
          value={newTransaction.name}
          onChange={(e) => setNewTransaction({ ...newTransaction, name: e.target.value })}
          required
        />
        <FormInput
          label="Kwota"
          id="amount"
          type="number"
          value={newTransaction.amount}
          onChange={(e) => setNewTransaction({ ...newTransaction, amount: Number(e.target.value) })}
          required
        />
        <FormInput
          label="Data"
          id="date"
          type="date"
          value={newTransaction.date.toDate().toISOString().split("T")[0]}
          onChange={(e) => {
            setNewTransaction({ ...newTransaction, date: Timestamp.fromDate(new Date(e.target.value)) });
          }}
          required
        />
        <FormSelect
          label="Kategoria"
          id="category"
          value={newTransaction.category}
          onChange={(e) => setNewTransaction({ ...newTransaction, category: e.target.value })}
          required
        >
          <option value="">Wybierz kategorię</option>
          {filteredCategories.map((cat) => (
            <option
              key={cat.id}
              value={cat.id}
            >
              {cat.name}
            </option>
          ))}
        </FormSelect>
        <FormSelect
          label="Konto"
          id="account"
          value={newTransaction.account}
          onChange={(e) => setNewTransaction({ ...newTransaction, account: e.target.value })}
          required
        >
          <option value="">Wybierz konto</option>
          {accounts.map((acc) => (
            <option
              key={acc.id}
              value={acc.id}
            >
              {acc.name} ({getAccountType(acc.type)})
            </option>
          ))}
        </FormSelect>
        <FormInput
          label="Opis (opcjonalny)"
          id="description"
          type="textarea"
          value={newTransaction.description}
          onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
        />
        <div className="flex justify-end space-x-2">
          <Button
            variant="gray"
            type="button"
            onClick={onClose}
          >
            Anuluj
          </Button>
          <Button
            variant="blue"
            type="submit"
          >
            Dodaj transakcję
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddTransactionModal;

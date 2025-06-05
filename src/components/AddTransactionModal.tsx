import React, { useState } from "react";
import Modal from "./Modal";
import FormInput from "./FormInput";
import FormSelect from "./FormSelect";
import Button from "./Button";
import { Category } from "@/types/category";
import { Account, AccountType } from "@/types/account";
import { transactionService } from "@/services/transactionService";
import { Transaction, TransactionType } from "@/types/transaction";

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  categories: Category[];
  accounts: Account[];
  onTransactionAdded: () => void;
}

const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
  isOpen,
  onClose,
  userId,
  categories,
  accounts,
  onTransactionAdded,
}) => {
  const [type, setType] = useState<TransactionType>(TransactionType.Expense);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("");
  const [account, setAccount] = useState("");
  const [description, setDescription] = useState("");

  const [newTransaction, setNewTransaction] = useState<Omit<Transaction, "id">>(
    {
      name: "",
      type: TransactionType.Expense,
      amount: 0,
      date: "",
      category: "",
      account: "",
      description: "",
    }
  );

  const handleAddTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await transactionService.addTransaction(userId, newTransaction);
      setNewTransaction({
        name: "",
        type: TransactionType.Expense,
        amount: 0,
        date: "",
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

  const filteredCategories = categories.filter((cat) => cat.type === type);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Dodaj nową transakcję">
      <form onSubmit={handleAddTransaction} className="space-y-4">
        <FormSelect
          label="Typ transakcji"
          id="type"
          value={type}
          onChange={(e) => setType(e.target.value as TransactionType)}
          required
        >
          <option value={TransactionType.Expense}>Wydatek</option>
          <option value={TransactionType.Income}>Przychód</option>
        </FormSelect>
        <FormInput
          label="Nazwa"
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <FormInput
          label="Kwota"
          id="amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
        <FormInput
          label="Data"
          id="date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
        <FormSelect
          label="Kategoria"
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        >
          <option value="">Wybierz kategorię</option>
          {filteredCategories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </FormSelect>
        <FormSelect
          label="Konto"
          id="account"
          value={account}
          onChange={(e) => setAccount(e.target.value)}
          required
        >
          <option value="">Wybierz konto</option>
          {accounts.map((acc) => (
            <option key={acc.id} value={acc.id}>
              {acc.name} (
              {acc.type === AccountType.Bank ? "Konto bankowe" : "Gotówka"})
            </option>
          ))}
        </FormSelect>
        <FormInput
          label="Opis (opcjonalny)"
          id="description"
          type="textarea"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div className="flex justify-end space-x-2">
          <Button variant="gray" type="button" onClick={onClose}>
            Anuluj
          </Button>
          <Button variant="blue" type="submit">
            Dodaj transakcję
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddTransactionModal;

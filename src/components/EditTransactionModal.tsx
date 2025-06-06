import React, { useEffect, useState } from "react";
import { transactionService } from "@/services/transactionService";
import { Category } from "@/types/category";
import { Transaction, TransactionType } from "@/types/transaction";
import Button from "./Button";
import FormInput from "./FormInput";
import FormSelect from "./FormSelect";
import Modal from "./Modal";

interface EditTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction | null;
  userId: string;
  categories: Category[];
  onTransactionUpdated: () => void;
}

const EditTransactionModal: React.FC<EditTransactionModalProps> = ({
  isOpen,
  onClose,
  transaction,
  userId,
  categories,
  onTransactionUpdated,
}) => {
  const [editedTransaction, setEditedTransaction] = useState<Transaction | null>(null);

  useEffect(() => {
    if (transaction) {
      setEditedTransaction(transaction);
    }
  }, [transaction]);

  const handleUpdateTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editedTransaction) return;

    try {
      await transactionService.updateTransaction(userId, editedTransaction.id, editedTransaction);
      onTransactionUpdated();
      onClose();
    } catch (error) {
      console.error("Błąd podczas aktualizacji transakcji:", error);
    }
  };

  if (!editedTransaction) return null;

  const filteredCategories = categories.filter((category) => category.type === editedTransaction.type);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edytuj transakcję"
    >
      <form
        onSubmit={handleUpdateTransaction}
        className="space-y-4"
      >
        <FormInput
          label="Kwota"
          id="amount"
          type="number"
          step="0.01"
          min="0"
          value={editedTransaction.amount}
          onChange={(e) =>
            setEditedTransaction({
              ...editedTransaction,
              amount: parseFloat(e.target.value),
            })
          }
          required
        />
        <FormSelect
          label="Typ transakcji"
          id="type"
          value={editedTransaction.type}
          onChange={(e) =>
            setEditedTransaction({
              ...editedTransaction,
              type: e.target.value as TransactionType,
            })
          }
        >
          <option value="expense">Wydatek</option>
          <option value="income">Przychód</option>
        </FormSelect>
        <FormSelect
          label="Kategoria"
          id="categoryId"
          value={editedTransaction.category}
          onChange={(e) =>
            setEditedTransaction({
              ...editedTransaction,
              category: e.target.value,
            })
          }
          required
        >
          {filteredCategories.map((category) => (
            <option
              key={category.id}
              value={category.id}
            >
              {category.name}
            </option>
          ))}
        </FormSelect>
        <FormInput
          label="Data"
          id="date"
          type="date"
          value={editedTransaction.date}
          onChange={(e) =>
            setEditedTransaction({
              ...editedTransaction,
              date: e.target.value,
            })
          }
          required
        />
        <FormInput
          label="Opis"
          id="description"
          value={editedTransaction.description}
          onChange={(e) =>
            setEditedTransaction({
              ...editedTransaction,
              description: e.target.value,
            })
          }
        />
        <div className="mt-6 flex justify-end space-x-3">
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
            Zapisz zmiany
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default EditTransactionModal;

import React from "react";
import Modal from "./Modal";
import Button from "./Button";
import { transactionService } from "@/services/transactionService";
import { Transaction } from "@/types/transaction";

interface DeleteTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction | null;
  userId: string;
  onTransactionDeleted: () => void;
}

const DeleteTransactionModal: React.FC<DeleteTransactionModalProps> = ({
  isOpen,
  onClose,
  transaction,
  userId,
  onTransactionDeleted,
}) => {
  const handleDeleteTransaction = async () => {
    if (!transaction) return;

    try {
      await transactionService.deleteTransaction(userId, transaction.id);
      onTransactionDeleted();
      onClose();
    } catch (error) {
      console.error("Błąd podczas usuwania transakcji:", error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Usuń transakcję">
      <div className="space-y-4">
        <p className="text-gray-700">
          Czy na pewno chcesz usunąć tę transakcję? Tej operacji nie można
          cofnąć.
        </p>
        <div className="flex justify-end space-x-3 mt-6">
          <Button variant="gray" type="button" onClick={onClose}>
            Anuluj
          </Button>
          <Button variant="red" type="button" onClick={handleDeleteTransaction}>
            Usuń
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteTransactionModal;

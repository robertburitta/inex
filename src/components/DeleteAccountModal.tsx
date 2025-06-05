import React from "react";
import Modal from "./Modal";
import Button from "./Button";
import { accountService } from "@/services/accountService";
import { Account } from "@/types/account";

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  account: Account | null;
  userId: string;
  onAccountDeleted: () => void;
}

const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({
  isOpen,
  onClose,
  account,
  userId,
  onAccountDeleted,
}) => {
  const handleDeleteAccount = async () => {
    if (!account) return;

    try {
      await accountService.deleteAccount(userId, account.id);
      onAccountDeleted();
      onClose();
    } catch (error) {
      console.error("Błąd podczas usuwania konta:", error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Potwierdź usunięcie">
      <div className="space-y-4">
        <p>
          Czy na pewno chcesz usunąć konto &quot;{account?.name}&quot;? Tej
          operacji nie można cofnąć.
        </p>
        <div className="flex justify-end space-x-3">
          <Button variant="gray" onClick={onClose}>
            Anuluj
          </Button>
          <Button variant="red" onClick={handleDeleteAccount}>
            Usuń
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteAccountModal;

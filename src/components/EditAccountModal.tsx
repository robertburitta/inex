import { getAccountType } from "@/helpers/accountHelper";
import React, { useEffect, useState } from "react";
import { accountService } from "@/services/accountService";
import { Account, AccountType } from "@/types/account";
import Button from "./Button";
import FormInput from "./FormInput";
import FormSelect from "./FormSelect";
import Modal from "./Modal";

interface EditAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  account: Account | null;
  userId: string;
  onAccountUpdated: () => void;
}

const EditAccountModal: React.FC<EditAccountModalProps> = ({ isOpen, onClose, account, userId, onAccountUpdated }) => {
  const [editedAccount, setEditedAccount] = useState<Account | null>(null);

  useEffect(() => {
    if (account) {
      setEditedAccount(account);
    }
  }, [account]);

  const handleEditAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editedAccount) return;

    try {
      await accountService.updateAccount(userId, editedAccount.id, editedAccount);
      onAccountUpdated();
      onClose();
    } catch (error) {
      console.error("Błąd podczas aktualizacji konta:", error);
    }
  };

  if (!editedAccount) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edytuj konto"
    >
      <form
        onSubmit={handleEditAccount}
        className="space-y-4"
      >
        <FormInput
          label="Nazwa konta"
          id="name"
          value={editedAccount.name}
          onChange={(e) => setEditedAccount({ ...editedAccount, name: e.target.value })}
          required
        />
        <FormSelect
          label="Typ konta"
          id="type"
          value={editedAccount.type}
          onChange={(e) =>
            setEditedAccount({
              ...editedAccount,
              type: e.target.value as AccountType,
            })
          }
          required
        >
          {Object.values(AccountType).map((type) => (
            <option
              key={type}
              value={type}
            >
              {getAccountType(type)}
            </option>
          ))}
        </FormSelect>
        <FormInput
          label="Saldo"
          id="balance"
          type="number"
          step="0.01"
          value={editedAccount.balance}
          onChange={(e) =>
            setEditedAccount({
              ...editedAccount,
              balance: parseFloat(e.target.value) || 0,
            })
          }
          required
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

export default EditAccountModal;

import { getAccountType } from "@/helpers/accountHelper";
import React, { useState } from "react";
import { accountService } from "@/services/accountService";
import { Account, AccountType, Currency } from "@/types/account";
import Button from "./Button";
import FormInput from "./FormInput";
import FormSelect from "./FormSelect";
import Modal from "./Modal";

interface AddAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  onAccountAdded: () => void;
}

const AddAccountModal: React.FC<AddAccountModalProps> = ({ isOpen, onClose, userId, onAccountAdded }) => {
  const [newAccount, setNewAccount] = useState<Omit<Account, "id">>({
    name: "",
    type: AccountType.Bank,
    balance: 0,
    currency: Currency.PLN,
  });

  const handleAddAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await accountService.addAccount(userId, newAccount);
      setNewAccount({
        name: "",
        type: AccountType.Bank,
        balance: 0,
        currency: Currency.PLN,
      });
      onAccountAdded();
      onClose();
    } catch (error) {
      console.error("Błąd podczas dodawania konta:", error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Dodaj nowe konto"
    >
      <form
        onSubmit={handleAddAccount}
        className="space-y-4"
      >
        <FormInput
          label="Nazwa konta"
          id="name"
          value={newAccount.name}
          onChange={(e) => setNewAccount({ ...newAccount, name: e.target.value })}
          required
        />
        <FormSelect
          label="Typ konta"
          id="type"
          value={newAccount.type}
          onChange={(e) =>
            setNewAccount({
              ...newAccount,
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
          label="Saldo początkowe"
          id="balance"
          type="number"
          step="0.01"
          value={newAccount.balance}
          onChange={(e) =>
            setNewAccount({
              ...newAccount,
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
            Dodaj konto
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddAccountModal;

import React, { useState } from "react";
import Modal from "./Modal";
import FormInput from "./FormInput";
import FormSelect from "./FormSelect";
import FormIconSelect from "./FormIconSelect";
import Button from "./Button";
import { categoryService } from "@/services/categoryService";
import { Category } from "@/types/category";
import { TransactionType } from "@/types/transaction";

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  onCategoryAdded: () => void;
}

const AddCategoryModal: React.FC<AddCategoryModalProps> = ({
  isOpen,
  onClose,
  userId,
  onCategoryAdded,
}) => {
  const [newCategory, setNewCategory] = useState<
    Omit<Category, "id" | "userId" | "isDefault">
  >({
    name: "",
    type: TransactionType.Expense,
    color: "#000000",
    icon: "Tag",
  });

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await categoryService.addCategory(userId, newCategory);
      setNewCategory({
        name: "",
        type: TransactionType.Expense,
        color: "#000000",
        icon: "tag",
      });
      onCategoryAdded();
      onClose();
    } catch (error) {
      console.error("Błąd podczas dodawania kategorii:", error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Dodaj nową kategorię">
      <form onSubmit={handleAddCategory} className="space-y-4">
        <FormInput
          label="Nazwa kategorii"
          id="name"
          value={newCategory.name}
          onChange={(e) =>
            setNewCategory({ ...newCategory, name: e.target.value })
          }
          required
        />
        <FormSelect
          label="Typ kategorii"
          id="type"
          value={newCategory.type}
          onChange={(e) =>
            setNewCategory({
              ...newCategory,
              type: e.target.value as TransactionType,
            })
          }
          required
        >
          <option value={TransactionType.Expense}>Wydatek</option>
          <option value={TransactionType.Income}>Przychód</option>
        </FormSelect>
        <FormIconSelect
          label="Ikona"
          value={newCategory.icon}
          onChange={(value) => setNewCategory({ ...newCategory, icon: value })}
          required
        />
        <FormInput
          label="Kolor"
          id="color"
          type="color"
          value={newCategory.color}
          onChange={(e) =>
            setNewCategory({ ...newCategory, color: e.target.value })
          }
          required
        />
        <div className="flex justify-end space-x-3 mt-6">
          <Button variant="gray" type="button" onClick={onClose}>
            Anuluj
          </Button>
          <Button variant="blue" type="submit">
            Dodaj kategorię
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddCategoryModal;

import React, { useEffect, useState } from "react";
import { categoryService } from "@/services/categoryService";
import { Category } from "@/types/category";
import { TransactionType } from "@/types/transaction";
import Button from "./Button";
import FormIconSelect from "./FormIconSelect";
import FormInput from "./FormInput";
import FormSelect from "./FormSelect";
import Modal from "./Modal";

interface EditCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: Category | null;
  userId: string;
  onCategoryUpdated: () => void;
}

const EditCategoryModal: React.FC<EditCategoryModalProps> = ({ isOpen, onClose, category, userId, onCategoryUpdated }) => {
  const [editedCategory, setEditedCategory] = useState<Category | null>(null);

  useEffect(() => {
    if (category) {
      setEditedCategory(category);
    }
  }, [category]);

  const handleUpdateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editedCategory) return;

    try {
      await categoryService.updateCategory(userId, editedCategory);
      onCategoryUpdated();
      onClose();
    } catch (error) {
      console.error("Błąd podczas aktualizacji kategorii:", error);
    }
  };

  if (!editedCategory) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edytuj kategorię"
    >
      <form
        onSubmit={handleUpdateCategory}
        className="space-y-4"
      >
        <FormInput
          label="Nazwa kategorii"
          id="name"
          value={editedCategory.name}
          onChange={(e) => setEditedCategory({ ...editedCategory, name: e.target.value })}
          required
        />
        <FormSelect
          label="Typ kategorii"
          id="type"
          value={editedCategory.type}
          onChange={(e) =>
            setEditedCategory({
              ...editedCategory,
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
          value={editedCategory.icon}
          onChange={(value) => setEditedCategory({ ...editedCategory, icon: value })}
          required
        />
        <FormInput
          label="Kolor"
          id="color"
          type="color"
          value={editedCategory.color}
          onChange={(e) => setEditedCategory({ ...editedCategory, color: e.target.value })}
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

export default EditCategoryModal;

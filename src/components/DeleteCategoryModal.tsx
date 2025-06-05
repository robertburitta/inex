import React from "react";
import Modal from "./Modal";
import Button from "./Button";
import { categoryService } from "@/services/categoryService";
import { Category } from "@/types/category";

interface DeleteCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: Category | null;
  userId: string;
  onCategoryDeleted: () => void;
}

const DeleteCategoryModal: React.FC<DeleteCategoryModalProps> = ({
  isOpen,
  onClose,
  category,
  userId,
  onCategoryDeleted,
}) => {
  const handleDeleteCategory = async () => {
    if (!category) return;

    try {
      await categoryService.deleteCategory(userId, category.id);
      onCategoryDeleted();
      onClose();
    } catch (error) {
      console.error("Błąd podczas usuwania kategorii:", error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Potwierdź usunięcie">
      <div className="space-y-4">
        <p>
          Czy na pewno chcesz usunąć kategorię &quot;{category?.name}&quot;? Tej
          operacji nie można cofnąć.
        </p>
        <div className="flex justify-end space-x-3">
          <Button variant="gray" onClick={onClose}>
            Anuluj
          </Button>
          <Button variant="red" onClick={handleDeleteCategory}>
            Usuń
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteCategoryModal;

export interface Category {
  id: string;
  name: string;
  type: "expense" | "income";
  color: string;
  icon: string;
  isDefault: boolean;
}

export interface Category {
  id: string;
  name: string;
  type: "expense" | "income";
  color: string;
  icon: string;
  isDefault: boolean;
}

export const DEFAULT_CATEGORIES: Omit<Category, "id">[] = [
  // Wydatki
  {
    name: "Jedzenie",
    type: "expense",
    color: "#FF6B6B",
    icon: "🍔",
    isDefault: true,
  },
  {
    name: "Transport",
    type: "expense",
    color: "#4ECDC4",
    icon: "🚗",
    isDefault: true,
  },
  {
    name: "Mieszkanie",
    type: "expense",
    color: "#45B7D1",
    icon: "🏠",
    isDefault: true,
  },
  {
    name: "Rozrywka",
    type: "expense",
    color: "#96CEB4",
    icon: "🎮",
    isDefault: true,
  },
  {
    name: "Zdrowie",
    type: "expense",
    color: "#FF9999",
    icon: "💊",
    isDefault: true,
  },
  {
    name: "Edukacja",
    type: "expense",
    color: "#9B59B6",
    icon: "📚",
    isDefault: true,
  },
  {
    name: "Inne wydatki",
    type: "expense",
    color: "#95A5A6",
    icon: "📦",
    isDefault: true,
  },

  // Przychody
  {
    name: "Wynagrodzenie",
    type: "income",
    color: "#2ECC71",
    icon: "💰",
    isDefault: true,
  },
  {
    name: "Prezent",
    type: "income",
    color: "#F1C40F",
    icon: "🎁",
    isDefault: true,
  },
  {
    name: "Inne przychody",
    type: "income",
    color: "#3498DB",
    icon: "💵",
    isDefault: true,
  },
];

export interface Account {
  id: string;
  name: string;
  balance: number;
  currency: string;
  type: "cash" | "bank";
}

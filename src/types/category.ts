import { TransactionType } from "./transaction";

export interface Category {
  id: string;
  name: string;
  type: TransactionType;
  color: string;
  icon: string;
  isDefault: boolean;
}

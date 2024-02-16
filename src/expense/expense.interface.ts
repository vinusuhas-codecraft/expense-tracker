export interface ExpenseParams {
  id: number;
  amount: number;
  title: string;
  createdAt?: Date; // Make createdAt optional
  updatedAt?: Date;
  userId: number;
}

export interface TotalExpenseResult {
  amount: number;
}

export interface AddressParams {
  id: number;
  userId: number;
  location: string;
  state: string;
  city: string;
  pincode: number;
}

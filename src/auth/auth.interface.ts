export interface UserAccountParams {
  email: string;
  username: string;
  password: string;
  name: string;
  image?: string;
}

export interface ComparePasswordParams {
  hash: string;
  password: string;
}
export interface SignInTokenParams {
  userId: number;
  email: string;
}
export interface RefreshTokenParams {
  email: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  password?: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  role?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface UserAuthResponse {
  token: string;
  user: User;
}

export type UserProfile = User;

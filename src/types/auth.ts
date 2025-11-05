export interface LoginData {
  email: string;
  password: string;
}

export interface SignupData {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResult {
  success: boolean;
  message?: string;
  error?: string;
  userId?: string;
}
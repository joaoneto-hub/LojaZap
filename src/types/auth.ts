export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  name: string;
}

export interface FirebaseAuthError {
  code: string;
  message: string;
}

export interface AuthError {
  message: string;
  code?: string;
}

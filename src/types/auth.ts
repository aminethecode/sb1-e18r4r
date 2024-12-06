export interface User {
  id: string;
  email: string;
  name: string;
  password: string;
  resetToken?: string;
  resetTokenExpiry?: number;
}

export interface AuthState {
  user: Omit<User, 'password' | 'resetToken' | 'resetTokenExpiry'> | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  requestPasswordReset: (email: string) => Promise<void>;
  resetPassword: (email: string, token: string, newPassword: string) => Promise<void>;
}

export interface UsersState {
  users: User[];
  addUser: (user: Omit<User, 'id'>) => void;
  findUser: (email: string) => User | undefined;
  updateUser: (email: string, updates: Partial<User>) => void;
}
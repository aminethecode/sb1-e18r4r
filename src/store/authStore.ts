import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthState } from '../types/auth';
import { useUsersStore } from './usersStore';
import { sendPasswordResetEmail } from '../services/emailService';

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: async (email: string, password: string) => {
        const user = useUsersStore.getState().findUser(email);
        
        if (!user || user.password !== password) {
          throw new Error('Invalid email or password');
        }
        
        const { password: _, resetToken: __, resetTokenExpiry: ___, ...userWithoutPassword } = user;
        set({ user: userWithoutPassword, isAuthenticated: true });
      },
      register: async (email: string, password: string, name: string) => {
        const existingUser = useUsersStore.getState().findUser(email);
        
        if (existingUser) {
          throw new Error('Email already registered');
        }
        
        const usersStore = useUsersStore.getState();
        usersStore.addUser({ email, password, name });
        
        const user = usersStore.findUser(email);
        if (!user) throw new Error('Registration failed');
        
        const { password: _, resetToken: __, resetTokenExpiry: ___, ...userWithoutPassword } = user;
        set({ user: userWithoutPassword, isAuthenticated: true });
      },
      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
      changePassword: async (currentPassword: string, newPassword: string) => {
        const { user } = useAuthStore.getState();
        if (!user) throw new Error('Not authenticated');

        const usersStore = useUsersStore.getState();
        const fullUser = usersStore.findUser(user.email);
        
        if (!fullUser || fullUser.password !== currentPassword) {
          throw new Error('Current password is incorrect');
        }
        
        usersStore.updateUser(user.email, { password: newPassword });
      },
      requestPasswordReset: async (email: string) => {
        const usersStore = useUsersStore.getState();
        const user = usersStore.findUser(email);
        
        if (!user) throw new Error('No account found with this email');
        
        const token = Math.random().toString(36).substring(2, 15);
        const expiry = Date.now() + 3600000; // 1 hour
        
        try {
          await sendPasswordResetEmail(email, token);
          
          usersStore.updateUser(email, {
            resetToken: token,
            resetTokenExpiry: expiry,
          });
        } catch (error) {
          throw new Error('Failed to send reset email. Please try again later.');
        }
      },
      resetPassword: async (email: string, token: string, newPassword: string) => {
        const usersStore = useUsersStore.getState();
        const user = usersStore.findUser(email);
        
        if (!user) throw new Error('No account found with this email');
        
        if (!user.resetToken || !user.resetTokenExpiry) {
          throw new Error('No reset token found');
        }
        
        if (user.resetToken !== token) {
          throw new Error('Invalid reset token');
        }
        
        if (Date.now() > user.resetTokenExpiry) {
          throw new Error('Reset token has expired');
        }
        
        usersStore.updateUser(email, {
          password: newPassword,
          resetToken: undefined,
          resetTokenExpiry: undefined,
        });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
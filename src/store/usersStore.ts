import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, UsersState } from '../types/auth';

export const useUsersStore = create<UsersState>()(
  persist(
    (set, get) => ({
      users: [],
      addUser: (userData) => {
        const newUser: User = {
          ...userData,
          id: crypto.randomUUID(),
        };
        set((state) => ({
          users: [...state.users, newUser],
        }));
      },
      findUser: (email) => {
        return get().users.find((user) => user.email === email);
      },
      updateUser: (email, updates) => {
        set((state) => ({
          users: state.users.map((user) =>
            user.email === email ? { ...user, ...updates } : user
          ),
        }));
      },
    }),
    {
      name: 'users-storage',
    }
  )
);
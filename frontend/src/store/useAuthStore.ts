import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: number;
  username: string;
  email?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  _hasHydrated: boolean;
  setUser: (user: User) => void;
  logout: () => void;
  setHasHydrated: (state: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      _hasHydrated: false,
      setUser: (user) => set({ user, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
      setHasHydrated: (state) => set({ _hasHydrated: state }),
    }),
    {
      name: 'jlpt-auth-storage',
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);

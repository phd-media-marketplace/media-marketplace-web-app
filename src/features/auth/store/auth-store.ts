import { create } from 'zustand';
import type { User } from '../types';

// export interface User extends MeResponse {}

export interface AuthState {
    user: User | null;
    setUser: (user: User) => void;
    logout: () => void;
}
    
export const useAuthStore = create<AuthState>((set) => ({
    user: null,

    setUser: (user: User) => set({ user }),

    logout: () => {
        localStorage.clear();
        set({user: null});
        window.location.href = '/';
    }
}));
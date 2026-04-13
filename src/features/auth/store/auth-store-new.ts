import { create } from 'zustand';
import { decodeToken } from '../../../utils/jwt';
import type { User } from '../types';

export interface AuthState {
    token: string | null,
    user: User | null;
    // isAuthenticated: boolean;
    setToken: (token: string) => void;
    logout: () => void;
}
    
export const useAuthStore = create<AuthState>((set) => ({
    token: null,
    user: null,
    // isAuthenticated: false,
    setToken: (token: string) => {
        const decoded = decodeToken(token);
        if (decoded) {
            set({
                token,
               
                // isAuthenticated: true,
            });
        }
    },
    logout: () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        set({
            token: null,
            user: null,
            // isAuthenticated: false,
        });
    }
}));
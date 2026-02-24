import { create } from 'zustand';
import { decodeToken } from '../../../utils/jwt';

export interface AuthState {
    token: string | null,
    user: {
        id: string;
        email: string;
        tenantId: string;
        roles: string[];
        permissions: string[];
    } | null;
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
                user: {
                    id: decoded.sub,
                    email: decoded.email,
                    tenantId: decoded.tenantId,
                    roles: decoded.roles,
                    permissions: decoded.permissions,
                },
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
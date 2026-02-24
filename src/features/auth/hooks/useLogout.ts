import { useMutation } from "@tanstack/react-query";
import { logout as logoutApi } from "../api";
import { useAuthStore } from "../store/auth-store";
import type { LogOutData } from "../types";

export const useLogout = () => {
    const logout = useAuthStore((state) => state.logout);
    const user = useAuthStore((state) => state.user);

    return useMutation({
        mutationFn: () => {
            if (!user) {
                throw new Error('No user logged in');
            }
            
            const logoutData: LogOutData = {
                userID: user.id,
                email: user.email,
                tenantId: user.tenantId,
                roles: user.roles,
                permissions: user.permissions,
            };
            
            return logoutApi(logoutData);
        },
        onSuccess: () => {
            // Call store logout to clear state and redirect
            logout();
        },
        onError: (error) => {
            // Even if API call fails, clear local state
            console.error('Logout API error:', error);
            logout();
        }
    });
};

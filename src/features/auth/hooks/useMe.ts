import { useQuery } from "@tanstack/react-query";
import { getMe } from "../api";
import { useAuthStore } from "../store/auth-store";

/**
 * Hook to fetch and set the current user data
 * Used on app initialization if token exists
 */
export const useMe = () => {
    const setUser = useAuthStore((state) => state.setUser);
    const token = localStorage.getItem('accessToken');

    return useQuery({
        queryKey: ['me'],
        queryFn: async () => {
            const userData = await getMe();
            console.log('useMe - GetMe response:', userData);
            
            // Check if userData has nested data property
            const user = userData?.data || userData;
            console.log('useMe - Processed user data:', user);
            
            if (user && user.id) {
                setUser(user);
                return user;
            } else {
                throw new Error('Invalid user data received');
            }
        },
        enabled: !!token, // Only run if token exists
        retry: 1,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

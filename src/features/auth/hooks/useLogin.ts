import { useMutation } from "@tanstack/react-query";
import { login, getMe } from "../api";
import type { LogInFormData } from "../types";
import { useAuthStore } from "../store/auth-store";

export const useLogin = () => {
    const setUser = useAuthStore((state) => state.setUser);

    return useMutation({
        mutationFn: ({email, password}: LogInFormData) => login({email, password}),

        onSuccess: async (response) => {
           console.log('Login response:', response);
           
           // API already returns response.data, so destructure directly from response
           const { accessToken, refreshToken } = response;
           
           if (!accessToken || !refreshToken) {
               throw new Error('Invalid response: missing tokens');
           }
           
           localStorage.setItem('accessToken', accessToken);
           localStorage.setItem('refreshToken', refreshToken);

           try {
               // Fetch user details and update store
               const userData = await getMe();
               console.log('GetMe response:', userData);
               
               // Check if userData has nested data property
               const user = userData?.data || userData;
               console.log('Processed user data:', user);
               
               if (user && user.id) {
                   setUser(user);
               } else {
                   console.error('Invalid user data structure:', userData);
                   throw new Error('Invalid user data received');
               }
           } catch (error) {
               console.error('Error fetching user data:', error);
               throw error;
           }
        }

    });
}
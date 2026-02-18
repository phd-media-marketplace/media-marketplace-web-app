import { apiClient } from "@/services/https";
import type { LogInFormData, LogOutData} from "./types";
import type { RegisterData } from "@/types/api";

export const login = async ({email, password}: LogInFormData) => {
    try {
        const response = await apiClient.post('/auth/login', { 
            email,
            password 
        });
        return response.data;
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }

}

export const Register = async (formData: RegisterData) => {
    try {
        const response = await apiClient.post('/auth/register-tenant', formData);
        return response.data;
    } catch (error) {
        console.error('Registration error:', error);
        throw error;
    }
}

export const refreshToken = async () => {
    try {
        const response = await apiClient.post('/auth/refresh');
        return response.data;
    } catch (error) {
        console.error('Refresh error:', error);
        throw error;
    }
}

export const profile = async () => {
    try {
        const response = await apiClient.get('/auth/me');
        return response.data;
    } catch (error) {
        console.error('Profile error:', error);
        throw error;
    }
}

export const logout = async( data: LogOutData) => {
    try {
        const response = await apiClient.post('/auth/logout', data);
        return response.data;
    } catch (error) {
        console.error('Logout error:', error);
        throw error;
    }
}

export const forgotPassword = async (email: string) => {
    try {
        const response = await apiClient.post('/auth/forgot-password', { email });
        return response.data;
    } catch (error) {
        console.error('Forgot password error:', error);
        throw error;
    }
}

export const resetPassword = async (token: string, newPassword: string) => {
    try {
        const response = await apiClient.post('/auth/reset-password', { token, newPassword });
        return response.data;
    } catch (error) {
        console.error('Reset password error:', error);
        throw error;
    }
}

export const verifyEmail = async (token: string) => {
    try {
        const response = await apiClient.post('/auth/verify-email', { token });
        return response.data;
    } catch (error) {
        console.error('Email verification error:', error);
        throw error;
    }
}

export const resendVerificationEmail = async (email: string) => {
    try {
        const response = await apiClient.post('/auth/resend-verification-email', { email });
        return response.data;
    } catch (error) {
        console.error('Resend verification email error:', error);
        throw error;
    }
}

export const changePassword = async (currentPassword: string, newPassword: string) => {
    try {
        const response = await apiClient.post('/auth/change-password', { currentPassword, newPassword });
        return response.data;
    } catch (error) {
        console.error('Change password error:', error);
        throw error;
    }
}
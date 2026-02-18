/**
 * Api Configuration for Axios
 * This file is responsible for setting up the axios instance with the base URL and 
 * interceptors for authentication. It allows us to make HTTP requests to the backend API with ease, 
 * while automatically including the auth token in the headers when available.
*/

import axios from 'axios';

export const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        "Content-Type": "application/json"
    },
    timeout: 30000,
});


// Add a request interceptor to include the auth token in headers
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

/**
 * Add a response interceptor to handle errors globally. This will allow us to catch common HTTP errors
 * and perform actions like redirecting to the login page on 401 Unauthorized errors.
 */
apiClient.interceptors.response.use((response) => {
    return response;
}, (error) => {
    if (error.response) {
        const {status, data} = error.response;
        
        // Log full error details for debugging
        console.error('API Error Response:', {
            status,
            statusText: error.response.statusText,
            data,
            url: error.config?.url,
            method: error.config?.method,
        });
        
        switch (status) {
            case 400:
                console.error('Bad Request:', data?.message || data);
                break;
            case 401:
                console.error('Unauthorized:', data?.message || data);
                redirectToLogin();
                break;
            case 403:
                console.error('Forbidden:', data?.message || data);
                break;
            case 404:
                console.error('Not Found:', data?.message || data);
                break;
            case 500:
                console.error('Internal Server Error:', data?.message || data);
                console.error('Please contact the backend team - this is a server-side issue');
                break;
            default:
                console.error(`Error ${status}:`, data?.message || data);
        }
    } else if (error.request) {
        console.error('No response received. Check network connection or server availability.');
    } else {
        console.error('Error setting up request:', error.message);
    }
    return Promise.reject(error);
});

// Helper function to handle redirection to login on unauthorized access
const redirectToLogin = () => {
    localStorage.removeItem('authToken');
    window.location.href = '/';
}
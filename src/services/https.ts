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
    // timeout: 30000,
});


// Add a request interceptor to include the auth token in headers
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    const tenantId = localStorage.getItem('tenantId');

    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }

    if (tenantId) {
        config.headers['X-Tenant-ID'] = tenantId;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

/**
 * Add a response interceptor to handle token refresh and errors globally.
 * On 401 errors, it will attempt to refresh the token before redirecting to login.
 */
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized with token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const storedRefreshToken = localStorage.getItem("refreshToken");

        if (!storedRefreshToken) {
          throw new Error('No refresh token available');
        }

        const res = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/auth/refresh`,
          { refreshToken: storedRefreshToken }
        );

        const newAccessToken = res.data.accessToken;

        // Update token in localStorage
        localStorage.setItem("accessToken", newAccessToken);

        // Update the authorization header
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        const tenantId = localStorage.getItem('tenantId');
        if (tenantId) {
            originalRequest.headers['X-Tenant-ID'] = tenantId;
        }

        // Retry the original request
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed, clear storage and redirect to login
        console.error('Token refresh failed:', refreshError);
        localStorage.clear();
        window.location.href = "/";
        return Promise.reject(refreshError);
      }
    }

    // Handle other errors globally
    if (error.response) {
      const { status, data } = error.response;

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
        case 502:
          console.error('Bad Gateway:', data?.message || data);
          console.error('This may indicate an issue with the backend server or a misconfiguration');
          break;
        case 503:
          console.error('Service Unavailable:', data?.message || data);
          console.error('The server is currently unavailable. Please try again later.');
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
  }
);

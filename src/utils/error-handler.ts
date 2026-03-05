import { isAxiosError } from "axios";

/**
 * Interface for error response from API
 */
interface ApiErrorResponse {
  message?: string;
  error?: string;
  errors?: string[] | Record<string, string[]>;
  statusCode?: number;
}

/**
 * Extracts a user-friendly error message from an error object
 * @param error - The error object (can be Axios error, Error, or unknown)
 * @param defaultMessage - Fallback message if no specific message is found
 * @returns User-friendly error message string
 */
export function getErrorMessage(
  error: unknown,
  defaultMessage: string = "An unexpected error occurred. Please try again."
): string {
  // Handle Axios errors
  if (isAxiosError(error)) {
    const response = error.response;
    
    // If API returned a response with data
    if (response?.data) {
      const data = response.data as ApiErrorResponse;
      
      // Priority 1: Check for message field
      if (data.message) {
        return data.message;
      }
      
      // Priority 2: Check for error field
      if (data.error && typeof data.error === 'string') {
        return data.error;
      }
      
      // Priority 3: Check for validation errors array
      if (data.errors) {
        if (Array.isArray(data.errors)) {
          return data.errors.join(', ');
        }
        // Handle object format like { email: ['Invalid email'], password: ['Too short'] }
        if (typeof data.errors === 'object') {
          const errorMessages = Object.values(data.errors)
            .flat()
            .join(', ');
          if (errorMessages) return errorMessages;
        }
      }
    }
    
    // Fallback to status-based messages
    const status = response?.status;
    switch (status) {
      case 400:
        return "Invalid request. Please check your input and try again.";
      case 401:
        return "Invalid email or password. Please try again.";
      case 403:
        return "Access denied. You don't have permission to perform this action.";
      case 404:
        return "The requested resource was not found.";
      case 409:
        return "This resource already exists. Please try with different information.";
      case 422:
        return "Validation failed. Please check your input.";
      case 429:
        return "Too many requests. Please try again later.";
      case 500:
        return "Server error. Please try again later.";
      case 502:
        return "Server is temporarily unavailable. Please try again.";
      case 503:
        return "Service unavailable. Please try again later.";
      default:
        if (status && status >= 500) {
          return "Server error. Please try again later.";
        }
    }
    
    // Network error (no response received)
    if (error.request && !response) {
      return "Network error. Please check your internet connection.";
    }
  }
  
  // Handle standard Error objects
  if (error instanceof Error) {
    return error.message || defaultMessage;
  }
  
  // Handle string errors
  if (typeof error === 'string') {
    return error;
  }
  
  // Return default message for unknown error types
  return defaultMessage;
}

/**
 * Convenience function for login-specific errors
 * @param error - The error object
 * @returns User-friendly login error message
 */
export function getLoginErrorMessage(error: unknown): string {
  return getErrorMessage(
    error,
    "Login failed. Please check your credentials and try again."
  );
}

/**
 * Convenience function for registration-specific errors
 * @param error - The error object
 * @returns User-friendly registration error message
 */
export function getRegistrationErrorMessage(error: unknown): string {
  return getErrorMessage(
    error,
    "Registration failed. Please try again."
  );
}

/**
 * Convenience function for form submission errors
 * @param error - The error object
 * @returns User-friendly form error message
 */
export function getFormErrorMessage(error: unknown): string {
  return getErrorMessage(
    error,
    "Failed to submit form. Please try again."
  );
}

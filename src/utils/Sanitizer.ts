/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Helper function to remove undefined/null values from object
 * Backends often reject undefined fields
 */
export const sanitizePayload = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizePayload(item));
  } else if (obj !== null && typeof obj === 'object') {
    return Object.entries(obj).reduce((acc, [key, value]) => {
      // Only include defined, non-null values
      if (value !== undefined && value !== null) {
        // Skip empty strings for optional fields only
        if (value === '' && key !== 'mediaPartnerId' && key !== 'mediaType') {
          return acc;
        }
        acc[key] = sanitizePayload(value);
      }
      return acc;
    }, {} as any);
  }
  return obj;
};
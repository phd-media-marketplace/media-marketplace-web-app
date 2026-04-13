import { apiClient } from "@/services/https";
import type { 
  CreateRateCardRequest, 
  RateCard, 
  RateCardListResponse,
  BulkUploadRequest, 
  BulkUploadResponse
} from "./types";

// Create a new rate card
export const createRateCard = async (data: CreateRateCardRequest): Promise<RateCard> => {
  try {
    // Log the request payload for debugging
    console.log('Creating rate card with payload:', JSON.stringify(data, null, 2));
    console.log('Metadata type:', data.metadata.mediaType);
    console.log('Media type:', data.mediaType);
    
    const response = await apiClient.post('/rate-cards', data);
    return response.data;
  } catch (error) {
    console.error('Create rate card error:', error);
    console.error('Failed payload:', JSON.stringify(data, null, 2));
    throw error;
  }
};

// Get a single rate card by ID
export const getRateCard = async (id: string): Promise<RateCard> => {
  try {
    const response = await apiClient.get(`/rate-cards/${id}`);
    return response.data;
  } catch (error) {
    console.error('Get rate card error:', error);
    throw error;
  }
};

// Get all rate cards (with optional filters)
export const listRateCards = async (params?: {
  mediaType?: 'FM' | 'TV';
  page?: number;
  limit?: number;
  isActive?: boolean;
}): Promise<RateCardListResponse> => {
  try {
    const response = await apiClient.get('/rate-cards', { params });
    const responseBody = response.data as RateCard[] | RateCardListResponse | { data?: RateCard[] | RateCardListResponse };

    if (Array.isArray(responseBody)) {
      return {
        rateCards: responseBody,
        total: responseBody.length,
        page: params?.page ?? 1,
        limit: params?.limit ?? responseBody.length,
      };
    }

    if (responseBody && typeof responseBody === 'object' && 'rateCards' in responseBody && Array.isArray(responseBody.rateCards)) {
      return {
        rateCards: responseBody.rateCards,
        total: typeof responseBody.total === 'number' ? responseBody.total : responseBody.rateCards.length,
        page: typeof responseBody.page === 'number' ? responseBody.page : (params?.page ?? 1),
        limit: typeof responseBody.limit === 'number' ? responseBody.limit : (params?.limit ?? responseBody.rateCards.length),
      };
    }

    if (
      responseBody &&
      typeof responseBody === 'object' &&
      'data' in responseBody &&
      responseBody.data &&
      typeof responseBody.data === 'object'
    ) {
      if (Array.isArray(responseBody.data)) {
        return {
          rateCards: responseBody.data,
          total: responseBody.data.length,
          page: params?.page ?? 1,
          limit: params?.limit ?? responseBody.data.length,
        };
      }
      if ('rateCards' in responseBody.data && Array.isArray(responseBody.data.rateCards)) {
        return {
          rateCards: responseBody.data.rateCards,
          total: typeof responseBody.data.total === 'number' ? responseBody.data.total : responseBody.data.rateCards.length,
          page: typeof responseBody.data.page === 'number' ? responseBody.data.page : (params?.page ?? 1),
          limit: typeof responseBody.data.limit === 'number' ? responseBody.data.limit : (params?.limit ?? responseBody.data.rateCards.length),
        };
      }
    }

    return {
      rateCards: [],
      total: 0,
      page: params?.page ?? 1,
      limit: params?.limit ?? 0,
    };
  } catch (error) {
    console.error('List rate cards error:', error);
    throw error;
  }
};

// Update an existing rate card
export const updateRateCard = async (id: string, data: Partial<CreateRateCardRequest>): Promise<RateCard> => {
  try {
    const response = await apiClient.put(`/rate-cards/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Update rate card error:', error);
    throw error;
  }
};

// Delete a rate card
export const deleteRateCard = async (id: string): Promise<void> => {
  try {
    await apiClient.delete(`/rate-cards/${id}`);
  } catch (error) {
    console.error('Delete rate card error:', error);
    throw error;
  }
};

// Get available media types
export const getMediaTypes = async (): Promise<string[]> => {
  try {
    const response = await apiClient.get('/rate-cards/media-types');
    return response.data;
  } catch (error) {
    console.error('Get media types error:', error);
    throw error;
  }
};

// Bulk upload rate cards
export const bulkUploadRateCards = async (data: BulkUploadRequest): Promise<BulkUploadResponse> => {
  try {
    const response = await apiClient.post('/rate-cards/bulk-upload', data);
    return response.data;
  } catch (error) {
    console.error('Bulk upload rate cards error:', error);
    throw error;
  }
};

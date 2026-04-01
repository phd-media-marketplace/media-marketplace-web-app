import { apiClient } from "@/services/https";
import type { 
  CreateRateCardRequest, 
  RateCard, 
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
}): Promise<RateCard[]> => {
  try {
    const response = await apiClient.get('/rate-cards', { params });
    return response.data;
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

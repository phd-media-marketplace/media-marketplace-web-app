import { apiClient } from "@/services/https";
import type { 
  WorkOrder,
  CreateWorkOrderRequest,
  UpdateWorkOrderStatusRequest,
  WorkOrderListResponse,
  WorkOrderFilters
} from "./types";

/**
 * Generate work orders from an approved media plan
 */
export const createWorkOrders = async (data: CreateWorkOrderRequest): Promise<WorkOrder[]> => {
  try {
    const response = await apiClient.post('/work-orders', data);
    return response.data;
  } catch (error) {
    console.error('Create work orders error:', error);
    throw error;
  }
};

/**
 * Get a single work order by ID
 */
export const getWorkOrder = async (id: string): Promise<WorkOrder> => {
  try {
    const response = await apiClient.get(`/work-orders/${id}`);
    return response.data;
  } catch (error) {
    console.error('Get work order error:', error);
    throw error;
  }
};

/**
 * Get all work orders with optional filters
 */
export const listWorkOrders = async (filters?: WorkOrderFilters): Promise<WorkOrderListResponse> => {
  try {
    const response = await apiClient.get('/work-orders', { params: filters });
    return response.data;
  } catch (error) {
    console.error('List work orders error:', error);
    throw error;
  }
};

/**
 * Update work order status (approve/reject by media partner)
 */
export const updateWorkOrderStatus = async (
  id: string, 
  data: UpdateWorkOrderStatusRequest
): Promise<WorkOrder> => {
  try {
    const response = await apiClient.patch(`/work-orders/${id}/status`, data);
    return response.data;
  } catch (error) {
    console.error('Update work order status error:', error);
    throw error;
  }
};

/**
 * Download work order as PDF
 */
export const downloadWorkOrderPDF = async (id: string): Promise<Blob> => {
  try {
    const response = await apiClient.get(`/work-orders/${id}/pdf`, {
      responseType: 'blob',
    });
    return response.data;
  } catch (error) {
    console.error('Download work order PDF error:', error);
    throw error;
  }
};

/**
 * Send work order email to media partner
 */
export const sendWorkOrderEmail = async (id: string): Promise<void> => {
  try {
    await apiClient.post(`/work-orders/${id}/send`);
  } catch (error) {
    console.error('Send work order email error:', error);
    throw error;
  }
};

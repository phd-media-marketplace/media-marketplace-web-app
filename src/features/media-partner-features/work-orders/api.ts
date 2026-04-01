import { apiClient } from "@/services/https";
import type { WorkOrder } from "@/features/agency-features/work-orders/types";

/**
 * API functions for media partner work order management
 */

/**
 * Get all work orders for the media partner
 */
export async function getMediaPartnerWorkOrders(): Promise<WorkOrder[]> {
  const response = await apiClient.get<WorkOrder[]>('/media-partner/work-orders');
  return response.data;
}

/**
 * Get a specific work order by ID
 */
export async function getMediaPartnerWorkOrder(id: string): Promise<WorkOrder> {
  const response = await apiClient.get<WorkOrder>(`/media-partner/work-orders/${id}`);
  return response.data;
}

/**
 * Approve a work order
 */
export async function approveWorkOrder(workOrderId: string): Promise<WorkOrder> {
  const response = await apiClient.post<WorkOrder>(`/media-partner/work-orders/${workOrderId}/approve`);
  return response.data;
}

/**
 * Reject a work order with a reason
 */
export async function rejectWorkOrder(
  workOrderId: string,
  rejectionReason: string
): Promise<WorkOrder> {
  const response = await apiClient.post<WorkOrder>(
    `/media-partner/work-orders/${workOrderId}/reject`,
    { rejectionReason }
  );
  return response.data;
}

/**
 * Download work order as PDF
 */
export async function downloadWorkOrderPDF(workOrderId: string): Promise<Blob> {
  const response = await apiClient.get(`/media-partner/work-orders/${workOrderId}/pdf`, {
    responseType: 'blob',
  });
  return response.data;
}

/**
 * Send work order via email
 */
export async function sendWorkOrderEmail(
  workOrderId: string,
  emailAddress: string
): Promise<void> {
  await apiClient.post(`/media-partner/work-orders/${workOrderId}/email`, { emailAddress });
}

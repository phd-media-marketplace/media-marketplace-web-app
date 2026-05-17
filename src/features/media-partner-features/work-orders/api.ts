import { apiClient } from "@/services/https";
import type { WorkOrder } from "@/types/work-order";

/**
 * API functions for media partner work order management
 */

/**
 * Get all work orders for the media partner
 */
export async function getMediaPartnerWorkOrders(mediaPartnerId: string): Promise<WorkOrder[]> {
  try {
    const response = await apiClient.get<WorkOrder[] | { workOrders: WorkOrder[] } | { data: WorkOrder[] }>(`/work-orders`, {
      params: {
        mediaPartnerId,
      },
    });
    const responseBody = response.data;

    // Handle different response formats
    if (Array.isArray(responseBody)) {
      return responseBody;
    }

    if (responseBody && typeof responseBody === 'object' && 'workOrders' in responseBody && Array.isArray(responseBody.workOrders)) {
      return responseBody.workOrders;
    }

    if (responseBody && typeof responseBody === 'object' && 'data' in responseBody && Array.isArray(responseBody.data)) {
      return responseBody.data;
    }

    // If none of the above, assume it's an array or return empty
    return Array.isArray(responseBody) ? responseBody : [];
  } catch (error) {
    console.error('Error fetching work orders:', error);
    throw error;
  }
}

/**
 * Get a specific work order by ID
 */
export async function getMediaPartnerWorkOrder(id: string): Promise<WorkOrder> {
  try {
    const response = await apiClient.get<WorkOrder>(`/media-partner/work-orders/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching work order:', error);
    throw error;
  }
}

/**
 * Respond to a work order (accept or reject)
 */
export async function respondToWorkOrder(workOrderId: string, accepted: boolean, rejectionReason?: string): Promise<WorkOrder> {
  try {
    const response = await apiClient.post<WorkOrder>(
      `/media-partner/work-orders/${workOrderId}/respond`,
      { accepted, rejectionReason }
    );
    
    const responseBody = response.data;

    // Handle different response formats
    if (responseBody && typeof responseBody === 'object' && 'workOrder' in responseBody) {
      return responseBody.workOrder as WorkOrder;
    }
    if (responseBody && typeof responseBody === 'object' && 'data' in responseBody && typeof responseBody.data === 'object') {
      return responseBody.data as WorkOrder;
    }
    return responseBody as WorkOrder;
  } catch (error) {
    console.error('Error responding to work order:', error);
    throw error;
  }
}


/**
 * Download work order as PDF
 */
export async function downloadWorkOrderPDF(workOrderId: string): Promise<Blob> {
  try {
    const response = await apiClient.get(`/media-partner/work-orders/${workOrderId}/pdf`, {
      responseType: 'blob',
    });
    return response.data;
  } catch (error) {
    console.error('Error downloading work order PDF:', error);
    throw error;
  }
}

/**
 * Send work order via email
 */
export async function sendWorkOrderEmail(
  workOrderId: string,
  emailAddress: string
): Promise<void> {
  try {
    await apiClient.post(`/media-partner/work-orders/${workOrderId}/email`, { emailAddress });
  } catch (error) {
    console.error('Error sending work order email:', error);
    throw error;
  }
}

import type { UUID } from "@/features/media-partner-features/rate-cards/types";
import type { DayOfWeek } from "../media-planning/types";

/**
 * Work Order Status
 * Tracks the approval workflow for work orders sent to media partners
 */
export type WorkOrderStatus = 
  | 'PENDING'      // Sent to media partner, awaiting review
  | 'APPROVED'     // Media partner approved the work order
  | 'REJECTED'     // Media partner rejected the work order
  | 'REVISED';     // Work order has been revised after rejection

/**
 * Media Plan Approval Status
 * Prerequisite for creating work orders
 */
export type MediaPlanApprovalStatus = 
  | 'DRAFT'
  | 'PENDING_APPROVAL'
  | 'APPROVED'
  | 'REJECTED';

/**
 * Work Order Segment
 * Represents a single segment/ad spot in the work order
 */
export interface WorkOrderSegment {
  segmentId: string;
  segmentName: string;
  segmentClass: string;
  adType: string;
  days: DayOfWeek[];
  timeSlot: string;
  totalSpots: number;
  unitRate: number;
  totalAmount: number;
  programName?: string;
  adForm?: string;
}

/**
 * Work Order Header Information
 */
export interface WorkOrderHeader {
  // Client/Agency Information
  clientType: 'AGENCY' | 'DIRECT_CLIENT';
  agencyName?: string;
  clientName?: string;
  brandName: string;
  
  // Order Details
  poNumber: string;          // Purchase Order Number
  mpoNumber: string;         // Media Purchase Order Number
  startDate: string;
  endDate: string;
  
  // Campaign Information
  campaignName: string;
  campaignObjective: string;
}

/**
 * Work Order Document
 * Main work order sent to a media partner
 */
export interface WorkOrder {
  id: UUID;
  workOrderNumber: string;    // e.g., WO-2024-001
  mediaPlanId: UUID;
  
  // Media Partner Information
  mediaPartnerId: UUID;
  mediaPartnerName: string;
  channelName: string;
  mediaType: 'FM' | 'TV' | 'OOH' | 'DIGITAL';
  
  // Header Information
  header: WorkOrderHeader;
  
  // Segments
  segments: WorkOrderSegment[];
  
  // Financial Summary
  subtotal: number;
  tax?: number;
  totalAmount: number;
  
  // Status & Tracking
  status: WorkOrderStatus;
  rejectionReason?: string;
  
  // Signatures & Approvals
  preparedBy: string;
  preparedByTitle: string;
  approvedBy?: string;
  approvedByTitle?: string;
  approvalDate?: string;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
  sentToPartnerAt: string;
}

/**
 * API Request/Response Types
 */
export interface CreateWorkOrderRequest {
  mediaPlanId: UUID;
  channelIds: string[];  // Which channels to generate work orders for
}

export interface UpdateWorkOrderStatusRequest {
  status: WorkOrderStatus;
  rejectionReason?: string;
  approvedBy?: string;
  approvedByTitle?: string;
}

export interface WorkOrderListResponse {
  workOrders: WorkOrder[];
  total: number;
  page: number;
  limit: number;
}

/**
 * Work Order Filter Options
 */
export interface WorkOrderFilters {
  status?: WorkOrderStatus;
  mediaPartnerName?: string;
  startDate?: string;
  endDate?: string;
  campaignName?: string;
  mediaType?: 'FM' | 'TV' | 'OOH' | 'DIGITAL';
}

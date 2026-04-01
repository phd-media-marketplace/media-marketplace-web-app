/**
 * Campaign Types
 * Types for campaign performance tracking and metrics
 * Extends existing CampaignSummary from media-planning
 */

// Campaign Status
export type CampaignStatus = 'PLANNING' | 'ONGOING' | 'COMPLETED' | 'PAUSED' | 'CANCELLED';

// Campaign Metrics for performance tracking
export interface CampaignMetrics {
  impressions: number;
  reach: number;
  avgFrequency: number;
  clicks?: number; // For digital campaigns
  ctr?: number; // Click-through rate (percentage)
  cpc?: number; // Cost per click
  conversions?: number; // For performance campaigns
  conversionRate?: number; // Conversion rate (percentage)
}

// Channel Performance within a campaign
export interface CampaignChannelPerformance {
  id: string;
  workOrderId: string; // Links to work order
  workOrderNumber: string;
  mediaType: 'FM' | 'TV' | 'OOH' | 'DIGITAL';
  mediaPartnerName: string;
  channelName: string;
  budget: number;
  spent: number;
  metrics: CampaignMetrics;
  status: 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'PAUSED';
  startDate: string;
  endDate: string;
}

// Campaign Performance Summary
export interface Campaign {
  id: string;
  campaignName: string;
  campaignCode: string; // e.g., "CAM-2024-001"
  mediaPlanId: string; // Links to media plan
  mediaPlanCode: string; // e.g., "MP-2024-001"
  
  // Client/Agency Information
  clientName: string;
  agencyName?: string;
  brandName: string;
  
  // Campaign Details
  objective: string;
  targetAudience: string;
  
  // Budget & Financials
  totalBudget: number;
  totalSpent: number;
  remainingBudget: number;
  
  // Dates
  startDate: string;
  endDate: string;
  
  // Overall Campaign Metrics
  overallMetrics: CampaignMetrics;
  
  // Channel Performance
  channels: CampaignChannelPerformance[];
  
  // Status
  status: CampaignStatus;
  
  // Metadata
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

// Campaign Summary for list view
export interface CampaignListItem {
  id: string;
  campaignName: string;
  campaignCode: string;
  brandName: string;
  clientName: string;
  totalBudget: number;
  totalSpent: number;
  spentPercentage: number; // Calculated: (totalSpent / totalBudget) * 100
  status: CampaignStatus;
  startDate: string;
  endDate: string;
  daysRemaining: number; // Calculated from endDate
  channelCount: number;
  impressions: number; // From overallMetrics
  reach: number; // From overallMetrics
}

// Campaign Filters
export interface CampaignFilters {
  search?: string;
  status?: CampaignStatus | 'ALL';
  dateFrom?: string;
  dateTo?: string;
}

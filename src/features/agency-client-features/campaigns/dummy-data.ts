/**
 * Campaign Dummy Data
 * Sample campaigns with performance metrics and channel data
 * Links to work orders and media plans
 */

import type { Campaign, CampaignListItem } from './types';

export const dummyCampaigns: Campaign[] = [
  {
    id: 'camp-001',
    campaignName: 'Coca-Cola Summer Refresh 2024',
    campaignCode: 'CAM-2024-001',
    mediaPlanId: 'mp-001',
    mediaPlanCode: 'MP-2024-001',
    
    clientName: 'Coca-Cola Ghana',
    agencyName: 'Ogilvy Ghana',
    brandName: 'Coca-Cola',
    
    objective: 'Brand Awareness & Sales Promotion',
    targetAudience: 'Adults 18-45, Urban & Peri-Urban Areas',
    
    totalBudget: 150000,
    totalSpent: 112500,
    remainingBudget: 37500,
    
    startDate: '2024-06-01',
    endDate: '2024-08-31',
    
    overallMetrics: {
      impressions: 8500000,
      reach: 2400000,
      avgFrequency: 3.54,
      clicks: 125000,
      ctr: 1.47,
      cpc: 0.90,
      conversions: 8500,
      conversionRate: 6.8,
    },
    
    channels: [
      {
        id: 'chan-001',
        workOrderId: 'wo-001',
        workOrderNumber: 'WO-2024-001',
        mediaType: 'FM',
        mediaPartnerName: 'EIB Network',
        channelName: 'Starr FM',
        budget: 45000,
        spent: 45000,
        metrics: {
          impressions: 3200000,
          reach: 850000,
          avgFrequency: 3.76,
        },
        status: 'COMPLETED',
        startDate: '2024-06-01',
        endDate: '2024-07-31',
      },
      {
        id: 'chan-002',
        workOrderId: 'wo-002',
        workOrderNumber: 'WO-2024-002',
        mediaType: 'FM',
        mediaPartnerName: 'Multimedia Group',
        channelName: 'Joy FM',
        budget: 42000,
        spent: 35000,
        metrics: {
          impressions: 2800000,
          reach: 720000,
          avgFrequency: 3.89,
        },
        status: 'ACTIVE',
        startDate: '2024-06-15',
        endDate: '2024-08-31',
      },
      {
        id: 'chan-003',
        workOrderId: 'wo-005',
        workOrderNumber: 'WO-2024-005',
        mediaType: 'DIGITAL',
        mediaPartnerName: 'Google Ghana',
        channelName: 'YouTube Ads',
        budget: 35000,
        spent: 32500,
        metrics: {
          impressions: 2500000,
          reach: 830000,
          avgFrequency: 3.01,
          clicks: 125000,
          ctr: 5.0,
          cpc: 0.26,
          conversions: 8500,
          conversionRate: 6.8,
        },
        status: 'ACTIVE',
        startDate: '2024-06-01',
        endDate: '2024-08-31',
      },
    ],
    
    status: 'ONGOING',
    
    createdAt: '2024-05-15T10:00:00Z',
    updatedAt: '2024-07-20T14:30:00Z',
    createdBy: 'Sarah Johnson',
  },
  
  {
    id: 'camp-002',
    campaignName: 'MTN MoMo Cashback Promo',
    campaignCode: 'CAM-2024-002',
    mediaPlanId: 'mp-002',
    mediaPlanCode: 'MP-2024-002',
    
    clientName: 'MTN Ghana',
    brandName: 'MTN MoMo',
    
    objective: 'Drive Mobile Money Adoption & Transaction Volume',
    targetAudience: 'Mobile Phone Users 18-55, All Regions',
    
    totalBudget: 200000,
    totalSpent: 200000,
    remainingBudget: 0,
    
    startDate: '2024-04-01',
    endDate: '2024-06-30',
    
    overallMetrics: {
      impressions: 12500000,
      reach: 3200000,
      avgFrequency: 3.91,
      clicks: 185000,
      ctr: 1.48,
      cpc: 0.86,
      conversions: 15200,
      conversionRate: 8.22,
    },
    
    channels: [
      {
        id: 'chan-004',
        workOrderId: 'wo-003',
        workOrderNumber: 'WO-2024-003',
        mediaType: 'TV',
        mediaPartnerName: 'Media General',
        channelName: 'TV3',
        budget: 80000,
        spent: 80000,
        metrics: {
          impressions: 5500000,
          reach: 1500000,
          avgFrequency: 3.67,
        },
        status: 'COMPLETED',
        startDate: '2024-04-01',
        endDate: '2024-06-30',
      },
      {
        id: 'chan-005',
        workOrderId: 'wo-006',
        workOrderNumber: 'WO-2024-006',
        mediaType: 'FM',
        mediaPartnerName: 'Multimedia Group',
        channelName: 'Adom FM',
        budget: 55000,
        spent: 55000,
        metrics: {
          impressions: 4200000,
          reach: 980000,
          avgFrequency: 4.29,
        },
        status: 'COMPLETED',
        startDate: '2024-04-01',
        endDate: '2024-06-30',
      },
      {
        id: 'chan-006',
        workOrderId: 'wo-007',
        workOrderNumber: 'WO-2024-007',
        mediaType: 'DIGITAL',
        mediaPartnerName: 'Meta Ads',
        channelName: 'Facebook & Instagram',
        budget: 65000,
        spent: 65000,
        metrics: {
          impressions: 2800000,
          reach: 720000,
          avgFrequency: 3.89,
          clicks: 185000,
          ctr: 6.61,
          cpc: 0.35,
          conversions: 15200,
          conversionRate: 8.22,
        },
        status: 'COMPLETED',
        startDate: '2024-04-01',
        endDate: '2024-06-30',
      },
    ],
    
    status: 'COMPLETED',
    
    createdAt: '2024-03-10T09:00:00Z',
    updatedAt: '2024-07-01T10:00:00Z',
    createdBy: 'Michael Owusu',
  },
  
  {
    id: 'camp-003',
    campaignName: 'Unilever Omo Clean Schools Initiative',
    campaignCode: 'CAM-2024-003',
    mediaPlanId: 'mp-003',
    mediaPlanCode: 'MP-2024-003',
    
    clientName: 'Unilever Ghana',
    agencyName: 'Mindshare Ghana',
    brandName: 'Omo',
    
    objective: 'CSR Awareness & Brand Positioning',
    targetAudience: 'Parents, Teachers, Community Leaders',
    
    totalBudget: 95000,
    totalSpent: 71250,
    remainingBudget: 23750,
    
    startDate: '2024-05-01',
    endDate: '2024-09-30',
    
    overallMetrics: {
      impressions: 6200000,
      reach: 1800000,
      avgFrequency: 3.44,
      clicks: 48000,
      ctr: 0.77,
      cpc: 1.15,
    },
    
    channels: [
      {
        id: 'chan-007',
        workOrderId: 'wo-008',
        workOrderNumber: 'WO-2024-008',
        mediaType: 'FM',
        mediaPartnerName: 'Despite Media',
        channelName: 'Peace FM',
        budget: 38000,
        spent: 30000,
        metrics: {
          impressions: 2800000,
          reach: 720000,
          avgFrequency: 3.89,
        },
        status: 'ACTIVE',
        startDate: '2024-05-01',
        endDate: '2024-09-30',
      },
      {
        id: 'chan-008',
        workOrderId: 'wo-009',
        workOrderNumber: 'WO-2024-009',
        mediaType: 'TV',
        mediaPartnerName: 'GBC',
        channelName: 'GTV',
        budget: 35000,
        spent: 26250,
        metrics: {
          impressions: 2100000,
          reach: 620000,
          avgFrequency: 3.39,
        },
        status: 'ACTIVE',
        startDate: '2024-05-01',
        endDate: '2024-09-30',
      },
      {
        id: 'chan-009',
        workOrderId: 'wo-010',
        workOrderNumber: 'WO-2024-010',
        mediaType: 'DIGITAL',
        mediaPartnerName: 'Google Ghana',
        channelName: 'Google Display Network',
        budget: 22000,
        spent: 15000,
        metrics: {
          impressions: 1300000,
          reach: 460000,
          avgFrequency: 2.83,
          clicks: 48000,
          ctr: 3.69,
          cpc: 0.31,
        },
        status: 'ACTIVE',
        startDate: '2024-05-15',
        endDate: '2024-09-30',
      },
    ],
    
    status: 'ONGOING',
    
    createdAt: '2024-04-15T11:30:00Z',
    updatedAt: '2024-07-18T16:45:00Z',
    createdBy: 'Abena Mensah',
  },
  
  {
    id: 'camp-004',
    campaignName: 'Guinness Bold Choices Campaign',
    campaignCode: 'CAM-2024-004',
    mediaPlanId: 'mp-004',
    mediaPlanCode: 'MP-2024-004',
    
    clientName: 'Diageo Ghana',
    agencyName: 'Ogilvy Ghana',
    brandName: 'Guinness',
    
    objective: 'Brand Engagement & Sales Growth',
    targetAudience: 'Adults 25-45, Beer Consumers',
    
    totalBudget: 180000,
    totalSpent: 45000,
    remainingBudget: 135000,
    
    startDate: '2024-08-01',
    endDate: '2024-12-31',
    
    overallMetrics: {
      impressions: 2100000,
      reach: 680000,
      avgFrequency: 3.09,
      clicks: 18500,
      ctr: 0.88,
    },
    
    channels: [
      {
        id: 'chan-010',
        workOrderId: 'wo-011',
        workOrderNumber: 'WO-2024-011',
        mediaType: 'FM',
        mediaPartnerName: 'EIB Network',
        channelName: 'Live FM',
        budget: 55000,
        spent: 15000,
        metrics: {
          impressions: 850000,
          reach: 280000,
          avgFrequency: 3.04,
        },
        status: 'ACTIVE',
        startDate: '2024-08-01',
        endDate: '2024-10-31',
      },
      {
        id: 'chan-011',
        workOrderId: 'wo-012',
        workOrderNumber: 'WO-2024-012',
        mediaType: 'TV',
        mediaPartnerName: 'Despite Media',
        channelName: 'UTV',
        budget: 75000,
        spent: 18000,
        metrics: {
          impressions: 720000,
          reach: 220000,
          avgFrequency: 3.27,
        },
        status: 'ACTIVE',
        startDate: '2024-08-01',
        endDate: '2024-12-31',
      },
      {
        id: 'chan-012',
        workOrderId: 'wo-013',
        workOrderNumber: 'WO-2024-013',
        mediaType: 'DIGITAL',
        mediaPartnerName: 'Meta Ads',
        channelName: 'Facebook & Instagram',
        budget: 50000,
        spent: 12000,
        metrics: {
          impressions: 530000,
          reach: 180000,
          avgFrequency: 2.94,
          clicks: 18500,
          ctr: 3.49,
          cpc: 0.65,
        },
        status: 'ACTIVE',
        startDate: '2024-08-01',
        endDate: '2024-12-31',
      },
    ],
    
    status: 'ONGOING',
    
    createdAt: '2024-07-01T08:00:00Z',
    updatedAt: '2024-08-15T12:00:00Z',
    createdBy: 'Kwame Asante',
  },
  
  {
    id: 'camp-005',
    campaignName: 'Vodafone 5G Launch Campaign',
    campaignCode: 'CAM-2024-005',
    mediaPlanId: 'mp-005',
    mediaPlanCode: 'MP-2024-005',
    
    clientName: 'Vodafone Ghana',
    agencyName: 'Mindshare Ghana',
    brandName: 'Vodafone',
    
    objective: '5G Network Awareness & Adoption',
    targetAudience: 'Tech-Savvy Adults 20-45, Urban Areas',
    
    totalBudget: 250000,
    totalSpent: 0,
    remainingBudget: 250000,
    
    startDate: '2024-09-01',
    endDate: '2024-11-30',
    
    overallMetrics: {
      impressions: 0,
      reach: 0,
      avgFrequency: 0,
      clicks: 0,
      ctr: 0,
    },
    
    channels: [
      {
        id: 'chan-013',
        workOrderId: 'wo-014',
        workOrderNumber: 'WO-2024-014',
        mediaType: 'TV',
        mediaPartnerName: 'Media General',
        channelName: 'TV3',
        budget: 90000,
        spent: 0,
        metrics: {
          impressions: 0,
          reach: 0,
          avgFrequency: 0,
        },
        status: 'PENDING',
        startDate: '2024-09-01',
        endDate: '2024-11-30',
      },
      {
        id: 'chan-014',
        workOrderId: 'wo-015',
        workOrderNumber: 'WO-2024-015',
        mediaType: 'FM',
        mediaPartnerName: 'Multimedia Group',
        channelName: 'Joy FM',
        budget: 70000,
        spent: 0,
        metrics: {
          impressions: 0,
          reach: 0,
          avgFrequency: 0,
        },
        status: 'PENDING',
        startDate: '2024-09-01',
        endDate: '2024-11-30',
      },
      {
        id: 'chan-015',
        workOrderId: 'wo-016',
        workOrderNumber: 'WO-2024-016',
        mediaType: 'DIGITAL',
        mediaPartnerName: 'Google Ghana',
        channelName: 'YouTube & Display',
        budget: 90000,
        spent: 0,
        metrics: {
          impressions: 0,
          reach: 0,
          avgFrequency: 0,
          clicks: 0,
          ctr: 0,
        },
        status: 'PENDING',
        startDate: '2024-09-01',
        endDate: '2024-11-30',
      },
    ],
    
    status: 'PLANNING',
    
    createdAt: '2024-08-01T10:00:00Z',
    updatedAt: '2024-08-10T14:00:00Z',
    createdBy: 'Jennifer Adu',
  },
];

// Campaign List Items (for list view)
export const dummyCampaignListItems: CampaignListItem[] = dummyCampaigns.map(campaign => {
  const today = new Date();
  const endDate = new Date(campaign.endDate);
  const daysRemaining = Math.max(0, Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
  
  return {
    id: campaign.id,
    campaignName: campaign.campaignName,
    campaignCode: campaign.campaignCode,
    brandName: campaign.brandName,
    clientName: campaign.clientName,
    totalBudget: campaign.totalBudget,
    totalSpent: campaign.totalSpent,
    spentPercentage: campaign.totalBudget > 0 ? (campaign.totalSpent / campaign.totalBudget) * 100 : 0,
    status: campaign.status,
    startDate: campaign.startDate,
    endDate: campaign.endDate,
    daysRemaining,
    channelCount: campaign.channels.length,
    impressions: campaign.overallMetrics.impressions,
    reach: campaign.overallMetrics.reach,
  };
});

import type { WorkOrder } from "./types";

/**
 * Dummy Work Orders Data
 * Represents work orders generated from media plans and sent to media partners
 */

export const dummyWorkOrders: WorkOrder[] = [
  // Work Order 1 - Heaven Media House (FM) - Approved
  {
    id: 'wo-001',
    workOrderNumber: 'WO-2024-001',
    mediaPlanId: 'mp-001',
    
    mediaPartnerId: 'mp-heaven-001',
    mediaPartnerName: 'Heaven Media House',
    channelName: 'Heaven 97.3 FM',
    mediaType: 'FM',
    
    header: {
      clientType: 'AGENCY',
      agencyName: 'Ogilvy Ghana',
      brandName: 'Coca-Cola Ghana',
      poNumber: 'PO-2024-0156',
      mpoNumber: 'MPO-2024-0089',
      startDate: '2024-04-01',
      endDate: '2024-04-30',
      campaignName: 'Taste the Feeling - Q2 2024',
      campaignObjective: 'Brand Awareness',
    },
    
    segments: [
      {
        segmentId: 'seg-001',
        segmentName: 'Prime Time A1',
        segmentClass: 'A1',
        adType: 'ANNOUNCEMENTS',
        days: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'],
        timeSlot: '06:00 - 10:00, 17:00 - 20:00',
        totalSpots: 20,
        unitRate: 5000,
        totalAmount: 100000,
        programName: 'Morning Drive Show',
      },
      {
        segmentId: 'seg-002',
        segmentName: 'Standard A',
        segmentClass: 'A',
        adType: 'ANNOUNCEMENTS',
        days: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'],
        timeSlot: '10:00 - 17:00',
        totalSpots: 15,
        unitRate: 3000,
        totalAmount: 45000,
        programName: 'Midday Connect',
      },
      {
        segmentId: 'seg-003',
        segmentName: 'Jingle - 30 Seconds',
        segmentClass: 'A1',
        adType: 'JINGLES',
        days: ['SATURDAY', 'SUNDAY'],
        timeSlot: '08:00 - 12:00',
        totalSpots: 10,
        unitRate: 4000,
        totalAmount: 40000,
      },
    ],
    
    subtotal: 185000,
    tax: 0,
    totalAmount: 185000,
    
    status: 'APPROVED',
    
    preparedBy: 'Sarah Agyeman',
    preparedByTitle: 'Media Planner',
    approvedBy: 'Michael Mensah',
    approvedByTitle: 'Sales Manager',
    approvalDate: '2024-03-16T14:30:00Z',
    
    createdAt: '2024-03-15T10:00:00Z',
    updatedAt: '2024-03-16T14:30:00Z',
    sentToPartnerAt: '2024-03-15T10:05:00Z',
  },

  // Work Order 2 - Joy FM - Pending
  {
    id: 'wo-002',
    workOrderNumber: 'WO-2024-002',
    mediaPlanId: 'mp-001',
    
    mediaPartnerId: 'mp-joy-001',
    mediaPartnerName: 'Multimedia Ghana',
    channelName: 'Joy 99.7 FM',
    mediaType: 'FM',
    
    header: {
      clientType: 'AGENCY',
      agencyName: 'Ogilvy Ghana',
      brandName: 'Coca-Cola Ghana',
      poNumber: 'PO-2024-0156',
      mpoNumber: 'MPO-2024-0089',
      startDate: '2024-04-01',
      endDate: '2024-04-30',
      campaignName: 'Taste the Feeling - Q2 2024',
      campaignObjective: 'Brand Awareness',
    },
    
    segments: [
      {
        segmentId: 'seg-004',
        segmentName: 'Prime Time',
        segmentClass: 'PREMIUM',
        adType: 'ANNOUNCEMENTS',
        days: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'],
        timeSlot: '06:00 - 09:00',
        totalSpots: 25,
        unitRate: 6000,
        totalAmount: 150000,
        programName: 'Super Morning Show',
      },
      {
        segmentId: 'seg-005',
        segmentName: 'Live Interview',
        segmentClass: 'A',
        adType: 'INTERVIEWS',
        days: ['WEDNESDAY'],
        timeSlot: '07:30 - 08:00',
        totalSpots: 4,
        unitRate: 15000,
        totalAmount: 60000,
        programName: 'Business Focus',
      },
    ],
    
    subtotal: 210000,
    tax: 0,
    totalAmount: 210000,
    
    status: 'PENDING',
    
    preparedBy: 'Sarah Agyeman',
    preparedByTitle: 'Media Planner',
    
    createdAt: '2024-03-15T10:00:00Z',
    updatedAt: '2024-03-15T10:00:00Z',
    sentToPartnerAt: '2024-03-15T10:05:00Z',
  },

  // Work Order 3 - GTV - Rejected
  {
    id: 'wo-003',
    workOrderNumber: 'WO-2024-003',
    mediaPlanId: 'mp-002',
    
    mediaPartnerId: 'mp-gtv-001',
    mediaPartnerName: 'Ghana Broadcasting Corporation',
    channelName: 'GTV',
    mediaType: 'TV',
    
    header: {
      clientType: 'DIRECT_CLIENT',
      clientName: 'MTN Ghana',
      brandName: 'MTN MoMo',
      poNumber: 'PO-2024-0157',
      mpoNumber: 'MPO-2024-0090',
      startDate: '2024-04-05',
      endDate: '2024-04-25',
      campaignName: 'MoMo at 10 Campaign',
      campaignObjective: 'Product Launch',
    },
    
    segments: [
      {
        segmentId: 'seg-006',
        segmentName: 'Premium Spot - 30 Secs',
        segmentClass: 'PREMIUM',
        adType: 'SPOT_ADVERTS',
        days: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'],
        timeSlot: '19:00 - 21:00',
        totalSpots: 30,
        unitRate: 8000,
        totalAmount: 240000,
        programName: 'Prime Time News',
        adForm: '30_SECS',
      },
      {
        segmentId: 'seg-007',
        segmentName: 'Mid-Day Spot - 15 Secs',
        segmentClass: 'M1',
        adType: 'SPOT_ADVERTS',
        days: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'],
        timeSlot: '12:00 - 14:00',
        totalSpots: 20,
        unitRate: 4500,
        totalAmount: 90000,
        adForm: '15_SECS',
      },
    ],
    
    subtotal: 330000,
    tax: 0,
    totalAmount: 330000,
    
    status: 'REJECTED',
    rejectionReason: 'Time slots are already fully booked for the requested period. Please revise the schedule.',
    
    preparedBy: 'Kwame Asante',
    preparedByTitle: 'Media Buyer',
    
    createdAt: '2024-03-14T09:00:00Z',
    updatedAt: '2024-03-15T16:45:00Z',
    sentToPartnerAt: '2024-03-14T09:10:00Z',
  },

  // Work Order 4 - Adom FM - Approved
  {
    id: 'wo-004',
    workOrderNumber: 'WO-2024-004',
    mediaPlanId: 'mp-003',
    
    mediaPartnerId: 'mp-adom-001',
    mediaPartnerName: 'Multimedia Ghana',
    channelName: 'Adom 106.3 FM',
    mediaType: 'FM',
    
    header: {
      clientType: 'AGENCY',
      agencyName: 'DDB Ghana',
      brandName: 'Vodafone Ghana',
      poNumber: 'PO-2024-0158',
      mpoNumber: 'MPO-2024-0091',
      startDate: '2024-03-20',
      endDate: '2024-04-10',
      campaignName: 'Red Hot Quarter',
      campaignObjective: 'Sales Conversion',
    },
    
    segments: [
      {
        segmentId: 'seg-008',
        segmentName: 'Drive Time Announcements',
        segmentClass: 'A1',
        adType: 'ANNOUNCEMENTS',
        days: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'],
        timeSlot: '16:00 - 19:00',
        totalSpots: 30,
        unitRate: 4500,
        totalAmount: 135000,
        programName: 'Adom Drive',
      },
      {
        segmentId: 'seg-009',
        segmentName: 'Weekend Spots',
        segmentClass: 'B',
        adType: 'ANNOUNCEMENTS',
        days: ['SATURDAY', 'SUNDAY'],
        timeSlot: '10:00 - 14:00',
        totalSpots: 12,
        unitRate: 3000,
        totalAmount: 36000,
      },
    ],
    
    subtotal: 171000,
    tax: 0,
    totalAmount: 171000,
    
    status: 'APPROVED',
    
    preparedBy: 'Emmanuel Tetteh',
    preparedByTitle: 'Media Planner',
    approvedBy: 'Grace Osei',
    approvedByTitle: 'Operations Manager',
    approvalDate: '2024-03-17T11:20:00Z',
    
    createdAt: '2024-03-16T14:00:00Z',
    updatedAt: '2024-03-17T11:20:00Z',
    sentToPartnerAt: '2024-03-16T14:05:00Z',
  },

  // Work Order 5 - TV3 - Pending
  {
    id: 'wo-005',
    workOrderNumber: 'WO-2024-005',
    mediaPlanId: 'mp-004',
    
    mediaPartnerId: 'mp-tv3-001',
    mediaPartnerName: 'Media General Ghana',
    channelName: '3FM 92.7',
    mediaType: 'FM',
    
    header: {
      clientType: 'DIRECT_CLIENT',
      clientName: 'Guinness Ghana',
      brandName: 'Guinness Smooth',
      poNumber: 'PO-2024-0159',
      mpoNumber: 'MPO-2024-0092',
      startDate: '2024-04-01',
      endDate: '2024-04-30',
      campaignName: 'Made of More Campaign',
      campaignObjective: 'Brand Positioning',
    },
    
    segments: [
      {
        segmentId: 'seg-010',
        segmentName: 'Prime Announcements',
        segmentClass: 'A1',
        adType: 'ANNOUNCEMENTS',
        days: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'],
        timeSlot: '06:00 - 10:00',
        totalSpots: 25,
        unitRate: 5500,
        totalAmount: 137500,
        programName: 'Sunrise',
      },
      {
        segmentId: 'seg-011',
        segmentName: 'Live Presenter Mentions',
        segmentClass: 'P',
        adType: 'LIVE_PRESENTER_MENTIONS',
        days: ['MONDAY', 'WEDNESDAY', 'FRIDAY'],
        timeSlot: '07:00 - 09:00',
        totalSpots: 12,
        unitRate: 8000,
        totalAmount: 96000,
        programName: 'Morning Drive',
      },
    ],
    
    subtotal: 233500,
    tax: 0,
    totalAmount: 233500,
    
    status: 'PENDING',
    
    preparedBy: 'Akosua Darko',
    preparedByTitle: 'Media Buyer',
    
    createdAt: '2024-03-17T08:30:00Z',
    updatedAt: '2024-03-17T08:30:00Z',
    sentToPartnerAt: '2024-03-17T08:35:00Z',
  },
];

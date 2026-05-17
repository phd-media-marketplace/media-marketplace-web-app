## 1) Media Plans Endpoints
Add/confirm support:
- Create media plan
- Get media plan by ID
- List media plans (filter + pagination)
- PATCH media plan
- Submit for approval (internal if user is not admin)
- Approve/Reject
- Can be saved as draft
- marked as completed can be reuse or edited as new
- if approved, buyer can generate and ssend work orders to respective media partners based on channels

Use these app-aligned types:

```ts
export interface MediaPlan {
  id: string;
  campaignName: string;
  clientName: string;
  campaignObjective: string;
  targetAudience: string;
  expectedStartDate: string;
  expectedEndDate: string;
  totalBudget: number;
  budgetAllocated: number;
  status: "draft" | "completed" | "pending_approval" | "approved" | "rejected";
  channels: Channel[];
  createdAt: string;
  updatedAt: string;
  createBy: string;
  ApprovedBy: string;
}

// The Channel interface represents the different media channels used in a campaign, including the media type and segments for each channel. This allows for detailed tracking and management of campaign performance across various media platforms.
export interface Channel {
  mediaType: "FM" | "TV" | "OOH" | "DIGITAL";
  channelName: string;
  segments?: Segment[];
}

//(work order) The Segment interface represents specific segments within a media channel, including the segment type, time slot, days of the week, rates, and optional details such as duration and various segment-specific configurations.
export interface Segment {
  // Common fields for all segments
  rateCardId?: string; // Reference to the rate card
  adType: string; // e.g., 'ANNOUNCEMENTS', 'SPOT_ADVERTS', 'JINGLES', etc.
  segmentClass: string; // e.g., 'M1', 'M2', 'A1', 'PREMIUM', 'P', etc.
  segmentName?: string; // Auto-populated from rate card (ClassName)
  timeSlot?: string; // e.g., "06:00 - 08:00" - auto-populated from rate card
  days: DayOfWeek[]; // Days when this segment will run
  unitRate: number; // Auto-populated from rate card based on segment class
  totalSpots: number; // Number of spots/quantity
  adForm?: string; // For TV: '30_SECS', 'LIVE', 'SOCIAL', etc. - auto-populated
  duration?: string; // Optional duration info
  spotsPerDay?: {
    [key in DayOfWeek]?: number;
  }; // Optional breakdown of spots per day

  discount?: number // discount
  attachmments?:Attachment[] // the ad creatives to be used for a segement. it can be video, audio, images depending on the segment type.
  
  // OOH-specific fields
  placementType?: string;
  location?: string;
  dimensions?: string;
  
  // DIGITAL-specific fields
  platform?: string;
  adFormat?: string;
  targeting?: string;
  startDate?: string;
  endDate?: string;
  programName?: string;
}

export interface Attachment {
  name: string;
  url: string;
  type: string;
}
```

## 2) Work Orders Endpoints
Add/confirm support:
- Create work orders from approved media plan
- Get work order by ID
- List work orders
- PATCH work order status
- Approve/Reject/Revised flow
- workOrderSegment has the same fields as the segment of Media plans

Use these app-aligned types:

```ts
export type WorkOrderStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "REVISED"
  | "PAUSED";

export interface WorkOrderHeader {
  clientType: "AGENCY" | "CLIENT";
  clientName: string;
  brandName: string;
  poNumber?: string;
  mpoNumber?: string; // this is the same as Work order number
  startDate: string;
  endDate: string;
  campaignName: string;
  campaignObjective: string;
}

/**
 * Work Order Document
 * Main work order sent to a media partner
 */
export interface WorkOrder {
  id: UUID;
  workOrderNumber: string; //same as mpoNumber
  mediaPlanId: UUID;
  mediaPartnerId: UUID;
  mediaPartnerName: string;
  channelName: string;
  mediaType: "FM" | "TV" | "OOH" | "DIGITAL";
  header: WorkOrderHeader;
  segments: WorkOrderSegment[];
  subtotal: number;
  tax?: TaxDetails;
  totalAmount: number;
  status: WorkOrderStatus;
  rejectionReason?: string;
  preparedBy: string;
  preparedByTitle: string;
  approvedBy?: string;
  approvedByTitle?: string;
  approvalDate?: string;
  createdAt: string;
  updatedAt: string;
  sentToPartnerAt: string;
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
  mediaType?: "FM" | "TV" | "OOH" | "DIGITAL";
}

```

## 3) rate card 
// Post request
- add programmeName:string to time details

## 4) Package
// Post request
- make sure the totalPrice and finalPrice field are calculated at the backend


## 5) Reporting Requirements

### 5.1 Shared filter contracts (Media Partner + Agency/Client)
```ts
export type ReportQuarter = "ALL" | "Q1" | "Q2" | "Q3" | "Q4";

export interface ReportFiltersState {
  quarter: ReportQuarter;
  startDate: string;
  endDate: string;
  clients: string[];
}

export interface ReportFiltersProps {
  value: ReportFiltersState;
  clientOptions: string[];
  onQuarterChange: (quarter: ReportQuarter) => void;
  onStartDateChange: (startDate: string) => void;
  onEndDateChange: (endDate: string) => void;
  onClientsChange: (clients: string[]) => void;
  onReset: () => void;
}
```

### 5.2 Media Partner reporting response contract
```ts
export interface ReportingRecord {
  date: string;
  clientName: string;
  revenue: number;
  debt: number;
  workOrders: number;
}
```

### 5.3 Agency/Client reporting response contract
```ts
export interface AgencyClientReportingRecord {
  date: string;
  campaignName: string;
  mediaPartnerName: string;
  workOrders: number;
  reach?: number;
  impressions?: number;
  status: "DRAFT" | "PENDING" | "APPROVED" | "REJECTED" | "PAUSED" | "ACTIVE" | "COMPLETED";
}
```

Notes:
- Reporting can still return aggregated totals (like revenue/debt) where needed by dashboards.
- No payment method fields in reporting payloads.

## 6) Notification Endpoint
Keep these fields:

```ts
export type MediaPartnerNotificationPriority = "LOW" | "MEDIUM" | "HIGH";

export type MediaPartnerNotification = {
  id: string;
  title: string;
  message: string;
  type: MediaPartnerNotificationType;
  priority: MediaPartnerNotificationPriority;
  createdAt: string;
  isRead: boolean;
  workOrderId?: string;
};
```
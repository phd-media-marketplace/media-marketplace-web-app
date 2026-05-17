# New Changes 

## 1) Me Endpoint
Add clientId to the me response.

Required response fields:
- clientId: string | null
- tenantId: string
- tenantType: "AGENCY" | "CLIENT" | "MEDIA_PARTNER"

## 2) Reporting Requirements

### 2.1 Shared filter contracts (Media Partner + Agency/Client)
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

### 2.2 Media Partner reporting response contract
```ts
export interface ReportingRecord {
  date: string;
  clientName: string;
  revenue: number;
  debt: number;
  workOrders: number;
}
```

### 2.3 Agency/Client reporting response contract
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

## 3) Notification Endpoint
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

## 4) Invoices/Billing (Refactor)

### 4.1 Behavior change
- Remove payment method from request and response contracts.
- Frontend will not send payment method.
- Backend should not persist payment instrument details.

### 4.2 Record payment contract update
```ts
export interface RecordInvoicePaymentRequest {
  amount: number;
  paymentDate: string;
  reference?: string;
  notes?: string;
}
```

### 4.3 Existing shared contracts (keep aligned)
```ts
export type InvoiceRecipientType = "AGENCY" | "CLIENT";

export type InvoiceStatus =
  | "DRAFT"
  | "SENT"
  | "PENDING"
  | "PARTIALLY_PAID"
  | "PAID"
  | "OVERDUE"
  | "CANCELLED";

export interface TaxDetails {
  taxRate: number | null;
  taxAmount: number | null;
}
```

Implementation note:
- WorkOrderSegment import source is shared at src/types/work-order.ts.

## 5) Media Partner Endpoint
Use PATCH for update endpoints with partial payload semantics.

Required behavior:
- Only provided fields are changed.
- Omitted fields remain unchanged.

## 6) Tenant Users Endpoint
Need one endpoint to fetch all users by tenant context.

Query support:
- tenantId
- tenantType (AGENCY | CLIENT | MEDIA_PARTNER)
- page
- limit
- search
- roleId (optional)

## 7) Team Member Invite Flow
Invite payload should contain:
- email
- roleId or roles[]

Also expose roles endpoint for role picker in UI.

## 8) Purchase Order Number Management
Create a dedicated table for PO numbers.

Required columns:
- id
- tenantId
- poNumber
- clientId
- campaignId (optional)
- status (required)
- createdBy
- createdAt
- updatedAt

Rule:
- poNumber must be unique.

## 9) Media Plans Endpoints
Add/confirm support:
- Create media plan
- Get media plan by ID
- List media plans (filter + pagination)
- PATCH media plan
- Submit for approval (internal if user is not admin)
- Approve/Reject

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
}

// The Channel interface represents the different media channels used in a campaign, including the media type and segments for each channel. This allows for detailed tracking and management of campaign performance across various media platforms.
export interface Channel {
  mediaType: "RADIO" | "TV" | "OOH" | "DIGITAL";
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
```

## 10) Work Orders Endpoints
Add/confirm support:
- Create work orders from approved media plan
- Get work order by ID
- List work orders
- PATCH work order status
- Approve/Reject/Revised flow

Use these app-aligned types:

```ts
import type { UUID } from "@/features/media-partner-features/rate-cards/types";
import type { DayOfWeek } from "@/features/agency-features/media-planning/types";
import type { TaxDetails } from "@/types/invoice";

export type WorkOrderStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "REVISED"
  | "PAUSED";

export type MediaPlanApprovalStatus =
  | "DRAFT"
  | "PENDING_APPROVAL"
  | "APPROVED"
  | "REJECTED";

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
  spotsPerDay?: {
    [key in DayOfWeek]?: number;
  };
}

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
  mediaType: "RADIO" | "TV" | "OOH" | "DIGITAL";
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
  mediaType?: "RADIO" | "TV" | "OOH" | "DIGITAL";
}
```

Business behavior:
- Media partner can reject a work order and provide rejectionReason.
- Client/Agency can issue PAUSE on a work order.
- Stop/Pause order should take effect within 24 hours.

## 11) Package Endpoints (Refactor)
Keep these contracts and use PATCH for update endpoint.

```ts
export interface PackageItem {
  rateCardId: string;
  adType: string;
  segmentId: string;
  segmentClass?: string; // eg: "M1", "PREMIUM", etc. if applicable
  programmeName?: string; // Optional: Name of the programme or slot, if applicable
  quantity: number;
  unitRate: number;
  totalPrice: number;
}

export interface Package {
  id: string;
  mediaPartnerId: string;
  mediaPartnerName?: string;
  packageName: string;
  description?: string;
  mediaType: "RADIO" | "TV" | "OOH" | "DIGITAL";
  items: PackageItem[];
  reach: number;
  demographics: string[];
  location?: string;
  packageDurationValue: number;
  packageDurationUnit: string;
  totalPrice: number;
  discount?: number;
  finalPrice: number;
  isActive: boolean;
  validFrom?: string;
  validTo?: string;
  createdAt: string;
  updatedAt: string;
  metadata: Record<string, any>; // package media(image, video or audio can be attached)
}



export interface PackageListResponse {
  packages: Package[];
  total: number;
  page: number;
  limit: number;
}
```

## 12) File Upload Requirements (Added)
Add a shared upload flow for campaign, media plan, work order, invoice, and package attachments.

Backend behavior:
- Validate mime type and file size.
- Reject executable or unsafe file types.
- Store file metadata in DB and file in object storage.
- Return signed URL or secure file URL for preview/download.
- Keep tenant isolation (file access scoped by tenantId).

Allowed file categories (suggested):
- Documents: pdf, doc, docx, xls, xlsx, csv
- Images: png, jpg, jpeg, webp
- Audio: mp3, wav, m4a, aac
- Video: mp4, mov, webm, mkv

Suggested TypeScript contracts:

```ts
export type UploadEntityType =
  | "CAMPAIGN"
  | "MEDIA_PLAN"
  | "WORK_ORDER"
  | "INVOICE"
  | "PACKAGE";

export interface UploadFileRequest {
  entityType: UploadEntityType;
  entityId: string;
  tenantId: string;
  fileName: string;
  mimeType: string;
  size: number;
}

export interface UploadFileResponse {
  id: string;
  entityType: UploadEntityType;
  entityId: string;
  tenantId: string;
  fileName: string;
  mimeType: string;
  size: number;
  url: string;
  uploadedBy: string;
  createdAt: string;
}

export interface UploadedFile {
  id: string;
  entityType: UploadEntityType;
  entityId: string;
  tenantId: string;
  fileName: string;
  mimeType: string;
  size: number;
  storageKey: string;
  uploadedBy: string;
  createdAt: string;
}
```

Required endpoints:
- POST /uploads (or pre-signed upload init)
- GET /uploads?entityType=&entityId=
- DELETE /uploads/:id (soft delete preferred)

## 13) Required Status Fields (Refactor)
Status should be required in core entities.

Enforce required status in:
- MediaPlan.status
- WorkOrder.status
- Invoice.status
- PurchaseOrder.status
- Notification.isRead (required boolean)

Return validation errors when required status fields are missing.

## 14) Breaking Change Checklist
- Remove payment method views from frontend (Agency/Client + Media Partner).
- Remove payment method fields from billing APIs.
- Add clientId on me endpoint.
- Add/confirm agency-client reporting contracts.
- Use PATCH semantics for update endpoints.
- Add tenant-user listing endpoint by tenant.
- Add roles endpoint for invite flow.
- Add PO table and PO endpoints.
- Add file upload endpoints and contracts.


## rate card 
// Post request
- add programmeName:string to time details

## work orders
// get response
-






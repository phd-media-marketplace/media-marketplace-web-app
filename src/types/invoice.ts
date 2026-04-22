import type { WorkOrderSegment } from "@/features/agency-features/work-orders/types";

export type InvoiceRecipientType = "AGENCY" | "CLIENT";

export type InvoiceStatus =
  | "DRAFT"
  | "SENT"
  | "PENDING"
  | "PARTIALLY_PAID"
  | "PAID"
  | "OVERDUE"
  | "CANCELLED";

export type InvoiceSortBy = "invoiceNumber" | "issueDate" | "dueDate" | "totalAmount" | "createdAt";
export type InvoiceSortOrder = "asc" | "desc";

export interface InvoiceTaxDetails {
  taxRate: number | null;
  taxAmount: number | null;
}

export type InvoiceLineItem = WorkOrderSegment;

export interface InvoiceMeta {
  source?: "MANUAL" | "GENERATED";
  generatedFromWorkOrderId?: string;
  [key: string]: unknown;
}

export interface CreateInvoiceRequest {
  clientId: string;
  workOrderNumber: string;
  campaignId?: string | null;
  issueDate: string;
  dueDate: string;
  lineItems: InvoiceLineItem[];
  tax: InvoiceTaxDetails;
  discount?: number;
  currency: string;
  notes?: string | null;
  recipientType: InvoiceRecipientType;
  metadata?: InvoiceMeta;
}

export interface GenerateInvoiceRequest {
  workOrderNumber: string;
  dueDate?: string;
  notes?: string;
  taxRate?: number;
  discount?: number;
  currency?: string;
}

export interface UpdateInvoiceRequest {
  dueDate?: string;
  lineItems?: InvoiceLineItem[];
  tax?: InvoiceTaxDetails;
  discount?: number;
  notes?: string | null;
  status?: InvoiceStatus;
}

export interface RecordInvoicePaymentRequest {
  amount: number;
  paymentDate: string;
  reference?: string;
  method?: string;
  notes?: string;
}

export interface SendInvoiceRequest {
  recipients?: string[];
  message?: string;
}

export interface CancelInvoiceRequest {
  reason: string;
}

export interface Invoice {
  id: string;
  clientId: string;
  clientName: string;
  clientContactName?: string;
  clientContactPhone?: string;
  clientContactEmail?: string;
  campaignId: string | null;
  campaignName: string | null;
  issuedById: string;
  issuedByName: string;
  invoiceNumber: string;
  issuedByRole: string;
  issueDate: string;
  dueDate: string;
  subtotal: number;
  tax: InvoiceTaxDetails;
  discount: number | null;
  totalAmount: number;
  paidAmount: number;
  currency: string;
  status: InvoiceStatus;
  sentAt: string | null;
  paidAt: string | null;
  notes: string | null;
  lineItems: InvoiceLineItem[];
  metadata: InvoiceMeta;
  workOrderNumber: string;
  recipientType: InvoiceRecipientType;
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceListFilters {
  search?: string;
  clientName?: string;
  campaignId?: string;
  status?: InvoiceStatus;
  issueDateFrom?: string;
  issueDateTo?: string;
  page?: number;
  limit?: number;
  sortBy?: InvoiceSortBy;
  sortOrder?: InvoiceSortOrder;
}

export interface InvoiceListResponse {
  invoices: Invoice[];
  total: number;
  page: number;
  limit: number;
}

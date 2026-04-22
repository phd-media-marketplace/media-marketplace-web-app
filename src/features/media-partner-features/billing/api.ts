import { apiClient } from "@/services/https";
import type {
	CancelInvoiceRequest,
	CreateInvoiceRequest,
	GenerateInvoiceRequest,
	Invoice,
	InvoiceListFilters,
	InvoiceListResponse,
	RecordInvoicePaymentRequest,
	SendInvoiceRequest,
	UpdateInvoiceRequest,
} from "@/types/invoice";

const INVOICES_BASE_URL = "/invoices";

function normalizeInvoiceList(
	payload: InvoiceListResponse | Invoice[] | { data?: Invoice[] | InvoiceListResponse },
	fallback: Required<Pick<InvoiceListFilters, "page" | "limit">>,
): InvoiceListResponse {
	if (Array.isArray(payload)) {
		return {
			invoices: payload,
			total: payload.length,
			page: fallback.page,
			limit: fallback.limit,
		};
	}

	if (payload && typeof payload === "object" && "invoices" in payload && Array.isArray(payload.invoices)) {
		return {
			invoices: payload.invoices,
			total: typeof payload.total === "number" ? payload.total : payload.invoices.length,
			page: typeof payload.page === "number" ? payload.page : fallback.page,
			limit: typeof payload.limit === "number" ? payload.limit : fallback.limit,
		};
	}

	if (payload && typeof payload === "object" && "data" in payload) {
		const nested = payload.data;

		if (Array.isArray(nested)) {
			return {
				invoices: nested,
				total: nested.length,
				page: fallback.page,
				limit: fallback.limit,
			};
		}

		if (nested && typeof nested === "object" && "invoices" in nested && Array.isArray(nested.invoices)) {
			return {
				invoices: nested.invoices,
				total: typeof nested.total === "number" ? nested.total : nested.invoices.length,
				page: typeof nested.page === "number" ? nested.page : fallback.page,
				limit: typeof nested.limit === "number" ? nested.limit : fallback.limit,
			};
		}
	}

	return {
		invoices: [],
		total: 0,
		page: fallback.page,
		limit: fallback.limit,
	};
}

export async function listInvoices(filters?: InvoiceListFilters): Promise<InvoiceListResponse> {
	const response = await apiClient.get<InvoiceListResponse | Invoice[] | { data?: Invoice[] | InvoiceListResponse }>(INVOICES_BASE_URL, {
		params: filters,
	});

	return normalizeInvoiceList(response.data, {
		page: filters?.page ?? 1,
		limit: filters?.limit ?? 10,
	});
}

export async function getInvoice(id: string): Promise<Invoice> {
	const response = await apiClient.get<Invoice>(`${INVOICES_BASE_URL}/${id}`);
	return response.data;
}

export async function createInvoice(payload: CreateInvoiceRequest): Promise<Invoice> {
	const response = await apiClient.post<Invoice>(INVOICES_BASE_URL, payload);
	return response.data;
}

export async function generateInvoice(payload: GenerateInvoiceRequest): Promise<Invoice> {
	const response = await apiClient.post<Invoice>(`${INVOICES_BASE_URL}/generate`, payload);
	return response.data;
}

export async function updateInvoice(id: string, payload: UpdateInvoiceRequest): Promise<Invoice> {
	const response = await apiClient.put<Invoice>(`${INVOICES_BASE_URL}/${id}`, payload);
	return response.data;
}

export async function sendInvoice(id: string, payload?: SendInvoiceRequest): Promise<Invoice> {
	const response = await apiClient.post<Invoice>(`${INVOICES_BASE_URL}/${id}/send`, payload ?? {});
	return response.data;
}

export async function recordPayment(id: string, payload: RecordInvoicePaymentRequest): Promise<Invoice> {
	const response = await apiClient.post<Invoice>(`${INVOICES_BASE_URL}/${id}/payment`, payload);
	return response.data;
}

export async function cancelInvoice(id: string, payload: CancelInvoiceRequest): Promise<Invoice> {
	const response = await apiClient.post<Invoice>(`${INVOICES_BASE_URL}/${id}/cancel`, payload);
	return response.data;
}

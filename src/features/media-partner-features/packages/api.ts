import { apiClient } from "@/services/https";
import type { AxiosProgressEvent } from "axios";
import type { Package, CreatePackageRequest, UpdatePackageRequest, PackageListResponse } from "./types";

const BASE_URL = "/media-partner/packages";
const UPLOAD_URL = import.meta.env.VITE_PACKAGE_UPLOAD_URL || `${BASE_URL}/upload`;

/**
 * List all packages for a media partner
 */
export async function listPackages(params?: {
  mediaType?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
}): Promise<PackageListResponse> {
  const response = await apiClient.get<PackageListResponse>(BASE_URL, { params });
  return response.data;
}

/**
 * Get a single package by ID
 */
export async function getPackage(id: string): Promise<Package> {
  const response = await apiClient.get<Package>(`${BASE_URL}/${id}`);
  return response.data;
}

/**
 * Create a new package
 */
export async function createPackage(data: CreatePackageRequest): Promise<Package> {
  const response = await apiClient.post<Package>(BASE_URL, data);
  return response.data;
}

/**
 * Update an existing package
 */
export async function updatePackage(id: string, data: UpdatePackageRequest): Promise<Package> {
  const response = await apiClient.put<Package>(`${BASE_URL}/${id}`, data);
  return response.data;
}

/**
 * Delete a package
 */
export async function deletePackage(id: string): Promise<void> {
  await apiClient.delete(`${BASE_URL}/${id}`);
}

/**
 * Toggle package active status
 */
export async function togglePackageStatus(id: string, isActive: boolean): Promise<Package> {
  const response = await apiClient.patch<Package>(`${BASE_URL}/${id}/status`, { isActive });
  return response.data;
}

export interface UploadPackageImageOptions {
  signal?: AbortSignal;
  onProgress?: (progress: number) => void;
}

export interface UploadPackageImageResponse {
  url?: string;
  id?: string;
  fileName?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  raw?: any;
}

function extractFileUrl(responseData: unknown): string | undefined {
  if (!responseData || typeof responseData !== "object") {
    return undefined;
  }

  const payload = responseData as Record<string, unknown>;
  const directUrl = payload.url;
  if (typeof directUrl === "string") {
    return directUrl;
  }

  const data = payload.data;
  if (data && typeof data === "object") {
    const nested = data as Record<string, unknown>;
    if (typeof nested.url === "string") return nested.url;
    if (typeof nested.fileUrl === "string") return nested.fileUrl;
    if (typeof nested.secure_url === "string") return nested.secure_url;
  }

  if (typeof payload.fileUrl === "string") return payload.fileUrl;
  if (typeof payload.secure_url === "string") return payload.secure_url;
  return undefined;
}

export async function uploadPackageImage(
  file: File,
  options?: UploadPackageImageOptions
): Promise<UploadPackageImageResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await apiClient.post(UPLOAD_URL, formData, {
    signal: options?.signal,
    headers: {
      "Content-Type": "multipart/form-data",
    },
    onUploadProgress: (event: AxiosProgressEvent) => {
      if (!options?.onProgress) return;
      if (!event.total) {
        options.onProgress(0);
        return;
      }
      const progress = Math.round((event.loaded * 100) / event.total);
      options.onProgress(progress);
    },
  });

  const responseBody = response.data;
  const raw = responseBody as Record<string, unknown>;

  return {
    url: extractFileUrl(responseBody),
    id: typeof raw?.id === "string" ? raw.id : undefined,
    fileName: typeof raw?.fileName === "string" ? raw.fileName : file.name,
    raw,
  };
}

import { apiClient } from "@/services/https";
import { uploadFile } from "@/utils/uploadFile";
import type { Package, CreatePackageRequest, UpdatePackageRequest, PackageListResponse } from "./types";

const BASE_URL = "/packages";
const UPLOAD_URL = import.meta.env.VITE_PACKAGE_UPLOAD_URL || "/uploads";

/**
 * List all packages for a media partner
 */
export async function listPackages(params?: {
  mediaType?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
}): Promise<PackageListResponse> {
  // const response = await apiClient.get<PackageListResponse>(BASE_URL, { params });
  // return response.data;
  try {
    const response = await apiClient.get<PackageListResponse>(BASE_URL, { params });
    const responseBody = response.data as Package[] | PackageListResponse | { data?: Package[] | PackageListResponse };

    if (Array.isArray(responseBody)) {
      return {
        packages: responseBody,
        total: responseBody.length,
        page: params?.page ?? 1,
        limit: params?.limit ?? responseBody.length,
      };
    }
    if (responseBody && typeof responseBody === 'object' && 'packages' in responseBody && Array.isArray(responseBody.packages)) {
      return {
        packages: responseBody.packages,
        total: typeof responseBody.total === 'number' ? responseBody.total : responseBody.packages.length,
        page: typeof responseBody.page === 'number' ? responseBody.page : (params?.page ?? 1),
        limit: typeof responseBody.limit === 'number' ? responseBody.limit : (params?.limit ?? responseBody.packages.length),
      };
    }

    return {
      packages: [],
      total: 0,
      page: params?.page ?? 1,
      limit: params?.limit ?? 0,
    };
    
  } catch (error) {
    console.error("Error fetching packages:", error);
    throw error;
  }
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

export interface UploadAssetOptions {
  signal?: AbortSignal;
  onProgress?: (progress: number) => void;
  assetType?: string;
}

export interface UploadAssetResponse {
  url?: string;
  id?: string;
  fileName?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  raw?: any;
}

export type UploadPackageImageOptions = UploadAssetOptions;
export type UploadPackageImageResponse = UploadAssetResponse;

function extractFileUrl(responseData: unknown): string | undefined {
  if (!responseData || typeof responseData !== "object") {
    return undefined;
  }

  const payload = responseData as Record<string, unknown>;
  const directUrl = payload.url;
  if (typeof directUrl === "string") {
    return directUrl;
  }

  if (typeof payload.downloadUrl === "string") {
    return payload.downloadUrl;
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

export async function uploadAsset(
  uploadUrl: string,
  file: File,
  options?: UploadAssetOptions
): Promise<UploadAssetResponse> {
  const uploadResponse = await uploadFile(file, {
    signal: options?.signal,
    onProgress: options?.onProgress,
    uploadPath: uploadUrl,
  });

  const raw = uploadResponse.raw as Record<string, unknown>;

  return {
    url: extractFileUrl(uploadResponse.raw),
    id: typeof raw?.id === "string" ? raw.id : uploadResponse.objectName,
    fileName: typeof raw?.fileName === "string" ? raw.fileName : file.name,
    raw: uploadResponse.raw,
  };
}

export async function uploadPackageImage(
  file: File,
  options?: UploadAssetOptions
): Promise<UploadAssetResponse> {
  return uploadAsset(UPLOAD_URL, file, options);
}

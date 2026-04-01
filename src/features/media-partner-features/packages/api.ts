import { apiClient } from "@/services/https";
import type { Package, CreatePackageRequest, UpdatePackageRequest, PackageListResponse } from "./types";

const BASE_URL = "/media-partner/packages";

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

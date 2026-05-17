import type { Package, PackageItem } from "@/features/media-partner-features/packages";

// Re-export Package as MediaPackage for backwards compatibility
export type MediaPackage = Package;
export type MediaPackageItem = PackageItem

export interface MarketplaceFilters {
    mediaType?: 'FM' | 'TV'  | 'OOH' | 'DIGITAL';
    location?: string;
    demographics?: string[];
    minCost?: number;
    maxCost?: number;
    page?: number;
    limit?: number;
}
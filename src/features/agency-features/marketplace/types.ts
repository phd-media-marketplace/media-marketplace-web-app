import type { Package } from "@/features/media-partner-features/packages";

// Re-export Package as MediaPackage for backwards compatibility
export type MediaPackage = Package;

export interface PackageItem {
  rateCardId: string;
  adType: string;
  segmentId: string;
  segmentClass?: string;
  quantity: number;
  unitRate: number;
  totalPrice: number;
}

export interface MarketplaceFilters {
    mediaType?: 'FM' | 'TV' | 'OOH' | 'DIGITAL';
    location?: string;
    demographics?: string[];
    minCost?: number;
    maxCost?: number;
    page?: number;
    limit?: number;
}
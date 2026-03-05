import type { MediaType } from "@/types/api";
export interface MediaPackage {
    id: string;
    tenantId: string;
    title: string;
    mediaType: MediaType;
    channel: string;
    cost: number;
    discount?: number | null;
    reach: number;
    location?: string | null;
    demographics: string;
    spotDurationSeconds?: number;
    packageDurationValue: number;
    packageDurationUnit: "DAYS" | "WEEKS" | "MONTHS";
    segment?: string;
    numberOfSpots?: number;
    timeOfDay?: string;
    daysOfAllocation?: string[];
    notes?: string | null;
    isActive: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    metadata: Record<string, any>; // For any additional data that doesn't fit into the above fields
}

export interface MarketplaceFilters {
    mediaType?: MediaType;
    channel?: string;
    location?: string;
    demographics?: string;
    timeOfDay?: string;
    daysOfAllocation?: string[];
    minCost?: number;
    maxCost?: number;
    page?: number;
    limit?: number;
}
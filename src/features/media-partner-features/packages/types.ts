/**
 * Package Types for Media Partner
 */

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
  mediaPartnerName?: string; //
  packageName: string;
  description?: string;
  mediaType: 'FM' | 'TV' | 'OOH' | 'DIGITAL';
  items: PackageItem[];
  reach: number;
  demographics: string[];
  location?: string;
  packageDurationValue: number,
  packageDurationUnit: string,
  totalPrice: number;
  discount?: number;
  finalPrice: number;
  isActive: boolean;
  validFrom?: string;
  validTo?: string;
  createdAt: string;
  updatedAt: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
    metadata: Record<string, any>; // For any additional data that doesn't fit into the above fields
}

export interface CreatePackageRequest {
  mediaPartnerId: string;
  mediaPartnerName?: string; // this field should be included when sending the data to the backend from the user's info
  packageName: string;
  description?: string;
  mediaType: 'FM' | 'TV' | 'OOH' | 'DIGITAL';
  reach: number;
  demographics: string[];
  location?: string;
  packageDurationValue: number,
  packageDurationUnit: string,
  items: Omit<PackageItem, 'totalPrice'>[];
  discount?: number;
  isActive?: boolean;
  validFrom?: string;
  validTo?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
    metadata: Record<string, any>; // For any additional data that doesn't fit into the above fields

}

export interface UpdatePackageRequest extends Partial<CreatePackageRequest> {
  id: string;
}

export interface PackageListResponse {
  packages: Package[];
  total: number;
  page: number;
  limit: number;
}

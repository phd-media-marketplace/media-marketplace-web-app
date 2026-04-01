// Media plan types(DTOs)


export type JingleDuration = '10_SECS' | '15_SECS' | '20_SECS' | '25_SECS' | '30_SECS' | '35_SECS' | '40_SECS' | '45_SECS' | '50_SECS' | '55_SECS' | '60_SECS';

export type ProductPlacementDuration = '20_MINS' | '30_MINS' | '1_HOUR';

export type IntervalType = 'PREMIUM' | 'TIME_INTERVAL';

export type AdType = 'COMMERCIAL' | 'SOCIAL';

export type MediaTypeForVideo = 'MUSIC_VIDEOS' | 'SOUNDTRACKS' | 'MOVIE_PROMO';

// Media plan and Campaign summary types(DTOs)

// Complete media plan with all details including ID, status, timestamps
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
  status: 'draft' | 'active' | 'paused' | 'completed' | 'cancelled' | 'pending_approval' | 'approved';
  channels: Channel[];
  createdAt: string;
  updatedAt: string;
}

// Legacy media plan interface (for backward compatibility)
export interface mediaPlan {
  CampaignTitle: string;
  client: string;
  objective: string;
  targetAudience: string;
  Channels: Channel[];
  startDate: string;
  endDate: string;
  budget: number;
}

// The Channel interface represents the different media channels used in a campaign, including the media type and segments for each channel. This allows for detailed tracking and management of campaign performance across various media platforms.
export interface Channel {
  mediaType: 'FM' | 'TV' | 'OOH' | 'DIGITAL';
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
  
  // OOH-specific fields
  placementType?: string;
  location?: string;
  dimensions?: string;
  
  // DIGITAL-specific fields
  platform?: string;
  adFormat?: string;
  targeting?: string;
  
  // Optional legacy fields
  startDate?: string;
  endDate?: string;
  programName?: string; // Optional program/show name
}



//Rate card types(DTOs)

export type RadioSegmentClass = 'A1' | 'B' | 'C' | 'P2' | 'A' | 'P' | 'P1' | 'OTHERS';
export type RadioSegmentAnnouncementClass = 'COMMERCIAL/PRODUCTS' | 'POLICE_EXTRACT' | 'FUNERAL' | 'SOCIAL' | 'PROMOTIONS' | 'OTHER';
export type DayOfWeek = 'MONDAY - FRIDAY' | 'SATURDAY - SUNDAY';
export type TimeInterval = '19:00 - 00:00' | '00:00 - 05:00' | '10:00 - 12:00' | '12:00 - 14:00' | '05:00 - 10:00' | '14:00 - 19:00' | '05:00 - 20:00' | '20:00 - 00:00' | '00:00 - 05:00';
export type DurationInSec = '10_SECS' | '15_SECS' | '20_SECS' | '25_SECS' | '30_SECS' | '35_SECS' | '40_SECS' | '45_SECS' | '50_SECS' | '55_SECS' | '60_SECS';
export type DurationInMin = '10_MINS' | '15_MINS' | '30_MINS' | '45_MINS' | '60_MINS';
export type RadioAdType = 'ANNOUNCEMENTS' | 'INTERVIEWS' | 'LIVE_PRESENTER_MENTIONS' | 'JINGLES' | 'NEWS_COVERAGE';

export interface TimeDetails {
  daysOfWeek: DayOfWeek,
  timeInterval: TimeInterval[] | string[],
}

export interface RadioSegment {
  Class: RadioSegmentClass,
  ClassName?: string,
  timeDetails: TimeDetails[],
  Duration?: DurationInSec | DurationInMin;
  UnitRate: number;
  isActive: boolean;
}

export interface RadioRate {
  adType: RadioAdType;
  RadioSegment: RadioSegment[];
  // Duration?: DurationInSec | DurationInMin;
  // UnitRate: number;
  // isActive: boolean;
}

export interface RadioMetadata {
  mediaType: 'FM';
  adTypeRates: RadioRate[];
}

export type TVSegmentClass = 'PREMIUM' | 'M1' | 'M2' | 'M3' | 'M4' | 'OTHERS';
export type TVAdType = 'SPOT_ADVERTS' | 'DOCUMENTARY' | 'ANNOUNCEMENTS' | 'NEWS_COVERAGE' | 'EXECUTIVE_INTERVIEW' | 'PREACHING' | 'AIRTIME_SALE' | 'MEDIA';
export type SpotAdvertForm = "15_SECS" | "30_SECS"| "45_SECS" | "60_SECS" | "LPMS_LESS_THAN_60_WORDS" | "CRAWLERS" | "SQUEEZE_BACK" | "LOGO_DISPLAY" |"PRODUCT_PLACEMENT" | "PRE_PROMOS" | "PRODUCT_ENDORSEMENT" | "OPEN_OR_CLOSE_SLIDEs"| "POP_UPS";
export type TVTimeInterval = '4:00 - 6:00' | '6:00 - 10:00' | '16:00 - 22:00' | '10:00 - 16:00' | '12:00 - 14:00' | '05:00 - 10:00' | '14:00 - 19:00' | '05:00 - 20:00' | '20:00 - 00:00' | '00:00 - 05:00';
export type OtherAdvertForm = 'COMMERCIAL' | 'SOCIAL';

export interface TVSegment {
  Class: TVSegmentClass;
  ClassName?: string;
  timeDetails: TimeDetails[];
  adForm?: SpotAdvertForm | OtherAdvertForm;
  Duration?: DurationInSec | DurationInMin;
  UnitRate: number;
  isActive: boolean;
}

export interface TVRate {
  adType: TVAdType;
  TVSegment: TVSegment[];
}

export interface TVMetadata {
  mediaType: 'TV';
  adTypeRates: TVRate[];
}

// OOH (Out-of-Home) Types
export interface OOHMetadata {
  mediaType: 'OOH';
  name?: string;
  placement?: string;
  format?: string;
  dimensions?: string;
  duration?: number;
  unit?: string;
  baseRate?: number;
  currency?: string;
  validFrom?: string;
  validTo?: string;
  minimumSpend?: number;
  notes?: string;
  // Add OOH specific fields as needed
}

// Digital Types
export interface DIGITALMetadata {
  mediaType: 'DIGITAL';
  // Add Digital specific fields as needed
}

export type RateCardMetadata = RadioMetadata | TVMetadata | OOHMetadata | DIGITALMetadata;

export interface RateCardBase {
  mediaPartnerId: string;
  mediaType: 'FM' | 'TV' | 'OOH' | 'DIGITAL';
  isActive?: boolean;
  metadata: RateCardMetadata;
}

export interface RateCard extends RateCardBase {
  id: string;
  mediaPartnerName: string;
  createdAt: string;
  updatedAt: string;
}

export type CreateRateCardRequest = RateCardBase;

export type BulkUploadRateCard = Omit<RateCardBase, 'mediaPartnerId'>;

export interface BulkUploadRequest {
  mediaPartnerId: string;
  rateCards: BulkUploadRateCard[];
}

export interface BulkUploadResponse {
  created: number;
  errors: Array<{
    index: number;
    error: string;
  }>;
}

export interface RateCardListResponse {
  rateCards: RateCard[];
  total: number;
  page: number;
  limit: number;
}

//Packages types(DTOs)

/**
 * Package Types for Media Partner
 */

export interface PackageItem {
  rateCardId: string;
  adType: string;
  segmentId: string;
  segmentClass?: string; // eg: "M1", "PREMIUM", etc. if applicable
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
